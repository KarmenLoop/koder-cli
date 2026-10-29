# Windows 磁盘检查、命令未执行与更新恢复

适用：Koder CLI 0.5.17。命令在 Windows 系统 PowerShell 中运行；出现 `koder >` 后再输入自然语言任务。

## 1. 先升级，再确认启动入口

已有版本可先执行：

```powershell
koder update
koder --version
```

应看到 `koder 0.5.17`。若旧更新器无法连接服务，使用固定版本的 GitHub 安装器覆盖升级：

```powershell
$u = 'https://kodermodule.com/install/cli-0.5.21/koder-cli.ps1'
Invoke-RestMethod $u | Invoke-Expression
```

阅读许可后按提示确认；安装不会自动授予整盘或管理员权限。安装中显示下载阶段与进度。不要删除配置、会话、授权记录或旧版本来“解锁”。详细断点下载、代理和离线方法见[安装指南](INSTALLATION.md)。

安装结束后新开 PowerShell：

```powershell
where.exe koder
koder --version
koder
```

找不到命令时，默认 Windows 安装可直接启动：

```powershell
& "$env:LOCALAPPDATA\koder-cli\bin\koder.cmd" --version
& "$env:LOCALAPPDATA\koder-cli\bin\koder.cmd"
```

若自行设置过安装目录，请用该目录下的 `bin\koder.cmd`。`where.exe koder` 若列出多个入口，确认当前 PATH 指向要使用的版本，不删除未知安装。

## 2. 先看容量，再定位文件

系统 PowerShell 中可直接查看只读维护状态：

```powershell
koder care status
koder permissions status
```

`disk.availableBytes` 是安装数据目录所在文件系统的可用字节数；不是所有磁盘的容量。`memory` 是本机内存观测，`processRssBytes` 仅是当前 Koder 进程。字节除以 1,073,741,824 可换算 GiB。状态查询不删除文件、不终止进程。

进入 `koder` 后输入：

```text
检查 C 盘为什么空间不足。先给出磁盘容量，再只读检查我已授权的目录，列出大文件候选、跳过的范围和下一步建议。先不要删除或整理。
```

Koder 应先调用 `computer_care_status`。没有文件授权时，按 Setup → 电脑执行权限选择要检查的目录；不要让 Agent 用 shell 绕过授权。可以先从下载目录开始：

```powershell
koder care scan "$env:USERPROFILE\Downloads"
```

已明确授权 C 盘根目录时才运行：

```powershell
koder care scan 'C:\'
```

扫描有入口数、深度和时间预算。结果中的 `partial`、`skipped`、`DEPTH_LIMIT` 表示覆盖不完整，不能宣称全盘扫描完成。根据返回候选缩小目录继续检查。目录本身的 `Length` 或普通 `dir` 列表不是递归占用总量。

## 3. 看懂本次截图里的错误

| 提示 | 含义与处理 |
| --- | --- |
| `COMMAND_NOT_FOUND` | 命令未安装或不可用。现代 Windows 不一定包含 `wmic`；优先使用内置维护工具，无需为查询容量重装 WMIC。 |
| `SHELL_READ_PARTIAL` | 已识别的只读 PowerShell 查询退出，但隐藏了部分读取错误。可继续诊断，必须注明读取不全。 |
| `ERRORS_SUPPRESSED` | 未能证明是纯只读命令，且命令隐藏错误。退出码 0 不能证明写入成功。 |
| `SHELL_RECONCILIATION_REQUIRED` | 之前存在结果未知的操作。先核对回执与实际目标；不可盲目重复安装、发送或写文件。 |
| `SHELL_OUTPUT_ENCODING_UNCERTAIN` | 输出含无法识别的字节。不要把乱码当事实，改用原生结构化查询或明确 UTF-8 的诊断输出。 |

0.5.17 修复截图中 `Select-Object` 通过 `PSIsContainer` 显示“目录/文件”时的误判。仅放行受限的纯显示表达式；任意脚本块、删除、写入、超时或未确认退出的进程仍不能据退出码 0 判为成功。

旧版本已经保存的 unknown 回执不会被新版改写。先核对旧操作；等当前回合结束后，发送新的只读检查指令即可。工作中的 steer 补充仍属于原回合，不会抹掉旧回执。无需删除会话历史。

## 4. 更新失败要看具体阶段

```powershell
koder update auto status
koder update --check
```

新版记录上次失败的阶段与原因：`manifest` 是版本清单，`installer-download` 是安装器下载，`install` 是安装或入口验证；`HTTP 404` 表示地址不存在，`UPDATE_INSTALLER_EXIT_23` 等表示安装程序返回该退出码。记录仅保留安全错误字段，不保存密钥或任意安装输出。

主服务无法访问时，新版会检查官方 GitHub 发布；仍然校验 SHA-256、协议与版本。自定义镜像不擅自换源；清单无效、校验失败也不会通过换源绕过。老更新器不具备这个回退时，使用第 1 节的固定安装器。

## 5. 整理与验收

旧文件或大文件不等于可以删除。先阅读[电脑维护教程](COMPUTER-CARE.zh.md)，生成准确文件计划，再由用户确认。当前隔离整理可恢复，移动到同盘隔离目录本身不会释放磁盘空间。

本次已验证截图命令的分类、后续命令可执行、拒绝危险表达式、编码夹具及更新失败回退。Windows 10/11 真实 CMD、PowerShell、应用启动与通知仍需 beta 专员在实际设备复核；测试回执不等于已经检查了你的 C 盘。


旧会话反复提示“前次操作结果仍待核实”时，按[会话恢复教程](SESSION-RECOVERY.zh.md)使用 `/reconcile`，保留历史并核对原目标，不反复重试。
