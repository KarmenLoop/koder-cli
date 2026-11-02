# Koder CLI 界面截图

[English](README.md) · [简体中文](README.zh-CN.md)

这组 **0.8.4** 图片采集于 2026 年 11 月 3 日，来自已发布的 macOS 安装包。归档与冻结发行记录及产品负责人完成校验的公网下载一致；采集时观察到的 202 个包内文件也逐一与归档匹配。[命令、退出状态及图片校验值](capture-0.8.4.json)。

| 界面 | English | 简体中文 |
| --- | --- | --- |
| 启动 | [英文](cli-start-0.8.4-en-dark.jpg) | [中文](cli-start-0.8.4-zh-dark.jpg) |
| 设置 | [英文](cli-setup-0.8.4-en-dark.jpg) | [中文](cli-setup-0.8.4-zh-dark.jpg) |
| 第一课 | [英文](cli-learn-0.8.4-en-dark.jpg) | [中文](cli-learn-0.8.4-zh-dark.jpg) |

## 采集方式

未修改的 CLI 在 100 列、32 行的隔离 macOS PTY 中运行，中英文使用独立配置，没有模型密钥或账号会话。真实 ANSI 输出由 `@xterm/headless` 5.5.0 解析，以 17 px Menlo 渲染。这是终端输出渲染图，各终端的字体、间距和换行可能不同。

启动图使用 `koder banner --no-anim --lang zh`（英文为 `en`），展示动画停止后的画面。设置图使用 `koder setup --lang zh`，停在主菜单；第一课使用 `koder learn 1 --os mac --lang zh`，停在操作系统选择。截图完成后设置进程需要强制结束，记录保留退出码 `-9`；课堂进程取消后退出。沿用与当前协议一致的既有接受记录，没有执行新的许可接受。

图片仅展示以上三个界面，不代表安装、模型配置、登录、模型任务、审批或动画已经通过验收。本次未采集 Windows/Linux 原生界面。

## 历史图片

[0.7.2 采集记录](capture-0.7.2.json)、[0.5.21 采集记录](capture-0.5.21.json)和对应图片保留供历史链接使用。当前 README 展示 0.8.4 图片。
