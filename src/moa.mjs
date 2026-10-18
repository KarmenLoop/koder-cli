// Mixture of Agents, after Hermes Agent's agent/moa_loop.py (MIT, Nous Research):
// reference models advise without tools; the aggregator sees their advice as
// private context and keeps sole control of tool calls.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cliHome } from "./config.mjs";
import { KoderError } from "./errors.mjs";

export const FANOUTS = ["user_turn", "every_step"];
export const PRIVACY = ["", "display", "full"];

const REFERENCE_SYSTEM = {
  zh: [
    "你是 Mixture of Agents（MoA）流程里的参考顾问。你不是执行者，不能调用工具、运行命令、访问文件或网址，也不要尝试或为此道歉；另有一个汇总模型掌握这些能力并负责实际操作。",
    "绝对不要声称或暗示你执行过命令、下载过文件、打开过网址。只能根据对话上下文分析和建议。",
    "下面的对话是那个执行者正在处理的任务。请给出你最好的判断：理解目标，推理问题，建议下一步。指出最佳做法、具体步骤和工具使用策略、可能的坑和风险，以及执行者可能遗漏或弄错的地方。",
    "直接给建议，不要开场白，不要声明自己没有工具。用文字建议，不要输出工具调用或工具调用形式的 JSON。你的回答只交给汇总模型，不会直接给用户看。",
  ].join("\n\n"),
  en: [
    "You are a reference advisor in a Mixture of Agents (MoA) process. You are NOT the acting agent: you cannot call tools, run commands, or access files, repositories or URLs, and should not try or apologize. A separate aggregator model holds those capabilities and takes the actual actions.",
    "NEVER claim or imply that you executed a command, downloaded a file or opened a URL. Analyze and advise from the conversation only.",
    "The conversation below is the current state of a task handled by that acting agent. Give your most intelligent judgement: understand the goal, reason about the problem, and advise on what to do next, including the best approach, concrete steps and tool-use strategy, pitfalls and risks, and anything the agent may have missed.",
    "Advise directly with no preamble or disclaimers. Advise in prose and never emit a tool call or tool-call JSON. Your response is private guidance for the aggregator, not shown to the user.",
  ].join("\n\n"),
};

const ADVISORY_REQUEST = {
  zh: "[以上是任务的当前状态。请给出你的判断：发生了什么、下一步该做什么、有哪些风险或错误、执行者该怎么继续。]",
  en: "[The conversation above is the current state of the task. Give your judgement: what is going on, what should happen next, what risks or mistakes you see, and how the acting agent should proceed.]",
};

const TEXT = {
  zh: {
    header: "## Mixture of Agents 参考意见",
    use: "下面是参考模型的私有建议。你是汇总者和执行者：直接回答用户或按需调用工具。参考意见可能有错，以工具结果为准。",
    stale: "这些建议产生于本回合较早时，早于下面的工具结果。执行前先核对记录：它建议的步骤可能已经做过，重复已完成的工具调用不是下一步。",
    allFailed: "本回合所有参考模型都不可用，没有参考意见，请自行判断。",
    unavailable: "不可用的参考模型",
    reference: "参考",
    toolCall: "调用工具",
    toolResult: "工具结果",
  },
  en: {
    header: "## Mixture of Agents guidance",
    use: "The reference responses below are private context. You are the aggregator and acting model: answer the user directly or call tools as needed. References can be wrong; tool results win.",
    stale: "This guidance was produced earlier in this turn, before the tool results below it. Check the transcript before acting: a suggested step may already have run, and repeating a completed tool call is never the next step.",
    allFailed: "All reference models failed this turn; no guidance is available. Act on your own judgement.",
    unavailable: "Reference models unavailable",
    reference: "Reference",
    toolCall: "tool call",
    toolResult: "tool result",
  },
};

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(?:sk|pk|rk)-[A-Za-z0-9_-]{16,}\b/g,
  /\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}\b/g,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  /\b(?:postgres|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s:@]+:[^\s@]+@\S+/g,
];
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// Delimited formats only, so line numbers, dates, SHAs and IPs never match.
const PHONE = /(?<![\w.+-])(?:\+?\d{1,3}[ .-])?(?:\(\d{3}\)[ .-]?|\d{3}[.-])\d{3,4}[.-]\d{4}(?![\w-])/g;

