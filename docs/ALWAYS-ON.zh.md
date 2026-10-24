# 常驻激活与主动提醒

Koder 0.4.3 提供可选的本机常驻宿主。一次明确选择后，关掉终端也可继续接收已授权的消息和提醒；电脑需保持开机，并已登录用户会话。关闭、休眠或断网期间不保证实时到达。本版没有改动电脑授权、EULA、模型计费、项目历史与 Skills 的原有规则。

## 开启、查看和关闭

```text
koder activate
koder status
koder agentd doctor
koder agentd logs
koder deactivate
```

`activate` 注册当前用户的登录启动项并立即启动。重复执行会检查同一受监督宿主，不另起重复服务。开发调试的手动 `agentd serve` 不算登录自启，需先停止手动宿主后再 activate。`deactivate` 先请求原 Core 取消任务并清理，再删除自启配置。清理未完成会返回 `AGENTD_CLEANUP_PENDING`；无法核实活跃宿主时返回 `AGENTD_OWNER_UNREACHABLE`，不按一个旧 PID 强杀进程。

安装结束会推荐开启，交互终端输入 `activate` 才接受；回车跳过不影响 CLI。自动安装可明确设置 `KODER_ACTIVATE=1`。EULA 接受、`--yes` 或安装本身都不会代替这个选择。跳过后，可从 Setup 的「常驻与主动提醒」开启。

- macOS：用户 LaunchAgent，在图形登录后运行。
- Linux：`systemd --user`，在用户会话启动后运行；不自动开启 linger 或 root 服务。
- Windows：当前用户登录触发的计划任务，`Limited` 权限；不要求管理员，不修改全局执行策略。无 Node 冷启动仍由原安装器准备私有运行时。

这些是已实现的服务适配，不代表全部平台已通过登录、重启和桌面验收。验收状态见文末。

## 前台与后台是一条执行链

激活后，`koder`、`koder chat`、`koder run` 和 `koder ask` 通过带随机凭据的本机回环 IPC 连接 agentd。凭据只保存在受本机访问隔离保护的目录中，不进入状态输出。daemon 仍调用原 `createSession`，沿用模型/BYOK、JIT Profile、通用 App Skill、审批、取消和历史隔离；没有第二个执行器或记忆数据库。

两个窗口可以同时工作。同一目录的第二个默认窗口会得到独立会话名；显式指定同一个 `--session` 时仍拒绝抢占。前台关闭会取消该窗口的当前任务；不会偷偷把交互任务改成无人值守任务，也不会重放发送、部署等不确定副作用。其它窗口与 gateway 继续工作。当前聊天的 `/preview` 与 `/visuals` 调用后台所属会话，完全停用宿主时才清理其预览服务。

审批仍显示在发起任务的窗口。`--yes` 的原范围不变，不代开电脑、邮件、学习权限。默认 steer 与可选 queue 不变。激活但宿主不可达时给出明确错误，不偷偷启动第二套前台执行器。

首次激活前已有手动 gateway 运行时，会返回 `MANUAL_GATEWAY_RUNNING`，不注册第二个后台、不抢占或终止它。先运行原 `koder gateway stop`，确认原任务清理完成，再 activate。若旧版进程在常驻期间另行启动手动 gateway，status 会报告冲突；先 deactivate，再停止旧手动 gateway、重新 activate，不按来源不明的 PID 强杀。激活期间 `koder gateway start|stop` 控制宿主中的 gateway，不杀整个 daemon。

正式安装器写入新版本后，常驻启动入口读取原安装记录；前台窗口全部结束且 gateway 可安全停止时，宿主退出以让 OS 重启到该版本。`status.updatePending` 表示还有窗口或任务需结束，未即时覆盖运行中的任务。

## 主动提醒的规则

默认每 30 分钟醒一次，每天最多尝试提醒 8 个事项，23:00–08:00 安静。醒来检查当前有关联的事项，再决定提醒或保持沉默。不会每到时间就推送固定新闻列表。

默认可见：已进入过前台会话的项目记忆。默认不可见：邮箱、日历、浏览历史和任意磁盘目录。切换账户/记忆空间、撤销来源或移除记忆后会重新核实范围。当前支持：

