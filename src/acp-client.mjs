import { spawn } from "node:child_process";
import path from "node:path";

// ACP client: drives an external agent (e.g. `hermes acp`) over stdio and maps
// its updates and permission requests onto Koder's turn events and approvals.
export function createAcpClient({ command, args = [], env = process.env, cwd, version = "0.2.0", onUpdate = () => {}, onPermission, log = () => {} }) {
  const child = spawn(command, args, { cwd, env, stdio: ["pipe", "pipe", "pipe"] });
  const pending = new Map();
  let nextId = 1;
  let buffer = "";
  let exited = null;
  const exitPromise = new Promise((resolve) => {
    child.on("exit", (code, signal) => {
      exited = { code, signal };
      for (const waiter of pending.values()) waiter.reject(new Error(`agent exited (${code ?? signal})`));
      pending.clear();
      resolve(exited);
    });
    child.on("error", (error) => {
      exited = { code: 127, error };
      for (const waiter of pending.values()) waiter.reject(error);
      pending.clear();
      resolve(exited);
    });
  });
  child.stderr.on("data", (chunk) => log(String(chunk)));
  const send = (message) => {
    if (!exited) child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);
  };
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (!line) continue;
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        log(`non-JSON line from agent: ${line.slice(0, 200)}`);
        continue;
      }
      if (message.method && message.id !== undefined) {
        if (message.method === "session/request_permission" && onPermission) {
          Promise.resolve(onPermission(message.params)).then(
            (result) => send({ id: message.id, result }),
            () => send({ id: message.id, result: { outcome: { outcome: "cancelled" } } }),
          );
        } else {
          send({ id: message.id, error: { code: -32601, message: `Method not supported by Koder CLI: ${message.method}` } });
        }
      } else if (message.method === "session/update") {
        onUpdate(message.params);
      } else if (message.id !== undefined && pending.has(message.id)) {
        const waiter = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) waiter.reject(Object.assign(new Error(message.error.message || "ACP error"), { code: message.error.code }));
        else waiter.resolve(message.result);
      }
    }
  });
  // Hold the event loop only while a request is in flight, so a finished CLI can
  // exit; the agent then sees stdin close and exits too.
  const handles = [child, child.stdin, child.stdout, child.stderr];
  const hold = (on) => handles.forEach((handle) => (on ? handle?.ref?.() : handle?.unref?.()));
  hold(false);
  const request = (method, params) => new Promise((resolve, reject) => {
    if (exited) return reject(new Error("agent is not running"));
    const id = nextId++;
    hold(true);
    const done = () => {
      pending.delete(id);
      if (!pending.size) hold(false);
    };
    pending.set(id, {
      resolve(value) {
        done();
        resolve(value);
      },
      reject(error) {
        done();
        reject(error);
      },
    });
    send({ id, method, params });
  });
  return {
    child,
    exited: exitPromise,
    request,
    notify: (method, params) => send({ method, params }),
    initialize: () => request("initialize", {
      protocolVersion: 1,
      clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false },
      clientInfo: { name: "koder-cli", title: "Koder CLI", version },
    }),
    close() {
      if (!exited) {
        hold(true);
        child.stdin.end();
        const timer = setTimeout(() => !exited && child.kill("SIGTERM"), 2000);
        exitPromise.then(() => clearTimeout(timer));
      }
      return exitPromise;
    },
  };
}

function textOf(content) {
  if (!content) return "";
  if (Array.isArray(content)) return content.map(textOf).join("\n");
  if (content.type === "text") return content.text || "";
  if (content.type === "content") return textOf(content.content);
  if (content.type === "diff") return `${content.path}`;
  return "";
}

// A Koder-style session backed by an ACP agent; same turn() contract as createSession.
export async function createAcpSession(ctx, { command, args = ["acp"], env, workspace, mode, onLog }) {
  let handlers = null;
  const titles = new Map();
  const client = createAcpClient({
    command,
    args,
    env: { ...(env || ctx.env), KODER_ENGINE_DEPTH: "1" },
    cwd: workspace,
    version: ctx.version,
    log: onLog || (() => {}),
    onUpdate(params) {
      const update = params?.update || {};
      if (!handlers) return;
      if (update.sessionUpdate === "agent_message_chunk") {
        const text = textOf(update.content);
        handlers.text += text;
        handlers.emit({ type: "delta", text });
      } else if (update.sessionUpdate === "tool_call") {
        titles.set(update.toolCallId, update.title || update.kind || "tool");
        handlers.emit({ type: "message", message: { role: "assistant", content: "", toolCalls: [{ id: update.toolCallId, name: update.title || update.kind || "tool", arguments: update.rawInput || {} }] }, streamed: 0 });
      } else if (update.sessionUpdate === "tool_call_update" && (update.status === "completed" || update.status === "failed")) {
        handlers.emit({ type: "message", message: { role: "tool", name: titles.get(update.toolCallId) || "tool", toolCallId: update.toolCallId, content: textOf(update.content) || update.status } });
      }
    },
    async onPermission(params) {
      if (!handlers) return { outcome: { outcome: "cancelled" } };
      const call = params.toolCall || {};
      const diff = (call.content || []).find((item) => item.type === "diff");
      const pause = diff
        ? { kind: "change", id: call.toolCallId, path: path.relative(workspace, diff.path || "") || diff.path, before: diff.oldText || "", after: diff.newText || "" }
        : { kind: "approval", id: call.toolCallId, command: call.rawInput?.command || call.title || call.kind || "tool" };
      handlers.emit({ type: "pause", pause });
      const decision = await handlers.decide(pause);
      handlers.emit({ type: "decision", pause, decision: decision?.cancel ? { cancel: true } : { accept: Boolean(decision?.accept) } });
      if (!decision || decision.cancel) return { outcome: { outcome: "cancelled" } };
      const options = params.options || [];
      const pick = decision.accept
        ? options.find((option) => option.kind === "allow_once") || options.find((option) => option.kind === "allow_always")
        : options.find((option) => option.kind === "reject_once") || options.find((option) => option.kind === "reject_always");
      return pick ? { outcome: { outcome: "selected", optionId: pick.optionId } } : { outcome: { outcome: "cancelled" } };
    },
  });
  await client.initialize();
  const created = await client.request("session/new", { cwd: workspace, mcpServers: [] });
  let sessionId = created.sessionId;
  if (mode && created.modes?.availableModes?.some((item) => item.id === mode)) await client.request("session/set_mode", { sessionId, modeId: mode }).catch(() => {});

  return {
    engine: command,
    workspace,
    async reset() {
      sessionId = (await client.request("session/new", { cwd: workspace, mcpServers: [] })).sessionId;
    },
    cancel() {
      client.notify("session/cancel", { sessionId });
    },
    close: () => client.close(),
    async turn(text, { decide, onEvent } = {}) {
      handlers = {
        text: "",
        decide: decide || (() => ({ cancel: true })),
        emit: (event) => onEvent?.(event),
      };
      try {
        const result = await client.request("session/prompt", { sessionId, prompt: [{ type: "text", text }] });
        const cancelled = result?.stopReason === "cancelled";
        return { thread: { status: "idle", messages: [] }, text: handlers.text, cancelled, reason: cancelled ? "turn.cancelled" : "", code: cancelled ? 1 : 0, stopReason: result?.stopReason };
      } finally {
        handlers = null;
      }
    },
  };
}
