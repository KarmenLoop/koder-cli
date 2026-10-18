import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { decodeFrame, encodeFrame, header } from "../src/gateway/protobuf.mjs";
import * as dingtalk from "../src/gateway/platforms/dingtalk.mjs";
import * as discord from "../src/gateway/platforms/discord.mjs";
import * as feishu from "../src/gateway/platforms/feishu.mjs";
import * as slack from "../src/gateway/platforms/slack.mjs";
import * as telegram from "../src/gateway/platforms/telegram.mjs";
import * as wecom from "../src/gateway/platforms/wecom.mjs";
import * as weixin from "../src/gateway/platforms/weixin.mjs";
import * as whatsapp from "../src/gateway/platforms/whatsapp.mjs";
import { tmp } from "./helpers.mjs";
import { httpMock, until, wsServer } from "./ws-server.mjs";

function hub() {
  const messages = [];
  const states = [];
  return { messages, states, receive: (message) => messages.push(message), status: (state, detail) => states.push([state, detail]), log() {} };
}

test("protobuf frame round-trips uint64 ids, headers and payload exactly", () => {
  const frame = { SeqID: 18446744073709551615n, LogID: 123456789012345678n, service: 33, method: 1, headers: [{ key: "type", value: "event" }, { key: "message_id", value: "消息1" }], payloadEncoding: "", payloadType: "", payload: new TextEncoder().encode("{\"a\":1}"), LogIDNew: "x" };
  const back = decodeFrame(encodeFrame(frame));
  assert.equal(back.SeqID, frame.SeqID);
  assert.equal(back.LogID, frame.LogID);
  assert.equal(back.service, 33);
  assert.equal(back.method, 1);
  assert.equal(header(back, "message_id"), "消息1");
  assert.equal(new TextDecoder().decode(back.payload), "{\"a\":1}");
  assert.equal(back.LogIDNew, "x");
});

test("telegram: long poll in, reply out, group mention stripped", async () => {
  let served = false;
  const api = await httpMock({
    "POST /botT/getMe": () => ({ ok: true, result: { id: 42, username: "koderbot" } }),
    "POST /botT/getUpdates": async () => {
      if (served) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { ok: true, result: [] };
      }
      served = true;
      return { ok: true, result: [
        { update_id: 5, message: { message_id: 9, chat: { id: 100, type: "private" }, from: { id: 7, username: "alice" }, text: "你好" } },
        { update_id: 6, message: { message_id: 10, chat: { id: -5, type: "group" }, from: { id: 8, username: "bob" }, text: "@koderbot 看看日志" } },
        { update_id: 7, message: { message_id: 11, chat: { id: -5, type: "group" }, from: { id: 8 }, text: "随便聊" } },
      ] };
    },
    "POST /botT/sendMessage": () => ({ ok: true, result: {} }),
  });
  const h = hub();
  const adapter = telegram.create({ token: "T", apiBase: api.url }, { pollTimeout: 1 });
  try {
    assert.equal((await telegram.verify({ token: "T", apiBase: api.url })).detail, "@koderbot");
    await adapter.start(h);
    await until(() => h.messages.length === 3);
    const [dm, mention, chatter] = h.messages;
    assert.deepEqual([dm.chatId, dm.userId, dm.text, dm.isGroup, dm.mentioned], ["100", "7", "你好", false, true]);
    assert.deepEqual([mention.text, mention.isGroup, mention.mentioned], ["看看日志", true, true]);
    assert.equal(chatter.mentioned, false);
    await dm.reply("收到");
    const sent = api.find("POST", "/botT/sendMessage")[0].body;
    assert.deepEqual(sent, { chat_id: "100", text: "收到", reply_parameters: { message_id: 9, allow_sending_without_reply: true } });
    assert.equal(api.find("POST", "/botT/getUpdates")[1].body.offset, 8);
  } finally {
    adapter.stop();
    await api.close();
  }
});

