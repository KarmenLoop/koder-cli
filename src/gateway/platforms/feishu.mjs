import { requestJson } from "../http.mjs";
import { decodeFrame, encodeFrame, header } from "../protobuf.mjs";
import { createSocket } from "../ws.mjs";

// Long connection (no public URL), same protocol as larksuite/node-sdk ws-client.
const DOMAINS = { feishu: "https://open.feishu.cn", lark: "https://open.larksuite.com" };
const CONTROL = 0;
const DATA = 1;

export const meta = {
  id: "feishu",
  name: { zh: "飞书 / Lark", en: "Feishu / Lark" },
  console: "https://open.feishu.cn/app",
  steps: {
    zh: "在飞书开放平台创建企业自建应用，添加「机器人」能力；在「权限管理」开通 im:message、im:message:send_as_bot；在「事件与回调」选择「使用长连接接收事件」并订阅「接收消息 im.message.receive_v1」；发布版本后复制 App ID 和 App Secret。海外 Lark 选 lark。",
    en: "Create a custom app on the Feishu/Lark open platform and add the Bot feature; grant im:message and im:message:send_as_bot; under Events choose long connection and subscribe to im.message.receive_v1; publish a version and copy the App ID and App Secret. Use domain lark for Lark.",
  },
  fields: [
    { key: "appId", label: { zh: "App ID", en: "App ID" } },
    { key: "appSecret", secret: true, label: { zh: "App Secret", en: "App Secret" } },
    { key: "domain", optional: true, choices: ["feishu", "lark"], label: { zh: "域名（feishu 或 lark，默认 feishu）", en: "Domain (feishu or lark, default feishu)" } },
  ],
};

function base(creds) {
  return (creds.apiBase || DOMAINS[creds.domain] || DOMAINS.feishu).replace(/\/+$/, "");
}

function tokens(creds, fetchImpl) {
  let cached = null;
  return async () => {
    if (cached && cached.expires > Date.now() + 60_000) return cached.token;
    const json = await requestJson(fetchImpl, `${base(creds)}/open-apis/auth/v3/tenant_access_token/internal`, { method: "POST", body: { app_id: creds.appId, app_secret: creds.appSecret } });
    if (json.code !== 0) throw new Error(`tenant_access_token: ${json.msg || json.code}`);
    cached = { token: json.tenant_access_token, expires: Date.now() + (json.expire || 7200) * 1000 };
    return cached.token;
  };
}

async function openApi(fetchImpl, creds, token, method, route, body) {
  const json = await requestJson(fetchImpl, `${base(creds)}${route}`, { method, headers: { authorization: `Bearer ${await token()}` }, body });
  if (json.code !== 0) throw new Error(`${route}: ${json.msg || json.code}`);
  return json.data || {};
}

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const token = tokens(creds, fetchImpl);
  const info = await requestJson(fetchImpl, `${base(creds)}/open-apis/bot/v3/info`, { headers: { authorization: `Bearer ${await token()}` } });
  if (info.code !== 0) throw new Error(`bot/v3/info: ${info.msg || info.code}`);
  return { detail: info.bot?.app_name || creds.appId };
}

