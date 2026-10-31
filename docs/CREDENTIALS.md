# Credentials and private login input

**Before your first task:** run `koder login` and approve the CLI in your system browser or by scanning its QR code. Follow the [KARMEN sign-in guide](ACCOUNT-LOGIN.md). A KARMEN session, model API credentials, mailbox access, and computer permissions are separate. Headless tasks without a session return `LOGIN_REQUIRED`.

Koder CLI 0.5.14 replaces the lightweight CLI's unconditional login cancellation with a working private-input route. [中文手把手教程](CREDENTIALS.zh.md).

Start with `koder --version`, then `koder`. If the command is missing, run `export PATH="$HOME/.local/bin:$PATH"`. `koder activate` starts the background host; it does not open chat.

## Input and use

Ask to bind a mailbox, GitHub token, or an API key for an existing named model. Koder shows the service and purpose, asks for `use`, and reads the credential with hidden terminal input. Before use it shows the actual destination and asks for a separate `use` confirmation. Enter cancels. Credentials do not go into model messages, tool arguments, or conversation history.

Mail uses the existing TLS provider catalog and protected binding store. GitHub uses its existing protected token store. Model keys use the existing local configuration file with mode 0600, not an encrypted keyring. Binding does not authorize sending messages, changing repositories, or reading an inbox. Test a changed model with `koder model test`.

For a website or local app on Ubuntu, open the login page and grant the existing desktop permission. Koder captures the actual controls, then fills only the separately confirmed account and protected password fields through the AT-SPI driver. A fresh observation must verify subsequent login; filled is not logged in. Unsupported custom controls, CAPTCHA, MFA and unavailable desktop sessions require the original service's login flow. The private GUI fill route in this release is Ubuntu-specific.

For a privileged Ubuntu operation, Koder shows an absolute program path and its arguments. After confirmation, native sudo reads the password from the controlling terminal. Koder never collects or saves the sudo password, uses `sudo -S`, changes sudoers, or grants administrator rights. Cancelled or timed-out commands are reported as unknown if they may have started and are not replayed automatically.

## Lifetime and cancellation

Temporary credentials are encrypted with a fresh process key and represented by an opaque handle scoped to one session and root task. Handles expire after 15 minutes and are consumed before dispatch. New tasks and closed sessions cannot use old handles. Persistent mail/GitHub/model bindings retain their existing storage rules.

Ctrl+C, EOF and task cancellation stop hidden input and restore the terminal. A connected agentd session asks through its frontend; a detached daemon cannot supply a password. `--yes`, JSON and pipes do not bypass credential input or confirmation. Use existing account bindings or environment configuration for headless tasks.

## Errors

- `LOGIN_HANDLE_EXPIRED_OR_WRONG_TASK`: request fresh input for the current task.
- `LOGIN_PRIVATE_FILL_UNAVAILABLE`: use the real application's login UI.
- `COMPUTER_PERMISSION_REQUIRED`: grant the existing scoped desktop permission.
- `COMPUTER_SNAPSHOT_STALE`: capture and confirm the target again.
- `OAUTH_NOT_CONFIGURED`: the service requires OAuth; a password is not a substitute.
- `LOGIN_MODEL_CHANGED`: recheck the model endpoint before supplying a key.
- `LOGIN_RESULT_UNKNOWN`, `COMPUTER_ACTION_UNKNOWN`, `SYSTEM_COMMAND_INTERRUPTED`: inspect the actual result before considering another operation.

Isolated fixture checks do not certify a customer's account, physical desktop, or third-party authentication flow.
