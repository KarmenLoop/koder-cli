import { versionText } from "../official.mjs";

export async function run(ctx) {
  ctx.stdout.write(`${versionText(ctx.version, ctx.lang)}\n`);
  return 0;
}
