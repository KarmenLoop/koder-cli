# Windows installer checks for preview.9

[Native Windows regression run](https://github.com/KarmenLoop/koder-cli/actions/runs/39388845502) passed nine checks on October 20, 2026, using Windows PowerShell 5.1/CMD on hosted Windows build 10.0.26100.33438.

The checks cover empty Enter followed by explicit acceptance, spaces around accept, a Chinese install directory, automatic Node runtime download, explicit refusal, CMD installation, redirected-input refusal, an unresponsive existing Node executable, a stalled release manifest and a partially transferred package. The last two use a seven-second test deadline and require a progress heartbeat. They retain the previous installed launcher, acceptance record, configuration and memory sentinels, then run the retained launcher with exit code 0.

The stalled Node case proves that the exact owned process was invoked and terminated after five seconds, then completes installation with the installer runtime. Multiple node.exe paths are resolved explicitly before probing.

Default Windows transfers first use byte-identical official website mirrors, with GitHub/Node.js fallback. A checksum mismatch still fails. Each source has a 120-second transfer limit by default, with progress every five seconds. KODER_DOWNLOAD_TIMEOUT_SECONDS may explicitly choose 1–600 seconds; it changes neither consent nor verification. Custom download bases are respected.

[Published-release validation](https://github.com/KarmenLoop/koder-cli/actions/runs/39389597530) passed all ten checks after publication. Its public-command case fetched the exact installer from public GitHub main without an authentication token, in a Chinese user directory with Node removed from PATH. It downloaded the runtime and package through the default public hosts, verified the checksums, installed the runtime under the owned install directory and ran `koder version` with exit code 0. The public case completed in 14.38 seconds on that hosted Windows machine. The remaining nine cases retain their regression scope; this result does not prove a user's network is reachable.

Package SHA-256: `4838162c99a65454a1f454069e621fa1209759f335c0b1869e4d870d0346ef58`.

These checks do not establish acceptance on every user's Windows device, live messaging/Gamma accounts or multiple physical devices.
