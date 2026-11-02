# Project memory with sources

[English](DEERFLOW-MEMORY.en.md) · [简体中文](DEERFLOW-MEMORY.zh.md)

Koder CLI 0.8.4 adds relevant fact recall to Koder's existing local memory and context path. It keeps the original user wording, source and scope. It does not add a second database, cloud memory, another Skill, a background extraction model or a replacement executor.

## Remember, inspect, correct and forget

Install 0.8.4 from the [CLI website](https://kodermodule.com/en/cli-download.html), check its version and open a project you own. Keep the same account and workspace throughout this exercise. These commands target 0.8.4; an older installer does not gain them from reading this guide.

```sh
cd /path/to/your-project
koder learning init
koder learning remember database "PostgreSQL"
koder learning facts --json
koder learning correct database "SQLite"
koder learning facts --json
koder learning forget database
koder learning facts --json
koder learning status --json
```

`database` is a fact key, not a database connection. Use the actual key shown by `facts` when correcting or forgetting. The example records a preference; it does not create or migrate a database. In an eligible writable chat, `remember: database = PostgreSQL` explicitly saves the fact for later conversations in the same account and workspace. Ordinary task progress stays in its original task. Read back the saved fact and source rather than assuming the model used it.

## Boundaries that stay in place

- A source must come from actual user evidence. Website text, tool output and an assistant's conclusion cannot become a user preference merely by supplying a source ID.
- Exact duplicates retain their sources. Similar text is not automatically merged. Different values under the same scoped key remain conflicts and stay out of automatic recall until resolved.
- Correction and forgetting advance the memory revision. Late writes from old evidence are rejected, including after restart. A new user instruction can confirm a fact again; an old tool replay cannot.
- Forgetting stops future recall of that fact. Original conversations, task checkpoints and audit events remain; this is not physical erasure of every historical copy or cross-device deletion.
- Recall uses bounded English-term and Chinese-bigram matching, not vector embeddings. It keeps whole facts and source references within the existing context budget. Compression protects the current task's constraints and evidence identifiers; normal model-context token costs still apply.
- The existing Setup switch, `koder learning off`, `--no-learning` and `--no-memory` continue to control capture and injection. Existing off choices remain effective. Personalization retains its separate opt-in. Stored text cannot grant tool permissions or prove a task succeeded.

See the [Markdown learning guide](MARKDOWN-LEARNING.en.md#sourced-facts-and-cross-session-recall) for task-specific facts and the complete command walkthrough.

## Design reference and verification

The design draws on [ByteDance DeerFlow at the pinned reference commit](https://github.com/bytedance/deer-flow/tree/12c304f12ce5c0bf66d8927386e5dd18ea84f685), an [MIT-licensed project](https://github.com/bytedance/deer-flow/blob/12c304f12ce5c0bf66d8927386e5dd18ea84f685/LICENSE). Koder uses its own native JavaScript implementation and existing stores. It does not embed the upstream Python harness or DeerMem service, add its FTS5 database, or claim full DeerFlow compatibility.

The frozen 0.8.4 record lists **23/23 packaged memory-kernel checks passed**. These cover controlled local behavior and context boundaries, not a new real-model quality score. Native Windows/Ubuntu, network-file-system behavior, cross-device concurrency and real-model memory quality remain **NOT_RUN**. Website publication and public-download checks are recorded in the [release notes](RELEASE-0.8.4.md#release-checks-and-remaining-limits). The kernel development source stays private, and existing third-party rights remain unchanged.

A producer-recorded isolated walkthrough also completed the eight fact-management operations with structured output: PostgreSQL → SQLite → no active fact, with revisions 1 → 2 → 3, final epoch 2 and the source audit retained. The recorder added `--json` for assertions. No model or real account was used; this is local fact-store readback, not cross-session model recall or a quality score.
