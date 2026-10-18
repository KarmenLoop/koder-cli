import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseComment } from "../src/commands/ci.mjs";
import { render, shouldRun, validateFlow } from "../src/commands/flow.mjs";
import { changedSymbols } from "../src/repo.mjs";
import { gate, parseReview } from "../src/workflows.mjs";
import { cli, gitRepo, scripted, textStep, tmp, toolStep, write } from "./helpers.mjs";

const REVIEW_JSON = (findings, summary = "有一个问题") => textStep(`我看完了。\n\n\`\`\`json\n${JSON.stringify({ summary, findings })}\n\`\`\``);

function repoWithChange() {
  const repo = gitRepo({
    "AGENTS.md": "# 规则\n金额一律用整数分，不用浮点。\n",
    "src/price.js": "export function total(items) {\n  return items.reduce((sum, item) => sum + item.cents, 0);\n}\n",
    "src/cart.js": "import { total } from './price.js';\nexport const sum = (cart) => total(cart.items);\n",
  });
  fs.writeFileSync(path.join(repo.dir, "src/price.js"), "export function total(items) {\n  return items.reduce((sum, item) => sum + item.price * 1.0, 0);\n}\n");
  return repo;
}

test("review parsing: last json block, aliases for severity, sorted by severity", () => {
  const parsed = parseReview("前面\n```json\n{\"findings\":[]}\n```\n后面\n```json\n{\"summary\":\"s\",\"findings\":[{\"severity\":\"minor\",\"file\":\"./a.js\",\"line\":\"3\",\"title\":\"t1\"},{\"severity\":\"critical\",\"file\":\"b.js\",\"title\":\"t2\"}]}\n```");
  assert.equal(parsed.parsed, true);
  assert.deepEqual(parsed.findings.map((f) => [f.severity, f.file, f.line]), [["high", "b.js", null], ["low", "a.js", 3]]);
  assert.equal(parseReview("没有结构化结果").parsed, false);
  assert.equal(gate(parsed.findings, "high"), true);
  assert.equal(gate([{ severity: "low" }], "medium"), false);
  assert.equal(gate(parsed.findings, "none"), false);
});

test("changed symbols are extracted from declarations and hunk headers", () => {
  const names = changedSymbols([{ file: "a.js", text: "@@ -1,3 +1,3 @@ function total(items) {\n-  const old = 1;\n+export const applyDiscount = (x) => x;\n+def parse_rows(data):\n" }]).map((s) => s.name);
  assert.deepEqual(names.sort(), ["applyDiscount", "parse_rows", "total"]);
  const inside = changedSymbols([{ file: "p.js", text: "@@ -1,3 +1,3 @@\n export function total(items) {\n-  return 1;\n+  return 2;\n }\n export function untouched() {}\n" }]).map((s) => s.name);
  assert.deepEqual(inside, ["total"]);
});

