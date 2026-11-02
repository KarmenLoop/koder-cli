# Koder CLI 界面截图

[English](README.md) · [简体中文](README.zh-CN.md)

这组 **0.7.2** 图片采集于 2026 年 11 月 2 日，来自已发布的 macOS 安装包。归档 SHA-256 与官网清单一致，采集时观察到的 200 个包内文件也逐一与归档匹配。[命令、退出状态及图片校验值](capture-0.7.2.json)。

| 界面 | English | 简体中文 |
| --- | --- | --- |
| 启动 | [英文](cli-start-0.7.2-en-dark.jpg) | [中文](cli-start-0.7.2-zh-dark.jpg) |
| 设置 | [英文](cli-setup-0.7.2-en-dark.jpg) | [中文](cli-setup-0.7.2-zh-dark.jpg) |
| 第一课 | [英文](cli-learn-0.7.2-en-dark.jpg) | [中文](cli-learn-0.7.2-zh-dark.jpg) |

## 采集方式

未修改的 CLI 在 100 列、32 行的隔离 macOS PTY 中运行，中英文使用独立配置，没有模型密钥或账号会话。真实 ANSI 输出由 `@xterm/headless` 5.5.0 解析，以 17 px Menlo 渲染。这是终端输出渲染图，不同终端的字体、间距与换行可能不同。

启动图使用 `koder banner --no-anim --lang zh`（英文为 `en`），展示动画停止后的画面。设置图使用 `koder setup --lang zh`，停在主菜单；第一课使用 `koder learn 1 --os mac --lang zh`，停在操作系统选择。截图完成后设置进程需要强制结束，记录保留退出码 `-9`；课堂进程取消后退出。没有执行新的许可接受。

图片仅展示这三个界面，不代表安装完成、模型配置、账号登录、模型任务、审批或动画通过验收。本次未采集 Windows/Linux 原生界面。

## 历史图片

[0.5.21 采集记录](capture-0.5.21.json)及更早素材保留用于历史链接。仓库当前 README 展示以上带版本号的 0.7.2 图片。
