# Koder CLI 0.5.5

Koder saves local Markdown task memory by default, so an ongoing task can recover its decisions, progress and next step. The integration uses the existing Agent, model, tools, permissions and session lifecycle, with personal-agent-growth 0.4.1 guidance.

## Continue a task from its saved record

The first eligible task creates a local library for the current account and workspace. Its default project belongs to the task session, so another chat in the same workspace does not automatically inherit that task's private decisions. Reopening the same task can recall the relevant saved record. Explicit project selection remains available when work intentionally continues across sessions.

The library keeps readable Markdown goals, constraints, checkpoints, decisions and task evidence. Existing explicit notes and personalization records remain in their original systems. Task memory does not replace them, merge account scopes or turn retrieved text into permission.

Run these commands in the workspace you want to inspect:

```sh
koder learning status --json
koder growth status --json
koder learning off
koder learning on
```

Status shows the current scoped path, initialization and effective setting without creating a new library. `--root` selects a library for a learning command; `--learning-root` selects one for an Agent task. A selected root must satisfy its account/workspace binding. See the [full guide](MARKDOWN-LEARNING.en.md) before moving or sharing a library.

## Defaults and opt-outs

Local task memory is on by default when the growth method and Skills are enabled. Existing learning-off, growth-off, all-Skills-off, disabled-Skill and selected-library-off choices remain effective. Turning growth on does not erase a separate learning-off choice.

Setup exposes the same feature and master controls. In a chat, `/learning off` and `/learning on` apply to following turns without replacing the conversation. A disabled turn does not mount learning tools or capture its task content. `--no-learning` skips learning for one invocation. Turning learning off retains previously saved files.

This default does not enable preference/profile learning, daily state, proactive messages, synchronization, skill evolution or background residency. Those controls remain separate. No network, external-account, computer-tool or global Skill installation/adoption permission is added.

## Local review and verified outcomes

Bounded review runs through the existing CLI session lifecycle while it is open, or on a later task. It makes no additional model call and registers no new OS scheduler or daemon. Existing agentd sessions use the same session path when separately activated; enabling learning does not activate agentd.

The model may propose a checkpoint or outcome through the original tools. A completion claim stays `pending_verification` until the required evidence supports it; a self-assessment cannot confirm success. Missing usage or cost stays unknown rather than zero. Cancellation, unavailable/corrupt storage and malformed optional learning configuration do not authorize fallback writes or silently widen scope; the primary task can continue with learning unavailable.

The original Harness experience records and native maintenance/adoption gates remain in place. Markdown notes do not become a second authoritative experience database, executor or global Skill registry. Original failure records, baseline comparisons and rollback requirements still apply.

## Validation and distribution

The source checks exercise real scripted Agent tool calls and later recall, defaults and opt-outs, separate chats, account/workspace/custom-root binding, cancellation, corrupted storage, context bounds, original notes, migration opt-out preservation and unknown usage. Prior model-effort and bounded output-continuation coverage is retained. Scripted and local checks do not establish live-provider or model-quality acceptance.

The release attachment [ACCEPTANCE-RESULTS.json](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.5/ACCEPTANCE-RESULTS.json) records source checks, exact packaged execution and isolated installation/update separately. Publication readback is tracked against the same archive digest. See [feature and acceptance guidance](../ACCEPTANCE.md); earlier failures and unrun tracks remain disclosed.

Windows remains a beta track. Native Windows 10/11 installation, Console/ConPTY/IME, Windows-MCP GUI, paid-provider tasks and private-account writes remain NOT_RUN for this change. The unsigned macOS locked-use helper remains HOLD. Legal files and third-party rights are unchanged.

The existing installer entry points remain on GitHub Releases. This update excludes website changes and deployment. Previous [session](SESSION-DOCK.en.md) and [thinking/output](MODEL-EFFORT-AND-OUTPUT.en.md) guides remain available in full.
