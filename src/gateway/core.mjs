import fs from "node:fs";
import { importKernel } from "../agent.mjs";
import { KoderError } from "../errors.mjs";
import { createSession } from "../session.mjs";
import { unreachable } from "../turn.mjs";
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

  function admit(message) {
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
      entry = { key, session: null, busy: false, queue: Promise.resolve(), pending: null, moa: config.moa };
      chats.set(key, entry);
    }
    return entry;
  }

  async function deliver(message, text) {
    const adapter = adapters.get(message.platform);
    for (const chunk of splitText(text, adapter?.maxLength || 4000)) if (chunk.trim()) await message.reply(chunk);
  }

  async function askInChat(entry, message, pause) {
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
    await message.reply(prompt);
    const answer = await new Promise((resolve) => {
      const timer = setTimeout(() => {
        entry.pending = null;
        resolve(null);
      }, config.approvalTimeoutSec * 1000);
      entry.pending = {
        userId: message.userId,
        resolve(text) {
          clearTimeout(timer);
          entry.pending = null;
          resolve(text);
        },
      };
    });
    if (answer == null) {
      await message.reply(t("gw.timeout"));
      return { cancel: true };
    }
    if (pause.kind === "choice") {
      const index = Number(answer.trim()) - 1;
      return Number.isInteger(index) && index >= 0 && index < pause.options.length ? { index } : { cancel: true };
    }
    return { accept: YES.test(answer.trim()) };
  }

  async function runTurn(entry, message, text) {
    entry.busy = true;
    try {
      if (config.workspace) fs.mkdirSync(config.workspace, { recursive: true });
      entry.session ??= await sessionFactory(ctx, { workspace: config.workspace, interaction: config.interaction, quiet: true, moa: entry.moa });
      const outcome = await entry.session.turn(text, { silent: true, decide: (pause) => askInChat(entry, message, pause) });
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
    const text = String(message.text || "").trim();
    if (!text) return;
    status[message.platform] = { ...(status[message.platform] || {}), lastEventAt: Date.now() };
    const verdict = admit(message);
    if (!verdict.ok) {
      if (verdict.reply) await message.reply(verdict.reply).catch(() => {});
      return;
    }
    const entry = chatFor(message);
    if (entry.pending) {
      if (entry.pending.userId === message.userId) entry.pending.resolve(text);
      return;
    }
    if (/^\/(new|reset)$|^新会话$/i.test(text)) {
      entry.session = null;
      await message.reply(t("gw.reset"));
      return;
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
    entry.queue = entry.queue.then(() => runTurn(entry, message, text));
    return entry.queue;
  }

  const hub = {
    receive,
    status(platform, state, detail = "") {
      status[platform] = { ...(status[platform] || {}), state, detail, at: Date.now() };
      onState({ ...status });
    },
  };

  return {
    receive,
    hub,
    status,
    chats,
    async start(list) {
      for (const adapter of list) {
        adapters.set(adapter.id, adapter);
        hub.status(adapter.id, "connecting");
        try {
          await adapter.start({ receive, status: (state, detail) => hub.status(adapter.id, state, detail), log: (line) => log(`${adapter.id}: ${line}`) });
        } catch (error) {
          hub.status(adapter.id, "error", error?.message || String(error));
          log(`${adapter.id}: ${error?.message || error}`);
        }
      }
    },
    async stop() {
      for (const adapter of adapters.values()) await adapter.stop?.();
      for (const entry of chats.values()) {
        entry.pending?.resolve(null);
        if (entry.busy) await entry.session?.cancel();
      }
    },
  };
}
