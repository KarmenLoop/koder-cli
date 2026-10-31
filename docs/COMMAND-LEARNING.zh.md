# 在 Koder 内选择学习内容

此页对应新增的命令教学功能。已安装版本若没有教学选择页，请先核对 `koder version` 和该版本更新说明；阅读新文档不会给旧安装包增加功能。

## 先分清输入位置

| 位置 | 输入什么 | 作用 |
| --- | --- | --- |
| Windows PowerShell、CMD、macOS 或 Ubuntu 终端 | `koder learn` | 打开教学模式 |
| 已进入 Koder，看到 `koder ›` | `/learn` | 打开同一个教学模式 |
| Koder 设置 | `/setup` → 互动教程 | 选择学习内容 |

不用为命令讲解配置模型。讲解在本机读取，不调用付费模型，也不会自动执行其中的示例。部分原有课程会在临时练习场演示真实文件修改和命令，仍保留逐次审批；外部作业需另行操作。

## 选择想学的内容

打开 `/learn` 后输入编号：

1. **/ 命令教学**：查看每个会话命令的作用、输入格式、例子、预期结果和注意事项。
2. **按课程主题选择**：先选单元，再选具体课。可学习基础操作、模型与上下文、编程调试、网站前端、后端数据、测试与 CI、专业写作、办公邮件、Skills/MCP、GitHub 发布等内容。目录沿用原有 120 个单元、1800 课。
3. **按关键词搜索课程**：例如输入“网站”“邮件”“权限”，从匹配的课程标题中选择。
4. **继续上次**：回到保存的课号；首次使用从基础课程开始。
5. **从第 1 课重新学习**：重新进入基础训练营。

目录每页最多 12 项。输入显示的编号选择；`n` 下一页、`p` 上一页，输入关键词筛选，`*` 清除筛选，`b` 返回，`q` 退出。没有匹配时会提示，可换关键词，不会静默退出。命令目录还接受 `/queue` 等命令名或别名。

选定课程后可以选择 **手把手操作**、**开发者原理与验收**、**全部内容**或**原教练速览**。进入课程后，回车继续后续课程，数字跳课，`b` 上一课，`q` 保存课号并退出。不会重新编号课程；仅浏览命令目录不会改变课程进度或标记毕业。

中文教学覆盖原有课程；第 31–1800 课目前主要为中文。切到英文界面不等于这些课程已经翻译。

## 学一个具体命令

在 Koder 内输入：

```text
/help queue
/learn /queue
/learn commands
```

前两条讲解 `/queue`，第三条打开命令学习目录。这些是查看说明，不会开启排队。

`/queue` 的实际用法：

| 命令 | 执行后的作用 | 应核对什么 |
| --- | --- | --- |
| `/queue list` | 查看尚未开始的消息 | 顺序、预览文字，或空队列提示 |
| `/queue on` | 后续忙时输入按 FIFO 排队 | “已开启排队”提示 |
| `/queue off` | 后续忙时输入恢复引导 | 引导模式提示；当前任务不被取消 |
| `/queue remove 1` | 移除第 1 条待执行消息 | 已移除提示与剩余队列 |
| `/queue clear --yes` | 清空待执行消息 | 清空提示；已执行工作不会撤销 |

阅读此表不会运行任何操作。需要实际使用时，先退出教学，再在 `koder ›` 后输入选定的命令。

建议按需要学习：

| 需求 | 查看教学 |
| --- | --- |
| 不打断任务，补充要求或排队 | `/help queue` |
| 切换模型、查看官方支持的强度 | `/help model`、`/help effort` |
| 制定目标、步骤和查看进度 | `/help goal`、`/help plan`、`/help todo` |
| 先填草稿再发送 | `/help prefill` |
| 查找技能、为后续任务指定技能 | `/help skills`、`/help skill` |
| 绑定邮箱、排查收发与提醒 | `/help mail`、`/help notifications` |
| 连接应用或 MCP、核对电脑授权 | `/help apps`、`/help mcp`、`/help permissions` |
| 查看错误或待核实回执 | `/help error`、`/help reconcile` |
| 更新、设置、迁移 | `/help update`、`/help setup`、`/help migrate` |

完整清单来自当前 CLI 的会话命令注册表，`/` 菜单、`/help` 和命令教学使用同一份清单。`/input` 是 `/queue` 的别名，`/thinking` 是 `/effort` 的别名；`/steup` 保留为 `/setup` 的兼容别名。

`/skill` 选择后续任务的技能，`/skills` 管理技能目录；`/learn` 教用户使用 CLI，`/learning` 管理 Agent 的本地任务学习，两者不同。

## 开发者、脚本和无头环境

以下命令在系统终端输入，不是 Koder 对话正文：

```sh
koder learn commands --print
koder learn /queue --print
koder help /harness
koder learn topics --print
koder learn search 邮件 --print
koder learn 76 --track developer --print
koder learn 4 --track hands-on --os powershell
koder learn /effort --lang en --print
```

`--print` 和无终端路径不弹选择器。`koder learn --print` 保留输出完整教程的旧用法；指定课号或命令可减少输出。`--os` 支持 `powershell`、`cmd`、`mac`、`linux`，默认按系统和已保存选择讲解。

在聊天中用 `/help harness` 学会话语法；例如直接 `/harness deep-research`。系统终端的 `koder help harness` 则说明 CLI 子命令，两种输入位置不要混用。

## 工作中学习与权限

- 正在执行任务时输入 `/learn`：显示排队提示，任务结束后打开教学，不把教学指令当作模型补充。
- 教学菜单、练习题和审批只接收提示出现后的新输入；原有排队任务留在队列中，退出教学后继续，不会被当成菜单答案。
- `/help queue` 等只读说明可在忙时查看；Esc、取消和原队列机制继续生效。
- 学习不发送邮件、不绑定账号、不打开权限、不更换模型、不重放待核实操作，也不自动上传日志。
- `/reconcile checked <call-id>` 记录人工核对，不保证结果已经由工具验证；先核对真实产物再使用。
- 教学中的真实模型、外部服务或发布练习仍可能产生费用，执行时沿用原权限和预算限制。

本功能的自动化验证使用隔离目录、脚本教练和模拟终端；原生 Windows/Ubuntu 的交互外观仍需相应设备验收。命令说明不代表所有服务或账号已连接成功。
