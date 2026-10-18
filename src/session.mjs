import { importKernel, openAgent, watcher } from "./agent.mjs";
import { lineDecider } from "./ask.mjs";
import { KoderError } from "./errors.mjs";
import { createPrinter, jsonEvent } from "./format.mjs";
import { createMoaProvider, loadMoa, normalizePreset } from "./moa.mjs";
import { loadModel } from "./models.mjs";
import { closedDecision, yesDecision } from "./policy.mjs";
import { withModelEndpoint } from "./model-http.mjs";
import { connectionHint } from "./model-check.mjs";
import { diagnosticFetch, exitCode, runPrompt, unreachable } from "./turn.mjs";
import { createMemory } from "./memory.mjs";
import { projectContext } from "./context.mjs";

export const MODES = ["standard", "code", "minimal", "plan", "execute", "report", "enhance"];

export function pickDecider(ctx, { approve } = {}) {
  if (ctx.io.decide) return ctx.io.decide;
  if (approve === "auto" || (approve !== "never" && ctx.opts.yes)) return yesDecision;
  if (approve === "never") return closedDecision;
  if (ctx.io.prompter) return lineDecider({ t: (key, vars) => ctx.t(key, vars), prompter: ctx.io.prompter });
  if (!ctx.opts.json && (ctx.stdin.isTTY || ctx.stdout.isTTY) && !ctx.io.noTerminal) return lineDecider({ t: (key, vars) => ctx.t(key, vars) });
  let warned = false;
  return (pause) => {
    if (!warned && pause.kind !== "secret") {
      warned = true;
      ctx.stderr.write(`${ctx.t("turn.closed")}\n`);
    }
    return closedDecision(pause);
  };
}

export function moaRequested(ctx, option) {
  if (option !== undefined) return option;
  if (ctx.opts.moaPreset) return ctx.opts.moaPreset;
  return Boolean(ctx.opts.moa);
}

export async function buildMoa(ctx, { preset: wanted, fetchImpl, onEvent }) {
  const config = loadMoa(ctx.env);
  const name = typeof wanted === "string" && wanted ? wanted : config.active || "default";
  if (!config.presets[name]) throw new KoderError("moa.unknown", { name });
  const preset = normalizePreset(config.presets[name]);
  const { createProvider } = await importKernel("harness/providers.mjs", ctx.env);
  const helpers = await importKernel("fusion/tokens.mjs", ctx.env);
  const make = (record) => ({
    model: record.model, name: record.name, contextWindow: record.contextWindow,
    async complete(options) {
      const system = { role: "system", content: options.messages.filter(m => m.role === "system").map(m => m.content).join("\n\n") };
      const profile = { contextWindow: record.contextWindow || 8192, maxOutput: Math.min(record.maxOutput || 4096, options.maxOutput || Infinity) };
      const projection = projectContext({ system, history: options.messages.filter(m => m.role !== "system"), tools: options.tools, profile, helpers });
      const provider = createProvider({ provider: { ...record, id: record.id || "cli", contextWindow: profile.contextWindow, maxOutput: projection.outputBudget }, fetchImpl: withModelEndpoint(fetchImpl, record) });
      return provider.complete({ ...options, messages: projection.messages });
    },
  });
  const aggregatorRecord = preset.aggregator ? loadModel(preset.aggregator, ctx.env).record : ctx.requireProvider().record;
  const referenceRecords = preset.references.map(ref => ({ label: ref, record: loadModel(ref, ctx.env).record }));
  const references = referenceRecords.map(ref => ({ label: ref.label, provider: make(ref.record) }));
  const provider = createMoaProvider({ aggregator: make(aggregatorRecord), references, lang: ctx.lang, fanout: preset.fanout, privacy: preset.privacy, timeoutMs: preset.timeoutMs, onEvent });
  return { provider, record: aggregatorRecord, name, secrets: [aggregatorRecord.apiKey, ...referenceRecords.map(ref => ref.record.apiKey)].filter(Boolean) };
}

export const HERMES_ENGINE = { command: "hermes", args: ["acp"] };

export function engineFor(ctx) {
  const name = ctx.opts.engine || ctx.config?.engine || "koder";
  // Inside a bridged agent process, run natively so Koder never bridges to itself.
  if (name === "koder" || ctx.env.KODER_ENGINE_DEPTH) return null;
  const configured = ctx.config?.engines?.[name];
  if (configured?.command) return { name, command: configured.command, args: Array.isArray(configured.args) ? configured.args : ["acp"] };
  if (name === "hermes") return { name, ...HERMES_ENGINE };
  throw new KoderError("engine.unknown", { name });
}

