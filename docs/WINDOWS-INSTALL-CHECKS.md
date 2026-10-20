# Windows installer and MiMo checks for preview.10

[Candidate run](https://github.com/KarmenLoop/koder-cli/actions/runs/39395431998) passed nine installer regressions and ten MiMo compatibility checks on real Windows PowerShell 5.1/CMD. Installer checks include Chinese directories, runtime download, explicit consent/refusal, an unresponsive existing Node executable, stalled headers and partial package transfers. The failure cases retain the previous working installation and configuration.

The MiMo checks import the actual installed package and exercise its presets, exact endpoints, authentication headers, completion-budget field, streaming tool calls, reasoning history, protocol diagnostics and Hermes ACP child/profile isolation. They use local fixtures, not an authenticated Xiaomi account. Public-command acceptance is added after publication.

The first candidate transport changed line endings during Git checkout; SHA-256 verification stopped before installation. A candidate-local .gitattributes correction passed an explicit core.autocrlf=true checkout test and the native run above. No checksum assertion was relaxed.

Package SHA-256: `0c9054de7fb1815385bccb0425b10e955854ccb5f1f69b97fa53a3d72a4632a8`.


Published-release validation: [Windows public-command run](https://github.com/KarmenLoop/koder-cli/actions/runs/39395890655) passed all ten installer checks and all ten MiMo protocol/ACP checks against the actual installed preview.10 package. The public case used a Chinese directory without a preinstalled Node runtime, downloaded from the default public hosts, verified hashes and ran the installed version command with exit code 0. It completed in 12.99 seconds on the hosted Windows machine. These MiMo checks remain protocol fixtures, not authenticated Xiaomi-account acceptance.
