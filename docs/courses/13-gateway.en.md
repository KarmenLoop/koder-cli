# 13. Chat apps: command Koder from your phone

Allow 40 minutes

**Goal**：Connect an authorized messaging channel and verify pairing, receipt and permissions.

**Preparation**：Choose a platform where you already have account and administration access. Pairing codes shown in lessons are examples, and live setup may send external messages.

## Hands-on steps

1. Run koder gateway status before setup.

   **Check**：Reuse an existing host rather than creating competing receivers.

2. Run koder gateway setup <platform-id> and follow the current account flow.

   **Check**：Configuration or connection success does not prove every message path.

3. Send a harmless message from your own test chat and verify the generated pairing code before approving it.

   **Check**：Unpaired accounts cannot run tasks; approve only an identity you recognize.

4. Run a read-only task and check both ends and session identity, then test cancellation.

   **Check**：Receive, execute, reply and cancel each have evidence; a disconnect is not a delivered reply.

## Troubleshooting and recovery

- **Messages stop after closing the terminal**：Check residency with lesson 20; a background child alone does not prove restart persistence.
- **Group and private context appear mixed**：Inspect linking and sharing scope; remove unnecessary links instead of erasing all history.

## Assignment and acceptance

Trace one message across sender, session, receipt, execution and reply; without an account, produce a clearly labeled test plan.

**Acceptance**：Configuration is not live acceptance, and a plan is not a successful send. Each status needs evidence.

## Developer track

1. Reuse the session, approval, cancellation and receipt authorities.

2. Test duplicates, reconnects, unpaired rejection and expired approvals.

3. Separate live-platform receipts from fixtures, and review access controls before exposing a webhook.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 13 of 30 · Chat apps: command Koder from your phone ━━
Coach › Koder connects to Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp. Each adapter needs the platform account and authorization. Follow setup and inspect its actual state; the WeChat flow depends on the service. Live-account acceptance remains pending for this preview; this tutorial does not connect.
    koder gateway setup feishu
        connect Feishu (wecom, dingtalk work the same way)
    koder gateway setup weixin
        configure WeChat through the available account flow
    koder gateway start --background
        receive messages in the background
    koder gateway status
        which platforms are online
    koder gateway pair K7Q2MX
        approve a new user
  Tip · Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel.
  Tip · koder gateway start --background runs quietly with no window; sleep, sign-out or a restart stops it, so run it again after logging in.
Coach › A stranger messages your bot on WeChat. What happens?
    1. They get a pairing code; only after you run koder gateway pair can they use it
    2. The bot starts editing code for them
    3. The bot cheerfully sends them your keys
  Answer: 1。Right. Direct messages need pairing by default and groups are off; before edits or commands it still asks in the chat and waits for a 'yes'.
  (whispering) Now you can fix bugs from the sofa. Whether that counts as overtime is up to you.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 13 of 30 · Chat apps: command Koder from your phone ━━
Coach › Koder connects to Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp. Each adapter needs the platform account and authorization. Follow setup and inspect its actual state; the WeChat flow depends on the service. Live-account acceptance remains pending for this preview; this tutorial does not connect.
    koder gateway setup feishu
        connect Feishu (wecom, dingtalk work the same way)
    koder gateway setup weixin
        configure WeChat through the available account flow
    koder gateway start --background
        receive messages in the background
    koder gateway status
        which platforms are online
    koder gateway pair K7Q2MX
        approve a new user
  Tip · Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel.
  Tip · koder gateway start --background runs quietly with no window; sleep, sign-out or a restart stops it, so run it again after logging in.
Coach › A stranger messages your bot on WeChat. What happens?
    1. They get a pairing code; only after you run koder gateway pair can they use it
    2. The bot starts editing code for them
    3. The bot cheerfully sends them your keys
  Answer: 1。Right. Direct messages need pairing by default and groups are off; before edits or commands it still asks in the chat and waits for a 'yes'.
  (whispering) Now you can fix bugs from the sofa. Whether that counts as overtime is up to you.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 13 of 30 · Chat apps: command Koder from your phone ━━
Coach › Koder connects to Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp. Each adapter needs the platform account and authorization. Follow setup and inspect its actual state; the WeChat flow depends on the service. Live-account acceptance remains pending for this preview; this tutorial does not connect.
    koder gateway setup feishu
        connect Feishu (wecom, dingtalk work the same way)
    koder gateway setup weixin
        configure WeChat through the available account flow
    koder gateway start --background
        receive messages in the background
    koder gateway status
        which platforms are online
    koder gateway pair K7Q2MX
        approve a new user
  Tip · Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel.
  Tip · After koder gateway start --background the bots survive closing the terminal; when the Mac sleeps, so do they.
Coach › A stranger messages your bot on WeChat. What happens?
    1. They get a pairing code; only after you run koder gateway pair can they use it
    2. The bot starts editing code for them
    3. The bot cheerfully sends them your keys
  Answer: 1。Right. Direct messages need pairing by default and groups are off; before edits or commands it still asks in the chat and waits for a 'yes'.
  (whispering) Now you can fix bugs from the sofa. Whether that counts as overtime is up to you.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 13 of 30 · Chat apps: command Koder from your phone ━━
Coach › Koder connects to Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp. Each adapter needs the platform account and authorization. Follow setup and inspect its actual state; the WeChat flow depends on the service. Live-account acceptance remains pending for this preview; this tutorial does not connect.
    koder gateway setup feishu
        connect Feishu (wecom, dingtalk work the same way)
    koder gateway setup weixin
        configure WeChat through the available account flow
    koder gateway start --background
        receive messages in the background
    koder gateway status
        which platforms are online
    koder gateway pair K7Q2MX
        approve a new user
  Tip · Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel.
  Tip · After koder gateway start --background the bots survive closing the terminal; for start at boot, put the command in a systemd user service or a crontab @reboot line.
Coach › A stranger messages your bot on WeChat. What happens?
    1. They get a pairing code; only after you run koder gateway pair can they use it
    2. The bot starts editing code for them
    3. The bot cheerfully sends them your keys
  Answer: 1。Right. Direct messages need pairing by default and groups are off; before edits or commands it still asks in the chat and waits for a 'yes'.
  (whispering) Now you can fix bugs from the sofa. Whether that counts as overtime is up to you.
```

</details>
