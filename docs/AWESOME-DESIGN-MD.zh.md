# 网站需求与设计参考：手把手使用

适用于 Koder CLI 0.4.22。[English](AWESOME-DESIGN-MD.en.md) · [更新说明](RELEASE-0.4.22.zh.md)

Koder 随包提供 VoltAgent/awesome-design-md 的 84 份完整 DESIGN.md 设计分析，并默认把它接入建站和改版流程。不是只列出外部链接：目录、原文、来源、许可和哈希都可离线读取。模型仍由你选择，原来的文件审批、取消、费用预算、项目隔离和发布权限继续生效。

## 1. 更新并确认功能

在已安装 Koder 的终端运行：

```text
koder update
koder --version
koder design status
koder design verify
```

版本应为 0.4.22。status 应显示 enabled: true、entries: 84、offline: true；verify 的 verified: true 只表示随包文本哈希一致，不代表网站已经做好或所有参考适合你的品牌。读取这些命令不调用付费模型。

Windows PowerShell、CMD、macOS Terminal 都可运行这些 koder 命令。安装入口在 [CLI website](https://kodermodule.com/cli-download.html)。若仍是旧版本，先查 Windows 的 where.exe koder 或 macOS 的 type -a koder，确认 PATH 指向哪个程序。

## 2. 从一个具体网站开始

在自己的项目文件夹启动 koder，或用 koder project create 建立独立项目。已有项目用 koder chat -w "/absolute/project/path"；Windows 改成实际 Windows 路径。

先输入一句自然请求，例如：

> 帮我做一个社区图书馆网站。

交互会话会先整理已知事实，再通过 ask_user 询问缺失需求。最多分三组，能一次补充：

1. 网站要解决什么问题，主要给谁看？
2. 访客最重要的动作是什么，需要哪些页面或功能？
3. 喜欢怎样的风格，有哪些文案、图片、技术或发布要求？

可以回答：

> 给附近家庭看，主要让他们查看开放时间。首页、活动、联系三个区域；温暖、安静、编辑式。已有馆名，暂时没有照片，图片用明确占位。中文、手机优先，沿用当前项目，不做账号或支付。

已提供的答案不会再列入缺失问题。选“我补充需求后继续”只是表示你要补充，不会被当成你已经回答。也可以选建议原型，或明确说“先按合理假设直接做”。未提供的内容会写在 assumptions，不能冒充你的事实或授权。

非交互 koder run 会对可选设计问题使用明确假设继续。它不会替你批准真实发信、购买、登录、部署或提供秘密。业务上必须知道的事实仍应标明待确认。

## 3. 查参考，理解取舍

你可以让代理寻找参考，也可以自己先读：

```text
koder design list --query "温暖 编辑"
koder design list --query linear
koder design read claude --limit 2000
koder design read claude --offset 2000 --limit 2000
```

列表会返回准确 id、类别和固定来源。read 支持分页；按 nextOffset 继续，直到 nextOffset 为 null。不要假设第一段就是整份文档。代理使用同一套 design_catalog / design_read 工具，没有第二份目录或专用云账号。

参考可以借鉴层级、密度、留白和组件关系。不要复制别人的商标、照片或商业字体；这些资产没有因 DESIGN.md 的 MIT 文本许可自动获准。字体应给本机系统字体或获准资源的替代方案。

## 4. 将需求落实为项目规范和页面

website_brief 会读取已有 DESIGN.md，返回原文、哈希与待合并段落；它本身不写文件。已有文件要通过原编辑工具合并，不能为了加入参考而整份覆盖。生成的约定包括：

- 已明确的需求、可修改假设和仍待确认的事实。
- 选定参考的固定 URL 与 SHA-256。
- 本项目自己的配色、字体层级、间距、移动布局和组件状态。
- 主路径、预览与检查清单；未运行的项保持未验。

前端实现继续沿原工具和技术栈完成。新建网站可沿原 project_visuals 流程比较三个不同方向；你已指定样式或要求跳过时，直接落实。三份文字说明并不等于三个已实现的页面。

完成后检查实际 HTML/组件/样式文件、主按钮和表单行为，并用 workspace_preview 启动本地预览。交付应包括文件、实际预览地址、测试结果、待补素材和 H5 项目结构图。没有真实后端的表单必须标成原型，不能说已发送成功。

## 5. 继续完善，而非反复重做

在当前任务中补充“保留布局，移动端改成单列，按钮用深红色”。原 steer / queue 规则不变。让代理先读现有约定与代码，再作局部修改；历史设计决定和无关文件继续保留。

示例验收清单：

| 要核对的内容 | 怎样判断 |
| --- | --- |
| 需求落实 | 读者、主要动作和页面范围能在实际页面上找到 |
| 手机适配 | 窄屏无横向溢出，正文和按钮可读可用 |
| 键盘操作 | Tab 能到达链接/按钮/表单，焦点可见，标签明确 |
| 主路径 | 实际点击与提交有可观察结果；占位和后端限制说明清楚 |
| 事实 | 开放时间、联系方式、数字与素材有用户来源；没有就标待确认 |
| 交付 | 文件、测试、预览和结构图可打开，失败/未验不被改写为通过 |

静态检查通过不等于视觉效果、无障碍或真实表单服务已经全部验收。

## 6. 单独关闭或重新启用

```text
koder design off
koder design on
```

也可在 Setup → Skills 里切换“Awesome DESIGN.md · 网站需求与设计”。它使用原 disabledSkills，兼容一键关闭全部 Skills。关闭后，新任务不再自动采用该方法或暴露这三个工具；已有网站文件、其他设计 Skills、预览功能都继续保留。已有会话应重新打开或按原 reload 流程载入设置。手动 design list/read 仍可查资料。

## 开发者接线与真实调用边界

资源固定于上游 commit 3b605329240ce735b510037cca322f1831fdd7f8。84 份设计和配套 README/许可共 170 个文本资源；打包时核对 Git blob SHA，运行读取核对 SHA-256。归属和许可见 THIRD_PARTY_NOTICES.md 与 licenses/awesome-design-md/LICENSE-MIT.txt。

builtin:awesome-design-md、三工具和薄 system 提示挂在现有 fusion/harness 路径；chat/run 与使用同一 Core 的任务复用。普通任务不发送建站 schemas，明确建站、点名本方法或读取该 Skill 后才按需提供；AI 应用参考工具也按任务加载，避免挤占小窗口。工具可见性不授予执行权限，原 profile deny、只读模式与不确定结果核对继续生效。

本版实际运行过：完整原文校验、交互 ask_user 往返、拒绝与取消、无头明确假设、原工具写文件、Node 测试、HTTP 预览回读和 H5 输出。模型决策与预览打开适配器使用确定性测试替身；真实付费模型自主设计质量、浏览器视觉/键盘操作、Windows 原生交互仍为 NOT_RUN，不能据此声称所有模型都已达到同样设计质量。
