import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { scriptedPrompter } from "../src/prompter.mjs";
import { LESSONS } from "../src/tutorial/lessons.mjs";
import { CART_FIX } from "../src/tutorial/sandbox.mjs";
import { cli, tmp } from "./helpers.mjs";

function answers(table) {
  const counts = new Map();
  return scriptedPrompter((prompt) => {
    for (const [pattern, values] of table) {
      if (!pattern.test(prompt)) continue;
      const used = counts.get(pattern) || 0;
      counts.set(pattern, used + 1);
      return Array.isArray(values) ? values[Math.min(used, values.length - 1)] : values;
    }
    throw new Error(`unexpected prompt: ${prompt}`);
  });
}

test("tutorial text edition: every lesson, practice answers and quiz answers", async () => {
  const all = await cli(["learn", "--print"]);
  assert.equal(all.code, 0);
  LESSONS.forEach((lesson, index) => assert.match(all.out, new RegExp(`第 ${index + 1} 课 / 共 ${LESSONS.length} 课 · ${lesson.title.zh.replace(/[()（）]/g, ".")}`)));
  assert.match(all.out, /动手 · 输入 \/mode plan 切到计划模式  →  \/mode plan/);
  assert.match(all.out, /答案：1。满分。方括号是模式，感叹号是自动确认。/);
  assert.match(all.out, /（小声）/);
  const one = await cli(["learn", "6", "--lang", "en"]);
  assert.match(one.out, /Lesson 6 of 17 · Choices: Koder asks you too/);
  assert.doesNotMatch(one.out, /Lesson 7/);
  const bad = await cli(["learn", "99"]);
  assert.equal(bad.code, 2);
});

test("interactive tutorial: all lessons run for real in the practice project", async (t) => {
  const home = tmp();
  const prompter = answers([
    [/直接回车就用这一套/, ""],
    [/回车继续/, ""],
    [/接受这个修改/, ["n", "y", "y"]],
    [/允许运行/, ["y", "y"]],
    [/输入序号，直接回车取消/, "3"],
    [/^输入序号 › $/, ["2", "1", "1", "1", "1"]],
    [/^(› |再来 › )$/, ["/mode plan", "/yes", "yes", "/yes"]],
    [/^koder › $/, ["修好 cart.mjs 的总价", "这个项目怎么跑测试？"]],
    [/全部预设/, "n"],
    [/按审查结果修一下/, "y"],
    [/扫一下你的电脑/, "n"],
    [/练习场要留着吗/, "k"],
  ]);
  const result = await cli(["learn"], { home, io: { prompter } });
  const keptDir = /留着了：(.+)/.exec(result.out)?.[1].trim();
  t.after(() => keptDir && fs.rmSync(keptDir, { recursive: true, force: true }));
  assert.equal(result.code, 0, result.err);
  const out = result.out;
  for (let n = 1; n <= LESSONS.length; n += 1) assert.match(out, new RegExp(`第 ${n} 课 / 共 ${LESSONS.length} 课`));

  assert.match(out, /准备修改 cart\.mjs/);
  assert.match(out, /你拒绝了：文件一个字都没动/);
  assert.match(out, /好的，没改，反悔是你的权利/);
  assert.match(out, /你输入了 y：直到这一刻，文件才真正写进磁盘/);
  assert.match(out, /抓到了！这种命令一定要拒绝/);
  assert.match(out, /拒绝得好！来路不明的脚本就该拦下来/);
  assert.match(out, /通过：总价 750 分/);
  assert.match(out, /“看着办”最难办/);
  assert.match(out, /出错时 Koder 会直接用文字告诉你/);
  assert.match(out, /提示 · 还是 \/yes，它是个开关。（输入 s 可以跳过）/);
  assert.match(out, /\[高\] cart\.mjs:\d+  打折后可能出现小数分/);
  assert.match(out, /第 1\/3 次修复/);
  assert.match(out, /第 2\/3 次修复/);
  assert.match(out, /检查通过/);
  assert.match(out, /流程结束：4 通过，0 失败，0 跳过/);
  assert.match(out, /"agent_servers"/);
  assert.match(out, /毕业证已发放/);

  const cart = fs.readFileSync(path.join(keptDir, "cart.mjs"), "utf8");
  assert.ok(cart.includes(CART_FIX.trim()), "lesson 4 really edited the file");
  assert.match(cart, /Math\.round\(cents \* \(1 - rate\)\)/);
  assert.match(cart, /sum \+ item\.qty/);
  assert.equal(fs.existsSync(path.join(keptDir, "speedup.sh")), false);

  const config = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
  assert.deepEqual(config.tutorial, { lesson: LESSONS.length, done: true });
});

test("interactive tutorial: jump, quit, resume, and the practice project is removed", async () => {
  const home = tmp();
  const first = answers([[/直接回车就用这一套/, ""], [/回车继续/, ["5", "q"]], [/允许运行/, "n"]]);
  const quit = await cli(["learn"], { home, io: { prompter: first } });
  assert.equal(quit.code, 0);
  assert.match(quit.out, /第 5 课 \/ 共 17 课 · 命令确认/);
  assert.match(quit.out, /下课！进度记在第 5 课/);
  const dir = /练习场在：(.+)/.exec(quit.out)[1].trim();
  assert.equal(fs.existsSync(dir), false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).tutorial.lesson, 5);

  const second = answers([[/上次学到第 5 课/, ""], [/允许运行/, "n"], [/回车继续/, "q"]]);
  const resumed = await cli(["learn"], { home, io: { prompter: second } });
  assert.match(second.asked[0], /上次学到第 5 课/);
  assert.match(resumed.out, /第 5 课 \/ 共 17 课/);
  assert.doesNotMatch(resumed.out, /第 1 课 \/ 共 17 课/);
});

