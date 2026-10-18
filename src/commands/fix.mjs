import { fixLoop } from "../workflows.mjs";

export const flags = {
  check: { type: "string" },
  attempts: { type: "number" },
  timeout: { type: "number" },
};

export async function run(ctx) {
  let description = ctx.positionals.join(" ").trim();
  const piped = await ctx.readStdin();
  if (piped) description = description ? `${description}\n\n<stdin>\n${piped}\n</stdin>` : piped;
  if (!ctx.opts.check && description) ctx.stderr.write(`${ctx.t("fix.noCheck")}\n`);
  const result = await fixLoop(ctx, {
    description,
    check: ctx.opts.check || "",
    attempts: ctx.opts.attempts ?? 3,
    timeoutMs: (ctx.opts.timeout ?? 600) * 1000,
  });
  return result.code;
}