test("slack: socket mode envelope is acked, DM and thread replies go to chat.postMessage", async () => {
  let wsUrl;
  const acks = [];
  const ws = await wsServer(async (conn) => {
    conn.send({ type: "hello" });
    conn.send({ envelope_id: "e1", type: "events_api", payload: { event: { type: "message", channel_type: "im", channel: "D1", user: "U1", text: "hi", ts: "1.1" } } });
    conn.send({ envelope_id: "e2", type: "events_api", payload: { event: { type: "app_mention", channel_type: "channel", channel: "C1", user: "U2", text: "<@UBOT> review", ts: "2.2" } } });
    conn.send({ envelope_id: "e3", type: "events_api", payload: { event: { type: "message", channel_type: "im", channel: "D1", bot_id: "B", text: "echo", ts: "3.3" } } });
    for (let i = 0; i < 3; i += 1) acks.push(await conn.nextJson());
  });
  wsUrl = ws.url;
  const api = await httpMock({
    "POST /auth.test": () => ({ ok: true, user_id: "UBOT", team: "Acme", user: "koder" }),
    "POST /apps.connections.open": () => ({ ok: true, url: wsUrl }),
    "POST /chat.postMessage": () => ({ ok: true }),
  });
  const h = hub();
  const adapter = slack.create({ appToken: "xapp-1", botToken: "xoxb-1", apiBase: api.url });
  try {
    await adapter.start(h);
    await until(() => h.messages.length === 2 && acks.length === 3);
    assert.deepEqual(acks.map((a) => a.envelope_id), ["e1", "e2", "e3"]);
    const [dm, mention] = h.messages;
    assert.deepEqual([dm.chatId, dm.isGroup, dm.text], ["D1", false, "hi"]);
    assert.deepEqual([mention.chatId, mention.isGroup, mention.mentioned, mention.text], ["C1:2.2", true, true, "review"]);
    await dm.reply("ok");
    await mention.reply("done");
    const posts = api.find("POST", "/chat.postMessage").map((call) => call.body);
    assert.deepEqual(posts, [{ channel: "D1", text: "ok" }, { channel: "C1", text: "done", thread_ts: "2.2" }]);
    assert.equal(api.find("POST", "/chat.postMessage")[0].headers.authorization, "Bearer xoxb-1");
    assert.equal(api.find("POST", "/apps.connections.open")[0].headers.authorization, "Bearer xapp-1");
  } finally {
    adapter.stop();
    await api.close();
    await ws.close();
  }
});

test("discord: hello → identify with intents, heartbeat acked, MESSAGE_CREATE handled", async () => {
  let identify;
  let heartbeat;
  const ws = await wsServer(async (conn) => {
    conn.send({ op: 10, d: { heartbeat_interval: 40 } });
    identify = await conn.nextJson((frame) => frame.op === 2);
    conn.send({ op: 0, t: "READY", s: 1, d: { user: { id: "B1", username: "koder" } } });
    conn.send({ op: 0, t: "MESSAGE_CREATE", s: 2, d: { id: "M1", channel_id: "C1", guild_id: "G1", author: { id: "U1", username: "bob" }, content: "<@B1> 修一下", mentions: [{ id: "B1" }] } });
    conn.send({ op: 0, t: "MESSAGE_CREATE", s: 3, d: { id: "M2", channel_id: "C1", guild_id: "G1", author: { id: "B1", bot: true }, content: "self" } });
    heartbeat = await conn.nextJson((frame) => frame.op === 1);
    conn.send({ op: 11 });
  });
  const api = await httpMock({
    "GET /users/@me": () => ({ id: "B1", username: "koder", discriminator: "0" }),
    "GET /gateway/bot": () => ({ url: ws.url }),
    "POST /channels/C1/messages": () => ({ id: "R1" }),
  });
  const h = hub();
  const adapter = discord.create({ token: "DT", apiBase: api.url });
  try {
    await adapter.start(h);
    await until(() => h.messages.length === 1 && heartbeat);
    assert.equal(identify.d.token, "DT");
    assert.equal(identify.d.intents, 1 | 512 | 4096 | 32768);
    assert.equal(heartbeat.d, 3);
    const [message] = h.messages;
    assert.deepEqual([message.chatId, message.isGroup, message.mentioned, message.text], ["C1", true, true, "修一下"]);
    await message.reply("好");
    const call = api.find("POST", "/channels/C1/messages")[0];
    assert.equal(call.headers.authorization, "Bot DT");
    assert.deepEqual(call.body, { content: "好", allowed_mentions: { parse: [] }, message_reference: { message_id: "M1", fail_if_not_exists: false } });
  } finally {
    adapter.stop();
    await api.close();
    await ws.close();
  }
});

