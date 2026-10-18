import fs from "node:fs";
import path from "node:path";
import { RESET, fg } from "../color.mjs";
import { theme } from "../theme.mjs";
import { KoderError } from "../errors.mjs";
import { createSession, pickDecider } from "../session.mjs";
import { fixLoop, gate, reviewChanges } from "../workflows.mjs";

export const flags = {
  base: { type: "string" },
  staged: { type: "bool" },
  commit: { type: "string" },
  files: { type: "string" },
  format: { type: "string" },
  out: { type: "string" },
  "fail-on": { type: "string" },
  focus: { type: "string" },
  path: { type: "string" },
  line: { type: "number" },
  fix: { type: "bool" },
  check: { type: "string" },
  attempts: { type: "number" },
  timeout: { type: "number" },
};

const FORMATS = new Set(["text", "markdown", "json", "github"]);
const LABEL = { zh: { high: "高", medium: "中", low: "低" }, en: { high: "high", medium: "medium", low: "low" } };
const tone = (severity) => ({ high: theme().del, medium: theme().warn, low: theme().accent })[severity];

function where(item) {
  return item.file ? `${item.file}${item.line ? `:${item.line}` : ""}` : "";
}

export function formatText(result, { lang, depth, t }) {
  const color = (text, rgb, bold) => (depth === "none" ? text : `${fg(rgb, depth, bold)}${text}${RESET}`);
  const s = result.context.changes.stats;
  const lines = [t("review.scope", { scope: result.context.scope.label, files: s.files, add: s.add, del: s.del })];
  if (result.summary) lines.push("", result.summary);
  if (!result.parsed) {
    lines.push("", t("review.unparsed"), result.raw);
    return lines.join("\n");
  }
  lines.push("", result.findings.length ? t("review.findings", { count: result.findings.length }) : t("review.none"));
  result.findings.forEach((item) => {
    lines.push("", `${color(`[${LABEL[lang][item.severity]}]`, tone(item.severity), true)} ${color(where(item), theme().text2)}  ${item.title}`);
    if (item.detail) lines.push(`    ${item.detail}`);
    if (item.suggestion) lines.push(`    ${lang === "zh" ? "建议" : "Suggestion"}: ${item.suggestion}`);
  });
  return lines.join("\n");
}