export function redact(text) {
  let out = String(text || "");
  for (const re of SECRET_PATTERNS) out = out.replace(re, "[redacted secret]");
  return out.replace(EMAIL, "[redacted email]").replace(PHONE, "[redacted phone]");
}

export function moaFile(env = process.env) {
  return path.join(cliHome(env), "moa.json");
}

export function loadMoa(env = process.env) {
  try {
    const value = JSON.parse(fs.readFileSync(moaFile(env), "utf8"));
    if (value && typeof value === "object" && value.presets && typeof value.presets === "object") return { active: value.active || "default", presets: value.presets };
  } catch {}
  return { active: "default", presets: {} };
}

export function saveMoa(value, env = process.env) {
  const file = moaFile(env);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  return file;
}

export function normalizePreset(raw = {}) {
  const references = [...new Set((Array.isArray(raw.references) ? raw.references : String(raw.references || "").split(",")).map((item) => String(item).trim()).filter(Boolean))];
  if (!references.length) throw new KoderError("moa.noRefs");
  const fanout = FANOUTS.includes(raw.fanout) ? raw.fanout : "user_turn";
  const privacy = PRIVACY.includes(raw.privacy) ? raw.privacy : "";
  const timeoutMs = Number.isFinite(Number(raw.timeoutMs)) && Number(raw.timeoutMs) >= 1000 ? Number(raw.timeoutMs) : 120_000;
  const aggregator = raw.aggregator ? String(raw.aggregator) : "";
  return { references, fanout, privacy, timeoutMs, aggregator };
}

function flatten(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => (typeof part === "string" ? part : part?.text || "")).join("\n");
  return "";
}

function clip(text, limit = 4000) {
  const value = String(text || "");
  return value.length <= limit ? value : `${value.slice(0, limit)}…`;
}

// Text-only view for advisors: no system prompt, no tool roles, ends on a user turn.
export function referenceView(messages, lang = "zh") {
  const t = TEXT[lang] || TEXT.zh;
  const out = [];
  for (const message of messages) {
    const text = flatten(message.content).trim();
    if (message.role === "user") {
      if (text) out.push({ role: "user", content: text });
    } else if (message.role === "assistant") {
      const parts = text ? [text] : [];
      for (const call of message.toolCalls || []) parts.push(`[${t.toolCall}: ${call.name}(${clip(JSON.stringify(call.arguments || {}), 600)})]`);
      if (parts.length) out.push({ role: "assistant", content: parts.join("\n") });
    } else if (message.role === "tool") {
      const block = `[${t.toolResult}: ${clip(text)}]`;
      if (out.length && out.at(-1).role === "assistant") out.at(-1).content += `\n${block}`;
      else out.push({ role: "assistant", content: block });
    }
  }
  if (out.length && out.at(-1).role === "assistant") out.push({ role: "user", content: ADVISORY_REQUEST[lang] || ADVISORY_REQUEST.zh });
  return out;
}

function lastUserIndex(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) if (messages[i].role === "user") return i;
  return -1;
}

export function toolActivitySinceLastUser(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role === "user") return false;
    if (message.role === "tool" || (message.role === "assistant" && message.toolCalls?.length)) return true;
  }
  return false;
}

