# Mail binding and proactive inquiries

Available in Koder CLI 0.4.3. Native Windows ConPTY/IME and real provider accounts have separate acceptance requirements; passing a local byte-sequence fixture does not establish a Windows-device result.

## Bind a mailbox safely

Open `/setup` → Mail and incoming-mail reminders → Bind mailbox. Use the provider's client authorization code or app-specific password where required. Input displays asterisks and supports paste, backspace, Ctrl+U to clear and Ctrl+C to cancel. The secret is not added to chat history or queued tasks. Never paste it into a chat message or command argument.

Use `koder mail providers` to inspect presets for supported mailbox services, including custom IMAP/POP and SMTP settings. Presets specify connection details, not proof that a provider account supports password authentication. Follow the selected provider's authentication requirements.

## Enable inquiries separately

```text
/mail model on
/mail inquire on
```

The first command requires `allow-mail-model`; the second requires `allow-mail-inquire`. Setup offers the same separate controls. Incoming-mail reminders must also be enabled. None of these enables automatic replies. Disabling model access or reminders disables inquiries; restoring reminders does not silently restore inquiry consent.

While chat or `koder mail watch` runs, the existing IMAP/POP connection checks incrementally. Relevant decisions, replies and followed threads can create short inquiries. Low-relevance messages stay quiet. Advertisements and verification codes are excluded from inquiries/model summaries; inspect a code explicitly with `/mail code <id>`.

## Choose, draft and confirm

For a clear choice such as exchange versus refund, Koder can offer A/B. In the focused inquiry, reply `B` or `other: refund only, please`. It drafts a reply and displays From, To, Subject and Body. The message and its quoted options are untrusted data and cannot authorize sending or change settings.

- `send` opens the final preview and still requires the final `send` confirmation. `--yes` does not bypass it.
- `edit: <request>` revises the draft.
- `cancel` or `ignore` dismisses the focused inquiry.
- Other input remains a normal task rather than being consumed by mail.

For multiple messages, select an explicit ID:

```text
/mail inquiries
/mail choose 9:1 B
/mail choose 9:1 --text "Refund only; do not comment on the packaging"
/mail send-inquiry 9:1
/mail dismiss 9:1
/mail followups
```

Only the focused inquiry accepts a bare A/B. Canceling a send retains its draft. Account changes, changed messages, mismatched Reply-To/From or withdrawn grants block continuation. An uncertain SMTP outcome requires checking Sent mail; it is never automatically resent. Existing send receipts reconcile an interrupted state update so a completed send is not offered twice.

## Limits, quiet hours and follow-up

```text
/mail inquire on --inquire-limit 5 --follow-up-days 14 --draft-language auto --quiet-hours 23:00-08:00
/mail inquire off
```

Defaults are five inquiries or related nudges daily and 14 days of follow-up. Auto drafting follows the incoming language; another two-letter language code can be set explicitly. Clear choices are currently recognized in Chinese/English confirmation, refund/exchange and line-separated A/B forms. If choices cannot be extracted reliably, Koder asks you to inspect the message instead of inventing a decision. New mail does not trigger a model request by default; selecting a reply invokes your existing BYOK model.

Quiet-hour inquiries remain in encrypted storage and can be inspected manually. A later eligible check may notify once, subject to the daily limit. When that limit is exhausted, inspect `/mail check` and `/mail read` manually. Reopening chat does not bypass limits. The original private file lock prevents duplicate inquiries from multiple terminals; unchanged threads do not repeatedly ask an already resolved question.

Follow-up uses References, In-Reply-To, normalized subject and correspondent address. A message saying a refund or shipment is complete is reported as the sender's claim, not independent payment or shipping verification. Settings, inquiries, drafts and follow-ups retain the existing account-scoped encrypted mail store.

## Optional background checks

Without residency, closing chat/watch stops checking. Run `koder activate` and enable mail visibility in Setup → Resident agent and reminders for background checks. Existing mailbox, notification, inquiry and model grants still apply. Background wake only asks; it does not send replies.

Resident quiet hours and daily budgets apply in addition to mailbox limits. System notifications hide private content; accepted submission is not proof of display. Click-to-resume is not available: return with `koder mail inquiries`. See [resident-agent operation](ALWAYS-ON.en.md).

## Verification

Local tests use synthetic mail, local TLS IMAP/SMTP, encrypted files and scripted models. Personal inboxes were not read and real recipients were not contacted. Real provider authentication, native Windows secret input and real-model draft quality remain unverified. See the [0.4.3 release notes](RELEASE-0.4.3.md).
