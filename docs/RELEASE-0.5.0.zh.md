# Koder CLI 0.5.0

本版继续使用原 Core、模型/BYOK、预算、权限、取消和项目历史，增补可核查的调用链。

- 内置 Tesseract.js 7.0.0、WASM 和中英文识别数据，真实读取图片及扫描 PDF 单页；无需 Python、CDN 或新 OCR 账号。文件权限、源 SHA、资源限制和取消保留。
- 90 个专业角色、25 个领域，把输入材料、交付物、检查清单和角色版本注入原子任务循环。角色不授予执业资质。
- 默认同时执行 4 个子任务，其余 FIFO 排队；Setup 可改。180 是未收集任务槽位，不是付费模型并发保证；费用预算、撤权和取消仍有效。
- tool_inventory 与 koder tools audit 区分工具注册、Skill 文本可读、资源完整、缺少授权和驱动不可用；必须检查实际回执。
- 无头 ask/run 输出 terminal result、completionState 与 reasonCode；启动失败也有结构化终态。显式任务默认不等 stdin，--yes 不代开电脑权限。
- 小上下文模型按需读取无关方法说明，保留 Skill 目录和旧功能，避免长会话被新增指导挤满。

[完整手把手教程](FRAMEWORK-0.5.zh.md) · [OCR](OCR.zh.md) · [角色与队列](SUBAGENT-ROLES.zh.md) · [无头/CI](HEADLESS-0.5.zh.md)。

真实离线 OCR、文件、子进程和原工具调用在本机验证；模型选择使用确定性夹具，不宣称付费模型质量分提升。源码、包内、安装升级、GitHub 下载分别保存收据。Windows 10/11 实机由 beta 专员验证，本机 NOT_RUN；Linux 桌面通知、真实客户邮件、外部账号写入、付费并发和专业内容质量未冒充通过。未签名 macOS 锁屏组件继续 HOLD。

Windows/macOS 安装器和完整版本运行包发布 GitHub，官网不改。原有功能与失败记录保留。
