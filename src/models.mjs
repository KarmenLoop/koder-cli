import fs from "node:fs";
import path from "node:path";
import { cliHome, loadConfig } from "./config.mjs";
import { KoderError } from "./errors.mjs";
import { normalizeRecord, providerFile, saveProvider } from "./provider.mjs";

// The default model is provider.json; extra named models (MoA references,
// gateway overrides) live in models/<name>.json.
const NAME = /^[a-z0-9][a-z0-9._-]{0,40}$/i;

export function modelsDir(env = process.env) {
  return path.join(cliHome(env), "models");
}

export function checkName(name) {
  if (!NAME.test(String(name || ""))) throw new KoderError("model.badName", { name: String(name || "") });
  return String(name);
}

function modelPath(name, env) {
  return name === "default" ? providerFile(env) : path.join(modelsDir(env), `${checkName(name)}.json`);
}

function readRaw(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    throw new KoderError("model.badFile", { file });
  }
}

export function listModels(env = process.env) {
  const out = [];
  if (fs.existsSync(providerFile(env))) out.push({ name: "default", file: providerFile(env) });
  const dir = modelsDir(env);
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir).filter((item) => item.endsWith(".json")).sort()) {
      out.push({ name: file.replace(/\.json$/, ""), file: path.join(dir, file) });
    }
  }
  return out;
}

export function hasModel(name, env = process.env) {
  return fs.existsSync(modelPath(name, env));
}

export function loadModel(name, env = process.env) {
  const file = modelPath(name, env);
  if (!fs.existsSync(file)) throw new KoderError("model.unknown", { name });
  return { name, record: normalizeRecord(readRaw(file), env), source: file };
}

export function saveModel(name, raw, env = process.env) {
  if (name === "default") return saveProvider(raw, env);
  const file = modelPath(name, env);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  normalizeRecord(raw, raw.keyEnv ? { ...env, [raw.keyEnv]: env[raw.keyEnv] || "set-at-runtime" } : env);
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(raw, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
  fs.chmodSync(file, 0o600);
  return file;
}

export function removeModel(name, env = process.env) {
  fs.rmSync(modelPath(name, env), { force: true });
}

export function activeModelName(env = process.env, config = loadConfig(env)) {
  return config.activeModel && config.activeModel !== "default" && hasModel(config.activeModel, env) ? config.activeModel : "default";
}
