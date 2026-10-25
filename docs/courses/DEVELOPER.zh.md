# Koder 180课 · 开发者教学整册

[课堂](index.zh.html) · [目录](README.zh.md) · [实验手册](../tutorial-labs/academy-labs.md)

保留原基础课程，新增150课中文专题。阅读和示例不会自动执行外部操作。

# 001 · 开场：欢迎来到 Koder 训练营

单元1 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-1) · [总纲](README.zh.md)

## 学习目标

分清系统终端、Koder 对话与练习场；完成第一次离线练习，并知道作品放在哪里。

## 原理讲解

嗨，我是 Koder 教练。完整课堂共180课。前30课保留内置练习场，后150课是分单元讲解与自行实操；阅读不会自动连接账号或发布。
内置教练演示不用配置模型、不调用付费 API：替你干活的是我这个“教练模型”，台词提前写好了，演技有限，请多包涵。但改文件、跑命令都是真的，走的就是 Koder 平时用的那套内核。

## 准备

准备一个可复制粘贴的终端。先阅读安装说明；已经装好则不必重装。练习场是临时目录，毕业时选择保留才会留下文件。扩展作业使用自己的独立目录，不放在安装目录。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第1课 · 开场：欢迎来到 Koder 训练营 ━━
教练 › 嗨，我是 Koder 教练。完整课堂共180课。前30课保留内置练习场，后150课是分单元讲解与自行实操；阅读不会自动连接账号或发布。
  · 教程会在系统临时目录里生成一个练习场：一个故意留了 bug 的小购物车项目，下课自动删除。
  · 第一课会识别你用的是 PowerShell、CMD、macOS 还是 Linux，后面的命令都按它来写；也可以输入数字换成别的系统。
教练 › 内置教练演示不用配置模型、不调用付费 API：替你干活的是我这个“教练模型”，台词提前写好了，演技有限，请多包涵。但改文件、跑命令都是真的，走的就是 Koder 平时用的那套内核。
  提示 · 操作方式：回车 = 下一步；b = 回上一课；q = 随时退出（进度会记住）；输入数字 = 跳到那一课。
  提示 · 复制粘贴：Windows Terminal 里选中文字按 Ctrl+C 复制、Ctrl+V 粘贴（没选中文字时 Ctrl+C 是“取消”）；老式的黑框控制台点鼠标右键就是粘贴。
  提示 · 嫌命令难记？随时输入 koder setup（对话里输入 /setup），用方向键或者鼠标点一点，语言、模型、配色就全配好了。
  （小声）别紧张，这里没有考试，只有彩蛋。
```

四项都能从实际输出查到；learn 的脚本教练离线，普通 ask/run 使用配置的模型。临时练习目录不能当持久交付。

## 开发者教学

建立验收记录：命令、版本、工作目录、退出码、产物路径。
先跑本课程附带的 cart-lab 的 node --test，确认测试发现故意植入的问题；再让 Koder 修复并比较差异。
验收须同时有失败基线、修后测试和文件内容；不要把“模型说修好了”当证据。
教学材料、示例代码与真实账号验收分开记录。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一张学习记录：版本、终端类型、正式项目路径、教程临时路径。说明哪些步骤离线，哪些步骤需要自己的模型。

四项都能从实际输出查到；learn 的脚本教练离线，普通 ask/run 使用配置的模型。临时练习目录不能当持久交付。

## 自测

完成「开场：欢迎来到 Koder 训练营」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 四项都能从实际输出查到；learn 的脚本教练离线，普通 ask/run 使用配置的模型。临时练习目录不能当持久交付。

<details><summary>答案与解析</summary>

C。四项都能从实际输出查到；learn 的脚本教练离线，普通 ask/run 使用配置的模型。临时练习目录不能当持久交付。

</details>

## 延伸阅读

- [INSTALLATION.md](../INSTALLATION.md)
- [START-HERE.zh.md](../START-HERE.zh.md)
- [START-HERE.en.md](../START-HERE.en.md)

---

# 002 · 认识开屏和提示符

单元1 · 建议20分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-2) · [总纲](README.zh.md)

## 学习目标

认清当前目录、模型与模式，并能在同一窗口找到帮助，不把提示符当任务结果。

## 原理讲解

左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
开屏下面是提示符，它会告诉你现在的状态：

## 准备

先完成第1课；把窗口放宽到至少80列。准备一条无敏感内容的任务。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第2课 · 认识开屏和提示符 ━━
  · （这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）
教练 › 左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。
  提示 · 框线和折光体乱成一团？多半是老式控制台的中文字体把方块字画成了两格宽。Koder 会自动换成纯字符画，也可以在 koder setup 里把「开屏样式」改成纯字符。最好的办法是换 Windows Terminal：Windows 11 自带，Windows 10 可以在 Microsoft Store 免费装。
    $env:KODER_ASCII = "1"; koder
        只在这个窗口里强制纯字符开屏
教练 › 开屏下面是提示符，它会告诉你现在的状态：
    koder ›
        在这里直接输入任务，比如：把 README 里的错别字改掉
    koder[code] ›
        方括号里是当前模式
    koder! ›
        感叹号表示自动确认开着，要格外小心
教练 › 提示符显示 koder[plan]! › ，下面哪个说法对？
    1. 计划模式，而且自动确认开着
    2. 计划模式，刚刚出错了
    3. 代码模式，感叹号是因为它很兴奋
  答案：1。满分。方括号是模式，感叹号是自动确认。
```

能指出配置与真实执行的区别；草稿取消后没有新增模型任务，也没有文件改动。

## 开发者教学

把输入行为看作事件：选择、填草稿、提交、取消必须分开。
在80×24与窄终端各检查一次菜单；窄终端降级可读，不应输出半截控制序列。
对非TTY/JSON调用，检查输出没有开屏动画和交互菜单；用两个独立项目验证会话边界。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

截取不含密钥的开屏，标出版本、工作目录、模型与模式；用菜单填一条草稿后取消，不发送。

能指出配置与真实执行的区别；草稿取消后没有新增模型任务，也没有文件改动。

## 自测

提示符显示 koder[plan]! › ，下面哪个说法对？

A. 计划模式，而且自动确认开着

B. 计划模式，刚刚出错了

C. 代码模式，感叹号是因为它很兴奋

<details><summary>答案与解析</summary>

A。满分。方括号是模式，感叹号是自动确认。

</details>

## 延伸阅读

- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)
- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)

---

# 003 · 配置模型：给 Koder 装上大脑

单元1 · 建议35分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-3) · [总纲](README.zh.md)

## 学习目标

使用自己账号支持的服务、协议和型号建立连接，分别验证文本与工具续答。

## 原理讲解

Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：
喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：
今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。

## 准备

准备服务商控制台里的产品类型、模型ID和官方Base URL。密钥只在专用输入框或秘密管理器里提供，不贴到聊天。真实诊断可能收费。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第3课 · 配置模型：给 Koder 装上大脑 ━━
  提示 · 模型页现在会自动获取当前账号的最新型号；进入‘当前账号最新型号’选择后才保存。列表不是通行证，工具能力仍请运行 koder model test --tools。自动获取可关闭，也可用 koder model refresh 手动刷新。
教练 › Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：
    koder setup
        方向键或鼠标选服务商、选型号，再把密钥粘进去；还能一键打开拿密钥的网页
教练 › 喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：
    setx OPENAI_API_KEY "sk-你的密钥"
        永久存进你的账户，之后新开的窗口才读得到
    $env:OPENAI_API_KEY = "sk-你的密钥"
        只在当前窗口有效，关掉就没了
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        用预设，配置里只记变量名
    koder model set --preset local --model qwen3:8b
        用本机 Ollama，不需要密钥
    $env:KODER_MODEL = "gpt-6.1-sol"; $env:KODER_BASE_URL = "https://api.openai.com/v1"; $env:KODER_API_KEY = "sk-…"; koder review
        在 CI 里直接用环境变量
  提示 · koder model presets 能查看当前可用预设；koder model show 看当前配置，密钥只露最后四位。
  （小声）把密钥直接敲进命令要小心：PowerShell 会把敲过的每条命令存进 PSReadLine 的历史文件，记性比你前任还好。所以最推荐在 koder setup 里粘贴——屏幕上只显示末四位，也不进命令历史，但会明文保存在本机配置。环境变量命令也可能进入历史，不要分享含密钥的记录。
教练 › 今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。
  · 可以现场运行 koder model presets 看全部预设。
```

每项都有配置或实际输出依据。没有执行的测试写 NOT_RUN；不能用“应该支持”补通过。

## 开发者教学

CI优先用 --key-env VARIABLE_NAME 引用秘密变量，不把Key值写入参数。
分别准备成功、401、429、5xx、内容过滤与工具协议错误的本地桩；断言错误分类和脱敏信息。
model test 是短诊断，不照搬长任务重试预算；真实请求和桩测试分别记账。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

填写一张不含密钥的连接卡：预设ID、模型ID、协议、Base URL、文本测试、工具测试、费用来源。

每项都有配置或实际输出依据。没有执行的测试写 NOT_RUN；不能用“应该支持”补通过。

## 自测

完成「配置模型：给 Koder 装上大脑」时，哪种做法符合本课验收？

A. 每项都有配置或实际输出依据。没有执行的测试写 NOT_RUN；不能用“应该支持”补通过。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。每项都有配置或实际输出依据。没有执行的测试写 NOT_RUN；不能用“应该支持”补通过。

</details>

## 延伸阅读

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)
- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)

---

# 004 · 第一个任务：看懂差异，决定写不写

单元1 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-4) · [总纲](README.zh.md)

## 学习目标

把一句模糊要求改成可验证交付；看清每一处差异，拒绝或批准后核实磁盘。

## 原理讲解

练习场里的 cart.mjs 算总价时忘了乘数量，测试一直挂着。我们让 Koder 来修。
默认交互模式下，Koder 改文件之前先给你看差异：以 - 开头的红色行会被删掉，以 + 开头的绿色行会加进来。本课需要输入 y 才写入，输入别的就作罢；开启 --yes 会自动批准普通修改。
练习场采用逐项确认，让你看清每一步。实际使用默认智能判断：低风险命令与普通项目修改自动运行；敏感操作可选择始终允许。/permissions execution status 查看，ask 切回逐项确认，reset 撤销全部设置。

## 准备

用教程购物车或附带cart-lab，不直接拿重要工程练手。自建项目先记录未提交改动，别覆盖原有工作。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第4课 · 第一个任务：看懂差异，决定写不写 ━━
教练 › 练习场里的 cart.mjs 算总价时忘了乘数量，测试一直挂着。我们让 Koder 来修。
教练 › 默认交互模式下，Koder 改文件之前先给你看差异：以 - 开头的红色行会被删掉，以 + 开头的绿色行会加进来。本课需要输入 y 才写入，输入别的就作罢；开启 --yes 会自动批准普通修改。
  （小声）看差异就像看体检报告：绿色是新长的肌肉，红色是减掉的赘肉，确认没切错地方再签字。
  提示 · 等会儿 Koder 问“接受这个修改？”时，建议先输入 n 拒绝一次，体验一下反悔的快乐；它会再提一次，那时再输入 y。
  · 动手：输入任务，教练模型提出修改；先输入 n 拒绝一次，再输入 y 接受，然后亲眼看到文件被改。
教练 › 练习场采用逐项确认，让你看清每一步。实际使用默认智能判断：低风险命令与普通项目修改自动运行；敏感操作可选择始终允许。/permissions execution status 查看，ask 切回逐项确认，reset 撤销全部设置。
```

空数组为0，200分×3件加150分×1件为750分，0件贡献0；保留已有测试。

## 开发者教学

把用户需求拆成输入、输出、边界值与不变量。优先写能抓住真实bug的测试，而不是复制实现。
用git diff --check检查空白问题、git diff核范围；测试成功也要检查有没有偷偷删除断言。
交付记录包含工作区、文件、测试命令和退出码；模型最终文字不能代替文件。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为cart-lab加一个数量为0的用例，再修复实现；提交修前失败、修后通过和最终差异。

空数组为0，200分×3件加150分×1件为750分，0件贡献0；保留已有测试。

## 自测

完成「第一个任务：看懂差异，决定写不写」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 空数组为0，200分×3件加150分×1件为750分，0件贡献0；保留已有测试。

<details><summary>答案与解析</summary>

C。空数组为0，200分×3件加150分×1件为750分，0件贡献0；保留已有测试。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 005 · 命令确认：跑测试，也拦下可疑命令

单元1 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-5) · [总纲](README.zh.md)

## 学习目标

区分普通检查、敏感操作和系统权限；会拒绝危险命令，也会处理长任务。

## 原理讲解

改完代码当然要跑测试。运行项目代码属于敏感操作，默认先询问；node --version 这类低风险检查会自动执行。
命令的输出会原样交回给模型，它看得到测试结果，再决定下一步。

## 准备

只使用一次性练习目录。阅读命令时同时看工作路径、目标地址、输入输出文件，不能只看命令开头。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第5课 · 命令确认：跑测试，也拦下可疑命令 ━━
教练 › 改完代码当然要跑测试。运行项目代码属于敏感操作，默认先询问；node --version 这类低风险检查会自动执行。
  提示 · 判断标准：看得懂、只影响当前项目、能撤销，就放行。Remove-Item -Recurse -Force、rd /s /q、del /s /q、irm … | iex、git push --force 这类命令要先确认来源与具体影响；来路不明的脚本直接拒绝。官方安装器也应先核对地址、许可和校验信息。
  提示 · 在 Windows 上，Koder 替你跑的命令交给 CMD 执行，不是 PowerShell。要用 PowerShell 的写法，就写成 powershell -NoProfile -Command "…"。
  （小声）命令确认这一步，请拿出你核对外卖账单的认真劲儿。
  · 动手：教练先请求运行 node test.mjs（可以允许），再请求一条 irm … | iex（必须拒绝；就算你误点了 y，教练也会拦下）。
教练 › 命令的输出会原样交回给模型，它看得到测试结果，再决定下一步。
```

读取不等于删除授权；删目录需明确对象与必要授权；发信须最终内容确认与提交回执。

## 开发者教学

用本地合成文件验证 allow/deny/cancel 三条路径。拒绝和取消不得执行未批准的写入。
区分工具超时、任务预算和服务商诊断超时；不能统一无限延长。
结果未知按UNKNOWN保留，重试前对账；shell输出文字不能自行升级为外部成功回执。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

给三条操作分类：读取README、删目录、发邮件。写出各自目标、权限、确认与结果证据。

读取不等于删除授权；删目录需明确对象与必要授权；发信须最终内容确认与提交回执。

## 自测

完成「命令确认：跑测试，也拦下可疑命令」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 读取不等于删除授权；删目录需明确对象与必要授权；发信须最终内容确认与提交回执。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。读取不等于删除授权；删目录需明确对象与必要授权；发信须最终内容确认与提交回执。

</details>

## 延伸阅读

- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

---

# 006 · 做选择：Koder 也会问你

单元1 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-6) · [总纲](README.zh.md)

## 学习目标

用可评价的选项推进任务，并能区分草稿选择、操作确认和真正交付。

## 原理讲解

遇到必须由你拍板的事，Koder 会停下来出一道选择题。输入选项前面的数字，回车确认；直接回车就是取消这一轮。

## 准备

准备一份简短网站需求：受众、目标、内容、风格和限制。不提供密码或真实客户名单。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第6课 · 做选择：Koder 也会问你 ━━
教练 › 遇到必须由你拍板的事，Koder 会停下来出一道选择题。输入选项前面的数字，回车确认；直接回车就是取消这一轮。
  （小声）千万别回答“都行”。“都行”是世界上最难做的菜。
  · 动手：教练问要不要加服务费，给出三个选项，输入序号回答；直接回车会取消这一轮。
```

意见能直接对应页面区域；验收可观察，例如手机端无横向溢出、按钮打开指定表单。

## 开发者教学

把选择题结果作为任务输入，不当作操作授权。
给无头任务设置可接受默认值，并独立测试审批缺失分支。
预览交件记录URL、文件、启动/停止方式和未连接服务；评价图示不能替代可运行文件。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一条少于150字的三案需求；给一案3条具体修改意见与2项验收标准。

意见能直接对应页面区域；验收可观察，例如手机端无横向溢出、按钮打开指定表单。

## 自测

完成「做选择：Koder 也会问你」时，哪种做法符合本课验收？

A. 意见能直接对应页面区域；验收可观察，例如手机端无横向溢出、按钮打开指定表单。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。意见能直接对应页面区域；验收可观察，例如手机端无横向溢出、按钮打开指定表单。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 007 · 斜杠命令：换挡、刹车和后悔药

单元1 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-7) · [总纲](README.zh.md)

## 学习目标

在任务中途补充、打断或排队；用斜杠菜单填草稿而不是误发送。

## 原理讲解

Skill 就像工作说明书：Codex、Cursor、WorkBuddy 的 SKILL.md 和资料可以按需读取，脚本仍走 Koder 原审批。先用 /skills list 找到它，用 /skill 名称 选中，/skill clear 取消。清单不是魔法通行证：需要专用工具时仍要先配置。
对话里以 / 开头的是斜杠命令，用来调 Koder 自己，不会发给模型。

## 准备

进入交互koder；选择能持续几秒的无副作用任务。非TTY/JSON没有同等交互菜单要求。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第7课 · 斜杠命令：换挡、刹车和后悔药 ━━
教练 › Skill 就像工作说明书：Codex、Cursor、WorkBuddy 的 SKILL.md 和资料可以按需读取，脚本仍走 Koder 原审批。先用 /skills list 找到它，用 /skill 名称 选中，/skill clear 取消。清单不是魔法通行证：需要专用工具时仍要先配置。
教练 › 对话里以 / 开头的是斜杠命令，用来调 Koder 自己，不会发给模型。
    /mode plan
        计划模式：只读，只出方案，适合动手前先想清楚
    /mode code
        代码模式：先说计划，再动手
    /yes
        自动确认开关，提示符会多一个 !
    /new
        开一段新会话，之前的对话清空
    /lang en
        切到英文，/lang zh 切回中文
    /review  /fix  /test  /scan
        在对话里直接用这些命令
    /help  /learn  /exit
        看命令、回到教程、退出（Ctrl+D 也行）
  动手 · 输入 /mode plan 切到计划模式  →  /mode plan
  动手 · 再输入 /yes 打开自动确认  →  /yes
  动手 · 好，再输入一次 /yes 把它关掉  →  /yes
  提示 · Windows 上习惯按 Ctrl+Z 退出？在 Koder 里它不管用，用 /exit 或者 Ctrl+D。
教练 › Koder 正在跑一个你后悔的命令，最快的办法是？
    1. 按 Ctrl+C 取消这一轮
    2. 拔掉网线
    3. 对着屏幕大喊住手
  答案：1。对。Ctrl+C 是急刹车，Ctrl+D 是礼貌地道别。
```

引导进入当前任务或明确报回退原因；FIFO顺序正确；取消不重放已完成工具；菜单未自动发送。

## 开发者教学

同时覆盖本地会话与agentd连接失败分支；未activate时本地输入仍可用。
检查后续模型请求或transcript含steer标记；不能只断言提示文字出现。
用审批窗口测试预排队内容不能批准动作；Esc/Ctrl+C不遗留悬挂输入监听。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

记录一次引导、两条排队、一次取消和一次菜单草稿；不执行任何外部写入。

引导进入当前任务或明确报回退原因；FIFO顺序正确；取消不重放已完成工具；菜单未自动发送。

## 自测

Koder 正在跑一个你后悔的命令，最快的办法是？

A. 按 Ctrl+C 取消这一轮

B. 拔掉网线

C. 对着屏幕大喊住手

<details><summary>答案与解析</summary>

A。对。Ctrl+C 是急刹车，Ctrl+D 是礼貌地道别。

</details>

## 延伸阅读

- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)
- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)

---

# 008 · 只读提问、管道和脚本

单元1 · 建议35分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-8) · [总纲](README.zh.md)

## 学习目标

写出不会误堵标准输入的脚本，并能按退出码判断是否可继续。

## 原理讲解

只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。
在脚本里，Koder 和其他命令行工具一样顺手：
退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。

## 准备

准备一份不含秘密的report.txt；配置模型后才运行真实ask。管道示例必须使用自己终端的语法。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第8课 · 只读提问、管道和脚本 ━━
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

直接提示不自动读无关管道；--stdin只接受完整输入；失败时后续发布步骤不运行。

## 开发者教学

用课程附带stdin-producer.mjs模拟延迟EOF，不调用任何付费API即可验证自己的管道夹具。
真实Koder验收用本地模型桩或已授权测试Key，分别测有提示词、无提示词、--stdin、超时、超大输入。
退出码0与结构化内容同时检查；2为用法错误，3可表示内容质量/解析门禁，具体错误码一起保存。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

同一份report.txt分别直接提问、显式管道提问；记录是否使用文件、退出码和耗时。

直接提示不自动读无关管道；--stdin只接受完整输入；失败时后续发布步骤不运行。

## 自测

完成「只读提问、管道和脚本」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 直接提示不自动读无关管道；--stdin只接受完整输入；失败时后续发布步骤不运行。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。直接提示不自动读无关管道；--stdin只接受完整输入；失败时后续发布步骤不运行。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CLI-CONTRACTS.zh.md](../CLI-CONTRACTS.zh.md)

---

# 009 · 代码审查：带着上下文挑毛病

单元1 · 建议35分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-9) · [总纲](README.zh.md)

## 学习目标

得到带位置、影响和复现方式的审查结果，并防止JSON解析失败假通过。

## 原理讲解

review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。
每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：

## 准备

在自己的测试仓库准备一处可解释的变更；没有Git仓库或没有变更时先明确审查范围。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第9课 · 代码审查：带着上下文挑毛病 ━━
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

不凑数量；存在问题时能定位并复现。解析失败或模型错误不得写“审查通过”。

## 开发者教学

把review作为数据接口：校验JSON结构、退出码与parsed，不只搜索“通过”。
负例覆盖解释性散文、空结果、部分JSON与服务错误；保持REVIEW_UNPARSED非零。
CI在只读令牌和受限工作区里运行；评论或推送是独立授权动作。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

给购物车修复做一次审查：至少一条真实问题或明确无可证问题的结论，附测试依据。

不凑数量；存在问题时能定位并复现。解析失败或模型错误不得写“审查通过”。

## 自测

完成「代码审查：带着上下文挑毛病」时，哪种做法符合本课验收？

A. 不凑数量；存在问题时能定位并复现。解析失败或模型错误不得写“审查通过”。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。不凑数量；存在问题时能定位并复现。解析失败或模型错误不得写“审查通过”。

</details>

## 延伸阅读

- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 010 · 修到测试通过：fix --check

单元1 · 建议40分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-10) · [总纲](README.zh.md)

## 学习目标

用可重复失败的检查驱动修复，保留失败证据，避免只改测试让它变绿。

## 原理讲解

fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。

## 准备

将cart-lab复制到独立项目；需要可用Node运行示例。没有Node时先学内置教练，不必为了读教程装依赖。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第10课 · 修到测试通过：fix --check ━━
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

根因是漏乘数量；实现修复而非改期望；旧测试和新增边界用例全部通过。

## 开发者教学

性能题先固定输入与测量条件；重构题先固定行为，不能用更换测试输入刷结果。
对长任务阶段性保存可运行文件、测试与下一步，避免超时只剩聊天。
修复次数与耗时记录真实值；没有全量回归不能称全工程全绿。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

保留一次失败、一次修复和一次独立复测，写三句话解释根因、改动、验证。

根因是漏乘数量；实现修复而非改期望；旧测试和新增边界用例全部通过。

## 自测

完成「修到测试通过：fix --check」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 根因是漏乘数量；实现修复而非改期望；旧测试和新增边界用例全部通过。

<details><summary>答案与解析</summary>

C。根因是漏乘数量；实现修复而非改期望；旧测试和新增边界用例全部通过。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)

---

# 011 · 流程编排与 CI：让智能体排好队

单元1 · 建议45分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-11) · [总纲](README.zh.md)

## 学习目标

把重复工作拆成可检查步骤，前一步失败时不让发布步骤继续。

## 原理讲解

把审查、测试、修复写进一份流程文件，本地和 CI 跑同一份。下面是一份小流程，我们直接跑：
koder ci init 会生成 GitHub Actions 工作流：PR 一开就自动审查并评论；在 PR 里评论 /koder fix，它会修好并推回分支。只有仓库成员的评论才算数，路人甲喊破喉咙也没用。

## 准备

先通过第8–10课。使用附带flow-lab.json和cart-lab；先读文件，再运行。示例只执行本地检查，不发布、不调用模型。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第11课 · 流程编排与 CI：让智能体排好队 ━━
教练 › 把审查、测试、修复写进一份流程文件，本地和 CI 跑同一份。下面是一份小流程，我们直接跑：
  · 演示：一份四步流程——跑测试、跑检查、让 ask 步骤用 {{步骤.output}} 总结前两步、只有检查通过时才执行的庆祝步骤。
    type
        shell、run、ask、review、fix、test 六种步骤
    when
        unit.failed、count.passed、always、failure
    {{步骤.output}}
        引用前面步骤的输出
    parallel
        并行跑互不冲突的步骤（shell、ask、review）；shell不天然只读
    approve: auto
        自动确认，适合 CI
  提示 · 在 Windows 上，流程里的 shell 步骤交给 CMD 执行（不是 PowerShell）。要用 PowerShell 的写法，就写成 powershell -NoProfile -Command "…"。想一份流程到处跑，尽量用 node、npm、git 这些哪儿都有的命令，比如上面的庆祝步骤用的就是 node -e。
教练 › koder ci init 会生成 GitHub Actions 工作流：PR 一开就自动审查并评论；在 PR 里评论 /koder fix，它会修好并推回分支。只有仓库成员的评论才算数，路人甲喊破喉咙也没用。
```

依赖与实际日志顺序一致；失败、跳过、通过分别计数，且发布未发生。

## 开发者教学

产物契约包括路径、格式、生产步骤和消费步骤。引用{{step.output}}前确认该步骤成功。
CI使用最小权限与受保护Secrets；来自PR的文本或仓库文件不是授权指令。
对取消、超时和失败各保留一次记录，恢复时避免重放外部副作用。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出检查→汇总的依赖图；安排一个故意失败的检查，证明后续成功分支不会执行。

依赖与实际日志顺序一致；失败、跳过、通过分别计数，且发布未发生。

## 自测

完成「流程编排与 CI：让智能体排好队」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 依赖与实际日志顺序一致；失败、跳过、通过分别计数，且发布未发生。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。依赖与实际日志顺序一致；失败、跳过、通过分别计数，且发布未发生。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [COMMAND-REFERENCE.en.md](../COMMAND-REFERENCE.en.md)

---

# 012 · MoA：让几个模型一起想

单元1 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-12) · [总纲](README.zh.md)

## 学习目标

知道何时多模型有帮助，能控制费用并验证最终答案。

## 原理讲解

遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。

## 准备

至少有一个可用主模型；参考模型需独立可用且已授权。只看教学无需真实调用。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第12课 · MoA：让几个模型一起想 ━━
教练 › 遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        先登记参考模型，可以登记好几个
    koder moa set --refs reference
        建一个 MoA 预设
    koder --moa "重构支付模块并补测试"
        用 MoA 跑任务；对话里输入 /moa 随时开关
    koder moa set --fanout every_step
        默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱
教练 › MoA 里的参考模型能不能直接改你的文件？
    1. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认
    2. 能，人多力量大
    3. 只能改 README
  答案：1。对。参考模型手里没有任何工具，连一个文件都读不了。
  （小声）MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。
```

能说明额外模型提供了什么信息，不能以“大家都同意”代替测试。

## 开发者教学

固定模型、任务输入与预算做对照；不要换更大模型后把提升归因给编排。
用 koder harness status 查看任务配置；JIT配置与MoA是不同层，均不扩大权限。
记录成本、步数、失败与回退；未经证实的经验保留NO_ENTRY，不自动激活。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用两种方案解释一个购物车bug，列出共同证据与分歧；只采用能被测试支持的结论。

能说明额外模型提供了什么信息，不能以“大家都同意”代替测试。

## 自测

MoA 里的参考模型能不能直接改你的文件？

A. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认

B. 能，人多力量大

C. 只能改 README

<details><summary>答案与解析</summary>

A。对。参考模型手里没有任何工具，连一个文件都读不了。

</details>

## 延伸阅读

- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HARNESS-INCREMENTAL.md](../HARNESS-INCREMENTAL.md)

---

# 013 · 接入聊天软件：在手机上指挥 Koder

单元1 · 建议40分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-13) · [总纲](README.zh.md)

## 学习目标

把已授权的聊天渠道接到本机任务，并验证配对、消息到达与权限。

## 原理讲解

Koder 能接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord 和 WhatsApp。各适配器需要相应平台账号与授权。按 setup 的实际提示连接并检查状态；微信流程由服务端决定。本预览版尚未完成真实账号验收，教程不会发起连接。

## 准备

先选一个已有账号与管理权限的平台。教程展示的配对码是示例，不能照抄；渠道上线可能对外发消息。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第13课 · 接入聊天软件：在手机上指挥 Koder ━━
教练 › Koder 能接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord 和 WhatsApp。各适配器需要相应平台账号与授权。按 setup 的实际提示连接并检查状态；微信流程由服务端决定。本预览版尚未完成真实账号验收，教程不会发起连接。
    koder gateway setup feishu
        接入飞书（企业微信 wecom、钉钉 dingtalk 同理）
    koder gateway setup weixin
        按实际账号流程配置微信
    koder gateway start --background
        后台收消息
    koder gateway status
        看哪些平台在线
    koder gateway pair K7Q2MX
        同意一位新用户
  提示 · 飞书、企业微信、钉钉、Slack、Discord 用长连接，不需要公网地址；WhatsApp 官方接口要把本地端口通过隧道暴露出去。
  提示 · koder gateway start --background 会在后台悄悄运行，不弹窗口；电脑睡眠、注销或重启以后机器人会停，登录后再运行一次就好。
教练 › 一个陌生人在微信上给你的机器人发消息，会发生什么？
    1. 他会收到一个配对码，你在电脑上 koder gateway pair 同意以后才能用
    2. 机器人直接帮他改代码
    3. 机器人热情地把你的密钥发给他
  答案：1。对。默认私聊要配对，群聊默认关闭；改文件、跑命令之前，它还会在聊天里问你，回复「允许」才执行。
  （小声）从此你可以躺在沙发上用手机修 bug——至于这算不算加班，请自行判断。
```

配置存在不是已上线；测试计划不是实发通过；每个状态能回溯到输出。

## 开发者教学

Gateway复用原会话、权限、取消与操作账本；不要为渠道另建无边界执行器。
测试重复消息去重、重连、未配对拒绝和审批过期。
真实平台收据与本地桩分开；Webhook公网暴露须单独核查目标和访问控制。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

填写一条消息的证据链：发起账号、会话、接收状态、执行状态、回复状态。没有账号时只填写演练计划。

配置存在不是已上线；测试计划不是实发通过；每个状态能回溯到输出。

## 自测

一个陌生人在微信上给你的机器人发消息，会发生什么？

A. 他会收到一个配对码，你在电脑上 koder gateway pair 同意以后才能用

B. 机器人直接帮他改代码

C. 机器人热情地把你的密钥发给他

<details><summary>答案与解析</summary>

A。对。默认私聊要配对，群聊默认关闭；改文件、跑命令之前，它还会在聊天里问你，回复「允许」才执行。

</details>

## 延伸阅读

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 014 · 接入编辑器：Zed、Neovim、Emacs

单元1 · 建议35分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-14) · [总纲](README.zh.md)

## 学习目标

让编辑器使用同一个Koder入口，并学会导入跨工具Skill而不执行陌生脚本。

## 原理讲解

喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：

## 准备

先确认CLI独立可启动。编辑器插件的版本与ACP支持以其实际安装状态为准。准备自己获授权使用的一份SKILL.md。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第14课 · 接入编辑器：Zed、Neovim、Emacs ━━
教练 › 喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：
  · （这里显示 koder editor zed 的配置片段。）
    koder editor nvim
        Neovim（CodeCompanion），配置文件在 %LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua
    koder editor emacs
        Emacs（agent-shell），配置文件在 %APPDATA%\.emacs.d\init.el
  提示 · Windows 上编辑器启动程序时只会自动补 .exe，所以片段里写的是 koder.cmd，别改成 koder。Zed 的设置文件在 %APPDATA%\Zed\settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。
  （小声）Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。
