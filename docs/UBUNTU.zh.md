# Ubuntu 24.x 完整版使用说明

Ubuntu 与 Windows、macOS 使用同一份完整 Koder CLI 运行包，不是精简版。0.5.8 补入 Linux AT-SPI 图形控件驱动，沿用现有 `computer_*` 工具、电脑授权和执行审批。

适配目标包括 Ubuntu 24.04 LTS 的 24.04.x 点版本及 24.10，架构为 x64/ARM64，桌面通道覆盖 X11/Wayland。24.10 已于 2025-07-10 停止 Ubuntu 官方维护；兼容不等于恢复系统安全支持。新设备优先使用 24.04 LTS。不同点版本的内核、显卡及所有 Ubuntu 衍生桌面没有逐一认证。

## 安装、升级和完整功能

从 [0.5.8 GitHub Release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.8) 下载并检查 `koder-cli.sh`，执行 `bash koder-cli.sh`，再运行 `koder --version`、`koder setup`。安装器可以在用户目录准备 Node，无需全局 npm。旧版本使用 `koder update`；安装和升级保留配置与工作区。

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

GitHub 的 `Ubuntu full runtime and accessible desktop` 流程检查完整包哈希、托管 Node 安装、重装保留配置、真实 GTK 控件输入/点击/结果观察，以及通知提交和无桌面降级。矩阵为 24.04 x64/ARM64 × X11/Wayland，并在隔离容器补 24.10 用户空间。只操作专用测试应用，不连接真人邮箱。

本机 macOS 的 Linux 注入测试只是契约验证。真实矩阵结果以该次 GitHub run 的 `runtime.json`、`desktop.json` 为准；没有成功回执的格子仍为 `NOT_RUN`。Xvfb/无头 Weston 不能代替物理 GNOME 显示、用户重登/重启、全部显卡或所有应用。完整边界和官方系统维护来源见 [英文说明](UBUNTU.md)。
