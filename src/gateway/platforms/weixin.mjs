import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { requestJson, sleep } from "../http.mjs";

// Personal WeChat through Tencent's iLink Bot API, protocol as in Hermes Agent's
// gateway/platforms/weixin.py (MIT): QR login, long-poll getupdates, and every
// reply echoes the peer's latest context_token.
export const ILINK_BASE = "https://ilinkai.weixin.qq.com";
const APP_ID = "bot";
const CLIENT_VERSION = String((2 << 16) | (2 << 8) | 0);
const CHANNEL_VERSION = "2.2.0";
const SESSION_EXPIRED = -14;

export const meta = {
  id: "weixin",
  name: { zh: "微信", en: "WeChat" },
  console: "",
  qr: true,
  steps: {
    zh: "不需要填写密钥：终端会显示二维码，用手机微信扫码并确认即可。",
    en: "No keys needed: scan the QR code shown in the terminal with WeChat on your phone and confirm.",
  },
  fields: [],
};

function headers(token, body) {
  const uin = Buffer.from(String(crypto.randomBytes(4).readUInt32BE(0))).toString("base64");
  return {
    "content-type": "application/json",
    AuthorizationType: "ilink_bot_token",
    "X-WECHAT-UIN": uin,
    "iLink-App-Id": APP_ID,
    "iLink-App-ClientVersion": CLIENT_VERSION,
    "content-length": String(Buffer.byteLength(body)),
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

async function post(fetchImpl, baseUrl, endpoint, payload, token, { signal, timeoutMs = 15_000 } = {}) {
  const body = JSON.stringify({ ...payload, base_info: { channel_version: CHANNEL_VERSION } });
  return requestJson(fetchImpl, `${baseUrl.replace(/\/+$/, "")}/${endpoint}`, { method: "POST", headers: headers(token, body), body, signal, timeoutMs });
}

async function get(fetchImpl, baseUrl, endpoint, timeoutMs = 35_000) {
  return requestJson(fetchImpl, `${baseUrl.replace(/\/+$/, "")}/${endpoint}`, { headers: { "iLink-App-Id": APP_ID, "iLink-App-ClientVersion": CLIENT_VERSION }, timeoutMs });
}

export async function qrLogin({ fetchImpl = globalThis.fetch, baseUrl = ILINK_BASE, onQr = () => {}, onStatus = () => {}, timeoutMs = 480_000, pollDelay = 1000 } = {}) {
  const fetchQr = async () => {
    const answer = await get(fetchImpl, baseUrl, "ilink/bot/get_bot_qrcode?bot_type=3");
    if (!answer.qrcode) throw new Error("weixin: no qrcode in response");
    onQr(answer.qrcode_img_content || answer.qrcode);
    return answer.qrcode;
  };
  let qrcode = await fetchQr();
  let current = baseUrl;
  let refreshed = 0;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let status;
    try {
      status = await get(fetchImpl, current, `ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(qrcode)}`);
    } catch {
      await sleep(pollDelay);
      continue;
    }
    const state = String(status.status || "wait");
    onStatus(state);
    if (state === "scaned_but_redirect" && status.redirect_host) current = `https://${status.redirect_host}`;
    else if (state === "expired") {
      refreshed += 1;
      if (refreshed > 3) throw new Error("weixin: QR code expired");
      qrcode = await fetchQr();
    } else if (state === "confirmed") {
      if (!status.ilink_bot_id || !status.bot_token) throw new Error("weixin: incomplete credentials");
      return { accountId: String(status.ilink_bot_id), token: String(status.bot_token), baseUrl: String(status.baseurl || baseUrl), userId: String(status.ilink_user_id || "") };
    }
    await sleep(pollDelay);
  }
  throw new Error("weixin: login timed out");
}

export async function verify(creds) {
  if (!creds.token || !creds.accountId) throw new Error("weixin: run koder gateway setup weixin to scan the QR code");
  return { detail: creds.accountId };
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, JSON.stringify(value), { mode: 0o600 });
}

export function create(creds, { fetchImpl = globalThis.fetch, dataDir, pollTimeoutMs = 35_000 } = {}) {
  const baseUrl = creds.baseUrl || ILINK_BASE;
  const syncFile = dataDir ? path.join(dataDir, "sync.json") : null;
  const tokenFile = dataDir ? path.join(dataDir, "context-tokens.json") : null;
  const contextTokens = tokenFile ? readJson(tokenFile, {}) : {};
  let syncBuf = syncFile ? readJson(syncFile, {}).buf || "" : "";
  let stopped = false;
  let controller = null;

  async function send(to, text) {
    const message = {
      from_user_id: "",
      to_user_id: to,
      client_id: crypto.randomUUID(),
      message_type: 2,
      message_state: 2,
      item_list: [{ type: 1, text_item: { text } }],
      ...(contextTokens[to] ? { context_token: contextTokens[to] } : {}),
    };
    let answer = await post(fetchImpl, baseUrl, "ilink/bot/sendmessage", { msg: message }, creds.token);
    if ((answer.ret === SESSION_EXPIRED || answer.errcode === SESSION_EXPIRED || answer.ret === -2) && message.context_token) {
      delete message.context_token;
      answer = await post(fetchImpl, baseUrl, "ilink/bot/sendmessage", { msg: message }, creds.token);
    }
    if (answer.ret || answer.errcode) throw new Error(`weixin sendmessage: ret=${answer.ret} errcode=${answer.errcode} ${answer.errmsg || ""}`.trim());
    return answer;
  }

  function handle(hub, message) {
    if (message.message_type === 2) return;
    const from = String(message.from_user_id || "").trim();
    if (!from) return;
    if (message.context_token) {
      contextTokens[from] = String(message.context_token);
      if (tokenFile) writeJson(tokenFile, contextTokens);
    }
    const text = (message.item_list || []).filter((item) => item.type === 1).map((item) => item.text_item?.text || "").join("\n").trim();
    const room = String(message.room_id || message.chat_room_id || "").trim();
    hub.receive({ platform: "weixin", chatId: room || from, userId: from, userName: from, text, isGroup: Boolean(room), mentioned: true, messageId: String(message.message_id || ""), reply: (value) => send(room || from, value) });
  }

  async function loop(hub) {
    let failures = 0;
    while (!stopped) {
      try {
        controller = new AbortController();
        const answer = await post(fetchImpl, baseUrl, "ilink/bot/getupdates", { get_updates_buf: syncBuf }, creds.token, { signal: controller.signal, timeoutMs: pollTimeoutMs + 10_000 });
        if (answer.ret === SESSION_EXPIRED || answer.errcode === SESSION_EXPIRED) {
          hub.status("error", "session expired; run koder gateway setup weixin again");
          await sleep(600_000, controller.signal);
          continue;
        }
        if (answer.ret || answer.errcode) throw new Error(`getupdates ret=${answer.ret} errcode=${answer.errcode}`);
        failures = 0;
        hub.status("connected", creds.accountId);
        for (const message of answer.msgs || []) handle(hub, message);
        if (answer.get_updates_buf && answer.get_updates_buf !== syncBuf) {
          syncBuf = String(answer.get_updates_buf);
          if (syncFile) writeJson(syncFile, { buf: syncBuf });
        }
      } catch (error) {
        if (stopped) return;
        failures += 1;
        hub.status("error", error.message);
        await sleep(failures >= 3 ? 30_000 : 2000, controller?.signal);
      }
    }
  }

  return {
    id: "weixin",
    maxLength: 2000,
    async start(hub) {
      await verify(creds);
      loop(hub);
    },
    stop() {
      stopped = true;
      controller?.abort();
    },
    send,
  };
}
