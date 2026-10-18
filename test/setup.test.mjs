import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { detectShell, isPowerShell, normalizeShell } from "../src/platform.mjs";
import { scriptedPrompter } from "../src/prompter.mjs";
import { parseInput } from "../src/tui.mjs";
import { cli, tmp } from "./helpers.mjs";

class FakeInput extends EventEmitter {
  isTTY = true;
  isRaw = false;
  readableFlowing = null;
  setRawMode(value) {
    this.isRaw = value;
    return this;
  }
  resume() {
    this.readableFlowing = true;
    return this;
  }
  pause() {
    this.readableFlowing = false;
    return this;
  }
}

class FakeOutput extends EventEmitter {
  isTTY = true;
  columns = 100;
  rows = 36;
  text = "";
  write(chunk) {
    this.text += chunk;
    return true;
  }
}

function terminal() {
  const input = new FakeInput();
  const output = new FakeOutput();
  const frame = () => {
    const start = output.text.lastIndexOf("\x1b[H\x1b[2J");
    return start < 0 ? "" : output.text.slice(start + 7).replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "");
  };
  const lines = () => frame().split("\r\n");
  return {
    input,
    output,
    frame,
    send: (data) => input.emit("data", Buffer.from(data)),
    async until(pattern, ms = 4000) {
      const started = Date.now();
      while (!pattern.test(frame())) {
        if (Date.now() - started > ms) throw new Error(`timed out waiting for ${pattern}\n${frame()}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    },
    click(text) {
      const row = lines().findIndex((line) => line.includes(text)) + 1;
      assert.ok(row > 0, `no row with ${text}\n${frame()}`);
      input.emit("data", Buffer.from(`\x1b[<0;8;${row}M\x1b[<0;8;${row}m`));
    },
  };
}

test("parseInput: arrows, Enter, Esc, Backspace, control keys, SGR mouse, unknown sequences, CJK", () => {
  const names = (data) => parseInput(data).map((event) => event.name || event.ch || event.button);
  assert.deepEqual(names("\x1b[A\x1b[B\x1bOC\x1b[D"), ["up", "down", "right", "left"]);
  assert.deepEqual(names("\r\n\r"), ["enter", "enter"]);
  assert.deepEqual(names("\x7f\b\x03\x15\t\x1b[Z"), ["backspace", "backspace", "ctrl-c", "ctrl-u", "tab", "shift-tab"]);
  assert.deepEqual(names("\x1b"), ["escape"]);
  assert.deepEqual(names("\x1b[5~\x1b[6~\x1b[H\x1b[F"), ["pageup", "pagedown", "home", "end"]);
  assert.deepEqual(names("\x1b[200~ab\x1b[201~"), ["a", "b"]);
  assert.deepEqual(names("密钥k"), ["密", "钥", "k"]);
  assert.deepEqual(parseInput("\x1b[<0;12;7M"), [{ type: "mouse", button: "left", x: 12, y: 7, release: false }]);
  assert.equal(parseInput("\x1b[<0;12;7m")[0].release, true);
  assert.deepEqual(names("\x1b[<64;1;1M\x1b[<65;1;1M"), ["wheelup", "wheeldown"]);
  assert.deepEqual(parseInput("\x1b[<32;3;3M"), [], "drag motion is ignored");
  assert.equal(parseInput("\x1b[<4;3;3M")[0].button, "left", "shift-click is still a click");
});

test("chat-app settings offer QR and manual connection without claiming a saved app is online", async () => {
  const term = terminal(), home = tmp();
  fs.mkdirSync(path.join(home, "gateway"));
  fs.writeFileSync(path.join(home, "gateway/config.json"), JSON.stringify({ platforms: { weixin: { enabled: true } } }));
  const unavailable = async () => { throw new Error("fixture: no external login in navigation test"); };
  const running = cli(["setup"], { home, fetchImpl: unavailable, io: { stdin: term.input, stdout: term.output, noTerminal: false, weixinLogin: unavailable, feishuLogin: unavailable, wecomLogin: unavailable } });
  try {
    await term.until(/KODER CLI/);
    term.send("7");
    await term.until(/接入聊天软件/);
    assert.match(term.frame(), /配置已保存/);
    term.send("3");
    await term.until(/扫码连接.*|手动填写.*凭据/);
    assert.match(term.frame(), /扫码连接/);
    assert.match(term.frame(), /手动填写/);
    term.send("\x1b");
    await term.until(/接入聊天软件/);
  } finally {
    // Also exits the pre-fix screen, which immediately starts QR login.
    term.send("\r");
    for (let i = 0; i < 4; i++) { await new Promise((resolve) => setTimeout(resolve, 5)); term.send("\x1b"); }
    await running;
  }
});

test("detectShell: PowerShell vs CMD on Windows, macOS, Linux, overrides", () => {
  const user = "C:\\Users\\张三";
  const machine = "C:\\Program Files\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules";
  assert.equal(detectShell({ platform: "win32", env: { USERPROFILE: user, PSModulePath: `${user}\\Documents\\WindowsPowerShell\\Modules;${machine}` } }), "powershell");
  assert.equal(detectShell({ platform: "win32", env: { USERPROFILE: user, PSModulePath: `${user}\\OneDrive\\文档\\PowerShell\\Modules;${machine}` } }), "powershell");
  assert.equal(detectShell({ platform: "win32", env: { USERPROFILE: user, PSModulePath: machine } }), "cmd");
  assert.equal(detectShell({ platform: "win32", env: {} }), "cmd");
  assert.equal(detectShell({ platform: "darwin", env: {} }), "mac");
  assert.equal(detectShell({ platform: "linux", env: { WSL_DISTRO_NAME: "Ubuntu" } }), "linux");
  assert.equal(detectShell({ platform: "darwin", env: { KODER_SHELL: "cmd" } }), "cmd");
  assert.equal(isPowerShell({ PSModulePath: machine }), false);
  assert.equal(normalizeShell("Windows"), "powershell");
  assert.equal(normalizeShell("ubuntu"), "linux");
  assert.equal(normalizeShell("beos"), null);
});

test("koder setup: mouse and keys set language, model with a pasted key, palette, glyphs, animation, editor copy", async () => {
  const home = tmp();
  const term = terminal();
  const copied = [];
  const running = cli(["setup"], { home, io: { stdin: term.input, stdout: term.output, clipboard: (text) => (copied.push(text), "test-clipboard") } });

  await term.until(/Koder 设置 · KODER CLI/);
  assert.match(term.frame(), /▸ 模型\s+还没配置，先选这里/, "focus starts on the missing model");
  assert.match(term.frame(), /你在用 macOS 终端/);
  assert.match(term.frame(), /鼠标点一下也行/);
  assert.equal(term.input.isRaw, true);

  term.click("语言 Language");
  await term.until(/选择语言 · Language/);
  term.click("English");
  await term.until(/Koder setup · KODER CLI/);

  term.send("2");
  await term.until(/Model provider/);
  assert.match(term.frame(), /Type to filter/);
  term.send("deep");
  await term.until(/Filter: deep/);
  assert.doesNotMatch(term.frame(), /\s{2}Kimi\s+China/, "the list is filtered");
  term.send("\r");
  await term.until(/DeepSeek · Model/);
  term.send("\r");
  await term.until(/Paste the key/);
  assert.match(term.frame(), /https:\/\/platform\.deepseek\.com\/api_keys/, "the provider's key page is shown");
  term.send("\r");
  await term.until(/Key  /);
  term.send("sk-test-secret-1234");
  await term.until(/1234/);
  assert.doesNotMatch(term.frame(), /sk-test-secret/, "the key is masked while typing");
  assert.match(term.frame(), /•+1234/);
  term.send("\r");
  await term.until(/Model saved/);
  assert.match(term.frame(), /DeepSeek · deepseek-v4-pro/);
  assert.match(term.frame(), /ends in 1234/);
  term.send(" ");
  await term.until(/Koder setup · KODER CLI/);
  assert.match(term.frame(), /Model\s+DeepSeek · deepseek-v4-pro/);

  term.send("3");
  await term.until(/Follows the terminal background/);
  term.send("\x1b[B\x1b[B\r");
  await term.until(/Colours\s+light/);

  term.send("4");
  await term.until(/Banner style/);
  term.send("3");
  await term.until(/Banner style\s+plain characters/);
  assert.match(term.frame(), /^\+- Koder setup/, "the menu itself switches to plain characters");
  assert.doesNotMatch(term.frame(), /[╭│▸·↑↓…•]/);

  term.send("5");
  await term.until(/A short spin before it settles/);
  term.send("2");
  await term.until(/Banner animation\s+off/);

  term.send("8");
  await term.until(/Editor config/);
  term.send("\r");
  await term.until(/Copy to clipboard/);
  assert.match(term.frame(), /~\/\.config\/zed\/settings\.json/);
  term.send("\r");
  await term.until(/Copied\. Open/);
  term.send("x");
  await term.until(/Editor config/);
  term.send("\x1b");
  await term.until(/Koder setup \| KODER CLI/);
  term.send("\x1b");

  const result = await running;
  assert.equal(result.code, 0, result.err);
  assert.match(term.output.text, /\x1b\[\?1049h\x1b\[\?25l\x1b\[\?1000h\x1b\[\?1006h/, "alternate screen and mouse reporting on");
  assert.match(term.output.text, /\x1b\[\?1000l\x1b\[\?1006l\x1b\[\?25h\x1b\[\?1049l/, "and off again");
  assert.match(term.output.text, /Settings saved\. Type koder to start/);
  assert.equal(term.input.isRaw, false);
  assert.ok(!term.output.text.includes("sk-test-secret"), "the key never reaches the screen");

  const config = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
  assert.equal(config.lang, "en");
  assert.equal(config.theme, "light");
  assert.equal(config.glyphs, "ascii");
  assert.equal(config.anim, false);
  assert.equal(config.setupDone, true);
  const provider = JSON.parse(fs.readFileSync(path.join(home, "provider.json"), "utf8"));
  assert.equal(provider.apiKey, "sk-test-secret-1234");
  assert.equal(provider.model, "deepseek-v4-pro");
  assert.match(provider.baseUrl, /deepseek/);
  assert.equal(copied.length, 1);
  assert.match(copied[0], /"agent_servers"/);
  assert.match(copied[0], /"command": "koder",/);

  const banner = await cli(["banner", "--no-anim"], { home });
  assert.doesNotMatch(banner.out, /[█╭]/, "the saved banner style is used afterwards");
});

test("koder setup on Windows PowerShell: env-variable key, setx hint, koder.cmd editor snippet, Hermes needs WSL", async () => {
  const home = tmp();
  const term = terminal();
  const copied = [];
  const env = { USERPROFILE: "C:\\Users\\me", PSModulePath: "C:\\Users\\me\\Documents\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules", PATH: tmp() };
  const running = cli(["setup"], { home, env, io: { platform: "win32", stdin: term.input, stdout: term.output, clipboard: (text) => (copied.push(text), "clip") } });

  await term.until(/你在用 Windows PowerShell/);
  term.send("\r");
  await term.until(/选择模型服务商/);
  term.send("kimi\r");
  await term.until(/Kimi · 选择型号/);
  term.send("\r");
  await term.until(/从环境变量读取/);
  assert.match(term.frame(), /怎么拿到密钥/);
  term.send("\x1b[B\r");
  await term.until(/变量名  MOONSHOT_API_KEY/);
  assert.match(term.frame(), /setx MOONSHOT_API_KEY "你的密钥"/);
  assert.match(term.frame(), /\$env:MOONSHOT_API_KEY = "你的密钥"/);
  term.send("\r");
  await term.until(/模型已保存/);
  assert.match(term.frame(), /当前窗口里还读不到 MOONSHOT_API_KEY/);
  term.send("\r");
  await term.until(/Koder 设置 · KODER CLI/);
  assert.match(term.frame(), /模型\s+没有找到环境变量 MOONSHOT_API_KEY|模型\s+.*MOONSHOT_API_KEY/);

  term.send("6");
  await term.until(/选择引擎/);
  term.click("Hermes");
  await term.until(/WSL/);
  term.send("\r");
  await term.until(/Koder 设置 · KODER CLI/);

  term.send("8");
  await term.until(/编辑器配置/);
  assert.match(term.frame(), /%APPDATA%\\Zed\\settings\.json/);
  term.click("Neovim");
  await term.until(/复制到剪贴板/);
  term.send("\r");
  await term.until(/已复制/);
  term.send("q");
  await term.until(/编辑器配置/);
  term.send("q");
  await term.until(/Koder 设置 · KODER CLI/);
  term.click("完成");

  const result = await running;
  assert.equal(result.code, 0, result.err);
  const provider = JSON.parse(fs.readFileSync(path.join(home, "provider.json"), "utf8"));
  assert.equal(provider.keyEnv, "MOONSHOT_API_KEY");
  assert.equal(provider.apiKey, undefined);
  assert.match(copied[0], /\{ "koder\.cmd", "acp" \}/);
  assert.match(copied[0], /name = "koder"/, "only the command changes, not the adapter name");
  const config = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
  assert.equal(config.engine, undefined, "Hermes was not selected without an install");
});

test("koder setup without a terminal explains itself; /setup in a scripted chat does not hang", async () => {
  const plain = await cli(["setup"]);
  assert.equal(plain.code, 0);
  assert.match(plain.out, /koder setup 需要在终端窗口里打开/);
  const onboard = await cli(["onboard"]);
  assert.match(onboard.out, /koder setup 需要在终端窗口里打开/);
  const prompter = scriptedPrompter(["/setup", "/exit"]);
  const chat = await cli(["chat", "--no-anim"], { io: { prompter } });
  assert.equal(chat.code, 0, chat.err);
  assert.match(chat.out, /koder setup 需要在终端窗口里打开/);
  assert.match(chat.out, /\/setup 打开设置/);
});

test("editor --os and engine install on Windows", async () => {
  const zed = await cli(["editor", "zed", "--os", "powershell"]);
  assert.match(zed.out, /%APPDATA%\\Zed\\settings\.json/);
  assert.match(zed.out, /"command": "koder\.cmd"/);
  const emacs = await cli(["editor", "emacs", "--os", "linux"]);
  assert.match(emacs.out, /~\/\.emacs\.d\/init\.el/);
  assert.match(emacs.out, /:command "koder"/);
  const bad = await cli(["editor", "zed", "--os", "amiga"]);
  assert.equal(bad.code, 2);
  const hermes = await cli(["engine", "install", "hermes"], { env: { PATH: tmp() }, io: { platform: "win32" } });
  assert.equal(hermes.code, 1);
  assert.match(hermes.err + hermes.out, /WSL/);
});

test('context settings edit active model limits without re-entering the API key',async()=>{
  const term=terminal(),home=tmp(),file=path.join(home,'provider.json');
  fs.writeFileSync(file,JSON.stringify({model:'fixture',baseUrl:'https://example.invalid/v1',apiKey:'fixture-context-secret',contextWindow:8192,maxOutput:1024}));
  const running=cli(['setup'],{home,io:{stdin:term.input,stdout:term.output,noTerminal:false}});
  try {
    await term.until(/KODER CLI/);term.click('上下文与输出');await term.until(/contextWindow \(tokens\)/);
    term.send('\x15128000\r');await term.until(/maxOutput \(tokens\)/);term.send('\x158192\r');
    await term.until(/上下文配置已保存/);term.send(' ');await term.until(/128000 \/ 8192 tokens/);term.send('\x1b');
    const result=await running;assert.equal(result.code,0,result.err);const stored=JSON.parse(fs.readFileSync(file));assert.equal(stored.contextWindow,128000);assert.equal(stored.maxOutput,8192);assert.equal(stored.apiKey,'fixture-context-secret');assert.doesNotMatch(term.output.text,/fixture-context-secret/);
  } finally {term.send('\x03');}
});
