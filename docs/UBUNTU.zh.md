0.5.10 安装器自动选择 Linux 专用包；完整现行功能与课堂保留。[断点续传与简单安装](DOWNLOADS.zh.md)。

# Ubuntu 24.04 LTS 完整版使用说明

Ubuntu 与 Windows、macOS 使用同一份完整 Koder CLI 运行包，不是精简版。0.5.8 补入 Linux AT-SPI 图形控件驱动，沿用现有 `computer_*` 工具、电脑授权和执行审批。

本轮适配范围固定为 Ubuntu 24.04 LTS 的 24.04.x 点版本，架构为 x64/ARM64，桌面通道覆盖 X11/Wayland。按最新产品范围，24.10 不再推进。不同点版本的内核、显卡及所有 Ubuntu 衍生桌面没有逐一认证。

## 安装、升级和完整功能

新装 Ubuntu 若提示 `找不到命令 curl`，说明下载命令尚未运行，Koder 安装器也没有启动。先在终端逐行执行：

```bash
sudo apt update
sudo apt install -y curl ca-certificates
curl -fL https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh -o /tmp/koder-install.sh
```

确认下载成功并检查 `/tmp/koder-install.sh` 后，再运行：

```bash
bash /tmp/koder-install.sh
koder --version
koder setup
```

`sudo` 仅用于安装 Ubuntu 系统依赖，输入的是本机用户密码；不要发到聊天中。运行 Koder 安装器和 CLI 时不加 `sudo`。如果下载报错，先处理网络或证书问题，不要继续执行旧的临时文件。如果已经有 `wget`，也可以用 `wget -O /tmp/koder-install.sh https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh` 下载；安装器内部支持 `curl` 和 `wget`。浏览器下载的 `koder-cli-0.5.12-linux.tgz` 是运行包，不是可双击安装的程序；通常使用上面的安装脚本即可。

从 [0.5.12 GitHub Release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.12) 下载并检查 `koder-cli.sh`，执行 `bash koder-cli.sh`，再运行 `koder --version`、`koder setup`。安装器可以在用户目录准备 Node，无需全局 npm。旧版本使用 `koder update`；安装和升级保留配置与工作区。

保留模型/BYOK、强度设置、上下文和自动压缩、编程与撰写、网站设计与预览、邮箱、GitHub、MCP、Skills、自学习、角色和子 Agent、长任务、引导/排队、取消、费用预算、记忆与项目隔离。工具步数默认仍不设上限。外部工具的依赖和授权照常检查。Windows-MCP、macOS 锁屏组件保留在对应系统；Ubuntu 不冒充能运行这些系统专用组件。

## 图形桌面手把手

1. 在 Ubuntu 已登录的桌面终端运行 Koder，使用当前普通用户。SSH 无桌面会话不能直接控制另一台电脑的桌面。
2. 检查发行版依赖；确实缺失时，由你审阅并执行：

   ```bash
   sudo apt-get install python3-gi gir1.2-atspi-2.0 at-spi2-core libsecret-tools gnome-keyring libnotify-bin
   ```

   Koder 不会自动执行这条安装命令，也不会提权。
3. 运行 `koder doctor --computer`。缺少 D-Bus、AT-SPI 或桌面会话时，会返回具体状态。
4. 运行 `koder permissions request --capability desktop`，按原授权流程确认；`--yes` 不代替电脑授权。
5. 打开要使用的应用，再要求 Koder 完成明确操作。Agent 先检查驱动，列出应用，读取目标控件树，再沿原审批调用控件。完成动作后重新观察目标状态。

这个驱动能操作应用暴露的可访问按钮、文本输入、选择、聚焦和滚动。它读取控件树，不是像素截图。密码控件内容不返回模型；旧快照不能重复操作。发生取消或结果不确定时保留 UNKNOWN，不自动重放。

纯画布、游戏、远程桌面图像、不提供无障碍控件的应用、登录界面和锁屏操作不在此驱动覆盖范围。可按既有流程使用已连接 Apps/MCP 或已授权浏览器通道。浏览器程序已安装不等于已经连接浏览器驱动；缺失时必须如实报告。

## 邮箱、后台与提醒

邮箱/GitHub/MCP 的受保护凭据继续使用原 Secret Service：需要 `secret-tool`、用户会话 D-Bus 和已解锁的密钥环。服务器缺这些条件时，不会偷偷改为明文保存，也不要通过 root 运行解决。

```bash
koder mail status
koder mcp list
koder apps list
koder permissions status
koder notifications status
koder notifications test task-done
koder activate
koder status
koder deactivate
```

`activate` 使用用户级 systemd，按支持的用户登录会话启动；不创建 root 服务或自动打开 lingering。邮箱监听和提醒继续受原邮箱权限、visibility、安静时段、日上限及去重账本管理。通知回执 `submitted` 只代表已提交，不能写成用户一定看见。无桌面的服务器返回 `NO_NOTIFICATION_SESSION`，CLI 其他能力仍可用。

## 验收怎么读

GitHub 的 `Ubuntu full runtime and accessible desktop` 流程检查完整包哈希、托管 Node 安装、重装保留配置、真实 GTK 控件输入/点击/结果观察，以及通知提交和无桌面降级。矩阵为 Ubuntu 24.04 x64/ARM64 × X11/Wayland。只操作专用测试应用，不连接真人邮箱。

本机 macOS 的 Linux 注入测试只是契约验证。真实矩阵结果以该次 GitHub run 的 `runtime.json`、`desktop.json` 为准；未运行的格子为 `NOT_RUN`，已经失败的记录保留 `FAIL`，不被后续通过结果覆盖。首个 0.5.8 草稿包实测发现 GI 文本接口同名冲突，导致输入框被跳过；修复采用明确的 Text 接口调用，并回归空输入框、文字标签与密码隐藏。请核对每次运行的安装包 SHA-256，区分修复前后的构建。Xvfb/无头 Sway 不能代替物理 GNOME 显示、用户重登/重启、全部显卡或所有应用。完整边界和官方系统维护来源见 [英文说明](UBUNTU.md)。

## 下载进度、模型等待与系统范围（0.5.12）

下载期间每 5 秒显示已下载 MB、已知总量与百分比、耗时和平均速度；随后明确显示校验、解压和激活。总大小未知时会注明，不伪造百分比。Ctrl+C 取消后保留可恢复的断点。

进入 Koder 后，模型尚未回复时每 10 秒显示等待状态。默认响应头上限为 180 秒；慢模型可在启动前运行 `export KODER_API_HEADERS_TIMEOUT_MS=600000`。超时不自动重复推理；已保存任务仍可恢复。

完整电脑范围需用户主动运行 `koder permissions request --mode full`，阅读范围后输入 `GRANT`。文件范围包含 `/`，但 Ubuntu 的用户文件权限仍有效；不能写的系统目录会明确拒绝。取消范围使用 `koder permissions revoke`。图形、浏览器和系统依赖仍需实际可用；安装系统包时由你在终端确认 `sudo`。
