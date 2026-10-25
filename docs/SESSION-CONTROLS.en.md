# Queue, model selection and thinking effort

Available in 0.4.14-candidate.1. This guide ships with the candidate; the public release retains its own version and validation notes.

## Queue tasks separately from Todo steps

Todo describes steps inside the current task. The queue holds later, independent tasks. `/queue on` persists queue mode; new messages run in FIFO order after the active task. `/queue` lists pending messages; `/queue remove 2` removes the second pending task; `/queue clear --yes` clears pending tasks without canceling active work. `/queue off` or `/input steer` restores mid-run steering. The dock shows up to three previews while retaining complete message text.

Queue text never approves tools. Esc and exact stop commands keep the existing cancellation behavior. Clearing Todo does not clear the queue. With steering, a receipt acknowledges input for the next safe model step, not a rewrite of an in-flight request.

## Choose a configured model

Configure models in Setup first. Ctrl+P or `/model` opens the existing input overlay; arrows select, Enter confirms and Esc cancels. The draft remains editable and is not sent. `/model <saved-name>` switches directly. `/model show` reports the session selection and effective effort. Invalid names retain the previous choice.

Idle choices update the footer immediately. Busy choices apply next turn: the footer keeps the actual current model and shows the pending choice separately. Completed tools are not replayed. Quick choices are process/session-only; `/model auto` restores workspace/global resolution. The existing `/model use <name>` still changes the global provider.

External ACP engines and MOA retain their own model configuration. The quick picker reports `MODEL_SELECTION_MANAGED` instead of pretending to change it. ACP displays the model advertised by its engine, or an engine-managed placeholder when none is advertised. MOA displays its aggregator model. Effort is adapted separately for each MOA member; the footer reports the aggregator's effective effort.

Priority: session selection or `-m <name>`, then workspace `.koder/config.json` `activeModel`, then the original global provider. Workspace configuration contains a reference, not a copy of credentials.

## Set thinking effort without changing models

Ctrl+E cycles Standard → Deep → Fast → Off → Standard. `/effort` and `/thinking` open a picker; `/effort deep|standard|fast|off` selects directly. Busy changes apply next turn. Unsupported capability falls back to standard behavior with a visible notice and honest footer. Existing provider reasoning settings remain labeled Provider default when no explicit effort overrides them. External ACP engines currently report this control as unsupported.

```sh
koder chat -m second --effort deep
koder ask "Explain this function" --effort fast
```

Priority: session/flag, workspace `thinkingEffort`, user `thinkingEffort`, then standard. Effort is a request preference, not a guarantee of speed, price or quality. [Protocol fields and capability declarations](THINKING-EFFORT.md).

## Configure the compact dock

Setup → Session interface controls footer slots, Todo expansion, default effort, Ctrl+E cycle/picker and mid-run input. Use the existing `~/.koder-cli/config.json` or `KODER_CLI_HOME`; there is no additional TOML reader.

```json
{
  "sessionInputMode": "steer",
  "thinkingEffort": "standard",
  "tui": {
    "todoExpanded": false,
    "effortShortcut": "cycle",
    "statusLine": {"enabled": true, "items": ["model", "effort", "mode", "tasks", "tips"]}
  }
}
```

The `status_line.items` alias is accepted in the same JSON store and synchronized by Setup. `/reload-tui` preserves conversation and draft. Unknown slots warn once. Empty lists use no extra space; short terminals prioritize input. Mouse reporting is not enabled: use the advertised keys or slash commands.

Keys: Enter submits, Ctrl+J inserts a newline, Esc closes an overlay first or cancels work, Ctrl+T toggles Todo, Ctrl+P selects a model, Ctrl+E changes effort, Ctrl+U clears preceding input. An empty `/` opens editable suggestions; Tab fills without sending. `/help` uses the same key registry.

## Validation

`session-controls.mjs` resolves workspace references; `thinking-effort.mjs` adapts request fields; `chat.mjs` changes bindings between turns. The existing prompter owns FIFO and fresh approvals. Visible conversation and receipts survive switching; private provider reasoning signatures are not replayed across bindings.

Run `TERM=xterm-256color node --test --test-concurrency=1 test/session-controls.test.mjs test/thinking-effort.test.mjs test/session-dock.test.mjs test/session-input-terminal.test.mjs`. The owned `test/fixtures/session-controls-pty.py` records real macOS/Linux PTY stages with a scripted HTTP provider. It does not verify native Windows/ConPTY/IME, live providers or target applications.

[Todo and input guide](SESSION-DOCK.en.md) · [CLI-Anything](cli-anything.md) · [Classroom](courses/index.zh.html).
