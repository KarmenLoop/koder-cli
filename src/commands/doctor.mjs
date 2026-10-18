import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import { legacyConsole } from "../color.mjs";
import { theme } from "../theme.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kernelRoot } from "../agent.mjs";
import { KoderError } from "../errors.mjs";
import { OFFICIAL } from "../official.mjs";
import { publicRecord } from "../provider.mjs";

const bin = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "bin", "koder.mjs");

export function measureStartup({ runs = 7, args = ["version"], env = process.env } = {}) {
  const times = [];
  for (let i = 0; i < runs; i += 1) {
    const started = process.hrtime.bigint();
    spawnSync(process.execPath, [bin, ...args], { env: { ...env, NO_COLOR: "1" }, stdio: "ignore" });
    times.push(Number(process.hrtime.bigint() - started) / 1e6);
  }
  times.sort((a, b) => a - b);
  return { median: times[Math.floor(times.length / 2)], min: times[0], max: times.at(-1), runs };
}

export const flags = { api: { type: "bool" } };

export async function run(ctx) {
  const out = (line) => ctx.stdout.write(`${line}\n`);
  out(ctx.t("doctor.title"));
  out(`  ${ctx.t("doctor.node", { version: process.versions.node })}`);
  out(`  ${ctx.lang === "en" ? "Website" : "官网"}：${OFFICIAL.site}`);
  out(`  ${ctx.lang === "en" ? "Updates" : "更新"}：${OFFICIAL.updates}`);
  const root = kernelRoot(ctx.env);
  out(`  ${fs.existsSync(path.join(root, "harness", "create.mjs")) ? ctx.t("doctor.kernel", { path: root }) : ctx.t("doctor.kernelMissing")}`);
  let found;
  let modelError = false;
  try {
    found = ctx.findProvider();
    out(`  ${found ? ctx.t("doctor.model", { model: `${publicRecord(found.record).name} · ${found.record.model}`, source: found.source }) : ctx.t("doctor.noModel")}`);
  } catch (error) {
    modelError = true;
    out(`  ${error instanceof KoderError ? ctx.t(error.key, error.vars) : error.message}`);
  }
  const git = spawnSync("git", ["--version"], { encoding: "utf8" });
  out(`  ${git.status === 0 ? ctx.t("doctor.git", { version: git.stdout.trim().replace(/^git version /, "") }) : ctx.t("doctor.noGit")}`);
  const system = process.platform === "win32" ? `Windows ${os.release()}` : process.platform === "darwin" ? `macOS (Darwin ${os.release()})` : `${os.type()} ${os.release()}`;
  out(`  ${ctx.t("doctor.os", { system, arch: process.arch })}`);
  out(`  ${ctx.t("doctor.color", { depth: ctx.depth })} · ${ctx.t("doctor.theme", { theme: theme().name })}`);
  const ascii = ctx.env.KODER_ASCII ? ctx.env.KODER_ASCII !== "0" : legacyConsole({ env: ctx.env });
  out(`  ${ctx.t(ascii ? "doctor.glyphsAscii" : "doctor.glyphsBlocks")}`);
  out(`  ${ctx.t("doctor.lang", { lang: ctx.lang })}`);
  const timing = measureStartup({ env: ctx.env });
  out(`  ${ctx.t("doctor.startup", { runs: timing.runs, ms: timing.median.toFixed(1) })}`);
  const { printModelCheck, transportSummary } = await import("../model-check.mjs");
  out(`  ${transportSummary(ctx.env, ctx.lang)}`);
  out(`  ${ctx.lang === "en" ? "Proxy" : "代理"}: ${ctx.env.NODE_USE_ENV_PROXY === "1" ? "HTTP_PROXY / HTTPS_PROXY / NO_PROXY" : ctx.lang === "en" ? "native defaults (koder launcher enables configured HTTP proxies on supported Node)" : "原生默认（koder 启动器会在支持的 Node 上启用已配置 HTTP 代理）"}`);
  if (ctx.opts.api) {
    if (!found || modelError) return 2;
    return printModelCheck(ctx, found.record);
  }
  out(ctx.lang === "en" ? "  Configuration only; run koder model test for a live API check." : "  这里只检查配置；运行 koder model test 可实际检测 API 连接。");
  return 0;
}
