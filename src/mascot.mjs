// KARMEN 折光体 for the terminal. The surface is the website's own analytic
// fold — avatarProfile('karmen:hero') and buildAvatarMesh in
// koder-website/site/widget/karmen-avatar.js (sha256 cc513338…) — with the hero
// scene's shear waves, rotation and studio glass from hero-refractive-scene.js
// (sha256 40ed4b8e…). Those files are locked; this is a port, not a redraw.

import { theme } from "./theme.mjs";

const TAU = Math.PI * 2;
export const OFFICIAL_ROTATION = [-0.22, 0.24, -0.12];
// The hero palette of the active website theme (dark: #12141c/#3d4d6c/#c9d8e8).
const stage = () => ({ a: theme().heroA, b: theme().heroB, c: theme().heroC });

function heroProfile() {
  let hash = 2166136261;
  for (const char of "karmen:hero") hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return { lobes: 3, softness: 0.068, phase: (hash % 6283) / 1000, ridge: 0.93 + ((hash >>> 16) % 100) / 700 };
}
const PROFILE = heroProfile();

function fold(t, s) {
  const P = PROFILE;
  const phase = P.phase * 0.16;
  const wave = P.lobes * t + phase;
  const r = 0.455 + P.softness * Math.cos(wave) + 0.014 * Math.sin(t * 2 + phase);
  const twist = t + 0.22 * Math.sin(t * 2 + phase);
  const width = 0.169 * P.ridge * (1 + 0.1 * Math.sin(t * 3 + phase));
  const a = width * Math.cos(s);
  const b = 0.139 * (1 + 0.08 * Math.cos(t * 2)) * Math.sin(s);
  const radial = a * Math.cos(twist) - b * Math.sin(twist);
  return [(r + radial) * Math.cos(t), (r + radial) * Math.sin(t), 0.115 * Math.sin(t * 2 + phase) + 0.045 * Math.cos(wave) + a * Math.sin(twist) + b * Math.cos(twist)];
}

function shear([x, y, z], time, wave = 0.04, breath = 0.022) {
  const sA = Math.sin(x * 3.1 + y * 1.7 + z * 0.9 - time * 0.65);
  const sB = Math.sin(-x * 1.8 + y * 3.4 + z * 1.2 + time * 0.47 + 1.4);
  return [x + wave * 0.32 * sA + breath * 0.2 * sB, y + breath * 0.16 * sA - wave * 0.26 * sB, z + wave * 0.7 * sA + (wave * 0.3 - breath * 0.18) * sB];
}

function turn([x, y, z], [a, b, c]) {
  [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
  return [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c), z];
}

const unit = ([x, y, z]) => {
  const d = Math.hypot(x, y, z) || 1;
  return [x / d, y / d, z / d];
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sq = (x) => x * x;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function place(t, s, rotation, time) {
  return turn(shear(fold(t, s), time), rotation);
}

function normalAt(t, s, rotation, time) {
  const e = 0.002;
  const t1 = place(t + e, s, rotation, time);
  const t0 = place(t - e, s, rotation, time);
  const s1 = place(t, s + e, rotation, time);
  const s0 = place(t, s - e, rotation, time);
  const ax = t1[0] - t0[0];
  const ay = t1[1] - t0[1];
  const az = t1[2] - t0[2];
  const bx = s1[0] - s0[0];
  const by = s1[1] - s0[1];
  const bz = s1[2] - s0[2];
  return unit([ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx]);
}

const LIGHT = unit([-0.48, 0.72, 1]);
const KEY = unit([0.38, -0.25, 1]);

function softboxes(rx, ry) {
  const a = Math.exp(-sq((rx + 0.36) / 0.09)) * Math.exp(-sq((ry - 0.18) / 0.72));
  const b = Math.exp(-sq((rx - 0.6) / 0.13)) * Math.exp(-sq((ry + 0.4) / 0.55));
  const crown = Math.exp(-sq((ry - 0.68) / 0.16)) * Math.exp(-sq((rx + 0.12) / 0.65));
  const panel = Math.exp(-(((rx + 0.26) / 0.52) ** 4) - ((ry - 0.3) / 0.44) ** 4);
  return { a, b, sum: a * 0.58 + b * 0.38 + crown * 0.3 + panel * 0.28 };
}

// Studio glass from the hero fragment shader. The stage field there is almost
// flat colorA; a terminal has no backdrop to transmit, so the body is lifted
// toward colorB to stay visible. A small per-channel shift of the reflected ray
// stands in for the shader's spectral sampling and gives the coloured fringes.
export function shade(n, p, thickness, palette = stage()) {
  const { a: A, b: B, c: C } = palette;
  const view = unit([-p[0], -p[1], 3 - p[2]]);
  if (dot(n, view) < 0) n = n.map((v) => -v);
  const facing = clamp01(dot(n, view));
  const fresnel = 0.031 + 0.969 * (1 - facing) ** 5;
  const halfway = unit([view[0] + LIGHT[0], view[1] + LIGHT[1], view[2] + LIGHT[2]]);
  const highlight = Math.max(dot(n, halfway), 0) ** 48 * 0.34 + Math.max(dot(n, KEY), 0) ** 110 * 0.22;
  const k = clamp01(n[0] * 0.5 + 0.5);
  const d = 2 * dot(view, n);
  const ray = [d * n[0] - view[0], d * n[1] - view[1]];
  // On the light stage the glass reads through its darker blue-grey, as on the site.
  const lift = theme().name === "light" ? 0.7 : 0.28;
  const body = [0.24, 0.16, 0.11].map((absorb, i) => ((A[i] * (1 - lift) + B[i] * lift) / 255) * Math.exp(-absorb * thickness));
  return [0, 1, 2].map((i) => {
    const environment = (C[i] + (B[i] - C[i]) * k) / 255;
    let glass = body[i] + (environment - body[i]) * (0.035 + fresnel * 0.16);
    glass += (A[i] / 255) * highlight + ((A[i] + B[i]) / 510) * fresnel * 0.22 + (A[i] / 255) * (1 - facing) * 0.025;
    const shift = (i - 1) * 0.06;
    const box = softboxes(ray[0] + n[0] * shift, ray[1] + n[1] * shift);
    glass += (C[i] / 255) * (box.sum * 1.35 + fresnel * 0.5);
    glass += ((A[i] + (B[i] - A[i]) * 0.22) / 255) * box.b * thickness * 0.18;
    glass += highlight * 0.7;
    return Math.round(clamp01(glass) ** 0.92 * 255);
  });
}

// Returns width × height pixels: { rgb, alpha } with alpha = covered fraction.
// The waves and rotation move the silhouette off centre; fit its projected bounds.
function bounds(rotation, time) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 90; i += 1) {
    for (let j = 0; j < 12; j += 1) {
      const p = place((i / 90) * TAU, (j / 12) * TAU, rotation, time);
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }
  }
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, half: Math.max(maxX - minX, maxY - minY) / 2 };
}

