import { saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { detectTheme } from "../theme.mjs";

const CHOICES = ["auto", "dark", "light"];

export async function run(ctx) {
  const wanted = ctx.positionals[0];
  if (!wanted) {
    ctx.stdout.write(`${ctx.t("theme.now", { setting: ctx.config.theme || "auto", active: detectTheme({ env: ctx.env, config: ctx.config }) })}\n`);
    return 0;
  }
  if (!CHOICES.includes(wanted)) throw new KoderError("err.flagValue", { flag: `theme ${wanted}` });
  saveConfig({ theme: wanted }, ctx.env);
  ctx.stdout.write(`${ctx.t("theme.set", { setting: wanted, active: detectTheme({ env: ctx.env, config: { theme: wanted } }) })}\n`);
  return 0;
}
