# 29. 生日歌先问一句，语言由你做主

建议 20 分钟

**目标**：明确选择语言和外部音乐行为，不因生日自动泄露位置或打开有声页面。

**准备**：确认当前环境适合播放声音；语言由用户设置为准，不用IP猜测替代本人选择。

## 手把手操作

1. 用 koder lang zh 或 koder lang en 设置偏好，单次任务可用--lang。

   **应看到**：界面与模型语言按各自支持范围生效；原始代码和引用不乱翻译。

2. 按本课原有音乐命令查看当前设置，先保持关闭。

   **应看到**：阅读状态不打开浏览器、不播放音乐。

3. 确实想听时再明确同意打开选定的外部音乐入口。

   **应看到**：外部网站可能需登录或手动播放；浏览器自动播放限制不能当Koder已播放。

4. 停止播放、关闭测试页，再关闭不需要的音乐偏好。

   **应看到**：不影响原来正在播放的其他应用；语言与音乐独立。

## 常见问题与恢复

- **浏览器打开但无声**：检查页面播放按钮、系统音量与站点限制；不要反复开多个标签。
- **语言识别不正确**：让用户明确选择并保存；不擅自增加IP查询。

## 作业与自查

记录语言设置、是否授权外链、页面打开与实际播放四个独立状态。

**自查标准**：打开不等于播放，播放不等于下载授权；未选择的外部行为没有发生。

## 开发者教学

1. 外部URL校验与浏览器权限沿原入口；不注入账户口令或绕过站点风控。

2. 本地化使用自然表达，日期/语言偏好可独立设置；不能把地区猜测写成用户事实。

3. 把打开失败、播放不可验证与用户拒绝分开记录。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [APP-USE-AND-LEARN.en.md](../APP-USE-AND-LEARN.en.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 29 课 / 共 30 课 · 生日歌先问一句，语言由你做主 ━━
教练 › 音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  提示 · 手动语言优先，其次是你主动开启的本地常用语言计数，IP 只作弱提示。IP 查询会让 ipapi.co 看到公网地址；选外部音乐平台会把访问数据交给该平台。每一步都能回车跳过。
  （小声）蛋糕可以多切一块。权限按需给就好。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 29 课 / 共 30 课 · 生日歌先问一句，语言由你做主 ━━
教练 › 音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  提示 · 手动语言优先，其次是你主动开启的本地常用语言计数，IP 只作弱提示。IP 查询会让 ipapi.co 看到公网地址；选外部音乐平台会把访问数据交给该平台。每一步都能回车跳过。
  （小声）蛋糕可以多切一块。权限按需给就好。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 29 课 / 共 30 课 · 生日歌先问一句，语言由你做主 ━━
教练 › 音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  提示 · 手动语言优先，其次是你主动开启的本地常用语言计数，IP 只作弱提示。IP 查询会让 ipapi.co 看到公网地址；选外部音乐平台会把访问数据交给该平台。每一步都能回车跳过。
  （小声）蛋糕可以多切一块。权限按需给就好。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 29 课 / 共 30 课 · 生日歌先问一句，语言由你做主 ━━
教练 › 音乐和 IP 辅助地区默认关闭，分别确认。开启音乐后，生日使用对话时最多自动打开一个浏览器页；本地旋律无需登录。浏览器不让自动播放时，点播放即可。关闭页面不会影响工作。
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  提示 · 手动语言优先，其次是你主动开启的本地常用语言计数，IP 只作弱提示。IP 查询会让 ipapi.co 看到公网地址；选外部音乐平台会把访问数据交给该平台。每一步都能回车跳过。
  （小声）蛋糕可以多切一块。权限按需给就好。
```

</details>
