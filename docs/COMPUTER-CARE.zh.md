# 电脑维护：存储、内存、设置与杀毒

自 0.5.16 随安装包提供。源码与隔离包测试已执行；Windows 实机、实际杀毒扫描和系统设置变更仍由对应设备验收，不把夹具结果当作全平台已验证。

电脑维护随 CLI 提供，共用现有权限、Agent 和后台服务。查看入口：

```sh
koder care status
koder setup
```

Setup 中选择「电脑维护与内存保护」。维护、闲置缓存自动清理、内存保护默认开启，均可单独关闭；关闭总开关也可运行 `koder care off`，恢复用 `koder care on`。这不等于授予整盘权限，不会自动扫描用户目录或杀毒。

## 自动清理的准确范围

后台复用 `koder activate` 开启的 agentd，每小时在没有前台会话时检查一次。只清理 `model-catalog` 中超过 90 天、未被任何已配置模型引用的可再生成目录缓存。每次有文件数、字节和时间预算；内存紧张时延后。没有开启常驻时仍可手动运行：

```sh
koder care cache --dry-run
koder care cache
```

当前模型目录缓存、Skill、自主学习记录、记忆、会话、日志、凭据、正在安装的版本及回滚包都不在自动删除范围。旧文件不因年龄被判定无用。Setup 可调整保留天数，最低 30 天。绑定文件损坏或无法核实引用时跳过清理。

`deletedBytes` 是删除文件的逻辑大小；`availableBytesDelta` 是操作前后文件系统可用空间的变化，其他进程也可能影响这个数，二者不能混用。

## 检查整机或指定磁盘

先查看原有授权：

```sh
koder permissions status
```

按实际目录通过 `koder permissions request` 授权 files.read、files.search；整理还需要 files.write。也可在 Setup → 电脑执行权限选择根目录。完整工作模式不改变系统账户权限，受系统保护的文件仍可能不可读。不要为清理普通下载文件使用管理员身份启动整个 CLI。

Ubuntu 示例（将路径替换为本机用户的真实绝对路径）：

```sh
koder care scan /home/your-name/Downloads
```

macOS 示例：`koder care scan /Users/your-name/Downloads`。

Windows PowerShell 示例：`koder care scan "C:\Users\your-name\Downloads"`。

