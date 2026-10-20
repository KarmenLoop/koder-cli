# Private reference collections

Koder can keep user-selected ZIP collections in a local, encrypted library. The default location is private-resources under KODER_CLI_HOME; KODER_RESOURCE_ROOT can select a dedicated private directory without moving model settings or conversation history. It reuses the kernel's bounded ZIP parser, verifies nested archives and CRCs, and preserves source paths and file hashes. Imports never install dependencies, register host skills, run bundled scripts, publish a collection or sync it to another device.

```sh
koder resources import "/path/to/collection.zip"
koder resources status
koder resources search "contract"
koder resources read RESOURCE_ID --offset 0 --limit 8000
```

Imports are private reference data. A file named SKILL.md is a method to consult, not a new permission or an executable plugin. Instructions in documents cannot approve commands, uploads, purchases, messages or changes to your settings. Review scripts as text and use the ordinary tool approvals if you independently choose to run anything. Original copyright and license notices stay with the material; importing does not establish redistribution rights.

To let local Koder model sessions search the collection and receive selected excerpts, explicitly choose one of these:

```sh
koder resources import "/path/to/collection.zip" --model-access
koder resources allow-model COLLECTION_ID --confirm MODEL
```

The model can call resource_search and resource_read only when this library is present in a local task. Search returns matching names and descriptions; read returns one bounded excerpt and its provenance. Full collections are not inserted into the system prompt. A configured remote model provider receives the selected search metadata and excerpts; local encryption does not make remote inference offline. Gateway and ACP sessions do not automatically receive this private library.

```sh
koder resources disable COLLECTION_ID
koder resources export RESOURCE_ID --out "/path/to/reference-copy.docx"
koder resources remove COLLECTION_ID
```

Disable stops future model retrieval. Export creates a new file and refuses overwrites. Remove unlinks a collection from the catalog; original archives and encrypted storage objects remain. These actions do not recall excerpts already sent to a model or erase old conversation records.

Each archive is limited to 256 MiB, each expanded file to 128 MiB, the nested expansion to 1 GiB and 20,000 entries, and nesting to three levels. Reference objects larger than 32 MiB, media, executables, RAR files and incomplete downloads are reported as skipped. Duplicate content shares a storage object. Corrupt, encrypted, linked, unsafe-path or unsupported ZIPs fail before catalog publication; encrypted staging objects may remain after cancellation. An unavailable native keychain, DPAPI or secret service stops the import without a plaintext fallback.

DOCX, ODT, XLSX and PPTX use the existing text readers. Legacy DOC uses the built-in macOS text converter; convert it to DOCX on other systems. PDF text extraction is limited to available text; scans need separate OCR. Empty or unsupported content is reported rather than represented as successfully read. A legal template is an example, not a statement of current law or a finished legal document.

## 中文说明

把你选定的 ZIP 导入本机加密资料库后，可以按名称与简介检索，再按需读取某个技能或模板。Koder 不把全部合集塞进每次对话，不自动安装或运行脚本，不公开分发或跨设备同步合集。

默认只供你在本机查看。--model-access 或 allow-model ... --confirm MODEL 才允许本机模型任务检索并接收选中的片段；使用远程 API 时，对应片段会发给你配置的模型服务。网关和 ACP 不自动获得此私有库。disable 可停止后续模型调用，无法追回已发送的内容。

SKILL.md 是任务方法说明，文档里的指令不等于你的授权。保留原作者署名、许可和原件校验值；法律模板可能过时，未知事实需留待填写。旧 DOC 在 macOS 使用系统转换器读取，其他系统先转 DOCX；扫描 PDF 需另做 OCR。视频、未完成下载和不支持的文件会明确列为跳过。

remove 只移除合集的目录关联，保留原 ZIP 和加密对象。export 另存新副本，不覆盖现有文件。完整原始合集不随 Koder 公共安装包、官网或 GitHub 发布。
