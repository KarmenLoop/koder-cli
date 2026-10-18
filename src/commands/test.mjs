import { generateTests } from "../workflows.mjs";

export const flags = {
  base: { type: "string" },
  check: { type: "string" },
  attempts: { type: "number" },
  timeout: { type: "number" },
};

export async function run(ctx) {
  const result = await generateTests(ctx, {
    files: ctx.positionals,
    base: ctx.opts.base,
    check: ctx.opts.check || "",
    attempts: ctx.opts.attempts ?? 2,
    timeoutMs: (ctx.opts.timeout ?? 600) * 1000,
  });
  return result.code;
}
