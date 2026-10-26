# Koder CLI 0.4.24

PageIndex document navigation is now built into Koder for Windows and macOS. Local document tasks can inspect a directory tree, select sections with the existing model, read the original text and check source-bound citations.

- Read Markdown/text headings and compressed text PDFs. The bundled PDFium WebAssembly parser preserves usable bookmarks and supplies physical-page nodes without requiring Python.
- Verify source SHA-256, project, node, page/line range and exact quote. Changed sources and fabricated citations fail explicitly; quote matching does not certify an inference.
- Use the existing CLI/Core, provider, BYOK, cost budget, cancellation and permissions. Read-only subagents can return actual document receipts to their parent.
- Control default routing in Setup → Skills or koder pageindex on/off. No new cloud account, hidden global knowledge store or tool-round cap is added.
- Export PageIndex-shaped trees as project artifacts. Keep all previous website, CAD, mail, MCP and Skill features.

[Hands-on guide](PAGEINDEX.en.md) · [中文教程](PAGEINDEX.zh.md).

Source regression: 138 passed. Model decisions are deterministic fixtures; Markdown/PDF parsing, files and tool execution are real local calls. Packaged and installer receipts are separate. Windows native acceptance remains beta-owned NOT_RUN here. Scans need an authorized OCR workflow; upstream Flash/cloud OCR, paid-model reasoning quality and private production documents are not claimed as verified. Existing platform/account limitations remain.

GitHub is the only publication destination. MIT PageIndex attribution, the pinned PDFium wrapper license and original PDFium notices are included.
