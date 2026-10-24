# 视频、浏览器和软件自动化技能

适用版本：**0.4.2**。原有模型、工具、历史和授权保持；平台及真实账号限制见更新说明。

## 先选方法，再检查工具

```text
koder skills catalog
koder skills list --query 视频
koder skills doctor video-shotcraft
koder skills show bundled:video-shotcraft
koder run "用我的产品截图制作宣传片，先展示三种方案" --skill bundled:video-shotcraft
```

当前聊天窗口也可以使用：

```text
/skills catalog
/skills doctor playwright-cli
/skill bundled:playwright-cli
```

随后直接输入任务。选中技能只改变处理方法，不会立即执行脚本或发送内容。可用 `/skill clear` 清除选择。技能正文和资源经原来的 `skill_catalog`、`skill_read` 按需读取；模型、费用、任务目录、取消和执行权限仍由 Koder 原内核控制。

`catalog` 包含分发状态和限制；`list` 列出可调用项。原版不能随包分发的项目只出现在 catalog 中，不会伪装成已经安装的技能。`doctor` 只发现依赖路径，不运行程序、不读取账号、不安装软件；退出码 0 表示列出的必要依赖已找到，1 表示缺依赖或只有参考条目，2 表示参数/技能错误。`runtimeVerified: false` 明确表示尚未证明该软件在当前机器运行成功。某项操作仍可能需要 catalog 中列出的可选依赖，例如视频渲染。

## 包含什么

| 名称 | 用途 | 当前边界 |
| --- | --- | --- |
| video-shotcraft | 真实产品截图、镜头、运镜、音频、可编辑时间轴 | 需要目标项目素材；Remotion、工作台和剪辑器导出各有依赖 |
| xilo-opus-video | 三方案、预览、代码动画与合成音效 | 使用用户已配置模型，不强制 Claude 账号 |
| lemo-opuscar | 风格库、导演指南、自定义风格、代码短片 | 已内置固定源码；不重复执行全局克隆脚本 |
| mg-styles-15 | 动效风格、提示词、示例源码和音频生成 | 部分风格需要字体或 Blender；原仓库也未提供全部字体 |
| huashu-art-motion | 艺术风格、解释性动画、分镜、渲染检查 | 按选中风格加载，不把参考成片当成本次产物 |
| dashi-animationstyle | 中文口播配画面、字幕和七类风格 | 作者示例人声未获许可，未打包；使用用户授权录音 |
| playwright-cli | 页面操作、快照、截图、采集、功能测试 | 内置官方 Skill；执行器按需装到项目，账号单独授权 |
| cli-anything | 软件 CLI 生成方法、适配器源码、JSON 输出 | 不等于支持所有软件；目标应用、插件及依赖须实际验证 |
| jianying-editor | 剪映草稿、媒体、字幕、效果、受控导出 | 固定许可明确的归属镜像，原仓库当前不可取得；不是原版最新声明 |
| koder-media-workflow | 分镜/SRT、评论 CSV、文章预览、代码视频渲染 | Koder 自有实现；语音服务和账号发布仍是独立操作 |
| wtt-code-animation-studio | 原版来源说明 | 原版为非商业共享许可，未随专有包分发；上述自有流程承接部分功能 |
| x-article-auto-publisher | 原版来源说明 | 未找到原仓库分发许可，未复制源码；文章准备与授权浏览器操作由自有流程承接 |

上游原作者、许可证和固定版本保留在包内。演示成片、示例人声、音乐和二进制示例素材未包含；用自己的素材，或按具体许可证另行获取。不能把源码接入理解为全部风格和全部原生软件已实测。

## 准备完整资源

在任务项目目录执行：

```text
koder skills prepare koder-media-workflow
koder skills prepare video-shotcraft
```

会生成新的 `.koder-skill-名称` 文件夹，逐文件核对 SHA-256，保留许可证、参考资料和脚本，并写入准备收据。不覆盖已有目录，不执行脚本。可用 `--target another-new-name` 指定新目录。项目已有同名本地 Skill 时优先使用本地项；要用随包版本，明确指定 `bundled:名称`。

在新 Windows/macOS 机器上，Python、FFmpeg、浏览器和特定渲染器可能尚未安装。先运行 doctor，再让 Koder 根据所选操作准备项目依赖。不得声称缺依赖的操作已经成功。

