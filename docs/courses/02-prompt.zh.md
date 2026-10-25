# 02. 认识开屏和提示符

建议 20 分钟

**目标**：认清当前目录、模型与模式，并能在同一窗口找到帮助，不把提示符当任务结果。

**准备**：先完成第1课；把窗口放宽到至少80列。准备一条无敏感内容的任务。

## 手把手操作

1. 运行 koder；先看开屏的版本、模型、目录，不急着输入任务。

   **应看到**：目录应是你想工作的项目；模型名字是配置，不证明接口已连通。

2. 输入 /help；再输入 /setup 查看设置，退出设置返回原对话。

   **应看到**：帮助与设置在当前命令窗口打开，不需要再开一个 Koder。

3. 空输入时按 /，方向键选择，按 Tab 填入；先编辑草稿，再回车提交。

   **应看到**：选择只填草稿；Esc 可关闭。不能弹出时按提示改用 /help 或补全。

4. 在另一个窗口进入不同项目，分别运行 koder，再查看各自目录。

   **应看到**：两个窗口应各做各的任务；明确共享同一会话时的占用提示要保留原文排查。

## 常见问题与恢复

- **框线错位、菜单折行**：先扩大窗口或在 Setup 改纯字符开屏；不要因界面错位重置模型配置。
- **只有一个窗口却显示会话占用**：记录版本和会话名，核查是否还有常驻或另一终端；不要直接删除整份历史。

## 作业与自查

截取不含密钥的开屏，标出版本、工作目录、模型与模式；用菜单填一条草稿后取消，不发送。

**自查标准**：能指出配置与真实执行的区别；草稿取消后没有新增模型任务，也没有文件改动。

## 开发者教学

1. 把输入行为看作事件：选择、填草稿、提交、取消必须分开。

2. 在80×24与窄终端各检查一次菜单；窄终端降级可读，不应输出半截控制序列。

3. 对非TTY/JSON调用，检查输出没有开屏动画和交互菜单；用两个独立项目验证会话边界。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)
- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 2 课 / 共 30 课 · 认识开屏和提示符 ━━
  · （这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）
教练 › 左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
  提示 · 框线和折光体乱成一团？多半是老式控制台的中文字体把方块字画成了两格宽。Koder 会自动换成纯字符画，也可以在 koder setup 里把「开屏样式」改成纯字符。最好的办法是换 Windows Terminal：Windows 11 自带，Windows 10 可以在 Microsoft Store 免费装。
    $env:KODER_ASCII = "1"; koder
        只在这个窗口里强制纯字符开屏
教练 › 开屏下面是提示符，它会告诉你现在的状态：
    koder ›
        在这里直接输入任务，比如：把 README 里的错别字改掉
    koder[code] ›
        方括号里是当前模式
    koder! ›
        感叹号表示自动确认开着，要格外小心
教练 › 提示符显示 koder[plan]! › ，下面哪个说法对？
    1. 计划模式，而且自动确认开着
    2. 计划模式，刚刚出错了
    3. 代码模式，感叹号是因为它很兴奋
  答案：1。满分。方括号是模式，感叹号是自动确认。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 2 课 / 共 30 课 · 认识开屏和提示符 ━━
  · （这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）
教练 › 左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
  提示 · 框线和折光体乱成一团？多半是老式控制台的中文字体把方块字画成了两格宽。Koder 会自动换成纯字符画，也可以在 koder setup 里把「开屏样式」改成纯字符。最好的办法是换 Windows Terminal：Windows 11 自带，Windows 10 可以在 Microsoft Store 免费装。
    set "KODER_ASCII=1" && koder
        只在这个窗口里强制纯字符开屏；CMD 的 set 要用引号把整段包起来，不然 && 前面的空格也会被存进去
教练 › 开屏下面是提示符，它会告诉你现在的状态：
    koder ›
        在这里直接输入任务，比如：把 README 里的错别字改掉
    koder[code] ›
        方括号里是当前模式
    koder! ›
        感叹号表示自动确认开着，要格外小心
教练 › 提示符显示 koder[plan]! › ，下面哪个说法对？
    1. 计划模式，而且自动确认开着
    2. 计划模式，刚刚出错了
    3. 代码模式，感叹号是因为它很兴奋
  答案：1。满分。方括号是模式，感叹号是自动确认。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 2 课 / 共 30 课 · 认识开屏和提示符 ━━
  · （这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）
教练 › 左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
  提示 · 系统自带的“终端”App 用 256 色显示折光体；想看完整的真彩，可以用 iTerm2、Ghostty 或 WezTerm。字体选等宽字体，比如 SF Mono 或 Menlo。
教练 › 开屏下面是提示符，它会告诉你现在的状态：
    koder ›
        在这里直接输入任务，比如：把 README 里的错别字改掉
    koder[code] ›
        方括号里是当前模式
    koder! ›
        感叹号表示自动确认开着，要格外小心
教练 › 提示符显示 koder[plan]! › ，下面哪个说法对？
    1. 计划模式，而且自动确认开着
    2. 计划模式，刚刚出错了
    3. 代码模式，感叹号是因为它很兴奋
  答案：1。满分。方括号是模式，感叹号是自动确认。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 2 课 / 共 30 课 · 认识开屏和提示符 ━━
  · （这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）
教练 › 左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
  提示 · GNOME Terminal、Konsole、Alacritty 都能显示真彩。通过 SSH 或 tmux 进来颜色发灰，就在命令前加 COLORTERM=truecolor；框线乱掉的话换一个带方块字符的等宽字体（比如 DejaVu Sans Mono），或者用 KODER_ASCII=1 koder 换成纯字符。
教练 › 开屏下面是提示符，它会告诉你现在的状态：
    koder ›
        在这里直接输入任务，比如：把 README 里的错别字改掉
    koder[code] ›
        方括号里是当前模式
    koder! ›
        感叹号表示自动确认开着，要格外小心
教练 › 提示符显示 koder[plan]! › ，下面哪个说法对？
    1. 计划模式，而且自动确认开着
    2. 计划模式，刚刚出错了
    3. 代码模式，感叹号是因为它很兴奋
  答案：1。满分。方括号是模式，感叹号是自动确认。
```

</details>
