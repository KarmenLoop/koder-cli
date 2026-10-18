import { spawn, spawnSync } from "node:child_process";
import readline from "node:readline/promises";
import { askLine } from "../ask.mjs";
import { saveConfig } from "../config.mjs";
import { KoderError } from "../errors.mjs";
import { PLATFORMS, loadPlatform } from "../gateway/registry.mjs";
import { loadGateway, loadState, pidAlive } from "../gateway/store.mjs";
import { createT } from "../i18n.mjs";
import { activeModelName, saveModel } from "../models.mjs";
import { isEnvName } from "../provider.mjs";
import { detectShell, isWindowsShell, shellName } from "../platform.mjs";
import { HERMES_ENGINE } from "../session.mjs";
import { detectTheme, setTheme, theme } from "../theme.mjs";
import { createScreen, notice, prompt, select } from "../tui.mjs";
import { useAscii } from "./banner.mjs";
import { SNIPPETS, snippetFor } from "./editor.mjs";
import { which } from "./engine.mjs";
import { presetRecord, presets } from "./model.mjs";

const FIRST = ["deepseek", "kimi", "qwen", "zhipu", "doubao", "minimax-cn", "chatgpt", "claude", "gemini", "openrouter", "siliconflow", "local", "kilo-free", "custom"];
const KEY_NAMES = { chatgpt: "OPENAI_API_KEY", claude: "ANTHROPIC_API_KEY", kimi: "MOONSHOT_API_KEY", qwen: "DASHSCOPE_API_KEY", gemini: "GEMINI_API_KEY" };

