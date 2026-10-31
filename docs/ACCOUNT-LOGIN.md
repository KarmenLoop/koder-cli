# Sign in to KARMEN from Koder CLI

[English](ACCOUNT-LOGIN.md) · [简体中文](ACCOUNT-LOGIN.zh.md)

Koder CLI 0.6.3 requires a KARMEN account before running the first task. Existing installations without a CLI account session must sign in once after upgrading. Account login is separate from model API keys, mailbox credentials and computer permissions. It does not enable cloud log uploads.

## From installation to your first task

1. Open a new terminal and check `koder --version`.
2. Run `koder login`. Choose the system browser or QR code with the arrow keys and Enter. Esc cancels. Starting an interactive task also offers sign-in.
3. Enter your credentials only on **https://karmensecurity.com/account**. Check the device and confirmation code against the terminal, then approve the CLI.
4. Return to the terminal. The CLI polls the server and continues automatically after saving the protected session. No localhost listener, embedded browser or pasted authorization code is used.
5. Configure a model with `koder setup`, then run `koder` and type a task at `koder >`. `koder activate` manages background residency; it does not open chat.

## QR codes and remote terminals

For a phone, SSH session or unavailable default browser:

```sh
koder login --qr --no-open
```

Scan the code or open the displayed official URL. Links normally expire after ten minutes. Do not share them. Linux browser opening uses `xdg-open`; manual links remain available. Credentials belong to the machine and OS user running the CLI, not the phone used to approve it.

## Status, logout and account changes

```sh
koder account status --json
koder logout
koder login --reauth
```

Setup includes an account menu; chat supports `/login` and `/logout`. Status never prints tokens and does not prove current server reachability. Logout clears local access before attempting remote revocation; `remoteRevoked: false` reports an incomplete remote revocation. Use the account website to manage devices. Reauthentication happens on the website, including MFA when required. A different account selected in another window stops the old conversation from continuing across identities; reopen Koder.

## Protected credential storage

Tokens use the existing native credential layer: macOS Keychain, current-user Windows DPAPI or Linux Secret Service. `account-session.json` contains only non-secret concurrency state. Linux needs an unlocked Secret Service and `secret-tool` (usually libsecret-tools on Ubuntu). An unavailable protected store returns `LOGIN_STORAGE_UNAVAILABLE`; no plaintext fallback is written. Do not share a data directory between OS users.

## Headless tasks and CI

Headless tasks without a session return exit 2 and `LOGIN_REQUIRED` before invoking a model. They never wait indefinitely for terminal input. Establish the protected session separately with `koder login --qr --no-open` under the same OS user before starting CI. Account verification needs a network connection; this release does not provide offline authorization or service-token import. `--yes` grants neither account access nor OS credential permissions.

## Troubleshooting

Recovery codes: `LOGIN_EXPIRED` and `LOGIN_DENIED` require a new authorization transaction; `LOGIN_LOCKED` requires `--reauth`; `LOGIN_NETWORK` and `LOGIN_SERVICE_UNAVAILABLE` indicate account-service connectivity, not an invalid model key. `LOGIN_CLAIM_UNCONFIRMED` and `LOGIN_REFRESH_REQUIRED` require a new login because a token exchange cannot be safely replayed. `LOGIN_STORAGE_INVALID` requires logout and login. `LOGIN_CHANGED` requires reopening the CLI. `LOGIN_PROTOCOL_INVALID` rejects mismatched identity or protocol responses without saving tokens.

The separate shared-memory server login remains available through `koder account memory ...`; it does not satisfy first-party account login or silently enable shared memory.

## Verification limits

Validation includes isolated HTTP registration, email verification, device consent, token claim/refresh, a CLI task and revocation using synthetic accounts and a credential adapter. Public discovery was checked with the actual CLI HTTPS transport. Human phone approval and native credential storage/browser combinations on each OS remain separate beta checks. See the [Chinese walkthrough](ACCOUNT-LOGIN.zh.md) and the release acceptance record.

## Already signed in?

Chat and Setup show the saved account. A valid refresh grant keeps the account visible after its short-lived access token expires; the next task renews and verifies it before execution. Use `koder account status` for a readable summary or add `--json` for scripts. Do not repeat login solely because the short-lived token expired.

The browser option still opens the official device-authorization page. If the website already has a valid KARMEN session, confirm device access there; server locking or reauthentication may still require a password. `koder login --open` opens that page directly. The CLI does not read browser cookies or skip device consent.

## First-message MEMORY_BUSY

`MEMORY_BUSY` means another task owns the selected session. It is separate from account login and available RAM. Version 0.6.3 isolates implicit default sessions across foreground and resident processes, including an older host still running after an update. Explicitly named sessions retain their live ownership: wait for that task or choose another session name. Keep saved history and live locks intact.