// External ACP agents (Hermes, or any ACP-speaking CLI) behind the same turn() contract.
async function createEngineSession(ctx, engine, { workspace, mode, quiet, out }) {
  const { createAcpSession } = await import("./acp-client.mjs");
  const { unifiedDiff } = await importKernel("harness/diff.mjs", ctx.env).catch(() => ({ unifiedDiff: null }));
  const printer = createPrinter({ out, t: (key, vars) => ctx.t(key, vars), depth: out === ctx.stdout ? ctx.depth : ctx.errDepth, diff: unifiedDiff });
  let session;
  try {
    session = await createAcpSession(ctx, { command: engine.command, args: engine.args, workspace, mode, onLog: ctx.env.KODER_DEBUG ? (line) => ctx.stderr.write(line) : undefined });
  } catch (error) {
    throw new KoderError("engine.failed", { name: engine.name, message: error.message });
  }
  return {
    ...session,
    moa: "",
    async turn(text, { decide = pickDecider(ctx), silent = quiet, onEvent } = {}) {
      const json = ctx.opts.json && !silent;
      const outcome = await session.turn(text, {
        decide,
        onEvent(event) {
          onEvent?.(event);
          if (json) {
            const value = jsonEvent(event);
            if (value) ctx.stdout.write(`${JSON.stringify(value)}\n`);
          } else if (!silent) printer.event(event);
        },
      });
      printer.close();
      if (json) ctx.stdout.write(`${JSON.stringify({ type: "result", status: outcome.cancelled ? "cancelled" : "idle", exitCode: outcome.code, text: outcome.text })}\n`);
      return outcome;
    },
  };
}

