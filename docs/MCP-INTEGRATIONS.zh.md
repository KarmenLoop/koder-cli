# Windows-MCP 与 Code Graph 接入

从 0.4.4-candidate.3 起，Windows x64 包内置 Windows-MCP 0.8.8 与 Python/依赖，默认选择 bundled 启动器，详见[内置教程](WINDOWS-MCP-BUNDLED.zh.md)。CodeGraphContext 0.6.13 仍为外部可选预设。保存配置保持停用，不改变系统权限。

2026 年 10 月 23 日核对的上游资料：[Windows-MCP](https://github.com/CursorTouch/Windows-MCP)、[其 Python 要求](https://github.com/CursorTouch/Windows-MCP/blob/e28abb5c6934cb3427190bdb970e02644c915ae3/pyproject.toml)、[CodeGraphContext](https://github.com/CodeGraphContext/CodeGraphContext)、[图谱配置实现](https://github.com/CodeGraphContext/CodeGraphContext/blob/93c9685bff9151f50a3121e9913e5ba2d27c1191/src/codegraphcontext/cli/config_manager.py)。这里记录的是预设目标版本，已有程序的实际版本还要在本机核对。

## 当前命令窗口里配置

输入 `/setup`，进入“应用与 MCP”，选择 Windows-MCP 或 Code Graph · CodeGraphContext，再选诊断或保存停用配置。不会另开命令窗口。非 Windows 主机不能选择本地 Windows 配置；原来的通用 MCP 导入与远程 HTTP 接入保留。

这些诊断命令不需要模型、密钥环或连接宿主：

```sh
koder mcp presets --json
koder mcp doctor windows-mcp --json
koder mcp doctor codegraph --json
```

Doctor 只看平台和启动程序是否存在，不执行它。launcher-found 不等于 Python 版本正确、握手成功或桌面能操作；找不到程序或平台不符返回 2。明确启用后连接失败会返回 1，不把“保存了配置”写成“连接成功”。

## Windows-MCP

需要原生 Windows 10/11、Python 3.14 或更新版。WSL 不是原生 Windows 进程；可在 Windows 终端使用此预设，或明确配置已授权的远程 Windows HTTP MCP。Koder 不会擅自找另一台电脑。

先自行安装、核对上游程序，然后在项目目录运行：

```powershell
koder mcp add windows --preset windows-mcp --runner bundled
koder mcp test windows
koder mcp enable windows
koder chat
```

add 只保存停用连接。test 启动程序握手并发现真实工具，随后恢复原来的停用状态，不点击、不打字。enable 才明确允许运行。选择 installed 路径时，在 add 中指定 `--runner installed --command "C:\Users\you\.local\bin\windows-mcp.exe"`。固定使用 serve 入口，不调用安装开机服务的命令；Python 标准输入输出设为 UTF-8，并关闭上游匿名遥测。

之后在对话里明确提出操作目标，让 Agent 先发现实际工具再操作。继续使用原来的应用审批与持久结果记录；全面放开任务权限也不等于获得 Windows 管理员权限，不会绕过 UAC。结果未知时先核对，不能自动再点一次。

## 每个项目自己的 Code Graph

CodeGraphContext 的已有程序入口为 `codegraphcontext mcp start`。本机还需要核对 Python、数据库驱动等原生依赖。预设选择 LadybugDB，并为工作区分配独立运行 HOME、数据库路径；不借用用户已有的全局图谱。只给这个服务进程设置路径，不修改当前终端或用户的 HOME/USERPROFILE。

在要分析的项目里执行：

```sh
koder mcp add graph --preset codegraph
koder mcp test graph
koder mcp enable graph
koder run "结合当前代码图谱查找解析器的调用方，读取实际源码，再提出最小修复。"
```

使用 `-w` 时，每条命令都指定同一个项目。预设别名按工作区解析，切项目不会偷偷接上旧项目的 graph。服务 cwd 和允许的索引根绑定当前项目；Agent 会过滤其他项目预设图谱的工具、调用及资源/提示词访问。默认 `CGC_ALLOW_ALL_PATHS=false`，不打开全盘通配。

Agent 会先发现真实 schema、查看索引仓库/作业/新鲜度，再查询符号、调用/被调用或导入关系，随后核对源文件。图谱缺失、过期或连接失败要明说，并退回源码搜索。不会自动全盘建索引、开启 watch、执行任意 Cypher 或删除内容；这些仍走原审批。图谱像导航，不是交通法规：有一条边，不代表程序一定这样运行；标为死代码，也不能直接删。最后仍要运行真实项目测试。

本地图谱程序可以读取代码，所选工具结果会进入当前模型对话。第三方程序按当前操作系统账号权限运行；这些默认值减少误串项目，不是恶意程序的系统沙箱。只有确实需要时，才额外配置索引根、远程数据库凭据或自定义程序。

## 可选的 uvx 锁定版本路径

明确选择 uvx 后，会保存准确包版本和 Python 目标；首次明确启动可能下载包与 Python 到包管理器缓存。普通 Koder 安装和仅保存预设不会下载。冷启动下载较慢时，先在可见终端准备上游依赖，再测试连接，避免把下载进度藏在握手超时后面。

```sh
koder mcp add windows --preset windows-mcp --runner uvx
koder mcp add graph --preset codegraph --runner uvx
```

Windows 路径指定 Python 3.14、windows-mcp==0.8.8；图谱路径指定 Python 3.13、codegraphcontext==0.6.13。可用 --command 指定启动程序完整路径，不要把整段 shell 管道填进去。超时不会自动重复安装，也不会重放桌面操作。

## 停用与验收边界

```sh
koder mcp disable graph
koder mcp remove graph
koder mcp disable windows
```

停用会停止后续使用；remove 删除连接与绑定记录。图谱运行资料保留在 CLI 配置目录的 graph-runtimes 中，需用户明确清理；不会删源代码，也不会撤销先前桌面操作。远程服务授权需要到服务方另行撤销。

发布时的 SDK 测试记录继续保留。2026 年 10 月 23 日已补 Windows Server 2025 上 Windows-MCP 的真实 PowerShell、快照、点击输入及公开包 Agent 调用；Mac 独占环境也通过真实图谱数据库与 Koder 调用。已测组合、Mac OpenSSL 3 依赖、资源设置和未测范围见[真实调用验收](MCP-ACTUAL-ACCEPTANCE.zh.md)。未验证 Windows 10/11 用户实机、其他平台组合或真实模型规划能力。
