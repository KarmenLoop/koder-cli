# Koder CLI 0.5.5

Koder 默认保存本地 Markdown 任务记忆，让持续进行的任务恢复先前决策、进度与下一步。本次结合 personal-agent-growth 0.4.1 方法，复用原 Agent、模型、工具、权限和会话生命周期。

## 从已保存的任务记录继续

首个符合条件的任务会为当前账号与工作区建立本地学习库。默认项目属于当前任务会话，因此同工作区的另一聊天不会自动读取这个任务的私有决策。重新打开原任务可召回相关记录；需要有意跨会话接续时，也可显式选择项目。

Markdown 文件记录目标、约束、检查点、决策和任务证据。原明确笔记与画像数据继续由原系统保存，不被新记录替换，不混合账号范围，也不把召回文本当成执行许可。

在需要检查的工作区运行：

```sh
koder learning status --json
koder growth status --json
koder learning off
koder learning on
```

状态显示当前范围的路径、初始化情况与实际开关，不创建新库。学习命令用 `--root` 选择库，Agent 任务用 `--learning-root`；所选根目录仍检查账号与工作区绑定。移动或共享库之前请先读[完整指南](MARKDOWN-LEARNING.zh.md)。

## 默认与关闭选择

成长方法与 Skills 启用时，本地任务记忆默认开启。已有 learning 关闭、growth 关闭、全部 Skills 关闭、单项 Skill 禁用或所选库关闭设置继续生效。重新打开 growth 不会抹掉单独的 learning 关闭选择。

Setup 显示同一单项与总开关。聊天中 `/learning off` 和 `/learning on` 从后续回合生效，不替换当前会话；关闭回合不挂载学习工具，也不捕获该回合任务内容。单次调用可用 `--no-learning` 跳过。关闭保留已保存文件。

这项默认不会代开偏好/画像学习、当天状态、主动消息、同步、技能演化或后台常驻，也不授予联网、外部账号、电脑工具、全局 Skill 安装或采纳权限。这些选项仍各自控制。

## 本地复盘与核实结果

有限本地复盘复用原 CLI 会话生命周期，在会话打开时或下次任务时运行，不额外调用模型，不注册新的操作系统调度器或后台服务。单独启用的 agentd 会话使用同一会话路径；打开学习不会激活 agentd。

模型通过原工具提出检查点或结果。完成主张在必要证据满足前保持 `pending_verification`，不能靠模型自评确认成功。未知用量与费用保持未知，不记为零。取消、学习库不可用/损坏或可选配置格式错误，不会授予回退写入或扩大范围；学习不可用时，原任务仍可继续。

原 Harness 经验记录和原生维护/采纳门保持。Markdown 笔记不会成为第二套权威经验库、执行器或全局 Skill 注册表。旧失败、基线比较与回退要求继续保留。

## 验证与分发

源码检查覆盖脚本化 Agent 的真实工具调用与后续召回、默认和关闭选择、聊天隔离、账号/工作区/自选根绑定、取消、库损坏、上下文边界、原笔记、迁移关闭选择及未知用量。上一版模型强度与有限输出续答覆盖保留。本地和脚本化检查不代表真实服务商或模型质量验收。

发行附件 [ACCEPTANCE-RESULTS.json](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.5/ACCEPTANCE-RESULTS.json) 分别记录源码检查、实际包执行及隔离安装升级结果；公开读回按同一安装包摘要核对。另见[功能与验收说明](../ACCEPTANCE.md)。旧失败和未验轨道继续披露。

Windows 保持 beta。Windows 10/11 原生安装、Console/ConPTY/输入法、Windows-MCP 图形操作、付费模型任务及真实账号写入仍为 NOT_RUN。未签名的 macOS 锁定组件保持 HOLD。法律文件和第三方权利不变。

原安装入口继续通过 GitHub Releases 提供，本次不改动或发布官网。原[会话操作](SESSION-DOCK.zh.md)与[模型强度/输出](MODEL-EFFORT-AND-OUTPUT.zh.md)完整指南继续保留。
