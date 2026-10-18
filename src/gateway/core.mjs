import crypto from "node:crypto";
import fs from "node:fs";
import { importKernel } from "../agent.mjs";
import { KoderError } from "../errors.mjs";
import { createSession } from "../session.mjs";
import { unreachable } from "../turn.mjs";
import { createMemory } from "../memory.mjs";
import { isApproved, loadGateway, platformPolicy, requestPairing } from "./store.mjs";

// Chat platforms carry the same approvals as the terminal: nothing is written
// or run until the same person answers yes in the same chat.
const YES = /^(y|yes|ok|okay|是|是的|允许|同意|确认|好|好的|可以|执行|接受|accept|allow|approve|go)$/i;

export function splitText(text, max = 4000) {
  const value = String(text || "");
  if (value.length <= max) return [value];
  const chunks = [];
  let rest = value;
  while (rest.length > max) {
    let cut = rest.lastIndexOf("\n", max);
    if (cut < max * 0.5) cut = max;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^\n/, "");
  }
  if (rest) chunks.push(rest);
  return chunks;
}

function diffPreview(rows, limit = 30) {
  const changed = rows.filter((row) => row.type === "add" || row.type === "del");
  const lines = changed.slice(0, limit).map((row) => `${row.type === "add" ? "+" : "-"} ${row.text}`);
  if (changed.length > limit) lines.push(`… +${changed.length - limit}`);
  return lines.join("\n");
}

