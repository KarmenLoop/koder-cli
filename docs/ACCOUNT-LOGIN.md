# Sign in to KARMEN from Koder CLI

[English](ACCOUNT-LOGIN.md) · [简体中文](ACCOUNT-LOGIN.zh.md)

Koder CLI 0.8.4 offers KARMEN browser/QR sign-in and explicit local access with an access key provided privately by your team. For local use, run `koder login --key` in an interactive terminal; this does not create a cloud account session. See [local access and browser return](LOCAL-ACCESS-AND-RETURN.md). Account login is separate from model API keys, mailbox credentials and computer permissions. It does not enable cloud log uploads.

## Cloud sign-in

These steps follow browser or QR authorization. For the local-access option, follow the [local guide](LOCAL-ACCESS-AND-RETURN.md).

1. Open a new terminal and check `koder --version` reports `koder 0.8.4`.
2. Run `koder login`. Choose the system browser, QR code or local access with the arrow keys and Enter. Esc cancels. Starting an interactive task also offers sign-in.
3. Enter your credentials only on **https://karmensecurity.com/account**. Check the device and confirmation code against the terminal, then approve the CLI.
4. Keep the original terminal open while the CLI polls the server, verifies identity and saves the protected session. The CLI publication record does not establish account website return-button deployment or real browser-return acceptance. Once available, it only requests focus for the original terminal; it does not complete sign-in. Switch back manually if navigation or OS focus is unavailable. No localhost listener, embedded browser or pasted authorization code is used.
5. Configure a model with `koder setup`, then run `koder` and type a task at `koder >`. `koder activate` manages background residency; it does not open chat.

If the browser already has a KARMEN session, press Enter on the default browser option and confirm device access on the page that opens. `koder login --open` skips the choice menu and opens the same page. It still checks the confirmation code; it does not read browser cookies or bypass consent. Server-side locking or reauthentication can still require a password.

## Existing account sessions

For a cloud session, chat and Setup display the signed-in account. Setup opens account status first for an existing login. `koder account status` prints a readable summary; `--json` retains structured output. A saved refresh grant keeps the account visible when its short-lived access token expires; the task entry point renews and verifies it before execution.

`MEMORY_BUSY` means another task owns the selected session, not that login failed or RAM is full. Version 0.6.3 isolates implicit default sessions across resident and foreground processes, including an older host left running during an update. Explicitly named sessions still cannot steal a live owner's lease. Keep history and live locks intact.

## Phone approval and remote terminals

For a phone, SSH session or unavailable default browser:

```sh
koder login --qr --no-open
```

Scan the code or open the displayed official URL. Links normally expire after ten minutes. Do not share them. Linux browser opening uses `xdg-open`; manual links remain available. Credentials belong to the machine and OS user running the CLI, not the phone used to approve it.

## Status, logout and reauthentication

```sh
koder account status --json
koder logout
koder login --reauth
```

Setup includes an account menu; chat supports `/login` and `/logout`. Status never prints tokens and does not prove current server reachability. Logout clears local access before attempting remote revocation; `remoteRevoked: false` reports an incomplete remote revocation. Use the account website to manage devices. Reauthentication happens on the website, including MFA when required. A different account selected in another window stops the old conversation from continuing across identities; reopen Koder.

## Protected cloud credentials

Cloud tokens use the existing native credential layer: macOS Keychain, current-user Windows DPAPI or Linux Secret Service. `account-session.json` contains only non-secret concurrency state. Linux needs an unlocked Secret Service and `secret-tool` (usually libsecret-tools on Ubuntu). An unavailable protected store returns `LOGIN_STORAGE_UNAVAILABLE`; no plaintext fallback is written. Do not share a data directory between OS users.

## CI and headless tasks

Headless tasks without a verified account or a previously enabled local-access marker return exit 2 and `LOGIN_REQUIRED` before invoking a model. They never wait indefinitely for terminal input. Establish the protected session separately with `koder login --qr --no-open` under the same OS user before starting CI. Account verification needs a network connection; local access does not authorize cloud services or import service tokens. `--yes` grants neither account access nor OS credential permissions.

## Windows storage diagnostics

For `LOGIN_STORAGE_UNAVAILABLE` on Windows, run `koder account doctor --json` before repeating browser sign-in. This offline check uses synthetic data to test the bundled helper, CurrentUser DPAPI and directory writes without replacing the saved account. It removes its probe file. A `ready` result verifies storage, not account authentication. Run `koder login --open`, approve the device, then check `koder account status --json`.

