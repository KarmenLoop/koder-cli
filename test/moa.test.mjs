import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createMoaProvider, guidanceBlock, redact, referenceView } from "../src/moa.mjs";
import { cli, mockModel, scripted, textStep, tmp, toolStep } from "./helpers.mjs";

test("reference view: text only, tool calls and results folded, ends on a user turn", () => {
  const view = referenceView([
    { role: "system", content: "sys" },
    { role: "user", content: "修 bug" },
    { role: "assistant", content: "先看看", toolCalls: [{ id: "1", name: "read_file", arguments: { path: "a.js" } }] },
    { role: "tool", toolCallId: "1", content: "file body" },
  ], "zh");
  assert.deepEqual(view.map((m) => m.role), ["user", "assistant", "user"]);
  assert.match(view[1].content, /\[调用工具: read_file\(\{"path":"a\.js"\}\)\]/);
  assert.match(view[1].content, /\[工具结果: file body\]/);
  assert.match(view[2].content, /当前状态/);
});

test("privacy redaction hides secrets, emails and delimited phones but not dates or line numbers", () => {
  const text = redact("key sk-abcdefghijklmnopqrstuv mail a.b@example.com tel 555-123-4567 date 2026-10-17 line 1234567");
  assert.match(text, /\[redacted secret\]/);
  assert.match(text, /\[redacted email\]/);
  assert.match(text, /\[redacted phone\]/);
  assert.match(text, /2026-10-17/);
  assert.match(text, /1234567/);
});

test("guidance block: references, unavailable note, all-failed fallback", () => {
  assert.match(guidanceBlock({ outputs: [{ label: "kimi", text: "建议 A" }], failed: ["qwen"], stale: false, lang: "zh" }), /参考 1 — kimi:\n建议 A[\s\S]*不可用的参考模型: qwen/);
  assert.match(guidanceBlock({ outputs: [], failed: ["a", "b"], stale: false, lang: "en" }), /All reference models failed/);
});

test("MoA provider: references run once per user turn without tools; later steps reuse guidance marked stale", async () => {
  const refA = scripted([textStep("先读 a.js")]);
  const refB = scripted([textStep("注意并发")]);
  const aggregator = scripted([textStep("ok")]);
  const events = [];
  const moa = createMoaProvider({ aggregator, references: [{ label: "a", provider: refA }, { label: "b", provider: refB }], lang: "zh", onEvent: (e) => events.push(e) });
  const first = [{ role: "system", content: "sys" }, { role: "user", content: "修 bug" }];
  await moa.complete({ messages: first, tools: [{ name: "read_file" }] });
  assert.equal(refA.calls.length, 1);
  assert.deepEqual(refA.calls[0].tools, []);
  assert.match(refA.calls[0].messages[0].content, /参考顾问/);
  const aggSystem = aggregator.calls[0].messages[0].content;
  assert.match(aggSystem, /^sys\n\n## Mixture of Agents 参考意见/);
  assert.match(aggSystem, /参考 1 — a:\n先读 a\.js/);
  assert.match(aggSystem, /参考 2 — b:\n注意并发/);
  assert.doesNotMatch(aggSystem, /早于下面的工具结果/);
  assert.deepEqual(aggregator.calls[0].tools, [{ name: "read_file" }]);
  const second = [...first, { role: "assistant", content: "", toolCalls: [{ id: "1", name: "read_file", arguments: { path: "a.js" } }] }, { role: "tool", toolCallId: "1", content: "x" }];
  await moa.complete({ messages: second, tools: [] });
  assert.equal(refA.calls.length, 1, "no second fan-out inside the same user turn");
  assert.match(aggregator.calls[1].messages[0].content, /早于下面的工具结果/);
  await moa.complete({ messages: [...second, { role: "assistant", content: "done" }, { role: "user", content: "再看看 b.js" }], tools: [] });
  assert.equal(refA.calls.length, 2, "a new user turn fans out again");
  assert.deepEqual(events.filter((e) => e.type === "moa_done").map((e) => e.ok), [2, 2]);
});

test("MoA provider: a failing reference is reported and the turn continues", async () => {
  const broken = { async complete() { throw new Error("HTTP 500"); } };
  const aggregator = scripted([textStep("ok")]);
  const events = [];
  const moa = createMoaProvider({ aggregator, references: [{ label: "good", provider: scripted([textStep("建议")]) }, { label: "bad", provider: broken }], onEvent: (e) => events.push(e) });
  const result = await moa.complete({ messages: [{ role: "user", content: "hi" }], tools: [] });
  assert.equal(result.text, "ok");
  assert.deepEqual(events.at(-1).failed, ["bad"]);
  assert.match(aggregator.calls[0].messages[0].content, /不可用的参考模型: bad/);
});

test("end to end over HTTP: --moa sends two reference requests and one aggregated request", async () => {
  const refA = await mockModel([textStep("参考A：先检查输入")]);
  const refB = await mockModel([textStep("参考B：注意边界")]);
  const agg = await mockModel([textStep("综合两位意见：先校验输入再处理边界。")]);
  try {
    const home = tmp();
    fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ model: "agg", baseUrl: agg.url, auth: "none", contextWindow: 128000 }));
    for (const [name, server] of [["refa", refA], ["refb", refB]]) {
      const set = await cli(["model", "add", name, "--base-url", server.url, "--model", name], { home, env: { REFA_KEY: "k" } });
      assert.equal(set.code, 2, "a key or auth none is required");
      fs.mkdirSync(path.join(home, "models"), { recursive: true });
      fs.writeFileSync(path.join(home, "models", `${name}.json`), JSON.stringify({ model: name, baseUrl: server.url, auth: "none" }));
    }
    const preset = await cli(["moa", "set", "--refs", "refa,refb"], { home });
    assert.equal(preset.code, 0, preset.err);
    const missing = await cli(["moa", "set", "other", "--refs", "nope"], { home });
    assert.match(missing.err, /没有这个模型：nope/);
    const result = await cli(["ask", "怎么处理用户输入？", "--moa", "-w", tmp()], { home });
    assert.equal(result.code, 0, result.err);
    assert.match(result.out, /MoA：请 2 个参考模型分析（refa, refb）/);
    assert.match(result.out, /MoA：2\/2 个参考完成/);
    assert.match(result.out, /综合两位意见/);
    assert.equal(refA.requests.length, 1);
    assert.equal(refA.requests[0].body.tools, undefined);
    assert.match(refA.requests[0].body.messages[0].content, /参考顾问/);
    const aggSystem = agg.requests[0].body.messages[0].content;
    assert.match(aggSystem, /参考A：先检查输入/);
    assert.match(aggSystem, /参考B：注意边界/);
    assert.ok(agg.requests[0].body.tools.some((tool) => tool.function.name === "read_file"));
    const json = await cli(["ask", "再问一次", "--moa", "--json", "-w", tmp()], { home });
    const events = json.out.trim().split("\n").map((line) => JSON.parse(line)).filter((event) => event.type === "moa");
    assert.deepEqual(events.map((event) => event.phase), ["start", "done"]);
  } finally {
    await Promise.all([refA.close(), refB.close(), agg.close()]);
  }
});

