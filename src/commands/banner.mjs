import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { animateBanner, renderBanner } from "../banner.mjs";
import { legacyConsole } from "../color.mjs";
import { cliHome } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { MASCOT_VERSION, packImage, unpackImage } from "../mascot.mjs";
import { theme } from "../theme.mjs";

export const flags = {
  ascii: { type: "bool", negatable: true },
  anim: { type: "bool", negatable: true },
};

// The settled frame is the same every time; keep it so later starts skip the render.
export function mascotCache(env) {
  const dir = path.join(cliHome(env), "cache");
  const file = (size) => path.join(dir, `mascot-v${MASCOT_VERSION}-${theme().name}-${size}.json`);
  return {
    get(size) {
      try {
        return unpackImage(JSON.parse(fs.readFileSync(file(size), "utf8")));
      } catch {
        return null;
      }
    },
    set(size, image) {
      try {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
        fs.writeFileSync(file(size), JSON.stringify(packImage(image)));
      } catch {}
    },
  };
}

function shortPath(dir) {
  const home = os.homedir();
  return dir === home || dir.startsWith(home + path.sep) ? `~${dir.slice(home.length)}` : dir;
}

const COPY = {
  zh: {
    env: "环境", commands: "常用命令",
    model: "模型", engine: "引擎", workspace: "目录", lang: "语言",
    noModel: "还没配置 · koder setup", koder: "Koder 内核", langValue: "中文 · /lang en 切英文",
    site: "官网", siteValue: "karmenloop.com/updates.html",
    groups: [["对话", "koder · run · ask"], ["质量", "review · fix · test"], ["编排", "flow · ci · moa"], ["接入", "acp · editor · gateway · scan"], ["设置", "setup · learn · doctor"]],
    summary: "17 课互动教程 · 30+ 模型预设 · 8 个聊天平台",
  },
  en: {
    env: "Environment", commands: "Commands",
    model: "Model", engine: "Engine", workspace: "Folder", lang: "Language",
    noModel: "not set · koder setup", koder: "Koder kernel", langValue: "English · /lang zh 中文",
    site: "Site", siteValue: "karmenloop.com/updates.html",
    groups: [["Chat", "koder · run · ask"], ["Quality", "review · fix · test"], ["Automate", "flow · ci · moa"], ["Connect", "acp · editor · gateway · scan"], ["Setup", "setup · learn · doctor"]],
    summary: "17 lessons · 30+ model presets · 8 chat apps",
  },
};

// What the panel shows on the right, Hermes-style: environment, then command groups.
export function bannerInfo(ctx) {
  const copy = COPY[ctx.lang === "en" ? "en" : "zh"];
  let model = [copy.model, copy.noModel, "warn"];
  try {
    const found = ctx.findProvider();
    if (found) model = [copy.model, found.record.name && found.record.name !== found.record.model ? `${found.record.model} · ${found.record.name}` : found.record.model, "ok"];
  } catch (error) {
    model = [copy.model, error instanceof KoderError ? ctx.t(error.key, error.vars) : copy.noModel, "warn"];
  }
  const engine = ctx.opts.engine || ctx.config.engine || "koder";
  return {
    title: `KODER CLI v${ctx.version} · KARMEN LOOP`,
    sections: [
      { title: copy.env, rows: [model, [copy.engine, engine === "koder" ? copy.koder : engine], [copy.site, copy.siteValue], [copy.workspace, shortPath(ctx.cwd)], [copy.lang, copy.langValue]] },
      { title: copy.commands, rows: copy.groups },
    ],
    summary: copy.summary,
  };
}

// --ascii, then KODER_ASCII, then the choice saved in koder setup, then auto-detection.
export function useAscii(ctx) {
  if (ctx.opts.ascii !== undefined) return ctx.opts.ascii;
  if (ctx.env.KODER_ASCII) return ctx.env.KODER_ASCII.trim() !== "0";
  if (ctx.config.glyphs === "ascii") return true;
  if (ctx.config.glyphs === "blocks") return false;
  return legacyConsole({ env: ctx.env });
}

export function bannerOptions(ctx) {
  const ascii = useAscii(ctx);
  return {
    columns: ctx.stdout.columns || Number(ctx.env.COLUMNS) || 80,
    rows: ctx.stdout.rows || Number(ctx.env.LINES) || 0,
    depth: ctx.depth,
    ascii,
    version: `v${ctx.version}`,
    tagline: ctx.t("app.tagline"),
    subline: ctx.t("app.subline"),
    hint: ctx.t("app.hint"),
    info: bannerInfo(ctx),
    cache: mascotCache(ctx.env),
  };
}

export function shouldAnimate(ctx) {
  return ctx.opts.anim !== false && ctx.config.anim !== false && ctx.stdout.isTTY && ctx.depth !== "none" && !ctx.env.CI && !ctx.env.KODER_NO_ANIM;
}

export async function showBanner(ctx) {
  const options = bannerOptions(ctx);
  if (shouldAnimate(ctx)) await animateBanner(ctx.stdout, options);
  else ctx.stdout.write(`${renderBanner(options).join("\n")}\n`);
  const keys = options.ascii ? ctx.t("app.keys").replace(/·/g, "|") : ctx.t("app.keys");
  ctx.stdout.write(`${ctx.depth === "none" ? keys : `\x1b[2m${keys}\x1b[0m`}\n`);
}

export async function run(ctx) {
  await showBanner(ctx);
  return 0;
}
