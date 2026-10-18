// Reconnecting client on Node's built-in WebSocket. url() is called on every
// attempt because most platforms hand out a fresh endpoint or ticket each time.
const BACKOFF = [1000, 2000, 5000, 10_000, 30_000, 60_000];

export function createSocket({ url, binary = false, onOpen, onMessage, onClose, onError, log = () => {}, WebSocketImpl = globalThis.WebSocket, backoff = BACKOFF }) {
  let socket = null;
  let stopped = true;
  let attempt = 0;
  let timer = null;
  let connected = false;
  const report = (error) => { log(error.message); onError?.(error); };

  const schedule = () => {
    if (stopped) return;
    const delay = backoff[Math.min(attempt, backoff.length - 1)];
    attempt += 1;
    timer = setTimeout(connect, delay);
  };

  async function connect() {
    if (stopped) return;
    let ws;
    try {
      const target = await url();
      if (stopped) return;
      if (!WebSocketImpl) throw new Error("WebSocket unavailable; use Node.js 22 or newer");
      ws = new WebSocketImpl(target);
    } catch (error) {
      report(error);
      schedule();
      return;
    }
    if (binary) ws.binaryType = "arraybuffer";
    socket = ws;
    ws.addEventListener("open", () => {
      if (stopped || socket !== ws) return;
      attempt = 0;
      connected = true;
      Promise.resolve().then(() => onOpen?.(api)).catch(report);
    });
    ws.addEventListener("message", (event) => {
      if (stopped || socket !== ws) return;
      Promise.resolve().then(() => {
        const data = binary ? new Uint8Array(event.data) : typeof event.data === "string" ? event.data : Buffer.from(event.data).toString("utf8");
        return onMessage?.(data, api);
      }).catch(report);
    });
    ws.addEventListener("close", () => {
      if (socket !== ws) return;
      connected = false;
      socket = null;
      onClose?.(api);
      schedule();
    });
    ws.addEventListener("error", () => { if (!stopped && socket === ws) report(new Error("WebSocket connection failed; check network, proxy and app credentials")); });
  }

  const api = {
    start() {
      if (!stopped) return;
      stopped = false;
      connect();
    },
    send(data) {
      if (socket && socket.readyState === 1) {
        socket.send(typeof data === "string" || data instanceof Uint8Array ? data : JSON.stringify(data));
        return true;
      }
      return false;
    },
    reconnect() {
      socket?.close();
    },
    stop() {
      stopped = true;
      clearTimeout(timer);
      connected = false;
      const previous = socket;
      socket = null;
      previous?.close();
    },
    get connected() {
      return connected;
    },
  };
  return api;
}
