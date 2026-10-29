# Koder CLI 截图

[English](README.md) · [简体中文](README.zh-CN.md)

当前这组图片来自已发布的 macOS **0.5.21** 包，采集日期为 2026 年 10 月 30 日。运行包的校验值与官网清单一致。[采集记录与图片校验值](capture-0.5.21.json)。

| 界面 | English | 简体中文 |
| --- | --- | --- |
| 启动界面 | [English image](cli-start-0.5.21-en-dark.jpg) | [中文图片](cli-start-0.5.21-zh-dark.jpg) |
| 设置菜单 | [English image](cli-setup-0.5.21-en-dark.jpg) | [中文图片](cli-setup-0.5.21-zh-dark.jpg) |
| 第一课 | [English image](cli-learn-0.5.21-en-dark.jpg) | [中文图片](cli-learn-0.5.21-zh-dark.jpg) |

## 采集方式

程序在隔离的 macOS PTY 中运行，终端尺寸为 100 列、32 行，中英文各用独立配置，未填写服务商密钥。原始 ANSI 输出未经改写，交给 `@xterm/headless` 5.5.0 解析后，以 17 px Menlo 字体渲染为 JPEG。它们是终端输出的渲染图；你实际使用的终端可能有不同的字体间距和换行效果。

启动图通过 `koder banner --no-anim --lang zh`（英文为 `en`）采集静止后的开屏。设置图运行 `koder setup --lang zh`，在选择服务商前保存菜单画面，然后停止采集进程。课堂图运行 `koder learn 1 --os mac --lang zh`，在选择终端时取消。JSON 记录保留了各条命令及退出状态，也记明了设置菜单采集后强制结束进程的情况。

这组图片只展示上述三个界面，不代表全新安装、模型配置、真实模型任务、审批流程或动画验收。采集没有使用 API Key、账号登录或新的许可接受操作。

## 旧版图片

目录内原有的七个图片文件继续保留，方便历史链接使用。它们不属于 0.5.21 图集。当前 README 只引用上面的版本化图片，教程里原来的安装、Diff、审查和 TUI 配图已移除。
