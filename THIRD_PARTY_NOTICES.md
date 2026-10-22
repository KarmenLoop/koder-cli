# Third-party notices

The legacy Koder CLI source already published in this repository remains under
[GNU GPL v3](licenses/legacy-cli/GPL-3.0.txt), with the limited additional permission in
[LICENSE-EXCEPTION.txt](LICENSE-EXCEPTION.txt). Future Koder-owned distributions that
expressly adopt [Koder-EULA-1.1](EULA.md) are proprietary end-user distributions.
Neither the new agreement nor the kernel terms override any third-party license,
notice, attribution or applicable source obligation. Already distributed versions
retain their original licenses. See [license scope](LICENSE) and [distribution policy](DISTRIBUTION.md).

The Koder kernel is not in this repository and has its own proprietary terms.

Components whose code is included or reimplemented are listed here. See the detailed [upstream/use/revision inventory](OPEN_SOURCE_CREDITS.md), [component record](THIRD_PARTY_COMPONENTS.json), and full notice copies in [licenses/](licenses/). This is not a combined-distribution licence clearance.

## Hermes Agent — MIT License, Copyright (c) 2025 Nous Research

<https://github.com/NousResearch/hermes-agent>, checked against commit
517b5e10febd619ce30bb22580e29b160266eb43.

Ported to JavaScript: the Mixture of Agents turn (`agent/moa_loop.py`: reference
prompt, text-only advisory view, per-user-turn fan-out with stale-guidance note,
degraded notice, privacy redaction) in `src/moa.mjs`; the WeChat iLink adapter
(`gateway/platforms/weixin.py`) in `src/gateway/platforms/weixin.mjs`; the WeCom
openws adapter (`plugins/platforms/wecom`) in `src/gateway/platforms/wecom.mjs`;
DM pairing and allowlist policies in `src/gateway/core.mjs`. The optional Hermes
engine is Hermes itself, installed by its own installer and driven over ACP.

The Feishu device-registration and WeCom scan-to-create flows in
`src/gateway/onboarding.mjs` additionally follow the MIT-licensed adapters at
Hermes commit `22063fc099ec9ad8357d7f8f6e6248a0400680d3`:
`plugins/platforms/feishu/adapter.py` and `plugins/platforms/wecom/adapter.py`.
They run through Koder's own gateway; installing Hermes is not required.

MIT License text:

> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
> the Software, and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
> AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Lark/Feishu Node SDK — MIT License, Lark Technologies Pte. Ltd.

Copyright (c) 2022 Lark Technologies Pte. Ltd. [Full MIT notice](licenses/lark-node-sdk.txt).

<https://github.com/larksuite/node-sdk>. The long-connection frame layout
(`ws-client/proto-buf/pbbp2`) and handshake are reimplemented in
`src/gateway/protobuf.mjs` and `src/gateway/platforms/feishu.mjs`.

## DingTalk Stream SDK for Node.js — MIT License, open-dingtalk

Copyright (c) 2023 钉钉开放平台团队. [Full MIT notice](licenses/dingtalk-stream-sdk.txt).

<https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs>. Stream-mode
connection, SYSTEM ping and callback acknowledgement follow its client.

## QR Code generator — MIT License, Project Nayuki

Copyright (c) Project Nayuki. [Full MIT notice](licenses/nayuki-qrcodegen.txt).

The structure of `src/gateway/qr.mjs` follows qrcodegen by Project Nayuki
(MIT). The tables come from ISO/IEC 18004.

## Model Context Protocol TypeScript SDK and npm dependencies

Application connections use the official [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk), version 1.30.0, under its MIT license. The standalone installer includes its production dependency closure in `kernel/node_modules/`. Each dependency retains its own license; the proprietary kernel terms do not restrict these third-party files.

Exact versions, upstream archive identifiers, license file hashes and source tree hashes are recorded in `THIRD_PARTY_COMPONENTS.json` and the installed `kernel/MANIFEST.json`. Builds verify the reviewed license bytes and reject missing or changed copies. The lock file archive identifiers are provenance references; they are not a claim that this build independently downloaded and verified each upstream archive.

## Koder kernel

`kernel/` (bundled at packaging time from koder-desktop: `harness/`, a `fusion/`
subset, `loop/json-store.mjs`, `public/model-order.mjs`) is Koder's own agent
loop, tools, model adapters and presets. It is proprietary, all rights reserved,
and may only be run as part of Koder CLI; the terms are in `kernel/LICENSE`. The
desktop app's K131419 algorithm sources, native data-lock key management and
login vault are not included. `fusion/data-lock.mjs` and `fusion/vault.mjs`
remain stubs. The generic protected-record store, file lease and record-format
identifier are included in the proprietary kernel for persistent memory.
The public CLI supplies standard Node.js AES-256-GCM record protection, backed
by the existing OS credential store. Runtime keys, credentials and user memory
are never build inputs and are not bundled. These changes do not publish the
proprietary kernel under the CLI's GPL licence.

`kernel/fusion/ecosystem/resources/` holds third-party skills and data that the
kernel reads, each with its original licence file in its own folder; the source,
revision and file hashes are listed in `kernel/fusion/ecosystem/manifest.json`.

## Node.js — MIT License

When Node.js is not already installed, the installer downloads the official
build from <https://nodejs.org/dist/> and verifies it against SHASUMS256.txt.

## Bundled resource projects and release correction

The inspected installer includes resources from alibaba/open-code-review, affaan-m/ECC, ayghri/i-have-adhd, blader/humanizer, obra/superpowers, selected anthropics/skills, nextlevelbuilder/ui-ux-pro-max-skill and JuliusBrussee/caveman. Individual revisions, uses and full licence/NOTICE copies are listed in [Open-source credits](OPEN_SOURCE_CREDITS.md#bundled-skill-rule-and-data-resources).

The 0.3.0 archive contains a truncated open-code-review Apache licence; the complete pinned [licence](licenses/open-code-review/LICENSE) is provided here. Its next build must include the complete file and updated manifest digest. The granting holders have adopted the limited CLI/kernel linking permission; its inclusion in the next package, all third-party obligations and unfinished runtime/device acceptance remain release-review items. This documentation commit does not publish a new installer.

## KARMEN LOOP personal-agent-growth 0.3.2

The eight unmodified files from [personal-agent-growth v0.3.2](https://github.com/KarmenLoop/personal-agent-growth/releases/tag/v0.3.2) are bundled as a separately licensed method resource, not as a background service. Copyright (C) 2026 KARMENLOOP Official Team. They retain AGPL-3.0-only and their full [license](licenses/personal-agent-growth/LICENSE) and [notice](licenses/personal-agent-growth/NOTICE). The resource manifest pins each file and the source revision. Koder's own license does not replace these terms.


REA 6.7.0 is bundled under its original MIT license. Its dependencies retain their own licenses and notices, including OpenPGP.js under LGPL-3.0+. See vendor/rea/README.md, vendor/rea/components.json, vendor/rea/node_modules/rea-agents/THIRD_PARTY_NOTICES.md and vendor/rea/sources/. External analysis engines are not included.

## Vercel agent-browser - Apache License 2.0

Browser automation method, reference documentation and example templates from `vercel-labs/agent-browser`, pinned to `468c0526c884722afd9c10bcc0d5b09ed4c0c5d1`. The executable and browser binaries are not installed by this resource bundle. Original authors retain their rights; read the [complete license](licenses/agent-browser/LICENSE). Koder adds host capability and permission guidance without replacing upstream notices.