export function createGateway(ctx, { config = loadGateway(ctx.env), log = () => {}, sessionFactory = createSession, onState = () => {} } = {}) {
  const t = (key, vars) => ctx.t(key, vars);
  const chats = new Map();
  const adapters = new Map();
  const status = {};
  let diff = null;
  let closed = false;

  function admit(message) {
    if (!config.platforms[message.platform] || config.platforms[message.platform].enabled === false) return { ok: false };
    const policy = platformPolicy(config.platforms[message.platform]);
    if (message.isGroup) {
      if (policy.groupPolicy === "disabled" || !message.mentioned) return { ok: false };
      if (policy.groupPolicy === "allowlist" && !policy.groupAllowFrom.includes(message.chatId)) return { ok: false };
      return { ok: true };
    }
    if (policy.dmPolicy === "disabled") return { ok: false };
    if (policy.dmPolicy === "open") return { ok: true };
    if (policy.allowFrom.includes(message.userId) || isApproved(message.platform, message.userId, ctx.env)) return { ok: true };
    if (policy.dmPolicy === "pairing") {
      const entry = requestPairing({ platform: message.platform, userId: message.userId, userName: message.userName }, ctx.env);
      log(`pairing ${message.platform} ${message.userId} ${entry.code}`);
      return { ok: false, reply: t("gw.pairing", { code: entry.code }) };
    }
    return { ok: false, reply: t("gw.notAllowed") };
  }

  function chatFor(message) {
    const key = `${message.platform}:${message.chatId}`;
    let entry = chats.get(key);
    if (!entry) {
      entry = { key, session: null, busy: false, queue: Promise.resolve(), pending: null, moa: config.moa, generation: 0, resetting: false };
      chats.set(key, entry);
    }
    return entry;
  }

  async function deliver(message, text) {
    const adapter = adapters.get(message.platform);
    const chunks = splitText(text, adapter?.maxLength || 4000).filter((chunk) => chunk.trim());
    if (message.replyChunks) return message.replyChunks(chunks);
    for (const chunk of chunks) await message.reply(chunk);
  }

  async function askInChat(entry, message, pause) {
    if (entry.retired) return { cancel: true };
    if (pause.kind === "secret") {
      await message.reply(t("turn.secret", { service: pause.service }));
      return { cancel: true };
    }
    let prompt;
    if (pause.kind === "change") {
      diff ??= (await importKernel("harness/diff.mjs", ctx.env)).unifiedDiff;
      prompt = t("gw.askChange", { path: pause.path, diff: diffPreview(diff(pause.before, pause.after)) });
    } else if (pause.kind === "approval") {
      prompt = t("gw.askCommand", { command: pause.command });
    } else {
      prompt = `${t("turn.choice", { question: pause.question })}\n${pause.options.map((option, i) => `${i + 1}. ${option}`).join("\n")}\n${t("gw.askChoice")}`;
    }
    // Register before sending: the peer can answer before the transport ACK.
    const waiting = new Promise((resolve) => {
      const timer = setTimeout(() => {
        entry.pending = null;
        resolve(null);
      }, config.approvalTimeoutSec * 1000);
      entry.pending = {
        userId: message.userId,
        resolve(text, responder) {
          clearTimeout(timer);
          entry.pending = null;
          if (responder) {
            message.reply = responder.reply;
            message.replyChunks = responder.replyChunks;
          }
          resolve(text);
        },
      };
    });
    try { await deliver(message, prompt); }
    catch (error) { entry.pending?.resolve(null); throw error; }
    const answer = await waiting;
    if (answer == null) {
      if (entry.retired || entry.resetting) return { cancel: true };
      await message.reply(t("gw.timeout"));
      return { cancel: true };
    }
    if (pause.kind === "choice") {
      const index = Number(answer.trim()) - 1;
      return Number.isInteger(index) && index >= 0 && index < pause.options.length ? { index } : { cancel: true };
    }
    return { accept: YES.test(answer.trim()) };
  }

  function sessionScope(message) {
    const credentials = config.platforms[message.platform] || {};
    const account = credentials.accountId || credentials.appId || credentials.botId || credentials.phoneNumberId || credentials.clientId || "";
    const binding = crypto.createHash("sha256").update(JSON.stringify(account ? [account, credentials.domain || "", credentials.apiBase || credentials.baseUrl || ""] : [credentials.token || credentials.botToken || credentials.botSecret || credentials.appSecret || credentials.clientSecret || credentials.accessToken || ""])).digest("hex");
    return ["gateway", message.platform, binding, message.chatId, message.userId];
  }

  async function sessionFor(entry, message) {
    if (entry.session && entry.sessionOwner === message.userId) return entry.session;
    if (config.workspace) fs.mkdirSync(config.workspace, { recursive: true });
    entry.sessionOwner = message.userId;
    entry.session = null;
    entry.session = await sessionFactory(ctx, { workspace: config.workspace, interaction: config.interaction, quiet: true, moa: entry.moa, memoryScope: sessionScope(message), memoryName: "default" });
    entry.sessionOwner = message.userId;
    return entry.session;
  }

  async function runTurn(entry, message, text, generation) {
    if (closed || entry.retired || generation !== entry.generation) return;
    entry.busy = true;
    try {
      await sessionFor(entry, message);
      if (entry.retired || entry.resetting || generation !== entry.generation) { await entry.session.cancel(); return; }
      const outcome = await entry.session.turn(text, { silent: true, decide: (pause) => askInChat(entry, message, pause) });
      if (entry.retired || entry.resetting || generation !== entry.generation) return;
      let reply = outcome.text;
      if (unreachable(outcome.thread)) reply = t("model.missing");
      else if (outcome.cancelled) reply = t(outcome.reason || "turn.cancelled");
      await deliver(message, reply || t("gw.done"));
    } catch (error) {
      const detail = error instanceof KoderError ? t(error.key, error.vars) : error?.message || String(error);
      log(`turn ${entry.key}: ${detail}`);
      await message.reply(t("gw.error", { message: detail })).catch(() => {});
    } finally {
      entry.busy = false;
    }
  }

  async function receive(message) {
    if (closed || !message.platform || !message.chatId || !message.userId) return;
    const text = String(message.text || "").trim();
    if (!text) return;
    status[message.platform] = { ...(status[message.platform] || {}), lastEventAt: Date.now() };
    const verdict = admit(message);
    if (!verdict.ok) {
      if (verdict.reply) await message.reply(verdict.reply).catch(() => {});
      return;
    }
    const entry = chatFor(message);
    const wantsNew = /^\/(new|reset)$|^新会话$/i.test(text);
    if (entry.pending && (!wantsNew || entry.pending.userId !== message.userId)) {
      if (entry.pending.userId === message.userId) entry.pending.resolve(text, message);
      return;
    }
    if (wantsNew) {
      if (entry.busy && entry.sessionOwner !== message.userId) return;
      entry.generation += 1;
      entry.resetting = true;
      entry.pending?.resolve(null, message);
      const activeSession = entry.session;
      const cancellation = entry.busy ? Promise.resolve().then(() => activeSession?.cancel()).then(() => null, error => error) : Promise.resolve(null);
      // Publish the reset barrier before yielding to cancellation: later input
      // must never run against the old history while cancel is settling.
      entry.queue = entry.queue.then(async () => {
        if (entry.retired) return;
        try {
          const error = await cancellation;
          if (error) throw error;
          if (entry.session && entry.sessionOwner === message.userId) await entry.session.reset();
          else if (ctx.opts.memory !== false) {
            if (config.workspace) fs.mkdirSync(config.workspace, { recursive: true });
            const memory = createMemory({ workspace: config.workspace || ctx.workspace(), env: ctx.env, scope: sessionScope(message) });
            memory.transact(data => memory.reset(data));
          }
          entry.session = null;
          await message.reply(t("gw.reset"));
        } catch (error) { await message.reply(t("gw.error", { message: error.message })).catch(() => {}); }
        finally { entry.resetting = false; }
      });
      return entry.queue;
    }
    if (/^\/(stop|cancel)$|^停止$/i.test(text)) {
      if (entry.busy) await entry.session?.cancel();
      await message.reply(t("gw.stopped"));
      return;
    }
    if (/^\/moa$/i.test(text)) {
      entry.moa = !entry.moa;
      entry.session = null;
      await message.reply(t(entry.moa ? "gw.moaOn" : "gw.moaOff"));
      return;
    }
    if (/^\/(help|start)$|^帮助$/i.test(text)) {
      await message.reply(t("gw.help"));
      return;
    }
    if (entry.busy) await message.reply(t("gw.queued")).catch(() => {});
    const generation = entry.generation;
    entry.queue = entry.queue.then(() => runTurn(entry, message, text, generation));
    return entry.queue;
  }

  const hub = {
    receive,
    status(platform, state, detail = "") {
      status[platform] = { ...(status[platform] || {}), state, detail, at: Date.now() };
      onState({ ...status });
    },
  };

  function detach(ids) {
    const previous = [], retired = [];
    for (const id of ids) {
      const adapter = adapters.get(id);
      if (adapter) previous.push(adapter);
      adapters.delete(id);
    }
    // Revoke every chat before the first asynchronous cancellation.
    for (const [key, entry] of chats) {
      if (!ids.has(key.split(":")[0])) continue;
      entry.retired = true;
      entry.pending?.resolve(null);
      chats.delete(key);
      retired.push(entry);
    }
    for (const id of ids) if (status[id]) hub.status(id, "disconnected");
    return Promise.all([...retired.map(async (entry) => entry.session?.cancel()), ...previous.map(async (adapter) => adapter.stop?.())]);
  }

  return {
    receive,
    hub,
    status,
    chats,
    async start(list) {
      await Promise.all(list.map(async (adapter) => {
        if (closed) return;
        adapters.set(adapter.id, adapter);
        hub.status(adapter.id, "connecting");
        try {
          await adapter.start({ receive: (message) => adapters.get(adapter.id) === adapter ? receive(message) : undefined, status: (state, detail) => { if (adapters.get(adapter.id) === adapter) hub.status(adapter.id, state, detail); }, log: (line) => log(`${adapter.id}: ${line}`) });
          if (closed || adapters.get(adapter.id) !== adapter) await adapter.stop?.();
        } catch (error) {
          if (!closed && adapters.get(adapter.id) === adapter) hub.status(adapter.id, "error", error?.message || String(error));
          log(`${adapter.id}: ${error?.message || error}`);
        }
      }));
    },
    async remove(id) {
      await detach(new Set(Array.isArray(id) ? id : [id]));
    },
    async stop() {
      closed = true;
      const ids = new Set([...adapters.keys(), ...Array.from(chats.keys(), (key) => key.split(":")[0])]);
      await detach(ids);
    },
  };
}
