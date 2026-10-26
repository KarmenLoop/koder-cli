# Koder CLI 0.5.1

可在 Setup、`koder context` 或聊天中的 `/context` 设置上下文窗口与自动压缩。Windows 和 macOS 安装入口使用同一份更新运行包。

## 本版新增与修复

- 设置模型窗口和输出预留，保留原模型凭据，并尊重项目、会话选中的模型。
- 自动压缩默认开启：80% 触发、60% 软目标、优先保留最近四轮。可分别调整，也可关闭。
- 主会话、后台 agentd、子 Agent 和多模型顾问使用同一策略；修复子任务提前裁剪、顾问固定截短绕过设置的问题。
- 当前指令与中途引导保留在同一任务里。未确认结果和未完成调用受到保护；完整返回的签名组仅在硬窗口不足时整组转换为可见回执引用，不混用改写文本与旧签名。完整历史继续留在本地。
- `/context status` 展示上次请求估算，JSON 提供压缩统计。关闭压缩后，超出实际窗口会在本地明确报错，不静默删除历史。

## 使用

```sh
koder context status
koder context set --trigger-percent 85 --target-percent 65 --keep-turns 6
koder context off
koder context on
```

窗口需按服务商真实支持值设置。`context reset` 只重置压缩偏好，不重置模型、密钥或 Headroom。[手把手教程](CONTEXT-CONTROLS.zh.md)。

## 验证边界

发布附件按源码、打包运行、安装升级分别记录结果。本地模型请求检查使用脚本模型和 HTTP 测试服务，不等同于真实付费模型的长上下文质量评测。Windows 实机继续由 beta 专员验收；本版不新增宣称邮件账号、外部写入、Windows/Linux 通知显示已全平台验证。macOS 锁屏组件仍保留未签名候选。

原权限、BYOK、项目隔离、取消和可选费用预算保留。Headroom 是独立的可恢复工具结果优化；外部 ACP 引擎仍管理自身上下文。本轮只同步 GitHub，不修改官网。
