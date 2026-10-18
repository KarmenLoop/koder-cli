import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Reads only file names, times, working folders and titles. Never opens
// account files, keys, databases or sealed Koder records.
const FIRST_LINE_LIMIT = 2_000_000;

function stat(file) {
  return fs.statSync(file, { throwIfNoEntry: false });
}

function list(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

export function readHeadLines(file, { bytes = 65_536, lines = 40 } = {}) {
  let fd;
  try {
    fd = fs.openSync(file, "r");
    const buffer = Buffer.alloc(bytes);
    const size = fs.readSync(fd, buffer, 0, bytes, 0);
    return buffer.subarray(0, size).toString("utf8").split("\n").slice(0, lines);
  } catch {
    return [];
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

export function readFirstLine(file, limit = FIRST_LINE_LIMIT) {
  let fd;
  try {
    fd = fs.openSync(file, "r");
    const chunk = Buffer.alloc(65_536);
    const parts = [];
    let total = 0;
    for (;;) {
      const size = fs.readSync(fd, chunk, 0, chunk.length, total);
      if (!size) break;
      const index = chunk.subarray(0, size).indexOf(10);
      if (index >= 0) {
        parts.push(Buffer.from(chunk.subarray(0, index)));
        break;
      }
      parts.push(Buffer.from(chunk.subarray(0, size)));
      total += size;
      if (total > limit) return null;
    }
    return Buffer.concat(parts).toString("utf8");
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function parse(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

export function shortTitle(text, limit = 60) {
  const line = String(text || "").replace(/<[^>]+>/g, " ").split("\n").map((item) => item.trim()).find(Boolean) || "";
  return line.length > limit ? `${line.slice(0, limit)}…` : line;
}

// "Users-me-Desktop-my-app" could be /Users/me/Desktop/my-app or .../my/app;
// walk the real filesystem and keep the longest existing match at each level.
export function decodeCursorPath(name, root = path.parse(os.homedir()).root, platform = process.platform) {
  let parts = name.split("-");
  // On Windows the folder name starts with the drive letter: "c-Users-me-app".
  if (platform === "win32" && /^[a-zA-Z]$/.test(parts[0]) && parts.length > 1) {
    root = `${parts[0].toUpperCase()}:\\`;
    parts = parts.slice(1);
  }
  const walk = (dir, index) => {
    if (index >= parts.length) return dir;
    for (let end = parts.length; end > index; end -= 1) {
      const segment = parts.slice(index, end).join("-");
      if (!segment) continue;
      const candidates = [segment, segment.replace(/-/g, " "), segment.replace(/-/g, "_"), segment.replace(/-/g, ".")];
      if (index === 0 || dir === root) candidates.push(`.${segment}`);
      for (const candidate of candidates) {
        const next = path.join(dir, candidate);
        if (stat(next)?.isDirectory()) {
          const found = walk(next, end);
          if (found) return found;
        }
      }
    }
    return null;
  };
  return walk(root, 0);
}

function cutoff(days) {
  return days > 0 ? Date.now() - days * 86_400_000 : 0;
}

export function scanCodex({ home, env = process.env, days = 30, titles = true, includeSubagents = false }) {
  const base = env.CODEX_HOME ? path.resolve(env.CODEX_HOME) : path.join(home, ".codex");
  const sessionsDir = path.join(base, "sessions");
  if (!stat(sessionsDir)?.isDirectory()) return { id: "codex", name: "Codex", found: false, sessions: [] };
  const names = new Map();
  if (titles) {
    for (const line of (fs.existsSync(path.join(base, "session_index.jsonl")) ? fs.readFileSync(path.join(base, "session_index.jsonl"), "utf8") : "").split("\n")) {
      const item = parse(line);
      if (item?.id && item.thread_name) names.set(item.id, item.thread_name);
    }
  }
  const since = cutoff(days);
  const sessions = [];
  for (const year of list(sessionsDir).filter((d) => d.isDirectory())) {
    for (const month of list(path.join(sessionsDir, year.name)).filter((d) => d.isDirectory())) {
      for (const day of list(path.join(sessionsDir, year.name, month.name)).filter((d) => d.isDirectory())) {
        const dayEnd = Date.UTC(Number(year.name), Number(month.name) - 1, Number(day.name) + 2);
        if (since && Number.isFinite(dayEnd) && dayEnd < since) continue;
        const dir = path.join(sessionsDir, year.name, month.name, day.name);
        for (const file of list(dir).filter((d) => d.isFile() && /^rollout-.*\.jsonl$/.test(d.name))) {
          const full = path.join(dir, file.name);
          const info = stat(full);
          if (!info || info.mtimeMs < since) continue;
          const meta = parse(readFirstLine(full))?.payload;
          if (!meta?.cwd) continue;
          if (!includeSubagents && (meta.parent_thread_id || meta.agent_role)) continue;
          sessions.push({ tool: "codex", id: meta.id || file.name, cwd: meta.cwd, updatedAt: info.mtimeMs, title: titles ? shortTitle(names.get(meta.id)) : "" });
        }
      }
    }
  }
  return { id: "codex", name: "Codex", found: true, sessions };
}

function claudeText(message) {
  const content = message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.filter((block) => block?.type === "text").map((block) => block.text).join("\n");
  return "";
}

export function scanClaude({ home, env = process.env, days = 30, titles = true }) {
  const base = env.CLAUDE_CONFIG_DIR ? path.resolve(env.CLAUDE_CONFIG_DIR) : path.join(home, ".claude");
  const projects = path.join(base, "projects");
  if (!stat(projects)?.isDirectory()) return { id: "claude", name: "Claude Code", found: false, sessions: [] };
  const since = cutoff(days);
  const sessions = [];
  for (const project of list(projects).filter((d) => d.isDirectory())) {
    const dir = path.join(projects, project.name);
    for (const file of list(dir).filter((d) => d.isFile() && d.name.endsWith(".jsonl"))) {
      const full = path.join(dir, file.name);
      const info = stat(full);
      if (!info || info.mtimeMs < since) continue;
      let cwd = "";
      let id = file.name.replace(/\.jsonl$/, "");
      let summary = "";
      let first = "";
      for (const line of readHeadLines(full, { bytes: 131_072, lines: 60 })) {
        const item = parse(line);
        if (!item) continue;
        if (!cwd && item.cwd) cwd = item.cwd;
        if (item.sessionId) id = item.sessionId;
        if (item.type === "summary" && item.summary) summary ||= item.summary;
        if (!first && item.type === "user" && !item.isMeta) {
          const text = claudeText(item.message).trim();
          if (text && !text.startsWith("<")) first = text;
        }
      }
      if (!cwd) continue;
      sessions.push({ tool: "claude", id, cwd, updatedAt: info.mtimeMs, title: titles ? shortTitle(summary || first) : "" });
    }
  }
  return { id: "claude", name: "Claude Code", found: true, sessions };
}

export function scanCursor({ home, days = 30, titles = true, root }) {
  const projects = path.join(home, ".cursor", "projects");
  if (!stat(projects)?.isDirectory()) return { id: "cursor", name: "Cursor", found: false, sessions: [] };
  const since = cutoff(days);
  const sessions = [];
  for (const project of list(projects).filter((d) => d.isDirectory())) {
    const transcripts = path.join(projects, project.name, "agent-transcripts");
    const files = [];
    for (const entry of list(transcripts)) {
      if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push({ id: entry.name.replace(/\.jsonl$/, ""), file: path.join(transcripts, entry.name) });
      else if (entry.isDirectory()) {
        const inner = path.join(transcripts, entry.name, `${entry.name}.jsonl`);
        if (stat(inner)?.isFile()) files.push({ id: entry.name, file: inner });
      }
    }
    if (!files.length) continue;
    const cwd = project.name === "empty-window" ? "" : decodeCursorPath(project.name, root) || "";
    for (const { id, file } of files) {
      const info = stat(file);
      if (!info || info.mtimeMs < since) continue;
      let title = "";
      if (titles) {
        for (const line of readHeadLines(file, { bytes: 65_536, lines: 20 })) {
          const item = parse(line);
          if (item?.role !== "user") continue;
          const text = claudeText(item.message);
          const query = /<user_query>\s*([\s\S]*?)\s*<\/user_query>/.exec(text);
          title = shortTitle(query ? query[1] : text);
          break;
        }
      }
      sessions.push({ tool: "cursor", id, cwd, encoded: project.name, updatedAt: info.mtimeMs, title });
    }
  }
  return { id: "cursor", name: "Cursor", found: true, sessions };
}

export function koderDataDirs({ home, env = process.env }) {
  const dirs = [];
  if (env.KODER_DATA) dirs.push(path.resolve(env.KODER_DATA));
  dirs.push(path.join(home, "Library", "Application Support", "koder-desktop", "data"));
  dirs.push(path.join(home, ".config", "koder-desktop", "data"));
  if (env.APPDATA) dirs.push(path.join(env.APPDATA, "koder-desktop", "data"));
  return [...new Set(dirs)];
}

// Koder seals its task records (files start with "K"); count them, never decrypt.
export function scanKoder({ home, env = process.env, days = 30 }) {
  const since = cutoff(days);
  const stores = [];
  for (const dir of koderDataDirs({ home, env })) {
    if (!stat(dir)?.isDirectory()) continue;
    let count = 0;
    let latest = 0;
    let sealed = false;
    for (const sub of ["sessions", "threads"]) {
      for (const entry of list(path.join(dir, sub)).filter((d) => d.isFile() && d.name.endsWith(".json"))) {
        const full = path.join(dir, sub, entry.name);
        const info = stat(full);
        if (!info || info.mtimeMs < since) continue;
        count += 1;
        latest = Math.max(latest, info.mtimeMs);
        if (!sealed) sealed = readHeadLines(full, { bytes: 1, lines: 1 })[0] === "K";
      }
    }
    stores.push({ dir, count, latest, sealed });
  }
  return { id: "koder", name: "Koder", found: stores.length > 0, sealed: stores.some((s) => s.sealed), stores, sessions: [] };
}

const SCANNERS = { koder: scanKoder, codex: scanCodex, claude: scanClaude, cursor: scanCursor };
export const TOOL_IDS = Object.keys(SCANNERS);

export function scanAll({ home = os.homedir(), env = process.env, days = 30, titles = true, tools = TOOL_IDS, root } = {}) {
  const results = tools.map((id) => SCANNERS[id]({ home, env, days, titles, root }));
  const byPath = new Map();
  for (const result of results) {
    for (const session of result.sessions) {
      const key = session.cwd || `?${session.encoded || session.tool}`;
      let project = byPath.get(key);
      if (!project) {
        project = { path: session.cwd || "", label: session.cwd || session.encoded || "", exists: Boolean(session.cwd && stat(session.cwd)?.isDirectory()), tools: {}, updatedAt: 0, tasks: [] };
        byPath.set(key, project);
      }
      project.tools[session.tool] = (project.tools[session.tool] || 0) + 1;
      project.updatedAt = Math.max(project.updatedAt, session.updatedAt);
      project.tasks.push(session);
    }
  }
  const projects = [...byPath.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const project of projects) project.tasks.sort((a, b) => b.updatedAt - a.updatedAt);
  return { tools: results, projects };
}

export function ago(ms, lang = "zh", now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - ms) / 60_000));
  const zh = lang === "zh";
  if (minutes < 1) return zh ? "刚刚" : "just now";
  if (minutes < 60) return zh ? `${minutes} 分钟前` : `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return zh ? `${hours} 小时前` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return zh ? `${days} 天前` : `${days}d ago`;
}
