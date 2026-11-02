# Koder CLI 0.8.4

[English](RELEASE-0.8.4.md) · [简体中文](RELEASE-0.8.4.zh.md)

This release brings the Windows protected-credential fixes, browser return flow and native memory improvements into one package. Downloads and updates use the [official CLI website](https://kodermodule.com/en/cli-download.html). Publication and platform acceptance are recorded separately in the release receipt.

Run `koder login` to open the official account page or display a QR code. An existing web session can authorize the CLI without another password entry. The original CLI window polls the bound transaction, verifies the account and saves its tokens in protected storage. A return button can focus the original terminal when the platform supports it; clicking that button does not establish authentication. If focusing fails, switch back manually. Do not start another login while the first window is still waiting.

Windows uses current-user DPAPI and checks encryption, storage and readback before asking for web approval. macOS uses Keychain; Linux desktop uses Secret Service. `koder account doctor --json` reports the failing platform, stage and reason without exposing tokens. `koder account status` distinguishes a renewable signed-in session from a signed-out account. Local key access remains a separate mode and does not create a cloud identity or grant computer permissions.

Native memory now retrieves relevant, source-linked facts from the existing local memory store. It preserves account and project boundaries, merges exact duplicates, exposes conflicting statements and supports corrections and forgetting. A late result cannot recreate a forgotten fact. Context compression keeps the current task's write constraints and evidence identifiers. Existing learning switches remain effective; there is no second memory database, duplicated Skill or new always-running service.

See the [login walkthrough](ACCOUNT-LOGIN.md), [local access and return](LOCAL-ACCESS-AND-RETURN.md) and [native memory design](DEERFLOW-MEMORY.en.md). Synthetic service tests, packaged regressions, real registration, browser return and platform tests have separate results. The release does not claim a new model-quality score or universal GUI acceptance.

## Release checks and remaining limits

The build record separately lists **200 checks: 198 passed and two conditional local-key cases skipped**. The packaged memory-kernel suite separately records **23 passed, zero skipped**. Do not combine these into a claim that every account or local-key path was exercised. The record also includes macOS command checks and an isolated installation using an existing compatible Node runtime and an owned loopback mirror; that is not a fresh public download or a native Windows/Ubuntu installation.

Real user registration, human account approval and actual desktop return remain **NOT_RUN**. Adapter fixtures, synthetic HTTP accounts and helper compilation do not establish native browser clicks. The account website return-button deployment needs separate confirmation. Memory fixtures do not establish improved model scores or universal recall quality.

**Published November 3, 2026.** The formal activation record confirms the new production release. A normal-DNS, CA-validated HTTPS record verifies the exact 0.8.4 stable feed, ten bilingual entry pages and seven versioned manifest/installer/checksum files: 18 targeted checks in total.

The producer's separate public-download record verifies all **32 original files, 1,111,714,572 bytes**, against the frozen size and SHA-256 manifest. The Linux package was resumed from byte 1,048,576; its response was HTTP 206 with a matching Content-Range, and the final file hash matched. This is the producer's 32-file result, not the website owner's broader **PUBLIC413**, which remains pending a separate final receipt.

Both default official update checks exited 0 without a mirror override or installation: the existing 0.8.1 client found 0.8.4, and the 0.8.4 client reported that it was current. The [exact 0.8.4 Windows Server 2022 VM run](https://github.com/KarmenLoop/koder-cli/actions/runs/41535590608) also passed seven protected-storage and synthetic-account cases after official package/installer hash checks.

Human production registration/login, browser-to-terminal return and native Windows 10/11 or Ubuntu GUI remain **NOT_RUN**. The account website return-button deployment and human-click acceptance are separate from CLI publication. These results do not certify every platform or improve a model-quality score. The package retains 79 unique Skills and existing third-party notices; native memory changed the private kernel, which is not represented as byte-identical to the prior kernel.

The isolated eight-operation memory tutorial is supplementary local evidence, not an added model score or part of the account-suite total. Its first test-home attempt stopped at the EULA gate; that configuration error remains recorded separately.
