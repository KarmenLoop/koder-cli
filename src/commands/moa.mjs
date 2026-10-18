import { KoderError } from "../errors.mjs";
import { FANOUTS, loadMoa, normalizePreset, saveMoa } from "../moa.mjs";
import { checkName, hasModel } from "../models.mjs";

export const flags = {
  refs: { type: "string" },
  aggregator: { type: "string" },
  fanout: { type: "string" },
  privacy: { type: "string" },
  timeout: { type: "number" },
};

export async function run(ctx) {
  const [action = "show", name, ...rest] = ctx.positionals;
  const config = loadMoa(ctx.env);
  const out = (line) => ctx.stdout.write(`${line}\n`);
  if (action === "show" || action === "list") {
    const names = Object.keys(config.presets);
    if (!names.length) {
      out(ctx.t("moa.none"));
      return 0;
    }
    if (ctx.opts.json) {
      out(JSON.stringify(config, null, 2));
      return 0;
    }
    for (const preset of names) {
      const value = normalizePreset(config.presets[preset]);
      out(`${preset === config.active ? "*" : " "} ${preset.padEnd(12)}${ctx.t("moa.line", { refs: value.references.join(", "), aggregator: value.aggregator || ctx.t("moa.current"), fanout: value.fanout })}`);
    }
    return 0;
  }
  if (action === "set") {
    const preset = checkName(name || "default");
    const previous = config.presets[preset] || {};
    const raw = { ...previous };
    if (ctx.opts.refs) raw.references = ctx.opts.refs.split(",").map((item) => item.trim()).filter(Boolean);
    if (ctx.opts.aggregator !== undefined) raw.aggregator = ctx.opts.aggregator === "current" ? "" : ctx.opts.aggregator;
    if (ctx.opts.fanout) {
      if (!FANOUTS.includes(ctx.opts.fanout)) throw new KoderError("err.flagValue", { flag: "--fanout" });
      raw.fanout = ctx.opts.fanout;
    }
    if (ctx.opts.privacy) raw.privacy = ctx.opts.privacy === "off" ? "" : ctx.opts.privacy;
    if (ctx.opts.timeout) raw.timeoutMs = ctx.opts.timeout * 1000;
    const value = normalizePreset(raw);
    for (const ref of [...value.references, value.aggregator].filter(Boolean)) {
      if (!hasModel(ref, ctx.env)) throw new KoderError("model.unknown", { name: ref });
    }
    config.presets[preset] = value;
    if (!config.active || !config.presets[config.active]) config.active = preset;
    saveMoa(config, ctx.env);
    out(ctx.t("moa.saved", { name: preset, refs: value.references.join(", ") }));
    return 0;
  }
  if (action === "use") {
    if (!config.presets[name]) throw new KoderError("moa.unknown", { name: name || "" });
    config.active = name;
    saveMoa(config, ctx.env);
    out(ctx.t("moa.active", { name }));
    return 0;
  }
  if (action === "remove") {
    delete config.presets[name];
    if (config.active === name) config.active = Object.keys(config.presets)[0] || "default";
    saveMoa(config, ctx.env);
    out(ctx.t("moa.removed", { name }));
    return 0;
  }
  if (action === "run") {
    const prompt = [name, ...rest].filter(Boolean);
    return ctx.dispatch(["run", "--moa", ...prompt, ...(ctx.opts.yes ? ["--yes"] : []), ...(ctx.opts.json ? ["--json"] : []), ...(ctx.opts.workspace ? ["-w", ctx.opts.workspace] : [])]);
  }
  throw new KoderError("err.unknownCommand", { name: `moa ${action}` });
}
