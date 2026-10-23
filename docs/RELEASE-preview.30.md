# Koder CLI 0.4.0-preview.30 Beta

This is a focused multiwindow hotfix on the complete preview.29 runtime. Existing models, BYOK settings, permissions, Skills, project history, tutorials and recovery remain available. New writing-price and inline-script research remains in a separate unpublished candidate.

## Fixed

- A new default task now checks both lifetime ownership and the older per-turn lock before reading history. If an older Koder process holds only the per-turn lock, the new task receives an independent session immediately. An explicitly named busy session remains protected.
- A CLI worker that loses its supervisor connection cancels its own pending request, closes its input wait and releases its own session. Disconnects during startup and restart acknowledgement no longer leave a 15-second waiter behind. Normal updates retain their existing restart and recovery flow.
- Ownership records include a process-instance identifier. A record from an earlier Koder incarnation with the current recycled PID no longer blocks the current process. Legacy live owners and other unverifiable processes remain protected; records are not deleted merely because they are old.
- A busy notice describes unavailable ownership rather than asserting that another visible window exists. Automatic isolation prints the new session name and its resume command.

## Use two or three independent tasks

Open separate terminal windows. Running `koder` in each window automatically separates occupied default sessions. To choose stable names, use `koder chat --session website`, `koder chat --session slides` and `koder chat --session tests` in separate windows. Resume with the displayed session name. Same-project files remain shared; use separate project directories when outputs must be independent. Do not delete the memory directory or terminate unrelated Node processes to clear a notice.

## Update

Run `koder update --check`, then `koder update`, and verify `koder --version`. Close a finished older window normally. Updates retain settings and stored history. All eight printable tutorials and the complete English and Chinese guides describe preview.30.

## Evidence and limits

The original public preview.29 archive reproduced the legacy-lock and recycled-current-PID defects. The focused candidate passed 35 local regressions. Independent review found no required fixes in the three changed runtime components. Windows subprocess checks use synthetic loopback responses, not paid provider accounts. Exact packaged checks and native results are recorded separately in the publication receipt.

PowerShell 5.1-only cold startup, Windows 10 and Windows 11 x64 client coverage, unobstructed GUI focus/input, ConPTY/IME/UAC and live account acceptance remain incomplete. Windows Server is not a Windows 10/11 client. Earlier failures remain recorded. This Beta does not claim full Windows certification, a new writing score, a full third-party reverse-tool replacement or validation of the optional external engine. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as previously documented.

Read [the multiwindow guide](MULTI-WINDOW.md), [installation](INSTALLATION.md), [complete English guide](USER-GUIDE.en.md) or [Chinese guide](USER-GUIDE.zh.md).
