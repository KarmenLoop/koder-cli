import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { askLine } from "../ask.mjs";
import { KoderError } from "../errors.mjs";
import { createGateway } from "../gateway/core.mjs";
import { sleep } from "../gateway/http.mjs";
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
  manual: { type: "bool" },
  qr: { type: "bool" },
  "no-start": { type: "bool" },
  foreground: { type: "bool" },
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

async function setup(ctx, id, { reuse = false } = {}) {
  const module = await loadPlatform(id);
  const { meta } = module;
  const config = loadGateway(ctx.env);
  const current = config.platforms[id] || {};
  const out = (line = "") => ctx.stdout.write(`${line}\n`);
  out(ctx.t("gw.setupTitle", { name: meta.name[ctx.lang] }));
  out(meta.steps[ctx.lang]);
  if (meta.console) out(ctx.t("gw.console", { url: meta.console }));
  let creds = { ...current, ...parseSets(ctx.opts.set) };
  const hasCredentials = id === "weixin" ? creds.token && creds.accountId : meta.fields.filter((field) => !field.optional).every((field) => creds[field.key]);
  const useQr = meta.qr && !ctx.opts.manual && (ctx.opts.qr || (!hasCredentials && !ctx.opts.set?.length));
  if (useQr) {
    const login = ctx.io[`${id}Login`] || module.qrLogin;
    const controller = new AbortController();
    const cancel = () => controller.abort(new Error(ctx.t("gw.loginCancelled")));
    if (ctx.stdin.isTTY) process.once("SIGINT", cancel);
    let result;
    try { result = await login({
      fetchImpl: ctx.io.fetchImpl,
      domain: creds.domain,
      signal: controller.signal,
      onQr(content) {
        out(ctx.t("gw.scanApp", { name: meta.name[ctx.lang] }));
        try { for (const line of renderQr(encodeQr(content), { color: ctx.depth !== "none" })) out(line); }
        catch { out(ctx.t("gw.qrUrl")); }
        out(content);
      },
      onStatus(state) {
        if (state === "scaned") out(ctx.t("gw.scanned"));
      },
    }); } finally { process.removeListener("SIGINT", cancel); }
    controller.signal.throwIfAborted();
    creds = { ...creds, ...result };
    if (result?.userId) {
      creds.dmPolicy ||= "pairing";
      creds.allowFrom = [...new Set([...(creds.allowFrom || []), String(result.userId)])];
    }
  } else if (ctx.stdin.isTTY && !ctx.opts.set?.length && !(reuse && hasCredentials)) {
    creds = { ...creds, ...(await promptFields(ctx, meta, current)) };
  }
  const missing = id === "weixin" ? ["token", "accountId"].filter((key) => !creds[key]) : meta.fields.filter((field) => !field.optional && !creds[field.key]).map((field) => field.key);
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

const revision = (config) => crypto.createHash("sha256").update(JSON.stringify(config)).digest("hex");

export async function startGateway(ctx, { only = [], signal, log = (line) => ctx.stderr.write(`${new Date().toISOString()} ${line}\n`) } = {}) {
  const config = loadGateway(ctx.env);
  const ids = Object.entries(config.platforms).filter(([id, entry]) => entry.enabled !== false && PLATFORMS.includes(id) && (!only.length || only.includes(id))).map(([id]) => id);
  if (!ids.length) throw new KoderError("gw.nothing");
  const adapters = [];
  const createAdapter = async (id, entry) => {
    const { create } = await loadPlatform(id);
    return create(entry, { fetchImpl: ctx.io.fetchImpl || globalThis.fetch, WebSocketImpl: ctx.io.WebSocketImpl, dataDir: platformData(id, ctx.env), version: ctx.version });
  };
  for (const id of ids) adapters.push(await createAdapter(id, config.platforms[id]));
  const started = new Date().toISOString();
  let appliedConfig = structuredClone(config);
  let appliedRevision = revision(appliedConfig);
  const write = (status) => saveState({ pid: process.pid, startedAt: started, workspace: config.workspace, selectedPlatforms: only, configRevision: appliedRevision, platforms: status }, ctx.env);
  const gateway = createGateway(ctx, { config, log, onState: write });
  let refreshing = false;
  let closing = false;
  async function refresh() {
    if (refreshing || closing) return;
    refreshing = true;
    try {
      const next = loadGateway(ctx.env);
      if (revision(next) === appliedRevision) return;
      const changed = new Set([...Object.keys(appliedConfig.platforms), ...Object.keys(next.platforms)].filter((id) => JSON.stringify(appliedConfig.platforms[id]) !== JSON.stringify(next.platforms[id])));
      if (["workspace", "interaction", "moa"].some((key) => appliedConfig[key] !== next[key])) for (const id of Object.keys(next.platforms)) changed.add(id);
      Object.assign(config, next);
      await gateway.remove([...changed]);
      const list = [];
      for (const id of changed) {
        const entry = next.platforms[id];
        if (!closing && entry && entry.enabled !== false && PLATFORMS.includes(id) && (!only.length || only.includes(id))) list.push(await createAdapter(id, entry));
      }
      if (!closing) await gateway.start(list);
      if (closing) return;
      appliedConfig = structuredClone(next);
      appliedRevision = revision(appliedConfig);
      write(gateway.status);
    } finally { refreshing = false; }
  }
  const stop = gateway.stop.bind(gateway);
  const abort = () => { gateway.stop().catch((error) => log(`stop: ${error.message}`)); };
  let stopping;
  gateway.stop = async () => {
    if (stopping) return stopping;
    closing = true;
    signal?.removeEventListener("abort", abort);
    const halted = stop(); // Invalidates all intake synchronously.
    stopping = (async () => { await halted; while (refreshing) await sleep(10); })();
    return stopping;
  };
  signal?.addEventListener("abort", abort, { once: true });
  try {
    signal?.throwIfAborted();
    await gateway.start(adapters);
    signal?.throwIfAborted();
    write(gateway.status);
  } catch (error) { await gateway.stop(); throw error; }
  return { gateway, adapters, ids, config, refresh };
}

async function waitReady(ctx, pid, ids, expectedRevision, signal) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    signal?.throwIfAborted();
    const state = loadState(ctx.env);
    if (state?.pid === pid && state.configRevision === expectedRevision) {
      const entries = ids.map((id) => state.platforms?.[id]);
      const failed = entries.find((entry) => ["error", "expired"].includes(entry?.state));
      if (failed) throw new Error(failed.detail || failed.state);
      if (entries.every((entry) => entry?.state === "connected")) return;
    }
    if (!pidAlive(pid)) throw new Error(ctx.t("gw.childExited"));
    await sleep(50, signal);
  }
  throw new Error(ctx.t("gw.connectTimeout"));
}