test("models: add, list, use and fall back to the default", async () => {
  const home = tmp();
  await cli(["model", "set", "--preset", "deepseek", "--key-env", "DS_KEY"], { home });
  await cli(["model", "add", "kimi", "--preset", "kimi", "--key-env", "KIMI_KEY"], { home });
  const list = await cli(["model", "list"], { home, env: { DS_KEY: "a", KIMI_KEY: "b" } });
  assert.match(list.out, /\* default/);
  assert.match(list.out, /kimi\s+kimi-k3/);
  await cli(["model", "use", "kimi"], { home });
  const shown = await cli(["model", "show"], { home, env: { KIMI_KEY: "b" } });
  assert.match(shown.out, /kimi-k3/);
  const bad = await cli(["model", "add", "bad name"], { home });
  assert.match(bad.err, /模型名只能用/);
});

test('a timed-out reference aborts its request and releases the parent listener', async () => {
  const { getEventListeners } = await import('node:events');
  const parent = new AbortController();
  let referenceSignal;
  const reference = { complete({ signal }) { referenceSignal = signal; return new Promise(() => {}); } };
  const aggregator = scripted([textStep('continue')]);
  const moa = createMoaProvider({ aggregator, references: [{ label: 'slow', provider: reference }], timeoutMs: 15 });
  const result = await moa.complete({ messages: [{ role: 'user', content: 'hi' }], tools: [], signal: parent.signal });
  assert.equal(result.text, 'continue');
  assert.equal(referenceSignal.aborted, true);
  assert.equal(parent.signal.aborted, false);
  assert.equal(getEventListeners(parent.signal, 'abort').length, 0);
});

test('cancelling MoA aborts references and never calls aggregator', async () => {
  const parent = new AbortController();
  let referenceSignal;
  const reference = { complete({ signal }) { referenceSignal = signal; parent.abort(); return new Promise(() => {}); } };
  const aggregator = scripted([textStep('wrong')]);
  const moa = createMoaProvider({ aggregator, references: [{ label: 'ref', provider: reference }] });
  await assert.rejects(moa.complete({ messages: [{ role: 'user', content: 'hi' }], tools: [], signal: parent.signal }), { name: 'AbortError' });
  assert.equal(referenceSignal.aborted, true);
  assert.equal(aggregator.calls.length, 0);
});
