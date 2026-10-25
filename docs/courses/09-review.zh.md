# 09. 代码审查：带着上下文挑毛病

建议 35 分钟

**目标**：得到带位置、影响和复现方式的审查结果，并防止JSON解析失败假通过。

**准备**：在自己的测试仓库准备一处可解释的变更；没有Git仓库或没有变更时先明确审查范围。

## 手把手操作

1. 先用 git diff 查看本次变更，再运行 koder review。

   **应看到**：审查对应真实差异；每个问题应包含位置、触发条件、影响和建议。

2. 挑一项自己复现，确认能触发，再要求最小修复。

   **应看到**：不因模型提出问题就全盘改动；无法复现的标为待核对。

3. 需要机器处理时运行 koder review --format json，保存stdout、stderr和退出码。

   **应看到**：可解析、parsed状态与退出码均符合本版契约；空仓错误不能按0通过。

4. 修复后复跑原测试并再次审查相关差异。

   **应看到**：原问题关闭有证据，未修项列出原因；审查不等于自动部署。

## 常见问题与恢复

- **REVIEW_UNPARSED**：保留原输出，按失败处理；不要手填parsed=true。
- **建议与当前文件不符**：核对分支、工作区和未提交变更；重新限定范围。

## 作业与自查

给购物车修复做一次审查：至少一条真实问题或明确无可证问题的结论，附测试依据。

**自查标准**：不凑数量；存在问题时能定位并复现。解析失败或模型错误不得写“审查通过”。

## 开发者教学

1. 把review作为数据接口：校验JSON结构、退出码与parsed，不只搜索“通过”。

2. 负例覆盖解释性散文、空结果、部分JSON与服务错误；保持REVIEW_UNPARSED非零。

3. CI在只读令牌和受限工作区里运行；评论或推送是独立授权动作。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 9 课 / 共 30 课 · 代码审查：带着上下文挑毛病 ━━
教练 › review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。
  · 演示：教练在练习场里加了一个会算出小数分的打折函数，然后真的跑一遍审查流程，输出带级别、文件、行号和建议的结果。
教练 › 每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：
    koder review
        审查未提交的改动；没有的话审查当前分支
    koder review --base main
        和 main 分支比
    koder review --format markdown --out review.md
        生成可以贴进 PR 的评论
    koder review --fail-on high
        有高级别问题就返回 1，适合放进 CI
    koder review --fix --check "npm test"
        审查、修复、再跑测试，一条龙
  · 可以选择让 Koder 按审查结果修复，照样先看差异、再输入 y。
  （小声）被 Koder 挑出毛病不丢人，被线上用户挑出来才丢人。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 9 课 / 共 30 课 · 代码审查：带着上下文挑毛病 ━━
教练 › review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。
  · 演示：教练在练习场里加了一个会算出小数分的打折函数，然后真的跑一遍审查流程，输出带级别、文件、行号和建议的结果。
教练 › 每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：
    koder review
        审查未提交的改动；没有的话审查当前分支
    koder review --base main
        和 main 分支比
    koder review --format markdown --out review.md
        生成可以贴进 PR 的评论
    koder review --fail-on high
        有高级别问题就返回 1，适合放进 CI
    koder review --fix --check "npm test"
        审查、修复、再跑测试，一条龙
  · 可以选择让 Koder 按审查结果修复，照样先看差异、再输入 y。
  （小声）被 Koder 挑出毛病不丢人，被线上用户挑出来才丢人。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 9 课 / 共 30 课 · 代码审查：带着上下文挑毛病 ━━
教练 › review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。
  · 演示：教练在练习场里加了一个会算出小数分的打折函数，然后真的跑一遍审查流程，输出带级别、文件、行号和建议的结果。
教练 › 每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：
    koder review
        审查未提交的改动；没有的话审查当前分支
    koder review --base main
        和 main 分支比
    koder review --format markdown --out review.md
        生成可以贴进 PR 的评论
    koder review --fail-on high
        有高级别问题就返回 1，适合放进 CI
    koder review --fix --check "npm test"
        审查、修复、再跑测试，一条龙
  · 可以选择让 Koder 按审查结果修复，照样先看差异、再输入 y。
  （小声）被 Koder 挑出毛病不丢人，被线上用户挑出来才丢人。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 9 课 / 共 30 课 · 代码审查：带着上下文挑毛病 ━━
教练 › review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。
  · 演示：教练在练习场里加了一个会算出小数分的打折函数，然后真的跑一遍审查流程，输出带级别、文件、行号和建议的结果。
教练 › 每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：
    koder review
        审查未提交的改动；没有的话审查当前分支
    koder review --base main
        和 main 分支比
    koder review --format markdown --out review.md
        生成可以贴进 PR 的评论
    koder review --fail-on high
        有高级别问题就返回 1，适合放进 CI
    koder review --fix --check "npm test"
        审查、修复、再跑测试，一条龙
  · 可以选择让 Koder 按审查结果修复，照样先看差异、再输入 y。
  （小声）被 Koder 挑出毛病不丢人，被线上用户挑出来才丢人。
```

</details>
