# Koder CLI 0.4.1

Koder CLI 0.4.1 updates the Windows CMD/PowerShell and macOS/Linux terminal installers together. It retains the complete 0.4.0 feature set and includes the credential, delivery and generation-method repairs developed in the 0.4.1 candidates.

## Changes

- Coding guidance follows the requested work: reproduce bugs and trace their causes, measure performance, preserve behavior during refactoring, and check real integration boundaries.
- Writing guidance focuses on the reader, supported facts, useful tradeoffs and next actions. Repeated revisions retain the nearest user task, while new requests take priority.
- Technical emails and proposals are classified by their requested deliverable. Explicit requests to analyze and repair code keep their execution scope; Ask, Plan and report modes keep their existing limits.
- Stable, candidate and preview release sources are recognized correctly. Migration/dependency headings cannot masquerade as another product release. Revising release copy retains attribution checks, and comparisons retain predecessor checks.
- Current-task delivery checks identify selected missing artifacts, plan-only completions, stale verification and incomplete drafts. Up to two corrections stay within the original permissions and budget; unresolved gaps remain incomplete with exit 3.
- Windows credentials use the bundled integrity-checked helper. A contradictory Windows-MCP target report remains UNKNOWN rather than being reported as success. The Humanizer catalog description and English rewrite matching are repaired; its pinned upstream source and license remain.

## Install or update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd) and run it in Command Prompt.
- Windows PowerShell: download [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1) and follow the [installation guide](INSTALLATION.md).
- macOS, Apple silicon or Intel: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh`.
- Existing installations: run `koder update`, then `koder --version`; expect `koder 0.4.1`. Keep settings and history in place.

Read the [English guide](USER-GUIDE.en.md), [Chinese guide](USER-GUIDE.zh.md), [coding and writing methods](CONTENT-QUALITY.en.md), [current-task delivery checks](TASK-DELIVERY.en.md) and [multiwindow guide](MULTI-WINDOW.md). All 30 lessons and eight printable shell/language editions are retained. Windows and Mac use CLI installers; the desktop app has its own release channel.

## Verification scope

The candidate.4 source passed 233 local regressions with one preserved skip; 51 selected checks passed against its unpacked runtime. Those scripted-provider checks establish request transport and selected behavior, not better real-model programming or writing scores. The final 0.4.1 package and publication checks are recorded separately in the release acceptance receipt.

Candidate.2 passed isolated no-Node CMD/PowerShell 5.1 installation and real update checks on Windows Server and Windows 11 ARM, plus Mac Apple silicon/Intel installation/update and a Server MCP GUI sequence. These are historical checks of that exact candidate, not native acceptance of the final 0.4.1 archive. Windows 10/11 x64 full GUI/ConPTY/IME/UAC, Windows 11 ARM client GUI focus, final-package Windows installation/update and authenticated external accounts remain incomplete. The release is published at the user's explicit request with those limits retained.

MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano remain unavailable as documented. No new real-model quality score or complete third-party reverse-tool replacement is claimed. Original releases, notices, failure records and rollback downloads remain available.
