# Built-in learning in Koder CLI 0.5.5

Koder includes personal-agent-growth 0.4.1 guidance and default local Markdown task memory. The existing Agent reads relevant task notes, performs the requested work, records decisions and checkpoints, and reviews local evidence. No separate runtime or extra paid comparison run is started by this default.

```sh
koder growth status --json
koder learning status --json
koder learning off
koder learning on
```

Run these commands in the workspace you want to inspect. `learning status` reports its scoped library without creating one. The first eligible task initializes the library; account, workspace and default task-session boundaries remain separate. Existing off choices take precedence. `growth off` also pauses the local integration; turning growth back on does not erase a separate learning opt-out. In chat, `/learning on|off` and `/growth on|off` apply on the next turn while retaining the conversation.

The model's completion proposal remains `pending_verification`. Explicit owner completion requires evidence. Daily and weekly reviews summarize the current account/workspace library; model recall remains task-scoped. Reviews use local records and no extra model call. A closed CLI does not acquire a new wake service from this feature. Profile learning, synchronization, skill adoption and computer permissions retain their separate controls.

The embedded method is pinned to the immutable local delivery snapshot `delivery:0.4.1-bundle.1`; this is not an upstream Git release tag. Its ten core files retain AGPL-3.0-only and the original LICENSE/NOTICE. Source records are included with the package. No private experience seed or personal task evidence is bundled.

Read the current [English task-memory guide](MARKDOWN-LEARNING.en.md), [中文手把手指南](MARKDOWN-LEARNING.zh.md) and [0.5.5 release notes](RELEASE-0.5.5.md) for setup, recovery, cost records and platform limits.

## 中文说明

0.5.5 默认把任务进度、决策和经验候选保存到本地 Markdown；已有关闭选择继续生效。使用原 Agent 与权限模型，按账号、工作区、任务隔离。会话中 `/learning off` 暂停学习，关闭不会删除文件。日周复盘汇总当前账号与工作区库，模型召回仍限当前任务；不额外调用模型，也不代开画像、同步、后台常驻或全局技能采纳。

## Earlier behavior, retained for reference

The following preview.22 notes describe the earlier method-only integration. Version numbers, controls and resource counts below are historical; use the current instructions above for 0.5.5.

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
