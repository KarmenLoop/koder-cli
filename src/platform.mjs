import os from "node:os";

export const SHELLS = {
  powershell: { zh: "Windows PowerShell", en: "Windows PowerShell" },
  cmd: { zh: "Windows 命令提示符（CMD）", en: "Windows Command Prompt (CMD)" },
  mac: { zh: "macOS 终端", en: "macOS Terminal" },
  linux: { zh: "Linux / Ubuntu 终端", en: "Linux / Ubuntu terminal" },
};

const ALIASES = {
  powershell: "powershell", ps: "powershell", pwsh: "powershell", windows: "powershell", win: "powershell", win10: "powershell", win11: "powershell",
  cmd: "cmd", "命令提示符": "cmd",
  mac: "mac", macos: "mac", osx: "mac", darwin: "mac",
  linux: "linux", ubuntu: "linux", debian: "linux", wsl: "linux",
};

export function normalizeShell(name) {
  return ALIASES[String(name || "").trim().toLowerCase()] || null;
}

// PowerShell puts the user's own module folder in front of PSModulePath for
// everything it starts; CMD only inherits the machine-wide value.
export function isPowerShell(env = process.env) {
  const home = String(env.USERPROFILE || "").toLowerCase();
  return String(env.PSModulePath || "").split(";").some((entry) => {
    const value = entry.trim().toLowerCase();
    return value && ((home && value.startsWith(home)) || /[\\/]users[\\/]/.test(value));
  });
}

export function detectShell({ env = process.env, platform = process.platform } = {}) {
  const forced = normalizeShell(env.KODER_SHELL);
  if (forced) return forced;
  if (platform === "win32") return isPowerShell(env) ? "powershell" : "cmd";
  return platform === "darwin" ? "mac" : "linux";
}

export const isWindowsShell = (shell) => shell === "powershell" || shell === "cmd";

export function shellName(shell, lang = "zh") {
  return SHELLS[shell]?.[lang === "en" ? "en" : "zh"] || shell;
}

export function systemLabel(platform = process.platform, release = os.release()) {
  if (platform === "win32") return `Windows ${release}`;
  if (platform === "darwin") return `macOS (Darwin ${release})`;
  return `${os.type()} ${release}`;
}