test("feishu: endpoint → binary frames, ping, fragmented event merged and acked, reply via open API", async () => {
  let ping;
  const acks = [];
  const event = { schema: "2.0", header: { event_type: "im.message.receive_v1", event_id: "ev1" }, event: { sender: { sender_type: "user", sender_id: { open_id: "ou_user" } }, message: { message_id: "om_1", chat_id: "oc_1", chat_type: "group", message_type: "text", content: JSON.stringify({ text: "@_user_1 帮我看看" }), mentions: [{ key: "@_user_1", id: { open_id: "ou_bot" }, name: "Koder" }] } } };
  const bytes = new TextEncoder().encode(JSON.stringify(event));
  const half = Math.floor(bytes.length / 2);
  const ws = await wsServer(async (conn) => {
    ping = decodeFrame(await conn.next());
    const base = { LogID: 9n, service: 33, method: 1 };
    conn.send(encodeFrame({ ...base, SeqID: 2n ** 60n + 7n, headers: [{ key: "type", value: "event" }, { key: "message_id", value: "m1" }, { key: "sum", value: "2" }, { key: "seq", value: "1" }, { key: "trace_id", value: "t" }], payload: bytes.subarray(half) }));
    conn.send(encodeFrame({ ...base, SeqID: 2n ** 60n + 8n, headers: [{ key: "type", value: "event" }, { key: "message_id", value: "m1" }, { key: "sum", value: "2" }, { key: "seq", value: "0" }, { key: "trace_id", value: "t" }], payload: bytes.subarray(0, half) }));
    acks.push(decodeFrame(await conn.next()));
  });
  const api = await httpMock({
    "POST /open-apis/auth/v3/tenant_access_token/internal": (body) => (body.app_secret === "S" ? { code: 0, tenant_access_token: "tok", expire: 7200 } : { code: 10003, msg: "bad secret" }),
    "GET /open-apis/bot/v3/info": () => ({ code: 0, bot: { open_id: "ou_bot", app_name: "KoderBot" } }),
    "POST /callback/ws/endpoint": (body) => ({ code: 0, data: { URL: `${ws.url}/ws?device_id=d1&service_id=33&AppID=${body.AppID}`, ClientConfig: { PingInterval: 120 } } }),
    "POST /open-apis/im/v1/messages/om_1/reply": () => ({ code: 0, data: {} }),
  });
  const h = hub();
  const adapter = feishu.create({ appId: "cli_1", appSecret: "S", apiBase: api.url });
  try {
    assert.equal((await feishu.verify({ appId: "cli_1", appSecret: "S", apiBase: api.url })).detail, "KoderBot");
    await assert.rejects(feishu.verify({ appId: "cli_1", appSecret: "bad", apiBase: api.url }), /bad secret/);
    await adapter.start(h);
    await until(() => h.messages.length === 1 && acks.length === 1);
    assert.equal(ping.method, 0);
    assert.equal(ping.service, 33);
    assert.equal(header(ping, "type"), "ping");
    assert.equal(acks[0].SeqID, 2n ** 60n + 8n);
    assert.ok(header(acks[0], "biz_rt") !== undefined);
    assert.deepEqual(JSON.parse(new TextDecoder().decode(acks[0].payload)), { code: 200 });
    const [message] = h.messages;
    assert.deepEqual([message.chatId, message.userId, message.text, message.isGroup, message.mentioned], ["oc_1", "ou_user", "帮我看看", true, true]);
    await message.reply("已处理");
    const reply = api.find("POST", "/open-apis/im/v1/messages/om_1/reply")[0];
    assert.equal(reply.headers.authorization, "Bearer tok");
    assert.deepEqual(reply.body, { msg_type: "text", content: JSON.stringify({ text: "已处理" }) });
  } finally {
    adapter.stop();
    await api.close();
    await ws.close();
  }
});