async function terminateOwnedChild(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise((resolve) => child.once("close", resolve));
  const wait = async () => {
    let timer;
    try { await Promise.race([closed, new Promise((resolve) => { timer = setTimeout(resolve, 1500); })]); }
    finally { clearTimeout(timer); }
  };
  child.kill("SIGTERM");
  await wait();
  if (child.exitCode === null && child.signalCode === null) { child.kill("SIGKILL"); await wait(); }
}

async function start(ctx, { readyOnly = [] } = {}) {
  const only = (ctx.opts.platform || "").split(",").map((item) => item.trim()).filter(Boolean).map(needPlatform);
  const state = loadState(ctx.env);
  if (state && pidAlive(state.pid) && state.pid !== process.pid) throw new KoderError("gw.running", { pid: state.pid }, 1);
  if (ctx.opts.background) {
    const controller = new AbortController();
    const cancel = () => controller.abort(new Error(ctx.t("gw.loginCancelled")));
    process.once("SIGINT", cancel);
    process.once("SIGTERM", cancel);
    fs.mkdirSync(gatewayDir(ctx.env), { recursive: true, mode: 0o700 });
    const logFile = path.join(gatewayDir(ctx.env), "gateway.log");
    const fd = fs.openSync(logFile, "a", 0o600);
    let child, spawnError;
    try { child = spawn(process.execPath, [bin, "gateway", "start", "--lang", ctx.lang, ...(only.length ? ["--platform", only.join(",")] : [])], { env: ctx.env, detached: true, windowsHide: true, stdio: ["ignore", fd, fd] }); }
    finally { fs.closeSync(fd); }
    child.on("error", (error) => { spawnError = error; });
    try {
      const config = loadGateway(ctx.env);
      const ids = Object.keys(config.platforms).filter((id) => PLATFORMS.includes(id) && config.platforms[id].enabled !== false && (!only.length || only.includes(id)));
      if (!ids.length) throw new Error(ctx.t("gw.nothing"));
      if (!child.pid || spawnError) throw spawnError || new Error(ctx.t("gw.childExited"));
      await waitReady(ctx, child.pid, readyOnly.length ? readyOnly : ids, revision(config), controller.signal);
      child.unref();
      ctx.stdout.write(`${ctx.t("gw.background", { pid: child.pid, log: logFile })}\n`);
    } catch (error) {
      await terminateOwnedChild(child);
      if (loadState(ctx.env)?.pid === child.pid) clearState(ctx.env);
      throw new KoderError("gw.startFailed", { detail: error.message, log: logFile }, 1);
    } finally {
      process.removeListener("SIGINT", cancel);
      process.removeListener("SIGTERM", cancel);
    }
    return 0;
  }
  let resolveStop, runtime, reload;
  const controller = new AbortController();
  const stopped = new Promise((resolve) => { resolveStop = resolve; });
  const stop = () => { controller.abort(new Error(ctx.t("gw.loginCancelled"))); resolveStop(); };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  ctx.io.gatewayStop?.then(stop);
  try {
    runtime = await startGateway(ctx, { only, signal: controller.signal });
    reload = setInterval(() => runtime.refresh().catch((error) => ctx.stderr.write(`gateway reload: ${error.message}\n`)), 500);
    ctx.stdout.write(`${ctx.t("gw.started", { list: runtime.ids.join(", "), workspace: runtime.config.workspace })}\n`);
    await stopped;
  } finally {
    clearInterval(reload);
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    await runtime?.gateway.stop();
    if (loadState(ctx.env)?.pid === process.pid) clearState(ctx.env);
  }
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
  const args = ctx.command === "connect" ? ["connect", ...ctx.positionals] : ctx.positionals;
  let [action = "status", target, extra] = args;
  if (["setup", "add", "connect"].includes(action) && !target) {
    if (!ctx.stdin.isTTY) throw new KoderError("gw.choosePlatform", { list: PLATFORMS.join(", ") });
    const rl = readline.createInterface({ input: ctx.stdin, output: ctx.stdout, terminal: true });
    try {
      for (let i = 0; i < PLATFORMS.length; i++) { const { meta } = await loadPlatform(PLATFORMS[i]); ctx.stdout.write(`${i + 1}. ${meta.name[ctx.lang]}\n`); }
      const value = (await askLine(rl, ctx.t("gw.selectPlatform")))?.trim();
      if (!value) return 0;
      target = PLATFORMS[Number(value) - 1] || value;
    } finally { rl.close(); }
  }
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
  if (action === "doctor" || action === "check") {
    const id = needPlatform(target), entry = loadGateway(ctx.env).platforms[id];
    if (!entry) throw new KoderError("gw.notSetUp", { name: id });
    const module = await loadPlatform(id);
    const result = await (ctx.io.verifyPlatform || module.verify)(entry, { fetchImpl: ctx.io.fetchImpl || globalThis.fetch, WebSocketImpl: ctx.io.WebSocketImpl });
    out(ctx.t("gw.verified", { detail: result?.detail || id }));
    return 0;
  }
  if (action === "connect") {
    const id = needPlatform(target);
    await setup(ctx, id, { reuse: true });
    if (ctx.opts.noStart) return 0;
    const state = loadState(ctx.env);
    if (state && pidAlive(state.pid)) {
      if (state.selectedPlatforms?.length && !state.selectedPlatforms.includes(id)) throw new KoderError("gw.running", { pid: state.pid }, 1);
      await waitReady(ctx, state.pid, [id], revision(loadGateway(ctx.env)));
      out(ctx.t("gw.appConnected", { name: id }));
      return 0;
    }
    ctx.opts.background = !ctx.opts.foreground;
    return start(ctx, { readyOnly: [id] });
  }
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
