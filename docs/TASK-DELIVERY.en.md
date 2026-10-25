# Completing the current request

Koder CLI 0.4.10 retains the current-turn delivery checks introduced during the 0.4.1 release cycle. These checks run in the existing native CLI execution loop.

## Coding

Use `koder run "Fix add.mjs and run its tests"` for implementation. Koder checks current-turn file receipts and bounded file differences, rather than accepting an old project or a plan as proof of new work. An explicit target must be accounted for. A task that only asks for tests may deliver test files without changing working production code. If no code change is needed, Koder must read the current source, run a successful check and explain that conclusion.

When testing is explicitly requested, a successful test process must follow the last relevant edit. A different passing test cannot erase an unresolved failed test. A passing process still does not establish coverage or semantic correctness.

A task explicitly limited to editing named JSON or YAML configuration can be delivered through those files. An unrelated configuration file does not satisfy a function or application implementation request.

## Writing

Ask for the actual document, with any required filename, table and total length: `koder run "Write a project update email and save it as update.md"`. A reply may deliver the document directly when no file is required. Explicit file delivery requires a current-turn artifact; an existing file plus an unrelated successful command is insufficient. The main draft, rather than a short closing message, is checked for supported format and length requirements.

Existing release-source, attribution, predecessor and pricing checks remain. Missing source material must be disclosed; a disclosure by itself is not an entire requested document. These checks cannot establish factual accuracy, originality, style or a model-quality score.

## Repair and limits

A normal final response with missing evidence can receive at most two repair requests within the existing execution loop. Those calls use the selected provider, normal context/step limits and existing permissions. They may consume additional tokens. No new task engine, account, credential or permission is created.

A denied or unknown operation, an external/plugin action, a cancellation, or model-only recovery does not receive automatic completion repair. `ask` does not gain file-writing permission. Plan, report and prompt-enhancement modes do not require implementation artifacts.

If evidence remains incomplete, the CLI returns exit 3, prints `TASK_DELIVERY_INCOMPLETE`, includes `taskDeliveryEvidence` in JSON output and preserves an incomplete notice in local history. Inspect the named files and remaining issues; do not treat this exit code as an API connection error.

The scan is bounded and ignores hidden, dependency, secret and symlink paths. Large or unreadable workspaces may remain unverified. Concurrent edits to the same files cannot be exclusively attributed by a directory difference. Use separate directories for independent work. The gate detects selected observable omissions; it cannot prove that every sentence or feature request has been satisfied.

## Acceptance status

Local scripted-provider and fixture checks exercise the actual CLI, file tools, permissions, process receipts and history. They are not paid-provider tests or blind quality grades. Earlier Windows no-Node installation and Server GUI evidence belongs to candidate.2; candidate.3 native/client GUI acceptance is separate. See the current release notes for the public version and remaining platform checks.
