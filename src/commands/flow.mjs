import fs from "node:fs";
import path from "node:path";
import { KoderError } from "../errors.mjs";
import { runCheck, tail } from "../exec.mjs";
import { closedDecision, yesDecision } from "../policy.mjs";
import { createSession, pickDecider } from "../session.mjs";
import { fixLoop, gate, generateTests, reviewChanges } from "../workflows.mjs";
import { formatMarkdown } from "./review.mjs";

export const flags = {
  force: { type: "bool" },
  approve: { type: "string" },
};

const TYPES = new Set(["shell", "run", "ask", "review", "fix", "test"]);
const PARALLEL_SAFE = new Set(["shell", "ask", "review"]);

export const SAMPLE = {
  name: "pr-gate",
  approve: "ask",
  steps: [
    { id: "review", type: "review", failOn: "high", continueOnError: true },
    { id: "unit", type: "shell", run: "npm test", continueOnError: true },
    { id: "repair", type: "fix", check: "npm test", attempts: 2, when: "unit.failed" },
    {
      parallel: [
        { id: "risk", type: "ask", prompt: "根据审查结果 {{review.output}}，用三行列出这次合并的主要风险。" },
        { id: "lint", type: "shell", run: "npm run lint --if-present", continueOnError: true },
      ],
    },
    { id: "notes", type: "ask", prompt: "根据 {{risk.output}} 写一段给评审人的说明。", when: "always" },
  ],
};

function flatten(steps) {
  return steps.flatMap((step) => (Array.isArray(step.parallel) ? step.parallel : [step]));
}

export function validateFlow(flow) {
  if (!flow || typeof flow !== "object" || !Array.isArray(flow.steps) || !flow.steps.length) throw new KoderError("flow.bad", { message: "steps" });
  const ids = new Set();
  for (const step of flow.steps) {
    if (Array.isArray(step.parallel)) {
      for (const inner of step.parallel) {
        if (!PARALLEL_SAFE.has(inner.type)) throw new KoderError("flow.bad", { message: `parallel: ${inner.id || "?"} (${inner.type}) — only shell, ask, review` });
      }
    }
  }
  for (const step of flatten(flow.steps)) {
    if (!step.id || typeof step.id !== "string") throw new KoderError("flow.bad", { message: "id" });
    if (ids.has(step.id)) throw new KoderError("flow.bad", { message: `duplicate id ${step.id}` });
    ids.add(step.id);
    if (!TYPES.has(step.type)) throw new KoderError("flow.bad", { message: `${step.id}.type` });
    if (step.type === "shell" && !step.run) throw new KoderError("flow.bad", { message: `${step.id}.run` });
    if ((step.type === "run" || step.type === "ask") && !step.prompt) throw new KoderError("flow.bad", { message: `${step.id}.prompt` });
  }
  if (flow.approve && !["ask", "auto", "never"].includes(flow.approve)) throw new KoderError("flow.bad", { message: "approve" });
  return flow;
}

export function render(template, results) {
  return String(template || "").replace(/\{\{\s*([\w-]+)\.(output|status|code)\s*\}\}/g, (_, id, field) => {
    const result = results.get(id);
    if (!result) return "";
    return field === "output" ? tail(result.output, 8000) : String(result[field]);
  });
}

// when: "always", "success" (default), "failure", "<id>.failed", "<id>.passed".
export function shouldRun(when, results) {
  const all = [...results.values()];
  if (!when || when === "success") return all.every((item) => item.status !== "failed" || item.continueOnError);
  if (when === "always") return true;
  if (when === "failure") return all.some((item) => item.status === "failed");
  const match = /^([\w-]+)\.(failed|passed)$/.exec(when);
  if (!match) return false;
  const result = results.get(match[1]);
  if (!result || result.status === "skipped") return false;
  return match[2] === "failed" ? result.status === "failed" : result.status === "passed";
}

async function runStep(ctx, step, results, { workspace, decide, log }) {
  const silentLog = () => {};
  if (step.type === "shell") {
    const res = await runCheck(render(step.run, results), { cwd: workspace, env: ctx.env, timeoutMs: (step.timeout ?? 600) * 1000 });
    return { ok: res.code === 0, code: res.code, output: res.output };
  }
  if (step.type === "run" || step.type === "ask") {
    const session = await createSession(ctx, { workspace, mode: step.mode, interaction: step.type === "ask" ? "ask" : "agent", quiet: step.type === "ask" });
    const outcome = await session.turn(render(step.prompt, results), { decide, silent: step.type === "ask" });
    return { ok: outcome.code === 0, code: outcome.code, output: outcome.text };
  }
  if (step.type === "review") {
    const result = await reviewChanges(ctx, { workspace, base: step.base, staged: step.staged, files: step.files, focus: render(step.focus, results), onProgress: silentLog });
    if (result.empty) return { ok: true, code: 0, output: ctx.t("err.noDiff") };
    const failed = result.code !== 0 || gate(result.findings, step.failOn);
    return { ok: !failed, code: failed ? 1 : 0, output: formatMarkdown(result, { lang: ctx.lang, t: ctx.t }), findings: result.findings };
  }
  if (step.type === "fix") {
    const result = await fixLoop(ctx, { workspace, description: render(step.prompt, results), check: step.check, attempts: step.attempts ?? 2, decide, log });
    return { ok: result.ok, code: result.code, output: result.result?.output || "" };
  }
  const result = await generateTests(ctx, { workspace, files: step.files || [], base: step.base, check: step.check, attempts: step.attempts ?? 2, decide, log });
  return { ok: result.ok, code: result.code, output: (result.files || []).join("\n") };
}

