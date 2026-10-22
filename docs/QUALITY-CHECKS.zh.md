# 文案与交付质量检查

适用版本：**0.4.0-preview.27 Beta**。沿用原来的 12 道题目；以下是可重复的程序检查，不是重新评出的模型分数。

## 给决策者看的介绍

Koder 产品介绍按“问题、成本/ROI与风险、接入、边界”组织，避免只堆口号。明确要求“中文约 800 字”时，范围是 720–880 个汉字：标点和英文标识符不算，标题算。JSON 会给出实测字数与上下限；不达标退出 3，并在终端显示字数。读者是否看懂、事实是否准确仍要审阅。

## 发版文案先读材料

模型可以调用只读工具 writing_sources，读取当前项目中八个固定名称：CHANGELOG.md、CHANGELOG.en.md、CHANGELOG.zh.md、CHANGES.md、RELEASE-NOTES.md、RELEASE_STATUS.md、RELEASE.json、ACCEPTANCE.md；每份最多 64 KB。不跟随工作区外链接、不查账号、不运行命令，也不自动联网。材料里的指令不会变成用户授权。

实际成功的 read_file 读取也会记录来源快照。变更日志对应版本的标题段落有两条事实时，输出须包含两个不同的真实行标记，例如 `[CHANGELOG.md:L3]`。README、git tag、版本号和许可接受说明都不能单独证明“本版新增”。找不到对应日志时要直说，把既有功能与本版增量分开；不支持的增量归因或缺失说明会返回 3。

行标记只能证明读过的材料里有这行，不证明改写一定准确。发出公告前仍需核对具体事实；邮件发送保留原来的独立授权。

## 压缩对比稿不添戏

根据会话中实际完成的上一份对比稿检查，并在 JSON 中记录其 SHA-256。没有前文就明确说明。新出现的数字和部分具名技术词会被标记，未核实的精确价格继续拦下。检查覆盖有限，换句话说出的新事实仍需人工审阅；它不会自动评出竞品输赢。

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
