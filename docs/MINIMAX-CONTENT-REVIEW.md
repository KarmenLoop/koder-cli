# MiniMax content-review errors

This beta distinguishes MiniMax content review from transport, credentials, quota, and request-parameter failures. It does not claim to eliminate provider-side filtering.

The [official MiniMax error reference](https://platform.minimax.cn/docs/api-reference/errorcode), checked on October 23, 2026, defines 1026 as input-content review and 1027 as output-content review. Code 1042 describes an excessive proportion of invisible or invalid characters; it is a different error. An HTTP 422 response alone does not establish content review.

## What changes

For an official MiniMax endpoint, HTTP 422 with a recognized 1026 or 1027 business code is reported as `MODEL_FILTERED`. This includes `base_resp.status_code`, numeric error-code fields, and the Messages-compatible fixed `input new_sensitive (1026)` or `output new_sensitive (1027)` error markers. OpenAI Chat Completions, Anthropic Messages, and Responses use the same classification.

The parser reads at most 8 KiB for at most one second and respects cancellation. Only the fixed safe category and numeric review code leave the provider boundary; the body, request content, credentials, and arbitrary upstream properties are not copied into the notice. HTTP 401, 429, and an unrecognized 422 keep their existing meanings. JSON and SSE business errors with HTTP 200 also retain the content-review category.

The CLI reports the review category alongside the HTTP status and recognized provider code. It does not display an API-unreachable notice for this condition. There is no automatic retry for HTTP 422, endpoint switching, or automatic rewriting of the user's task or history. Completed tool actions remain recorded and are not replayed.

## Troubleshooting

Review the task and its tool output against the provider's content rules. Binary files and long hexadecimal dumps can make context unnecessarily large or unreadable; use bounded local inspection and a relevant factual summary when appropriate. The reported installer-binary scenario is a plausible contributing factor, not proof that a particular byte sequence universally causes MiniMax filtering. Koder does not remove or encode context to evade review.

If prior context is irrelevant, the user can explicitly start a new conversation with `/new`. A new conversation is not a guarantee that the provider will accept the task. Report a suspected false positive to MiniMax with the provider's requested diagnostic identifier, without posting credentials or private history. A remaining account balance does not invalidate a content-review response; it also does not prove every model entitlement or quota window is available.

## Verification and limits

`test/minimax-content-review.test.mjs` exercises the real provider and CLI paths using synthetic HTTP/JSON/SSE fixtures, including authentication, quota, unrelated gateways, malformed/oversized bodies, cancellation, and a completed file action followed by review rejection. It does not call a paid model or certify behavior for a user's private key or exact Windows screenshot.

The four-file provider regression run passed 54 tests with zero failures using a task-owned canonical `TMPDIR`. An earlier run and a frozen-baseline control both failed the existing RAM-fallback fixture before its HTTP 401 stub because the default macOS `/var` temporary path traverses a symlink. Those failure records are retained. Re-running the unchanged fixture in the canonical task directory passed without changing memory guards or assertions.

## 中文说明

`HTTP 422 + 1026/1027` 表示服务商内容审核拦截输入或输出，不应显示为断网或余额不足。普通 `422` 仍需按真实参数错误排查；`1042` 的不可见或非法字符问题也与内容审核分开。

本次修复保留真实错误类别、HTTP 状态及安全的数字错误码，不自动重试、不切换主机、不改写用户历史。请核查任务与工具输出；如判断旧上下文无关，可由用户主动输入 `/new`。二进制或 Hex 导致本次误判目前只是场景推断，不能当作服务商已确认的根因。
