# 18. 电脑与文件：查看、授权、撤销

建议 45 分钟

**目标**：在明确授权范围内操作浏览器或桌面，并核对每一步真实状态。

**准备**：只用自己创建的测试窗口和公开网页；不操作正在使用的私人窗口。GUI需要受支持的系统、驱动和交互桌面。

## 手把手操作

1. 运行 koder permissions status，查看network/browser/desktop/files等范围。

   **应看到**：缺失项明确；不能因--yes就当作已有电脑授权。

2. 通过Setup或 koder permissions request 的提示申请本次目标所需范围。

   **应看到**：只开放目标所需权限；系统弹窗需用户自己核对。

3. Windows运行 koder mcp doctor windows-mcp --json；检查后再在Setup测试/启用内置驱动。

   **应看到**：缺驱动、架构或权限如实显示；不要额外winget安装一套抢配置。

4. 给任务：“在我新建的测试文本窗口输入 HELLO-KODER，然后读回；不要保存到私人目录。”

   **应看到**：操作前识别目标，操作后重新观察；输入成功需实际窗口内容。

## 常见问题与恢复

- **驱动不存在或无显示服务器**：只执行可用的文件/API任务，记录GUI未验；不虚报点击成功。
- **锁屏后无法操作**：本机后台任务与锁屏GUI是两种能力；原生锁屏组件仍需签名与专机验收。

## 作业与自查

在自有窗口完成一次输入和读回；撤销对应权限后验证后续操作被阻止。

**自查标准**：保留目标窗口、授权、工具回执和读回证据；撤权负例必须没有额外点击。

## 开发者教学

1. 窗口身份用平台返回的实际句柄/PID等证据固定；标题相同不等于同一个目标。

2. 清理仅限本轮拥有的资源，取消不终止其他用户进程。

3. 分别记录tools/list、tools/call、图形效果和真实用户任务；发现工具不等于已完成操作。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [WINDOWS-MCP-BUNDLED.en.md](../WINDOWS-MCP-BUNDLED.en.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 18 课 / 共 30 课 · 电脑与文件：查看、授权、撤销 ━━
教练 › 先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  提示 · 以上授权命令会改变本机权限记录，不要整段粘贴执行。只运行你选择的一项。撤销阻止后续电脑工具调用，不会撤回已经发送的文件或恢复已覆盖内容；系统设置中的授权单独管理。
教练 › 文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 18 课 / 共 30 课 · 电脑与文件：查看、授权、撤销 ━━
教练 › 先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  提示 · 以上授权命令会改变本机权限记录，不要整段粘贴执行。只运行你选择的一项。撤销阻止后续电脑工具调用，不会撤回已经发送的文件或恢复已覆盖内容；系统设置中的授权单独管理。
教练 › 文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 18 课 / 共 30 课 · 电脑与文件：查看、授权、撤销 ━━
教练 › 先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  提示 · 以上授权命令会改变本机权限记录，不要整段粘贴执行。只运行你选择的一项。撤销阻止后续电脑工具调用，不会撤回已经发送的文件或恢复已覆盖内容；系统设置中的授权单独管理。
教练 › 文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 18 课 / 共 30 课 · 电脑与文件：查看、授权、撤销 ━━
教练 › 先检查能力，再选需要的目录和能力。主目录模式用于个人文件；完整工作模式选择本机可见磁盘根。授权时逐项核对执行程序、目录和远端成员，输入 GRANT 后才保存。系统隐私授权、管理员权限和缺失的驱动仍需按系统流程处理。
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  提示 · 以上授权命令会改变本机权限记录，不要整段粘贴执行。只运行你选择的一项。撤销阻止后续电脑工具调用，不会撤回已经发送的文件或恢复已覆盖内容；系统设置中的授权单独管理。
教练 › 文件操作请提供完整路径，带空格的路径用双引号。Windows 的 D: 是盘符相关路径；明确使用 D:\folder\file.txt。遇到“路径离开目录”，先检查工作目录、授权根、网络盘与链接目标，再查看 permissions status，不要关闭目录边界检查。文件发给渠道前，还要确认接收人、群和附件范围。
```

</details>
