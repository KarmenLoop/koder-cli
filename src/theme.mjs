// Colours from the website's own stylesheet (koder-website/site/assets/site.css,
// dark and light :root blocks), so the terminal matches karmenloop.com.
const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));

export const THEMES = {
  dark: {
    name: "dark",
    stage: hex("#12141c"),
    line: hex("#3a3a3a"),
    text: hex("#ededeb"),
    text2: hex("#c5c2bc"),
    text3: hex("#9c9890"),
    accent: hex("#7ca6ff"),
    ok: hex("#4cc283"),
    warn: hex("#e0a440"),
    add: hex("#7fd9a6"),
    del: hex("#f2948c"),
    heroA: hex("#12141c"),
    heroB: hex("#3d4d6c"),
    heroC: hex("#c9d8e8"),
  },
  light: {
    name: "light",
    stage: hex("#e4e1d8"),
    line: hex("#d4d0c7"),
    text: hex("#1d1c1a"),
    text2: hex("#48453f"),
    text3: hex("#6d6962"),
    accent: hex("#2455d3"),
    ok: hex("#1a7746"),
    warn: hex("#965c05"),
    add: hex("#135f38"),
    del: hex("#98251f"),
    heroA: hex("#e4e1d8"),
    heroB: hex("#6a7891"),
    heroC: hex("#ffffff"),
  },
};

let active = THEMES.dark;

// COLORFGBG is "fg;bg" (e.g. "15;0"); background 7 or 15 means a light terminal.
export function detectTheme({ env = process.env, config = {} } = {}) {
  const wanted = String(env.KODER_THEME || config.theme || "auto").toLowerCase();
  if (wanted === "dark" || wanted === "light") return wanted;
  const bg = Number(String(env.COLORFGBG || "").split(";").pop());
  return bg === 7 || bg === 15 ? "light" : "dark";
}

export function setTheme(name) {
  active = THEMES[name] || THEMES.dark;
  return active;
}

export function theme() {
  return active;
}

function mix(a, b, t) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}

// The website's headline gradient (site.css .exhibit-copy h2): text → hero-b → accent.
// The middle stop is lifted toward hero-c so block letters stay readable on the stage.
export function headline(t) {
  const p = active;
  const middle = mix(p.heroB, p.heroC, p.name === "dark" ? 0.45 : 0.1);
  const k = Math.max(0, Math.min(1, t));
  if (k < 0.46) return mix(p.text, middle, k / 0.46);
  if (k < 0.82) return mix(middle, p.accent, (k - 0.46) / 0.36);
  return p.accent;
}
