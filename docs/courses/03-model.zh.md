# 03. 配置模型：给 Koder 装上大脑

建议 35 分钟

**目标**：使用自己账号支持的服务、协议和型号建立连接，分别验证文本与工具续答。

**准备**：准备服务商控制台里的产品类型、模型ID和官方Base URL。密钥只在专用输入框或秘密管理器里提供，不贴到聊天。真实诊断可能收费。

## 手把手操作

1. 运行 koder setup，选择模型设置；先选国内/国际、按量API/套餐，再选型号。

   **应看到**：产品与密钥来源一致；灰色入口停用，不要把网页会员当API额度。

2. 输入密钥后保存；运行 koder model show，核对模型、协议和地址。

   **应看到**：配置值符合控制台；分享输出前确认敏感信息已遮盖。

3. 运行 koder model test；成功后再运行 koder model test --tools。

   **应看到**：分别保存两次结论；文本成功、工具失败时不能认定编程代理全通。

4. 运行 koder model presets；需要检查某入口的模型信息时用 koder model models <预设ID>，以本机帮助和控制台为准。

   **应看到**：发现结果与可用权限分别核查；自动更新型号信息不会给账号新增额度。

## 常见问题与恢复

- **HTTP 401/403**：核对账号地区、产品、授权和密钥有效期，不循环重试。
- **422且含1026/1027**：这是MiniMax内容过滤信号；按第22课缩小输入、开新会话诊断，不当断网处理。

## 作业与自查

填写一张不含密钥的连接卡：预设ID、模型ID、协议、Base URL、文本测试、工具测试、费用来源。

**自查标准**：每项都有配置或实际输出依据。没有执行的测试写 NOT_RUN；不能用“应该支持”补通过。

## 开发者教学

1. CI优先用 --key-env VARIABLE_NAME 引用秘密变量，不把Key值写入参数。

2. 分别准备成功、401、429、5xx、内容过滤与工具协议错误的本地桩；断言错误分类和脱敏信息。

3. model test 是短诊断，不照搬长任务重试预算；真实请求和桩测试分别记账。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)
- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 3 课 / 共 30 课 · 配置模型：给 Koder 装上大脑 ━━
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

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 3 课 / 共 30 课 · 配置模型：给 Koder 装上大脑 ━━
  提示 · 模型页现在会自动获取当前账号的最新型号；进入‘当前账号最新型号’选择后才保存。列表不是通行证，工具能力仍请运行 koder model test --tools。自动获取可关闭，也可用 koder model refresh 手动刷新。
教练 › Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：
    koder setup
        方向键或鼠标选服务商、选型号，再把密钥粘进去；还能一键打开拿密钥的网页
教练 › 喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：
    setx OPENAI_API_KEY "sk-你的密钥"
        永久存进你的账户，之后新开的窗口才读得到
    set "OPENAI_API_KEY=sk-你的密钥"
        只在当前窗口有效；引号要把整段包起来
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        用预设，配置里只记变量名
    koder model set --preset local --model qwen3:8b
        用本机 Ollama，不需要密钥
    set "KODER_MODEL=gpt-6.1-sol" && set "KODER_BASE_URL=https://api.openai.com/v1" && set "KODER_API_KEY=sk-…" && koder review
        在 CI 里直接用环境变量
  提示 · koder model presets 能查看当前可用预设；koder model show 看当前配置，密钥只露最后四位。
  （小声）CMD 关掉窗口就忘了你敲过什么，可站在你身后的同事不会忘。所以最推荐在 koder setup 里粘贴密钥：屏幕上只显示末四位，但配置文件中的密钥仍是明文。
教练 › 今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。
  · 可以现场运行 koder model presets 看全部预设。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 3 课 / 共 30 课 · 配置模型：给 Koder 装上大脑 ━━
  提示 · 模型页现在会自动获取当前账号的最新型号；进入‘当前账号最新型号’选择后才保存。列表不是通行证，工具能力仍请运行 koder model test --tools。自动获取可关闭，也可用 koder model refresh 手动刷新。
教练 › Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：
    koder setup
        方向键或鼠标选服务商、选型号，再把密钥粘进去；还能一键打开拿密钥的网页
教练 › 喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：
    echo 'export OPENAI_API_KEY=sk-你的密钥' >> ~/.zshrc
        写进 zsh 的配置（macOS 默认用 zsh），之后新开的终端都读得到
    export OPENAI_API_KEY=sk-你的密钥
        只在当前窗口有效
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        用预设，配置里只记变量名
    koder model set --preset local --model qwen3:8b
        用本机 Ollama，不需要密钥
    KODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review
        在 CI 里直接用环境变量
  提示 · koder model presets 能查看当前可用预设；koder model show 看当前配置，密钥只露最后四位。
  （小声）把密钥直接敲进命令要小心：shell 的历史记录（~/.zsh_history、~/.bash_history）记性比你前任还好。所以最推荐在 koder setup 里粘贴——屏幕上只显示末四位，也不进命令历史，但会明文保存在本机配置。环境变量命令也可能进入历史，不要分享含密钥的记录。
教练 › 今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。
  · 可以现场运行 koder model presets 看全部预设。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 3 课 / 共 30 课 · 配置模型：给 Koder 装上大脑 ━━
  提示 · 模型页现在会自动获取当前账号的最新型号；进入‘当前账号最新型号’选择后才保存。列表不是通行证，工具能力仍请运行 koder model test --tools。自动获取可关闭，也可用 koder model refresh 手动刷新。
教练 › Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：
    koder setup
        方向键或鼠标选服务商、选型号，再把密钥粘进去；还能一键打开拿密钥的网页
教练 › 喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：
    echo 'export OPENAI_API_KEY=sk-你的密钥' >> ~/.bashrc
        写进 bash 的配置（Ubuntu 默认用 bash；用 zsh 就写 ~/.zshrc），之后新开的终端都读得到
    export OPENAI_API_KEY=sk-你的密钥
        只在当前窗口有效
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        用预设，配置里只记变量名
    koder model set --preset local --model qwen3:8b
        用本机 Ollama，不需要密钥
    KODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review
        在 CI 里直接用环境变量
  提示 · koder model presets 能查看当前可用预设；koder model show 看当前配置，密钥只露最后四位。
  （小声）把密钥直接敲进命令要小心：shell 的历史记录（~/.zsh_history、~/.bash_history）记性比你前任还好。所以最推荐在 koder setup 里粘贴——屏幕上只显示末四位，也不进命令历史，但会明文保存在本机配置。环境变量命令也可能进入历史，不要分享含密钥的记录。
教练 › 今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。
  · 可以现场运行 koder model presets 看全部预设。
```

</details>
