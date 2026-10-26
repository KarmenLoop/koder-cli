# Koder CLI 0.5.0

Koder extends its existing execution framework with local OCR, professional child-task roles and clearer execution evidence. The same Core still owns model routing, BYOK, approvals, cancellation, budgets and project history.

- **Local scans:** bundled Tesseract.js 7.0.0, WebAssembly, English and simplified Chinese data. Read real images and individual PDF pages without Python, a CDN or a separate cloud account. Original file authorization, bounded resources, source hashes and cancellation remain.
- **Professional roles:** 90 contracts across 25 groups define required inputs, deliverables and checks. Role IDs, versions and hashes reach actual child execution. Existing professional recipes remain; a role does not grant credentials or establish domain quality.
- **Concurrent child work:** four child executions per runtime by default; additional tasks enter a FIFO queue. Setup changes the limit. 180 unreleased task slots are not a provider quota; the parent and other terminals have separate execution. Cost accounting and cancellation remain.
- **Capability discovery:** tool_inventory exposes mounted tools, scopes and diagnostic entry points. koder tools status/audit distinguishes configuration, readable Skill content, parser integrity, authorization and driver availability. Discovery is not proof of a completed business operation.
- **Headless contracts:** redirected input or output selects headless behavior. JSON ask/run emits a terminal completion state and reason for preflight failures as well as task results. Explicit task arguments do not wait on stdin unless requested. Permission and credential requirements remain visible.
- **Small-model context:** unrelated method guidance loads on demand, retaining the Skill catalog while leaving room for useful work in long sessions.

## Install and learn

Download the Windows PowerShell/CMD or macOS installer from this release. Installers share the versioned runtime and preserve the existing user configuration. Use koder update for an existing installation.

[Execution guide](FRAMEWORK-0.5.en.md) · [中文完整操作教程](FRAMEWORK-0.5.zh.md) · [OCR](OCR.zh.md) · [Roles and queue](SUBAGENT-ROLES.zh.md) · [Headless/CI](HEADLESS-0.5.zh.md).

## Evidence boundaries

Real offline OCR, child file operations, worker cancellation and CLI subprocesses are tested locally. Automated model decisions are deterministic fixtures, not a paid-model benchmark. Source, packaged runtime, installation/upgrade and GitHub download checks have separate receipts in ACCEPTANCE-RESULTS.json.

Windows 10/11 native GUI/cold installation remains beta-owned NOT_RUN on the authoring Mac. Linux desktop notifications, customer mail, account writes, paid concurrency and professional quality require their own acceptance. The unsigned macOS locked-use helper remains HOLD. No guarantee of every application or every hidden defect is made.

GitHub is the publication destination. The official website is unchanged. Tesseract.js, trained data and embedded third-party notices are included without replacing their licenses.
