# Koder capabilities and MCP boundaries

[中文](NATIVE-MCP-CAPABILITIES.zh.md) · [MCP presets](MCP-INTEGRATIONS.en.md) · [Third-party notices](../THIRD_PARTY_NOTICES.md)

This guide describes the scope of 0.5.2. It distinguishes Koder's own implementations, work derived from upstream projects, and services that need a separate runtime or account. “Native” describes implementation ownership; it does not establish acceptance on every computer. MCP is a connection protocol. Koder-owned tools can use MCP, and bundled MCP servers can remain entirely third-party software.

## Existing Koder capabilities

| Capability | What it currently provides | Scope |
| --- | --- | --- |
| Project files | Reading, search and approved writes | Existing workspace and permission checks apply; this does not grant access to the whole disk |
| Public web and GitHub research | Public pages and repository research at selected references | Public reads retain address checks and cancellation; private repositories and account writes use the dedicated GitHub authorization flow |
| Koder Reverse 0.1.0 preview | Static facts from PE, ELF, Mach-O, WASM, ASAR and JavaScript; queries, comparisons and a limited ARM64 decoder | Targets are not executed. This is not a complete decompiler or dynamic debugger. Unknown instructions and incomplete coverage remain explicit |
| JS/TS project navigation | `koder reverse project` and the Agent's `code_graph` tool return file dependencies and symbol candidates with file hashes and source locations | Lexical candidates, without complete grammar, scope, type or runtime call resolution; external packages and dynamic modules remain unresolved |
| Tool orchestration | Tool selection, approval checks, task lifecycle, cancellation and result receipts | These controls do not transfer ownership of the third-party implementations they invoke |

The Koder Reverse analysis core uses its own modules and Node.js built-ins. Its Agent integration reuses the existing host and MCP transport. Project analysis currently allows up to 256 source files and 8 MiB in total, with separate traversal, output and Worker limits. See [Koder Reverse](KODER_REVERSE.md) for the full capability and limitation tables.

Browser bindings and computer-driver interfaces also exist, but they require a working host and driver. A normal CLI session without an injected `computerDriver` cannot promise mouse, keyboard, screenshot or browser control. Runtimes such as LCU and Windows-MCP still require their own platform, installation and permission checks. Reads outside the workspace and some computer calls do not yet receive task cancellation throughout their call path. Cancelling a task also does not guarantee reversal of an external action that has already occurred.

## Runtimes that retain their upstream identity

| Component | Current integration | Ownership and limits |
| --- | --- | --- |
| Windows-MCP 0.8.8 | Bundled Python subprocess for Windows x64; preset off by default | MIT project by CursorTouch / JEOMON GEORGE, with dependencies under GPL, MPL and other licenses. It is not a Koder-authored desktop engine, and a complete replacement has not been accepted |
| CodeGraphContext 0.6.13 | Optional external preset with separate project configuration and graph storage | MIT upstream project; verify the installed executable's actual version separately. Its language parsing, database and advanced queries exceed Koder's lexical navigation scope |
| REA 6.7.0 | Bundled, separate Node MCP process | MIT project by morluto, with independently licensed dependencies, including OpenPGP.js under LGPL. External analysis engines remain separate prerequisites; full REA replacement has not been accepted |
| SolidCraft 0.23.0 | Headless CLI/MCP for macOS universal and Windows x64 | MIT OR Apache-2.0 project by SolidCraft contributors. Koder supplies integration and lifecycle management, not a claim to authorship of its CAD kernel |
| Official MCP TypeScript SDK 1.30.0 | Protocol implementation in the existing application connection host | MIT software by Anthropic, PBC, with its own dependencies. Koder's task policies and the SDK's ownership are recorded separately |

See the [bundled Windows runtime](WINDOWS-MCP-BUNDLED.en.md), [REA](REA.md) and [MCP presets](MCP-INTEGRATIONS.en.md) guides. Original versions, licenses, source archives and integrity records remain in place. Koder's product license does not replace third-party terms.

## Connected JS/TS navigation

The Agent's `code_graph` entry point now uses the existing Koder Reverse Worker for project summaries, imports, imported_by and symbols. It retains workspace restrictions, pagination, snapshot-change checks and cancellation. This path starts no additional MCP service, installs no graph database and does not execute the analyzed source. Ask the Agent to find a file's importers, then read the source to check the candidates.

The 23 related local tests passed. The integration test exercised CLI `run`, a scripted model provider, the native Worker, `read_file` and a subsequent model step against a synthetic project. No paid model or Windows GUI was exercised. These results establish the local call path, not acceptance with real models, every platform or the full upstream CodeGraphContext feature set.

The current scope is bounded JS/TS file-level candidates. Python, semantic queries across languages and advanced Cypher remain with optional CodeGraphContext, or fall back explicitly to source-file search. A candidate relationship does not establish that code is unused, tests passed or deletion is authorized. This is not complete CodeGraphContext replacement.

## Remote applications remain remote services

The application catalog includes OAuth connections, documentation links and entries that cannot currently connect. An entry does not prove login, authorization, installation or working access. Providers such as Notion, Figma, Slack and Gamma continue to control their servers and subscriptions; users retain their own account and data permissions.

Koder can independently implement connection handling, tool discovery, approvals and receipts without claiming to implement a provider's server. Gamma API and MCP connections use different authentication paths. GitHub uses dedicated commands and permissions. The Twilio catalog entry opens documentation. Available operations depend on the current account grant, service state and actual tool discovery.

## Check the current state

Start with these commands in your project directory:

```text
koder mcp capabilities --json
koder reverse status
koder reverse tools --json
koder mcp presets --json
koder mcp doctor codegraph
koder rea status
```

`mcp capabilities` reads implementation ownership and bounded coverage without starting an MCP host or contacting an account. It does not establish which tools are mounted in the current task or grant permission; inspect actual task tools and execution results separately. A preset records a target version. Finding a launcher with `doctor` does not verify its version, behavior or desktop permissions.

Independently written code, ports or modifications of upstream code, and unmodified external runtimes must be identified separately. Renaming a fork, changing its language or adding a wrapper does not erase its origin. Replacing Windows-MCP, REA or SolidCraft requires capability-specific target, failure, cancellation, concurrency and platform acceptance. This page makes no claim of complete replacement or acceptance on every platform.

Small model windows (8K or below) expose the graph schema when the current task asks for graph, dependency, import or symbol navigation, or after explicit tool discovery. Other tasks retain space for history. The native-routing policy remains a short runtime instruction; it is not a separately readable catalog Skill.