test("review sends diff, repo rules and call sites; formats text, markdown, json, github", async () => {
  const repo = repoWithChange();
  const finding = { severity: "high", file: "src/price.js", line: 2, title: "金额改成了浮点", detail: "违反 AGENTS.md：金额必须用整数分。", suggestion: "继续用 item.cents。" };
  const model = scripted([REVIEW_JSON([finding])]);
  const text = await cli(["review", "-w", repo.dir], { provider: model });
  assert.equal(text.code, 0, text.err);
  const prompt = model.calls[0].messages.find((m) => m.role === "user").content;
  assert.match(prompt, /working tree vs HEAD/);
  assert.match(prompt, /item\.price \* 1\.0/);
  assert.match(prompt, /金额一律用整数分/);
  assert.match(prompt, /src\/cart\.js:\d+:.*total/);
  assert.deepEqual(model.calls[0].tools.map((t) => t.name).sort(), ["list_dir", "read_file", "search"]);
  assert.match(text.out, /\[高\] src\/price\.js:2  金额改成了浮点/);

  const md = await cli(["review", "-w", repo.dir, "--format", "markdown", "--out", "r.md"], { provider: scripted([REVIEW_JSON([finding])]), cwd: repo.dir });
  assert.match(md.out, /\| 高 \| `src\/price\.js:2` \| 金额改成了浮点 \|/);
  assert.match(fs.readFileSync(path.join(repo.dir, "r.md"), "utf8"), /### Koder 代码审查/);

  const json = await cli(["review", "-w", repo.dir, "--format", "json"], { provider: scripted([REVIEW_JSON([finding])]) });
  assert.equal(JSON.parse(json.out).findings[0].file, "src/price.js");

  const summary = path.join(tmp(), "summary.md");
  const gh = await cli(["review", "-w", repo.dir, "--format", "github", "--fail-on", "high"], { provider: scripted([REVIEW_JSON([finding])]), env: { GITHUB_STEP_SUMMARY: summary } });
  assert.equal(gh.code, 1);
  assert.match(gh.out, /^::error file=src\/price\.js,line=2,title=Koder%3A 金额改成了浮点::/m);
  assert.match(fs.readFileSync(summary, "utf8"), /金额改成了浮点/);
});

test("review against a base branch uses the merge base", async () => {
  const repo = gitRepo({ "a.js": "export const a = 1;\n" });
  repo.run("checkout", "-q", "-b", "feature");
  fs.writeFileSync(path.join(repo.dir, "a.js"), "export const a = 2;\n");
  repo.run("commit", "-qam", "change a");
  const model = scripted([REVIEW_JSON([], "没问题")]);
  const result = await cli(["review", "-w", repo.dir], { provider: model });
  assert.equal(result.code, 0);
  const prompt = model.calls[0].messages.find((m) => m.role === "user").content;
  assert.match(prompt, /main\.\.\.HEAD/);
  assert.match(prompt, /\+export const a = 2;/);
  assert.match(result.out, /没有发现需要报告的问题/);
});

test("review with nothing changed and outside git", async () => {
  const repo = gitRepo({ "a.js": "1\n" });
  const none = await cli(["review", "--staged", "-w", repo.dir], { provider: scripted([textStep("x")]) });
  assert.equal(none.code, 0);
  assert.match(none.out, /没有找到要审查的改动/);
  const outside = await cli(["review", "-w", tmp()], { provider: scripted([textStep("x")]) });
  assert.equal(outside.code, 2);
  assert.match(outside.err, /不是 Git 仓库/);
});

test("review --fix applies the fix and --check verifies it", async () => {
  const repo = repoWithChange();
  write(repo.dir, { "check.mjs": "import fs from 'node:fs'; process.exit(fs.readFileSync('src/price.js','utf8').includes('cents') ? 0 : 1);\n" });
  const fixed = "export function total(items) {\n  return items.reduce((sum, item) => sum + item.cents, 0);\n}\n";
  const model = scripted([
    REVIEW_JSON([{ severity: "high", file: "src/price.js", line: 2, title: "浮点金额" }]),
    toolStep("write_file", { path: "src/price.js", content: fixed }),
    textStep("改回整数分。"),
  ]);
  const result = await cli(["review", "--fix", "--check", "node check.mjs", "--yes", "-w", repo.dir], { provider: model });
  assert.equal(result.code, 0, result.out + result.err);
  assert.equal(fs.readFileSync(path.join(repo.dir, "src/price.js"), "utf8"), fixed);
  assert.match(result.out, /检查通过/);
});

test("fix loops until the check passes", async () => {
  const dir = tmp();
  write(dir, { "check.mjs": "import fs from 'node:fs'; const v = fs.readFileSync('v.txt','utf8').trim(); console.log('value=' + v); process.exit(v === 'ok' ? 0 : 1);\n", "v.txt": "bad\n" });
  const model = scripted([
    ({ messages }) => {
      const prompt = messages.find((m) => m.role === "user").content;
      assert.match(prompt, /value=bad/);
      return toolStep("write_file", { path: "v.txt", content: "still-bad\n" });
    },
    textStep("第一次"),
    toolStep("write_file", { path: "v.txt", content: "ok\n" }),
    textStep("第二次"),
  ]);
  const result = await cli(["fix", "--check", "node check.mjs", "--yes", "-w", dir], { provider: model });
  assert.equal(result.code, 0, result.out);
  assert.match(result.out, /第 1\/3 次修复/);
  assert.match(result.out, /第 2\/3 次修复/);
  assert.match(result.out, /检查通过/);
});

test("fix gives up after the allowed attempts (exit 1) and passes immediately when green", async () => {
  const dir = tmp();
  write(dir, { "fail.mjs": "process.exit(3);\n", "ok.mjs": "process.exit(0);\n" });
  const model = scripted([textStep("试过了")]);
  const failed = await cli(["fix", "--check", "node fail.mjs", "--attempts", "2", "--yes", "-w", dir], { provider: model });
  assert.equal(failed.code, 1);
  assert.match(failed.out, /修复 2 次后检查仍然失败/);
  const green = await cli(["fix", "--check", "node ok.mjs", "-w", dir], { provider: scripted([textStep("不该被调用")]) });
  assert.equal(green.code, 0);
  assert.match(green.out, /检查通过/);
});

test("test generation targets changed source files and follows existing tests", async () => {
  const repo = gitRepo({ "src/math.js": "export const add = (a, b) => a + b;\n", "test/old.test.js": "// existing\n" });
  fs.writeFileSync(path.join(repo.dir, "src/math.js"), "export const add = (a, b) => a + b;\nexport const sub = (a, b) => a - b;\n");
  const model = scripted([toolStep("write_file", { path: "test/math.test.js", content: "// sub test\n" }), textStep("补好了")]);
  const result = await cli(["test", "--yes", "-w", repo.dir], { provider: model });
  assert.equal(result.code, 0, result.err);
  assert.match(result.out, /为以下文件生成测试：src\/math\.js/);
  assert.match(model.calls[0].messages.find((m) => m.role === "user").content, /沿用同样的测试框架/);
  assert.ok(fs.existsSync(path.join(repo.dir, "test/math.test.js")));
});

test("flow validation, conditions and templates", () => {
  assert.throws(() => validateFlow({ steps: [] }), (e) => e.key === "flow.bad");
  assert.throws(() => validateFlow({ steps: [{ id: "a", type: "shell" }] }), (e) => /a\.run/.test(e.vars.message));
  assert.throws(() => validateFlow({ steps: [{ parallel: [{ id: "f", type: "fix" }] }] }), (e) => /only shell, ask, review/.test(e.vars.message));
  assert.throws(() => validateFlow({ steps: [{ id: "a", type: "shell", run: "x" }, { id: "a", type: "shell", run: "y" }] }), (e) => /duplicate/.test(e.vars.message));
  const results = new Map([["unit", { status: "failed", code: 1, output: "boom", continueOnError: true }]]);
  assert.equal(shouldRun("unit.failed", results), true);
  assert.equal(shouldRun("unit.passed", results), false);
  assert.equal(shouldRun("success", results), true);
  assert.equal(shouldRun("failure", results), true);
  assert.equal(render("退出码 {{unit.code}}：{{unit.output}}", results), "退出码 1：boom");
});

test("flow run: shell steps, conditional fix, parallel read-only steps, summary", async () => {
  const dir = tmp();
  write(dir, {
    "check.mjs": "import fs from 'node:fs'; process.exit(fs.existsSync('done.txt') ? 0 : 1);\n",
    ".koder/flows/gate.json": JSON.stringify({
      name: "gate",
      approve: "auto",
      steps: [
        { id: "unit", type: "shell", run: "node check.mjs", continueOnError: true },
        { id: "repair", type: "fix", check: "node check.mjs", when: "unit.failed" },
        { parallel: [{ id: "echo", type: "shell", run: "echo parallel-ok" }, { id: "note", type: "ask", prompt: "修复结果：{{repair.status}}" }] },
        { id: "never", type: "shell", run: "echo no", when: "unit.passed" },
      ],
    }),
  });
  const model = scripted([
    toolStep("write_file", { path: "done.txt", content: "1" }),
    textStep("加上了 done.txt"),
    ({ messages }) => textStep(`说明：${messages.find((m) => m.role === "user").content}`),
  ]);
  const result = await cli(["flow", "run", "gate", "-w", dir], { provider: model, cwd: dir });
  assert.equal(result.code, 0, result.out + result.err);
  assert.match(result.out, /unit 失败/);
  assert.match(result.out, /repair 通过/);
  assert.match(result.out, /echo 通过/);
  assert.match(result.out, /跳过 never/);
  assert.match(result.out, /note 通过/);
  assert.match(result.out, /流程结束：3 通过，1 失败，1 跳过/);
  assert.doesNotMatch(result.out, /^- $/m);
  assert.ok(fs.existsSync(path.join(dir, "done.txt")));
});

test("flow init writes a valid sample and refuses to overwrite", async () => {
  const dir = tmp();
  const first = await cli(["flow", "init", "-w", dir]);
  assert.equal(first.code, 0);
  const sample = JSON.parse(fs.readFileSync(path.join(dir, ".koder/flows/pr-gate.json"), "utf8"));
  assert.doesNotThrow(() => validateFlow(sample));
  const again = await cli(["flow", "init", "-w", dir]);
  assert.equal(again.code, 1);
  const list = await cli(["flow", "list", "-w", dir]);
  assert.match(list.out, /pr-gate\.json/);
});

test("ci: comment parsing, workflow template, trust gate", async () => {
  assert.deepEqual(parseComment("请看看\n/koder fix 空指针"), { verb: "fix", rest: "空指针" });
  assert.deepEqual(parseComment("/koder"), { verb: "review", rest: "" });
  assert.deepEqual(parseComment("/koder 审查 并发"), { verb: "review", rest: "并发" });
  assert.equal(parseComment("lgtm"), null);
  const dir = tmp();
  const init = await cli(["ci", "init", "-w", dir]);
  assert.equal(init.code, 0);
  const workflow = fs.readFileSync(path.join(dir, ".github/workflows/koder.yml"), "utf8");
  assert.match(workflow, /contains\(fromJSON\('\["OWNER","MEMBER","COLLABORATOR"\]'\), github\.event\.comment\.author_association\)/);
  assert.match(workflow, /koder ci comment --out koder-reply\.md/);
  assert.match(workflow, /KODER_LANG: zh/);
  const event = path.join(dir, "event.json");
  fs.writeFileSync(event, JSON.stringify({ comment: { body: "/koder fix", author_association: "NONE" } }));
  const denied = await cli(["ci", "comment", "--event", event, "-w", dir], { provider: scripted([textStep("不应调用")]) });
  assert.equal(denied.code, 0);
  assert.match(denied.out, /只有 OWNER、MEMBER、COLLABORATOR/);
});

test("ci comment: review on a line comment replies in markdown and sets outputs", async () => {
  const repo = repoWithChange();
  const event = path.join(tmp(), "event.json");
  fs.writeFileSync(event, JSON.stringify({ comment: { body: "/koder review 金额精度", author_association: "MEMBER", path: "src/price.js", line: 2, diff_hunk: "@@ -1 +1 @@" } }));
  const output = path.join(tmp(), "out.txt");
  const model = scripted([REVIEW_JSON([{ severity: "medium", file: "src/price.js", line: 2, title: "精度" }])]);
  const result = await cli(["ci", "comment", "--event", event, "--out", "reply.md", "-w", repo.dir], { provider: model, cwd: repo.dir, env: { GITHUB_OUTPUT: output } });
  assert.equal(result.code, 0, result.err);
  const prompt = model.calls[0].messages.find((m) => m.role === "user").content;
  assert.match(prompt, /额外关注：金额精度/);
  assert.match(prompt, /评论位置：src\/price\.js:2/);
  assert.match(fs.readFileSync(path.join(repo.dir, "reply.md"), "utf8"), /\| 中 \| `src\/price\.js:2` \| 精度 \|/);
  assert.match(fs.readFileSync(output, "utf8"), /changed=false\ncommand=review/);
});
