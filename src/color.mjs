import os from "node:os";
import { headline } from "./theme.mjs";

// Color depth: "truecolor", "256", "16" or "none".
const TRUECOLOR_TERMS = new Set(["iTerm.app", "vscode", "WezTerm", "ghostty", "WarpTerminal", "Hyper", "Tabby"]);

// Windows build numbers: 10586 added VT sequences to conhost, 14931 added 24-bit colour.
export function windowsBuild(release = os.release()) {
  const [major, , build] = String(release).split(".").map(Number);
  return major >= 10 ? build || 0 : 0;
}

export function colorDepth({ env = process.env, stream = process.stdout, flag, platform = process.platform, release } = {}) {
  if (flag === false) return "none";
  if (env.NO_COLOR) return "none";
  const force = env.FORCE_COLOR;
  if (force === "0" || force === "false") return "none";
  if (force === "3") return "truecolor";
  if (force === "2") return "256";
  if (force === "1" || force === "true") return "16";
  if (flag !== true && !stream?.isTTY) return "none";
  if (env.TERM === "dumb") return "none";
  if (/^(truecolor|24bit)$/i.test(env.COLORTERM || "")) return "truecolor";
  if (TRUECOLOR_TERMS.has(env.TERM_PROGRAM || "")) return "truecolor";
  if (platform === "win32") {
    if (env.WT_SESSION || env.ConEmuANSI === "ON") return "truecolor";
    const build = windowsBuild(release);
    return build >= 14931 ? "truecolor" : build >= 10586 ? "256" : "16";
  }
  if (/256/.test(env.TERM || "") || env.TERM_PROGRAM === "Apple_Terminal") return "256";
  return "16";
}

// The classic Windows console with a CJK font draws box and block characters
// two columns wide, which breaks any art; Windows Terminal and VS Code do not.
export function legacyConsole({ env = process.env, platform = process.platform } = {}) {
  return platform === "win32" && !env.WT_SESSION && !env.TERM_PROGRAM && !env.ConEmuANSI;
}

function cube(value) {
  return value < 48 ? 0 : value < 115 ? 1 : Math.min(5, Math.floor((value - 35) / 40));
}

export function to256([r, g, b]) {
  const gray = Math.round((r + g + b) / 3);
  if (Math.max(r, g, b) - Math.min(r, g, b) < 12) {
    if (gray < 8) return 16;
    if (gray > 238) return 231;
    return 232 + Math.round((gray - 8) / 10);
  }
  return 16 + 36 * cube(r) + 6 * cube(g) + cube(b);
}

const BASIC = [
  [0, 0, 0], [205, 49, 49], [13, 188, 121], [229, 229, 16],
  [36, 114, 200], [188, 63, 188], [17, 168, 205], [229, 229, 229],
];

export function to16([r, g, b]) {
  let best = 0;
  let score = Infinity;
  BASIC.forEach(([br, bg, bb], index) => {
    const d = (r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2;
    if (d < score) {
      score = d;
      best = index;
    }
  });
  const bright = r + g + b > 380;
  return (bright ? 90 : 30) + best;
}

export function fg(rgb, depth, bold = false) {
  if (!rgb || depth === "none") return "";
  const weight = bold ? "1;" : "";
  if (depth === "truecolor") return `\x1b[${weight}38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  if (depth === "256") return `\x1b[${weight}38;5;${to256(rgb)}m`;
  return `\x1b[${weight}${to16(rgb)}m`;
}

export function bg(rgb, depth) {
  if (!rgb || depth === "none") return "";
  if (depth === "truecolor") return `\x1b[48;2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  if (depth === "256") return `\x1b[48;5;${to256(rgb)}m`;
  return `\x1b[${to16(rgb) + 10}m`;
}

export const RESET = "\x1b[0m";

export function paint(text, rgb, depth, bold = false) {
  if (!rgb || depth === "none") return text;
  return `${fg(rgb, depth, bold)}${text}${RESET}`;
}

export function mix(a, b, t) {
  const k = Math.max(0, Math.min(1, t));
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * k));
}

export function scale(rgb, k) {
  return rgb.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
}

// Website headline gradient (text → hero-b → accent) across the characters.
export function gradientText(text, depth, { from = 0, to = 1, bold = false } = {}) {
  if (depth === "none") return text;
  const chars = [...text];
  const span = Math.max(1, chars.length - 1);
  let out = "";
  chars.forEach((ch, i) => {
    out += ch === " " ? ch : `${fg(headline(from + (to - from) * (i / span)), depth, bold)}${ch}`;
  });
  return `${out}${RESET}`;
}

export function tint(text, rgb, depth, bold = false) {
  return depth === "none" || !rgb ? text : `${fg(rgb, depth, bold)}${text}${RESET}`;
}

export function stripAnsi(text) {
  return String(text).replace(/\x1b\[[0-9;]*m/g, "").replace(/\x1b\[\d*[A-Za-z]/g, "");
}

// Display width: CJK and full-width forms take two columns.
export function displayWidth(text) {
  let width = 0;
  for (const ch of stripAnsi(text)) {
    const code = ch.codePointAt(0);
    width += (code >= 0x1100 && (code <= 0x115f || (code >= 0x2e80 && code <= 0xa4cf) || (code >= 0xac00 && code <= 0xd7a3) || (code >= 0xf900 && code <= 0xfaff) || (code >= 0xfe30 && code <= 0xfe4f) || (code >= 0xff00 && code <= 0xff60) || (code >= 0xffe0 && code <= 0xffe6) || (code >= 0x20000 && code <= 0x3fffd))) ? 2 : 1;
  }
  return width;
}
