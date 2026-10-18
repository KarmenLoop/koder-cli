import fs from "node:fs";
import path from "node:path";
import { git } from "./exec.mjs";

export async function repoRoot(cwd) {
  const result = await git(["rev-parse", "--show-toplevel"], cwd);
  return result.code === 0 ? result.stdout.trim() : null;
}

async function hasRef(root, ref) {
  return (await git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], root)).code === 0;
}

export async function defaultBase(root) {
  const head = await git(["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"], root);
  const candidates = head.code === 0 ? [head.stdout.trim().replace(/^refs\/remotes\//, "")] : [];
  candidates.push("origin/main", "origin/master", "main", "master");
  const current = (await git(["rev-parse", "--abbrev-ref", "HEAD"], root)).stdout.trim();
  for (const ref of candidates) if (ref !== current && (await hasRef(root, ref))) return ref;
  return null;
}

// Without --base: uncommitted work first, then the branch against main, then the last commit.
export async function resolveScope(root, { base, staged, commit } = {}) {
  if (commit) return { kind: "commit", label: `commit ${commit}`, args: ["show", "--format=commit %H%n%s%n%n%b", commit] };
  if (staged) return { kind: "staged", label: "staged", args: ["diff", "--cached"] };
  const hasHead = await hasRef(root, "HEAD");
  if (!base) {
    const status = await git(["status", "--porcelain"], root);
    if (status.stdout.trim()) return { kind: "worktree", label: hasHead ? "working tree vs HEAD" : "working tree", args: hasHead ? ["diff", "HEAD"] : ["diff", "--cached"], untracked: true };
    base = await defaultBase(root);
    if (!base) return { kind: "commit", label: "commit HEAD", args: ["show", "--format=commit %H%n%s%n%n%b", "HEAD"] };
  }
  const mergeBase = await git(["merge-base", base, "HEAD"], root);
  const from = mergeBase.code === 0 ? mergeBase.stdout.trim() : base;
  return { kind: "base", label: `${base}...HEAD`, base, args: ["diff", from, "HEAD"] };
}

function withContext(args) {
  return [args[0], "-U5", "--no-color", "--no-ext-diff", ...args.slice(1)];
}

function splitFiles(diff) {
  const parts = [];
  const re = /^diff --git a\/(.+?) b\/(.+)$/gm;
  let match;
  let last = null;
  while ((match = re.exec(diff))) {
    if (last) last.text = diff.slice(last.start, match.index);
    last = { file: match[2], start: match.index };
    parts.push(last);
  }
  if (last) last.text = diff.slice(last.start);
  const head = parts.length ? diff.slice(0, parts[0].start) : diff;
  return { head, files: parts.map(({ file, text }) => ({ file, text })) };
}

function stats(files) {
  let add = 0;
  let del = 0;
  for (const { text } of files) {
    for (const line of text.split("\n")) {
      if (line.startsWith("+") && !line.startsWith("+++")) add += 1;
      else if (line.startsWith("-") && !line.startsWith("---")) del += 1;
    }
  }
  return { files: files.length, add, del };
}

async function untrackedDiffs(root, spec) {
  const listed = await git(["ls-files", "--others", "--exclude-standard", "-z", ...spec], root);
  const names = listed.stdout.split("\0").filter(Boolean).slice(0, 30);
  const out = [];
  for (const name of names) {
    const full = path.join(root, name);
    const stat = fs.statSync(full, { throwIfNoEntry: false });
    if (!stat?.isFile() || stat.size > 200_000) continue;
    const body = fs.readFileSync(full, "utf8");
    if (body.includes("\0")) continue;
    const lines = body.split("\n");
    out.push({ file: name, text: `diff --git a/${name} b/${name}\nnew file (untracked)\n--- /dev/null\n+++ b/${name}\n@@ -0,0 +1,${lines.length} @@\n${lines.map((line) => `+${line}`).join("\n")}\n` });
  }
  return out;
}

const DECL = [
  /\b(?:function\*?|def|class|func|fn|interface|struct|enum|trait|type)\s+([A-Za-z_$][\w$]*)/g,
  /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g,
  /^\s*(?:export\s+)?(?:async\s+)?(?:public|private|protected|static|\s)*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g,
];
const SKIP = new Set(["if", "for", "while", "switch", "catch", "function", "return", "constructor", "super", "else", "main", "test", "describe", "it"]);

function declarations(source) {
  const names = [];
  for (const re of DECL) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(source))) if (m[1].length >= 3 && !SKIP.has(m[1])) names.push(m[1]);
  }
  return names;
}

// A changed line belongs to the nearest declaration above it in the hunk.
export function changedSymbols(files, limit = 10) {
  const found = new Map();
  const add = (name, file) => {
    if (!found.has(name)) found.set(name, file);
  };
  for (const { file, text } of files) {
    let enclosing = [];
    for (const line of text.split("\n")) {
      if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("diff --git")) continue;
      const header = line.match(/^@@[^@]*@@\s*(.*)$/);
      if (header) {
        enclosing = declarations(header[1]);
        continue;
      }
      const kind = line[0];
      if (kind !== " " && kind !== "+" && kind !== "-") continue;
      const own = declarations(line.slice(1));
      if (kind === " ") {
        if (own.length) enclosing = own;
        continue;
      }
      for (const name of own.length ? own : enclosing) add(name, file);
      if (own.length && kind === "+") enclosing = own;
    }
  }
  return [...found.entries()].slice(0, limit).map(([name, file]) => ({ name, file }));
}

