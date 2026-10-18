import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createContext } from "../src/cli.mjs";
import { startGateway } from "../src/commands/gateway.mjs";
import { encodeFrame } from "../src/gateway/protobuf.mjs";
import { saveGateway } from "../src/gateway/store.mjs";
import { qrLogin } from "../src/gateway/platforms/weixin.mjs";
import { createGateway } from "../src/gateway/core.mjs";
import { cli, scripted, textStep, tmp, toolStep } from "./helpers.mjs";
import { httpMock, until, wsServer } from "./ws-server.mjs";

function context(home, answer) {
  return createContext({ command: "gateway", argv: [], opts: {}, positionals: [], io: { env: { KODER_CLI_HOME: home, HOME: home }, cwd: home, providerOverride: scripted([textStep(answer)]) } });
}

test("WeChat QR cancellation aborts the pending request and does not retry", async () => {
  const controller = new AbortController();
  let polls = 0;
  const fetchImpl = async (url, { signal }) => {
    if (url.includes("get_bot_qrcode")) return new Response(JSON.stringify({ qrcode: "q", qrcode_img_content: "https://liteapp.weixin.qq.com/q/test" }));
    polls++;
    controller.abort(new Error("cancel QR now"));
    signal.throwIfAborted();
  };
  await assert.rejects(qrLogin({ fetchImpl, signal: controller.signal, timeoutMs: 30, pollDelay: 1 }), /cancel QR now/);
  assert.equal(polls, 1);
});

test("WeChat confirmed owner → real Koder session → iLink text reply", async () => {
  const home = tmp();
  let served = false;
  const api = await httpMock({
    "POST /ilink/bot/getconfig": () => ({ ret: 0 }),
    "POST /ilink/bot/getupdates": async () => {
      if (served) { await new Promise((resolve) => setTimeout(resolve, 30)); return { ret: 0, msgs: [] }; }
      served = true;
      return { ret: 0, msgs: [{ message_id: "w1", from_user_id: "owner", message_type: 1, context_token: "ctx", item_list: [{ type: 1, text_item: { text: "hello Koder" } }] }] };
    },
    "POST /ilink/bot/sendmessage": () => ({ ret: 0 }),
  });
  let runtime;
  try {
    const configured = await cli(["connect", "weixin", "--no-start"], { home, io: { weixinLogin: async () => ({ accountId: "test-bot", token: "test", userId: "owner", baseUrl: api.url }) } });
    assert.equal(configured.code, 0, configured.err);
    runtime = await startGateway(context(home, "Koder replied through WeChat"), { log() {} });
    const reply = await until(() => api.find("POST", "/ilink/bot/sendmessage")[0]);
    assert.equal(reply.body.msg.to_user_id, "owner");
    assert.equal(reply.body.msg.context_token, "ctx");
    assert.equal(reply.body.msg.item_list[0].text_item.text, "Koder replied through WeChat");
  } finally { await runtime?.gateway.stop(); await api.close(); }
});

test("Feishu QR-confirmed owner → real Koder session → originating message reply", async () => {
  const home = tmp();
  const event = { header: { event_type: "im.message.receive_v1" }, event: { sender: { sender_type: "user", sender_id: { open_id: "ou_owner" } }, message: { message_id: "om_one", chat_id: "oc_one", chat_type: "p2p", message_type: "text", content: JSON.stringify({ text: "hello Koder" }) } } };
  const ws = await wsServer(async (conn) => {
    await conn.next();
    conn.send(encodeFrame({ SeqID: 1n, LogID: 1n, service: 1, method: 1, headers: [{ key: "type", value: "event" }], payload: Buffer.from(JSON.stringify(event)) }));
  });
  const api = await httpMock({
    "POST /open-apis/auth/v3/tenant_access_token/internal": () => ({ code: 0, tenant_access_token: "test" }),
    "GET /open-apis/bot/v3/info": () => ({ code: 0, bot: { open_id: "ou_bot", app_name: "Test bot" } }),
    "POST /callback/ws/endpoint": () => ({ code: 0, data: { URL: ws.url } }),
    "POST /open-apis/im/v1/messages/om_one/reply": () => ({ code: 0, data: { message_id: "om_reply" } }),
  });
  let runtime;
  try {
    const configured = await cli(["connect", "feishu", "--qr", "--no-start"], { home, io: { feishuLogin: async () => ({ appId: "test", appSecret: "test", userId: "ou_owner", apiBase: api.url }) } });
    assert.equal(configured.code, 0, configured.err);
    runtime = await startGateway(context(home, "Koder replied through Feishu"), { log() {} });
    const reply = await until(() => api.find("POST", "/open-apis/im/v1/messages/om_one/reply")[0]);
    assert.equal(JSON.parse(reply.body.content).text, "Koder replied through Feishu");
    assert.equal(reply.headers.authorization, "Bearer test");
  } finally { await runtime?.gateway.stop(); await api.close(); await ws.close(); }
});

