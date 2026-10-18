// Builds dist/: the package tarball (with the bundled kernel), its manifest,
// and the two installer scripts, ready to upload to the install base URL.
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { powershellBootstrap } from "./powershell-bootstrap.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const dist = path.resolve(outIndex >= 0 ? args[outIndex + 1] : path.join(root, "dist"));
const { version } = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const stage = fs.mkdtempSync(path.join(dist + "-stage-"));
const pkg = path.join(stage, "koder-cli");
fs.mkdirSync(pkg, { recursive: true });
for (const item of ["bin", "src", "package.json", "LICENSE", "THIRD_PARTY_NOTICES.md", "README.md"]) {
  const from = path.join(root, item);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(pkg, item), { recursive: true });
}
execFileSync(process.execPath, [path.join(root, "scripts", "bundle-kernel.mjs"), "--out", path.join(pkg, "kernel")], { stdio: "inherit", env: process.env });

fs.mkdirSync(dist, { recursive: true });
const file = `koder-cli-${version}.tgz`;
const tarball = path.join(dist, file);
execFileSync("tar", ["-czf", tarball, "-C", stage, "koder-cli"], { env: { ...process.env, COPYFILE_DISABLE: "1" } });
fs.rmSync(stage, { recursive: true, force: true });

const bytes = fs.readFileSync(tarball);
const manifest = { version, file, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), size: bytes.length, node: ">=22", builtAt: new Date().toISOString() };
fs.writeFileSync(path.join(dist, `koder-cli-${version}.json`), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(dist, "koder-cli-latest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.copyFileSync(path.join(root, "install", "koder-cli.sh"), path.join(dist, "koder-cli.sh"));
fs.copyFileSync(path.join(root, "install", "koder-cli.cmd"), path.join(dist, "koder-cli.cmd"));
fs.writeFileSync(path.join(dist, "koder-cli.ps1"), powershellBootstrap(fs.readFileSync(path.join(root, "install", "koder-cli.ps1"), "utf8")));
console.log(`dist: ${file} ${manifest.size} bytes sha256 ${manifest.sha256} -> ${dist}`);
