# Incremental harness improvement

This beta adds contrast-based improvement to the existing Koder execution chain. It does not replace the executor, provider routing, approvals, memory, Skills, plugins or task recovery. The pinned personal-agent-growth 0.3.2 package and its eight original resources remain intact. `koder growth status --json` reports the additive adapter separately.

## In a normal CLI task

Ask, for example: “Use Harness2 to improve this method incrementally. Keep its complete original content, compare an additive candidate, and retain the original artifact.” Koder recommends its existing growth method and makes `harness_probe` available for relevant tasks. A simple unrelated request does not receive that tool. `koder growth off` disables this new probe along with the method; it does not erase old records.

1. Read the current method and task evidence with the existing file tools. Choose INV for working-method changes or DOM for domain knowledge. Keep the original file.
2. Call `harness_probe` with `action: "snapshot"` and the baseline's workspace-relative path. Its response contains the actual baseline hash, task-input hash and a manifest template.
3. Fill the template with the actual cue, proposed lesson, additive candidate path and deterministic checks. Use the ordinary `write_file` approval to save the candidate and manifest.
4. Call `harness_probe` with `action: "probe"` and the manifest path. It reads the actual UTF-8 files within the authorized workspace, checks the saved hashes and compares the same declared checks. The original method must remain the prefix of the additive instruction candidate.
5. Read the evidence. Both the candidate and original baseline remain selectable. A worse, incomplete or unchanged candidate leaves the baseline selected. Adopting task files uses ordinary file-change approval.

Supported declared checks are `contains`, `excludes` and `json`, with at most 32 checks and 1 MiB per text file. No arbitrary expression or script is evaluated. The tool makes zero model calls and performs no writes, network requests or business operations. Changing the task or baseline invalidates the saved plan. Structural checks alone return `NO_ENTRY`; they do not establish overall method quality or task-level causality.

## Verified adoption through the original Core

Hosts that already supply `skillMaintenance` can use `skill_propose`, `skill_test`, `skill_compare`, `skill_activate`, `skill_rollback` and `skill_experiences`. The CLI now forwards this existing trusted port. It does not invent an evaluator or an authorization service when the port is absent.

An enhanced proposal includes a `contrast` object with `kind: INV | DOM | COMPOSE`, `cue`, `lesson`, and, for composition, tested parent IDs. Parent bodies and actual test receipts are supplied to the existing method-extraction port. Existing instructions are retained in the candidate. Composition is a proposal and still needs its own replay.

The original registry binds task input, baseline artifact, previous experience, model settings and runtime SHA-256 fingerprints, plus the original budget. The original replay port must explicitly provide isolated replay, accept cancellation and the budget, and return actual artifact identities, verifier identity, quality/cost/time observations, passing regressions, zero side effects and confirmed cleanup. Ordinary tasks do not automatically run four times. No fixed extra model, API account or provider is introduced.

Only a verified improvement inside the original budget can be selected for adoption. Confounded, unchanged or worse results produce `NO_ENTRY` and preserve the baseline. Activation and rollback continue through the original owner authorization and version CAS. Context changes invalidate cached results; a stale enhanced version cannot bypass this check through rollback. The original encrypted Skills bag and exclusive writer retain versions and conditional experience; no second memory database is created.

These ports are a trusted host boundary, not a promise that every CLI installation has a real isolated model evaluator configured. Artifact checks, scripted Agent integration, a real-model evaluation, native Windows acceptance and release approval are separate evidence levels.

## Research and retained limits

The mechanism was informed by [Google Research Harness²](https://github.com/google-research/harness2/tree/1cfe254e8d25b15f37048c3730134686abe60335) and its [paper](https://arxiv.org/html/2610.14224v1). The fixed upstream uses Apache-2.0. This implementation does not vendor or execute its experiment launcher or import its sandbox/network flags. Unlike the paper's final composed-artifact pool, Koder's comparison retains the original baseline artifact as a fallback. No published benchmark improvement is claimed for this beta.

## 中文使用

对 Koder 说：“用 Harness2 增量改进这份工作方法，保留全部原文，先固定基线，再比较候选。”它可沿原文件工具写入候选，再用 `harness_probe` 读实际文件核验。INV 改方法，DOM 补知识，COMPOSE 要依据父候选的真实回执。工件检查与整体任务质量分开；证据不足保留 `NO_ENTRY`。全局采用仍需要原 Core 的隔离回放、预算、取消、权限和版本接口，不会自动放开权限或重放发送、提交、发布。
