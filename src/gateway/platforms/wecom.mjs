import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createSocket } from "../ws.mjs";

// WeCom AI bot over the openws long connection, protocol as in Hermes Agent's
// plugins/platforms/wecom (MIT): aibot_subscribe → ping every 30 s →
// aibot_msg_callback in, aibot_respond_msg (same req_id) or aibot_send_msg out.
export const meta = {
  id: "wecom",
  name: { zh: "企业微信", en: "WeCom" },
  console: "https://work.weixin.qq.com/wework_admin/frame#/aiHelper/create",
  steps: {
    zh: "在企业微信管理后台 →「应用管理」→「智能机器人」创建机器人，连接方式选择「长连接（API 模式）」，复制 Bot ID 和 Secret。",
    en: "In the WeCom admin console go to App Management → AI Bot, create a bot with the long-connection (API) mode and copy the Bot ID and Secret.",
  },
  fields: [
    { key: "botId", label: { zh: "Bot ID", en: "Bot ID" } },
    { key: "secret", secret: true, label: { zh: "Secret", en: "Secret" } },
  ],
};

const PING_MS = 30_000;
const REQUEST_MS = 15_000;

function deviceId(dataDir) {
  if (!dataDir) return crypto.randomUUID();
  const file = path.join(dataDir, "device.json");
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).deviceId;
  } catch {
    const id = crypto.randomUUID();
    fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(file, JSON.stringify({ deviceId: id }), { mode: 0o600 });
    return id;
  }
}

function connection(creds, { WebSocketImpl, dataDir, onFrame, onStatus, log }) {
  const pending = new Map();
  let pingTimer = null;
  const device = deviceId(dataDir);
  const reqId = (prefix) => `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const request = (ws, cmd, id, body) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${cmd} timeout`));
    }, REQUEST_MS);
    pending.set(id, (frame) => {
      clearTimeout(timer);
      resolve(frame);
    });
    if (!ws.send({ cmd, headers: { req_id: id }, body })) {
      clearTimeout(timer);
      pending.delete(id);
      reject(new Error("socket closed"));
    }
  });
  const socket = createSocket({
    WebSocketImpl,
    url: async () => creds.wsUrl || "wss://openws.work.weixin.qq.com",
    log,
    async onOpen(ws) {
      try {
        const answer = await request(ws, "aibot_subscribe", reqId("subscribe"), { bot_id: creds.botId, secret: creds.secret, device_id: device });
        if (answer.errcode && answer.errcode !== 0) throw new Error(`${answer.errmsg || "subscribe failed"} (errcode=${answer.errcode})`);
        onStatus("connected", creds.botId);
        clearInterval(pingTimer);
        pingTimer = setInterval(() => ws.send({ cmd: "ping", headers: { req_id: reqId("ping") }, body: {} }), PING_MS);
        pingTimer.unref?.();
      } catch (error) {
        onStatus("error", error.message);
        ws.reconnect();
      }
    },
    onClose() {
      clearInterval(pingTimer);
    },
    onMessage(data) {
      const frame = JSON.parse(data);
      const id = frame.headers?.req_id;
      const cmd = frame.cmd || "";
      if (id && pending.has(id) && cmd !== "aibot_msg_callback" && cmd !== "aibot_callback" && cmd !== "aibot_event_callback") {
        pending.get(id)(frame);
        pending.delete(id);
        return;
      }
      onFrame(frame);
    },
  });
  return {
    socket,
    reqId,
    request: (cmd, id, body) => request(socket, cmd, id, body),
    stop() {
      clearInterval(pingTimer);
      socket.stop();
    },
  };
}

export async function verify(creds, { WebSocketImpl, timeoutMs = 15_000 } = {}) {
  return new Promise((resolve, reject) => {
    let conn;
    const timer = setTimeout(() => {
      conn?.stop();
      reject(new Error("subscribe timeout"));
    }, timeoutMs);
    conn = connection(creds, {
      WebSocketImpl,
      onFrame() {},
      log() {},
      onStatus(state, detail) {
        if (state === "connected" || state === "error") {
          clearTimeout(timer);
          conn.stop();
          if (state === "connected") resolve({ detail: `Bot ${creds.botId}` });
          else reject(new Error(detail));
        }
      },
    });
    conn.socket.start();
  });
}

export function create(creds, { WebSocketImpl, dataDir } = {}) {
  let conn = null;
  const lastReq = new Map();
  const groups = new Set();

  const markdown = (content) => ({ msgtype: "markdown", markdown: { content: content.slice(0, 4000) } });

  // Group chats only accept replies tied to an inbound req_id; each req_id answers once.
  async function send(chatId, text) {
    const latest = lastReq.get(chatId);
    if (latest && !latest.used) {
      latest.used = true;
      const answer = await conn.request("aibot_respond_msg", latest.id, markdown(text));
      if (!answer.errcode) return answer;
    }
    if (groups.has(chatId)) throw new Error("wecom: group reply needs a fresh message");
    const answer = await conn.request("aibot_send_msg", conn.reqId("send"), { chatid: chatId, ...markdown(text) });
    if (answer.errcode) throw new Error(`aibot_send_msg: ${answer.errmsg || answer.errcode}`);
    return answer;
  }

  function handle(hub, frame) {
    if (frame.cmd !== "aibot_msg_callback" && frame.cmd !== "aibot_callback") return;
    const body = frame.body || {};
    const sender = String(body.from?.userid || "").trim();
    const chatId = String(body.chatid || sender).trim();
    if (!chatId) return;
    const isGroup = String(body.chattype || "").toLowerCase() === "group";
    if (isGroup) groups.add(chatId);
    lastReq.set(chatId, { id: frame.headers?.req_id, used: false });
    let text = body.msgtype === "mixed"
      ? (body.mixed?.msg_item || []).filter((item) => item.msgtype === "text").map((item) => item.text?.content || "").join("\n")
      : body.text?.content || body.voice?.content || "";
    if (isGroup) text = text.replace(/^@\S+\s*/, "");
    hub.receive({ platform: "wecom", chatId, userId: sender, userName: sender, text: text.trim(), isGroup, mentioned: true, messageId: String(body.msgid || ""), reply: (value) => send(chatId, value) });
  }

  return {
    id: "wecom",
    maxLength: 3800,
    async start(hub) {
      conn = connection(creds, { WebSocketImpl, dataDir, log: (line) => hub.log?.(line), onStatus: hub.status, onFrame: (frame) => handle(hub, frame) });
      conn.socket.start();
    },
    stop() {
      conn?.stop();
    },
    send,
  };
}
