# 工具运行组件：安装、连接与实际验证

0.8.1 草稿沿用已有托管引擎及 0.7.2 的平台限制。安装仍需文档列明的授权与前置条件，不新增重复 Skill，也不替换系统包管理器。

[English](TOOL-RUNTIMES.en.md) · [简体中文](TOOL-RUNTIMES.zh.md)

本指南对应含 `koder skills runtime media|playwright|earshot|codegraph` 的构建。它补充 FFmpeg、ffprobe、Playwright 启动器以及 EARSHOT、CodeGraphContext 的运行依赖。方法 Skill、运行组件、已启用连接和业务成功是四种不同状态。

组件按需装到当前用户的 Koder 数据目录；不改系统 Python，不需要全局 `pip`、`npm` 或 `uvx`，不重复加入同名 Skill。查看状态不会下载、启动浏览器或加载音频模型。基础安装包保留所有原有方法，较大的引擎、浏览器和权重单独准备。

## 从哪里进入

在对话中输入 `/setup` → **应用与 MCP**，选择 **FFmpeg / ffprobe**、**Playwright**、**EARSHOT** 或 **Code Graph · CodeGraphContext**。也可使用以下命令；Windows PowerShell、macOS 和 Ubuntu 终端的 Koder 命令相同。

```sh
koder skills runtime list
koder skills runtime media status
koder skills runtime playwright status
koder skills runtime earshot status
koder skills runtime codegraph status
```

安装与模型下载需要现有的 network、skills.update 授权。缺少时按提示运行并确认：

```sh
koder permissions request --capability network --capability skills.update
```

`--yes` 不代开这些权限。安装过程按 Ctrl+C 可取消；原有组件、配置和项目保留。固定资产显示已下载 MB / 总 MB，下载中断后保留分片，重跑同一安装命令会续传或复用已校验缓存。取消会终止本次安装的子进程树，不会发布半安装目录。

## FFmpeg 和 ffprobe

```sh
koder skills runtime media install
koder skills runtime media test
```

两者一起安装。Koder 执行工具时会提供准确路径；无需把另一个 FFmpeg 加进系统 PATH。媒体 Skill 可通过 `KODER_FFMPEG`、`KODER_FFPROBE` 取得组件。下载源的分发标签为 `b6.1.1`，各平台二进制版本以 `media test` 的实际输出为准，不能把分发标签当作 FFmpeg 版本。

`test` 校验文件清单并运行两个版本命令。真正的媒体验收还需生成或转码一段自有测试素材，再用 ffprobe 检查时长、轨道及编码信息。

## Playwright

```sh
koder skills runtime playwright install
koder skills runtime playwright test
```

安装固定版本的 CLI、Playwright 和浏览器驱动模块；不在项目中执行 `npm install`。可复用本机已安装的 Chrome。如果没有可用浏览器，明确下载独立 Chromium：

```sh
koder skills runtime playwright browser
```

浏览器放在 Koder 私有缓存中。启动器在没有 Chrome 时选择这份 Chromium；版本探测不会再执行上游 npm 更新检查。Ubuntu 仍须具有浏览器需要的系统动态库；无显示服务器时使用 headless 模式。缺失库会返回实际进程错误，安装器不会自行运行 `sudo apt` 或改系统安全设置。

安装不代开 browser/desktop 权限，也不读取用户浏览器配置。Koder 的受批 shell 中可调用 `playwright-cli`；运行环境同时提供 `KODER_PLAYWRIGHT_MODULE`、`PLAYWRIGHT_BROWSERS_PATH`，已有 Chrome 时提供 `KODER_CHROME`。这些是 Koder 子进程环境，不承诺在外部终端里全局存在。

## EARSHOT

先安装解码器和语义引擎，再准备模型：

```sh
koder skills runtime media install
koder skills runtime earshot install
koder skills runtime earshot test
koder skills runtime earshot models
```

没有模型时 `test` 可以返回 `needs-setup`，这表示 Python/程序已安装但业务条件未齐。`models` 明确下载并加载 CLAP / AST 权重，约 1.1 GB；音频任务随后使用离线缓存。CPU PyTorch 与 EARSHOT 装在独立目录，不共享 CodeGraph 的 MCP Python 依赖。Windows 使用独立 Python 3.13，不替换 Windows-MCP 的 Python 3.14。

**不要执行 `pip install earshot`**：同名 PyPI 项目不是本集成的来源。受管安装固定到 Leonxlnx/earshot 的已记录提交，并保存依赖来源及许可证。

在要处理音频的项目目录保存连接，然后测试、启用：

```sh
koder mcp add earshot --preset earshot --runner managed
koder mcp test earshot
koder mcp enable earshot
koder mcp doctor earshot --runner managed --probe
koder chat
```

对话示例：`用已连接的 EARSHOT 测量当前项目 tone.wav，再描述其中声音；不要录音或上传。` Agent 先读取真实 schema，再通过 `app_call` 申请并执行。测量成功不等于语义描述正确；应使用已知内容的素材分别核对。原生 `koder audio measure` 的 WAV 测量继续独立可用。

