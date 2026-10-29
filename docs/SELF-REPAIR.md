# Local code repair (0.5.20 candidate)

Koder can generate, test and activate patches to its own supported feature modules. Local failure learning remains enabled by default; permission to execute new code is separate and off by default.

## Enable and recover

Choose **Local code repair** in `koder setup`, or explicitly run:

```sh
koder self-repair on
koder self-repair status --json
```

Describe a reproducible Koder error in a local task, including expected and actual behavior. The native `cli_repair` tool reads source and hashes, proposes changed files and typed JSON cases, tests the original and candidate in separate processes, and activates a passing candidate. Model calls remain inside the current task's budget and cancellation scope. No additional learning model runs are started.

An applied patch takes effect at the **next process start**. It does not replace code in a running task or replay completed operations. End the task normally and reopen Koder. Recovery commands always use publisher code:

```sh
koder self-repair rollback
koder self-repair off
```

Rollback restores publisher behavior at the next start. Off also revokes future repair permission. On macOS/Linux, `KODER_LOCAL_REPAIR=0 koder` bypasses patches for one launch. In PowerShell, set `$env:KODER_LOCAL_REPAIR='0'` before launching and remove it afterward if desired.

## Supported scope

The current allowlist has seven modules: context usage, context suggestions, task-quality guidance, colors, theme, banner and terminal frame. `status` lists their exact paths. Mail protocols, execution loops, permission checks, cancellation, credentials, cost limits, verifiers, update controls and repair controls remain outside the automatic write path.

Koder exposes this tool when the current task identifies a CLI error or requests Koder repair. A missing credential, an upstream outage or incomplete exam input is not a CLI code defect. Workspace-only delivery contracts, read-only modes and remote Gateway/ACP/agentd jobs cannot use this path to change an installation. `--yes` does not enable the native repair grant.

Each task may propose two candidates by default. This is local procedural and code adaptation, not model training or a promise of perfect task scores. Errors outside the allowlist still require a product update.

## Checks and storage

Cases use `argsJson` and `expectedJson` strings so provider adapters preserve JSON types. The checker compares exact JSON values; `1` is not `"1"`. At least one new case must fail against the current code, and every candidate case plus retained regression must pass. A failed check returns bounded actual and expected values. Every changed module needs a case.

Checks run without inherited model keys, cookies, proxy secrets or Node startup hooks. Their Node processes have restricted filesystem reads, no write/child-process/native-addon grants, a timeout and cancellation. [Node permissions are not a hostile-code sandbox](https://nodejs.org/docs/latest-v22.x/api/permissions.html). Activated patches execute with the CLI process's capabilities. The path allowlist limits what this tool replaces; it cannot establish that arbitrary code is harmless. Passing cases are not whole-product acceptance.

The private local state stores an active patch, a predecessor, a candidate and bounded receipts in `~/.koder-cli/self-repair/state.json`, or the configured `KODER_CLI_HOME`. It stores changed files rather than duplicate packages or Skills. Original package bytes and resource paths remain intact. A module loader substitutes verified code at its original URL.

Patches bind to the original source and file hashes. Changed source, an update or corrupted patch falls back to publisher code. An exception that reaches the CLI startup handler quarantines that patch for the next launch without retrying the task. Runtime hangs, crashes and errors caught elsewhere are not all detectable by this handler; use the recovery commands when necessary.

Nothing is automatically uploaded to GitHub, the website or a cloud service. The feature ships in a candidate while the independent release gate remains pending. Physical Windows/Linux and real-account acceptance must be reported separately from local source, fixture and provider tests.

[Detailed Chinese walkthrough](SELF-REPAIR.zh.md) · [Failure learning](AUTONOMOUS-LEARNING.md)
