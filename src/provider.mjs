import fs from "node:fs";
import path from "node:path";
import { cliHome } from "./config.mjs";
import { KoderError } from "./errors.mjs";

export function providerFile(env = process.env) {
  return path.join(cliHome(env), "provider.json");
}

const PASS = ["chatPath", "sendApiKeyHeader", "vendor"];
const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

// A pasted API key is not an environment-variable name. The setup prompt used
// to store that paste in keyEnv, then every later command looked up a variable
// that does not exist and reported the model as missing.
export function isEnvName(name) {
  return ENV_NAME.test(name);
}

export function normalizeRecord(raw, env = process.env) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new KoderError("model.badField", { field: "model" });
  const model = String(raw.model || "").trim();
  const baseUrl = String(raw.baseUrl || "").trim();
  if (!model) throw new KoderError("model.badField", { field: "model" });
  if (!baseUrl) throw new KoderError("model.badField", { field: "baseUrl" });
  if (!/^https?:\/\/[^/\s]+/i.test(baseUrl)) throw new KoderError("model.badUrl");
  const auth = raw.auth === "none" ? "none" : raw.auth || "bearer";
  let apiKey = typeof raw.apiKey === "string" ? raw.apiKey : "";
  const keyEnv = typeof raw.keyEnv === "string" ? raw.keyEnv.trim() : "";
  if (!apiKey && keyEnv) {
    if (!isEnvName(keyEnv)) apiKey = keyEnv;
    else {
      apiKey = env[keyEnv] || "";
      if (!apiKey && auth !== "none") throw new KoderError("model.keyEnvMissing", { name: keyEnv });
    }
  }
  if (!apiKey && auth !== "none") throw new KoderError("model.badField", { field: "apiKey / keyEnv" });
  const record = {
    name: String(raw.name || model).slice(0, 80),
    model,
    baseUrl,
    protocol: raw.protocol === "anthropic" ? "anthropic" : "openai",
    auth,
    apiKey,
  };
  if (Number.isFinite(Number(raw.contextWindow)) && Number(raw.contextWindow) > 0) record.contextWindow = Number(raw.contextWindow);
  if (Number.isFinite(Number(raw.maxOutput)) && Number(raw.maxOutput) > 0) record.maxOutput = Number(raw.maxOutput);
  for (const key of PASS) if (raw[key] !== undefined) record[key] = raw[key];
  return record;
}

function readFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    throw new KoderError("model.badFile", { file });
  }
}

// --provider file, then KODER_* environment (CI), then the saved CLI model.
export function resolveProvider({ file, env = process.env } = {}) {
  if (file) return { record: normalizeRecord(readFile(path.resolve(file)), env), source: file };
  if (env.KODER_MODEL && env.KODER_BASE_URL) {
    const raw = {
      name: env.KODER_MODEL,
      model: env.KODER_MODEL,
      baseUrl: env.KODER_BASE_URL,
      protocol: env.KODER_PROTOCOL,
      apiKey: env.KODER_API_KEY || "",
      auth: env.KODER_API_KEY ? "bearer" : env.KODER_AUTH === "none" ? "none" : "bearer",
    };
    if (raw.protocol === "anthropic" && env.KODER_API_KEY) raw.auth = "x-api-key";
    if (env.KODER_CONTEXT_WINDOW) raw.contextWindow = env.KODER_CONTEXT_WINDOW;
    if (env.KODER_MAX_OUTPUT) raw.maxOutput = env.KODER_MAX_OUTPUT;
    return { record: normalizeRecord(raw, env), source: "env" };
  }
  const active = activeName(env);
  const saved = active ? path.join(cliHome(env), "models", `${active}.json`) : providerFile(env);
  if (fs.existsSync(saved)) return { record: normalizeRecord(readFile(saved), env), source: saved };
  if (active && fs.existsSync(providerFile(env))) return { record: normalizeRecord(readFile(providerFile(env)), env), source: providerFile(env) };
  return null;
}

function activeName(env) {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(cliHome(env), "config.json"), "utf8"));
    return typeof config.activeModel === "string" && /^[a-z0-9][a-z0-9._-]{0,40}$/i.test(config.activeModel) && config.activeModel !== "default" ? config.activeModel : "";
  } catch {
    return "";
  }
}

export function saveProvider(raw, env = process.env) {
  // The named variable may only exist later, e.g. as a CI secret.
  normalizeRecord(raw, raw.keyEnv ? { ...env, [raw.keyEnv]: env[raw.keyEnv] || "set-at-runtime" } : env);
  const file = providerFile(env);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(raw, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
  fs.chmodSync(file, 0o600);
  return file;
}

export function publicRecord(record) {
  const key = record.apiKey || "";
  return {
    name: record.name,
    model: record.model,
    protocol: record.protocol,
    baseUrl: record.baseUrl,
    contextWindow: record.contextWindow || null,
    maxOutput: record.maxOutput || null,
    apiKey: key ? `…${key.slice(-4)}` : "",
  };
}
