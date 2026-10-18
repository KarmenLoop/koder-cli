import { describePause } from "./format.mjs";
import { normalizeDecision } from "./policy.mjs";

// The harness swallows model errors into a generic notice; this keeps the last
// HTTP status or network failure so the CLI can say what actually went wrong.
export function diagnosticFetch(base = globalThis.fetch) {
  const state = { last: null };
  const wrapped = async (url, init) => {
    try {
      const response = await base(url, init);
      state.last = response.ok ? null : { status: response.status, host: safeHost(url) };
      return response;
    } catch (error) {
      if (!init?.signal?.aborted) state.last = { error: error?.cause?.code || error?.code || error?.name || "NETWORK", host: safeHost(url) };
      throw error;
    }
  };
  return { fetch: wrapped, state };
}

function safeHost(url) {
  try {
    return new URL(String(url)).host;
  } catch {
    return "";
  }
}

const waiting = (status) => String(status || "").startsWith("waiting_");

export async function runPrompt({ harness, watch, thread, text, mode, interaction, decide, onEvent = () => {} }) {
  const events = [];
  const push = (event) => {
    events.push(event);
    onEvent(event);
  };
  let cursor = harness.store.getThread(thread.id)?.messages.length ?? thread.messages.length;
  let streamed = "";
  const take = (current) => {
    const messages = current?.messages || [];
    while (cursor < messages.length) {
      const message = messages[cursor];
      cursor += 1;
      if (message.role === "user") continue;
      const prefix = message.role === "assistant" && streamed && String(message.content || "").startsWith(streamed) ? streamed.length : 0;
      if (message.role === "assistant") streamed = "";
      push({ type: "message", message, streamed: prefix });
    }
  };
  const off = watch?.on(thread.id, (current) => {
    take(current);
    const draft = current.draft || "";
    if (draft.length > streamed.length && draft.startsWith(streamed)) {
      push({ type: "delta", text: draft.slice(streamed.length) });
      streamed = draft;
    }
  });

  try {
    const options = {};
    if (mode) options.mode = mode;
    if (interaction) options.interaction = interaction;
    let current = await harness.submit(thread.id, text, options);
    take(current);
    let cancelled = false;
    let reason = "";

    for (let guard = 0; guard < 64 && waiting(current?.status); guard += 1) {
      const pause = describePause(current);
      if (!pause) break;
      push({ type: "pause", pause });
      const decision = normalizeDecision(pause, await decide(pause, current));
      push({ type: "decision", pause, decision });
      if (decision.cancel || pause.kind === "secret") {
        current = await harness.cancel(current.id);
        take(current);
        cancelled = true;
        reason = pause.kind === "secret" ? "turn.secretCancelled" : "turn.cancelled";
        push({ type: "cancelled", reason });
        break;
      }
      if (pause.kind === "change") current = await harness.decideChange(current.id, pause.id, decision.accept);
      else if (pause.kind === "approval") current = await harness.decideApproval(current.id, pause.id, decision.accept);
      else current = await harness.decideChoice(current.id, pause.id, decision.index);
      take(current);
    }

    if (waiting(current?.status)) {
      current = await harness.cancel(current.id);
      take(current);
      cancelled = true;
      reason = "turn.tooMany";
      push({ type: "cancelled", reason });
    }
    return { thread: current, events, cancelled, reason, text: lastAssistant(current) };
  } finally {
    off?.();
  }
}

export function lastAssistant(thread) {
  const messages = thread?.messages || [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role === "user") break;
    if (message.role === "assistant" && String(message.content || "").trim()) return message.content;
  }
  return "";
}

export function unreachable(thread) {
  const messages = thread?.messages || [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") return false;
    if (messages[i].code === "API_UNREACHABLE") return true;
  }
  return false;
}

export function exitCode(outcome) {
  if (!outcome?.thread) return 2;
  if (unreachable(outcome.thread)) return 2;
  if (outcome.cancelled) return 1;
  if (outcome.thread.status === "error") return 1;
  return 0;
}