export function formatMarkdown(result, { lang, t }) {
  const zh = lang === "zh";
  const s = result.context.changes.stats;
  const lines = [zh ? "### Koder 代码审查" : "### Koder code review", "", `\`${result.context.scope.label}\` · ${s.files} ${zh ? "个文件" : "files"} · +${s.add} −${s.del}`, ""];
  if (result.summary) lines.push(`> ${result.summary.replace(/\n/g, "\n> ")}`, "");
  if (!result.parsed) {
    lines.push(t("review.unparsed"), "", result.raw);
    return lines.join("\n");
  }
  if (!result.findings.length) {
    lines.push(t("review.none"));
    return lines.join("\n");
  }
  lines.push(zh ? "| 级别 | 位置 | 问题 |" : "| Severity | Location | Issue |", "|---|---|---|");
  for (const item of result.findings) lines.push(`| ${LABEL[lang][item.severity]} | \`${where(item) || "-"}\` | ${item.title.replace(/\|/g, "\\|")} |`);
  lines.push("", `<details><summary>${zh ? "详情与建议" : "Details and suggestions"}</summary>`, "");
  result.findings.forEach((item, index) => {
    lines.push(`**${index + 1}. ${item.title}** ${where(item) ? `(\`${where(item)}\`)` : ""}`, "");
    if (item.detail) lines.push(item.detail, "");
    if (item.suggestion) lines.push(`${zh ? "建议" : "Suggestion"}: ${item.suggestion}`, "");
  });
  lines.push("</details>");
  return lines.join("\n");
}

function escapeData(text) {
  return String(text).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

function escapeProperty(text) {
  return escapeData(text).replace(/:/g, "%3A").replace(/,/g, "%2C");
}

export function formatGithub(result) {
  const level = { high: "error", medium: "warning", low: "notice" };
  return result.findings.map((item) => {
    const props = [item.file ? `file=${escapeProperty(item.file)}` : "", item.line ? `line=${item.line}` : "", `title=${escapeProperty(`Koder: ${item.title}`)}`].filter(Boolean).join(",");
    return `::${level[item.severity]} ${props}::${escapeData([item.detail, item.suggestion].filter(Boolean).join("\n\n") || item.title)}`;
  }).join("\n");
}

export function formatJson(result) {
  return JSON.stringify({
    scope: result.context.scope.label,
    stats: result.context.changes.stats,
    parsed: result.parsed,
    summary: result.summary,
    findings: result.findings,
    ...(result.parsed ? {} : { raw: result.raw }),
  }, null, 2);
}

function findingsPrompt(result, lang) {
  const zh = lang === "zh";
  return `${zh ? "按下面的审查结果修复代码。只改有问题的地方，保持现有写法；不能确定的问题跳过并说明。改完用一两句话说明改了什么。" : "Fix the code according to the review below. Change only what is wrong and keep the existing style; skip and explain anything uncertain. Afterwards, say briefly what changed."}\n\n\`\`\`json\n${JSON.stringify(result.findings, null, 2)}\n\`\`\``;
}

export async function run(ctx) {
  const o = ctx.opts;
  const format = o.format || "text";
  if (!FORMATS.has(format)) throw new KoderError("err.flagValue", { flag: "--format" });
  if (o.failOn && !["high", "medium", "low", "none"].includes(o.failOn)) throw new KoderError("err.flagValue", { flag: "--fail-on" });
  const progress = (line) => {
    if (format === "text" || ctx.stderr.isTTY) ctx.stderr.write(`${ctx.errDepth === "none" ? `· ${line}` : `\x1b[2m· ${line}${RESET}`}\n`);
  };
  progress(ctx.t("review.collect"));
  const result = await reviewChanges(ctx, { base: o.base, staged: o.staged, commit: o.commit, files: o.files, focus: o.focus, path: o.path, line: o.line, onProgress: progress });
  if (result.empty) {
    ctx.stdout.write(`${ctx.t("err.noDiff")}\n`);
    return 0;
  }
  if (result.code === 2) return 2;
  const style = { lang: ctx.lang, depth: ctx.depth, t: ctx.t };
  const markdown = formatMarkdown(result, style);
  let shown;
  if (format === "json") shown = formatJson(result);
  else if (format === "markdown") shown = markdown;
  else if (format === "github") {
    shown = [formatGithub(result), formatText(result, { ...style, depth: "none" })].filter(Boolean).join("\n");
    if (ctx.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(ctx.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  } else shown = formatText(result, style);
  ctx.stdout.write(`${shown}\n`);
  if (o.out) fs.writeFileSync(path.resolve(ctx.cwd, o.out), `${format === "json" ? shown : format === "text" ? formatText(result, { ...style, depth: "none" }) : markdown}\n`);

  let code = gate(result.findings, o.failOn) ? 1 : 0;
  if (code) ctx.stderr.write(`${ctx.t("review.gate", { severity: o.failOn })}\n`);
  if (o.fix && result.findings.length) {
    ctx.stdout.write(`\n${ctx.t("review.fixing")}\n`);
    const session = await createSession(ctx, { workspace: result.root, mode: "code" });
    const decide = pickDecider(ctx);
    const outcome = await session.turn(findingsPrompt(result, ctx.lang), { mode: "code", decide });
    code = outcome.code;
    if (code === 0 && o.check) {
      const fixed = await fixLoop(ctx, { workspace: result.root, check: o.check, attempts: o.attempts ?? 2, timeoutMs: (o.timeout ?? 600) * 1000, decide, session });
      code = fixed.code;
    }
  }
  return code;
}
