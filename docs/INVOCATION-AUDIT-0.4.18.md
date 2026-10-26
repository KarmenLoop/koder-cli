# Invocation audit: 0.4.17 → 0.4.18

This is an incremental follow-up to [the 0.4.17 promise audit](PROMISE-AUDIT-0.4.17.md). Existing acceptance failures and device/account limitations remain. The initial targeted regression passed; new edge cases then reproduced five failures across three paths. One follow-up Skill fixture incorrectly passed a short name to the exact-ID Agent tool and was corrected to test user selection separately from tool dispatch; its failed output is retained.

| Contract | Finding and repair | Evidence / boundary |
| --- | --- | --- |
| Long MCP operation returns to the same task | 33-second child call was interrupted around 20 seconds with an UNKNOWN receipt. SDK default is now 180 seconds for tool calls; worker/bridge wait for receipts. | `test/app-use-mcp.test.mjs`: real child, original approval, one actual call, result 42, normal owned-host cleanup. Scripted model only. |
| Cancellation and short explicit timeout still work | No permission or cancellation bypass. Unknown remote effects stay unknown after local cleanup. | Kernel `test/mcp-sdk.test.mjs`, MCP capability, HTTP/SSE, connection and runtime regressions. |
| Foreground mailbox can recover after restart | Durable events were ignored when `fresh` was empty; displayed events were never acknowledged. | `test/mail-notice-consumption.test.mjs`: restart, display failure, queued-not-displayed, full 1,000-event backlog, next mail processed. |
| Sending uses native mail and keeps receipts | Retained new-message/reply separation, explicit confirmation, SMTP acceptance and no uncertain replay. | `test/mail-delivery-regression.test.mjs`, real TLS IMAP/SMTP AUTH LOGIN and POP fixtures. Live 163 account NOT_RUN. |
| Downloaded Skill can be selected and used | Short-name selection used only the local library; Setup omitted downloaded Skills. | `test/self-fetch.test.mjs`: pinned synthetic GitHub package, `$name`/`--skill`, exact-ID read, real output file, Setup all-off and enable without redownload. |
| Long tasks do not stop at 16 tools | Retained unlimited default, approvals and cost stops; no new overall cap. | `test/task-step-budget.test.mjs` and retained completed-call regressions. No paid-model quality claim. |
| Existing features remain | Configuration, multiwindow isolation, EULA, BYOK, Core, migration, notifications and classrooms retained. | Full CLI regression and packaged-runtime checks are separate release records. |

## Run the focused checks from authorized private source

```sh
node --test test/task-step-budget.test.mjs test/app-use-mcp.test.mjs test/mail-notice-consumption.test.mjs test/mail-assistant-tls.test.mjs test/mail-pop-tls.test.mjs test/self-fetch.test.mjs test/setup-skills-input.test.mjs
```

These tests require the private kernel sibling or the packaged-kernel test adaptation. The historical public GPL source is not the current proprietary runtime.

## Beta checklist

Windows specialists should download the current installer from the website, retain the exact version/SHA, and check no-Node installation, PowerShell 5.1/CMD updating, current-window input, Windows-MCP Snapshot/Click/Type/PowerShell on an owned test window, cancellation and cleanup. Record real device outcomes independently; source and loopback tests do not fill those cells.

Mail specialists should verify SMTP acceptance and recipient receipt with an authorized test account, restart monitoring with pending alerts, exercise quiet periods and a temporary network loss, and confirm no duplicate send. Credentials remain local. MCP specialists should run a long harmless operation and a cancellation on their configured server, preserving UNKNOWN receipts if the remote result cannot be confirmed.

The unsigned macOS locked-use candidate is unchanged. The classroom remains 1,800 Chinese lessons; this release adds no new lessons or scoring claims. Rollback is the retained 0.4.17 runtime with existing data and effect receipts preserved.
