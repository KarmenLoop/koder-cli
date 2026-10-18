import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import * as feishu from "../src/gateway/platforms/feishu.mjs";
import * as wecom from "../src/gateway/platforms/wecom.mjs";
import * as weixin from "../src/gateway/platforms/weixin.mjs";
import { createSocket } from "../src/gateway/ws.mjs";
import { loadGateway, saveGateway } from "../src/gateway/store.mjs";
import { createContext } from "../src/cli.mjs";
import { startGateway } from "../src/commands/gateway.mjs";
import { cli, tmp } from "./helpers.mjs";
import { httpMock, until, wsServer } from "./ws-server.mjs";

test("WeCom scan-to-create retrieves credentials only after mobile confirmation", async () => {
  assert.equal(typeof wecom.qrLogin, "function", "WeCom needs the scan-to-create flow");
  let polls = 0;
  const api = await httpMock({
    "GET /ai/qc/generate": () => ({ data: { scode: "code", auth_url: "https://work.weixin.qq.com/scan/test" } }),
    "GET /ai/qc/query_result": () => ({ data: ++polls === 1 ? { status: "wait" } : { status: "success", bot_info: { botid: "test-bot", secret: "test-secret" } } }),
  });
  const codes = [];
  try {
    const result = await wecom.qrLogin({ baseUrl: api.url, pollDelay: 1, timeoutMs: 1000, onQr: (url) => codes.push(url) });
    assert.deepEqual(result, { botId: "test-bot", secret: "test-secret" });
    assert.deepEqual(codes, ["https://work.weixin.qq.com/scan/test"]);
    assert.equal(api.find("GET", "/ai/qc/generate")[0].query.source, "koder");
  } finally { await api.close(); }
});

test("Feishu scan-to-create handles pending HTTP 400, form posts, and Lark tenant detection", async () => {
  assert.equal(typeof feishu.qrLogin, "function", "Feishu needs device registration");
  let polls = 0;
  const api = await httpMock({
    "POST /oauth/v1/app/registration": (body) => {
      const form = new URLSearchParams(body);
      if (form.get("action") === "init") return { supported_auth_methods: ["client_secret"] };
      if (form.get("action") === "begin") {
        assert.equal(form.get("archetype"), "PersonalAgent");
        assert.equal(form.get("request_user_info"), "open_id");
        return { device_code: "device-code", verification_uri_complete: "https://accounts.feishu.cn/scan?code=1", interval: 0.001, expire_in: 10 };
      }
      assert.equal(form.get("device_code"), "device-code");
      return ++polls === 1 ? { __status: 400, json: { error: "authorization_pending" } } : { client_id: "cli_test", client_secret: "test-secret", user_info: { open_id: "ou_owner", tenant_brand: "lark" } };
    },
  });
  const codes = [];
  try {
    const result = await feishu.qrLogin({ accountsBase: api.url, timeoutMs: 1000, onQr: (url) => codes.push(url) });
    assert.deepEqual(result, { appId: "cli_test", appSecret: "test-secret", domain: "lark", userId: "ou_owner" });
    assert.equal(new URL(codes[0]).searchParams.get("from"), "koder");
    assert.equal(api.find("POST", "/oauth/v1/app/registration")[0].headers["content-type"], "application/x-www-form-urlencoded");
  } finally { await api.close(); }
});

test("Feishu registration rejects denial and never saves incomplete credentials", async () => {
  assert.equal(typeof feishu.qrLogin, "function");
  const fetchImpl = async (_url, request) => {
    const action = new URLSearchParams(request.body).get("action");
    return new Response(JSON.stringify(action === "init" ? { supported_auth_methods: ["client_secret"] } : action === "begin" ? { device_code: "d", verification_uri_complete: "https://accounts.feishu.cn/scan", interval: 0.001 } : { error: "access_denied" }), { status: action === "poll" ? 400 : 200 });
  };
  await assert.rejects(feishu.qrLogin({ fetchImpl, timeoutMs: 500 }), /denied/);
});

