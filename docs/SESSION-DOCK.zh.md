# 会话 Todo、常驻输入与紧凑底栏

适用：Koder CLI 0.4.13 及后续版本。先运行 `koder update`，再用 `koder --version` 核对；旧版只修改配置不会获得这些界面变化。

0.4.14-candidate.1 增加模型/强度选择器和独立队列操作，见[逐步教程](SESSION-CONTROLS.zh.md)。候选功能不代表已进入官网正式版。

当前源码的 Todo 依赖、分页、默认不限模型轮数和共享费用预算见[任务编排指南](TASK-ORCHESTRATION.zh.md)。以下旧版本信息描述界面来源，不代表已安装旧包含有本次增量。

## 默认界面

有任务清单时，输入上方只占一行：`Todo 1/3 · Ctrl+T 展开`。没有清单就不占行。输入行下方保留一行模型、状态与快捷键提示，不绘制厚边框或重复的“你”分隔条。

```text
Todo 1/3 · Ctrl+T 展开
koder › 补充：先验证数据，再写结论
实际模型 id · 工作中 · Enter 引导补充 · Esc 打断
```

Ctrl+T 展开/收起；窄终端保留摘要。展开面板最多占六行，防止挤走对话和输入；当前执行项高亮，剩余条目用 `/todo`、`/todo 2` 等分页查看。展开后可用 PgUp/PgDn 或 `/todo next`、`/todo prev` 切页。屏幕过矮或草稿折行时优先保留输入。

## 第一次使用

1. 启动 `koder chat`。未配置模型时底栏显示“未配置 · /setup”；打开 `/setup` 完成原有模型配置。
2. 提交多步骤任务，例如“先检查这个目录，列出待办，再修改并验证”。内置 Agent 可调用 `todo_set` 创建清单，简单问答不强制创建。
3. 在模型回复或工具运行时继续输入。默认 Enter 引导当前任务；显示接收回执后，会在下一安全模型步骤使用补充，不重放已完成工具。
4. 输入 `/help` 查看快捷键；上下/PgUp/PgDn 翻页，Esc、q 或 Enter 关闭。工作中也可以打开帮助。
5. `/todo toggle` 可替代 Ctrl+T。`/todo clear` 要求新输入的 yes；`/todo clear --yes` 只跳过清单清空确认，不授予文件、电脑、邮件或执行权限。

“已接收引导”不代表正在传输的模型请求已被改写。原执行器拒绝时显示原因码；未知远端回执不自动重发。普通斜杠命令工作中按原队列执行，`/help` 和 `/todo toggle` 是即时界面操作。

## 键位

| 输入 | 作用 |
| --- | --- |
| Enter | 空闲发送；工作中按引导/排队模式提交 |
| Ctrl+J | 插入换行；终端必须能区分 LF 与 Enter 的 CR |
| Esc | 先关菜单/帮助；没有弹层时取消当前回合 |
| Ctrl+C | 工作中取消；空闲清空输入，再按一次退出 |
| Ctrl+D | 空输入退出 |
| Ctrl+T | 展开或折叠 Todo；不改草稿 |
| Ctrl+P | 选择已配置模型；工作中切换在下回合生效 |
| Ctrl+E | 标准 → 深度 → 快速 → 关闭；Setup 可改为选择器 |
| Ctrl+U | 清空光标前输入 |
| ↑ / ↓ | 浏览输入历史；菜单内移动选择 |
| 空输入按 / | 打开建议、模板与命令 |
| Tab | 菜单填入可编辑草稿，不自动发送 |

若终端把 Enter 与 Ctrl+J 编成同一个字节，需在终端设置中区分，或粘贴多行文本。没有承诺 Shift+Enter、Ctrl+S 等未实现热键。Windows 终端占用 Ctrl+T 时使用 `/todo toggle`。

审批暂时独占输入。之前排队的任务、未发送草稿与清单均不能批准写操作。停止词与“停下，改做 X”的原取消/FIFO 规则保持。

## Setup 与配置

`/setup → 会话界面` 可开关底栏、默认展开状态，选择默认/简洁/项目三种槽位顺序。`/setup → 回答中的输入方式` 仍负责引导或排队。