const COPY = {
  zh: {
    title: "Koder 设置",
    footer: "↑↓ 选择 · 回车确定 · 鼠标点一下也行 · Esc 返回",
    inputFooter: "回车保存 · Esc 返回 · Ctrl+U 清空重输",
    mainFooter: "↑↓ 选择 · 回车确定 · 鼠标点一下也行 · 数字直达 · Esc 退出",
    anyKey: "按任意键或点一下返回",
    search: "筛选",
    searchHint: "直接打字就能筛选，比如输入 deep；Esc 清空",
    empty: "没有匹配的项，按 Esc 清空筛选",
    intro: (shell) => `你在用 ${shell}。每一项改完都自动保存，随时可以回来改。`,
    items: {
      lang: ["语言 Language", "整个 Koder 的界面语言，切过去马上生效。Switch Koder between Chinese and English."],
      model: ["模型", "Koder 的大脑。选服务商 → 选型号 → 粘贴密钥，三步就好。手上没有密钥？选「本地兼容接口」用本机的 Ollama，或者「Kilo 匿名免费」。"],
      theme: ["配色", "官网同款的深色和浅色两套。终端是白底就选浅色，不然字会淡得像没睡醒。"],
      glyphs: ["开屏样式", "Windows 老控制台会把方块字画成两格宽，开屏就乱成一团，这时选「纯字符」。Windows Terminal、macOS 和 Linux 选彩色折光体。"],
      anim: ["开屏动画", "进门时那 0.2 秒的旋转定格。嫌晃眼就关掉，什么功能都不受影响。"],
      engine: ["引擎", "真正干活的智能体。默认是内置的 Koder 内核，开箱即用；也可以换成 Python 版 Hermes。"],
      gateway: ["聊天软件", "在飞书、企业微信、微信、钉钉、Telegram、Slack、Discord、WhatsApp 里给 Koder 派活。选一个平台，照提示把凭据粘进来就行。"],
      editor: ["编辑器", "给 Zed、Neovim、Emacs 生成接入配置，一键复制到剪贴板，再粘进编辑器的配置文件。"],
      learn: ["互动教程", (shell) => `17 课，按 ${shell} 的写法来讲，在练习场里边学边动手，不花一分钱。`],
      doctor: ["体检", "检查 Node.js、Git、模型、颜色和启动速度。哪里不对劲，先来这里看看。"],
      done: ["完成", "所有设置都已经保存好了。之后在终端里输入 koder 就能开始干活。"],
    },
    zh: "中文", en: "English",
    noModel: "还没配置，先选这里",
    auto: (now) => `自动（现在是${now}）`, dark: "深色", light: "浅色",
    blocks: "彩色折光体", ascii: "纯字符",
    on: "开", off: "关",
    koder: "Koder 内核（内置）",
    gwNone: "还没配置", gwCount: (n, names) => `已保存 ${n} 个：${names}`,
    editors: "Zed · Neovim · Emacs",
    learnDone: "已毕业", learnAt: (n) => `学到第 ${n} 课`, learnNew: "还没开始",
    langTitle: "选择语言 · Language",
    themeTitle: "选择配色",
    themeAuto: "自动", themeAutoHint: "按终端背景自动判断，判断不了就用深色。",
    themeDarkHint: "官网深色：舞台 #12141c，正文 #ededeb，强调蓝 #7ca6ff。",
    themeLightHint: "官网浅色：舞台 #e4e1d8，正文 #1d1c1a，强调蓝 #2455d3。适合白底终端。",
    glyphTitle: "选择开屏样式",
    glyphAuto: "自动", glyphAutoHint: "Windows 老控制台用纯字符，其他终端用彩色折光体。",
    glyphBlocksHint: "半格方块拼出来的彩色折光体，需要终端把方块字画成一格宽。",
    glyphAsciiHint: "只用 + - | 和字母符号，任何终端都不会乱，代价是没那么好看。",
    animTitle: "开屏动画",
    animOnHint: "进门转一下再定格，约 0.2 秒。", animOffHint: "直接显示定格画面。",
    modelTitle: "选择模型服务商",
    modelHeader: "国内用户一般选 DeepSeek、Kimi、通义千问、智谱；有海外账号可以选 ChatGPT、Claude、Gemini。",
    region: { cn: "国内", global: "海外", hub: "聚合平台", local: "本机/自定义", free: "免费" },
    pickModel: "选择型号", recommended: "推荐", typeModel: "自己输入型号…",
    modelName: "型号", modelNameHint: "填服务方文档里写的型号名。",
    localHint: "先在本机启动 Ollama（ollama.com 下载）或 LM Studio，再填它加载的模型名，比如 qwen3:8b。",
    required: "这一项不能空着。",
    baseUrl: "接口地址", baseUrlHint: "服务方给你的 OpenAI 或 Anthropic 兼容地址，例如 https://api.example.com/v1", badUrl: "地址要以 http:// 或 https:// 开头。",
    protocolTitle: "接口协议", openai: "OpenAI 兼容", anthropic: "Anthropic 兼容",
    keyTitle: "API 密钥",
    keySteps: "怎么拿到密钥：",
    keyPaste: "粘贴密钥（推荐，最简单）", keyPasteHint: "密钥只保存在这台电脑上，屏幕上只显示末四位，也不会进命令历史。",
    keyEnv: "从环境变量读取", keyEnvHint: "适合服务器和 CI：配置里只记变量名，密钥放在系统环境变量里。",
    keyOpen: "打开网页去拿密钥", keyOpenHint: "用默认浏览器打开服务方的密钥页面，拿到以后回来选「粘贴密钥」。",
    back: "返回",
    keyLabel: "密钥", keyShort: "这串太短了，不像一把完整的密钥，再检查一下？",
    paste: { windows: "粘贴：Windows Terminal 里按 Ctrl+V；老式控制台窗口点鼠标右键。", mac: "粘贴：按 ⌘V。", linux: "粘贴：按 Ctrl+Shift+V，或者鼠标中键。" },
    envLabel: "变量名", badEnv: "变量名只能用字母、数字和下划线，并且不能以数字开头。",
    envHow: {
      powershell: (n) => `设置这个变量：永久保存用 setx ${n} "你的密钥"（之后新开的窗口才生效）；只在当前窗口用 $env:${n} = "你的密钥"`,
      cmd: (n) => `设置这个变量：永久保存用 setx ${n} "你的密钥"（之后新开的窗口才生效）；只在当前窗口用 set "${n}=你的密钥"`,
      mac: (n) => `设置这个变量：echo 'export ${n}=你的密钥' >> ~/.zshrc，然后重新打开终端`,
      linux: (n) => `设置这个变量：echo 'export ${n}=你的密钥' >> ~/.bashrc，然后重新打开终端`,
    },
    envMissing: (n) => `注意：当前窗口里还读不到 ${n}。按上面的方法设置好，重新打开终端再用。`,
    openFailed: (url) => `没能自动打开浏览器，请手动复制这个地址：${url}`,
    opened: "已经在浏览器里打开了。拿到密钥以后回来选「粘贴密钥」。",
    savedTitle: "模型已保存",
    saved: (name, model) => `${name} · ${model}`,
    savedKey: (tail) => `密钥只保存在本机（末四位 ${tail}）。`,
    savedEnv: (n) => `密钥从环境变量 ${n} 读取。`,
    savedLocal: "本机模型不需要密钥。记得先把 Ollama 或 LM Studio 打开。",
    noKernel: "找不到 Koder 内核，模型预设读不出来。可以运行 koder doctor 看看原因。",
    engineTitle: "选择引擎",
    engineKoderHint: "内置的 Node 版 Koder 内核，不用另装任何东西。",
    engineHermesHint: "Nous Research 的 Python 版 Hermes，通过 ACP 接入，批准请求仍然由 Koder 来问你。",
    current: "正在用", installed: "已安装", notInstalled: "还没安装",
    hermesWindows: "Hermes 的安装脚本需要 bash，在 Windows 上请到 WSL（适用于 Linux 的 Windows 子系统）里安装 Koder 和 Hermes。内置的 Koder 内核在 Windows 上可以直接用。",
    installNow: "现在安装 Hermes", installHint: "会下载 Hermes 官方安装脚本（固定到核对过的版本）并运行，需要联网。",
    gwTitle: "接入聊天软件", gwOn: "已连接", gwPaused: "已暂停", gwOff: "未配置",
    gwStart: "在后台启动机器人", gwStartHint: "接好平台以后，让机器人在后台收消息；关掉终端也不会停。",
    editorTitle: "编辑器配置",
    copy: "复制到剪贴板", copyHint: "复制以后打开上面写的配置文件，粘贴进去保存。",
    copied: (file) => `已复制。打开 ${file}，粘贴进去保存就好。`,
    copyFailed: "没找到剪贴板工具（Linux 需要 wl-copy、xclip 或 xsel）。可以退出后运行 koder editor 手动复制。",
    pressEnter: "按回车回到设置 › ",
    bye: "设置已保存。输入 koder 开始对话，koder setup 随时回来改。",
    nonInteractive: "koder setup 需要在终端窗口里打开。也可以直接用命令：koder lang en、koder theme light、koder model set --preset deepseek --key-env DEEPSEEK_API_KEY",
  },
  en: {
    title: "Koder setup",
    footer: "↑↓ move · Enter select · click works too · Esc back",
    inputFooter: "Enter saves · Esc back · Ctrl+U clears",
    mainFooter: "↑↓ move · Enter select · click works too · digits jump · Esc quit",
    anyKey: "Press any key or click to go back",
    search: "Filter",
    searchHint: "Type to filter, e.g. deep; Esc clears",
    empty: "Nothing matches; Esc clears the filter",
    intro: (shell) => `You're on ${shell}. Every change is saved right away; come back any time.`,
    items: {
      lang: ["Language 语言", "The language of all of Koder; takes effect at once. 切换中文或英文。"],
      model: ["Model", "Koder's brain. Provider, then model, then paste your key. No key? Pick the local endpoint for Ollama on this machine, or Kilo's anonymous free tier."],
      theme: ["Colours", "The website's dark and light palettes. White terminal background? Pick light, or the text will look half asleep."],
      glyphs: ["Banner style", "The classic Windows console draws block characters two columns wide and the banner falls apart; pick plain characters there. Windows Terminal, macOS and Linux get the colour refractor."],
      anim: ["Banner animation", "The 0.2-second spin when Koder starts. Turn it off if it bothers you; nothing else changes."],
      engine: ["Engine", "The agent doing the work: the built-in Koder kernel by default, or Python Hermes."],
      gateway: ["Chat apps", "Send Koder tasks from Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord or WhatsApp. Pick one and paste its credentials."],
      editor: ["Editors", "Generate the Zed, Neovim or Emacs config, copy it in one go, paste it into the editor's settings."],
      learn: ["Tutorial", (shell) => `17 lessons written for ${shell}, hands-on in a practice project, free of charge.`],
      doctor: ["Check-up", "Checks Node.js, Git, the model, colours and startup time. Start here when something feels off."],
      done: ["Done", "Everything is saved. Type koder in a terminal to get to work."],
    },
    zh: "中文", en: "English",
    noModel: "not set yet, start here",
    auto: (now) => `auto (${now} now)`, dark: "dark", light: "light",
    blocks: "colour refractor", ascii: "plain characters",
    on: "on", off: "off",
    koder: "Koder kernel (built in)",
    gwNone: "none yet", gwCount: (n, names) => `${n} saved: ${names}`,
    editors: "Zed · Neovim · Emacs",
    learnDone: "graduated", learnAt: (n) => `at lesson ${n}`, learnNew: "not started",
    langTitle: "Language · 语言",
    themeTitle: "Colours",
    themeAuto: "auto", themeAutoHint: "Follows the terminal background; dark when unsure.",
    themeDarkHint: "Website dark: stage #12141c, text #ededeb, accent #7ca6ff.",
    themeLightHint: "Website light: stage #e4e1d8, text #1d1c1a, accent #2455d3. For white terminals.",
    glyphTitle: "Banner style",
    glyphAuto: "auto", glyphAutoHint: "Plain characters in the classic Windows console, the colour refractor elsewhere.",
    glyphBlocksHint: "A refractor drawn with half blocks; the terminal must draw them one column wide.",
    glyphAsciiHint: "Only + - | and letters. Never breaks, less pretty.",
    animTitle: "Banner animation",
    animOnHint: "A short spin before it settles, about 0.2 s.", animOffHint: "Show the settled frame straight away.",
    modelTitle: "Model provider",
    modelHeader: "In China most people pick DeepSeek, Kimi, Qwen or Zhipu; with overseas accounts, ChatGPT, Claude or Gemini.",
    region: { cn: "China", global: "global", hub: "hub", local: "local/custom", free: "free" },
    pickModel: "Model", recommended: "recommended", typeModel: "Type another model…",
    modelName: "Model", modelNameHint: "The model name from the provider's docs.",
    localHint: "Start Ollama (ollama.com) or LM Studio first, then enter the model it serves, e.g. qwen3:8b.",
    required: "This can't be empty.",
    baseUrl: "Endpoint", baseUrlHint: "The OpenAI- or Anthropic-compatible URL from your provider, e.g. https://api.example.com/v1", badUrl: "It must start with http:// or https://.",
    protocolTitle: "Protocol", openai: "OpenAI compatible", anthropic: "Anthropic compatible",
    keyTitle: "API key",
    keySteps: "Getting a key (provider's steps):",
    keyPaste: "Paste the key (easiest)", keyPasteHint: "Stored only on this computer; the screen shows the last four characters and it never enters your shell history.",
    keyEnv: "Read it from an environment variable", keyEnvHint: "For servers and CI: only the variable name is saved.",
    keyOpen: "Open the key page in a browser", keyOpenHint: "Opens the provider's key page; come back and paste the key.",
    back: "Back",
    keyLabel: "Key", keyShort: "That's too short to be a whole key. Check it again?",
    paste: { windows: "Paste: Ctrl+V in Windows Terminal; right-click in the classic console.", mac: "Paste: ⌘V.", linux: "Paste: Ctrl+Shift+V or the middle mouse button." },
    envLabel: "Variable", badEnv: "Letters, digits and underscores only, not starting with a digit.",
    envHow: {
      powershell: (n) => `Set it: setx ${n} "your-key" to keep it (new windows only), or $env:${n} = "your-key" for this window`,
      cmd: (n) => `Set it: setx ${n} "your-key" to keep it (new windows only), or set "${n}=your-key" for this window`,
      mac: (n) => `Set it: echo 'export ${n}=your-key' >> ~/.zshrc, then open a new terminal`,
      linux: (n) => `Set it: echo 'export ${n}=your-key' >> ~/.bashrc, then open a new terminal`,
    },
    envMissing: (n) => `Note: this window can't see ${n} yet. Set it as above and open a new terminal.`,
    openFailed: (url) => `Couldn't open a browser; copy this address: ${url}`,
    opened: "Opened in your browser. Come back and choose Paste the key.",
    savedTitle: "Model saved",
    saved: (name, model) => `${name} · ${model}`,
    savedKey: (tail) => `The key stays on this computer (ends in ${tail}).`,
    savedEnv: (n) => `The key is read from ${n}.`,
    savedLocal: "Local models need no key. Make sure Ollama or LM Studio is running.",
    noKernel: "The Koder kernel wasn't found, so presets can't be read. Run koder doctor for details.",
    engineTitle: "Engine",
    engineKoderHint: "The built-in Node Koder kernel. Nothing else to install.",
    engineHermesHint: "Nous Research's Python Hermes over ACP; approvals still go through Koder.",
    current: "in use", installed: "installed", notInstalled: "not installed",
    hermesWindows: "The Hermes installer needs bash. On Windows, install Koder and Hermes inside WSL. The built-in Koder kernel works on Windows as is.",
    installNow: "Install Hermes now", installHint: "Downloads and runs the official Hermes installer pinned to the checked version; needs the internet.",
    gwTitle: "Chat apps", gwOn: "connected", gwPaused: "paused", gwOff: "not connected",
    gwStart: "Start the bots in the background", gwStartHint: "Once a platform is connected, keep receiving messages even after the terminal closes.",
    editorTitle: "Editor config",
    copy: "Copy to clipboard", copyHint: "Then open the file shown above, paste and save.",
    copied: (file) => `Copied. Open ${file}, paste and save.`,
    copyFailed: "No clipboard tool found (Linux needs wl-copy, xclip or xsel). Quit and run koder editor to copy by hand.",
    pressEnter: "Press Enter to return to setup › ",
    bye: "Settings saved. Type koder to start; koder setup brings you back here.",
    nonInteractive: "koder setup needs a terminal window. Or use commands: koder lang en, koder theme light, koder model set --preset deepseek --key-env DEEPSEEK_API_KEY",
  },
};

