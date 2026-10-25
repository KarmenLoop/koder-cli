# 08. 只读提问、管道和脚本

建议 35 分钟

**目标**：写出不会误堵标准输入的脚本，并能按退出码判断是否可继续。

**准备**：准备一份不含秘密的report.txt；配置模型后才运行真实ask。管道示例必须使用自己终端的语法。

## 手把手操作

1. 运行 koder ask "解释这个项目，不修改文件"。

   **应看到**：只读回答；有提示词时默认不等待无关stdin。

2. 按本课原有系统示例，把report.txt管道给 koder ask "总结输入" --stdin。

   **应看到**：输入完整结束后才提交；明确--stdin说明你要使用管道内容。

3. 需要写文件时改用 koder run "将摘要保存为summary.md，并读回核对"，先检查批准范围。

   **应看到**：摘要文件实际存在；只读ask不能替代执行。

4. 用本系统的退出码语法查看结果；脚本在非零时停止后续步骤，并保留stderr。

   **应看到**：不会因为stdout有文字就把失败当成功；JSON输出单独解析。

## 常见问题与恢复

- **输入一直不结束**：检查生产者是否关闭管道；--stdin-timeout有上限，超时不把半截输入作为完整任务。
- **--lang en仍有中文**：区分本地界面语言与模型内容；显式说明输出语言并保留本次参数供排查。

## 作业与自查

同一份report.txt分别直接提问、显式管道提问；记录是否使用文件、退出码和耗时。

**自查标准**：直接提示不自动读无关管道；--stdin只接受完整输入；失败时后续发布步骤不运行。

## 开发者教学

1. 用课程附带stdin-producer.mjs模拟延迟EOF，不调用任何付费API即可验证自己的管道夹具。

2. 真实Koder验收用本地模型桩或已授权测试Key，分别测有提示词、无提示词、--stdin、超时、超大输入。

3. 退出码0与结构化内容同时检查；2为用法错误，3可表示内容质量/解析门禁，具体错误码一起保存。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CLI-CONTRACTS.zh.md](../CLI-CONTRACTS.zh.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 8 课 / 共 30 课 · 只读提问、管道和脚本 ━━
教练 › 只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。
  · 动手：随便问一个问题，教练用只读工具读 package.json 后回答；整个过程不需要你批准，因为它什么都改不了。
教练 › 在脚本里，Koder 和其他命令行工具一样顺手：
    git diff | koder ask "总结这次改动"
        管道里的内容会作为附加材料交给 Koder
    Get-Content error.log | koder ask "这个报错是什么意思"
        把一个文件喂给它（PowerShell 里的 cat 就是它）
    koder run --yes --json "修好 lint 报错" | ForEach-Object { ($_ | ConvertFrom-Json).type }
        --json 每行一个事件，PowerShell 自带的 ConvertFrom-Json 就能解析
    $LASTEXITCODE
        看上一条命令的退出码
  提示 · Windows PowerShell 5.1 往管道里送中文会变成问号。先执行一次 $OutputEncoding = [Text.UTF8Encoding]::new() 就好；PowerShell 7 没有这个毛病。
教练 › 退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。
  （小声）退出码 2 的意思是“先检查一下配置”，不是它不努力。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 8 课 / 共 30 课 · 只读提问、管道和脚本 ━━
教练 › 只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。
  · 动手：随便问一个问题，教练用只读工具读 package.json 后回答；整个过程不需要你批准，因为它什么都改不了。
教练 › 在脚本里，Koder 和其他命令行工具一样顺手：
    git diff | koder ask "总结这次改动"
        管道里的内容会作为附加材料交给 Koder
    type error.log | koder ask "这个报错是什么意思"
        把一个文件喂给它
    koder run --yes --json "修好 lint 报错" > events.jsonl
        --json 每行一个事件；CMD 没有自带的 JSON 工具，先存成文件再交给别的程序
    echo %ERRORLEVEL%
        看上一条命令的退出码
  提示 · CMD 只认双引号：koder ask "这是什么" 可以；用单引号的话，引号会被当成问题的一部分。
教练 › 退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。
  （小声）退出码 2 的意思是“先检查一下配置”，不是它不努力。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 8 课 / 共 30 课 · 只读提问、管道和脚本 ━━
教练 › 只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。
  · 动手：随便问一个问题，教练用只读工具读 package.json 后回答；整个过程不需要你批准，因为它什么都改不了。
教练 › 在脚本里，Koder 和其他命令行工具一样顺手：
    git diff | koder ask "总结这次改动"
        管道里的内容会作为附加材料交给 Koder
    cat error.log | koder ask "这个报错是什么意思"
        把一个文件喂给它
    koder run --yes --json "修好 lint 报错" | jq -r .type
        --json 每行一个事件，交给 jq 解析（brew install jq 就能装）
    echo $?
        看上一条命令的退出码
教练 › 退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。
  （小声）退出码 2 的意思是“先检查一下配置”，不是它不努力。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 8 课 / 共 30 课 · 只读提问、管道和脚本 ━━
教练 › 只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。
  · 动手：随便问一个问题，教练用只读工具读 package.json 后回答；整个过程不需要你批准，因为它什么都改不了。
教练 › 在脚本里，Koder 和其他命令行工具一样顺手：
    git diff | koder ask "总结这次改动"
        管道里的内容会作为附加材料交给 Koder
    cat error.log | koder ask "这个报错是什么意思"
        把一个文件喂给它
    koder run --yes --json "修好 lint 报错" | jq -r .type
        --json 每行一个事件，交给 jq 解析（sudo apt install jq 就能装）
    echo $?
        看上一条命令的退出码
教练 › 退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。
  （小声）退出码 2 的意思是“先检查一下配置”，不是它不努力。
```

</details>