复用现有 `~/.koder-cli/config.json`（或 `KODER_CLI_HOME`），没有新增第二个配置文件：

```json
{
  "sessionInputMode": "steer",
  "tui": {
    "todoExpanded": false,
    "statusLine": {
      "enabled": true,
      "items": ["model", "effort", "mode", "tasks", "tips"]
    }
  }
}
```

可选槽位：`model` 实际模型、`effort` 实际思考强度（0.4.14 候选新增）、`mode` 当前状态、`tasks` 已排队数量、`tips` 快捷键、`cwd` 工作目录、`context` 上下文。上下文计量缺失时明确显示未知，不编造百分比。本增量不添加 goal/git 槽或执行自定义状态栏命令。

修改后输入 `/reload-tui`，对话和未发送草稿保持。未知槽位跳过并在本窗口告警一次。`items: []` 隐藏底栏内容；移除 tips 后不显示轮播。空闲无草稿时约十秒换一条提示，输入或工作中不轮换。

模型读取原配置解析路径：会话/命令覆盖、项目、用户配置继续由原 resolver 决定。成功 `/model use <name>` 后刷新；失败保持原值。运行时采用当前会话实际 provider 的 modelInfo，不把磁盘默认模型冒充本轮模型。

## 数据、恢复与取消

`todo_set` 没有 64 项总数上限。它支持整表替换、`upsert` 增量修改、删除、重排、依赖调整、重规划和分页读取。每项保留稳定 id、单行标题、状态、`dependsOn`、优先级、顺序、负责人、备注及创建/更新时间；列表有 `revision` 和 `revisedAt`。版本冲突、缺失依赖和循环依赖会被拒绝，不把较新的计划静默覆盖。符号固定：

- `[ ]` pending，待办。
- `[>]` in_progress，执行中。
- `[x]` completed，Agent 已标完成。
- `[-]` cancelled，已取消。
- `[!]` blocked，等待明确输入或条件。
- `[x!]` failed，步骤执行失败。

清单保存在原会话记录，与工作区、会话名和多窗口租约保持同一隔离边界。重新进入同一会话会恢复；显式 `--session <name>` 恢复指定窗口。取消将执行中项改回待办，已完成项保留；中断恢复同样回到待办。当前产品没有 /undo，本增量不添加文件回滚或伪装撤销。

勾选是计划状态，不能代替真实工具回执。后台 agentd 使用原认证 IPC 推送清单；读取/清空也走所属会话，不能本地假清空或影响另一窗口。旧记录缺少 todo 时按空列表兼容。

## 开发与验收

数据入口为 `kernel/harness/session-todo.mjs`，现有 host 注册工具，turn 发出 `type: "todo"`，原 memory 持久化；前台和 agentd 共用。非 TTY / `--json` 不渲染底栏，NDJSON 可收到结构化 todo 事件。`--no-memory` 不落盘。

使用独立配置目录和测试工作区运行：

```sh
TERM=xterm-256color node --test --test-concurrency=1 \
  test/session-todo.test.mjs test/session-dock.test.mjs \
  test/session-input-terminal.test.mjs test/slash-menu-terminal.test.mjs \
  test/agentd.test.mjs
```

macOS/Linux 可用自有 PTY 夹具录制真实 CLI：`python3 test/fixtures/session-dock-pty.py "$(command -v node)" test/fixtures/session-dock-pty.mjs /绝对路径/已有证据目录`。它创建独立临时 HOME，使用脚本化 provider，不用真实账号或外网，不安装 OS 服务；限时后只关闭自身子进程。

逐项手测：检查空/有 Todo、Ctrl+T 保留草稿、流式中引导/取消/排队、审批不吃排队文本、/ 菜单与帮助、模型成功/失败/未配置、Setup 往返、重载配置、缩窄/折行、同会话恢复和多窗口隔离。Windows Console/ConPTY/中文输入法仍须实机验收；本地 PTY、假 TTY 与 loopback IPC 不代表这些平台已通过。真实模型是否主动创建合理清单和质量评分也另验。
