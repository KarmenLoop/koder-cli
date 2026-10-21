# Built-in autonomous learning

Koder CLI preview.19 includes KARMEN LOOP's `personal-agent-growth` 0.3.2. Its eight released files are pinned and read locally through the existing `skill_read` tool. No separate download is required.

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
