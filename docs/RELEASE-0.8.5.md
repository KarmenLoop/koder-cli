# Koder CLI 0.8.5

[English](RELEASE-0.8.5.md) · [简体中文](RELEASE-0.8.5.zh.md)

**Published November 3, 2026.** Koder CLI 0.8.5 is published on the official website. Formal activation and 18 targeted HTTPS checks are verified. The exact [Windows Server 2022 / Node 22.23.4 run](https://github.com/KarmenLoop/koder-cli/actions/runs/41622933939) passed all seven storage/account cases. Full-file downloads, resume, update paths and public macOS installation are being verified separately by the product owner; the independent website PUBLIC414 and human/native desktop checks remain separate.

## What changes

This patch focuses on sign-in recovery:

- **Linux storage checks happen before browser authorization.** A missing `secret-tool` is reported directly. If the helper starts, `not-probed` still means the Secret Service has not been verified; login must successfully write and read protected credentials.
- **Temporary identity-check failures keep the saved account.** HTTP 429/503 responses, including HTML gateway pages, are reported as service errors. They do not by themselves mean the stored identity is corrupt.
- **Cancellation and replacement preserve the previous session where recovery can be verified.** Canceling a credential read does not start a refresh. If replacement credentials fail readback, the client attempts to restore and verify the prior protected record under the same lock. Failed restoration remains an error.
- **Concurrent refreshes wait for their owner.** The wait is cancellable and bounded at 45 seconds. `LOGIN_BUSY` asks you to retry later; deleting a live lock or account file is not a recovery step.
- **Linux credential output uses complete UTF-8.** Split Chinese or emoji bytes are decoded together; corrupt input fails with `INVALID_UTF8`. Expired saved grants cannot start a task, including paths that skip remote identity checks.

An interrupted token claim or rotation can leave its consumption uncertain. The client does not replay that exchange automatically. Model access, computer permissions, stored projects and the 79 existing Skill identities are retained. The private kernel has implementation changes; it is not byte-identical to 0.8.4.

## Diagnose before starting another login

```sh
koder --version
koder account status --json
koder account doctor --json
```

Use the [sign-in guide](ACCOUNT-LOGIN.md) for browser authorization, cancellation, replacement and error recovery. A storage result does not prove authentication. The account website has its own deployment and verification process; a CLI build or an isolated service test does not establish that production pages have changed. Keep the original terminal open and return manually when a browser or OS cannot focus it.

## Release checks and remaining limits

| Record | Result | Scope |
| --- | --- | --- |
| Packaged account/session suite | 172 passed, 2 conditional local-key skips | 174 tests; skipped cases are not passes |
| Packaged agentd suite | 36 passed | Separate completed run; together the two suites record 208 passes and 2 skips |
| Packaged credential suite | 24 passed, 2 Windows-only skips | No 0.8.5 Windows-native conclusion from this Mac run |
| Packaged memory kernel | 23 passed | Existing native memory regression |
| Current account-service integration | 1 passed | Actual service implementation with disposable data, a synthetic mailbox and a credential adapter; production deployment unverified |
| Local fresh installation | Exit 0, `koder 0.8.5` | Existing Node and an owned loopback mirror; user profiles and real accounts untouched |

Earlier cold-start runs hit fixture or file deadlines and remain recorded. The final runs kept all assertions: a 60-second owned credential fixture, a separate 900-second agentd file budget and 300-second budgets for the other files. These test-fixture adjustments did not change product login timeouts. The credential, memory and service suites are reported separately, without an inflated combined score.

The intake freezes **32 files totaling 1,111,751,023 bytes**. The universal archive is **483,508,725 bytes**, SHA-256 `7cbfeb7c5813c8228ed8c5c2a64cb211a0826af8328a1141930de5c64e32a833`. The archive sizes and hashes are frozen. Formal activation and 18 targeted public HTTPS checks passed. Complete public downloads, range/resume, default update paths and a public macOS install have separate producer receipts; they are not inferred from local checks.

The [0.8.5 Windows Server 2022 / Node 22.23.4 run](https://github.com/KarmenLoop/koder-cli/actions/runs/41622933939) passed all seven CurrentUser DPAPI/storage and synthetic-account cases against the exact official archive and installer. The 0.8.4 VM result remains historical. Human production registration, real inbox delivery, phone/QR approval, browser return, native Windows 10/11 and Ubuntu GUI, and paid-model quality remain unverified by these records.

The README shows six real **0.8.5** terminal-output captures in English and Chinese; older images retain their original labels. Existing releases, failed attempts, licenses and third-party attribution remain available.

[Previous 0.8.4 notes](RELEASE-0.8.4.md) · [Account recovery](ACCOUNT-LOGIN.md) · [Command reference](COMMAND-REFERENCE.en.md)

Human production sign-in/browser return and native Windows 10/11 or Ubuntu GUI: **NOT_RUN**.

## Bundled-guide errata

The frozen r1 archives retain some older platform-guide snapshots. The current website and GitHub guides correct their versioned installer URLs, version checks and browser-return wording; use those current guides for installation and sign-in. The source documents have been corrected for later packaging. Original r1 archive bytes remain unchanged.
