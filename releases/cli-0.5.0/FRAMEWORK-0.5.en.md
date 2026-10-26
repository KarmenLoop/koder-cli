# Koder CLI 0.5.0 execution guide

Koder keeps one Core for model routing, BYOK, approvals, cancellation, cost accounting and task history. Version 0.5.0 adds local OCR, professional child-task roles, bounded child execution and a capability audit to that existing path.

## Check the installation

```text
koder --version
koder tools status --json
koder tools audit --json
koder ocr status --json
koder subagents roles --json
```

Status inspects configuration and available channels. Audit also reads Skill text and verifies local parser assets. A successful audit is not proof of an authenticated business operation or GUI action. Missing authorization, missing drivers, disabled methods and damaged resources remain distinct.

The Agent can query tool_inventory for mounted tools and the next diagnostic entry point. It uses native mail tools for bound mailboxes, covering Apps/MCP connections before GUI automation, and existing computer drivers for authorized browser or desktop tasks. It must inspect actual receipts. A configured connector, installed Skill or model-written summary is not an execution receipt.

## Read a scan locally

Put an image or PDF inside the project and run:

```text
koder ocr read invoice.png --json
koder ocr read "scanned manual.pdf" --page 1 --language eng+chi_sim --json
```

Tesseract.js 7.0.0, WebAssembly and English/simplified Chinese data ship in the package. Direct OCR needs no model key, Python, CDN or cloud OCR account. Results contain the source hash, physical page, nextPage, text and confidence. Verify names, amounts and quotations against the image. Confidence is not factual verification.

Follow nextPage as needed; use the returned source SHA with --sha to reject changed files. Limits are 64 MiB per source, eight million pixels and one PDF page per call. Recognition has a 300-second deadline; PDF parsing has a separate 120-second bound. Worker cancellation is retained. PageIndex still reads text documents and verifies exact source quotes. OCR text is a separate, fallible source receipt; scanned books are not silently added to a persistent search database.

Document tasks can invoke document_ocr automatically. In Agent mode, extracted text may be sent to your configured model as tool output and incur normal provider costs. Direct ocr read remains local. Disable in Setup → Skills or with koder ocr off; enable with koder ocr on.

## Delegate work with a role

```text
koder subagents roles --group software --json
koder subagents role legal-contract --json
koder subagents match "Review the payment clause" --role legal-contract --json
```

The 90 roles cover 25 groups. Each defines required inputs, deliverables and review checks, with a recorded version and SHA. Existing legal, tender and HR recipes remain. Role lookup is local and starts no model. During an actual task, subagent_spawn selects roleId and the original child loop reads or writes authorized artifacts. The parent collects receipts before accepting a result.

180 is a ceiling on unreleased task slots. The default maxConcurrent is four child executions in one runtime, with additional children waiting in FIFO order. It is not a provider quota and does not include other terminal windows or parent model calls. Setup → Task Harness changes the value. A queued cancellation makes no child model request; running cancellations retain original UNKNOWN handling and write ownership.

taskExecution.maxSteps remains null by default: no tool/model-round cap. Explicit cost budgets, cancellation, permissions, context limits and per-tool resource limits remain. Professional roles do not establish credentials or domain quality; consequential legal, clinical, financial and engineering conclusions require appropriate evidence and qualified review.

## Use scripts without a keyboard

An explicit task ignores stdin unless --stdin is supplied. Without task text, stdin is read with a bounded deadline. Either non-TTY input or output selects headless decisions. Optional questions can use stated reversible assumptions; missing authorization or credentials must return a reason.

ask/run --json emits a terminal result for preflight failures as well as model tasks. contractVersion: 1 adds completionState and reasonCode while preserving existing fields. Check the actual exit code and completionState; any JSON output is not sufficient for CI success. --yes never grants computer permissions or credentials. Review JSON retains its parsed/nonzero-failure contract.

## Evidence and limits

Local tests exercise real OCR, source files, workers, original Core calls, child writes, queue admission and cancellation. Model decisions are deterministic fixtures, not a paid-model benchmark. Mail TLS loopbacks, MCP child processes and notification adapter contracts are separately identified in acceptance receipts.

Windows 10/11 native GUI/cold installation remains beta-owned NOT_RUN on the authoring Mac. Linux GUI notifications, real customer mail, authenticated account writes and paid concurrency need their own receipts. The unsigned macOS locked-use helper remains HOLD. No claim of every application, every profession or every hidden bug being verified is made.

Download versioned Windows/macOS installers and ACCEPTANCE-RESULTS.json from GitHub Releases. The official website is not changed by this release. [中文操作手册](FRAMEWORK-0.5.zh.md) · [OCR](OCR.zh.md) · [role catalog](SUBAGENT-ROLE-CATALOG.zh.md).
