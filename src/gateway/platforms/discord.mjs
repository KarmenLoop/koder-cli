import { requestJson } from "../http.mjs";
import { createSocket } from "../ws.mjs";

const INTENTS = (1 << 0) | (1 << 9) | (1 << 12) | (1 << 15); // GUILDS, GUILD_MESSAGES, DIRECT_MESSAGES, MESSAGE_CONTENT

export const meta = {
  id: "discord",
  name: { zh: "Discord", en: "Discord" },
  console: "https://discord.com/developers/applications",
  steps: {
    zh: "在 Discord Developer Portal 新建应用，进入 Bot 页复制 Token，并打开 Message Content Intent；在 OAuth2 → URL Generator 勾选 bot 与 Send Messages、Read Message History，用生成的链接把机器人邀请进服务器。",
    en: "Create an application in the Discord Developer Portal, copy the token on the Bot page and enable Message Content Intent; in OAuth2 → URL Generator pick bot with Send Messages and Read Message History, then invite the bot with the generated link.",
  },
  fields: [{ key: "token", secret: true, label: { zh: "Bot Token", en: "Bot token" } }],
};

function rest(creds, fetchImpl) {
  const base = (creds.apiBase || "https://discord.com/api/v10").replace(/\/+$/, "");
  return (method, route, body) => requestJson(fetchImpl, `${base}${route}`, { method, headers: { authorization: `Bot ${creds.token}` }, body });
}

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const me = await rest(creds, fetchImpl)("GET", "/users/@me");
  return { detail: `${me.username}#${me.discriminator || "0"}` };
}

export function create(creds, { fetchImpl = globalThis.fetch, WebSocketImpl } = {}) {
  const call = rest(creds, fetchImpl);
  let socket = null;
  let heartbeat = null;
  let seq = null;
  let acked = true;
  let botId = "";

  const send = (channelId, text, replyTo) => call("POST", `/channels/${channelId}/messages`, {
    content: text,
    allowed_mentions: { parse: [] },
    ...(replyTo ? { message_reference: { message_id: replyTo, fail_if_not_exists: false } } : {}),
  });

  function handle(hub, message) {
    if (!message?.content || message.author?.bot) return;
    const isGroup = Boolean(message.guild_id);
    const mentioned = !isGroup || (message.mentions || []).some((user) => user.id === botId);
    hub.receive({
      platform: "discord",
      chatId: message.channel_id,
      userId: message.author.id,
      userName: message.author.username || "",
      text: message.content.replace(new RegExp(`<@!?${botId}>`, "g"), "").trim(),
      isGroup,
      mentioned,
      messageId: message.id,
      reply: (text) => send(message.channel_id, text, message.id),
    });
  }

  return {
    id: "discord",
    maxLength: 1900,
    async start(hub) {
      botId = (await call("GET", "/users/@me")).id;
      socket = createSocket({
        WebSocketImpl,
        url: async () => `${(await call("GET", "/gateway/bot")).url}/?v=10&encoding=json`,
        log: (line) => hub.log?.(line),
        onClose() {
          clearInterval(heartbeat);
          hub.status("connecting", "reconnecting");
        },
        onMessage(data, ws) {
          const frame = JSON.parse(data);
          if (frame.s != null) seq = frame.s;
          if (frame.op === 10) {
            acked = true;
            clearInterval(heartbeat);
            heartbeat = setInterval(() => {
              if (!acked) return ws.reconnect();
              acked = false;
              ws.send({ op: 1, d: seq });
            }, frame.d.heartbeat_interval);
            heartbeat.unref?.();
            ws.send({ op: 2, d: { token: creds.token, intents: INTENTS, properties: { os: process.platform, browser: "koder-cli", device: "koder-cli" } } });
          } else if (frame.op === 11) acked = true;
          else if (frame.op === 1) ws.send({ op: 1, d: seq });
          else if (frame.op === 7 || frame.op === 9) ws.reconnect();
          else if (frame.op === 0 && frame.t === "READY") {
            botId = frame.d.user?.id || botId;
            hub.status("connected", frame.d.user?.username || "");
          } else if (frame.op === 0 && frame.t === "MESSAGE_CREATE") handle(hub, frame.d);
        },
      });
      socket.start();
    },
    stop() {
      clearInterval(heartbeat);
      socket?.stop();
    },
    send: (channelId, text) => send(channelId, text),
  };
}
