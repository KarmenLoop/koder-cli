import fs from "node:fs";
import path from "node:path";
import { KoderError } from "./errors.mjs";
import { runCheck, tail } from "./exec.mjs";
import { changedFiles, repoRoot, resolveScope, reviewContext } from "./repo.mjs";
import { createSession, pickDecider } from "./session.mjs";

export const SEVERITY = { high: 3, medium: 2, low: 1 };
const SEVERITY_ALIASES = {
  critical: "high", blocker: "high", high: "high", error: "high", 高: "high", 严重: "high",
  major: "medium", medium: "medium", warning: "medium", 中: "medium",
  minor: "low", low: "low", info: "low", nit: "low", notice: "low", 低: "low",
};

export function normalizeFindings(value) {
  const list = Array.isArray(value?.findings) ? value.findings : [];
  return list
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      severity: SEVERITY_ALIASES[String(item.severity || "").toLowerCase()] || "low",
      file: String(item.file || item.path || "").replace(/^\.?\//, ""),
      line: Number.isInteger(Number(item.line)) && Number(item.line) > 0 ? Number(item.line) : null,
      title: String(item.title || item.message || "").trim(),
      detail: String(item.detail || item.body || item.description || "").trim(),
      suggestion: String(item.suggestion || item.fix || "").trim(),
    }))
    .filter((item) => item.title || item.detail)
    .sort((a, b) => SEVERITY[b.severity] - SEVERITY[a.severity]);
}

