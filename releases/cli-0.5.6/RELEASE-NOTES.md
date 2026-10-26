# Koder CLI 0.5.6

Koder now checks more of the work behind a completion claim. Empty final answers receive bounded recovery, unresolved execution is reported explicitly, and website handoff checks current source and the actual local preview address.

## Changes

- Require a useful final answer and evidence for requested artifacts. Empty final answers receive at most two tool-free repair requests under the existing budget; unresolved delivery is reported as incomplete.
- Stop repeated unchanged failures without imposing a lifetime tool-count limit. Preserve cancellation, explicit cost budgets and unknown-effect reconciliation.
- Make the tutorial ask before resubmitting a rejected change. A rejected operation is not automatically presented for approval again.
- Load the bundled Fullstack Web Delivery workflow for website tasks, retaining its original resources and existing opt-outs. Check current source, applicable plans and layout decisions, owned preview readiness and the actual handoff URL.
- Resume the nearest unfinished website task from verified file hashes; finish missing preview work without replaying completed writes. Respect requests not to launch a browser or not to provide a preview.
- Keep current notebook constraints and task carry-over within small model windows. Discover ancillary tools on demand while retaining native code, document, resource and connected-app entry points when relevant.
- Correct local learning review and recall consistency, refresh stale packs after writes, and reject installer targets that do not match the packaged version.

## Using the website workflow

Ask for a new website or an existing-site repair in its project directory. Koder uses the bundled Fullstack Web Delivery Skill by default and follows the applicable discovery, planning, design, implementation, verification and handoff stages. New sites retain their own project folder and anchor. Repairs keep the existing scope; static sites do not acquire mandatory accounts or databases.

The model receives source material within its context budget, with explicit omissions and paginated reads. A partial packet is not reported as a complete read. The original v0.9.1 Skill and 29 resources retain their attribution and source-available terms; the integration is separate Koder code. Setup and existing disabled-Skill settings remain effective.

See [Website delivery](website-delivery.md) and [Task results and recovery](task-results.md). Existing instructions remain in the [complete user guide](USER-GUIDE.en.md) and the [Chinese guide](USER-GUIDE.zh.md).

## Install or update

Windows PowerShell/CMD and macOS/Linux installers select the same versioned runtime archive and SHA-256 manifest. Follow [Installation](INSTALLATION.md). Existing settings, history and opt-outs are retained; package acceptance and temporary-home upgrade checks are recorded separately.

## Evidence and limits

`ACCEPTANCE-RESULTS.json` attached to the release records exact commands, outcomes, source and runtime hashes, retained failures and remaining checks. Deterministic provider fixtures exercise real local tools and persistence; they do not establish paid-model design or writing quality. A live local HTTP response does not establish rendered layout, accessibility or working business flows.

Windows 10/11 native console, cold install/update and Windows-MCP GUI checks remain with the beta team. Real account sends/uploads, paid-provider quality evaluation and native notification visibility are NOT_RUN in this release. The macOS locked-use native helper remains unsigned and on HOLD. No website was deployed.

No permissions, approval authority, provider routing, cancellation or cost-budget boundaries are enlarged by this update. Unknown operations require reconciliation and are not automatically repeated.
