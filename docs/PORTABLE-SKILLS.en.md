# Local Agent Skills

Available in **0.4.3**. Existing models, tools, histories and permissions remain; platform and real-account limitations are listed in the release notes.

Koder reads local Codex, Cursor and WorkBuddy/CodeBuddy Skill packages through its existing `skill_catalog` and `skill_read` tools. Instructions can guide the current Agent; scripts run through the existing execution tools and approvals. The current model and BYOK settings stay in use.

## Find and use a Skill

```text
koder skills list
koder skills list --query design --json
koder skills show my-skill
koder skills show my-skill --path references/details.md
koder run "Complete this task with the selected method" --skill my-skill
```

Use an ID from the list when two packages have the same name. Koder reports `SKILL_AMBIGUOUS` rather than silently choosing one. The current source has no four-selection total limit; separate explicit names or IDs after `--skill` with commas. A short metadata projection does not discard other selected methods, which remain accessible through paginated catalog and resource reads. Selection requires the Agent to read the method before applying it; it does not execute a script by itself. A known `$my-skill` token in a task also selects it. Use single quotes in PowerShell or Unix shells to preserve `$` literally.

In the current chat:

```text
/skills list
/skills show my-skill
/skill my-skill
Complete the report using the selected method.
/skill clear
```

`/skill` selects for subsequent turns in this chat until cleared or replaced. An optional task after the name fills an editable draft; it is not sent automatically. `/skills import`, `enable` and `disable` rebuild the idle Agent session for the next turn. No second terminal is required.

Relevant methods may also be selected automatically from their metadata. This is model behavior, not a promise that every task will use a particular method. Only the directory metadata enters the initial prompt; full instructions and reference text are loaded on demand. Scripts and binary assets are never run or sent wholesale during discovery.

## Directory compatibility

The following paths are relative to the workspace or user home. Koder scans a workspace and its ancestors up to the nearest Git repository root. Outside a repository it scans only the selected workspace. It also scans user directories.

| Package source | Project and user directories | Supported content |
| --- | --- | --- |
| Codex / shared Agent Skills | `.agents/skills`; `.codex/skills` as a compatibility path | `SKILL.md`, metadata and relative resources |
| Cursor | `.cursor/skills`, `.agents/skills` | Frontmatter or plain Markdown, nested package folders, manual invocation and file patterns |
| WorkBuddy / CodeBuddy | `.codebuddy/skills` | Standard manifest, localized display metadata, scripts, references and templates |
| Koder aliases | `.koder/skills`, `.workbuddy/skills`; `<KODER_CLI_HOME>/skills` | The same portable package format |

`.workbuddy/skills` is a Koder alias; it is not a claim about WorkBuddy's official storage path. Nondefault host storage and system administrator directories are not discovered automatically: import a copy instead. Directory links are accepted only when they resolve inside another configured Skill root. Links to arbitrary outside folders are diagnosed and excluded.

