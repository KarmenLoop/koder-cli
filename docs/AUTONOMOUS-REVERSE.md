# Scoped crawling and first-party reverse analysis

In a relevant Agent task, Koder can chain public-page collection, first-party static JavaScript analysis, workspace-file analysis and report delivery through its existing tools. No new reverse engine or background service is introduced. Third-party REA and the existing MCP routes remain available under their original controls.

Try: “Crawl and analyze https://example.com for this authorized project. Inspect the public page structure and scripts, distinguish observed facts from unknown runtime behavior, and save a report.” For local input, ask: “Use first-party reverse analysis on sample.js in this workspace without executing it.”

- `site_recon` accepts a URL explicitly provided in the task. Collection stays on that origin, including port and protocol. Cross-origin redirects are rejected. Target content cannot expand the authorized origin.
- Defaults are three HTML pages and two external JavaScript attempts. Hard limits are six pages, four script attempts, 256 KiB per response, 2 MiB total and a 20-second overall deadline. Requests are serialized. Results report truncation, failures and actual SHA-256 identities.
- Public-address checks run before connection, with validated DNS results pinned to the request. Private, loopback and link-local destinations are restricted. A live preview already attached through Koder's original preview owner can be inspected on its authorized loopback origin.
- No login state, Cookie, authorization header or provider key is used. Explicit task-level network denial remains enforced.
- Collected JavaScript bytes go into an owned temporary directory and through the existing Koder Reverse Worker. The target is never executed. The Worker is joined before its temporary input is removed.
- `reverse_analyze` reuses the existing `inspect`, `strings`, `symbols`, `disassemble`, `graph`, `diff`, `query` and `project` operations. Targets remain confined to the authorized workspace; original parsing budgets, cancellation and cleanup are unchanged. This direct static-analysis path does not need a new MCP connection.
- Saving the report uses the ordinary file-change approval. An entirely failed collection is `unverified`, not an empty success.

Current coverage is static HTML structure and external same-origin JavaScript. Inline scripts, authenticated pages, runtime-only routes, actual API calls and rendered interactions are not established by this tool. Use the existing authorized browser driver and actual observations for those. JavaScript results are lexical candidates; ARM64 decoding is still a documented subset. This is not full decompilation, semantic equivalence, vulnerability proof or complete replacement of REA.

The first-party core's detailed coverage and existing standalone commands remain in [KODER_REVERSE.md](KODER_REVERSE.md). Ordinary unrelated requests do not receive the crawler or local reverse tools. No dependency or native engine is installed automatically.

## 中文使用

直接说：“爬取并逆向分析这个已授权站点 https://example.com，保存结构、脚本证据与未知项报告。”Koder 会按当前任务范围串联采集、自研静态分析和文件审批。本地文件可说：“用自研逆向分析 sample.js，不执行目标。”

这条路径不读取用户已有浏览器登录态，不跨站扩展目标，不自动安装外部工具。静态结果与真实运行行为分开；需要登录、操作浏览器或调用真实接口时，继续走原工具与授权。原 REA、MCP 和全部既有能力继续保留。