export function create(creds, { fetchImpl = globalThis.fetch, WebSocketImpl } = {}) {
  const token = tokens(creds, fetchImpl);
  let socket = null;
  let pingTimer = null;
  let serviceId = 0;
  let pingInterval = 90_000;
  let botOpenId = "";
  const fragments = new Map();
  const seen = new Set();

  const reply = (messageId, text) => openApi(fetchImpl, creds, token, "POST", `/open-apis/im/v1/messages/${messageId}/reply`, { msg_type: "text", content: JSON.stringify({ text }) });
  const send = (chatId, text) => openApi(fetchImpl, creds, token, "POST", "/open-apis/im/v1/messages?receive_id_type=chat_id", { receive_id: chatId, msg_type: "text", content: JSON.stringify({ text }) });

  async function endpoint() {
    const json = await requestJson(fetchImpl, `${base(creds)}/callback/ws/endpoint`, { method: "POST", headers: { locale: "zh" }, body: { AppID: creds.appId, AppSecret: creds.appSecret } });
    if (json.code !== 0) throw new Error(`ws endpoint: ${json.msg || json.code}`);
    const url = json.data?.URL;
    if (!url) throw new Error("ws endpoint: missing URL");
    serviceId = Number(new URL(url).searchParams.get("service_id") || 0);
    if (json.data?.ClientConfig?.PingInterval) pingInterval = json.data.ClientConfig.PingInterval * 1000;
    return url;
  }

  function ping(ws) {
    ws.send(encodeFrame({ SeqID: 0n, LogID: 0n, service: serviceId, method: CONTROL, headers: [{ key: "type", value: "ping" }] }));
  }

  function merge(frame) {
    const sum = Number(header(frame, "sum") || 1);
    if (sum <= 1) return frame.payload;
    const id = header(frame, "message_id");
    const parts = fragments.get(id) || new Array(sum);
    parts[Number(header(frame, "seq") || 0)] = frame.payload;
    fragments.set(id, parts);
    if (parts.filter(Boolean).length < sum) return null;
    fragments.delete(id);
    return Buffer.concat(parts.map((part) => Buffer.from(part)));
  }

  function handleEvent(hub, event) {
    if (event?.header?.event_type !== "im.message.receive_v1") return;
    const message = event.event?.message;
    const sender = event.event?.sender;
    if (!message || sender?.sender_type === "app" || message.message_type !== "text") return;
    if (seen.has(message.message_id)) return;
    seen.add(message.message_id);
    if (seen.size > 1000) seen.delete(seen.values().next().value);
    let text = "";
    try {
      text = JSON.parse(message.content || "{}").text || "";
    } catch {}
    const mentions = message.mentions || [];
    for (const mention of mentions) text = text.split(mention.key).join("");
    const isGroup = message.chat_type !== "p2p";
    hub.receive({
      platform: "feishu",
      chatId: message.chat_id,
      userId: sender?.sender_id?.open_id || "",
      userName: sender?.sender_id?.open_id || "",
      text: text.trim(),
      isGroup,
      mentioned: !isGroup || mentions.some((item) => !botOpenId || item.id?.open_id === botOpenId),
      messageId: message.message_id,
      reply: (value) => reply(message.message_id, value),
    });
  }

  return {
    id: "feishu",
    maxLength: 4000,
    async start(hub) {
      const info = await requestJson(fetchImpl, `${base(creds)}/open-apis/bot/v3/info`, { headers: { authorization: `Bearer ${await token()}` } }).catch(() => null);
      botOpenId = info?.bot?.open_id || "";
      socket = createSocket({
        WebSocketImpl,
        binary: true,
        url: endpoint,
        log: (line) => hub.log?.(line),
        onOpen(ws) {
          hub.status("connected", info?.bot?.app_name || creds.appId);
          clearInterval(pingTimer);
          ping(ws);
          pingTimer = setInterval(() => ping(ws), pingInterval);
          pingTimer.unref?.();
        },
        onClose() {
          clearInterval(pingTimer);
          hub.status("connecting", "reconnecting");
        },
        onMessage(bytes, ws) {
          const frame = decodeFrame(bytes);
          if (frame.method === CONTROL) {
            if (header(frame, "type") === "pong" && frame.payload.length) {
              try {
                const config = JSON.parse(Buffer.from(frame.payload).toString("utf8"));
                if (config.PingInterval) pingInterval = config.PingInterval * 1000;
              } catch {}
            }
            return;
          }
          if (frame.method !== DATA || header(frame, "type") !== "event") return;
          const payload = merge(frame);
          if (!payload) return;
          const started = Date.now();
          let code = 200;
          try {
            handleEvent(hub, JSON.parse(Buffer.from(payload).toString("utf8")));
          } catch {
            code = 500;
          }
          ws.send(encodeFrame({ ...frame, headers: [...frame.headers, { key: "biz_rt", value: String(Date.now() - started) }], payload: new TextEncoder().encode(JSON.stringify({ code })) }));
        },
      });
      socket.start();
    },
    stop() {
      clearInterval(pingTimer);
      socket?.stop();
    },
    send,
  };
}
