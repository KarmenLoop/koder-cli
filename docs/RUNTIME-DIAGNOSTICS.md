# Runtime diagnostics and incomplete tasks

Run koder logs --tail 100 for recent local events, koder logs --path for the location, or koder logs --json for path, existence, size, modification time and tail. A missing log is normal and returns exit 0. koder doctor reports its location and latest error. Feedback remains manual.

The file is <KODER_CLI_HOME>/logs/runtime.log (default ~/.koder-cli/logs/runtime.log). It rotates at 4 MiB to runtime.log.1. The directory is private (0700 on POSIX); files are 0600. Windows uses the existing native ACL verifier. Unsafe links or storage are refused with RUNTIME_LOG_UNAVAILABLE/RUNTIME_LOG_UNSAFE; diagnostics cannot silently expand permissions. Reading logs does not create a log. Close Koder processes before manually removing these two files to prevent them being recreated during use.

Records contain timestamp, version, process/platform, command name, event, error code, HTTP status, step count or exit code. They exclude task text, model output, command arguments, mail bodies, credentials and HTTP headers. A separate gateway log remains at <KODER_CLI_HOME>/gateway/gateway.log; inspect and redact it separately. Existing receipt/session stores retain their own contracts.

The Agent can use diagnostics_runtime_log with a bounded tail, without searching the home directory or opening sealed history. It cannot choose another file. Tool results are metadata, never instructions.

Permission-denied and empty results receive an actionable summary and a nonzero exit code; JSON results include text and an incomplete/unverified state. Execution full/--yes never grants computer access. Review koder permissions status, then request only the needed capabilities. Model failures point to koder model test; daemon failures point to koder status/koder activate. Step limits are not raised automatically and unfinished work is not reported as complete.

## 中文

用 koder logs --tail 100 查看近期错误码，koder logs --path 查路径，--json 获取结构化信息。默认路径是 ~/.koder-cli/logs/runtime.log，4 MiB 轮换一次，只保留上一份 runtime.log.1。记录不含任务正文、模型正文、邮箱内容或凭据，不自动上传。退出相关 Koder 进程后可手动删除两份文件；继续使用会重新生成。

电脑权限拒绝、空结果、步数耗尽和模型失败会明确显示原因及下一步。全执行权限和 --yes 不等于电脑授权。核对回执后再继续，结果未知的发送、提交或文件操作不自动重放。

## Verification scope

`koder diagnostics check --json` (also `koder doctor --full --json`) adds bundled interface schemas, configuration conflicts, Skill resources and recent local errors. It invokes no tool handlers. The Agent's `diagnostics_runtime_log` also supports `action: recent` and `action: check`, with no path or cloud-read parameter.

A separate allowlisted error projection can enter a private upload queue after disclosure and sign-in. Raw logs remain local. Setup can disable automatic reporting; telemetry off also stops it. Feedback requires a separate redacted preview and confirmation. See [Diagnostics](DIAGNOSTICS.en.md) / [自检与上报](DIAGNOSTICS.zh.md) for service readiness, retry limits, retention and durable server receipts. Production ingestion is not enabled in this candidate; the dedicated authority and HTTPS entry remain unavailable.

No-key checks use disposable workspaces, injected models and loopback IPC. They do not prove native Windows GUI/IME, real account delivery or model quality. Original failures and NOT_RUN items remain in the release evidence.
