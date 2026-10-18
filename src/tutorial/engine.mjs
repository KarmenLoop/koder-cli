import { RESET, displayWidth, fg } from "../color.mjs";
import { saveConfig } from "../config.mjs";
import { lineDecider } from "../ask.mjs";
import { SHELLS, detectShell, shellName } from "../platform.mjs";
import { createSession } from "../session.mjs";
import { theme } from "../theme.mjs";
import { createCoach, createSandbox } from "./sandbox.mjs";

const FALLBACK = { powershell: ["powershell", "windows"], cmd: ["cmd", "windows"], mac: ["mac", "unix"], linux: ["linux", "unix"] };

// Lesson text is { zh, en }, or { variants: { powershell, cmd, windows, mac, linux, unix, all } } of those.
export function resolve(value, lang, shell) {
  if (value && typeof value === "object" && value.variants) {
    const key = [...(FALLBACK[shell] || []), "all"].find((name) => name in value.variants);
    return resolve(key ? value.variants[key] : "", lang, shell);
  }
  return value && typeof value === "object" && "zh" in value ? value[lang] : value;
}

export function fits(beat, shell) {
  return !beat.only || beat.only.some((name) => name === shell || FALLBACK[shell]?.includes(name));
}

function styler(depth) {
  const p = theme();
  const c = (rgb, bold = false) => (text) => (depth === "none" ? text : `${fg(rgb, depth, bold)}${text}${RESET}`);
  return { head: c(p.accent, true), coach: c(p.accent, true), tip: c(p.warn), ok: c(p.ok), dim: c(p.text3), cmd: c(p.text, true) };
}

const COPY = {
  zh: {
    lesson: (n, total, title) => `第 ${n} 课 / 共 ${total} 课 · ${title}`,
    coach: "教练 › ",
    tip: "提示 · ",
    joke: "（小声）",
    nav: "回车继续 · b 上一课 · q 退出 · 数字跳课 › ",
    doAt: "动手 · ",
    answer: "答案：",
    again: "再来 › ",
    showAnswer: (answer) => `没关系，标准答案是 ${answer}，我们继续。`,
    skip: "输入 s 可以跳过",
    pick: "输入序号 › ",
    yn: "（y/n）› ",
    quit: (n) => `下课！进度记在第 ${n} 课，下次输入 koder learn 接着来。`,
    resume: (n) => `上次学到第 ${n} 课，接着来吗？回车继续，输入 1 从头开始 › `,
    done: "毕业证已发放：以后进入对话不会再提醒你上课了。",
    printTitle: "Koder CLI 完整教程（文字版）",
    printHint: "在终端里直接运行 koder learn，可以在练习场里边看边动手。",
    printShell: (name) => `这份文字版按「${name}」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux`,
    detected: (name) => `我看了一眼：你现在用的是「${name}」。接下来每一课的命令都按它来写，复制过去就能用。`,
    currentMark: "  ← 你现在用的",
    shellPick: "直接回车就用这一套；想给别的电脑学，输入数字换一套 › ",
    switched: (name) => `好，换成「${name}」版。`,
    kept: "好，就按这一套来。",
    switchJoke: "同一条命令在 PowerShell、CMD 和 macOS 上能有三种写法——程序员的发际线就是这么一点点退的。",
    pickDoc: "第一课会识别你用的是 PowerShell、CMD、macOS 还是 Linux，后面的命令都按它来写；也可以输入数字换成别的系统。",
  },
  en: {
    lesson: (n, total, title) => `Lesson ${n} of ${total} · ${title}`,
    coach: "Coach › ",
    tip: "Tip · ",
    joke: "(whispering) ",
    nav: "Enter: next · b: back · q: quit · number: jump › ",
    doAt: "Try it · ",
    answer: "Answer: ",
    again: "Again › ",
    showAnswer: (answer) => `No worries, the answer is ${answer}. Moving on.`,
    skip: "type s to skip",
    pick: "Pick a number › ",
    yn: "(y/n) › ",
    quit: (n) => `Class dismissed. Saved at lesson ${n}; run koder learn to continue.`,
    resume: (n) => `You stopped at lesson ${n}. Enter to continue, or 1 to start over › `,
    done: "Diploma issued: the chat will stop nagging you about the tutorial.",
    printTitle: "Koder CLI tutorial (text edition)",
    printHint: "Run koder learn in a terminal to practise in a sandbox as you read.",
    printShell: (name) => `This edition is written for ${name}; for another system: koder learn --print --os powershell|cmd|mac|linux`,
    detected: (name) => `I had a look: you're on ${name}. Every command from here on is written for it, ready to copy.`,
    currentMark: "  ← what you're on",
    shellPick: "Enter keeps this one; learning for another machine? Type a number › ",
    switched: (name) => `Right, switching to the ${name} edition.`,
    kept: "Good, this one it is.",
    switchJoke: "One command, three spellings across PowerShell, CMD and macOS. That's where programmers' hairlines go.",
    pickDoc: "Lesson 1 detects PowerShell, CMD, macOS or Linux and writes every command for it; you can switch with a number.",
  },
};

