# Open-source credits and provenance

Koder contains third-party adaptations and resources. It must not be described as entirely written from scratch. This inventory identifies observed reuse; it does not certify that every file is original or that every licence obligation in the combined distribution is resolved.

## Code and protocol adaptations

| Upstream | Observed Koder use | Licence and source record |
| --- | --- | --- |
| [Nous Research / Hermes Agent](https://github.com/NousResearch/hermes-agent) | JavaScript adaptations of MoA advisory/fan-out behaviour, WeChat iLink and WeCom openws adapters, DM pairing/allowlist policies; Feishu registration and WeCom onboarding | MIT; recorded references `517b5e10febd619ce30bb22580e29b160266eb43` and `22063fc099ec9ad8357d7f8f6e6248a0400680d3`; [notice](licenses/hermes-agent.txt) |
| [Lark/Feishu Node SDK](https://github.com/larksuite/node-sdk) | Long-connection frame layout and handshake reimplemented in `src/gateway/protobuf.mjs` and `src/gateway/platforms/feishu.mjs`; no full SDK package vendored | MIT, Copyright (c) 2022 Lark Technologies Pte. Ltd.; [notice](licenses/lark-node-sdk.txt) |
| [DingTalk Stream SDK for Node.js](https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs) | Stream connection, SYSTEM ping and callback acknowledgement behaviour | MIT, Copyright (c) 2023 钉钉开放平台团队; [notice](licenses/dingtalk-stream-sdk.txt) |
| [Project Nayuki / QR Code generator](https://github.com/nayuki/QR-Code-generator) | QR encoder structure reimplemented in `src/gateway/qr.mjs` | MIT, Copyright (c) Project Nayuki; [notice](licenses/nayuki-qrcodegen.txt) |

The original Lark, DingTalk and Nayuki adoption commits were not recorded. `THIRD_PARTY_COMPONENTS.json` records immutable upstream revisions checked for these notice copies on 2026-10-19; those verification snapshots are not invented original adoption commits. ISO/IEC 18004 standardizes the QR format; that is distinct from crediting an upstream implementation.

## Bundled skill, rule and data resources

The inspected 0.3.0 package includes selected resources from these eight projects under `kernel/fusion/ecosystem/resources/`. These are skill instructions, prompts, rules or data; the table does not claim that each upstream execution engine is embedded.

| Upstream | Recorded revision | Licence | Selected use |
| --- | --- | --- | --- |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review/tree/8eb83340a487b1150af00701b94f01af97e4b4d6) | `8eb83340a487b1150af00701b94f01af97e4b4d6` | Apache-2.0 | Code-review skills, language rules and review prompts |
| [affaan-m/ECC](https://github.com/affaan-m/ECC/tree/76aaa77df6adc5b889e689007bf99b9a4f74af34) | `76aaa77df6adc5b889e689007bf99b9a4f74af34` | MIT | Learning, evaluation, security review, compaction, TDD and verification skills |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd/tree/1ecea1993b7fce257ffbd686c070948b5e07eda6) | `1ecea1993b7fce257ffbd686c070948b5e07eda6` | MIT | Selected task-focus skill text |
| [blader/humanizer](https://github.com/blader/humanizer/tree/8c307f367c91bd974002f10f2be2965d642c13df) | `8c307f367c91bd974002f10f2be2965d642c13df` | MIT | Writing-editing skill text |
| [obra/superpowers](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3) | `bb92a77741419a4ab5f06e711a283343f1ada0c3` | MIT | Planning, debugging, testing and review workflow resources |
| [anthropics/skills](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44) | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | Apache-2.0 | Selected art, frontend, internal-comms, MCP-builder, skill-creator, theme and webapp-testing resources |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/56ea9cf174ed86786187daa9de0e6247cb0747e4) | `56ea9cf174ed86786187daa9de0e6247cb0747e4` | MIT | UI/UX guidance and selected reference data |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/tree/d262ab3882952a59312ff3537cd86d894523c5ab) | `d262ab3882952a59312ff3537cd86d894523c5ab` | Apache-2.0 plus retained MIT notice | Selected concise-response resources; retains its MIT notice and Apache changes |

Full notice copies are in [licenses/](licenses/), including the per-skill Anthropic licences and Caveman's `NOTICE`/MIT attribution. The [component inventory](THIRD_PARTY_COMPONENTS.json) records paths and SHA-256 values. Third-party resources retain their own terms; the kernel declaration does not replace them.

## Runtime and optional external software

The applications/MCP candidate bundles the official `@modelcontextprotocol/sdk` 1.30.0 (MIT, [source](https://github.com/modelcontextprotocol/typescript-sdk)) and 100 transitive production/required peer dependencies. Their individual origins, versions and complete license hashes appear in the `npmComponents` section of `THIRD_PARTY_COMPONENTS.json`. Runtime files retain the original package layout and licenses under `kernel/node_modules/`; none is relicensed as KARMEN proprietary code. Gamma integration uses the provider's API/MCP contracts; it does not include Gamma's application source.

- [Node.js](https://nodejs.org/) is the runtime. If needed, the installer downloads an official Node distribution and checks its published SHA-256. Node's own licence and third-party notices remain with that distribution.
- The optional Hermes engine is installed separately and called as an ACP peer process. This is separate from the Hermes-derived JavaScript adaptations above.
- ACP and application API compatibility do not imply ownership of, endorsement by, or a licence to rebrand another vendor's product. The public CLI package declares no npm runtime dependencies; Node's built-in implementations belong to the Node distribution.

## Scope and outstanding corrections

The CLI remains under [GNU GPL version 3](LICENSE). On 2026-10-19 the granting copyright holders adopted the limited [kernel linking permission](LICENSE-EXCEPTION.txt) for the CLI portions they have authority to license. The installed kernel is imported into the same Node.js process by `src/agent.mjs` and retains its separate proprietary terms. The additional permission does not change third-party licences, remove applicable source or notice obligations, or grant rights in the kernel. Package metadata points to the permission text instead of inventing an SPDX exception identifier. This adoption does not replace or validate the published 0.3.0 archive.

The verified 0.3.0 archive contains an incomplete `open-code-review/LICENSE` (6,895 bytes, ending mid-sentence). The [complete file from the same pinned upstream revision](licenses/open-code-review/LICENSE), 11,356 bytes with SHA-256 `1945665fdb6968a66ea29438ddee0aee23035365c862e5c4a75b62b303340acf`, is supplied here. The next package must carry that file and its updated resource-manifest hash. This documentation commit does not alter the old archive.

Experimental user-supplied memory/personalization skills are outside the inspected 0.3.0 release. Their public redistribution terms are not established by an attachment or a `user-provided` label; their text is not published by this update. Listing a resource also does not mean its proposed runtime integration has passed acceptance.

## Development workflow method references (preview.5)

The original Koder development-workflow instructions and GitHub research adapter were written for this release. Method references: [GitHub Spec Kit](https://github.com/github/spec-kit/tree/e5714c64902cda491bd52fc4674f3f1cf3892c10) and [obra/superpowers](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3), both reporting MIT licenses when inspected on 2026-10-20. No Spec Kit or newly retrieved Superpowers code/templates were copied into this change. Existing bundled Superpowers resources remain governed by their separately recorded license and pinned revision. This is method attribution, not a claim of upstream endorsement or complete license clearance for future projects.

## KARMEN LOOP personal-agent-growth 0.3.2

The eight unmodified files from [personal-agent-growth v0.3.2](https://github.com/KarmenLoop/personal-agent-growth/releases/tag/v0.3.2) are bundled as a separately licensed method resource, not as a background service. Copyright (C) 2026 KARMENLOOP Official Team. They retain AGPL-3.0-only and their full [license](licenses/personal-agent-growth/LICENSE) and [notice](licenses/personal-agent-growth/NOTICE). The resource manifest pins each file and the source revision. Koder's own license does not replace these terms.


REA 6.7.0 is bundled under its original MIT license. Its dependencies retain their own licenses and notices, including OpenPGP.js under LGPL-3.0+. See vendor/rea/README.md, vendor/rea/components.json, vendor/rea/node_modules/rea-agents/THIRD_PARTY_NOTICES.md and vendor/rea/sources/. External analysis engines are not included.

## Browser automation workflow

The agent-browser core method, command references and three reference templates are bundled from [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser/tree/468c0526c884722afd9c10bcc0d5b09ed4c0c5d1) at `468c0526c884722afd9c10bcc0d5b09ed4c0c5d1` under Apache-2.0. The original [license](licenses/agent-browser/LICENSE) and the kernel resource manifest retain provenance and SHA-256 values. These are on-demand method resources; the agent-browser executable and Chromium are not installed by this change. The Koder adapter maps the workflow to actually available computer tools and keeps tool, account and execution authorization separate. Templates are reference text and are never automatically executed.

The existing Anthropic frontend-design files were verified byte-for-byte against `anthropics/skills` at `dbd4588f9e1033efb41dad4bef2f7947c8993d44`. They were already current and retain their original Apache-2.0 license. Unrelated skill revisions were not repinned.

## Media, browser and application Skills — candidate.2

These are pinned third-party sources and Koder adaptations, not wholly Koder-authored implementations. Original copyright notices, licenses and any upstream NOTICE/CREDITS files remain in each package. `UPSTREAM-SOURCE.json` records the upstream file hashes and excluded demo media; `BUNDLE-MANIFEST.json` records the adapted distributed bytes. Koder entrypoints and adapters do not replace third-party terms.

| Component | Source revision | License / distributed scope |
| --- | --- | --- |
| [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | `43bd349a136651865ecfa6ea1cf012f6e957d304` | Apache-2.0; bundled-source |
| [xilo-opus-video](https://github.com/Kianzzz/xilo-opus-video) | `f2cd828e2692e7186186408ee01a936707c2c38d` | MIT; bundled-source |
| [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | `3961ddb3d24d8876e0e2754f7790d66908acee51` | MIT code; demo media excluded; bundled-source |
| [mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) | `49052d80bfaf9fa8412cc9710530e5e95a3b8d8c` | MIT; bundled-source |
| [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion) | `8a0d7d72ca65fcce6f8ba82c4a6c8dfe35b8422c` | MIT; bundled-source |
| [dashi-animationstyle](https://github.com/chuspeeism/dashi-animationstyle) | `aa620f3b859aa5d191b783b2eb0fb59263731c76` | MIT (sample voice excluded); bundled-source |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | `b1a5903c5b633b8c9f843ad7b629c2a78437040c` | Apache-2.0; bundled-source |
| [cli-anything](https://github.com/HKUDS/CLI-Anything) | `34f519533bc175d2fe287ab8316b0dd99bb9cc43` | Apache-2.0; bundled-source |
| [jianying-editor](https://github.com/guoluhua38-max/jianying-editor-skill) | `a081fbd4aaba9f53f356045aeb0ed570b55a4b2f` | MIT; vendored pyJianYingDraft Apache-2.0; bundled-source |
| [wtt-code-animation-studio](https://github.com/WaterDJiang/Wattter_openSkills) | `cb79a2177e03dc7fd9520d881c8c883bbaff36af` | CC BY-NC-SA 4.0; reference-only |
| [x-article-auto-publisher](https://github.com/tech-shrimp/x-article-auto-publisher-skill) | `caa6d1ecd34e00a952028b6b6a31b5c0bb93023d` | No license found; reference-only |

The Jianying source is an attributed mirror of luoluoluo22, not a claimed latest upstream version. Its vendored pyJianYingDraft retains Apache-2.0; the license text was restored from GuanYixuan/pyJianYingDraft. Koder changed media probing, preserved failed draft loads, disabled implicit UI lock release and made replacement opt-in. These changes are identified in KODER-ADAPTATION.md.

WTT Code Animation Studio (CC BY-NC-SA) and the X article publisher (no repository license found) are reference-only entries; their code is not included. The independently written `koder-media-workflow` provides local timeline/SRT, record conversion, article preview and rendering helpers. It is not an exact redistribution or complete implementation of either upstream.

Demo videos, author voice tracks, sample music and binary reference assets are not bundled. Fonts/media may have separate terms; use the user's authorized assets or install permitted assets deliberately. Some renderers require Remotion, Blender, native apps, paid services or platform-specific packages under their own terms. Source availability does not establish runtime or account compatibility.