已明确授权整盘时可分别扫描 `/` 或 `C:\`、`D:\` 等根目录。扫描不会跨越其他挂载盘或符号链接；每个卷单独扫描。默认最多检查 20,000 个入口、24 层、20 秒，返回最多 50 个旧/大文件候选。上限、拒绝访问、特殊文件、保护目录等均计入 `skipped` 或 `partial`。缩小目录后可继续检查；部分扫描不是「全盘已经检查」。仅枚举元数据，不把文件正文交给模型。

## 整理旧文件及恢复

1. 从扫描结果选择确实不用的文件。先生成准确计划，不接受通配符或整个目录删除：

   ```sh
   koder care plan /home/your-name/Downloads/old-report.txt
   ```

2. 记下输出的 `id`。执行前查看计划：

   ```sh
   koder care inspect-plan <计划ID>
   koder care apply <计划ID>
   ```

3. CLI 展示所有路径与大小，在本地输入 `ORGANIZE` 才会整理。`--yes`、排队文本、模型回答均不会代替确认。无交互环境返回 `needs_input`。

4. 文件移到原目录所在磁盘的 `.koder-trash/<计划ID>/`，没有永久删除。需要恢复时：

   ```sh
   koder care restore <计划ID>
   ```

   检查目标后输入 `RESTORE`。原位置已有不同文件时返回 `CARE_RESTORE_CONFLICT`，保留双方；先自行改名冲突文件再重新查看、确认恢复。

计划有效期 24 小时，每次最多 32 个普通文件、合计 2 GiB。校验文件身份和 SHA-256；文件变化、硬链接、符号链接、受保护项目、源码、配置、凭据、记忆和证据会被拒绝。每个文件检查通过后才移动，执行中取消保留逐文件回执。重复 apply 不重放；`partial` 的未移动文件需要重新选择并生成计划。崩溃留下的 moving/unknown 项可以检查并恢复，不会静默继续删除。恢复前也会重新校验内容哈希。

同盘隔离仍占磁盘空间，不显示为释放成功。当前版本不自动清空用户隔离目录；需要永久清理时由用户在系统文件管理器中核对后处理。

## 内存控制

`care status` 显示整机总量、可用量估计及当前 Koder 进程 RSS。Linux 优先读取 MemAvailable，macOS 使用空闲、非活跃和推测页的可回收估计，Windows 使用系统可用内存。无法观测时标记 unknown。

默认可用内存低于 1 GiB 或总量 8%，或当前 Koder RSS 超过 2 GiB 时，新子任务并发降到 1；恢复后按原并发设置准入。已经执行的任务不会被杀掉，队列、取消与费用预算保留。实时 `/subagents status` 可看到 `resourceAdmission`。这是 Koder 当前运行时的准入控制，不是整机硬性内存限额，也不保证回收其他应用或模型服务的内存。

## 系统设置调度

```sh
koder care settings network
koder care settings display
koder care settings power
koder care settings storage
koder care settings notifications
koder care settings security
```

须具备原 desktop 授权，且在本地输入 `OPEN`。Windows 打开系统设置对应 URI；Ubuntu GNOME 调用已安装的控制中心，存储项打开主页，磁盘占用先看维护报告；macOS 打开系统设置主页，再通过已授权的电脑工具观察和选择所需页面。Linux 无图形会话或缺控制中心时明确不可用。`submitted` 只证明提交启动，`displayVerified:false` 不代表看到窗口，更不代表已改设置。没有自动提权、停用防火墙或关闭杀毒防护。

## 病毒检查

```sh
koder care antivirus status
koder care antivirus scan /home/your-name/Downloads
```

Windows 优先检测 Microsoft Defender 的 MpCmdRun；macOS/Linux 使用本机已安装并有有效病毒库的 ClamAV。缺引擎时输出 `CARE_ANTIVIRUS_MISSING`，不会自动下载安装，也不会把系统自带 XProtect 的存在当成完成扫描。需要安装时可让 Koder 查官方说明，通过既有软件安装审批处理。

扫描需要 files.read（目录还需 files.search）授权，本地输入 `SCAN` 确认。只检测，不自动删除、卸载或修复；Defender 某些环境还要求管理员，失败会保留原因，不静默重试提权。ClamAV 病毒库超过 7 天时拒绝把扫描算作有效结果，需先按官方说明更新。

每次最多选择 256 个普通文件，最多枚举 10,000 个入口，总预算 20 分钟，单批最多 5 分钟。引擎只收到已授权、重新核对过的普通文件，不递归追随链接或挂载盘。较大目录须缩小范围继续；结果包含选中数、完成数、跳过项和各批回执。

回执在本机私有目录保存，每次有独立 `id`，新扫描不会覆盖旧回执。可用 `koder care inspect-scan <id>` 重新查看。输出有大小预算，`outputTruncated` 表示诊断文本截断；它不表示未扫描文件已被检查。路径超过 4 KiB 会被明确拒绝。引擎进程不会继承模型 Key、邮箱密码等任意环境变量。

- `completed` / `no-detection-reported`：引擎在本次范围未报告威胁，不保证文件无病毒。
- `attention`：引擎报告检测或加密/扫描上限提示，需人工查看原输出；不一概称为确诊病毒。
- `failed`：扫描错误、数据库或权限问题；Defender 退出码 2 有多种含义，不直接判为病毒。
- `partial`：未覆盖整个选定范围，不称全盘通过。
- `unknown`：取消、超时或进程清理未确认。Defender 服务端扫描可能仍在运行，先查看 Windows 安全中心，不自动重放。

持久状态仍为 running 时，状态页报告「扫描仍在进行或已中断、未核实」，不把旧 PID 或旧开始时间当作当前扫描成功。再次扫描会先展示前次未核实状态，由用户核对后明确确认新扫描。

发现威胁后使用系统安全中心或杀毒引擎的人工审核功能隔离、修复，避免误删源码和个人资料。此集成不替代终端安全软件、实时防护或系统更新。

## 验证范围与参考

自动化测试覆盖实际临时文件整理/恢复、权限撤销、符号链接、缓存保留、子任务真实队列、固定 argv、取消、Setup 与 Agent 调用。合成引擎输出只证明适配分支，不是病毒检出率验收。Windows Defender、Linux 图形设置和三端真实杀毒扫描仍须在对应设备验收；以交付收条的 VERIFIED / NOT_RUN 为准。

官方资料：[Microsoft Defender 命令参数](https://learn.microsoft.com/en-us/defender-endpoint/command-line-arguments-microsoft-defender-antivirus)、[Windows 设置 URI](https://learn.microsoft.com/en-us/windows/apps/develop/launch/launch-settings)、[ClamAV 扫描说明](https://docs.clamav.net/manual/Usage/Scanning.html)、[ClamAV 命令手册](https://github.com/Cisco-Talos/clamav/blob/main/docs/man/clamscan.1.in)、[Apple XProtect](https://support.apple.com/en-euro/guide/security/sec469d47bd8/web)。
