import { RESET, displayWidth, fg } from "./color.mjs";
import { theme } from "./theme.mjs";

const SEQUENCES = [
  ["\x1b[A", "up"], ["\x1bOA", "up"], ["\x1b[B", "down"], ["\x1bOB", "down"],
  ["\x1b[C", "right"], ["\x1bOC", "right"], ["\x1b[D", "left"], ["\x1bOD", "left"],
  ["\x1b[5~", "pageup"], ["\x1b[6~", "pagedown"], ["\x1b[1~", "home"], ["\x1b[4~", "end"],
  ["\x1b[H", "home"], ["\x1b[F", "end"], ["\x1bOH", "home"], ["\x1bOF", "end"],
  ["\x1b[3~", "delete"], ["\x1b[Z", "shift-tab"],
];

const CONTROL = { "\r": "enter", "\n": "enter", "\x7f": "backspace", "\b": "backspace", "\t": "tab", "\x03": "ctrl-c", "\x04": "ctrl-d", "\x15": "ctrl-u" };

// Raw terminal bytes to events. Mouse uses SGR reports: ESC [ < button ; x ; y M|m.
export function parseInput(data) {
  const text = String(data);
  const events = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const mouse = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])/.exec(rest);
    if (mouse) {
      const code = Number(mouse[1]);
      i += mouse[0].length;
      if (code & 32) continue;
      const button = code & ~28;
      events.push({ type: "mouse", button: button === 64 ? "wheelup" : button === 65 ? "wheeldown" : button === 0 ? "left" : button === 2 ? "right" : "middle", x: Number(mouse[2]), y: Number(mouse[3]), release: mouse[4] === "m" });
      continue;
    }
    const known = SEQUENCES.find(([seq]) => rest.startsWith(seq));
    if (known) {
      events.push({ type: "key", name: known[1] });
      i += known[0].length;
      continue;
    }
    if (rest[0] === "\x1b") {
      const other = /^\x1b(\[[0-9;?]*[ -/]*[@-~]|O.)/.exec(rest);
      if (other) i += other[0].length;
      else {
        events.push({ type: "key", name: "escape" });
        i += 1;
      }
      continue;
    }
    const ch = String.fromCodePoint(rest.codePointAt(0));
    i += ch.length;
    if (ch === "\n" && text[i - 2] === "\r") continue;
    if (CONTROL[ch]) events.push({ type: "key", name: CONTROL[ch] });
    else if (ch >= " ") events.push({ type: "char", ch });
  }
  return events;
}