Storage reports distinguish `HELPER_UNVERIFIED`, `PROCESS_TIMEOUT`, `DPAPI_FAILED`, `ACCESS_DENIED` and `DISK_FULL`. Share the fixed reason, operation, CLI version and report ID, never a token, authorization URL or confirmation code. Windows does not require Linux Secret Service. Inspect system protection records if a helper is blocked; do not disable protection or switch OS accounts to bypass the failure. Reinstall from the official source only when component damage is confirmed.

Windows now checks protected storage before opening browser authorization. A failed attempt no longer permanently switches the process to temporary storage. An atomic write failure does not proactively delete a previously saved credential. Plaintext token fallback remains disabled. On macOS and Linux, `doctor` reports `not-probed`; it does not claim to have tested their interactive credential services.

## Authorization recovery

Recovery codes: `LOGIN_EXPIRED` and `LOGIN_DENIED` require a new authorization transaction; `LOGIN_LOCKED` requires `--reauth`; `LOGIN_NETWORK` and `LOGIN_SERVICE_UNAVAILABLE` indicate account-service connectivity, not an invalid model key. `LOGIN_CLAIM_UNCONFIRMED` and `LOGIN_REFRESH_REQUIRED` require a new login because a token exchange cannot be safely replayed. `LOGIN_STORAGE_INVALID` requires logout and login. `LOGIN_CHANGED` requires reopening the CLI. `LOGIN_PROTOCOL_INVALID` rejects mismatched identity or protocol responses without saving tokens.

Version 0.7.1 fixes first-run authorization being stopped by the supervisor's 15-second startup deadline, followed by a false `UPDATE_WORKER_FAILED`. It also prevents terminal focus reports, navigation and bracketed paste from being treated as Escape. After updating, run `koder login --open` and approve the new page while keeping the original terminal open. An old canceled page cannot authorize the new transaction. A real Escape or Ctrl+C still cancels. If `LOGIN_CANCELLED` appears without a deliberate cancellation, retain the report ID.

The separate shared-memory server login remains available through `koder account memory ...`; it does not satisfy first-party account login or silently enable shared memory.


In chat, `login`, `sign in`, `登录` and `打开网站登录` open account authorization directly without calling a model. `/login` retains the browser/QR picker. During a task, a plain login request queues until the task finishes.

Terminal return uses known macOS Terminal/iTerm applications, a captured Windows console owner, or an existing Linux X11 `wmctrl` and window ID. Wayland, embedded terminals and OS focus restrictions fall back to a clear manual-return message. No additional software, elevated privileges or accessibility access is requested for focus.

`KR-...` identifies a report, not its cause. `/error` now includes the failing account stage, HTTP status and safe network reason or Cloudflare Ray when available. It excludes authorization URLs, state, passwords and tokens. `LOGIN_ACCESS_BLOCKED` means the service or gateway refused access; `LOGIN_ENDPOINT_NOT_FOUND` identifies a missing route; `LOGIN_TIMEOUT` identifies a request deadline. These do not imply an incorrect password. `LOGIN_BROWSER_OPEN_FAILED` leaves the same bound link available for manual opening while polling continues.

## Local access and browser return

[Local access and browser return](LOCAL-ACCESS-AND-RETURN.md)

## Verification limits

Existing account-flow records include isolated HTTP registration, email verification, device consent, token claim/refresh, a CLI task and revocation using synthetic accounts and a credential adapter. Earlier discovery checks are separate from the current CLI website activation and do not certify production human sign-in. Human phone approval and native credential storage/browser combinations on each OS remain separate beta checks. See the [Chinese walkthrough](ACCOUNT-LOGIN.zh.md) and the release acceptance record.

The 0.8.4 account suite records 198 passed checks and two conditional local-key checks skipped. Those skipped cases are not fresh proof of local-key task completion. Human registration and browser-to-desktop return remain **NOT_RUN**.

## Recorded Windows VM checks

The exact published 0.8.4 universal package and PowerShell installer passed hash verification in a [Windows Server 2022 x64 Actions run](https://github.com/KarmenLoop/koder-cli/actions/runs/41535590608). Seven cases passed: CurrentUser DPAPI, plain and Unicode/space paths with fresh-process readback, legacy ciphertext compatibility, synthetic-account authorization/persistence/refresh/logout, recovery after a helper-spawn failure, and signed-out storage diagnostics. This is not a human production sign-in or a native Windows 10/11 GUI check.
