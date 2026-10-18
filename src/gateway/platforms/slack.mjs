import { requestJson } from "../http.mjs";
import { createSocket } from "../ws.mjs";

// Socket Mode: no public URL needed. Needs an app-level token (connections:write)
// and a bot token with chat:write, app_mentions:read, im:history.
export const meta = {
  id: "slack",
  name: { zh: "Slack", en: "Slack" },
  console: "https://api.slack.com/apps",
  steps: {
    zh: "在 api.slack.com/apps 新建应用：打开 Socket Mode 生成 App Token（xapp-，权限 connections:write）；在 OAuth & Permissions 加 chat:write、app_mentions:read、im:history 并安装到工作区，复制 Bot Token（xoxb-）；在 Event Subscriptions 订阅 app_mention 和 message.im。",
    en: "Create an app at api.slack.com/apps: enable Socket Mode and create an app token (xapp-, connections:write); add chat:write, app_mentions:read and im:history under OAuth & Permissions, install it and copy the bot token (xoxb-); subscribe to app_mention and message.im under Event Subscriptions.",
  },
  fields: [
    { key: "appToken", secret: true, label: { zh: "App Token（xapp-）", en: "App token (xapp-)" } },
    { key: "botToken", secret: true, label: { zh: "Bot Token（xoxb-）", en: "Bot token (xoxb-)" } },
  ],
};

function api(creds, fetchImpl) {
  const base = (creds.apiBase || "https://slack.com/api").replace(/\/+$/, "");
  return async (method, token, body) => {
    const json = await requestJson(fetchImpl, `${base}/${method}`, { method: "POST", headers: { authorization: `Bearer ${token}` }, body: body || {} });
    if (!json.ok) throw new Error(`${method}: ${json.error || "failed"}`);
    return json;
  };
}

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const call = api(creds, fetchImpl);
  const auth = await call("auth.test", creds.botToken);
  await call("apps.connections.open", creds.appToken);
  return { detail: `${auth.team || ""} @${auth.user || ""}`.trim() };
}

export function create(creds, { fetchImpl = globalThis.fetch, WebSocketImpl } = {}) {
  const call = api(creds, fetchImpl);
  let socket = null;
  let botUser = "";

  const send = (channel, text, threadTs) => call("chat.postMessage", creds.botToken, { channel, text, ...(threadTs ? { thread_ts: threadTs } : {}) });

  function handle(hub, event) {
    if (!event || event.bot_id || event.subtype || !event.text || event.user === botUser) return;
    const isGroup = event.channel_type !== "im";
    if (event.type === "message" && isGroup) return;
    if (event.type !== "message" && event.type !== "app_mention") return;
    const thread = isGroup ? event.thread_ts || event.ts : event.thread_ts;
    hub.receive({
      platform: "slack",
      chatId: isGroup ? `${event.channel}:${thread}` : event.channel,
      userId: event.user,
      userName: event.user,
      text: event.text.replace(/<@[A-Z0-9]+>/g, "").trim(),
      isGroup,
      mentioned: event.type === "app_mention" || !isGroup,
      messageId: event.ts,
      reply: (text) => send(event.channel, text, thread),
    });
  }

  return {
    id: "slack",
    maxLength: 3500,
    async start(hub) {
      botUser = (await call("auth.test", creds.botToken)).user_id || "";
      socket = createSocket({
        WebSocketImpl,
        url: async () => (await call("apps.connections.open", creds.appToken)).url,
        log: (line) => hub.log?.(line),
        onOpen: () => hub.status("connecting", "socket open"),
        onClose: () => hub.status("connecting", "reconnecting"),
        onMessage(data, ws) {
          const frame = JSON.parse(data);
          if (frame.envelope_id) ws.send({ envelope_id: frame.envelope_id });
          if (frame.type === "hello") hub.status("connected", botUser);
          else if (frame.type === "disconnect") ws.reconnect();
          else if (frame.type === "events_api") handle(hub, frame.payload?.event);
        },
      });
      socket.start();
    },
    stop() {
      socket?.stop();
    },
    send: (channel, text) => send(channel.split(":")[0], text, channel.split(":")[1]),
  };
}