test("WeCom paired user → real Koder session → correlated openws reply", async () => {
  const home = tmp();
  let sent;
  const ws = await wsServer(async (conn) => {
    const subscribe = await conn.nextJson(); conn.send({ headers: subscribe.headers, errcode: 0 });
    conn.send({ cmd: "aibot_msg_callback", headers: { req_id: "incoming" }, body: { msgid: "wc1", chattype: "single", from: { userid: "owner" }, msgtype: "text", text: { content: "hello Koder" } } });
    sent = await conn.nextJson((frame) => frame.cmd === "aibot_respond_msg"); conn.send({ headers: sent.headers, errcode: 0 });
  });
  saveGateway({ workspace: path.join(home, "workspace"), platforms: { wecom: { botId: "test", secret: "test", wsUrl: ws.url, dmPolicy: "allowlist", allowFrom: ["owner"] } } }, { KODER_CLI_HOME: home });
  let runtime;
  try {
    runtime = await startGateway(context(home, "Koder replied through WeCom"), { log() {} });
    await until(() => sent);
    assert.equal(sent.headers.req_id, "incoming");
    assert.equal(sent.body.markdown.content, "Koder replied through WeCom");
  } finally { await runtime?.gateway.stop(); await ws.close(); }
});

test("disabling an app retires queued turns before they can run", async () => {
  const home = tmp(), turns = [];
  let finish;
  const gate = new Promise((resolve) => { finish = resolve; });
  const gateway = createGateway(context(home, "unused"), {
    config: { workspace: home, platforms: { wecom: { dmPolicy: "open" } } },
    sessionFactory: async () => ({ async turn(text) { turns.push(text); await gate; return { text: "done" }; }, cancel() { finish(); } }),
  });
  const send = (text) => gateway.receive({ platform: "wecom", chatId: "chat", userId: "owner", text, reply: async () => {} });
  const first = send("first");
  await until(() => turns.length === 1);
  const queued = send("queued before disable");
  await gateway.remove("wecom");
  await Promise.all([first, queued]);
  assert.deepEqual(turns, ["first"]);
});

for (const global of [false, true]) test(`${global ? "stop" : "remove"} retires every chat before awaiting a slow cancellation`, async () => {
  const home = tmp(), turns = [], gates = new Map();
  let releaseCancel;
  const cancelling = new Promise((resolve) => { releaseCancel = resolve; });
  const gateway = createGateway(context(home, "unused"), {
    config: { workspace: home, platforms: { wecom: { dmPolicy: "open" }, feishu: { dmPolicy: "open" } } },
    sessionFactory: async () => {
      let first;
      return { async turn(text) { first ||= text; turns.push(text); if (!text.includes("queued")) await new Promise((resolve) => gates.set(text, resolve)); return { text: "done" }; }, async cancel() { gates.get(first)?.(); if (first === "a") await cancelling; } };
    },
  });
  const send = (chatId, text) => gateway.receive({ platform: global && chatId === "b" ? "feishu" : "wecom", chatId, userId: "owner", text, reply: async () => {} });
  const a = send("a", "a"), b = send("b", "b");
  await until(() => turns.length === 2);
  const queued = send("b", "b queued");
  const removing = global ? gateway.stop() : gateway.remove("wecom");
  try {
    gates.get("b")();
    await new Promise(setImmediate);
    assert.deepEqual(turns, ["a", "b"]);
  } finally { releaseCancel(); await removing; await Promise.all([a, b, queued]); }
});

test("WeCom group approval continues through the approving message's fresh reply channel", async () => {
  const home = tmp(), replies = [];
  const ws = await wsServer(async (conn) => {
    const subscribe = await conn.nextJson(); conn.send({ headers: subscribe.headers, errcode: 0 });
    const message = (id, content) => ({ cmd: "aibot_msg_callback", headers: { req_id: id }, body: { msgid: id, chatid: "group", chattype: "group", from: { userid: "owner" }, msgtype: "text", text: { content } } });
    conn.send(message("initial", "@Koder write the file"));
    const prompt = await conn.nextJson((frame) => frame.cmd === "aibot_respond_msg"); replies.push(prompt);
    conn.send({ headers: prompt.headers, errcode: 0 });
    conn.send(message("approval", "允许"));
    const done = await conn.nextJson((frame) => frame.cmd === "aibot_respond_msg"); replies.push(done);
    conn.send({ headers: done.headers, errcode: 0 });
  });
  const env = { KODER_CLI_HOME: home, HOME: home };
  saveGateway({ workspace: home, approvalTimeoutSec: 1, platforms: { wecom: { botId: "b", secret: "s", wsUrl: ws.url, groupPolicy: "allowlist", groupAllowFrom: ["group"] } } }, env);
  const ctx = createContext({ command: "gateway", argv: [], opts: {}, positionals: [], io: { env, cwd: home, providerOverride: scripted([toolStep("write_file", { path: "approved.txt", content: "approved" }), textStep("group task completed")]) } });
  let runtime;
  try {
    runtime = await startGateway(ctx, { log() {} });
    await until(() => replies.length === 2);
    assert.equal(replies[0].headers.req_id, "initial");
    assert.equal(replies[1].headers.req_id, "approval");
    assert.equal(replies[1].body.markdown.content, "group task completed");
  } finally { await runtime?.gateway.stop(); await ws.close(); }
});
