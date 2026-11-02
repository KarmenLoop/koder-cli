# Web data collection

This guide applies to the **0.8.1 draft**. The collection implementation is carried forward from 0.7.2; the recorded model and browser checks retain that original version.

[English](WEB-DATA.md) · [简体中文](WEB-DATA.zh.md)

Koder 0.7.2 adds structural selector recovery and managed browser rendering to the existing collector. Native CSS/JSON extraction stays in Node. XPath and adaptive extraction use the bundled Python/Scrapling parser. Jobs, permissions and exports remain in Koder; there is one built-in Skill and one checkpoint store.

## Prepare the browser

Run `koder skills runtime playwright status`. If needed, run `koder skills runtime playwright install`, then `koder skills runtime playwright browser`. Downloads require the existing network and skills.update grants. Rendering additionally requires browser permission. Components are installed once in the managed cache; ordinary CLI startup does not download a browser.

The URL below is a placeholder. Replace it with a page you are allowed to collect; it is not a working catalog or a recorded test target.

```sh
koder web-data fetch https://example.com/catalog --browser --wait-selector article --xpath '//article' --adaptive
```

Provide fields through `--fields` as JSON or in a conversation. CSS and XPath can be used at the row and field levels. The browser executes JavaScript in a temporary isolated context. GET requests still pass through the existing same-origin, robots, DNS and permission checks. It imports no user cookies. `waitSelector` accepts CSS or `xpath=…`; `waitMs` is bounded to 10 seconds and `scrollPages` to 10 screens.

Use `web-data read <job-id>` to inspect actual rows, warnings and the browser receipt. The page source hash describes the rendered DOM; it is not the original HTTP response hash. Each page and export is persisted and checked. A partial result is not a complete crawl.

## Recover a selector

On a verified extraction, set `adaptive:true`. Element structure and hashed semantic attributes are stored inside the existing page artifact, without text, credentials or a second database.

On the next run, keep the same row selector and fields and set `adaptiveFrom` to that job ID. Recovery requires the same origin and unchanged extraction contract. The original artifacts are hash-checked before use. CSS and XPath element selectors can establish anchors; scalar text()/@attr results cannot.

If the old selector matches nothing, Koder searches for structurally compatible elements. Ambiguous fields, missing anchors and changed semantic targets produce distinct warnings. It does not lower thresholds or invent values. `read.adaptive.events` records fallback fields, counts and scores. Inspect the result before delivering it.

## Interactive browser coverage

The existing managed Playwright launcher handles navigation, snapshots, clicks, typing, keyboard input, selection, hover, tabs, frames, screenshots, PDF, file upload/download, network observation, cookies, storage and page evaluation. Get its actual command and arguments with `koder skills runtime playwright --json`; invoke that launcher with `--help` through the normal approved shell flow. Connected Apps/MCP remain preferred when they cover the operation.

The read-only collector extracts the main frame. Use the interactive driver for frames, authenticated sites and actions, then export HTML for `web-data parse` when useful. Login, sending, submission and uploads retain their original approvals. Existing browser profiles are not imported automatically.

## Limits and receipts

Collection remains resumable: default 10 pages per batch, at most 100; 60-second batches; 1 MiB per response and 32 MiB/1,000 pages per job. Browser rendering has a 30-second page budget and at most 64 subrequests/8 MiB. Media is omitted from structured extraction; interactive browsing retains it. Cancellation closes only the owned temporary browser.

No CAPTCHA bypass, stealth fingerprinting, proxy rotation or arbitrary Python callbacks are supplied by this collector. It is not a drop-in implementation of every Scrapling API. Scrapling and Playwright licenses and attribution remain intact.

Mac runtime and owned-page checks are distinct from Windows/Ubuntu native acceptance and authenticated production sites. Consult the release acceptance record for VERIFIED and NOT_RUN entries.

Sources: [Scrapling adaptive parsing](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html), [Playwright CLI](https://github.com/microsoft/playwright-cli), [Playwright BrowserServer](https://playwright.dev/docs/api/class-browserserver).
