import { KoderError } from "./errors.mjs";

// Flags shared by every command. Command-specific flags are merged in by the caller.
export const GLOBAL_FLAGS = {
  help: { short: "h", type: "bool" },
  lang: { type: "string" },
  workspace: { short: "w", type: "string" },
  yes: { short: "y", type: "bool" },
  json: { type: "bool" },
  color: { type: "bool", negatable: true },
  provider: { type: "string" },
  mode: { type: "string" },
  moa: { type: "bool" },
  "moa-preset": { type: "string" },
  engine: { type: "string" },
  session: { type: "string" },
  new: { type: "bool" },
  memory: { type: "bool", negatable: true },
};

export class UsageError extends KoderError {}

function camel(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function parseFlags(argv, spec = {}) {
  const flags = { ...GLOBAL_FLAGS, ...spec };
  const byShort = new Map();
  for (const [name, def] of Object.entries(flags)) if (def.short) byShort.set(def.short, name);
  const opts = {};
  const positionals = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      positionals.push(...argv.slice(index + 1));
      break;
    }
    let name = null;
    let inline = null;
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      name = eq > 0 ? arg.slice(2, eq) : arg.slice(2);
      inline = eq > 0 ? arg.slice(eq + 1) : null;
      if (!flags[name] && name.startsWith("no-") && flags[name.slice(3)]?.negatable) {
        opts[camel(name.slice(3))] = false;
        continue;
      }
    } else if (/^-[a-zA-Z]$/.test(arg)) {
      name = byShort.get(arg.slice(1)) || arg.slice(1);
    } else {
      positionals.push(arg);
      continue;
    }
    const def = flags[name];
    if (!def) throw new UsageError("err.unknownFlag", { flag: arg });
    const key = camel(name);
    if (def.type === "bool") {
      opts[key] = inline == null ? true : !/^(0|false|no)$/i.test(inline);
      continue;
    }
    const value = inline ?? argv[index + 1];
    if (inline == null) index += 1;
    if (value == null || (inline == null && value.startsWith("-") && value !== "-")) {
      throw new UsageError("err.flagValue", { flag: arg });
    }
    if (def.type === "number") {
      const number = Number(value);
      if (!Number.isFinite(number)) throw new UsageError("err.flagValue", { flag: arg });
      opts[key] = number;
    } else if (def.multiple) {
      (opts[key] ||= []).push(value);
    } else {
      opts[key] = value;
    }
  }
  return { opts, positionals };
}