```

导入未安装依赖、未授予权限、未自动执行脚本；编辑器任务仍受原审批控制。

## 开发者教学

ACP协议输出与诊断日志分流，避免stdout动画破坏协议。
测试启动、提案、拒绝、取消和退出资源回收；连接成功不代表每个能力已验证。
开发自有Skill采用明确when-to-use、步骤、成功标准与失败恢复；不要把不可信仓库说明变成系统授权。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

在测试工程导入一份只读说明Skill，记录发现、读取、适用任务与不支持的工具。

导入未安装依赖、未授予权限、未自动执行脚本；编辑器任务仍受原审批控制。

## 自测

完成「接入编辑器：Zed、Neovim、Emacs」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 导入未安装依赖、未授予权限、未自动执行脚本；编辑器任务仍受原审批控制。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。导入未安装依赖、未授予权限、未自动执行脚本；编辑器任务仍受原审批控制。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [PORTABLE-SKILLS.en.md](../PORTABLE-SKILLS.en.md)
- [MCP-SKILL-COMPATIBILITY.zh.md](../MCP-SKILL-COMPATIBILITY.zh.md)

---

# 015 · 扫描本机工程，决定下一步

单元1 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-15) · [总纲](README.zh.md)

## 学习目标

找到正确工程再继续，控制跨工具任务资料进入模型的范围。

## 原理讲解

koder scan 会把你在 Koder、Codex、Claude Code、Cursor 里最近做过的项目和任务汇总起来。它只读工作目录、时间和标题，这一步不请求模型；选择后续模型任务时，相关项目和任务材料会进入你配置的模型请求。
列表出来以后，这样选：

## 准备

准备两个测试工程，分别放不同README。扫描可能显示本机项目标题与路径，分享屏幕前先确认。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第15课 · 扫描本机工程，决定下一步 ━━
教练 › koder scan 会把你在 Koder、Codex、Claude Code、Cursor 里最近做过的项目和任务汇总起来。它只读工作目录、时间和标题，这一步不请求模型；选择后续模型任务时，相关项目和任务材料会进入你配置的模型请求。
教练 › 列表出来以后，这样选：
    输入项目前面的序号
        选中这个项目，回车就是跳过
    1  审查改动
        等于 koder review
    2  跑检查并修复
        会先猜一个检查命令，比如 npm test，回车就用它
    3  让 Koder 列出现在最值得做的事
        会把你在别的工具里最近做过的任务一起交给它参考
    4  自己输入任务
  · 可以现场扫一次，只列出项目，不进入选择。
  （小声）扫完发现自己同时开了十几个项目？很正常，我们都是这样。
```

保留两个工作目录和结果；共享笔记是显式范围，和任务历史分开说明。

## 开发者教学

规范工作路径是隔离键的一部分；路径别名、符号链接和并发会话需要一致处理。
测试两工程、同工程不同命名会话、旧会话恢复；不删除旧记录以掩盖串话。
交付前生成项目文件索引和运行入口，供下次恢复读回。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

在A、B中写不同的测试标记，分别提问；结果不能串用另一工程标记。

保留两个工作目录和结果；共享笔记是显式范围，和任务历史分开说明。

## 自测

完成「扫描本机工程，决定下一步」时，哪种做法符合本课验收？

A. 保留两个工作目录和结果；共享笔记是显式范围，和任务历史分开说明。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。保留两个工作目录和结果；共享笔记是显式范围，和任务历史分开说明。

</details>

## 延伸阅读

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 016 · 安装、更新和换引擎

单元2 · 建议40分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-16) · [总纲](README.zh.md)

## 学习目标

正确安装和更新，确认启动的确是新版，保留用户配置与恢复路径。

## 原理讲解

想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
Windows XP、7、8 没法直接装：Node.js 22 最低要求 Windows 10，XP 连连接大模型接口需要的 TLS 1.2 都不支持。想在老电脑上用，可以用 PuTTY 之类的工具 SSH 登录另一台装了 Koder 的电脑，或者在手机上通过聊天软件网关给 Koder 发任务。
安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。

## 准备

记录系统、架构、当前版本和命令入口。使用官网或官方GitHub下载；具体安装脚本见INSTALLATION，不照搬别的终端语法。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第16课 · 安装、更新和换引擎 ━━
教练 › 想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
    先在浏览器阅读：
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        官方团队 KARMENLOOP 官方团队，中国上海。官网 https://karmenloop.com 邮箱 info@karmenloop.com
        普通安装会在真实终端提示输入 accept 并回车；decline 或 Ctrl+C 取消；空回车会重新询问，不会安装。请完整输入 accept 再回车。
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
        已阅读并同意的自动部署（不要替未阅读的人预先填写；KODER_EULA_ACCEPT=1 只接受软件许可）：
    $env:KODER_EULA_ACCEPT = "1"
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
    Remove-Item Env:KODER_EULA_ACCEPT
        Windows 10 / 11：装完重新打开命令提示符或 PowerShell；当前窗口的 PATH 不会自动刷新。
    koder version
    koder setup
    koder learn
    koder update --check
        只检查 GitHub 更新
    koder update
        下载校验并安装新版本；preview.6 起的会话自动重启接续，保留配置、记忆和绑定
        升到 preview.7 请运行上面的普通安装命令，阅读后输入 accept。preview.6 的更新器会在许可校验变化时于下载安装器前停止，KODER_EULA_ACCEPT 不能跳过这道检查。配置、记忆和绑定保留
    koder uninstall
        卸载程序，保留配置；需要删除配置时另行选择 --purge
  提示 · 装在 %LOCALAPPDATA%\koder-cli，设置在 %USERPROFILE%\.koder-cli，不需要管理员权限。如果提示执行策略不允许，就改用 CMD 那一行（带 -ExecutionPolicy Bypass）。
教练 › Windows XP、7、8 没法直接装：Node.js 22 最低要求 Windows 10，XP 连连接大模型接口需要的 TLS 1.2 都不支持。想在老电脑上用，可以用 PuTTY 之类的工具 SSH 登录另一台装了 Koder 的电脑，或者在手机上通过聊天软件网关给 Koder 发任务。
  提示 · 要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。
教练 › 安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
    koder update auto status
    koder update auto off
    koder update --check
    koder update
教练 › 默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。
    koder engine list
    koder model show
    koder engine use koder
  （小声）卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。
```

命令输出与实际版本一致；包下载成功不能替代启动成功；Windows/macOS分别记录。

## 开发者教学

验收矩阵分CMD、PowerShell5.1、macOS与目标架构；无Node冷启动要隔离PATH，不卸载用户Node。
校验包SHA、文件清单、旧→新更新和EOF退出；保留原超时与失败。
Windows Server runner可提供原生证据，但不能冒充Windows10/11客户端GUI验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一张升级记录：升级前后版本、入口、配置是否保留、失败时回退方式。没有真实升级就写演练。

命令输出与实际版本一致；包下载成功不能替代启动成功；Windows/macOS分别记录。

## 自测

完成「安装、更新和换引擎」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 命令输出与实际版本一致；包下载成功不能替代启动成功；Windows/macOS分别记录。

<details><summary>答案与解析</summary>

C。命令输出与实际版本一致；包下载成功不能替代启动成功；Windows/macOS分别记录。

</details>

## 延伸阅读

- [INSTALLATION.md](../INSTALLATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)
- [AUTO-UPDATE.en.md](../AUTO-UPDATE.en.md)
- [WINDOWS-INSTALL-CHECKS.md](../WINDOWS-INSTALL-CHECKS.md)

---

# 017 · 使用许可与可选授权

单元2 · 建议20分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-17) · [总纲](README.zh.md)

## 学习目标

理解许可、功能开关和操作授权的区别，按需要开启并能撤销。

## 原理讲解

接受协议前，可以先看帮助和本教程文字版。接受使用许可不会开启喜好学习、自动同步、应用连接或电脑执行权限。下面各项由你独立选择；教程不会替你开启。
授权与数据使用说明

使用许可：个人非商业本地使用免费；商用与组织部署须单独书面授权，个人许可不授二次开发或修改自有实现代码的权利；新自有发行版采用专有的 Koder-EULA-1.1，第三方和旧 GPL 权利保留。接受协议只取得软件使用许可，不会开启以下任何可选能力。查看协议：koder eula；明确接受：koder eula accept。

模型与网络：任务、选择的文件内容、检索到的记忆及工具结果可能发给你配置的模型/API；自带API费用由服务商收取。本地模型也必须实际安装运行，选择本地预设不等于已离线可用。使用 --key-env 保存变量引用；粘贴到模型配置的密钥是本机明文，界面仅隐藏显示。

电脑范围：文件读取/写入/搜索、联网、浏览器、桌面、渠道发文件和技能更新分别检查。完整工作模式覆盖所选可见磁盘根，仍受操作系统权限与实际能力限制。输入GRANT前核对执行程序、目录及远端成员；接受协议或 --yes 不会授予电脑权限。koder permissions revoke 撤销本机Koder的后续电脑工具授权；系统权限仍在系统设置中撤销。已经发生的写入或发送不会被自动追回。

跨设备记忆服务：你配置的Core地址
登录后，此账号默认共享空间可在已关联的终端、渠道和设备间同步对话与记忆。已关联群的所有成员可使用关联私聊记忆，回复到群的内容会被群成员看到。请只关联允许共享的会话。模型API密钥、电脑执行授权不作为记忆同步。退出本机账号：koder account logout；删除共享空间记忆：koder memory forget。退出不等于删除服务器副本；离线设备需再次同步才应用删除。

喜好习惯学习
默认关闭。开启后从已授权来源的对话中提炼表达习惯、明确喜好和工作背景，保存带来源的画像，并用于后续回答。一天想喝的饮料不应自动变成永久偏好；你可以查看、纠正或删除记录。
关闭: koder memory learning off

当天状态
默认关闭。单独允许总结当天的心情、临时需求和情境，作为短期状态使用。与长期喜好学习分开选择，不把情绪描述当作诊断。
关闭: koder memory daily-state off

技能改进
默认关闭。允许根据已授权任务和反馈提出技能改进候选；来源、检查和回退记录仍需保留。开启不允许自行提权、安装任意软件、修改系统安全设置或跳过工具批准。
关闭: koder memory evolution off

主动服务与提醒
默认关闭。允许根据已确认的背景主动问候、提出工作问题和提醒，并把你的回复关联到原问题。默认安静时段为本地时间22:00–08:00；当前终端提醒需要进程运行及兼容的Core服务。开启不代表允许给联系人或群自动发消息。
关闭: koder memory proactive off

每日反思：需已授权来源、已开启的相关选项、有效账号和兼容Core宿主。默认每日模型调用预算为4次；使用已配置的API或本地模型，可能产生费用。缺少宿主/凭据时显示等待状态，不表示已经反思完成。关闭学习会停止相应后续使用，不等于擦除历史；使用 profile forget 或 memory forget 管理记录。

本地存储：新Windows记忆目录优先使用可写的D盘，否则使用可写的C盘用户专属目录；已有记忆位置和手动设置会保留。记忆位置与安装位置、密钥存储不同，请以 memory status / memory personalization status 的实际输出为准。灵魂风格可手动编辑与回退，不能赋予权限。普通卸载保留配置；--purge 是删除配置的独立选择，外置记忆和服务器副本需单独处理。

应用与 MCP：连接会使用所选服务的 API Key 或浏览器授权；第三方能接收你通过该连接提交的数据，费用和服务条款由该服务决定。同一连接配置可由当前配置范围内的对话与 Agent 复用，外部写入仍走工具批准。stdio MCP 会在本机启动配置的程序；导入默认关闭，启用或 test 会启动连接。可用 koder apps disconnect <id>、koder mcp disable <id> 停用；在服务方撤销授权后才能终止其持有的令牌。

更改选择：四项可选功能互不代开；按每项提示输入ENABLE开启、DISABLE关闭，风格保存使用SAVE。只读帮助和 koder learn --print 可在接受协议之前查看。预览版的Windows真机、真实渠道和多设备仍待验收，连接状态与实际结果为准。

## 准备

先读随包EULA、隐私条款和当前适用的商业授权说明；不清楚组织使用范围时按文档联系团队。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第17课 · 使用许可与可选授权 ━━
教练 › 接受协议前，可以先看帮助和本教程文字版。接受使用许可不会开启喜好学习、自动同步、应用连接或电脑执行权限。下面各项由你独立选择；教程不会替你开启。
    koder eula
    koder eula accept
    koder help permissions
    koder learn --print
教练 › 授权与数据使用说明
       
       使用许可：个人非商业本地使用免费；商用与组织部署须单独书面授权，个人许可不授二次开发或修改自有实现代码的权利；新自有发行版采用专有的 Koder-EULA-1.1，第三方和旧 GPL 权利保留。接受协议只取得软件使用许可，不会开启以下任何可选能力。查看协议：koder eula；明确接受：koder eula accept。
       
       模型与网络：任务、选择的文件内容、检索到的记忆及工具结果可能发给你配置的模型/API；自带API费用由服务商收取。本地模型也必须实际安装运行，选择本地预设不等于已离线可用。使用 --key-env 保存变量引用；粘贴到模型配置的密钥是本机明文，界面仅隐藏显示。
       
       电脑范围：文件读取/写入/搜索、联网、浏览器、桌面、渠道发文件和技能更新分别检查。完整工作模式覆盖所选可见磁盘根，仍受操作系统权限与实际能力限制。输入GRANT前核对执行程序、目录及远端成员；接受协议或 --yes 不会授予电脑权限。koder permissions revoke 撤销本机Koder的后续电脑工具授权；系统权限仍在系统设置中撤销。已经发生的写入或发送不会被自动追回。
       
       跨设备记忆服务：你配置的Core地址
       登录后，此账号默认共享空间可在已关联的终端、渠道和设备间同步对话与记忆。已关联群的所有成员可使用关联私聊记忆，回复到群的内容会被群成员看到。请只关联允许共享的会话。模型API密钥、电脑执行授权不作为记忆同步。退出本机账号：koder account logout；删除共享空间记忆：koder memory forget。退出不等于删除服务器副本；离线设备需再次同步才应用删除。
       
       喜好习惯学习
       默认关闭。开启后从已授权来源的对话中提炼表达习惯、明确喜好和工作背景，保存带来源的画像，并用于后续回答。一天想喝的饮料不应自动变成永久偏好；你可以查看、纠正或删除记录。
       关闭: koder memory learning off
       
       当天状态
       默认关闭。单独允许总结当天的心情、临时需求和情境，作为短期状态使用。与长期喜好学习分开选择，不把情绪描述当作诊断。
       关闭: koder memory daily-state off
       
       技能改进
       默认关闭。允许根据已授权任务和反馈提出技能改进候选；来源、检查和回退记录仍需保留。开启不允许自行提权、安装任意软件、修改系统安全设置或跳过工具批准。
       关闭: koder memory evolution off
       
       主动服务与提醒
       默认关闭。允许根据已确认的背景主动问候、提出工作问题和提醒，并把你的回复关联到原问题。默认安静时段为本地时间22:00–08:00；当前终端提醒需要进程运行及兼容的Core服务。开启不代表允许给联系人或群自动发消息。
       关闭: koder memory proactive off
       
       每日反思：需已授权来源、已开启的相关选项、有效账号和兼容Core宿主。默认每日模型调用预算为4次；使用已配置的API或本地模型，可能产生费用。缺少宿主/凭据时显示等待状态，不表示已经反思完成。关闭学习会停止相应后续使用，不等于擦除历史；使用 profile forget 或 memory forget 管理记录。
       
       本地存储：新Windows记忆目录优先使用可写的D盘，否则使用可写的C盘用户专属目录；已有记忆位置和手动设置会保留。记忆位置与安装位置、密钥存储不同，请以 memory status / memory personalization status 的实际输出为准。灵魂风格可手动编辑与回退，不能赋予权限。普通卸载保留配置；--purge 是删除配置的独立选择，外置记忆和服务器副本需单独处理。
       
       应用与 MCP：连接会使用所选服务的 API Key 或浏览器授权；第三方能接收你通过该连接提交的数据，费用和服务条款由该服务决定。同一连接配置可由当前配置范围内的对话与 Agent 复用，外部写入仍走工具批准。stdio MCP 会在本机启动配置的程序；导入默认关闭，启用或 test 会启动连接。可用 koder apps disconnect <id>、koder mcp disable <id> 停用；在服务方撤销授权后才能终止其持有的令牌。
       
       更改选择：四项可选功能互不代开；按每项提示输入ENABLE开启、DISABLE关闭，风格保存使用SAVE。只读帮助和 koder learn --print 可在接受协议之前查看。预览版的Windows真机、真实渠道和多设备仍待验收，连接状态与实际结果为准。
```

三项不能相互代替；发送还需要符合邮件的最终确认或已明确授权规则。

## 开发者教学

将授权状态与功能可用性分开建模，默认值、迁移与撤权都需测试。
旧配置新增字段时保留原值；不得用升级自动开通高敏来源。
错误信息要说明缺哪一层，不提示用户关闭安全保护解决问题。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

列出许可接受、模型读取邮箱、自动回复三项的不同授权动作。

三项不能相互代替；发送还需要符合邮件的最终确认或已明确授权规则。

## 自测

完成「使用许可与可选授权」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 三项不能相互代替；发送还需要符合邮件的最终确认或已明确授权规则。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。三项不能相互代替；发送还需要符合邮件的最终确认或已明确授权规则。

</details>

## 延伸阅读

- [COMMERCIAL-LICENSING.md](../COMMERCIAL-LICENSING.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 018 · 电脑与文件：查看、授权、撤销

单元2 · 建议45分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-18) · [总纲](README.zh.md)

## 学习目标

在明确授权范围内操作浏览器或桌面，并核对每一步真实状态。

## 原理讲解

先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。

## 准备

只用自己创建的测试窗口和公开网页；不操作正在使用的私人窗口。GUI需要受支持的系统、驱动和交互桌面。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第18课 · 电脑与文件：查看、授权、撤销 ━━
教练 › 先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  提示 · 以上授权命令会改变本机权限记录，不要整段粘贴执行。只运行你选择的一项。撤销阻止后续电脑工具调用，不会撤回已经发送的文件或恢复已覆盖内容；系统设置中的授权单独管理。
教练 › 文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。
```

保留目标窗口、授权、工具回执和读回证据；撤权负例必须没有额外点击。

## 开发者教学

窗口身份用平台返回的实际句柄/PID等证据固定；标题相同不等于同一个目标。
清理仅限本轮拥有的资源，取消不终止其他用户进程。
分别记录tools/list、tools/call、图形效果和真实用户任务；发现工具不等于已完成操作。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

在自有窗口完成一次输入和读回；撤销对应权限后验证后续操作被阻止。

保留目标窗口、授权、工具回执和读回证据；撤权负例必须没有额外点击。

## 自测

完成「电脑与文件：查看、授权、撤销」时，哪种做法符合本课验收？

A. 保留目标窗口、授权、工具回执和读回证据；撤权负例必须没有额外点击。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。保留目标窗口、授权、工具回执和读回证据；撤权负例必须没有额外点击。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [WINDOWS-MCP-BUNDLED.en.md](../WINDOWS-MCP-BUNDLED.en.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 019 · 记忆目录、群私聊与多设备

单元2 · 建议35分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-19) · [总纲](README.zh.md)

## 学习目标

理解工作区、会话与共享记忆边界，安全地多窗口运行和恢复。

## 原理讲解

记忆并不等于把所有聊天塞进一次模型请求。当前任务使用相关记忆与压缩历史，完整记录按已配置范围持久化。新 Windows 用户优先使用可写 D 盘，否则使用可写 C 盘的用户专属目录；已有位置和显式配置保留。安装目录、密钥目录与记忆目录可能不同。
跨设备记忆服务：你们部署并确认可用的 Core 地址
登录后，此账号默认共享空间可在已关联的终端、渠道和设备间同步对话与记忆。已关联群的所有成员可使用关联私聊记忆，回复到群的内容会被群成员看到。请只关联允许共享的会话。模型API密钥、电脑执行授权不作为记忆同步。退出本机账号：koder account logout；删除共享空间记忆：koder memory forget。退出不等于删除服务器副本；离线设备需再次同步才应用删除。

## 准备

准备两个测试目录和不同的合成暗号；不使用真实个人秘密测试隔离。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第19课 · 记忆目录、群私聊与多设备 ━━
教练 › 记忆并不等于把所有聊天塞进一次模型请求。当前任务使用相关记忆与压缩历史，完整记录按已配置范围持久化。新 Windows 用户优先使用可写 D 盘，否则使用可写 C 盘的用户专属目录；已有位置和显式配置保留。安装目录、密钥目录与记忆目录可能不同。
    koder memory status
    koder memory personalization status
    koder memory show
    koder memory search "项目决定"
    koder account status
    koder memory sync
教练 › 跨设备记忆服务：你们部署并确认可用的 Core 地址
       登录后，此账号默认共享空间可在已关联的终端、渠道和设备间同步对话与记忆。已关联群的所有成员可使用关联私聊记忆，回复到群的内容会被群成员看到。请只关联允许共享的会话。模型API密钥、电脑执行授权不作为记忆同步。退出本机账号：koder account logout；删除共享空间记忆：koder memory forget。退出不等于删除服务器副本；离线设备需再次同步才应用删除。
    koder account login --server "https://your-core.example"
        示例地址，必须换成你实际可用的 Core 服务
    koder account logout
        退出此设备，不删除服务器记忆
    koder memory forget
        删除当前共享空间记忆，离线设备下次同步时应用
  提示 · 关联群的所有成员可使用关联私聊记忆；群内回复全员可见。只关联允许这样共享的会话。登录状态不等于同步成功，请检查状态与实际读回。当前预览版尚缺真实多设备和微信、飞书、企业微信账号验收。
```

B无A私有标记，回A仍可续；未测试远端同步则标NOT_RUN。

## 开发者教学

身份、存储键、检索过滤和缓存都要带相同工作区/会话范围。
并发测试覆盖同工程不同任务与不同工程；旧占用锁恢复需判断实际拥有者，不用盲删锁。
Headroom压缩仅影响模型视图，原始证据仍须可检索；压缩不是删除授权。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

做A→B→A三步隔离检查，填写每次可见内容与预期。

B无A私有标记，回A仍可续；未测试远端同步则标NOT_RUN。

## 自测

完成「记忆目录、群私聊与多设备」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. B无A私有标记，回A仍可续；未测试远端同步则标NOT_RUN。

<details><summary>答案与解析</summary>

C。B无A私有标记，回A仍可续；未测试远端同步则标NOT_RUN。

</details>

## 延伸阅读

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)
- [HEADROOM.en.md](../HEADROOM.en.md)

---

# 020 · 习惯学习、灵魂、每日反思与主动服务

单元2 · 建议45分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-20) · [总纲](README.zh.md)

## 学习目标

把自主学习、任务Harness、常驻和邮箱提醒分开配置，并知道各自何时真正运行。

## 原理讲解

四项开关默认关闭，开启其中一项不会代开其他项。打开 koder setup → 记忆与灵魂，先看每项说明再选择；命令行也会先解释用途和费用，输入 ENABLE 才开启，DISABLE 才关闭。
内置 personal-agent-growth 0.3.2 会在相关任务中按需提供预习、查错和复盘方法。koder growth status 查看，show 读方法，off/on 控制下次会话。它像随身的错题本，不会趁你下班偷偷开课：没有新后台服务，不代开下面的画像学习与同步。
喜好习惯学习
默认关闭。开启后从已授权来源的对话中提炼表达习惯、明确喜好和工作背景，保存带来源的画像，并用于后续回答。一天想喝的饮料不应自动变成永久偏好；你可以查看、纠正或删除记录。
关闭: koder memory learning off
当天状态
默认关闭。单独允许总结当天的心情、临时需求和情境，作为短期状态使用。与长期喜好学习分开选择，不把情绪描述当作诊断。
关闭: koder memory daily-state off
技能改进
默认关闭。允许根据已授权任务和反馈提出技能改进候选；来源、检查和回退记录仍需保留。开启不允许自行提权、安装任意软件、修改系统安全设置或跳过工具批准。
关闭: koder memory evolution off
主动服务与提醒
默认关闭。允许根据已确认的背景主动问候、提出工作问题和提醒，并把你的回复关联到原问题。默认安静时段为本地时间22:00–08:00；当前终端提醒需要进程运行及兼容的Core服务。开启不代表允许给联系人或群自动发消息。
关闭: koder memory proactive off
学习结果可以查看、纠正和删除。当天心情和临时需求不要当成长期身份；技能改进候选仍需核准才能应用。灵魂设置控制名字、语气和风格，可保存版本与回退；它不增加任何工具权限。关闭学习不会清空旧记录，需删除时使用 profile forget <记录ID> 或 memory forget。

## 准备

从最小可见面开始。后台服务是显式选择，邮件/日历/浏览历史不会因安装就自动开放。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第20课 · 习惯学习、灵魂、每日反思与主动服务 ━━
教练 › 四项开关默认关闭，开启其中一项不会代开其他项。打开 koder setup → 记忆与灵魂，先看每项说明再选择；命令行也会先解释用途和费用，输入 ENABLE 才开启，DISABLE 才关闭。
教练 › 内置 personal-agent-growth 0.3.2 会在相关任务中按需提供预习、查错和复盘方法。koder growth status 查看，show 读方法，off/on 控制下次会话。它像随身的错题本，不会趁你下班偷偷开课：没有新后台服务，不代开下面的画像学习与同步。
教练 › 喜好习惯学习
       默认关闭。开启后从已授权来源的对话中提炼表达习惯、明确喜好和工作背景，保存带来源的画像，并用于后续回答。一天想喝的饮料不应自动变成永久偏好；你可以查看、纠正或删除记录。
       关闭: koder memory learning off
教练 › 当天状态
       默认关闭。单独允许总结当天的心情、临时需求和情境，作为短期状态使用。与长期喜好学习分开选择，不把情绪描述当作诊断。
       关闭: koder memory daily-state off
教练 › 技能改进
       默认关闭。允许根据已授权任务和反馈提出技能改进候选；来源、检查和回退记录仍需保留。开启不允许自行提权、安装任意软件、修改系统安全设置或跳过工具批准。
       关闭: koder memory evolution off
教练 › 主动服务与提醒
       默认关闭。允许根据已确认的背景主动问候、提出工作问题和提醒，并把你的回复关联到原问题。默认安静时段为本地时间22:00–08:00；当前终端提醒需要进程运行及兼容的Core服务。开启不代表允许给联系人或群自动发消息。
       关闭: koder memory proactive off
    koder memory learning status
    koder memory daily-state status
    koder memory evolution status
    koder memory proactive status
    koder memory profile show
    koder memory soul show
    koder memory reflection run
  提示 · reflection run 会尝试使用已授权对话与已配置模型，可能产生费用；有效账号、兼容 Core 宿主和相关开关齐备才可执行。默认每日最多4次模型调用。waiting-account-host 是等待条件，不是已总结。主动服务需要运行中的宿主，默认22:00–08:00安静时段；关闭终端或电脑不等于后台持续运行。
教练 › 学习结果可以查看、纠正和删除。当天心情和临时需求不要当成长期身份；技能改进候选仍需核准才能应用。灵魂设置控制名字、语气和风格，可保存版本与回退；它不增加任何工具权限。关闭学习不会清空旧记录，需删除时使用 profile forget <记录ID> 或 memory forget。
```

提醒不要求把全文交给模型；起草不等于发送；SMTP接受也不等于对方已读。

## 开发者教学

JIT只选择可序列化种子配置，沿原provider、预算、权限和取消路径执行。
经验写入需cue、lesson、evidence和结果；一次模型自评不能证明可复用。
主动事件测试notify/silence、安静时段、去重、未知回执与撤权；不要用固定定时推送冒充相关性判断。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出绑定→监控→读信→起草→发送的五个状态，写清每步输入和确认；只启用自己需要的部分。

提醒不要求把全文交给模型；起草不等于发送；SMTP接受也不等于对方已读。

## 自测

完成「习惯学习、灵魂、每日反思与主动服务」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 提醒不要求把全文交给模型；起草不等于发送；SMTP接受也不等于对方已读。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。提醒不要求把全文交给模型；起草不等于发送；SMTP接受也不等于对方已读。

</details>

## 延伸阅读

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [APP-USE-AND-LEARN.zh.md](../APP-USE-AND-LEARN.zh.md)
- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)

---

# 021 · Gamma、应用连接与 MCP

单元2 · 建议60分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-21) · [总纲](README.zh.md)

## 学习目标

把工具接入真正用于交付：MCP能调用，邮箱能经确认发送，GitHub能受控上传与编辑。

## 原理讲解

应用与 MCP：连接会使用所选服务的 API Key 或浏览器授权；第三方能接收你通过该连接提交的数据，费用和服务条款由该服务决定。同一连接配置可由当前配置范围内的对话与 Agent 复用，外部写入仍走工具批准。stdio MCP 会在本机启动配置的程序；导入默认关闭，启用或 test 会启动连接。可用 koder apps disconnect <id>、koder mcp disable <id> 停用；在服务方撤销授权后才能终止其持有的令牌。
断线先看连接诊断，区分令牌失效、服务限流、网络和模型工具调用失败。连接可被同一配置下的对话和 Agent 复用；这不表示凭据已跨设备同步。超长工具结果会有限读取或截取，不能把连接成功当成外部任务已经完成。

## 准备

只选自己已授权的测试账号、测试收件人和私有测试仓库。密钥放专用输入框。无需为读教程绑定任何账号；外部步骤全部由你选择执行。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第21课 · Gamma、应用连接与 MCP ━━
教练 › 应用与 MCP：连接会使用所选服务的 API Key 或浏览器授权；第三方能接收你通过该连接提交的数据，费用和服务条款由该服务决定。同一连接配置可由当前配置范围内的对话与 Agent 复用，外部写入仍走工具批准。stdio MCP 会在本机启动配置的程序；导入默认关闭，启用或 test 会启动连接。可用 koder apps disconnect <id>、koder mcp disable <id> 停用；在服务方撤销授权后才能终止其持有的令牌。
    koder apps
    koder apps connect gamma --key-env GAMMA_API_KEY
    koder apps status
    koder mcp import "mcp-config.json"
    koder mcp list
    koder mcp enable my-server
    koder mcp test my-server
    koder mcp disable my-server
    koder apps disconnect gamma
  提示 · 上面是按需选择的命令，不是要一次全执行。先按第3课的方法在当前系统设置环境变量。浏览器授权按 koder help apps / koder help mcp 的服务配置进行。检查 MCP 的程序路径、参数、服务地址和权限后再启用；test 会建立真实连接。
教练 › 断线先看连接诊断，区分令牌失效、服务限流、网络和模型工具调用失败。连接可被同一配置下的对话和 Agent 复用；这不表示凭据已跨设备同步。超长工具结果会有限读取或截取，不能把连接成功当成外部任务已经完成。
```

工具发现、成功调用、外部效果三层均有对应证据；SMTP提交与收件成功分列，GitHub读回内容与SHA一致。

## 开发者教学

所有外部写入沿原授权、幂等与UNKNOWN对账规则；--yes不代替最终邮件/GitHub确认。
大结果保留artifactId、SHA、bytes与读取方式，不能截断后丢失证据入口。
GitHub验收覆盖仓库大小写身份、分支变动、拒绝、超时和重试；文件/分支大小写不可随意归一化。
凭据存储不可用要明确失败；不要静默写明文或把令牌插进模型请求。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

选择一种连接完成“状态→操作→读回”记录；无账号可用时写详细演练，标NOT_RUN。GitHub上传仅选无秘密的README。

工具发现、成功调用、外部效果三层均有对应证据；SMTP提交与收件成功分列，GitHub读回内容与SHA一致。

## 自测

完成「Gamma、应用连接与 MCP」时，哪种做法符合本课验收？