// One harness per session; each call to turn() continues the same thread.
export async function createSession(ctx, { workspace = ctx.workspace(), mode, interaction = "agent", quiet = false, out = ctx.stdout, moa, memoryScope = ["terminal"], memoryName = ctx.opts.session || "default", memory = ctx.opts.memory ?? (["run", "ask", "chat", "gateway", "connect"].includes(ctx.command) || Boolean(ctx.opts.session)) } = {}) {
  const chosen = mode || ctx.opts.mode || "standard";
  if (!MODES.includes(chosen)) throw new KoderError("err.badMode", { mode: chosen, modes: MODES.join(", ") });
  const engine = engineFor(ctx);
  if (engine) return createEngineSession(ctx, engine, { workspace, mode: chosen, quiet, out });
  const diag = diagnosticFetch(ctx.io.fetchImpl || globalThis.fetch, { env: ctx.env });
  let providerOverride = ctx.io.providerOverride || null;
  let record = providerOverride ? null : ctx.requireProvider().record;
  let moaListener = null;
  const wantMoa = moaRequested(ctx, moa);
  let moaName = "";
  let modelSecrets = [record?.apiKey].filter(Boolean);
  if (wantMoa) {
    const built = await buildMoa(ctx, { preset: wantMoa, fetchImpl: diag.fetch, onEvent: (event) => moaListener?.(event) });
    if (!ctx.io.providerOverride) {
      providerOverride = built.provider;
      record = built.record;
    }
    moaName = built.name;
    modelSecrets = [...modelSecrets, ...built.secrets];
  }
  const persistent = memory ? createMemory({ workspace, env: ctx.env, scope: memoryScope, name: memoryName, secrets: modelSecrets }) : null;
  let memoryData = persistent?.read() || { notes: [], interrupted: false };
  let thread, lease = false, activeTurn = false, startedFresh = false, contextFailure = null, priorInterrupted = false, contextNotified = false, turnSilent = quiet;
  const helpers = await importKernel("fusion/tokens.mjs", ctx.env);
  const nativeRecord = providerOverride ? null : record;
  const { createProvider } = await importKernel("harness/providers.mjs", ctx.env);
  const originalProvider = providerOverride;
  const profile = { contextWindow: record?.contextWindow || originalProvider?.contextWindow || 8192, maxOutput: record?.maxOutput || originalProvider?.maxOutput || 4096 };
  providerOverride = { ...(originalProvider || {model: record.model}), async complete(options) {
    try {
      const projection = projectContext({ system: options.messages.find(m => m.role === "system") || { role: "system", content: "" }, history: thread.messages, tools: options.tools, profile, notes: memoryData.notes, interrupted: priorInterrupted, query: [...thread.messages].reverse().find(m => m.role === "user")?.content || "", helpers });
      thread.usage = { ...thread.usage, estimated: projection.estimated, dropped: projection.dropped, budget: projection.inputBudget, window: profile.contextWindow, output: projection.outputBudget, ratio: 1 };
      if (projection.dropped && !contextNotified && !turnSilent) {
        contextNotified = true;
        ctx.stderr.write(ctx.lang === "en" ? "Earlier context compacted; full history remains in local memory.\n" : "较早上下文已压缩，完整历史仍保存在本机记忆中。\n");
      }
      const provider = nativeRecord ? createProvider({ provider: { ...nativeRecord, id: "cli", contextWindow: profile.contextWindow, maxOutput: projection.outputBudget }, fetchImpl: withModelEndpoint(diag.fetch, nativeRecord) }) : originalProvider;
      return await provider.complete({ ...options, messages: projection.messages, maxOutput: projection.outputBudget });
    } catch (error) { if (error.code === "CONTEXT_BUDGET_EXCEEDED") contextFailure = error; throw error; }
  } };
  const harness = await openAgent({ workspace, record, providerOverride, fetchImpl: diag.fetch, env: ctx.env });
  const { unifiedDiff } = await importKernel("harness/diff.mjs", ctx.env);
  const watch = watcher(harness);
  const restore = async (data) => {
    const next = harness.createThread();
    next.mode = chosen; next.interaction = interaction;
    if (data.conversation) {
      next.id = data.conversation.id;
      next.title = data.conversation.title;
      next.createdAt = data.conversation.createdAt;
      next.messages = structuredClone(data.conversation.messages);
    }
    thread = next;
    await harness.addThread(thread);
  };
  await restore(memoryData);
  const saveThread = harness.store.saveThread.bind(harness.store);
  harness.store.saveThread = async (value) => {
    await saveThread(value);
    if (lease && value.id === thread.id) memoryData = persistent.checkpoint(value, memoryData);
  };
  const printer = createPrinter({ out, t: (key, vars) => ctx.t(key, vars), depth: out === ctx.stdout ? ctx.depth : ctx.errDepth, diff: unifiedDiff });

  return {
    harness,
    workspace,
    moa: moaName,
    get thread() {
      return thread;
    },
    memoryInfo() { return { enabled: Boolean(persistent), file: persistent?.file || null, messages: thread.messages.length, notes: memoryData.notes.length, session: memoryName }; },
    async reset() {
      if (activeTurn) throw new Error("会话正在执行，请先停止后再新建。");
      if (persistent) {
        persistent.acquire();
        try { memoryData = persistent.reset(persistent.read()); await restore(memoryData); }
        finally { persistent.release(); }
      } else { memoryData = { notes: [], interrupted: false }; await restore(memoryData); }
      startedFresh = true;
    },
    cancel() {
      return harness.cancel(thread.id);
    },
    async turn(text, { decide = pickDecider(ctx), mode: turnMode, interaction: turnInteraction, silent = quiet, onEvent } = {}) {
      const json = ctx.opts.json && !silent;
      const handle = (event) => {
        onEvent?.(event);
        if (json) {
          const value = jsonEvent(event);
          if (value) ctx.stdout.write(`${JSON.stringify(value)}\n`);
        } else if (!silent) {
          printer.event(event);
        }
      };
      if (activeTurn) throw new Error("此会话正在执行，请等待本轮结束。");
      activeTurn = true;
      contextFailure = null;
      contextNotified = false;
      turnSilent = silent;
      diag.state.last = null;
      moaListener = handle;
      try {
        if (persistent) {
          persistent.acquire();
          memoryData = persistent.read();
          priorInterrupted = Boolean(memoryData.interrupted);
          if (ctx.opts.new && !startedFresh) { memoryData = persistent.reset(memoryData); priorInterrupted = false; }
          await restore(memoryData);
          if (!startedFresh && thread.messages.length && !silent) ctx.stderr.write(ctx.lang === "en" ? `Restored session ${memoryName} (${thread.messages.length} messages).\n` : `已恢复会话 ${memoryName}（${thread.messages.length} 条历史）。\n`);
          lease = true;
        }
        startedFresh = true;
        const outcome = await runPrompt({ harness, watch, thread, text, mode: turnMode, interaction: turnInteraction, decide, onEvent: handle });
        printer.close();
        const code = exitCode(outcome);
        if (contextFailure) ctx.stderr.write(`${contextFailure.code}: ${contextFailure.message}\n`);
        if (unreachable(outcome.thread) && diag.state.last) {
          const detail = diag.state.last.status ? `HTTP ${diag.state.last.status}` : diag.state.last.error;
          ctx.stderr.write(`${ctx.t("model.missing")} (${detail}${diag.state.last.host ? ` · ${diag.state.last.host}` : ""}) ${connectionHint(diag.state.last, ctx.lang)}\n`);
        }
        if (json) ctx.stdout.write(`${JSON.stringify({ type: "result", status: outcome.cancelled ? "cancelled" : outcome.thread?.status || "unknown", exitCode: code, text: outcome.text })}\n`);
        return { ...outcome, code };
      } finally {
        lease = false;
        persistent?.release();
        activeTurn = false;
        moaListener = null;
      }
    },
  };
}
