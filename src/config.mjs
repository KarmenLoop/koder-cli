import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { normalizeLang } from "./i18n.mjs";

export function cliHome(env = process.env) {
  return path.resolve(env.KODER_CLI_HOME || path.join(os.homedir(), ".koder-cli"));
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function loadConfig(env = process.env) {
  const value = readJson(path.join(cliHome(env), "config.json"));
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function saveConfig(patch, env = process.env) {
  const home = cliHome(env);
  fs.mkdirSync(home, { recursive: true, mode: 0o700 });
  const next = { ...loadConfig(env), ...patch };
  const file = path.join(home, "config.json");
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
  return next;
}

// --lang beats KODER_LANG beats the saved choice; Chinese is the default.
export function resolveLang({ flag, env = process.env, config = loadConfig(env) } = {}) {
  return normalizeLang(flag) || normalizeLang(env.KODER_LANG) || normalizeLang(config.lang) || "zh";
}
