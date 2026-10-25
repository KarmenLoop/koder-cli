# Koder 设备迁移课堂

适用：Koder CLI 0.4.12 及后续版本。先运行 `koder --version` 和 `koder help migrate` 核对安装。原有 180 课保留，本页是独立专题。

## 你会得到什么

在旧设备输入 `koder migrate`，选择导出或 SSH 直迁。新设备导入后会在自己的 `Koder Projects` 中得到一个 `Migration-<编号>` 文件夹，包含项目、独立的 Koder 配置、已映射的本地历史和迁移回执。`koder migrate open <编号>` 在当前窗口进入这套配置，退出后回到原终端。

同样适用于在同一设备打开另一套独立终端配置。迁移不会注销旧设备，也不会中断其他任务。它搬迁的是保存的数据快照，不是操作系统进程：正在执行的下载、开发服务器、浏览器登录和未完成的发送操作不随进程续跑。

## 迁移范围

| 内容 | 处理方式 |
| --- | --- |
| `Koder Projects` 直属项目 | 默认选择；可用重复的 `--project` 精确指定其他工程 |
| 源码、文稿、图片等普通文件 | 保留内容、目录与可执行位；每个文件校验 SHA-256 |
| 语言、主题、输入模式、CLI 教程进度、预填模板、内置 Skill/Harness 偏好 | 写入目标独立配置；不覆盖目标原有配置 |
| 当前模型名称、协议、API 地址与上下文参数 | 保留非密钥设置；地址中的账号、查询参数和片段移除，须核对自定义地址 |
| 可识别的本地终端历史与显式 notes | 根据项目新路径重新计算身份；不同目录、不同会话分别保留 |
| 无法识别的旧历史、账号绑定的共享历史 | 保留在目标 `source.kodermigrate` 加密原包中，不猜测所属项目或自动激活 |
| Koder 用户 Skills、所选项目内的 Skills | 文件随迁移保存；目标自定义 Skills 初始禁用，检查依赖后再启用 |
| API Key、邮箱授权码、GitHub/Apps/MCP 登录、钥匙串 | 不复制；在新设备 `/setup` 重新绑定 |
| 系统权限、命令审批、常驻服务、网关任务、浏览器会话 | 不转移；目标不会因迁移自动激活后台或获得电脑权限 |
| 个性化和自学习经验的本机加密数据库 | 本功能不移植或解密；保留原设备，账号型共享记忆按原账号机制重新同步 |
| `.git`、`node_modules`、虚拟环境、私钥、常见 `.env` 文件 | 排除并列入回执；Git 连接和依赖按目标系统重新配置。`.env.example/sample/template` 可迁移 |
| 其他宿主的用户级 Skills（例如用户目录 `.codex/skills`） | 不自动扫描整台电脑；可在目标通过原 `skills import` 导入所需技能 |

加密包含私人源码和会话；加密不等于公开资料。常见凭据文件排除不是完整的秘密扫描器，源码内自行硬编码的秘密仍可能在包内。迁移前核对选择范围，口令与包分开传递。忘记口令无法从 Koder 找回。

180 课网页课堂的进度与笔记存放在浏览器本地，不属于 CLI 配置。请先在课堂点“导出进度与笔记”，再到新设备的课堂导入该 JSON；迁移不会读取浏览器资料。

## 第一课：Windows 换 Mac，用迁移包

1. 在两台机器安装含迁移功能的 Koder。新设备先完成许可确认；迁移不会代替用户接受条款。
2. 旧 Windows 终端运行：

   ```powershell
   koder migrate
   ```

3. 选 `1`，填写迁移包路径，例如 `E:\koder-move.kodermigrate`。输入至少 12 字符的口令并确认，屏幕仅显示星号。向导默认选择当前用户 `Koder Projects` 的项目。
4. 成功输出应包含 `MIGRATION_EXPORTED`、文件位置、SHA-256、项目清单、可恢复/仅归档历史数量和排除项。没有这些回执不要当作成功。
5. 用移动硬盘或自己授权的文件传输方式把包送到 Mac。不要把口令贴在聊天、命令参数或 Git 仓库。
6. 新 Mac 运行 `koder migrate`，选 `2`，填写收到的包路径，确认后输入相同口令。
7. `MIGRATION_IMPORTED_REAUTHORIZE` 表示**数据导入完成、连接需重新授权**。复制输出里的 `koder migrate open <编号>` 执行。
8. 进入迁移终端后输入 `/setup`，重绑模型；如需邮箱、GitHub 或电脑操作，再逐项授权。模型检测通过后输入一条简单任务，再打开项目工作。
9. 工程放在 `Migration-<编号>/p0`、`p1` 等稳定目录。回执 `projectPaths` 列出原项目名称与对应新路径。需要另一个项目时用 `/project open "目标项目路径"`。

反向 Mac → Windows 和 Linux 服务器导入使用相同流程。Linux 没有图形桌面时可继续终端任务；迁移不会让 GUI 工具凭空可用。

## 第二课：精确迁移某个项目

Windows PowerShell：

```powershell
koder migrate export --project "D:\Work\My App" --output "E:\my-app.kodermigrate"
```

macOS / Linux：

