# Task-specific harness profiles

Koder selects a small, versioned execution profile inside its existing CLI runtime. This is an incremental implementation inspired by the four-module protocol in [JIT-Agent](https://arxiv.org/abs/2608.25593) and its [official repository](https://github.com/bingreeky/JIT). It does not include their model weights or upstream executable harness code. No benchmark improvement is claimed.

The current task contract defaults to `taskExecution.maxSteps: null`, independently of profile selection. See [task orchestration](TASK-ORCHESTRATION.en.md) ([中文](TASK-ORCHESTRATION.zh.md)) for explicit monetary budgets, dependency-aware Todo plans, pinned Skill retrieval, and the original Core's subagents. This source contract does not establish which installed or published packages contain it.

## Use it

```sh
koder harness list
koder harness status --json
koder run "多源调研某项技术，并给出带出处的结论" --harness deep-research
koder harness use office-graph
koder harness use auto
koder harness off
koder harness on
koder harness archive off
```

In a chat, `/harness deep-research` selects that profile for subsequent turns; `/harness auto` removes the chat override. While a task is running in steer mode, a valid `/harness <id>` directive changes the current unfinished task at the next tool-batch boundary. It retains consumed steps and repair counts. In queue mode, it waits for the existing command dispatcher. `/harness status` shows the chat override. The CLI JSON result includes the actual `harnessProfile`, selection reason, consumed steps, repair records and archive verdict.

Setup → Skills → Task harness controls selection, the default profile, outcome archiving, bounded repair, an optional model-round ceiling, subagents, and missing-Skill/tool discovery. These switches do not grant network, browser, desktop, email, learning or publishing permissions. Turning off all Skills still suppresses their bodies and reads; profiles cannot re-enable them.

## Four modules, one executor

| Module | Integration | Preserved authority |
| --- | --- | --- |
| M: memory | Task-local, extractive `facts-only` projection and evidence/artifact/fact labels; bounded tool excerpts | Full original session history and raw receipts remain in the existing workspace store. No new memory database. |
| P: planning | Short profile instruction in the existing system message; existing coding frameworks supply `frameworkId` | No second planner or scheduler |
| F: capabilities | Fixed group allowlists from `profile.F`, Skill catalog filtering, and a second guard before invocation | Existing tools, Apps/MCP schemas, permissions and approval decisions |
| A: actions | Original loop with the owner's optional task-round ceiling, verification cadence and at most two repairs | Original cancellation, shared cost reservations, usage accounting, pause/resume, UNKNOWN reconciliation and provider/BYOK routing |

Profiles are checked-in JSON resources. IDs come from a fixed registry. Loading does not execute strings, evaluate source or import a user-supplied module. Configuration validates profile IDs and bounded numeric fields. No per-task generated harness code is accepted.

| Profile | Scope |
| --- | --- |
| `default-react` | Original tool set and history strategy; existing coding framework guidance remains available. |
| `deep-research` | Evidence matrix, user constraints and observed tool records; local reads, public research/help and passive browser/desktop observation. No shell, generic application calls, file writes, mail send or publishing. |
| `office-graph` | Dependency planning, artifact references, authorized Apps/MCP, browser/desktop and file delivery tools. Email uses the existing separately confirmed mail path. |
| `bounded-delegate` | Dependency-based work with actual tool-enabled children in the original Core when the subagent port is available and authorized. The root task allows at most 180 unreleased children, shares cost accounting, and enforces write ownership. Missing delegation capability leaves work in the original loop. The profile's four open questions are planning guidance, not a four-child limit. |
| `universal-app` | The existing `builtin:universal-app-use` method, with Apps/MCP → browser → desktop as the profile's channel order. Unknown-workflow learning still respects its independent switch and network permission. |

Research deliberately excludes opaque `app_call` and `computer_act`: those interfaces cannot guarantee a read-only action from their names alone. Use an explicitly selected office/application profile when an authorized task needs those operations. A missing driver, connection or authorization remains a real limitation, not a successful operation.

Selection order is explicit `/harness` or `--harness`, saved `forceProfile`, task cues, then `defaultProfile`. Only automatic selection may consult an authorized, verified experience recommendation. `enabled: false` ignores all overrides and retains baseline ReAct behavior, with no JIT filtering, memory projection, repairs or archive writes. Existing Ask/report mode restrictions still apply to every profile.

```json
{
  "harnessJit": {
    "enabled": true,
    "defaultProfile": "default-react",
    "allowRepair": true,
    "maxRepairs": 2,
    "archiveOnSuccess": true,
    "forceProfile": null
  }
}
```

## Repair and evidence

Two consecutive failed tool results, a protocol/empty-response error, an explicit `HARNESS_STUCK:` blocker, or the existing failed delivery review can request a bounded repair. Repairs tighten verification to every step and remove repeatedly failing tools from the current profile allowlist. They preserve consumed calls, the owner's optional ceiling, and shared monetary accounting; `null` remains unbounded rather than restoring a legacy 16/24-round mode limit. Baseline and before/after profile digests are retained. Delivery review and JIT share the same two-repair allowance. A third repair request stops with `HARNESS_JIT_STOP`, the profile and attempted repairs. Authentication, content filtering and network errors remain with their original diagnostics; they do not trigger profile repair.

Unknown effects, denied authorization and external operations prevent automatic effect retries. Candidate.5 adds a narrow exception for diagnosis: completed shell calls followed by repeated read failures may narrow the existing profile to read-only tools under the original repair and step budgets. Local delivery review retains its existing safe-file/command classifier and may repair an incomplete local artifact under the same approval policy. After an uncertain shell receipt, the current task allows readback only, even with JIT disabled; it cannot run another shell command or switch to a mutating App tool. This restriction also applies inside a tool batch. The unverified CLI result returns exit 3. A fresh user instruction starts a new task under the existing approvals. It does not resubmit mail, publish, replay shell operations or switch channels to bypass a denial. A user may inspect receipts and issue a new instruction through the original interface.

`taskExecution.maxSteps` is an optional model-step ceiling in the existing loop, with a default of `null`. `koder harness steps unlimited` restores that default. `koder harness budget` separately configures a shared root-task monetary budget using owner-supplied prices for each model. Neither setting grants permissions. `verifyEvery` is model guidance to inspect actual results, not a claim that an independent verifier ran. M projection does not rewrite signed provider state, orphan call/result pairs, drop unknown operations, promote assistant claims into facts, or authorize historical commands.

## Archive through the original experience port

The CLI calls the existing Skill maintenance owner only after its local completion checks pass. Observation rows contain a cue hash, profile digest, provider/runtime binding hash, original task receipt and step count. Cost and reward stay `null` when not measured. Raw prompts and credentials are not added to these rows.

A completed task by itself is `NO_ENTRY` with `comparison-required`. A recommendation needs an original Core task binding to a tested candidate, the existing `skill_compare` result choosing that candidate, valid source/context hashes, passing regressions, zero probe side effects, and current owner authorization. Source/runtime/model/profile/context changes or owner revocation invalidate adoption. Existing baseline artifacts and Skill versions remain intact.

The standalone CLI records successful task observations in the existing workspace/session checkpoint. Run `koder harness experiences --json` to inspect profile and input hashes, step counts, measured or owner-priced cost when known, and the explicit `NO_ENTRY: comparison-required` verdict. It retains the latest 512 observations in that conversation; completed tool calls have no 24-step archival ceiling. Archive off, growth off, failed or cancelled tasks do not create a success observation. The original memory commands retain, reset or delete these records with their conversation, and account/epoch checks apply to inspection.

Observation capture does **not** activate a new method. Verified cross-task adoption still requires the original `io.skillMaintenance` owner, paired execution evidence, `skill_compare`, current permissions and CAS. No second database, model self-score, fabricated cost, or background paid probe is introduced. Without those prerequisites the baseline remains selected. A UI switch alone cannot produce a verified winner.

## CLI acceptance checklist

1. Turn JIT off, run a scripted ordinary task, and compare model tool/schema/messages with the pre-JIT path. Existing approval behavior remains unchanged.
2. Run a multi-source research prompt with JSON output. Confirm `deep-research`, the short profile policy, no shell/send/publish tools, and rejection of a requested hidden tool before execution.
3. Run a contact/email task in an isolated Apps fixture. Confirm `office-graph`, original approvals and truthful failure. Do not use real recipients for a fixture check.
4. Use `/harness deep-research` or `--harness deep-research` against a conflicting forced setting. Check explicit precedence. Steer during an in-flight batch and verify that step counts are retained.
5. With an authorized original maintenance port, archive a completed receipt. Without paired evidence expect `NO_ENTRY`; with actual isolated comparison evidence expect a retrievable recommendation. Invalidate runtime/model context and revoke authorization to verify rejection.
6. Turn the feature off in the actual Setup TUI, reopen a session, and verify the unfiltered baseline behavior. Run existing `--yes`, permission, session isolation, cancellation, recovery, Skill and context regressions.

Fixture tests verify orchestration contracts. Native Windows/macOS GUI operation, real-account email, production provider acceptance and quality/cost benchmarks remain separate acceptance tracks.

## 中文使用速记

默认开启、可以关闭。`koder harness off` 完全停用 JIT；Setup → 技能 → 任务 Harness 也可以设置。`/harness deep-research` 选择当前聊天，`--harness deep-research` 选择单次命令。不会另开执行器，不改变模型或电脑权限。

当前默认任务不限模型轮数，`koder harness steps unlimited` 对应 `taskExecution.maxSteps:null`；`koder harness budget` 使用用户提供的逐模型价格设置父子共享金额预算。关闭 JIT 不会关闭金额、取消或 UNKNOWN 保护。Todo 与 Skill 数量不以旧 64 项或四项为总上限，长结果按页查看。具体实操见[任务编排指南](TASK-ORCHESTRATION.zh.md)。

深度调研默认只提供读取与研究能力。办公/应用操作仍按 Apps/MCP → 浏览器 → 桌面调用原工具；不会用时是否查教程由通用应用 Skill 的独立开关决定。找不到驱动或缺少授权时如实提示。

修复最多两次，暂停审批和中途补充不会重置额度。发送、发布、已拒绝或结果未知的操作不会自动重放。独立 CLI 会把成功执行的观察保存在原会话检查点，用 `koder harness experiences --json` 查看；每个会话保留最近 512 条，关闭归档或成长后不再新增。成功观察仍是 `NO_ENTRY: comparison-required`，不直接变成已证实的经验。跨任务采用新方法仍需现有宿主的经验 owner、配对执行、对比结果和当前授权；开关开启不代表已经得到这些证据。
