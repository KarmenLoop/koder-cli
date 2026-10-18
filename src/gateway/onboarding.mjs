import { requestJson, sleep } from "./http.mjs";

// Device registration protocols from Hermes Agent (MIT), pinned in the task's
// references/SOURCE.json. No Hermes process or Python dependency is required.
const ACCOUNTS = { feishu: "https://accounts.feishu.cn", lark: "https://accounts.larksuite.com" };

function remaining(deadline, signal) {
  signal?.throwIfAborted();
  const ms = deadline - Date.now();
  if (ms <= 0) throw new Error("QR login timed out; run connect again or use --manual");
  return ms;
}

export async function wecomQrLogin({ fetchImpl = globalThis.fetch, baseUrl = "https://work.weixin.qq.com", onQr = () => {}, onStatus = () => {}, timeoutMs = 300_000, pollDelay = 3000, signal } = {}) {
  const deadline = Date.now() + timeoutMs;
  const get = (route) => requestJson(fetchImpl, `${baseUrl.replace(/\/+$/, "")}${route}`, { signal, timeoutMs: Math.min(15_000, remaining(deadline, signal)) });
  const response = await get("/ai/qc/generate?source=koder");
  const { scode, auth_url: authUrl } = response.data || {};
  if (!scode || !authUrl) throw new Error("WeCom QR creation unavailable; use --manual with Bot ID and Secret");
  onQr(authUrl);
  while (remaining(deadline, signal)) {
    const result = await get(`/ai/qc/query_result?scode=${encodeURIComponent(scode)}`);
    const data = result.data || {};
    onStatus(data.status || "wait");
    if (data.status === "success") {
      const info = data.bot_info || {};
      const botId = String(info.botid || info.bot_id || "").trim();
      const secret = String(info.secret || "").trim();
      if (!botId || !secret) throw new Error("WeCom QR confirmation returned no bot credentials; use --manual");
      return { botId, secret };
    }
    if (["expired", "cancelled", "denied"].includes(data.status)) throw new Error(`WeCom QR ${data.status}; run connect again`);
    await sleep(Math.min(pollDelay, remaining(deadline, signal)), signal);
  }
}

export async function feishuQrLogin({ fetchImpl = globalThis.fetch, domain = "feishu", accountsBase, onQr = () => {}, onStatus = () => {}, timeoutMs = 600_000, signal } = {}) {
  let currentDomain = domain === "lark" ? "lark" : "feishu";
  let deadline = Date.now() + timeoutMs;
  const post = async (fields) => {
    const url = `${accountsBase || ACCOUNTS[currentDomain]}/oauth/v1/app/registration`;
    try {
      return await requestJson(fetchImpl, url, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fields).toString(), signal, timeoutMs: Math.min(15_000, remaining(deadline, signal)) });
    } catch (error) {
      // OAuth device-flow pending/denied responses legitimately use HTTP 400.
      if (error.status === 400 && error.json?.error) return error.json;
      throw error;
    }
  };
  const init = await post({ action: "init" });
  if (!init.supported_auth_methods?.includes("client_secret")) throw new Error("Feishu QR registration unavailable; use --manual with App ID and App Secret");
  const begin = await post({ action: "begin", archetype: "PersonalAgent", auth_method: "client_secret", request_user_info: "open_id" });
  if (!begin.device_code || !begin.verification_uri_complete) throw new Error("Feishu QR registration returned no device code or verification URL");
  const url = new URL(begin.verification_uri_complete);
  url.searchParams.set("from", "koder");
  url.searchParams.set("tp", "koder");
  onQr(url.href);
  deadline = Math.min(deadline, Date.now() + Math.max(1, Number(begin.expire_in) || 600) * 1000);
  let interval = Math.max(1, (Number(begin.interval) || 5) * 1000);
  while (remaining(deadline, signal)) {
    const response = await post({ action: "poll", device_code: begin.device_code, tp: "ob_app" });
    if (response.user_info?.tenant_brand === "lark") currentDomain = "lark";
    if (response.client_id && response.client_secret) return {
      appId: String(response.client_id), appSecret: String(response.client_secret), domain: currentDomain,
      ...(response.user_info?.open_id ? { userId: String(response.user_info.open_id) } : {}),
    };
    const state = response.error || "authorization_pending";
    onStatus(state);
    if (["access_denied", "expired_token"].includes(state)) throw new Error(`Feishu QR ${state}; run connect again`);
    if (state === "slow_down") interval += 5000;
    else if (state !== "authorization_pending") throw new Error(`Feishu QR registration failed: ${state}`);
    await sleep(Math.min(interval, remaining(deadline, signal)), signal);
  }
}
