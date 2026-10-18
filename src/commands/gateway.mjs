import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { askLine } from "../ask.mjs";
import { KoderError } from "../errors.mjs";
import { createGateway } from "../gateway/core.mjs";
import { renderQr, encodeQr } from "../gateway/qr.mjs";
import { PLATFORMS, loadPlatform, platformId } from "../gateway/registry.mjs";
import {
  DM_POLICIES, GROUP_POLICIES, approvePairing, clearState, gatewayDir, loadGateway, loadPairing, loadState,
  pidAlive, platformData, revoke, saveGateway, saveState,
} from "../gateway/store.mjs";
import { readHidden } from "./model.mjs";

export const flags = {
  set: { type: "string", multiple: true },
  "no-verify": { type: "bool" },
  platform: { type: "string" },
  background: { type: "bool" },
  dm: { type: "string" },
  group: { type: "string" },
  allow: { type: "string" },
  "group-allow": { type: "string" },
};

const bin = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "bin", "koder.mjs");

function needPlatform(name) {
  const id = platformId(name);
  if (!id) throw new KoderError("gw.unknownPlatform", { name: name || "", list: PLATFORMS.join(", ") });
  return id;
}

function parseSets(list = []) {
  const out = {};
  for (const item of list) {
    const index = item.indexOf("=");
    if (index <= 0) throw new KoderError("err.flagValue", { flag: `--set ${item}` });
    out[item.slice(0, index)] = item.slice(index + 1);
  }
  return out;
}

async function promptFields(ctx, meta, current) {
  const rl = readline.createInterface({ input: ctx.stdin, output: ctx.stdout, terminal: true });
  const values = {};
  try {
    for (const field of meta.fields) {
      const label = field.label[ctx.lang] || field.label.zh;
      if (field.secret) {
        rl.pause();
        const value = (await readHidden(ctx, `${label}${current[field.key] ? ctx.t("gw.keep") : ""}: `)).trim();
        rl.resume();
        if (value) values[field.key] = value;
      } else {
        const value = (await askLine(rl, `${label}${current[field.key] ? ` [${current[field.key]}]` : ""}: `))?.trim();
        if (value) values[field.key] = value;
      }
    }
  } finally {
    rl.close();
  }
  return values;
}

async function setup(ctx, id) {
  const module = await loadPlatform(id);
  const { meta } = module;
  const config = loadGateway(ctx.env);
  const current = config.platforms[id] || {};
  const out = (line = "") => ctx.stdout.write(`${line}\n`);
  out(ctx.t("gw.setupTitle", { name: meta.name[ctx.lang] }));
  out(meta.steps[ctx.lang]);
  if (meta.console) out(ctx.t("gw.console", { url: meta.console }));
  let creds = { ...current, ...parseSets(ctx.opts.set) };
  if (meta.qr) {
    const login = ctx.io.weixinLogin || module.qrLogin;
    const result = await login({
      fetchImpl: ctx.io.fetchImpl,
      onQr(content) {
        out(ctx.t("gw.scan"));
        for (const line of renderQr(encodeQr(content), { color: ctx.depth !== "none" })) out(line);
        out(content);
      },
      onStatus(state) {
        if (state === "scaned") out(ctx.t("gw.scanned"));
      },
    });
    creds = { ...creds, ...result };
  } else if (ctx.stdin.isTTY && !ctx.opts.set?.length) {
    creds = { ...creds, ...(await promptFields(ctx, meta, current)) };
  }
  const missing = meta.fields.filter((field) => !field.optional && !creds[field.key]).map((field) => field.key);
  if (missing.length) throw new KoderError("gw.missingFields", { fields: missing.join(", ") });
  if (!ctx.opts.noVerify) {
    out(ctx.t("gw.verifying"));
    const result = await (ctx.io.verifyPlatform || module.verify)(creds, { fetchImpl: ctx.io.fetchImpl || globalThis.fetch, WebSocketImpl: ctx.io.WebSocketImpl });
    out(ctx.t("gw.verified", { detail: result?.detail || "" }));
  }
  config.platforms[id] = { ...creds, enabled: true };
  saveGateway(config, ctx.env);
  out(ctx.t("gw.saved", { name: meta.name[ctx.lang], file: path.join(gatewayDir(ctx.env), "config.json") }));
  out(ctx.t("gw.next"));
  return 0;
}

