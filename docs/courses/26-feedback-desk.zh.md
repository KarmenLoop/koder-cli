# 26. 找得到人：反馈不是把密钥打包寄来

建议 25 分钟

**目标**：提交可复现、无秘密的反馈，并把撰写任务变成有来源的实际文稿。

**准备**：准备实际错误输出与最短复现；写作练习只提供已核实事实，不暗示不存在的更新。

## 手把手操作

1. 运行 koder feedback，阅读邮箱与空白模板。

   **应看到**：只显示联系方式和模板，不自动发送聊天或附件。

2. 填写版本、系统/终端、操作步骤、预期、实际和最后几行脱敏错误。

   **应看到**：别人能按步骤复现；不要只写“不能用”。

3. 需要Koder写反馈邮件时，明确受众、已核实事实、文件名和字数，要求保存为feedback.md。

   **应看到**：实际文件可读；未知原因写待排查，不编根因。

4. 若要发送，按第21课检查最终内容与收件人后独立确认。

   **应看到**：撰写交付与发送是两步；可只保留草稿。

## 常见问题与恢复

- **文稿只有空泛口号**：补受众、具体事实、风险和下一步；要求主文件落盘读回。
- **更新邮件乱说本版新增**：先读对应release/CHANGELOG/验收材料；无材料明确非本版增量。

## 作业与自查

写一封不发送的故障邮件：标题含版本；正文有最短复现、实际错误和希望协助的事项。

**自查标准**：文稿事实可核对，未包含Key或完整私聊；没有声称未执行过的测试。

## 开发者教学

1. W01类字数检查优先主交付文件而非聊天收尾；保留文件路径和内容哈希。

2. W02要么有可核查来源，要么明确非增量披露；乱归因仍应失败。

3. 压缩长文记录predecessor路径/哈希；不得新增前稿没有的事实。退出码3是质量门禁，不要误报API故障。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 26 课 / 共 30 课 · 找得到人：反馈不是把密钥打包寄来 ━━
教练 › 对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。
    koder feedback
  （小声）可以吐槽，欢迎复现步骤。密钥就免礼了，我们真不收。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 26 课 / 共 30 课 · 找得到人：反馈不是把密钥打包寄来 ━━
教练 › 对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。
    koder feedback
  （小声）可以吐槽，欢迎复现步骤。密钥就免礼了，我们真不收。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 26 课 / 共 30 课 · 找得到人：反馈不是把密钥打包寄来 ━━
教练 › 对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。
    koder feedback
  （小声）可以吐槽，欢迎复现步骤。密钥就免礼了，我们真不收。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 26 课 / 共 30 课 · 找得到人：反馈不是把密钥打包寄来 ━━
教练 › 对话里明确说“我要反馈”或“怎么联系官方”，Koder 会给你邮箱和空白模板。它不会自动发送，也不会把聊天历史、API Key 或私人路径塞进附件。
    koder feedback
  （小声）可以吐槽，欢迎复现步骤。密钥就免礼了，我们真不收。
```

</details>
