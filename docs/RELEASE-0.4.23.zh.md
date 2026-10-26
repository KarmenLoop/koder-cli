# Koder CLI 0.4.23

默认把 Fullstack Web Delivery 接入新网站、网站设计改版和旧站修复：先理解需求、复用已有决定、讨论关键缺项，再计划、实现和验证。

- 随包保留原 Skill 0.9.1 的 29 个文件、固定哈希、完整许可证与声明，可离线分页读取。
- 每个新项目有独立目录和 `PROJECT-ANCHOR.md`，记录稳定编号、用途、服务对象、主路径、范围和验收标准。
- 局部修复沿用中心思想；变更用途、受众或主要结果时先列旧/新差异，保留旧方向、哈希与笔记。提案不直接写盘或授予权限。
- 网站需求整理复用锚点，减少重复问询；明确另建独立项目才切换新目录，旧站修复留在原目录。
- Setup 可单独关闭，或运行 `koder skills disable builtin:fullstack-web-delivery`；无关任务不加载锚点工具 schema。

运行 `koder update` 后检查 `koder --version`。Windows 与 macOS 安装器均使用 0.4.23 运行包。通过 `koder skills doctor builtin:fullstack-web-delivery` 检查文本可用性，通过 `koder project anchor -w "实际项目路径"` 查看锚点。

[中文手把手教程](WEBSITE-PROJECTS.zh.md) · [English](WEBSITE-PROJECTS.en.md)

保留原模型/BYOK、权限、默认不限工具轮数、取消、费用预算、未知结果回执、Skills、MCP、邮箱、GitHub、预览与课程。源码、打包、安装证据分别记录。自动验证中的模型决策和浏览器打开适配器为夹具；Windows 实机交 beta 专员，真实模型设计质量、原生浏览器视觉操作及此前账号/常驻/未签名锁屏限制不据此宣称通过。本次只更新 GitHub，官网不变。

本地集成源码回归 138 项通过；安装更新回归 26 项通过。原样保留的可选规格生成器实际产出 18 个文件，校验哈希通过，并以退出码 2 拒绝覆盖已有目录。
