# Koder 架构与组件来源

[English](ARCHITECTURE-AND-PROVENANCE.en.md) · [简体中文](ARCHITECTURE-AND-PROVENANCE.zh.md)

Koder 自研任务内核把用户意图、目标计划、模型请求、权限检查、工具调用、持久回执和交付核验接在同一执行链路中。内核在私有源码库维护；本次发行不公开内核开发仓库。

| 层次 | Koder 实现 | 外部组件或参考 |
| --- | --- | --- |
| 任务协作 | 稳定子任务请求、追加消息、结果唤醒和父任务工件核验 | 参考包括 DeepSeek dsh-superagent-prototype 在内的 Router–Worker 思路，未替换为上游执行器 |
| 上下文 | 预算投影、工具结果编码、受保护回执和原链路检索 | Headroom 是已署名的架构参考，不要求部署其上游代理服务 |
| Web Data | 权限与来源检查、结构锚点、恢复阈值、采集任务和证据 | Python、Scrapling、Playwright 提供解析与浏览器能力，保留各自许可 |
| 运行组件 | 固定摘要、安装位置、诊断与调用路由 | FFmpeg、ffprobe、Playwright、EARSHOT、CodeGraph 及平台依赖保留原作者归属 |
| Skill 与资源 | 目录、适配、配置和同一 harness 调用 | 随包及用户安装的第三方 Skill 保留原作者、来源及许可 |

学习架构、编写原生编排与集成开源依赖需要分别说明。我们将 Koder 自研部分标为自研，也将第三方组件准确标注。完整记录见[来源致谢](../OPEN_SOURCE_CREDITS.md)、[第三方声明](../THIRD_PARTY_NOTICES.md)及[组件清单](../THIRD_PARTY_COMPONENTS.json)，具体资源以附带许可为准。

安装组件不会自动授予电脑权限，读到 Skill 也不等于工具已执行。实际结果由运行回执、文件摘要和逐平台验收记录证明。
