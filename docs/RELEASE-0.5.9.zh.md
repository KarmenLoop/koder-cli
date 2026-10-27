# Koder CLI 0.5.9

内置 Personal Agent Growth 更新到 [0.4.3](https://github.com/KarmenLoop/personal-agent-growth/releases/tag/v0.4.3)。原生 Agent 任务默认加载经过哈希核验的方法节选，不再依赖用户说出“学习”等关键词。61 个原版核心资源均可通过 Skill 读取；记录版本、来源提交和实际加载范围。这是来源读取记录，不冒充模型工具调用或学习成功证明。

学习继续使用原有 Markdown 运行时。`learning_read pack` 增加字段类型示例和当前证据引用；参数错误给出恢复方法，仍检查作用域、版本及哈希。完成提案只进入待验证状态。资源中的 Python 宿主、SQLite 和脚本作为参考随包保留，不运行第二套宿主或创建另一套学习库。

小上下文优先保留完整的已保存约束与禁忌段落，再安排可省略的状态与历史；部分加载会明确标注，可通过 `learning_read` 读回省略部分。当前输入、未核实工具回执和模型输入/输出窗口仍受保护。续做普通代码任务时，原生只读 `delivery_check` 不再因为缺少建站关键词而被隐藏，避免工具目录说可用、实际模型却没有调用定义。冒号后明确写“只读”的续接请求不再误触发必须修改源码的门禁。

## 使用与开关

运行 `koder growth status`、`koder learning status` 查看内置方法和本地任务记忆。`koder growth off` 关闭该方法及学习入口；`koder learning off` 可独立关闭任务记忆访问。已有关闭选择、无记忆模式、账号/工作区/会话隔离继续生效。参见[学习教程](MARKDOWN-LEARNING.zh.md)及[方法融合说明](AUTONOMOUS-LEARNING.md)。

Windows、macOS、Ubuntu 24.04 使用同一完整运行包。执行 `koder update` 后，`koder --version` 应显示 `koder 0.5.9`。全新 Ubuntu 可能没有 `curl`，[Ubuntu 教程](UBUNTU.zh.md) 已补齐依赖安装和先下载再执行的步骤。安装与模型密钥不会作为学习记录保存。

## 验证边界

Release 附件 `ACCEPTANCE-RESULTS.json` 分别记录源码回归、实际压缩包、隔离升级和有界真实模型调用。保留此前参数写错、最后改动后未补验证、续做任务误走 Apps 的失败记录；不能把这些练习当盲测分数或所有模型必然正确调用的保证。

固定来源为 AGPL-3.0-only，许可证、署名和源码链接保留。模型/BYOK、预算、取消、审批及 UNKNOWN 对账沿用原机制。加载方法不独立增加模型请求、后台进程或默认多轮付费对照；正常任务推理仍按用户配置收费。

Windows、Ubuntu GNOME 实机和通知实际显示由设备验收分别记录；0.5.8 的 Ubuntu X11/Wayland CI 结果保留为基线，不冒充新版已跑结果。macOS 完整锁屏组件仍是未签名候选。本次只更新 GitHub，官网不改。