1. 原会话持久记录中断的任务：提醒回到原会话核对，不自动继续有副作用的操作。
2. 显式跟进事项：存入原记忆 notes，按时间与相关性判断。
3. 明确跟踪的公开 URL：经原 network 授权、匿名公共网页检查读取，每次至多 3 个、每页至多 8 秒。来源变化只表示需要复核，不会谎称原结论一定错误。
4. 已授权邮箱：Setup 打开后台邮箱可见性后，复用原邮箱账号、IMAP/POP 增量游标、问询与回复门控；后台唤醒只收信问询，不自动代发回复。

日历、浏览历史和文件通配符的采集适配目前未接入，状态会列出 `unavailableSources`，不会装作已经读取。仅在存在可核对的前后证据时，自纠事件才有资格通知；本版不把模型自评或一个网页内容变化认作已证实的自我纠错。

```text
koder agentd follow 2026-10-25T09:00:00+08:00 明天核对项目验收结果
koder agentd watch-url https://example.com/help 跟进该帮助页的变化
koder agentd proactive off
koder agentd proactive on
koder agentd wake
```

这两类关注写入当前项目的原记忆 notes，可用 `koder memory show` 查看、`koder memory remove <id>` 取消。共享 notes 的原显式共享语义不变。需要独立命名时添加 `--session <name>`。安静时段的事项会留待后续唤醒，不把定时唤醒等同于用户批准。

## 通知、邮件与继续处理

原生系统通知隐藏私人正文，仅提示有事项需要处理。macOS 使用系统通知，Windows 使用 Toast，Linux 使用 notify-send；无桌面会话、程序缺失、权限拒绝和结果不明会如实记录。

`submitted` 只表示通知程序接受了调用，**不证明用户看见了通知**。本版尚不支持可靠的通知点击回到会话。看到通知后运行 `koder status`，按 `resume.workspace` 与 `resume.session` 回到原项目；邮件使用 `koder mail inquiries` 查看，再选择、编辑、确认发送。

原生通知明确不可用时，可选择向自己已配对的 gateway 私聊发送一条通用提醒：

```text
koder agentd self <platform> <userId> <chatId>
```

必须先用原 gateway pairing 配对，并在本次连接中收到过该私聊消息。不会猜测哪个联系人是你，也不会向群聊广播。通知采用顺序降级：已提交或结果不明时不再发第二个渠道。派发前记录去重与每日预算；结果 `UNKNOWN` 不自动重试，避免重复打扰。

## Setup 与配置

Setup →「常驻与主动提醒」可开关常驻、主动提醒、记忆与邮箱可见性，设置唤醒间隔、每日上限和安静时段。Skills → JIT 与通用应用开关保持原位置，各自独立。

```json
{
  "agentd": {
    "activated": false,
    "proactive": {
      "enabled": true,
      "wakeMinutes": 30,
      "quietHours": ["23:00-08:00"],
      "maxPushesPerDay": 8,
      "minScoreToNotify": 0.7,
      "channels": ["os-notification", "gateway-dm-self"]
    },
    "visibility": {
      "memory": true,
      "calendar": false,
      "mail": false,
      "browserHistory": false,
      "filesystemGlobs": []
    }
  }
}
```

`activated` 初始为 false；显式 activate 后写为 true。更改配置不会替代 OS 服务注册。关闭主动提醒不会停掉已经配置的 gateway；完全停用请运行 `koder deactivate`。

## 成本与限制

定时评分本身不调用模型；只使用有依据的本地事件。URL 检查消耗网络，邮箱检查使用现有邮箱授权。后续前台任务、gateway 对话仍按你选择的模型收费。教程和网页是外部资料，不是权限或命令来源。

本机回环 IPC 限制单帧 8 MiB、同时连接 32 个。过大的会话输出会明确失败并保留原历史；不静默截断持久记录。守护进程不可达或存储隔离无法确认时不降级泄露凭据。

本版验证包括真实本地 IPC、原 Core 的 JIT/审批、断开取消、多窗口隔离、无终端子进程与受控退出，以及通知与服务计划的隔离端口测试。**未验**：Windows 10/11 登录/重启/原生 Toast、Linux systemd 登录、macOS 实际 LaunchAgent 注册与通知可见性、真实第三方账号与模型。没有向本机注册自启或发送真实通知来替代这些验收。

官方平台参考：[Apple LaunchAgents](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html)、[Microsoft 登录触发任务](https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/new-scheduledtasktrigger)、[systemd 服务](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)。

逐项实机步骤见 [常驻验收清单](ALWAYS-ON-ACCEPTANCE.zh.md)。
