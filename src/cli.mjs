import fs from "node:fs";
import path from "node:path";
import { GLOBAL_FLAGS, parseFlags } from "./argv.mjs";
import { colorDepth } from "./color.mjs";
import { loadConfig, resolveLang } from "./config.mjs";
import { KoderError } from "./errors.mjs";
import { createT } from "./i18n.mjs";
import { resolveProvider } from "./provider.mjs";
import { detectTheme, setTheme } from "./theme.mjs";

export const VERSION = "0.3.1";

const LOADERS = {
  chat: () => import("./commands/chat.mjs"),
  run: () => import("./commands/run.mjs"),
  ask: () => import("./commands/run.mjs"),
  review: () => import("./commands/review.mjs"),
  fix: () => import("./commands/fix.mjs"),
  test: () => import("./commands/test.mjs"),
  flow: () => import("./commands/flow.mjs"),
  ci: () => import("./commands/ci.mjs"),
  acp: () => import("./commands/acp.mjs"),
  editor: () => import("./commands/editor.mjs"),
  scan: () => import("./commands/scan.mjs"),
  model: () => import("./commands/model.mjs"),
  memory: () => import("./commands/memory.mjs"),
  lang: () => import("./commands/lang.mjs"),
  theme: () => import("./commands/theme.mjs"),
  help: () => import("./commands/help.mjs"),
  learn: () => import("./commands/help.mjs"),
  banner: () => import("./commands/banner.mjs"),
  doctor: () => import("./commands/doctor.mjs"),
  version: () => import("./commands/version.mjs"),
  about: () => import("./commands/about.mjs"),
  moa: () => import("./commands/moa.mjs"),
  gateway: () => import("./commands/gateway.mjs"),
  connect: () => import("./commands/gateway.mjs"),
  onboard: () => import("./commands/setup.mjs"),
  setup: () => import("./commands/setup.mjs"),
  engine: () => import("./commands/engine.mjs"),
  update: () => import("./commands/update.mjs"),
  uninstall: () => import("./commands/update.mjs"),
};

const ALIASES = {
  对话: "chat", 运行: "run", 做: "run", 提问: "ask", 问: "ask", 审查: "review", 评审: "review",
  修复: "fix", 测试: "test", 补测试: "test", 流程: "flow", 编排: "flow", 流水线: "ci", 协议: "acp",
  编辑器: "editor", 扫描: "scan", 模型: "model", 语言: "lang", 主题: "theme", 帮助: "help", 教程: "learn", 教学: "learn",
  体检: "doctor", 开屏: "banner", 版本: "version", 关于: "about", 官网: "about", 混合: "moa", 网关: "gateway", 接入: "gateway",
  向导: "onboard", 初始化: "onboard", 引擎: "engine", 更新: "update", 卸载: "uninstall",
  设置: "setup", 配置: "setup", settings: "setup", config: "setup", configure: "setup",
  连接: "connect", apps: "connect",
  记忆: "memory",
};

const VALUE_FLAGS = new Set(Object.entries(GLOBAL_FLAGS).filter(([, def]) => def.type !== "bool").flatMap(([name, def]) => [`--${name}`, def.short ? `-${def.short}` : null]).filter(Boolean));

export function resolveCommand(name) {
  if (!name) return null;
  if (LOADERS[name]) return name;
  return ALIASES[name] || null;
}

// The command is the first bare word that is not the value of a global flag.
export function splitCommand(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") return { name: null, index: -1 };
    if (VALUE_FLAGS.has(arg)) {
      i += 1;
      continue;
    }
    if (arg.startsWith("-")) continue;
    return { name: resolveCommand(arg), word: arg, index: i };
  }
  return { name: null, index: -1 };
}

async function readAll(stream, limit = 400_000) {
  let text = "";
  for await (const chunk of stream) {
    text += chunk.toString();
    if (text.length > limit) return `${text.slice(0, limit)}\n…`;
  }
  return text;
}

export function createContext({ command, word, argv, opts, positionals, io }) {
  const env = io.env || process.env;
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  const stdin = io.stdin || process.stdin;
  const config = loadConfig(env);
  const lang = resolveLang({ flag: opts.lang, env, config });
  setTheme(detectTheme({ env, config }));
  let piped;
  const ctx = {
    command, word, argv, opts, positionals, io, env, stdout, stderr, stdin, config, lang,
    t: createT(lang),
    version: VERSION,
    cwd: io.cwd || process.cwd(),
    depth: colorDepth({ env, stream: stdout, flag: opts.color }),
    errDepth: colorDepth({ env, stream: stderr, flag: opts.color }),
    workspace() {
      const dir = path.resolve(ctx.cwd, opts.workspace || ".");
      if (!fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) throw new KoderError("err.workspace", { path: dir });
      return dir;
    },
    async readStdin() {
      if (piped !== undefined) return piped;
      piped = stdin.isTTY || io.noStdin ? "" : (await readAll(stdin)).trim();
      return piped;
    },
    findProvider() {
      return ctx.io.resolveProvider ? ctx.io.resolveProvider(ctx) : resolveProvider({ file: opts.provider, env });
    },
    requireProvider() {
      ctx._record ??= ctx.findProvider();
      if (!ctx._record) throw new KoderError("err.noModel");
      return ctx._record;
    },
    async dispatch(nextArgv, overrides = {}) {
      return runCli(nextArgv, { ...io, ...overrides, env, stdout, stderr, stdin, cwd: ctx.cwd });
    },
  };
  return ctx;
}

export async function runCli(argv = process.argv.slice(2), io = {}) {
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  const stdin = io.stdin || process.stdin;
  const env = io.env || process.env;
  if (argv[0] === "-v" || argv[0] === "--version") {
    stdout.write(`koder ${VERSION}\n`);
    return 0;
  }
  const langIndex = argv.findIndex((arg) => arg === "--lang" || arg.startsWith("--lang="));
  const langFlag = langIndex < 0 ? undefined : argv[langIndex].includes("=") ? argv[langIndex].split("=")[1] : argv[langIndex + 1];
  let t = createT(resolveLang({ flag: langFlag, env }));
  try {
    const split = splitCommand(argv);
    let command = split.name;
    let rest = argv;
    if (command) rest = [...argv.slice(0, split.index), ...argv.slice(split.index + 1)];
    else if (split.index >= 0) command = "run";
    else if (argv.includes("-h") || argv.includes("--help")) command = "help";
    else if (stdin.isTTY && stdout.isTTY && !io.noStdin) command = "chat";
    else command = io.noStdin ? "help" : "run";
    const module = await LOADERS[command]();
    const { opts, positionals } = parseFlags(rest, module.flags || {});
    const ctx = createContext({ command, word: split.word, argv: rest, opts, positionals, io });
    t = ctx.t;
    if (opts.help && command !== "help") {
      const { commandHelpText } = await import("./commands/help.mjs");
      stdout.write(`${commandHelpText(ctx, command)}\n`);
      return 0;
    }
    return (await module.run(ctx)) ?? 0;
  } catch (error) {
    if (error instanceof KoderError) {
      stderr.write(`${t(error.key, error.vars)}\n`);
      return error.exitCode;
    }
    stderr.write(`${t("err.failed", { message: error?.message || String(error) })}\n`);
    if (env.KODER_DEBUG) stderr.write(`${error?.stack || ""}\n`);
    return 1;
  }
}