// The last ```json block wins; a bare object with "findings" is accepted too.
export function parseReview(text) {
  const source = String(text || "");
  const blocks = [...source.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
  const start = source.lastIndexOf("{\"summary\"") >= 0 ? source.lastIndexOf("{\"summary\"") : source.indexOf("{\"findings\"");
  if (start >= 0) blocks.push(source.slice(start, source.lastIndexOf("}") + 1));
  for (const block of blocks.reverse()) {
    try {
      const value = JSON.parse(block);
      if (value && typeof value === "object" && Array.isArray(value.findings)) {
        return { parsed: true, summary: String(value.summary || "").trim(), findings: normalizeFindings(value) };
      }
    } catch {}
  }
  return { parsed: false, summary: "", findings: [] };
}

function section(title, body) {
  return body && String(body).trim() ? `## ${title}\n${String(body).trim()}\n` : "";
}

export function reviewPrompt(context, { lang = "zh", focus = "", path: focusPath = "", line = null } = {}) {
  const zh = lang === "zh";
  const { changes, overview, refs, scope } = context;
  const refText = refs.filter((item) => item.refs.length).map((item) => `- ${item.name}（定义于 ${item.file}）\n${item.refs.map((r) => `  ${r}`).join("\n")}`).join("\n");
  const diff = [changes.head, ...changes.files.map((part) => part.text)].filter(Boolean).join("\n");
  const rules = zh
    ? [
        "你是 Koder 的代码审查员。请审查下面这次改动。",
        "1. 先理解仓库上下文：规则文件、模块结构、被改符号在别处的调用。需要时用 read_file、search、list_dir 核实，不要猜。",
        "2. 只报告有证据的真实问题：正确性、边界条件、错误处理、安全（注入、越权、密钥泄露）、并发与资源释放、性能退化、与仓库约定不一致、缺少必要测试。",
        "3. 不报告纯格式或个人风格偏好，除非违反仓库规则。",
        "4. line 用改动后文件里的行号。",
        "5. 最后输出一个 ```json 代码块：{\"summary\":\"一两句总体结论\",\"findings\":[{\"severity\":\"high|medium|low\",\"file\":\"相对路径\",\"line\":行号,\"title\":\"一句话问题\",\"detail\":\"为什么是问题、何时触发\",\"suggestion\":\"具体怎么改\"}]}。没有问题时 findings 为空数组。文字用中文。",
      ]
    : [
        "You are Koder's code reviewer. Review the change below.",
        "1. Understand the repository first: rule files, module layout, and where changed symbols are used. Verify with read_file, search and list_dir instead of guessing.",
        "2. Report only real issues with evidence: correctness, edge cases, error handling, security (injection, privilege, leaked secrets), concurrency and resource cleanup, performance regressions, inconsistency with repo conventions, missing tests.",
        "3. Do not report formatting or personal style unless it breaks a repository rule.",
        "4. line refers to the line in the changed file.",
        "5. End with one ```json block: {\"summary\":\"one or two sentences\",\"findings\":[{\"severity\":\"high|medium|low\",\"file\":\"relative path\",\"line\":N,\"title\":\"one-line issue\",\"detail\":\"why and when it fails\",\"suggestion\":\"concrete fix\"}]}. Use an empty findings array when there is nothing to report.",
      ];
  const focusLines = [];
  if (focus) focusLines.push(zh ? `额外关注：${focus}` : `Extra focus: ${focus}`);
  if (focusPath) focusLines.push(zh ? `评论位置：${focusPath}${line ? `:${line}` : ""}，优先回答这里。` : `Comment location: ${focusPath}${line ? `:${line}` : ""}; address it first.`);
  return [
    rules.join("\n"),
    focusLines.join("\n"),
    section(zh ? "范围" : "Scope", `${scope.label}\n${zh ? "文件" : "files"} ${changes.stats.files}, +${changes.stats.add} −${changes.stats.del}${changes.truncated.length ? `\n${zh ? "已截断" : "truncated"}: ${changes.truncated.join(", ")}` : ""}`),
    section(zh ? "仓库结构" : "Repository layout", `${overview.fileCount} files\n${overview.layout}`),
    section(zh ? "工程清单" : "Manifests", overview.manifests),
    section(zh ? "仓库规则" : "Repository rules", overview.rules),
    section("README", overview.readme),
    section(zh ? "最近提交" : "Recent commits", overview.log),
    section(zh ? "被改动符号的其他引用" : "Other references to changed symbols", refText),
    section(zh ? "改动" : "Diff", `\`\`\`diff\n${diff}\n\`\`\``),
  ].filter(Boolean).join("\n");
}

function budgetFor(ctx) {
  let windowTokens = 32_000;
  try {
    windowTokens = ctx.io.providerOverride?.contextWindow || ctx.requireProvider().record.contextWindow || windowTokens;
  } catch {}
  return Math.max(24_000, Math.min(400_000, Math.floor(windowTokens * 1.6)));
}

export async function prepareReview(ctx, options = {}) {
  const cwd = options.workspace || ctx.workspace();
  const root = await repoRoot(cwd);
  if (!root) throw new KoderError("err.notGit", { path: cwd });
  const scope = await resolveScope(root, options);
  const files = typeof options.files === "string" ? options.files.split(",").map((item) => item.trim()).filter(Boolean) : options.files || [];
  const context = await reviewContext(root, scope, { files, budgetChars: budgetFor(ctx) });
  return { root, context };
}

export async function reviewChanges(ctx, options = {}) {
  const { root, context } = await prepareReview(ctx, options);
  if (!context.changes.files.length) return { root, context, empty: true, parsed: true, summary: "", findings: [], raw: "", code: 0 };
  const session = await createSession(ctx, { workspace: root, mode: "report", interaction: "ask", quiet: true });
  const progress = options.onProgress || (() => {});
  const outcome = await session.turn(reviewPrompt(context, { lang: ctx.lang, focus: options.focus, path: options.path, line: options.line }), {
    silent: true,
    decide: () => ({ cancel: true }),
    onEvent(event) {
      if (event.type === "message" && event.message.role === "assistant") {
        for (const call of event.message.toolCalls || []) progress(`${call.name} ${call.arguments?.path || call.arguments?.query || ""}`.trim());
      }
    },
  });
  const raw = outcome.text || "";
  return { root, context, empty: false, ...parseReview(raw), raw, code: outcome.code };
}

export function gate(findings, failOn) {
  const threshold = SEVERITY[failOn];
  if (!threshold) return false;
  return findings.some((item) => SEVERITY[item.severity] >= threshold);
}

function fixPrompt({ lang, description, check, result, attempt }) {
  const zh = lang === "zh";
  const parts = [];
  if (description) parts.push(description);
  if (check && result) {
    parts.push(zh
      ? `检查命令 \`${check}\` 失败（退出码 ${result.code}${result.timedOut ? "，超时" : ""}），第 ${attempt} 次修复。找出根本原因并修改代码，不要删除或跳过测试、不要放宽断言。输出末尾：\n\`\`\`\n${tail(result.output)}\n\`\`\``
      : `The check \`${check}\` failed (exit ${result.code}${result.timedOut ? ", timed out" : ""}), fix attempt ${attempt}. Find the root cause and change the code; do not delete or skip tests or weaken assertions. Output tail:\n\`\`\`\n${tail(result.output)}\n\`\`\``);
  }
  parts.push(zh ? "改完用一两句话说明改了什么。不要自己运行检查命令，Koder 会在你改完后重新检查。" : "Afterwards, say in one or two sentences what changed. Do not run the check yourself; Koder re-runs it after your edits.");
  return parts.join("\n\n");
}

export async function fixLoop(ctx, { workspace = ctx.workspace(), description = "", check = "", attempts = 3, timeoutMs = 600_000, decide, session = null, log = (line) => ctx.stdout.write(`${line}\n`) } = {}) {
  const t = ctx.t;
  let result = null;
  if (check) {
    log(t("fix.run", { command: check }));
    result = await runCheck(check, { cwd: workspace, env: ctx.env, timeoutMs });
    if (result.code === 0 && !description) {
      log(t("fix.pass"));
      return { ok: true, code: 0, attempts: 0, result };
    }
  } else if (!description) {
    throw new KoderError("err.noPrompt");
  }
  session ??= await createSession(ctx, { workspace, mode: "code" });
  const chosen = decide || pickDecider(ctx);
  const max = check ? Math.max(1, attempts) : 1;
  for (let attempt = 1; attempt <= max; attempt += 1) {
    if (result && result.code !== 0) log(t("fix.fail", { code: result.code, attempt, max }));
    const outcome = await session.turn(fixPrompt({ lang: ctx.lang, description: attempt === 1 ? description : "", check, result: result?.code ? result : null, attempt }), { mode: "code", decide: chosen });
    if (outcome.code === 2) return { ok: false, code: 2, attempts: attempt, result };
    if (outcome.cancelled) return { ok: false, code: 1, attempts: attempt, result };
    if (!check) return { ok: outcome.code === 0, code: outcome.code, attempts: 1, result };
    log(t("fix.run", { command: check }));
    result = await runCheck(check, { cwd: workspace, env: ctx.env, timeoutMs });
    if (result.code === 0) {
      log(t("fix.pass"));
      return { ok: true, code: 0, attempts: attempt, result };
    }
  }
  log(t("fix.giveUp", { max }));
  return { ok: false, code: 1, attempts: max, result };
}

const SOURCE = /\.(m?[jt]sx?|cjs|py|go|rs|java|kt|rb|php|cs|swift|c|cc|cpp|h|hpp|vue|svelte)$/;
const TEST = /(^|\/)(tests?|__tests__|spec)\/|[._-](test|spec)\.[^/]+$|_test\.go$|^test_.*\.py$/;

export async function testTargets(ctx, { workspace, files = [], base }) {
  if (files.length) return files;
  const root = (await repoRoot(workspace)) || workspace;
  const scope = await resolveScope(root, { base });
  return (await changedFiles(root, scope)).filter((file) => SOURCE.test(file) && !TEST.test(file) && fs.existsSync(path.join(root, file)));
}

export function testPrompt({ lang, files, check }) {
  const zh = lang === "zh";
  return zh
    ? [
        `为这些文件补测试：${files.join("、")}。`,
        "先用 search 和 list_dir 找到仓库现有的测试，读一两个，沿用同样的测试框架、目录、命名和断言写法。",
        "覆盖主要行为、边界条件和错误分支。只新增或扩展测试文件；只有发现真实缺陷时才改源码，并在最后说明。",
        check ? `写完后 Koder 会运行 \`${check}\`。` : "",
      ].filter(Boolean).join("\n")
    : [
        `Write tests for: ${files.join(", ")}.`,
        "First find the repository's existing tests with search and list_dir, read one or two, and follow the same framework, folders, naming and assertion style.",
        "Cover the main behaviour, edge cases and error paths. Only add or extend test files; change source code only for a real bug, and say so at the end.",
        check ? `Koder will run \`${check}\` afterwards.` : "",
      ].filter(Boolean).join("\n");
}

export async function generateTests(ctx, { workspace = ctx.workspace(), files = [], base, check = "", attempts = 2, timeoutMs, decide, log = (line) => ctx.stdout.write(`${line}\n`) } = {}) {
  const targets = await testTargets(ctx, { workspace, files, base });
  if (!targets.length) {
    log(ctx.t("test.none"));
    return { ok: true, code: 0, files: [] };
  }
  log(ctx.t("test.start", { files: targets.join(", ") }));
  const session = await createSession(ctx, { workspace, mode: "code" });
  const chosen = decide || pickDecider(ctx);
  const outcome = await session.turn(testPrompt({ lang: ctx.lang, files: targets, check }), { mode: "code", decide: chosen });
  if (outcome.code !== 0 || !check) return { ok: outcome.code === 0, code: outcome.code, files: targets };
  const fixed = await fixLoop(ctx, { workspace, check, attempts, timeoutMs, decide: chosen, session, log });
  return { ...fixed, files: targets };
}
