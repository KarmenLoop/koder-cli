## Koder CLI 0.4.0-preview.29 Beta

This release brings the retained preview.29 candidates to the public beta while preserving the existing model routes, BYOK settings, permissions, history, Skills and tutorials.

- MiniMax 1026/1027 content-review replies are identified separately from connection, credential, quota and parameter failures, including HTTP 422. The diagnostic path is bounded and redacted; it does not automatically retry or switch billing routes.
- Type `/` at an empty interactive prompt to browse contextual suggestions, saved templates and commands. Selection fills an editable draft; it does not send it.
- Two or three native Koder terminal windows keep independent session ownership. Busy explicit sessions are not taken over. Project files still need coordination when shared; the optional external engine is outside this concurrency acceptance.
- Long-context carryover keeps short original constraints within the existing window. Writing checks use the actual main deliverable, accept explicit non-increment disclosure, and record release sources and named predecessor hashes.
- Harness²-inspired local artifact comparisons retain the baseline and reuse the original Core/Skills/approval path. Scoped crawling feeds the existing first-party static reverse worker; it does not execute the target or replace every external reverse engine.
- The Windows credential helper prefers an already installed, fixed-path PowerShell 7 executable. It retains DPAPI CurrentUser and its original deadline.

### Install, update and documentation

Use the [official download page](https://karmenloop.com/download.html) or the assets below. Run `koder update --check`, then `koder update`, and verify `koder --version`. The [complete English guide](https://github.com/KarmenLoop/koder-cli/blob/main/docs/USER-GUIDE.en.md), [Chinese guide](https://github.com/KarmenLoop/koder-cli/blob/main/docs/USER-GUIDE.zh.md), installation instructions and eight printable 30-lesson editions are updated for preview.29. Tutorials use a local scripted coach without paid API requests.

### Evidence and remaining checks

Local deterministic tests, actual subprocess isolation and exact-package validation are recorded separately from native clients and authenticated services. The fixed 12 benchmark prompts are unchanged. No new writing score or competitor result is claimed.

PS5.1-only cold startup remains unresolved. Windows GUI foreground/input, Windows 10/11 x64, full CMD/PowerShell installation and update/restart, ConPTY/IME/UAC, real provider accounts and independent product QA retain open checks. Windows 11 ARM64/Server observations and macOS subprocess tests do not certify these other environments. This is a Beta release, not a fully certified stable version.

MiMo Token Plan, Kimi API/Code, DeepSeek, Alibaba Token Plan and Volcano integrations remain gray and unavailable. Optional engines and integrations retain their separate dependencies and authorization.

---

## 中文说明

preview.29 将此前两份候选纳入公开 Beta，保留原有 API 路由、自接密钥、权限、项目历史、Skills 与教程。

- MiniMax `1026/1027`（含 `HTTP 422`）现在明确显示内容审核拦截，不再误报为无法连接 API；不自动重试、切换接口或修改计费路线。
- 空输入框按 `/` 可以选择上下文建议、常用模板和命令。选择只填入草稿，可编辑后再发送，也可 Esc 关闭。
- 原生 Koder 支持两个或三个终端任务分别持有会话；明确指定的忙碌会话不会被抢占。同一工程文件仍需协调，备用引擎不在此次并发验收范围。
- 修复紧预算下原始任务约束被摘要截断的问题；撰写检查读取实际主稿，允许明确“非本版增量”说明，并记录来源和前稿哈希。
- 纳入 Harness² 增量对照与爬虫／自研静态逆向，继续使用原 Core、Skills、审批和恢复。基线保留，未执行的目标或未经验证的改进不会被冒充成功。
- Windows 优先使用固定路径中已经安装的 PowerShell 7；不会自动安装或全局放开执行策略。

安装、更新链接和中英文完整教程同步到官网及 GitHub。8 份文字版均为 preview.29 的 30 课，分别覆盖 PowerShell、CMD、macOS 和 Linux。

**仍有未验项**：仅装 PS5.1 的冷启动、Windows 图形焦点与输入、Windows 10/11 x64 完整安装更新和原生终端行为、真实模型账号及独立产品 QA。此次按 Beta 发布，不表示这些问题已全部通过验收；不发布未经实测的撰写评分或竞品胜负。灰色模型继续停用。
