# Koder CLI 0.4.24

本版把 PageIndex 文档能力接入原 CLI/Core，默认用于本地文档问答：看目录、由当前模型选章节、回读原文、核对引用，再回答。

支持 Markdown/文本目录与文字 PDF。PDFium WebAssembly 随包携带，无需 Python；保留可用书签并提供真实物理页码。源文件 SHA、项目、节点、页码/行号及逐字引文一起核验，旧版本或编造引文会明确失败。只读子任务能回传实际文档收据。

Setup → Skills 或 koder pageindex on/off 可切换。使用原模型/BYOK、费用预算、取消与权限，不新增云账号、共享知识库或工具轮次上限。旧的网站、CAD、邮箱、MCP 与 Skill 能力保留。

[中文手把手教程](PAGEINDEX.zh.md) · [English](PAGEINDEX.en.md)。源码回归 138 项通过。模型选择为确定性夹具，真实解析与工具调用为本地执行；包内测试和安装升级单列收据。Windows 实机由 beta 专员验收，本机 NOT_RUN。扫描件需 OCR，不声称已完成上游 Flash/cloud OCR、付费模型盲测或私人生产文档验证。旧平台与账号限制继续保留。

仅发布 GitHub，不改官网。保留 PageIndex MIT 与 PDFium 原始许可和来源。
