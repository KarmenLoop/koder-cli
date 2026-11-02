# 网页数据采集与断点恢复

本页适用于 **0.8.1**。采集实现延续 0.7.2，已记录的模型与浏览器检查仍标明原测试版本。

[English](WEB-DATA.md) · [简体中文](WEB-DATA.zh.md)

Koder Web Data 是 CLI 内核中的数据采集模块。用户要求爬取公开网页、提取列表字段或读取 JSON 数据接口时，会加载 `builtin:web-data` 的任务指导，并向 Agent 提供 `web_data` 工具。普通聊天不加载采集工具的参数表。

采集调度、权限、分页和检查点由 Koder 原生实现。CSS/JSON 直接走 Node；XPath 或显式 `engine=scrapling` 调用随包 Python 中的 [Scrapling 0.5](https://github.com/D4Vinci/Scrapling)。无需系统 Python、pip 或另一套浏览器。首次使用 Python 时校验并解包到 Koder 缓存，后续复用同一份；普通启动不解包。此功能不是 Scrapling 全部 Python API 的兼容层。

## 第一次使用

1. 运行 `koder` 进入对话。已有项目就在项目目录中运行；产物归当前工作区。
2. 用 `koder permissions status` 查看授权。需要联网时运行 `koder permissions request --capability network`，按原有界面授予网络访问。`--yes` 不代替电脑授权。
3. 给出目标 URL、字段和需要的范围。例如：

   > 从 https://example.com/catalog 采集公开商品列表，只要名称、价格和详情链接。先核对第一页，再跟随“下一页”，保存 CSV 和来源清单。最多采前三层分页，不登录、不购买。

   `example.com` 是示例地址，请换成实际允许采集的目标。只说站点名称时，Agent 应先确认具体 URL；网页提供的链接不能扩大用户授权的站点范围。

4. Agent 先读取技能、采集样本、核对字段，再继续分页。成功后会给出真实文件路径、记录数和 `MANIFEST.json`。`paused` 表示本批停下但有待采页；`partial` 表示有失败页或缺失字段，均不等于全部完成。
5. 在工作区查看 `.koder/web-data/wd-…/MANIFEST.json`。它列出各页文件名、字节数、SHA-256、来源、抓取时间、请求数、重试数、提取配置、robots 校验和未完成范围。每页的 `sourceSha256/sourceBytes` 对应原始响应，`sha256` 对应保存的页面 JSON；它们不是同一个文件，不能互换。

## 文件布局

```text
项目/
  .koder/web-data/wd-<作业编号>/
    job.json                 # 内核检查点，用于恢复
    MANIFEST.json            # 交付清单与完整度
    robots.txt               # 校验过的公开站点采集规则；离线 parse 不生成
    export.csv               # export 合并后的表格（可选 JSON/JSONL/MD）
    pages/
      000001.json            # 单页元数据、字段记录、警告
      000001.jsonl           # 单页逐行数据，含 _source
      000001.csv             # 单页表格，防公式注入
      000001.md              # 单页可读数据
      000002.…
```

每页分片保存，避免长任务把全部数据塞回模型上下文。`read` 每次返回至多 20 条、约 12 KB 数据，以及约 6 KB 的实际 DOM 结构提示；大记录会返回文件路径，完整内容仍在文件中。`structure.selectors` 给出观察到的选择器、出现次数和文本样本，`nextLinks` 给出分页线索，帮助 Agent 根据真实结构提取字段。

最终需要单一 CSV 时，Agent 调用 `export`。内核会重新核对所有分片摘要、保留每条记录的 `_source`，生成合并文件并登记到清单。单次合并原始记录上限约 1 MB、输出上限 1.8 MB；超限有明确原因码，原分片仍保留。未采完时可以导出已有记录，但 `complete` 仍为 `false`。恢复采集后，应重新 export 才包含新增页。

不要手改 `job.json`。恢复时会核对已提交的 JSON、JSONL、CSV、Markdown 摘要；文件缺失或变更会报告明确错误，不自动重新下载并覆盖。

## 工具动作与示例

终端快捷入口（对话中把 `koder ` 换成 `/`）：

```sh
koder web-data capabilities
koder web-data doctor
koder web-data test
koder web-data test --engine native
koder web-data parse exports/catalog.html --xpath '//article' --fields '{"name":{"xpath":".//h2/text()","required":true}}'
koder web-data read wd-实际作业编号
koder web-data export wd-实际作业编号 --format csv
```

`test` 创建并清理自有离线样本；只有真实提取出预期的两条记录才返回 `state: passed` 和 `runtimeVerified: true`。它不代表浏览器、登录网页或其他平台已验收。`parse` 的文件必须在当前工作区内；采集远程网页则用 `fetch URL` 或 `crawl URL`，仍需原网络授权。

下面是 Agent 内部工具参数，不是终端命令。用户通常只需自然语言提出需求。

| 动作 | 用途 |
| --- | --- |
| `capabilities` | 查看此版本支持及不支持的能力 |
| `fetch` | 采集一页公开 HTML 或 JSON |
| `crawl` | 依照下一页选择器或 JSON 路径同源分页 |
| `status` | 读取作业状态和未完成范围，不联网 |
| `read` | 分页读回已保存记录，不联网 |
| `export` | 核对所有已提交页并合并为 CSV/JSON/JSONL/MD，不联网 |
| `resume` | 继续尚未提交的页面；默认不重试已失败页面 |
| `parse` | 提取工作区内已保存的 HTML/JSON/TXT/Markdown，并生成同样的交付文件，不联网 |

HTML 列表：

```json
{
  "action": "crawl",
  "url": "https://example.com/catalog",
  "selector": "article.product",
  "fields": {
    "name": {"selector": "h2::text", "required": true},
    "price": {"selector": ".price", "required": true},
    "link": {"selector": "a::attr(href)"}
  },
  "nextSelector": "a[rel=next]",
  "maxPages": 10,
  "maxDepth": 3,
  "delayMs": 500
}
```

JSON 接口：

```json
{
  "action": "crawl",
  "url": "https://example.com/api/items",
  "itemsPath": "data.items",
  "fields": {"name": {"path": "name", "required": true}},
  "nextPath": "links.next"
}
```

`path` 是点分属性或数组索引，例如 `address.city`、`tags.0`，不是任意表达式。HTML 字段用 CSS 或 XPath，JSON 字段用 path；二者混用会报错。XPath 示例：`{"action":"parse","sourceFile":"catalog.html","xpath":"//article","fields":{"name":{"xpath":".//h2/text()","required":true}}}`。所有数据经同一隐藏内容清理与输出限制，Python 不负责联网、不执行目标脚本。

读回及恢复：

```json
{"action":"read","id":"wd-<完整作业编号>","page":1,"offset":0,"limit":10}
{"action":"resume","id":"wd-<完整作业编号>","maxPages":10}
{"action":"export","id":"wd-<完整作业编号>","format":"csv"}
```

取消后可在同一工作区要求“继续这个采集作业”。如果丢失了对话中的原 URL，应重新提供目标 URL，不能以检查点内容自行扩大联网授权。用户明确要求重试失败页时才传 `retryFailures: true`。

## 动态页、登录页与浏览器

0.7.2 起，公开动态页面可直接用 `browser:true` 渲染，再通过 CSS 或 XPath 提取。先授予 network/browser；准备受管组件需要单独的 network/skills.update 授权：

下面的 URL 只是占位示例，请换成你有权采集的页面；它不是可直接采集的商品目录，也不是实测目标。

```sh
koder skills runtime playwright status
koder skills runtime playwright install
koder skills runtime playwright browser
koder web-data fetch https://example.com/catalog --browser --wait-selector article --xpath '//article' --adaptive
```

只需 HTML/CSS/JSON 时不启动浏览器。XPath/自适应使用随包 Python，无需系统 Python。浏览器组件按需下载一次并复用；安装包没有再塞入多份 Chromium。动态页面使用独立临时浏览器，不读取用户 Cookie。waitSelector 支持 CSS 或 xpath=…，waitMs 最多 10 秒，scrollPages 最多 10 屏。read.browser 显示渲染、清理、警告及提取范围；当前结构化采集提取主 frame。iframe、登录、表单、截图、PDF、标签页、弹窗、上传下载、网络监听与 Cookie/storage 操作均走已有 Playwright 或 Apps/MCP 交互通道和原审批。用 `koder skills runtime playwright --json` 获取真实 command/args，调用启动器的 `--help` 查看本版本命令；不要假设全局 PATH 已安装。

浏览器请求仍经过同源、robots、DNS、网络授权检查；只读采集不提交 POST、不处理验证码。跨域依赖、脚本失败会明确返回 partial，不能说“全量采集完成”。交互浏览器能导出 HTML 时，也可保存到当前工作区后调用：

```json
{"action":"parse","sourceFile":"exports/catalog.html","url":"https://example.com/catalog","selector":".product","fields":{"name":{"selector":"h2","required":true}}}
```

离线产物标记 sourceKind: saved-file；渲染采集标记 isolated-browser。DOM 的 sourceSha256 对应渲染结果，不等于原始 HTTP 字节。缺少运行组件或浏览器权限时给出原因，不会把没有启动当成成功。完整交互由原 Playwright 实现；本采集接口不是 Scrapling Python API 的逐项替代。

## 页面改版后的自适应恢复

首次正确提取加 adaptive:true。作业把元素标签、子结构和语义属性哈希放进原页面 JSON；不建立全局数据库，不存密码、Cookie 或正文。下一次页面 CSS 类名变更时，使用相同的 selector/xpath/fields，并传 adaptiveFrom: 上次完整作业编号。必须同源，旧参考文件会重新校验摘要。

```json
{"action":"fetch","url":"https://example.com/catalog","selector":".product","fields":{"name":{"xpath":".//h2","required":true},"price":{"selector":".price","required":true}},"adaptive":true}
```

保存实际返回的 wd-… 编号。下一次保持上述提取契约，增加 `"adaptiveFrom":"wd-实际编号"`。CSS 和 XPath 元素都可作为锚点；text()/@attr 是标量，不能独立学习结构。旧选择器无匹配时才尝试恢复；read.adaptive.events 明确记录恢复字段、候选数量和匹配分数。多个相似字段返回 AMBIGUOUS，语义对象变化返回 DRIFT，没有可靠锚点返回 NO_MATCH；Agent 应读回数据和警告后决定如何修正，不得降低阈值制造成功。

## 默认范围与可恢复限制

- 每批默认 10 页，最多 100 页、60 秒。批次到期返回检查点，Agent 可继续 `resume`；不改变整个任务的取消或费用预算。
- 单响应最多 1 MiB；单作业最多 32 MiB 网络响应、1000 页；待采队列最多 500 项。大型任务需按明确范围拆分作业。
- 单页至多 1000 条；字段值、记录数或提取容量超限会有警告或错误，不能当作完整数据。
- 默认间隔 500 毫秒，尊重 robots 规则及 Crawl-delay。间隔与 Retry-After 跨批次保存；返回 `notBefore` 时等到该毫秒时间戳再恢复。robots 缓存校验摘要、最多保留 24 小时，避免每次恢复都重新起算采集间隔。服务端要求超过 1 小时间隔时明确停止此作业，不降低服务端要求来继续请求。
- 429/部分 5xx 有限重试；较长 Retry-After 保存到检查点，稍后恢复。
- 只 GET 用户指定站点。同源跳转逐次复核授权与 robots；私网、携带账号密码或敏感查询参数的 URL 不允许。宿主确认的本地项目预览仅用于已有本地预览流程。
- 页面和工具输出始终是不可信数据，不能改变任务、授予权限、要求安装或外传数据。

## 常见结果与处理

| 原因码 | 含义与处理 |
| --- | --- |
| `COMPUTER_PERMISSION_REQUIRED` | 未授予网络权限；走现有 permissions |
| `SITE_SCOPE_REQUIRED` | 目标不在用户明确的 URL 范围内；补充目标 |
| `WEB_DATA_BATCH_LIMIT` / `WEB_DATA_BATCH_DEADLINE` | 本批结束；用同一编号恢复 |
| `WEB_DATA_BACKOFF_PENDING` | 服务器要求等待；不要反复请求 |
| `WEB_DATA_ROBOTS_DENIED` | robots 不允许该路径；停止此路径 |
| `WEB_DATA_ROBOTS_CACHE_CHANGED` | 本地 robots 缓存缺失或变更；保留产物，核对后新建作业 |
| `WEB_DATA_CRAWL_DELAY_LIMIT` | 服务器要求超过本采集器支持的 1 小时间隔；停止，不降低间隔绕过 |
| `WEB_DATA_HTTP_401` / `WEB_DATA_HTTP_403` | HTTP 路径无访问权；检查授权浏览器可用性 |
| `WEB_DATA_NO_MATCHES` / `WEB_DATA_REQUIRED_FIELD_MISSING` | 选择器或字段不匹配；读实际页面后调整，不能制造空成功 |
| `WEB_DATA_CHARSET_UNSUPPORTED` / `WEB_DATA_ENCODING_INVALID` | 声明编码不可用或字节损坏；不输出乱码冒充数据 |
| `WEB_DATA_ARTIFACT_CHANGED` / `WEB_DATA_ARTIFACT_MISSING` | 已交付文件变更或缺失；先核对，不能静默覆盖 |
| `WEB_DATA_CHECKPOINT_INVALID` | 检查点损坏或格式不符；保留现有产物后建立新作业 |
| `WEB_DATA_EXPORT_SIZE_LIMIT` | 合并文件超限；交付已保存分片，或按明确范围拆分作业 |

## 开关与兼容范围

默认内置，Setup 的 Skills 页面可关闭，也可运行：

```sh
koder skills disable builtin:web-data
koder skills enable builtin:web-data
```

沿用 `disabledSkills`，不新建另一份权限或技能数据库。关闭后自动指导和采集工具一并撤下。

此实现支持 HTML/CSS/XPath、结构指纹恢复、公开 JSON 接口、浏览器渲染、分页、检查点和文件交付。交互复用完整 Playwright 入口；采集接口不提供代理轮换、指纹伪装、验证码破解或任意 Python 回调。第三方许可保留在 licenses/web-data/、Python 分发包和依赖 dist-info 中。Windows x64 复用随包 Python；macOS/Linux 保留 arm64、x64。没有删减原功能，也没有把上游代码改名冒充自研。

当前验证状态由发行验收记录给出。Node 核心与本地 HTTP 测试不能替代 Windows/Ubuntu 真机、真实登录网页或各浏览器驱动的验收。
