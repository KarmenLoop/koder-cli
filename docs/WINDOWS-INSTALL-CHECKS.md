# Windows installation checks for preview.12

The [published-release Windows run](https://github.com/KarmenLoop/koder-cli/actions/runs/39419278524) passed all 13 installer cases, 36 installed-package protocol/consumer checks, and 9 real-terminal playback/skip checks on Windows PowerShell 5.1 and CMD. It tested the same preview.12 archive available on the official website and GitHub release.

The public CMD case pasted the complete documented command into an interactive CMD prompt, accepted the agreement, downloaded a Node runtime into a Chinese user path, verified checksums, and ran the installed version command successfully. It finished in 11.81 seconds on the hosted Windows machine. The public PowerShell installation completed in 11.16 seconds. These timings describe that runner and connection.

The 13 installer cases cover blank input followed by accept, whitespace around accept, Chinese and space-containing paths, no preinstalled Node, refusal, the downloaded CMD installer, direct CMD paste, initial-script stalls, an unresponsive existing Node, stalled manifest and partial package transfers, both public commands, and redirected-input refusal. Stalled updates preserve five existing installation, configuration, and memory files and retain the working launcher. Production downloads default to 100000000 seconds; tests use explicit shorter deadlines.

Installed checks comprise 10 MiMo protocol/ACP cases, 14 broader provider cases, and 12 consumer-feature cases. They exercise native subscription routes, MiMo nullable streaming metadata through an actual local file tool and continuation, greeting context isolation, full offline privacy texts, separate birthday/music/IP choices, blank feedback templates, private local state, and single-play browser scheduling. They use synthetic local protocol fixtures; no authenticated paid provider account or reporting user's Windows device was accepted by this run.

The terminal checks played fireworks for 6.047 seconds and skipped each of the eight scenes. All nine processes exited normally. Reader-thread cleanup is measured separately from playback. Actual browser UI checks also verified Chinese and English local-melody Play/Stop controls; browser policies may still require a user gesture for autoplay.

The [candidate run](https://github.com/KarmenLoop/koder-cli/actions/runs/39418333643) passed 11 installer cases and the same 45 installed-feature/terminal checks before publication. The [first rejected hosted candidate](https://github.com/KarmenLoop/koder-cli/actions/runs/39417860285) passed installation and installed fixtures but failed the animation driver's duration check because it included reader cleanup; that failure remains recorded. An earlier local package was rejected when a fresh terminal stayed open after skipping. Input-flow restoration was fixed before the accepted archive was built. No runtime code changed between the two hosted candidate runs.

Local source validation: 449 tests, 446 passed, no failures, and 3 existing skips. Website validation: 67 tests passed, followed by all 74 production page readbacks and byte-for-byte comparisons for 10 installation assets, 8 tutorial files, and 9 privacy files. GitHub release assets and the immutable website mirror were also downloaded and matched.

Package SHA-256: `06614d853668757a3821acdcee828a71c9bab68b7e8ed88d34382facdbb5234d`.

Previous preview.11 public acceptance: [Windows installation](https://github.com/KarmenLoop/koder-cli/actions/runs/39405078337).
