[English](RELEASE-0.6.2.md) · [简体中文](RELEASE-0.6.2.zh.md)

# Koder CLI 0.6.2

首次任务前，在系统浏览器或手机扫码登录 KARMEN。CLI 向官方服务领取短期授权事务，网页登录并确认设备后自动继续；令牌保存到本机受保护存储。账号密码只在网页输入，不开 localhost 回调、不要求粘贴授权码。

- `koder login`、`koder logout`、`koder account status`、Setup 和聊天 `/login` / `/logout` 共用一条登录链路。
- 未登录的无头任务先返回 `LOGIN_REQUIRED`，不启动模型；刷新、取消、保存失败和另一窗口换号都有明确原因码。
- 用户开启本机自修复后，候选和运行期补丁都在 QuickJS-WASM 隔离解释器执行，仅允许同步 JSON 功能函数；不能访问宿主文件、进程、网络、凭据或改写内核。原有七类功能模块、原代码、回归、隔离停用和回退保留。
- 账号检查期间仍可打断与引导；Setup 默认焦点恢复；更新进度准确显示 CLI 官网。
- 修复原生登录在较慢网络下过早放弃可达地址的问题；保留整次请求时限和取消，不自动重放授权领取。

原有 Skill 和各平台能力保留。模型 API Key、邮箱绑定和电脑权限仍分别配置。本地遥测开关及“不上传云端日志”的边界保持。

[登录手把手教程](ACCOUNT-LOGIN.zh.md) · [本机自修复](SELF-REPAIR.zh.md) · [安装](INSTALLATION.md) · [English](RELEASE-0.6.2.md)

安装包与自动更新统一由 [CLI 官网](https://kodermodule.com/cli-download.html) 提供，GitHub 更新说明与教程。0.6.1 已发布原件不会覆盖。

实际回归与打包检查见同版 ACCEPTANCE-RESULTS.json。真人手机扫码、各平台系统浏览器和原生凭据保存仍由 beta 专员验收。Windows/Ubuntu GUI、真实163收发、通知可见性、十题及 SELECTED-50 质量目标不宣称通过；已有失败证据保留。macOS 锁屏组件仍未签名。

## 发布与核验状态

官网 stable feed 已显示 0.6.2。实际包首次默认更新检查返回 `NETWORK_FAILED`；正式发布后，未改程序、未加载观察器、未覆盖网络的默认复核在 2.24 秒内通过，确认 0.6.2 已是最新版本。首次失败保留，底层连接原因尚未证实。

发行负责人的最终回执记录了 32 个发行原件的公网完整下载，名称、大小和 SHA-256 均与冻结清单一致。包回归与官网检查结果来自对应发布负责人，本次文档同步没有重跑这些产品测试。参见官网[本版验收记录](https://kodermodule.com/releases/cli-0.6.2/ACCEPTANCE-RESULTS.json)。真人浏览器或手机确认、各系统原生凭据保存、Windows/Ubuntu GUI、真实 163 收发、可见通知及独立 MiniMax 质量题组，本轮仍未完成验收。
