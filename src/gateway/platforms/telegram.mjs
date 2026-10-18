import { requestJson, sleep } from "../http.mjs";

export const meta = {
  id: "telegram",
  name: { zh: "Telegram", en: "Telegram" },
  console: "https://t.me/BotFather",
  steps: {
    zh: "在 Telegram 打开 @BotFather，发送 /newbot 按提示建好机器人，复制它给的 Bot Token。",
    en: "Open @BotFather in Telegram, send /newbot, follow the prompts and copy the bot token.",
  },
  fields: [{ key: "token", secret: true, label: { zh: "Bot Token", en: "Bot token" } }],
};

function client(creds, fetchImpl) {
  const base = `${(creds.apiBase || "https://api.telegram.org").replace(/\/+$/, "")}/bot${creds.token}`;
  return async (method, body, signal, timeoutMs) => {
    const json = await requestJson(fetchImpl, `${base}/${method}`, { method: "POST", body: body || {}, signal, timeoutMs });
    if (!json.ok) throw new Error(`${method}: ${json.description || "failed"}`);
    return json.result;
  };
}

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const me = await client(creds, fetchImpl)("getMe");
  return { detail: `@${me.username}` };
}

export function create(creds, { fetchImpl = globalThis.fetch, pollTimeout = 30 } = {}) {
  const call = client(creds, fetchImpl);
  let stopped = false;
  let controller = null;
  let offset = 0;
  let me = null;

  const send = (chatId, text, replyTo) => call("sendMessage", {
    chat_id: chatId,
    text,
    ...(replyTo ? { reply_parameters: { message_id: Number(replyTo), allow_sending_without_reply: true } } : {}),
  });

  function handle(hub, message) {
    if (!message?.text || message.from?.is_bot) return;
    const isGroup = message.chat.type !== "private";
    const mention = `@${me.username}`;
    const mentioned = !isGroup || message.text.includes(mention) || message.reply_to_message?.from?.id === me.id;
    const chatId = String(message.chat.id);
    hub.receive({
      platform: "telegram",
      chatId,
      userId: String(message.from.id),
      userName: message.from.username || message.from.first_name || "",
      text: message.text.split(mention).join("").trim(),
      isGroup,
      mentioned,
      messageId: String(message.message_id),
      reply: (text) => send(chatId, text, message.message_id),
    });
  }

  async function loop(hub) {
    while (!stopped) {
      try {
        controller = new AbortController();
        const updates = await call("getUpdates", { offset, timeout: pollTimeout, allowed_updates: ["message"] }, controller.signal, (pollTimeout + 15) * 1000);
        hub.status("connected", `@${me.username}`);
        for (const update of updates) {
          offset = Math.max(offset, update.update_id + 1);
          handle(hub, update.message);
        }
      } catch (error) {
        if (stopped) return;
        hub.status("error", error.message);
        await sleep(3000);
      }
    }
  }

  return {
    id: "telegram",
    maxLength: 4000,
    async start(hub) {
      me = await call("getMe");
      hub.status("connected", `@${me.username}`);
      loop(hub);
    },
    stop() {
      stopped = true;
      controller?.abort();
    },
    send: (chatId, text) => send(chatId, text),
  };
}
