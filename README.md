# Koder CLI

Koder 在你自己的电脑上办事。这条命令行是终端里的那一版：一句话交代任务，也能放进脚本、管道和 CI。改文件和运行命令之前，都会先停下来等你确认。

官网：<https://karmenloop.com>  
CLI 页面：<https://karmenloop.com/cli.html>  
更新：<https://karmenloop.com/updates.html>  
下载页：<https://karmenloop.com/download.html>  
邮箱：<info@karmenloop.com>

电脑版 IDE 和窗口里的终端在电脑安装包里。CLI 和 TUI 不在那个安装包里，各是一条命令，贴进终端就会安装，不需要邀请码。SDK 还没有发布；在那之前可以用 `koder run --json` 和 `koder acp` 接到别的程序里。

## 下载与安装

安装脚本放在官网，装好以后会自己校验安装包。想先看脚本再运行，直接打开这些地址：

- macOS、Linux、WSL：<https://karmenloop.com/install/koder-cli.sh>
- Windows PowerShell：<https://karmenloop.com/install/koder-cli.ps1>
- Windows 命令提示符用的启动脚本：<https://karmenloop.com/install/koder-cli.cmd>

macOS 11 及以上（Apple 芯片或 Intel）、Ubuntu 18.04 及以上、Debian、Fedora、Alpine、树莓派和 WSL：

```bash
curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash
```

同时安装 Hermes 引擎（Windows 上 Hermes 需要 WSL，安装脚本不会在 Windows 本机直接装它）：

```bash
curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash -s -- --with-hermes
```

Windows 10 / 11 的 PowerShell：

```powershell
irm https://karmenloop.com/install/koder-cli.ps1 | iex
```

Windows 10 / 11 的命令提示符：

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://karmenloop.com/install/koder-cli.ps1 | iex"
```

Mac 和 Linux 装到 `~/.koder-cli`，Windows 装到 `%LOCALAPPDATA%\koder-cli`，都不需要管理员权限。本机没有 Node.js 22 时，安装脚本会下载 Node.js 官方构建并对照 SHA-256。装完运行 `koder setup`，方向键或鼠标就能把语言和模型配好。

已经装好的，用下面两条查看官网和更新页，或直接更新：

```bash
koder version
koder about
koder update
```

Windows XP、7、8 不能运行：Node.js 22 需要 Windows 10，XP 也不支持模型接口要求的 TLS 1.2。

## 装好之后

```bash
koder                          # 进入对话
koder setup                    # 设置：语言、模型、配色、引擎、聊天软件
koder learn                    # 按你的系统讲的互动教程
koder review                   # 审查当前改动
koder run "把 README 的安装说明补上"
koder ask "登录是从哪个文件开始的"
koder gateway setup feishu     # 接入飞书
koder lang en                  # 切换英文
```

教程按 PowerShell、CMD、macOS、Linux 分成四套。环境变量、管道、退出码、复制粘贴和安装命令都按那一套来写。第一课会说明识别到的是哪一套。

模型由你自己接入。密钥建议放进环境变量，配置里只记变量名。直接把密钥粘进「环境变量名」那一栏时，程序会把它当成密钥保存。

## 许可证

本仓库里的 Koder CLI 源码采用 GNU General Public License v3.0（见 `LICENSE`），与 [OpenHuman](https://github.com/tinyhumansai/openhuman) 使用的协议相同。我们没有复制 OpenHuman 的代码，只把它当作架构上的参照。第三方组件的许可见 `THIRD_PARTY_NOTICES.md`。

Koder 内核（KARMEN LOOP）不在本仓库里，也不采用这份 GPL。内核是闭源的，版权所有 © KARMEN / Koder，保留所有权利，不提供二次开发。官网安装包在运行时使用这份闭源内核；下载安装包不等于取得内核源码，也不等于可以把内核再授权给别人。

问题写到 <info@karmenloop.com>，或从官网 <https://karmenloop.com> 进入。