const copyFor = (ctx) => COPY[ctx.lang === "en" ? "en" : "zh"];
const pick = (value, ...args) => (typeof value === "function" ? value(...args) : value);
const family = (shell) => (isWindowsShell(shell) ? "windows" : shell);

export function openUrl(ctx, url) {
  if (ctx.io.openUrl) return ctx.io.openUrl(url);
  if (!/^https:\/\/[^\s"'<>|&^]+$/.test(url)) return false;
  const platform = ctx.io.platform || process.platform;
  const [command, args] = platform === "win32" ? ["explorer.exe", [url]] : platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  try {
    const child = spawn(command, args, { detached: true, stdio: "ignore", windowsHide: true });
    child.on("error", () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}

export function copyText(ctx, text) {
  if (ctx.io.clipboard) return ctx.io.clipboard(text);
  const platform = ctx.io.platform || process.platform;
  const tools = platform === "win32" ? [["clip", []]] : platform === "darwin" ? [["pbcopy", []]] : [["wl-copy", []], ["xclip", ["-selection", "clipboard"]], ["xsel", ["--clipboard", "--input"]]];
  for (const [command, args] of tools) {
    const result = spawnSync(command, args, { input: text, stdio: ["pipe", "ignore", "ignore"], windowsHide: true });
    if (result.status === 0) return command;
  }
  return null;
}

function modelValue(ctx, c) {
  try {
    const found = ctx.findProvider();
    if (found) return { value: c.saved(found.record.name, found.record.model), tone: "ok" };
  } catch (error) {
    return { value: error instanceof KoderError ? ctx.t(error.key, error.vars) : error.message, tone: "warn" };
  }
  return { value: c.noModel, tone: "warn" };
}

async function menuItems(ctx, c, shell) {
  const config = ctx.config;
  const gateway = loadGateway(ctx.env);
  const connected = [];
  for (const id of PLATFORMS) if (gateway.platforms?.[id]) connected.push((await loadPlatform(id)).meta.name[ctx.lang === "en" ? "en" : "zh"]);
  const tutorial = config.tutorial || {};
  const values = {
    lang: { value: ctx.lang === "en" ? c.en : c.zh },
    model: modelValue(ctx, c),
    theme: { value: config.theme === "dark" ? c.dark : config.theme === "light" ? c.light : c.auto(theme().name === "light" ? c.light : c.dark) },
    glyphs: { value: config.glyphs === "ascii" ? c.ascii : config.glyphs === "blocks" ? c.blocks : c.auto(useAscii(ctx) ? c.ascii : c.blocks) },
    anim: { value: config.anim === false ? c.off : c.on },
    engine: { value: (config.engine || "koder") === "koder" ? c.koder : config.engine },
    gateway: { value: connected.length ? c.gwCount(connected.length, connected.join("、")) : c.gwNone, tone: connected.length ? "ok" : undefined },
    editor: { value: c.editors },
    learn: { value: tutorial.done ? c.learnDone : tutorial.lesson > 1 ? c.learnAt(tutorial.lesson) : c.learnNew },
    doctor: { value: "" },
    done: { value: "" },
  };
  return Object.entries(c.items).map(([id, [label, hint]]) => ({ id, label, hint: pick(hint, shellName(shell, ctx.lang)), ...values[id] }));
}

async function waitEnter(ctx, c) {
  const rl = readline.createInterface({ input: ctx.stdin, output: ctx.stdout, terminal: true });
  try {
    await askLine(rl, `\n${c.pressEnter}`);
  } finally {
    rl.close();
  }
}

// Leaves the full screen, runs another koder command in the normal terminal, then comes back.
async function outside(ctx, screen, c, argv) {
  await screen.suspend(async () => {
    ctx.stdout.write("\n");
    try {
      await ctx.dispatch(argv, { prompter: null });
    } catch (error) {
      ctx.stdout.write(`${error instanceof KoderError ? ctx.t(error.key, error.vars) : error.message}\n`);
    }
    await waitEnter(ctx, c);
  });
}

async function chooseLang(ctx, screen, c) {
  const picked = await select(screen, { title: c.langTitle, items: [{ label: "中文", id: "zh" }, { label: "English", id: "en" }], index: ctx.lang === "en" ? 1 : 0, footer: c.footer });
  if (!picked || picked.quit) return picked;
  ctx.lang = picked.item.id;
  ctx.t = createT(ctx.lang);
  ctx.config.lang = ctx.lang;
  saveConfig({ lang: ctx.lang }, ctx.env);
  return null;
}

async function chooseTheme(ctx, screen, c) {
  const items = [{ label: c.themeAuto, id: "auto", hint: c.themeAutoHint }, { label: c.dark, id: "dark", hint: c.themeDarkHint }, { label: c.light, id: "light", hint: c.themeLightHint }];
  const picked = await select(screen, { title: c.themeTitle, items, index: Math.max(0, items.findIndex((item) => item.id === (ctx.config.theme || "auto"))), footer: c.footer });
  if (!picked || picked.quit) return picked;
  ctx.config.theme = picked.item.id;
  saveConfig({ theme: picked.item.id }, ctx.env);
  setTheme(detectTheme({ env: ctx.env, config: ctx.config }));
  return null;
}

async function chooseGlyphs(ctx, screen, c) {
  const items = [{ label: c.glyphAuto, id: "auto", hint: c.glyphAutoHint }, { label: c.blocks, id: "blocks", hint: c.glyphBlocksHint }, { label: c.ascii, id: "ascii", hint: c.glyphAsciiHint }];
  const picked = await select(screen, { title: c.glyphTitle, items, index: Math.max(0, items.findIndex((item) => item.id === (ctx.config.glyphs || "auto"))), footer: c.footer });
  if (!picked || picked.quit) return picked;
  ctx.config.glyphs = picked.item.id;
  saveConfig({ glyphs: picked.item.id }, ctx.env);
  screen.ascii = useAscii(ctx);
  return null;
}

async function chooseAnim(ctx, screen, c) {
  const items = [{ label: c.on, id: true, hint: c.animOnHint }, { label: c.off, id: false, hint: c.animOffHint }];
  const picked = await select(screen, { title: c.animTitle, items, index: ctx.config.anim === false ? 1 : 0, footer: c.footer });
  if (!picked || picked.quit) return picked;
  ctx.config.anim = picked.item.id;
  saveConfig({ anim: picked.item.id }, ctx.env);
  return null;
}

async function chooseModel(ctx, screen, c, shell) {
  let list;
  try {
    list = await presets(ctx);
  } catch {
    return notice(screen, { title: c.modelTitle, lines: [{ text: c.noKernel, tone: "warn" }], footer: c.anyKey }).then(() => null);
  }
  const ordered = [...FIRST.map((id) => list.find((item) => item.id === id)).filter(Boolean), ...list.filter((item) => !FIRST.includes(item.id))];
  const items = ordered.map((preset) => ({ label: preset.name, value: `${c.region[preset.region] || preset.region} · ${preset.vendor}`, hint: preset.detail, keywords: preset.id, preset }));
  const picked = await select(screen, { title: c.modelTitle, items, header: [c.modelHeader], filter: true, footer: c.footer });
  if (!picked || picked.quit) return picked;
  const preset = picked.item.preset;
  const title = `${c.modelTitle} · ${preset.name}`;
  const raw = presetRecord(preset);
  const models = (preset.models || []).filter((id) => id && id !== "本地模型");
  if (models.length > 1) {
    const choice = await select(screen, { title: `${title} · ${c.pickModel}`, items: [...models.map((id) => ({ label: id, value: id === preset.model ? c.recommended : "" })), { label: c.typeModel, custom: true }], footer: c.footer });
    if (!choice || choice.quit) return choice;
    raw.model = choice.item.custom ? await prompt(screen, { title, label: c.modelName, header: [c.modelNameHint], footer: c.inputFooter, validate: (v) => (v ? "" : c.required) }) : choice.item.label;
  } else if (!models.length || preset.id === "local") {
    raw.model = await prompt(screen, { title, label: c.modelName, initial: preset.id === "local" ? "qwen3:8b" : models[0] || "", header: [preset.id === "local" ? c.localHint : c.modelNameHint], footer: c.inputFooter, validate: (v) => (v ? "" : c.required) });
  }
  if (raw.model == null) return null;
  if (preset.id === "custom") {
    raw.name = raw.model;
    raw.baseUrl = await prompt(screen, { title, label: c.baseUrl, initial: "https://", header: [c.baseUrlHint], footer: c.inputFooter, validate: (v) => (/^https?:\/\/[^/\s]+/i.test(v) ? "" : c.badUrl) });
    if (raw.baseUrl == null) return null;
    const protocol = await select(screen, { title: `${title} · ${c.protocolTitle}`, items: [{ label: c.openai, id: "openai" }, { label: c.anthropic, id: "anthropic" }], footer: c.footer });
    if (!protocol || protocol.quit) return protocol;
    raw.protocol = protocol.item.id;
    raw.auth = protocol.item.id === "anthropic" ? "x-api-key" : "bearer";
  }
  const lines = [{ text: c.saved(raw.name, raw.model), tone: "ok", bold: true }];
  if (raw.auth !== "none") {
    const steps = [...(preset.key?.steps || []).map((step, i) => `${i + 1}. ${step}`), ...(preset.key?.url ? [preset.key.url] : [])];
    for (;;) {
      const options = [
        { label: c.keyPaste, id: "paste", hint: c.keyPasteHint },
        { label: c.keyEnv, id: "env", hint: c.keyEnvHint },
        ...(preset.key?.url ? [{ label: c.keyOpen, id: "open", value: preset.key.url, hint: c.keyOpenHint }] : []),
        { label: c.back, id: "back" },
      ];
      const how = await select(screen, { title: `${title} · ${c.keyTitle}`, header: steps.length ? [c.keySteps, ...steps] : [], items: options, footer: c.footer });
      if (!how || how.quit || how.item.id === "back") return how?.quit ? how : null;
      if (how.item.id === "open") {
        const ok = openUrl(ctx, preset.key.url);
        await notice(screen, { title: c.keyOpen, lines: [ok ? c.opened : c.openFailed(preset.key.url)], footer: c.anyKey });
        continue;
      }
      if (how.item.id === "paste") {
        const key = await prompt(screen, { title: `${title} · ${c.keyTitle}`, label: c.keyLabel, secret: true, header: [c.paste[family(shell)], c.keyPasteHint], footer: c.inputFooter, validate: (v) => (v.length >= 8 ? "" : c.keyShort) });
        if (key == null) continue;
        raw.apiKey = key;
        lines.push(c.savedKey(key.slice(-4)));
      } else {
        const guess = KEY_NAMES[preset.id] || `${preset.id.replace(/[^a-z0-9]/gi, "_").toUpperCase()}_API_KEY`;
        const name = await prompt(screen, { title: `${title} · ${c.keyTitle}`, label: c.envLabel, initial: guess, header: [c.envHow[shell](guess)], footer: c.inputFooter, validate: (v) => (isEnvName(v) || v.length >= 8 ? "" : c.badEnv) });
        if (name == null) continue;
        if (isEnvName(name)) {
          raw.keyEnv = name;
          delete raw.apiKey;
          lines.push(c.savedEnv(name), c.envHow[shell](name));
          if (!ctx.env[name]) lines.push({ text: c.envMissing(name), tone: "warn" });
        } else {
          raw.apiKey = name;
          delete raw.keyEnv;
          lines.push(c.savedKey(name.slice(-4)));
        }
      }
      break;
    }
  } else lines.push(c.savedLocal);
  saveModel(activeModelName(ctx.env), raw, ctx.env);
  ctx._record = undefined;
  await notice(screen, { title: c.savedTitle, lines, footer: c.anyKey });
  return null;
}

async function chooseEngine(ctx, screen, c, shell) {
  const current = ctx.config.engine || "koder";
  const hermes = { ...HERMES_ENGINE, ...(ctx.config.engines?.hermes || {}) };
  const found = Boolean(which(hermes.command, ctx.env));
  const items = [
    { label: c.koder, id: "koder", value: current === "koder" ? c.current : "", hint: c.engineKoderHint, tone: current === "koder" ? "ok" : undefined },
    { label: "Hermes", id: "hermes", value: current === "hermes" ? c.current : found ? c.installed : c.notInstalled, hint: c.engineHermesHint, tone: current === "hermes" ? "ok" : undefined },
    ...Object.keys(ctx.config.engines || {}).filter((id) => id !== "hermes").map((id) => ({ label: id, id, value: current === id ? c.current : "" })),
  ];
  const picked = await select(screen, { title: c.engineTitle, items, index: Math.max(0, items.findIndex((item) => item.id === current)), footer: c.footer });
  if (!picked || picked.quit) return picked;
  if (picked.item.id === "hermes" && !found) {
    if (isWindowsShell(shell)) return notice(screen, { title: "Hermes", lines: [c.hermesWindows], footer: c.anyKey }).then(() => null);
    const next = await select(screen, { title: "Hermes", items: [{ label: c.installNow, id: "install", hint: c.installHint }, { label: c.back, id: "back" }], footer: c.footer });
    if (!next || next.quit || next.item.id === "back") return next?.quit ? next : null;
    await outside(ctx, screen, c, ["engine", "install", "hermes"]);
    const { loadConfig } = await import("../config.mjs");
    Object.assign(ctx.config, loadConfig(ctx.env));
    if (!ctx.config.engines?.hermes) return null;
  }
  ctx.config.engine = picked.item.id;
  saveConfig({ engine: picked.item.id }, ctx.env);
  return null;
}

async function chooseGateway(ctx, screen, c) {
  for (;;) {
    const config = loadGateway(ctx.env);
    const state = loadState(ctx.env);
    const running = state && pidAlive(state.pid);
    const lang = ctx.lang === "en" ? "en" : "zh";
    const items = [];
    for (const id of PLATFORMS) {
      const { meta } = await loadPlatform(id);
      const entry = config.platforms?.[id];
      const live = running ? state.platforms?.[id] : null;
      const connected = live?.state === "connected" && entry?.enabled !== false;
      const value = !entry ? c.gwOff : entry.enabled === false ? c.gwPaused : connected ? c.gwOn : live?.detail || ctx.t("gw.configured");
      items.push({ label: meta.name[lang], id, value, tone: connected ? "ok" : undefined, hint: meta.steps[lang] });
    }
    items.push({ label: c.gwStart, id: "start", hint: c.gwStartHint }, { label: c.back, id: "back" });
    const picked = await select(screen, { title: c.gwTitle, items, footer: c.footer });
    if (!picked || picked.quit || picked.item.id === "back") return picked?.quit ? picked : null;
    if (picked.item.id === "start") { await outside(ctx, screen, c, ["gateway", "start", "--background"]); continue; }
    const id = picked.item.id;
    const { meta } = await loadPlatform(id);
    let options = [];
    if (meta.qr) {
      const methods = [
        { label: lang === "zh" ? "扫码连接（推荐）" : "Connect by QR code (recommended)", id: "qr", hint: lang === "zh" ? "用手机确认，机器人凭据会自动保存到本机。" : "Confirm on your phone. Bot credentials are saved on this computer." },
        { label: lang === "zh" ? "手动填写机器人凭据" : "Enter bot credentials manually", id: "manual", hint: meta.steps[lang] },
        ...(config.platforms[id] ? [{ label: lang === "zh" ? "连接已保存的机器人" : "Connect the saved bot", id: "saved" }] : []),
        { label: c.back, id: "back" },
      ];
      const method = await select(screen, { title: `${c.gwTitle} · ${meta.name[lang]}`, items: methods, footer: c.footer });
      if (!method || method.quit || method.item.id === "back") continue;
      options = method.item.id === "manual" ? ["--manual"] : method.item.id === "qr" ? ["--qr"] : [];
    }
    await outside(ctx, screen, c, ["gateway", "connect", id, ...options]);
  }
}

async function chooseEditor(ctx, screen, c, shell) {
  for (;;) {
    const names = { zed: "Zed", nvim: "Neovim（CodeCompanion）", emacs: "Emacs（agent-shell）" };
    const items = Object.keys(SNIPPETS).map((id) => ({ label: ctx.lang === "en" ? names[id].replace("（", " (").replace("）", ")") : names[id], id, value: snippetFor(id, { lang: ctx.lang, shell }).file }));
    items.push({ label: c.back, id: "back" });
    const picked = await select(screen, { title: c.editorTitle, items, footer: c.footer });
    if (!picked || picked.quit || picked.item.id === "back") return picked?.quit ? picked : null;
    const snippet = snippetFor(picked.item.id, { lang: ctx.lang, shell });
    const action = await select(screen, { title: `${c.editorTitle} · ${picked.item.label}`, header: [snippet.file, snippet.note, "", ...snippet.code.split("\n")], items: [{ label: c.copy, id: "copy", hint: c.copyHint }, { label: c.back, id: "back" }], footer: c.footer });
    if (action?.quit) return action;
    if (action?.item.id === "copy") {
      const tool = copyText(ctx, snippet.code);
      await notice(screen, { title: c.editorTitle, lines: [tool ? { text: c.copied(snippet.file), tone: "ok" } : { text: c.copyFailed, tone: "warn" }], footer: c.anyKey });
    }
  }
}

export async function run(ctx) {
  const c0 = copyFor(ctx);
  if (!ctx.stdin.isTTY || !ctx.stdout.isTTY) {
    ctx.stdout.write(`${c0.nonInteractive}\n`);
    return 0;
  }
  const shell = detectShell({ env: ctx.env, platform: ctx.io.platform || process.platform });
  const screen = createScreen({ input: ctx.stdin, output: ctx.stdout, depth: ctx.depth, ascii: useAscii(ctx) });
  const handlers = { lang: chooseLang, theme: chooseTheme, glyphs: chooseGlyphs, anim: chooseAnim, model: chooseModel, engine: chooseEngine, gateway: chooseGateway, editor: chooseEditor };
  let index = null;
  screen.start();
  try {
    for (;;) {
      const c = copyFor(ctx);
      Object.assign(screen, { searchLabel: c.search, searchHint: c.searchHint, emptyLabel: c.empty });
      const items = await menuItems(ctx, c, shell);
      index ??= items[1].tone === "warn" ? 1 : 0;
      const picked = await select(screen, { title: `${c.title} · KODER CLI v${ctx.version}`, header: [c.intro(shellName(shell, ctx.lang))], items, index, footer: c.mainFooter });
      if (!picked || picked.quit || picked.item.id === "done") break;
      index = picked.index;
      const id = picked.item.id;
      let result = null;
      if (handlers[id]) result = await handlers[id](ctx, screen, c, shell);
      else if (id === "learn") await outside(ctx, screen, c, ["learn"]);
      else if (id === "doctor") await outside(ctx, screen, c, ["doctor"]);
      if (result?.quit) break;
    }
  } finally {
    screen.stop();
  }
  ctx.config.setupDone = true;
  saveConfig({ setupDone: true }, ctx.env);
  ctx.stdout.write(`${copyFor(ctx).bye}\n`);
  return 0;
}
