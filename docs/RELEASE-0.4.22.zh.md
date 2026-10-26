# Koder CLI 0.4.22 更新说明

本版将 awesome-design-md 接入 Koder 建站流程：先询问缺失需求，读取相关设计参考，再落实项目设计约定、代码、检查与预览。随包提供固定版本的 84 份完整 DESIGN.md，支持离线阅读，默认启用且可关闭。

## 新增与修复

- 最多三组需求询问：目标与读者、主要动作与页面、风格与素材/技术约束。已知信息不重复问；脚本或明确要求直接做时标明假设继续。
- 新增 design_catalog、design_read、website_brief，复用原 Skill、工具循环与审批。已有 DESIGN.md 保留并合并，新规范包含本项目的样式决定与实际验收清单。
- 沿原三方案、网页实现、workspace_preview 和 H5 项目结构图完成交付，不把参考文档当成已完成网站。
- 新增 koder design status/list/read/verify/on/off 与 Setup Skills 开关。
- 设计与 AI 应用参考工具按任务加载，减少普通任务的小上下文占用。
- 普通落地页不再被要求添加 Koder 安装路径或模型介绍；这些只用于 Koder 产品页。

## 更新与操作

运行 koder update，重开 CLI 后确认 koder --version 为 0.4.22。Windows PowerShell/CMD 与 macOS 安装器使用同一版本运行包。运行 koder design verify 核对随包内容，再在聊天里提出网站任务。

完整步骤见 [中文手把手教程](AWESOME-DESIGN-MD.zh.md)。来源固定于 VoltAgent/awesome-design-md commit 3b605329240ce735b510037cca322f1831fdd7f8；84 份设计及配套文本共 170 项。MIT 文本许可不自动授权使用品牌商标、图片或商业字体。

## 本轮验证与边界

集成源码回归 121 项通过。已本地执行原文校验、交互询问、无头假设、原审批拒绝/取消、文件合并前读取、CLI 开关、工具选择和小窗口恢复。确定性模型脚本驱动原工具写入实际页面，运行两项 Node 测试、回读 HTTP 预览并生成 H5 结构图。模型与浏览器打开适配器使用测试替身；真实付费模型设计质量、原生 GUI 视觉/键盘验收未运行。

原工具轮次默认不限，取消、费用预算、权限与 UNKNOWN 核对继续保留。Windows 实机由 beta 专员验收；既有真实账号、GUI、常驻与锁屏未验项继续保留，未签名锁屏候选不进入正式包。仅同步 GitHub，不部署官网。回退可使用固定 cli-0.4.21 安装器，保留配置、会话和未知结果回执。
