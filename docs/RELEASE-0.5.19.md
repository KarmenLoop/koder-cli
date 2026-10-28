# Koder CLI 0.5.19

This patch fixes inbox polling and background-mail reporting. It preserves the credential recovery changes from 0.5.18.

## Changes

- Continue checking later messages when the server confirms that a listed message is no longer available. Record `MAIL_STALE` separately; authentication, network and storage errors still require recovery.
- Read pending IMAP messages in UID order. A newer arrival during a retry cannot advance the saved position past an older failed read.
- Retain known message headers needed by pending inquiries and recent CLI messages after the small inbox display cache rolls over. Retention is bounded; unknown IDs do not become readable.
- Report background checks as active only when the owner is running, mailbox authentication is valid, and reminder permissions are enabled. A running process alone is insufficient.
- Keep `mail monitor status --json` structured when no mailbox is bound. `mail monitor off` also works after removal or a storage failure and leaves other background tasks running.

## Upgrade

Run `koder update`, exit the old process, reopen Koder, and check that `koder --version` reports `0.5.19`. Then run:

```text
koder mail doctor --json
koder mail check
koder mail monitor status --json
```

An `AUTH_FAILED` result means the provider rejected authentication; it does not mean saved settings disappeared. Use the hidden input in `koder mail setup 163` if an explicit check still fails. Authorize `koder mail monitor on` separately for reminders after closing the terminal. Sending still requires a recipient/body preview and confirmation.

Already-removed mail cannot be reconstructed. The retention fix preserves references that are still known when this version runs; it does not restore headers previously evicted by older versions.

[Mail recovery and beta checklist](MAIL-RECOVERY.en.md) · [Chinese walkthrough](MAIL-RECOVERY.zh.md) · [Installation](INSTALLATION.md).

## Verification boundary

The release attachment `ACCEPTANCE-RESULTS.json` records exact checks and package hashes. Local tests exercise real TLS IMAP/SMTP connections, encrypted mailbox state, actual daemon IPC and native mail tools, including authentication recovery, pending notifications, restart deduplication and uncertain-send protection. Interactive tool tests use synthetic credentials and scripted model responses. Notification dispatch uses a test adapter; no notification display or external recipient delivery is inferred.

Physical Windows and the dedicated Windows 163 mailbox remain **NOT_RUN here, assigned to the beta specialist**. There were no paid model calls or external test emails in this patch. The macOS locked-screen component remains an unsigned candidate. Only GitHub is updated; the website is not deployed.

Windows retains the universal archive; macOS and Ubuntu use their platform archives. Applicable features, current tutorials and canonical Skills remain included.
