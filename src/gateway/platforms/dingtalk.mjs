import { requestJson } from "../http.mjs";
import { createSocket } from "../ws.mjs";

// Stream mode (no public URL), protocol as in open-dingtalk/dingtalk-stream-sdk-nodejs.
export const TOPIC_ROBOT = "/v1.0/im/bot/messages/get";

export const meta = {
  id: "dingtalk",
  name: { zh: "钉钉", en: "DingTalk" },
  console: "https://open-dev.dingtalk.com/fe/app",
  steps: {
    zh: "在钉钉开发者后台创建企业内部应用，添加「机器人」能力，消息接收模式选择「Stream 模式」并发布；在「凭证与基础信息」复制 Client ID（AppKey）和 Client Secret（AppSecret）。",
    en: "Create an internal app in the DingTalk developer console, add the Robot feature with Stream mode and publish it; copy the Client ID (AppKey) and Client Secret (AppSecret).",
  },
  fields: [
    { key: "clientId", label: { zh: "Client ID（AppKey）", en: "Client ID (AppKey)" } },
    { key: "clientSecret", secret: true, label: { zh: "Client Secret（AppSecret）", en: "Client Secret (AppSecret)" } },
  ],
};

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const base = (creds.oapiBase || "https://oapi.dingtalk.com").replace(/\/+$/, "");
  const json = await requestJson(fetchImpl, `${base}/gettoken?appkey=${encodeURIComponent(creds.clientId)}&appsecret=${encodeURIComponent(creds.clientSecret)}`);
  if (json.errcode) throw new Error(`gettoken: ${json.errmsg || json.errcode}`);
  return { detail: creds.clientId };
}

export function create(creds, { fetchImpl = globalThis.fetch, WebSocketImpl, version = "0.2.0" } = {}) {
  const api = (creds.apiBase || "https://api.dingtalk.com").replace(/\/+$/, "");
  let socket = null;
  const webhooks = new Map();

  async function send(chatId, text) {
    const hook = webhooks.get(chatId);
    if (!hook || hook.expires < Date.now()) throw new Error("dingtalk: reply window expired; ask again in the chat");
    const json = await requestJson(fetchImpl, hook.url, { method: "POST", body: { msgtype: "markdown", markdown: { title: "Koder", text } } });
    if (json.errcode) throw new Error(`dingtalk webhook: ${json.errmsg || json.errcode}`);
    return json;
  }

  function handle(hub, data) {
    if (data.msgtype !== "text") return;
    const chatId = data.conversationId;
    if (data.sessionWebhook) webhooks.set(chatId, { url: data.sessionWebhook, expires: Number(data.sessionWebhookExpiredTime) || Date.now() + 3_600_000 });
    const isGroup = String(data.conversationType) === "2";
    hub.receive({
      platform: "dingtalk",
      chatId,
      userId: data.senderStaffId || data.senderId || "",
      userName: data.senderNick || "",
      text: String(data.text?.content || "").trim(),
      isGroup,
      mentioned: !isGroup || data.isInAtList !== false,
      messageId: data.msgId || "",
      reply: (value) => send(chatId, value),
    });
  }

  return {
    id: "dingtalk",
    maxLength: 4000,
    async start(hub) {
      socket = createSocket({
        WebSocketImpl,
        log: (line) => hub.log?.(line),
        async url() {
          const json = await requestJson(fetchImpl, `${api}/v1.0/gateway/connections/open`, {
            method: "POST",
            body: { clientId: creds.clientId, clientSecret: creds.clientSecret, subscriptions: [{ type: "CALLBACK", topic: TOPIC_ROBOT }], ua: `koder-cli/${version}`, localIp: "127.0.0.1" },
          });
          if (!json.endpoint || !json.ticket) throw new Error("connections/open: missing endpoint or ticket");
          return `${json.endpoint}?ticket=${encodeURIComponent(json.ticket)}`;
        },
        onOpen: () => hub.status("connected", creds.clientId),
        onClose: () => hub.status("connecting", "reconnecting"),
        onMessage(raw, ws) {
          const frame = JSON.parse(raw);
          if (frame.type === "SYSTEM") {
            if (frame.headers?.topic === "ping") ws.send({ code: 200, headers: frame.headers, message: "OK", data: frame.data });
            else if (frame.headers?.topic === "disconnect") ws.reconnect();
            return;
          }
          if (frame.type === "CALLBACK" && frame.headers?.topic === TOPIC_ROBOT) {
            ws.send({ code: 200, headers: { contentType: "application/json", messageId: frame.headers.messageId }, message: "OK", data: JSON.stringify({ response: null }) });
            handle(hub, JSON.parse(frame.data || "{}"));
          } else if (frame.type === "EVENT") {
            ws.send({ code: 200, headers: { contentType: "application/json", messageId: frame.headers?.messageId }, message: "OK", data: JSON.stringify({ status: "SUCCESS", message: "success" }) });
          }
        },
      });
      socket.start();
    },
    stop() {
      socket?.stop();
    },
    send,
  };
}