A. 工具发现、成功调用、外部效果三层均有对应证据；SMTP提交与收件成功分列，GitHub读回内容与SHA一致。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。工具发现、成功调用、外部效果三层均有对应证据；SMTP提交与收件成功分列，GitHub读回内容与SHA一致。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-DELIVERY.en.md](../MAIL-DELIVERY.en.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [GITHUB-PROJECTS.en.md](../GITHUB-PROJECTS.en.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)

---

# 022 · API、上下文与更新排障

单元2 · 建议40分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-22) · [总纲](README.zh.md)

## 学习目标

先区分失败层，再收集最少证据；恢复任务时不重放已经完成的操作。

## 原理讲解

开发任务先检索公开 GitHub 候选、核对固定版本许可，再分轮提问并写需求、架构、任务和工具方案。已有项目优先复用，安装工具仍走本轮授权。对话中说“帮我更新 Koder CLI”或输入 /update 可触发版本比较、校验安装和新版入口核验；Ask/计划模式只检查。
API 无法连接：核对地址、协议、型号、环境变量和网络；401/403通常需要核对凭据或权限，429检查额度与限流，5xx或超时查看服务方状态。保留具体错误码，分享日志前遮盖密钥与聊天内容。不要反复更换随机接口。
上下文设置在 setup → 上下文与输出。填写当前型号与接口真实支持的窗口；输出上限也占用窗口。客户端会压缩历史、限制工具结果并保留相关记忆，但改一个更大的数字不会扩大服务方的硬上限。单个超大文件应分段读取或检索相关部分；支持更大窗口的模型也要按其实际规格配置。
update --check 只检查 GitHub 官方更新；update 下载、校验并安装当前更新通道的新版本，同版不重装、旧版不回退。配置、记忆和渠道绑定保留。preview.6 起启动的会话会在任务保存后自动重启，恢复原会话与待处理输入；运行中的网关先完成任务和回复再重连。旧版进程首次迁移需启动一次新版。更新不代替等待中的批准，也不重放已完成操作。若新版本使用许可变化，先查看并明确接受新许可。升级后用 version 核对；旧版教程毕业后会从新增第17课续学。

## 准备

保存当前工作，不清空历史。准备版本、系统、失败命令、错误码和最后几行已脱敏输出。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第22课 · API、上下文与更新排障 ━━
教练 › 开发任务先检索公开 GitHub 候选、核对固定版本许可，再分轮提问并写需求、架构、任务和工具方案。已有项目优先复用，安装工具仍走本轮授权。对话中说“帮我更新 Koder CLI”或输入 /update 可触发版本比较、校验安装和新版入口核验；Ask/计划模式只检查。
    koder version
    koder doctor
    koder model show
    koder setup
    koder update --check
    koder update
教练 › API 无法连接：核对地址、协议、型号、环境变量和网络；401/403通常需要核对凭据或权限，429检查额度与限流，5xx或超时查看服务方状态。保留具体错误码，分享日志前遮盖密钥与聊天内容。不要反复更换随机接口。
教练 › 上下文设置在 setup → 上下文与输出。填写当前型号与接口真实支持的窗口；输出上限也占用窗口。客户端会压缩历史、限制工具结果并保留相关记忆，但改一个更大的数字不会扩大服务方的硬上限。单个超大文件应分段读取或检索相关部分；支持更大窗口的模型也要按其实际规格配置。
教练 › update --check 只检查 GitHub 官方更新；update 下载、校验并安装当前更新通道的新版本，同版不重装、旧版不回退。配置、记忆和渠道绑定保留。preview.6 起启动的会话会在任务保存后自动重启，恢复原会话与待处理输入；运行中的网关先完成任务和回复再重连。旧版进程首次迁移需启动一次新版。更新不代替等待中的批准，也不重放已完成操作。若新版本使用许可变化，先查看并明确接受新许可。升级后用 version 核对；旧版教程毕业后会从新增第17课续学。
  提示 · 普通 koder uninstall 保留配置。--purge 会删除配置，使用前先备份；外置记忆目录和服务器副本要单独管理。教程与帮助可离线阅读，远端模型、更新、云同步和在线应用需要网络。
```

发信先核SMTP/收件方；搜索先核URL、状态与正文，空结果不等于没有资料。

## 开发者教学

错误分类保存HTTP状态、服务商码与脱敏原因；用户标题不能与原因矛盾。
网络失败不得污染成功历史；未知使用量不能记成0。
恢复依赖任务输入、基线、模型设置与经验版本；取消或撤权后重新确认范围。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为“发信超时”和“网页搜索返回空结果”分别写恢复方案；第一步都先取证，不能直接重发或重复安装。

发信先核SMTP/收件方；搜索先核URL、状态与正文，空结果不等于没有资料。

## 自测

完成「API、上下文与更新排障」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 发信先核SMTP/收件方；搜索先核URL、状态与正文，空结果不等于没有资料。

<details><summary>答案与解析</summary>

C。发信先核SMTP/收件方；搜索先核URL、状态与正文，空结果不等于没有资料。

</details>

## 延伸阅读

- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

---

# 023 · 套餐不串门：阿里与火山的正确入口

单元2 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-23) · [总纲](README.zh.md)

## 学习目标

辨认套餐与按量API，避免选错地区、地址和计费产品。

## 原理讲解

先看门口的牌子：小米 Token Plan、Kimi、DeepSeek、阿里云 Token Plan 和火山接口目前存在已知 Bug，暂时无法使用，菜单已标灰。配置可以留着，但不会发出请求，也不会切到备用引擎。
套餐密钥不是万能门卡。阿里云 Token Plan、Coding Plan 和按量付费是独立通道；火山 Coding Plan 也有单独的地址。Koder 把它们分开列出，不会偷偷换到另一条计费路线。

## 准备

只准备不含密钥的控制台产品信息。当前停用入口不做真实连接练习。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第23课 · 套餐不串门：阿里与火山的正确入口 ━━
教练 › 先看门口的牌子：小米 Token Plan、Kimi、DeepSeek、阿里云 Token Plan 和火山接口目前存在已知 Bug，暂时无法使用，菜单已标灰。配置可以留着，但不会发出请求，也不会切到备用引擎。
教练 › 套餐密钥不是万能门卡。阿里云 Token Plan、Coding Plan 和按量付费是独立通道；火山 Coding Plan 也有单独的地址。Koder 把它们分开列出，不会偷偷换到另一条计费路线。
    koder model presets
    koder model models aliyun-token-plan
    koder model models aliyun-coding-plan
    koder model models volcano-coding-plan
    koder model models kimi-code
  提示 · 设置里先选对应套餐，再选型号，最后输入该套餐的密钥。型号、地区和当前席位必须由你的控制台确认；这里的列表不是赠送额度。
  （小声）门牌号写对，比对着 401 多喊几声“开门”管用。
```

无法验证的项写待核查；停用条目标不可用，不填“已测试”。

## 开发者教学

provider路由以预设ID和产品身份为准，不用模型名模糊匹配改变计费。
发现缓存需要更新时间与失败状态；网络失败保留已有配置。
文档中的停用清单与运行时目录应同源核对，不用硬凑30+可用数量。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用自己的无密钥资料填一张“产品→地区→入口→型号→可用性”表。

无法验证的项写待核查；停用条目标不可用，不填“已测试”。

## 自测

完成「套餐不串门：阿里与火山的正确入口」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 无法验证的项写待核查；停用条目标不可用，不填“已测试”。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。无法验证的项写待核查；停用条目标不可用，不填“已测试”。

</details>

## 延伸阅读

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)

---

# 024 · 小米体检：能聊天，还要会交工具作业

单元2 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-24) · [总纲](README.zh.md)

## 学习目标

理解工具调用是完整往返：提出调用、执行、回传、模型续答。

## 原理讲解

小米 Token Plan 暂时检修，请别拿密钥反复试。下面说明只适用于当前可用的接口；灰色入口会直接提示暂时无法使用。
MiMo 的按量付费与 Token Plan 也不能混用密钥。已经配置好模型后，先检查文字，再明确选择工具续答测试。下面命令会真实请求你的 API，可能产生费用；教程只展示，不替你执行。

## 准备

本版MiMo Token Plan入口停用时只做离线理解；真实测试选择当前可用且已授权的服务。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第24课 · 小米体检：能聊天，还要会交工具作业 ━━
教练 › 小米 Token Plan 暂时检修，请别拿密钥反复试。下面说明只适用于当前可用的接口；灰色入口会直接提示暂时无法使用。
教练 › MiMo 的按量付费与 Token Plan 也不能混用密钥。已经配置好模型后，先检查文字，再明确选择工具续答测试。下面命令会真实请求你的 API，可能产生费用；教程只展示，不替你执行。
    koder model show
    koder model test
    koder model test --tools
  提示 · 旧会话说“你好”只该开启当前问候，不该把几百条历史里的旧任务重新开工。想开始新话题可用 /new；想继续旧任务，请说清楚继续哪一项。原始历史不会因为一次问候被删除。
```

工具声明只证明可见；执行回执证明调用结果；最终续答必须依据该结果。

## 开发者教学

用脚本模型构造工具名、参数、call ID与结果配对的正反例；保留实际HTTP错误体的脱敏原因。
分别测试空content但有tool_calls、流式分片、缺少结果和重复call ID。
真实MiMo验收缺Key时写NOT_RUN，不能用兼容桩冒真实套餐通过。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出一次工具往返的四步，标出每步需要的真实证据。

工具声明只证明可见；执行回执证明调用结果；最终续答必须依据该结果。

## 自测

完成「小米体检：能聊天，还要会交工具作业」时，哪种做法符合本课验收？

A. 工具声明只证明可见；执行回执证明调用结果；最终续答必须依据该结果。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。工具声明只证明可见；执行回执证明调用结果；最终续答必须依据该结果。

</details>

## 延伸阅读

- [MIMO.md](../MIMO.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)

---

# 025 · 隐私文件带在包里，断网也能看

单元2 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-25) · [总纲](README.zh.md)

## 学习目标

找到随包隐私全文，知道任务资料会去哪里，并能最小化分享。

## 原理讲解

隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。

## 准备

使用合成资料学习，不在练习中粘贴真实密码、邮件正文或客户数据。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第25课 · 隐私文件带在包里，断网也能看 ━━
教练 › 隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。
    koder privacy consumer
    koder privacy statement
    koder privacy desktop
    koder privacy agreement
    koder privacy sources
  提示 · 这几条只读取本机文件，不需要 API Key。接受许可不会顺手开启学习、同步、音乐、IP 查询或电脑权限。
```

Key不进模型上下文；所选任务内容可能进入模型；写入外部服务另有授权与回执。

## 开发者教学

日志与错误体脱敏覆盖嵌套字段、URL参数和异常cause；原始敏感数据不能进入公开回归夹具。
权限撤销、导出与删除要按实际范围验收，不能靠UI开关文本证明。
打包检查包含隐私全文与来源记录，不复制未经许可的第三方资料。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用虚构项目画一张数据流：本机文件→模型→工具→回执，标出每次外发。

Key不进模型上下文；所选任务内容可能进入模型；写入外部服务另有授权与回执。

## 自测

完成「隐私文件带在包里，断网也能看」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. Key不进模型上下文；所选任务内容可能进入模型；写入外部服务另有授权与回执。

<details><summary>答案与解析</summary>

C。Key不进模型上下文；所选任务内容可能进入模型；写入外部服务另有授权与回执。

</details>

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [PRIVATE-RESOURCES.md](../PRIVATE-RESOURCES.md)

---

# 026 · 找得到人：反馈不是把密钥打包寄来

单元2 · 建议25分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-26) · [总纲](README.zh.md)

## 学习目标

提交可复现、无秘密的反馈，并把撰写任务变成有来源的实际文稿。

## 原理讲解

对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。

## 准备

准备实际错误输出与最短复现；写作练习只提供已核实事实，不暗示不存在的更新。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第26课 · 找得到人：反馈不是把密钥打包寄来 ━━
教练 › 对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。
    koder feedback
  （小声）可以吐槽，欢迎复现步骤。密钥就免礼了，我们真不收。
```

文稿事实可核对，未包含Key或完整私聊；没有声称未执行过的测试。

## 开发者教学

W01类字数检查优先主交付文件而非聊天收尾；保留文件路径和内容哈希。
W02要么有可核查来源，要么明确非增量披露；乱归因仍应失败。
压缩长文记录predecessor路径/哈希；不得新增前稿没有的事实。退出码3是质量门禁，不要误报API故障。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一封不发送的故障邮件：标题含版本；正文有最短复现、实际错误和希望协助的事项。

文稿事实可核对，未包含Key或完整私聊；没有声称未执行过的测试。

## 自测

完成「找得到人：反馈不是把密钥打包寄来」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 文稿事实可核对，未包含Key或完整私聊；没有声称未执行过的测试。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。文稿事实可核对，未包含Key或完整私聊；没有声称未执行过的测试。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)

---

# 027 · 六秒钟的快乐，随时可以散场

单元2 · 建议20分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-27) · [总纲](README.zh.md)

## 学习目标

使用可跳过动画而不打断工作，理解交互展示与脚本输出的区别。

## 原理讲解

代码雨、礼花、烟花、圣诞树、南瓜灯、国庆灯笼、跨年与生日，都在彩蛋菜单里。动画约六秒，任意键立即跳过；不支持动画的终端只显示文字。普通命令、JSON 和脚本输出不会被刷屏。

## 准备

使用交互终端；动画不需要模型，也不代表任务成功。敏感场合先关闭自动效果。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第27课 · 六秒钟的快乐，随时可以散场 ━━
教练 › 代码雨、礼花、烟花、圣诞树、南瓜灯、国庆灯笼、跨年与生日，都在彩蛋菜单里。动画约六秒，任意键立即跳过；不支持动画的终端只显示文字。普通命令、JSON 和脚本输出不会被刷屏。
    koder celebrate
    koder celebrate fireworks
    koder celebrate auto notice
    koder celebrate auto off
  提示 · 默认在已收录节日显示一次祝福，选择 auto on 才自动播放动画。地区日历和农历节日按本机日期识别；自己的纪念日可添加，之后每年自动出现。
    koder celebrate custom --date 03-14 --name "Our day"
```

可跳过且不影响后续输入；效果出现不作为成功验收证据。

## 开发者教学

动画必须恢复光标、raw mode和监听器；取消、异常和自然结束都测试。
TTY、TERM=dumb、CI与JSON路径分别检查，机器输出不得混入ANSI帧。
节日去重按日期与用户设置处理，不能每次命令都播放。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

播放一次、跳过一次、关闭一次；验证之后/help可用。

可跳过且不影响后续输入；效果出现不作为成功验收证据。

## 自测

完成「六秒钟的快乐，随时可以散场」时，哪种做法符合本课验收？

A. 可跳过且不影响后续输入；效果出现不作为成功验收证据。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。可跳过且不影响后续输入；效果出现不作为成功验收证据。

</details>

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 028 · 记住一小格生日，不建立人生档案

单元2 · 建议20分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-28) · [总纲](README.zh.md)

## 学习目标

按用户明确意愿保存最少生日信息，并能查看、更改和关闭。

## 原理讲解

你可以在对话里明确说“记住我的生日是三月十四日”，或使用下面的数字日期。只保存月日，不索要出生年份或年龄。普通提及会先给你选择，他人生日不会变成你的生日。教程不会替你保存示例日期。

## 准备

使用虚构月日演练。不需要出生年份、年龄或证件；日常提到他人生日不等于授权记自己的生日。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第28课 · 记住一小格生日，不建立人生档案 ━━
教练 › 你可以在对话里明确说“记住我的生日是三月十四日”，或使用下面的数字日期。只保存月日，不索要出生年份或年龄。普通提及会先给你选择，他人生日不会变成你的生日。教程不会替你保存示例日期。
    koder celebrate birthday --date 03-14
    koder celebrate birthday forget
  提示 · 生日设置不会自动进入模型或同步。你在普通消息里主动输入的内容，仍按所选模型的正常对话规则处理。
```

最终不保留演练日期，不新增年份或其他个人信息。

## 开发者教学

自然语言意图必须区分本人明确记忆请求、引用与他人信息；不从含糊提及自动持久化。
覆盖非法日期、闰日、重复设置与删除；通知应遵守关闭与去重。
隐私删除验证实际存储，不能只改展示文本。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用虚构日期完成设置→查看→删除，记录最后状态。

最终不保留演练日期，不新增年份或其他个人信息。

## 自测

完成「记住一小格生日，不建立人生档案」时，哪种做法符合本课验收？

A. 只阅读说明，不检查练习结果。

B. 将示例输出当成本机实际执行记录。

C. 最终不保留演练日期，不新增年份或其他个人信息。

<details><summary>答案与解析</summary>

C。最终不保留演练日期，不新增年份或其他个人信息。

</details>

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 029 · 生日歌先问一句，语言由你做主

单元2 · 建议20分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-29) · [总纲](README.zh.md)

## 学习目标

明确选择语言和外部音乐行为，不因生日自动泄露位置或打开有声页面。

## 原理讲解

音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。

## 准备

确认当前环境适合播放声音；语言由用户设置为准，不用IP猜测替代本人选择。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第29课 · 生日歌先问一句，语言由你做主 ━━
教练 › 音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  提示 · 手动语言优先，其次是你主动开启的本地常用语言计数，IP 只作弱提示。IP 查询会让 ipapi.co 看到公网地址；选外部音乐平台会把访问数据交给该平台。每一步都能回车跳过。
  （小声）蛋糕可以多切一块。权限按需给就好。
```

打开不等于播放，播放不等于下载授权；未选择的外部行为没有发生。

## 开发者教学

外部URL校验与浏览器权限沿原入口；不注入账户口令或绕过站点风控。
本地化使用自然表达，日期/语言偏好可独立设置；不能把地区猜测写成用户事实。
把打开失败、播放不可验证与用户拒绝分开记录。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

记录语言设置、是否授权外链、页面打开与实际播放四个独立状态。

打开不等于播放，播放不等于下载授权；未选择的外部行为没有发生。

## 自测

完成「生日歌先问一句，语言由你做主」时，哪种做法符合本课验收？

A. 将示例输出当成本机实际执行记录。

B. 打开不等于播放，播放不等于下载授权；未选择的外部行为没有发生。

C. 只阅读说明，不检查练习结果。

<details><summary>答案与解析</summary>

B。打开不等于播放，播放不等于下载授权；未选择的外部行为没有发生。

</details>

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [APP-USE-AND-LEARN.en.md](../APP-USE-AND-LEARN.en.md)

---

# 030 · 基础训练结课与项目初稿

单元2 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-30) · [总纲](README.zh.md)

## 学习目标

完成可运行、可预览、可核对的项目交付，并交一份有来源的产品文稿。

## 原理讲解

基础训练完成！先收好速查表，后面还有150课专题课堂与毕业项目：
下一步：先用 koder setup 配好模型，然后在你自己的项目里输入 koder。

## 准备

从网站、应用或PPT中选一个真实小需求，放在独立Koder Projects目录。使用合成数据，外部部署和GitHub上传单独确认。

## 示例与解读

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 基础第30课 · 基础训练结课与项目初稿 ━━
教练 › 基础训练完成！先收好速查表，后面还有150课专题课堂与毕业项目：
    koder setup
        设置界面：方向键或鼠标配好一切
    koder
        进入对话
    koder "任务"
        直接干活
    koder ask "问题"
        只读提问
    koder review
        代码审查
    koder fix --check "命令"
        修到通过
    koder test 文件
        补测试
    koder flow run 流程
        编排流程
    koder --moa "任务"
        几个模型一起想
    koder gateway setup 平台
        接入聊天软件
    koder scan
        扫描本机工程
    koder help 命令
        查任何命令的说明
    koder learn 数字
        回到某一课
教练 › 下一步：先用 koder setup 配好模型，然后在你自己的项目里输入 koder。
  提示 · 进入你的项目：cd D:\code\my-app，然后输入 koder。
  （小声）教练下班了。记住：Koder 负责提议，你负责拍板，锅……我们一起背。
  · 最后可以选择保留练习场，或者直接删除。
```

验收五项：能运行、能解释、能验证、能恢复、事实有据。任何一项缺失都写清，截图不能替代运行，脚本模型不能冒真实账号。

## 开发者教学

开发者结课：从干净测试目录按README复现；核验失败基线、最小diff、测试和打包文件。
网页静态预览只绑定本机；不要暴露整个主目录或把公开部署当预览。Netlify登录、站点选择与发布均按已有授权流程。
交件记录版本、SHA、命令/退出码与平台；真实Windows、真实模型、真实账户、签名分别标PASS/FAIL/NOT_RUN。
对照30课完成表找缺口，旧行为回归与新能力验证都保留。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交毕业包：README、可运行产物、测试日志、project-map.html、intro.md、release-email.md和未验清单。不要提交密钥、账号缓存或node_modules。

验收五项：能运行、能解释、能验证、能恢复、事实有据。任何一项缺失都写清，截图不能替代运行，脚本模型不能冒真实账号。

## 自测

完成「基础训练结课与项目初稿」时，哪种做法符合本课验收？

A. 验收五项：能运行、能解释、能验证、能恢复、事实有据。任何一项缺失都写清，截图不能替代运行，脚本模型不能冒真实账号。

B. 只阅读说明，不检查练习结果。

C. 将示例输出当成本机实际执行记录。

<details><summary>答案与解析</summary>

A。验收五项：能运行、能解释、能验证、能恢复、事实有据。任何一项缺失都写清，截图不能替代运行，脚本模型不能冒真实账号。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)

---

# 031 · 找到正确的终端与当前目录

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-31) · [总纲](README.zh.md)

## 学习目标

完成「找到正确的终端与当前目录」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

终端是输入命令的窗口，Shell才是解释命令的程序。Windows Terminal可以同时打开PowerShell和CMD，标签标题不能保证其中运行的解释器。当前目录决定相对路径落在哪里：相同的README.md在两个目录中是两个文件。先确认位置，再让Agent动手，能避免“改好了却找不到”的大多数困惑。

## 准备

先完成第1、4、18课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
PowerShell: Get-Location
CMD: cd
macOS/Linux: pwd
```

输出应是你准备练习的目录；它不必等于Koder安装目录。

## 开发者教学

程序应将workspace显式传给工具；测试要覆盖空格、中文、盘符和启动目录差异。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

创建location-notes.md，记录Shell、绝对路径和一个相对文件名；解释离开目录后该文件名为何指向不同位置。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定；必须重新查看当前位置，不能凭窗口标题判断。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

在新标签打开终端后，上一标签的当前目录一定自动继承吗？

A. 一定继承，只要两个窗口由同一个终端应用打开。

B. 窗口标题相同就说明工作目录相同。

C. 不一定；必须重新查看当前位置，不能凭窗口标题判断。

<details><summary>答案与解析</summary>

C。不一定；必须重新查看当前位置，不能凭窗口标题判断。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 032 · 把文件路径写对：相对、绝对与引号

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-32) · [总纲](README.zh.md)

## 学习目标

完成「把文件路径写对：相对、绝对与引号」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

相对路径是从当前目录出发的路线；绝对路径包含完整起点。引号用于把含空格的路径保持为一个参数，它不会自动转义所有Shell语法。教程中的尖括号是占位符说明，不应该原样输入。用一个名字带空格的练习文件，能很快识别命令究竟收到了几个参数。

## 准备

先完成第31课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
PowerShell: Get-Item "./notes draft.txt"
CMD: dir "notes draft.txt"
macOS/Linux: ls -l "./notes draft.txt"
```

只定位notes draft.txt这个文件，而不是分别寻找notes和draft.txt。

## 开发者教学

路径校验先规范化再检查授权根；符号链接另验，不能把字符串前缀相同当成在工作区内。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

做一张三列表：相对路径、绝对路径、引用方式。用一个中文文件名再验证一次。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能；引号只影响参数解析，权限检查仍必须通过。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

给路径加引号能否让越界文件自动获得读取授权？

A. 只要路径是绝对路径，就不再需要授权。

B. 不能；引号只影响参数解析，权限检查仍必须通过。

C. 可以，引号会同时授予文件系统访问权限。

<details><summary>答案与解析</summary>

B。不能；引号只影响参数解析，权限检查仍必须通过。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 033 · 项目目录：让文件、历史和验收放在一起

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-33) · [总纲](README.zh.md)

## 学习目标

完成「项目目录：让文件、历史和验收放在一起」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

一个项目应有清楚的入口、输出和证据目录。把所有工作放在桌面根目录会使清理、分享和排障都很困难。Koder Projects是用户选定的统一容器，下面每个项目仍应独立；自动新建项目和继续修改已有工程是两种任务，不要让Agent重新建立一个平行副本。

## 准备

先完成第32课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
Koder Projects/
  memoir-site/
    README.md
    src/
    evidence/
```

README写明这是哪个项目、怎么启动、怎么检查；evidence只放脱敏验证记录。

## 开发者教学

新项目路由必须返回实际创建路径；失败不得把默认工作区作为新项目成功回执。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一份项目地图，标出源文件、产物、秘密所在边界和可安全打包的文件。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是；新项目应保持自己的工作区与会话边界。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

新建项目是否等同于把所有旧会话历史复制进去？

A. 不是；新项目应保持自己的工作区与会话边界。

B. 是，新目录必须继承所有项目历史才有上下文。

C. 是，只改目录名就能自动过滤历史中的其他项目资料。

<details><summary>答案与解析</summary>

A。不是；新项目应保持自己的工作区与会话边界。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 034 · 复制命令之前先分清命令与输出

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-34) · [总纲](README.zh.md)

## 学习目标

完成「复制命令之前先分清命令与输出」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

教程通常同时展示要输入的命令、工具输出和解释文字。把提示符、行号或“应该看到”一起粘进去会产生莫名其妙的错误。先运行只读短命令，观察返回，再逐步增加参数，比一次粘贴十行更容易知道错误发生在哪一步。

## 准备

先完成第33课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
输入：koder --version
示例输出：0.4.11
不要输入：koder › koder --version
```

版本由程序返回；示例版本是内容基线，不保证你的电脑正好相同。

## 开发者教学

帮助示例用代码块分隔输入和输出；复制按钮只复制命令，不能混入测试结果。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

把一段混合日志标成“命令/输出/解释”三类，并只重新执行其中无副作用的命令。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，必须保存本机实际执行产生的输出。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

教材里的“示例输出：PASS”能否证明本机已通过？

A. 可以，教材中给出的输出就是本机执行证明。

B. 可以，只需将示例输出复制到本机日志。

C. 不能，必须保存本机实际执行产生的输出。

<details><summary>答案与解析</summary>

C。不能，必须保存本机实际执行产生的输出。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 035 · 看懂退出码：正常结束与失败结束

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-35) · [总纲](README.zh.md)

## 学习目标

完成「看懂退出码：正常结束与失败结束」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

退出码是程序给调用者的简短结果，不是所有错误详情。零通常代表命令定义的成功，非零需要结合该命令契约解释。最后一个命令会覆盖Shell保存的退出码，所以应紧接着读取。对CI而言，漂亮的文字不能抵消非零状态，反过来空输出也不一定失败。

## 准备

先完成第34课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
PowerShell: koder --version; $LASTEXITCODE
CMD: koder --version & echo %ERRORLEVEL%
macOS/Linux: koder --version; echo $?
```

版本查询正常时应为0；命令链和批处理展开规则可能影响读取，应拆行核对。

## 开发者教学

CLI应统一参数错误、业务失败和取消语义；测试断言退出码及关键错误字段，不能只看stderr。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

建立exit-codes.md，记录成功、参数错误和业务检查失败三种情况，不把它们都叫网络故障。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不会；自动化通常看退出码，因此需要检查输出契约而非猜测。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

命令显示“有问题”但退出0，自动化一定会失败吗？

A. 一定会，stderr出现任何文字都会自动改成非零退出码。

B. 不会；自动化通常看退出码，因此需要检查输出契约而非猜测。

C. 一定会，CI会自动理解所有中文错误提示。

<details><summary>答案与解析</summary>

B。不会；自动化通常看退出码，因此需要检查输出契约而非猜测。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 036 · 标准输入：交互终端与管道的区别

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-36) · [总纲](README.zh.md)

## 学习目标

完成「标准输入：交互终端与管道的区别」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

交互输入用于对话，标准输入也可能来自另一个程序。管道的生产者即使暂时没发文字，仍可能保持连接。脚本已有明确任务参数时，不应无限等待输入结束。本课用有界合成生产者观察这件事，不启动长时间睡眠，也不把真实资料交给模型。

## 准备

先完成第35课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
node docs/tutorial-labs/stdin-producer.mjs 100
预期：输出一条合成报告，约100ms后关闭
```

这是本地输入夹具，测试的是数据与EOF，不验证服务商接口。

## 开发者教学

读取stdin需要有界首块等待、取消和资源释放；答案已输出仍不退出也是缺陷。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写出有任务参数、无任务参数、空管道三种预期，并在验收表标明尚未跑真实模型。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是；生产者可能仍打开着管道但暂时没有写入。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

“没有读到字符”是否总等于EOF？

A. 不是；生产者可能仍打开着管道但暂时没有写入。

B. 是，空缓冲区表示生产者已关闭输入。

C. 是，只要等待一次没有字符就可以认为管道关闭。

<details><summary>答案与解析</summary>

A。不是；生产者可能仍打开着管道但暂时没有写入。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 037 · 输出重定向：把日志保存下来

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-37) · [总纲](README.zh.md)

## 学习目标

完成「输出重定向：把日志保存下来」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

标准输出通常承载结果，标准错误通常承载诊断，但每个命令的实际约定要看帮助。把它们合并可以方便人工查错，结构化JSON输出却应避免混入进度文字。日志要记录命令、版本、时间与工作目录；一大串无上下文的截屏无法可靠复现。

## 准备

先完成第36课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
koder --version > version.txt
说明：该命令在支持重定向的Shell里把版本写入文件
```

version.txt里只有实际版本；不要把文件名误写成系统路径。

## 开发者教学

机器输出保持stdout纯净；stderr与进度不能破坏JSON解析。大日志保留原始文件再摘要。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

制作logs目录，放成功与失败各一条记录，并附复现步骤。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不应；只分享必要字段，删除密钥、授权码和私人内容。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

诊断日志是否应该直接上传用户整个配置文件？

A. 应该，完整配置公开后最方便排查。

B. 应该，只要截图打码就可以上传未脱敏原文件。

C. 不应；只分享必要字段，删除密钥、授权码和私人内容。

<details><summary>答案与解析</summary>

C。不应；只分享必要字段，删除密钥、授权码和私人内容。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 038 · 环境变量：临时配置与长期配置

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-38) · [总纲](README.zh.md)

## 学习目标

完成「环境变量：临时配置与长期配置」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

环境变量属于进程的启动环境。当前终端设置后，已运行的另一个窗口不一定能看到；关掉窗口也可能丢失。配置中引用变量名与保存密钥本身是两回事。先用无秘密的演示值观察作用域，再选择已有的凭据保护方式，避免把密钥写进命令历史。

## 准备

先完成第37课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
PowerShell: $env:KODER_DEMO = "lesson"
CMD: set "KODER_DEMO=lesson"
macOS/Linux: export KODER_DEMO="lesson"
```

演示值可公开；它不会绑定任何模型，也不会授予权限。

## 开发者教学

测试使用任务专用变量名与临时HOME替身；不要覆盖HOME、PATH等基础变量导致别的任务损坏。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出终端A、终端B和子进程的环境关系，解释为什么重开进程有时才生效。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不会，已启动进程通常保留创建时继承的环境。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

更新环境变量会自动更新所有正在运行的进程吗？

A. 会，只要变量名称相同，旧进程会自动重载。

B. 不会，已启动进程通常保留创建时继承的环境。

C. 会，环境变量对所有窗口都是实时共享的。

<details><summary>答案与解析</summary>

B。不会，已启动进程通常保留创建时继承的环境。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 039 · 只读探索：动手前先认识仓库

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-39) · [总纲](README.zh.md)

## 学习目标

完成「只读探索：动手前先认识仓库」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

接手仓库时先找入口和测试命令，比让Agent直接重写更稳。README说明用法，包清单说明工具链，测试目录说明已有约束，配置文件说明运行环境。探索的目标是形成可验证的地图，不是阅读全部依赖文件或把仓库内容一次塞给模型。

## 准备

先完成第38课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
给Koder的任务：只读查看README、包清单和测试入口，列出启动方式、验证命令及仍不确定的地方。
```

