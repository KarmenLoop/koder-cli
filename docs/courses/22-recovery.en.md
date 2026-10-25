# 22. API, context and update troubleshooting

Allow 40 minutes

**Goal**：Identify the failing layer, collect minimal evidence and recover without repeating completed actions.

**Preparation**：Save current work without wiping history. Collect version, OS, failing command, error code and a few redacted log lines.

## Hands-on steps

1. Run koder version and koder doctor and identify installation, model, tool, grant or external-submit failure.

   **Check**：Separate unrelated events such as mail polling errors and a coding timeout.

2. Inspect model show and run one model test; check access for 401/403, quota for 429 and provider/network state for 5xx.

   **Check**：Keep status and provider reason without endless retries; redact before sharing.

3. For MiniMax 422 with 1026/1027, compare a short harmless request in a new session and avoid binary/large hex payloads.

   **Check**：Report filtering accurately, retain history and do not bypass provider review.

4. For timeout or HARNESS_JIT_STOP, inspect the last tool, artifacts and receipts and list completed, unknown and unrun work.

   **Check**：Started, exit 0 or an orchestration stop alone does not prove business success; resume only remaining work.

## Troubleshooting and recovery

- **Increasing context arbitrarily**：Use the actual model limit and reserve output capacity; retrieve relevant file sections.
- **The old build still runs after update**：Check launcher path and version in a new terminal; use lesson 16 for multiple entries.

## Assignment and acceptance

Write recovery plans for an uncertain mail send and an empty web search. Start with evidence, not resending or reinstalling.

**Acceptance**：Reconcile mail submission and inbox state; check search URL, status and body rather than treating an empty response as absence of information.

## Developer track

1. Preserve HTTP status, provider code and a redacted reason, with consistent user-facing wording.

2. Failed calls must not masquerade as successful history; unknown usage is not zero.

3. Recovery depends on task input, baseline, model settings and experience versions; recheck scope after cancellation or revocation.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 22 of 30 · API, context and update troubleshooting ━━
Coach › Development tasks research public GitHub candidates and fixed-version licenses, clarify requirements and record architecture, tasks and tools. Existing projects are reused; installation retains current approvals. Say “update Koder CLI” or use /update for version comparison, verified installation and installed-entry readback; Ask/plan mode only checks.
    koder version
    koder doctor
    koder model show
    koder setup
    koder update --check
    koder update
Coach › API unavailable: check endpoint, protocol, model, environment variable and network. For 401/403 check credentials or access; for 429 check quota and rate limits; for 5xx or timeout check the provider. Keep the actual error code and redact keys and conversation content before sharing logs.
Coach › Use setup → Context and output. Enter the real window supported by this model and endpoint; output capacity shares it. Koder compacts history, bounds tool results and retains relevant memory, but a larger number cannot enlarge a provider hard limit. Read oversized files in chunks or retrieve relevant portions, or configure a genuinely larger-context model.
Coach › update --check only checks the official GitHub feed; update downloads, verifies and installs a newer channel release. Equal versions are not reinstalled and older ones are not selected. Configuration, memory and channel bindings are retained. Sessions started with preview.6 or later restart automatically after saving work and restore the conversation and buffered input. Gateways finish work and replies before reconnecting. Start the new version once when migrating an older process. Updates never replace pending approval or replay completed actions. Review and explicitly accept any changed license before upgrading. Verify with version; old tutorial graduates resume at new lesson 17.
  Tip · Normal koder uninstall retains configuration. --purge removes configuration; back up first, and manage external memory and server copies separately. Tutorials and help can be read offline; remote models, updates, cloud sync and online apps require network.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 22 of 30 · API, context and update troubleshooting ━━
Coach › Development tasks research public GitHub candidates and fixed-version licenses, clarify requirements and record architecture, tasks and tools. Existing projects are reused; installation retains current approvals. Say “update Koder CLI” or use /update for version comparison, verified installation and installed-entry readback; Ask/plan mode only checks.
    koder version
    koder doctor
    koder model show
    koder setup
    koder update --check
    koder update
