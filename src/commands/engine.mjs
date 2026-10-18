import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createAcpClient } from "../acp-client.mjs";
import { saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { HERMES_ENGINE } from "../session.mjs";

export const flags = {
  command: { type: "string" },
  args: { type: "string" },
  commit: { type: "string" },
};

// The Hermes revision this integration was checked against.
export const HERMES_COMMIT = "517b5e10febd619ce30bb22580e29b160266eb43";
const HERMES_INSTALLER = "https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh";

export function which(command, env) {
  if (command.includes("/")) return fs.existsSync(command) ? command : null;
  for (const dir of String(env.PATH || "").split(path.delimiter)) {
    const full = path.join(dir, command);
    if (dir && fs.existsSync(full)) return full;
  }
  return null;
}

function engines(ctx) {
  return { ...(ctx.config.engines || {}) };
}

export async function handshake(ctx, engine, { timeoutMs = 20_000 } = {}) {
  const client = createAcpClient({ command: engine.command, args: engine.args, env: ctx.env, cwd: os.tmpdir(), version: ctx.version });
  const timer = setTimeout(() => client.close(), timeoutMs);
  try {
    const result = await client.initialize();
    return result;
  } finally {
    clearTimeout(timer);
    await client.close();
  }
}

export async function run(ctx) {
  const [action = "list", name = "hermes"] = ctx.positionals;
  const out = (line) => ctx.stdout.write(`${line}\n`);
  const current = ctx.config.engine || "koder";
  if (action === "list") {
    out(`${current === "koder" ? "*" : " "} koder     ${ctx.t("engine.builtin")}`);
    const list = { hermes: { ...HERMES_ENGINE, ...(ctx.config.engines?.hermes || {}) }, ...Object.fromEntries(Object.entries(ctx.config.engines || {}).filter(([key]) => key !== "hermes")) };
    for (const [key, value] of Object.entries(list)) {
      const found = which(value.command, ctx.env);
      out(`${current === key ? "*" : " "} ${key.padEnd(9)}${[value.command, ...(value.args || [])].join(" ")}  ${found ? ctx.t("engine.found") : ctx.t("engine.missing")}`);
    }
    return 0;
  }
  if (action === "use") {
    if (name !== "koder" && name !== "hermes" && !ctx.config.engines?.[name]) throw new KoderError("engine.unknown", { name });
    saveConfig({ engine: name }, ctx.env);
    out(ctx.t("engine.active", { name }));
    return 0;
  }
  if (action === "add") {
    if (!ctx.opts.command) throw new KoderError("err.flagValue", { flag: "--command" });
    const next = engines(ctx);
    next[name] = { command: ctx.opts.command, args: ctx.opts.args ? ctx.opts.args.split(/\s+/).filter(Boolean) : ["acp"] };
    saveConfig({ engines: next }, ctx.env);
    out(ctx.t("engine.added", { name, command: [next[name].command, ...next[name].args].join(" ") }));
    return 0;
  }
  if (action === "test") {
    const engine = name === "hermes" ? { ...HERMES_ENGINE, ...(ctx.config.engines?.hermes || {}) } : ctx.config.engines?.[name];
    if (!engine) throw new KoderError("engine.unknown", { name });
    try {
      const result = await handshake(ctx, engine);
      out(ctx.t("engine.ok", { name, info: `${result?.agentInfo?.name || "?"} ${result?.agentInfo?.version || ""} · ACP v${result?.protocolVersion}` }));
      return 0;
    } catch (error) {
      throw new KoderError("engine.failed", { name, message: error.message }, 1);
    }
  }
  if (action === "install") {
    if (name !== "hermes") throw new KoderError("engine.unknown", { name });
    let command = which("hermes", ctx.env);
    if (!command && (ctx.io.platform || process.platform) === "win32") throw new KoderError("engine.windows", {}, 1);
    if (!command) {
      out(ctx.t("engine.installing", { commit: ctx.opts.commit || HERMES_COMMIT }));
      const installer = ctx.env.KODER_HERMES_INSTALLER || HERMES_INSTALLER;
      const script = `curl -fsSL ${JSON.stringify(installer)} | bash -s -- --non-interactive --commit ${JSON.stringify(ctx.opts.commit || HERMES_COMMIT)}`;
      const code = await new Promise((resolve) => spawn("bash", ["-c", script], { stdio: "inherit", env: ctx.env }).on("close", resolve));
      if (code !== 0) throw new KoderError("engine.installFailed", { code }, 1);
      command = which("hermes", { PATH: `${path.join(ctx.env.HOME || os.homedir(), ".local", "bin")}${path.delimiter}${ctx.env.PATH || ""}` });
      if (!command) throw new KoderError("engine.installFailed", { code: "hermes not found" }, 1);
    }
    saveConfig({ engines: { ...engines(ctx), hermes: { command, args: ["acp"] } } }, ctx.env);
    out(ctx.t("engine.installed", { command }));
    return 0;
  }
  if (action === "setup") {
    const engine = name === "hermes" ? { ...HERMES_ENGINE, ...(ctx.config.engines?.hermes || {}) } : ctx.config.engines?.[name];
    if (!engine) throw new KoderError("engine.unknown", { name });
    const result = spawnSync(engine.command, ["setup"], { stdio: "inherit", env: ctx.env });
    return result.status ?? 1;
  }
  throw new KoderError("err.unknownCommand", { name: `engine ${action}` });
}
