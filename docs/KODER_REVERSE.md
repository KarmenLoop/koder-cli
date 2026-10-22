# Koder Reverse (first-party preview)

Koder Reverse 0.1.0 is an independently implemented static-analysis core. Its parsers, ARM64 decoder, conservative graph builder, JavaScript lexer, evidence, queries and comparison logic are authored in this project. The analysis runtime imports only its own modules and Node.js built-ins. It does not invoke REA, Ghidra, IDA, Hopper, Frida, objdump or another reverse-engineering engine. The Agent bridge uses the existing Koder host, MCP transport, task approvals and result handling.

This is a development preview, not a complete replacement for REA or a claim of superior overall analysis. The bundled REA remains available until the replacement gates pass. Original third-party licenses and notices remain intact.

## Use the current terminal

```text
koder reverse status
koder reverse tools --json
koder reverse inspect sample.exe --json
koder reverse strings sample.exe --query example
koder reverse symbols sample.exe --limit 50
koder reverse disassemble app --address 0x100000350 --max-instructions 128
koder reverse graph app --max-instructions 128
koder reverse project ./source --json
koder reverse query sample.exe --query sample
koder reverse diff old.exe new.exe --json
```

Paths must stay inside the selected project. Use Koder's usual `-w` option to select an authorized project. `project` accepts a directory; the other analysis commands accept regular files. Symlinks, path traversal and nonregular targets are rejected. Read failures, unsupported formats, limits and incomplete coverage remain explicit. Targets are never executed. Human output is formatted JSON, which also escapes terminal control characters in findings; `--json` emits compact JSON.

In chat, use `/reverse` or `koder reverse ...` without opening another terminal. `/setup` includes **Koder Reverse (preview)**. `koder reverse enable` registers the first-party service for this project, after which the Agent discovers `reverse_` tools through `app_tools` and requests `app_call` under the existing approval flow. Rejection prevents execution. Enabling the service grants no task permission. `koder reverse disable` removes future access in this project. Existing REA settings are separate.

## Actual support

| Area | Implemented | Limits |
| --- | --- | --- |
| PE32 / PE32+ | Machine, sections, entry, imports and exports | No resource decoder, CLR decompiler, unpacker or signature validation |
| ELF32 / ELF64 | Both byte orders, section table, symbol tables and section-backed dynamic library names | Program-header-only dynamic analysis is not implemented; relocations are not applied |
| Mach-O | Thin 32/64 and universal slices, sections, symbols, dylib names and file-backed entry | One selected slice analyzed; no Objective-C/Swift type recovery or signature verification |
| WASM | Core section metadata, function body spans and interfaces | Metadata parser, not full type/instruction validation or decompilation; unsupported extensions fail |
| JavaScript / TypeScript | Lexical import/export/function/class/call candidates, Unicode byte offsets | No full grammar, scope/type resolution, JSX semantics or template-expression analysis |
| JS projects | Bounded file graph, per-file hashes, unique/ambiguous/unresolved/dynamic edges | External packages unresolved; excludes `.git`, `node_modules` and Koder state folders |
| ASAR | Packed file spans and virtual JavaScript analysis without extraction | No following links/unpacked files; embedded integrity metadata not verified |
| ARM64 | Direct branches/calls, conditional branches, returns/register branches, address formation and selected arithmetic/move/literal-load forms | Subset only. Unknown words remain `.word`; indirect targets unresolved; no x86 decoder |
| Graph / diff / query | Conservative blocks/edges, explicit call references, extracted-fact and string changes, literal search | Not a decompiler, proof of behavior, semantic equivalence or vulnerability detector |

ARM64 graph inference stops at unknown instructions. A direct target is only the encoded static address. Relocatable object files are rejected for disassembly until relocation handling is implemented. Extracted strings cover printable ASCII and the ASCII range within UTF-16; they are not a general Unicode string detector. Duplicate facts are retained by occurrence in comparisons.