test("connect WeChat saves the confirmed owner, preserving pairing for everyone else", async () => {
  const home = tmp();
  const result = await cli(["gateway", "connect", "微信", "--no-start"], { home, io: {
    weixinLogin: async () => ({ accountId: "bot@im.bot", token: "test-token", userId: "owner", baseUrl: "https://ilinkai.weixin.qq.com" }),
    verifyPlatform: async () => ({ detail: "bot@im.bot" }),
  } });
  assert.equal(result.code, 0, result.err);
  const config = loadGateway({ KODER_CLI_HOME: home });
  assert.deepEqual(config.platforms.weixin.allowFrom, ["owner"]);
  assert.equal(config.platforms.weixin.dmPolicy, "pairing");
  assert.doesNotMatch(result.out, /test-token/);
});

test("top-level connect supports manual credentials without forcing QR registration", async () => {
  const home = tmp();
  const result = await cli(["connect", "企业微信", "--no-start", "--manual", "--set", "botId=test-bot", "--set", "secret=test-secret"], { home, io: {
    verifyPlatform: async (creds) => { assert.equal(creds.botId, "test-bot"); return { detail: "test-bot" }; },
  } });
  assert.equal(result.code, 0, result.err);
  assert.equal(loadGateway({ KODER_CLI_HOME: home }).platforms.wecom.secret, "test-secret");
  assert.doesNotMatch(result.out, /test-secret/);
});

test("WeChat credential verification detects expired sessions without consuming inbox updates", async () => {
  const api = await httpMock({ "POST /ilink/bot/getconfig": () => ({ ret: -14, errmsg: "session expired" }) });
  try {
    await assert.rejects(weixin.verify({ accountId: "b", token: "expired", userId: "owner", baseUrl: api.url }), /expired|重新|扫码/);
    assert.equal(api.calls.length, 1);
    assert.equal(api.calls[0].body.ilink_user_id, "owner");
  } finally { await api.close(); }
});

test("Feishu setup checks the receive endpoint as well as the bot credentials", async () => {
  const api = await httpMock({
    "POST /open-apis/auth/v3/tenant_access_token/internal": () => ({ code: 0, tenant_access_token: "test", expire: 7200 }),
    "GET /open-apis/bot/v3/info": () => ({ code: 0, bot: { open_id: "ou_bot" } }),
    "POST /callback/ws/endpoint": () => ({ code: 10003, msg: "long connection is disabled" }),
  });
  try { await assert.rejects(feishu.verify({ appId: "cli_test", appSecret: "test", apiBase: api.url }), /long connection/); }
  finally { await api.close(); }
});

test("WebSocket endpoint constructor failure is reported and stoppable", async () => {
  const errors = [];
  const socket = createSocket({ url: async () => "wss://invalid.example", WebSocketImpl: class { constructor() { throw new Error("proxy unavailable"); } }, onMessage() {}, onError: (error) => errors.push(error.message), backoff: [50] });
  try { socket.start(); await until(() => errors.length > 0, { timeoutMs: 1000 }); assert.match(errors[0], /proxy unavailable/); }
  finally { socket.stop(); }
  assert.equal(socket.connected, false);
});

test("WeCom preserves the originating request when two messages arrive in the same DM", async () => {
  const sent = [];
  const ws = await wsServer(async (conn) => {
    const subscribe = await conn.nextJson();
    conn.send({ headers: subscribe.headers, errcode: 0 });
    for (let i = 1; i <= 2; i++) conn.send({ cmd: "aibot_msg_callback", headers: { req_id: `r${i}` }, body: { msgid: `m${i}`, chattype: "single", from: { userid: "owner" }, msgtype: "text", text: { content: `message ${i}` } } });
    const reply = await conn.nextJson(); sent.push(reply); conn.send({ headers: reply.headers, errcode: 0 });
  });
  const messages = [];
  const adapter = wecom.create({ botId: "test", secret: "test", wsUrl: ws.url });
  try {
    await adapter.start({ receive: (message) => messages.push(message), status() {} });
    await until(() => messages.length === 2);
    await messages[0].reply("first answer");
    assert.equal(sent[0].headers.req_id, "r1");
  } finally { adapter.stop(); await ws.close(); }
});

