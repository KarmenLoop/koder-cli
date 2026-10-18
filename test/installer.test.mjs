import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { mockModel, textStep, tmp } from "./helpers.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeDir = path.dirname(process.execPath);
const OS = { darwin: "darwin", linux: "linux" }[process.platform];
const ARCH = { x64: "x64", arm64: "arm64" }[process.arch];

async function serve(rootDir) {
  const server = http.createServer((req, res) => {
    const file = path.join(rootDir, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(rootDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200).end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

let built;
function pack() {
  if (built) return built;
  const site = tmp("koder-site-");
  const dist = path.join(site, "install");
  execFileSync(process.execPath, [path.join(root, "scripts", "pack.mjs"), "--out", dist], { stdio: "pipe" });
  built = { site, dist, manifest: JSON.parse(fs.readFileSync(path.join(dist, "koder-cli-latest.json"), "utf8")) };
  return built;
}

// Async on purpose: the files are served by this same process.
function run(command, args, env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { env });
    // koder ask reads piped stdin until EOF; an open pipe would wait forever.
    child.stdin.end();
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

function install(base, home, extra = [], env = {}) {
  return run("bash", [path.join(pack().dist, "koder-cli.sh"), "--no-onboard", "--no-modify-path", ...extra], { HOME: home, PATH: `${nodeDir}:/usr/bin:/bin:/usr/sbin:/sbin`, LANG: "zh_CN.UTF-8", KODER_INSTALL_BASE: base, ...env });
}

test("pack builds a tarball whose manifest checksum matches, with the kernel bundled", () => {
  const { dist, manifest } = pack();
  const tarball = path.join(dist, manifest.file);
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex"), manifest.sha256);
  const listing = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" });
  for (const entry of ["koder-cli/bin/koder.mjs", "koder-cli/src/gateway/platforms/feishu.mjs", "koder-cli/kernel/harness/create.mjs", "koder-cli/kernel/fusion/catalog-models.json", "koder-cli/LICENSE"]) {
    assert.ok(listing.includes(entry), entry);
  }
  assert.ok(!listing.includes("koder-cli/test/"));
  assert.equal(manifest.version, "0.3.1");
});

test("one-line install with an existing Node: launcher works, bundled kernel runs a real turn, uninstall cleans up", async () => {
  const { site } = pack();
  const server = await serve(site);
  const model = await mockModel([textStep("安装版回复")]);
  try {
    const home = tmp("koder-install-home-");
    const result = await install(`${server.url}/install`, home);
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.match(result.stdout, /Koder CLI 0\.3\.1 安装完成/);
    const launcher = path.join(home, ".local", "bin", "koder");
    assert.match(fs.readFileSync(launcher, "utf8"), new RegExp(process.execPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const koder = (...args) => run(launcher, args, { HOME: home, PATH: "/usr/bin:/bin", NO_COLOR: "1" });
    const versionOut = (await koder("version")).stdout;
    assert.match(versionOut, /^koder 0\.3\.1\n/);
    assert.match(versionOut, /https:\/\/karmenloop\.com\/updates\.html/);
    assert.ok((await koder("model", "presets")).stdout.split("\n").filter(Boolean).length >= 30);
    fs.writeFileSync(path.join(home, ".koder-cli", "provider.json"), JSON.stringify({ model: "m", baseUrl: model.url, auth: "none" }));
    const ask = await koder("ask", "你好", "-w", home);
    assert.equal(ask.status, 0, ask.stderr);
    assert.match(ask.stdout, /安装版回复/);
    const info = JSON.parse(fs.readFileSync(path.join(home, ".koder-cli", "install.json"), "utf8"));
    assert.equal(info.version, "0.3.1");
    assert.equal(info.updates, "https://karmenloop.com/updates.html");
    assert.equal(info.site, "https://karmenloop.com");
    assert.equal(fs.realpathSync(path.join(home, ".koder-cli", "current")), fs.realpathSync(path.join(home, ".koder-cli", "versions", "0.3.1")));
    const again = await install(`${server.url}/install`, home);
    assert.equal(again.status, 0, "re-install over an existing version");
    const removed = await koder("uninstall");
    assert.equal(removed.status, 0, removed.stderr);
    assert.equal(fs.existsSync(launcher), false);
    assert.equal(fs.existsSync(path.join(home, ".koder-cli", "versions")), false);
    assert.ok(fs.existsSync(path.join(home, ".koder-cli", "provider.json")), "settings are kept");
  } finally {
    await server.close();
    await model.close();
  }
});

test("a tampered package is refused before anything is installed", async () => {
  const { site, manifest } = pack();
  const bad = tmp("koder-bad-site-");
  fs.cpSync(site, bad, { recursive: true });
  fs.writeFileSync(path.join(bad, "install", "koder-cli-latest.json"), JSON.stringify({ ...manifest, sha256: "0".repeat(64) }));
  const server = await serve(bad);
  try {
    const home = tmp();
    const result = await install(`${server.url}/install`, home);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /安装包校验失败/);
    assert.equal(fs.existsSync(path.join(home, ".local", "bin", "koder")), false);
    assert.equal(fs.existsSync(path.join(home, ".koder-cli", "versions", "0.3.1")), false);
  } finally {
    await server.close();
  }
});

test("without Node.js the installer downloads, verifies and uses its own runtime", { skip: !OS || !ARCH }, async () => {
  const { site } = pack();
  const mirror = tmp("koder-node-mirror-");
  const name = `node-v99.0.0-${OS}-${ARCH}`;
  const stage = tmp();
  fs.mkdirSync(path.join(stage, name, "bin"), { recursive: true });
  fs.writeFileSync(path.join(stage, name, "bin", "node"), `#!/bin/sh\nexec "${process.execPath}" "$@"\n`, { mode: 0o755 });
  fs.mkdirSync(path.join(mirror, "dist", "v99.0.0"), { recursive: true });
  const tarball = path.join(mirror, "dist", "v99.0.0", `${name}.tar.gz`);
  execFileSync("tar", ["-czf", tarball, "-C", stage, name]);
  const sha = crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex");
  fs.writeFileSync(path.join(mirror, "dist", "v99.0.0", "SHASUMS256.txt"), `${"f".repeat(64)}  node-v99.0.0-other.tar.gz\n${sha}  ${name}.tar.gz\n`);
  fs.cpSync(path.join(site, "install"), path.join(mirror, "install"), { recursive: true });
  const server = await serve(mirror);
  try {
    const home = tmp();
    const result = await install(`${server.url}/install`, home, ["--force-node"], { KODER_NODE_DIST: `${server.url}/dist`, KODER_NODE_VERSION: "99.0.0" });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.match(result.stdout, /正在下载 Node\.js 99\.0\.0/);
    const launcher = fs.readFileSync(path.join(home, ".local", "bin", "koder"), "utf8");
    assert.match(launcher, new RegExp(`${home.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/\\.koder-cli/runtime/${name}/bin/node`));
    const version = await run(path.join(home, ".local", "bin", "koder"), ["version"], { HOME: home, PATH: "/usr/bin:/bin" });
    assert.match(version.stdout, /^koder 0\.3\.1\n/);
    assert.match(version.stdout, /https:\/\/karmenloop\.com\/updates\.html/);
    fs.writeFileSync(path.join(mirror, "dist", "v99.0.0", "SHASUMS256.txt"), `${"0".repeat(64)}  ${name}.tar.gz\n`);
    const tampered = await install(`${server.url}/install`, tmp(), ["--force-node"], { KODER_NODE_DIST: `${server.url}/dist`, KODER_NODE_VERSION: "99.0.0" });
    assert.notEqual(tampered.status, 0);
    assert.match(tampered.stderr, /Node\.js 下载校验失败/);
  } finally {
    await server.close();
  }
});
