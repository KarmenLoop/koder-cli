import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { cliHome } from "../config.mjs";

export const DM_POLICIES = ["pairing", "allowlist", "open", "disabled"];
export const GROUP_POLICIES = ["disabled", "allowlist", "open"];

export function gatewayDir(env = process.env) {
  return path.join(cliHome(env), "gateway");
}

function file(env, name) {
  return path.join(gatewayDir(env), name);
}

function read(target, fallback) {
  try {
    return JSON.parse(fs.readFileSync(target, "utf8"));
  } catch {
    return fallback;
  }
}

function write(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
  const temp = `${target}.${process.pid}.${crypto.randomBytes(3).toString("hex")}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, target);
  fs.chmodSync(target, 0o600);
}

export function defaultWorkspace(env = process.env) {
  return path.join(env.HOME || os.homedir(), "Koder");
}

export function loadGateway(env = process.env) {
  const value = read(file(env, "config.json"), {});
  return {
    workspace: value.workspace || defaultWorkspace(env),
    interaction: value.interaction === "ask" ? "ask" : "agent",
    approvalTimeoutSec: Number(value.approvalTimeoutSec) > 0 ? Number(value.approvalTimeoutSec) : 300,
    moa: Boolean(value.moa),
    platforms: value.platforms && typeof value.platforms === "object" ? value.platforms : {},
  };
}

export function saveGateway(config, env = process.env) {
  write(file(env, "config.json"), config);
}

export function platformPolicy(entry = {}) {
  return {
    dmPolicy: DM_POLICIES.includes(entry.dmPolicy) ? entry.dmPolicy : "pairing",
    groupPolicy: GROUP_POLICIES.includes(entry.groupPolicy) ? entry.groupPolicy : "disabled",
    allowFrom: Array.isArray(entry.allowFrom) ? entry.allowFrom.map(String) : [],
    groupAllowFrom: Array.isArray(entry.groupAllowFrom) ? entry.groupAllowFrom.map(String) : [],
  };
}

export function loadPairing(env = process.env) {
  const value = read(file(env, "pairing.json"), {});
  return { pending: Array.isArray(value.pending) ? value.pending : [], approved: value.approved && typeof value.approved === "object" ? value.approved : {} };
}

export function savePairing(value, env = process.env) {
  write(file(env, "pairing.json"), value);
}

const PAIR_TTL_MS = 60 * 60 * 1000;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function requestPairing({ platform, userId, userName }, env = process.env, now = Date.now()) {
  const pairing = loadPairing(env);
  pairing.pending = pairing.pending.filter((item) => now - item.at < PAIR_TTL_MS);
  let entry = pairing.pending.find((item) => item.platform === platform && item.userId === userId);
  if (!entry) {
    const code = Array.from(crypto.randomBytes(6), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
    entry = { code, platform, userId, userName: userName || "", at: now };
    pairing.pending.push(entry);
  }
  savePairing(pairing, env);
  return entry;
}

export function approvePairing(code, env = process.env, now = Date.now()) {
  const pairing = loadPairing(env);
  const wanted = String(code || "").trim().toUpperCase();
  const entry = pairing.pending.find((item) => item.code === wanted && now - item.at < PAIR_TTL_MS);
  if (!entry) return null;
  pairing.pending = pairing.pending.filter((item) => item !== entry);
  pairing.approved[entry.platform] = [...new Set([...(pairing.approved[entry.platform] || []), entry.userId])];
  savePairing(pairing, env);
  return entry;
}

export function isApproved(platform, userId, env = process.env) {
  return (loadPairing(env).approved[platform] || []).includes(String(userId));
}

export function revoke(platform, userId, env = process.env) {
  const pairing = loadPairing(env);
  pairing.approved[platform] = (pairing.approved[platform] || []).filter((id) => id !== String(userId));
  savePairing(pairing, env);
}

export function loadState(env = process.env) {
  return read(file(env, "state.json"), null);
}

export function saveState(value, env = process.env) {
  write(file(env, "state.json"), value);
}

export function clearState(env = process.env) {
  fs.rmSync(file(env, "state.json"), { force: true });
}

export function platformData(platform, env = process.env) {
  return path.join(gatewayDir(env), "data", platform);
}

export function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
