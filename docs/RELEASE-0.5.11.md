# Koder CLI 0.5.11

Windows notification settings can be absent before an application sends its first toast. Koder now distinguishes this documented first-use condition from a denied permission or unknown failure, registers only its per-user display name when actually sending, and leaves notification preferences and policy unchanged. Inspection remains read-only; submission never claims that the user saw the toast.

Short replies no longer launch unnecessary system processes to check terminal focus. Quiet-hours backlog processing only checks desktop availability. Headless Windows sessions no longer probe a hidden child console as if it were the user’s terminal. Long interactive tasks still check focus when it can change notification eligibility; cancellation, permissions, daily limits and persisted receipts remain in force.

The Windows VM workflow runs PowerShell 5.1 and CMD installers, concurrent sessions, tasks beyond 16 tool rounds, local mail transport fixtures, and the bundled Windows MCP through Koder’s actual transport. The original 30-second concurrent-session limit stays unchanged. The release acceptance attachment separates passing checks, retained failures and checks not run.

Use `koder update`, or follow the [download guide](DOWNLOADS.md). Ubuntu 24.04 has its [dedicated installer](UBUNTU.md). All existing platform-specific functionality, Skills and current classroom material remain included.

A Windows Server VM does not establish physical Windows 10/11 behavior. Synthetic mail credentials and loopback TLS do not establish real 163/Gmail delivery. A native notification receipt means submitted or unavailable, not guaranteed visible. macOS locked-screen operation remains an unsigned candidate. The production website is unchanged.
