# Writing and delivery checks

Applies to **0.4.0-preview.28 Beta**. The original 12 benchmark prompts are preserved. These are deterministic delivery checks, not new blind-test scores.

## Decision-maker copy

A Koder introduction aimed at technical decision makers receives guidance to cover the problem, costs/ROI and risk, integration, and limits. If the request explicitly asks for about 800 Chinese characters, the delivery range is 720–880 Han characters. Punctuation and Latin identifiers do not count; headings do. JSON output includes actual/min/max. A failed range returns 3 and prints the count. Facts and audience quality still need review.

## Release copy with sources

The agent can use the read-only writing_sources tool. It reads up to eight fixed workspace filenames, at most 64 KB each: CHANGELOG.md, CHANGELOG.en.md, CHANGELOG.zh.md, CHANGES.md, RELEASE-NOTES.md, RELEASE_STATUS.md, RELEASE.json, ACCEPTANCE.md. It does not follow links outside the workspace, search accounts, run commands or fetch the network. Source text is data, never permission.

Successful read_file calls on matching changelog/release-note files also record snapshots. A matching version and two bullet facts in its heading section require two distinct line references such as `[CHANGELOG.md:L3]`. A README, tag, version number or acceptance terms alone cannot prove release increments. When the matching changelog is absent, disclose that limitation and describe existing capabilities separately. Unsupported attribution or missing disclosure returns 3.

References prove that the cited lines exist in the source snapshot. They do not prove that a paraphrase follows from those lines. Review the actual facts before publishing or sending. Email authorization remains separate.

## Compressing a comparison

A request to condense the preceding comparison uses the actual final preceding draft, with its SHA-256 in the JSON audit. Missing drafts must be disclosed. New numerals and selected named technology claims are flagged; precise unverified prices remain blocked. This is a conservative lexical check, not full semantic equivalence or a competitor ranking. Newly phrased claims can still need human review.

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
