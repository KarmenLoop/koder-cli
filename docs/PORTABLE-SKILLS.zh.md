# 本机 Skill 兼容与调用

适用版本：**0.4.2**。原有模型、工具、历史和授权保持；平台及真实账号限制见更新说明。

Koder 可以发现、读取并采用 Codex、Cursor、WorkBuddy/CodeBuddy 的标准 Skill 包。正文、参考资料、模板和脚本按需读取；执行脚本沿用 Koder 原有工具、权限和取消机制。继续使用你当前配置的模型及 BYOK 接口。

## 最快的使用方式

```text
koder skills list
koder skills show my-skill
koder skills show my-skill --path references/details.md
koder run "按所选方法完成这个任务" --skill my-skill
```

把 `my-skill` 换成列表里的名称。同名包不会合并：使用列表里的完整 `local:...` ID 选择，避免读错。`--skill` 最多指定四项，用英文逗号分隔。指定后 Agent 先读取方法，再根据当前任务执行；指定本身不运行脚本。

也可在任务里写已发现的 `$my-skill`。PowerShell、macOS 和 Linux 命令行中用单引号包住任务，防止 Shell 提前展开 `$`；CMD 直接用双引号即可。

在当前聊天窗口里：

```text
/skills list
/skills show my-skill
/skill my-skill
按这个方法处理当前任务。
/skill clear
```

`/skill` 的选择保留到你清除或替换。名称后附带的任务只填入可编辑草稿，不会自动发送。`/skills import`、`enable` 和 `disable` 会让下一轮重新加载空闲会话，无须另开终端。

未手动指定时，模型也可以根据目录中的简介选择相关方法；是否选择取决于任务和模型。初始化只放入有限元数据，正文和资料按需读取，不把所有 Skill 或二进制资源塞入上下文。

## 支持哪些目录

以下路径既支持项目内，也支持用户主目录内。项目内从当前工作目录向上查到最近的 Git 仓库根目录；非 Git 目录只查当前目录。

| 来源 | 识别目录 | 兼容内容 |
| --- | --- | --- |
| Codex／共享 Agent Skills | `.agents/skills`；兼容 `.codex/skills` | `SKILL.md`、简介、正文和相对资源 |
| Cursor | `.cursor/skills`、`.agents/skills` | 带元数据或普通 Markdown、分类目录、手动调用和文件范围 |
| WorkBuddy／CodeBuddy | `.codebuddy/skills` | 标准清单、中英文显示信息、脚本、参考资料和模板 |
| Koder 扩展路径 | `.koder/skills`、`.workbuddy/skills`、`<KODER_CLI_HOME>/skills` | 同一套标准格式 |

`.workbuddy/skills` 是 Koder 提供的兼容别名，不代表 WorkBuddy 官方存储位置。自定义宿主目录、系统管理员目录可导入副本。软链接只能指向另一已配置的 Skill 根目录内，任意外部链接会被排除并提示。

格式依据：[Codex](https://learn.chatgpt.com/docs/build-skills)、[Cursor](https://cursor.com/docs/skills)、[WorkBuddy](https://open.workbuddy.cn/en/docs/skill)、[CodeBuddy 目录](https://www.codebuddy.ai/docs/cli/codebuddy-dir)。

## 导入文件夹或 ZIP

```text
koder skills import "你的完整 Skill 文件夹路径"
koder skills import "你的完整 ZIP 路径"
```

导入目标为 `<KODER_CLI_HOME>/skills`，默认 `~/.koder-cli/skills`。原始文件、许可证、参考资料、模板、脚本和二进制素材保持原样，不改原包，也不执行脚本或安装依赖。已存在的目标不会被覆盖。一个 ZIP 可以带多个 Skill 文件夹和共享许可证；压缩包里的压缩包不会继续解压。

临时停用时先记下 ID：

```text
koder skills disable local:列表里的完整ID
koder skills enable local:列表里的完整ID
```

停用后不会出现在活动列表，重新启用需要完整 ID。ID 与规范化后的包路径有关，移动或复制后 ID 会变化。

## 格式与限制

保留名称、简介、作者、版本、中英文显示信息及 `allowed-tools`。`disable-model-invocation: true` 的方法只允许用户主动指定；模型不能偷偷读取。`user-invocable: false` 的方法不提供手动选择，但仍可按相关性供模型使用。

`paths` 支持字符串、简单列表和数组。自动文件范围匹配以本次任务明确提到的文件名为准；手动选中可明确越过该匹配范围。正文中的 `@references/xxx.md` 按包内相对路径读取，支持分页，结果包含来源路径和哈希。路径穿越、越界链接、变更后的旧清单、二进制或非 UTF-8 文本会被拒绝。

宿主专属 Hook、子代理运行方式、定时器、账号、连接器、插件配置及专有工具不会自动迁入。需要对应功能时，先配置 Koder 支持的工具或 MCP。Read/Write/Edit/Bash 可参考 Koder 当前 `read_file`、`write_file`、`str_replace`、`shell` 的实际参数，不能当成凭空新增的工具。

`allowed-tools` 作为来源信息保留，不扩大权限，也不模拟原宿主独立的每 Skill 权限策略。Ask 仍只读，明确拒绝仍拒绝，工具执行与收据仍归原 Core。Skill 是工作说明书，不是管理员通行证。

发现范围上限为 200 个方法、4,000 个目录节点、六层分类。清单上限 256 KiB；ZIP 最大压缩 16 MiB、解压 32 MiB、512 文件、32 个清单。文本资源分页读取，不支持的内容保留诊断。

## 验证范围

本轮使用自有示例包验证三种格式；真实 Koder 工具已读取资料、运行示例脚本并生成文件，同时验证 Ask 和拒绝权限不会生成文件。模型响应使用测试替身；Windows 原生客户端和真实服务商自主选用 Skill 仍需单独验收，不以本地检查冒充通过。

找不到时先在同一个 `-w` 目录运行 `skills list`；同名冲突改用完整 ID；`SKILL_MANUAL_ONLY` 需要手动指定；`SKILL_CHANGED` 需要刷新；范围不匹配时明确文件或主动选中。某个包损坏只报告该路径，不阻止其他有效包加载。

## Bundled media and browser Skills

See [the bundled workflow guide](VIDEO-BROWSER-SKILLS.zh.md). `skills catalog` includes source availability, `skills doctor <name>` checks dependencies without running them, and `skills prepare <name>` copies verified resources into a new project directory. A unique local package with the same name takes precedence; use `bundled:<name>` for the packaged copy. Two local packages with the same name still require an explicit ID.
