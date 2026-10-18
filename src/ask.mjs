import fs from "node:fs";
import readline from "node:readline";
import tty from "node:tty";
import { createPrompter } from "./prompter.mjs";

export function answerFromLine(pause, line) {
  const text = String(line ?? "").trim();
  if (pause?.kind === "choice") {
    if (!text) return { cancel: true };
    return { index: Number(text) - 1 };
  }
  if (pause?.kind === "secret") return { cancel: true };
  const lowered = text.toLowerCase();
  return { accept: lowered === "y" || lowered === "yes" || text === "是" };
}

// When stdin carries piped data, questions still go to the user's terminal.
export function openTerminal(stdin = process.stdin, stdout = process.stdout) {
  if (stdin.isTTY) return { input: stdin, output: stdout, close() {} };
  try {
    const fd = fs.openSync("/dev/tty", "r+");
    const input = new tty.ReadStream(fd);
    const output = new tty.WriteStream(fd);
    return { input, output, close: () => { input.destroy(); output.destroy(); } };
  } catch {
    return null;
  }
}

// For callers holding a readline/promises interface: closing counts as no answer,
// because a closed interface leaves rl.question pending forever.
export function askLine(rl, prompt) {
  return new Promise((resolve) => {
    const onClose = () => resolve(null);
    rl.once("close", onClose);
    rl.question(prompt).then((answer) => {
      rl.off("close", onClose);
      resolve(answer);
    }, () => resolve(null));
  });
}

export function terminalPrompter(input, output) {
  return createPrompter(readline.createInterface({ input, output, terminal: Boolean(input.isTTY), historySize: 300 }), output);
}

export function decisionHint(t, pause) {
  return pause.kind === "choice" ? t("turn.askChoice") : pause.kind === "approval" ? t("turn.askCommand") : t("turn.askChange");
}

export function lineDecider({ t, prompter = null }) {
  return async (pause) => {
    const hint = decisionHint(t, pause);
    if (prompter) {
      const answer = await prompter.ask(hint, { fresh: true });
      return answer == null ? { cancel: true } : answerFromLine(pause, answer);
    }
    const term = openTerminal();
    if (!term) return { accept: false };
    const local = terminalPrompter(term.input, term.output);
    try {
      const answer = await local.ask(hint, { fresh: true });
      return answer == null ? { cancel: true } : answerFromLine(pause, answer);
    } finally {
      local.close();
      term.close();
    }
  };
}