async function references(root, symbols) {
  const out = [];
  for (const { name, file } of symbols) {
    const result = await git(["grep", "-n", "-w", "-I", "--max-count=4", "-e", name, "--", ".", ":(exclude)*.lock", ":(exclude)*.min.js"], root);
    const lines = result.stdout.split("\n").filter(Boolean).filter((line) => !line.startsWith(`${file}:`)).slice(0, 6).map((line) => (line.length > 180 ? `${line.slice(0, 180)}…` : line));
    out.push({ name, file, refs: lines });
  }
  return out;
}

function readHead(file, limit) {
  try {
    const text = fs.readFileSync(file, "utf8");
    return text.length > limit ? `${text.slice(0, limit)}\n…` : text;
  } catch {
    return "";
  }
}

const RULE_FILES = ["AGENTS.md", "CLAUDE.md", ".cursorrules", ".github/copilot-instructions.md", "CONTRIBUTING.md"];

export async function repoOverview(root, { ruleBudget = 8000 } = {}) {
  const listed = (await git(["ls-files"], root)).stdout.split("\n").filter(Boolean);
  const top = new Map();
  for (const file of listed) {
    const head = file.includes("/") ? `${file.split("/")[0]}/` : file;
    top.set(head, (top.get(head) || 0) + 1);
  }
  const layout = [...top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([name, count]) => (name.endsWith("/") ? `${name} (${count})` : name)).join("\n");
  const manifests = [];
  const pkg = path.join(root, "package.json");
  if (fs.existsSync(pkg)) {
    try {
      const json = JSON.parse(fs.readFileSync(pkg, "utf8"));
      manifests.push(`package.json: name=${json.name || ""} type=${json.type || "commonjs"}\nscripts: ${JSON.stringify(json.scripts || {})}\ndependencies: ${Object.keys(json.dependencies || {}).slice(0, 25).join(", ")}\ndevDependencies: ${Object.keys(json.devDependencies || {}).slice(0, 25).join(", ")}`);
    } catch {}
  }
  for (const name of ["pyproject.toml", "go.mod", "Cargo.toml", "pom.xml", "build.gradle"]) {
    const text = readHead(path.join(root, name), 1200);
    if (text) manifests.push(`${name}:\n${text}`);
  }
  let rules = "";
  const ruleFiles = [...RULE_FILES];
  const cursorRules = path.join(root, ".cursor", "rules");
  if (fs.existsSync(cursorRules)) {
    for (const name of fs.readdirSync(cursorRules).filter((item) => /\.(md|mdc)$/.test(item)).slice(0, 4)) ruleFiles.push(`.cursor/rules/${name}`);
  }
  for (const name of ruleFiles) {
    if (rules.length >= ruleBudget) break;
    const text = readHead(path.join(root, name), Math.min(3000, ruleBudget - rules.length));
    if (text) rules += `### ${name}\n${text}\n\n`;
  }
  const readme = ["README.md", "README.zh-CN.md", "readme.md"].map((name) => readHead(path.join(root, name), 1500)).find(Boolean) || "";
  const log = (await git(["log", "--oneline", "-8"], root)).stdout.trim();
  return { fileCount: listed.length, layout, manifests: manifests.join("\n\n"), rules: rules.trim(), readme, log };
}

export async function collectChanges(root, scope, { files = [], diffBudget = 80_000 } = {}) {
  const spec = files.length ? ["--", ...files] : [];
  const raw = (await git([...withContext(scope.args), ...spec], root)).stdout;
  const split = splitFiles(raw);
  let parts = split.files;
  if (scope.untracked) parts = parts.concat(await untrackedDiffs(root, spec));
  const total = parts.reduce((sum, part) => sum + part.text.length, 0);
  const truncated = [];
  if (total > diffBudget && parts.length) {
    const share = Math.max(2000, Math.floor(diffBudget / parts.length));
    parts = parts.map((part) => {
      if (part.text.length <= share) return part;
      truncated.push(part.file);
      return { ...part, text: `${part.text.slice(0, share)}\n… (truncated; read_file ${part.file} for the rest)\n` };
    });
  }
  return { head: split.head.trim(), files: parts, stats: stats(parts), truncated };
}

export async function reviewContext(root, scope, { files = [], budgetChars = 120_000 } = {}) {
  const changes = await collectChanges(root, scope, { files, diffBudget: Math.floor(budgetChars * 0.65) });
  const overview = await repoOverview(root, { ruleBudget: Math.min(8000, Math.floor(budgetChars * 0.08)) });
  const refs = await references(root, changedSymbols(changes.files));
  return { root, scope, changes, overview, refs };
}

export async function changedFiles(root, scope) {
  const changes = await collectChanges(root, scope, { diffBudget: Infinity });
  return changes.files.map((part) => part.file);
}
