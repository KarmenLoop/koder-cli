# GitHub 绑定与项目托管

适用于 Koder CLI 0.4.11。Windows CMD、PowerShell 和 macOS 使用同一套内置 GitHub 工具，不需要另装 GitHub MCP、Python 或 Git。绑定不会自动上传本地目录。

## 绑定自己的账号

在交互终端运行 `koder github connect`，或打开 `koder setup` → Apps / MCP → GitHub。聊天里也可以输入 `/github connect`。将个人访问令牌粘贴到专用隐藏输入框，回车后会显示已绑定的账号。

不要把令牌发到聊天正文、写进项目文件或作为命令行参数。令牌经现有本机凭据保护层加密保存；普通配置和操作回执不保存明文令牌。没有可用凭据存储时会明确报错，不静默改存明文。撤销本机绑定用 `koder github disconnect`；这不会撤销 GitHub 网站上的令牌，需要时在 GitHub 设置中另行撤销。

可从 [GitHub 令牌设置](https://github.com/settings/personal-access-tokens) 创建有到期时间、限定仓库的 fine-grained PAT。授权范围必须覆盖目标仓库和操作：

| 操作 | 常用权限 |
| --- | --- |
| 列出仓库、读 README | 仓库访问范围，Contents: Read |
| 提交项目文件 | Contents: Read and write |
| 修改仓库介绍、主页 | Administration: Write |
| 新建仓库 | Administration: Write 或 GitHub 提供的 Repository creation: Write |
| 创建草稿 PR | Pull requests: Write |

组织可能要求管理员批准或 SSO。仅选定既有仓库的令牌未必能操作刚创建的仓库；创建后需要在 GitHub 调整仓库选择。GitHub 权限规则以[官方令牌文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)和[仓库 API 文档](https://docs.github.com/en/rest/repos/repos)为准。

受控环境也可先由已有秘密管理器注入环境变量，再运行 `koder github connect --key-env MY_GITHUB_TOKEN`；参数是变量名称，不能填令牌本身。这不会授予无人值守的仓库写入权限。当前版本提供 PAT 登录；浏览器 OAuth 登录尚未接入 CLI。

## 查看账号和仓库

以下命令将 OWNER 替换为自己的用户名或组织名，demo 替换为仓库名：

```text
koder github status
koder github repos
koder github repos --page 2
koder github repo OWNER/demo
koder github read OWNER/demo README.md
koder github read OWNER/demo src --ref main
```

`repos` 每页最多 50 个仓库；有下一页时返回 nextPage。仓库文档是参考资料，不会成为执行指令。也可以直接对 Koder 说：“读取我绑定账号里 OWNER/demo 的 README，说明目前的安装步骤。”

## 创建仓库并提交选定文件

先进入项目目录，然后运行：

```text
koder github create demo --description "My project"
koder github commit OWNER/demo README.md src/main.js --message "Add project files"
```

创建默认为私有仓库，并初始化 README。组织仓库增加 `--owner ORG`；确实要公开时增加 `--public`。创建时确认窗口会明确展示可见性。

提交只包含列出的相对路径，不递归上传整个目录。原分支中的其他文件和选中文件的可执行属性保留；文件合成一次提交，分支更新不使用 force。若确认期间分支已变动，会报 GITHUB_HEAD_CHANGED，需要先重新读取。目标分支必须已经存在，默认使用仓库默认分支。

聊天中可说：“把当前项目的 README.md 和 src/main.js 提交到 OWNER/demo，先给我核对。”Agent 使用内置 github_project 工具和本地文件快照，不需要通过 shell 猜测上传命令。只改远程 README 时会先读取，再提交修改内容。

## 修改仓库文案和创建草稿 PR

```text
koder github edit OWNER/demo --description "A concise project description" --homepage "https://example.com"
koder github pr OWNER/demo --head docs/update --base main --title "Improve setup instructions"
```

PR 默认是草稿，head 必须是已有分支。当前接口支持仓库描述、主页、文本文件和 PR；没有删除仓库、切换既有仓库可见性、强推、合并 PR 或 GitHub Projects 看板编辑。

## 确认、权限与回执

每次远程写入都先显示目标和内容，输入 github-create、github-commit、github-edit 或 github-pr 才执行；直接回车取消。`--yes` 不替代 GitHub 写入确认，预先排队的聊天文本也不会被当作批准。无交互终端可以绑定和读取，写入需转到交互终端；不会悄悄变成开放权限。

成功回执包含 confirmed、仓库、操作 ID，以及提交 SHA 或 PR 链接。网络在写入途中中断可能意味着 GitHub 已处理但回执没有返回，此时保留 unknown 并阻止重复写入。使用：

```text
koder github reconcile OWNER/demo
```

提交对账会核对分支历史，不重放提交。无法证明创建仓库、修改设置或 PR 的原操作结果时仍保留待核对状态，请先人工查看 GitHub。普通连接失败或未批准不能被报告为“已托管”。

## 文件与数据范围

单次最多 100 个文本文件；单文件最多 512 KiB，总计最多 2 MiB。暂不支持二进制、Git LFS、整个目录上传或 GitHub Enterprise。上传本地文件必须在当前工作区内；符号链接、硬链接、路径越界、.env、凭据文件、私钥及识别出的常见令牌会被拒绝。检测不能保证发现所有秘密，提交前仍需检查内容。

选定文件直接发送到 GitHub。Agent 读取的仓库内容会进入当前任务上下文，并可能交给你配置的模型；令牌不会进入模型上下文。纯 CLI read 会显示文件文本。操作记录通过原有保护存储保存在本机，不上传到 KarmenLoop。

## 常见错误与验收边界

GITHUB_AUTH：令牌无效或到期。GITHUB_PERMISSION：仓库选择、组织批准、SSO 或权限不满足。GITHUB_LIMIT：触发 GitHub 限流。GITHUB_PENDING_REVIEW_REQUIRED：先对账，不要重复提交。GITHUB_CONSENT_REQUIRED：没有收到本次写入确认。

本版已完成本地回环 API、加密存储测试端口、CLI 路由、Agent 工具回执与失败恢复回归；没有用真实用户 PAT 执行建仓或写入验收。Windows 原生凭据输入和系统密钥环、真实组织权限仍需对应设备与账号验收。不会把模拟服务通过写成真实 GitHub 账号通过。