Every target has a SHA-256 identity. File-backed facts carry byte ranges where available; missing ranges are not invented. Source candidates keep line numbers and original UTF-8 offsets. Results are untrusted data and confer no authority. Submitted analysis results may be visible to the user's configured model under the normal Koder task flow.

## Budgets and recovery

A file is limited to 32 MiB, JavaScript source to 2 MiB, a project to 256 source files / 8 MiB, directory traversal to 4096 entries / 20 levels, and ASAR headers to 4 MiB with bounded entries and depth. Tables, symbols, strings, instructions and output have separate limits. Tool output is limited to 1 MiB. List operations page results; string scan truncation is explicit.

Each request has an owned Worker and a 10-second default deadline. Cancellation or timeout terminates only that Worker; the terminal and service remain usable. A result is returned only after Worker exit. There is no automatic retry. Reads compare file identity before and after the snapshot; project scans recheck the file list and file contents. These checks are not an atomic filesystem snapshot or an OS sandbox.

## Internal extension seam

`createAnalyzer({formats, passes})` accepts explicit trusted format modules with `id`, `detect` and `parse`, and analysis passes with `id` and `run`. A pass receives copied bytes and facts plus an immutable target identity; it cannot mutate the caller's input through those values. Duplicate ids, malformed contracts, async passes and oversized pass output are rejected. The public tool service loads no plugin code from a target directory or user-supplied path. This is an internal engineering seam, subject to the product license, rather than permission to modify proprietary source.

New first-party formats and passes must provide a fixed reference corpus, malformed/budget tests, provenance, evidence ranges, honest coverage and end-to-end Koder acceptance. A new tool name is not an implemented capability.

## Replacement and improvement gates

Before replacing third-party REA, finish the required native instruction sets, relocation handling, function recovery, IR/SSA/data flow, types and decompilation; application and managed/Android formats; dynamic debugging and runtime observations; evidence/session/unknown workflows; and the relevant desktop platforms. Maintain a capability-by-capability comparison against the pinned 207-tool reference, without treating tool count as parity.

Use identical pinned targets to measure recovered facts against ground truth, false positives, unsupported coverage, stability, latency, peak memory and cleanup. A faster lexical scan is not superior to a semantic application analysis. New extension tests must show new formats and passes without editing the kernel. Only switch the default after functional parity, materially better results in the agreed use cases, Windows/macOS/Linux acceptance and independent release review. The current status explicitly reports `fullReaReplacementAccepted: false`.

## Sources used as format references

The implementation was written independently from public format descriptions. These references are specifications and interoperability documentation, not bundled parser implementations:

- [Microsoft PE/COFF specification](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)
- [System V ELF header specification](https://gabi.xinuos.com/elf/02-eheader.html)
- [Apple Mach-O format declarations](https://github.com/apple-oss-distributions/cctools/blob/main/include/mach-o/loader.h)
- [WebAssembly binary modules](https://webassembly.github.io/spec/core/binary/modules.html)
- [Electron ASAR format](https://github.com/electron/asar#format)
- [REA reference scope](https://github.com/morluto/rea)

Validation tools are separate: the system compiler creates owned sample binaries; `otool` and `nm` supply an oracle for those samples; an already bundled official ASAR writer creates an independent archive fixture; and REA runs a separate baseline comparison. None is called by the production analysis core.

## 中文快速使用

`/reverse` 查看自研引擎状态，`/reverse inspect 文件` 查看结构，`/reverse project 目录` 查看 JS 项目依赖候选。`/setup` 中也有「自研逆向（预览）」入口。启用后 Agent 仍按现有流程请求授权，拒绝就不运行；分析不会执行目标，也不自动装外部工具。

这是自研静态核心的第一阶段。当前不能替代完整反编译、动态调试或 REA 全部能力。原 REA 暂时保留，等对等能力和跨平台验收通过后再替换。
