import { saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { createT, normalizeLang } from "../i18n.mjs";

export async function run(ctx) {
  const wanted = ctx.positionals[0];
  if (!wanted) {
    ctx.stdout.write(`${ctx.t("lang.now", { lang: ctx.lang })}\n`);
    return 0;
  }
  const lang = normalizeLang(wanted);
  if (!lang) throw new KoderError("err.badLang");
  saveConfig({ lang }, ctx.env);
  ctx.stdout.write(`${createT(lang)("lang.set")}\n`);
  return 0;
}
