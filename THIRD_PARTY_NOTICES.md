# Third-party notices

The Koder CLI source in this repository is licensed under the MIT License
(see LICENSE). The Koder kernel is not in this repository and is not covered
by that licence. It is proprietary and is not published. See the kernel section
below.

Components whose code is included or reimplemented are listed here.

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

## Lark/Feishu Node SDK — MIT License, Bytedance

<https://github.com/larksuite/node-sdk>. The long-connection frame layout
(`ws-client/proto-buf/pbbp2`) and handshake are reimplemented in
`src/gateway/protobuf.mjs` and `src/gateway/platforms/feishu.mjs`.

## DingTalk Stream SDK for Node.js — open-dingtalk

<https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs>. Stream-mode
connection, SYSTEM ping and callback acknowledgement follow its client.

## QR Code generator — Project Nayuki

The structure of `src/gateway/qr.mjs` follows qrcodegen by Project Nayuki
(MIT). The tables come from ISO/IEC 18004.

## Koder kernel

`kernel/` (bundled at packaging time from koder-desktop: `harness/`, a `fusion/`
subset, `loop/json-store.mjs`, `public/model-order.mjs`) is Koder's own agent
loop, tools, model adapters and presets. It is proprietary, all rights reserved,
and may only be run as part of Koder CLI; the terms are in `kernel/LICENSE`. The
desktop app's data encryption and key storage modules are not included: the
bundle carries stubs in their place.

`kernel/fusion/ecosystem/resources/` holds third-party skills and data that the
kernel reads, each with its original licence file in its own folder; the source,
revision and file hashes are listed in `kernel/fusion/ecosystem/manifest.json`.

## Node.js — MIT License

When Node.js is not already installed, the installer downloads the official
build from <https://nodejs.org/dist/> and verifies it against SHASUMS256.txt.
