# Koder CLI 0.4.14-candidate.1

This unpublished candidate extends the released 0.4.13 session dock. It retains the existing executor, conversations, permissions, Apps/MCP, mail, migration and classroom. It does not replace the desktop app or install itself over another task's runtime.

## What changed

- Manage later tasks separately from the current Todo: `/queue on`, `/queue`, `/queue remove N`, `/queue clear --yes`, and `/queue off`. The compact dock shows up to three previews. Clear/remove operations wait for earlier input receipts, including multiple lines pasted in one packet.
- Choose a saved model with Ctrl+P or `/model <name>`. Adjust thinking effort with Ctrl+E or `/effort deep|standard|fast|off`. Changes made during work apply next turn. The footer reports the active request and a pending choice separately; choosing never submits a draft.
- Use Setup to choose the default effort and Ctrl+E's cycle or picker behavior. The same shortcut registry drives help and tips. The existing JSON configuration stores footer preferences; there is no second TOML reader.
- Keep model and effort truth aligned with the original provider. Unknown capabilities receive a visible standard fallback. External ACP and MOA retain their own model configuration; the picker reports that boundary instead of claiming a switch it cannot perform.
- Discover, prepare and call CLI-Anything application adapters through existing Koder tools and command approvals. The pinned source library remains in the package. New `cli_anything_discover`, `cli_anything_call` and `/cli-anything` commands connect it to the existing process owner, with readable argv, bounded deadlines and persisted approval metadata.
- Preserve unresolved effects for reconciliation. Recovered CLI approvals with missing or changed command metadata require a new plan before execution. A process exit is not a claim that the native application performed the intended operation.

## Try the controls

Configure two models in Setup, then open `koder chat`. Press Ctrl+P, select a model, and press Ctrl+E to change effort. Begin a multi-step task and enter `/queue on` while it runs. Send two follow-up tasks, inspect `/queue`, and remove one with `/queue remove 1`. Use Ctrl+T for Todo and `/help` for keys. Queue operations never answer an approval prompt.

`/cli-anything catalog gimp` searches the pinned offline catalog without a model request. `koder skills prepare cli-anything` copies the existing source library into a new project directory. Review the adapter and create the required local environment before registering and invoking it. No source catalog can establish that every listed app is installed or compatible.

## Evidence and remaining scope

The final source regression ran 162 no-key tests with zero failures, cancellations or skips. It includes request-body assertions, generic ACP subprocess behavior, MOA model truth, queue ordering, Todo, input/menu controls, Setup, mail and execution-permission regressions. Independent reviews closed all reported effort, queue, picker and CLI approval findings. Additional kernel checks and package results are retained in the delivery record, without adding overlapping test counts together.

A real owned macOS PTY recorded 12 stages: idle footer, model picker, draft retention, effort, Todo, steering, two queued tasks, help and restored input. An xterm replay checked the visible frames. The model endpoint was a scripted local HTTP server; these results are not a model-quality score.

Native Windows 10/11, PowerShell 5.1/ConPTY/IME, live provider reasoning parameters, real application CLIs and target GUI effects remain NOT_RUN for this increment. Existing Windows and account acceptance records remain historical and are not promoted into new evidence. The unsigned locked-use prototype is excluded. This file is not a publication receipt.

## Learn and roll back

[Chinese control walkthrough](SESSION-CONTROLS.zh.md) · [English control guide](SESSION-CONTROLS.en.md) · [Thinking protocol fields](THINKING-EFFORT.md) · [CLI-Anything guide](cli-anything.md) · [Chinese CLI-Anything walkthrough](CLI-ANYTHING.zh.md) · [180-lesson classroom](courses/index.zh.html).

Use the retained 0.4.13 runtime for rollback. Model/effort quick choices are session-only; optional config fields are additive and task history stays in the original store. Do not erase conversations, credentials or pending external-effect receipts. Keep the candidate in a separate install directory until deliberately selecting it.
