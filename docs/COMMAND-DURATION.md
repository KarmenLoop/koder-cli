# 命令等待与后台服务 / Command waits and background services

适用范围：当前 Unreleased 修复。旧安装包仍沿用其已发布的策略；源代码通过测试不代表用户设备已经升级。

## 默认等待多久

新 shell 命令默认最多等待 **30000 秒（8 小时 20 分钟）**，包括构建、测试和软件安装。
这是最长允许时间：命令提前结束，Koder 会立即继续，不会空等 30000 秒。

本次修复同时处理模型传入 `timeout_ms: 3000` 或 `6000` 后命令被几秒截断的问题。
模型的旧等待提示不再覆盖用户设置；真正执行的期限必须先显示在审批中，再随回执保存。
不会在批准之后静默延长期限，也不会把以前的记住授权扩大成新的长时授权。

## 如何设置

1. 在 Koder 对话输入 `/setup`；系统终端可运行 `koder setup`。
2. 打开 **技能 / Skills → 任务 Harness（JIT）→ 命令等待上限（秒）**。
3. 输入 1–30000 的整数，例如 `600` 表示 10 分钟、`30000` 表示 8 小时 20 分钟。
4. 返回对话；重新进入会话后，新提出的 shell 审批采用保存的设置。正在执行及已批准的命令保持原期限。

使用现有配置体系时，对应字段为：

```json
{
  "taskExecution": {
    "commandTimeoutMs": 30000000
  }
}
```

这里是**毫秒**，Setup 页面是**秒**。配置字段允许 1000–30000000 毫秒的整数；不设置则默认 30000000。
保存设置会保留现有模型轮次及费用预算，不清空其他配置。

## 哪些限制仍会生效

- Esc / Ctrl+C 仍可取消交互任务；受控子进程按原流程停止和清理。
- 用户显式设置的 `--task-timeout` 是整个任务的总时限，剩余时间不足时优先于单条命令等待。
- 费用预算继续沿用原账本；延长 shell 等待不增加模型费用额度。
- 旧审批保存的期限保持不变；没有期限字段的旧审批仍按原 20 秒处理。
- 命令内部的 `curl -m 20`、测试脚本自己的 3 秒断言等独立期限不会被 Koder 改写。
- 模型请求、网络连接、健康检查和进程清理使用各自期限；没有一起改成 8 小时。

## 网站后台为什么不能只延长等待

`node server.js`、`npm run dev` 等服务正常情况下不会自己退出。若作为普通 shell
前台命令运行，即使延长到 30000 秒，Agent 也仍在等该命令退出，不能及时继续验证页面。

这类任务应使用现有 `workspace_preview discover/start`：先发现项目启动入口，经过原审批后
启动受管服务，等 HTTP 就绪并返回预览地址，再继续检查文件、接口及页面。服务仍由原预览生命周期
托管，停止预览时清理所属进程。不用 `start`、`nohup` 绕过控制，也不把“进程已启动”写成“网站已验收”。

可给 Agent 的任务示例：

```text
请启动这个项目的后台并继续检查接口和页面。使用 workspace_preview 托管服务，
等服务就绪后给我预览链接，再完成剩余检查。
```

服务自身启动失败、端口占用或就绪检查失败会报告具体原因；延长命令等待不能修好这些应用错误。

## 真正超时或取消以后

进程停止并不证明写入、发送或安装已回滚。若结果确实待核实，保留
`COMMAND_RESULT_UNCONFIRMED` 回执及只读核查，不自动重放未知副作用。
核对已有文件、日志和目标状态后，按 `/reconcile` 的说明处理，再继续未完成操作。
这类 exit 3 不是 API 断网，也不是没有启动过。

`TASK_STEP_LIMIT` 是用户设置的模型轮次上限，与 shell 超时不同；已有工具结果和文件保留。
`MAIL_CHECK_FAILED` 是后台邮箱检查问题，不取消前台任务；用 `koder mail doctor --json`
独立排查，不要把邮箱授权码贴进日志。

## English reference

New shell approvals default to 30,000 seconds. Setup can save a shorter owner policy;
legacy model `timeout_ms` hints cannot override it. The approved duration is shown before execution.
Existing approvals and remembered allow rules retain their original scope. Cancellation,
explicit task deadlines and cost budgets remain active. Trusted diagnostic adapters may still
use their own bounded execution deadlines.

Persistent website servers use the existing managed preview service. It returns after HTTP readiness,
leaving the Agent free to continue while the server stays owned. Network, provider and readiness
timeouts are independent. Real timeouts still require result verification before any retry.

## 验证边界

针对本改动的回归覆盖：新审批与实际执行期限、用户配置、Setup 持久化、取消、任务总时限、
费用预算和旧审批；三平台进程调用使用可控夹具与虚拟时钟，不能称为三平台真机运行 8 小时。
本机受管后台用真实 Node 服务验证延迟就绪后仍能继续任务；模型编排使用脚本模型，未代替真实模型验收。
Windows 10/11、PowerShell 5.1 和 Ubuntu 原生运行验收仍为 `NOT_RUN`。

历史记录保留：0.4.10 曾将普通命令设为 300 秒、直接安装设为 900 秒、模型可指定最多
1800000 毫秒。旧验证包括真实 45 秒 macOS 命令、虚拟 Windows 调用，以及当时在未修改
0.4.9 基线上存在的两项输入交互测试失败；这些记录不因本次修改被追认通过。
