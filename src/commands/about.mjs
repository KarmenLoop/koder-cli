import { aboutText } from "../official.mjs";

export async function run(ctx) {
  ctx.stdout.write(`${aboutText(ctx.lang)}\n`);
  return 0;
}
