[English](RELEASE-0.6.2.md) · [简体中文](RELEASE-0.6.2.zh.md)

# Koder CLI 0.6.2

Sign in to KARMEN from the system browser or a terminal QR code before running tasks. The CLI polls the official authorization service, saves tokens in protected native storage and resumes the original entry point. Website passwords stay on the website. No localhost callback or pasted authorization code is used.

- `koder login`, `koder logout`, `koder account status`, Setup and chat `/login` / `/logout` use the same account flow.
- Unsigned-in headless tasks return `LOGIN_REQUIRED` before model execution. Refresh rotation, cancellation, failed storage and account changes have explicit recovery codes.
- Opt-in local feature repairs use QuickJS-WASM with bounded synchronous JSON calls. Generated source cannot access host files, processes, networking, credentials or the kernel. Seven existing feature modules remain supported; originals, regression checks and rollback are retained.
- Steering and cancellation stay responsive during account preflight. Setup retains its original focus. Update messages name the official website.
- Native login allows slower DNS address connections without replaying authorization claims. Whole-request deadlines and cancellation still apply.

The release retains all existing skills and platform capabilities. Model keys, mailbox binding and computer permissions remain independent. Local telemetry settings and cloud-log-upload deferral are unchanged.

[Sign-in walkthrough](ACCOUNT-LOGIN.md) · [Local repair](SELF-REPAIR.md) · [Installation](INSTALLATION.md) · [Chinese notes](RELEASE-0.6.2.zh.md)

Binary downloads and updates use the [CLI website](https://kodermodule.com/cli-download.html). GitHub receives documentation, not a new binary Release. Published 0.6.1 files are not replaced.

Local protocol, HTTP integration and packaged checks are listed in ACCEPTANCE-RESULTS.json. Real human phone approval and native OS credential storage/browser combinations remain beta acceptance. Windows and Ubuntu GUI, real 163 mail delivery, notification visibility and the independent ten-task/SELECTED-50 quality targets are not claimed to pass. Prior failed or unrun results remain in their original release receipts. The macOS locked-screen component remains unsigned.

## Publication and verification

The official stable feed reports 0.6.2. The first default update check from the packaged program returned `NETWORK_FAILED`. After publication, a new default check of the unchanged program passed in 2.24 seconds, with no observer, source changes or network overrides, and reported 0.6.2 up to date. The first failure is retained, and its underlying connection cause was not established.

The release owners' final receipt records complete public downloads of all 32 release files, matching their frozen names, sizes and SHA-256 values. Package and website regression results were supplied by the release owners; this documentation update did not rerun those product tests. See the website's [release acceptance record](https://kodermodule.com/releases/cli-0.6.2/ACCEPTANCE-RESULTS.json). Human browser/phone approval, native credential storage on each OS, Windows/Ubuntu GUI, real 163 mail, visible notifications and independent MiniMax quality exercises remain outside this round's acceptance.
