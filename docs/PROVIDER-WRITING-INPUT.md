# Provider diagnostics, writing evidence, and slash input

This guide describes 0.4.0. It includes the retained candidates and earlier functionality. No real-model writing score is claimed.

## MiniMax content review

HTTP 422 alone is ambiguous. When an official MiniMax endpoint supplies code 1026 (input review) or 1027 (output review), Koder reports MODEL_FILTERED and the safe business code, instead of claiming that the API cannot connect. The same classification applies to supported JSON and SSE responses. Generic parameter, authorization, rate-limit and network errors remain separate. See [the detailed guide](MINIMAX-CONTENT-REVIEW.md).

Koder does not automatically resend, change endpoints or rewrite rejected context. Inspect task and tool context against the provider policy; report suspected false positives to the provider. A user may choose /new for a separate task, but this does not establish why a provider rejected the earlier one. Large binary or Hex output is a hypothesis in the reported case, not a proven universal trigger or permission to bypass content review. Prefer dedicated local static-analysis tools and relevant summaries over pasting entire binaries.

## Writing contracts

The length check uses the verified main file written during this turn, then the final answer when no eligible file exists. Explicit English or Chinese non-increment disclosure can pass when no authoritative release change is available; unsupported positive release claims still fail. Bounded workspace RELEASE/ACCEPTANCE documents and installed public runtime facts are inspected through existing confinement. Acceptance terms and runtime versions provide labeled facts, never proof that a release added a feature. Actual git/tag lookup stays with the existing authorized tool. Tags alone do not prove changes.

Long-dialogue carryover now budgets its framing separately, preserving early task markers and constraints within the configured window. History remains quoted context, never new authorization.

Compression from an explicitly named source records its path and SHA in writingEvidence. This makes the source traceable; it does not prove complete semantic equivalence. Unknown pricing should be disclosed. Numeric competitor prices remain conservatively blocked when the original tool chain cannot provide trustworthy official-source evidence. Local files that merely name an official URL do not count as fetched official evidence.

A writing gate returns exit 3 for a delivery/evidence issue, not a network failure. Actual W01–W05 model runs, three-run means, and W02 ≥4.6 are still required before publishing a writing-capability improvement claim.

## Input options

In an interactive Koder chat, type / at an empty prompt to open input choices. Context suggestions, existing saved templates and commands are available. Use Up/Down or PageUp/PageDown to browse; Tab fills the selected draft. After explicit navigation, Enter fills it as well. Selection never sends the draft: edit it and press Enter again when ready. Esc closes the list. Typing an exact slash command and Enter retains normal command behavior. Paste and noninteractive commands do not open an interactive picker. Narrow or unsupported terminals retain the existing /prefill and copyable fallback.

## Concurrent windows

The native Koder engine reserves a session for the lifetime of its chat window. Concurrent default windows receive distinct session names before loading history; an explicitly named busy session is not taken over. See [the multi-window guide](MULTI-WINDOW.md) for commands, shared-file boundaries and native Windows limits.

## 中文速用

- 输入框为空时按 `/` 打开预输入菜单；可选上下文建议、常用模板和命令。方向键／翻页键选择，Tab 填入，编辑后再回车发送；Esc 关闭。已有斜杠命令和粘贴继续使用。
- MiniMax `422 + 1026/1027` 明确显示“内容审核拦截”，不再说“无法连接 API”。不会自动换接口、改写上下文或重发。
- 撰写闸门量本轮实际交付文件；无来源时允许明确说明“不是本版新增”。验收条款、安装版本和标签不能冒充版本新增证据。
- 压缩指定前稿会保存来源路径与 SHA。未经可信官方原文核验的竞品数字价格仍有保守限制；可以诚实说明“公开信息有限”。
- 本版为 Beta。真实模型分数、Windows 图形输入和完整客户端安装更新尚未据此认证。
