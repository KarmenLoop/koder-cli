import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { cliHome } from "../config.mjs";
import { KoderError } from "../errors.mjs";

export const flags = { purge: { type: "bool" } };

export const DEFAULT_BASE = "https://karmenloop.com/install";

// The shell installer uses ~/.koder-cli; the PowerShell one uses %LOCALAPPDATA%\koder-cli.
export function installHomes(env = process.env, platform = process.platform) {
  const homes = [];
  if (env.KODER_INSTALL_HOME) homes.push(path.resolve(env.KODER_INSTALL_HOME));
  homes.push(cliHome(env));
  if (platform === "win32" && env.LOCALAPPDATA) homes.push(path.join(env.LOCALAPPDATA, "koder-cli"));
  return [...new Set(homes)];
}

export function installInfo(env = process.env, platform = process.platform) {
  for (const home of installHomes(env, platform)) {
    try {
      const text = fs.readFileSync(path.join(home, "install.json"), "utf8").replace(/^\uFEFF/, "");
      return { ...JSON.parse(text), home };
    } catch {}
  }
  return null;
}

// Windows refuses to delete the node.exe that is running this very command, so
// the cleanup runs in a detached cmd.exe once Koder has exited.
export function windowsCleanup(info, { purge = false } = {}) {
  const quote = (value) => `"${value}"`;
  const targets = purge ? [info.home] : [path.join(info.home, "versions"), path.join(info.home, "runtime"), path.join(info.home, "install.json")];
  const steps = ["ping -n 3 127.0.0.1 >nul"];
  for (const target of targets) steps.push(target.endsWith(".json") ? `del /f /q ${quote(target)}` : `rmdir /s /q ${quote(target)}`);
  if (info.launcher) steps.push(`del /f /q ${quote(info.launcher)}`);
  if (info.bin) {
    const bin = info.bin.replace(/'/g, "''");
    steps.push(`powershell -NoProfile -Command "$p=[Environment]::GetEnvironmentVariable('Path','User'); [Environment]::SetEnvironmentVariable('Path', (($p -split ';') | Where-Object { $_ -and $_ -ne '${bin}' }) -join ';', 'User')"`);
  }
  return steps.join(" & ");
}

export async function run(ctx) {
  const platform = ctx.io.platform || process.platform;
  const info = installInfo(ctx.env, platform);
  if (ctx.command === "update") {
    const base = (ctx.env.KODER_INSTALL_BASE || info?.base || DEFAULT_BASE).replace(/\/+$/, "");
    const windows = platform === "win32";
    const script = `${base}/${windows ? "koder-cli.ps1" : "koder-cli.sh"}`;
    ctx.stdout.write(`${ctx.t("update.running", { url: script })}\n`);
    const child = windows
      ? spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", `irm '${script.replace(/'/g, "''")}' | iex`], { stdio: "inherit", env: { ...ctx.env, KODER_NO_ONBOARD: "1" } })
      : spawn("bash", ["-c", `curl -fsSL ${JSON.stringify(script)} | bash -s -- --no-onboard`], { stdio: "inherit", env: ctx.env });
    const code = await new Promise((resolve) => child.on("close", resolve).on("error", () => resolve(1)));
    return code ?? 1;
  }
  if (!info) throw new KoderError("update.notInstalled", {}, 1);
  if (platform === "win32") {
    spawn("cmd.exe", ["/d", "/c", windowsCleanup(info, { purge: ctx.opts.purge })], { detached: true, stdio: "ignore", windowsHide: true }).unref();
    ctx.stdout.write(`${ctx.t(ctx.opts.purge ? "update.purged" : "update.removed", { home: info.home })}\n`);
    return 0;
  }
  for (const target of [path.join(info.home, "versions"), path.join(info.home, "current"), path.join(info.home, "runtime"), info.launcher].filter(Boolean)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  if (ctx.opts.purge) fs.rmSync(info.home, { recursive: true, force: true });
  else fs.rmSync(path.join(info.home, "install.json"), { force: true });
  ctx.stdout.write(`${ctx.t(ctx.opts.purge ? "update.purged" : "update.removed", { home: info.home })}\n`);
  return 0;
}
