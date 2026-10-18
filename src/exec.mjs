import { execFile, spawn } from "node:child_process";

const OUTPUT_LIMIT = 400_000;

// Runs a user-supplied check command. The user typed it, so no extra approval.
export function runCheck(command, { cwd, env = process.env, timeoutMs = 600_000, onOutput } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(command, { cwd, env, shell: true, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let timedOut = false;
    const take = (chunk) => {
      const text = chunk.toString();
      onOutput?.(text);
      if (output.length < OUTPUT_LIMIT) output += text;
    };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (process.platform !== "win32") process.kill(-child.pid, "SIGKILL");
        else execFile("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true }, () => {});
      } catch {}
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: 127, output: `${output}${error.message}\n`, timedOut, ms: Date.now() - started });
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code: code ?? (signal ? 128 : 1), output, timedOut, ms: Date.now() - started });
    });
  });
}

export function tail(text, limit = 12_000) {
  const value = String(text || "");
  return value.length <= limit ? value : `…\n${value.slice(-limit)}`;
}

export function git(args, cwd, { maxBuffer = 32 * 1024 * 1024 } = {}) {
  return new Promise((resolve) => {
    execFile("git", args, { cwd, maxBuffer, env: { ...process.env, GIT_PAGER: "cat", LC_ALL: "C" } }, (error, stdout, stderr) => {
      resolve({ code: error ? (typeof error.code === "number" ? error.code : 1) : 0, stdout: String(stdout), stderr: String(stderr) });
    });
  });
}