function indent(text, prefix, width) {
  return String(text).split("\n").map((line, index) => (index === 0 ? prefix : " ".repeat(width)) + line).join("\n");
}

export function createEnv(ctx, { prompter, sandbox, coach, shell = detectShell({ env: ctx.env }) }) {
  const lang = ctx.lang === "en" ? "en" : "zh";
  const copy = COPY[lang];
  const s = styler(ctx.depth);
  const out = (text = "") => ctx.stdout.write(`${text}\n`);
  const pick = (value) => resolve(value, lang, env.shell);
  const sctx = Object.create(ctx);
  sctx.opts = { ...ctx.opts, yes: false, json: false, workspace: sandbox?.dir };
  sctx.io = { ...ctx.io, providerOverride: coach, prompter, noStdin: true };
  const env = {
    ctx,
    sctx,
    lang,
    shell,
    copy,
    style: s,
    sandbox,
    coach,
    prompter,
    l: pick,
    out,
    say: (text) => out(indent(pick(text), s.coach(copy.coach), displayWidth(copy.coach))),
    tip: (text) => out(s.tip(indent(pick(text), `  ${copy.tip}`, 2 + displayWidth(copy.tip)))),
    joke: (text) => out(s.dim(indent(pick(text), `  ${copy.joke}`, 2 + displayWidth(copy.joke)))),
    code(text) {
      for (const line of pick(text).split("\n")) out(line.startsWith(" ") ? s.dim(`    ${line}`) : `    ${s.cmd(line)}`);
    },
    ask: (prompt, options) => prompter.ask(pick(prompt), options),
    // Lessons choose their own decider; the default asks in the terminal.
    decider() {
      return lineDecider({ t: (key, vars) => ctx.t(key, vars), prompter });
    },
    async turn(text, { script = [], mode = "standard", interaction = "agent", decide } = {}) {
      coach.script = script.map(pick);
      const session = await createSession(sctx, { workspace: sandbox.dir, mode, interaction });
      return session.turn(text, { decide: decide || env.decider(), mode, interaction });
    },
    async yesNo(question) {
      const answer = (await prompter.ask(`${pick(question)} ${copy.yn}`, { fresh: true })) ?? "";
      return /^(y|yes|是|好|要)$/i.test(answer.trim());
    },
  };
  return env;
}

async function practice(env, beat) {
  const { prompt, expect, hint, ok, answer } = beat.practice;
  env.out(`  ${env.style.cmd(env.copy.doAt)}${env.l(prompt)}`);
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const line = await env.ask(attempt > 1 ? env.copy.again : "› ");
    if (line == null) return "quit";
    const text = line.trim();
    if (/^s$/i.test(text)) break;
    if (typeof expect === "function" ? expect(text) : expect.test(text)) {
      env.out(`  ${env.style.ok(env.l(ok))}`);
      return "ok";
    }
    env.tip(`${env.l(hint)}（${env.copy.skip}）`);
  }
  env.tip(env.copy.showAnswer(answer));
  return "ok";
}

async function quiz(env, beat) {
  const { question, options, answer, right, wrong = [] } = beat.quiz;
  env.say(question);
  options.forEach((option, index) => env.out(`    ${env.style.cmd(String(index + 1))}. ${env.l(option)}`));
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const line = await env.ask(env.copy.pick);
    if (line == null) return "quit";
    const index = Number(line.trim()) - 1;
    if (index === answer) {
      env.out(`  ${env.style.ok(env.l(right))}`);
      return "ok";
    }
    env.tip(env.l(wrong[index]) || (env.lang === "zh" ? "不对哦，再想想。" : "Not quite, try again."));
  }
  env.tip(`${env.copy.answer}${answer + 1}. ${env.l(options[answer])}`);
  return "ok";
}

async function pickShell(env, save) {
  const shells = Object.keys(SHELLS);
  env.say(env.copy.detected(shellName(env.shell, env.lang)));
  shells.forEach((id, index) => env.out(`    ${env.style.cmd(String(index + 1))}. ${shellName(id, env.lang)}${id === env.shell ? env.style.dim(env.copy.currentMark) : ""}`));
  const line = await env.ask(env.copy.shellPick, { fresh: true });
  if (line == null) return "quit";
  const chosen = shells[Number(line.trim()) - 1];
  if (chosen && chosen !== env.shell) {
    env.shell = chosen;
    save({ shell: chosen });
    env.out(`  ${env.style.ok(env.copy.switched(shellName(chosen, env.lang)))}`);
    env.joke(env.copy.switchJoke);
  } else env.out(`  ${env.style.ok(env.copy.kept)}`);
  return "ok";
}

async function navigate(env, total) {
  const line = await env.ask(env.style.dim(env.copy.nav));
  if (line == null) return { quit: true };
  const text = line.trim().toLowerCase();
  if (text === "q") return { quit: true };
  if (text === "b") return { back: true };
  if (/^\d+$/.test(text) && Number(text) >= 1 && Number(text) <= total) return { jump: Number(text) - 1 };
  return {};
}

