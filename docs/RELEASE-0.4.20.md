# Koder CLI 0.4.20

Awesome LLM Apps is now part of Koder's default AI-application workflow. The current model can find a pinned example, inspect its source, plan an adaptation, retrieve project evidence and verify quotations while continuing through the existing execution loop.

## Added

- 146 offline application/tutorial entries from Shubhamsaboo/awesome-llm-apps at `6c16b23f1bacd0fdf240bb5141ef45e59e82c306`, with 1,636 text resources, licenses and file hashes.
- Seven Koder-adapted methods: project retrospectives, reader feedback, scope review, commit history, dependency checks, spoken-note organization and advisor/orchestrator/worker delegation.
- Five callable tools for catalog search, source reading, implementation planning, local lexical retrieval and exact-quote verification.
- `koder llm-apps` commands for offline inspection, real-file retrieval, citation checking and on/off control; Setup supports the existing individual and all-off switches.
- Short default guidance for relevant AI-app, RAG and agent-team tasks. Existing profiles retain their restrictions; the original provider/BYOK, permissions, workspace history, cost budgets, cancellation and unbounded task rounds remain the owners.

A reference plan does not execute an application. Dependencies, service accounts, images, databases and hosted UIs must be configured and verified for the selected project. The integration does not launch upstream AI CLIs with bypass flags or copy provider keys into generated projects.

## Get started

```text
koder llm-apps status
koder llm-apps list --query RAG
koder llm-apps plan rag_tutorials/rag_chain
koder llm-apps verify
```

[English walkthrough](AWESOME-LLM-APPS.en.md) · [中文手把手教程](AWESOME-LLM-APPS.zh.md) · [Full catalog](AWESOME-LLM-APPS-CATALOG.md). Turn off with `koder llm-apps off`; reopen the conversation to use the new setting. Manually invoked offline commands remain available.

## Evidence and limits

The CLI compatibility suite passed 125 tests covering this integration, long tasks, delegation, mail, MCP, portable Skills, Setup, Headroom and native SolidCraft. The kernel suite initially exposed an existing provenance assertion: it expected a bundled Skill to be labeled Hermes. The baseline plugin already retained bundled provenance; the check now separately verifies the Hermes tool and the original bundled Skill. All 56 kernel checks passed afterward. The original failure record is retained.

New checks execute real project retrieval, detect forged quotes and changed source hashes, reject protected/outside/linked files, propagate cancellation, preserve profile denies, and exercise a scripted-provider task that writes a real report through the original approval path. Refusal prevents the write. Additional checks cover the parent switch at both catalog and plugin registration paths.

These are local deterministic and scripted-provider checks, not paid-model performance scores. The 146 upstream apps and their external accounts/services are NOT_RUN. Windows and Intel Mac native acceptance remain with the beta team. Existing unsigned macOS locked-use, Windows GUI, real-account and login/restart limitations remain unchanged.

Windows CMD/PowerShell and macOS shell installers use the same versioned runtime. This release is published on GitHub only; official website content and deployments are outside its scope. The proprietary runtime remains distinct from the historical public source tree.

## Attribution

Upstream text remains separately licensed. See [Apache-2.0 and snapshot notice](../licenses/awesome-llm-apps/NOTICE.txt), the adjacent license and subtree notices. Koder adaptations are identified separately; inclusion does not imply upstream endorsement.