test("wecom: subscribe handshake, callback in, respond with the inbound req_id, then proactive send", async () => {
  let subscribe;
  const replies = [];
  const ws = await wsServer(async (conn) => {
    subscribe = await conn.nextJson((frame) => frame.cmd === "aibot_subscribe");
    conn.send({ headers: { req_id: subscribe.headers.req_id }, errcode: 0, errmsg: "ok" });
    conn.send({ cmd: "aibot_msg_callback", headers: { req_id: "r1" }, body: { msgid: "x1", chattype: "single", from: { userid: "zhangsan" }, msgtype: "text", text: { content: "你好" } } });
    conn.send({ cmd: "aibot_msg_callback", headers: { req_id: "r2" }, body: { msgid: "x2", chatid: "g1", chattype: "group", from: { userid: "lisi" }, msgtype: "text", text: { content: "@Koder 查一下" } } });
    for (;;) {
      const frame = await conn.nextJson((value) => value.cmd !== "ping", 10_000);
      replies.push(frame);
      conn.send({ headers: { req_id: frame.headers.req_id }, errcode: 0 });
    }
  });
  const h = hub();
  const dataDir = tmp();
  const adapter = wecom.create({ botId: "bot1", secret: "sec", wsUrl: ws.url }, { dataDir });
  try {
    await adapter.start(h);
    await until(() => h.messages.length === 2);
    assert.deepEqual(subscribe.body.bot_id, "bot1");
    assert.equal(subscribe.body.secret, "sec");
    assert.equal(JSON.parse(fs.readFileSync(path.join(dataDir, "device.json"), "utf8")).deviceId, subscribe.body.device_id);
    const [single, group] = h.messages;
    assert.deepEqual([single.chatId, single.isGroup, single.text], ["zhangsan", false, "你好"]);
    assert.deepEqual([group.chatId, group.isGroup, group.text], ["g1", true, "查一下"]);
    await single.reply("第一条");
    await single.reply("第二条");
    await group.reply("群回复");
    await assert.rejects(group.reply("再来一条"), /fresh message/);
    assert.deepEqual(replies.map((frame) => [frame.cmd, frame.headers.req_id.startsWith("send") ? "send" : frame.headers.req_id, frame.body.chatid || "", frame.body.markdown.content]), [
      ["aibot_respond_msg", "r1", "", "第一条"],
      ["aibot_send_msg", "send", "zhangsan", "第二条"],
      ["aibot_respond_msg", "r2", "", "群回复"],
    ]);
  } finally {
    adapter.stop();
    await ws.close();
  }
});

