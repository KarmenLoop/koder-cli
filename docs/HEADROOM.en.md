# Headroom context optimization

[English](HEADROOM.en.md) · [简体中文](HEADROOM.zh.md)

Koder enables `builtin:headroom` in its existing task loop. Chat, ask, run, and resident tasks use the same native integration. No proxy, extra model, Python process, or separate account is required.

## Representations and acceptance

- Flat and nested homogeneous JSON tables share column names and retain every row, envelope, key order, duplicate key, numeric spelling, and string escape.
- Other JSON removes whitespace outside strings without converting numbers through JavaScript serialization.
- Consecutive repeated shell/search lines use run counts. Interleaved repeated lines use an exact-line dictionary and a complete order list. CRLF and partial final lines survive.

Each candidate is independently decoded and checked. JSON lexical values round-trip; original formatting remains available through retrieval. Logs round-trip exactly. A candidate must save at least 15% and 256 UTF-8 bytes, including its header, and lower the shared native token estimate. Request-level savings must cover guidance, the retrieval schema, and a margin. Otherwise, the original passes through.

Defaults cover 1,200–262,144 characters per result and at most 2,097,152 eligible characters per request, newest first. Oversized old results do not consume that allowance. Invalid, unsupported, protected, overly complex, and low-gain content stays unchanged. The message order and stored history do not change.

## Retrieval and safety

A `HEADROOM_V1` header contains the original call ID, SHA-256, format, and character count. `headroom_read` retrieves original text from that same thread using `toolCallId`, `sha256`, `offset`, and `limit` (1–12000 characters). Optional `query` is a case-sensitive literal, 1–256 characters; it does not execute a regex. Search scans at most 2 Mi characters per call, overlaps boundaries, and returns a continuation offset when needed.

This tool does not access files, another session, the network, or the original command. Missing originals produce `HEADROOM_RESULT_UNAVAILABLE`; the runtime does not replay an action to manufacture old evidence. Credential results and `request_login` are excluded.

User, assistant, and system text, file/Skill reads, writing sources, signed provider blocks, unfinished call groups, errors, and unknown receipts remain intact. Successful shell output may change representation while retaining its receipt. Ordinary MiniMax reasoning is preserved without incorrectly treating it as a signed block.

Each session has a separate derived-result cache: at most 128 entries and 1 MiB of accounted bytes, not a process RSS limit. It adds no raw-result store or disk database. Content hashes invalidate changed results; disabling clears the cache. This is not the provider's prompt cache.

## Context budgets and long tasks

Headroom runs before the existing context-budget projection. Permissions, cancellation, fee budgets, JIT, and receipt reconciliation remain authoritative. History compaction is configured separately in Setup → Context and output or `/context`; its default trigger is 80%, target 60%, with four preferred recent turns, subject to the actual window. Neither setting silently disables the other. See [Context controls](CONTEXT-CONTROLS.en.md).

When a representation or raw page cannot fit, the budget layer keeps a valid `not-loaded` reference and `readWith` address, rather than truncating the encoding. The agent must reread that same offset with a smaller limit. Unread pages do not advertise a next-page cursor. Skill pagination follows the same rule.

This does not enlarge a model's physical window, guarantee unlimited tasks, or ensure that a model will retrieve every relevant detail.

## Controls

Setup → Skills → Headroom controls automatic projection and redundant-output guidance separately. Full code, documents, evidence, explanations, and requested word counts take priority over output shaping. Disable-all includes this Skill. Restart an existing session after changing settings in another terminal.

```sh
koder skills show builtin:headroom
koder skills doctor builtin:headroom
koder skills disable builtin:headroom
koder skills enable builtin:headroom
```

Use `/skills` for the same actions in chat. Merge this into the existing configuration without replacing unrelated settings:

```json
{"headroom":{"enabled":true,"shapeOutput":true,"minChars":1200,"maxChars":262144}}
```

`minChars` accepts 256–65536. `maxChars` must be at least minChars and at most 1048576.

## Diagnostics

The final `koder run --json` result includes the last request's `headroom` statistics:

- `transformed`: accepted result count; zero is normal.
- `beforeBytes`, `afterBytes`, `overheadBytes`: changed payload bytes, headers, and estimated added overhead.
- `beforeTokens`, `afterTokens`, `overheadTokens`, `estimatedNetTokens`: native estimates, marked `tokenBasis: estimate-not-billed`.
- `scannedChars`, `scanLimitChars`, `skipped`: bounded processing and skip reasons.
- `cache`: local derived-cache hits, entries, and accounted byte limit.
- `metrics`: call IDs, hashes, formats, and counts; no raw output.

These figures are not cumulative billed savings, a quality score, total request differences, or provider cache hits. Retrieval adds input cost. Provider usage and billing remain separate.

## Sources

The existing portable [Headroom Skill](https://github.com/roman-ryzenadvanced/headroom-skill/tree/118466d7737ebc42806c331e44bd251b5222d59b) remains pinned under Apache-2.0, with its reference scripts, LICENSE, and NOTICE unchanged. Scripts never run automatically.

The broader [Headroom project](https://github.com/headroomlabs-ai/headroom/tree/fc1ba891bff2d1e0cb53c4ffd4037f5066988c8e) was reviewed at `fc1ba891bff2d1e0cb53c4ffd4037f5066988c8e`, also under Apache-2.0. Koder implements bounded lexical codecs, retrieval, cache, and budget integration in its existing Node kernel. It does not bundle the upstream proxy, Python/Rust engine, ML weights, or another Skill.

Lossy selection, code skeletonization, ML compression, and proactive cross-call expansion are not Koder defaults. Current upstream architecture supersedes older descriptions of history deletion and cross-user TOIN. Upstream benchmark claims are not Koder results.

Local tests cover transformations, settings, CLI/IPC, isolation, search boundaries, protected protocol groups, and 8K pagination. A synthetic real-model retrieval check is separate from whole-task quality, billing, and native Windows/Ubuntu acceptance. Local source and package checks do not establish a published release; use the CLI website's official manifest for installation.

