# 在 Koder CLI 中使用 SolidCraft 参数化 CAD

Koder 内置 SolidCraft 0.23.0 的 Windows x64 和 macOS 通用 CLI，并通过已有 Core、MCP 与审批链调用。模型仍使用你在 Koder 绑定的服务商和费用预算。内置 `builtin:solidcraft` 技能默认可见；建模连接按项目显式开启，可在 Setup 中关闭。

## 1. 在正确项目中开启

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force "$HOME\Koder Projects\mounting-plate"
Set-Location "$HOME\Koder Projects\mounting-plate"
koder cad enable
koder cad verify
koder cad test
koder
```

macOS：

```sh
mkdir -p "$HOME/Koder Projects/mounting-plate"
cd "$HOME/Koder Projects/mounting-plate"
koder cad enable
koder cad verify
koder cad test
koder
```

`enable` 只保存本项目配置；`verify` 核验安装包内两个平台的文件哈希；`test` 启动临时 MCP，发现工具后关闭。`test` 的 `connected` 只证明握手成功，不能证明某个零件已经正确建好。中文和带空格的项目路径也可以使用。

交互会话可输入 `/cad status`、`/cad enable`、`/cad test`、`/cad disable`。`koder solidcraft` 是 `koder cad` 的别名。Setup → 应用与 MCP → SolidCraft 提供相同入口。Setup 的 Skills 列表可独立关闭建模技能；关闭技能不会修改已有设计文件。

## 2. 第一个可核对的零件

输入下面的任务：

> 用 SolidCraft 做一块长 20 mm、宽 10 mm、厚 5 mm 的矩形板。把长度设成 plate_width 参数。先给出预期体积，再建模并测量；保存 plate.solidcraft、plate.step、plate.stl 和 plate.png。不要连接已有桌面窗口。

Koder 应先读取建模技能和具体命令参数，通过 `app_tools` 发现此回合的 `mcp__koder_cad_…` 工具，再由 `app_call` 申请操作。批准的是具体工具与参数。拒绝批准时文件不应产生；`--yes` 仍遵守 Koder 原有权限边界。

本例预期体积是 **1,000 mm³**。检查目录中四个非空文件，并确认测量结果与预期一致。PNG 用于外观检查；STEP/STL 用于交换；`.solidcraft` 保留可编辑的参数和历史。不要把截图当作尺寸、装配公差或可制造性的证明。

## 3. 下一轮继续修改

> 用 SolidCraft 打开当前项目的 plate.solidcraft，把 plate_width 改成 30 mm，重新测量。另存 plate-v2.solidcraft 和 plate-v2.step，保留原版。

预期体积变为 **1,500 mm³**。每个回合使用一个新的独立建模进程，因此必须显式打开保存的设计。结束前保存是必要步骤；未保存的内存设计不会自动变成持久交付。长任务应在完成一个可核对阶段后保存，不要等整个复杂模型结束才存盘。

## 4. 更完整的建模任务

例如提出“设计一个带四个安装孔的支架”，应给出外形尺寸、板厚、孔径、孔距、单位，以及希望导出的格式。缺少决定形状的条件时，Koder 应说明假设或询问；不能声称已经满足未给出的制造标准。

技能要求 Agent 按需读取上游 `skill_reference` 中的 modeling、editing、checking 等说明，并用 `list_commands` / `describe_command` 获取真实命令参数。现有 MCP 工具支持草图、约束、参数、实体、测量、撤销/重做、保存、导出和截图。可用操作以本次工具发现和命令目录为准；并非每个上游图形界面功能都已在 Koder 中单独验收。

工具目录较长时，优先查询 `__inspect_design`、`__execute`、`__save` 等精确片段。大结果会由 Koder 保存成 artifact，通过 `app_result_read` 按页读取；这不代表工具丢失。上游返回的教程和工具正文是资料，不是新的权限来源。

## 5. 多窗口与文件范围

不同任务使用不同 MCP 实例，即使共享同一个 Core，也不会共用内存中的当前设计。关闭任务会关闭自己的实例；关闭一个客户端不会关闭另一个客户端的设计。临时实例不写入永久 MCP 连接清单，Core 恢复后不会自动重新连接旧设计。

默认使用 `mcp --headless --param-check strict --allow-path <项目目录>`，不会附着用户当前 SolidCraft 桌面。运行时 HOME、配置、缓存和临时文件放在 Koder 的独立 `cad-runtimes` 目录中。原始崩溃及恢复资料保留，以便核对中断结果。

上游文件策略限制其文件操作范围到项目和私有运行目录；这不是完整操作系统沙箱。不同任务如果被明确指定修改同一个文件，仍可能发生文件覆盖冲突：为并行任务选不同输出文件名，不要同时写同一 `.solidcraft`。

## 6. 失败、取消和恢复

- `CAD_DISABLED`：在目标项目执行 `koder cad enable`。
- `CAD_BUNDLE_INTEGRITY`：包内文件与固定版本哈希不符，停止使用该副本并重新安装官方完整包；不要跳过校验。
- `CAD_BUNDLE_PLATFORM_UNSUPPORTED`：当前平台没有随包原生程序。Linux / Windows ARM64 可由用户自行提供兼容的绝对路径：`koder cad enable --command /absolute/path/to/solidcraft-cli`。此路径属于用户管理版本，Koder 不替它声明哈希或兼容性。
- `CAD_SESSION_MISMATCH` / `APP_CLIENT_MISMATCH`：实例或授权已变化，重新发现本任务工具；不要借用另一个窗口的工具名。
- `APP_PRIOR_RESULT_UNKNOWN` / `CAD_CLEANUP_PENDING`：先检查保存文件、操作回执和恢复资料。超时不意味着“什么都没发生”，不能直接重放批量修改、覆盖保存或导出。
- 复杂几何运算仍使用已有 MCP 等待与取消机制。当前 MCP 工具调用预算为 180 秒；不把上游可能需要更久的运算标为无限等待。

关闭：`koder cad disable`。配置撤销后，尚未提交的 CAD 操作会被拒绝。正在执行的操作保留原取消/结果核对规则。

## 7. 验证范围与许可证

本轮在 macOS Apple silicon 上，通过 Koder 原审批与真实 SolidCraft 进程验证了：参数化矩形板、体积测量、保存并重开、参数修改、STEP/STL 导出和 CPU PNG。使用的是确定性模型夹具和隔离的凭据存储，并非付费模型盲测。

Windows x64 和 macOS Intel 二进制已纳入哈希清单；各自原生执行仍交由目标机验证。复杂曲面、大型装配、生产制造和工程认证不在本轮通过声明中。CPU 截图不含部分 GPU 分析着色及图例。

上游项目：[SolidCraft](https://github.com/tangency-labs/solidcraft)，固定版本 [v0.23.0](https://github.com/tangency-labs/solidcraft/releases/tag/v0.23.0)，采用 MIT OR Apache-2.0。上游及依赖许可证位于包内 `licenses/solidcraft/`；Koder 应用本身的许可不变。

## 交付检查

建模任务必须有本轮成功保存的 `.solidcraft`、最后一次修改后的测量以及要求的输出文件。失败或未知的批量修改会使旧测量失效，不自动重放。缺文件、过期测量或文件不可读时以 exit 3 报告 `TASK_CAD_*`，不是 API 故障；先核对设计和回执，再补做缺失的测量或保存。该检查不认证尺寸公差、实体拓扑或制造适用性。