Official format references: [Codex Skills](https://learn.chatgpt.com/docs/build-skills), [Cursor Skills](https://cursor.com/docs/skills), [WorkBuddy Skills](https://open.workbuddy.cn/en/docs/skill), [CodeBuddy directories](https://www.codebuddy.ai/docs/cli/codebuddy-dir).

## Import a folder or ZIP

```text
koder skills import "/absolute/path/to/my-skill"
koder skills import "/absolute/path/to/export.zip"
```

An import copies a local package into `<KODER_CLI_HOME>/skills` (normally `~/.koder-cli/skills`). It preserves the original files, license notices, scripts, templates and binary assets. It does not rewrite third-party ownership, execute scripts, download dependencies or change source packages. Existing destinations are not overwritten. ZIP bundles may contain multiple package folders and a shared license. Nested archives are not unpacked.

To temporarily exclude a discovered package:

```text
koder skills disable local:ID_FROM_LIST
koder skills enable local:ID_FROM_LIST
```

Save the ID before disabling; disabled packages are omitted from the active list. Enable requires that exact ID. IDs depend on the canonical package path; moving or copying a package gives it another ID.

## Metadata and resources

`name`, `description`, `display_name`, `display_name_en`, `description_zh`, `description_en`, `version`, `author` and `allowed-tools` are retained. `disable-model-invocation: true` hides a method from automatic discovery and denies an unselected Agent read; explicitly selecting it makes it available. `user-invocable: false` excludes it from manual selection while allowing relevant model discovery.

`paths` accepts a scalar, a simple list or an array of glob patterns. Automatic matching uses filenames explicitly present in the current task; Koder does not invent an editor's active file. Explicit manual selection can use a scoped method outside that match.

`skill_read` accepts an exact ID, a package-relative text path and bounded `offset`/`limit`. WorkBuddy-style `@references/file.md` resolves within the package. Results include the package root, manifest hash and resource hash so the Agent can locate approved script invocations and cite actual material. Changed instructions must be refreshed; traversal and escaping links are rejected. Binary assets remain available to existing tools that can process them; the text reader rejects binary or invalid UTF-8 input.

## Execution boundaries

Host-specific Hooks, forked subagents, scheduling, accounts, connectors, plugin manifests and proprietary tools are not imported as executable configuration. A Skill that depends on one needs an equivalent, explicitly configured Koder tool or MCP server. Read/Write/Edit/Bash names are guidance for the current `read_file`, `write_file`, `str_replace` and `shell` schemas, not an extra tool API.

`allowed-tools` is preserved as source metadata; it neither grants permissions nor replaces Koder's tool restrictions. Koder does not emulate a source host's per-Skill permission policy. Ask remains read-only, explicit deny remains deny, and cancellation and execution receipts stay with the existing Core. Importing a Skill is not permission to install its dependencies or follow untrusted instructions.

The current source no longer truncates discovery at 200 methods, 4,000 directory nodes, or six nesting levels, and has no four-selection or 32-manifest total limit. `skills list` returns 50 entries by default; use `--offset` and `--limit` to continue, with at most 200 entries per page. JSON results include `total` and `nextOffset`. Manifests retain their 256 KiB limit, and metadata summaries retain a prompt budget. Local ZIP import retains its 16 MiB compressed, 32 MiB unpacked, and 512-file safeguards. Resource reads are paginated; byte, path, and link checks still apply. Unsupported host configuration is not executed.

## Find a missing method

Search the local catalog first with `koder skills list --query "category" --json`. With the computer owner's `network` and `skills.update` grants, `koder skills seek "public category" --json` finds candidates. Fetch using the returned full ID and pinned 40-character commit: `koder skills fetch <id> --ref <ref>`, then read with `skills show <installed-id>`. Downloaded resources remain inert. Original tools and approvals still govern the unfinished task. See [task orchestration](TASK-ORCHESTRATION.en.md) for the complete workflow, diagnostics, and acceptance boundaries.

## Verification and troubleshooting

Local checks use owned example packages for all three formats and scripted model responses. Actual Koder tool execution reads references and runs a test script to create a file; Ask and deny checks verify that the file is not created. These checks do not establish native Windows acceptance or autonomous selection by a live provider. Those remain separate acceptance items.

`SKILL_NOT_FOUND`: run `skills list` in the same `-w` workspace. `SKILL_AMBIGUOUS`: use the full ID. `SKILL_MANUAL_ONLY`: explicitly select it. `SKILL_CHANGED`: refresh or start the next turn. `SKILL_SCOPE_MISMATCH`: name a matching task file or deliberately select it. `SKILL_TEXT_ENCODING`: provide UTF-8 text. A discovery warning identifies the affected path while valid packages continue loading.

## Bundled media and browser Skills

See [the bundled workflow guide](VIDEO-BROWSER-SKILLS.en.md). `skills catalog` includes source availability, `skills doctor <name>` checks dependencies without running them, and `skills prepare <name>` copies verified resources into a new project directory. A unique local package with the same name takes precedence; use `bundled:<name>` for the packaged copy. Two local packages with the same name still require an explicit ID.
