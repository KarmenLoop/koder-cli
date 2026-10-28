# Sending mail and receiving background alerts

For a shareable diagnostic report, run `koder mail doctor --json`. It reads local binding and policy state and checks the local background process. It does not fetch or send mail, change permissions, or upload the report. Addresses, server names, credentials, message content and receipt identifiers are excluded. Full `mail status --json` output is intended for local use and can contain mail metadata.

Check `monitor.active` and `monitor.blockedReasons`; a running service alone does not mean mailbox checks are enabled. `MAIL_BACKGROUND_DISABLED` means the background-check switch is off. Use `koder mail monitor on` to review and authorize monitoring. Nonzero `deliveries.unconfirmed` requires checking the provider and test recipient before sending again. A saved connected state is not a live authentication test, SMTP acceptance is not recipient delivery, and a submitted notification is not proof of display.

On a Windows test machine, record the safe report, check incoming mail locally, send an explicitly approved test message to a dedicated recipient, and verify it there. Enable monitoring, close the foreground terminal, send a new test message, and record whether and when the notification appears. Report these three results separately: SMTP acceptance, recipient delivery and notification display. Do not include app passwords or private messages.

Applies to Koder CLI 0.4.18. Native Windows and live 163 account acceptance are tracked separately.

## Recovering pending alerts

Foreground `koder chat` and `koder mail watch` consume saved notification events, including events left by a previous process. A busy chat queues them and acknowledges them only after printing. A failed display or queued item remains recoverable after restart. The existing encrypted store owns the events; no second inbox or credential store is created.

If the 1,000-event backlog is full, polling preserves the cursor while pending alerts drain, then resumes new arrivals on the next check. This is still polling, not instant push. When the authorized daemon owns mail monitoring, its existing notification path remains the owner. Current automatic-reply outcomes remain visible; recovery never resends a message.

Bind a mailbox in Setup → Mail. A send-capable account verifies both receiving and SMTP connections. For 163, use the IMAP/SMTP client authorization code, never a password pasted into chat. The preset uses IMAP 993 and SMTP 465 with TLS.

Ask Koder to email an address with a subject and message, or run:

```text
koder mail send --to "name@example.com" --subject "Meeting time" --text "See you at 3 PM tomorrow."
```

The native `mail_send` tool handles new messages; `mail_reply` handles replies. Apps/MCP discovery, browser access and a nested shell invocation of Koder are unnecessary. Review the exact sender, recipient, subject and body, then type `send`. Enter cancels. Execution approval and `--yes` do not approve email delivery. Sending a new message does not grant the model access to your inbox.

Success means SMTP accepted the message, not that the recipient received it. Stored receipts prevent duplicate submission of an identical recipient, subject and body. An unknown result requires reconciliation before another send.

Interactive binding offers background monitoring. You can also use `/mail monitor on`, `/mail monitor status` and `/mail monitor off` in chat. In a terminal, prefix them with `koder`. The `watch-mail` consent explains the bound account, user-level service, interval, quiet hours and daily limit. Old notification preferences require a separate change if needed. Only an enabled, activated, running host monitors after terminals close.

Checks run every 30 seconds, independently of the general 30-minute proactive wake. `agentd.mailPollSeconds` accepts 15–300 seconds. This is polling, not IMAP IDLE push. Sleep, network failures and notification restrictions can delay alerts. New bindings include all inbox categories, including marketing. The first check reads unread inbox messages; subsequent IMAP UID tracking includes new mail read first by another client. Spam and custom folders are not watched.

New messages found together are grouped into one alert. Existing quiet hours and notification limits still apply: defaults are 23:00–08:00 and eight notifications per day across proactive sources. Adjust these in Setup. Deferred events persist; a full 1000-event backlog pauses cursor advancement. Definitely unavailable channels retry after a cooldown; uncertain notifications are not replayed.

Lock-screen alerts contain no mail body, sender or verification code. Use `/mail status` locally. Optional `/mail model on` and `/mail inquire on` allow content-based questions under separate grants; they do not enable automatic sending. Background collection never replies automatically.

Troubleshooting: `HARNESS_JIT_STOP` is an orchestration stop, not proof of SMTP failure. `MAIL_SEND_CANCELLED` means no local approval. `MAIL_SMTP_NOT_CONFIGURED` means receive-only access. `AUTH_FAILED` points to account credentials or protocol access. `DELIVERY_UNCERTAIN` requires checking actual mailbox/provider records before retrying.
