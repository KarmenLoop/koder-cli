# Koder CLI 0.7.2

[English](RELEASE-0.7.2.md) · [简体中文](RELEASE-0.7.2.zh.md)

本版补齐 Web Data 的 XPath、自适应选择器与动态网页渲染。原选择器失效时，可依据同源旧采集任务的已校验结构指纹查找替代节点；候选不唯一、字段缺失或页面语义变化时明确返回部分结果，不编造成功。采集记录、来源和摘要仍存入原工作区。

先运行 `koder web-data test --json` 检查随包 Python/Scrapling。需要动态页面时，运行 `koder skills runtime playwright install` 和 `koder skills runtime playwright browser` 准备受管启动器与浏览器，再通过现有 permissions 授予网络与浏览器能力。详细步骤见 [数据采集教程](WEB-DATA.zh.md) 与 [运行组件教程](TOOL-RUNTIMES.zh.md)。

点击、填表、键盘、标签页、框架、截图、PDF、上传下载、网络和存储操作复用原 browser-work 与 Playwright 启动器。自动采集使用独立临时浏览器，不读取用户个人登录配置；交互登录仍走原授权流程。页面内请求同样检查来源、robots、权限和流量预算。浏览器关闭异常时只清理本次创建的进程，保留用户其他浏览器。

一并收录受管 FFmpeg/ffprobe、Playwright、EARSHOT、CodeGraph 安装与诊断、原生 Headroom 上下文处理、子任务去重及补充、结果事件唤醒和父子交付证据接线。运行组件使用固定版本和摘要校验；音频模型等外部依赖仍需按教程准备。

保留现有功能、唯一 Skill 注册、取消、费用预算、审批和第三方声明。只发行当前组件，不叠加旧版 Skill 或另一套执行器；内核开发源仓保持私有。下载与更新统一使用 [CLI 官网](https://kodermodule.com/cli-download.html)。

验收结果以随包 ACCEPTANCE-RESULTS.json 为准。macOS 浏览器与运行组件实测不等于 Windows/Ubuntu 原生验收；生产真人登录、真实邮箱与系统通知仍分别保留 NOT_RUN。自适应并不保证任意改版都可恢复，也不宣称覆盖上游全部 Python API、隐身反爬、验证码处理或每种浏览器特性。

## 发行核对与未验范围

发行记录核对了 32 个公开原始文件的完整大小与 SHA-256，共 1,111,582,280 字节，并核对 286 份当前教程和 10 个中英文网页。旧版 0.7.1 更新器与本版安装包均使用默认清单完成检查，未执行安装更新。

348 项运行时回归与 19 项 macOS 浏览器交互记录分别列出，不叠加为独立用例总数。另有一次有界 MiniMax-M3 任务：8 次模型请求、9 次工具调用，实际写入并读回 CSV；这不是长任务质量或基准分数验收。

原 Mac 有 3 个完整文件下载超时，随后在独立 H3C 机器上完成同文件大小与哈希核对。原失败继续保留，不能据此认定原 Mac 网络已经恢复。首次浏览器关闭挂起，以及因发行包有意不含构建工具而失败的一项构建脚本检查，也保留在发行历史中。

Windows/Ubuntu 原生安装与 GUI、正式服务真人登录、真实邮件与系统通知、小时级自主任务，以及完整 Firefox/WebKit 矩阵仍为 **NOT_RUN**。这些记录不代表全部 Scrapling API 或所有网站通过；[验算记录](AGENT-VERIFICATION.zh.md)里的早期质量失败也不会因发布而改成通过。

[主任务与 Worker 协作](SUPER-AGENT-ARCHITECTURE.zh.md) · [本版截图](screenshots/README.zh-CN.md)
