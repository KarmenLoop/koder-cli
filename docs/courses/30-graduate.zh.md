# 30. 毕业典礼

建议 90 分钟

**目标**：完成可运行、可预览、可核对的项目交付，并交一份有来源的产品文稿。

**准备**：从网站、应用或PPT中选一个真实小需求，放在独立Koder Projects目录。使用合成数据，外部部署和GitHub上传单独确认。

## 手把手操作

1. 写任务卡：受众、目标、必需内容、不做的范围、产物路径、验证方式。网站先做3个可浏览版式。

   **应看到**：要求能对应实际文件与行为；选定方案后再细化。

2. 要求实现并补检查；静态站点在当前聊天用 /preview start --directory site，确认目录正确。

   **应看到**：浏览器能看到本地产物；框架工程先按项目README启动开发服务器，再用已有preview URL入口。

3. 改一处标题，查看预览是否更新；检查手机宽度、键盘操作、链接与空数据。

   **应看到**：刷新或重载反映实际改动；不能只交一张截图。

4. 要求生成项目结构图H5：目录、入口、模块、数据流、运行/测试方式和未接通服务；确认图中节点来自项目。

   **应看到**：结构图可在浏览器打开，路径可追溯，不把示例支付/邮件当已上线服务。

5. 写一篇面向技术决策者的介绍，保存intro.md；另写无变更清单的更新邮件，明确非本版增量。

   **应看到**：文稿主文件符合字数与受众；来源、限制和下一步具体，不编定价或新增功能。

6. 交付README、测试结果、预览说明、结构图、文稿与未验清单；用 /preview stop 收尾。

   **应看到**：别人可按README重现；只有明确同意时才按第21课上传或走Netlify授权部署。

## 常见问题与恢复

- **预览状态显示not-running**：预览归属于创建它的进程；在同一聊天操作，独立终端start用Ctrl+C停止，不指望另进程status看到它。
- **完成报告有了却没有项目文件**：回到任务卡逐项核路径与内容；缺文件就标未完成并继续交付。

## 作业与自查

提交毕业包：README、可运行产物、测试日志、project-map.html、intro.md、release-email.md和未验清单。不要提交密钥、账号缓存或node_modules。

**自查标准**：验收五项：能运行、能解释、能验证、能恢复、事实有据。任何一项缺失都写清，截图不能替代运行，脚本模型不能冒真实账号。

## 开发者教学

1. 开发者结课：从干净测试目录按README复现；核验失败基线、最小diff、测试和打包文件。

2. 网页静态预览只绑定本机；不要暴露整个主目录或把公开部署当预览。Netlify登录、站点选择与发布均按已有授权流程。

3. 交件记录版本、SHA、命令/退出码与平台；真实Windows、真实模型、真实账户、签名分别标PASS/FAIL/NOT_RUN。

4. 对照30课完成表找缺口，旧行为回归与新能力验证都保留。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 30 课 / 共 30 课 · 毕业典礼 ━━
教练 › 恭喜毕业！最后送你一张速查表：
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

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 30 课 / 共 30 课 · 毕业典礼 ━━
教练 › 恭喜毕业！最后送你一张速查表：
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
  提示 · 进入你的项目：cd /d D:\code\my-app，然后输入 koder。换盘一定要加 /d，不然只改路径不换盘——这是 CMD 的祖传脾气。
  （小声）教练下班了。记住：Koder 负责提议，你负责拍板，锅……我们一起背。
  · 最后可以选择保留练习场，或者直接删除。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 30 课 / 共 30 课 · 毕业典礼 ━━
教练 › 恭喜毕业！最后送你一张速查表：
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
  提示 · 进入你的项目：cd ~/code/my-app，然后输入 koder。
  （小声）教练下班了。记住：Koder 负责提议，你负责拍板，锅……我们一起背。
  · 最后可以选择保留练习场，或者直接删除。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 30 课 / 共 30 课 · 毕业典礼 ━━
教练 › 恭喜毕业！最后送你一张速查表：
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
  提示 · 进入你的项目：cd ~/code/my-app，然后输入 koder。
  （小声）教练下班了。记住：Koder 负责提议，你负责拍板，锅……我们一起背。
  · 最后可以选择保留练习场，或者直接删除。
```

</details>
