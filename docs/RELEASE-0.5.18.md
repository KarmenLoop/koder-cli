# Koder CLI 0.5.18

This patch fixes mailbox credential recovery in chat. A saved account that fails authentication is no longer reported as missing SMTP configuration, and confirming `use` no longer loses the terminal streams required for hidden input.

## Changes

- Keep protected credential input attached to the chat context through confirmation, cancellation and reentry.
- Report saved binding, saved SMTP settings and successful authentication separately in mail status and safe diagnostics.
- Reverify existing credentials on an explicit `koder mail check` or `mail_inbox` refresh. Recovery verifies the receive channel and SMTP authentication without submitting a message.
- Pause automatic checks after authentication rejection and show the exact recovery commands.
- Preserve reminder choices, reading consent, pending notices and delivery records when renewing the same mailbox. Changing the account or connection does not transfer old reading or automatic-reply consent.
- Retain uncertain send receipts across reauthorization. A new send still requires its own recipient/body preview and confirmation.
- Clear stale authentication-attempt errors after a successful mailbox check.

## Upgrade and recover

Run `koder update`, exit the old process, then verify `koder --version` reports `0.5.18`.

```text
koder mail doctor --json
koder mail check
```

If authentication still fails, renew the authorization code through `koder mail setup 163` or the chat's hidden-input flow. Do not paste credentials into chat or logs. To receive reminders after closing the terminal, separately authorize `koder mail monitor on` and verify `active: true` in `koder mail monitor status`.

[Mail walkthrough](MAIL-RECOVERY.en.md) · [Chinese walkthrough](MAIL-RECOVERY.zh.md) · [Installation](INSTALLATION.md).

## Verification boundary

The release attachment `ACCEPTANCE-RESULTS.json` records exact package hashes and checks. Tests cover the actual CLI input/tool stack with synthetic credentials and scripted model responses, local TLS IMAP/SMTP recovery, cancellation, revoked consent and retained uncertain sends. No live 163 mail was sent by this test run. SMTP acceptance and visible recipient delivery remain separate results.

Physical Windows 10/11 behavior, the dedicated Windows 163 account and native notification display remain beta-owned and NOT_RUN here. An attempted desktop-only Electron UI test could not start because Electron is not installed in the isolated CLI checkout; its failure log is retained. This is distinct from the CLI interaction tests. The unsigned macOS locked-use candidate is unchanged. This patch publishes to GitHub and does not deploy the website.

Windows uses the complete universal archive, macOS the Darwin archive, and Ubuntu the Linux archive. Applicable runtime features, the current tutorials and canonical Skills remain in each package; other-platform binaries are excluded as before.
