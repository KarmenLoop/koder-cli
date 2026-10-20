# Windows installer checks for preview.11

The [published-release Windows run](https://github.com/KarmenLoop/koder-cli/actions/runs/39405078337) passed all 13 installer cases and 24 installed-package protocol/ACP checks on Windows PowerShell 5.1 and CMD. It tested the same preview.11 archive available on the official website and GitHub release.

The public CMD case pasted the complete documented command at an interactive CMD prompt, accepted the agreement, downloaded a Node runtime into a Chinese user path, verified checksums, and ran the installed version command successfully. It finished in 12.78 seconds on the hosted Windows machine. The public PowerShell command completed the same flow in 12.58 seconds. These timings describe that runner and connection.

The 13 installer cases cover empty input followed by accept, whitespace around accept, Chinese and space-containing paths, no preinstalled Node, refusal, the downloaded CMD installer, direct CMD paste, initial-script download stalls, an unresponsive existing Node, stalled manifest and partial package transfers, both public commands, and redirected-input refusal. Stalled updates preserve five existing installation, configuration, and memory files and retain the working launcher. A seven-second initial-script test displayed progress before consent and stopped in 9.70 seconds. Production downloads default to 100000000 seconds; tests use explicit shorter deadlines.

The 10 MiMo checks and 14 broader provider checks import the actual installed package. They cover native tool/result continuation, Responses, Anthropic Messages, Chat Completions, provider controls, reasoning/signature replay, and the disabled internal fallback. They use local protocol fixtures. No authenticated paid provider account or reporting user's Windows device was accepted by this run.

The [candidate run](https://github.com/KarmenLoop/koder-cli/actions/runs/39403801311) passed 11 installer cases and the same 24 installed checks before publication. Earlier rejected candidates retained failures for Windows curl timer overflow, a test-driver quoting layer, and a CommonJS extractor saved with an ESM-sensitive .js extension. The final command uses a monitored PowerShell bootstrap; the extractor uses .cjs. Checksum assertions and agreement requirements were preserved.

Package SHA-256: `7adf763f02b3f919225023a9232ce1610a06d8ef93f6a14e8f0db5d1b9cf8864`.

Previous preview.10 evidence: [candidate](https://github.com/KarmenLoop/koder-cli/actions/runs/39395431998), [published commands](https://github.com/KarmenLoop/koder-cli/actions/runs/39395890655).
