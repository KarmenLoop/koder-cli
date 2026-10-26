# Koder CLI 0.5.2

This release connects existing Koder capabilities more directly and fixes MCP discovery failures.

## Changes

- Native `code_graph` queries JS/TS dependency, dependent and symbol candidates through the existing Koder Reverse worker. Results include source hashes and evidence; pagination detects changed source. No Python, graph database, MCP process or new cloud account is required.
- `koder mcp capabilities` reports implementation ownership and precise coverage. In a task, `tool_inventory` maps common MCP names to the native tools actually mounted for that task. Native coverage does not grant permission or prove execution.
- Long preset aliases retain workspace identity. Legacy bindings are reconciled by saved server ID and workspace. Duplicate preset aliases fail explicitly rather than orphaning the previous binding.
- An unavailable optional REA/Reverse/CAD service no longer blocks unrelated application discovery. Explicit requests still report the original failure. Twilio's documentation entry opens a reference page rather than attempting an MCP handshake.

## Retained integrations and limits

JS/TS lexical candidates are not a resolved call graph. CodeGraphContext remains available for advanced queries and other languages. Windows-MCP, REA, SolidCraft and the official MCP SDK remain attributed upstream components. GitHub, mail and SaaS accounts remain external services with their existing authorization requirements.

Native Windows GUI, cold installation and update are beta-owned and remain NOT_RUN in this local release record. Paid-model quality, private mail delivery and authenticated account writes were not exercised for this change. The unsigned macOS locked-use helper remains HOLD. No website deployment is included.

See the [capability guide](NATIVE-MCP-CAPABILITIES.en.md) and the release asset ACCEPTANCE-RESULTS.json for exact local execution evidence. Existing context controls, project history, permissions, budgets, cancellation and UNKNOWN reconciliation remain in place.
