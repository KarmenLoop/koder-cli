# 25. 隐私文件带在包里，断网也能看

建议 25 分钟

**目标**：找到随包隐私全文，知道任务资料会去哪里，并能最小化分享。

**准备**：使用合成资料学习，不在练习中粘贴真实密码、邮件正文或客户数据。

## 手把手操作

1. 依次查看privacy statement、consumer、sources；记录文档版本/来源。

   **应看到**：有本机全文，不需要为了看政策先调用模型。

2. 把数据分为项目文件、对话历史、凭据、外部连接回执。

   **应看到**：每类存储/发送范围分别判断，不能统称“都不外发”。

3. 查看Setup中的资源库、同步、学习与邮件模型读取开关。

   **应看到**：远端模型收到任务上下文；开关和明确授权控制附加来源。

4. 准备反馈前复制最少错误信息并遮盖令牌、私人路径、邮件和账号信息。

   **应看到**：反馈仍能复现问题，但不包含不必要个人资料。

## 常见问题与恢复

- **把CLI配置与桌面密钥库混为一谈**：分别阅读对应隐私说明，不把一种存储保证推广到所有产品。
- **卸载后发现数据仍在**：普通卸载可保留数据；删除前确认本机、外置目录与服务器范围。

## 作业与自查

用虚构项目画一张数据流：本机文件→模型→工具→回执，标出每次外发。

**自查标准**：Key不进模型上下文；所选任务内容可能进入模型；写入外部服务另有授权与回执。

## 开发者教学

1. 日志与错误体脱敏覆盖嵌套字段、URL参数和异常cause；原始敏感数据不能进入公开回归夹具。

2. 权限撤销、导出与删除要按实际范围验收，不能靠UI开关文本证明。

3. 打包检查包含隐私全文与来源记录，不复制未经许可的第三方资料。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [PRIVATE-RESOURCES.md](../PRIVATE-RESOURCES.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 25 课 / 共 30 课 · 隐私文件带在包里，断网也能看 ━━
教练 › 隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。
    koder privacy consumer
    koder privacy statement
    koder privacy desktop
    koder privacy agreement
    koder privacy sources
  提示 · 这几条只读取本机文件，不需要 API Key。接受许可不会顺手开启学习、同步、音乐、IP 查询或电脑权限。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 25 课 / 共 30 课 · 隐私文件带在包里，断网也能看 ━━
教练 › 隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。
    koder privacy consumer
    koder privacy statement
    koder privacy desktop
    koder privacy agreement
    koder privacy sources
  提示 · 这几条只读取本机文件，不需要 API Key。接受许可不会顺手开启学习、同步、音乐、IP 查询或电脑权限。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 25 课 / 共 30 课 · 隐私文件带在包里，断网也能看 ━━
教练 › 隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。
    koder privacy consumer
    koder privacy statement
    koder privacy desktop
    koder privacy agreement
    koder privacy sources
  提示 · 这几条只读取本机文件，不需要 API Key。接受许可不会顺手开启学习、同步、音乐、IP 查询或电脑权限。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 25 课 / 共 30 课 · 隐私文件带在包里，断网也能看 ━━
教练 › 隐私不该是一条打不开的链接。CLI 的完整条款、简明声明，以及官网消费者原始全文，都随包提供。CLI 配置文件和桌面加密密钥库不同，说明会分别讲清。
    koder privacy consumer
    koder privacy statement
    koder privacy desktop
    koder privacy agreement
    koder privacy sources
  提示 · 这几条只读取本机文件，不需要 API Key。接受许可不会顺手开启学习、同步、音乐、IP 查询或电脑权限。
```

</details>