export function renderMascot({ width = 36, height = 36, rotation = OFFICIAL_ROTATION, time = 0, samples = 2, margin = 0.04 } = {}) {
  const W = width * samples;
  const H = height * samples;
  const front = new Float64Array(W * H).fill(-Infinity);
  const back = new Float64Array(W * H).fill(Infinity);
  const param = new Float64Array(W * H * 2);
  const fit = bounds(rotation, time);
  const scale = Math.min(W, H) / (2 * fit.half * (1 + margin));
  const nt = Math.ceil(W * 3.6);
  const ns = Math.ceil(W * 0.9);
  // Same maths as place(), with every t-only and rotation-only term hoisted.
  const P = PROFILE;
  const phase = P.phase * 0.16;
  const cosS = new Float64Array(ns);
  const sinS = new Float64Array(ns);
  for (let j = 0; j < ns; j += 1) {
    cosS[j] = Math.cos((j / ns) * TAU);
    sinS[j] = Math.sin((j / ns) * TAU);
  }
  const [ra, rb, rc] = rotation.map((angle) => [Math.cos(angle), Math.sin(angle)]);
  const wave = 0.04;
  const breath = 0.022;
  for (let i = 0; i < nt; i += 1) {
    const t = (i / nt) * TAU;
    const lobe = P.lobes * t + phase;
    const r = 0.455 + P.softness * Math.cos(lobe) + 0.014 * Math.sin(t * 2 + phase);
    const twist = t + 0.22 * Math.sin(t * 2 + phase);
    const ct = Math.cos(twist);
    const st = Math.sin(twist);
    const widthT = 0.169 * P.ridge * (1 + 0.1 * Math.sin(t * 3 + phase));
    const tube = 0.139 * (1 + 0.08 * Math.cos(t * 2));
    const zc = 0.115 * Math.sin(t * 2 + phase) + 0.045 * Math.cos(lobe);
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    for (let j = 0; j < ns; j += 1) {
      const a = widthT * cosS[j];
      const b = tube * sinS[j];
      const radius = r + a * ct - b * st;
      let x0 = radius * cosT;
      let y0 = radius * sinT;
      let z0 = zc + a * st + b * ct;
      const sA = Math.sin(x0 * 3.1 + y0 * 1.7 + z0 * 0.9 - time * 0.65);
      const sB = Math.sin(-x0 * 1.8 + y0 * 3.4 + z0 * 1.2 + time * 0.47 + 1.4);
      x0 += wave * 0.32 * sA + breath * 0.2 * sB;
      y0 += breath * 0.16 * sA - wave * 0.26 * sB;
      z0 += wave * 0.7 * sA + (wave * 0.3 - breath * 0.18) * sB;
      const y1 = y0 * ra[0] - z0 * ra[1];
      const z1 = y0 * ra[1] + z0 * ra[0];
      const x2 = x0 * rb[0] + z1 * rb[1];
      const z = -x0 * rb[1] + z1 * rb[0];
      const px = x2 * rc[0] - y1 * rc[1];
      const py = x2 * rc[1] + y1 * rc[0];
      const x = Math.floor(W / 2 + (px - fit.cx) * scale);
      const y = Math.floor(H / 2 - (py - fit.cy) * scale);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const k = y * W + x;
      if (z > front[k]) {
        front[k] = z;
        param[k * 2] = t;
        param[k * 2 + 1] = (j / ns) * TAU;
      }
      if (z < back[k]) back[k] = z;
    }
  }
  // One shading sample per pixel (the front-most covered sub-sample); the
  // sub-samples only decide coverage, which is what anti-aliases the outline.
  const pixels = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let hits = 0;
      let best = -1;
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const k = (y * samples + sy) * W + x * samples + sx;
          if (front[k] === -Infinity) continue;
          hits += 1;
          if (best < 0 || front[k] > front[best]) best = k;
        }
      }
      if (!hits) {
        pixels.push({ rgb: null, alpha: 0 });
        continue;
      }
      const t = param[best * 2];
      const s = param[best * 2 + 1];
      const rgb = shade(normalAt(t, s, rotation, time), place(t, s, rotation, time), Math.max(0.02, Math.min(0.65, front[best] - back[best])));
      pixels.push({ rgb, alpha: hits / (samples * samples) });
    }
  }
  return { width, height, pixels };
}