test("weixin: QR login polls status, long poll uses iLink headers, reply echoes context_token", async () => {
  let statusCalls = 0;
  let served = false;
  const api = await httpMock({
    "GET /ilink/bot/get_bot_qrcode": (_, __, url) => (url.searchParams.get("bot_type") === "3" ? { qrcode: "q1", qrcode_img_content: "https://liteapp.weixin.qq.com/q/abc" } : {}),
    "GET /ilink/bot/get_qrcode_status": () => {
      statusCalls += 1;
      if (statusCalls === 1) return { status: "wait" };
      if (statusCalls === 2) return { status: "scaned" };
      return { status: "confirmed", ilink_bot_id: "bot@im", bot_token: "btok", baseurl: api.url, ilink_user_id: "owner" };
    },
    "POST /ilink/bot/getupdates": async () => {
      if (served) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { ret: 0, msgs: [] };
      }
      served = true;
      return { ret: 0, get_updates_buf: "buf1", msgs: [
        { from_user_id: "wx_u1", message_id: "m1", message_type: 1, context_token: "ctx1", item_list: [{ type: 1, text_item: { text: "你好" } }] },
        { from_user_id: "bot@im", message_id: "m2", message_type: 2, item_list: [{ type: 1, text_item: { text: "echo" } }] },
      ] };
    },
    "POST /ilink/bot/sendmessage": () => ({ ret: 0 }),
  });
  const qr = [];
  const creds = await weixin.qrLogin({ baseUrl: api.url, onQr: (value) => qr.push(value), pollDelay: 5 });
  assert.deepEqual(qr, ["https://liteapp.weixin.qq.com/q/abc"]);
  assert.deepEqual(creds, { accountId: "bot@im", token: "btok", baseUrl: api.url, userId: "owner" });
  const h = hub();
  const dataDir = tmp();
  const adapter = weixin.create(creds, { dataDir, pollTimeoutMs: 1000 });
  try {
    await adapter.start(h);
    await until(() => h.messages.length === 1 && fs.existsSync(path.join(dataDir, "sync.json")));
    const poll = api.find("POST", "/ilink/bot/getupdates")[0];
    assert.equal(poll.headers.authorizationtype, "ilink_bot_token");
    assert.equal(poll.headers.authorization, "Bearer btok");
    assert.equal(poll.headers["ilink-app-id"], "bot");
    assert.deepEqual(poll.body, { get_updates_buf: "", base_info: { channel_version: "2.2.0" } });
    const [message] = h.messages;
    assert.deepEqual([message.chatId, message.text], ["wx_u1", "你好"]);
    await message.reply("回你");
    const sent = api.find("POST", "/ilink/bot/sendmessage")[0].body.msg;
    assert.equal(sent.to_user_id, "wx_u1");
    assert.equal(sent.context_token, "ctx1");
    assert.deepEqual(sent.item_list, [{ type: 1, text_item: { text: "回你" } }]);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dataDir, "sync.json"), "utf8")).buf, "buf1");
    assert.equal(JSON.parse(fs.readFileSync(path.join(dataDir, "context-tokens.json"), "utf8")).wx_u1, "ctx1");
  } finally {
    adapter.stop();
    await api.close();
  }
});

