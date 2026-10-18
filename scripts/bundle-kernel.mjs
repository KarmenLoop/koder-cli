// Copies the part of koder-desktop the CLI runs (agent loop, tools, providers,
// plugins) into kernel/, so the CLI works where koder-desktop is not checked out.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const out = path.resolve(outIndex >= 0 ? args[outIndex + 1] : path.join(here, "..", "kernel"));
const source = path.resolve(process.env.KODER_DESKTOP_ROOT || path.join(here, "..", "..", "koder-desktop"));

const KERNEL_LICENSE = `Koder 内核（kernel/ 目录）
版权所有 © KARMEN / Koder。保留所有权利。

本目录中的 Koder 内核不是 Koder CLI 的开源部分，不适用 Koder CLI 的
GNU GPL v3.0。你只能把它作为 Koder CLI 的组成部分，在自己的设备上运行。
未经书面许可，不得：
1. 复制、修改、改编或翻译本目录中的文件，或据此制作衍生作品；
2. 单独分发、出租、出借、转授权或公开本目录中的文件；
3. 对本目录中的文件进行反向工程、反编译或去混淆，适用法律明确允许的除外；
4. 删除或修改本声明和其中的版权标识。

fusion/ecosystem/resources/ 下的第三方资源按各自目录中的许可证文件授权，
不受本声明限制。

Koder kernel (the kernel/ directory)
Copyright © KARMEN / Koder. All rights reserved.

The Koder kernel in this directory is not part of the open-source Koder CLI and
is not covered by its GNU GPL v3.0. You may run it only as part of Koder
CLI on your own devices. Without written permission you may not:
1. copy, modify, adapt or translate the files in this directory, or make
   derivative works of them;
2. distribute, rent, lend, sublicense or publish them on their own;
3. reverse engineer, decompile or deobfuscate them, except where applicable law
   expressly permits it;
4. remove or alter this notice or its copyright statements.

Third-party resources under fusion/ecosystem/resources/ are licensed under the
licence files in their own folders and are not restricted by this notice.
`;

const ASSETS = ["fusion/catalog-models.json"];
const entries = ["harness/create.mjs", "harness/diff.mjs", "fusion/catalog.mjs"];
for (const name of fs.readdirSync(path.join(source, "fusion", "plugins")).filter((item) => item.endsWith(".mjs"))) entries.push(`fusion/plugins/${name}`);
for (const name of fs.readdirSync(path.join(source, "fusion", "hermes"))) {
  const folder = path.join(source, "fusion", "hermes", name);
  if (!fs.statSync(folder).isDirectory()) continue;
  entries.push(`fusion/hermes/${name}/plugin.mjs`);
  if (fs.existsSync(path.join(folder, "plugin.yaml"))) ASSETS.push(`fusion/hermes/${name}/plugin.yaml`);
}

// The desktop app's at-rest encryption and key storage. The CLI keeps sessions in
// memory, so these ship as stubs with the same exports and their code never leaves.
const DESKTOP_ONLY = new Set(["fusion/vault.mjs", "fusion/private-store.mjs", "fusion/data-lock.mjs"]);
const NEVER_SHIP = new Set([...DESKTOP_ONLY, "fusion/desktop.mjs", "fusion/k131419.mjs", "fusion/k131419-v1.mjs", "fusion/private-lease.mjs"]);

function stubFor(text) {
  const exported = (kind) => [...text.matchAll(new RegExp(`^export\\s+(?:async\\s+)?${kind}\\s+([A-Za-z_$][\\w$]*)`, "gm"))].map((match) => match[1]);
  const classes = new Set(exported("class"));
  const names = [...exported("function\\*?"), ...exported("(?:const|let)")];
  for (const match of text.matchAll(/^export\s*\{([^}]*)\}/gm)) names.push(...match[1].split(",").map((part) => part.trim().split(/\s+as\s+/).pop()).filter(Boolean));
  return [
    "// Not shipped with Koder CLI: the desktop app's data encryption and key storage.",
    'const MESSAGE = "Koder CLI 不包含桌面端的数据加密模块";',
    ...[...classes].map((name) => `export class ${name} extends Error { constructor() { super(MESSAGE); } }`),
    ...[...new Set(names)].filter((name) => !classes.has(name)).map((name) => `export function ${name}() { throw new Error(MESSAGE); }`),
    "",
  ].join("\n");
}

const seen = new Set();
const stubs = new Set();
const queue = [...entries];
while (queue.length) {
  const rel = queue.shift();
  if (seen.has(rel)) continue;
  seen.add(rel);
  if (DESKTOP_ONLY.has(rel)) {
    stubs.add(rel);
    continue;
  }
  const text = fs.readFileSync(path.join(source, rel), "utf8");
  for (const match of text.matchAll(/(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
    const spec = match[1] || match[2];
    if (!spec.startsWith(".")) continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(rel), spec));
    if (NEVER_SHIP.has(target) && !DESKTOP_ONLY.has(target)) throw new Error(`内核的 ${rel} 新引用了桌面端加密模块 ${target}：把它加进 DESKTOP_ONLY，或请内核改成按需加载`);
    queue.push(target);
  }
}

// Folders a module reads at run time; resources there are hash-checked against its manifest.
const DATA_DIRS = { "fusion/ecosystem.mjs": "fusion/ecosystem" };
const walk = (rel) => fs.readdirSync(path.join(source, rel), { withFileTypes: true }).flatMap((item) => (item.isDirectory() ? walk(`${rel}/${item.name}`) : item.isFile() && item.name !== ".DS_Store" ? [`${rel}/${item.name}`] : []));
for (const [module, dir] of Object.entries(DATA_DIRS)) if (seen.has(module)) ASSETS.push(...walk(dir));

const files = [...seen, ...ASSETS].sort();
fs.rmSync(out, { recursive: true, force: true });
const manifest = { source, createdAt: new Date().toISOString(), files: [] };
for (const rel of files) {
  const from = path.join(source, rel);
  const to = path.join(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (stubs.has(rel)) fs.writeFileSync(to, stubFor(fs.readFileSync(from, "utf8")));
  else fs.copyFileSync(from, to);
  const bytes = fs.readFileSync(to);
  manifest.files.push({ path: rel, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), ...(stubs.has(rel) ? { stub: true } : {}) });
}
fs.writeFileSync(path.join(out, "LICENSE"), KERNEL_LICENSE);
fs.writeFileSync(path.join(out, "MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const total = manifest.files.reduce((sum, item) => sum + item.bytes, 0);
console.log(`kernel: ${manifest.files.length} files, ${total} bytes -> ${out}`);
