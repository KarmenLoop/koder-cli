# 0.4.2-candidate.5 — universal app use configuration

This unpublished increment preserves candidate.4 and registers `builtin:universal-app-use` in the existing CLI harness. It adds independent Setup controls for the method and tutorial learning, a validated `universalAppUse` config object, legacy-ID compatibility and disable-all integration. The system message now uses a short pointer instead of repeating the full method.

Known Apps/MCP remain the default first choice, followed by authorized browser/desktop channels. The existing tutorial helper enforces per-turn attempts, including failures and concurrent calls; steering does not reset them. Unknown external results still require reconciliation. Other connected-tool learning limits and UI recovery limits are model workflow constraints, not universal hard gates.

No drivers, permission authority, task engine or memory store are replaced. No EULA or default grant changes. Read the [English guide](APP-USE-AND-LEARN.en.md) and [Chinese guide with six acceptance cases](APP-USE-AND-LEARN.zh.md). This candidate is not a production update; native client, account and real-model tests remain distinct from local fixture checks. Prior failures are retained in the task evidence and release history.
