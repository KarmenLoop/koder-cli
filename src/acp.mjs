import path from "node:path";
import { fileURLToPath } from "node:url";
import { MODES, createSession } from "./session.mjs";

// Agent Client Protocol v1: newline-delimited JSON-RPC 2.0 over stdio.
export const PROTOCOL_VERSION = 1;

const KIND = {
  read_file: "read", list_dir: "read", search: "search", str_replace: "edit", write_file: "edit",
  workspace_report: "edit", shell: "execute", ask_user: "think", request_login: "other",
};

const MODE_NAMES = {
  zh: { standard: "标准", code: "代码", minimal: "极简", plan: "计划", execute: "执行", report: "报告", enhance: "增强提示词" },
  en: { standard: "Standard", code: "Code", minimal: "Minimal", plan: "Plan", execute: "Execute", report: "Report", enhance: "Enhance prompt" },
};

class RpcError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function toAbsolute(cwd, file) {
  if (!file) return null;
  return path.isAbsolute(file) ? file : path.join(cwd, file);
}

function promptText(blocks, cwd) {
  const parts = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    if (block?.type === "text") parts.push(String(block.text || ""));
    else if (block?.type === "resource_link") {
      const uri = String(block.uri || "");
      const file = uri.startsWith("file://") ? fileURLToPath(uri) : null;
      const rel = file ? path.relative(cwd, file) : "";
      parts.push(rel && !rel.startsWith("..") ? `@${rel.split(path.sep).join("/")}` : uri);
    } else if (block?.type === "resource" && block.resource) {
      const { uri = "", text } = block.resource;
      if (typeof text === "string") parts.push(`<file uri="${uri}">\n${text}\n</file>`);
    }
  }
  return parts.join("\n").trim();
}

function title(call) {
  const args = call.arguments || {};
  const detail = args.path || args.query || args.command || args.question || "";
  return `${call.name}${detail ? ` ${String(detail).slice(0, 120)}` : ""}`;
}

