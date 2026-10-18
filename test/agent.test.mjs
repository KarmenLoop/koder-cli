import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { openAgent } from "../src/agent.mjs";
import { cli, mockModel, scripted, textStep, tmp, toolStep, write } from "./helpers.mjs";

test("a rejected edit stays off disk; the diff is shown first", async () => {
  const dir = tmp();
  write(dir, { "a.txt": "old\n" });
  const model = scripted([toolStep("write_file", { path: "a.txt", content: "new\n" }, "准备改"), textStep("没有改。")]);
  const result = await cli(["run", "改一下 a.txt", "-w", dir], { provider: model, decide: () => ({ accept: false }) });
  assert.equal(result.code, 0);
  assert.match(result.out, /准备修改 a\.txt/);
  assert.match(result.out, /- old/);
  assert.match(result.out, /\+ new/);
  assert.match(result.out, /没有写入 a\.txt/);
  assert.equal(fs.readFileSync(path.join(dir, "a.txt"), "utf8"), "old\n");
});

test("--yes writes the accepted edit", async () => {
  const dir = tmp();
  const model = scripted([toolStep("write_file", { path: "out.txt", content: "hello" }), textStep("写好了。")]);
  const result = await cli(["--yes", "-w", dir, "写一个文件"], { provider: model });
  assert.equal(result.code, 0, result.err);
  assert.equal(fs.readFileSync(path.join(dir, "out.txt"), "utf8"), "hello");
  assert.match(result.out, /写好了/);
});

test("without a terminal and without --yes, edits and commands are rejected", async () => {
  const dir = tmp();
  const marker = path.join(dir, "ran.txt");
  const model = scripted([toolStep("shell", { command: `printf ran > ${JSON.stringify(marker)}` }), toolStep("write_file", { path: "x.txt", content: "x" }), textStep("都没做。")]);
  const result = await cli(["run", "跑命令再写文件", "-w", dir], { provider: model });
  assert.equal(result.code, 0);
  assert.match(result.err, /非交互环境没有 --yes/);
  assert.equal(fs.existsSync(marker), false);
  assert.equal(fs.existsSync(path.join(dir, "x.txt")), false);
});

test("an allowed command runs and its output goes back to the model", async () => {
  const dir = tmp();
  const model = scripted([toolStep("shell", { command: "echo koder-ok" }), ({ messages }) => textStep(messages.some((m) => m.role === "tool" && /koder-ok/.test(m.content)) ? "看到了输出" : "没看到")]);
  const result = await cli(["run", "跑一下", "-w", dir, "-y"], { provider: model });
  assert.equal(result.code, 0);
  assert.match(result.out, /看到了输出/);
});

test("ask is read-only: the model is offered no mutating tools", async () => {
  const dir = tmp();
  write(dir, { "src/app.js": "export const x = 1;\n" });
  const model = scripted([toolStep("read_file", { path: "src/app.js" }), textStep("x 是 1")]);
  const result = await cli(["ask", "x 是多少", "-w", dir], { provider: model });
  assert.equal(result.code, 0);
  const names = model.calls[0].tools.map((tool) => tool.name);
  assert.ok(names.includes("read_file"));
  assert.equal(names.includes("write_file"), false);
  assert.equal(names.includes("shell"), false);
  assert.match(result.out, /x 是 1/);
});

test("piped stdin is attached to the prompt", async () => {
  const dir = tmp();
  const model = scripted([textStep("收到")]);
  await cli(["ask", "总结这段", "-w", dir], { provider: model, stdin: "diff --git a/x b/x\n+added line\n" });
  const user = model.calls[0].messages.find((m) => m.role === "user");
  assert.match(user.content, /总结这段/);
  assert.match(user.content, /<stdin>[\s\S]*\+added line/);
});

test("--json prints one parseable event per line and a final result", async () => {
  const dir = tmp();
  const model = scripted([toolStep("write_file", { path: "j.txt", content: "j" }, "", "c1"), textStep("完成")]);
  const result = await cli(["run", "写 j", "--json", "--yes", "-w", dir], { provider: model });
  const events = result.out.trim().split("\n").map((line) => JSON.parse(line));
  assert.deepEqual(events.map((e) => e.type), ["assistant", "pause", "decision", "tool_result", "assistant", "result"]);
  assert.equal(events[1].kind, "change");
  assert.equal(events[1].path, "j.txt");
  assert.equal(events.at(-1).exitCode, 0);
  assert.equal(events.at(-1).text, "完成");
});

test("login requests are cancelled instead of collecting a password (exit 1)", async () => {
  const dir = tmp();
  const model = scripted([toolStep("request_login", { service: "邮箱" })]);
  const result = await cli(["run", "登录", "-y", "-w", dir], { provider: model });
  assert.equal(result.code, 1);
  assert.match(result.out, /不收集账号密码/);
});

test("end to end over HTTP: saved model record, streamed reply, real context window", async () => {
  const server = await mockModel([textStep("你好，我是 Koder，流式输出正常。")], { stream: true });
  try {
    const home = tmp();
    fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ name: "mock", model: "mock-1", baseUrl: server.url, auth: "none", contextWindow: 200000, maxOutput: 4096 }));
    const dir = tmp();
    const result = await cli(["ask", "你好", "-w", dir], { home });
    assert.equal(result.code, 0, result.err);
    assert.match(result.out, /你好，我是 Koder，流式输出正常。/);
    assert.equal(server.requests.length, 1);
    assert.equal(server.requests[0].body.model, "mock-1");
    assert.equal(server.requests[0].headers.authorization, undefined);
  } finally {
    await server.close();
  }
});

test("the harness budget follows the model record, not the 8192 default", async () => {
  const harness = await openAgent({ workspace: tmp(), record: { name: "big", model: "big", baseUrl: "http://127.0.0.1:9/v1", protocol: "openai", auth: "none", apiKey: "", contextWindow: 1_000_000, maxOutput: 8192 } });
  assert.equal(harness.store.providers()[0].contextWindow, 1_000_000);
  assert.equal(harness.store.settings().providerId, "cli");
});

test("HTTP errors are reported with the status code (exit 2)", async () => {
  const server = await mockModel([textStep("x")], { status: 401 });
  try {
    const dir = tmp();
    const result = await cli(["ask", "你好", "-w", dir], { env: { KODER_MODEL: "m", KODER_BASE_URL: server.url, KODER_API_KEY: "bad" } });
    assert.equal(result.code, 2);
    assert.match(result.out, /目前无法连接到 API/);
    assert.match(result.err, /HTTP 401/);
    assert.equal(server.requests[0].headers.authorization, "Bearer bad");
  } finally {
    await server.close();
  }
});
