# Built-in learning in Koder CLI

Koder includes the published personal-agent-growth 0.4.3 method and local Markdown task memory. When enabled, the existing Agent loads a bounded selection of the method at task entry, including ordinary tasks that do not mention learning. Research, office and app-use profiles retain this default method. Smaller model windows use a shorter projection. Detailed references remain available through the existing `skill_read` tool.

```sh
koder growth status --json
koder learning status --json
koder growth show
koder learning off
koder learning on
koder growth off
koder growth on
```

Run status commands in the workspace you want to inspect. `growth status` reports method version, pinned source and default-loading mode. `learning status` reports scoped storage without creating it. The first eligible task initializes the library; account, workspace and task-session boundaries remain separate. Existing off choices take precedence. `growth off` disables method loading and pauses local learning. Turning it back on preserves a separate learning opt-out. In chat, `/learning on|off` and `/growth on|off` apply on the next turn while retaining the conversation.

## What runs by default

The native task lifecycle reads the current task pack, records tool observations and checkpoints, and runs local reviews. The model can use `learning_read` and `learning_write` for decisions, progress and candidate experience. Recovery checks the latest context and node against actual artifacts. Missing knowledge calls for bounded research within existing permissions, followed by task-specific verification. Tool failures make the regression-repair reference available in the next method projection.

The model's completion proposal remains `pending_verification`; explicit owner completion requires evidence. Daily and weekly reviews summarize the current account/workspace library; model recall remains task-scoped. Revised Skills continue through the original proposal, test, comparison and adoption ports. Insufficient evidence remains `NO_ENTRY`, not an activated improvement.

## Observable loading and costs

JSON task results expose `growthMethod`: version, source commit, excerpt paths, SHA-256, character offsets and lengths. These fields record the exact source text loaded into the system projection. They do not claim a model read the entire Skill, followed every step, improved quality or completed the task. Actual tool calls, task files and verification results remain separate evidence. The default projection adds prompt content but no additional model requests; ordinary provider charges and the existing task budget still apply.

Method resources do not start a portable Python host, a second SQLite/MCP service, another experience library or extra paid comparison runs. Markdown writes use the existing native transaction layer. Off, temporary or unavailable learning does not fall back to shell-created notes. Profile learning, synchronization, Skill adoption, background wakeups and computer permissions retain their own controls.

The embedded method is pinned to [published v0.4.3](https://github.com/KarmenLoop/personal-agent-growth/releases/tag/v0.4.3), source commit `9d5eed453837a1091c845af898164ae1e0f3cbf2`. Its 61 unmodified files include bilingual references, Markdown templates and portable source, with the original AGPL-3.0-only LICENSE/NOTICE. No private experience seed or personal task evidence is bundled.

Read the [English task-memory guide](MARKDOWN-LEARNING.en.md) and [中文手把手指南](MARKDOWN-LEARNING.zh.md) for storage, recovery, cost records and platform limits.

## 中文说明

自主学习方法已更新为正式发布的 0.4.3。默认任务入口会加载固定来源的短方法，不要求用户先说“学习”。任务开始读取当前任务记忆，重要决定和进度沿原 `learning_read` / `learning_write` 保存；结束保留实际结果、待验证经验和未完成项。研究、办公、应用操作的内置 Profile 也保留此方法，小上下文使用短版。完整方法和修复参考仍通过 `skill_read` 按需读取。

`koder growth status --json` 核对版本与默认模式；任务 JSON 的 `growthMethod` 提供实际加载节选的文件哈希及位置。这是来源加载收据，不冒充模型已经执行或质量已经提升。默认加载会增加少量提示文本，不单独增加模型请求。账号、工作区和会话隔离、取消、费用预算及原有工具权限保持；已有关闭选择优先。

`koder learning off` 单独关本地任务记忆，`koder growth off` 关闭默认方法并暂停学习，均不删除旧文件。升级不会自动打开画像、同步、后台常驻、电脑权限或全局技能采纳，也不会启动资源里的独立 Python 宿主。

## Earlier behavior, retained for reference

The following preview.22 notes describe the earlier method-only integration. Version numbers, controls and resource counts below are historical; use the current instructions above for the current release.

# Historical reference: preview.22 / method 0.3.2

Koder CLI preview.22 includes KARMEN LOOP's `personal-agent-growth` 0.3.2. Its eight released files are pinned and read locally through the existing `skill_read` tool. No separate download is required.

## Use and controls

```sh
koder growth status
koder growth show
koder growth off
koder growth on
```

`status` reports the embedded version, source revision and resources without contacting a model. `show` reads the method. `on` and `off` take effect in the next CLI session, including the next session started by an editor or gateway. They control the task method, independently of preference learning and other optional personal features.

For a relevant request such as “Use self-learning to investigate this repeated failure and verify a revised approach,” Koder recommends matching methods, and the model chooses which to read. The method asks it to retain predictions and actual results, distinguish input/environment/permission/method failures, improve a candidate only when evidence supports it, and check whether the change works in a new case. A simple greeting does not need a learning run.

Task records belong in the current authorized workspace or the location the user names. Resume by reading the same task ID, state revision, evidence and next action. Skill resources are methods, not trusted permission requests. Reading a script does not run it. Original command and file approvals remain in force; `growth on` does not override an explicit denial or grant operating-system access.

## Host requirements and costs

The method uses the already selected model. Model calls within the task may incur the provider's normal charges. This feature does not create a new background service or API budget, collect a global user profile, scan unrelated history, turn on sync, or activate revised Skills automatically. The preference-learning, reflection, evolution and proactive-service switches remain independent and default off.

A future wakeup needs an actually available, separately authorized scheduler. Save the plan, register through that backend, read back its binding and status, and verify a real trigger before calling it operational. This Skill package alone does not add a scheduler to an otherwise unsupported CLI host. When no backend is available, retain the pending action and its recovery condition without claiming a timer exists.

The eight unchanged files retain AGPL-3.0-only, the full license and KARMENLOOP notice. Their source is [the 0.3.2 release](https://github.com/KarmenLoop/personal-agent-growth/releases/tag/v0.3.2).

## 中文使用说明

新版内置 KARMEN LOOP 自研的自主学习 Skill，安装后无需另下技能包。对跨步骤、补课、复盘、反复返工和任务接续等需求，模型可按需读取方法及配套资料；简单问题直接处理。

可以这样下任务：“用自主学习方法检查这个反复出现的错误，保留失败输出，修正后换一组输入验证，并把接续记录写在当前项目。”它的作用是让工作有预测、有实际检查、有依据地改进，而不是多写一份声称通过的总结。

`koder growth status` 查看版本与状态，`show` 阅读方法，`off/on` 关闭或启用下次会话的调用。任务记录像项目里的错题本：保留错在哪里、为什么改、复验怎样，不把你的全部聊天偷偷变成画像。画像学习、同步、后台调度与权限仍由原来的独立开关和授权控制。关闭终端后，不会凭空出现常驻学习进程。

检查记录区分资源读取、工具链运行、真实模型选用和实际定时触发。合成模型的工具链测试可以验证读写、错误返回和接续机制，不能证明所有真实模型都会正确采用这套方法。
