# Release status — 0.4.24

PageIndex now runs through the existing CLI/Core as a read-only document tool and default Skill. It reuses the Markdown outline, adds offline PDFium WebAssembly text extraction, returns bookmark/physical-page trees and validates source-bound citations. Tree selection and answer synthesis use the existing configured model. Setup and command switches disable automatic routing. Read-only child tasks inherit document access only within their existing parent/tool scope.

Integrated source regression: 138 passed. Actual local parsing and filesystem checks cover compressed PDF streams, bookmarks, text lines, pagination, source versions, exact quotes, project boundaries, malformed/empty files, resource limits and worker cancellation. The original Core, Skill settings, project anchors, unlimited task rounds, subagent boundaries, mail and MCP regressions are retained. Automated model choices are deterministic fixtures, not paid-model performance evidence. Earlier failing tests are preserved in the local evidence.

Package, installer/update and GitHub readback receipts are recorded separately in ACCEPTANCE-RESULTS.json and the local handoff. Windows device acceptance is beta-owned NOT_RUN here; paid-model answer quality, upstream Flash/cloud OCR and private production documents are NOT_RUN. Existing GUI, account, residency and unsigned locked-use limits remain. GitHub only; no official website edits or deployments.

[Guide](docs/PAGEINDEX.en.md) · [中文教程](docs/PAGEINDEX.zh.md) · [Previous status](docs/history/RELEASE-STATUS-0.4.23.md).
