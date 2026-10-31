# 设备识别、音频分析与安全审查

适用范围：Koder CLI 0.6.1。旧安装包不会因为在线文档更新而获得这些工具。运行 `koder version` 核对安装版本；发行状态以正式更新清单为准。

三个入口复用同一内核、会话、权限、Skill 开关与工具回执。默认按任务选择方法，不在启动时扫描设备、加载听觉模型或扫描网络。

| 任务 | 默认内置方法 | 实际工具 |
| --- | --- | --- |
| USB、串口、主板或开发板识别 | `builtin:connected-devices` | `device_inventory` |
| 音频测量、听觉分析、选音与对比 | `builtin:earshot` | `audio_analyze`、`audio_reference`；已启用的 EARSHOT 通过 `app_tools` / `app_call` |
| 安全审查、漏洞分析、钓鱼或供应链问题 | `builtin:cybersecurity-review` | `security_review`、`security_reference`；原文件、检索、审批和杀毒适配器 |

## 1. 识别 USB 与串口设备

先用**正常用户终端**打开 Koder。插入设备时确认使用的是数据线，设备已供电，并进入需要的 USB 模式。纯供电连接不会出现在 USB 枚举中；这不能靠软件扫描弥补。

```sh
koder permissions request --capability devices.read
koder devices list
koder devices list --json
```

第一条通过现有电脑授权流程申请只读设备信息。`--yes` 不代替这项授权。授权后也可以在对话中输入：

```text
识别当前连接的 USB 开发板，列出 VID/PID、串口与驱动状态。
先只读检查；不要刷固件、安装驱动或向串口写入。
```

结果中的 `devices` 是系统实际枚举到的设备。每条包含设备名称、VID/PID、接口类别、已匹配串口与驱动状态。原始序列号不输出；稳定 ID 使用哈希。USB 桥接芯片提示只用于下一步查资料，不能据此把 CP210x、CH340 或 FTDI 误认成某一款完整主板。

| 系统 | 数据来源与覆盖 | 需要注意 |
| --- | --- | --- |
| Windows | PowerShell/CIM：USB PnP 设备、Ports 类接口及串口映射；返回驱动问题码 | 不依赖 WMIC。问题码 28 等由系统报告；工具不自动装驱动。 |
| macOS | `system_profiler SPUSBDataType`，嵌套 USB 集线器及 `/dev/cu.*` 串口候选 | 尚不能可靠关联的串口放入 `unassignedSerialPorts`，不猜测归属；枚举本身不证明驱动可控制。 |
| Ubuntu / Linux | `/sys/bus/usb/devices`、接口驱动绑定与 `/sys/class/tty` 的实际父链 | 映射 `ttyUSB*`、`ttyACM*`；扫描中拔出单个设备不会中断后续设备。读串口可能另需系统用户组或驱动设置。 |

状态含义：`enumerated` 表示扫描正常结束，允许零设备；`partial` 表示部分项跳过或达到数量上限；`unavailable` 表示探测通道不可用；`permission-required` 表示尚未授权。诊断同时返回 `skipped` / `diagnostics`。最多报告 512 个设备，系统命令最长等待 15 秒，可取消。

发现设备之后仍需确认厂商协议、用途和成功标准，再选择已有 App/MCP、串口程序、ADB 或厂商工具。**识别成功不等于控制成功**。读取串口、改变设置、固件烧录和管理员动作继续走各自权限与审批；不会把枚举权限扩成全系统控制。

排查顺序：检查数据线和接口 → 重新枚举 → 核对 VID/PID 与问题码 → 查制造商官方驱动/协议文档 → 在已授权范围验证一个最小操作。未看到设备时如实说明当前 OS 证据，不能声称“此型号不支持”或“已经控制”。

## 2. 开箱可用的本机音频测量

把 WAV 放到当前项目内，或用 `-w` 指定其项目目录。不要将音频路径当作安装目录。

```sh
koder audio status
koder audio measure sample.wav --json
koder audio timeline sample.wav --segments 24 --json
koder audio compare after.wav --reference before.wav --json
```

也可以直接对 Koder 说：

```text
检查 sample.wav 的时长、峰值和 RMS，说明是否有削波。
对比 before.wav 与 after.wav 的音量变化，给出实测值。
```

本机内核读取真实文件，返回 SHA-256、时长、声道、采样率、位深、样本峰值、RMS、满刻度样本比例和静音帧比例。`timeline` 是分段能量，不是语音转写或声音事件识别。支持 PCM 8/16/24/32 位与 IEEE float 32/64 位 WAV；单文件沿原文件读取器限制为 64 MiB。

