import { importKernel, openAgent, openThread, watcher } from "./agent.mjs";
import { lineDecider } from "./ask.mjs";
import { KoderError } from "./errors.mjs";
import { createPrinter, jsonEvent } from "./format.mjs";
import { createMoaProvider, loadMoa, normalizePreset } from "./moa.mjs";
import { loadModel } from "./models.mjs";
import { closedDecision, yesDecision } from "./policy.mjs";
import { diagnosticFetch, exitCode, runPrompt, unreachable } from "./turn.mjs";

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
  const make = (record) => {
    const provider = createProvider({ provider: { ...record, id: record.id || "cli" }, fetchImpl, secrets: [record.apiKey].filter(Boolean) });
    return { ...provider, contextWindow: record.contextWindow };
  };
  const aggregatorRecord = preset.aggregator ? loadModel(preset.aggregator, ctx.env).record : ctx.requireProvider().record;
  const references = preset.references.map((ref) => ({ label: ref, provider: make(loadModel(ref, ctx.env).record) }));
  const provider = createMoaProvider({ aggregator: make(aggregatorRecord), references, lang: ctx.lang, fanout: preset.fanout, privacy: preset.privacy, timeoutMs: preset.timeoutMs, onEvent });
  return { provider, record: aggregatorRecord, name };
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
export async function createSession(ctx, { workspace = ctx.workspace(), mode, interaction = "agent", quiet = false, out = ctx.stdout, moa } = {}) {
  const chosen = mode || ctx.opts.mode || "standard";
  if (!MODES.includes(chosen)) throw new KoderError("err.badMode", { mode: chosen, modes: MODES.join(", ") });
  const engine = engineFor(ctx);
  if (engine) return createEngineSession(ctx, engine, { workspace, mode: chosen, quiet, out });
  const diag = diagnosticFetch(ctx.io.fetchImpl || globalThis.fetch);
  let providerOverride = ctx.io.providerOverride || null;
  let record = providerOverride ? null : ctx.requireProvider().record;
  let moaListener = null;
  const wantMoa = moaRequested(ctx, moa);
  let moaName = "";
  if (wantMoa) {
    const built = await buildMoa(ctx, { preset: wantMoa, fetchImpl: diag.fetch, onEvent: (event) => moaListener?.(event) });
    if (!ctx.io.providerOverride) {
      providerOverride = built.provider;
      record = built.record;
    }
    moaName = built.name;
  }
  const harness = await openAgent({ workspace, record, providerOverride, fetchImpl: diag.fetch, env: ctx.env });
  const { unifiedDiff } = await importKernel("harness/diff.mjs", ctx.env);
  const watch = watcher(harness);
  let thread = await openThread(harness, { mode: chosen, interaction });
  const printer = createPrinter({ out, t: (key, vars) => ctx.t(key, vars), depth: out === ctx.stdout ? ctx.depth : ctx.errDepth, diff: unifiedDiff });

  return {
    harness,
    workspace,
    moa: moaName,
    get thread() {
      return thread;
    },
    async reset() {
      thread = await openThread(harness, { mode: chosen, interaction });
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
      moaListener = handle;
      try {
        const outcome = await runPrompt({ harness, watch, thread, text, mode: turnMode, interaction: turnInteraction, decide, onEvent: handle });
        printer.close();
        const code = exitCode(outcome);
        if (unreachable(outcome.thread) && diag.state.last) {
          const detail = diag.state.last.status ? `HTTP ${diag.state.last.status}` : diag.state.last.error;
          ctx.stderr.write(`${ctx.t("model.missing")} (${detail}${diag.state.last.host ? ` · ${diag.state.last.host}` : ""})\n`);
        }
        if (json) ctx.stdout.write(`${JSON.stringify({ type: "result", status: outcome.cancelled ? "cancelled" : outcome.thread?.status || "unknown", exitCode: code, text: outcome.text })}\n`);
        return { ...outcome, code };
      } finally {
        moaListener = null;
      }
    },
  };
}