## 四个可直接运行的本地工具

```text
node .koder-skill-koder-media-workflow/scripts/media.mjs timeline scenes.json new-timeline
node .koder-skill-koder-media-workflow/scripts/media.mjs reviews records.json new-export
node .koder-skill-koder-media-workflow/scripts/media.mjs article article.md new-article
node .koder-skill-koder-media-workflow/scripts/render.mjs scene.html new-video --duration 6 --fps 24 --width 1280 --height 720
```

- scenes.json 格式：`{"timingSource":"planned","scenes":[{"start":0,"end":2,"text":"第一幕"}]}`。来自实际录音时改为 recording；时间必须真实、顺序且不重叠。
- records.json 是从授权页面读取的对象数组；导出保留实际行数，并防止 CSV 公式注入，不编造“已采集 100 条”。
- article.md 的本地图片会复制到预览目录；远程或缺失图片记为未解决。简单标题、段落、代码块和整行 Markdown 图片支持直接预览，复杂 Markdown 需项目解析器。不会发布到 X 或其他账号。
- scene.html 提供 `window.renderAt(t)` 或 `window.render(t)`。渲染需项目 Playwright、Chrome/Chromium 和 FFmpeg；输出 MP4、逐帧图片及收据。用 `--root` 指定场景资源根；用 `--audio authorized.wav` 混入已授权音轨。仅加载本地资源，外部 HTTP 和 WebSocket 请求被阻止（不等于操作系统网络沙箱）；缺素材或脚本报错不会写成功收据。

每个输出目录必须新建。所有脚本仍通过 Koder 原有 shell 审批执行。输出目录中的 receipt 说明实际做了什么；计划文件不等于视频成片。

## 浏览器与软件适配器

浏览器执行器可以项目安装，例如 `npm install --save-dev @playwright/cli@0.1.22`。采用项目中已审核的版本；官方 Skill 与可执行包版本可能不同，新增命令先看本机 help。用 `npx --no-install playwright-cli -s=koder-任务编号 open http://localhost:端口 --browser=chrome` 打开独立会话。需要用户看见时加 `--headed`。只关闭本任务会话，不能用 close-all 或接管个人浏览器资料。

登录、购物、发文、提交和发送消息均沿用用户当前任务授权；不绕过验证码或访问控制。固定采集流程可保存成脚本，成功经验沿用 Koder 原有自学习入口，不再创建第二套记忆库。

CLI-Anything：prepare 后选目标软件目录中的 agent-harness，先阅读 setup.py 和方法文档，再在项目虚拟环境安装其依赖。每项适配器应验证真实输出文件和非零失败码。CLI 源码存在，不代表对应应用已安装、登录或通过验收。

剪映：设置 `JY_SKILL_ROOT` 为准备目录，显式创建 `JyProject(name, drafts_root=项目内的新草稿目录, overwrite=False)`。可用 FFprobe 测量媒体信息；失败不会补造时长/尺寸。错误草稿会保留。macOS 当前只交付草稿，原生自动导出不支持；Windows UI 导出需要匹配剪映版本，仍待实机验收。不要把它当成 CapCut/移动版兼容声明。

## 证据和故障

本候选已在隔离 macOS 环境实际完成浏览器表单操作与采集、音视频渲染、草稿 JSON 写入及 Draw.io XML 适配器操作；这些是本地验收，不是所有网站、所有风格、真实账号、Windows 原生剪映或真实模型质量验收。

`SKILL_BUNDLE_CHANGED` / `SKILL_BUNDLE_UNRECORDED`：资源不再匹配打包清单，先恢复完整候选，不覆盖个人工程。`EEXIST`：输出目录已存在，请换新名称。`SCENE_ASSET_HTTP_404`：检查本地素材和 --root。`FFPROBE_REQUIRED`：安装或显式提供媒体探测器。`DRAFT_LOAD_FAILED_PRESERVED`：原草稿保留，先备份并检查，不能靠删除重建掩盖错误。

回退只需使用上一候选或已发布 0.4.1；本增量不迁移用户账号、模型或历史。原有四项基线回归失败和 Windows/真实账号待验记录继续保留。
