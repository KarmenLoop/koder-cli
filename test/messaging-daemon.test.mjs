import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createContext } from "../src/cli.mjs";
import { startGateway } from "../src/commands/gateway.mjs";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadState, saveGateway } from "../src/gateway/store.mjs";
import { BIN, cli, tmp, scripted, textStep } from "./helpers.mjs";
import { httpMock, until, wsServer } from "./ws-server.mjs";

async function stop(home) {
  const state = loadState({ KODER_CLI_HOME: home });
  if (!state) return;
  try { process.kill(state.pid, "SIGTERM"); } catch {}
  await until(() => !loadState({ KODER_CLI_HOME: home }), { timeoutMs: 2000 }).catch(() => {});
}

test("connect WeChat becomes ready before an idle long poll returns, even if another app is broken", async () => {
  const home = tmp();
  const api = await httpMock({
    "POST /ilink/bot/getconfig": () => ({ ret: 0 }),
    "POST /ilink/bot/getupdates": async () => { await new Promise((resolve) => setTimeout(resolve, 1200)); return { ret: 0, msgs: [] }; },
    "POST /open-apis/auth/v3/tenant_access_token/internal": () => ({ code: 10003, msg: "unrelated app is broken" }),
  });
  saveGateway({ platforms: { weixin: { accountId: "bot", token: "test", userId: "owner", baseUrl: api.url }, feishu: { appId: "bad", appSecret: "bad", apiBase: api.url } } }, { KODER_CLI_HOME: home });
  try {
    const result = await cli(["connect", "weixin"], { home });
    assert.equal(result.code, 0, result.err);
    const state = loadState({ KODER_CLI_HOME: home });
    assert.equal(state.platforms.weixin.state, "connected");
    // connect intentionally waits only for WeChat. Observe the independent
    // Feishu authentication result before asserting its eventual error state.
    await until(() => loadState({ KODER_CLI_HOME: home })?.platforms.feishu?.state === "error");
    assert.equal(loadState({ KODER_CLI_HOME: home }).platforms.feishu.state, "error");
  } finally { await stop(home); await api.close(); }
});

test("Ctrl-C during background readiness stops the owned child and removes its state", async () => {
  const home = tmp();
  let requestStarted = false;
  const api = await httpMock({ "POST /open-apis/auth/v3/tenant_access_token/internal": async () => { requestStarted = true; await new Promise((resolve) => setTimeout(resolve, 1800)); return { code: 10003, msg: "invalid" }; } });
  saveGateway({ platforms: { feishu: { appId: "test", appSecret: "test", apiBase: api.url } } }, { KODER_CLI_HOME: home });
  const parent = spawn(process.execPath, [BIN, "gateway", "start", "--background"], { env: { PATH: process.env.PATH, KODER_CLI_HOME: home, NO_COLOR: "1" }, stdio: "pipe" });
  let childPid;
  const ended = new Promise((resolve) => parent.once("exit", (code, signal) => resolve({ code, signal })));
  try {
    await until(() => requestStarted);
    childPid = loadState({ KODER_CLI_HOME: home })?.pid;
    assert.ok(childPid && childPid !== parent.pid);
    parent.kill("SIGINT");
    await ended;
    await until(() => !loadState({ KODER_CLI_HOME: home }), { timeoutMs: 1000 });
    assert.throws(() => process.kill(childPid, 0), { code: "ESRCH" });
  } finally {
    if (parent.exitCode === null && parent.signalCode === null) parent.kill();
    await stop(home);
    if (childPid) { try { process.kill(childPid, "SIGTERM"); } catch {} }
    await api.close();
  }
});

test("startup cancellation stops intake immediately while another app is still authenticating", async () => {
  const home = tmp(), controller = new AbortController();
  let release, peer, sent = [];
  const waiting = new Promise((resolve) => { release = resolve; });
  const api = await httpMock({ "POST /open-apis/auth/v3/tenant_access_token/internal": async () => { await waiting; return { code: 10003, msg: "fixture release" }; } });
  const ws = await wsServer(async (conn) => {
    const subscribe = await conn.nextJson(); conn.send({ headers: subscribe.headers, errcode: 0 }); peer = conn;
    for (;;) { const frame = await conn.nextJson(); sent.push(frame); conn.send({ headers: frame.headers, errcode: 0 }); }
  });
  const env = { KODER_CLI_HOME: home, HOME: home };
  saveGateway({ workspace: home, platforms: { feishu: { appId: "a", appSecret: "s", apiBase: api.url }, wecom: { botId: "b", secret: "s", wsUrl: ws.url, dmPolicy: "open" } } }, env);
  const ctx = createContext({ command: "gateway", argv: [], opts: {}, positionals: [], io: { env, cwd: home, providerOverride: scripted([textStep("must not run")]) } });
  let runtime;
  const starting = startGateway(ctx, { signal: controller.signal, log() {} }).then((value) => { runtime = value; return "started"; }, () => "cancelled");
  try {
    await until(() => peer && loadState(env)?.platforms.wecom?.state === "connected");
    controller.abort(new Error("stop startup"));
    peer.send({ cmd: "aibot_msg_callback", headers: { req_id: "late" }, body: { msgid: "late", from: { userid: "owner" }, msgtype: "text", text: { content: "do not process after cancellation" } } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    release();
    assert.equal(await starting, "cancelled");
    assert.deepEqual(sent, []);
  } finally { release(); await starting; await runtime?.gateway.stop(); await api.close(); await ws.close(); }
});
