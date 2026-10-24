# Koder CLI 0.4.2-candidate.1 — unpublished

This candidate adds local Agent Skills discovery, import and invocation to the stable 0.4.1 runtime. It retains existing built-in methods, model routing, workspace history and execution authority.

- Discover standard Codex, Cursor and WorkBuddy/CodeBuddy skill folders. Keep same-name packages separate with stable IDs.
- Search metadata through the existing `skill_catalog` and read instructions or relative text resources through `skill_read` only when needed.
- Select a Skill with `--skill`, a known `$name` in a task, or `/skill` in the current chat. `/skills` lists, reads and imports without leaving chat.
- Import a local folder or ZIP without running its scripts or installing dependencies. Preserve resources and original notices; reject invalid paths, unsafe links and malformed manifests.
- Retain manual-only and user-invocable flags and bounded file-pattern matching. Host-specific hooks, accounts and execution policy are not imported.

See [the guide](PORTABLE-SKILLS.en.md) and [Chinese guide](PORTABLE-SKILLS.zh.md). No real-model planning score, native Windows client acceptance or production publication is claimed. Local scripted-provider and unpacked-package evidence is recorded in the task acceptance receipt. Stable 0.4.1 remains the production download; this candidate is not an available remote update.

## Retained regression failures

Expanded local regression ran 192 CLI checks: 188 passed and four failed. The same four failures were reproduced against the unchanged 0.4.1 source: the older development-plan fixture expects an implementation request to finish after planning; two terminal suggestion checks no longer receive their expected choices; the full interactive tutorial does not reach its expected second repair. Original assertions and time limits remain unchanged. These remain unresolved baseline failures, not a fully green release gate. The portable Skill cases and selected kernel regressions passed separately.

