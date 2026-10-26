# MCP and Skill compatibility

Koder CLI 0.4.18 uses the existing task executor, permissions, connected Apps and MCP host. A Skill is an instruction package, not an executable connector or an authorization grant. A readable Skill does not prove that its external application, renderer or account works on your computer.

## Find, read and choose Skills

The CLI, Setup and Agent now share the shipped Skill definitions. Project and user Skills retain their existing discovery roots and file guards.

```text
koder skills list --limit 200
koder skills list --query browser --json
koder skills show builtin:做表单
koder skills show ecosystem:agent-browser:core
koder ask "Read the selected method and explain its requirements." --skill ecosystem:agent-browser:core
koder skills disable ecosystem:agent-browser:core
koder skills enable ecosystem:agent-browser:core
koder skills doctor builtin:做表单
```

In a conversation, use `/skills list` and `/skill <id-or-name>`. Use `/skill clear` to clear the selection. Select comma-separated Skills with `--skill`; the previous four-Skill cap is removed. The actual model context window and resource budget still apply. Exact IDs avoid duplicate names. A project Skill keeps precedence over a shipped Skill with the same short name. Disabled methods cannot be selected or read by the Agent.

Setup's Skills switches use the same configuration owners. The all-off control also covers shipped and compatible local Skills; it does not delete their files. Growth, personalization and computer authorization remain separate.

Codex, Cursor and Workbuddy/CodeBuddy-style `SKILL.md` folders are discovered in their existing project/user roots, including `.agents/skills`, `.codex/skills`, `.cursor/skills`, `.codebuddy/skills` and `.workbuddy/skills`. Metadata, manual-only settings, scoped paths and relative resources are preserved. Host-specific APIs, hooks, accounts and permission declarations do not transfer automatically. Read scripts before running them through an available Koder tool and its normal approval.

## Bundled source libraries and dependencies

`koder skills catalog` lists the separately packaged source libraries and reference-only entries. It is distinct from `skills list`, which lists selectable methods.

```text
koder skills catalog
koder skills doctor video-shotcraft
koder skills doctor playwright-cli
koder skills prepare koder-media-workflow --target media-workflow
```

`doctor` inspects prerequisites without installing or executing them. `prepare` copies a reviewed library into a new project directory; it does not run its installer. Rendering libraries may need FFmpeg, a browser, project dependencies or a target application. Playwright CLI requires its executable. CLI-Anything does not install every target application. Jianying's Windows export is platform-specific; macOS automatic export and CapCut are not supported by that bundle.

Two entries remain reference-only because redistribution is not cleared: the CC BY-NC-SA code-animation studio and the unlicensed article publisher. They are not shipped as executable Skills. The two retained memory/personalization interface notes are disabled by default; this audit does not enable them.

## Configure MCP transports

Supported transport adapters are stdio, Streamable HTTP and explicitly selected legacy HTTP+SSE. The existing SDK handles initialization, capabilities, pagination, structured results and cancellation. This is protocol support, not certification of every third-party server.

```text
koder mcp list --json
koder mcp add local-tools --command node --arg /absolute/path/server.mjs
koder mcp add remote-tools --url https://YOUR_SERVER/mcp
koder mcp add legacy-tools --url https://YOUR_SERVER/sse --transport sse
koder mcp import /absolute/path/mcp-config.json
koder mcp test legacy-tools
koder mcp enable legacy-tools
koder mcp tools legacy-tools
koder mcp resources legacy-tools
koder mcp prompts legacy-tools
koder mcp disable legacy-tools
```

Add/import stays disabled unless explicitly enabled. A test temporarily connects and restores a previously disabled server. JSON import preserves `type: "sse"` or `transport: "sse"`; `http` maps to Streamable HTTP. Unsupported or conflicting types are rejected before connecting. URLs with credentials are rejected. Remote connections use HTTPS; unauthenticated loopback HTTP is reserved for local services. Headers and OAuth follow the existing credential owner. Transport selection never automatically repeats an application operation.

The pinned npm 10.9.8 installer component is now included with its dependencies and notices. Registry installations still require a reviewed plan, pinned version/integrity, explicit confirmation and disabled lifecycle scripts. The component is private to Koder; it does not replace your system npm.

## Windows-MCP and Code Graph

```text
koder mcp presets
koder mcp doctor windows-mcp
koder mcp add desktop --preset windows-mcp
koder mcp test desktop
koder mcp add graph --preset codegraph
koder mcp doctor codegraph
koder mcp test graph
```

Windows-MCP 0.8.8 uses the bundled private Python on Windows. It does not run on macOS. CodeGraphContext 0.6.13 uses a separately configured launcher, isolated workspace roots and graph storage. A stale index is a navigation hint, not source or test evidence. The original 8K-context regression now passes because unrelated task-method bodies are loaded on demand; permissions and tool receipts are retained.

## Troubleshooting and evidence

- `SKILL_NOT_FOUND`: inspect `skills list`, use the exact ID and check discovery warnings.
- `SKILL_DISABLED`: re-enable the method in Setup or with `skills enable` if you want it.
- `SKILL_MANUAL_ONLY`: explicitly select it with `--skill` or `/skill`.
- Missing external dependency: run that library's `doctor`, then install only the required dependency in the approved project scope.
- MCP connection error: check transport, endpoint, required credentials and the server's executable. A configured entry is not a connected server.
- Unknown or canceled write: inspect the saved receipt before retrying. Closing a transport does not prove that a remote write did not happen.

Local regression covers real SDK stdio/HTTP/SSE sessions, a local npm package installation with scripts disabled, Skill resource reads, selection/switches, approvals and packaged runtime isolation. Scripted model responses are fixtures, not live-provider quality evidence. Native Windows GUI, OS credentials/notifications and real third-party accounts require separate checks. See the [inventory](MCP-SKILL-INVENTORY.md), [integration guide](MCP-INTEGRATIONS.en.md) and [release notes](RELEASE-0.4.18.md).
