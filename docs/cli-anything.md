# Local application CLIs

Use `/cli-anything catalog gimp` inside chat, or `koder cli-anything catalog gimp` from your shell. Chat forwards these commands through the existing dispatcher.

Koder includes CLI-Anything discovery metadata pinned to
`HKUDS/CLI-Anything@34f519533bc175d2fe287ab8316b0dd99bb9cc43` and an adapted skill.
The existing `bundled:cli-anything` source library at the same revision remains included. These sources are not an installed application CLI environment or target app. The adapter does not invoke CLI-Hub's global installer or use an unrelated bundled Python runtime automatically.

1. Run `koder cli-anything catalog gimp` to inspect upstream requirements. The
   catalog is offline metadata, not a list of installed or verified applications.
2. Run `koder skills prepare cli-anything` to copy the existing verified source
   library into a new project-local directory, without running it. Read the
   returned path's SKILL.md, cli-anything-plugin/HARNESS.md and selected adapter.
   Review the relevant source at that revision. Confirm the target
   app's version, license and OS support. Network downloads retain their existing
   approval requirements. Never execute an upstream catalog `install_cmd` blindly.
3. In your project, create a local venv with copies rather than external symlinks
   (`python3 -m venv --copies .venv`), and separately approve any dependency
   downloads. Keep reviewed source in the project. Koder refuses executable paths
   that resolve outside the workspace, including a symlinked venv interpreter.
4. Write `app-clis.json`:

   ```json
   {"version":1,"apps":[{"id":"gimp","executable":".venv/bin/cli-anything-gimp","prefixArgs":[],"platforms":["linux","darwin"],"python":".venv/bin/python","package":".koder-skill-cli-anything/gimp/agent-harness"}]}
   ```

   Windows uses `.venv/Scripts/python.exe` and the corresponding `.exe` entry
   point; list `win32` only when that application CLI actually supports it.
5. Run `koder cli-anything register app-clis.json`. This creates the project-only
   `.koder/cli-anything.json` once, without running anything. An existing
   registration is never silently replaced; review/edit that project file to
   update it. `list` reads registrations. `inspect gimp` resolves the executable
   and platform, verifies POSIX execute permission, and rejects unsupported Windows script launchers (`.cmd`, `.bat` and shebang files). This does not launch the CLI or prove the target app works.
6. `koder cli-anything install gimp` shows the literal argv. With `--yes`, it runs
   the reviewed local package's build hooks using the local venv's pip, with
   `--no-index --no-deps --no-build-isolation`. This may fail if build tools or
   dependencies are missing. No global installer or automatic fallback runs.
7. `koder cli-anything invoke gimp -- --help` shows an argv plan. Repeat with
   `--yes` before `--` to approve this invocation. Pass flags after `--` so Koder
   does not interpret app flags. Use each CLI's actual help; JSON mode is not
   universal. Inspect the produced artifact or real app state after execution.

In agent chats, `cli_anything_discover` searches the pinned catalog, lists local
registrations with `scope: "registered"`, or inspects an `id`.
`cli_anything_call` takes `id`, `action: "invoke"` and literal `args` (or action
`install`). It returns the original Koder shell approval pause; only approval
runs the command. The original process executor owns cancellation, deadlines,
output bounds and receipts. Arguments are encoded as data in a static Node
launcher, then spawned with `shell: false`. The requested argv remains in the
tool-call arguments and CLI review output. Pending agent approvals also carry the exact resolved argv (including manifest prefixes and local install package), operation and deadline; the approval display shows these before the encoded transport command. This metadata is validated against the actual command before execution. Do not treat a process exit as proof
of a target application's state, or retry effects after an unknown receipt.

Read the bundled method with `koder skills show builtin:cli-anything`. Import a
reviewed generated skill with `koder skills import <local-skill-folder>`; import
alone neither installs software nor authorizes execution. Connected Apps/MCP
remain the preferred channel when they meet the task. Existing account and
network grants still apply.

Validation covers an isolated local executable through the real Koder approval
and process receipt path. GIMP and other native target applications: **NOT_RUN**.

Pending CLI approvals from older versions without the bound argv/deadline metadata
are not executable after reload. Recovery reports `CLI_APPROVAL_REPLAN_REQUIRED`;
reject the old pending command and request a fresh plan. This does not replay an
interrupted operation or change unknown-effect reconciliation. Genuine legacy
shell approvals keep their existing legacy timeout behavior.
