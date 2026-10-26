# Headroom context optimization

Koder CLI 0.4.5 integrates the Headroom Skill with its existing task loop and enables
it by default. Use koder, koder chat, koder ask or koder run normally. Resident-agent
tasks use the same Core. There is no separate proxy, model, account or Python requirement.

## Behavior
Homogeneous scalar JSON tables can use columns and values instead of repeating keys.
All rows, ordering, numeric lexemes, duplicate keys and string contents are retained.
Other valid JSON can remove formatting whitespace outside strings. Exact consecutive
shell or search lines can use a repeat count with the original line endings.

Each representation is checked for reversibility. Including its header, it must save
at least 15% and 256 UTF-8 bytes. The whole request must also cover the estimated
byte overhead of its guidance and retrieval-tool definition. Otherwise it passes
through unchanged. Guidance and retrieval are exposed only when a projection is used. Defaults process tool results between 1,200 and
262,144 characters, with a 2,097,152-character scan cap per request. Small, invalid,
oversized or marginal inputs pass through unchanged.

When a projection is used, output guidance avoids unnecessary repetition. Explicit requests for complete code,
full documents, detailed explanations or a word count take priority. Headroom does
not increase the model's context window or guarantee lower bills or better answers.

## Evidence and scope
Original results remain in the existing thread. The agent can use headroom_read with
the original toolCallId, SHA-256, offset and limit to read exact text from that thread.
It cannot read another thread, open files, contact a server or replay a command.
Authorization-code results cannot be read through this tool.

Source-file reads, user/assistant/system messages, signed provider data, failures
and uncertain results are not transformed. Successful shell output can be projected;
its exit status and completion receipt remain unchanged. Permissions, cancellation,
UNKNOWN reconciliation and BYOK routing remain authoritative.

Existing JIT and context-budget policies can still excerpt oversized history.
Those excerpts are separate from Headroom's reversible stage. Retrieve the relevant
original text before treating an excerpt as complete evidence. No second memory
store or shared .headroom-cache is created.

## Relationship to history compaction

Koder CLI 0.5.1 adds separate history-compaction settings in Setup → Context and output and `/context`. Defaults are on, an 80% trigger, a 60% target and four preferred recent turns, subject to the model window. History compaction may excerpt older content for a request while retaining the original history on disk. Headroom provides reversible tool-result representations. `/context off` leaves the Headroom setting unchanged; disabling Headroom leaves the history-compaction setting unchanged.

With history compaction off, necessary protocol restoration still handles missing private model state. Input that cannot fit the hard window produces an error and retains saved history. See [Context limits and automatic compaction](CONTEXT-CONTROLS.en.md) for setup steps, model limits, last-request estimates and recovery.

## Settings
Open Setup -> Skills -> Headroom context optimization. Toggle automatic optimization
and redundant-output guidance separately. Disable-all includes Headroom and retains
its files. Changes apply when the session is rebuilt; unrelated windows are not
interrupted. Restart a session after changing its configuration from another terminal.

```sh
koder skills show builtin:headroom
koder skills doctor builtin:headroom
koder skills disable builtin:headroom
koder skills enable builtin:headroom
```

The same actions are available through /skills in chat. Merge these optional fields
into the existing config.json; do not replace other settings:
```json
{"headroom":{"enabled":true,"shapeOutput":true,"minChars":1200,"maxChars":262144}}
```

## Diagnostics
The final result from koder run --json includes headroom. enabled is the configured
state; transformed counts changed results in this model request. beforeBytes and
afterBytes measure those results in UTF-8, including the new representation header.
overheadBytes estimates the additional guidance and tool-definition bytes; it is not a tokenizer.
metrics contains call IDs, hashes, formats and byte counts, never raw tool text.

These are per-request projection figures, not cumulative savings, billed tokens,
whole-request differences or provider cache hits. transformed: 0 is normal when
the current results do not benefit from compression.

## Source and limits
The pinned [Headroom Skill](https://github.com/roman-ryzenadvanced/headroom-skill)
revision is 118466d7737ebc42806c331e44bd251b5222d59b, under Apache-2.0.
The package retains upstream reference files, optional Python scripts, LICENSE and
NOTICE, alongside a separate Koder adapter. Upstream sampling, code skeletonization,
history deletion and standalone caching are not Koder defaults. Reference scripts
are never launched automatically.

Local acceptance covers transformations, negative cases, settings, Setup input,
CLI tool execution, retrieval, thread isolation and local IPC with synthetic data
and scripted models. Real paid-model cost/quality, native Windows cold installation,
GUI, login/reboot and MCP desktop acceptance retain their separate NOT_RUN status.

This release is available from the website and GitHub. Two 8K-context regressions also reproduce on the unchanged
0.4.3 baseline; their failures and assertions are retained in the acceptance record.