回答应引用具体文件，并把未知项单列；此任务不修改源文件。

## 开发者教学

工具检索先限定目录与文件类型；引用应携带路径和定位信息，避免只说“代码里写着”。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交repository-map.md，包含入口、测试、约束、三条待确认问题。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能；探索任务没有授权这种跨范围修改。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只读探索可以顺便更新所有依赖吗？

A. 不能；探索任务没有授权这种跨范围修改。

B. 可以，依赖升级属于只读准备工作。

C. 可以，只要升级后没有立即报错就算未改变项目。

<details><summary>答案与解析</summary>

A。不能；探索任务没有授权这种跨范围修改。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 040 · 文件编码、换行与中文路径

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-40) · [总纲](README.zh.md)

## 学习目标

完成「文件编码、换行与中文路径」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

编码决定字节如何变成文字，换行决定每行如何分隔。UTF-8、CRLF和LF属于不同维度。中文乱码可能来自源文件、终端编码或子进程输出，不要一上来给所有文件批量转码。先用很小的中文样本确定哪一层损坏，再做局部修复。

## 准备

先完成第39课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
测试文本：Koder 中文练习，数量 3，金额 750 分。
保存为encoding-sample.txt，记录编辑器显示的编码。
```

编辑器、终端和Koder读到同一句话；没有替换符或丢失标点。

## 开发者教学

读取应明确编码和错误处理；哈希按原字节计算，展示转换不能冒充原始证据。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用一份CRLF和一份LF文本比较差异，说明代码内容相同但字节为何不同。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是；编码与换行是两个独立属性。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

CRLF文件一定不是UTF-8吗？

A. 是，CRLF表示Windows编码，UTF-8只能用LF。

B. 是，把换行改成LF就会自动完成字符编码转换。

C. 不是；编码与换行是两个独立属性。

<details><summary>答案与解析</summary>

C。不是；编码与换行是两个独立属性。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 041 · 多窗口：任务身份与项目边界

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-41) · [总纲](README.zh.md)

## 学习目标

完成「多窗口：任务身份与项目边界」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

多个窗口可以共享安装程序，但不能共享一个可随意覆盖的任务状态。工作区、会话ID和当前任务分别回答在哪里、接哪段历史、正在做什么。同目录多窗口也可能互改同一文件，因此会话隔离不等于文件修改自动没有冲突。

## 准备

先完成第40课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
窗口A：只在project-a写A_ONLY_TEST
窗口B：只在project-b写B_ONLY_TEST
均使用合成文本，不放私人秘密
```

B不应拿A的任务历史回答；磁盘文件也只出现在指定目录。

## 开发者教学

锁须含所有者与存活判断，回收必须有证据；默认会话命名不能让所有工作区共用default。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交A/B两个目录、任务结果和隔离记录；把“会话独立”与“同文件冲突”分开解释。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定；历史可隔离，文件仍可能竞争，需要划分文件或合并差异。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

同目录两窗口编辑同一个文件是否天然安全？

A. 安全，后保存的窗口天然包含先保存窗口的修改。

B. 不一定；历史可隔离，文件仍可能竞争，需要划分文件或合并差异。

C. 安全，会话隔离会自动合并任何文件写入。

<details><summary>答案与解析</summary>

B。不一定；历史可隔离，文件仍可能竞争，需要划分文件或合并差异。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 042 · 差异检查：看见每一个修改

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-42) · [总纲](README.zh.md)

## 学习目标

完成「差异检查：看见每一个修改」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

差异展示旧内容如何变成新内容，不能只凭最终文件看出是否丢掉重要逻辑。先看文件列表，再看每一处增删，最后核对测试和需求。大块格式化会掩盖真正修改，所以一个小修复尽量保持小差异；不相关文件应说明原因或移出本次任务。

## 准备

先完成第41课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
git diff --stat
git diff --check
git diff
前提：练习目录已是你拥有的Git仓库
```

统计告诉你范围，check抓空白问题，完整diff展示实际修改；三者不是同一种验证。

## 开发者教学

自动验收同时查tracked diff与new files；不要用全仓格式化让文件计数看起来像很多工作。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

做一份变更清单，列出修改目的、证据和不在范围的文件。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，它主要检查差异中的空白问题，不能代替运行验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

diff --check通过是否等于功能测试通过？

A. 不是，它主要检查差异中的空白问题，不能代替运行验证。

B. 等于，它会自动执行仓库全部业务测试。

C. 等于，只要没有空白错误就不会有逻辑错误。

<details><summary>答案与解析</summary>

A。不是，它主要检查差异中的空白问题，不能代替运行验证。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 043 · 撤销与恢复：先保护当前工作

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-43) · [总纲](README.zh.md)

## 学习目标

完成「撤销与恢复：先保护当前工作」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

撤销不是把目录一键恢复成某个旧版本。用户可能在Agent工作期间编辑了其他文件，粗暴reset会丢掉这些内容。安全恢复要先识别本轮写入、原有改动和外部副作用，分别处理。文件能逆向恢复，邮件和远程发布却不能靠本地撤销消失。

## 准备

先完成第42课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
恢复说明模板：
本轮文件：...
用户原有改动：...
已发生外部操作：...
拟恢复范围：...
```

先有可审查的恢复范围，再执行具体操作。

## 开发者教学

回退按操作归属与文件前后哈希判断；基线漂移时停止覆盖并请求合并。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交一个最小逆向差异，说明哪些效果可回退、哪些需要外部核对。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能；必须按邮件服务实际能力处理，不能宣称本地撤销已撤信。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

本地回退能撤回已发送的邮件吗？

A. 能，本地Git回退会同步撤销远端发信。

B. 能，删除草稿文件就能从收件箱撤回邮件。

C. 不能；必须按邮件服务实际能力处理，不能宣称本地撤销已撤信。

<details><summary>答案与解析</summary>

C。不能；必须按邮件服务实际能力处理，不能宣称本地撤销已撤信。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 044 · 可复现问题报告：别人照着也能看到

单元3 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-44) · [总纲](README.zh.md)

## 学习目标

完成「可复现问题报告：别人照着也能看到」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

好的问题报告让维护者从相同前置条件到达相同结果。版本、平台、Shell、任务输入、最小文件和实际输出缺一项都可能变成猜谜。报告要同时写预期和实际，不能只有“坏了”。减少样本大小时仍要保留触发条件，尤其是中文路径、并发或管道这样的关键因素。

## 准备

先完成第43课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
标题：Windows PowerShell中带空格路径读取失败
前置：版本、Shell、工作区
步骤：1/2/3
预期：...
实际：错误码与退出码
```

别人无需你的私人账号或完整磁盘即可理解并尝试复现。

## 开发者教学

缺少复现不等于用户没有问题；分类配置、平台、服务、产品逻辑和证据不足。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

完成bug-report.md和最小样本，另列尚未验证的平台。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能；应保留原失败和本轮未复现的边界。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

暂时无法复现时能否把原问题标成已修复？

A. 能，把错误日志删掉可以避免复发记录。

B. 不能；应保留原失败和本轮未复现的边界。

C. 能，只要本次没有出现就说明根因消失。

<details><summary>答案与解析</summary>

B。不能；应保留原失败和本轮未复现的边界。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 045 · 单元项目：做一份可搬走的练习工作区

单元3 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-45) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：做一份可搬走的练习工作区」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

这一课把终端、路径、文件、差异和日志连成一份可交接的工作区。目标不是堆很多文件，而是另一位学习者能够打开README、运行本地检查、看到同一结果。目录可以压缩搬走，但不应携带密码、无关缓存或机器专属绝对路径。

## 准备

先完成第44课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
terminal-lab/
 README.md
 sample.txt
 evidence/commands.txt
 evidence/results.txt
```

README说明Shell和步骤，日志保留成功与失败两类结果。

## 开发者教学

设计交件清单与哈希；压缩包验收要实际解压后检查入口，而不只检查压缩命令退出0。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交压缩包与验收表，至少记录路径、编码、退出码和目录隔离四项。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不足，至少还要在新位置检查文件和运行入口。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

打包命令成功是否足以证明教程可复现？

A. 不足，至少还要在新位置检查文件和运行入口。

B. 足够，压缩工具会自动验证所有运行入口。

C. 足够，包名中带完整教程就说明内容齐全。

<details><summary>答案与解析</summary>

A。不足，至少还要在新位置检查文件和运行入口。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 046 · 模型、引擎与工具：三层不要混淆

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-46) · [总纲](README.zh.md)

## 学习目标

完成「模型、引擎与工具：三层不要混淆」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

模型负责根据上下文生成下一步，Koder执行引擎负责审批、调度、保存回执，工具负责读文件或执行具体动作。换模型不等于换权限，也不自动增加浏览器能力。排障时先确定哪层失败：模型未返回、工具不可用、还是操作已经执行但结果没有送回。

## 准备

先完成第45课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
任务→模型提出调用→Core核授权→工具执行→回执→模型续答
```

每个箭头都有独立失败方式；模型说“完成”不能替代工具回执。

## 开发者教学

provider、executor和tool adapter边界清楚；诊断保留层级、错误码与原始回执引用。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用一份日志标注三层信息，并列出每层一个可验证故障。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不会；电脑授权仍由原权限系统决定。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

换成更强模型会自动得到桌面控制权限吗？

A. 会，更强模型天然拥有更大的系统权限。

B. 会，模型返回一个点击工具名就代表已经授权。

C. 不会；电脑授权仍由原权限系统决定。

<details><summary>答案与解析</summary>

C。不会；电脑授权仍由原权限系统决定。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 047 · 服务商、区域与套餐：选择正确入口

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-47) · [总纲](README.zh.md)

## 学习目标

完成「服务商、区域与套餐：选择正确入口」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

同一厂商可能提供国内、国际、按量和订阅套餐入口，它们的模型ID、鉴权和配额可能不同。网页能登录并不能证明某条API可用。配置的最小单位是服务产品、区域、Base URL、协议和模型ID的组合，而不是只填一个品牌名。

## 准备

先完成第46课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
配置核对表：服务产品 / 区域 / Base URL / 协议 / 模型ID / 凭据来源
```

只记录变量名或已脱敏信息，不记录Key。

## 开发者教学

路由必须按产品显式选取；错误恢复不能静默切换区域并向新主机发送凭据。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

制作两套不同产品的配置对照，标注不可互换字段。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，必须确认该产品的接口和授权范围。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

同厂商的订阅Key一定能用于按量API吗？

A. 一定能，只要改成另一个Base URL就会转换套餐。

B. 不一定，必须确认该产品的接口和授权范围。

C. 一定能，同厂商所有产品共享鉴权与额度。

<details><summary>答案与解析</summary>

B。不一定，必须确认该产品的接口和授权范围。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 048 · 安全录入Key与客户端授权码

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-48) · [总纲](README.zh.md)

## 学习目标

完成「安全录入Key与客户端授权码」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

模型API Key、邮箱客户端授权码和普通登录密码用途不同。隐藏输入只减少屏幕暴露，不代表所有存储都安全。优先使用产品专用凭据入口，确认保存结果并只查看脱敏状态；不要为方便排障把秘密写进对话、README或截图。

## 准备

先完成第47课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
koder setup
在对应服务的专用隐藏输入框录入；测试时只保存状态与错误码。
```

隐藏输入可能不显示字符；应以提交后的状态判断，不能反复粘贴造成重复。

## 开发者教学

凭据失败必须显式返回；测试覆盖取消、空输入、粘贴、存储不可用以及日志不泄漏。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一份不含秘密的绑定检查表，涵盖保存、失败和撤销三步。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以；输入隐藏不改变日志脱敏要求。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

隐藏输入中的密码可以直接写入调试日志吗？

A. 不可以；输入隐藏不改变日志脱敏要求。

B. 可以，隐藏输入说明程序已经把它变成非秘密。

C. 可以，开发模式日志不需要遵守脱敏规则。

<details><summary>答案与解析</summary>

A。不可以；输入隐藏不改变日志脱敏要求。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 049 · 当前账号模型列表与真实能力测试

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-49) · [总纲](README.zh.md)

## 学习目标

完成「当前账号模型列表与真实能力测试」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

模型目录回答账号能看到哪些ID，能力测试回答某个ID是否能完成请求与工具调用。新型号出现在列表里不等于所有工具协议都适配。刷新列表也不应自动替换用户当前模型，否则同一个任务可能在中途变成另一种行为。

## 准备

先完成第48课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
koder model refresh
koder model list
koder model test --tools
```

分别记录刷新、选择和工具测试；成功目录查询不能代替工具测试。

## 开发者教学

发现接口需要缓存与过期提示；能力记录应绑定模型、协议和端点版本。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交模型核对表，包含目录来源、选择时间、文本测试和工具测试状态。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，列出与成功调用是不同证据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

列表里有模型，工具调用测试可以省略吗？

A. 可以，models列表证明该模型全部工具协议正常。

B. 可以，文本问答通过就代表工具参数与回执都通过。

C. 不能，列出与成功调用是不同证据。

<details><summary>答案与解析</summary>

C。不能，列出与成功调用是不同证据。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 050 · 把模糊愿望写成可执行任务

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-50) · [总纲](README.zh.md)

## 学习目标

完成「把模糊愿望写成可执行任务」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

“做得高级一点”描述感受，却没有交付边界。把任务拆成对象、目标、约束和验收，会让Agent更容易实际落盘。不是要求用户写长篇需求，而是用几句具体话消除最昂贵的歧义：改哪一份、谁使用、怎样判断可用。

## 准备

先完成第49课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
请在当前练习目录做一个活动报名页：手机可读，含时间地点和报名按钮；先给3种布局，选定后保存HTML并说明预览方法。
```

任务指定目录、用户场景、选择节点、文件产物与验证方法。

## 开发者教学

任务路由应保留用户原文和后续约束；不能用模板把目标改成泛泛建议。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

将一句“帮我做个工具”改成五行任务，并解释每行消除了什么歧义。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：增加了明确产物与可检查的完成条件。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

指定“交付HTML文件并能预览”比“做漂亮点”多了什么？

A. 只规定了使用哪个编程框架。

B. 增加了明确产物与可检查的完成条件。

C. 只增加了句子长度，没有改变验收方式。

<details><summary>答案与解析</summary>

B。增加了明确产物与可检查的完成条件。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 051 · 验收条件：让完成有证据

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-51) · [总纲](README.zh.md)

## 学习目标

完成「验收条件：让完成有证据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

验收条件描述结果，而不是指定每一行代码。比如购物车总价应按数量计算，比“多写几个测试”更可验证。同时写正常输入、边界输入和失败处理，防止只做一个漂亮演示。验收条件也要有范围，不能把未提供的第三方账号当成默认可测。

## 准备

先完成第50课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
输入：200分×3件+150分×1件
预期：750分
边界：空数组为0，0件贡献0
```

结果可用断言验证，金额单位明确。

## 开发者教学

验收应在修改前冻结关键断言；新增需求变更时记录原因，避免通过删断言完成。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为写作任务也写3条验收：受众、事实来源、字数范围，并给反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能；还需要运行能区分正确与错误的检查。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

“代码看起来合理”可以替代一个明确失败用例吗？

A. 不能；还需要运行能区分正确与错误的检查。

B. 可以，模型自评比测试更能发现边界错误。

C. 可以，只需保证代码格式一致。

<details><summary>答案与解析</summary>

A。不能；还需要运行能区分正确与错误的检查。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 052 · 计划模式、只读问答与执行请求

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-52) · [总纲](README.zh.md)

## 学习目标

完成「计划模式、只读问答与执行请求」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

问“这个项目怎样启动”与“把启动脚本修好”需要不同动作。计划模式帮助梳理步骤，只读问答适合了解代码，执行任务才应修改文件。模式和权限也不同：允许执行并不代表所有命令无须审批；批准一个动作也不等于批准未来所有动作。

## 准备

先完成第51课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
/mode plan
讨论完方案后，明确要求在当前项目实施并验证；用/help查看当前可用模式。
```

状态提示与实际行为一致；只读阶段不产生修改。

## 开发者教学

意图分类不能把技术邮件误判为代码任务；执行语义应沿后续润色与补充保留。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用同一需求写出只读版、计划版、执行版三条提示，解释预期差异。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定；这可能正是当前模式的契约。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只读问答没有写文件，必然是故障吗？

A. 必然是故障，任何ask都必须写文件。

B. 必然是故障，只读模式应该忽略自身限制。

C. 不一定；这可能正是当前模式的契约。

<details><summary>答案与解析</summary>

C。不一定；这可能正是当前模式的契约。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 053 · 中途引导：补充要求但不重做已完成步骤

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-53) · [总纲](README.zh.md)

## 学习目标

完成「中途引导：补充要求但不重做已完成步骤」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

长任务进行时用户往往发现新约束。引导应进入当前任务下一安全边界，排队则等当前回合结束后再执行；两者不是同一体验。连续补充不能重复已经发送的邮件或已提交的代码。真正无法接收引导时应显示原因并保留下一回合输入。

## 准备

先完成第52课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
原任务：生成活动页
中途补充：改为深色背景，报名字段仍只保留姓名和邮箱。
```

后续修改吸收新约束，已完成工具不应无故重放。

## 开发者教学

steering事件需要顺序、任务归属与消费回执；取消后不能悄悄追加到另一个任务。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

记录一轮引导前后要求及产物差异；没有真实运行时标手测待验。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，用户需要知道要求何时生效。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

已排队与已融入当前回合能混用同一成功提示吗？

A. 可以，只要文字留在输入框就代表任务已使用。

B. 不能，用户需要知道要求何时生效。

C. 可以，两者都表示用户文字已被当前模型读取。

<details><summary>答案与解析</summary>

B。不能，用户需要知道要求何时生效。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 054 · 取消与换任务：停下之后发生什么

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-54) · [总纲](README.zh.md)

## 学习目标

完成「取消与换任务：停下之后发生什么」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

取消的目标是阻止后续未批准动作并结束当前执行，不保证已经发生的外部效果被撤回。精确的停词与普通包含stop的句子也应区分。用户说“停下，改做X”时，旧任务取消与新任务排队应分别记录，避免把两者混成继续旧目标。

## 准备

先完成第53课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
停下
stop, say NEXT
普通句：please stop a server after reading the instructions
```

前两种属于明确打断；第三种是任务内容，不能只靠包含stop误取消。

## 开发者教学

取消沿Core控制器传播；已提交效果需要真实收据或对账，不以UI停止代替业务撤销。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

做一张取消矩阵：模型等待、工具运行、审批等待、写入后，分别说明该核对什么。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能保证；必须检查发送回执或收件端状态。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

取消提示出现后，之前发送的邮件一定没发出吗？

A. 不能保证；必须检查发送回执或收件端状态。

B. 一定没发出，取消会撤回此前全部外部效果。

C. 一定没发出，界面停止输出就说明服务器未执行。

<details><summary>答案与解析</summary>

A。不能保证；必须检查发送回执或收件端状态。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 055 · 会话上下文：保留事实，丢掉噪声

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-55) · [总纲](README.zh.md)

## 学习目标

完成「会话上下文：保留事实，丢掉噪声」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

上下文不是越长越好。安装包二进制、长日志和重复讨论会占据窗口，让关键约束变得不明显。好的压缩保留目标、已完成工作、事实证据、剩余问题和权限边界。摘要只能帮助继续任务，不能替代原始回执或把猜测变成事实。

## 准备

先完成第54课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
继续摘要：目标 / 已完成文件 / 检查结果 / 尚未完成 / 禁止重放操作 / 证据路径
```

每个已完成项可回到文件或回执，未知项仍写未知。

## 开发者教学

上下文压缩要保留工具调用关联、未决状态和取消点；压缩后仍能追溯。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一份不超过一页的任务续接卡，另附原始证据入口。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，成功仍要对应原始可核对收据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

压缩后的摘要能证明外部操作已成功吗？

A. 能，摘要文字比原始回执更可信。

B. 能，只要摘要中写着成功就可以删除原记录。

C. 不能，成功仍要对应原始可核对收据。

<details><summary>答案与解析</summary>

C。不能，成功仍要对应原始可核对收据。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 056 · 记忆与任务事实：哪些可以跨项目

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-56) · [总纲](README.zh.md)

## 学习目标

完成「记忆与任务事实：哪些可以跨项目」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

长期偏好如语言和文风，与某个项目的客户资料、文件路径和未完成操作不同。默认工作区隔离用于防止任务事实串仓；明确添加的共享笔记也应有用途与范围。记忆不是越多越聪明，错误记忆会让后续任务持续答偏。

## 准备

先完成第55课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
共享偏好：默认中文，先给可运行结果
项目事实：A项目测试端口、客户名单、未完成付款
```

前者可能适合显式偏好；后者应留在项目边界内。

## 开发者教学

retrieve必须传工作区或conversationId等范围；失败鉴权请求不应污染会话历史。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写记忆准入表：什么能记、在哪记、何时失效、怎样删除。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，秘密不应进入明文记忆，项目事实也要隔离。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

“用户喜欢简洁”与“客户A的密码”能用同一记忆策略吗？

A. 可以，只要记忆文件不是JSON就不算明文存储。

B. 不能，秘密不应进入明文记忆，项目事实也要隔离。

C. 可以，所有信息都应复制到跨项目共享记忆。

<details><summary>答案与解析</summary>

B。不能，秘密不应进入明文记忆，项目事实也要隔离。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 057 · 模型错误分层：401、429、审核与协议

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-57) · [总纲](README.zh.md)

## 学习目标

完成「模型错误分层：401、429、审核与协议」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

错误标题应帮助用户下一步做对事。鉴权、限流、服务端失败、内容审核和工具协议异常的恢复方法不同。MiniMax的1026/1027属于服务商审核信息时，不应笼统显示断网；也不能靠绕过审核来“修复”。先保留脱敏原因，再调整合法任务表达和不必要的大段输入。

## 准备

先完成第56课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
排障字段：HTTP状态 / providerCode / 脱敏reason / endpoint主机 / 模型ID / 请求阶段
```

不记录Authorization头；标题与服务商原因应一致。

## 开发者教学

非2xx也应有限读取并脱敏响应体；错误归类保留原code，避免标题与原因矛盾。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交4类错误的用户提示稿和恢复步骤，明确哪些需要服务方支持。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应结合服务商错误码识别审核或输入问题。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

422同时带1026时能直接断言用户没网吗？

A. 不能，应结合服务商错误码识别审核或输入问题。

B. 能，所有HTTP 4xx都表示网络无法连接。

C. 能，有余额时任何报错都只能是断网。

<details><summary>答案与解析</summary>

A。不能，应结合服务商错误码识别审核或输入问题。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 058 · 预算与耗时：先设边界再开始

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-58) · [总纲](README.zh.md)

## 学习目标

完成「预算与耗时：先设边界再开始」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

任务成本来自模型请求、工具执行和外部服务，不能只看最终回答长度。设置预算帮助及时缩小范围，取消与超时则保护资源。提高时间上限可以适应长任务，但不能掩盖死循环。阶段产物和进度证据比长时间无声等待更有用。

## 准备

先完成第57课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
任务说明：先在30分钟学习练习内完成最小可运行版本；外部付费操作先列出范围；每个阶段保存结果。
```

这里是任务范围约定，不是宣称产品存在某个未实现的预算参数。

## 开发者教学

成本未知不能记作零；超时后保留终端输出、子进程归属和已完成产物。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

给一个网站任务做低、中、高三档范围，说明取舍而不是编造价格。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，也可能是阻塞、未关闭输入或失去进展。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

等待越久就一定代表任务更认真吗？

A. 一定，等待时间就是思考质量的直接指标。

B. 一定，任务只要不结束就算持续有进展。

C. 不是，也可能是阻塞、未关闭输入或失去进展。

<details><summary>答案与解析</summary>

C。不是，也可能是阻塞、未关闭输入或失去进展。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 059 · 让回复落实：从建议到文件、测试与交付

单元4 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-59) · [总纲](README.zh.md)

## 学习目标

完成「让回复落实：从建议到文件、测试与交付」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

用户要一个网站或文稿时，只有方法建议常常不够。完成需要可打开的产物、验证方式和限制说明。编程应给具体文件与运行命令，撰写应给正文文件和事实来源。最终汇报要短而具体，不能用“已全面优化”掩盖未完成事项。

## 准备

先完成第58课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
最终交件：产物路径 / 做了什么 / 实际检查与退出码 / 尚未验证 / 下一步
```

每项都能被使用者独立核对，不把计划列成完成。

## 开发者教学

交付门应识别本轮实际写入主文件并保存证据字段；失败门不能误报API故障。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为同一个任务写一份空泛汇报和一份证据化汇报，逐项比较。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，需要读取文件或检查实际产物。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

聊天说“文件已生成”就等于文件真的存在吗？

A. 等于，用户要求写入就表示写入已经发生。

B. 不等于，需要读取文件或检查实际产物。

C. 等于，模型生成了文件名就会自动生成文件。

<details><summary>答案与解析</summary>

B。不等于，需要读取文件或检查实际产物。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 060 · 单元项目：建立自己的任务委托模板

单元4 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-60) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：建立自己的任务委托模板」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

本单元最终产物是一张可重复使用的任务委托卡。它应该短到用户愿意填写，又足够明确地约束执行。模板不是把每个任务都变成漫长问卷，而是在关键位置提醒：对象、目标、范围、验收、预算和恢复。用真实小练习验证模板是否让交付更具体。

## 准备

先完成第59课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
目标：...
工作区：...
交付物：...
必须保留：...
验收：...
需确认的外部动作：...
```

每一栏服务于执行或验证，空白项可明确写不适用。

## 开发者教学

模板版本化但保留用户原始意图；预填只填草稿，不能自动提交或批准动作。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交委托卡、产物和复盘，至少指出一次约束怎样改变了执行结果。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，价值在于消除关键歧义并给出可核对的交付条件。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

可执行任务模板的核心价值是越长越好吗？

A. 不是，价值在于消除关键歧义并给出可核对的交付条件。

B. 是，任务字数越多就越容易验收。

C. 是，重复同一句要求能代替具体产物定义。

<details><summary>答案与解析</summary>

A。不是，价值在于消除关键歧义并给出可核对的交付条件。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)

---

# 061 · 读代码的第一步：输入、输出与副作用

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-61) · [总纲](README.zh.md)

## 学习目标

完成「读代码的第一步：输入、输出与副作用」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

阅读函数先问它接收什么、返回什么、还改变了什么。返回值之外的文件写入、网络请求和全局变量修改都属于副作用。用几个小输入手算一遍，通常比逐字解释语法更快发现业务规则。本课以原有购物车为例，不需要先学完一门语言。

## 准备

先完成第60课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
export function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

这个实现忽略qty；200分三件仍只加200分，说明输入契约未落实。

## 开发者教学

纯函数易测；副作用放边界层，输入验证与计算职责清楚。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用自己的话写函数契约：合法输入、输出单位、边界和是否修改参数。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还应检查输入对象和外部状态是否改变。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只看返回值正确是否能证明函数没有偷偷改输入？

A. 能，返回值正确意味着函数一定是纯函数。

B. 能，输入对象只要没有重新赋值就不会改变。

C. 不能，还应检查输入对象和外部状态是否改变。

<details><summary>答案与解析</summary>

C。不能，还应检查输入对象和外部状态是否改变。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 062 · 先复现再修：给bug一个最小用例

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-62) · [总纲](README.zh.md)

## 学习目标

完成「先复现再修：给bug一个最小用例」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

修复前必须证明当前实现会在一个具体输入上失败。最小复现避免环境噪声，能说明修复针对什么。若测试一直通过，可能未触发问题或断言太弱；此时应改进复现，不该为了“红灯”随意破坏代码。原错误和失败输出要保存。

## 准备

先完成第61课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
import assert from "node:assert/strict";
assert.equal(total([{price:200,qty:3}]),600);
```

错误实现返回200，断言失败；正确预期由数量规则独立计算。

## 开发者教学

回归测试应在旧实现红、新实现绿；检查失败是否真的来自目标行为。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交最小复现、失败日志和一段根因解释，修复前不改测试答案。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，那是在改业务期望以迎合错误实现。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

为了让修复通过而把600改成200可以吗？

A. 可以，只要这样能把红色测试变绿。

B. 不可以，那是在改业务期望以迎合错误实现。

C. 可以，测试应该始终适应当前实现。

<details><summary>答案与解析</summary>

B。不可以，那是在改业务期望以迎合错误实现。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 063 · 最小修复：改一处但覆盖完整规则

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-63) · [总纲](README.zh.md)

## 学习目标

完成「最小修复：改一处但覆盖完整规则」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

最小修复不是最少字符，而是只触碰解决问题必要的行为。补上qty后仍要检查空数组、零数量和输入是否被修改。避免借修一个bug顺便换框架或格式化全仓，因为这会让审查、回退和归因都困难。

## 准备

先完成第62课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
return items.reduce((sum, item) => sum + item.price * item.qty, 0);
```

两项200×3和150×1得到750；空数组仍为0。

## 开发者教学

修复范围与故障证据对应；不要删除断言或把异常吞成默认成功。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交修前/修后结果、完整差异和一个仍未定义的输入边界。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，仍要确认没有破坏原行为。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

最小修复意味着可以不跑已有测试吗？

A. 不是，仍要确认没有破坏原行为。

B. 意味着，改动行数少就没有回归风险。

C. 意味着，只测试新代码一行就足够。

<details><summary>答案与解析</summary>

A。不是，仍要确认没有破坏原行为。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 064 · 边界值：空、零、负数与缺失

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-64) · [总纲](README.zh.md)

## 学习目标

完成「边界值：空、零、负数与缺失」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

常见bug藏在默认路径以外。空集合、数量0、负数、缺失字段、超大值应分别考虑，因为它们不是同一种无效输入。先决定业务规则，再实现。比如退款可能允许负数，而购物车下单不允许；教程不能替业务方偷定规则。

## 准备

先完成第63课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
边界表：[]→0；qty=0→0；qty缺失→需定义；qty<0→按业务规则拒绝或支持
```

未定义项写明待确认，不能拿任意实现当规范。

## 开发者教学

验证放在明确边界；错误类型和信息可区分，避免所有非法输入返回0。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一张边界矩阵并实现至少4个测试，其中1个验证拒绝非法输入。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，空集合合法与参数缺失可能有不同契约。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

空数组和缺少items参数是同一个输入吗？

A. 相同，JavaScript会自动把缺失参数变成空数组。

B. 相同，两者必须一律返回同一个值而不用定义契约。

C. 不是，空集合合法与参数缺失可能有不同契约。

<details><summary>答案与解析</summary>

C。不是，空集合合法与参数缺失可能有不同契约。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 065 · 错误处理：让失败可理解、可恢复

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-65) · [总纲](README.zh.md)

## 学习目标

完成「错误处理：让失败可理解、可恢复」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

错误处理不是尽量不抛异常，而是让调用者知道出了什么事、是否已产生副作用、下一步如何恢复。吞掉异常返回空结果可能导致用户误以为没有数据。对外错误需要脱敏，对内证据需要可追溯，两者可以通过错误ID关联。

## 准备

先完成第64课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
{ok:false, code:"INVALID_QUANTITY", field:"qty", retryable:false}
```

可区分输入错误与网络失败；不包含秘密或堆栈中的私人路径。

## 开发者教学

原始cause保留在受控诊断，用户消息简明；重试标记基于操作语义。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为一个文件读取工具设计不存在、无权限和读取中断三种错误返回。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，捕获只是获得控制权，仍需正确报告失败或未知。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

异常被捕获后，操作就可以无条件记成功吗？

A. 可以，不再抛异常等于外部操作成功。

B. 不能，捕获只是获得控制权，仍需正确报告失败或未知。

C. 可以，进入catch就说明错误已经被修复。

<details><summary>答案与解析</summary>

B。不能，捕获只是获得控制权，仍需正确报告失败或未知。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 066 · 异步任务：等待完成而不是等待一会儿

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-66) · [总纲](README.zh.md)

## 学习目标

完成「异步任务：等待完成而不是等待一会儿」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

异步代码的关键是等待实际完成信号。固定sleep可能在快机器浪费时间，在慢机器仍然太短。Promise表达结果或失败，await把后续步骤放到完成之后。测试要检查等待关系，而不是靠偶然时序通过。

## 准备

先完成第65课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
async function load(loadText) {
  const text = await loadText();
  return text.trim();
}
```

