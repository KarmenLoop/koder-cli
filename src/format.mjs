import { RESET, fg } from "./color.mjs";
import { theme } from "./theme.mjs";

export function describePause(thread) {
  const pause = thread?.pause;
  if (!pause) return null;
  if (pause.kind === "change") {
    const change = thread.changes.find((item) => item.id === pause.changeId);
    if (!change) return null;
    return { kind: "change", id: change.id, toolCallId: change.toolCallId, path: change.path, before: change.before ?? "", after: change.after ?? "" };
  }
  if (pause.kind === "approval") {
    const approval = thread.approvals.find((item) => item.id === pause.approvalId);
    if (!approval) return null;
    return { kind: "approval", id: approval.id, toolCallId: approval.toolCallId, command: approval.command };
  }
  if (pause.kind === "choice") {
    const choice = thread.choices.find((item) => item.id === pause.choiceId);
    if (!choice) return null;
    return { kind: "choice", id: choice.id, toolCallId: choice.toolCallId, question: choice.question, options: [...choice.options] };
  }
  if (pause.kind === "secret") {
    const prompt = thread.prompts.find((item) => item.id === pause.secretId);
    return { kind: "secret", id: prompt?.id || "", service: prompt?.service || "", reason: prompt?.reason || "" };
  }
  return null;
}

function firstLine(text, limit = 140) {
  const lines = String(text || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const line = lines.find((item) => /[\p{L}\p{N}]/u.test(item)) || lines[0] || "";
  return line.length > limit ? `${line.slice(0, limit)}…` : line;
}

export function createPrinter({ out, t, depth = "none", diff = null }) {
  const { add: ADD, del: DEL, text3: DIM, accent: ACCENT, warn: WARN } = theme();
  const color = (text, rgb, bold = false) => (depth === "none" || !rgb ? text : `${fg(rgb, depth, bold)}${text}${RESET}`);
  let open = false;
  const close = () => {
    if (open) out.write("\n");
    open = false;
  };
  const line = (text = "") => {
    close();
    out.write(`${text}\n`);
  };

  function renderDiff(pause) {
    const rows = diff ? diff(pause.before, pause.after) : [];
    for (const row of rows) {
      if (pause.before === "" && row.type === "del" && row.text === "") continue;
      if (row.type === "add") line(color(`+ ${row.text}`, ADD));
      else if (row.type === "del") line(color(`- ${row.text}`, DEL));
      else if (row.type === "note") line(color(`  ${row.text}`, DIM));
      else line(`  ${row.text}`);
    }
  }

  return {
    color,
    line,
    close,
    event(event) {
      if (event.type === "delta") {
        out.write(event.text);
        open = !event.text.endsWith("\n");
        return;
      }
      if (event.type === "message") {
        const message = event.message;
        if (message.role === "assistant") {
          const rest = String(message.content || "").slice(event.streamed || 0);
          if (rest.trim()) {
            out.write(rest);
            open = !rest.endsWith("\n");
          }
          close();
          const names = (message.toolCalls || []).map((call) => call.name).filter(Boolean);
          if (names.length) line(color(`→ ${t("turn.calls", { names: names.join(", ") })}`, ACCENT));
        } else if (message.role === "tool") {
          line(color(`  ↳ ${t("turn.tool", { name: message.name || "" })}: ${firstLine(message.content)}`, DIM));
        } else if (message.role === "notice") {
          line(color(message.code === "API_UNREACHABLE" ? t("model.missing") : firstLine(message.content), WARN));
        }
        return;
      }
      if (event.type === "pause") {
        const pause = event.pause;
        if (pause.kind === "change") {
          line(color(t("turn.change", { path: pause.path }), WARN, true));
          renderDiff(pause);
        } else if (pause.kind === "approval") {
          line(color(t("turn.command"), WARN, true));
          line(color(`  $ ${pause.command}`, ACCENT));
        } else if (pause.kind === "choice") {
          line(color(t("turn.choice", { question: pause.question }), WARN, true));
          pause.options.forEach((option, index) => line(`  ${index + 1}. ${option}`));
        } else if (pause.kind === "secret") {
          line(color(t("turn.secret", { service: pause.service }), WARN));
        }
        return;
      }
      if (event.type === "decision") {
        const { pause, decision } = event;
        if (decision.cancel) return;
        if (pause.kind === "change") line(color(decision.accept ? t("turn.accepted", { path: pause.path }) : t("turn.rejected", { path: pause.path }), decision.accept ? ADD : DEL));
        else if (pause.kind === "approval") line(color(decision.accept ? t("turn.allowed") : t("turn.denied"), decision.accept ? ADD : DEL));
        else if (pause.kind === "choice") line(color(t("turn.picked", { option: pause.options[decision.index] || "" }), ACCENT));
        return;
      }
      if (event.type === "moa_start") line(color(t("moa.asking", { count: event.references.length, names: event.references.join(", ") }), ACCENT));
      if (event.type === "moa_done") {
        const seconds = (event.ms / 1000).toFixed(1);
        line(color(t("moa.answered", { ok: event.ok, total: event.ok + event.failed.length, seconds }) + (event.failed.length ? ` · ${t("moa.failed", { names: event.failed.join(", ") })}` : ""), event.ok ? ACCENT : WARN));
      }
      if (event.type === "cancelled") line(color(t(event.reason), WARN));
    },
  };
}

// --json: one JSON object per line, stable field names for scripts.
export function jsonEvent(event) {
  if (event.type === "delta") return { type: "delta", text: event.text };
  if (event.type === "message") {
    const m = event.message;
    if (m.role === "assistant") return { type: "assistant", text: m.content || "", toolCalls: (m.toolCalls || []).map((c) => ({ id: c.id, name: c.name, arguments: c.arguments })) };
    if (m.role === "tool") return { type: "tool_result", name: m.name || "", toolCallId: m.toolCallId || "", text: m.content || "" };
    if (m.role === "notice") return { type: "notice", code: m.code || "", text: m.content || "" };
    return null;
  }
  if (event.type === "pause") {
    const { kind, id, path, command, question, options, service } = event.pause;
    return { type: "pause", kind, id, path, command, question, options, service };
  }
  if (event.type === "decision") return { type: "decision", kind: event.pause.kind, id: event.pause.id, ...event.decision };
  if (event.type === "cancelled") return { type: "cancelled", reason: event.reason };
  if (event.type === "moa_start") return { type: "moa", phase: "start", references: event.references };
  if (event.type === "moa_done") return { type: "moa", phase: "done", ok: event.ok, failed: event.failed, ms: event.ms, outputs: event.outputs };
  return null;
}
