// Reconnecting client on Node's built-in WebSocket. url() is called on every
// attempt because most platforms hand out a fresh endpoint or ticket each time.
const BACKOFF = [1000, 2000, 5000, 10_000, 30_000, 60_000];

export function createSocket({ url, binary = false, onOpen, onMessage, onClose, log = () => {}, WebSocketImpl = globalThis.WebSocket, backoff = BACKOFF }) {
  let socket = null;
  let stopped = false;
  let attempt = 0;
  let timer = null;
  let connected = false;

  const schedule = () => {
    if (stopped) return;
    const delay = backoff[Math.min(attempt, backoff.length - 1)];
    attempt += 1;
    timer = setTimeout(connect, delay);
  };

  async function connect() {
    if (stopped) return;
    let target;
    try {
      target = await url();
    } catch (error) {
      log(`endpoint: ${error.message}`);
      schedule();
      return;
    }
    if (stopped) return;
    const ws = new WebSocketImpl(target);
    if (binary) ws.binaryType = "arraybuffer";
    socket = ws;
    ws.addEventListener("open", () => {
      attempt = 0;
      connected = true;
      onOpen?.(api);
    });
    ws.addEventListener("message", (event) => {
      const data = binary ? new Uint8Array(event.data) : typeof event.data === "string" ? event.data : Buffer.from(event.data).toString("utf8");
      Promise.resolve(onMessage(data, api)).catch((error) => log(`message: ${error.message}`));
    });
    ws.addEventListener("close", () => {
      connected = false;
      if (socket === ws) socket = null;
      onClose?.(api);
      schedule();
    });
    ws.addEventListener("error", () => log("socket error"));
  }

  const api = {
    start() {
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
      socket?.close();
      socket = null;
    },
    get connected() {
      return connected;
    },
  };
  return api;
}