test("tutorial editions: each system gets its own commands and nothing from the others", async () => {
  const editions = {};
  for (const os of ["powershell", "cmd", "mac", "linux"]) {
    const result = await cli(["learn", "--print", "--os", os]);
    assert.equal(result.code, 0, result.err);
    editions[os] = result.out;
  }
  const ps = editions.powershell;
  assert.match(ps, /这份文字版按「Windows PowerShell」来写/);
  for (const text of ["$env:DEEPSEEK_API_KEY = ", "Get-Content error.log | koder ask", "$LASTEXITCODE", "irm https://karmenloop.com/install/koder-cli.ps1 | iex", "$OutputEncoding", "koder.cmd", "Windows XP、7、8", "irm … | iex", "Ctrl+Z", "Remove-Item -Recurse -Force"]) assert.ok(ps.includes(text), `PowerShell edition lacks ${text}`);
  const cmd = editions.cmd;
  for (const text of ["set \"DEEPSEEK_API_KEY=", "type error.log | koder ask", "echo %ERRORLEVEL%", "-ExecutionPolicy Bypass", "重新打开命令提示符", "cd /d D:\\code\\my-app", "只认双引号", "set \"KODER_ASCII=1\" && koder"]) assert.ok(cmd.includes(text), `CMD edition lacks ${text}`);
  const mac = editions.mac;
  for (const text of [">> ~/.zshrc", "⌘C", "brew install jq", "iTerm2", "curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash", "macOS 11 以上", "echo $?", "curl … | sh"]) assert.ok(mac.includes(text), `macOS edition lacks ${text}`);
  const linux = editions.linux;
  for (const text of [">> ~/.bashrc", "Ctrl+Shift+V", "sudo apt install jq", "glibc 低于 2.28", "systemd", "COLORTERM=truecolor"]) assert.ok(linux.includes(text), `Linux edition lacks ${text}`);
  for (const unix of [mac, linux]) for (const text of ["$env:", "setx ", "irm https://", "koder.cmd", "Windows XP、7、8", "%ERRORLEVEL%"]) assert.ok(!unix.includes(text), `a Unix edition leaks ${text}`);
  for (const windows of [ps, cmd]) for (const text of ["export DEEPSEEK_API_KEY", "curl -fsSL https://karmenloop.com", "echo $?", "~/.zshrc", "⌘C"]) assert.ok(!windows.includes(text), `a Windows edition leaks ${text}`);
  assert.ok(!ps.includes("%ERRORLEVEL%") && !cmd.includes("$LASTEXITCODE"), "PowerShell and CMD keep their own exit-code syntax");
  const bad = await cli(["learn", "--print", "--os", "beos"]);
  assert.equal(bad.code, 2);
});

test("interactive tutorial: switching to PowerShell in lesson 1 sticks for later lessons and resumes", async (t) => {
  const home = tmp();
  const first = answers([[/直接回车就用这一套/, "1"], [/回车继续/, ["3", "5", "q"]], [/全部预设/, "n"], [/允许运行/, ["y", "y"]]]);
  const result = await cli(["learn"], { home, io: { prompter: first } });
  assert.equal(result.code, 0, result.err);
  assert.match(result.out, /好，换成「Windows PowerShell」版/);
  assert.match(result.out, /\$env:DEEPSEEK_API_KEY = "sk-你的密钥"/);
  assert.match(result.out, /准备运行命令[\s\S]*irm https:\/\/example\.invalid\/speedup\.ps1 \| iex/);
  assert.match(result.out, /抓到了！这种命令一定要拒绝/);
  const dir = /练习场在：(.+)/.exec(result.out)[1].trim();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const saved = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).tutorial;
  assert.equal(saved.shell, "powershell");
  assert.equal(saved.lesson, 5);
  const again = await cli(["learn", "3", "--print"], { home });
  assert.match(again.out, /按「Windows PowerShell」来写/);
  assert.match(again.out, /setx DEEPSEEK_API_KEY/);
});

test("chat shows the first-run hint until the tutorial is finished, and /learn opens it", async () => {
  const home = tmp();
  const prompter = answers([[/koder.* › $/, ["/learn 2", "/exit"]], [/回车继续/, "q"], [/^输入序号 › $/, "1"]]);
  const result = await cli(["chat", "--no-anim"], { home, io: { prompter } });
  assert.equal(result.code, 0, result.err);
  assert.match(result.out, /第一次见面？输入 \/learn/);
  assert.match(result.out, /第 2 课 \/ 共 17 课 · 认识开屏和提示符/);
  fs.writeFileSync(path.join(home, "config.json"), JSON.stringify({ tutorial: { lesson: 17, done: true } }));
  const later = await cli(["chat", "--no-anim"], { home, io: { prompter: answers([[/koder.* › $/, "/exit"]]) } });
  assert.doesNotMatch(later.out, /第一次见面/);
});
