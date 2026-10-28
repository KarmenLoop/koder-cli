# Koder CLI 0.5.15

This candidate improves website delivery and mail diagnostics, and includes task model routing, local telemetry controls and the consolidated package plan. Publication waits for public verification of the first-party update feed. Existing 0.5.14 downloads are unchanged.

## Website delivery

`workspace_preview start` can now start an existing Node backend or npm development script through the normal command approval. Koder supervises the process, waits for a real loopback response and retains the preview between model steps. Stop, cancellation, startup failure and owner disconnection clean up only the process Koder owns. Unknown cleanup remains unverified.

Discovery recognizes conventional Node HTTP backends before static HTML. Existing preview panels switch to the actual backend. A static page no longer satisfies delivery when the project requires server APIs. Conventional `selftest` scripts count as verification only with a successful process and cleanup receipt; masked exits do not count. Final tests must follow file changes and preview checks.

A real MiniMax-M3 exercise produced a local bookshop site with requirement questions, a design choice, persistent reservations and a working backend preview. Separate browser checks verified filtering, reservation submission, persistence after reload and cancellation. The website self-test passed 33 checks. These are bounded local observations: several model turns exhausted the test budget or failed final delivery checks. They do not establish one-shot completion, a quality score, mobile accessibility or production deployment.

## Mail diagnostics

Run `koder mail doctor --json` on the machine that holds the mailbox binding. It reports local configuration, sending availability, background-monitor blockers and aggregate uncertain deliveries. It does not fetch or send messages and excludes addresses, credentials, subjects, message bodies and receipt identifiers.

`koder mail monitor status --json` produces a single JSON document. A running daemon alone no longer appears to mean that mail monitoring is active. Monitor failures point to the safe diagnostic command.

The dedicated 163 account is on the Windows beta machine. Real SMTP submission, recipient delivery, inbox refresh and visible reminders remain **NOT_RUN** in this candidate's Mac verification. No private mailbox was copied or accessed.

## Retained behavior and controls

- Automatic model selection uses configured models and supported reasoning settings at task boundaries. Manual overrides, cancellation and cost budgets remain effective.
- Local task telemetry is enabled by default and can be disabled in Setup. This does not enable cloud log uploads or require online activation.
- Headless file contracts check exact paths, actual artifacts and verification receipts. A valid skip or incomplete result is not success.
- Universal, macOS and Linux archives preserve supported capabilities and current Skills. Platform packages omit other-platform binaries; historical tutorial exports stay in source history. Current exports and license notices remain in each package.
- Private credential input, Ubuntu support, existing permissions and uncertain-effect reconciliation remain in place. The unsigned macOS locked-screen component remains a candidate.

The release attachment `ACCEPTANCE-RESULTS.json` separates source tests, exact-package checks, real-model observations and platform items that were not run. Windows physical acceptance remains with beta specialists. This change does not deploy the company website.
