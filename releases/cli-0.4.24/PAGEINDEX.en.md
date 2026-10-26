# PageIndex document navigation

Koder 0.4.24 enables a local adaptation of [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) for document tasks. Build a tree, let your existing model select sections, read the original text and verify citations. The same Core owns providers, BYOK, cost budgets, cancellation and project permissions.

No Python agent, vector database or new PageIndex account is required. This is not the upstream Flash/cloud OCR service and does not claim its benchmark scores.

## Start with a local document

Open a terminal in your project and save this UTF-8 file as `manual.md`:

```markdown
# Service manual
## Billing
Refunds take 7 days.
### Exceptions
No refund after 30 days.
## Support
Use the support portal.
```

```text
koder --version
koder pageindex status
koder pageindex index manual.md --json
koder pageindex search manual.md --query "refund" --json
koder ask "Read manual.md and explain refund timing and exceptions, with source citations."
```

Use `-w "absolute project path"` when your terminal is elsewhere. Only explicit project-relative source paths are accepted. Indexing, navigation, readback and verification need no model key and make no model calls. The complete question-answering task uses your configured model as usual.

The index returns a source SHA-256, hierarchy, parent IDs and line/page ranges. The model should browse the tree, select relevant sections, read them and check its exact quotes. Lexical search ranks navigation candidates; it does not answer the question. No match is a reason to inspect the tree or state an evidence gap, not proof of absence.

## Read and verify

```text
koder pageindex tree manual.md --json
koder pageindex read manual.md --node <returned-nodeId> --sha <returned-sha256> --json
```

Replace placeholders with returned values. Tree results are paginated with `nextOffset` (up to 60 nodes per request). Readback defaults to 6,000 characters, with a 12,000-character maximum; follow `nextOffset` using `--offset`.

Copy the complete returned `citation` into `{"citations":[...]}`, add an exact `quote`, and save it as `citations.json`. Preserve every identity and range field, including `projectId`, SHA, parser version, node, offset and length.

```text
koder pageindex check citations.json --json
```

Exit 0 means every source version, range and quote matches. Exit 3 means a citation failed; operational or argument errors return 2. A matching citation does not establish that the answer's inference is correct. Changed source bytes fail old SHA checks. References copied into another project must be rebuilt against that project's files.

## Text PDFs

```text
koder pageindex index report.pdf --json
koder pageindex read report.pdf --node p0002 --json
koder ask "Read report.pdf and compare the relevant sections with physical page references."
```

The bundled PDFium WebAssembly parser extracts compressed text locally without Python or system PDF utilities. It preserves usable bookmarks and supplies explicit page nodes. Without bookmarks, it uses physical pages. `p0002` is the second page in the file, not a printed page label. Complex columns and layout may need manual comparison.

Empty/scanned PDFs return `PAGEINDEX_OCR_REQUIRED`. Mixed PDFs identify pages without text. Use an already-authorized OCR workflow to produce a searchable copy; the adapter never silently uploads a scan. Encrypted PDFs require an unlocked copy, not a password in chat. Invalid files and parser failures produce explicit errors.

## Export and control automatic use

```text
koder pageindex export report.pdf --json > report.pageindex.json
koder pageindex off
koder pageindex on
```

The export uses PageIndex-style `doc_name`, nested `structure`, `node_id` and PDF `start_index/end_index` fields plus source-bound Koder metadata. It is a project artifact, not a cloud document ID or a claim of complete API compatibility. Redirection is an explicit user write; Agent tools are read-only and save through the existing file-edit approval path.

Setup → Skills also controls **PageIndex**, including all-Skills-off. Reopen a session after changing the switch. Off removes automatic guidance and tools; explicit CLI diagnostics remain available. The process cache is bounded and validates source bytes on every call. It is not a second global memory database and is rebuilt after exit.

## Data and execution boundaries

No new service receives the documents. Selected text still goes to the model provider you configured for the conversation. Document instructions, links and scripts remain untrusted data, never execution authority.

Limits: 64 MiB per file; 16 MiB for text; 2,000 PDF pages; 10 million extracted characters; 250,000 text lines; 10,000 PDF tree/page nodes. Markdown recognizes up to 2,000 headings and retains the remaining text with a warning. PDF parsing has a 120-second deadline and cancellation. These are parser resource bounds, not tool-round limits. Existing unlimited task rounds, cost budgets and cancellation remain intact.

Split oversized documents by meaningful sections. Reindex changed files. Copy actual readback ranges rather than inventing citation metadata. Unsupported document formats can be exported with existing authorized tools to UTF-8 text or a text PDF.

## Evidence

Local tests exercise actual Markdown/PDF parsing, pagination, source readback, citation validation, the existing Core tool loop, Setup toggles and packaged execution. Model choices in automated tests are deterministic fixtures, not a paid-model benchmark. Native Windows is beta-owned NOT_RUN in this development environment. OCR, upstream Flash/cloud services and private production documents have not been accepted by these tests. Check the release receipts for each platform rather than treating shared Node/WASM code as native-device proof.
