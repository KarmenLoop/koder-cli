# 10. 修到测试通过：fix --check

建议 40 分钟

**目标**：用可重复失败的检查驱动修复，保留失败证据，避免只改测试让它变绿。

**准备**：将cart-lab复制到独立项目；需要可用Node运行示例。没有Node时先学内置教练，不必为了读教程装依赖。

## 手把手操作

1. 先运行 node --test，记录失败用例和实际/期望值。

   **应看到**：这是基线，不删除失败日志；测试应确实触发总价bug。

2. 运行 koder fix "修复总价计算，不删除现有测试" --check "node --test"。

   **应看到**：先看到检查与修复循环；每次修改范围可审阅。

3. 检查实现是否按单价×数量计算；补空数组、0数量与多商品案例。

   **应看到**：测试覆盖需求，不是硬编码某个750结果。

4. 独立再跑一次检查，打开README确认使用说明可执行。

   **应看到**：结束条件是实际检查通过；达到预算仍失败应列出卡点和已有产物。

## 常见问题与恢复

- **fix没有说明缺什么**：补明确任务和--check命令；先单独运行检查确认工具存在。
- **依赖安装失败却一直改代码**：区分环境故障与业务失败；不改测试掩盖缺依赖。

## 作业与自查

保留一次失败、一次修复和一次独立复测，写三句话解释根因、改动、验证。

**自查标准**：根因是漏乘数量；实现修复而非改期望；旧测试和新增边界用例全部通过。

## 开发者教学

1. 性能题先固定输入与测量条件；重构题先固定行为，不能用更换测试输入刷结果。

2. 对长任务阶段性保存可运行文件、测试与下一步，避免超时只剩聊天。

3. 修复次数与耗时记录真实值；没有全量回归不能称全工程全绿。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 10 课 / 共 30 课 · 修到测试通过：fix --check ━━
教练 › fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。
  提示 · 这次我替你一路按 y，省点手指，你只管看它怎么一轮一轮修。
  · 演示：练习场里加了一个检查 count 函数的 check.mjs，Koder 第一次修错、第二次修对，你能看到“第 1/3 次修复”和最后的“检查通过”。
  （小声）它第一次没修对——别笑，你写代码第一次就对过吗？
    koder fix --check "npm test"
        修到测试通过为止
    koder fix "首页按钮点了没反应"
        没有检查命令时，按描述修一次
    npm test 2>&1 | koder fix
        把失败输出直接喂给它
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 10 课 / 共 30 课 · 修到测试通过：fix --check ━━
教练 › fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。
  提示 · 这次我替你一路按 y，省点手指，你只管看它怎么一轮一轮修。
  · 演示：练习场里加了一个检查 count 函数的 check.mjs，Koder 第一次修错、第二次修对，你能看到“第 1/3 次修复”和最后的“检查通过”。
  （小声）它第一次没修对——别笑，你写代码第一次就对过吗？
    koder fix --check "npm test"
        修到测试通过为止
    koder fix "首页按钮点了没反应"
        没有检查命令时，按描述修一次
    npm test 2>&1 | koder fix
        把失败输出直接喂给它
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 10 课 / 共 30 课 · 修到测试通过：fix --check ━━
教练 › fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。
  提示 · 这次我替你一路按 y，省点手指，你只管看它怎么一轮一轮修。
  · 演示：练习场里加了一个检查 count 函数的 check.mjs，Koder 第一次修错、第二次修对，你能看到“第 1/3 次修复”和最后的“检查通过”。
  （小声）它第一次没修对——别笑，你写代码第一次就对过吗？
    koder fix --check "npm test"
        修到测试通过为止
    koder fix "首页按钮点了没反应"
        没有检查命令时，按描述修一次
    npm test 2>&1 | koder fix
        把失败输出直接喂给它
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 10 课 / 共 30 课 · 修到测试通过：fix --check ━━
教练 › fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。
  提示 · 这次我替你一路按 y，省点手指，你只管看它怎么一轮一轮修。
  · 演示：练习场里加了一个检查 count 函数的 check.mjs，Koder 第一次修错、第二次修对，你能看到“第 1/3 次修复”和最后的“检查通过”。
  （小声）它第一次没修对——别笑，你写代码第一次就对过吗？
    koder fix --check "npm test"
        修到测试通过为止
    koder fix "首页按钮点了没反应"
        没有检查命令时，按描述修一次
    npm test 2>&1 | koder fix
        把失败输出直接喂给它
```

</details>
