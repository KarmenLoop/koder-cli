export async function requestJson(fetchImpl, url, { method = "GET", headers = {}, body, signal, timeoutMs = 20_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  try {
    const response = await fetchImpl(url, {
      method,
      headers: { ...(body !== undefined ? { "content-type": "application/json; charset=utf-8" } : {}), ...headers },
      body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = null;
    }
    if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}${json?.message || json?.msg || json?.description ? `: ${json.message || json.msg || json.description}` : ""}`), { status: response.status, json });
    if (json === null) throw new Error("invalid JSON response");
    return json;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

export function sleep(ms, signal) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}
