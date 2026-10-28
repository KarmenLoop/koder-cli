# Koder CLI 0.5.16

修复 Windows 查询 C 盘时的误拦：截图中的纯显示 `Select-Object` 表达式不再被当成未知写操作。只读查询正常结束后可继续诊断；隐藏读取错误仍标为 `SHELL_READ_PARTIAL`，不冒充完整扫描。

本版同时修复跨数据块中文字符，按实际 Windows 控制台编码解码支持的 OEM 输出及带 BOM 的 UTF-16；无法识别时明确提示。`wmic` 不存在时给出可读说明，磁盘任务优先原生维护工具。

自动更新主服务不可用时，会检查 GitHub 官方发行并使用对应版本安装器。协议、SHA-256、安装后版本验证、取消与会话恢复保持有效。自定义镜像、无效清单和校验失败不擅自换源。更新失败会显示阶段、HTTP 状态或安装器退出码，`koder update auto status` 可重看上次原因。

相对已公开的 0.5.14，本包还纳入此前候选中的网站后端预览、邮箱安全诊断、任务模型选配和本地遥测，以及电脑维护、本机应用发现和授权启动。均复用现有工具与 Skill；不自动获得系统管理员或 GUI 权限。

- [功能总览与完整教程导航](FEATURES.zh.md)
- [Windows 磁盘排查与更新恢复](WINDOWS-DISK-RECOVERY.zh.md)
- [电脑维护](COMPUTER-CARE.zh.md)、[本机应用操作](APP-USE-AND-LEARN.zh.md)
- [完整中文指南](USER-GUIDE.zh.md)、[安装](INSTALLATION.md)、[1,800 课课堂](courses/README.zh.md)

先运行 `koder update`，再确认 `koder --version` 为 0.5.16。旧更新器连不上时，使用本版 GitHub 固定安装器覆盖升级。已有 unknown 回执不改写；核对后等原回合结束，再发新诊断指令。

发行附件 `ACCEPTANCE-RESULTS.json` 区分实际测试与未测项。Windows 实机交给 beta 专员；专用 163 邮箱、真实通知可见性和 Ubuntu GUI 不用夹具代验。macOS 完整锁屏仍为未签名候选。旧 0.5.15 草稿保持冻结，本次另发新包，不覆盖旧附件、不向公共源码树推送私有内核。