export async function startGateway(ctx, { only = [], log = (line) => ctx.stderr.write(`${new Date().toISOString()} ${line}\n`) } = {}) {
  const config = loadGateway(ctx.env);
  const ids = Object.entries(config.platforms).filter(([id, entry]) => entry.enabled !== false && PLATFORMS.includes(id) && (!only.length || only.includes(id))).map(([id]) => id);
  if (!ids.length) throw new KoderError("gw.nothing");
  const adapters = [];
  for (const id of ids) {
    const { create } = await loadPlatform(id);
    adapters.push(create(config.platforms[id], { fetchImpl: ctx.io.fetchImpl || globalThis.fetch, WebSocketImpl: ctx.io.WebSocketImpl, dataDir: platformData(id, ctx.env), version: ctx.version }));
  }
  const started = new Date().toISOString();
  const write = (status) => saveState({ pid: process.pid, startedAt: started, workspace: config.workspace, platforms: status }, ctx.env);
  const gateway = createGateway(ctx, { config, log, onState: write });
  await gateway.start(adapters);
  write(gateway.status);
  return { gateway, adapters, ids, config };
}

async function start(ctx) {
  const only = (ctx.opts.platform || "").split(",").map((item) => item.trim()).filter(Boolean).map(needPlatform);
  const state = loadState(ctx.env);
  if (state && pidAlive(state.pid) && state.pid !== process.pid) throw new KoderError("gw.running", { pid: state.pid }, 1);
  if (ctx.opts.background) {
    fs.mkdirSync(gatewayDir(ctx.env), { recursive: true, mode: 0o700 });
    const logFile = path.join(gatewayDir(ctx.env), "gateway.log");
    const fd = fs.openSync(logFile, "a");
    const child = spawn(process.execPath, [bin, "gateway", "start", ...(only.length ? ["--platform", only.join(",")] : [])], { env: ctx.env, detached: true, windowsHide: true, stdio: ["ignore", fd, fd] });
    child.unref();
    ctx.stdout.write(`${ctx.t("gw.background", { pid: child.pid, log: logFile })}\n`);
    return 0;
  }
  const { gateway, ids, config } = await startGateway(ctx, { only });
  ctx.stdout.write(`${ctx.t("gw.started", { list: ids.join(", "), workspace: config.workspace })}\n`);
  await new Promise((resolve) => {
    const stop = () => resolve();
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    ctx.io.gatewayStop?.then(stop);
  });
  await gateway.stop();
  clearState(ctx.env);
  ctx.stdout.write(`${ctx.t("gw.stoppedAll")}\n`);
  return 0;
}

function status(ctx) {
  const config = loadGateway(ctx.env);
  const state = loadState(ctx.env);
  const running = state && pidAlive(state.pid);
  const pairing = loadPairing(ctx.env);
  if (ctx.opts.json) {
    ctx.stdout.write(`${JSON.stringify({ running: Boolean(running), pid: running ? state.pid : null, workspace: config.workspace, platforms: Object.fromEntries(PLATFORMS.map((id) => [id, { configured: Boolean(config.platforms[id]), enabled: config.platforms[id]?.enabled !== false && Boolean(config.platforms[id]), state: running ? state.platforms?.[id]?.state || null : null }])), pendingPairs: pairing.pending.length }, null, 2)}\n`);
    return 0;
  }
  const out = (line) => ctx.stdout.write(`${line}\n`);
  out(running ? ctx.t("gw.statusRunning", { pid: state.pid, since: state.startedAt }) : ctx.t("gw.statusStopped"));
  out(ctx.t("gw.workspace", { path: config.workspace, mode: config.interaction }));
  for (const id of PLATFORMS) {
    const entry = config.platforms[id];
    const live = running ? state.platforms?.[id] : null;
    const label = !entry ? ctx.t("gw.notConfigured") : entry.enabled === false ? ctx.t("gw.disabled") : live ? `${live.state}${live.detail ? ` · ${live.detail}` : ""}` : ctx.t("gw.configured");
    out(`  ${id.padEnd(10)}${label}`);
  }
  if (pairing.pending.length) out(ctx.t("gw.pendingPairs", { codes: pairing.pending.map((item) => `${item.code}(${item.platform} ${item.userName || item.userId})`).join(", ") }));
  return 0;
}

