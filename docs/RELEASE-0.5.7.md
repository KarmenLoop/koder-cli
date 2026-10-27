# Koder CLI 0.5.7

Mail operations now share the correct owner within a session. Background checks yield to an in-flight operation instead of repeatedly reporting storage contention; closing one daemon session no longer closes another session's mailbox. A configured but stopped monitor can be started again with `koder mail monitor on` after its existing authorization prompt.

Binding checks read-only inbox access, not just login. Incoming-mail tool calls refresh the inbox by default. Outgoing messages include a Date header, and a definite SMTP rejection permits a new explicitly approved attempt. A lost acknowledgement after message submission stays uncertain and cannot be resent automatically. SMTP acceptance is not proof of recipient delivery.

Website structure checks exclude generated layout review pages, while keeping checks on real source files. Explicitly retaining a confirmed layout no longer requires a fresh layout choice. Negative task instructions such as “do not send email” no longer select the office profile and hide coding tools. Todo assignment errors now explain the valid current-agent and subagent identifiers.

## Install or update

Use the Windows PowerShell/CMD or macOS shell installer attached to this release. Existing installations can run `koder update`, then `koder --version`; the result should be `0.5.7`. See [the installation guide](INSTALLATION.md) and [mail setup and troubleshooting](MAIL-RECOVERY.en.md).

## Evidence and limits

Regression and packaged-runtime results are recorded in the release attachment `ACCEPTANCE-RESULTS.json`. Real MiniMax-M3 calls exercised a multi-step receipt audit, a website workflow and native mail tools. Long-task and website evidence includes resumed rounds, with earlier failures and test-driver limits retained. Website validation separates file/HTTP checks, browser interactions and model completion status. Requirement questions used declared scripted test-user answers; they are not human design approval or an unchanged short-prompt benchmark. Mail protocol tests use synthetic accounts and local TLS servers, including rejection, cancellation and lost-acknowledgement cases. They do not establish delivery through a live 163 account.

Windows 10/11 installation, GUI/MCP operation and visible system notifications remain on the beta device track. Live external mailbox delivery and signed macOS locked-screen operation are not verified. The website is unchanged; this publication updates GitHub only.

Existing BYOK routing, permissions, cancellation, cost budgets, session isolation and unknown-effect protection remain in force. Tool steps remain unlimited by default.

Project-specific verify/check scripts now count when a direct invocation has a successful process receipt. A verified, unchanged implementation can retain test and documentation repairs without requiring unrelated runtime edits. A completed file snapshot can preserve validation after later successful inspections when file contents, permissions and identity remain unchanged; incomplete scans, writes, failed commands and unknown effects still require fresh validation. The Chinese no-change check accepts explicit completed-work wording such as “未做任何修改”; source inspection, unchanged-workspace and verification checks remain mandatory. Rejected commands that never ran do not count as changes. Failed or masked validation commands still do not qualify.

Foreground inbox refreshes no longer consume pending inquiry notifications or their daily budget. Background polls retain generated inquiries when a concurrent operation temporarily holds the notice-read lease. Conditional instructions such as “if no changes are needed” no longer disable an explicitly requested repair task.

Explicit read-only website checks no longer require a source change to complete. Conditional repairs still require delivery evidence, and protecting one file does not disable the rest of a repair task.
