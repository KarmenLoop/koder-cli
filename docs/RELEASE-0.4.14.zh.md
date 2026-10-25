# Koder CLI 0.4.14

本版将已固定的 0.4.14 候选增量上线到 Windows 与 macOS 安装入口。现有 180 课保持原样，1800 课扩写按用户要求暂缓。

## 本版变化

- Ctrl+P 选择已保存模型，Ctrl+E 调整思考强度。执行期间的选择下一回合生效，底栏区分当前与待生效设置；服务商不支持的参数会明确提示。
- `/queue on`、`/queue remove N`、`/queue clear --yes` 管理独立后续任务；清单与排队分开，输入顺序保持，草稿不能批准操作。
- 任务完成提醒接入已有 Windows Toast、macOS 与 Linux 通知适配器。短问答默认少打扰，任务提醒有独立日上限、安静时段与跨进程去重；提交通知不等于已看见横幅。
- CLI-Anything 目录与已审核适配器调用沿原审批和进程执行路径工作，不自动安装应用或扩大电脑权限。
- 修复狭义只读 PowerShell 搜索的误拦：干净退出且仅抑制读取错误时，显示部分结果提示。写操作、超时和清理不明仍保留核对要求。
- “命令未执行”会说明前次命令、原因及核对方向。核对期间可查看已有预览状态、发现入口；引导明确说明仍在当前回合。重复被挡的操作会结束并保存可操作回执。
- 搜索可跳过无权读取的子项，根目录授权仍严格检查；缺失 Skill 提供准确 ID 查找路径；重复邮箱网络错误在恢复前不反复刷屏。

## 安装与升级

使用[官网下载页](https://karmenloop.com/download.html#cli)或运行 `koder update`，再用 `koder --version` 核对 **0.4.14**。Windows CMD、PowerShell 与 macOS 使用对应安装器和同一份版本化 CLI 运行包；桌面应用与 TUI 版本独立。

原对话、配置、邮箱绑定、GitHub 工具、工作区隔离、权限和 180 课继续保留。更新不会自动启用常驻、授予电脑控制、发送邮件或重试结果不明的外部操作。

## 验证范围

固定候选的 357 项定向无密钥回归已通过，无失败、跳过或取消；正式包、安装更新及线上下载另行记录。脚本化模型与进程夹具不代表真实模型质量或账号操作已验收。

Windows 10/11 真机安装、PowerShell 5.1 无 Node 冷启动、ConPTY/输入法、Windows-MCP 图形操作、真实邮箱/API/账号及通知可见性、点击续聊仍各自保留 NOT_RUN。此前 macOS 通知命令返回 submitted，displayVerified=false。未签名 macOS 锁屏原型不含在本包。按用户要求先发布，未验项不改写为通过。

## 排障与回退

`koder notifications status` 查看通知诊断。前次命令结果不明时先查回执和目标状态，再明确要求剩余工作；已有预览 URL 不能证明前次命令成功。

保留版本化 0.4.13 运行包用于回退，不删除配置、对话或 UNKNOWN 回执强行重试。历史候选说明和失败记录继续留存。

[会话控制](SESSION-CONTROLS.zh.md) · [任务提醒](TASK-NOTIFICATIONS.zh.md) · [命令恢复](SHELL-RECOVERY.zh.md) · [CLI-Anything](CLI-ANYTHING.zh.md)
