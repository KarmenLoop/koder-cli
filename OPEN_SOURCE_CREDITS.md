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

- [Node.js](https://nodejs.org/) is the runtime. If needed, the installer downloads an official Node distribution and checks its published SHA-256. Node's own licence and third-party notices remain with that distribution.
- The optional Hermes engine is installed separately and called as an ACP peer process. This is separate from the Hermes-derived JavaScript adaptations above.
- ACP and application API compatibility do not imply ownership of, endorsement by, or a licence to rebrand another vendor's product. The public CLI package declares no npm runtime dependencies; Node's built-in implementations belong to the Node distribution.

## Scope and outstanding corrections

Future Koder-owned builds that expressly adopt [Koder-EULA-1.0](EULA.md) are proprietary end-user distributions. The [distribution policy](DISTRIBUTION.md) preserves this attribution inventory, all third-party licenses and rights in previously published versions. No dependency or resource is relicensed by changing Koder's own terms.

The legacy public CLI source remains under [GNU GPL version 3](licenses/legacy-cli/GPL-3.0.txt). On 2026-10-19 the granting copyright holders adopted the limited [kernel linking permission](LICENSE-EXCEPTION.txt) for the CLI portions they have authority to license. The installed kernel is imported into the same Node.js process by `src/agent.mjs` and retains its separate proprietary terms. The additional permission does not change third-party licences, remove applicable source or notice obligations, or grant rights in the kernel. Package metadata points to the permission text instead of inventing an SPDX exception identifier. This adoption does not replace or validate the published 0.3.0 archive.

The verified 0.3.0 archive contains an incomplete `open-code-review/LICENSE` (6,895 bytes, ending mid-sentence). The [complete file from the same pinned upstream revision](licenses/open-code-review/LICENSE), 11,356 bytes with SHA-256 `1945665fdb6968a66ea29438ddee0aee23035365c862e5c4a75b62b303340acf`, is supplied here. The next package must carry that file and its updated resource-manifest hash. This documentation commit does not alter the old archive.

Experimental user-supplied memory/personalization skills are outside the inspected 0.3.0 release. Their public redistribution terms are not established by an attachment or a `user-provided` label; their text is not published by this update. Listing a resource also does not mean its proposed runtime integration has passed acceptance.