```sh
koder migrate export --project "$HOME/Work/My App" --output "$HOME/my-app.kodermigrate"
```

多项目重复写 `--project`。使用旧包保存的自定义会话时，可加 `--session work-2` 帮助匹配这个旧会话；0.4.12 及后续版本保存的历史含完整身份字段，能自动映射。无法确认归属的历史只归档，不会混到另一个项目。

只读查看迁移包：

```sh
koder migrate inspect --file /path/to/my-app.kodermigrate
```

它要求口令，仅显示清单；不恢复文件、不执行代码。

## 第三课：直接迁到自己的服务器

准备条件：源设备已有系统 OpenSSH 客户端；目标已安装支持迁移的 Koder 且完成许可确认；已设置 SSH 公钥或受控 SSH agent 登录；目标主机已经由你核对并写入 known_hosts；目标非交互 PATH 能找到 `koder`。

```sh
koder migrate send --to owner@server.example --yes
```

可加 `--port 2222` 和 `--project`。输入迁移口令后，Koder 收集加密快照，使用 SSH 标准输入传到目标接收器，在目标导入并验证回执中的迁移编号和包 SHA-256。口令不会出现在 SSH 命令参数或日志中；在传输过程中位于 SSH 加密通道内。

`--yes` 只确认这次迁移，不授予目标电脑权限。此命令不会安装 SSH、修改主机信任、安装 Koder、输入服务器密码或提权。目标应使用自己已授权的账号，不需要 root。

若提示 `MIGRATION_REMOTE_OUTCOME_UNKNOWN`，可能是目标已导入但回执断线。先登录目标运行：

```sh
koder migrate status
```

按错误里的迁移编号检查。不要把网络断线当作已回退，也不要重放邮件、提交、发布等业务操作。相同加密包重复 `import` 可识别已有导入；重新 `send` 会产生新快照与新编号。

## 第四课：另一终端继续，原窗口继续工作

```sh
koder migrate status
koder migrate open <迁移编号>
```

`open` 使用当前已安装的 CLI 运行时和迁移独立配置，不启动第二套任务引擎。进入后 `/project open` 切换项目，`--session` 或当前多窗口机制保持原有会话隔离。旧路径只保留在历史和加密来源包中，不能作为目标设备路径直接执行。

为了隔离，迁移终端不继承父终端的 `KODER_*` 模型/内存/权限覆盖变量；请在迁移终端的 Setup 配置模型。原本无需迁移的同机窗口仍可直接使用 `koder chat -w <项目目录> --session <名称>`。

## 第五课：失败、取消与回退

| 提示 | 下一步 |
| --- | --- |
| `MIGRATION_SOURCE_CHANGED` | 某文件在读取期间变化；稍后只重做快照，不终止其他任务 |
| `MIGRATION_DECRYPT_FAILED` | 核对口令与文件 SHA；目标项目尚未写入 |
| `MIGRATION_PATH_INVALID/COLLISION` | 修正跨 Windows 不合法文件名、大小写或 Unicode 冲突，或选择较小迁移范围 |
| `MIGRATION_PATH_TOO_LONG` | Windows 目标路径过长，使用更短的用户/项目根路径；未覆盖原配置 |
| `MIGRATION_SIZE_LIMIT` | 当前上限：2 万文件、单文件 64 MiB、数据总量 128 MiB、加密包 200 MiB；拆分项目或排除大生成文件 |
| `MIGRATION_SSH_UNAVAILABLE` | 检查本机 SSH、已知主机、目标 PATH；配置好后再迁 |
| `MIGRATION_IN_USE` | 先退出这套迁移配置的终端并停用其常驻服务，再回退 |

撤回已导入配置：

```sh
koder migrate rollback <迁移编号> --yes
```

回退把迁移文件夹改名为 `.retained-...`，移出可打开迁移列表；**保留所有导入数据及之后的编辑**，不删除旧设备或目标原配置。回执显示保留位置。需要恢复时先备份并核对该目录，不盲目移动正在使用的配置。

中断导入时，没有完成原子落位的 `.migration-...` 目录不会被当作成功；原包与源设备仍是恢复依据。本功能没有全盘快照或在线数据库一致性功能，不要把它用于搬运仍被数据库进程写入的数据目录。

## 开发者验收与平台边界

迁移路径复用现有 CLI 命令分派、Setup、隐藏输入、项目根目录和记忆格式。新增会话写入保存身份元数据，旧格式仍可读。包使用固定参数 scrypt 派生密钥和 AES-256-GCM 认证加密；导入校验版本、大小、路径、文件校验和，并在独立目录暂存后原子落位。不加载包内代码、不自动运行 Skill 脚本、不复用源设备的待执行动作。

建议验证：两个独立 HOME/KODER_CLI_HOME，导出→查看→导入→重复导入→打开→回退；同名会话跨项目不串；错口令/篡改/路径逃逸/符号链接失败；目标已有配置字节不变；SSH 丢回执保持 UNKNOWN。

本轮自动化使用合成文件、无密钥模型和可控传输替身。Windows/macOS 跨机、Windows 终端隐藏输入、真实 SSH 服务、目标密钥环和实际应用重绑需要分别验收。模拟 SSH 通过不等于真实服务器迁移已验证。
