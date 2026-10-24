# Sending mail and receiving background alerts

Applies to Koder CLI 0.4.4. Native Windows and live 163 account acceptance are still pending.

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
