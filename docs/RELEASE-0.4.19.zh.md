# Koder CLI 0.4.19：内置 SolidCraft 参数化 CAD

本版通过 GitHub 发布 Windows x64 与 macOS Apple silicon/Intel 安装入口、运行包、更新清单和教程。不修改或部署官网。

## 新增能力

- 随包提供 SolidCraft 0.23.0 原始 CLI、固定校验清单和许可证，不运行上游安装器，不改其他 AI 客户端配置。
- 项目目录内运行 `koder cad enable` 开启；`status / verify / test / disable` 可查看、校验、连接测试和关闭。Setup 和对话中的 `/cad` 同样可用。内置 Skill 默认可见，可独立关闭。
- 建模沿现有 Core、MCP、BYOK、审批、取消和费用预算执行。每轮独立无界面模型，多个任务不会共用模型状态；本轮保存 `.solidcraft`，下轮明确打开继续编辑。
- Skill 按需读取真实工具参数和上游建模资料，执行后测量并保存可编辑设计与所需 STEP、STL、PNG 等文件。CAD 交付检查核对实际文件与修改后的测量，不再误要求编程测试。失败或未知修改会使旧测量失效，不自动重放。
- 临时 MCP 由当前任务持有，其他窗口不能调用，关闭后清理，Core 重启不擅自恢复未保存设计。修复发现工具时重复握手的并发问题；未确认退出仍保留未确认状态。

## 安装和第一件作品

从 [GitHub 0.4.19](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.19) 下载对应安装脚本；近期版本可运行 `koder update`。重新打开终端，用 `koder --version` 确认 `0.4.19`。旧更新器若因包大小拒绝清单，使用当前安装器覆盖升级一次，不清除用户配置。

在独立项目运行 `koder cad enable`、`koder cad verify`、`koder cad test`，再进入 `koder`。完整例子见 [SolidCraft 手把手教程](SOLIDCRAFT.zh.md)：20 × 10 × 5 mm 参数板、1,000 mm³ 测量、设计保存与导出，以及下一轮修改至 1,500 mm³。原有课堂、邮箱、GitHub、Skill、多窗口和不限默认工具轮次均保留。

## 验证范围

Apple silicon Mac 已用真实 SolidCraft 和原 Core 执行建模、测量、保存、重开修改、STEP/STL 导出和 CPU 截图。模型输入使用脚本，不能据此宣称真实模型质量提升。两个并行任务分别建模和测量不同尺寸；另测审批拒绝、撤权、项目外保存拦截、包校验与 Core 生命周期。

Windows x64、Intel Mac 的程序已随包并校验，目标设备运行仍为 **NOT_RUN**，由 beta 专员测试。Linux 未内置 SolidCraft 程序，可显式配置兼容的已安装程序。复杂曲面、装配、全部上游操作和制造精度未获这些简单零件测试证明。单次 MCP 调用仍保留 180 秒预算、取消和 UNKNOWN 回执。

既有真实账号、GUI、系统通知和未签名 macOS 锁屏组件未验项继续保留。早期失败记录不抹去。[上游许可证](../licenses/solidcraft/NOTICE) 与 Koder 自有许可分开。回退使用 [0.4.18 固定发行版](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.18)，保留项目和未确认操作回执。
