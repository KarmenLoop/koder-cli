# Windows cold-start evidence and remaining checks

This report records the candidate investigation retained in 0.4.0-preview.29 Beta. Publication does not establish complete Windows 10/11 acceptance; the failures and open checks below remain valid.

On fresh disposable Windows 11 Enterprise ARM64 clients, the first system PowerShell 5.1 credential helper reproducibly reached its unchanged 10-second deadline and was terminated. The connections host then exited and the public CLI reported host startup failure. Replacing only `Add-Type` with reflection did not improve startup. See [R5](https://github.com/KarmenLoop/koder-cli/actions/runs/39921421018).

In the fresh-client [R6 comparison](https://github.com/KarmenLoop/koder-cli/actions/runs/39922311614), the baseline again failed at the helper deadline. The installed PowerShell 7 variant completed the first native helper in approximately 1.8 seconds, then passed MCP add/test and real Agent tool dispatch/continuation with a scripted loopback model. [R7](https://github.com/KarmenLoop/koder-cli/actions/runs/39923536461) repeated the successful connection path.

The runtime now prefers a regular, non-symlink `ProgramFiles/PowerShell/7/pwsh.exe` when installed. It does not search an arbitrary PATH entry or install a shell automatically. Native protection remains DPAPI CurrentUser, with private UTF-8 pipe input and no secret command arguments. The per-helper deadline is unchanged. Windows PowerShell remains the fallback; cold-start stability on machines with only that runtime is **not resolved or certified** by these results.

Actual Snapshot returned the owned form; the independent file nonce and normal window close passed. The hosted client image's system first-run screen prevented the owned window from becoming foreground. Both the original hidden-console form launch and a normal visible launch failed the exact foreground switch/readback gate. No click/type was permitted after failed focus. No privacy option, execution policy or security setting was changed. GUI acceptance remains FAIL/blocked by the available environment.

The native probes modify the already published package's launcher choice for diagnosis, not the complete newest candidate. Complete preview.29 Windows acceptance remains outstanding. Windows 11 ARM is not Windows 11 x64, and Windows Server is not Windows 10/11 client evidence. Authorized Windows 10 and Windows 11 x64 installation, update/restart, ConPTY, IME/UAC and unobstructed GUI checks remain required.