test("WeCom disconnect rejects pending sends immediately and updates connection state", async () => {
  const ws = await wsServer(async (conn) => {
    const subscribe = await conn.nextJson(); conn.send({ headers: subscribe.headers, errcode: 0 });
    conn.send({ cmd: "aibot_msg_callback", headers: { req_id: "r" }, body: { msgid: "m", from: { userid: "owner" }, text: { content: "hi" } } });
    await conn.nextJson(); conn.close();
  });
  const messages = [], states = [];
  const adapter = wecom.create({ botId: "test", secret: "test", wsUrl: ws.url });
  try {
    await adapter.start({ receive: (message) => messages.push(message), status: (state) => states.push(state) });
    await until(() => messages.length === 1);
    const send = messages[0].reply("answer");
    const result = await Promise.race([send.then(() => "sent", () => "disconnected"), new Promise((resolve) => setTimeout(() => resolve("still pending"), 300))]);
    assert.equal(result, "disconnected");
    assert.notEqual(states.at(-1), "connected");
  } finally { adapter.stop(); await ws.close(); }
});

test("WeChat redelivered message IDs are not dispatched twice", async () => {
  let poll = 0;
  const api = await httpMock({ "POST /ilink/bot/getupdates": async () => {
    poll++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return { ret: 0, msgs: poll <= 2 ? [{ message_id: "same", from_user_id: "owner", message_type: 1, item_list: [{ type: 1, text_item: { text: "do it once" } }] }] : [] };
  } });
  const messages = [];
  const adapter = weixin.create({ accountId: "b", token: "t", baseUrl: api.url });
  try {
    await adapter.start({ receive: (message) => messages.push(message), status() {} });
    await until(() => poll >= 3);
    assert.equal(messages.length, 1);
  } finally { adapter.stop(); await api.close(); }
});

test("background start does not report success while authentication fails", async () => {
  const home = tmp();
  fs.mkdirSync(path.join(home, "gateway"));
  const api = await httpMock({
    "POST /open-apis/auth/v3/tenant_access_token/internal": () => ({ code: 10003, msg: "invalid app secret" }),
  });
  fs.writeFileSync(path.join(home, "gateway/config.json"), JSON.stringify({ platforms: { feishu: { appId: "bad", appSecret: "bad", apiBase: api.url } } }));
  try {
    const result = await cli(["gateway", "start", "--background"], { home });
    assert.notEqual(result.code, 0, "spawning a child is not a successful app connection");
    assert.doesNotMatch(result.out, /已在后台启动|started in the background/);
  } finally {
    const stateFile = path.join(home, "gateway/state.json");
    if (fs.existsSync(stateFile)) { const state = JSON.parse(fs.readFileSync(stateFile)); try { process.kill(state.pid, "SIGTERM"); } catch {} }
    await api.close();
  }
});

test("a running gateway adds a newly connected app and revokes a disabled app without restarting other apps", async () => {
  const home = tmp(), env = { KODER_CLI_HOME: home, HOME: home };
  let feishuConnections = 0;
  const fws = await wsServer(() => { feishuConnections++; });
  const wws = await wsServer(async (conn) => { const subscribe = await conn.nextJson(); conn.send({ headers: subscribe.headers, errcode: 0 }); });
  const api = await httpMock({
    "POST /open-apis/auth/v3/tenant_access_token/internal": () => ({ code: 0, tenant_access_token: "t" }),
    "GET /open-apis/bot/v3/info": () => ({ code: 0, bot: { open_id: "ou_bot" } }),
    "POST /callback/ws/endpoint": () => ({ code: 0, data: { URL: fws.url } }),
  });
  const config = { platforms: { feishu: { appId: "a", appSecret: "s", apiBase: api.url } } };
  saveGateway(config, env);
  const ctx = createContext({ command: "gateway", argv: [], opts: {}, positionals: [], io: { env, cwd: home } });
  let runtime;
  try {
    runtime = await startGateway(ctx, { log() {} });
    assert.equal(typeof runtime.refresh, "function", "saved connections must reach the running gateway");
    await until(() => runtime.gateway.status.feishu?.state === "connected");
    config.platforms.wecom = { botId: "b", secret: "s", wsUrl: wws.url };
    saveGateway(config, env);
    await runtime.refresh();
    await until(() => runtime.gateway.status.wecom?.state === "connected");
    assert.equal(feishuConnections, 1);
    config.platforms.wecom.enabled = false;
    saveGateway(config, env);
    await runtime.refresh();
    assert.equal(runtime.gateway.status.wecom.state, "disconnected");
    assert.equal(runtime.gateway.status.feishu.state, "connected");
  } finally { await runtime?.gateway.stop(); await api.close(); await fws.close(); await wws.close(); }
});
