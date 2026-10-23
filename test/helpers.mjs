import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { PassThrough, Writable } from "node:stream";
import { fileURLToPath } from "node:url";
import { protectOwnedFixture, fixtureEnv } from "./windows-fixtures.mjs";
import { runCli } from "../src/cli.mjs";
import { writeAcceptance } from "../src/eula.mjs";

export const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "bin", "koder.mjs");

export function capture() {
  let text = "";
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      text += chunk.toString();
      callback();
    },
  });
  return { stream, read: () => text };
}

export function tmp(prefix = "koder-cli-") {
  return protectOwnedFixture(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
}

export function write(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const target = path.join(root, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

export function gitRepo(files = {}) {
  const dir = tmp("koder-repo-");
  const run = (...args) => execFileSync("git", args, { cwd: dir, stdio: "pipe", env: { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@example.invalid", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@example.invalid" } }).toString();
  run("init", "-q", "-b", "main");
  write(dir, files);
  run("add", "-A");
  run("commit", "-q", "-m", "base");
  return { dir, run };
}

// Scripted model: each call returns the next step; a function step receives the request messages.
export function scripted(steps) {
  const calls = [];
  return {
    calls,
    model: "scripted",
    contextWindow: 64_000,
    async complete({ messages, tools, maxOutput }) {
      calls.push({ messages, tools, maxOutput });
      const step = steps[Math.min(calls.length - 1, steps.length - 1)];
      return typeof step === "function" ? step({ messages, tools, maxOutput, index: calls.length - 1 }) : step;
    },
  };
}

export function textStep(text) {
  return { text, toolCalls: [] };
}

export function toolStep(name, args, text = "", id = `call-${name}-${Math.random().toString(36).slice(2, 8)}`) {
  return { text, toolCalls: [{ id, name, arguments: args }] };
}

export async function cli(argv, { cwd, home = tmp("koder-home-"), env = {}, provider, decide, stdin = "", fetchImpl, io = {} } = {}) {
  const out = capture();
  const err = capture();
  const input = new PassThrough();
  input.isTTY = false;
  input.end(stdin);
  const childEnv = fixtureEnv(home, { NO_COLOR: "1", ...env });
  if (process.env.KODER_DESKTOP_ROOT && childEnv.KODER_DESKTOP_ROOT == null) childEnv.KODER_DESKTOP_ROOT = process.env.KODER_DESKTOP_ROOT;
  if (env.KODER_EULA_ACCEPT !== "0") writeAcceptance(childEnv);
  const code = await runCli(argv, {
    stdout: out.stream,
    stderr: err.stream,
    stdin: input,
    cwd: cwd || home,
    env: childEnv,
    providerOverride: provider,
    decide,
    fetchImpl,
    noTerminal: true,
    ...io,
  });
  return { code, out: out.read(), err: err.read(), home };
}

// OpenAI-compatible chat server on 127.0.0.1 for end-to-end tests.
export async function mockModel(steps, { stream = false, status = 200 } = {}) {
  const requests = [];
  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const json = JSON.parse(body || "{}");
      requests.push({ url: req.url, headers: req.headers, body: json });
      if (status !== 200) {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: { message: "nope" } }));
        return;
      }
      const step = steps[Math.min(requests.length - 1, steps.length - 1)];
      const value = typeof step === "function" ? step(json) : step;
      const toolCalls = (value.toolCalls || []).map((call) => ({ id: call.id, type: "function", function: { name: call.name, arguments: JSON.stringify(call.arguments) } }));
      if (stream && !toolCalls.length) {
        res.writeHead(200, { "content-type": "text/event-stream" });
        for (const piece of value.text.match(/.{1,4}/gsu) || []) res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`);
        res.write(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: "stop" }], usage: { prompt_tokens: 10, completion_tokens: 5 } })}\n\n`);
        res.end("data: [DONE]\n\n");
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({
        choices: [{ message: { role: "assistant", content: value.text || "", ...(toolCalls.length ? { tool_calls: toolCalls } : {}) }, finish_reason: toolCalls.length ? "tool_calls" : "stop" }],
        usage: { prompt_tokens: 12, completion_tokens: 6 },
      }));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/v1`,
    requests,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