trim发生在文本加载后；加载失败应传播或按契约处理。

## 开发者教学

测试用可控deferred而非任意sleep；取消和清理也应等待实际完成。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

将一个回调示例改为Promise，保留成功、失败和回调只完成一次的行为。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应等待写入操作的完成信号。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

sleep 1秒能可靠证明异步写入已经完成吗？

A. 不能，应等待写入操作的完成信号。

B. 能，任何写入都会在一秒内结束。

C. 能，把等待加到十秒就成为完成证明。

<details><summary>答案与解析</summary>

A。不能，应等待写入操作的完成信号。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 067 · 取消与超时：两条不同的控制路径

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-67) · [总纲](README.zh.md)

## 学习目标

完成「取消与超时：两条不同的控制路径」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

超时是时间预算到达，取消是用户或上层明确停止。两者可以共用AbortSignal，但日志要保留原因。超时不证明外部操作没有发生，尤其是写请求已发送之后。可取消函数还需要释放监听器、文件句柄和子进程，而不是只让界面停止转圈。

## 准备

先完成第66课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
const controller = new AbortController();
controller.abort(new Error("user cancelled"));
// 将signal传入支持取消的操作
```

消费者需要真实响应signal；只创建控制器不会自动停止所有工作。

## 开发者教学

计时器应清除，取消监听应解除；保存真实回执优先于汇报已停止。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出未开始、运行中、已提交、结果未知四态及取消后的处理。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不意味着，可能已写入但回执丢失，需要对账。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

请求超时意味着服务器一定没有写入吗？

A. 一定没有写入，因为客户端已放弃等待。

B. 一定没有写入，因为没有收到成功文本。

C. 不意味着，可能已写入但回执丢失，需要对账。

<details><summary>答案与解析</summary>

C。不意味着，可能已写入但回执丢失，需要对账。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 068 · 性能优化：先量瓶颈再改算法

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-68) · [总纲](README.zh.md)

## 学习目标

完成「性能优化：先量瓶颈再改算法」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

性能问题需要相同输入、相同环境和可比较指标。一次很快的运行可能来自缓存，不代表算法提升。先确定规模增长怎样影响耗时，再选择数据结构。优化后还要验证输出完全一致，不能为了跑得快而跳过必要数据。

## 准备

先完成第67课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
基线：对每个用户遍历全部订单
改进：先按userId建立Map，再逐用户查找
```

理想复杂度可从重复扫描降为一次索引加查询；实际收益要测量。

## 开发者教学

基准应避免把启动时间混入核心算法却不说明；记录峰值内存与异常值。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交小/中/大三档规模表和输出一致性断言，不编造百分比。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还要证明结果正确且比较条件一致。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只要时间更短就能宣布优化成功吗？

A. 能，只比较一次最快结果即可。

B. 不能，还要证明结果正确且比较条件一致。

C. 能，耗时更短即可忽略结果差异。

<details><summary>答案与解析</summary>

B。不能，还要证明结果正确且比较条件一致。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 069 · 重构：改变结构但保持行为

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-69) · [总纲](README.zh.md)

## 学习目标

完成「重构：改变结构但保持行为」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

重构的价值在于让代码更易理解和维护，外部行为应保持稳定。开始前列出公共接口、错误语义和副作用，再用测试保护。把回调改成async/await时，错误传播、执行顺序和重复回调处理最容易变化。一次重构尽量不混入新功能。

## 准备

先完成第68课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
重构契约：输入不变 / 输出不变 / 错误不变 / 顺序不变 / 副作用次数不变
```

“代码更短”不是行为保持的证据。

## 开发者教学

对行为未定义的边界先记录，不用重构名义改变它；依赖注入可减少测试耦合。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交重构前后对照与至少一个错误路径测试。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不属于，应作为行为变更单独说明与验收。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

重构时顺便改变默认返回值属于纯重构吗？

A. 不属于，应作为行为变更单独说明与验收。

B. 属于，只要函数名没变就不算行为改变。

C. 属于，默认值不需要纳入兼容性测试。

<details><summary>答案与解析</summary>

A。不属于，应作为行为变更单独说明与验收。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 070 · 模块边界：拆文件要有理由

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-70) · [总纲](README.zh.md)

## 学习目标

完成「模块边界：拆文件要有理由」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

拆模块的依据是职责和变化原因，而不是文件超过某个行数。稳定计算逻辑、外部IO和展示层分开后，测试更容易，也更容易看出权限在哪里。过度拆分会让读者在十个文件间跳来跳去，所以每个模块应有清楚接口与单一主要目的。

## 准备

先完成第69课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
domain/cart.mjs：计算
ports/storage.mjs：存储接口
cli.mjs：参数、显示与退出码
```

业务计算不直接读取终端输入；CLI不复制计算规则。

## 开发者教学

依赖由外向内，核心不依赖平台细节；接口变化需要调用者回归。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为购物车分离计算与文件读取，写出依赖方向图。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，边界必须减少耦合或明确职责。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

把一个函数拆成五个转发文件一定更好维护吗？

A. 一定，文件越多职责越清楚。

B. 一定，每层转发都必然减少耦合。

C. 不一定，边界必须减少耦合或明确职责。

<details><summary>答案与解析</summary>

C。不一定，边界必须减少耦合或明确职责。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 071 · 依赖管理：添加一个包意味着什么

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-71) · [总纲](README.zh.md)

## 学习目标

完成「依赖管理：添加一个包意味着什么」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

依赖会影响安装体积、兼容性、许可和供应链。先看现有能力能否完成任务，再考虑新增包。锁文件记录解析结果，不能随手删除以“修复安装”。更新前要理解变更范围，尤其是跨大版本或原生模块可能影响Windows与macOS。

## 准备

先完成第70课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
依赖评估：用途 / 是否已有替代 / 版本约束 / 许可 / 安装与运行平台 / 回退
```

评估记录与实际包清单一致，不只看下载量。

## 开发者教学

打包需包含运行期依赖和许可；开发期依赖不应无故进入用户包。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为一个候选依赖写采用与不采用两种方案，并给出可验证取舍。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，反而可能引入未控制的版本变化。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

删除锁文件就能保证安装更稳定吗？

A. 能，锁文件只影响格式不影响依赖版本。

B. 不能，反而可能引入未控制的版本变化。

C. 能，每次安装最新版本最可重复。

<details><summary>答案与解析</summary>

B。不能，反而可能引入未控制的版本变化。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 072 · 代码图：从调用关系定位影响范围

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-72) · [总纲](README.zh.md)

## 学习目标

完成「代码图：从调用关系定位影响范围」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

代码图展示定义、调用和依赖，适合回答改一个接口会影响谁。图只能反映索引器理解到的关系，动态导入、反射和运行时路由可能缺失。把图作为导航，再回到源码和测试核实；节点很多不代表分析准确。

## 准备

先完成第71课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
问题：修改total的参数，会影响哪些调用者与测试？
证据：定义路径、引用路径、实际调用示例。
```

每条关键关系能打开对应代码核对。

## 开发者教学

图查询应返回版本和证据位置；不能把静态不可达当成运行时绝不调用。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一张小影响图和3条需要回归的行为，不要求画全仓。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还要排查动态引用、公开接口与运行时入口。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

代码图没显示调用者，能立即删除函数吗？

A. 不能，还要排查动态引用、公开接口与运行时入口。

B. 能，静态图缺边就是未使用的完整证明。

C. 能，只需搜索函数名在一个文件中出现几次。

<details><summary>答案与解析</summary>

A。不能，还要排查动态引用、公开接口与运行时入口。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 073 · 调试日志：记录状态而不是倾倒数据

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-73) · [总纲](README.zh.md)

## 学习目标

完成「调试日志：记录状态而不是倾倒数据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

有用日志说明发生了什么、属于哪个任务、处于哪个阶段。大量原始对象可能泄漏秘密，也让关键错误淹没。给每次操作一个稳定ID，记录开始、完成或未知，并保留可读取的原始证据路径。日志既服务用户，也服务之后的故障重建。

## 准备

先完成第72课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
{operationId:"demo-1", stage:"validate", state:"failed", code:"INVALID_INPUT"}
```

结构化字段可过滤；没有凭据和完整私人内容。

## 开发者教学

事件先持久化再更新状态；未知不等于零成本或没有副作用。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计一组成功、失败、取消、未知日志，并写一个筛选规则。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，字段质量、关联和脱敏更重要。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

日志越多就一定越可诊断吗？

A. 一定，把密钥与完整请求写入日志最可诊断。

B. 一定，每条循环都打印全文就不需要关联ID。

C. 不是，字段质量、关联和脱敏更重要。

<details><summary>答案与解析</summary>

C。不是，字段质量、关联和脱敏更重要。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 074 · 代码审查：找风险并给出可操作意见

单元5 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-74) · [总纲](README.zh.md)

## 学习目标

完成「代码审查：找风险并给出可操作意见」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

审查不是评价风格好不好看，而是找会造成错误、数据损失、权限问题或维护困难的具体变化。意见要包含触发条件、影响和证据。看不到问题也应说明检查范围，不要把“未发现”写成全面安全保证。例如“空数组会访问首项并抛错”比“代码不够健壮”更可操作：前者给出了输入、出错位置与修复后应验证的行为。审查建议不应偷偷变成未经授权的全仓改写。

## 准备

先完成第73课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
意见模板：当输入X时，路径Y会返回Z；这与规则R冲突。建议补用例T并修正此分支。
```

意见可复现、定位准确，避免“建议优化”这种空话。

## 开发者教学

结构化审查需固定schema和失败语义；空结果与未解析结果分开。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写两条高质量审查意见，并删除一条只涉及个人偏好的无效意见。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，解析失败并不等于没有问题。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

审查结果解析失败但findings为空，可以判定通过吗？

A. 可以，只要进程退出0就不必看parsed字段。

B. 不可以，解析失败并不等于没有问题。

C. 可以，空数组天然代表没有审查发现。

<details><summary>答案与解析</summary>

B。不可以，解析失败并不等于没有问题。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 075 · 单元项目：从红灯到可审查修复

单元5 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-75) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：从红灯到可审查修复」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

本次项目要求完整走过复现、定位、修复、回归、差异和交件。代码量可以很小，但证据要闭环。用教材购物车缺陷，保留原始失败，补数量与空输入测试，再修实现。最后写给另一个开发者的说明，不用夸大词汇。

## 准备

先完成第74课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
交件目录：src/、test/、evidence/red.txt、evidence/green.txt、CHANGE-NOTE.md
```

红灯来自真实缺陷，绿灯来自正确实现，原断言仍存在。

## 开发者教学

把红绿证据与源码版本绑定；能复现的最小修复比无法归因的大改更可靠。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

完成修复包，评分依据为复现、正确性、边界、差异范围、说明五项。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，是问题、改动和验证能一一对应。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

修复交件最关键的是文件数量多吗？

A. 不是，是问题、改动和验证能一一对应。

B. 是，修改越多文件说明修复越全面。

C. 是，日志长度比失败复现更重要。

<details><summary>答案与解析</summary>

A。不是，是问题、改动和验证能一一对应。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 076 · 网站需求：先确定访客要完成什么

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-76) · [总纲](README.zh.md)

## 学习目标

完成「网站需求：先确定访客要完成什么」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

网站设计从访客任务开始。报名页要让人理解活动并完成报名，产品页要帮助比较和决定，作品集要让人判断能力。先明确一个主要动作，再安排信息顺序。漂亮动画如果挡住时间地点和按钮，反而降低可用性。本单元贯穿“社区读书会报名页”这个合成项目。

## 准备

先完成第75课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
访客：第一次参加的居民
主要动作：了解时间地点后报名
必要信息：主题、日期、地点、费用说明、联系方法
```

每块内容都服务访客决策，尚未确定的信息标占位。

## 开发者教学

需求映射到可测试行为；文案数据与布局分离便于替换。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一页brief及内容清单，标出事实来源和待补项。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，应帮助访客完成主要任务。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

网站首要目标是展示最多动画吗？

A. 是，动画数量是网站的唯一验收指标。

B. 是，先做全部特效再决定访客目标。

C. 不是，应帮助访客完成主要任务。

<details><summary>答案与解析</summary>

C。不是，应帮助访客完成主要任务。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 077 · 信息架构：把内容排成可理解的顺序

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-77) · [总纲](README.zh.md)

## 学习目标

完成「信息架构：把内容排成可理解的顺序」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

信息架构决定访客先看到什么、在哪找到答案。按问题组织内容通常比按公司部门组织更容易理解。读书会页可以按主题、适合谁、时间地点、活动流程、报名排列。导航标题要具体，避免每段都叫“更多信息”。

## 准备

先完成第76课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
主题→适合谁→时间地点→活动流程→报名→常见问题
```

读者不需要往返翻找关键条件。

## 开发者教学

路由与导航数据单一来源；测试关键锚点和空内容状态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画信息结构图并给每段写一句目的说明。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：通常不够，应体现用户寻找的具体内容。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

导航叫“栏目一、栏目二”是否足够清楚？

A. 足够，只要颜色不同就不必描述内容。

B. 通常不够，应体现用户寻找的具体内容。

C. 足够，标题只用来装饰，具体信息藏在页面内。

<details><summary>答案与解析</summary>

B。通常不够，应体现用户寻找的具体内容。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 078 · 三种版式：用结构差异帮助选择

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-78) · [总纲](README.zh.md)

## 学习目标

完成「三种版式：用结构差异帮助选择」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

三个方案应该有不同的信息组织，而不仅是换颜色。可比较“海报导向”“流程导向”“编辑式叙事”，分别适合快速吸引、解释过程和讲清故事。每个方案保留同一份事实内容，才不会把文案差异误当成布局优劣。

## 准备

先完成第77课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
A：大标题+日期地点+报名
B：活动流程时间线+侧边报名
C：主办者故事+活动内容+报名
```

三案主要动作相同，但阅读路径不同。

## 开发者教学

复用内容模型与组件，避免三套业务逻辑；方案选择后清理未采用入口。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交三案截图或HTML草图与比较表，明确选案依据。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不算，应该体现布局和阅读顺序的实质差异。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只换背景色算三种真正不同版式吗？

A. 不算，应该体现布局和阅读顺序的实质差异。

B. 算，每种背景色就是一种信息架构。

C. 算，只要截图文件名不同就是三案。

<details><summary>答案与解析</summary>

A。不算，应该体现布局和阅读顺序的实质差异。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 079 · 语义HTML：让页面不仅看起来像按钮

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-79) · [总纲](README.zh.md)

## 学习目标

完成「语义HTML：让页面不仅看起来像按钮」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

HTML标签表达内容角色。button用于动作，a用于导航，标题有层级，表单字段有标签。用div加点击事件可能看起来可用，却缺少键盘行为和语义。先建立正确结构，再用CSS美化，通常更容易得到可访问、可测试的页面。

## 准备

先完成第78课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
<main>
 <h1>社区读书会</h1>
 <a href="#signup">查看报名表</a>
 <button type="button">展开活动须知</button>
</main>
```

链接跳转位置，按钮执行动作；标题描述当前页面主题。

## 开发者教学

组件接口应保留原生属性；避免覆盖浏览器已有键盘行为。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

将一个全div草稿改成语义结构，记录行为没有丢失。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等价，按钮具备原生语义和键盘交互。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

一个可点击div天然等价于button吗？

A. 等价，有click事件就自带键盘与辅助技术语义。

B. 等价，只要设置cursor:pointer即可。

C. 不等价，按钮具备原生语义和键盘交互。

<details><summary>答案与解析</summary>

C。不等价，按钮具备原生语义和键盘交互。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 080 · CSS层级：字号、间距和对比

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-80) · [总纲](README.zh.md)

## 学习目标

完成「CSS层级：字号、间距和对比」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

视觉层级帮助读者分清主题、说明和次要信息。用少量字号、稳定间距和足够对比比到处加粗更有效。先在黑白状态下看清层级，再加品牌色。每个强调都应有理由，否则整页都重要就等于没有重点。例如把活动日期从一段小灰字移到标题下方，可降低寻找成本；把所有正文都增大则可能挤压报名表。每次只调整一组变量，用相同内容和窗口宽度比较。

## 准备

先完成第79课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
正文16px起作练习基线；标题按层级递减；按钮与正文之间留出可识别间距。
```

具体字号需在目标设备上验证，不是所有站点统一数值。

## 开发者教学

设计变量集中管理；视觉回归关注溢出、对比和内容长度变化。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交一张样式表与修改前后对照，解释3处层级调整。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：通常不会，会消除主次层级。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

所有段落都加粗会更清楚吗？

A. 会，层级只由字体粗细决定。

B. 通常不会，会消除主次层级。

C. 会，所有信息强调后主次关系更明确。

<details><summary>答案与解析</summary>

B。通常不会，会消除主次层级。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 081 · 响应式布局：按内容断点而不是设备名字

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-81) · [总纲](README.zh.md)

## 学习目标

完成「响应式布局：按内容断点而不是设备名字」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

响应式是让同一内容在不同宽度下仍可理解和操作。宽屏双栏到窄屏单栏只是起点，还要处理长链接、表格、按钮和导航。不要只在一种手机尺寸验收；内容长度、浏览器缩放和系统字体也会影响布局。可先在360、768与1280像素宽度下检查练习页，但这些只是取样点。继续拖动窗口，观察两栏开始挤压的位置，以内容能否正常阅读来决定断点。

## 准备

先完成第80课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
窄屏：标题→关键信息→报名
宽屏：正文+报名侧栏
相同内容，不丢弃关键字段
```

切换宽度后没有横向滚动和被遮挡的按钮。

## 开发者教学

布局使用弹性约束；测试不仅检查截图，还要检查真实可点区域。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

记录至少3个宽度下的截图和问题清单，修复后复核。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，关键内容必须保留并合理重排。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

响应式可以在手机上直接隐藏报名条件吗？

A. 不能，关键内容必须保留并合理重排。

B. 可以，小屏幕用户不需要完整报名条件。

C. 可以，只要桌面版保留就算移动版完整。

<details><summary>答案与解析</summary>

A。不能，关键内容必须保留并合理重排。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 082 · 表单：输入、校验与错误提示

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-82) · [总纲](README.zh.md)

## 学习目标

完成「表单：输入、校验与错误提示」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

表单应告诉用户填什么、为什么失败、怎样修正。必填标识和格式提示尽量提前给出，提交失败后保留已填内容。前端校验提升体验，后端校验保护数据，两者都需要。没有接后端的演示页必须标明只演示，不能显示真的报名成功。

## 准备

先完成第81课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
字段：姓名、邮箱
错误：邮箱格式不完整，请补齐@example.com部分
演示状态：仅本地校验，尚未提交服务器
```

错误贴近字段，状态明确，不伪造远程提交。

## 开发者教学

服务端再次验证；避免把用户输入直接拼进HTML或查询。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交表单正常、空值、错误格式和网络失败四种状态。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，还需要真实提交结果。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

前端校验通过就证明服务器已收到报名吗？

A. 证明了，浏览器格式校验就是远程提交回执。

B. 证明了，按钮禁用后请求必定成功。

C. 不是，还需要真实提交结果。

<details><summary>答案与解析</summary>

C。不是，还需要真实提交结果。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 083 · 状态设计：加载、空结果、失败与成功

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-83) · [总纲](README.zh.md)

## 学习目标

完成「状态设计：加载、空结果、失败与成功」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

完整页面不只有数据正常时的一张图。加载要解释正在做什么，空结果要给下一步，失败要保留输入并提供恢复方式，成功要对应真实结果。重复点击提交可能造成重复操作，因此按钮状态与幂等处理要配合，不能只靠禁用按钮。

## 准备

先完成第82课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
idle→submitting→confirmed
              ↘ failed / unknown
```

unknown表示无法确认结果，不等同于未提交。

## 开发者教学

状态机与业务收据对应；UI禁用不能代替后端幂等。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

制作状态展示页，保留4种以上可切换状态。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：通常不是，会增加用户重做成本。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

加载失败后清空全部输入是好恢复吗？

A. 是，用户输入属于失败状态所以必须删除。

B. 通常不是，会增加用户重做成本。

C. 是，清空可以让用户重新输入全部资料。

<details><summary>答案与解析</summary>

B。通常不是，会增加用户重做成本。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 084 · 浏览器预览：打开页面不等于运行正确

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-84) · [总纲](README.zh.md)

## 学习目标

完成「浏览器预览：打开页面不等于运行正确」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

预览分静态文件、开发服务器和部署环境。静态HTML可能直接打开，模块加载和API请求通常需要HTTP环境。开发服务器启动后要核对端口和实际URL；打开旧标签并不能证明看到的是最新文件。验收应记录源码版本和预览地址。

## 准备

先完成第83课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
预览检查：实际URL / 端口 / 页面标题 / 最近修改标记 / 控制台错误
```

浏览器显示与当前工作区产物对应。

## 开发者教学

预览生命周期要绑定任务所有者；关闭等待应有界且记录真实终态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交预览记录与页面截图，说明静态打开和HTTP预览的区别。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不表示，还需检查交互、错误和数据流。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

浏览器成功打开URL就表示页面逻辑全通过吗？

A. 不表示，还需检查交互、错误和数据流。

B. 表示，HTTP地址能打开就说明全部交互已通过。

C. 表示，页面标题正常即可代替表单检查。

<details><summary>答案与解析</summary>

A。不表示，还需检查交互、错误和数据流。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 085 · 可访问性：键盘也能完成任务

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-85) · [总纲](README.zh.md)

## 学习目标

完成「可访问性：键盘也能完成任务」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

可访问性让不同设备和能力的用户都能完成核心动作。键盘焦点、标签、错误提示和内容顺序是基础。不能只用颜色表示选中或错误，也不应让动画阻碍阅读。检查时先走一遍不使用鼠标的完整流程，能发现很多普通用户也会遇到的问题。

## 准备

先完成第84课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
验收路线：Tab进入导航→跳到报名→填写→触发错误→修正→提交演示
```

每一步焦点可见，错误可被理解，Esc能关闭弹层。

## 开发者教学

自动工具能发现部分问题，人工任务流程仍必要；语义HTML优先于补ARIA。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写可访问性检查表，至少修复一个键盘阻塞。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，仍需要真实任务和辅助技术检查。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

自动无障碍检查零报错就代表所有用户都能用吗？

A. 代表，自动工具覆盖所有辅助技术与真实任务。

B. 代表，零报错后可以删除键盘手测。

C. 不能，仍需要真实任务和辅助技术检查。

<details><summary>答案与解析</summary>

C。不能，仍需要真实任务和辅助技术检查。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 086 · 前端性能：先减少不必要的工作

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-86) · [总纲](README.zh.md)

## 学习目标

完成「前端性能：先减少不必要的工作」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

页面慢可能来自大图片、阻塞脚本、重复渲染或网络请求。先测量加载和交互，再找最影响用户的瓶颈。图片尺寸应匹配显示用途，非关键内容可以延后，但不能把重要文字藏到复杂脚本之后。优化前后使用同样条件比较。

## 准备

先完成第85课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
性能记录：资源大小 / 请求数量 / 首次可读时间 / 点击响应 / 测试条件
```

没有真实测量时标估计，不能编造提升百分比。

## 开发者教学

缓存失效规则必须明确；不要让优化导致用户看到旧状态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一项性能改进的基线、改动和对照，不要求追求满分。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，要同时保留必要内容和交互。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

资源越少就一定体验越好吗？

A. 一定，零请求页面就无需检查交互是否可用。

B. 不一定，要同时保留必要内容和交互。

C. 一定，删除关键文字和图片也算体验优化。

<details><summary>答案与解析</summary>

B。不一定，要同时保留必要内容和交互。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 087 · 页面调试：控制台、网络与DOM三条线

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-87) · [总纲](README.zh.md)

## 学习目标

完成「页面调试：控制台、网络与DOM三条线」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

浏览器问题可从控制台错误、网络响应和实际DOM状态分别查。页面空白不一定是CSS错误，可能脚本没加载；按钮无反应可能事件未绑定，也可能请求失败。按一次操作追踪这三条线，比连续修改十处CSS更容易定位。

## 准备

先完成第86课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
故障：点击报名无反馈
检查：点击事件→校验→请求→响应→状态渲染
```

找到首次偏离预期的步骤，而不是只看最后现象。

## 开发者教学

日志加请求关联ID；错误反馈应留在用户可见位置而非只在控制台。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一条端到端故障链和最小修复，附前后状态。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，还要看响应内容与业务状态。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

网络200是否证明业务提交成功？

A. 不一定，还要看响应内容与业务状态。

B. 证明，200响应永远不可能含业务错误。

C. 证明，不需要再检查返回的数据与目标状态。

<details><summary>答案与解析</summary>

A。不一定，还要看响应内容与业务状态。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 088 · 部署前检查：环境、配置和秘密

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-88) · [总纲](README.zh.md)

## 学习目标

完成「部署前检查：环境、配置和秘密」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

本地能跑与外网可用之间还有构建、环境变量、资源路径和服务配置。部署前要知道构建产物是哪一个目录，哪些值可以公开，哪些只应在服务端。前端打包进去的变量通常会被用户下载，不能把名字叫SECRET就当成安全。

## 准备

先完成第87课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
发布清单：构建命令 / 输出目录 / 环境变量用途 / 路由 / 回退版本 / 验收URL
```

只有公开配置进入客户端；秘密由受控服务环境管理。

## 开发者教学

构建可重复，产物带版本与哈希；配置与源码版本的对应关系要保存。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

完成部署前检查表，未获授权时停在本地候选并标未部署。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，客户端产物里的值可能被用户读取。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

前端变量名带SECRET就能防止浏览器看到吗？

A. 能，SECRET前缀会自动对浏览器加密。

B. 能，压缩JavaScript会让其中值不可被读取。

C. 不能，客户端产物里的值可能被用户读取。

<details><summary>答案与解析</summary>

C。不能，客户端产物里的值可能被用户读取。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 089 · Netlify接入：授权、预览与正式发布

单元6 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-89) · [总纲](README.zh.md)

## 学习目标

完成「Netlify接入：授权、预览与正式发布」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

托管平台连接属于外部账号操作。先确认当前账号、站点和授权范围，再创建预览部署；预览通过后再按用户许可更新正式域名。网站存在链接、平台返回成功和用户实际打开页面是三层证据。套餐、价格和平台流程随时间变化，应在实施时查官方帮助，不在教材编造固定费用。

## 准备

先完成第88课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
连接记录：账号 / 站点ID / 构建目录 / 预览URL / 正式域名 / 回退部署ID
```

无账号时完成本地演练并标NOT_RUN，不假装已上线。

## 开发者教学

连接复用现有权限和工具；部署UNKNOWN时按部署ID查状态，不能重复创建无归属发布。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交预览到正式的操作清单，标明每一步的审批与回退证据。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，两者需要分别验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

预览URL可打开是否等于正式域名已更新？

A. 等于，只需检查托管后台提示而不访问域名。

B. 不等于，两者需要分别验证。

C. 等于，预览部署与正式部署天然共用一个版本。

<details><summary>答案与解析</summary>

B。不等于，两者需要分别验证。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 090 · 单元项目：交付可预览的报名页

单元6 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-90) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：交付可预览的报名页」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

最终网站项目应从brief到预览形成完整链条。保留三案选择记录，实现选定布局、表单状态和响应式，再用可访问性与资源检查收尾。没有后端时明确演示模式；没有部署授权时交本地包。项目结构图帮助接手者理解文件和运行方式。

## 准备

先完成第89课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
交件：README、index.html或源码、样式、状态演示、验收记录、project-map.html
```

使用者知道怎么打开、怎么修改、哪些是真实接入、哪些只是演示。

## 开发者教学

交件地图从真实文件生成或核对；引用不存在文件会使可视化失去价值。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交读书会网站包，以内容、交互、适配、证据、交接五项自评。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，它是理解和交接入口，不是实际应用本身。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

项目地图可以代替可运行的网站文件吗？

A. 不能，它是理解和交接入口，不是实际应用本身。

B. 可以，结构图中有模块名称就代表模块已实现。

C. 可以，漂亮关系图比实际交互更能证明可用。

<details><summary>答案与解析</summary>

A。不能，它是理解和交接入口，不是实际应用本身。

</details>

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 091 · 后端服务：请求进来之后发生什么

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-91) · [总纲](README.zh.md)

## 学习目标

完成「后端服务：请求进来之后发生什么」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

后端把请求转换成受控业务操作。典型路径是解析输入、验证身份、检查权限、执行业务、保存数据并返回结果。每层都有独立责任，不能因为前端已经校验就省略服务端验证。本单元以合成待办服务为例，不涉及真实用户资料。

## 准备

先完成第90课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
POST /todos
输入：{"title":"读完第91课"}
输出示例：{"id":"demo-1","title":"读完第91课","done":false}
```

这是接口设计示例，不是Koder内置端点。

## 开发者教学

处理器薄，业务规则可独立测；响应状态与业务结果一致。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交待办服务接口草图和一条成功/失败样例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，客户端请求可以绕过前端。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

前端已检查title非空，服务端可以不检查吗？

A. 可以，所有客户端都一定从官方前端进入。

B. 可以，必填标签会自动阻止伪造HTTP请求。

C. 不可以，客户端请求可以绕过前端。

<details><summary>答案与解析</summary>

C。不可以，客户端请求可以绕过前端。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 092 · REST接口：资源、方法与状态

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-92) · [总纲](README.zh.md)

## 学习目标

完成「REST接口：资源、方法与状态」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

接口设计应让调用者知道操作哪个资源、要做什么和结果如何。读取、创建、更新、删除的语义不同，重试风险也不同。状态码只是入口，还需要稳定响应结构。不要给所有结果都返回200再让客户端猜文字内容。

## 准备

先完成第91课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
GET /todos：读取
POST /todos：创建
PATCH /todos/:id：修改
错误示例：{"code":"TITLE_REQUIRED"}
```

方法和资源含义清楚；示例行为需要应用自行实现。

## 开发者教学

版本演进避免突然改变字段类型；增加字段也需考虑严格客户端。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一份接口契约表，至少含4个操作和3种错误。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，调用者还要确认业务契约。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

HTTP200能代替业务成功字段与校验吗？

A. 能，客户端可以忽略空数据和错误消息。

B. 不能，调用者还要确认业务契约。

C. 能，HTTP状态码定义了全部业务字段。

<details><summary>答案与解析</summary>

B。不能，调用者还要确认业务契约。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 093 · 输入校验：类型、长度和允许字段

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-93) · [总纲](README.zh.md)

## 学习目标

完成「输入校验：类型、长度和允许字段」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

输入验证应明确允许什么，而不只是过滤几个坏词。类型、长度、取值范围和未知字段都需要规则。错误提示应具体到字段但不泄漏系统内部。字符串“false”和布尔false不是同一个值，自动转换可能把错误输入变成危险行为。

## 准备

先完成第92课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
title：字符串，去空白后1–120字符
done：布尔值
禁止客户端指定ownerId
```

长度范围是练习应用的设计选择，不是Koder全局规定。

## 开发者教学

验证后的类型进入业务层；序列化边界再检查输出，避免信息泄漏。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交校验器及5个正反例，解释字符数与字节数区别。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，归属应由已验证身份确定。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

客户端传ownerId就能决定数据归属吗？

A. 不能，归属应由已验证身份确定。

B. 能，只要ownerId是合法字符串即可。

C. 能，用户自己填写的身份总比认证信息准确。

<details><summary>答案与解析</summary>

A。不能，归属应由已验证身份确定。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 094 · 鉴权与授权：知道是谁还不够

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-94) · [总纲](README.zh.md)

## 学习目标

完成「鉴权与授权：知道是谁还不够」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

鉴权确认身份，授权确认该身份能操作哪个对象。用户登录成功并不表示能编辑任何人的待办。每个对象访问都应核对归属或角色，不能只在列表页过滤。教学使用假账号A/B与合成数据，重点验证越权被拒绝。

## 准备

先完成第93课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
用户A读取A的待办：允许
用户B直接请求A的id：拒绝
未登录请求：按接口契约拒绝
```

三种情况分开测试，不用真实账号。

## 开发者教学

