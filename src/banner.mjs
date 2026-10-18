import { RESET, bg, displayWidth, fg, scale } from "./color.mjs";
import { OFFICIAL_ROTATION, mascotLines, renderMascot } from "./mascot.mjs";
import { headline, theme } from "./theme.mjs";

const LETTERS = {
  K: ["██╗  ██╗", "██║ ██╔╝", "█████╔╝ ", "██╔═██╗ ", "██║  ██╗", "╚═╝  ╚═╝"],
  O: [" ██████╗ ", "██╔═══██╗", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
  D: ["██████╗ ", "██╔══██╗", "██║  ██║", "██║  ██║", "██████╔╝", "╚═════╝ "],
  E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗", "╚══════╝"],
  R: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║  ██║", "╚═╝  ╚═╝"],
};
export const WORDMARK = LETTERS.K.map((_, row) => [..."KODER"].map((ch) => LETTERS[ch][row]).join(""));
const WORD_WIDTH = WORDMARK[0].length;
export const LOOP_LINE = "──────  K A R M E N   L O O P  ──────";
const MAX_PANEL = 128;

const ASCII = { "█": "#", "╗": "+", "╔": "+", "╝": "+", "╚": "+", "║": "|", "═": "=", "─": "-", "·": "|", "╭": "+", "╮": "+", "╰": "+", "╯": "+", "│": "|" };
const asciiText = (text) => [...text].map((ch) => ASCII[ch] || ch).join("");

function paint(text, rgb, depth, { bold = false, bright = 1 } = {}) {
  if (depth === "none" || !rgb || !text) return text;
  return `${fg(scale(rgb, bright), depth, bold)}${text}${RESET}`;
}

// The website headline treatment: text → hero-b → accent, block faces bright,
// the box-drawing shadow in hero-b.
function paintWordmark(depth, bright, ascii) {
  const p = theme();
  return WORDMARK.map((line) => {
    let out = "";
    let active = "";
    for (const [col, raw] of [...line].entries()) {
      const ch = ascii ? ASCII[raw] || raw : raw;
      if (raw === " " || depth === "none") {
        if (active) out += RESET;
        active = "";
        out += ch;
        continue;
      }
      const rgb = raw === "█" ? scale(headline(col / (WORD_WIDTH - 1)), bright) : scale(p.heroB, bright * (p.name === "dark" ? 1.35 : 1));
      const code = fg(rgb, depth, raw === "█");
      if (code !== active) {
        if (active) out += RESET;
        out += code;
        active = code;
      }
      out += ch;
    }
    return active ? out + RESET : out;
  });
}

function fit(text, width) {
  let out = "";
  for (const ch of text) {
    if (displayWidth(out + ch) > width - 1 && displayWidth(text) > width) return `${out}…`;
    out += ch;
  }
  return out;
}

function padRight(text, width) {
  return text + " ".repeat(Math.max(0, width - displayWidth(text)));
}

function center(text, width) {
  const gap = Math.max(0, width - displayWidth(text));
  return " ".repeat(Math.floor(gap / 2)) + text;
}

// Right-hand column: wordmark, KARMEN LOOP, slogan, then Hermes-style sections.
function column({ width, depth, ascii, bright, version, tagline, subline, hint, info, budget }) {
  const p = theme();
  const plain = (text) => (ascii ? asciiText(text) : text);
  const lines = [];
  const offset = Math.max(0, Math.floor((width - WORD_WIDTH) / 2));
  for (const row of paintWordmark(depth, bright, ascii)) lines.push(" ".repeat(offset) + row);
  lines.push(paint(center(plain(LOOP_LINE), width), p.text3, depth, { bold: true, bright }));
  if (tagline) lines.push("", paint(center(fit(tagline, width), width), p.text, depth, { bold: true, bright }));
  if (subline || version) lines.push(paint(center(fit(plain([subline, version].filter(Boolean).join("  ·  ")), width), width), p.text2, depth, { bright }));
  const sections = info?.sections || [];
  const tail = [];
  if (info?.summary) tail.push(paint(fit(plain(info.summary), width), p.text3, depth, { bright }));
  if (hint) tail.push(paint(fit(plain(hint), width), p.accent, depth, { bright }));
  const tone = { warn: p.warn, ok: p.ok, accent: p.accent };
  for (const section of sections) {
    const block = ["", paint(plain(section.title), p.accent, depth, { bold: true, bright })];
    const labelWidth = Math.max(...section.rows.map(([label]) => displayWidth(label))) + 2;
    for (const [label, value, mood] of section.rows) {
      block.push(`${paint(padRight(label, labelWidth), p.text3, depth, { bright })}${paint(fit(plain(value), width - labelWidth), tone[mood] || p.text, depth, { bright })}`);
    }
    if (lines.length + block.length + (tail.length ? tail.length + 1 : 0) > budget) break;
    lines.push(...block);
  }
  if (tail.length && lines.length + tail.length + 1 <= budget) lines.push("", ...tail);
  return lines;
}

function frame(width, depth, ascii, title) {
  const p = theme();
  const [tl, tr, bl, br, h, v] = ascii ? ["+", "+", "+", "+", "-", "|"] : ["╭", "╮", "╰", "╯", "─", "│"];
  const label = title ? ` ${ascii ? asciiText(title) : title} ` : "";
  const rest = Math.max(0, width - 3 - displayWidth(label));
  const line = (text) => paint(text, p.heroB, depth, { bright: p.name === "dark" ? 1.5 : 1 });
  return {
    top: `${line(tl + h)}${paint(label, p.accent, depth, { bold: true })}${line(h.repeat(rest) + tr)}`,
    bottom: line(bl + h.repeat(width - 2) + br),
    side: line(v),
  };
}

export function layout(columns, rows) {
  const panel = Math.min(MAX_PANEL, columns - 1);
  const inner = panel - 4;
  const byHeight = rows ? Math.max(0, (rows - 6) * 2) : 56;
  let mascot = Math.min(56, inner - 3 - 46, byHeight);
  if (mascot < 24) mascot = Math.min(56, inner - 3 - WORD_WIDTH, byHeight);
  mascot = mascot >= 20 ? mascot & ~1 : 0;
  return { panel, inner, mascot, right: inner - (mascot ? mascot + 3 : 0) };
}

export function renderBanner({ columns = 80, rows = 0, depth = "truecolor", progress = 1, ascii = false, glyphs, version = "", tagline = "", subline = "", hint = "", info = null, cache = null } = {}) {
  const ease = 1 - (1 - Math.max(0, Math.min(1, progress))) ** 3;
  const bright = 0.35 + 0.65 * ease;
  const p = theme();
  if (columns < WORD_WIDTH + 7) {
    return [paint(`KODER · KARMEN LOOP ${version}`.trim(), p.accent, depth, { bold: true }), ...(tagline ? [paint(tagline, p.text, depth)] : [])];
  }
  const { panel, mascot, right } = layout(columns, rows);
  const budget = rows ? Math.max(12, rows - 4) : 40;
  const block = column({ width: right, depth, ascii, bright, version, tagline, subline, hint, info, budget });
  let art = [];
  if (mascot) {
    const rotation = [OFFICIAL_ROTATION[0] + (1 - ease) * 0.5, OFFICIAL_ROTATION[1] + (1 - ease) * 2.4, OFFICIAL_ROTATION[2] + (1 - ease) * 0.3];
    const settled = ease >= 1;
    let image = settled ? cache?.get(mascot) : null;
    if (!image) {
      image = renderMascot({ width: mascot, height: mascot, rotation, time: (1 - ease) * 1.5 });
      if (settled) cache?.set(mascot, image);
    }
    art = mascotLines(image, { depth, fg, bg, reset: RESET, glyphs: glyphs || (ascii ? "ramp" : "blocks") });
  }
  const height = Math.max(art.length, block.length) + 2;
  const artTop = Math.floor((height - art.length) / 2);
  const blockTop = Math.floor((height - block.length) / 2);
  const box = frame(panel, depth, ascii, info?.title || `KODER CLI ${version}`.trim());
  const lines = [box.top];
  for (let i = 0; i < height; i += 1) {
    const left = mascot ? `${art[i - artTop] ?? " ".repeat(mascot)}   ` : "";
    const content = left + padRight(block[i - blockTop] ?? "", right);
    lines.push(`${box.side} ${content} ${box.side}`);
  }
  lines.push(box.bottom);
  const pad = " ".repeat(Math.max(0, Math.min(8, Math.floor((columns - panel - 1) / 2))));
  return lines.map((line) => pad + line);
}

export async function animateBanner(stream, options, { frames = 10, delay = 16 } = {}) {
  let printed = 0;
  stream.write("\x1b[?25l");
  try {
    for (let i = 0; i < frames; i += 1) {
      const lines = renderBanner({ ...options, progress: i / (frames - 1) });
      if (printed) stream.write(`\x1b[${printed}A\r`);
      stream.write(lines.map((line) => `${line}\x1b[K`).join("\n") + "\n");
      printed = lines.length;
      if (i < frames - 1) await new Promise((resolve) => setTimeout(resolve, delay));
    }
  } finally {
    stream.write("\x1b[?25h");
  }
}
