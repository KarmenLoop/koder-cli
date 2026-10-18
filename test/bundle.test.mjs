import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { BIN, cli, mockModel, scripted, textStep, tmp, toolStep } from "./helpers.mjs";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "bundle-kernel.mjs");

test("bundled kernel runs a full turn without the koder-desktop tree", async () => {
  const out = path.join(tmp(), "kernel");
  execFileSync(process.execPath, [script, "--out", out], { stdio: "pipe" });
  const manifest = JSON.parse(fs.readFileSync(path.join(out, "MANIFEST.json"), "utf8"));
  assert.ok(manifest.files.some((file) => file.path === "harness/create.mjs"));
  assert.ok(manifest.files.some((file) => file.path === "fusion/hermes/koder-work/plugin.yaml"));
  for (const file of manifest.files) {
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(out, file.path))).digest("hex"), file.sha256);
  }
  const shipped = manifest.files.map((file) => file.path);
  for (const name of ["fusion/desktop.mjs", "fusion/k131419.mjs", "fusion/k131419-v1.mjs", "fusion/private-lease.mjs"]) assert.ok(!shipped.includes(name), `${name} must not ship`);
  assert.deepEqual(manifest.files.filter((file) => file.stub).map((file) => file.path).sort(), ["fusion/data-lock.mjs", "fusion/private-store.mjs", "fusion/vault.mjs"]);
  for (const name of ["fusion/data-lock.mjs", "fusion/private-store.mjs", "fusion/vault.mjs"]) {
    const body = fs.readFileSync(path.join(out, name), "utf8");
    assert.match(body, /Koder CLI 不包含桌面端的数据加密模块/);
    assert.doesNotMatch(body, /import |createCipheriv|pbkdf2|scrypt|randomBytes/, `${name} is a stub, not the real code`);
  }
  const kernelLicense = fs.readFileSync(path.join(out, "LICENSE"), "utf8");
  assert.match(kernelLicense, /保留所有权利/);
  assert.match(kernelLicense, /不适用 Koder CLI 的\s*MIT 许可证/);
  assert.match(kernelLicense, /All rights reserved/);
  const root = path.dirname(script).replace(/scripts$/, "");
  assert.match(fs.readFileSync(path.join(root, "LICENSE"), "utf8"), /MIT License/);
  assert.match(fs.readFileSync(path.join(root, "LICENSE"), "utf8"), /Copyright \(c\) 2026 KARMEN \/ Koder/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).license, "MIT");
  const notices = fs.readFileSync(path.join(root, "THIRD_PARTY_NOTICES.md"), "utf8");
  assert.doesNotMatch(notices, /distributed here under GPL|keeps that option open/);
  assert.match(notices, /proprietary/);
  const dir = tmp();
  const result = await cli(["run", "写文件", "--yes", "-w", dir], { provider: scripted([toolStep("write_file", { path: "k.txt", content: "bundled" }), textStep("ok")]), env: { KODER_DESKTOP_ROOT: out } });
  assert.equal(result.code, 0, result.err);
  assert.equal(fs.readFileSync(path.join(dir, "k.txt"), "utf8"), "bundled");
});

test("light commands start fast; a task reaches the model quickly", async () => {
  const home = tmp();
  const started = process.hrtime.bigint();
  execFileSync(process.execPath, [BIN, "version"], { env: { PATH: process.env.PATH, KODER_CLI_HOME: home }, stdio: "pipe" });
  const versionMs = Number(process.hrtime.bigint() - started) / 1e6;
  assert.ok(versionMs < 250, `version took ${versionMs} ms`);

  let arrived = 0;
  const server = await mockModel([() => {
    arrived ||= Number(process.hrtime.bigint() - spawnedAt) / 1e6;
    return textStep("好");
  }]);
  fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ model: "m", baseUrl: server.url, auth: "none" }));
  const spawnedAt = process.hrtime.bigint();
  const child = spawn(process.execPath, [BIN, "ask", "你好", "-w", tmp()], { env: { PATH: process.env.PATH, KODER_CLI_HOME: home, NO_COLOR: "1" }, stdio: "ignore" });
  await new Promise((resolve) => child.on("close", resolve));
  await server.close();
  assert.equal(child.exitCode, 0);
  assert.ok(arrived > 0 && arrived < 1000, `first model request after ${arrived} ms`);
});
