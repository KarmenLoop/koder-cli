import crypto from "node:crypto";
import http from "node:http";

// Minimal RFC 6455 server for tests: handshake, text/binary frames, ping, close.
function frame(opcode, payload) {
  const body = Buffer.from(payload);
  let head;
  if (body.length < 126) head = Buffer.from([0x80 | opcode, body.length]);
  else if (body.length < 65536) {
    head = Buffer.alloc(4);
    head[0] = 0x80 | opcode;
    head[1] = 126;
    head.writeUInt16BE(body.length, 2);
  } else {
    head = Buffer.alloc(10);
    head[0] = 0x80 | opcode;
    head[1] = 127;
    head.writeBigUInt64BE(BigInt(body.length), 2);
  }
  return Buffer.concat([head, body]);
}

function client(socket, req) {
  let buffer = Buffer.alloc(0);
  const queue = [];
  const waiters = [];
  const deliver = (message) => {
    const waiter = waiters.shift();
    if (waiter) waiter(message);
    else queue.push(message);
  };
  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    for (;;) {
      if (buffer.length < 2) return;
      const opcode = buffer[0] & 0x0f;
      const masked = (buffer[1] & 0x80) !== 0;
      let length = buffer[1] & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (buffer.length < 4) return;
        length = buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (buffer.length < 10) return;
        length = Number(buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const mask = masked ? buffer.subarray(offset, offset + 4) : null;
      if (masked) offset += 4;
      if (buffer.length < offset + length) return;
      const payload = Buffer.from(buffer.subarray(offset, offset + length));
      if (mask) for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4];
      buffer = buffer.subarray(offset + length);
      if (opcode === 8) {
        socket.end(frame(8, Buffer.alloc(0)));
        return;
      }
      if (opcode === 9) socket.write(frame(10, payload));
      else if (opcode === 1) deliver(payload.toString("utf8"));
      else if (opcode === 2) deliver(new Uint8Array(payload));
    }
  });
  return {
    req,
    url: req.url,
    send(data) {
      if (!socket.destroyed) socket.write(typeof data === "string" ? frame(1, data) : data instanceof Uint8Array ? frame(2, data) : frame(1, JSON.stringify(data)));
    },
    next(timeoutMs = 5000) {
      if (queue.length) return Promise.resolve(queue.shift());
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("ws: no message in time")), timeoutMs);
        timer.unref();
        waiters.push((message) => {
          clearTimeout(timer);
          resolve(message);
        });
      });
    },
    async nextJson(predicate = () => true, timeoutMs = 5000) {
      for (;;) {
        const value = JSON.parse(await this.next(timeoutMs));
        if (predicate(value)) return value;
      }
    },
    close() {
      socket.end(frame(8, Buffer.alloc(0)));
    },
  };
}

export async function wsServer(onConnection) {
  const sockets = new Set();
  const server = http.createServer((req, res) => res.writeHead(404).end());
  server.on("upgrade", (req, socket) => {
    const accept = crypto.createHash("sha1").update(`${req.headers["sec-websocket-key"]}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
    socket.write(["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${accept}`, "", ""].join("\r\n"));
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    Promise.resolve(onConnection(client(socket, req))).catch(() => {});
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `ws://127.0.0.1:${port}`,
    close() {
      for (const socket of sockets) socket.destroy();
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

// Route-table HTTP mock: routes["POST /path"] = (body, req, url) => json | {status, json}
export async function httpMock(routes) {
  const calls = [];
  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", async () => {
      const url = new URL(req.url, "http://localhost");
      let body = null;
      try {
        body = raw ? JSON.parse(raw) : null;
      } catch {
        body = raw;
      }
      calls.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers, body, raw });
      const handler = routes[`${req.method} ${url.pathname}`];
      if (!handler) {
        res.writeHead(404, { "content-type": "application/json" }).end("{}");
        return;
      }
      const result = await handler(body, req, url);
      const status = result?.__status || 200;
      res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(result?.__status ? result.json : result));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    calls,
    find: (method, path) => calls.filter((call) => call.method === method && call.path === path),
    close: () => new Promise((resolve) => {
      server.closeAllConnections?.();
      server.close(resolve);
    }),
  };
}

export async function until(check, { timeoutMs = 5000, stepMs = 10 } = {}) {
  const started = Date.now();
  for (;;) {
    const value = await check();
    if (value) return value;
    if (Date.now() - started > timeoutMs) throw new Error("until: timed out");
    await new Promise((resolve) => setTimeout(resolve, stepMs));
  }
}
