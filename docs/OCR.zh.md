# 本地 OCR：图片和扫描 PDF 手把手

0.5.0 随包提供 Tesseract.js 7.0.0、WebAssembly 核心、英文和简体中文数据。识别在本机执行，不需要 Python、新云账号或 OCR API Key。默认启用；在 Setup → Skills 关闭“本地 OCR”，或执行 `koder ocr off`。恢复用 `koder ocr on`。关闭全部 Skill 同样有效。

## 第一次识别

1. 在自己的项目目录放一张清晰的 PNG、JPEG 或 BMP，例如 invoice.png。原文件保留，不覆盖。
2. 在该目录打开终端，运行 `koder ocr status`。应看到 enabled: true、languages 包含 eng 和 chi_sim。
3. 运行下面的命令。PowerShell、CMD 和 macOS 都使用同一命令；文件名有空格时加双引号。

```text
koder ocr read invoice.png --json
koder ocr read "scanned manual.pdf" --page 1 --language eng+chi_sim --json
```

4. 检查 text、confidence、page、totalPages、nextPage、citation.sha256。把订单号、金额、人名和引文对照原图核实；置信度不是准确性担保。
5. nextPage 不为 null 时，按需读取下一页。保留第一次返回的真实 SHA，用 `--sha` 指定它可检测文件是否在读页间变化。不要把示例 SHA 当真实值。

## 让当前模型调用

```text
koder run "识别 scanned manual.pdf 第 1 页，核对退款期限，保存含页码和来源哈希的 notes.md" --yes
```

以上 Agent 任务使用你已配置的模型和 API 费用预算。OCR 引擎本身不调用模型；当 Agent 将识别文本用于回答时，文本会像其他工具结果一样进入你选择的模型上下文。仅直接 `ocr read` 是无模型本地识别。不要把“不上传 OCR 服务”理解为 Agent 模式不会向你的模型发送文字。

文档任务先尝试 PageIndex 目录和文字回读；PAGEINDEX_OCR_REQUIRED 或空白扫描页使用 document_ocr。OCR 回执与 PageIndex 文字引用不同：OCR 可能误识别，不能把识别文字当作已经通过原文逐字校验。当前不自动给整本扫描文档建立持久搜索库。

## 失败时看什么

| 结果 | 含义与处理 |
| --- | --- |
| OCR_DISABLED | 在 Setup 或 ocr on 开启；检查全部 Skill 总控 |
| OCR_SOURCE_CHANGED | 文件已改变；重新核对原文件并取得新 SHA |
| OCR_LANGUAGE_UNAVAILABLE | 随包语言只有 eng、chi_sim、eng+chi_sim |
| OCR_PIXEL_LIMIT | 单图/渲染页超过 800 万像素；在项目中另存较小副本 |
| OCR_PAGE_INVALID | 页码不是正整数或超出文档范围 |
| OCR_RESOURCE_CHANGED/INVALID | 包资源变更或损坏；用官方安装器修复，不跳过校验 |
| OCR_TIMEOUT | 当前识别达到有界等待；原图未修改，先检查任务状态再重试 |
| text 为空 | 未识别到文字；核对图像质量，不补造内容 |

单文件上限 64 MiB；每次一页，默认识别超时 300 秒，PDF 解析另有 120 秒界限。每次调用有资源限制，整项任务仍默认无工具轮次上限，取消与费用预算保留。工具只读当前工作区；路径跳出、敏感文件和不安全链接沿原文件门控拒绝。

开发者可从 document_ocr 的 JSON 回执读取 method: ocr、untrusted: true、modelCalls: 0、networkUsed: false。源码与依赖来源见 licenses/ocr/SOURCE.json；包内 manifest 校验哈希与文件清单。复核后的页码和源哈希应保留到交付文档，不能只保留模型总结。