// Full-screen session on the alternate screen; suspend() hands the terminal back for a while.
export function createScreen({ input, output, depth = "truecolor", ascii = false }) {
  const queue = [];
  const waiters = [];
  let active = false;
  let wasRaw = false;
  let wasFlowing = false;
  const push = (event) => {
    const waiter = waiters.shift();
    if (waiter) waiter(event);
    else queue.push(event);
  };
  const onData = (data) => parseInput(data).forEach(push);
  const onEnd = () => push({ type: "key", name: "eof" });
  const onResize = () => push({ type: "resize" });
  const screen = {
    depth,
    ascii,
    rows: [],
    get columns() {
      return output.columns || 80;
    },
    get height() {
      return output.rows || 24;
    },
    start() {
      if (active) return;
      active = true;
      wasRaw = Boolean(input.isRaw);
      wasFlowing = input.readableFlowing === true;
      input.setRawMode?.(true);
      input.on("data", onData);
      input.on("end", onEnd);
      input.resume?.();
      output.on?.("resize", onResize);
      output.write("\x1b[?1049h\x1b[?25l\x1b[?1000h\x1b[?1006h");
    },
    stop() {
      if (!active) return;
      active = false;
      output.write("\x1b[?1000l\x1b[?1006l\x1b[?25h\x1b[?1049l");
      input.off("data", onData);
      input.off("end", onEnd);
      output.off?.("resize", onResize);
      input.setRawMode?.(wasRaw);
      if (!wasFlowing) input.pause?.();
    },
    async suspend(fn) {
      screen.stop();
      try {
        return await fn();
      } finally {
        screen.start();
      }
    },
    draw(lines, cursor = null) {
      screen.rows = lines;
      output.write(`\x1b[H\x1b[2J${lines.join("\r\n")}${cursor ? `\x1b[${cursor.row};${cursor.col}H\x1b[?25h` : "\x1b[?25l"}`);
    },
    next() {
      return queue.length ? Promise.resolve(queue.shift()) : new Promise((resolve) => waiters.push(resolve));
    },
  };
  return screen;
}

export function clip(text, width) {
  let out = "";
  let used = 0;
  for (const ch of String(text)) {
    const w = displayWidth(ch);
    if (used + w > width) return `${out.slice(0, -1)}…`;
    out += ch;
    used += w;
  }
  return out;
}

const CLOSING = "，。、；：！？）」』》】,.;:!?)";

// Latin words move to the next line whole; CJK breaks anywhere, but never
// leaves closing punctuation at the start of a line.
export function wrap(text, width) {
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    let line = "";
    for (const ch of paragraph) {
      if (displayWidth(line + ch) <= width) {
        line += ch;
        continue;
      }
      const word = /[\x21-\x7e]/.test(ch) ? /[\x21-\x7e]+$/.exec(line)?.[0] : "";
      if (ch === " ") {
        lines.push(line);
        line = "";
      } else if (word && displayWidth(word) <= width / 2) {
        lines.push(line.slice(0, -word.length).replace(/ $/, ""));
        line = word + ch;
      } else if (CLOSING.includes(ch) && [...line].length > 1) {
        const chars = [...line];
        const last = chars.pop();
        lines.push(chars.join(""));
        line = last + ch;
      } else {
        lines.push(line);
        line = ch;
      }
    }
    lines.push(line);
  }
  return lines;
}

function painter(depth) {
  return (text, rgb, bold = false) => (depth === "none" || !rgb ? text : `${fg(rgb, depth, bold)}${text}${RESET}`);
}

// East Asian "ambiguous" characters that a CJK font in the classic Windows
// console draws two columns wide; each swap keeps the width at one.
const PLAIN = { "·": "|", "…": "~", "•": "*", "↑": "^", "↓": "v", "▸": ">", "▏": "_", "—": "-", "–": "-", "→": ">", "←": "<", "─": "-" };
const plainText = (text) => [...String(text)].map((ch) => PLAIN[ch] || ch).join("");

// Box with a title, body rows and a footer, in the website palette.
export function frame(screen, { title, body, footer }) {
  const p = theme();
  const paint = painter(screen.depth);
  const width = Math.max(40, Math.min(screen.columns - 2, 88));
  const inner = width - 4;
  const [h, v, tl, tr, bl, br] = screen.ascii ? ["-", "|", "+", "+", "+", "+"] : ["─", "│", "╭", "╮", "╰", "╯"];
  if (screen.ascii) {
    title = plainText(title);
    body = body.map(plainText);
    footer = footer && plainText(footer);
  }
  const head = clip(title, inner - 2);
  const lines = [paint(`${tl}${h} `, p.heroB) + paint(head, p.accent, true) + paint(` ${h.repeat(Math.max(0, width - displayWidth(head) - 5))}${tr}`, p.heroB)];
  const row = (content = "") => {
    const pad = Math.max(0, inner - displayWidth(content));
    return `${paint(v, p.heroB)} ${content}${" ".repeat(pad)} ${paint(v, p.heroB)}`;
  };
  lines.push(row());
  for (const item of body) lines.push(row(item));
  lines.push(row());
  if (footer) {
    lines.push(row(paint(clip(footer, inner), p.text3)));
    lines.push(row());
  }
  lines.push(paint(`${bl}${h.repeat(width - 2)}${br}`, p.heroB));
  return { lines, inner };
}

const BODY_OFFSET = 2;

// Arrow keys, Enter, Esc, digits, mouse click and wheel. Typing filters when filter is on.
export async function select(screen, { title, items, index = 0, header = [], footer, filter = false, hintTitle = "" }) {
  const p = theme();
  const paint = painter(screen.depth);
  const marker = screen.ascii ? ">" : "▸";
  let query = "";
  let current = Math.max(0, Math.min(items.length - 1, index));
  let top = 0;
  for (;;) {
    const shown = items.map((item, i) => ({ item, i })).filter(({ item }) => !query || `${item.label} ${item.value || ""} ${item.keywords || ""}`.toLowerCase().includes(query.toLowerCase()));
    if (!shown.some(({ i }) => i === current) && shown.length) current = shown[0].i;
    const inner = Math.max(40, Math.min(screen.columns - 2, 88)) - 4;
    const longest = Math.max(...items.map((item) => displayWidth(item.label)), 4) + 2;
    const labelWidth = Math.min(longest, items.some((item) => item.value) ? 30 : inner - 2);
    const hintLines = [];
    const chosen = items[current];
    if (chosen?.hint) for (const line of wrap(chosen.hint, inner)) hintLines.push(paint(line, p.text2));
    const queryLines = filter ? [paint(clip(query ? `${screen.searchLabel || "Search"}: ${query}▏` : screen.searchHint || "", inner), query ? p.accent : p.text3), ""] : [];
    let headerLines = header.flatMap((line) => wrap(line, inner).map((part) => paint(part, p.text2)));
    const headerRoom = Math.max(1, screen.height - (BODY_OFFSET + queryLines.length + (hintLines.length ? hintLines.length + 1 : 0) + 6 + Math.min(shown.length, 4)));
    if (headerLines.length > headerRoom) headerLines = [...headerLines.slice(0, headerRoom - 1), paint("…", p.text3)];
    if (headerLines.length) headerLines.push("");
    const fixed = BODY_OFFSET + headerLines.length + queryLines.length + (hintLines.length ? hintLines.length + 1 : 0) + 5;
    const room = Math.max(3, screen.height - fixed);
    const position = shown.findIndex(({ i }) => i === current);
    if (position < top) top = position;
    if (position >= top + room) top = position - room + 1;
    top = Math.max(0, Math.min(top, Math.max(0, shown.length - room)));
    const visible = shown.slice(top, top + room);
    const listStart = BODY_OFFSET + headerLines.length + queryLines.length;
    const rows = visible.map(({ item, i }) => {
      const active = i === current;
      const label = clip(item.label, labelWidth - 1);
      const head = `${active ? paint(marker, p.accent, true) : " "} ${paint(label, active ? p.accent : p.text, active)}${" ".repeat(Math.max(1, labelWidth - displayWidth(label)))}`;
      const space = Math.max(4, inner - 2 - labelWidth);
      const value = item.value ? paint(clip(item.value, space), item.tone ? p[item.tone] : active ? p.text : p.text2) : "";
      return `${head}${value}`;
    });
    if (!shown.length) rows.push(paint(screen.emptyLabel || "—", p.text3));
    const more = shown.length > room ? [paint(`${top + 1}–${Math.min(shown.length, top + room)} / ${shown.length}`, p.text3)] : [];
    const body = [...headerLines, ...queryLines, ...rows, ...more, ...(hintLines.length ? ["", ...hintLines] : [])];
    const { lines } = frame(screen, { title: hintTitle ? `${title} · ${hintTitle}` : title, body, footer });
    screen.draw(lines);
    const event = await screen.next();
    if (event.type === "resize") continue;
    if (event.type === "mouse") {
      if (event.button === "wheelup" || event.button === "wheeldown") {
        const step = event.button === "wheelup" ? -1 : 1;
        const next = shown[Math.max(0, Math.min(shown.length - 1, position + step))];
        if (next) current = next.i;
        continue;
      }
      if (event.button !== "left" || event.release) continue;
      const hit = visible[event.y - 1 - listStart];
      if (hit && !hit.item.disabled) return { index: hit.i, item: hit.item };
      continue;
    }
    const name = event.type === "key" ? event.name : null;
    const move = (step) => {
      const next = shown[Math.max(0, Math.min(shown.length - 1, position + step))];
      if (next) current = next.i;
    };
    if (name === "up" || name === "shift-tab") move(-1);
    else if (name === "down" || name === "tab") move(1);
    else if (name === "pageup") move(-room);
    else if (name === "pagedown") move(room);
    else if (name === "home") move(-shown.length);
    else if (name === "end") move(shown.length);
    else if (name === "enter") {
      if (shown.length && !items[current].disabled) return { index: current, item: items[current] };
    } else if (name === "escape") {
      if (filter && query) query = "";
      else return null;
    } else if (name === "ctrl-c" || name === "ctrl-d" || name === "eof") return { quit: true };
    else if (name === "backspace") query = query.slice(0, -1);
    else if (name === "ctrl-u") query = "";
    else if (event.type === "char") {
      if (filter) query += event.ch;
      else if (/^[1-9]$/.test(event.ch) && Number(event.ch) <= items.length) {
        const item = items[Number(event.ch) - 1];
        if (!item.disabled) return { index: Number(event.ch) - 1, item };
      } else if (event.ch === "q" || event.ch === "Q") return null;
      else if (event.ch === "k") move(-1);
      else if (event.ch === "j") move(1);
    }
  }
}

// One text field; secret fields show dots and only the last four characters.
export async function prompt(screen, { title, label, initial = "", secret = false, header = [], footer, validate }) {
  const p = theme();
  const paint = painter(screen.depth);
  let value = initial;
  let error = "";
  for (;;) {
    const inner = Math.max(40, Math.min(screen.columns - 2, 88)) - 4;
    const shownValue = secret ? (value.length > 8 ? `${"•".repeat(Math.min(24, value.length - 4))}${value.slice(-4)}` : "•".repeat(value.length)) : value;
    const headerLines = header.flatMap((line) => wrap(line, inner).map((part) => paint(part, p.text2)));
    if (headerLines.length) headerLines.push("");
    const field = `${label}  ${clip(shownValue, Math.max(8, inner - displayWidth(label) - 4))}`;
    const body = [...headerLines, paint(field, p.text, true), paint(screen.ascii ? "-".repeat(Math.min(inner, displayWidth(field) + 1)) : "─".repeat(Math.min(inner, displayWidth(field) + 1)), p.heroB)];
    if (error) body.push("", paint(error, p.warn));
    const { lines } = frame(screen, { title, body, footer });
    const row = 1 + BODY_OFFSET + headerLines.length;
    screen.draw(lines, { row, col: Math.min(screen.columns, 3 + displayWidth(field)) });
    const event = await screen.next();
    if (event.type !== "key" && event.type !== "char") continue;
    if (event.type === "char") {
      value += event.ch;
      error = "";
    } else if (event.name === "backspace") value = [...value].slice(0, -1).join("");
    else if (event.name === "ctrl-u") value = "";
    else if (event.name === "escape") return null;
    else if (event.name === "ctrl-c" || event.name === "ctrl-d" || event.name === "eof") return null;
    else if (event.name === "enter") {
      const problem = validate?.(value.trim());
      if (!problem) return value.trim();
      error = problem;
    }
  }
}

// A page of text; any key or click goes back.
export async function notice(screen, { title, lines: text, footer }) {
  const p = theme();
  const paint = painter(screen.depth);
  const inner = Math.max(40, Math.min(screen.columns - 2, 88)) - 4;
  const body = [];
  for (const line of text) {
    const value = typeof line === "string" ? { text: line } : line;
    for (const part of wrap(value.text, inner)) body.push(paint(part, value.tone ? p[value.tone] : p.text2, value.bold));
  }
  const room = Math.max(4, screen.height - 7);
  const { lines } = frame(screen, { title, body: body.length > room ? [...body.slice(0, room - 1), paint("…", p.text3)] : body, footer });
  screen.draw(lines);
  for (;;) {
    const event = await screen.next();
    if (event.type === "resize") return notice(screen, { title, lines: text, footer });
    if (event.type === "key" || event.type === "char" || (event.type === "mouse" && event.button === "left" && !event.release)) return event;
  }
}
