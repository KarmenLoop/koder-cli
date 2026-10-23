# Windows-MCP 与 Code Graph 真实调用验收

记录日期：2026 年 10 月 23 日，Koder CLI 0.4.0-preview.28 发布之后。已发布安装包的字节不变。本说明仅把下面已测组合的“上游程序未运行”更新为实际结果，不代表所有平台都通过。预设仍需用户明确启用。

## 已测组合

| 集成 | 独立环境 | 真实检查 | 结果 |
| --- | --- | --- | --- |
| Windows-MCP 0.8.8 | GitHub 托管的一次性 Windows Server 2025、x64、Python 3.14.8；公开 preview.28 包 | stdio 握手与工具发现；PowerShell 写入自有文件并独立读回；Snapshot 识别自有 WinForms 窗口；Click、Type 输入标记，由窗口事件写文件核对；窗口正常退出 | 通过 |
| Koder 调用 Windows-MCP | 同一 runner，未修改的公开 preview.28 包 | 显式接受许可、保存并启用预设、连接测试、Agent 发现工具、真实 PowerShell 调用、独立文件读回及模型续答 | 通过 |
| CodeGraphContext 0.6.13、Ladybug 0.19.1 | Apple silicon、macOS 27.0、独占 Python 3.12.14 venv；任务目录内的 OpenSSL 3；数据库缓存 256 MiB | 索引三个 Python 文件、核实真实后台作业完成、换进程重开索引、统计、符号查找、跨文件调用方查询、空结果检查、拒绝工作区外索引请求 | 通过 |
| Koder 调用 Code Graph | 原有 Koder 主机、SDK 与 Agent，连接真实上游进程 | 逐项发现真实 schema；三次审批下完成三次真实图谱查询；读取源文件后在同一任务续答 | 通过 |

Windows 证据：[成功的独立作业](https://github.com/KarmenLoop/koder-cli/actions/runs/39905571499)，修订 47a60fe524417cd628d89549125746e0621d32fa。使用的公开包 SHA-256 为 `309d6c159ca432538ff8b90afd4e77a01cf28d4b38aba9eb4f8e535aeb9e8672`。

两项 Agent 验收都用脚本模型驱动工具调度与续答，没有调用付费模型 API，也不证明真实模型的自主规划能力。Mac 图谱验收采用自有加密凭据测试端口，避免操作用户钥匙串；不据此签发 macOS 原生凭据存储通过。Windows 使用公开 CLI 及其正常主机。

## Windows 配置与首次核对

每条命令在同一个项目目录运行，或重复指定相同的 `-w`。先准备与系统架构匹配的 Python 3.14+；用户目录内的独立环境不需要管理员安装：

```powershell
$runtime = Join-Path $env:LOCALAPPDATA 'Koder Tools\windows-mcp-0.8.8'
py -3.14 -m venv $runtime
& "$runtime\Scripts\python.exe" -m pip install 'windows-mcp==0.8.8'
koder mcp add windows --preset windows-mcp --command "$runtime\Scripts\windows-mcp.exe"
koder mcp test windows
koder mcp enable windows
```

菜单入口是当前终端的 `/setup` → 应用与 MCP → Windows-MCP。如果直接解压归档运行，先用 `koder eula` 阅读许可，同意后本人明确运行 `koder eula accept`。安装器的 `KODER_EULA_ACCEPT=1` 不会偷偷代替 CLI 接受运行许可。

第一次先让 Koder 观察自有测试窗口，再在该窗口完成小操作。本轮核实的上游工具名是 `PowerShell`、`Snapshot`、`Click`、`Type`；先发现实际 schema，不照抄旧示例中的 Shell 或 State。没有新增或验证管理员提权、持久 PowerShell 策略变更或登录任务。

## Mac 图谱原生依赖与资源限制

首轮真实启动在 MCP 握手前失败：Ladybug 的 wheel 链接到 `/opt/homebrew/opt/openssl@3/lib` 下的 OpenSSL 3。表面的“缺少 C API 共享库”回退提示遮住了最初的原生导入错误。单独启动 Ladybug 的最小复现确认根因是缺 OpenSSL 库；本轮不是 Kuzu 与 Ladybug 类型冲突。

测试这个组合前，先提供兼容的 OpenSSL 3。已装 Homebrew 时，其常规依赖命令是 `brew install openssl@3`；这是用户单独执行的步骤，不会随 Koder 安装自动运行。也可以明确向图谱子进程传入自备、可信的动态库目录。本轮只从官方 Homebrew bottle 核验 SHA-256 后，在任务目录放置所需库，没有改系统库路径。

```sh
export KODER_CGC_LIBDIR='/absolute/path/to/trusted/openssl3/lib'
export KODER_CGC_BUFFER_MB=256
koder mcp add graph --preset codegraph --command /absolute/path/to/venv/bin/codegraphcontext --env-ref DYLD_LIBRARY_PATH=KODER_CGC_LIBDIR --env-ref CGC_EMBEDDED_BUFFER_POOL_MB=KODER_CGC_BUFFER_MB
koder mcp test graph
koder mcp enable graph
```

只有该原生依赖确实需要时才设置 `DYLD_LIBRARY_PATH`。目标仍是锁定的 CodeGraphContext 0.6.13 程序。256 MiB 足够本轮小项目验收，不代表大型仓库的性能保证。库路径必须到达实际 Python 进程；中间的 macOS 系统启动器可能清除 DYLD 变量。本轮验证的是直接启动 venv 可执行文件的路径。

索引是用户明确批准的动作。`check_job_status` 的实际状态在 `job.status`，需要等真实完成。使用实际 `find_code` schema，以及 `analyze_code_relationships` 的 `query_type: find_callers` 或 `find_callees`。用 `app_tools` 按具体工具名搜索，不一次塞入整个工具目录；大结果返回 artifact 引用，可用 `app_result_read` 分页读取。沿图谱定位后仍要读源文件。

## 仍未覆盖

本轮没有签发 Windows 10/11 用户实机、中文输入法组词、UAC／管理员动作、Windows／Linux 上的 Code Graph、uvx 冷下载、真实模型账号、自主规划、大仓库或长期运行验收。preview.28 预设中的静态验收字段保留发布时快照，不是全部平台的通行证。

七条暂不可用模型路线保持原状态。没有扫描用户工程、读取真实邮箱或 API Key、修改账务、全局安装依赖、打断其他任务或静默启用预设。此前依赖错误与验收脚本问题保留原记录，只把修正后亲见的结果记为通过。