export async function runInteractive(ctx, lessons, { start = 0, prompter, shell, sandbox = createSandbox(), coach = createCoach() } = {}) {
  const env = createEnv(ctx, { prompter, sandbox, coach, shell });
  const total = lessons.length;
  let index = Math.max(0, Math.min(total - 1, start));
  const save = (patch) => {
    try {
      saveConfig({ tutorial: { ...(ctx.config.tutorial || {}), ...patch } }, ctx.env);
      ctx.config.tutorial = { ...(ctx.config.tutorial || {}), ...patch };
    } catch {}
  };
  try {
    while (index < total) {
      const lesson = lessons[index];
      save({ lesson: index + 1 });
      env.out("");
      env.out(env.style.head(`━━ ${env.copy.lesson(index + 1, total, env.l(lesson.title))} ━━`));
      let action = {};
      for (const beat of lesson.beats) {
        if (!fits(beat, env.shell)) continue;
        if (beat.pickShell) {
          if ((await pickShell(env, save)) === "quit") action = { quit: true };
        } else if (beat.say) env.say(beat.say);
        else if (beat.tip) env.tip(beat.tip);
        else if (beat.joke) env.joke(beat.joke);
        else if (beat.code) env.code(beat.code);
        else if (beat.practice && (await practice(env, beat)) === "quit") action = { quit: true };
        else if (beat.quiz && (await quiz(env, beat)) === "quit") action = { quit: true };
        else if (beat.act) await beat.act(env);
        else if (beat.confirm) {
          if (await env.yesNo(beat.confirm.question)) await beat.confirm.yes(env);
          else if (beat.confirm.no) env.joke(beat.confirm.no);
        } else if (beat.pause) action = await navigate(env, total);
        if (action.quit || action.back || action.jump !== undefined) break;
      }
      if (!action.quit && !action.back && action.jump === undefined && !lesson.beats.some((beat) => beat.pause) && index < total - 1) action = await navigate(env, total);
      if (action.quit) {
        env.out(env.style.dim(env.copy.quit(index + 1)));
        return { finished: false, lesson: index + 1, sandbox };
      }
      if (action.back) index = Math.max(0, index - 1);
      else if (action.jump !== undefined) index = action.jump;
      else index += 1;
    }
    save({ lesson: total, done: true });
    env.out(env.style.ok(env.copy.done));
    return { finished: true, lesson: total, sandbox };
  } finally {
    if (!sandbox.kept) sandbox.remove();
  }
}

export function printTutorial(ctx, lessons, { only = null, shell = detectShell({ env: ctx.env }) } = {}) {
  const lang = ctx.lang === "en" ? "en" : "zh";
  const copy = COPY[lang];
  const s = styler(ctx.depth);
  const pick = (value) => resolve(value, lang, shell);
  const lines = [];
  const add = (text = "") => lines.push(text);
  if (only === null) {
    add(s.head(copy.printTitle));
    add(s.dim(copy.printHint));
  }
  add(s.dim(copy.printShell(shellName(shell, lang))));
  lessons.forEach((lesson, index) => {
    if (only !== null && only !== index) return;
    add("");
    add(s.head(`━━ ${copy.lesson(index + 1, lessons.length, pick(lesson.title))} ━━`));
    for (const beat of lesson.beats) {
      if (!fits(beat, shell)) continue;
      if (beat.pickShell) add(s.dim(indent(copy.pickDoc, "  · ", 4)));
      else if (beat.say) add(indent(pick(beat.say), s.coach(copy.coach), displayWidth(copy.coach)));
      else if (beat.tip) add(s.tip(indent(pick(beat.tip), `  ${copy.tip}`, 2 + displayWidth(copy.tip))));
      else if (beat.joke) add(s.dim(indent(pick(beat.joke), `  ${copy.joke}`, 2 + displayWidth(copy.joke))));
      else if (beat.code) for (const line of pick(beat.code).split("\n")) add(line.startsWith(" ") ? s.dim(`    ${line}`) : `    ${s.cmd(line)}`);
      else if (beat.practice) add(`  ${s.cmd(copy.doAt)}${pick(beat.practice.prompt)}  →  ${s.ok(beat.practice.answer)}`);
      else if (beat.quiz) {
        add(indent(pick(beat.quiz.question), s.coach(copy.coach), displayWidth(copy.coach)));
        beat.quiz.options.forEach((option, i) => add(`    ${i + 1}. ${pick(option)}`));
        add(`  ${s.ok(`${copy.answer}${beat.quiz.answer + 1}。${pick(beat.quiz.right)}`)}`);
      } else if (beat.act || beat.confirm) {
        const doc = beat.doc || beat.confirm?.doc;
        if (doc) add(s.dim(indent(pick(doc), "  · ", 4)));
      }
    }
  });
  return lines.join("\n");
}