授权在最终业务操作前执行；批量接口逐项验证范围。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一张身份×对象×动作矩阵，并覆盖至少一个越权反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，攻击者仍可直接调用接口，服务端必须检查。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只隐藏编辑按钮就能防止越权吗？

A. 能，用户看不到按钮就无法构造请求。

B. 能，只要前端路由不展示编辑页。

C. 不能，攻击者仍可直接调用接口，服务端必须检查。

<details><summary>答案与解析</summary>

C。不能，攻击者仍可直接调用接口，服务端必须检查。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 095 · JWT教学：验证令牌而不是只解码

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-95) · [总纲](README.zh.md)

## 学习目标

完成「JWT教学：验证令牌而不是只解码」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

JWT是一种带声明的令牌格式。能解码并读出用户ID不代表签名有效，也不代表它未过期或适用于当前服务。验证应限制算法、签发者和受众，并处理到期与撤销策略。实现时选成熟库并查当前官方用法，不手写密码学。

## 准备

先完成第94课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
验证清单：签名、允许算法、exp、issuer、audience、主体、权限范围
```

只在本地合成服务中使用测试密钥，不能把示例密钥部署生产。

## 开发者教学

库版本与算法配置固定；错误回包避免区分过多内部细节。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写验证清单和测试计划，不要求在教材里生成真实登录系统。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，必须验证签名与相关声明。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

JWT内容可解码是否等于身份可信？

A. 等于，只要payload里存在用户名即可。

B. 不等于，必须验证签名与相关声明。

C. 等于，Base64解码本身会验证签名。

<details><summary>答案与解析</summary>

B。不等于，必须验证签名与相关声明。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 096 · SQLite建模：表、键与约束

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-96) · [总纲](README.zh.md)

## 学习目标

完成「SQLite建模：表、键与约束」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

数据模型应表达业务不变量。主键标识记录，外键连接归属，非空和唯一约束帮助防止坏数据。应用层检查不能完全代替数据库约束，因为并发请求可能同时通过检查。设计前先写查询场景，再决定字段与索引。

## 准备

先完成第95课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
todos(id, owner_id, title, done, created_at)
约束示例：title非空；done只允许0或1；owner_id关联用户
```

这是教学模型；迁移前应在独立测试库验证。

## 开发者教学

参数化查询避免字符串拼接；数据库连接生命周期和事务归属清楚。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交建表草稿、查询需求和3个数据库层反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：通常需要，并发可能绕过先查后写。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

应用层已经检查唯一，数据库还需要约束吗？

A. 通常需要，并发可能绕过先查后写。

B. 不需要，先查询再写入不会有并发间隙。

C. 不需要，单次手测未重复就证明永不重复。

<details><summary>答案与解析</summary>

A。通常需要，并发可能绕过先查后写。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 097 · 事务：多步操作要么一起成立

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-97) · [总纲](README.zh.md)

## 学习目标

完成「事务：多步操作要么一起成立」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

事务用于保持一组数据库变更的一致性。比如创建任务并写审计记录，两者应按设计一起提交或一起回滚。事务不能覆盖任意外部邮件或HTTP调用，所以不要把数据库回滚误认为外部效果也撤销。对跨系统流程需要单独的状态与对账。

## 准备

先完成第96课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
BEGIN
插入todo
插入audit
COMMIT
任一步失败：ROLLBACK
```

测试失败后两张表都不留下半成品。

## 开发者教学

事务提交后再发送事件时要考虑可靠投递；不得把未确认写入记为完成。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交正常与失败两种状态表，说明跨系统部分如何处理。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，外部系统需要自己的恢复或对账机制。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

数据库ROLLBACK能回滚已发出的HTTP请求吗？

A. 能，事务回退会自动通知所有外部系统撤销。

B. 能，只要HTTP调用发生在事务函数里。

C. 不能，外部系统需要自己的恢复或对账机制。

<details><summary>答案与解析</summary>

C。不能，外部系统需要自己的恢复或对账机制。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 098 · 迁移：升级结构且保留旧数据

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-98) · [总纲](README.zh.md)

## 学习目标

完成「迁移：升级结构且保留旧数据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

迁移需要考虑用户已有数据和程序版本。增加字段、改变类型和删除字段风险不同。先在复制的合成数据库上执行，再验证旧程序或升级路径的兼容性。迁移成功不只看命令退出0，还要查记录数、关键值和约束。

## 准备

先完成第97课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
迁移记录：起始版本→目标版本→脚本哈希→备份→执行结果→数据校验
```

备份存在与可恢复也要分别验证。

## 开发者教学

迁移要幂等或有可靠版本门；崩溃中断后可识别进行状态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交迁移前后数据对照与回退限制，特别说明不可逆变化。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还需数据与业务查询验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

迁移脚本退出0就能证明用户数据完整吗？

A. 能，只需检查目标表存在。

B. 不能，还需数据与业务查询验证。

C. 能，脚本成功等于业务数据全部正确。

<details><summary>答案与解析</summary>

B。不能，还需数据与业务查询验证。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 099 · 配置与秘密：让同一程序适应不同环境

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-99) · [总纲](README.zh.md)

## 学习目标

完成「配置与秘密：让同一程序适应不同环境」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

开发、测试和生产可以共享代码，但配置不同。端口、数据库路径和公开地址属于配置，密码与令牌属于秘密。默认值应安全且可诊断，缺少必要秘密时应明确失败。把所有环境混在一个文件会增加误连生产的风险。

## 准备

先完成第98课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
示例配置：PORT=3000、DB_PATH=./data/demo.db
秘密示例只列变量名，不放真实值。
```

运行日志可显示配置来源，但不得打印秘密内容。

## 开发者教学

配置解析一次并验证类型；来源优先级与覆盖规则应可解释。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写配置说明与启动前检查，覆盖无效端口和不可写目录。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：仍是秘密，存储与权限要求不会因文件名改变。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

把密码放在名为config的文件就不算秘密吗？

A. 仍是秘密，存储与权限要求不会因文件名改变。

B. 不算，只有文件名带secret的才是秘密。

C. 不算，本地文件一定不会泄漏。

<details><summary>答案与解析</summary>

A。仍是秘密，存储与权限要求不会因文件名改变。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 100 · 分页与过滤：数据多时仍可控

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-100) · [总纲](README.zh.md)

## 学习目标

完成「分页与过滤：数据多时仍可控」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

列表接口应限制一次返回的数据量。页码或游标需要稳定排序，否则插入新数据时可能漏项或重复。过滤参数应白名单化，不能让客户端直接传数据库表达式。前端也要区分没有结果和加载失败。例如按创建时间排序时，两条记录可能时间相同，需要再用稳定ID打破并列。游标应说明绑定了哪些排序与过滤条件，条件改变后不要继续复用旧游标。

## 准备

先完成第99课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
GET /todos?limit=20&cursor=...
响应：items、nextCursor、hasMore
```

具体分页方案按应用需求选择；示例不是固定产品接口。

## 开发者教学

游标校验长度与格式；不要暴露数据库内部敏感信息。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交分页契约和边界测试：空页、最后一页、非法limit、重复游标。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，可能是合法空结果，应结合状态和分页信息判断。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

返回空items一定表示接口坏了吗？

A. 一定，任何查询都必须至少返回一项。

B. 一定，分页最后一页也不能返回空数组。

C. 不一定，可能是合法空结果，应结合状态和分页信息判断。

<details><summary>答案与解析</summary>

C。不一定，可能是合法空结果，应结合状态和分页信息判断。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 101 · 缓存与幂等：减少重复但不制造旧事实

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-101) · [总纲](README.zh.md)

## 学习目标

完成「缓存与幂等：减少重复但不制造旧事实」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

缓存用于复用可接受的旧结果，幂等用于让重复请求不产生重复效果。两者解决不同问题。读取缓存需要失效策略，创建任务的幂等键需要绑定请求内容和调用者。相同键不同内容不能直接返回旧成功，否则用户会以为新请求也执行了。

## 准备

先完成第100课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
幂等记录：调用者+键+请求哈希→状态与回执
相同键不同请求：拒绝并说明冲突
```

写入未知时先查记录，不自动再创建。

## 开发者教学

幂等记录与实际效果需要一致性设计；UNKNOWN不能直接改成失败重试。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计重复创建待办的防重方案并给出3个反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，一个复用读取结果，一个控制重复操作效果。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

缓存和幂等是同一个概念吗？

A. 是，给POST加缓存就能保证只执行一次。

B. 不是，一个复用读取结果，一个控制重复操作效果。

C. 是，都只是把响应保存到内存。

<details><summary>答案与解析</summary>

B。不是，一个复用读取结果，一个控制重复操作效果。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 102 · 文件上传：限制路径、类型和大小

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-102) · [总纲](README.zh.md)

## 学习目标

完成「文件上传：限制路径、类型和大小」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

上传是把不可信输入带入系统。文件名可能包含路径片段，扩展名不保证内容类型，大文件会耗尽资源。保存位置应由服务决定，用户原名只作展示。读取和下载同样需要授权，不能因为文件已在磁盘就公开。

## 准备

先完成第101课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
上传契约：最大字节数、允许类型、目标目录、随机存储名、所有者、校验结果
```

教学使用合成小文本，不上传真实身份证或客户资料。

## 开发者教学

流式限制字节数；临时文件清理需有归属，失败不留下可执行载荷。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交上传威胁清单和最小测试矩阵，不需要搭建公开上传服务。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，扩展名只是线索，且文本本身也不能作为指令执行。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

扩展名为.txt就能保证内容安全可执行吗？

A. 不能，扩展名只是线索，且文本本身也不能作为指令执行。

B. 能，文本扩展名会自动消毒内容。

C. 能，只要文件很小即可执行其中命令。

<details><summary>答案与解析</summary>

A。不能，扩展名只是线索，且文本本身也不能作为指令执行。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 103 · 容器入门：可重复启动而非万能隔离

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-103) · [总纲](README.zh.md)

## 学习目标

完成「容器入门：可重复启动而非万能隔离」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

容器把运行依赖和启动方式打包，帮助在不同环境重现服务，但不自动解决数据持久化、秘密管理和网络安全。先在本机明确启动命令，再把它写成容器配置。数据库放在哪里、退出后是否保留，应在README说清。

## 准备

先完成第102课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
容器验收：构建成功→服务启动→健康检查→数据持久化→停止与重启
```

没有容器运行环境时只审配置，明确NOT_RUN。

## 开发者教学

基础镜像与依赖版本固定；健康检查验证服务而非仅进程存在。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写容器运行说明和最小权限挂载表，标出真实未验平台。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：没有，还需实际构建、启动与行为验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

有Dockerfile就代表容器验收通过了吗？

A. 代表，声明镜像就等于实际构建成功。

B. 代表，只要文件名拼写正确即可。

C. 没有，还需实际构建、启动与行为验证。

<details><summary>答案与解析</summary>

C。没有，还需实际构建、启动与行为验证。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 104 · 服务观测：健康、日志与指标

单元7 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-104) · [总纲](README.zh.md)

## 学习目标

完成「服务观测：健康、日志与指标」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

服务能启动不代表能处理业务。健康检查可以分存活和依赖就绪，日志帮助追踪具体请求，指标帮助看整体趋势。指标不要包含高敏内容或无限增长的标签。对一个小服务先记录请求量、失败类别和延迟，就足以发现很多问题。

## 准备

先完成第103课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
观测清单：启动版本、请求ID、状态类别、耗时、依赖就绪、异常计数
```

实际业务失败可追踪，不只显示“服务在线”。

## 开发者教学

监控错误本身不能导致业务无限重启；保留首因和恢复记录。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一页运行手册：怎样知道坏了、怎样找原因、怎样恢复。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不证明，需要独立就绪检查。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

进程存在是否证明数据库连接正常？

A. 证明，PID存在就是所有接口健康。

B. 不证明，需要独立就绪检查。

C. 证明，进程启动后依赖自动可用。

<details><summary>答案与解析</summary>

B。不证明，需要独立就绪检查。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 105 · 单元项目：可验证的待办服务

单元7 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-105) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：可验证的待办服务」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

完成一个小而完整的待办服务：接口契约、输入验证、身份边界、数据存储、测试和启动说明。允许先用本地合成身份演练，但必须明确与生产鉴权的差别。最终交付应能让别人启动并验证A不能访问B的数据，不只展示成功请求。

## 准备

先完成第104课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
交件：接口说明、实现、测试、合成数据、启动文档、验收记录
```

正常路径、非法输入和越权反例都可运行。

## 开发者教学

编程能力评价绑定同题、模型和环境；没有真实盲测不宣称评分提升。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交完整待办项目，评分涵盖行为、数据隔离、错误语义、可复现与交接。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不足，还需源文件、运行方法及失败和权限边界的证据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只有成功请求截图足够交付后端服务吗？

A. 不足，还需源文件、运行方法及失败和权限边界的证据。

B. 足够，成功截图可以替代源码与启动步骤。

C. 足够，只要没有展示失败请求。

<details><summary>答案与解析</summary>

A。不足，还需源文件、运行方法及失败和权限边界的证据。

</details>

## 延伸阅读

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)

---

# 106 · 测试分层：不同检查回答不同问题

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-106) · [总纲](README.zh.md)

## 学习目标

完成「测试分层：不同检查回答不同问题」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

单元测试检查小规则，集成测试检查模块连接，端到端测试检查用户流程。静态检查能发现语法或类型问题，却不能证明业务正确。测试层次不是越多越好，应让每个风险都有合适证据，同时控制运行时间。

## 准备

先完成第105课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
购物车计算→单元；接口到数据库→集成；用户提交表单→端到端
```

同一问题可以跨层验证，但不要重复十次相同断言。

## 开发者教学

测试金字塔是取舍工具而非硬指标；关注故障定位速度。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

给待办服务画测试地图，标出每类检查的输入、输出与成本。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，它没有执行该业务行为。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

语法检查通过能证明数据库事务正确吗？

A. 能，解析器会自动验证所有事务分支。

B. 能，没有语法错误就不会有业务错误。

C. 不能，它没有执行该业务行为。

<details><summary>答案与解析</summary>

C。不能，它没有执行该业务行为。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 107 · 断言设计：让错误实现确实失败

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-107) · [总纲](README.zh.md)

## 学习目标

完成「断言设计：让错误实现确实失败」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

有效断言区分正确行为与常见错误行为。只检查返回值存在，可能让空对象也通过；复制实现计算预期，也可能重复同一个错误。用小样本独立算答案，再验证关键边界。错误信息应帮助定位，而不是只显示false。

## 准备

先完成第106课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
弱：assert.ok(result)
强：assert.equal(result.totalCents,750)
```

正确答案有独立依据，字段与单位明确。

## 开发者教学

变异测试思想可手工应用于少数关键规则，不必为了数量引入重依赖。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

改进3条弱断言，并说明原断言会漏掉什么错误。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，空数组在JavaScript中也是真值。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

assert.ok([])能证明列表有数据吗？

A. 能，它会自动检查数组长度大于0。

B. 不能，空数组在JavaScript中也是真值。

C. 能，空数组会被assert.ok当作假值。

<details><summary>答案与解析</summary>

B。不能，空数组在JavaScript中也是真值。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 108 · 夹具：小、合成、隔离、可清理

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-108) · [总纲](README.zh.md)

## 学习目标

完成「夹具：小、合成、隔离、可清理」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

夹具是测试输入与环境。真实用户目录很难控制，也可能泄漏资料或被测试修改。使用任务专属临时目录和合成数据，测试结束只清理自己创建的资源。夹具越小，失败时越容易理解；不要复制整台电脑来复现一个参数错误。

## 准备

先完成第107课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
fixture/README.md：合成项目
fixture/data.json：固定小数据
临时目录由测试创建并持有归属
```

测试前后用户真实目录不变。

## 开发者教学

清理失败应保留UNKNOWN状态，不通过宽泛删除掩盖资源归属问题。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为一个文件工具做最小夹具并记录清理范围。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，只能清理明确属于本次测试的资源。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

测试可以用用户桌面作为临时目录随意清空吗？

A. 不可以，只能清理明确属于本次测试的资源。

B. 可以，只要目录名里有test。

C. 可以，自动测试天然获得所有文件删除权。

<details><summary>答案与解析</summary>

A。不可以，只能清理明确属于本次测试的资源。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 109 · 红绿回归：保留失败证据

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-109) · [总纲](README.zh.md)

## 学习目标

完成「红绿回归：保留失败证据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

回归测试需要证明旧版本确实出错、修复版本确实通过。先写或运行失败用例，再修改实现，保留两次输出和源码标识。一次命令出错可能来自环境而非目标bug，因此要确认失败位置。红绿不是把测试脚本改两次制造表面变化。

## 准备

先完成第108课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
RED：旧实现，数量用例失败，exit1
GREEN：新实现，同一断言通过，exit0
```

两次使用相同输入与预期，仅实现按修复变化。

## 开发者教学

原失败不可覆盖；证据记录包括命令、环境、版本和退出码。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交红绿日志、文件哈希和最小差异。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，它只是前置环境失败。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

依赖安装失败能当作业务bug已复现吗？

A. 能，任何失败都证明被测业务有bug。

B. 能，没运行的断言也算已失败。

C. 不能，它只是前置环境失败。

<details><summary>答案与解析</summary>

C。不能，它只是前置环境失败。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 110 · 假服务与真实接口：验证边界要说清

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-110) · [总纲](README.zh.md)

## 学习目标

完成「假服务与真实接口：验证边界要说清」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

本地假服务可以稳定返回401、延迟、断流和错误JSON，适合测试客户端恢复。它不能证明真实账号权限、平台风控或系统凭据输入正常。报告应写清测试是哪一层，避免把回环测试通过宣传成所有服务商可用。

## 准备

先完成第109课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
本地回环：验证协议解析与错误分支
真实账号：验证授权与服务行为
真实设备：验证系统交互
```

三个层次单独记录PASS/FAIL/NOT_RUN。

## 开发者教学

测试服务器绑定回环地址并按归属关闭；不要占用外网服务或泄漏请求。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计6个响应夹具：成功、鉴权、限流、非JSON、断流、超时。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，真实服务与账号需要另验。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

本地模拟SMTP通过就证明163真实发信通过吗？

A. 证明，只要邮件对象有收件地址。

B. 不能，真实服务与账号需要另验。

C. 证明，模拟服务器与真实服务策略完全相同。

<details><summary>答案与解析</summary>

B。不能，真实服务与账号需要另验。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 111 · 并发测试：找共享状态而不是多开进程

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-111) · [总纲](README.zh.md)

## 学习目标

完成「并发测试：找共享状态而不是多开进程」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

并发故障往往来自共享文件、全局变量、锁和默认会话。测试要让两个操作在关键点交错，而不是随机睡眠等待偶发。用屏障控制顺序，检查每个结果属于哪个任务。并发数应适度，不能影响同机其他工作。

## 准备

先完成第110课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
A读取版本1→B修改为版本2→A尝试提交→应检测冲突
```

这是受控交错，不依赖机器快慢。

## 开发者教学

锁生命周期要覆盖实际临界区，过期回收需要存活和所有权证据。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一个双任务时序图和预期拒绝行为。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应覆盖关键交错并记录限制。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

并发测试通过一次能证明永远不会冲突吗？

A. 不能，应覆盖关键交错并记录限制。

B. 能，一次成功覆盖所有调度顺序。

C. 能，两个进程结束就说明没有丢失更新。

<details><summary>答案与解析</summary>

A。不能，应覆盖关键交错并记录限制。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 112 · 无头CLI：输入、退出与可机器读取

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-112) · [总纲](README.zh.md)

## 学习目标

完成「无头CLI：输入、退出与可机器读取」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

脚本环境没有人盯着确认框。程序应在明确任务下正常执行或返回可解释的非零码，不能无限等输入。JSON输出要保持可解析，提示与进度放在合适通道。无头策略不代表自动开放电脑或外部写入权限。

## 准备

先完成第111课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
验收：无TTY / stdin保持打开 / 参数错误 / JSON输出 / 取消 / 子进程退出
```

已有任务参数时仍需确认进程最终退出，而不只是打印答案。

## 开发者教学

stdin等待、事件监听和子进程句柄都可能阻止退出；测试应验证进程终态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为一条CLI命令写自动化契约表，包含超时与错误路径。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不应该，已有权限边界仍独立生效。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

--yes是否应该自动授予浏览器和桌面权限？

A. 应该，--yes必须绕过全部系统授权。

B. 应该，命令审批与电脑可见范围是一回事。

C. 不应该，已有权限边界仍独立生效。

<details><summary>答案与解析</summary>

C。不应该，已有权限边界仍独立生效。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 113 · 结构化JSON：解析失败不能假绿

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-113) · [总纲](README.zh.md)

## 学习目标

完成「结构化JSON：解析失败不能假绿」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

机器消费的结果需要明确schema、状态和错误语义。空数组可能表示没有问题，也可能是解析失败后的默认值，这两种不能混在一起。消费者应检查解析标志与退出码，生产者则在无法解析时明确失败，不把不完整结果当正常成功。

## 准备

先完成第112课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
{"parsed":false,"code":"REVIEW_UNPARSED","findings":[]}
```

findings为空不能覆盖parsed=false。

## 开发者教学

结构化输出模式应保证stdout纯净；版本变化需要兼容策略。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写消费者判断伪代码，分别处理成功、发现问题、解析失败。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，结果没有被可靠解析。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

findings=[]且parsed=false可以判定没有问题吗？

A. 可以，把parsed字段删除即可。

B. 不可以，结果没有被可靠解析。

C. 可以，findings为空优先于解析状态。

<details><summary>答案与解析</summary>

B。不可以，结果没有被可靠解析。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 114 · CI工作流：先让本地命令可重复

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-114) · [总纲](README.zh.md)

## 学习目标

完成「CI工作流：先让本地命令可重复」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

CI把已有检查自动执行，并不会自动修复不稳定的测试。先确认本地命令在干净目录可运行，再配置依赖、缓存和产物。失败日志要可下载，秘密只由CI秘密存储注入。没有真实运行的配置文件应标为准备完成，而非CI通过。

## 准备

先完成第113课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
步骤：检出→安装锁定依赖→运行检查→保存报告
失败仍保存日志，不发布产物为正式版
```

发布与测试是不同权限和触发条件。

## 开发者教学

并发任务避免共享临时路径；测试与发布凭据最小化分离。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一份CI设计和未运行标记，若有授权环境再执行。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，需要实际运行记录与结果。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

写好workflow文件就等于CI已通过吗？

A. 不是，需要实际运行记录与结果。

B. 等于，配置存在就代表所有任务执行过。

C. 等于，YAML解析通过就是CI全绿。

<details><summary>答案与解析</summary>

A。不是，需要实际运行记录与结果。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 115 · 跨平台验收：系统名字背后有差异

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-115) · [总纲](README.zh.md)

## 学习目标

完成「跨平台验收：系统名字背后有差异」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Windows、macOS和Linux在路径、Shell、权限、凭据存储和进程结束方式上不同。Windows Server runner不能自动代表Windows10/11桌面，模拟平台变量也不能代表真实系统。每项结果绑定运行环境，缺设备时保留未验而非凭代码推测通过。

## 准备

先完成第114课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
矩阵：平台 / Shell / Node是否预装 / 安装 / 启动 / 更新 / GUI / 凭据
```

每格使用PASS、FAIL或NOT_RUN，不用一个总勾覆盖所有情况。

## 开发者教学

平台分支应有单元测试，但真实Shell与GUI仍需独立验证。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

给Koder安装流程制作跨平台验收矩阵。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，它只覆盖部分代码分支。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

模拟process.platform=win32能证明Windows安装正常吗？

A. 能，平台字符串覆盖了真实系统全部行为。

B. 能，路径分隔符正确即可代表安装通过。

C. 不能，它只覆盖部分代码分支。

<details><summary>答案与解析</summary>

C。不能，它只覆盖部分代码分支。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 116 · 安装与更新：下载、校验、切换、恢复

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-116) · [总纲](README.zh.md)

## 学习目标

完成「安装与更新：下载、校验、切换、恢复」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

更新流程应先获得完整可信包，再校验、准备新版本、切换入口并验证启动。下载成功不代表安装成功，切换成功也不代表旧进程已重启。失败时保留可用版本和清楚日志；不能让一次中断留下半个安装目录。

## 准备

先完成第115课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
更新阶段：发现→下载→哈希校验→解包→准备→切换→启动检查→清理
```

每阶段可记录状态，旧可用版本保留到验证后。

## 开发者教学

原子切换与Windows文件锁需分别处理；日志应区分待重启与已生效。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交更新状态图与断网、损坏包、启动失败三条恢复用例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还要验证入口切换与新版本启动。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

文件下载完成就能显示“更新已生效”吗？

A. 能，只需更新展示文字不切换入口。

B. 不能，还要验证入口切换与新版本启动。

C. 能，下载完就是已经运行新版本。

<details><summary>答案与解析</summary>

B。不能，还要验证入口切换与新版本启动。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 117 · MCP验收：发现工具、调用工具、看见效果

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-117) · [总纲](README.zh.md)

## 学习目标

完成「MCP验收：发现工具、调用工具、看见效果」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

MCP连接成功只是协议入口。真正验收需要工具列表、一次实际调用、结果解析以及目标效果核对。图形工具还依赖桌面会话、授权与窗口状态；无显示环境无法用文本假服务代替真实点击验收。例如先记录工具schema，再调用一次读取当前窗口的工具，最后将返回标题与目标窗口对照。即使读取通过，点击、输入和关闭仍是独立的能力，不可顺带勾选。

## 准备

先完成第116课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
层级：initialize→tools/list→tools/call→回执→真实目标状态
```

每层有证据与未验边界。

## 开发者教学

连接生命周期、stderr与stdout隔离、超时取消和子进程清理都需覆盖。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写Windows-MCP验收单，含拒绝权限、驱动缺失、正常调用和退出。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，必须实际调用并核对目标状态。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

tools/list返回成功能证明鼠标点击正常吗？

A. 不能，必须实际调用并核对目标状态。

B. 证明，工具描述存在就等于真实桌面已操作。

C. 证明，协议连接成功会自动完成所有图形步骤。

<details><summary>答案与解析</summary>

A。不能，必须实际调用并核对目标状态。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 118 · 不稳定测试：先找时序和资源归属

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-118) · [总纲](README.zh.md)

## 学习目标

完成「不稳定测试：先找时序和资源归属」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

偶发失败可能来自真实竞态，也可能来自测试依赖固定延迟、共享端口或未清理进程。提高超时只对确实耗时的操作有帮助，不能修复没有结束条件的等待。保留失败现场，比较通过与失败的第一处分歧，再作最小修复。

## 准备

先完成第117课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
记录：阶段时间、等待条件、端口所有者、子进程状态、首个错误
```

后续清理错误不覆盖首因。

## 开发者教学

测试隔离与产品行为分别修；不能降低断言把真实故障消掉。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一个偶发问题的假设、证据、修复和剩余不确定性。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，必须查明等待条件和资源是否正确结束。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

把超时从20秒改到无限是通用修复吗？

A. 是，永远不结束就不会有超时bug。

B. 是，任何阻塞都只需要更长等待。

C. 不是，必须查明等待条件和资源是否正确结束。

<details><summary>答案与解析</summary>

C。不是，必须查明等待条件和资源是否正确结束。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 119 · 验收报告：让PASS有可追溯依据

单元8 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-119) · [总纲](README.zh.md)

## 学习目标

完成「验收报告：让PASS有可追溯依据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

报告应把源代码审查、本地测试、真实模型、真实账号、真实设备和生产发布分层。每条PASS绑定命令、版本与产物，FAIL保留原始输出，NOT_RUN说明缺什么条件。UNKNOWN表示操作结果无法确认，不应塞进未运行或失败。

## 准备

先完成第118课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
状态：PASS / FAIL / NOT_RUN / UNKNOWN
字段：对象、前置、命令、退出码、证据、限制
```

状态含义一致，摘要能跳到原始证据。

## 开发者教学

报告生成可自动汇总，但不得自动将缺失字段转PASS。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

把一份“全部通过”空泛报告改写成分层证据表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：应写NOT_RUN并说明条件。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

没有运行的项应该写PASS还是NOT_RUN？

A. 写PASS，计划中准备测试也算完成。

B. 应写NOT_RUN并说明条件。

C. 写PASS，未运行就没有失败。

<details><summary>答案与解析</summary>

B。应写NOT_RUN并说明条件。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 120 · 单元项目：制作一套可交给别人的验收包

单元8 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-120) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：制作一套可交给别人的验收包」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

验收包包含检查脚本、合成数据、运行说明和结果模板。别人拿到后应知道前置条件、会产生什么副作用、怎样停止以及怎样收集证据。包本身也需要验证：解压、入口可读、路径可移植、失败能正确退出。

## 准备

先完成第119课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
acceptance/README.md、checks/、fixtures/、results-template.md
```

默认只运行无密钥本地检查；真实账号项明确单列。

## 开发者教学

验收脚本退出码可机器读取，清理范围限定为自有临时目录。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交验收ZIP及哈希，附真实执行命令与未验列表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不应该，真实账号操作必须有明确范围与授权。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

验收包默认应该自动使用本机所有账号吗？

A. 不应该，真实账号操作必须有明确范围与授权。

B. 应该，验收脚本天然拥有所有账号授权。

C. 应该，发现Token就可以自行发送测试邮件。

<details><summary>答案与解析</summary>

A。不应该，真实账号操作必须有明确范围与授权。

</details>

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 121 · 写作任务：读者、目的与行动

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-121) · [总纲](README.zh.md)

## 学习目标

完成「写作任务：读者、目的与行动」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

写作不是把关键词扩成长文。先明确谁读、读完要理解或决定什么、会在什么场景看到。技术决策者关心成本、风险和接入，普通用户关心能做什么和下一步怎么做。同一事实可以有不同组织方式，但不能为了迎合读者改变事实。

## 准备

先完成第120课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
读者：技术负责人
目的：判断是否试用Koder
行动：在隔离项目完成一次小任务
限制：不宣称未验证能力
```

内容服务决策，而不只是堆产品形容词。

## 开发者教学

写作路由保留受众与交付格式，后续润色不应丢掉原任务。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为同一功能写面向用户和面向开发者的两个brief。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：可以共享事实，但结构与解释深度通常应不同。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

写给技术负责人和新手可以完全用同一结构吗？

A. 必须完全相同，否则事实会变。

B. 必须完全相同，术语越多越适合所有读者。

C. 可以共享事实，但结构与解释深度通常应不同。

<details><summary>答案与解析</summary>

C。可以共享事实，但结构与解释深度通常应不同。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 122 · 事实清单：先分已知、推断与未知

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-122) · [总纲](README.zh.md)

## 学习目标

完成「事实清单：先分已知、推断与未知」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

写前把事实分层，能减少归因幻觉。来源明确的功能是已知，根据证据作出的判断是推断，缺材料的价格和版本增量是未知。未知不是需要模型补齐的空格。写作可以诚实说明边界，也可以向用户索取材料，但不能把流畅当作正确。

## 准备

先完成第121课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
事实表：主张 / 来源路径或URL / 日期或版本 / 原文证据 / 可用范围
```

每个重要主张有出处，推断单独标注。

## 开发者教学

证据字段随正文保存，避免最终输出丢失来源。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为产品介绍建立10条事实卡，至少包含2条不能使用的未知信息。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应查证或明确未知。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

缺少价格资料时能否按行业常见价格补上？

A. 可以，写得足够精确就能视为事实。

B. 不能，应查证或明确未知。

C. 可以，行业均值就是该产品的准确价格。

<details><summary>答案与解析</summary>

B。不能，应查证或明确未知。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 123 · 资料检索：优先找到原始来源

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-123) · [总纲](README.zh.md)

## 学习目标

完成「资料检索：优先找到原始来源」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

搜索结果摘要帮助定位，不应直接当完整依据。优先读官方文档、发布记录和原始数据，记录时间与适用版本。第三方教程可解释流程，但不能替代服务商当前权限和价格规则。多个页面互相转载不等于多个独立来源。

## 准备