export async function run(ctx) {
  const [action = "status", target, extra] = ctx.positionals;
  const out = (line) => ctx.stdout.write(`${line}\n`);
  if (action === "status") return status(ctx);
  if (action === "list") {
    for (const id of PLATFORMS) {
      const { meta } = await loadPlatform(id);
      out(`${id.padEnd(10)}${meta.name[ctx.lang]}`);
    }
    return 0;
  }
  if (action === "setup" || action === "add") return setup(ctx, needPlatform(target));
  if (action === "start") return start(ctx);
  if (action === "stop") {
    const state = loadState(ctx.env);
    if (!state || !pidAlive(state.pid)) {
      clearState(ctx.env);
      out(ctx.t("gw.statusStopped"));
      return 0;
    }
    process.kill(state.pid, "SIGTERM");
    out(ctx.t("gw.stopSent", { pid: state.pid }));
    return 0;
  }
  if (action === "pair") {
    const entry = approvePairing(target, ctx.env);
    if (!entry) throw new KoderError("gw.badCode", { code: target || "" }, 1);
    out(ctx.t("gw.paired", { platform: entry.platform, user: entry.userName || entry.userId }));
    return 0;
  }
  if (action === "revoke") {
    revoke(needPlatform(target), extra, ctx.env);
    out(ctx.t("gw.revoked", { user: extra || "" }));
    return 0;
  }
  if (action === "policy") {
    const id = needPlatform(target);
    const config = loadGateway(ctx.env);
    const entry = config.platforms[id];
    if (!entry) throw new KoderError("gw.notSetUp", { name: id });
    if (ctx.opts.dm) {
      if (!DM_POLICIES.includes(ctx.opts.dm)) throw new KoderError("err.flagValue", { flag: "--dm" });
      entry.dmPolicy = ctx.opts.dm;
    }
    if (ctx.opts.group) {
      if (!GROUP_POLICIES.includes(ctx.opts.group)) throw new KoderError("err.flagValue", { flag: "--group" });
      entry.groupPolicy = ctx.opts.group;
    }
    if (ctx.opts.allow !== undefined) entry.allowFrom = ctx.opts.allow.split(",").map((item) => item.trim()).filter(Boolean);
    if (ctx.opts.groupAllow !== undefined) entry.groupAllowFrom = ctx.opts.groupAllow.split(",").map((item) => item.trim()).filter(Boolean);
    saveGateway(config, ctx.env);
    out(ctx.t("gw.policySaved", { name: id, dm: entry.dmPolicy || "pairing", group: entry.groupPolicy || "disabled" }));
    return 0;
  }
  if (action === "enable" || action === "disable" || action === "remove") {
    const id = needPlatform(target);
    const config = loadGateway(ctx.env);
    if (!config.platforms[id]) throw new KoderError("gw.notSetUp", { name: id });
    if (action === "remove") delete config.platforms[id];
    else config.platforms[id].enabled = action === "enable";
    saveGateway(config, ctx.env);
    out(ctx.t(`gw.${action}Done`, { name: id }));
    return 0;
  }
  if (action === "workspace" || action === "mode" || action === "moa") {
    const config = loadGateway(ctx.env);
    if (action === "workspace") config.workspace = path.resolve(ctx.cwd, target || ".");
    if (action === "mode") {
      if (!["agent", "ask"].includes(target)) throw new KoderError("err.flagValue", { flag: "mode" });
      config.interaction = target;
    }
    if (action === "moa") config.moa = target !== "off";
    saveGateway(config, ctx.env);
    out(ctx.t("gw.workspace", { path: config.workspace, mode: config.interaction }) + (config.moa ? " · MoA" : ""));
    return 0;
  }
  throw new KoderError("err.unknownCommand", { name: `gateway ${action}` });
}