export function createAcpServer(ctx, { input, output, sessionFactory = createSession } = {}) {
  const sessions = new Map();
  const pending = new Map();
  let nextId = 1;
  let buffer = "";
  let closed = false;
  let resolveDone;
  const done = new Promise((resolve) => {
    resolveDone = resolve;
  });

  const send = (message) => {
    if (!closed) output.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);
  };
  const notify = (method, params) => send({ method, params });
  const request = (method, params) => new Promise((resolve, reject) => {
    const id = `koder-${nextId++}`;
    pending.set(id, { resolve, reject });
    send({ id, method, params });
  });
  const update = (sessionId, value) => notify("session/update", { sessionId, update: value });

  function permissionOptions(kind) {
    const zh = ctx.lang === "zh";
    return [
      { optionId: "allow", name: kind === "execute" ? (zh ? "允许运行" : "Allow") : zh ? "接受修改" : "Accept", kind: "allow_once" },
      { optionId: "reject", name: zh ? "拒绝" : "Reject", kind: "reject_once" },
    ];
  }

  async function decideFor(entry, pause) {
    const cwd = entry.cwd;
    if (pause.kind === "secret") return { cancel: true };
    if (pause.kind === "choice") {
      const options = pause.options.map((option, index) => ({ optionId: `choice-${index}`, name: option, kind: "allow_once" }));
      const reply = await request("session/request_permission", {
        sessionId: entry.id,
        toolCall: { toolCallId: pause.toolCallId || pause.id, title: pause.question, kind: "think", status: "pending" },
        options,
      });
      const picked = reply?.outcome?.outcome === "selected" ? /^choice-(\d+)$/.exec(reply.outcome.optionId || "") : null;
      return picked ? { index: Number(picked[1]) } : { cancel: true };
    }
    const kind = pause.kind === "approval" ? "execute" : "edit";
    const toolCall = {
      toolCallId: pause.toolCallId || pause.id,
      title: pause.kind === "approval" ? pause.command : pause.path,
      kind,
      status: "pending",
    };
    if (pause.kind === "change") {
      const file = toAbsolute(cwd, pause.path);
      toolCall.content = [{ type: "diff", path: file, oldText: pause.before === "" ? null : pause.before, newText: pause.after }];
      toolCall.locations = [{ path: file }];
    } else {
      toolCall.rawInput = { command: pause.command };
    }
    const reply = await request("session/request_permission", { sessionId: entry.id, toolCall, options: permissionOptions(kind) });
    if (reply?.outcome?.outcome !== "selected") return { cancel: true };
    const accept = reply.outcome.optionId === "allow";
    if (!accept) entry.rejected.add(toolCall.toolCallId);
    return { accept };
  }

  function forward(entry, event) {
    const sessionId = entry.id;
    if (event.type === "delta") {
      update(sessionId, { sessionUpdate: "agent_message_chunk", content: { type: "text", text: event.text } });
      return;
    }
    if (event.type !== "message") return;
    const message = event.message;
    if (message.role === "assistant") {
      const rest = String(message.content || "").slice(event.streamed || 0);
      if (rest) update(sessionId, { sessionUpdate: "agent_message_chunk", content: { type: "text", text: rest } });
      for (const call of message.toolCalls || []) {
        const file = toAbsolute(entry.cwd, call.arguments?.path);
        update(sessionId, {
          sessionUpdate: "tool_call",
          toolCallId: call.id,
          title: title(call),
          kind: KIND[call.name] || "other",
          status: "in_progress",
          rawInput: call.arguments || {},
          ...(file ? { locations: [{ path: file }] } : {}),
        });
      }
    } else if (message.role === "tool") {
      const failed = entry.rejected.has(message.toolCallId);
      update(sessionId, {
        sessionUpdate: "tool_call_update",
        toolCallId: message.toolCallId,
        status: failed ? "failed" : "completed",
        content: [{ type: "content", content: { type: "text", text: String(message.content || "").slice(0, 20_000) } }],
      });
    } else if (message.role === "notice") {
      const text = message.code === "API_UNREACHABLE" ? ctx.t("model.missing") : String(message.content || "");
      update(sessionId, { sessionUpdate: "agent_message_chunk", content: { type: "text", text } });
    }
  }

  const handlers = {
    initialize() {
      return {
        protocolVersion: PROTOCOL_VERSION,
        agentCapabilities: {
          loadSession: false,
          promptCapabilities: { image: false, audio: false, embeddedContext: true },
          mcpCapabilities: { http: false, sse: false },
        },
        authMethods: [],
        agentInfo: { name: "koder", title: "Koder", version: ctx.version },
      };
    },
    authenticate() {
      return {};
    },
    async "session/new"(params) {
      const cwd = path.resolve(String(params?.cwd || ctx.cwd));
      const sessionCtx = Object.create(ctx);
      sessionCtx.opts = { ...ctx.opts, workspace: cwd, json: false };
      const mode = ctx.opts.mode || "standard";
      const session = await sessionFactory(sessionCtx, { workspace: cwd, mode, quiet: true, memory: false });
      const id = `koder-session-${nextId++}`;
      sessions.set(id, { id, cwd, session, mode, busy: false, rejected: new Set() });
      return {
        sessionId: id,
        modes: {
          currentModeId: mode,
          availableModes: MODES.map((item) => ({ id: item, name: MODE_NAMES[ctx.lang]?.[item] || item })),
        },
      };
    },
    "session/set_mode"(params) {
      const entry = sessions.get(params?.sessionId);
      if (!entry) throw new RpcError(-32602, "unknown sessionId");
      if (!MODES.includes(params?.modeId)) throw new RpcError(-32602, "unknown modeId");
      entry.mode = params.modeId;
      update(entry.id, { sessionUpdate: "current_mode_update", currentModeId: entry.mode });
      return {};
    },
    async "session/prompt"(params) {
      const entry = sessions.get(params?.sessionId);
      if (!entry) throw new RpcError(-32602, "unknown sessionId");
      if (entry.busy) throw new RpcError(-32000, "a prompt is already running in this session");
      const text = promptText(params?.prompt, entry.cwd);
      if (!text) throw new RpcError(-32602, "empty prompt");
      entry.busy = true;
      entry.cancelled = false;
      try {
        const outcome = await entry.session.turn(text, {
          mode: entry.mode,
          silent: true,
          decide: (pause) => (entry.cancelled ? { cancel: true } : decideFor(entry, pause)),
          onEvent: (event) => forward(entry, event),
        });
        return { stopReason: entry.cancelled || outcome.cancelled ? "cancelled" : "end_turn" };
      } finally {
        entry.busy = false;
      }
    },
  };

  const notifications = {
    "session/cancel"(params) {
      const entry = sessions.get(params?.sessionId);
      if (!entry || !entry.busy) return;
      entry.cancelled = true;
      entry.session.cancel();
    },
  };

  async function handle(message) {
    if (message.id !== undefined && message.method === undefined) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.resolve({ outcome: { outcome: "cancelled" } });
      else waiter.resolve(message.result);
      return;
    }
    if (message.id === undefined) {
      notifications[message.method]?.(message.params);
      return;
    }
    const handler = handlers[message.method];
    if (!handler) {
      send({ id: message.id, error: { code: -32601, message: `Method not found: ${message.method}` } });
      return;
    }
    try {
      send({ id: message.id, result: await handler(message.params || {}) });
    } catch (error) {
      const code = error instanceof RpcError ? error.code : -32603;
      const text = error?.key ? ctx.t(error.key, error.vars) : error?.message || "internal error";
      send({ id: message.id, error: { code, message: text } });
    }
  }

  input.setEncoding?.("utf8");
  input.on("data", (chunk) => {
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
        send({ id: null, error: { code: -32700, message: "Parse error" } });
        continue;
      }
      handle(message);
    }
  });
  input.on("end", () => {
    closed = true;
    for (const waiter of pending.values()) waiter.resolve({ outcome: { outcome: "cancelled" } });
    for (const entry of sessions.values()) if (entry.busy) entry.session.cancel();
    resolveDone();
  });
  return { done, sessions };
}