先完成第122课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
检索路径：问题→关键词→原始页面→关键段落→来源卡
```

记录查阅日期，区分发布日与事件发生日。

## 开发者教学

检索预算与访问权限受原Core控制；结果标来源与时间。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交3条来源卡和一段综合结论，说明证据如何支持。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不算，需要追溯共同原始来源。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

三篇转载同一新闻算三份独立证据吗？

A. 不算，需要追溯共同原始来源。

B. 算，三个不同域名天然相互独立。

C. 算，文章标题不同就不是同一来源。

<details><summary>答案与解析</summary>

A。不算，需要追溯共同原始来源。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 124 · 引用与改写：保留含义而不搬整篇

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-124) · [总纲](README.zh.md)

## 学习目标

完成「引用与改写：保留含义而不搬整篇」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

引用用于让读者核对关键事实，改写用于用适合目标读者的语言解释。换几个同义词不等于独立表达，也不能删除必须保留的署名或许可。把来源读懂后重新组织论证，并把直接引用与自己的解释分开。例如来源写“在给定数据集上平均减少20%耗时”，改写必须保留数据集与平均值限定，不能变成“所有任务快20%”。读者要能从链接回到支持该句的具体材料。

## 准备

先完成第123课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
写法：依据项目的安装说明，先完成环境检查，再运行启动命令。[来源]
随后说明这对读者意味着什么。
```

事实可追溯，解释不冒充原作者原话。

## 开发者教学

引用清单保留URL与文件哈希；输出门检验事实，不只检验语句相似度。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交原意摘要、改写稿和变化说明，不复制大段受版权保护正文。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，这会改变事实含义。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

去掉限制条件让文案更顺畅可以吗？

A. 可以，流畅比事实条件更重要。

B. 可以，只保留有利结果不影响原意。

C. 不可以，这会改变事实含义。

<details><summary>答案与解析</summary>

C。不可以，这会改变事实含义。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 125 · 文章结构：问题、证据、取舍与行动

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-125) · [总纲](README.zh.md)

## 学习目标

完成「文章结构：问题、证据、取舍与行动」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

结构让读者知道为什么继续读。产品文章可以先说明问题，再给解决路径、证据、限制和行动。每段承担一个主要任务，段落之间有因果关系。不要用大量小标题掩盖没有论证的内容，也不要把功能清单当成完整故事。

## 准备

先完成第124课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
问题→适用场景→工作方式→证据→风险与边界→试用步骤
```

读者能说出产品适合谁、不适合什么情况。

## 开发者教学

短提示写作可使用结构提示，但不能把模板当用户事实来源。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一份600字左右文章提纲，每段附一句要证明什么。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，关键是每段论证如何支持主线。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

一篇文章有很多标题就一定结构清楚吗？

A. 一定，段落可以随意交换而不用主线。

B. 不一定，关键是每段论证如何支持主线。

C. 一定，标题数量就是逻辑层级质量。

<details><summary>答案与解析</summary>

B。不一定，关键是每段论证如何支持主线。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 126 · 技术说明转用户文案：把实现变成使用意义

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-126) · [总纲](README.zh.md)

## 学习目标

完成「技术说明转用户文案：把实现变成使用意义」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

普通用户需要知道操作和结果，通常不需要先理解内部类名或协议字段。去行话不是删掉限制，而是把它解释成使用影响。比如“权限不足”要告诉用户在哪个入口授权，不能只说“执行失败”。事实和风险仍完整保留。

## 准备

先完成第125课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
技术句：工具返回UNKNOWN，禁止重放。
用户句：这次操作的结果还没确认，请先查看目标处是否已完成，再决定是否重试。
```

表达更容易懂，但没有把未知改成失败。

## 开发者教学

写作验收同时检查信息覆盖与可理解性，不只检查字数下降。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

改写一页技术说明，附事实保留对照表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，限制要用用户能理解的方式说明。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

去行话是否意味着删除所有技术限制？

A. 不是，限制要用用户能理解的方式说明。

B. 意味着，普通用户不应看到限制。

C. 意味着，只留下口号即可保留原意。

<details><summary>答案与解析</summary>

A。不是，限制要用用户能理解的方式说明。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 127 · 产品介绍：讲清价值与适用边界

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-127) · [总纲](README.zh.md)

## 学习目标

完成「产品介绍：讲清价值与适用边界」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

产品介绍应回答解决什么问题、怎样使用、需要什么条件和如何判断有效。自带API账单、工作区隔离、可脚本等主张要有对应使用路径。不要把候选功能、实验能力和正式可用功能混在一起，也不要用未做过的竞品实测支撑领先结论。

## 准备

先完成第126课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
段落骨架：场景→具体行为→所需配置→验证方法→限制→下一步
```

对外主张能对应命令、文档或真实证据。

## 开发者教学

字数门优先统计主交付正文；聊天收尾不能代替成稿计量。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写面向技术决策者约800字介绍，另附事实清单。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，必须说明实际发布与验收状态。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

候选代码存在就可以宣传正式版已支持吗？

A. 可以，文件存在等于安装包已上线。

B. 可以，候选测试通过可替代发布状态。

C. 不能，必须说明实际发布与验收状态。

<details><summary>答案与解析</summary>

C。不能，必须说明实际发布与验收状态。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 128 · 更新邮件：没有变更清单时怎么写

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-128) · [总纲](README.zh.md)

## 学习目标

完成「更新邮件：没有变更清单时怎么写」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

发版邮件最容易把旧能力误写成本版新增。先找对应版本的发布记录、CHANGELOG、验收材料或标签差异；没有材料时应明确说明不能确认增量，改写为现有能力使用说明。披露不能成为继续编造新增功能的挡箭牌。

## 准备

先完成第127课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
无来源写法：目前没有可核对的本版变更清单，以下说明现有能力及使用方法，不代表本版新增。
```

正文不能同时又声称“本版新增X”却无证据。

## 开发者教学

来源读取工具返回空时，写作门应认可诚实非增量披露，但继续拦截乱归因。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

分别写有来源和无来源两版更新邮件，标出每条新增主张的依据。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，只能披露资料缺口并说明现有能力。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

没有changelog时可以把所有现有功能写成本版新增吗？

A. 可以，只要在邮件末尾附一个官网链接。

B. 不可以，只能披露资料缺口并说明现有能力。

C. 可以，旧功能也能当成新版本新增点。

<details><summary>答案与解析</summary>

B。不可以，只能披露资料缺口并说明现有能力。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 129 · 竞品比较：先固定比较维度

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-129) · [总纲](README.zh.md)

## 学习目标

完成「竞品比较：先固定比较维度」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

比较表应在同一维度下陈述事实，而不是为自己的产品挑有利口径。账号要求、计费、平台、权限、脚本能力和已测任务可以分开。未实测的竞品能力不能写成败绩，价格需查当前官方来源，公开信息不足就明确说明。

## 准备

先完成第128课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
维度：使用入口 / 账号与模型 / 工作区 / 审批 / 自动化 / 已验证范围
```

每格区分官方说明、实际测试与未知。

## 开发者教学

定价门要识别有据引用和未知披露；不能把所有数字一律假红。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交比较表和每产品200字评述，来源紧邻对应主张。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应写公开信息有限或未验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

某产品未公开一项功能就能断言它没有吗？

A. 不能，应写公开信息有限或未验证。

B. 能，没有公开材料就是不存在的证明。

C. 能，只要对手官网没放在首页。

<details><summary>答案与解析</summary>

A。不能，应写公开信息有限或未验证。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 130 · 压缩长文：减少篇幅而不增加事实

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-130) · [总纲](README.zh.md)

## 学习目标

完成「压缩长文：减少篇幅而不增加事实」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

压缩稿应保留原文核心事实、结论和限制，删掉重复与次要铺垫。它不应借机补入新的价格、分数或能力。记录前稿文件和哈希可以明确这次压缩依据什么，避免多轮修改后事实来源丢失。例如原文有“目前只验证本地夹具，真实账号未验”，缩成“已全面验证”就改变了结论。压缩前先列不可删事实，压缩后逐条映射，篇幅不足时先删修饰语。

## 准备

先完成第129课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
输入：compare-source.md
输出：article-short.md
证据：前稿路径、内容哈希、删减说明
```

新稿事实范围不超出前稿，除非明确另加已核对来源。

## 开发者教学

writingEvidence保存predecessor引用与哈希；门禁关注新增事实而非仅句子相似。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

把比较稿压成目标篇幅，附保留、合并、删除三类说明。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，新增事实需要独立来源与明确说明。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

压缩时加入听起来合理的新数字可以吗？

A. 可以，压缩任务也默认授权补充事实。

B. 可以，数字越具体越显得可靠。

C. 不可以，新增事实需要独立来源与明确说明。

<details><summary>答案与解析</summary>

C。不可以，新增事实需要独立来源与明确说明。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 131 · 字数与格式：量真正交付的正文

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-131) · [总纲](README.zh.md)

## 学习目标

完成「字数与格式：量真正交付的正文」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

字数要求需要先定义计量对象。中文字符、总字符、词数和包含代码的长度不同，聊天末尾一句“已写好”更不是正文。先指定主文件，再按约定范围检查。标题、表格和引用是否计入也要说明，避免为了过门而机械填充。

## 准备

先完成第130课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
验收：主文件intro.md；中文正文目标约800字；允许范围由任务确定；附录另计。
```

统计结果能指向实际文件与规则。

## 开发者教学

长度门只对本轮实际交付内容执行，无法定位主文件时明确回退规则。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交正文、统计结果和一段删减理由，避免空话扩写。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应量实际主交付正文。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

聊天收尾只有100字，就能判800字文件不合格吗？

A. 能，文件不在当前可见输出中就不计入。

B. 不能，应量实际主交付正文。

C. 能，聊天最后一条就是唯一交付物。

<details><summary>答案与解析</summary>

B。不能，应量实际主交付正文。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 132 · 编辑与润色：每轮只解决明确问题

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-132) · [总纲](README.zh.md)

## 学习目标

完成「编辑与润色：每轮只解决明确问题」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

润色可以改善结构、语气和节奏，但应保留事实与任务约束。先做内容编辑，再做句子编辑，最后校对错字与格式。每轮说明改变了什么，避免用户说“更简洁”后模型把必要风险和行动步骤一起删掉。例如用户要求“语气更自然”，可以调整过渡和长句，不应新增销量或删掉尚未验收的说明。用逐段差异表标出事实是否改变，比仅比较总字数更容易发现问题。

## 准备

先完成第131课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
第一轮：事实与结构
第二轮：受众与语气
第三轮：句子、标点、格式
```

修改可解释，原任务与来源没有丢失。

## 开发者教学

多轮会话应继承原受众、长度、事实来源和交付格式。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

保留前后稿并标出5处有意义修改及原因。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，事实保持是基本约束。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

润色后更流畅就可以忽略事实变动吗？

A. 不可以，事实保持是基本约束。

B. 可以，润色只比较语气不需要对照原文。

C. 可以，限制减少通常意味着文案改善。

<details><summary>答案与解析</summary>

A。不可以，事实保持是基本约束。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 133 · 长文组织：让读者中途也能定位

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-133) · [总纲](README.zh.md)

## 学习目标

完成「长文组织：让读者中途也能定位」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

长文需要清楚导航、段落节奏和回到主线的连接。每节开头告诉读者该节解决什么问题，结尾自然引向下一节。表格用于并列比较，案例用于解释因果，不能所有内容都变成列表。长不是价值，完整解决读者问题才是。

## 准备

先完成第132课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
长文结构：问题背景→判断框架→具体案例→取舍→行动清单
```

每节有独立贡献，删掉不会影响理解的重复段。

## 开发者教学

长文交付应保留主文件、引用和前稿关系，便于后续压缩与审计。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一篇约1500字长文，附章节功能表与来源清单。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，因果论证通常需要连贯段落。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

把所有内容列成项目符号就一定更易读吗？

A. 一定，任何论证拆成孤立要点都更清楚。

B. 一定，列表不需要解释因果关系。

C. 不一定，因果论证通常需要连贯段落。

<details><summary>答案与解析</summary>

C。不一定，因果论证通常需要连贯段落。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 134 · 写作审校：事实、逻辑与读者三遍检查

单元9 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-134) · [总纲](README.zh.md)

## 学习目标

完成「写作审校：事实、逻辑与读者三遍检查」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

审校先问有没有错，再问推理是否成立，最后问读者是否看得懂。语法顺畅可能掩盖无来源的事实或偷换比较条件。把每个强主张回到证据，把每个行动回到实际入口。未解决的问题应保留注释或说明，不能靠漂亮措辞遮住。

## 准备

先完成第133课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
三遍：事实核对→逻辑与归因→读者与行动
结果：修改项、保留项、未决项
```

每项问题有理由和位置。

## 开发者教学

门禁应降低假红同时保留真实拦截；有披露不等于任意主张都可过。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

审校自己的更新邮件，至少找出一个可能误导的句子并修正。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不代表，事实需要证据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

文章语法完美就代表事实可靠吗？

A. 代表，没有错别字就不需要事实检查。

B. 不代表，事实需要证据。

C. 代表，语言流畅说明来源已核实。

<details><summary>答案与解析</summary>

B。不代表，事实需要证据。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 135 · 单元项目：一套有依据的产品内容

单元9 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-135) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：一套有依据的产品内容」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

完成产品介绍、更新邮件、差异比较和压缩长文四件套。它们共享同一事实库，但用途和结构不同。更新邮件没有版本材料时走诚实披露，比较稿没有价格来源时写未知。最终包应让别人知道每个结论依据什么，而不是只有四篇漂亮文字。

## 准备

先完成第134课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。需要运行脚本时先核对本机运行时；不为阅读课程自动安装任何软件。

## 示例与解读

```text
content-pack/intro.md、update-email.md、comparison.md、article.md、sources.md、review.md
```

四份文稿事实一致，版本与限制不互相打架。

## 开发者教学

同题质量评测需固定提示、模型与评分依据；保留原始输出。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交内容包和验收表，按事实、结构、可读性、行动与来源五项自评。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不意味着，事实一致但表达要服务不同目的。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

四篇内容用同一事实库是否意味着结构也必须相同？

A. 不意味着，事实一致但表达要服务不同目的。

B. 意味着，介绍、邮件、报告必须逐段相同。

C. 意味着，改写结构会自动破坏事实。

<details><summary>答案与解析</summary>

A。不意味着，事实一致但表达要服务不同目的。

</details>

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)

---

# 136 · 办公任务拆解：先定义交件而非软件名字

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-136) · [总纲](README.zh.md)

## 学习目标

完成「办公任务拆解：先定义交件而非软件名字」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

“帮我用办公软件做一下”还缺少对象和结果。先定义读者、输入材料、要交的文件和验收，再选择已有连接、浏览器或本机应用。工具选择服务任务，不应为了展示自动化而操作无关应用。缺少连接时应明确条件，不假装完成。

## 准备

先完成第135课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
任务卡：输入资料→整理规则→交付文件→核对方法→允许的外部动作
```

文件格式和使用场景明确，如可编辑PPT而非只有截图。

## 开发者教学

工具能力以实际连接和schema为准，计划中不可虚构专用插件。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一个周报任务卡并准备合成资料，标注隐私范围。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不够，交付格式没有满足要求。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

用户要可编辑PPT，交一张图片就足够吗？

A. 足够，截图与可编辑文件完全等价。

B. 足够，只要图片分辨率足够高。

C. 不够，交付格式没有满足要求。

<details><summary>答案与解析</summary>

C。不够，交付格式没有满足要求。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 137 · 文档整理：标题、表格与版本

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-137) · [总纲](README.zh.md)

## 学习目标

完成「文档整理：标题、表格与版本」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

文档整理应先保持事实，再统一结构。标题层级帮助导航，表格适合并列比较，版本说明帮助读者判断是否最新。对多份来源材料，记录合并规则和冲突，不要默默选择看起来顺眼的一份。原件保留，整理稿另存。

## 准备

先完成第136课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
原件/、working/、delivery/、sources.md
```

原件不覆盖，最终稿有明确名称和日期。

## 开发者教学

文档转换应保留表格语义与来源；格式检查和事实检查分开。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交整理稿和变更说明，列出未解决冲突。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不宜，保留原件便于核对和回退。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

合并材料时可以直接覆盖原件省空间吗？

A. 可以，同名文件始终是最新版本。

B. 不宜，保留原件便于核对和回退。

C. 可以，合并后不再需要追溯来源。

<details><summary>答案与解析</summary>

B。不宜，保留原件便于核对和回退。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 138 · 表格清洗：类型、缺失与重复

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-138) · [总纲](README.zh.md)

## 学习目标

完成「表格清洗：类型、缺失与重复」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

表格清洗先理解每列含义，再处理格式。看起来一样的日期可能是文本或日期值，空白与0可能含义不同，重复行也可能是合法重复交易。先定义规则，再保留清洗前后数量和异常清单，避免把数据“清干净”却删掉重要信息。

## 准备

先完成第137课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
字段：日期、项目、金额分、状态
规则：金额为整数；缺失状态标待核对，不自动填成功
```

每个转换可解释且可回溯。

## 开发者教学

清洗脚本记录转换步骤与输入哈希，避免人工不可追溯修改。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交清洗规则、异常表和前后汇总。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，缺失与零可能含义完全不同。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

所有空白单元格都可以填0吗？

A. 不可以，缺失与零可能含义完全不同。

B. 可以，空白与零在统计上没有区别。

C. 可以，填0能消除缺失就代表修复数据。

<details><summary>答案与解析</summary>

A。不可以，缺失与零可能含义完全不同。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 139 · 表格分析：从数字到可核对结论

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-139) · [总纲](README.zh.md)

## 学习目标

完成「表格分析：从数字到可核对结论」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

分析先确定问题和口径，例如收入按支付时间还是订单时间计算。分母、过滤条件和时间范围必须一致。图表好看不能弥补口径错误，平均值也可能掩盖分布。结论应说明依据和限制，不把相关性写成因果。

## 准备

先完成第138课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
问题：本月完成订单的金额总计是多少？
口径：状态=完成，日期按支付日期，金额单位=分
```

筛选与汇总规则可复现。

## 开发者教学

公式引用范围与空值处理要测试；图表轴与单位明确。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一页分析说明、计算过程和一张合适图表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，相关性不等于因果。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

两个指标一起增长就能证明一个导致另一个吗？

A. 能，同步变化排除了所有其他因素。

B. 能，只需图表趋势线方向一致。

C. 不能，相关性不等于因果。

<details><summary>答案与解析</summary>

C。不能，相关性不等于因果。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 140 · PPT叙事：每页只推进一个判断

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-140) · [总纲](README.zh.md)

## 学习目标

完成「PPT叙事：每页只推进一个判断」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

演示文稿不是把长文切成十页。每页应有明确结论、必要证据和与下一页的连接。先写听众要作出的决定，再规划页面顺序。内容密度取决于现场讲解还是独立阅读，两种用途不能用同一套字号和信息量硬套。

## 准备

先完成第139课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
问题→现状证据→选项→取舍→建议→执行计划
```

标题表达结论，正文支持结论。

## 开发者教学

幻灯片数据与来源绑定；可编辑文本优先于把整页栅格化。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交6页大纲，每页包含结论、证据和讲述要点。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，关键是是否支持听众的决策。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

PPT页数越多是否代表内容越完整？

A. 代表，每页塞满文字就一定完整。

B. 不一定，关键是是否支持听众的决策。

C. 代表，增加页数可以代替清楚结论。

<details><summary>答案与解析</summary>

B。不一定，关键是是否支持听众的决策。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 141 · PPT三案与版式：先选视觉逻辑

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-141) · [总纲](README.zh.md)

## 学习目标

完成「PPT三案与版式：先选视觉逻辑」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

三套演示方案应体现不同叙事与密度：数据简报、案例故事或方案评审。保持同一事实与结论，比较信息层级、图表和阅读节奏。选案后统一字体、配色与间距，避免一页一个风格。先做代表页再铺全稿更容易控制质量。

## 准备

先完成第140课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
A数据简报；B案例叙事；C方案比较
每案展示封面、内容页、结论页
```

三案能帮助用户选择，而不是只换颜色。

## 开发者教学

组件复用保持样式一致；导出后再检查溢出和字体替换。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交三案预览与选案说明，再完善一套6页可编辑稿。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不公平，应尽量固定内容再比较设计。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

三案分别使用不同事实是否公平比较版式？

A. 不公平，应尽量固定内容再比较设计。

B. 公平，版式比较不受内容多少影响。

C. 公平，给喜欢的方案增加更强文案即可。

<details><summary>答案与解析</summary>

A。不公平，应尽量固定内容再比较设计。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 142 · PPT验收：可编辑、可读、可演示

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-142) · [总纲](README.zh.md)

## 学习目标

完成「PPT验收：可编辑、可读、可演示」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

交付前要检查文本溢出、图表标签、字体替换和媒体依赖。预览图与实际PPT文件可能不同，必须打开最终格式核对。可编辑要求意味着标题、正文和图表不能全是一张图片。演示备注和来源也应按用途保存。

## 准备

先完成第141课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
验收：页数、标题、正文、图表、备注、链接、导出PDF、实际放映
```

每项对应最终文件，不只看设计工具预览。

## 开发者教学

自动布局检查可抓几何问题，人工阅读仍负责信息层级与叙事。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交PPT、预览PDF和检查表，标出未验软件版本。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，必须检查实际文档对象。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

PNG截图能证明PPT中的文字可编辑吗？

A. 能，高分辨率图片包含可编辑文本对象。

B. 能，文字看得清就能在PPT里逐字修改。

C. 不能，必须检查实际文档对象。

<details><summary>答案与解析</summary>

C。不能，必须检查实际文档对象。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 143 · 邮箱绑定：收信与发信是两条链路

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-143) · [总纲](README.zh.md)

## 学习目标

完成「邮箱绑定：收信与发信是两条链路」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

IMAP或POP负责收取邮件，SMTP负责发送。邮箱账号保存成功不等于两条链路都可用，客户端授权码也可能需要在服务方单独开启。以163为例，应使用当前产品预设并核对服务方说明；不要把网页登录密码随意代入。

## 准备

先完成第142课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
绑定检查：邮箱地址 / 收信协议 / 收信状态 / SMTP状态 / 授权码来源 / 监控开关
```

状态分开显示，失败信息不含秘密。

## 开发者教学

预设服务器与端口可维护但不能自动换用户账号；秘密存储失败要明确。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

制作绑定检查表，包含取消输入、错误授权码和仅收信模式。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，SMTP配置和权限需要单独确认。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

能收到邮件是否一定能发邮件？

A. 一定，IMAP连接成功等于SMTP已发送。

B. 不一定，SMTP配置和权限需要单独确认。

C. 一定，收件与发件使用完全相同的服务与权限。

<details><summary>答案与解析</summary>

B。不一定，SMTP配置和权限需要单独确认。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 144 · 发送邮件：收件人、正文、批准与回执

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-144) · [总纲](README.zh.md)

## 学习目标

完成「发送邮件：收件人、正文、批准与回执」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

发送属于外部动作，先准备完整草稿，再确认收件人、主题、正文和附件。绑定邮箱只提供通道，不代表允许任意发送。SMTP接受表示提交到服务端，不能自动当成收件人已阅读或最终送达；结果未知时先核对，避免重复发送。

## 准备

先完成第143课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder mail send --to "YOUR_TEST_ADDRESS" --subject "Koder test" --text "This is my authorized test."
```

仅在用自己的测试地址并完成最终确认后执行；命令展示不会自动发信。

## 开发者教学

发送幂等与UNKNOWN对账沿原Core；队列输入不得当作确认词。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交不含秘密的发送验收记录；无账号时写演练并标NOT_RUN。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，只证明对应提交阶段已接受。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

SMTP返回接受能证明对方已读吗？

A. 不能，只证明对应提交阶段已接受。

B. 证明，SMTP接受表示收件人已经打开。

C. 证明，投递与阅读是同一个状态。

<details><summary>答案与解析</summary>

A。不能，只证明对应提交阶段已接受。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 145 · 收件分类：重要、广告、系统与验证码

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-145) · [总纲](README.zh.md)

## 学习目标

完成「收件分类：重要、广告、系统与验证码」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

邮件分类需要结合发件域、内容、线程关系和用户关注事项。不能仅凭显示名称判断真人，也不能把所有企业邮件都当广告。验证码属于敏感信息，应按用户授权和最小展示处理；广告邮件不应自动触发回复或打开附件。

## 准备

先完成第144课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
类别：需处理的人际/业务邮件、订阅广告、系统通知、验证码、待确认
```

分类可纠正，保留原邮件入口而非只留模型结论。

## 开发者教学

分类器输出置信和依据；不把一次用户纠正泛化成永久规则。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交10封合成邮件分类表，解释2个模糊案例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，可能是重要业务或系统通知。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

来自公司域名的邮件一定是广告吗？

A. 一定，公司域名只会发送营销内容。

B. 一定，私人邮箱才可能有真人业务。

C. 不一定，可能是重要业务或系统通知。

<details><summary>答案与解析</summary>

C。不一定，可能是重要业务或系统通知。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 146 · 后台提醒：及时但可关闭

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-146) · [总纲](README.zh.md)

## 学习目标

完成「后台提醒：及时但可关闭」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

后台监控需要宿主正在运行、邮箱监控单独开启和相应权限。轮询并不等于毫秒级实时，提醒还受安静时段和每日上限影响。好的提醒说明什么值得处理并给入口，不能把每封邮件全文不断推送。用户应随时关闭并查看状态。

## 准备

先完成第145课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
/mail monitor on
/mail status
关闭与配置入口以当前/mail help或帮助说明为准。
```

只在用户授权后开启；记录实际检查间隔和宿主状态。

## 开发者教学

ticker、去重和通知预算应复用统一宿主；读邮件权限与回复权限分开。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交监控状态图和通知预算表，实际无设备时保留待验。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，回复是独立的外部写入授权。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

开启监控就等于允许自动回复所有邮件吗？

A. 等于，开监控后不需要检查收件人与正文。

B. 不等于，回复是独立的外部写入授权。

C. 等于，读取授权包含所有写入操作。

<details><summary>答案与解析</summary>

B。不等于，回复是独立的外部写入授权。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 147 · 回复策略：先草稿，再有范围的自动化

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-147) · [总纲](README.zh.md)

## 学习目标

完成「回复策略：先草稿，再有范围的自动化」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

自动回复需要明确适用类型、收件范围、内容限制和撤销方式。学习用户习惯可以帮助草稿风格，但不能从一次同意推导永久发信权限。高风险、含合同或付款的邮件应按更严格范围处理。默认先出草稿与依据，让用户知道准备回应什么。

## 准备

先完成第146课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
规则示例：仅对自有测试邮箱的预约确认生成草稿；发送仍确认。
```

规则写明对象、动作与例外，不是“所有邮件都自动回”。

## 开发者教学

授权范围版本化；规则变更后旧排队动作须重新校验。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交回复规则、3封草稿和1个必须转人工的反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不会，风格学习和操作授权是两回事。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

学会用户文风是否自动获得永久发送许可？

A. 不会，风格学习和操作授权是两回事。

B. 会，模仿语气成功就等于用户授权发送。

C. 会，偏好记录可以替代操作授权。

<details><summary>答案与解析</summary>

A。不会，风格学习和操作授权是两回事。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 148 · 跨应用办公：用依赖图安排顺序

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-148) · [总纲](README.zh.md)

## 学习目标

完成「跨应用办公：用依赖图安排顺序」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

跨应用任务常见顺序是读资料、整理、生成文档、确认、发送。前一步的输出是后一步输入，不能并行到互相依赖的数据还没准备好。每步保留产物与状态，失败后只恢复未完成部分，避免重复发信或重复建文件。

## 准备

先完成第147课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
资料表→摘要→PPT→用户确认→邮件草稿→发送回执
```

发送依赖最终确认，不能因为PPT已生成就自动执行。

## 开发者教学

office-graph类策略只编排能力，不能成为第二权限权威。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

完成一份合成周报工作流设计，标明授权、预算和恢复。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，发送依赖内容完成与用户确认。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

读取资料和发送最终稿可以无条件并行吗？

A. 可以，先发送空稿再填内容更快。

B. 可以，发信不依赖最终收件人与正文确认。

C. 不能，发送依赖内容完成与用户确认。

<details><summary>答案与解析</summary>

C。不能，发送依赖内容完成与用户确认。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 149 · 办公隐私：资料最小化与分享范围

单元10 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-149) · [总纲](README.zh.md)

## 学习目标

完成「办公隐私：资料最小化与分享范围」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

办公材料可能含联系人、财务、员工和客户信息。给Agent的内容应限于完成任务必要部分，真实外发前核对接收服务和模型范围。脱敏不是随意替换所有文字，而是保留分析所需关系同时移除可识别信息。分享链接权限也需要单独检查。

## 准备

先完成第148课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
资料清单：用途 / 所需字段 / 敏感字段 / 接收服务 / 保存期限 / 删除方式
```

隐私选择可撤销，不默认开放整个邮箱或文件系统。

## 开发者教学

日志和缓存也属于数据范围；删除说明应区分本机与第三方持有内容。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一份最小资料集与分享检查表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，文件中可能仍保存原始值。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

表格里把敏感列隐藏就等于已脱敏吗？

A. 等于，截图不显示就说明原文件已清理。

B. 不等于，文件中可能仍保存原始值。

C. 等于，隐藏列无法通过其他工具读取。

<details><summary>答案与解析</summary>

B。不等于，文件中可能仍保存原始值。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 150 · 单元项目：从资料到周报与邮件草稿

单元10 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-150) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：从资料到周报与邮件草稿」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

完成一套办公交件：合成数据表、可读周报、6页演示和待发送邮件草稿。它们共享同一事实口径，最终邮件先停在草稿，真实发送另经确认。任务不仅检查文字，还要核对表格总计、PPT数字和邮件附件是否一致。

## 准备

先完成第149课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
交件：clean-data、report、slides、mail-draft、sources、acceptance
```

四种产物互相一致，未发送状态清楚。

## 开发者教学

跨应用结果用产物ID与哈希关联，不能只靠相同文件名。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交办公包与自查表，以准确、可编辑、可读、权限和交接五项评分。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，草稿和发送是不同状态。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

邮件草稿准备好是否可以记录已发送？

A. 不可以，草稿和发送是不同状态。

B. 可以，草稿代表发送的最终状态。

C. 可以，收件人已填就说明邮件已投递。

<details><summary>答案与解析</summary>

A。不可以，草稿和发送是不同状态。

</details>

## 延伸阅读

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-PROACTIVE-INQUIRY.zh.md](../MAIL-PROACTIVE-INQUIRY.zh.md)

---

# 151 · Skill是什么：可读方法与可执行能力分开

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-151) · [总纲](README.zh.md)

## 学习目标

完成「Skill是什么：可读方法与可执行能力分开」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Skill描述何时使用、怎样完成任务和引用哪些资源，本身不自动增加系统权限。一个Skill即使被读取，也不证明里面的脚本已执行或外部工具已连接。理解这个区别，才能判断“兼容”究竟是能读格式、能找到资源，还是实际流程已通过。

## 准备

先完成第150课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
兼容层次：发现→读取→资源解析→工具可用→授权执行→结果验证
```

每层分别验收，不能只因SKILL.md存在就宣称完全适配。

## 开发者教学

资源解析限制目录与大小；执行继续走原工具门，不新增平行执行器。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交Skill兼容检查表，给每层填证据或NOT_RUN。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不等于，还需依赖、授权和真实调用验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

读到Skill正文就等于它的所有功能都能用吗？

A. 等于，Skill正文会自动提供宿主缺失工具。

B. 等于，资源路径写出来就代表文件存在。

C. 不等于，还需依赖、授权和真实调用验证。

<details><summary>答案与解析</summary>

C。不等于，还需依赖、授权和真实调用验证。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 152 · 跨生态Skill：保留意图，适配宿主差异

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-152) · [总纲](README.zh.md)

## 学习目标

完成「跨生态Skill：保留意图，适配宿主差异」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Codex、Cursor和WorkBuddy风格资源可能共享Markdown结构，但工具名、路径、会话能力和脚本环境不同。适配时先保留任务意图，再映射本宿主能力；无法映射的地方要显式说明。直接把工具名字符串替换一遍并不足以证明兼容。

## 准备

