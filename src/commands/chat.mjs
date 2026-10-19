import readline from "node:readline";
import { RESET, displayWidth, fg, gradientText } from "../color.mjs";
import { detectTheme, setTheme, theme } from "../theme.mjs";
import { loadConfig, resolveLang, saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { commandHelp, findCommand, overview } from "../help.mjs";
import { createT, normalizeLang } from "../i18n.mjs";
import { createPrompter } from "../prompter.mjs";
import { MODES, createSession, pickDecider } from "../session.mjs";
import { yesDecision } from "../policy.mjs";
import { aboutText, asksAboutUs } from "../official.mjs";
import { flags as bannerFlags, showBanner, useAscii } from "./banner.mjs";

export const flags = { ...bannerFlags };

const SLASH = ["/help", "/about", "/setup", "/learn", "/lang", "/mode", "/yes", "/moa", "/engine", "/new", "/memory", "/review", "/fix", "/test", "/scan", "/flow", "/model", "/connect", "/gateway", "/doctor", "/editor", "/banner", "/exit", "/quit"];
const FORWARD = new Set(["review", "fix", "test", "scan", "flow", "model", "doctor", "editor", "gateway", "connect", "memory"]);

function words(text) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(text))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

// First interactive start with no model: open koder setup before chatting.
export function needsSetup(ctx) {
  if (ctx.config.setupDone || ctx.io.prompter || !ctx.stdin.isTTY || !ctx.stdout.isTTY || ctx.env.CI) return false;
  try {
    return !ctx.findProvider();
  } catch {
    return false;
  }
}

// Picks up what koder setup changed: language, palette, model.
function reload(ctx) {
  ctx.config = loadConfig(ctx.env);
  ctx.lang = resolveLang({ flag: ctx.opts.lang, env: ctx.env, config: ctx.config });
  ctx.t = createT(ctx.lang);
  setTheme(detectTheme({ env: ctx.env, config: ctx.config }));
  ctx._record = undefined;
}