test("dingtalk: connections/open ticket, SYSTEM ping echoed, robot callback acked, reply via sessionWebhook", async () => {
  let ping;
  let ack;
  let wsQuery;
  let httpUrl;
  const ws = await wsServer(async (conn) => {
    wsQuery = new URL(conn.url, "http://x").searchParams.get("ticket");
    conn.send({ specVersion: "1.0", type: "SYSTEM", headers: { topic: "ping", messageId: "p1" }, data: "{\"opaque\":\"o\"}" });
    ping = await conn.nextJson();
    conn.send({ specVersion: "1.0", type: "CALLBACK", headers: { topic: dingtalk.TOPIC_ROBOT, messageId: "m2" }, data: JSON.stringify({ conversationId: "cid1", conversationType: "2", senderStaffId: "u1", senderNick: "李四", isInAtList: true, text: { content: " 在吗 " }, msgtype: "text", sessionWebhook: `${httpUrl}/robot/send?session=s1`, sessionWebhookExpiredTime: Date.now() + 60_000, msgId: "mm" }) });
    ack = await conn.nextJson();
  });
  const api = await httpMock({
    "POST /v1.0/gateway/connections/open": (body) => ({ endpoint: ws.url, ticket: body.clientSecret === "cs" ? "tk" : "" }),
    "GET /gettoken": (_, __, url) => (url.searchParams.get("appsecret") === "cs" ? { errcode: 0, access_token: "a" } : { errcode: 40089, errmsg: "invalid" }),
    "POST /robot/send": () => ({ errcode: 0 }),
  });
  httpUrl = api.url;
  const h = hub();
  const adapter = dingtalk.create({ clientId: "ck", clientSecret: "cs", apiBase: api.url });
  try {
    assert.equal((await dingtalk.verify({ clientId: "ck", clientSecret: "cs", oapiBase: api.url })).detail, "ck");
    await assert.rejects(dingtalk.verify({ clientId: "ck", clientSecret: "x", oapiBase: api.url }), /invalid/);
    await adapter.start(h);
    await until(() => h.messages.length === 1 && ack);
    const open = api.find("POST", "/v1.0/gateway/connections/open")[0].body;
    assert.deepEqual(open.subscriptions, [{ type: "CALLBACK", topic: "/v1.0/im/bot/messages/get" }]);
    assert.equal(wsQuery, "tk");
    assert.deepEqual(ping, { code: 200, headers: { topic: "ping", messageId: "p1" }, message: "OK", data: "{\"opaque\":\"o\"}" });
    assert.deepEqual(ack, { code: 200, headers: { contentType: "application/json", messageId: "m2" }, message: "OK", data: "{\"response\":null}" });
    const [message] = h.messages;
    assert.deepEqual([message.chatId, message.userId, message.userName, message.text, message.isGroup, message.mentioned], ["cid1", "u1", "李四", "在吗", true, true]);
    await message.reply("在");
    const hook = api.find("POST", "/robot/send")[0];
    assert.equal(hook.query.session, "s1");
    assert.deepEqual(hook.body, { msgtype: "markdown", markdown: { title: "Koder", text: "在" } });
  } finally {
    adapter.stop();
    await api.close();
    await ws.close();
  }
});

test("whatsapp: webhook verification, signature check, inbound text, Graph API reply", async () => {
  const graph = await httpMock({ "POST /pn1/messages": () => ({ messages: [{ id: "wamid.1" }] }), "GET /pn1": () => ({ display_phone_number: "+1 555" }) });
  const h = hub();
  const creds = { phoneNumberId: "pn1", accessToken: "AT", verifyToken: "vt", appSecret: "app-secret", port: 0, apiBase: graph.url };
  const adapter = whatsapp.create(creds);
  try {
    assert.equal((await whatsapp.verify(creds)).detail, "+1 555");
    await adapter.start(h);
    const base = `http://127.0.0.1:${adapter.port}/webhook`;
    const verified = await fetch(`${base}?hub.mode=subscribe&hub.verify_token=vt&hub.challenge=4242`);
    assert.equal(await verified.text(), "4242");
    assert.equal((await fetch(`${base}?hub.mode=subscribe&hub.verify_token=no&hub.challenge=1`)).status, 403);
    const body = JSON.stringify({ entry: [{ changes: [{ value: { contacts: [{ wa_id: "8613800000000", profile: { name: "王五" } }], messages: [{ from: "8613800000000", id: "wamid.in", type: "text", text: { body: "hello koder" } }] } }] }] });
    assert.equal((await fetch(base, { method: "POST", body, headers: { "x-hub-signature-256": "sha256=bad" } })).status, 401);
    const signature = `sha256=${crypto.createHmac("sha256", "app-secret").update(body).digest("hex")}`;
    assert.equal((await fetch(base, { method: "POST", body, headers: { "x-hub-signature-256": signature } })).status, 200);
    await until(() => h.messages.length === 1);
    const [message] = h.messages;
    assert.deepEqual([message.chatId, message.userName, message.text], ["8613800000000", "王五", "hello koder"]);
    await message.reply("hi");
    const sent = graph.find("POST", "/pn1/messages")[0];
    assert.equal(sent.headers.authorization, "Bearer AT");
    assert.deepEqual(sent.body, { messaging_product: "whatsapp", recipient_type: "individual", to: "8613800000000", type: "text", text: { preview_url: false, body: "hi" } });
  } finally {
    await adapter.stop();
    await graph.close();
  }
});
