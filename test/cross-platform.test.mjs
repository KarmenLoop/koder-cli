import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { powershellBootstrap } from "../scripts/powershell-bootstrap.mjs";
import { installHomes, installInfo, windowsCleanup } from "../src/commands/update.mjs";
import { tmp } from "./helpers.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ps1 = fs.readFileSync(path.join(root, "install", "koder-cli.ps1"), "utf8");

let built;
function pack() {
  if (built) return built;
  const site = tmp("koder-xsite-");
  const dist = path.join(site, "install");
  execFileSync(process.execPath, [path.join(root, "scripts", "pack.mjs"), "--out", dist], { stdio: "pipe" });
  built = { site, dist, manifest: JSON.parse(fs.readFileSync(path.join(dist, "koder-cli-latest.json"), "utf8")) };
  return built;
}

async function serve(dir) {
  const server = http.createServer((req, res) => {
    const file = path.join(dir, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(dir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
    res.writeHead(200).end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

function run(command, args, env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { env });
    child.stdin.end();
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

// A fake Linux: uname and ldd answer like the target system; the "Node.js" in
// the mirror is a shim that runs this test's own node.
async function linuxInstall({ machine = "x86_64", ldd }) {
  const { site } = pack();
  const mirror = tmp("koder-xmirror-");
  fs.cpSync(path.join(site, "install"), path.join(mirror, "install"), { recursive: true });
  const shims = tmp("koder-shims-");
  fs.writeFileSync(path.join(shims, "uname"), `#!/bin/sh\ncase "$1" in -s) echo Linux ;; -m) echo ${machine} ;; *) echo Linux ;; esac\n`, { mode: 0o755 });
  fs.writeFileSync(path.join(shims, "ldd"), `#!/bin/sh\nprintf '%s\\n' ${JSON.stringify(ldd)}\n`, { mode: 0o755 });
  const names = [];
  for (const [folder, suffix] of [["dist", ""], ["unofficial", "-glibc-217"], ["unofficial", "-musl"]]) {
    for (const arch of ["x64", "arm64", "armv7l"]) {
      const name = `node-v99.0.0-linux-${arch}${suffix}`;
      const stage = tmp();
      fs.mkdirSync(path.join(stage, name, "bin"), { recursive: true });
      fs.writeFileSync(path.join(stage, name, "bin", "node"), `#!/bin/sh\nexec "${process.execPath}" "$@"\n`, { mode: 0o755 });
      const dir = path.join(mirror, folder, "v99.0.0");
      fs.mkdirSync(dir, { recursive: true });
      const tarball = path.join(dir, `${name}.tar.gz`);
      execFileSync("tar", ["-czf", tarball, "-C", stage, name]);
      fs.appendFileSync(path.join(dir, "SHASUMS256.txt"), `${crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex")}  ${name}.tar.gz\n`);
      names.push(name);
    }
  }
  const server = await serve(mirror);
  try {
    const home = tmp();
    const result = await run("bash", [path.join(mirror, "install", "koder-cli.sh"), "--no-onboard", "--no-modify-path", "--force-node"], {
      HOME: home,
      PATH: `${shims}:/usr/bin:/bin:/usr/sbin:/sbin`,
      LANG: "zh_CN.UTF-8",
      KODER_INSTALL_BASE: `${server.url}/install`,
      KODER_NODE_DIST: `${server.url}/dist`,
      KODER_NODE_DIST_UNOFFICIAL: `${server.url}/unofficial`,
      KODER_NODE_VERSION: "99.0.0",
    });
    const launcher = path.join(home, ".local", "bin", "koder");
    const version = result.status === 0 ? await run(launcher, ["version"], { HOME: home, PATH: "/usr/bin:/bin" }) : null;
    return { ...result, launcher: fs.existsSync(launcher) ? fs.readFileSync(launcher, "utf8") : "", version };
  } finally {
    await server.close();
  }
}

test("Ubuntu 18.04 (glibc 2.27) gets the glibc-217 build of Node.js", async () => {
  const result = await linuxInstall({ ldd: "ldd (Ubuntu GLIBC 2.27-3ubuntu1.6) 2.27" });
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /检测到系统库 glibc-217/);
  assert.match(result.launcher, /runtime\/node-v99\.0\.0-linux-x64-glibc-217\/bin\/node/);
  assert.match(result.version.stdout, /^koder 0\.3\.1\n/);
  assert.match(result.version.stdout, /https:\/\/karmenloop\.com\/updates\.html/);
});

test("Ubuntu 22.04 (glibc 2.35) gets the official build; Raspberry Pi gets armv7l", async () => {
  const modern = await linuxInstall({ ldd: "ldd (Ubuntu GLIBC 2.35-0ubuntu3.8) 2.35" });
  assert.equal(modern.status, 0, modern.stderr);
  assert.doesNotMatch(modern.stdout, /非正式构建/);
  assert.match(modern.launcher, /runtime\/node-v99\.0\.0-linux-x64\/bin\/node/);
  const pi = await linuxInstall({ machine: "armv7l", ldd: "ldd (Debian GLIBC 2.36-9+rpt2+deb12u4) 2.36" });
  assert.equal(pi.status, 0, pi.stderr);
  assert.match(pi.launcher, /runtime\/node-v99\.0\.0-linux-armv7l\/bin\/node/);
});

test("Alpine (musl) gets the musl build; musl on arm64 is refused with advice", async () => {
  const alpine = await linuxInstall({ ldd: "musl libc (x86_64)" });
  assert.equal(alpine.status, 0, alpine.stderr);
  assert.match(alpine.launcher, /runtime\/node-v99\.0\.0-linux-x64-musl\/bin\/node/);
  const arm = await linuxInstall({ machine: "aarch64", ldd: "musl libc (aarch64)" });
  assert.notEqual(arm.status, 0);
  assert.match(arm.stderr, /请先自行安装 Node\.js 22/);
});

test("Windows installer ships as ASCII that decodes back to the UTF-8 script", () => {
  const { dist } = pack();
  const shipped = fs.readFileSync(path.join(dist, "koder-cli.ps1"), "utf8");
  assert.equal(shipped, powershellBootstrap(ps1));
  assert.doesNotMatch(shipped, /[^\x00-\x7f]/, "pure ASCII, so irm | iex cannot mangle it");
  const base64 = [...shipped.matchAll(/^'([A-Za-z0-9+/=]+)'/gm)].map((m) => m[1]).join("");
  assert.equal(Buffer.from(base64, "base64").toString("utf8"), ps1);
  assert.match(shipped, /Invoke-Expression \$KoderInstaller/);
});

test("Windows installer script: TLS 1.2, quiet downloads, Windows 10 check, relative launcher", () => {
  assert.match(ps1, /SecurityProtocolType\]::Tls12/);
  assert.match(ps1, /\$ProgressPreference = 'SilentlyContinue'/);
  assert.match(ps1, /\$os\.Major -lt 10/);
  assert.match(ps1, /Windows XP、7、8 不能运行/);
  assert.match(ps1, /%~dp0\.\.\\runtime\\/);
  assert.match(ps1, /%~dp0\.\.\\versions\\/);
  assert.match(ps1, /UTF8Encoding \$false/, "install.json without a BOM");
  assert.match(ps1, /\$env:Path = "\$BinDir;\$env:Path"/, "usable in the same window");
});

test("the extractor embedded for Windows without tar.exe unpacks exactly like tar", () => {
  const { dist, manifest } = pack();
  const js = /\$ExtractJs = @'\n([\s\S]*?)\n'@/.exec(ps1)[1];
  const script = path.join(tmp(), "extract.cjs");
  fs.writeFileSync(script, js);
  const ours = tmp("koder-ours-");
  const theirs = tmp("koder-tar-");
  const tarball = path.join(dist, manifest.file);
  execFileSync(process.execPath, [script, tarball, ours]);
  execFileSync("tar", ["-xzf", tarball, "-C", theirs, "--strip-components=1"]);
  const list = (dir) => {
    const out = [];
    const walk = (sub) => {
      for (const entry of fs.readdirSync(path.join(dir, sub), { withFileTypes: true })) {
        const rel = path.join(sub, entry.name);
        if (entry.isDirectory()) walk(rel);
        else out.push(rel);
      }
    };
    walk("");
    return out.sort();
  };
  const files = list(theirs);
  assert.ok(files.length > 50);
  assert.deepEqual(list(ours), files);
  for (const file of files) assert.ok(fs.readFileSync(path.join(ours, file)).equals(fs.readFileSync(path.join(theirs, file))), file);
});

test("update and uninstall find the Windows install and clean up after exit", () => {
  const local = tmp();
  const home = path.join(local, "koder-cli");
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, "install.json"), `\uFEFF${JSON.stringify({ version: "0.2.0", launcher: "C:\\koder\\bin\\koder.cmd", bin: "C:\\koder\\bin" })}`);
  const env = { KODER_CLI_HOME: tmp(), LOCALAPPDATA: local };
  assert.ok(installHomes(env, "win32").includes(home));
  assert.equal(installHomes(env, "darwin").includes(home), false);
  const info = installInfo(env, "win32");
  assert.equal(info.version, "0.2.0", "a BOM from Windows PowerShell 5.1 is tolerated");
  assert.equal(info.home, home);
  const script = windowsCleanup(info);
  assert.match(script, /^ping -n 3 127\.0\.0\.1 >nul/);
  assert.ok(script.includes(`rmdir /s /q "${path.join(home, "versions")}"`));
  assert.ok(script.includes('del /f /q "C:\\koder\\bin\\koder.cmd"'));
  assert.match(script, /SetEnvironmentVariable\('Path'/);
  assert.ok(windowsCleanup(info, { purge: true }).includes(`rmdir /s /q "${home}"`));
});
