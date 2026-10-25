# Conversation suggestions and editable drafts

The unreleased [compact session dock](SESSION-DOCK.en.md) keeps these draft/menu rules and adds Todo, a model footer, Ctrl+J multiline input and scrollable /help. Existing installed releases keep their documented behavior until upgraded.

After a Koder reply, the terminal offers up to three optional next messages based on the current conversation. Explicit choices in the assistant's question take priority. Otherwise local rules combine the recent user goal and the reply stage to suggest a follow-up, such as checking a page preview, refining a plan, or examining an error. A short “continue” message keeps the earlier task in view. These are local suggestions, not another model response; no extra API request is made.

Type `/prefill 1`, `/prefill 2`, or `/prefill 3` to fill the corresponding draft. `/prefill` opens a picker with the current suggestions first, followed by saved task templates. Choosing fills the line editor; **it does not send**. Edit the draft and press Enter yourself, clear it with Ctrl+U, or ignore all suggestions and type a different message. If you already have draft or queued input, it takes priority.

For example, after “Which layout do you prefer? A. Product cards / B. Brand story,” the suggestions are “I choose: Product cards” and “I choose: Brand story.” After a website change, suggestions may ask to check the current preview and narrow-screen behavior. Suggestions do not grant permissions or imply that a test passed.

- `/suggest` shows the current choices again.
- `/suggest clear` dismisses this round's choices.
- `/suggest off` disables suggestions in this machine's CLI configuration.
- `/suggest on` enables suggestions for future replies.

Only a bounded projection of recent visible user and assistant text from the active conversation is used. Tool outputs, private model reasoning and other conversations are excluded. Credential-labelled lines, fenced code and terminal controls are excluded from suggestion text. Conversation-derived suggestions stay in memory, clear on a new session or identity/model change, and are not saved as custom templates. If you send an edited draft, it follows the existing conversation-history settings. Failed or cancelled turns suggest checking the actual state before making another change. The local rules can miss intent; you can always ignore or edit a suggestion. In noninteractive output no automatic suggestion banner is printed.

## Saved templates

Use `/prefill` in a Koder conversation to choose a task template. `/prefill fix` fills the bug-report template directly. You can also open `/setup`, choose **Prompt prefills**, then pick a template. The settings screen closes and the draft appears in the same conversation.

Replace the bracketed placeholders, edit the text, and press Enter yourself to send it. Choosing a template does not submit a task or grant tool permission. Ctrl+U clears the draft in a supported line editor. Esc returns from the picker; when filtering, the first Esc clears the filter.

The built-in ids are `website`, `app`, `fix`, `review`, `tests`, `docs`, `plan`, and `rea`. Templates follow the current Chinese or English interface language. Press Tab after `/prefill f` to complete an id. `prefill` and `prompts` are aliases, with `预填词` and `预填` available in Chinese.

## Save your own templates

Custom templates stay in this machine's CLI configuration. They become task input only when you choose a template and send the edited draft. No model is needed to list or manage them.

```text
koder prompts list
koder prompts show fix
koder prompts add daily --title "Daily check" --text "Check [project] for [issue]. Report the evidence and next step."
koder prompts update daily --title "Daily review" --text "Review [scope] and report actionable findings."
koder prompts remove daily
```

Use `--json` for structured list, show and management results. Ids use lowercase letters, digits and hyphens, beginning with a letter. Each title is limited to 80 characters and each body to 8192 characters, with up to 50 custom templates. Built-in templates keep their original ids; save a custom variation under a different id. Duplicate ids require an explicit `update` command. Terminal control characters are rejected.

The picker shows a bounded preview so long templates fit the terminal. The complete body is retained when a draft is filled.

Templates are plain text. Bracketed placeholders are edited by the user; there is no script or expression evaluation. A stored multiline body is flattened to a single editable input line, so its newline characters cannot submit the task. `show` preserves the stored text for copying.

Existing drafts and queued messages take priority. If the editor has pending input, the chosen template is shown for copying and that input is preserved. Piped input, scripted clients, and dumb terminals also receive copyable text rather than an uneditable draft. A staged draft is retained in the input snapshot used for update handoff, and it keeps an automatic update from taking over an unfinished input. Approval prompts do not consume staged task text.

This feature fills the next task draft. Assistant personality and long-lived instructions continue to use the existing personalization settings.

## 中文快速上手

每轮回复后会根据当前对话给出最多 3 条可选下一句。输入 `/prefill 1` 等选中后填入，可继续编辑，亲自按回车才发送；也可以完全忽略，直接输入自己的任务。`/suggest clear` 清除本轮，`/suggest off` 关闭，`/suggest on` 重新开启。候选在本机使用当前会话可见内容生成，不额外调用 API，不单独保存候选文本。

在聊天中输入 `/prefill` 选当前建议或模板，或输入 `/prefill fix` 直接填入排错模板。也可以通过 `/setup` →「常用预填词」选择。编辑方括号里的内容，再亲自按回车发送；选择模板不会开始任务。

支持网站、App、排错、代码审查、测试、文档、方案和 REA 静态分析的中英文模板。输入 `/prefill f` 后按 Tab 可补全编号。已有草稿或排队消息会保留。可编辑终端中 Ctrl+U 清空草稿；选择器里 Esc 返回。无法编辑的终端会显示可复制文本。

保存自己的模板：

```text
koder prompts add daily --title "每日检查" --text "请检查 [项目] 的 [范围]，给出证据和下一步。"
```

## Slash menu and terminal fallback (0.4.9)

In an empty interactive chat input, type / to browse context suggestions, templates and commands. This also works while a task is running. Tab or a selection-confirming Enter fills the draft without sending it. Continue typing to filter; no matches remain visible. Escape closes the menu without dispatching a task. /steup remains a compatibility alias for /setup.

A narrow or wrapped input shows a one-time fallback explaining Tab completion and /help. Dumb/non-TTY chat prints a plain fallback without popup escape sequences. Noninteractive run --json remains headless. Pasted commands retain their literal submission behavior; pasted text is never silently converted into a selected template.

中文：空输入按 /，忙时同样可选；选择只填草稿。窄屏、折行或不支持的终端明确提示改用 Tab 或 /help。没有匹配项仍保留提示；菜单打开时 Esc 先关闭菜单。粘贴命令继续按粘贴内容处理，不会偷换为当前选项。
