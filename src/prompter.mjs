// Line input with a queue: a line typed while Koder is busy is kept for the
// next ordinary prompt, while approvals ask with { fresh: true } and only
// accept an answer typed after the question appeared.
export function createPrompter(rl, output) {
  const queue = [];
  const waiters = [];
  let closed = false;
  rl.on("line", (line) => {
    const waiter = waiters.shift();
    if (waiter) waiter(line);
    else queue.push(line);
  });
  rl.on("close", () => {
    closed = true;
    while (waiters.length) waiters.shift()(null);
  });
  return {
    rl,
    get closed() {
      return closed;
    },
    ask(prompt, { fresh = false } = {}) {
      if (fresh) queue.length = 0;
      if (queue.length) {
        const line = queue.shift();
        output.write(`${prompt}${line}\n`);
        return Promise.resolve(line);
      }
      if (closed) return Promise.resolve(null);
      rl.setPrompt(prompt);
      rl.prompt();
      return new Promise((resolve) => waiters.push(resolve));
    },
    close() {
      rl.close();
    },
  };
}

// For tests and scripted runs: answers come from a function of the prompt.
export function scriptedPrompter(answer) {
  const asked = [];
  return {
    asked,
    closed: false,
    async ask(prompt) {
      asked.push(prompt);
      const value = typeof answer === "function" ? answer(prompt, asked.length - 1) : answer.shift();
      return value === undefined ? null : value;
    },
    close() {},
  };
}
