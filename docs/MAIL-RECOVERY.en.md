# Mail setup, sending and background checks

## Recover a saved binding in 0.5.18

Check `koder --version`, upgrade to 0.5.18, and reopen Koder. An update download failure and mailbox authentication are separate errors. Do not delete the Koder data directory or mailbox records.

1. Run `koder mail doctor --json`. `mail.configured: true` means an encrypted binding is saved; `mail.smtpConfigured: true` means sending settings exist. `connected: false` with `AUTH_FAILED` means authentication was rejected, not that SMTP is missing.
2. Run `koder mail check` to reverify the saved credential. This checks the receive channel and, during recovery, SMTP login. It does not send mail. If authentication still fails, check the provider's IMAP/SMTP switches and whether the client authorization code is still valid.
3. Renew the code with `koder mail setup 163`. In chat, the equivalent flow is: confirm `use`, enter the account and code in hidden prompts, review the actual receive/send endpoints, then confirm `use` again. Neither confirmation sends a message. Enter or cancellation stops collection.
4. Renewing the same mailbox and connection settings retains reminders, reading consent and delivery records. Unknown sends remain blocked from replay. A different mailbox or connection starts without the previous account's reading and automatic-reply grants.
5. Ask for a new test send, review recipient, subject and body, then type `send`. `acceptedBySmtp: true` proves server acceptance, not recipient delivery. Previous incomplete sends are not replayed automatically.
6. For reminders after closing the terminal, separately authorize `koder mail monitor on` and check **active: true** with `koder mail monitor status`. A running daemon alone does not prove mailbox monitoring is enabled. Authentication rejection pauses automatic checks; use an explicit check or renew the binding to recover.

The release tests exercise the real CLI interaction stack with scripted model responses and synthetic credentials, plus loopback TLS IMAP/SMTP servers. They do not contact 163. Physical Windows behavior, recipient delivery and visible notifications remain separate beta checks.

## Bind a mailbox

Run `koder mail setup 163` in an interactive terminal. Enter your mailbox address, choose IMAP, review the connection scope and type `connect-mail`. Enter the mail-client authorization code in the hidden prompt. Do not paste it into an Agent conversation or a shell command. The 163 preset uses IMAP on port 993 and SMTP on port 465, both with TLS. Receive-only accounts cannot send.

Binding checks login and read-only inbox access. A successful bind does not enable model access, automatic sending or unrestricted computer permissions. Check `koder mail status` for the bound address and current policy.

## Check and read

Run `koder mail check`, then `koder mail status`. Use the returned message ID with `koder mail read <id>`. In chat, the native `mail_inbox` tool refreshes by default; `refresh: false` explicitly requests cached data. Model access requires `koder mail model on` and its separate confirmation. Authentication messages remain protected by the local-code flow.

## Send with an explicit review

Run `koder mail send` and enter the recipient, subject and body. Review the preview and type `send` only when it is correct. In chat, give the recipient and content and approve the native mail confirmation. `--yes` does not supply this mail approval. The result reports SMTP acceptance and a message ID; it cannot establish recipient delivery.

A definite rejection before submission, or an explicit negative SMTP reply after DATA, is recorded as `not_submitted`. Correct the account or content, then start a new attempt and approve it again. A missing acknowledgement after DATA is `DELIVERY_UNCERTAIN`: inspect the provider's sent records and recipient state before any further action. Koder will not silently replay it. Previous uncertain records are retained; upgrading does not clear them or assume they failed.

## Receive reminders after closing the terminal

Run `koder mail monitor on`. Review the mailbox, polling interval, quiet hours, daily notification limit and user-level background service, then type `watch-mail`. This starts or repairs the user service even when configuration previously said it was activated. It does not enable model reading or automatic replies. Check `koder mail monitor status`: `active` must be true. `lastMailSuccess` records an actual completed check; skipped checks are separate.

The default mail polling interval is 30 seconds. Network latency, sleep, service state, quiet hours and notification budgets affect delivery time; this is not an instantaneous push guarantee. The OS must permit notifications. Submission to the OS does not prove the user saw the notice. For checks only while a terminal stays open, use `koder mail watch`.

To ask before drafting a response, separately enable `koder mail model on`, then `koder mail inquire on`. Drafting and sending remain separate; automatic replies are not enabled by either command. Stop background mailbox checks with `koder mail monitor off`; other daemon work continues.

## Troubleshooting

| Result | Meaning and next step |
| --- | --- |
| `MAIL_CHECK_IN_PROGRESS` | Another mailbox operation owns the lease. The background tick yields; it is not a failed send. |
| `STORAGE_BUSY` | Storage is locked. Check monitor status and active mail operations; do not delete lock files or credentials. Repeated contention warrants a sanitized diagnostic report. |
| `MAIL_BACKGROUND_OWNER_UNAVAILABLE` | A recorded background owner could not be verified. Inspect `koder status`; do not start competing pollers blindly. |
| `AUTH_FAILED` | Verify the provider's mail-client authorization code and enabled mail protocols. Do not post credentials in bug reports. |
| `NETWORK` / `PROTOCOL` | Inspect server reachability, TLS and provider restrictions. Binding now also checks inbox access, so a login alone is insufficient. |
| `DELIVERY_UNCERTAIN` | Submission may have occurred. Reconcile before another send; automatic replay is blocked. |

The 0.5.8 acceptance suite covers synthetic TLS traffic and actual Agent tool routing. Live 163 delivery, Windows notification display and user-device service restart need their own device/account records.

## Pending notifications and uncertain sends in 0.5.8

A pending inquiry is retained if the OS notification channel is unavailable or the daily push limit has been reached. The daemon reoffers it through the same notification ledger after recovery or restart; submitted or unknown dispatches are not sent again. Quiet hours, visibility, model-reading consent and daily limits still apply. Revoking access stops recovery. A successful OS submission does not establish visible delivery.

For a native Agent send with `DELIVERY_UNCERTAIN`, the final task result is incomplete (exit 3), even if the explanatory response is nonempty. Inspect sent records before any new explicitly authorized attempt.