先完成第151课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
映射表：原工具/路径→Koder等价能力→权限→验证→缺口
```

没有等价能力的项标不支持或待接入。

## 开发者教学

兼容测试覆盖相对路径、二进制依赖、平台分支和失败提示。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

选一个许可明确的本地Skill做映射报告，不执行未知脚本。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，工具和资源语义也要验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

只改Skill名称能完成跨宿主适配吗？

A. 能，复制正文后无需检查工具参数与资源。

B. 不能，工具和资源语义也要验证。

C. 能，宿主之间只有名称不同。

<details><summary>答案与解析</summary>

B。不能，工具和资源语义也要验证。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 153 · 写一个Skill：触发条件要具体

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-153) · [总纲](README.zh.md)

## 学习目标

完成「写一个Skill：触发条件要具体」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

好Skill让Agent知道何时加载，并给清楚的完成标准。正文先写通用流程，分支资料放到引用文件，避免每次任务都加载长篇无关内容。触发条件不应靠堆同义词，而要覆盖实际任务分支。输出模板只约束必要结构，不能伪造证据。

## 准备

先完成第152课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
入口：当用户要求整理一份本地项目交付说明时使用。
完成：产物清单、运行方法、实际验证、未验、恢复入口。
```

触发可判断，完成有检查条件。

## 开发者教学

逐步披露降低上下文负担；Skill加载状态与真正执行状态分开。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交SKILL.md、一个引用模板和3条触发测试。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，过宽会让无关任务也加载。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

Skill描述越宽泛越容易正确触发吗？

A. 不一定，过宽会让无关任务也加载。

B. 一定，描述“所有任务”最容易准确匹配。

C. 一定，触发范围越宽越不容易误加载。

<details><summary>答案与解析</summary>

A。不一定，过宽会让无关任务也加载。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 154 · Skill资源与脚本：阅读后再执行

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-154) · [总纲](README.zh.md)

## 学习目标

完成「Skill资源与脚本：阅读后再执行」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Skill可以引用脚本和示例，但这些文件仍需检查来源、输入输出和副作用。相对路径应从Skill目录解析，不从任意工作区猜测。脚本运行需要原权限批准，并在任务专属目录操作。文档中的代码块不应被加载器自动当作命令执行。

## 准备

先完成第153课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
检查：解释器、依赖、文件读写范围、网络目标、参数、退出码
```

执行范围可预览，依赖缺失有明确说明。

## 开发者教学

脚本路径和哈希可记录；执行不使用模型生成代码作为权限权威。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一个仅处理合成文本的脚本示例，附输入与输出契约。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，阅读与执行需要分开并沿原审批。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

加载Skill时可以自动执行所有代码块吗？

A. 可以，Markdown代码块天然是可信脚本。

B. 可以，加载Skill等于批准全部副作用。

C. 不可以，阅读与执行需要分开并沿原审批。

<details><summary>答案与解析</summary>

C。不可以，阅读与执行需要分开并沿原审批。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 155 · MCP配置：命令、参数和环境

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-155) · [总纲](README.zh.md)

## 学习目标

完成「MCP配置：命令、参数和环境」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

stdio MCP通过启动本机程序通信，远程MCP通过服务地址连接。配置中的command和args不是一段任意Shell字符串；空格路径、环境变量和凭据来源都要正确。导入配置默认不意味着已启用或已授权外部操作。

## 准备

先完成第154课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
配置核对：传输方式、command/args或URL、环境变量名、enabled、权限范围
```

秘密只在保护入口存储，配置示例不用真实值。

## 开发者教学

配置解析拒绝危险或无效结构；凭据存储不可用不能静默明文降级。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

做一份脱敏配置和错误案例说明。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，发现、启用和调用分别发生。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

导入MCP配置就等于已调用工具了吗？

A. 等于，工具名称存在就不用真实调用。

B. 不是，发现、启用和调用分别发生。

C. 等于，配置写入时会自动完成业务操作。

<details><summary>答案与解析</summary>

B。不是，发现、启用和调用分别发生。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 156 · 工具schema：让模型知道怎样正确调用

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-156) · [总纲](README.zh.md)

## 学习目标

完成「工具schema：让模型知道怎样正确调用」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

工具schema描述输入类型、必需字段和结果形状。名字准确、说明具体能减少模型猜参数。错误结果也应有稳定结构，告诉调用者是否可重试和有没有外部效果。工具描述不是越长越好，关键是选择和调用时所需信息。

## 准备

先完成第155课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
工具例：read_note({path:string})
结果：{ok:true,text,artifactId} 或 {ok:false,code}
```

路径受工作区范围限制，返回大内容时保留artifact入口。

## 开发者教学

schema与实际执行器一致；参数验证在工具边界再次执行。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计一个只读笔记工具schema及5个输入反例。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：仍需要，模型输出不是可信输入。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

模型按照schema生成参数后还需要服务端校验吗？

A. 仍需要，模型输出不是可信输入。

B. 不需要，模型输出天然满足服务端安全要求。

C. 不需要，JSON可解析就代表字段有授权。

<details><summary>答案与解析</summary>

A。仍需要，模型输出不是可信输入。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 157 · Windows-MCP：依赖与桌面环境分层

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-157) · [总纲](README.zh.md)

## 学习目标

完成「Windows-MCP：依赖与桌面环境分层」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Windows-MCP需要相应运行时、包、协议启动和可操作桌面环境。内置依赖可以减少用户安装摩擦，但不能代替系统授权或图形验收。Python安装成功、MCP连接成功、截图成功和点击成功必须分别记录。安装长任务也要有真实进度和取消，不靠无限等待。

## 准备

先完成第156课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
验收链：运行时→包启动→协议→工具发现→截图→自有窗口操作→退出
```

无Windows桌面时后几项保留NOT_RUN。

## 开发者教学

stdout留给协议，诊断走stderr；启动超时与业务调用超时分别管理。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

编写Windows10/11图形验收脚本清单，标出需真人系统确认步骤。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还需要真实桌面调用与效果核对。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

包能够import就能证明图形点击正常吗？

A. 能，import成功说明桌面会话可操作。

B. 能，依赖安装完成就能自动越过锁屏。

C. 不能，还需要真实桌面调用与效果核对。

<details><summary>答案与解析</summary>

C。不能，还需要真实桌面调用与效果核对。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 158 · 浏览器自动化：观察、定位、动作、再观察

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-158) · [总纲](README.zh.md)

## 学习目标

完成「浏览器自动化：观察、定位、动作、再观察」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

网页操作应以当前页面状态为依据。先看可见元素和目标，再定位、执行、核对结果；页面变化后旧定位可能失效。结构化API可用时优先，浏览器适合没有专用连接的网页流程。成功标准要是页面或业务状态，不是“点击调用返回了”。

## 准备

先完成第157课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
观察页面→选择可见目标→操作→重新观察→核对结果
```

每次关键动作后确认新状态，不凭预想继续点。

## 开发者教学

定位器随页面重新获取；取消后不继续点击排队动作。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

为一个公开练习页写操作与观察清单。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，还要看页面或服务回执。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

click成功返回就一定证明业务提交成功吗？

A. 证明，按钮位置正确就无需观察页面变化。

B. 不能，还要看页面或服务回执。

C. 证明，点击动作成功等于服务端接受业务。

<details><summary>答案与解析</summary>

B。不能，还要看页面或服务回执。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 159 · 不会就学：教程检索接上实际操作

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-159) · [总纲](README.zh.md)

## 学习目标

完成「不会就学：教程检索接上实际操作」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

面对陌生应用，先查官方文档或帮助页，提炼少量可执行步骤，再回到已授权工具操作。学习不是只贴一堆链接给用户，也不是让网页指令覆盖原权限。流程不符时换来源或通道，有界恢复后如实报告卡点。

## 准备

先完成第158课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
Apps/MCP→浏览器→桌面；未知流程→官方教程→短计划→操作→核对
```

来源URL与实际执行步骤分别记录。

## 开发者教学

universal-app-use复用既有工具与权限，不新建第二宿主。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

用一个陌生合成网页流程做学习记录：来源、步骤、结果、卡点。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，应说明只是完成学习准备。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

查完教程但没有操作，可以说任务完成吗？

A. 不能，应说明只是完成学习准备。

B. 可以，知道步骤就等同于已完成操作。

C. 可以，教程截图就是本机执行结果。

<details><summary>答案与解析</summary>

A。不能，应说明只是完成学习准备。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 160 · 自主学习：经验需要证据与适用条件

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-160) · [总纲](README.zh.md)

## 学习目标

完成「自主学习：经验需要证据与适用条件」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

一次成功不一定能归因于某种方法。经验记录应包含适用情境、改动、证据、正反结果和失效条件，允许没有可采用条目。用户偏好、任务事实和工作方法分开，避免把偶然结果固化成全局规则。学习开关与操作权限也独立。

## 准备

先完成第159课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
经验：cue、lesson、evidence、outcome、version、expiry；证据不足：NO_ENTRY
```

不把模型自评当真实执行证据。

## 开发者教学

复用原growth/experiences存储，采用走受控比较与回退。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一条可采用经验和一条NO_ENTRY，解释证据差异。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不足，需要对照、适用条件和回归证据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

一次成功足以证明方法普遍有效吗？

A. 足以，一次正例就能覆盖所有情境。

B. 足以，模型自评成功不需要对照。

C. 不足，需要对照、适用条件和回归证据。

<details><summary>答案与解析</summary>

C。不足，需要对照、适用条件和回归证据。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 161 · JIT Harness：按任务选配置

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-161) · [总纲](README.zh.md)

## 学习目标

完成「JIT Harness：按任务选配置」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Harness Profile把记忆、规划、动作和能力编排绑定到任务。它帮助研究任务偏向证据、办公任务偏向依赖图，但不能改写身份、预算和权限。轻量选配从已审种子中选择，不让模型即时生成任意可执行代码当运行时。

## 准备

先完成第160课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
M记忆 / P规划 / A动作 / F能力
匹配：显式选择→配置→任务特征→默认基线
```

profile可序列化与比较，默认关闭时保留原执行行为。

## 开发者教学

repair仅改允许槽位；缓存与经验依赖任务、基线和模型设置版本。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计一个研究profile的验收清单，包含禁发信、来源和预算。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，原权限权威不变。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

profile可以自己把未授权工具改成允许吗？

A. 可以，只要加入prefer列表就获得授权。

B. 不可以，原权限权威不变。

C. 可以，profile配置优先于用户权限。

<details><summary>答案与解析</summary>

B。不可以，原权限权威不变。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 162 · 上下文压缩与Headroom：减量要保留证据

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-162) · [总纲](README.zh.md)

## 学习目标

完成「上下文压缩与Headroom：减量要保留证据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

上下文优化目标是让模型看到足够相关信息，同时保留原始结果的可追溯入口。裁掉长工具输出可以省空间，但不能丢掉artifactId、哈希或错误尾部。节省字节不等于已证明节省token或成本，应使用真实测量分别报告。

## 准备

先完成第161课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
模型视图：摘要+关键片段+artifact引用
原始证据：完整文件与哈希
```

压缩后仍能按需读取完整结果。

## 开发者教学

字节、token、成本、质量分开测；压缩组件不能删除权限或未知状态。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一份压缩前后样例和信息保留检查表。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，需真实token与计费数据。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

工具输出更短就能直接宣称成本下降同样比例吗？

A. 不能，需真实token与计费数据。

B. 能，字符缩短比例就是计费下降比例。

C. 能，不需要记录模型token与实际调用。

<details><summary>答案与解析</summary>

A。不能，需真实token与计费数据。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 163 · Hooks与插件：接入点和副作用归属

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-163) · [总纲](README.zh.md)

## 学习目标

完成「Hooks与插件：接入点和副作用归属」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Hook在特定生命周期执行，插件增加能力或策略。它们需要清楚的触发时机、输入、输出和失败行为。安装插件不意味着允许其任意访问电脑。Hook失败是否阻止任务应按契约决定，不能静默吞错或重复执行发布动作。

## 准备

先完成第162课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
接入点：任务前、工具后、交付前
每项声明：作用、权限、幂等、失败策略
```

配置可关闭，实际调用有记录。

## 开发者教学

Hook沿原审批和预算，不能成为新的执行权威；操作ID保留。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

设计一个只检查交付文件存在性的Hook，并写失败行为。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不可以，新增能力仍走原权限门。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

插件启用后可以绕过原审批吗？

A. 可以，插件属于扩展所以不受原权限约束。

B. 可以，只要插件作者标为可信。

C. 不可以，新增能力仍走原权限门。

<details><summary>答案与解析</summary>

C。不可以，新增能力仍走原权限门。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 164 · 爬取与逆向：从合法目标到可验证分析

单元11 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-164) · [总纲](README.zh.md)

## 学习目标

完成「爬取与逆向：从合法目标到可验证分析」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

分析公开网页、自有软件或获准文件时，先明确目标、权限和数据范围。爬取要尊重访问限制与服务条款，静态分析不等于允许绕过登录、付费或风控。输出应是证据化结构说明与兼容建议，不自动执行未知二进制。

## 准备

先完成第163课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
练习目标：自有HTML页面的链接与结构；合成文件的头部、字符串与格式说明
```

只处理获准样本，不收集他人凭据或绕过控制。

## 开发者教学

解析器在隔离目录处理样本，限制大小与时间；不自动运行样本或利用漏洞。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交自有页面结构报告和一份静态文件分析，标出无法确认部分。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，只能在合法授权与原权限范围内分析。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

逆向能力是否意味着可以绕过任意网站授权？

A. 意味着，静态分析工具可用于读取任意私有资料。

B. 不是，只能在合法授权与原权限范围内分析。

C. 意味着，技术上能做就等于有授权。

<details><summary>答案与解析</summary>

B。不是，只能在合法授权与原权限范围内分析。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 165 · 单元项目：交付一个可验证的工具Skill

单元11 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-165) · [总纲](README.zh.md)

## 学习目标

完成「单元项目：交付一个可验证的工具Skill」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

把一个小工具和Skill结合起来：Skill说明何时用，工具提供明确输入输出，测试验证成功、失败和权限边界。选择本地只读项目摘要工具即可，不需要云账号。最终交件要区分资源可读、工具能调用和业务结果正确。

## 准备

先完成第164课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
交件：SKILL.md、资源说明、工具schema、实现、测试、兼容矩阵
```

每个主张能对应实际检查。

## 开发者教学

版本、许可、资源路径与宿主映射固定；升级后回归原任务。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交工具Skill包及矩阵，至少记录发现、读取、调用、效果四层。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不足，还需实际调用与结果验证。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

Skill正文完整是否足以交付一个工具集成？

A. 不足，还需实际调用与结果验证。

B. 足够，文字说明可替代工具执行与回执。

C. 足够，catalog列出来就说明运行兼容。

<details><summary>答案与解析</summary>

A。不足，还需实际调用与结果验证。

</details>

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)

---

# 166 · Git基础：工作区、提交与远程

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-166) · [总纲](README.zh.md)

## 学习目标

完成「Git基础：工作区、提交与远程」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

工作区是正在编辑的文件，提交是可追溯快照，远程是共享仓库位置。保存文件不等于提交，提交也不等于上传。先用自己的练习仓库理解三个状态，再操作真实项目。未提交内容可能包含用户正在做的工作，不能为了“干净”随意清除。

## 准备

先完成第165课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
工作区修改→查看差异→提交快照→推送远程
```

每一步状态独立，失败时知道停在哪。

## 开发者教学

操作前读取仓库状态；提交范围只包含本任务文件。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一次小提交的说明与前后状态，明确是否上传。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，还需远程写入与读回。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

本地commit成功就代表GitHub已更新吗？

A. 代表，commit会默认推送所有远端。

B. 代表，分支名相同就自动同步GitHub。

C. 不是，还需远程写入与读回。

<details><summary>答案与解析</summary>

C。不是，还需远程写入与读回。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 167 · GitHub绑定：令牌范围与账号确认

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-167) · [总纲](README.zh.md)

## 学习目标

完成「GitHub绑定：令牌范围与账号确认」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

Koder当前绑定路径使用专用令牌入口。令牌应有合理期限、限定仓库和必要权限，组织也可能要求批准。绑定成功后先查看身份和仓库，再做写入。PAT登录与浏览器OAuth是不同能力，不能把尚未接入的流程写成已有。

## 准备

先完成第166课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github connect
koder github status
koder github repos
```

connect通过隐藏输入；status核对账号，不展示令牌。

## 开发者教学

凭据存储失败明确返回；读取与写入权限分开验收。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交脱敏绑定检查表，未有账号时只完成演练。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，需要在服务方另行撤销。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

本机disconnect会自动撤销GitHub网站上的令牌吗？

A. 一定，关闭终端就使网站Token失效。

B. 不一定，需要在服务方另行撤销。

C. 一定，删除本地凭据会自动调用服务方撤销。

<details><summary>答案与解析</summary>

B。不一定，需要在服务方另行撤销。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 168 · 读取仓库：先了解目标再修改

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-168) · [总纲](README.zh.md)

## 学习目标

完成「读取仓库：先了解目标再修改」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

远程仓库读取要确认owner、repo、分支和路径。README可能落后于实际脚本，仓库文档也可能包含不可信指令。读取结果应作为任务资料，不替代用户授权。大文件有限读取时保留完整结果入口与版本信息。

## 准备

先完成第167课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github repo OWNER/demo
koder github read OWNER/demo README.md
koder github read OWNER/demo src --ref main
```

将OWNER/demo替换为获准测试仓库；不在无账号课堂自动调用。

## 开发者教学

返回artifact引用、SHA与bytes；摘要截断不能丢失恢复入口。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交远程项目摘要，附仓库、分支、文件和未决项。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：没有，读取能力与写入授权独立。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

读取README后就获得该仓库所有写权限了吗？

A. 没有，读取能力与写入授权独立。

B. 获得了，读权限包含全部管理权限。

C. 获得了，公共仓库允许任何人直接写main。

<details><summary>答案与解析</summary>

A。没有，读取能力与写入授权独立。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 169 · 上传文件：只提交明确选中的内容

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-169) · [总纲](README.zh.md)

## 学习目标

完成「上传文件：只提交明确选中的内容」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

上传项目应先列出要提交的文件，检查秘密、大小和目标分支，再确认。Koder内置提交接口处理显式路径，不应把整个用户目录递归上传。远程分支在确认期间变化时，应读取新状态并重新审查，不能强推覆盖他人。

## 准备

先完成第168课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github commit OWNER/demo README.md src/main.js --message "Add project files"
```

只包含列出的文件；真实运行前核对目标与本次确认词。

## 开发者教学

路径越界、符号链接和秘密检测沿现有门；检测不能替代人工核对。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

准备一个仅含README的私有测试提交计划，真实写入需获准。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不应，只提交明确选定并检查过的文件。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

上传项目是否默认应包含整个目录和隐藏文件？

A. 应该，隐藏文件天然安全且都属于项目。

B. 应该，直接上传用户主目录最完整。

C. 不应，只提交明确选定并检查过的文件。

<details><summary>答案与解析</summary>

C。不应，只提交明确选定并检查过的文件。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 170 · 编辑仓库文案：描述、主页与README

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-170) · [总纲](README.zh.md)

## 学习目标

完成「编辑仓库文案：描述、主页与README」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

仓库描述适合一句话说明用途，主页链接应指向真实可用页面，README承担安装与使用说明。它们的权限和更新接口不同。编辑前先读取当前内容，保留已有正确资料，修改后读回。文案自然具体，避免把内部任务提示词直接贴进公开仓库。

## 准备

先完成第169课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github edit OWNER/demo --description "A local task runner" --homepage "https://example.com"
```

示例主页必须替换为真实获准地址；未执行只是教学。

## 开发者教学

更新设置的UNKNOWN不能自动重复写；保留操作ID与目标。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交README修改稿、仓库一句话简介和事实来源。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不代表，它们是不同字段与操作。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

仓库描述更新成功就代表README也改了吗？

A. 代表，仓库首页显示改变就不必核对文件。

B. 不代表，它们是不同字段与操作。

C. 代表，描述字段和README是同一份数据。

<details><summary>答案与解析</summary>

B。不代表，它们是不同字段与操作。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 171 · 分支与草稿PR：给修改一个审查入口

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-171) · [总纲](README.zh.md)

## 学习目标

完成「分支与草稿PR：给修改一个审查入口」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

分支隔离修改，草稿PR让他人看到问题、变更与验证。PR不是发布，也不是已合并。描述应面向没看过聊天的审查者，先说具体问题和行为变化，再给验证与限制。没有运行的检查明确写未运行。例如修复空输入崩溃的PR，应写触发输入、旧行为、新行为和对应测试；无需把整个产品历史写进去。草稿状态可用于等待真实设备检查，但不能把等待项目填成已通过。

## 准备

先完成第170课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github pr OWNER/demo --head docs/update --base main --title "Improve setup instructions"
```

head需是已有分支；默认草稿不意味着自动合并。

## 开发者教学

PR身份与提交SHA绑定；后续提交变化需重新看验证覆盖。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一份草稿PR说明和审查清单，未授权时不创建远程对象。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，还需审查、合并、构建与部署等步骤。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

创建草稿PR就等于代码已经上线吗？

A. 不是，还需审查、合并、构建与部署等步骤。

B. 等于，PR创建会自动部署到正式域名。

C. 等于，草稿状态就说明已经合并。

<details><summary>答案与解析</summary>

A。不是，还需审查、合并、构建与部署等步骤。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 172 · 并发与UNKNOWN：上传后没回执怎么办

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-172) · [总纲](README.zh.md)

## 学习目标

完成「并发与UNKNOWN：上传后没回执怎么办」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

网络中断可能发生在服务器完成写入之后。此时直接重试会造成重复提交或重复建仓。先保留操作ID与请求摘要，按现有对账入口核对目标。无法确认就继续保持未知，不把“没收到成功”解释成“肯定没执行”。

## 准备

先完成第171课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder github reconcile OWNER/demo
```

对账查证原操作，不重新播放写入。

## 开发者教学

回执持久化先于状态更新；部分对象无法自动证明时保留人工核对。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

画出成功、失败、未知、已对账四态与允许动作。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，原请求可能已经成功。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

写请求超时后立刻再发一次总是安全的吗？

A. 总是安全，超时意味着服务端没有收到。

B. 总是安全，所有写入API都自动幂等。

C. 不是，原请求可能已经成功。

<details><summary>答案与解析</summary>

C。不是，原请求可能已经成功。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 173 · 版本与发布说明：让用户知道装到了什么

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-173) · [总纲](README.zh.md)

## 学习目标

完成「版本与发布说明：让用户知道装到了什么」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

版本号、安装包、更新清单、官网和教程应指向同一发布事实。候选可以用于测试，但不能把未发布参数写成当前用户必然可用。发布说明只描述有来源的本版变化，同时列明重要限制和升级方法。不要为了显得新而随意改版本格式。

## 准备

先完成第172课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
版本矩阵：源码 / 包内版本 / 文件名 / manifest / GitHub / 官网 / 教程
```

每项有可核对值，差异先解决再声明同步。

## 开发者教学

生成元数据应有单一版本来源；包哈希与下载资产同步。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交版本矩阵与发布说明草稿，候选状态明确。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不代表，需要核对实际下载文件。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

官网文字改成新版本就代表安装包更新了吗？

A. 代表，不需要读取实际下载文件。

B. 不代表，需要核对实际下载文件。

C. 代表，网页版本文字会自动重打安装包。

<details><summary>答案与解析</summary>

B。不代表，需要核对实际下载文件。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 174 · 打包：把运行所需内容完整带走

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-174) · [总纲](README.zh.md)

## 学习目标

完成「打包：把运行所需内容完整带走」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

打包要包含运行代码、依赖、资源、许可和教程，同时排除凭据、缓存和测试私人数据。Windows与macOS可能需要不同运行时与启动脚本。包生成后应从新目录解压并运行入口，而不是只看压缩命令退出0。

## 准备

先完成第173课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
清单：入口、runtime、resources、docs、licenses、manifest、checksums
```

教材ZIP与安装包是不同产物，不能混称。

## 开发者教学

包内路径与大小写跨平台核对；不靠开发机全局依赖补缺。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

制作一个小示例包及文件清单，验证缺资源时能被检测。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，包可能漏依赖或资源。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

开发目录能运行就证明打包后一定能运行吗？

A. 不能，包可能漏依赖或资源。

B. 证明，打包工具不会遗漏任何依赖。

C. 证明，开发机缓存可替代安装包内容。

<details><summary>答案与解析</summary>

A。不能，包可能漏依赖或资源。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 175 · 官网与教程同步：内容和链接一起验收

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-175) · [总纲](README.zh.md)

## 学习目标

完成「官网与教程同步：内容和链接一起验收」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

教程更新不只是改标题。命令参数、截图版本、下载链接、版本清单和语言页都要一致。已有生产部署可能被其他任务更新，发布前先读取当前状态再合入本次增量。部署工具返回成功后还要读回真实页面与文件。

## 准备

先完成第174课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
同步表：介绍页、下载页、教程页、命令参考、更新日志、安装脚本、校验文件
```

每个入口都能指向正确产物。

## 开发者教学

内容生成复用真实命令目录，避免多处手写参数漂移。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交一份教程发布检查表与回退目标，不要求课堂自动上线。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不够，还需要实际读回下载资产。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

部署API返回成功就足够证明用户下载链接正确吗？

A. 足够，部署成功意味着所有链接都指向新资产。

B. 足够，只验证页面状态200无需核对包。

C. 不够，还需要实际读回下载资产。

<details><summary>答案与解析</summary>

C。不够，还需要实际读回下载资产。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 176 · 回退与事故记录：恢复服务并保留证据

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-176) · [总纲](README.zh.md)

## 学习目标

完成「回退与事故记录：恢复服务并保留证据」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

出现发布问题时先控制影响、保护数据和证据，再选择回退或修复。旧版本是否兼容新数据需要提前知道，不能盲目覆盖。事故记录关注时间线、影响、根因和改进，不靠删除失败日志让报表变绿。例如新版本使用新增数据库列，回退旧代码前要确认旧代码是否能读取现有数据。先用备份副本演练，不直接对用户生产库执行未经验证的逆向迁移。

## 准备

先完成第175课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
事故卡：发现时间、影响范围、当前状态、缓解、证据、根因、后续动作
```

已恢复与根因已解决分开说明。

## 开发者教学

回退也需回执和验证；旧FAIL保留，新成功不能洗掉历史。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

写一个合成更新失败的事故记录，包含回退限制。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不一定，恢复与根因分析是两项工作。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

回退后能运行是否代表根因已经查清？

A. 代表，恢复后原错误证据可以删除。

B. 不一定，恢复与根因分析是两项工作。

C. 代表，回退是完整根因分析。

<details><summary>答案与解析</summary>

B。不一定，恢复与根因分析是两项工作。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 177 · 后台Agent：激活、可见范围与打扰预算

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-177) · [总纲](README.zh.md)

## 学习目标

完成「后台Agent：激活、可见范围与打扰预算」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

常驻意味着终端关闭后任务宿主仍可能运行，不等于获得所有生活数据。邮件、日历和浏览历史等来源需要单独授权，主动通知需要阈值、安静时段和每日上限。用户应能查看状态并停用。定时醒来可以保持沉默，不需要每次都推送。

## 准备

先完成第176课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
koder activate
koder status
koder deactivate
实际开启用户级服务前按当前确认流程操作。
```

未激活时前台CLI仍可用；系统服务验收需真实平台。

## 开发者教学

单一agentd与既有gateway协调；崩溃恢复不重放未知外部动作。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交常驻状态图、可见范围和通知预算，标出需真实系统验收项。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不需要，没有值得提醒的事件应保持安静。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

后台每次醒来都必须主动发一条消息吗？

A. 不需要，没有值得提醒的事件应保持安静。

B. 必须，定时醒来就是定时推送任务。

C. 必须，沉默说明后台不工作。

<details><summary>答案与解析</summary>

A。不需要，没有值得提醒的事件应保持安静。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 178 · 毕业项目设计：选一个真实但有界的问题

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-178) · [总纲](README.zh.md)

## 学习目标

完成「毕业项目设计：选一个真实但有界的问题」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

毕业项目应同时练习任务定义、实现或写作、验证和交接。选题可以是小网站、待办应用、办公内容包或本地Skill，不必做庞大平台。先限定对象、产物和非目标，再分阶段。缺少账号或设备时把相关部分列成可演练接口，不伪造完成。

## 准备

先完成第177课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
项目提案：问题、用户、输入、产物、范围、阶段、验收、风险、未验条件
```

提案能在现有环境完成核心路径。

## 开发者教学

基线固定后增量实施；保护其他任务与用户已有工作。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交提案与项目地图，列3条明确非目标。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不是，完整、可验证和可交接更重要。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

毕业项目越大就一定能证明能力越强吗？

A. 一定，功能数量越多质量越高。

B. 一定，范围越大越不需要清楚验收。

C. 不是，完整、可验证和可交接更重要。

<details><summary>答案与解析</summary>

C。不是，完整、可验证和可交接更重要。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 179 · 毕业项目实施：检查点、证据与复盘

单元12 · 建议30分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-179) · [总纲](README.zh.md)

## 学习目标

完成「毕业项目实施：检查点、证据与复盘」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

实施阶段按最小闭环推进：先做核心路径，再补边界，最后做体验与交接。每阶段记录实际产物，遇到问题保留失败并定位，不用整项目推倒重来。编程和写作采用不同质量标准，但都要求事实、范围和验证一致。

## 准备

先完成第178课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
阶段1核心产物→阶段2边界与失败→阶段3体验→阶段4交接
```

中途停止也有可恢复成果，完成状态可核对。

## 开发者教学

任务输入、模型设置、源码和证据版本关联，便于复现。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

交阶段产物、检查日志和一次失败到修复的过程。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，验收依赖实际产物与检查。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

最后回复很自信就能替代项目验收吗？

A. 能，模型明确说成功就不需文件。

B. 不能，验收依赖实际产物与检查。

C. 能，交付质量取决于总结语气。

<details><summary>答案与解析</summary>

B。不能，验收依赖实际产物与检查。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)

---

# 180 · 毕业答辩与后续学习：能够解释也能够交付

单元12 · 建议90分钟（含自行练习） · 0.4.13版课堂

[课堂](index.zh.html#lesson-180) · [总纲](README.zh.md)

## 学习目标

完成「毕业答辩与后续学习：能够解释也能够交付」的操作练习，能够解释结果、诊断常见问题并提交可核对的作业。

## 原理讲解

完整课堂的终点是能独立完成一个有界任务，并向别人解释做了什么、为什么这样做、怎样验证和哪里还不确定。阅读完成、测验完成、实操作业完成要分开记录。这里提供自评标准，不自动颁发职业资格或证明真实账号与设备已经通过。

## 准备

先完成第179课。使用自有Koder Projects练习目录和合成数据；阅读示例不会执行命令。账号、图形操作和外部写入须另有可用环境与授权；没有条件就记录NOT_RUN。

## 示例与解读

```text
答辩五问：解决什么？产物在哪？证据是什么？有什么限制？怎样继续或回退？
```

每个回答能指向项目文件、日志或来源，而不是只有承诺。

## 开发者教学

建立后续回归题库时固定原题、环境与评分口径；避免改题后宣称进步。
实现前固定输入、输出、错误与权限契约。为本课关键边界设计一个应通过与一个应拒绝的用例。
交付时记录源码/配置版本、实际命令、退出码、产物及回退方式；静态检查不替代真实账号或设备验收。

交件包含：接口契约、一个正例、一个反例、真实输出、未验范围、恢复方式。复用[验收模板](../tutorial-labs/acceptance-template.md)。

## 实操验收场景

提交毕业包：README、项目地图、产物、证据、来源、回退和复盘。自评5项各0–4分，并说明依据。

至少提交明确产物、关键步骤记录和一项失败或边界检查。结合本课判断题核对：不能，需要实际项目与证据，进度只是一种学习记录。 对真实设备或外部服务没有执行的部分写NOT_RUN。

## 自测

把180课全勾选就能证明所有实操能力已验证吗？

A. 不能，需要实际项目与证据，进度只是一种学习记录。

B. 能，网页勾选与真实环境验证完全等价。

C. 能，读过教程就自动获得所有平台认证。

<details><summary>答案与解析</summary>

A。不能，需要实际项目与证据，进度只是一种学习记录。

</details>

## 延伸阅读

- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [START-HERE.zh.md](../START-HERE.zh.md)
