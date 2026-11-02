# Local access and return to CLI (0.8.4)

[English](LOCAL-ACCESS-AND-RETURN.md) · [简体中文](LOCAL-ACCESS-AND-RETURN.zh.md)

This guide describes local access and terminal return in Koder CLI 0.8.4. Account website deployment and real browser-to-desktop acceptance remain separate from the CLI release.

## Enable local access

Run `koder login --key`, choose the local-access item in the login picker, or use Setup → KARMEN account. Enter the supplied access key in the hidden prompt. Do not put it in shell arguments, tasks, scripts or feedback. Empty Enter or Ctrl+C cancels.

A correct key enables local use with your configured model and existing permissions. `koder account status --json` reports `state: local-access`, `user: null` and `cloudAuthenticated: false`. It does not create a cloud identity, grant entitlements, configure a model, or grant computer permissions. A local access marker persists in the current CLI data directory. The key is not stored or sent to the account service or model. Headless tasks can use an explicitly enabled marker; pipes, JSON mode and `--yes` cannot enable it.

Use `koder logout` to disable local access and sign out of any saved cloud session. Existing task sessions check identity generations before their next model step. `koder login --open` still offers real browser authorization; successful account verification replaces local mode.

## Return after browser authorization

The browser flow attempts to register a current-user `koder-login` handler after identifying the original terminal. Only supported clients send the website hint. Account website return-button deployment and real browser-return acceptance need separate confirmation. Once available, **Return to Koder CLI** is offered after device consent in supported environments. Clicking it requests window focus; it does not authenticate the CLI. Sign-in still depends on the existing PKCE flow, server polling, identity checks and protected token storage. The original terminal continues polling, validating the server identity and saving protected credentials. Keep it open. If the browser asks to open a local application, approve that navigation or switch to the original terminal manually.

Windows checks the captured window's owner before requesting focus. macOS uses a private helper for Terminal/iTerm. Linux X11 uses an existing `wmctrl` and window ID. Wayland, SSH and unrecognized terminals use the manual-return path. No administrator, accessibility permission, localhost listener or second Agent session is required. Existing protocol handlers owned by other applications are not overwritten.

Navigation records contain no tokens and expire after ten minutes. Canceling or failing authorization removes the corresponding record. They cannot extend the server transaction or execute commands supplied by a website. Phone approval continues through the existing polling flow.

## Troubleshooting

`LOGIN_KEY_INVALID` means the key was rejected. `LOGIN_KEY_INTERACTIVE_REQUIRED` requires a hidden terminal prompt. `LOGIN_LOCAL_ACCESS_INVALID` requires disabling the damaged marker with `koder logout` before enabling it again. `LOGIN_LOCAL_ACCESS_UNAVAILABLE` means a local storage operation failed. `LOGIN_RETURN_*` indicates a window-navigation problem; use the original terminal's account status to assess authentication. `LOGIN_STORAGE_UNAVAILABLE` still requires `koder account doctor --json`; a return button cannot save a token on its behalf.

## Verification limits

Earlier isolated records cover local tasks, hidden input, cancellation, logout, identity generations, browser polling and all three OS registration adapters. Human browser sign-in, real external-application prompts and native Windows/Ubuntu desktop clicks remain **NOT_RUN**. Isolated macOS helper compilation does not establish real desktop registration or focus. The complete browser-return path needs its own website and human-desktop acceptance; CLI publication alone does not establish it.

The 0.8.4 account suite records 198 passed checks and two conditional local-key checks skipped. Those skipped cases are not fresh proof of local-key task completion. Human registration and browser-to-desktop return remain **NOT_RUN**.
