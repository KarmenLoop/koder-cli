# 21. Gamma, applications and MCP

Allow 60 minutes

**Goal**：Turn connected tools into verifiable outcomes: invoke MCP, approve a mail send and upload or edit GitHub content safely.

**Preparation**：Use authorized test accounts, a test recipient and a private test repository. Enter secrets only in dedicated prompts. Reading the lesson requires no account binding; external actions are optional exercises.

## Hands-on steps

1. Run koder apps status and koder mcp list, then read koder help mcp.

   **Check**：Discovery alone does not establish a configured, enabled, callable service.

2. Inspect executable, arguments, endpoint and environment variable names, then run koder mcp test <server-id> for an authorized service.

   **Check**：This makes a real connection. Record tools and server errors separately from business completion.

3. Bind 163 through /setup using the full address and client authorization code in send/receive mode; inspect /mail status.

   **Check**：Receive and SMTP settings are distinct. Use the dedicated secret input; receive-only accounts cannot send.

4. Replace YOUR_TEST_ADDRESS with your own test recipient and run the mail send command; inspect the final message before typing send.

   **Check**：Keep the SMTP submission receipt and check the test inbox. Reconcile uncertain delivery instead of resending.

5. Use koder github connect with its secret input, then status, repos and read on your test README.

   **Check**：Confirm identity and repository scope. Read access does not prove write access; keep tokens out of project files.

6. Prepare README.md and run koder github commit OWNER/REPO README.md --message "Improve learning notes"; read it back and separately edit repository metadata.

   **Check**：Approve each target explicitly and verify SHA/state. Only listed files are uploaded, not a whole directory.

## Troubleshooting and recovery

- **Mail requests loop through skill discovery or shell**：Use the bound native mail_send path or /mail send, not a nested Koder process.
- **GITHUB_PENDING_REVIEW_REQUIRED**：Run koder github reconcile OWNER/REPO; preserve unresolved state rather than force-pushing or replaying.

## Assignment and acceptance

Choose one connection and record status, operation and readback. Without an account, label the exercise NOT_RUN. Upload only a secret-free README.

**Acceptance**：Separate discovery, invocation and external effect. Distinguish SMTP submission from arrival and verify GitHub content against the receipt.

## Developer track

1. Route external writes through existing approval, idempotency and UNKNOWN reconciliation rules; --yes does not replace mail/GitHub confirmation.

2. Keep artifact IDs, hashes, sizes and readback methods when shortening large results.

3. Test repository identity casing, head changes, rejection, timeout and recovery without normalizing case-sensitive paths or branches.

4. Fail explicitly when secure storage is unavailable; never leak tokens into prompts or plaintext.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-DELIVERY.en.md](../MAIL-DELIVERY.en.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [GITHUB-PROJECTS.en.md](../GITHUB-PROJECTS.en.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 21 of 30 · Gamma, applications and MCP ━━
Coach › Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
    koder apps
    koder apps connect gamma --key-env GAMMA_API_KEY
    koder apps status
    koder mcp import "mcp-config.json"
    koder mcp list
    koder mcp enable my-server
    koder mcp test my-server
    koder mcp disable my-server
    koder apps disconnect gamma
  Tip · Choose individual commands as needed; do not run the entire block. Set the environment variable for your shell as shown in lesson 3. For browser authorization, follow service configuration in koder help apps / koder help mcp. Inspect the MCP executable, arguments, endpoint and permissions before enabling; test makes a real connection.
Coach › Use connection diagnostics to distinguish expired tokens, rate limits, network failures and model tool-call errors. Chats and agents in the same profile reuse connections; this does not synchronize credentials across devices. Large tool results are bounded or excerpted. A connected service is not evidence of a completed external task.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 21 of 30 · Gamma, applications and MCP ━━
Coach › Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
    koder apps
    koder apps connect gamma --key-env GAMMA_API_KEY
    koder apps status
    koder mcp import "mcp-config.json"
    koder mcp list
    koder mcp enable my-server
    koder mcp test my-server
    koder mcp disable my-server
    koder apps disconnect gamma
  Tip · Choose individual commands as needed; do not run the entire block. Set the environment variable for your shell as shown in lesson 3. For browser authorization, follow service configuration in koder help apps / koder help mcp. Inspect the MCP executable, arguments, endpoint and permissions before enabling; test makes a real connection.
Coach › Use connection diagnostics to distinguish expired tokens, rate limits, network failures and model tool-call errors. Chats and agents in the same profile reuse connections; this does not synchronize credentials across devices. Large tool results are bounded or excerpted. A connected service is not evidence of a completed external task.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 21 of 30 · Gamma, applications and MCP ━━
Coach › Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
    koder apps
    koder apps connect gamma --key-env GAMMA_API_KEY
    koder apps status
    koder mcp import "mcp-config.json"
    koder mcp list
    koder mcp enable my-server
    koder mcp test my-server
    koder mcp disable my-server
    koder apps disconnect gamma
  Tip · Choose individual commands as needed; do not run the entire block. Set the environment variable for your shell as shown in lesson 3. For browser authorization, follow service configuration in koder help apps / koder help mcp. Inspect the MCP executable, arguments, endpoint and permissions before enabling; test makes a real connection.
Coach › Use connection diagnostics to distinguish expired tokens, rate limits, network failures and model tool-call errors. Chats and agents in the same profile reuse connections; this does not synchronize credentials across devices. Large tool results are bounded or excerpted. A connected service is not evidence of a completed external task.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 21 of 30 · Gamma, applications and MCP ━━
Coach › Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
    koder apps
    koder apps connect gamma --key-env GAMMA_API_KEY
    koder apps status
    koder mcp import "mcp-config.json"
    koder mcp list
    koder mcp enable my-server
    koder mcp test my-server
    koder mcp disable my-server
    koder apps disconnect gamma
  Tip · Choose individual commands as needed; do not run the entire block. Set the environment variable for your shell as shown in lesson 3. For browser authorization, follow service configuration in koder help apps / koder help mcp. Inspect the MCP executable, arguments, endpoint and permissions before enabling; test makes a real connection.
Coach › Use connection diagnostics to distinguish expired tokens, rate limits, network failures and model tool-call errors. Chats and agents in the same profile reuse connections; this does not synchronize credentials across devices. Large tool results are bounded or excerpted. A connected service is not evidence of a completed external task.
```

</details>
