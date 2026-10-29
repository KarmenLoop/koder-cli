# Awesome LLM Apps in Koder CLI

Available from 0.4.20, enabled by default. The integration brings a pinned reference library, seven adapted methods, and five callable tools into Koder's existing agent loop. It does not start a second executor or install every upstream application.

## Verify the installation

Install from the [CLI website](https://kodermodule.com/en/cli-download.html), reopen the terminal, then run:

```text
koder --version
koder llm-apps status
koder llm-apps verify
```

Expect 0.4.20, enabled=true, 146 entries, seven adapted Skills, and an integrity check covering 1,636 bundled text files. No provider or network is needed for these commands. The upstream revision is [6c16b23f1bacd0fdf240bb5141ef45e59e82c306](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306). Root Apache-2.0 and subtree license notices are retained. See the [complete catalog](AWESOME-LLM-APPS-CATALOG.md) and [Chinese walkthrough](AWESOME-LLM-APPS.zh.md).

## Use an example in a real task

Start Koder in your project and ask:

> Build a document Q&A application in this project. Select a bundled Awesome LLM Apps reference. Use docs/policy.md as the only evidence source. Include citations and an explicit no-evidence response. Implement the entry point and tests, run them, and provide the launch command.

Relevant AI-app, RAG and agent-team tasks receive a short default workflow. The model can search the catalog, read selected source files, obtain a Koder-specific implementation plan, and keep working through the original tools. A plan is not a completed application: the final task still needs real files, tests and results.

| Tool | Behavior |
| --- | --- |
| llm_app_catalog | Offline paginated search with topic aliases |
| llm_app_read | Pinned source/README/dependency text, provenance, license and SHA |
| llm_app_plan | Existing Koder owners, required services, steps and acceptance checks |
| llm_app_retrieve | Lexical passages from explicitly named project text files |
| llm_app_verify | Re-read sources and verify exact quotes against their SHA |

## Exercise retrieval without a model

Create a separate project directory and save policy.md as UTF-8:

```text
# Sample policy
Unopened products may be returned within 30 days.
Custom orders require a separate review.
```

From that directory:

```text
koder llm-apps retrieve policy.md --query "returned" --json
```

Inspect passages, path, sha256 and line numbers. A missing match produces sufficientEvidence=false. Retrieval is lexical, not an embedding service, and makes no external request. Limits are 16 explicitly named files, 256,000 bytes per file, 1 MiB total and 12 returned passages; these are data limits, not a task-step cap.

Create citations.json using the actual 64-character SHA returned above:

```json
{"citations":[{"path":"policy.md","sha256":"REPLACE_WITH_ACTUAL_SHA","quote":"Unopened products may be returned within 30 days."}]}
```

Run `koder llm-apps check citations.json --json`. A matching quote returns exit 0. Change the quote to 99 days: QUOTE_NOT_FOUND, exit 3. Change the source while keeping its old SHA: SOURCE_CHANGED, exit 3. Invalid input or inaccessible paths return exit 2. Empty citations cannot pass.

Exact quote matching does not establish logical entailment, completeness or current external facts. The existing confined file reader rejects outside paths, protected credential files, symlinks and hard links.

## Inspect and adapt source

```text
koder llm-apps list --query RAG
koder llm-apps list --family rag --limit 10 --offset 10
koder llm-apps plan rag_tutorials/rag_chain "Document Q&A"
koder llm-apps read rag_tutorials/rag_chain
koder llm-apps read rag_tutorials/rag_chain --path @files --json
```

Use file names returned by @files with --path. Text supports --offset/--limit; file listings return at most 50 rows. Dependencies and credentialNames describe the example, not installed or authorized services. Images, binary/data assets, lockfiles and hosted services are excluded; source references may still mention them.

The ten families map to existing owners: application development, RAG, research, multi-agent delegation, MCP, voice, memory, automation, generative UI and Skills. Plans recommend existing profiles; they do not override forced profiles or relax their deny lists. deep-research still blocks sending, publishing and opaque effects.

Seven Koder-adapted methods cover project retrospectives, reader feedback, scope review, commit history, dependency checks, spoken-note organization and advisor/orchestrator/worker delegation. Simulated readers are labeled as simulations. Delegation uses Koder subagents with parent budgets and cancellation, never an external AI CLI with bypass flags.

## Configure and understand the boundary

`koder llm-apps off` disables the parent Skill, its seven child methods, default guidance and five agent tools in subsequent sessions. `on` re-enables the parent while preserving individually disabled methods. Setup → Skills supports individual and all-off controls. Enabling a child while the parent is off explains how to enable the parent first. Explicit CLI reference/retrieval commands remain available.

Local lookup, planning, retrieval and verification incur no model charge. Agent reasoning uses the current provider/BYOK, budget and cancellation controls. No tool-round limit is added. Read source progressively instead of placing the entire library in context.

Generated applications configure their own supported secrets and services. Koder does not copy its provider keys, grant computer/network access, install global dependencies, start unmanaged daemons, or authorize messages because an example suggests them. Original memory isolation, approvals and UNKNOWN reconciliation remain in force.

An integrity error requires restoring the official package, not skipping verification. For a missing ID/path, use list and @files. SOURCE_CHANGED requires rereading the updated document. Missing APIs, voice devices or databases require explicit setup and separate testing.

LLM_APP_SOURCE_ENCODING rejects ambiguous UTF-8 decoding/replacement characters. Confirm the original encoding and save a separate UTF-8 text copy before retrieving; a lossy decode must not be presented as the original file hash.

## Verification scope

Local tests cover all catalog entries, file integrity, actual CLI commands, Setup/off behavior, profile restrictions, real project retrieval, forged/stale quotes, protected paths, cancellation, and a scripted-provider task that saves a real report through the existing approval path. Refusing approval prevents the write.

These are deterministic integration checks, not paid-model quality scores. The 146 upstream services, their dependencies, accounts and UIs are NOT_RUN here. Windows and Intel Mac native acceptance remains with the beta team; local execution was on macOS Apple silicon. Existing SolidCraft, mail, MCP, session isolation and unbounded task rounds are retained.

