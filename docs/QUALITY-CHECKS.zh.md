# 文案与交付质量检查

当前版本：**0.4.0-preview.29 Beta**。以下增强继续保留旧契约，尚不构成新的撰写能力评分。沿用原来的 12 道题目；以下是可重复的程序检查，不是重新评出的模型分数。

## 给决策者看的介绍

Koder 产品介绍按“问题、成本/ROI与风险、接入、边界”组织，避免只堆口号。明确要求“中文约 800 字”时，范围是 720–880 个汉字：标点和英文标识符不算，标题算。优先独立读回本轮经工具回执确认写入的主交付文件；没有落盘交付才量最终回复。多份稿件须在回复中明确主文件。JSON 给出文件路径、SHA、实测字数与上下限；不达标退出 3，并在终端显示字数。读者是否看懂、事实是否准确仍要审阅。

## 发版文案先读材料

发版意图在第一次模型请求前实际读取材料，也可继续调用只读工具 writing_sources。八个原固定名称继续保留：CHANGELOG.md、CHANGELOG.en.md、CHANGELOG.zh.md、CHANGES.md、RELEASE-NOTES.md、RELEASE_STATUS.md、RELEASE.json、ACCEPTANCE.md。运行时还检查根目录、releases、docs、docs/releases 里的带版本 CHANGELOG*、CHANGES*、RELEASE*、ACCEPTANCE* 文档，仅接受 md/txt/rst/json。每目录最多 128 项，最多保留 24 份快照（含运行版本事实），每份 64 KB，总计 512 KB；结果记录读取尝试与截断，取消立即停止。内容读取继续通过原路径隔离，不跟随符号链接。

新项目没有材料时，安装树里的公开 CHANGELOG/RELEASE_STATUS/ACCEPTANCE 与当前实际版本提供辅助事实，工具的 sources 保持原工作区语义，安装资料另放新增 runtimeSources 字段；撰写观察器同时消费两者，审计中的安装来源带 @runtime 前缀和 SHA。这些不是所写版本的新增功能证明；验收说明及 RELEASE.json 元数据也单列类型，contextFacts 标为 supportsIncrement:false。不绕过原 .git 禁读规则、不查账号、不运行命令、不自动联网。git tag 和远程 Release 仍通过已有授权工具读取；本地快照不等于官方来源已独立认证。来源中的指令不构成授权。

实际成功的 read_file 读取也会记录来源快照。变更日志对应版本的标题段落有两条事实时，输出须包含两个不同的真实行标记，例如 `[CHANGELOG.md:L3]`。README、git tag、版本号和许可接受说明都不能单独证明“本版新增”。找不到对应日志时要直说，把既有功能与本版增量分开；明确中英文说明“仅为既有能力、不是本版增量”也可通过披露检查，不强制套用固定标题。但前面的免责声明不能抵消后面的无据新增宣称；不支持的增量归因或缺失说明会返回 3。

行标记只能证明读过的材料里有这行，不证明改写一定准确。发出公告前仍需核对具体事实；邮件发送保留原来的独立授权。

## 压缩对比稿不添戏

根据会话中实际完成的上一份对比稿检查，并在 JSON 中记录其 SHA-256。当前请求明确点名的 md/txt 前稿，经 read_file 成功读取后也记录到 writingEvidence.predecessor，含路径、来源与 SHA；其他无关读取不能冒充前稿。没有前文就明确说明。新出现的数字和部分具名技术词会被标记，未核实的精确价格继续拦下。“定价未知”“Pricing is unavailable”等明确不确定性说明可通过。目前尚未接入可验证的官方价格页工具回执，单贴 URL 或模型自述不会获得数值价格豁免。检查覆盖有限，换句话说出的新事实仍需人工审阅；它不会自动评出竞品输赢。

## 在当前窗口检查项目

```sh
koder project check --kind project --json -w /path/to/project
koder project check --kind service --json -w /path/to/project
koder project check --kind generator --json -w /path/to/project
koder project check --kind website --json -w /path/to/site
```

最多检查 100 个相关文件，每份 64 KB，总内容预算 512 KB；目录最多 600 项、深度 5。跳过依赖、构建产物、隐藏文件和符号链接。读不了或扫描不完整时不会报结构已完成。不运行项目脚本、不删文件。

所有类型要求 README；非网页类型要求测试或 verify 入口；服务还要有 Docker 文件和 README 启动说明；静态网页要求 HTML 预览、导航、主标题与 viewport。框架项目可提供静态预览；这里不会编译 JSX，更不代表浏览器视觉验收。通过时状态是 structure-checked、executed:false；缺项退出 3。实际测试、安装与发布仍按现有授权执行。

run/chat 识别到 Markdown 站点生成器、JWT/SQLite/REST 服务、落地页的新建任务时，会要求先保存可运行主体、README 和验证入口，最后自动检查结构。生成器建议至少 15 个有意义的测试，真正数量与通过结果必须由实际测试证明。网页争取约三分钟保存首稿，软目标不会杀进程，也不承诺分数。先把主体落地，再装修；中断时也应有能接着干的工程。

## 报错与边界

WRITING_EVIDENCE_UNVERIFIED、DELIVERY_INCOMPLETE 的退出码是 3。用 --json 看 issues、来源或字数，修正后重跑；已写文件保留。这与 API 故障分开处理。原生 Windows、真实模型账号、法律准确性、安全审查及盲测能力仍需各自验收。Linux 继续要求文档所列受保护凭据后端，没有自动改用明文文件。

## 验收与撰写评分发布门

原 W01–W05 短题不变。确定性回归覆盖主稿字数、中英文非增量披露、错误新增归因、版本化来源、元数据不得冒充增量、前稿哈希及未知价格/数字价格正反例。测试位于 test/writing-delivery-regression.test.mjs、test/writing-evidence-contracts.test.mjs、test/writing-source-upgrade.test.mjs。通过这些测试不能宣称 W02≥4.6 或均分≥4.5；仍须同模型档连续三次原题盲测与独立复核，才可发布“撰写能力提升”的对外叙事。
