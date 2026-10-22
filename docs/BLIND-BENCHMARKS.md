# Preserved blind prompts and regression scope

The user supplied these exact prompt strings on October 23, 2026. Historical results refer to preview.22 with MiniMax CN Flash; this task has not rerun that model benchmark or a same-task Cursor comparison. No updated coding/writing score is claimed.

The immutable source fixture is `test/fixtures/blind-benchmark/prompts.json`, with SHA-256 hashes in `prompt-hashes.json`. Missing source materials stay missing. A synthetic replacement is not the original fixture.

| Case | Original prompt | Required material / actual scope |
|---|---|---|
| C01 | 写一个带插件机制的迷你静态站点生成器，支持 Markdown → HTML，并带测试。 | Empty project; actual generator and tests needed for grading |
| C02 | 这个仓库里有 3 个互相关联的 bug，全部修好并保证测试全绿。 | Original multi-file repository missing |
| C03 | 给这个小 monorepo 补集成测试，并修好因此暴露的问题。 | Original A/B monorepo missing |
| C04 | 实现一个带鉴权的待办服务：JWT、SQLite、REST，Docker 一键起，写清 README。 | Full JWT/SQLite/REST/Docker delivery required; local scripted test checks clarification continuation only |
| C05 | 这段代码在大数据下太慢，优化到能在限制时间内跑完，并解释瓶颈。 | Original slow code, dataset and deadline missing |
| C06 | 把这个回调风格的模块改成 async/await，行为不变，补回归测试。 | Original callback module missing |
| C07 | 给 Koder CLI 做个落地页。 | Full design grade needs a real model; scripted replay checks continuation and an actual owned file write |
| W01 | 用中文写 Koder CLI 产品介绍，约 800 字，面向技术决策者。 | Grade audience, factuality and length separately |
| W02 | 写一封早期用户更新邮件：preview.22。 | Intentionally no changelog; unsupported release-increment attribution blocks a writing pass |
| W03 | 把这份技术说明改成普通用户文案，保留事实、去掉行话。 | Original dense explanation missing |
| W04 | 写一份与 Cursor / Codex / Qoder / WorkBuddy 的差异对比（表格 + 各 200 字评述）。 | Current primary evidence required; no invented prices, features or same-task victories |
| W05 | 把上题对比稿压成公众号长文约 1500 字，语气专业但不硬。 | Actual W04 output required; do not manufacture a predecessor |

## Deterministic checks

```sh
node scripts/check-contracts.mjs --list
node scripts/check-contracts.mjs --kernel /authorized/private/koder-desktop
```

Use an existing acceptance workspace with the paired candidate CLI and private kernel or the accepted bundle. The runner installs nothing, removes model credential variables from its test environment, and runs one test worker with the existing 60-second file deadline. It uses scripted providers and owned local endpoints. The test list, prompt hashes and missing material status are inspectable before a run. Temporary fixtures remain at the printed path for diagnosis.

This command can be called by a private CI nightly job after source integration and account approval. No recurring job, paid model request or public workflow was activated in this task. A nightly source-contract pass must not be advertised as blind capability grading or native Windows acceptance.

## Grading requirements

Keep each original prompt unchanged. Record CLI/kernel revision, model ID and protocol, provider region/product, context/output budget, approval mode, workspace, exact source fixture hashes, tool receipts, generated artifacts, test commands and exit codes. Capture elapsed time and API usage without storing keys. For C04, validate JWT rejection/expiry, SQLite persistence, REST behavior and the actual Docker start; a README or a plan is insufficient.

For W02, absent a changelog, require an explicit source/disclosure section and distinguish existing product capabilities from preview.22 changes. Unsupported claims such as “本版新增” or “This release adds” prevent a writing pass; an actual quality reviewer may assign at most 2 on the hallucination dimension under the user's rubric. The lexical gold tests only catch selected forms and do not assign that score themselves.

W01 should address technical decision makers through integration effort, costs, risks and supported deployment boundaries, not slogans. W03 must preserve the supplied facts. W04 needs dated primary sources and an explicit lack of same-task competitor testing. W05 must preserve W04's factual limits while meeting its audience and approximate length. A plausible paragraph or a format match is not evidence of factual correctness.