目前受管语义引擎支持 Apple Silicon macOS 14+、Windows x64、Linux x64/arm64 的已锁定下载目标。macOS Intel 缺少当前 Python/PyTorch 组合的 wheel，受管安装会明确拒绝；仍可自行验证并连接兼容的 `--runner installed` 外部引擎。不能把这项限制写成全平台已实测。

## CodeGraphContext

```sh
koder skills runtime codegraph install
koder skills runtime codegraph test
koder mcp add graph --preset codegraph --runner managed
koder mcp test graph
koder mcp enable graph
koder mcp doctor codegraph --runner managed --probe
```

受管运行器使用 Kuzu 0.11.3 与固定 tree-sitter parser 库。无需 Neo4j 服务、Docker 或 macOS Homebrew OpenSSL。每个项目单独保存索引、运行 HOME 和允许的根目录，切换项目不会复用另一项目的图谱。`installed` / `uvx` 的历史配置保持原样。

第一次索引仍是明确操作：对话中说 `为当前项目建立图谱，等索引完成后查找某函数的调用方，并读取源码核对。` Agent 应调用 `add_code_to_graph`，使用返回的 `job_id` 查询 `check_job_status`，直到 `job.status` 为 `completed`；再用真实 schema 的 `find_code`、`analyze_code_relationships` 查询。`find_callers` 是实际查询类型，不是 `callers`。

工作区之外的索引路径被拒绝。图谱导航不能代替测试，也不能据死代码候选直接删代码。用 `-w` 时，各条命令应选择同一项目。保存预设默认停用；`enable`、索引和实际调用各保留现有审批。

## 磁盘、缓存与版本

下载目标、长度、SHA-256 和固定依赖版本见 `src/tool-runtime-assets.json`。安装后保存 `runtime.json`、`inventory.json`，Python 引擎另外保存 `constraints.txt` 和 `pip-report.json`。完整 `test` 会检查文件是否被改写或混入额外文件；普通状态页只作轻量检查，不每回合扫描数 GB 依赖。

EARSHOT 的 Numba 运算缓存保存在数据目录 `audio-runtime/numba`，与模型缓存一样位于受校验的程序目录之外。正常分析不会向依赖目录写入缓存；不需要关闭完整性检查来运行后续任务。

本次 macOS arm64 实测安装目录约为：媒体 87 MiB、Playwright 18 MiB、EARSHOT 990 MiB、CodeGraph 660 MiB；不包含共享 Python、浏览器、下载缓存和约 1.1 GB 音频权重。不同平台大小会不同。为完整音频与图谱准备数 GB 空间；无需每个项目重复安装引擎。模型和索引只在对应任务使用时加载，不随每次 CLI 启动全部驻留内存。

## 错误与恢复

| 状态或错误 | 含义与下一步 |
| --- | --- |
| `not-prepared` | 尚未安装，运行该组件的 `install`。 |
| `needs-setup` | 程序已能运行，但仍缺解码器或模型，查看 `checks.problems`。 |
| `TOOL_RUNTIME_PLATFORM_UNSUPPORTED` | 当前平台没有锁定的受管依赖，使用已验证的外部程序或支持的平台。 |
| `TOOL_RUNTIME_CHECKSUM` / `TOOL_RUNTIME_FILES_CHANGED` | 下载或安装内容不匹配；不启动该组件，保留报告进行修复。不要关闭校验继续执行。 |
| `TOOL_RUNTIME_PROCESS_FAILED` | 查看 `detail.exitCode`、`stderr`，可区分缺库、版本冲突和上游错误。 |
| `TOOL_RUNTIME_TIMEOUT` / `TOOL_RUNTIME_CANCELLED` | 安装/探测未完成；已完成的下载保留，未发布的安装目录不会启用。 |
| `COMPUTER_PERMISSION_REQUIRED` | 按现有 permissions 流程授权；安装不等于应用操作授权。 |

## 验收范围（2026-11-02）

macOS arm64 已真实验证：FFmpeg 生成 3 秒 WAV、ffprobe 检查；Playwright 分别使用独立 Chrome 和受管 Chromium，读标题、点击、截图快照、关闭；媒体 Skill 将 HTML 渲染为 MP4；EARSHOT 发现 16 个工具并实际测量、描述；CodeGraph 发现 29 个工具并实际索引 Python/JavaScript、查询调用方、拒绝越界路径。Koder Agent 的 `app_tools → app_call → 回执 → 续答` 使用确定性模型夹具验证，调用的是实际 MCP 进程，不是伪造工具返回。

Windows、Ubuntu 原生安装与 GUI、macOS Intel、各类真实业务素材以及真实付费模型的自动选工具质量均为 **NOT_RUN**。不据本机检查宣称这些平台或全部上游工具已经通过。

来源与许可证见 [第三方声明](../THIRD_PARTY_NOTICES.md)；连接说明见 [MCP 集成](MCP-INTEGRATIONS.zh.md)。
