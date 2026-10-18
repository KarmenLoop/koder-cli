import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseFlags } from "../src/argv.mjs";
import { answerFromLine } from "../src/ask.mjs";
import { resolveCommand, splitCommand } from "../src/cli.mjs";
import { resolveLang } from "../src/config.mjs";
import { MESSAGES } from "../src/i18n.mjs";
import { closedDecision, normalizeDecision, yesDecision } from "../src/policy.mjs";
import { normalizeRecord, resolveProvider } from "../src/provider.mjs";
import { cli, tmp } from "./helpers.mjs";

test("flags: values, inline values, negation and unknown flags", () => {
  const { opts, positionals } = parseFlags(["--mode=code", "-w", "src", "--no-color", "写", "说明"], {});
  assert.equal(opts.mode, "code");
  assert.equal(opts.workspace, "src");
  assert.equal(opts.color, false);
  assert.deepEqual(positionals, ["写", "说明"]);
  assert.throws(() => parseFlags(["--pack"]), (error) => error.key === "err.unknownFlag");
  assert.throws(() => parseFlags(["--lang"]), (error) => error.key === "err.flagValue");
  assert.deepEqual(parseFlags(["--", "--not-a-flag"]).positionals, ["--not-a-flag"]);
});

test("command split skips values of global flags and accepts Chinese aliases", () => {
  assert.equal(splitCommand(["--lang", "en", "review"]).name, "review");
  assert.equal(splitCommand(["-w", "help", "scan"]).name, "scan");
  assert.equal(resolveCommand("审查"), "review");
  assert.equal(resolveCommand("教程"), "learn");
  const bare = splitCommand(["修好", "登录"]);
  assert.equal(bare.name, null);
  assert.equal(bare.index, 0);
});

test("every Chinese message has an English counterpart", () => {
  const zh = Object.keys(MESSAGES.zh).sort();
  const en = Object.keys(MESSAGES.en).sort();
  assert.deepEqual(en, zh);
});

test("language: flag beats env beats saved config; default is Chinese", () => {
  assert.equal(resolveLang({ env: {}, config: {} }), "zh");
  assert.equal(resolveLang({ env: {}, config: { lang: "en" } }), "en");
  assert.equal(resolveLang({ env: { KODER_LANG: "zh-CN" }, config: { lang: "en" } }), "zh");
  assert.equal(resolveLang({ flag: "en", env: { KODER_LANG: "zh" }, config: {} }), "en");
});

test("decisions: y accepts, anything else rejects, --yes never answers passwords", () => {
  assert.deepEqual(answerFromLine({ kind: "change" }, "y"), { accept: true });
  assert.deepEqual(answerFromLine({ kind: "change" }, "是"), { accept: true });
  assert.deepEqual(answerFromLine({ kind: "approval" }, "no"), { accept: false });
  assert.deepEqual(answerFromLine({ kind: "choice", options: ["a", "b"] }, "2"), { index: 1 });
  assert.equal(answerFromLine({ kind: "choice" }, "").cancel, true);
  assert.equal(yesDecision({ kind: "change" }).accept, true);
  assert.equal(yesDecision({ kind: "approval" }).accept, true);
  assert.equal(yesDecision({ kind: "secret" }).cancel, true);
  assert.equal(yesDecision({ kind: "choice" }).cancel, true);
  assert.equal(closedDecision().accept, false);
  assert.equal(normalizeDecision({ kind: "choice", options: ["a"] }, { index: 5 }).cancel, true);
});

test("provider: key from env name, CI env variables, and no key echo", () => {
  assert.throws(() => normalizeRecord({ model: "m", baseUrl: "https://x.test/v1", keyEnv: "MISSING_KEY" }, {}), (e) => e.key === "model.keyEnvMissing");
  assert.throws(() => normalizeRecord({ model: "m", baseUrl: "ftp://x" }, {}), (e) => e.key === "model.badUrl");
  const fromEnv = normalizeRecord({ model: "m", baseUrl: "https://x.test/v1", keyEnv: "K" }, { K: "sk-secret" });
  assert.equal(fromEnv.apiKey, "sk-secret");
  const pasted = normalizeRecord({ model: "m", baseUrl: "https://x.test/v1", keyEnv: "sk-pasted-key-4242" }, {});
  assert.equal(pasted.apiKey, "sk-pasted-key-4242");
  const ci = resolveProvider({ env: { KODER_MODEL: "m", KODER_BASE_URL: "https://x.test/v1", KODER_API_KEY: "k", KODER_CLI_HOME: tmp() } });
  assert.equal(ci.source, "env");
  assert.equal(ci.record.model, "m");
  const local = normalizeRecord({ model: "qwen3", baseUrl: "http://127.0.0.1:11434/v1", auth: "none" }, {});
  assert.equal(local.auth, "none");
});

