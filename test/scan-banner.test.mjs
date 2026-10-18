import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { animateBanner, renderBanner, WORDMARK } from "../src/banner.mjs";
import { colorDepth, displayWidth, stripAnsi } from "../src/color.mjs";
import { decodeCursorPath, scanAll } from "../src/scan.mjs";
import { cli, tmp, write } from "./helpers.mjs";

function today() {
  const d = new Date();
  return [String(d.getUTCFullYear()), String(d.getUTCMonth() + 1).padStart(2, "0"), String(d.getUTCDate()).padStart(2, "0")];
}

function fixtureHome() {
  const home = tmp("koder-scan-home-");
  const projects = tmp("koder-scan-projects-");
  const app = path.join(projects, "my-app");
  const api = path.join(projects, "api");
  fs.mkdirSync(app);
  fs.mkdirSync(api);
  const [y, m, d] = today();
  const day = `.codex/sessions/${y}/${m}/${d}`;
  write(home, {
    [`${day}/rollout-a.jsonl`]: `${JSON.stringify({ type: "session_meta", payload: { id: "c1", cwd: app, timestamp: "t", base_instructions: { text: "x".repeat(90_000) } } })}\n{"type":"response_item"}\n`,
    [`${day}/rollout-b.jsonl`]: `${JSON.stringify({ type: "session_meta", payload: { id: "c2", cwd: app, parent_thread_id: "c1", agent_role: "worker" } })}\n`,
    ".codex/session_index.jsonl": `${JSON.stringify({ id: "c1", thread_name: "修好登录页", updated_at: "t" })}\n`,
    ".codex/auth.json": "{\"must\":\"never be read\"}",
    ".claude/projects/-x-api/s1.jsonl": [
      JSON.stringify({ type: "user", cwd: api, sessionId: "s1", message: { role: "user", content: "<command-name>/init</command-name>" } }),
      JSON.stringify({ type: "user", cwd: api, sessionId: "s1", message: { role: "user", content: [{ type: "text", text: "给 API 加限流" }] } }),
    ].join("\n"),
    "Library/Application Support/koder-desktop/data/sessions/k1.json": "K\u0000sealed",
  });
  const encoded = app.replace(/^\//, "").split(path.sep).join("-");
  write(home, { [`.cursor/projects/${encoded}/agent-transcripts/u1/u1.jsonl`]: `${JSON.stringify({ role: "user", message: { content: [{ type: "text", text: "<timestamp>x</timestamp>\n<user_query>\n优化首页加载速度\n</user_query>" }] } })}\n` });
  write(home, { ".cursor/projects/empty-window/agent-transcripts/u2.jsonl": `${JSON.stringify({ role: "user", message: { content: [{ type: "text", text: "<user_query>随便问问</user_query>" }] } })}\n` });
  return { home, app, api };
}

test("cursor folder names decode against the real filesystem, preferring the longest match", () => {
  const root = tmp();
  fs.mkdirSync(path.join(root, "work", "my-app"), { recursive: true });
  fs.mkdirSync(path.join(root, "work", "my"), { recursive: true });
  fs.mkdirSync(path.join(root, "work", "other", "deep"), { recursive: true });
  assert.equal(decodeCursorPath("work-my-app", root), path.join(root, "work", "my-app"));
  assert.equal(decodeCursorPath("work-other-deep", root), path.join(root, "work", "other", "deep"));
  assert.equal(decodeCursorPath("work-missing", root), null);
});

test("scan merges Codex, Claude Code, Cursor and Koder by folder, skipping subagents and sealed data", () => {
  const { home, app, api } = fixtureHome();
  const result = scanAll({ home, env: {}, days: 30 });
  const byId = Object.fromEntries(result.tools.map((tool) => [tool.id, tool]));
  assert.equal(byId.codex.sessions.length, 1);
  assert.equal(byId.codex.sessions[0].title, "修好登录页");
  assert.equal(byId.claude.sessions[0].title, "给 API 加限流");
  assert.equal(byId.cursor.sessions.find((s) => s.cwd === app).title, "优化首页加载速度");
  assert.equal(byId.koder.sealed, true);
  assert.equal(byId.koder.stores[0].count, 1);
  const appProject = result.projects.find((p) => p.path === app);
  assert.deepEqual(appProject.tools, { codex: 1, cursor: 1 });
  assert.equal(appProject.exists, true);
  assert.ok(result.projects.find((p) => p.path === api));
  const hidden = scanAll({ home, env: {}, titles: false });
  assert.ok(hidden.projects.flatMap((p) => p.tasks).every((task) => task.title === ""));
});

test("scan command: JSON for scripts, --no-titles, tool filter", async () => {
  const { home, app } = fixtureHome();
  const json = await cli(["scan", "--json"], { env: { KODER_SCAN_HOME: home } });
  assert.equal(json.code, 0, json.err);
  const value = JSON.parse(json.out);
  assert.ok(value.projects.some((p) => p.path === app && p.tasks.some((t) => t.title === "修好登录页")));
  assert.equal(value.tools.find((t) => t.id === "koder").sealed, true);
  const bare = JSON.parse((await cli(["scan", "--json", "--no-titles", "--tool", "codex"], { env: { KODER_SCAN_HOME: home } })).out);
  assert.deepEqual(bare.tools.map((t) => t.id), ["codex"]);
  assert.equal(bare.projects[0].tasks[0].title, undefined);
  const text = await cli(["scan"], { env: { KODER_SCAN_HOME: home } });
  assert.match(text.out, /Codex：1 个项目，1 个会话/);
  assert.match(text.out, /Koder：任务记录已加密/);
  assert.match(text.out, /· 修好登录页/);
  const bad = await cli(["scan", "--tool", "vscode"], { env: { KODER_SCAN_HOME: home } });
  assert.equal(bad.code, 2);
});

const INFO = {
  title: "KODER CLI v0.2.0 · KARMEN LOOP",
  sections: [
    { title: "环境", rows: [["模型", "还没配置 · koder model set", "warn"], ["引擎", "Koder 内核"], ["目录", "~/Desktop/a-very-long-project-folder-name-that-must-be-cut-short-somewhere"], ["语言", "中文 · /lang en 切英文"]] },
    { title: "常用命令", rows: [["对话", "koder · run · ask"], ["质量", "review · fix · test"]] },
  ],
  summary: "17 课互动教程 · 30+ 模型预设 · 8 个聊天平台",
};
const COPY = { version: "v0.2.0", tagline: "敲一行命令，折出整条流水线", subline: "随叫随到的终端编程搭子", hint: "第一次来？输入 /learn，十分钟包教包会", info: INFO };

test("banner: every line fits the terminal at every width, colour depth and glyph mode", () => {
  for (const columns of [160, 120, 100, 80, 79, 60, 48, 44, 30]) {
    for (const depth of ["truecolor", "256", "16", "none"]) {
      for (const ascii of [false, true]) {
        const lines = renderBanner({ columns, depth, ascii, ...COPY });
        for (const line of lines) assert.ok(displayWidth(line) < columns, `${columns}/${depth}/${ascii}: ${displayWidth(line)} >= ${columns}: ${stripAnsi(line)}`);
      }
    }
  }
});

test("banner: a Hermes-style panel with the refractor, KODER, KARMEN LOOP and the sections", () => {
  const lines = renderBanner({ columns: 120, depth: "truecolor", ...COPY }).map(stripAnsi);
  const top = lines[0].trim();
  assert.ok(top.startsWith("╭─ KODER CLI v0.2.0 · KARMEN LOOP ─"), top);
  assert.ok(lines.at(-1).trim().startsWith("╰") && lines.at(-1).trim().endsWith("╯"));
  const width = displayWidth(lines[0].trim());
  assert.ok(width >= 110, `the panel is big: ${width}`);
  for (const line of lines.slice(1, -1)) {
    assert.ok(line.trim().startsWith("│") && line.trim().endsWith("│"), line);
    assert.equal(displayWidth(line.trim()), width, "every row closes the box");
  }
  const text = lines.join("\n");
  for (const row of WORDMARK) assert.ok(text.includes(row.trimEnd()));
  const wordRow = lines.findIndex((line) => line.includes(WORDMARK[0].trimEnd()));
  assert.ok(lines[wordRow + 6].includes("K A R M E N   L O O P"), "KARMEN LOOP sits right under the wordmark");
  for (const needle of ["敲一行命令，折出整条流水线", "环境", "常用命令", "review · fix · test", "17 课互动教程", "…"]) assert.ok(text.includes(needle), needle);
  assert.ok(lines.filter((line) => /[▀▄]/.test(line)).length >= 20, "a large refractor drawn with half blocks");
});

test("banner: colours are the website's palette, dark and light", async () => {
  const { setTheme } = await import("../src/theme.mjs");
  try {
    setTheme("dark");
    const dark = renderBanner({ columns: 120, depth: "truecolor", ...COPY }).join("\n");
    assert.match(dark, /38;2;124;166;255m KODER CLI/, "title in accent #7ca6ff");
    assert.match(dark, /38;2;237;237;235m█/, "wordmark starts in text #ededeb");
    assert.match(dark, /38;2;124;166;255m█/, "and ends in accent #7ca6ff");
    assert.match(dark, /38;2;224;164;64m还没配置/, "warnings in #e0a440");
    setTheme("light");
    const light = renderBanner({ columns: 120, depth: "truecolor", ...COPY }).join("\n");
    assert.match(light, /38;2;36;85;211m KODER CLI/, "light accent #2455d3");
    assert.match(light, /38;2;29;28;26m█/, "light text #1d1c1a");
  } finally {
    setTheme("dark");
  }
});

test("banner: no-colour, ASCII and very narrow fallbacks", () => {
  const plain = renderBanner({ columns: 100, depth: "none", ...COPY }).join("\n");
  assert.doesNotMatch(plain, /\x1b/);
  const ascii = renderBanner({ columns: 100, depth: "truecolor", ascii: true, ...COPY }).join("\n");
  assert.doesNotMatch(stripAnsi(ascii), /[\u2500-\u259f·]/);
  assert.match(stripAnsi(ascii), /^\s*\+- KODER CLI/m);
  assert.match(ascii, /\x1b\[38;2;/, "ASCII mode keeps the colours");
  assert.match(stripAnsi(ascii), /[@%#*+=]{3}/, "the refractor as a luminance ramp");
  assert.equal(stripAnsi(renderBanner({ columns: 30, depth: "none", ...COPY })[0]), "KODER · KARMEN LOOP v0.2.0");
});

test("mascot: the website's three-lobed ring with an open centre", async () => {
  const { renderMascot, packImage, unpackImage } = await import("../src/mascot.mjs");
  const image = renderMascot({ width: 40, height: 40 });
  const at = (x, y) => image.pixels[y * 40 + x];
  assert.equal(at(20, 20).alpha, 0, "the centre is a hole");
  const covered = image.pixels.filter((p) => p.alpha >= 0.5);
  assert.ok(covered.length > 300 && covered.length < 1000, `ring coverage ${covered.length}`);
  const bright = covered.filter((p) => p.rgb.some((v) => v > 200)).length;
  assert.ok(bright > 10, "studio highlights are present");
  assert.ok(covered.some((p) => Math.abs(p.rgb[0] - p.rgb[2]) > 12), "refraction fringes add colour");
  assert.deepEqual(unpackImage(JSON.parse(JSON.stringify(packImage(image)))).pixels[0], image.pixels[0]);
  assert.equal(unpackImage({ v: -1, width: 1, height: 1, data: [0] }), null);
});

test("banner animation draws all frames in place and restores the cursor", async () => {
  let text = "";
  const stream = { write: (chunk) => (text += chunk) };
  await animateBanner(stream, { columns: 100, depth: "truecolor", version: "v0" }, { frames: 4, delay: 1 });
  assert.equal((text.match(/\x1b\[\d+A/g) || []).length, 3);
  assert.ok(text.startsWith("\x1b[?25l"));
  assert.ok(text.endsWith("\x1b[?25h"));
});

test("color depth follows NO_COLOR, FORCE_COLOR, TTY and terminal hints", () => {
  const tty = { isTTY: true };
  assert.equal(colorDepth({ env: { NO_COLOR: "1", COLORTERM: "truecolor" }, stream: tty }), "none");
  assert.equal(colorDepth({ env: {}, stream: { isTTY: false } }), "none");
  assert.equal(colorDepth({ env: { FORCE_COLOR: "3" }, stream: { isTTY: false } }), "truecolor");
  assert.equal(colorDepth({ env: { COLORTERM: "truecolor" }, stream: tty }), "truecolor");
  assert.equal(colorDepth({ env: { TERM_PROGRAM: "Apple_Terminal" }, stream: tty }), "256");
  assert.equal(colorDepth({ env: { TERM: "xterm" }, stream: tty }), "16");
  assert.equal(colorDepth({ env: { COLORTERM: "truecolor" }, stream: tty, flag: false }), "none");
});

test("Windows: colour depth by build, Windows Terminal, and the legacy console", async () => {
  const { legacyConsole } = await import("../src/color.mjs");
  const tty = { isTTY: true };
  const win = (release, env = {}) => colorDepth({ env, stream: tty, platform: "win32", release });
  assert.equal(win("10.0.22631"), "truecolor", "Windows 11");
  assert.equal(win("10.0.19045"), "truecolor", "Windows 10 22H2");
  assert.equal(win("10.0.10586"), "256", "Windows 10 1511");
  assert.equal(win("10.0.10240"), "16", "Windows 10 RTM");
  assert.equal(win("6.1.7601"), "16", "Windows 7");
  assert.equal(win("10.0.10240", { WT_SESSION: "x" }), "truecolor", "Windows Terminal");
  assert.equal(legacyConsole({ env: {}, platform: "win32" }), true);
  assert.equal(legacyConsole({ env: { WT_SESSION: "x" }, platform: "win32" }), false);
  assert.equal(legacyConsole({ env: { TERM_PROGRAM: "vscode" }, platform: "win32" }), false);
  assert.equal(legacyConsole({ env: {}, platform: "darwin" }), false);
});

test("theme: KODER_THEME, saved setting, COLORFGBG and the theme command", async () => {
  const { detectTheme } = await import("../src/theme.mjs");
  assert.equal(detectTheme({ env: {}, config: {} }), "dark");
  assert.equal(detectTheme({ env: { COLORFGBG: "0;15" }, config: {} }), "light");
  assert.equal(detectTheme({ env: { COLORFGBG: "15;0" }, config: {} }), "dark");
  assert.equal(detectTheme({ env: { COLORFGBG: "0;15", KODER_THEME: "dark" }, config: {} }), "dark");
  assert.equal(detectTheme({ env: {}, config: { theme: "light" } }), "light");
  const home = tmp();
  const set = await cli(["theme", "light"], { home });
  assert.equal(set.code, 0);
  assert.match(set.out, /主题已设为 light，当前生效：light/);
  assert.match((await cli(["主题"], { home })).out, /主题设置：light/);
  assert.equal((await cli(["theme", "purple"], { home })).code, 2);
});

test("banner command: model, engine, folder and language in the panel; ASCII on the legacy console", async () => {
  const home = tmp();
  fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ name: "DeepSeek", model: "deepseek-v4-pro", baseUrl: "https://api.deepseek.com/v1", apiKey: "sk-test" }));
  const shown = await cli(["banner", "--no-anim"], { home, env: { COLUMNS: "120" } });
  assert.match(shown.out, /deepseek-v4-pro · DeepSeek/);
  assert.match(shown.out, /Koder 内核/);
  assert.match(shown.out, /中文 · \/lang en 切英文/);
  assert.doesNotMatch(shown.out, /sk-test/);
  const ascii = await cli(["banner", "--ascii"], { home, env: { COLUMNS: "120" } });
  assert.doesNotMatch(ascii.out, /[\u2500-\u259f]/);
});

test("editor snippets follow each client's documented shape", async () => {
  const zed = await cli(["editor", "zed", "--lang", "en"]);
  assert.match(zed.out, /"agent_servers"/);
  assert.match(zed.out, /"type": "custom"/);
  assert.match(zed.out, /"args": \["acp"\]/);
  assert.match(zed.out, /"KODER_LANG": "en"/);
  const nvim = await cli(["editor", "neovim"]);
  assert.match(nvim.out, /commands = \{ default = \{ "koder", "acp" \} \}/);
  const emacs = await cli(["编辑器", "emacs"]);
  assert.match(emacs.out, /agent-shell-make-agent-config/);
  assert.match(emacs.out, /:command-params '\("acp"\)/);
});