Coach › API unavailable: check endpoint, protocol, model, environment variable and network. For 401/403 check credentials or access; for 429 check quota and rate limits; for 5xx or timeout check the provider. Keep the actual error code and redact keys and conversation content before sharing logs.
Coach › Use setup → Context and output. Enter the real window supported by this model and endpoint; output capacity shares it. Koder compacts history, bounds tool results and retains relevant memory, but a larger number cannot enlarge a provider hard limit. Read oversized files in chunks or retrieve relevant portions, or configure a genuinely larger-context model.
Coach › update --check only checks the official GitHub feed; update downloads, verifies and installs a newer channel release. Equal versions are not reinstalled and older ones are not selected. Configuration, memory and channel bindings are retained. Sessions started with preview.6 or later restart automatically after saving work and restore the conversation and buffered input. Gateways finish work and replies before reconnecting. Start the new version once when migrating an older process. Updates never replace pending approval or replay completed actions. Review and explicitly accept any changed license before upgrading. Verify with version; old tutorial graduates resume at new lesson 17.
  Tip · Normal koder uninstall retains configuration. --purge removes configuration; back up first, and manage external memory and server copies separately. Tutorials and help can be read offline; remote models, updates, cloud sync and online apps require network.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 22 of 30 · API, context and update troubleshooting ━━
Coach › Development tasks research public GitHub candidates and fixed-version licenses, clarify requirements and record architecture, tasks and tools. Existing projects are reused; installation retains current approvals. Say “update Koder CLI” or use /update for version comparison, verified installation and installed-entry readback; Ask/plan mode only checks.
    koder version
    koder doctor
    koder model show
    koder setup
    koder update --check
    koder update
Coach › API unavailable: check endpoint, protocol, model, environment variable and network. For 401/403 check credentials or access; for 429 check quota and rate limits; for 5xx or timeout check the provider. Keep the actual error code and redact keys and conversation content before sharing logs.
Coach › Use setup → Context and output. Enter the real window supported by this model and endpoint; output capacity shares it. Koder compacts history, bounds tool results and retains relevant memory, but a larger number cannot enlarge a provider hard limit. Read oversized files in chunks or retrieve relevant portions, or configure a genuinely larger-context model.
Coach › update --check only checks the official GitHub feed; update downloads, verifies and installs a newer channel release. Equal versions are not reinstalled and older ones are not selected. Configuration, memory and channel bindings are retained. Sessions started with preview.6 or later restart automatically after saving work and restore the conversation and buffered input. Gateways finish work and replies before reconnecting. Start the new version once when migrating an older process. Updates never replace pending approval or replay completed actions. Review and explicitly accept any changed license before upgrading. Verify with version; old tutorial graduates resume at new lesson 17.
  Tip · Normal koder uninstall retains configuration. --purge removes configuration; back up first, and manage external memory and server copies separately. Tutorials and help can be read offline; remote models, updates, cloud sync and online apps require network.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 22 of 30 · API, context and update troubleshooting ━━
Coach › Development tasks research public GitHub candidates and fixed-version licenses, clarify requirements and record architecture, tasks and tools. Existing projects are reused; installation retains current approvals. Say “update Koder CLI” or use /update for version comparison, verified installation and installed-entry readback; Ask/plan mode only checks.
    koder version
    koder doctor
    koder model show
    koder setup
    koder update --check
    koder update
Coach › API unavailable: check endpoint, protocol, model, environment variable and network. For 401/403 check credentials or access; for 429 check quota and rate limits; for 5xx or timeout check the provider. Keep the actual error code and redact keys and conversation content before sharing logs.
Coach › Use setup → Context and output. Enter the real window supported by this model and endpoint; output capacity shares it. Koder compacts history, bounds tool results and retains relevant memory, but a larger number cannot enlarge a provider hard limit. Read oversized files in chunks or retrieve relevant portions, or configure a genuinely larger-context model.
Coach › update --check only checks the official GitHub feed; update downloads, verifies and installs a newer channel release. Equal versions are not reinstalled and older ones are not selected. Configuration, memory and channel bindings are retained. Sessions started with preview.6 or later restart automatically after saving work and restore the conversation and buffered input. Gateways finish work and replies before reconnecting. Start the new version once when migrating an older process. Updates never replace pending approval or replay completed actions. Review and explicitly accept any changed license before upgrading. Verify with version; old tutorial graduates resume at new lesson 17.
  Tip · Normal koder uninstall retains configuration. --purge removes configuration; back up first, and manage external memory and server copies separately. Tutorials and help can be read offline; remote models, updates, cloud sync and online apps require network.
```

</details>
