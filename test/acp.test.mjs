import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";
import { createAcpServer } from "../src/acp.mjs";
import { createContext } from "../src/cli.mjs";
import { BIN, mockModel, scripted, textStep, tmp, toolStep } from "./helpers.mjs";

function client(provider, { onRequest } = {}) {
  const input = new PassThrough();
  const output = new PassThrough();
  const home = tmp();
  const ctx = createContext({ command: "acp", argv: [], opts: {}, positionals: [], io: { providerOverride: provider, env: { KODER_CLI_HOME: home, NO_COLOR: "1" }, stdin: input, stdout: output, stderr: new PassThrough(), cwd: home } });
  const server = createAcpServer(ctx, { input, output });
  const messages = [];
  const waiters = new Map();
  let buffer = "";
  let id = 0;
  output.on("data", (chunk) => {
    buffer += chunk.toString();
    let index;
    while ((index = buffer.indexOf("\n")) >= 0) {
      const message = JSON.parse(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
      messages.push(message);
      if (message.method && message.id !== undefined) {
        const result = onRequest ? onRequest(message) : { outcome: { outcome: "cancelled" } };
        Promise.resolve(result).then((value) => input.write(`${JSON.stringify({ jsonrpc: "2.0", id: message.id, result: value })}\n`));
      } else if (message.id !== undefined && waiters.has(message.id)) {
        waiters.get(message.id)(message);
        waiters.delete(message.id);
      }
    }
  });
  return {
    messages,
    server,
    request(method, params) {
      id += 1;
      const current = id;
      return new Promise((resolve) => {
        waiters.set(current, resolve);
        input.write(`${JSON.stringify({ jsonrpc: "2.0", id: current, method, params })}\n`);
      });
    },
    notify(method, params) {
      input.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
    },
    close() {
      input.end();
    },
    updates: () => messages.filter((m) => m.method === "session/update").map((m) => m.params.update),
  };
}

test("ACP: initialize, new session with modes, prompt with approved diff, end_turn", async () => {
  const cwd = tmp();
  fs.writeFileSync(path.join(cwd, "a.txt"), "old\n");
  const model = scripted([toolStep("write_file", { path: "a.txt", content: "new\n" }, "我来改。", "w1"), textStep("改好了。")]);
  let permission;
  const c = client(model, { onRequest: (message) => ((permission = message), { outcome: { outcome: "selected", optionId: "allow" } }) });
  const init = await c.request("initialize", { protocolVersion: 1, clientCapabilities: { fs: { readTextFile: true, writeTextFile: true } } });
  assert.equal(init.result.protocolVersion, 1);
  assert.equal(init.result.agentInfo.name, "koder");
  assert.equal(init.result.agentCapabilities.loadSession, false);
  const session = await c.request("session/new", { cwd, mcpServers: [] });
  const sessionId = session.result.sessionId;
  assert.equal(session.result.modes.currentModeId, "standard");
  assert.ok(session.result.modes.availableModes.some((m) => m.id === "code"));
  const prompt = await c.request("session/prompt", { sessionId, prompt: [{ type: "text", text: "把 a.txt 改成 new" }, { type: "resource_link", uri: `file://${path.join(cwd, "a.txt")}`, name: "a.txt" }] });
  assert.equal(prompt.result.stopReason, "end_turn");
  assert.equal(fs.readFileSync(path.join(cwd, "a.txt"), "utf8"), "new\n");
  assert.equal(permission.method, "session/request_permission");
  assert.equal(permission.params.toolCall.toolCallId, "w1");
  assert.deepEqual(permission.params.toolCall.content[0], { type: "diff", path: path.join(cwd, "a.txt"), oldText: "old\n", newText: "new\n" });
  assert.deepEqual(permission.params.options.map((o) => o.kind), ["allow_once", "reject_once"]);
  const updates = c.updates();
  assert.ok(updates.some((u) => u.sessionUpdate === "agent_message_chunk" && /我来改/.test(u.content.text)));
  const call = updates.find((u) => u.sessionUpdate === "tool_call");
  assert.equal(call.toolCallId, "w1");
  assert.equal(call.kind, "edit");
  assert.deepEqual(call.locations, [{ path: path.join(cwd, "a.txt") }]);
  assert.equal(updates.find((u) => u.sessionUpdate === "tool_call_update").status, "completed");
  assert.match(model.calls[0].messages.find((m) => m.role === "user").content, /@a\.txt/);
  c.close();
  await c.server.done;
});

test("ACP: rejected edit is marked failed and the file is untouched", async () => {
  const cwd = tmp();
  const model = scripted([toolStep("write_file", { path: "b.txt", content: "x" }, "", "w2"), textStep("没写。")]);
  const c = client(model, { onRequest: () => ({ outcome: { outcome: "selected", optionId: "reject" } }) });
  await c.request("initialize", { protocolVersion: 1 });
  const { result } = await c.request("session/new", { cwd, mcpServers: [] });
  const prompt = await c.request("session/prompt", { sessionId: result.sessionId, prompt: [{ type: "text", text: "写 b" }] });
  assert.equal(prompt.result.stopReason, "end_turn");
  assert.equal(fs.existsSync(path.join(cwd, "b.txt")), false);
  assert.equal(c.updates().find((u) => u.sessionUpdate === "tool_call_update").status, "failed");
  c.close();
});

test("ACP: session/cancel during a permission request stops the turn as cancelled", async () => {
  const cwd = tmp();
  const model = scripted([toolStep("shell", { command: "echo hi" }, "", "s1"), textStep("不该到这里")]);
  let c;
  let sessionId;
  c = client(model, {
    onRequest: () => {
      c.notify("session/cancel", { sessionId });
      return { outcome: { outcome: "cancelled" } };
    },
  });
  await c.request("initialize", { protocolVersion: 1 });
  sessionId = (await c.request("session/new", { cwd, mcpServers: [] })).result.sessionId;
  const prompt = await c.request("session/prompt", { sessionId, prompt: [{ type: "text", text: "跑命令" }] });
  assert.equal(prompt.result.stopReason, "cancelled");
  c.close();
});

test("ACP: set_mode, unknown method, unknown session", async () => {
  const c = client(scripted([textStep("x")]));
  await c.request("initialize", { protocolVersion: 1 });
  const { result } = await c.request("session/new", { cwd: tmp(), mcpServers: [] });
  const mode = await c.request("session/set_mode", { sessionId: result.sessionId, modeId: "plan" });
  assert.deepEqual(mode.result, {});
  assert.ok(c.updates().some((u) => u.sessionUpdate === "current_mode_update" && u.currentModeId === "plan"));
  assert.equal((await c.request("session/load", {})).error.code, -32601);
  assert.equal((await c.request("session/prompt", { sessionId: "nope", prompt: [] })).error.code, -32602);
  c.close();
});

test("ACP over a real stdio subprocess with an HTTP model: only protocol frames on stdout", async () => {
  const server = await mockModel([textStep("来自子进程的回复")]);
  const home = tmp();
  const cwd = tmp();
  fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ model: "mock", baseUrl: server.url, auth: "none" }));
  const child = spawn(process.execPath, [BIN, "acp"], { env: { PATH: process.env.PATH, KODER_CLI_HOME: home, NO_COLOR: "1" }, stdio: ["pipe", "pipe", "pipe"] });
  const lines = [];
  let buffer = "";
  const waiters = new Map();
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 1);
      lines.push(line);
      const message = JSON.parse(line);
      waiters.get(message.id)?.(message);
    }
  });
  const call = (id, method, params) => new Promise((resolve) => {
    waiters.set(id, resolve);
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
  try {
    assert.equal((await call(1, "initialize", { protocolVersion: 1 })).result.protocolVersion, 1);
    const sessionId = (await call(2, "session/new", { cwd, mcpServers: [] })).result.sessionId;
    const prompt = await call(3, "session/prompt", { sessionId, prompt: [{ type: "text", text: "你好" }] });
    assert.equal(prompt.result.stopReason, "end_turn");
    assert.ok(lines.every((line) => JSON.parse(line).jsonrpc === "2.0"));
    assert.ok(lines.some((line) => /来自子进程的回复/.test(line)));
  } finally {
    child.stdin.end();
    await new Promise((resolve) => child.on("close", resolve));
    await server.close();
  }
  assert.equal(child.exitCode, 0);
});