// Bump when geometry or shading changes so cached frames are not reused.
export const MASCOT_VERSION = 2;

export function packImage(image) {
  const data = image.pixels.map((p) => (p.rgb ? [...p.rgb, Math.round(p.alpha * 100)] : 0));
  return { v: MASCOT_VERSION, width: image.width, height: image.height, data };
}

export function unpackImage(value) {
  if (value?.v !== MASCOT_VERSION || !Array.isArray(value.data) || value.data.length !== value.width * value.height) return null;
  return { width: value.width, height: value.height, pixels: value.data.map((p) => (Array.isArray(p) ? { rgb: p.slice(0, 3), alpha: p[3] / 100 } : { rgb: null, alpha: 0 })) };
}

const BLOCK_RAMP = " .:-=+*#%@";

// Two pixels per cell with ▀/▄: square pixels, truecolor or 256 colours.
// With glyphs "ramp" (or no colour) it falls back to a luminance ramp like the
// classic donut.c, still coloured when the terminal allows it.
export function mascotLines(image, { depth = "truecolor", fg, bg, reset = "\x1b[0m", glyphs = "blocks" }) {
  const { width, height, pixels } = image;
  const visible = (p) => p.alpha >= 0.5;
  const tone = (p) => p.rgb.map((v) => Math.round(v * Math.min(1, 0.45 + p.alpha * 0.6)));
  const ramp = glyphs === "ramp" || depth === "none" || depth === "16";
  const invert = depth === "none" && theme().name === "light";
  const lines = [];
  for (let row = 0; row < height; row += 2) {
    let out = "";
    let active = "";
    for (let x = 0; x < width; x += 1) {
      const top = pixels[row * width + x];
      const bottom = row + 1 < height ? pixels[(row + 1) * width + x] : { alpha: 0 };
      let ch = " ";
      let code = "";
      if (ramp) {
        const lit = [top, bottom].filter(visible);
        if (lit.length) {
          const raw = lit.reduce((sum, p) => sum + (p.rgb[0] * 0.3 + p.rgb[1] * 0.55 + p.rgb[2] * 0.15) / 255, 0) / lit.length;
          const level = invert ? 1 - raw : raw;
          ch = BLOCK_RAMP[Math.max(1, Math.min(BLOCK_RAMP.length - 1, Math.round(level * (BLOCK_RAMP.length - 1) * 1.15)))];
          if (depth !== "none") code = fg(tone(lit.reduce((a, b) => (a.rgb[0] + a.rgb[1] > b.rgb[0] + b.rgb[1] ? a : b))), depth);
        }
      } else if (visible(top) && visible(bottom)) {
        ch = "▀";
        code = fg(tone(top), depth) + bg(tone(bottom), depth);
      } else if (visible(top)) {
        ch = "▀";
        code = fg(tone(top), depth);
      } else if (visible(bottom)) {
        ch = "▄";
        code = fg(tone(bottom), depth);
      }
      if (code !== active) {
        if (active) out += reset;
        out += code;
        active = code;
      }
      out += ch;
    }
    if (active) out += reset;
    lines.push(out);
  }
  return lines;
}
