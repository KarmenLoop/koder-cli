import { KoderError } from "../errors.mjs";
import { aboutText, asksAboutUs } from "../official.mjs";
import { createSession } from "../session.mjs";

export async function run(ctx) {
  // `koder revew` is a mistyped command, not a one-word task for the model.
  if (ctx.word && ctx.word === ctx.positionals[0] && ctx.positionals.length === 1 && /^[a-z][a-z-]*$/.test(ctx.word)) {
    throw new KoderError("err.unknownCommand", { name: ctx.word });
  }
  let prompt = ctx.positionals.join(" ").trim();
  const piped = await ctx.readStdin();
  if (piped) prompt = prompt ? `${prompt}\n\n<stdin>\n${piped}\n</stdin>` : piped;
  if (!prompt) throw new KoderError("err.noPrompt");
  if (!piped && asksAboutUs(prompt)) {
    ctx.stdout.write(`${aboutText(ctx.lang)}\n`);
    return 0;
  }
  const ask = ctx.command === "ask";
  const session = await createSession(ctx, { interaction: ask ? "ask" : "agent" });
  const outcome = await session.turn(prompt);
  return outcome.code;
}