- `null` dB 表示零能量，不是测量失败。
- 满刻度样本是可能削波的证据，不代表已经确认可闻失真。
- `compare` 的差值是第一文件减参考文件；不能把音量更高当作质量更好。
- 这些工具不录麦克风、不联网、不上传音频、不加载 Python 或听觉模型。
- 原生读写边界沿用项目路径校验，拒绝越界、符号链接和硬链接。

`AUDIO_FORMAT_UNSUPPORTED` / `AUDIO_CODEC_UNSUPPORTED` 表示需要下节的已配置 EARSHOT 后端或用户允许的格式转换；`AUDIO_TRUNCATED` 表示文件声明的数据不完整。不能把失败当成“已经听懂”。

## 3. EARSHOT 的语义听觉、选音与声画分析

Koder 默认提供 EARSHOT 方法和本机测量。语义模型没有塞进基础安装包：上游 CLAP/AST 权重约 1.1 GB，需在用户选择使用时准备；不会每次启动重复下载，也不会拖慢无关任务。

上游采用 [Leonxlnx/earshot](https://github.com/Leonxlnx/earshot)，锁定提交 `591fa3e028032e6dce56620a20e932e35667e8d8`（0.4.0）。原方法资料以一个按需读取的压缩资源包提供，MIT 许可保留；听觉权重另遵守各自许可。它是文件音频分析，不是后台监听麦克风。

### 准备可选后端

这一步会下载依赖和模型，需要 Python 3.10+、可用的 Git 和网络。先在自己的终端确认这些前置条件；不要让 Agent 静默安装、提权或修改系统安全设置。以下是新建隔离 Python 环境的示例，已经准备过的环境直接复用。

macOS / Ubuntu：

```sh
python3 -m venv "$HOME/.koder-cli/audio-venv"
"$HOME/.koder-cli/audio-venv/bin/python" -m pip install torch --index-url https://download.pytorch.org/whl/cpu
"$HOME/.koder-cli/audio-venv/bin/python" -m pip install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@591fa3e028032e6dce56620a20e932e35667e8d8"
export EARSHOT_HOME="$HOME/.koder-cli/audio-runtime"
"$HOME/.koder-cli/audio-venv/bin/earshot" doctor --fetch
"$HOME/.koder-cli/audio-venv/bin/earshot" doctor --load
koder mcp add earshot --preset earshot --command "$HOME/.koder-cli/audio-venv/bin/earshot"
koder mcp enable earshot
koder mcp test earshot
```

Windows PowerShell（不要求激活 `.venv`，避免修改执行策略）：

```powershell
py -3 -m venv "$env:USERPROFILE\.koder-cli\audio-venv"
& "$env:USERPROFILE\.koder-cli\audio-venv\Scripts\python.exe" -m pip install torch --index-url https://download.pytorch.org/whl/cpu
& "$env:USERPROFILE\.koder-cli\audio-venv\Scripts\python.exe" -m pip install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@591fa3e028032e6dce56620a20e932e35667e8d8"
$env:EARSHOT_HOME="$env:USERPROFILE\.koder-cli\audio-runtime"
& "$env:USERPROFILE\.koder-cli\audio-venv\Scripts\earshot.exe" doctor --fetch
& "$env:USERPROFILE\.koder-cli\audio-venv\Scripts\earshot.exe" doctor --load
koder mcp add earshot --preset earshot --command "$env:USERPROFILE\.koder-cli\audio-venv\Scripts\earshot.exe"
koder mcp enable earshot
koder mcp test earshot
```

Apple 芯片环境若 CPU 索引没有对应 PyTorch wheel，按 PyTorch 官方安装说明选择该平台支持的 wheel；不要改用未经核验的镜像。模型准备前不能设置离线环境变量；任务运行时预设会开启离线模式。自定义了 `KODER_CLI_HOME` 时，把示例中的缓存根换成该数据目录下的 `audio-runtime`。`doctor --fetch` 下载，`doctor --load` 实际加载验证，两者含义不同。

`mcp add` 默认保存为未启用，`enable` 才启动；`mcp test` 验证连接和工具发现，不代表所有模型已经加载。`koder mcp doctor earshot --command <绝对路径>` 检查可执行入口，输出 `launcher-found` 也不等于语义模型验收通过。

### 任务执行

```text
在本项目音效里挑选更接近“柔和木质敲击”的声音，实际分析候选，再比较 before.wav 和 after.wav。
分析本项目成片的音画同步和声音事件，指出依据及还没有验证的部分。
```

Agent 应先 `app_tools` 读取该项目 EARSHOT 的真实 schema，再经原 `app_call` 审批执行。选音用 `rank → find → describe`；声画用 `timeline → sheet → critique`；对比用 `ab`。首次语义分析可能需要几十秒，后续复用连接进程中已加载的模型。缺模型、缺解码器或执行失败均应给出实际错误。

管理预设固定来源、工作区、离线变量和线程数，不在启动时 `--warm`。路径在 prepare/validate/call 三个阶段校验，支持当前工作区的系统路径别名，拒绝越界、链接、通配符和 `~`/额外引号等会被上游二次展开的形式。传实际路径字符串；CLI shell 参数本身仍可正常加引号。这个前置校验**不是操作系统沙箱**，启用的外部可执行程序仍需可信。

原上游 `llm_critique` 会上传音频到 Gemini，在 Koder 的受管预设中隐藏并拒绝，预设不注入 Gemini 密钥。它不属于默认本地听觉能力。不会把 `consent:true` 这样的模型参数当成用户同意上传。

## 4. 安全任务默认流程

对话示例：

```text
对 api.js 和 auth.js 做只读安全检查，读实际代码，列出位置、风险依据和修复建议。
检查这份钓鱼邮件样本，只分析附件文本，不点击链接、不回复发送者。
```

安全方法先明确资产和授权范围，然后读取当前代码/材料。`security_review` 对最多 32 个选定文本文件做词法初筛，每个文件最多 256 KiB，总共最多 2 MiB，最多返回 200 个候选。包括证书验证关闭、动态代码执行、Shell 插值、硬编码凭据、私钥材料、宽泛 CORS 和弱哈希候选。

返回文件、行号、SHA-256、候选风险与修复方向，省略源码和凭据值。之后 Agent 需读上下文、追踪输入来源与敏感操作，必要时在隔离环境测试。**命中不等于已证实漏洞，零命中不等于安全**；无法读取的文件会列出原因。只读审查不再被误判为必须修改源代码才能交付。

`security_reference` 可搜索、分页读取随包 818 个社区方法条目及其参考资料，按主题中英关键词检索。它们来自 [Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills)，固定提交 `54a798831d2266a3ca61ce68a7acb80b81160d57`、Apache-2.0，**该项目并非 Anthropic PBC 官方项目或背书**。Koder 保留来源、许可与条目 NOTICE，将其作为不可信参考资料，不安装或执行仓库中的 Python/Shell 脚本。

默认流程为防御性审查；修补、外部目标扫描、文件隔离/删除等动作继续检查真实任务授权和审批。杀毒沿用现有 `computer_care_status` / `computer_care` 对已安装 Defender/ClamAV 的调用；这份方法库不是新增杀毒引擎，不能声称已清除病毒。

## 5. 开关与包管理

`koder setup → 技能` 可分别开关三个内置方法；也可以：

```sh
koder skills disable builtin:connected-devices
koder skills disable builtin:earshot
koder skills disable builtin:cybersecurity-review
```

用对应的 `enable` 恢复。关闭会从任务工具列表去除相应原生工具和方法，重新打开会话核对；已经单独启用的外部 MCP 连接需要另外执行 `koder mcp disable earshot`。技能开关不删除用户文件、不撤销或授予其他权限。

每种能力只有一个内置入口。818 个方法不是 818 个常驻 Skill，也不等于 818 个已安装扫描器。原始资料按需解压、校验哈希和分页读取，空闲后释放文本缓存；基础包不携带 Python、Torch 或听觉权重。本次两份压缩方法资料合计约 3.93 MiB，另有目录索引和许可文本。

## 6. 验收边界

本次开发验证包括三端枚举数据解析、Linux 热拔插容错、权限拒绝、取消、真实 WAV 样本测量、工作区隔离、安全输出脱敏、默认方法选择、MCP 兼容回归和随包资源校验。真实 MiniMax-M3.1-Flash 已分别调用 `audio_analyze`、`read_file` / `security_review` 并返回具体测量和候选风险。

macOS 实际枚举命令已运行，当前测试机报告零 USB 外设；这不能证明某款开发板已通过。Windows / Ubuntu 真机外设、串口实际读写、固件操作、可选 Python EARSHOT 语义模型与录音均为 **NOT_RUN**，不可把夹具或连接测试说成这些项目已经通过。

Beta 验证：接入一款已知开发板，核对系统设备管理器/系统报告/sysfs 与 CLI 清单；拔出后重跑；无权限时应有明确提示。准备 EARSHOT 后，用一段已知声音分别测量和语义分析，核对源文件 SHA、数值、模型来源及实际工具回执。任何差异保留 `koder logs` 报告和步骤，勿提供设备密钥或账号密码。