export function guidanceBlock({ outputs, failed, stale, lang = "zh" }) {
  const t = TEXT[lang] || TEXT.zh;
  const unavailable = failed.length ? `[${t.unavailable}: ${failed.join(", ")}]` : "";
  if (!outputs.length) return `${t.header}\n${t.allFailed}${unavailable ? `\n\n${unavailable}` : ""}`;
  const refs = outputs.map((item, index) => `${t.reference} ${index + 1} — ${item.label}:\n${item.text}`).join("\n\n");
  return [t.header, t.use, stale ? t.stale : "", refs, unavailable].filter(Boolean).join("\n\n");
}

function withGuidance(messages, block) {
  const copy = messages.map((message) => ({ ...message }));
  const system = copy.find((message) => message.role === "system");
  if (system) system.content = `${system.content || ""}\n\n${block}`;
  else copy.unshift({ role: "system", content: block });
  return copy;
}

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

async function timeout(run, ms, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort(Object.assign(new Error("aborted"), { name: "AbortError" }));
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) abort();
  const timer = setTimeout(() => controller.abort(Object.assign(new Error("reference timeout"), { code: "MOA_TIMEOUT" })), ms);
  let onAbort;
  try {
    if (controller.signal.aborted) throw controller.signal.reason;
    const cancelled = new Promise((_, reject) => {
      onAbort = () => reject(controller.signal.reason);
      controller.signal.addEventListener("abort", onAbort, { once: true });
    });
    return await Promise.race([Promise.resolve().then(() => {
      if (controller.signal.aborted) throw controller.signal.reason;
      return run(controller.signal);
    }), cancelled]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
    if (onAbort) controller.signal.removeEventListener("abort", onAbort);
  }
}

export function createMoaProvider({ aggregator, references, lang = "zh", fanout = "user_turn", privacy = "", timeoutMs = 120_000, onEvent = () => {} }) {
  let cache = null;
  return {
    id: "moa",
    name: `MoA(${references.map((ref) => ref.label).join("+")} → ${aggregator.name || aggregator.model || "aggregator"})`,
    model: aggregator.model,
    contextWindow: aggregator.contextWindow,
    async complete({ messages, tools, signal, onDelta, maxOutput }) {
      const view = referenceView(messages, lang);
      const anchor = lastUserIndex(messages);
      const key = fanout === "user_turn" ? hash(referenceView(messages.slice(0, anchor + 1), lang)) : hash(view);
      let stale = false;
      if (cache && cache.key === key) {
        stale = toolActivitySinceLastUser(messages);
      } else {
        onEvent({ type: "moa_start", references: references.map((ref) => ref.label) });
        const advisoryView = fanout === "user_turn" ? referenceView(messages.slice(0, anchor + 1), lang) : view;
        const started = Date.now();
        const settled = await Promise.allSettled(references.map((ref) => timeout((referenceSignal) => ref.provider.complete({
          messages: [{ role: "system", content: REFERENCE_SYSTEM[lang] || REFERENCE_SYSTEM.zh }, ...advisoryView],
          tools: [],
          signal: referenceSignal,
        }), timeoutMs, signal)));
        if (signal?.aborted) throw Object.assign(new Error("aborted"), { name: "AbortError" });
        const outputs = [];
        const failed = [];
        settled.forEach((result, index) => {
          const label = references[index].label;
          const text = result.status === "fulfilled" ? String(result.value?.text || "").trim() : "";
          if (text) outputs.push({ label, text: privacy === "full" ? redact(text) : text, usage: result.value?.usage || null });
          else failed.push(label);
        });
        cache = { key, outputs, failed };
        onEvent({
          type: "moa_done",
          ok: outputs.length,
          failed,
          ms: Date.now() - started,
          outputs: outputs.map((item) => ({ label: item.label, text: privacy ? redact(item.text) : item.text, usage: item.usage })),
        });
      }
      const block = guidanceBlock({ outputs: cache.outputs, failed: cache.failed, stale, lang });
      return aggregator.complete({ messages: withGuidance(messages, block), tools, signal, onDelta, maxOutput });
    },
  };
}
