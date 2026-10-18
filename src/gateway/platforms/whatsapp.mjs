import crypto from "node:crypto";
import http from "node:http";
import { requestJson } from "../http.mjs";

// WhatsApp Business Cloud API (official). Meta delivers messages to a webhook,
// so the local port must be reachable through a tunnel such as cloudflared.
export const meta = {
  id: "whatsapp",
  name: { zh: "WhatsApp", en: "WhatsApp" },
  console: "https://developers.facebook.com/apps",
  steps: {
    zh: "在 Meta for Developers 创建应用并添加 WhatsApp 产品，复制 Phone number ID 和永久 Access Token；自己设一个 Verify Token。启动网关后用 cloudflared 或 ngrok 把本地端口暴露成 https 地址，填到 Webhook 回调地址（路径 /webhook）并订阅 messages。",
    en: "Create an app in Meta for Developers, add WhatsApp, copy the Phone number ID and a permanent access token, and choose a verify token. After starting the gateway, expose the local port with cloudflared or ngrok, set the https URL with path /webhook as the callback and subscribe to messages.",
  },
  fields: [
    { key: "phoneNumberId", label: { zh: "Phone number ID", en: "Phone number ID" } },
    { key: "accessToken", secret: true, label: { zh: "Access Token", en: "Access token" } },
    { key: "verifyToken", secret: true, label: { zh: "Verify Token（自己设定）", en: "Verify token (your choice)" } },
    { key: "appSecret", secret: true, optional: true, label: { zh: "App Secret（用于校验签名，建议填写）", en: "App secret (signature check, recommended)" } },
    { key: "port", optional: true, label: { zh: "本地端口（默认 8788）", en: "Local port (default 8788)" } },
  ],
};

function graph(creds) {
  return (creds.apiBase || "https://graph.facebook.com/v21.0").replace(/\/+$/, "");
}

export async function verify(creds, { fetchImpl = globalThis.fetch } = {}) {
  const json = await requestJson(fetchImpl, `${graph(creds)}/${creds.phoneNumberId}?fields=display_phone_number`, { headers: { authorization: `Bearer ${creds.accessToken}` } });
  return { detail: json.display_phone_number || creds.phoneNumberId };
}

export function validSignature(appSecret, body, signature) {
  if (!appSecret) return true;
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(body).digest("hex")}`;
  const a = Buffer.from(String(signature || ""));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function create(creds, { fetchImpl = globalThis.fetch, host = "127.0.0.1" } = {}) {
  let server = null;
  const seen = new Set();

  const send = (to, text) => requestJson(fetchImpl, `${graph(creds)}/${creds.phoneNumberId}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${creds.accessToken}` },
    body: { messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body: text } },
  });

  function handle(hub, payload) {
    for (const entry of payload?.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const names = Object.fromEntries((value.contacts || []).map((contact) => [contact.wa_id, contact.profile?.name || ""]));
        for (const message of value.messages || []) {
          if (message.type !== "text" || seen.has(message.id)) continue;
          seen.add(message.id);
          if (seen.size > 1000) seen.delete(seen.values().next().value);
          hub.receive({ platform: "whatsapp", chatId: message.from, userId: message.from, userName: names[message.from] || "", text: message.text?.body || "", isGroup: false, mentioned: true, messageId: message.id, reply: (text) => send(message.from, text) });
        }
      }
    }
  }

  return {
    id: "whatsapp",
    maxLength: 4000,
    get port() {
      return server?.address()?.port;
    },
    start(hub) {
      return new Promise((resolve, reject) => {
        server = http.createServer((req, res) => {
          const url = new URL(req.url, "http://localhost");
          if (url.pathname !== "/webhook") {
            res.writeHead(404).end();
            return;
          }
          if (req.method === "GET") {
            const ok = url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === creds.verifyToken;
            res.writeHead(ok ? 200 : 403, { "content-type": "text/plain" }).end(ok ? url.searchParams.get("hub.challenge") || "" : "forbidden");
            return;
          }
          const chunks = [];
          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", () => {
            const body = Buffer.concat(chunks);
            if (!validSignature(creds.appSecret, body, req.headers["x-hub-signature-256"])) {
              res.writeHead(401).end();
              return;
            }
            res.writeHead(200).end("ok");
            try {
              handle(hub, JSON.parse(body.toString("utf8")));
            } catch {}
          });
        });
        server.once("error", reject);
        server.listen(Number(creds.port) || 8788, host, () => {
          hub.status("connected", `http://${host}:${server.address().port}/webhook`);
          resolve();
        });
      });
    },
    stop() {
      return new Promise((resolve) => (server ? server.close(() => resolve()) : resolve()));
    },
    send,
  };
}
