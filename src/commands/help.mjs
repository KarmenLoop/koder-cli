import { terminalPrompter } from "../ask.mjs";
import { KoderError } from "../errors.mjs";
import { commandHelp, findCommand, overview } from "../help.mjs";
import { detectShell, normalizeShell } from "../platform.mjs";

export const flags = {
  print: { type: "bool" },
  os: { type: "string" },
};

export function commandHelpText(ctx, name) {
  const command = findCommand(name);
  return command ? commandHelp(command, ctx.lang, ctx.depth) : overview(ctx.lang, ctx.depth, ctx.version);
}

async function learn(ctx) {
  const { LESSONS } = await import("../tutorial/lessons.mjs");
  const { printTutorial, runInteractive } = await import("../tutorial/engine.mjs");
  const wanted = ctx.positionals[0] ? Number(ctx.positionals[0]) : null;
  if (wanted !== null && (!Number.isInteger(wanted) || wanted < 1 || wanted > LESSONS.length)) throw new KoderError("err.flagValue", { flag: `learn ${ctx.positionals[0]}` });
  if (ctx.opts.os && !normalizeShell(ctx.opts.os)) throw new KoderError("err.flagValue", { flag: `--os ${ctx.opts.os}` });
  const shell = normalizeShell(ctx.opts.os) || normalizeShell(ctx.config.tutorial?.shell) || detectShell({ env: ctx.env, platform: ctx.io.platform || process.platform });
  const interactive = !ctx.opts.print && (ctx.io.prompter || (ctx.stdin.isTTY && ctx.stdout.isTTY));
  if (!interactive) {
    ctx.stdout.write(`${printTutorial(ctx, LESSONS, { only: wanted === null ? null : wanted - 1, shell })}\n`);
    return 0;
  }
  const prompter = ctx.io.prompter || terminalPrompter(ctx.stdin, ctx.stdout);
  try {
    let start = wanted === null ? 0 : wanted - 1;
    const saved = ctx.config.tutorial;
    if (wanted === null && saved?.lesson > 1 && !saved.done) {
      const { createEnv } = await import("../tutorial/engine.mjs");
      const copy = createEnv(ctx, { prompter, sandbox: null, coach: null }).copy;
      const answer = await prompter.ask(copy.resume(saved.lesson));
      start = answer?.trim() === "1" ? 0 : saved.lesson - 1;
    }
    await runInteractive(ctx, LESSONS, { start, prompter, shell });
    return 0;
  } finally {
    if (!ctx.io.prompter) prompter.close();
  }
}

export async function run(ctx) {
  if (ctx.command === "learn") return learn(ctx);
  const name = ctx.positionals[0];
  if (name && !findCommand(name)) throw new KoderError("err.unknownCommand", { name });
  ctx.stdout.write(`${commandHelpText(ctx, name)}\n`);
  return 0;
}
