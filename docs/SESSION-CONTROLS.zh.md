# 排队、切模型与思考强度

适用：0.4.14-candidate.1。此页随候选包提供；官网当前正式包的功能以其版本说明为准。

## 先分清两种清单

Todo 是当前任务的步骤，例如“读材料、写初稿、核对结果”。排队是接下来独立执行的任务，例如“然后写介绍”“再翻译成英文”。它们各有一行标题，不会互相替代。

默认输入方式是引导：Koder 工作时回车，把补充送入当前任务的下一安全模型步骤。若希望逐件做，输入 `/queue on`。之后发送的普通消息按先后顺序执行。界面显示“排队 N”，并预览最多三项；长文本截短显示，队列中的原文不变。

```text
/queue on             开启排队，并保存为后续会话的输入偏好
/queue                查看当前窗口的待执行任务
/queue remove 2       删除第二个待执行任务，不取消正在执行的任务
/queue clear --yes    清空待执行队列
/queue off            恢复引导模式
/input steer          同上；/input queue 切回排队
```

步骤练习：先发一个多步骤任务，工作期间输入 `/queue on`，依次发送两项后续任务，再运行 `/queue remove 1`。当前任务结束后，应只执行第二项。Esc 或精确的“停下”取消当前回合；队列清空和 Todo 清空是两个独立动作。排队文字不能替代工具审批答案。

## 在会话里切模型

1. 先在 `/setup` 配置两个模型，或用原有 `koder model set/add` 流程完成配置。选择器不接收 API Key。
2. 按 **Ctrl+P** 或输入 `/model`。上下键选择，Enter 确认，Esc 取消。已有草稿保持不变，不会因选择而发送。
3. 也可以输入 `/model <已配置名称>`，例如 `/model second`。这是保存配置的名称，不是随便填写一个服务商模型 ID。
4. 输入 `/model show` 核对当前模型和实际思考强度，再提交任务。

空闲时底栏立即更新；工作中切换显示“已选 X · 本回合仍用 Y”，底栏继续显示当前实际模型，并列出下回合选择。切换不取消当前工作、不重放已完成工具。选错名称时保留旧选择并给出可选名称。

快速选择只在本会话进程内有效；下次启动按项目或全局配置解析。`/model auto` 清除本会话模型覆盖。原有 `/model use <名称>` 仍是全局切换，两种用途在帮助中分别说明。

外部 ACP 引擎和 MOA 仍由各自配置决定模型；快捷选择器会明确提示 `MODEL_SELECTION_MANAGED`，不会假装已经切换。ACP 底栏显示引擎报告的实际模型，未报告时标明“模型由引擎管理”；MOA 显示其聚合模型。MOA 的思考强度逐个适配成员模型，底栏强度表示聚合模型的生效档位。

优先级：`-m <名称>` 或会话选择 → 项目 `.koder/config.json` 的 `activeModel` → 原用户全局配置。项目文件只引用已有配置，不复制密钥。

## 同一个模型，调整思考强度

**Ctrl+E** 默认按“标准 → 深度 → 快速 → 关闭 → 标准”循环。`/effort` 或 `/thinking` 打开选择器；也可直接使用 `/effort deep`、`/effort standard`、`/effort fast`、`/effort off`。

深度希望使用更多推理投入；快速希望减少投入；关闭请求服务商关闭扩展思考。这些是请求偏好，不能保证某个任务必然更快、更好或更便宜。切强度不会偷偷换模型。正在执行的回合保持原强度，新选择从下回合生效。

模型或协议不支持所选档位时，显示 `THINKING_EFFORT_UNSUPPORTED`，实际使用标准行为；底栏显示生效值。原配置已有专用推理参数且没有显式新选择时，显示“服务商默认”，保留旧参数。外部 ACP 引擎目前不接收本开关；不会把界面选择冒充服务端生效。

```sh
koder chat -m second --effort deep
koder ask "解释这段代码" --effort fast
```

强度优先级：本会话/命令参数 → 项目 `thinkingEffort` → 用户 `thinkingEffort` → `standard`。请求字段和元数据规则见 [协议适配说明](THINKING-EFFORT.md)。

## Setup 和紧凑布局

`/setup → 会话界面` 可配置底栏、Todo 展开、默认强度、Ctrl+E 循环或打开选择器，以及引导/排队方式。仍复用 `~/.koder-cli/config.json`（或 `KODER_CLI_HOME`）；不另读 `tui.toml`。

```json
{
  "sessionInputMode": "steer",
  "thinkingEffort": "standard",
  "tui": {
    "todoExpanded": false,
    "effortShortcut": "cycle",
    "statusLine": {
      "enabled": true,
      "items": ["model", "effort", "mode", "tasks", "tips"]
    }
  }
}
```

兼容别名 `status_line.items` 也写在同一 JSON 配置内；Setup 保存会同步两个表示。移除 `model` 或 `effort` 即隐藏该槽位，未知槽位告警一次。`/reload-tui` 重载显示偏好，保留当前会话和草稿。空列表、空队列均不占额外行；小终端先保输入，完整队列用 `/queue` 查看。

键位与 `/help` 共用同一张表：Enter 提交；Ctrl+J 换行；Esc 先关闭弹层、否则取消；Ctrl+T 展开 Todo；Ctrl+P 选模型；Ctrl+E 切强度；Ctrl+U 清空光标前输入；空行 `/` 打开预选，Tab 只填草稿。若终端占用了热键，用对应斜杠命令。当前未启用鼠标点击协议，不把终端底栏当成网页按钮。

## 开发者验收

`session-controls.mjs` 解析项目引用；`thinking-effort.mjs` 映射请求字段；`chat.mjs` 只在回合间更换绑定；`prompter.mjs` 拥有唯一 FIFO 和审批输入；`slash-menu.mjs` 复用同一菜单层；`session-dock.mjs` 拥有键位和显示规则。保留可见历史和工具回执，切模型时清除上一协议私有推理签名。

使用独立 HOME/工作区，运行：

```sh
TERM=xterm-256color node --test --test-concurrency=1 \
  test/session-controls.test.mjs test/thinking-effort.test.mjs \
  test/session-dock.test.mjs test/session-input-terminal.test.mjs
```

真实终端录制：`python3 test/fixtures/session-controls-pty.py "$(command -v node)" test/fixtures/session-controls-pty.mjs /已有证据目录`。夹具创建隔离目录，只使用脚本化 HTTP provider，不读取用户账户或发送真实请求。录制包含模型选择、强度、Todo、引导、FIFO 两项和帮助；原生 Windows/ConPTY/中文输入法、真实服务商参数与实际应用操作需另外验收。

继续阅读：[Todo 与输入基础](SESSION-DOCK.zh.md) · [CLI-Anything](CLI-ANYTHING.zh.md) · [180 课课堂](courses/index.zh.html)。
