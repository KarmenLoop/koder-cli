// Wall time from process spawn to exit, measured from the outside.
import { spawnSync } from "node:child_process";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const bin = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "bin", "koder.mjs");
const home = fs.mkdtempSync(path.join(os.tmpdir(), "koder-bench-"));
const env = { ...process.env, KODER_CLI_HOME: home, NO_COLOR: "1", KODER_NO_ANIM: "1", COLUMNS: "100" };
const runs = Number(process.env.RUNS || 15);

function measure(label, args) {
  spawnSync(process.execPath, [bin, ...args], { env, stdio: "ignore" });
  const times = [];
  for (let i = 0; i < runs; i += 1) {
    const started = process.hrtime.bigint();
    const result = spawnSync(process.execPath, [bin, ...args], { env, stdio: "ignore" });
    times.push(Number(process.hrtime.bigint() - started) / 1e6);
    if (result.status !== 0) throw new Error(`${label} exited ${result.status}`);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  console.log(`${label.padEnd(26)} median ${median.toFixed(1)} ms   min ${times[0].toFixed(1)}   max ${times.at(-1).toFixed(1)}   (${runs} runs)`);
  return median;
}

const baseline = (() => {
  const times = [];
  for (let i = 0; i < runs; i += 1) {
    const started = process.hrtime.bigint();
    spawnSync(process.execPath, ["-e", "0"], { stdio: "ignore" });
    times.push(Number(process.hrtime.bigint() - started) / 1e6);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
})();
console.log(`${"node -e 0 (baseline)".padEnd(26)} median ${baseline.toFixed(1)} ms`);
const results = {
  version: measure("koder version", ["version"]),
  help: measure("koder help", ["help"]),
  banner: measure("koder banner --no-anim", ["banner", "--no-anim"]),
  editor: measure("koder editor zed", ["editor", "zed"]),
};
fs.rmSync(home, { recursive: true, force: true });
const worst = Math.max(...Object.values(results));
console.log(worst < 70 ? `PASS: every command above finished under 70 ms (worst median ${worst.toFixed(1)} ms)` : `FAIL: worst median ${worst.toFixed(1)} ms is not under 70 ms`);
process.exitCode = worst < 70 ? 0 : 1;