export async function run(ctx) {
  await showBanner(ctx);
  const warn = (text) => ctx.stdout.write(`${ctx.depth === "none" ? text : `${fg(theme().warn, ctx.depth)}${text}${RESET}`}\n`);
  if (needsSetup(ctx)) {
    ctx.stdout.write(`${ctx.t("setup.first")}\n`);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await ctx.dispatch(["setup"]);
    reload(ctx);
    try {
      const found = ctx.findProvider();
      if (found) ctx.stdout.write(`${ctx.t("setup.status", { model: `${found.record.name} · ${found.record.model}` })}\n`);
    } catch {}
  }
  ctx.stdout.write(`${ctx.t("chat.welcome")}\n`);
  if (!ctx.config.tutorial?.done) ctx.stdout.write(`${ctx.t("chat.firstRun")}\n`);
  try {
    ctx.requireProvider();
  } catch (error) {
    if (error instanceof KoderError) warn(ctx.t(error.key, error.vars));
    else throw error;
  }

  let prompter = ctx.io.prompter;
  let rl = null;
  if (!prompter) {
    rl = readline.createInterface({
      input: ctx.stdin,
      output: ctx.stdout,
      terminal: Boolean(ctx.stdin.isTTY),
      historySize: 300,
      completer: (line) => [line.startsWith("/") ? SLASH.filter((item) => item.startsWith(line)) : [], line],
    });
    prompter = createPrompter(rl, ctx.stdout);
  }
  // Inherit from ctx so /lang changes reach the printer of an open session.
  const turnCtx = Object.create(ctx);
  turnCtx.io = { ...ctx.io, prompter };
  let session = null;
  let sessionModel = null;
  let busy = false;
  let yes = Boolean(ctx.opts.yes);
  let mode = ctx.opts.mode || "standard";
  let moa = Boolean(ctx.opts.moa || ctx.opts.moaPreset);

  rl?.on("SIGINT", () => {
    if (busy && session) {
      session.cancel();
      return;
    }
    rl.close();
  });

  const prompt = () => {
    const tag = `${mode === "standard" ? "" : `[${mode}]`}${moa ? "[moa]" : ""}`;
    const text = `koder${tag}${yes ? "!" : ""} › `;
    return ctx.depth === "none" || !ctx.stdin.isTTY ? text : gradientText(text, ctx.depth, { bold: true });
  };

  const separator = (label = "") => {
    if (ctx.opts.json) return;
    const columns = Number(ctx.stdout.columns) || Number(ctx.env.COLUMNS) || 80;
    const width = Math.max(1, Math.min(100, Math.floor(columns) - 1));
    const glyph = useAscii(ctx) ? "=" : "═";
    const title = label && width >= displayWidth(label) + 4 ? `${glyph}${glyph} ${label} ` : "";
    const text = title + glyph.repeat(Math.max(0, width - displayWidth(title)));
    ctx.stdout.write(`\n${ctx.depth === "none" ? text : `${fg(theme().text3, ctx.depth)}${text}${RESET}`}\n`);
  };

  const slash = async (line) => {
    const [head, ...args] = words(line.slice(1));
    const name = (head || "").toLowerCase();
    if (name === "exit" || name === "quit" || name === "q") return false;
    if (name === "about" || name === "关于" || name === "官网") {
      ctx.stdout.write(`${aboutText(ctx.lang)}\n`);
    } else if (name === "help" || name === "h" || name === "?") {
      const command = args[0] && findCommand(args[0]);
      ctx.stdout.write(`${command ? commandHelp(command, ctx.lang, ctx.depth) : overview(ctx.lang, ctx.depth, ctx.version)}\n${ctx.t("chat.slash")}\n`);
    } else if (name === "learn") {
      await ctx.dispatch(["learn", ...args], { prompter });
    } else if (name === "setup" || name === "设置") {
      // The settings screen reads raw keys itself; the chat's line editor sits out meanwhile.
      const listeners = ctx.stdin.listeners("keypress");
      ctx.stdin.removeAllListeners("keypress");
      try {
        await ctx.dispatch(["setup"], { prompter: null });
      } finally {
        for (const listener of listeners) ctx.stdin.on("keypress", listener);
      }
      reload(ctx);
      session = null;
    } else if (name === "lang") {
      const lang = normalizeLang(args[0]);
      if (!lang) warn(ctx.t("err.badLang"));
      else {
        saveConfig({ lang }, ctx.env);
        ctx.lang = lang;
        ctx.t = createT(lang);
        ctx.stdout.write(`${ctx.t("lang.set")}\n`);
      }
    } else if (name === "mode") {
      if (!MODES.includes(args[0])) warn(ctx.t("err.badMode", { mode: args[0] || "", modes: MODES.join(", ") }));
      else {
        mode = args[0];
        ctx.stdout.write(`${ctx.t("chat.mode", { mode })}\n`);
      }
    } else if (name === "yes") {
      yes = !yes;
      ctx.stdout.write(`${ctx.t(yes ? "chat.yesOn" : "chat.yesOff")}\n`);
    } else if (name === "moa") {
      moa = !moa;
      session = null;
      ctx.stdout.write(`${ctx.t(moa ? "chat.moaOn" : "chat.moaOff")}\n`);
    } else if (name === "engine") {
      if (args[0]) {
        turnCtx.opts = { ...turnCtx.opts, engine: args[0] };
        session = null;
      }
      ctx.stdout.write(`${ctx.t("chat.engine", { name: turnCtx.opts.engine || ctx.config.engine || "koder" })}\n`);
    } else if (name === "new") {
      if (session) await session.reset();
      else if (ctx.opts.memory !== false) {
        const { createMemory } = await import("../memory.mjs");
        const memory = createMemory({ workspace: ctx.workspace(), env: ctx.env, name: ctx.opts.session || "default" });
        memory.transact(data => memory.reset(data));
      }
      ctx.stdout.write(`${ctx.t("chat.cleared")}\n`);
    } else if (name === "banner") {
      await showBanner(ctx);
    } else if (FORWARD.has(name)) {
      busy = true;
      try {
        const code = await ctx.dispatch([name, ...args, "-w", session?.workspace || ctx.workspace(), ...(name === "memory" && ctx.opts.session ? ["--session", ctx.opts.session] : []), ...(yes ? ["--yes"] : [])], { prompter, noStdin: true });
        if (code === 0 && name === "model" && ["use", "set", "add", "remove", "clear", "context", "limits"].includes(args[0])) {
          reload(ctx);
          delete turnCtx._record;
          session = null;
        }
      } finally {
        busy = false;
      }
    } else {
      warn(ctx.t("chat.unknown", { name: `/${name}` }));
    }
    return true;
  };

  for (;;) {
    if (!prompter.closed) separator(ctx.lang === "en" ? "You" : "你");
    const line = await prompter.ask(prompt());
    if (line == null) break;
    const text = line.trim();
    if (!text) continue;
    separator();
    if (!ctx.opts.json) ctx.stdout.write(`\n${ctx.depth === "none" ? "Agent" : `${fg(theme().accent, ctx.depth, true)}Agent${RESET}`}\n\n`);
    if (text.startsWith("/")) {
      if (!(await slash(text))) break;
      continue;
    }
    if (asksAboutUs(text)) {
      ctx.stdout.write(`${aboutText(ctx.lang)}\n`);
      continue;
    }
    try {
      // Another terminal may have changed the active model or its limits. A
      // cached harness must not keep the old window/endpoint indefinitely.
      reload(ctx);
      delete turnCtx._record;
      const external = (turnCtx.opts.engine || ctx.config.engine || 'koder') !== 'koder';
      const found = external ? null : ctx.findProvider();
      const nextModel = JSON.stringify(external ? {engine:turnCtx.opts.engine || ctx.config.engine} : found?.record || null);
      if (session && nextModel !== sessionModel) session = null;
      sessionModel = nextModel;
      session ??= await createSession(turnCtx, { mode, moa });
      busy = true;
      await session.turn(text, { mode, decide: yes ? yesDecision : pickDecider(turnCtx) });
    } catch (error) {
      if (error instanceof KoderError) warn(ctx.t(error.key, error.vars));
      else warn(ctx.t("err.failed", { message: error?.message || String(error) }));
    } finally {
      busy = false;
    }
  }
  rl?.close();
  ctx.stdout.write(`${ctx.t("chat.bye")}\n`);
  return 0;
}
