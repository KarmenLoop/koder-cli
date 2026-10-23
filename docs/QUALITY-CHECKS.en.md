# Writing and delivery checks

Current beta: **0.4.0-preview.30**. The additions below retain prior contracts and do not establish a new writing score. The original 12 benchmark prompts are preserved. These are deterministic delivery checks, not new blind-test scores.

## Decision-maker copy

A Koder introduction aimed at technical decision makers receives guidance to cover the problem, costs/ROI and risk, integration, and limits. If the request explicitly asks for about 800 Chinese characters, the delivery range is 720–880 Han characters. Punctuation and Latin identifiers do not count; headings do. The gate independently reads the primary document written by a verified tool action in this turn; it uses the final reply only when there is no delivered file. Multiple documents require one explicitly identified primary path. JSON output includes the artifact path/SHA and actual/min/max. A failed range returns 3 and prints the count. Facts and audience quality still need review.

## Release copy with sources

The agent reads release sources before its first release-writing model request and can call the read-only writing_sources tool again. It retains the eight fixed workspace names: CHANGELOG.md, CHANGELOG.en.md, CHANGELOG.zh.md, CHANGES.md, RELEASE-NOTES.md, RELEASE_STATUS.md, RELEASE.json, ACCEPTANCE.md. The runtime also checks versioned CHANGELOG*, CHANGES*, RELEASE* and ACCEPTANCE* document names in the root, releases, docs and docs/releases. Only Markdown, text, RST and JSON documents qualify; the scan visits at most 128 entries per directory, retains at most 24 snapshots including installed runtime facts, and reads at most 64 KB per document within a 512 KB total budget. Symlinks and external paths remain blocked by the existing confined reader. The result reports read attempts and truncation. Cancellation stops the scan.

The installed version and bundled public CHANGELOG/RELEASE_STATUS/ACCEPTANCE snapshots provide context when a new workspace has no records. The tool preserves sources as workspace-only and returns installed records in the additive runtimeSources array. The writing observer consumes both. Runtime audit records are labeled @runtime and hashed; they do not establish increments of the requested version. Acceptance and release JSON metadata have separate source kinds and contextFacts with supportsIncrement:false. The tool does not open .git, follow links outside the workspace, search accounts, run commands or fetch the network. Git tags or remote releases still require the existing authorized tools; a local snapshot is not independently authenticated as an official release. Source text is data, never permission.

Successful read_file calls on matching changelog/release-note files also record snapshots. A matching version and two bullet facts in its heading section require two distinct line references such as `[CHANGELOG.md:L3]`. A README, tag, version number or acceptance terms alone cannot prove release increments. When the matching changelog is absent, disclose that limitation and describe existing capabilities separately. An explicit Chinese or English statement that the text describes existing capabilities rather than version increments also satisfies the disclosure gate without requiring an exact heading. A disclaimer never excuses a later unsupported positive increment claim. Unsupported attribution or missing disclosure returns 3.

References prove that the cited lines exist in the source snapshot. They do not prove that a paraphrase follows from those lines. Review the actual facts before publishing or sending. Email authorization remains separate.

## Compressing a comparison

A request to condense the preceding comparison uses the actual final preceding draft, with its SHA-256 in the JSON audit. A successfully read Markdown/text predecessor explicitly named in the current request is also supported, with path, source and SHA-256 recorded in writingEvidence.predecessor. An unrelated file cannot become the predecessor. Missing drafts must be disclosed. New numerals and selected named technology claims are flagged; precise unverified prices remain blocked. Clear statements such as “Pricing is unavailable” or “定价未知” pass the uncertainty check. A trusted official-page receipt is not yet connected to this gate, so a bare URL or model assertion cannot exempt a numeric price. This is a conservative lexical check, not full semantic equivalence or a competitor ranking. Newly phrased claims can still need human review.

## Inspect an actual project

```sh
koder project check --kind project --json -w /path/to/project
koder project check --kind service --json -w /path/to/project
koder project check --kind generator --json -w /path/to/project
koder project check --kind website --json -w /path/to/project
```

The bounded scan reads at most 100 relevant files, 64 KB per file, within a 512 KB content budget; it visits up to 600 entries and depth 5. Dependencies, build outputs, hidden files and symbolic links are excluded. Unreadable files or a truncated scan prevent a complete structural result. It never runs project scripts or deletes files.

All kinds require a README. Non-web kinds require a test or verify entry. Services also require a Docker entry and README startup instructions. Static website checks require an HTML preview with navigation, a main heading and viewport metadata. Framework projects can supply a static preview; this limited scan does not compile JSX or establish browser quality. A successful result says structure-checked, executed:false. A missing item returns exit 3. Existing permissions still govern actual tests, installs and deployment.

Recognized creation requests for a Markdown site generator, JWT/SQLite/REST service or landing page receive staged-delivery instructions and an automatic final structural check in run/chat. Generator guidance asks for at least 15 meaningful tests; that count must be established by running the real suite. Website guidance targets an early preview around three minutes; it does not kill a process or guarantee a duration or design score. Save the runnable slice, README and verification entry first so an interrupted task leaves useful files.

## Limits and diagnosis

WRITING_EVIDENCE_UNVERIFIED and DELIVERY_INCOMPLETE return 3. Inspect issues and sources in `--json`, correct the draft/project, and rerun. Model/network errors retain their own diagnostic path. These checks are not proof of native Windows, authenticated APIs, legal accuracy, secure code or original benchmark performance. Linux credentials still require the documented protected backend; no automatic plaintext fallback was added.

## Acceptance and writing-score publication gate

The original W01–W05 short prompts remain unchanged. Deterministic contracts exercise verified file word counts, bilingual disclosure and unsupported-claim negatives, versioned source snapshots, metadata non-attribution, predecessor hashes, and unknown versus numeric prices. See test/writing-delivery-regression.test.mjs, test/writing-evidence-contracts.test.mjs and test/writing-source-upgrade.test.mjs. These checks do not establish W02 >= 4.6 or a writing mean >= 4.5. Three same-model blind runs and independent review remain required before publishing a writing-improvement claim.
