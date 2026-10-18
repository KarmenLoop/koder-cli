import fs from "node:fs";
import { importKernel } from "../agent.mjs";
import { saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { activeModelName, checkName, hasModel, listModels, loadModel, removeModel, saveModel } from "../models.mjs";
import { isEnvName, providerFile, publicRecord } from "../provider.mjs";

export const flags = {
  preset: { type: "string" },
  "base-url": { type: "string" },
  model: { type: "string" },
  protocol: { type: "string" },
  "key-env": { type: "string" },
  "key-stdin": { type: "bool" },
  "context-window": { type: "number" },
  "max-output": { type: "number" },
  name: { type: "string" },
};

export async function presets(ctx) {
  const { MODEL_PRESETS } = await importKernel("fusion/catalog.mjs", ctx.env);
  return MODEL_PRESETS;
}

export function presetRecord(preset) {
  const raw = { name: preset.name, model: preset.model, baseUrl: preset.baseUrl, protocol: preset.protocol, auth: preset.auth, contextWindow: preset.contextWindow, maxOutput: preset.maxOutput };
  if (preset.chatPath) raw.chatPath = preset.chatPath;
  if (preset.sendApiKeyHeader) raw.sendApiKeyHeader = preset.sendApiKeyHeader;
  return raw;
}

export function readHidden(ctx, prompt) {
  const input = ctx.stdin;
  return new Promise((resolve) => {
    ctx.stderr.write(prompt);
    let value = "";
    const wasRaw = input.isRaw;
    input.setRawMode?.(true);
    input.resume();
    const done = (result) => {
      input.setRawMode?.(wasRaw);
      input.pause();
      input.off("data", onData);
      ctx.stderr.write("\n");
      resolve(result);
    };
    const onData = (chunk) => {
      for (const ch of chunk.toString()) {
        if (ch === "\r" || ch === "\n" || ch === "\u0004") return done(value);
        if (ch === "\u0003") return done("");
        if (ch === "\u007f") value = value.slice(0, -1);
        else value += ch;
      }
    };
    input.on("data", onData);
  });
}

export async function buildRaw(ctx, base = {}) {
  const o = ctx.opts;
  let raw = { ...base };
  if (o.preset) {
    const preset = (await presets(ctx)).find((item) => item.id === o.preset);
    if (!preset) throw new KoderError("model.unknownPreset", { id: o.preset });
    raw = presetRecord(preset);
  }
  if (o.baseUrl) raw.baseUrl = o.baseUrl;
  if (o.model) raw.model = o.model;
  if (o.protocol) raw.protocol = o.protocol === "anthropic" ? "anthropic" : "openai";
  if (o.name) raw.name = o.name;
  if (o.contextWindow) raw.contextWindow = o.contextWindow;
  if (o.maxOutput) raw.maxOutput = o.maxOutput;
  if (raw.protocol === "anthropic" && !raw.auth) raw.auth = "x-api-key";
  if (o.keyEnv) {
    if (isEnvName(o.keyEnv)) {
      raw.keyEnv = o.keyEnv;
      delete raw.apiKey;
    } else {
      raw.apiKey = o.keyEnv;
      delete raw.keyEnv;
    }
  } else if (raw.auth !== "none") {
    let key = "";
    if (o.keyStdin) key = (await ctx.readStdin()).trim();
    else if (ctx.stdin.isTTY && !raw.apiKey) key = (await readHidden(ctx, ctx.t("model.keyPrompt"))).trim();
    if (key) raw.apiKey = key;
  }
  return raw;
}

function show(ctx, found) {
  const shown = { ...publicRecord(found.record), source: found.source };
  ctx.stdout.write(ctx.opts.json ? `${JSON.stringify(shown)}\n` : `${Object.entries(shown).map(([k, v]) => `${k.padEnd(14)}${v ?? ""}`).join("\n")}\n`);
}

export async function run(ctx) {
  const [action = "show", target] = ctx.positionals;
  const out = (line) => ctx.stdout.write(`${line}\n`);
  if (action === "context" || action === "limits") {
    if (!target && ctx.findProvider()?.source === "env") throw new Error("Context is controlled by KODER_CONTEXT_WINDOW and KODER_MAX_OUTPUT in the current environment.");
    const name = target ? checkName(target) : activeModelName(ctx.env);
    const found = loadModel(name, ctx.env);
    if (ctx.opts.contextWindow !== undefined || ctx.opts.maxOutput !== undefined) {
      const raw = JSON.parse(fs.readFileSync(found.source, "utf8"));
      raw.contextWindow = ctx.opts.contextWindow ?? found.record.contextWindow;
      raw.maxOutput = ctx.opts.maxOutput ?? Math.min(found.record.maxOutput, Math.floor(raw.contextWindow / 4));
      saveModel(name, raw, ctx.env);
      ctx._record = undefined;
    }
    const { record } = loadModel(name, ctx.env);
    out(`${name}: contextWindow=${record.contextWindow}; maxOutput=${record.maxOutput}`);
    return 0;
  }
  if (action === "test" || action === "check") {
    const { printModelCheck } = await import("../model-check.mjs");
    const found = target ? loadModel(checkName(target), ctx.env) : ctx.requireProvider();
    return printModelCheck(ctx, found.record);
  }
  if (action === "presets") {
    for (const preset of await presets(ctx)) out(`${preset.id.padEnd(13)}${String(preset.model || "-").padEnd(34)}${preset.protocol.padEnd(10)}${preset.name}`);
    return 0;
  }
  if (action === "set" || action === "add") {
    const name = action === "set" ? target || "default" : checkName(target);
    const file = saveModel(name, await buildRaw(ctx), ctx.env);
    out(ctx.t("model.saved", { file }));
    return 0;
  }
  if (action === "list") {
    const active = activeModelName(ctx.env);
    const models = listModels(ctx.env);
    if (!models.length) {
      out(ctx.t("model.none"));
      return 1;
    }
    for (const item of models) {
      let label = "";
      try {
        const { record } = loadModel(item.name, ctx.env);
        label = `${record.model} · ${record.baseUrl}`;
      } catch (error) {
        label = error instanceof KoderError ? ctx.t(error.key, error.vars) : error.message;
      }
      out(`${item.name === active ? "*" : " "} ${item.name.padEnd(14)}${label}`);
    }
    return 0;
  }
  if (action === "use") {
    const name = checkName(target);
    if (name !== "default" && !hasModel(name, ctx.env)) throw new KoderError("model.unknown", { name });
    saveConfig({ activeModel: name }, ctx.env);
    out(ctx.t("model.active", { name }));
    return 0;
  }
  if (action === "remove") {
    removeModel(checkName(target), ctx.env);
    out(ctx.t("model.removed", { name: target }));
    return 0;
  }
  if (action === "clear") {
    fs.rmSync(providerFile(ctx.env), { force: true });
    out(ctx.t("model.cleared"));
    return 0;
  }
  if (target) {
    show(ctx, loadModel(checkName(target), ctx.env));
    return 0;
  }
  const found = ctx.findProvider();
  if (!found) {
    out(ctx.t("model.none"));
    return 1;
  }
  show(ctx, found);
  return 0;
}