export async function runFlow(ctx, flow, { workspace = ctx.workspace(), approve, log = (line) => ctx.stdout.write(`${line}\n`) } = {}) {
  validateFlow(flow);
  const policy = approve || flow.approve || "ask";
  const decide = policy === "auto" ? yesDecision : policy === "never" ? closedDecision : pickDecider(ctx);
  const results = new Map();
  const steps = flatten(flow.steps);
  log(ctx.t("flow.start", { name: flow.name || "flow", count: steps.length }));
  let index = 0;
  const execute = async (step, ready = shouldRun(step.when || "success", results)) => {
    index += 1;
    const when = step.when || "success";
    if (!ready) {
      results.set(step.id, { status: "skipped", code: 0, output: "", continueOnError: true });
      log(ctx.t("flow.skip", { id: step.id, when }));
      return;
    }
    log(ctx.t("flow.step", { index, count: steps.length, id: step.id }));
    let outcome;
    try {
      outcome = await runStep(ctx, step, results, { workspace, decide, log });
    } catch (error) {
      outcome = { ok: false, code: error?.exitCode ?? 1, output: error instanceof KoderError ? ctx.t(error.key, error.vars) : String(error?.message || error) };
    }
    results.set(step.id, { status: outcome.ok ? "passed" : "failed", code: outcome.code, output: outcome.output || "", continueOnError: Boolean(step.continueOnError) });
    log(ctx.t(outcome.ok ? "flow.ok" : "flow.fail", { id: step.id }));
  };
  for (const step of flow.steps) {
    if (Array.isArray(step.parallel)) {
      // Parallel siblings decide against the results from before the group starts.
      const snapshot = new Map(results);
      await Promise.all(step.parallel.map((inner) => execute(inner, shouldRun(inner.when || "success", snapshot))));
    } else {
      await execute(step);
    }
  }
  const all = [...results.values()];
  const ok = all.filter((item) => item.status === "passed").length;
  const failed = all.filter((item) => item.status === "failed");
  const skip = all.filter((item) => item.status === "skipped").length;
  log(ctx.t("flow.done", { ok, fail: failed.length, skip }));
  return { results, code: failed.some((item) => !item.continueOnError) ? 1 : 0 };
}

function flowDir(workspace) {
  return path.join(workspace, ".koder", "flows");
}

export async function run(ctx) {
  const [action = "list", target] = ctx.positionals;
  const workspace = ctx.workspace();
  if (action === "init") {
    const name = (target || "pr-gate").replace(/[^\w-]/g, "-");
    const file = path.join(flowDir(workspace), `${name}.json`);
    if (fs.existsSync(file) && !ctx.opts.force) throw new KoderError("flow.exists", { file }, 1);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const sample = { ...SAMPLE, name };
    if (ctx.lang === "en") {
      sample.steps = JSON.parse(JSON.stringify(SAMPLE.steps).replace("根据审查结果 {{review.output}}，用三行列出这次合并的主要风险。", "Based on {{review.output}}, list the main merge risks in three lines.").replace("根据 {{risk.output}} 写一段给评审人的说明。", "Using {{risk.output}}, write a short note for reviewers."));
    }
    fs.writeFileSync(file, `${JSON.stringify(sample, null, 2)}\n`);
    ctx.stdout.write(`${ctx.t("flow.created", { file })}\n`);
    return 0;
  }
  if (action === "list") {
    const dir = flowDir(workspace);
    const names = fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith(".json")) : [];
    if (!names.length) {
      ctx.stdout.write(`${ctx.t("flow.empty")}\n`);
      return 0;
    }
    ctx.stdout.write(`${ctx.t("flow.list")}\n${names.map((name) => `  ${path.join(".koder", "flows", name)}`).join("\n")}\n`);
    return 0;
  }
  if (action === "run") {
    if (!target) throw new KoderError("flow.bad", { message: "file" });
    const candidates = [path.resolve(ctx.cwd, target), path.join(flowDir(workspace), target), path.join(flowDir(workspace), `${target}.json`)];
    const file = candidates.find((item) => fs.existsSync(item));
    if (!file) throw new KoderError("flow.bad", { message: target });
    let flow;
    try {
      flow = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      throw new KoderError("flow.bad", { message: error.message });
    }
    if (ctx.opts.approve && !["ask", "auto", "never"].includes(ctx.opts.approve)) throw new KoderError("err.flagValue", { flag: "--approve" });
    const approve = ctx.opts.yes ? "auto" : ctx.opts.approve;
    return (await runFlow(ctx, flow, { workspace, approve })).code;
  }
  throw new KoderError("err.unknownCommand", { name: `flow ${action}` });
}
