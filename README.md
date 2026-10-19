# Koder CLI 0.4.0-preview.5

修复微信、飞书和企业微信初次连接反复失败的多处原因，并新增自然语言自更新与默认开发流程。

- 安全的初始化/鉴权/读取操作遇到临时网络故障或 HTTP 408/429/5xx 时按总超时预算重试，二维码轮询可恢复，停止操作会取消当前连接。
- WebSocket 增加握手期限、单次重连调度和旧连接回调隔离；已健康运行的网关直接复用，避免企业微信额外验证连接挤掉现有连接。
- 微信失效凭据停止轮询并提示重新绑定。飞书明确区分内部临时错误、凭据/配置错误和连接数限制。消息和文件发送不会因这些连接重试而自动重放。
- 在本地对话说「帮我更新 Koder CLI」或「更新」，即可比较官方 GitHub 版本、校验下载、执行安装并读取新入口核验；没有新版会直接说明。Ask、计划、报告、优化模式只检查。已运行的进程需下一次启动才能加载新代码。
- 开发任务默认读取内置开发技能：检索 GitHub 候选、固定提交核对许可证，逐轮询问关键需求，写出项目规划/框架/任务/工具清单，再用现有审批工具执行。新增只读 GitHub 和技能读取能力，复用原宿主。
- 保留已有教程、协议、API/上下文、记忆和应用/MCP能力。协议与第三方许可文本未改变；未新增复制上游代码，方法参考与既有组件归属见 Credits。

本地完整串行回归 375 项：372 通过、0 失败、3 项 Core 环境跳过。独立 macOS 安装核验覆盖旧版升级、配置与记忆保留、八套教程、安装后本地 HTTP 模型请求和卸载。真实微信/飞书/企业微信/Gamma账号、Windows真机、多台物理设备与生产Core仍未验收。

preview.3/4 用户运行 `koder update --check`、`koder update`、`koder version`。0.3.0/0.3.1/preview.1/2 先执行 README 的官方安装命令一次获得 GitHub 更新器；不要清空配置。preview.5 起支持自然语言更新。

This preview repairs transient channel initialization and reconnect failures, distinguishes permanent authorization errors, reuses healthy gateways, and adds natural-language verified self-update plus a GitHub-first development workflow. Local regression and isolated installation checks do not establish real-account or native Windows acceptance.

Basic local use remains free. New Koder-owned development source is proprietary and is not published. The automatic source archives for this tag contain distribution documentation only. Legacy public source retains its existing licenses.

[Installation](https://github.com/KarmenLoop/koder-cli#readme) · [License](https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md) · [Permissions and data](https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md) · [Credits](https://github.com/KarmenLoop/koder-cli/blob/main/OPEN_SOURCE_CREDITS.md)


This tag contains distribution documentation only. Install Koder from the release assets. The implementation is proprietary; legacy GPL source remains on the main branch under its original terms.
