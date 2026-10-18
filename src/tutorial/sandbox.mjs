import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const CART_BUG = "  return items.reduce((sum, item) => sum + item.price, 0);";
export const CART_FIX = "  return items.reduce((sum, item) => sum + item.price * item.qty, 0);";

const FILES = {
  "package.json": `${JSON.stringify({ name: "koder-practice", private: true, type: "module", scripts: { test: "node test.mjs" } }, null, 2)}\n`,
  "cart.mjs": `// 购物车总价，单位是分\nexport function total(items) {\n${CART_BUG}\n}\n`,
  "test.mjs": `import assert from "node:assert/strict";\nimport { total } from "./cart.mjs";\n\nassert.equal(total([{ price: 300, qty: 2 }, { price: 150, qty: 1 }]), 750);\nconsole.log("通过：总价 750 分");\n`,
  "AGENTS.md": "# 练习场规则\n\n金额一律用整数分，不要出现小数。\n",
  "README.md": "# Koder 练习场\n\n这是 koder learn 生成的一次性练习项目，随便改，坏了不心疼。\n",
};

function git(dir, ...args) {
  execFileSync("git", args, {
    cwd: dir,
    stdio: "ignore",
    env: { ...process.env, GIT_AUTHOR_NAME: "Koder 教练", GIT_AUTHOR_EMAIL: "coach@koder.invalid", GIT_COMMITTER_NAME: "Koder 教练", GIT_COMMITTER_EMAIL: "coach@koder.invalid" },
  });
}

export function createSandbox(base = os.tmpdir()) {
  const dir = fs.mkdtempSync(path.join(base, "koder-practice-"));
  for (const [name, body] of Object.entries(FILES)) fs.writeFileSync(path.join(dir, name), body);
  let hasGit = false;
  try {
    git(dir, "init", "-q", "-b", "main");
    git(dir, "add", "-A");
    git(dir, "commit", "-q", "-m", "练习场初始版本");
    hasGit = true;
  } catch {}
  return {
    dir,
    hasGit,
    read: (name) => fs.readFileSync(path.join(dir, name), "utf8"),
    write: (name, body) => fs.writeFileSync(path.join(dir, name), body),
    commit(message) {
      if (!hasGit) return;
      try {
        git(dir, "add", "-A");
        git(dir, "commit", "-q", "-m", message);
      } catch {}
    },
    remove: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

// A scripted stand-in for a model: each lesson queues its lines before a turn.
// It never touches the network; the tools it calls run for real in the sandbox.
export function createCoach() {
  const coach = {
    name: "koder-coach",
    model: "koder-coach",
    contextWindow: 32_000,
    script: [],
    async complete({ messages }) {
      const step = coach.script.shift();
      if (!step) return { text: "（教练的台词用完了。）", toolCalls: [] };
      return typeof step === "function" ? step({ messages, lastTool: lastTool(messages) }) : step;
    },
  };
  return coach;
}

export function lastTool(messages) {
  const tool = [...messages].reverse().find((message) => message.role === "tool");
  return String(tool?.content || "");
}

let counter = 0;
export function say(text) {
  return { text, toolCalls: [] };
}
export function call(name, args, text = "") {
  counter += 1;
  return { text, toolCalls: [{ id: `coach-${counter}`, name, arguments: args }] };
}