test("help in Chinese and English, per-command help, tutorial", async () => {
  const zh = await cli(["help"]);
  assert.equal(zh.code, 0);
  assert.match(zh.out, /开始干活/);
  assert.match(zh.out, /review\s+上下文感知的代码审查/);
  const en = await cli(["--lang", "en", "help", "review"]);
  assert.match(en.out, /Context-aware code review/);
  assert.match(en.out, /--format <format>/);
  assert.doesNotMatch(en.out, /<格式>/);
  const flagHelp = await cli(["review", "--help"]);
  assert.match(flagHelp.out, /--fail-on/);
  const learn = await cli(["教程"]);
  assert.match(learn.out, /第 1 课 \/ 共 17 课 · 开场：欢迎来到 Koder 训练营/);
  assert.match(learn.out, /第 13 课 \/ 共 17 课 · 接入聊天软件/);
  assert.match(learn.out, /第 17 课 \/ 共 17 课 · 毕业典礼/);
  const step = await cli(["learn", "9", "--lang", "en"]);
  assert.match(step.out, /Lesson 9 of 17 · Code review with context/);
  assert.doesNotMatch(step.out, /Lesson 10/);
});

test("lang command persists the choice", async () => {
  const home = tmp();
  const set = await cli(["lang", "en"], { home });
  assert.equal(set.code, 0);
  assert.match(set.out, /Switched to English/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).lang, "en");
  const next = await cli(["help"], { home });
  assert.match(next.out, /Get work done/);
  const bad = await cli(["lang", "fr"], { home });
  assert.equal(bad.code, 2);
});

test("usage errors exit 2 with a translated message", async () => {
  const unknown = await cli(["revew"]);
  assert.equal(unknown.code, 2);
  assert.match(unknown.err, /没有这个命令：revew/);
  const flag = await cli(["--lang", "en", "--bogus"]);
  assert.equal(flag.code, 2);
  assert.match(flag.err, /Unknown option: --bogus/);
  const version = await cli(["--version"]);
  assert.equal(version.out.trim(), "koder 0.2.0");
});

test("model set saves mode 600 and never prints the key", async () => {
  const home = tmp();
  const saved = await cli(["model", "set", "--preset", "deepseek", "--key-stdin"], { home, stdin: "sk-very-secret-1234\n" });
  assert.equal(saved.code, 0, saved.err);
  const file = path.join(home, "provider.json");
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  const shown = await cli(["model", "show"], { home });
  assert.match(shown.out, /deepseek/);
  assert.match(shown.out, /…1234/);
  assert.doesNotMatch(shown.out, /very-secret/);
  const viaEnv = await cli(["model", "set", "--preset", "kimi", "--key-env", "KIMI_KEY"], { home });
  assert.equal(viaEnv.code, 0);
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).keyEnv, "KIMI_KEY");
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).apiKey, undefined);
  const missing = await cli(["model", "show"], { home });
  assert.match(missing.err, /KIMI_KEY/);
  const pastedName = await cli(["model", "set", "--preset", "deepseek", "--key-env", "sk-pasted-into-the-name-field-9876"], { home });
  assert.equal(pastedName.code, 0, pastedName.err);
  const stored = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(stored.apiKey, "sk-pasted-into-the-name-field-9876");
  assert.equal(stored.keyEnv, undefined);
  const recovered = await cli(["model", "show"], { home });
  assert.equal(recovered.code, 0, recovered.err);
  assert.match(recovered.out, /…9876/);
  assert.doesNotMatch(`${recovered.out}\n${recovered.err}`, /pasted-into/);
  const presets = await cli(["model", "presets"], { home });
  assert.ok(presets.out.split("\n").filter(Boolean).length >= 30);
});

test("who made the tool is answered from the official site, with no model and no network", async () => {
  const asked = await cli(["ask", "这个工具是谁开发的"], { fetchImpl: () => assert.fail("must not call the network") });
  assert.equal(asked.code, 0, asked.err);
  assert.match(asked.out, /KARMEN LOOP 自己编写/);
  assert.match(asked.out, /https:\/\/karmenloop\.com\/updates\.html/);
  assert.doesNotMatch(asked.out, /还没有配置模型/);
  const version = await cli(["version"]);
  assert.match(version.out, /^koder 0\.2\.0\n/);
  assert.match(version.out, /https:\/\/karmenloop\.com\/updates\.html/);
  const about = await cli(["--lang", "en", "about"]);
  assert.match(about.out, /written by KARMEN LOOP/);
  assert.match(about.out, /https:\/\/karmenloop\.com\/download\.html/);
  const task = await cli(["ask", "谁开发的登录函数有问题"], { fetchImpl: () => assert.fail("must not call the network") });
  assert.match(task.err, /还没有配置模型/);
});

test("no model configured: clear message and exit 2, no network", async () => {
  const result = await cli(["run", "你好"], { fetchImpl: () => assert.fail("must not call the network") });
  assert.equal(result.code, 2);
  assert.match(result.err, /还没有配置模型/);
});
