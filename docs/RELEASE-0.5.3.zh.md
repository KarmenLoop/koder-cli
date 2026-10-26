# Koder CLI 0.5.3

本版细化启动折光体，并统一启动面板、Setup 和选择器的细蓝色边框。会话区和常驻输入保持紧凑。

## 更新内容

- 保留三瓣环形轮廓，细化透明表面的明暗与边缘覆盖，加入克制的色散高光。
- 启动面板、Setup 和选择器共用细蓝色边线、稍亮角点与清晰标题；会话分隔线改为细线。
- 选择器按终端实际宽度适配，修复低于 42 列时边框仍按最小宽度绘制的问题。
- 启动动画识别 `KODER_REDUCED_MOTION=1` 和 `REDUCED_MOTION=1`。原动画设置、深浅主题、低色彩、无颜色与 ASCII 降级继续可用。

原有常驻输入、引导、排队、取消和审批继续保留。本版修改显示层，不改变任务引擎、模型路由或工具权限。

## 使用方法

运行 `koder update` 后重启 CLI，用 `koder --version` 核对版本为 `0.5.3`。以下命令可单独查看静态启动画面：

```sh
koder banner --no-anim
koder banner --ascii --no-anim
```

Setup 内原有主题和动画偏好继续生效。需要减少启动动效时，在启动前设置环境变量 `KODER_REDUCED_MOTION=1`；PowerShell 当前窗口可用 `$env:KODER_REDUCED_MOTION='1'`。输入、引导、排队和快捷键见[会话界面教程](SESSION-DOCK.zh.md)。

## 验证范围

本增量的 UI 定向回归 97 项通过。实际 CLI 在本机 macOS PTY 夹具中，truecolor 与 `NO_COLOR` 两种模式各通过 12 个阶段；使用脚本化 provider，不需要 API Key。这是定向源码与终端检查，不代表全产品回归或真实模型评测。具体命令、安装包检查与安装结果分别记录在本版发布资产 `ACCEPTANCE-RESULTS.json`，不沿用上一版本的测试数量。本机 PTY 不代表 Windows Console、ConPTY 或中文输入法已通过。

Windows 终端、图形操作、冷安装和更新交由 beta 专员，本地发布记录仍为 NOT_RUN。本次视觉修改没有重新验收付费模型质量、私人邮箱投递或真实账号写入。macOS 锁屏原生组件继续保留未签名 HOLD。已有高级 MCP 覆盖限制及第三方来源保持，见[能力说明](NATIVE-MCP-CAPABILITIES.zh.md)。

Windows 与 macOS 继续使用原有版本化安装器和运行包。本版只同步 GitHub，不修改或部署官网。
