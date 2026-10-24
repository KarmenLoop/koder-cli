# 常驻候选的分层验收

适用：0.4.3-candidate.2。使用专门测试用户与独立项目；不覆盖真实账号、正在运行的任务或原来的安装。结果须记录版本、OS、命令、退出码与可见结果。不要在日志中记录凭据。

## 本机隔离证据

本次测试使用真实回环 IPC、原 Core、脚本化模型、专用临时用户目录与独立 Node 子进程。包括两个并发默认窗口、显式会话拒绝抢占、前台审批拒绝、不授予电脑权限、交互选择、无头澄清上限、steer/cancel、断连取消、预览清理、私有身份过滤、提醒限额与 UNKNOWN 不重发。OS 服务命令与通知适配器使用隔离执行端口；这不等于实际登录自启或用户看到了通知。

## Windows 10/11 与 macOS：尚需实机

1. 专用测试用户安装候选，验证 `koder --version`；跳过常驻后，`koder status` 应为 activated=false。Windows 分别验证 CMD、PowerShell 5.1 和 PowerShell 7，以及无外部 Node 的冷安装。不要用 Windows Server 代替 Windows 10/11。
2. 运行 `koder activate`、`koder status`。确认当前用户的 LaunchAgent / 计划任务，状态 serviceManaged=true；再次 activate 不增加第二个宿主。关闭全部终端后新开终端，status 仍可达。
3. 注销再登录或重启测试系统，确认新宿主在线。记录实际 PID 与启动时间；只生成服务配置不算通过。Windows 任务应为 Limited，不需要管理员或全局改 ExecutionPolicy。
4. 两个窗口进入同一测试目录，分别运行任务，核对会话名与历史不混；取消窗口 A 不影响 B。对明确共享的 session 验证忙占用拒绝。
5. 用专用测试事项运行 `koder agentd follow <含时区日期> <说明>`，主动醒后核实系统通知确实出现；核对锁屏不泄露内容。安静时段非 urgent 不推，重复 wake 不重复通知，每日上限生效。当前通知点击续接仍 NOT_RUN/未接入，使用 status 提供的原会话信息继续。
6. 默认邮箱/日历/浏览历史不可见。后台邮箱须同时打开 agentd visibility 和原邮箱授权；真实账号只使用专用测试邮件，收到后主动问询但不代发。撤销权限后停止读取。Windows 客户端授权码输入、粘贴、退格、取消与 IME 仍须实机验证。
7. 安装下个专用测试版本，原任务运行时不可被覆盖；status 标记 updatePending。全部前台会话结束且 gateway 空闲后，OS 重启宿主，version 与安装记录一致。
8. `koder deactivate` 后服务停用并移除自启。再次登录不启动；再运行仍仅前台 CLI。若出现 CLEANUP_PENDING，保留现场与收据，不能强杀后算通过。

Linux 单独验证 systemd --user、桌面通知可用/不可用与登录生命周期。所有平台的真实 provider、gateway 私聊通知与 GUI 操作另列账号/设备证据。旧 Windows/MCP、真实模型与安装失败记录不会因为本表存在而关闭。

## 回退

先 `koder deactivate`，确认宿主停止；使用上一版官方安装入口恢复已验证版本。保留配置、项目历史和通知 UNKNOWN 收据。candidate.1 及公开 0.4.2 未被本候选覆盖。本候选没有自动注册开发机的服务或修改生产下载链接。
