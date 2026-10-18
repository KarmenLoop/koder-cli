import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { RESET, fg } from "../color.mjs";
import { theme } from "../theme.mjs";
import { terminalPrompter } from "../ask.mjs";
import { KoderError } from "../errors.mjs";
import { TOOL_IDS, ago, scanAll } from "../scan.mjs";

export const flags = {
  tool: { type: "string", multiple: true },
  days: { type: "number" },
  limit: { type: "number" },
  titles: { type: "bool", negatable: true },
  all: { type: "bool" },
};

const TOOL_NAMES = { koder: "Koder", codex: "Codex", claude: "Claude Code", cursor: "Cursor" };
const TOOL_ALIASES = { "claude-code": "claude", claudecode: "claude", cc: "claude" };

function home(ctx) {
  return ctx.env.KODER_SCAN_HOME ? path.resolve(ctx.env.KODER_SCAN_HOME) : os.homedir();
}

function short(file) {
  const h = os.homedir();
  return file.startsWith(h) ? `~${file.slice(h.length)}` : file;
}

function guessCheck(dir) {
  const pkg = path.join(dir, "package.json");
  if (fs.existsSync(pkg)) {
    try {
      const scripts = JSON.parse(fs.readFileSync(pkg, "utf8")).scripts || {};
      if (scripts.test && !/no test specified/.test(scripts.test)) return "npm test";
    } catch {}
  }
  if (fs.existsSync(path.join(dir, "pyproject.toml")) || fs.existsSync(path.join(dir, "pytest.ini"))) return "pytest";
  if (fs.existsSync(path.join(dir, "go.mod"))) return "go test ./...";
  if (fs.existsSync(path.join(dir, "Cargo.toml"))) return "cargo test";
  return "";
}

function suggestPrompt(ctx, project) {
  const recent = project.tasks.filter((task) => task.title).slice(0, 8).map((task) => `- [${TOOL_NAMES[task.tool]}] ${task.title}（${ago(task.updatedAt, ctx.lang)}）`);
  const header = ctx.t("scan.suggest");
  if (!recent.length) return header;
  return `${header}\n\n${ctx.lang === "zh" ? "最近在其他工具里做过的任务：" : "Recent tasks from other tools:"}\n${recent.join("\n")}`;
}

export async function run(ctx) {
  const wanted = (ctx.opts.tool || []).flatMap((item) => item.split(",")).map((item) => TOOL_ALIASES[item.toLowerCase()] || item.toLowerCase());
  for (const id of wanted) if (!TOOL_IDS.includes(id)) throw new KoderError("err.flagValue", { flag: `--tool ${id}` });
  const days = ctx.opts.days ?? 30;
  const limit = ctx.opts.limit ?? 20;
  const titles = ctx.opts.titles !== false;
  const result = scanAll({ home: home(ctx), env: ctx.env, days, titles, tools: wanted.length ? wanted : TOOL_IDS });
  const projects = result.projects.filter((item) => ctx.opts.all || item.path).slice(0, limit);

  if (ctx.opts.json) {
    ctx.stdout.write(`${JSON.stringify({
      days,
      tools: result.tools.map((tool) => ({ id: tool.id, found: tool.found, sealed: Boolean(tool.sealed), sessions: tool.id === "koder" ? tool.stores.reduce((n, s) => n + s.count, 0) : tool.sessions.length, ...(tool.stores ? { stores: tool.stores } : {}) })),
      projects: projects.map((item) => ({ path: item.path, label: item.label, exists: item.exists, updatedAt: new Date(item.updatedAt).toISOString(), tools: item.tools, tasks: item.tasks.slice(0, 10).map((task) => ({ tool: task.tool, id: task.id, updatedAt: new Date(task.updatedAt).toISOString(), ...(titles ? { title: task.title } : {}) })) })),
    }, null, 2)}\n`);
    return 0;
  }

  const color = (text, rgb, bold) => (ctx.depth === "none" ? text : `${fg(rgb, ctx.depth, bold)}${text}${RESET}`);
  const out = (line = "") => ctx.stdout.write(`${line}\n`);
  const p = theme();
  out(color(ctx.t("scan.title"), p.accent, true));
  for (const tool of result.tools) {
    if (!tool.found) out(color(`  ${ctx.t("scan.missing", { tool: tool.name })}`, p.text3));
    else if (tool.id === "koder") {
      const count = tool.stores.reduce((n, s) => n + s.count, 0);
      const latest = Math.max(0, ...tool.stores.map((s) => s.latest));
      out(`  ${tool.sealed ? ctx.t("scan.sealed", { tool: tool.name }) : tool.name}  ·  ${count} ${ctx.lang === "zh" ? "个会话" : "sessions"}${latest ? `  ·  ${ago(latest, ctx.lang)}` : ""}`);
    } else {
      const count = new Set(tool.sessions.map((s) => s.cwd)).size;
      out(`  ${ctx.t("scan.tool", { tool: tool.name, projects: count, sessions: tool.sessions.length })}`);
    }
  }
  out();
  if (!projects.length) {
    out(ctx.t("scan.noProjects"));
    return 0;
  }
  projects.forEach((project, index) => {
    const tools = Object.entries(project.tools).map(([id, n]) => `${TOOL_NAMES[id]} ${n}`).join(" · ");
    const label = project.path ? short(project.path) : `${project.label} (?)`;
    out(`${color(String(index + 1).padStart(2), p.accent, true)}. ${color(label, project.exists ? p.text : p.text3, true)}  ${color(`${tools} · ${ago(project.updatedAt, ctx.lang)}`, p.text3)}`);
    for (const task of project.tasks.filter((item) => item.title).slice(0, 3)) out(`      ${color("·", p.accent)} ${color(task.title, p.text2)}`);
  });

  const interactive = (ctx.stdin.isTTY || ctx.io.prompter) && !ctx.io.noPrompt;
  if (!interactive) return 0;
  const prompter = ctx.io.prompter || terminalPrompter(ctx.stdin, ctx.stdout);
  try {
    out();
    const pick = Number((await prompter.ask(ctx.t("scan.pick")))?.trim());
    const project = projects[pick - 1];
    if (!project) return 0;
    if (!project.exists) {
      out(ctx.t("scan.gone", { path: project.path || project.label }));
      return 1;
    }
    out(ctx.t("scan.action", { path: short(project.path) }));
    out(ctx.t("scan.actions"));
    const action = (await prompter.ask(ctx.t("scan.actionPrompt")))?.trim();
    const io = { prompter, noStdin: true };
    const yes = ctx.opts.yes ? ["--yes"] : [];
    if (action === "1") return ctx.dispatch(["review", "-w", project.path, ...yes], io);
    if (action === "2") {
      const guess = guessCheck(project.path);
      const check = (await prompter.ask(`${ctx.lang === "zh" ? "检查命令" : "Check command"}${guess ? ` [${guess}]` : ""}: `))?.trim() || guess;
      return ctx.dispatch(["fix", ...(check ? ["--check", check] : [ctx.lang === "zh" ? "检查并修复明显的问题" : "Check and fix obvious problems"]), "-w", project.path, ...yes], io);
    }
    if (action === "3") return ctx.dispatch(["ask", suggestPrompt(ctx, project), "-w", project.path], io);
    if (action === "4") {
      const task = (await prompter.ask(ctx.t("scan.taskPrompt")))?.trim();
      if (task) return ctx.dispatch(["run", task, "-w", project.path, ...yes], io);
    }
    return 0;
  } finally {
    if (!ctx.io.prompter) prompter.close();
  }
}
