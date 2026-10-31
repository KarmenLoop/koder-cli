# Local code repair (0.5.20)

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

In 0.6.2, candidate checks and activated feature functions run in a QuickJS-WASM interpreter. Node never imports or evaluates generated module text. Functions accept synchronous JSON arguments and results; no host filesystem, network, process, credential or kernel bindings are provided. The interpreter has a 32 MiB heap limit, a one-second call deadline and 256 KB input/output limits. Display bridges pass only display configuration. The interpreter loads only for an active patch. Checks also require all supported function exports to remain present. Passing checks do not establish whole-product acceptance.

The private local state stores an active patch, a predecessor, a candidate and bounded receipts in `~/.koder-cli/self-repair/state.json`, or the configured `KODER_CLI_HOME`. It stores changed files rather than duplicate packages or Skills. Original package bytes and resource paths remain intact. A publisher-written bridge routes supported functions into the interpreter; other exports remain publisher code.

Patches bind to the original source and file hashes. Source changes, upgrades and invalid patches fall back to publisher code. Runtime loops, memory exhaustion, invalid imports/exports and output limits quarantine the patch and fall back to the original function without replaying the task. Runtime reason codes are preserved separately from CLI_REPAIR_START_FAILED. Host crashes still require recovery; this is not an unconditional self-healing guarantee.

Nothing is automatically uploaded to GitHub, the website or a cloud service. The feature ships in 0.5.20 with explicit opt-in. The original ten-question acceptance target remains unmet and is not represented as a passing score. Physical Windows/Linux and real-account acceptance must be reported separately from local source, fixture and provider tests.

[Detailed Chinese walkthrough](SELF-REPAIR.zh.md) · [Failure learning](AUTONOMOUS-LEARNING.md)

Use of the official built-in repair workflow is covered by [limited local-repair permission](../LOCAL-REPAIR-PERMISSION.md); general proprietary-code modification and redistribution rights are not granted.
