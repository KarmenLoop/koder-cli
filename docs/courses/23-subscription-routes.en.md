# 23. Keep the right door open: Alibaba and Volcano plans

Allow 25 minutes

**Goal**：Distinguish plans from metered APIs and avoid mismatched regions, endpoints and billing products.

**Preparation**：Use key-free console product information. Do not run live exercises against disabled routes.

## Hands-on steps

1. Run koder model presets and inspect disabled entries.

   **Check**：Use availability in your installed build, not the advertised count.

2. Record whether you purchased a Token Plan, Coding Plan or metered API and its region.

   **Check**：Similar names do not imply interchangeable keys.

3. Inspect the relevant models entry and compare model IDs and base URL with your console.

   **Check**：Discovery supplies candidates, not account entitlement.

4. Test only when the route is available and matches the product; otherwise retain settings and choose an authorized alternative.

   **Check**：No silent billing change or bypass of disabled routes.

## Troubleshooting and recovery

- **Balance remains but 401 occurs**：Balance and authorization differ; check the key’s product and region.
- **The model list is empty**：Distinguish discovery failure, access denial and no available models instead of guessing IDs.

## Assignment and acceptance

Build a key-free product, region, endpoint, model and availability table.

**Acceptance**：Mark uncertain values pending and disabled entries unavailable rather than tested.

## Developer track

1. Route by preset and product identity, not a fuzzy model-name match that changes billing.

2. Track discovery timestamps and errors while retaining settings on failure.

3. Reconcile disabled entries with runtime metadata instead of inflating available counts.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 23 of 30 · Keep the right door open: Alibaba and Volcano plans ━━
Coach › Read the sign on the door first: MiMo Token Plan, Kimi, DeepSeek, Alibaba Token Plan, and Volcano integrations have known bugs and are temporarily unavailable. Their entries are gray. Settings stay saved, but no requests or backup-engine switches are made.
Coach › A subscription key is not an all-access pass. Alibaba Token Plan, Coding Plan, and metered APIs are separate routes. Volcano Coding Plan has its own endpoint too. Koder lists them separately and never quietly changes the billing route.
    koder model presets
    koder model models aliyun-token-plan
    koder model models aliyun-coding-plan
    koder model models volcano-coding-plan
    koder model models kimi-code
  Tip · In setup, choose the exact plan, then a model, then that plan’s key. Your console decides model access, region, and seat availability. A listing is not free credit.
  (whispering) The right address works better than asking a 401 to open up.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 23 of 30 · Keep the right door open: Alibaba and Volcano plans ━━
Coach › Read the sign on the door first: MiMo Token Plan, Kimi, DeepSeek, Alibaba Token Plan, and Volcano integrations have known bugs and are temporarily unavailable. Their entries are gray. Settings stay saved, but no requests or backup-engine switches are made.
Coach › A subscription key is not an all-access pass. Alibaba Token Plan, Coding Plan, and metered APIs are separate routes. Volcano Coding Plan has its own endpoint too. Koder lists them separately and never quietly changes the billing route.
    koder model presets
    koder model models aliyun-token-plan
    koder model models aliyun-coding-plan
    koder model models volcano-coding-plan
    koder model models kimi-code
  Tip · In setup, choose the exact plan, then a model, then that plan’s key. Your console decides model access, region, and seat availability. A listing is not free credit.
  (whispering) The right address works better than asking a 401 to open up.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 23 of 30 · Keep the right door open: Alibaba and Volcano plans ━━
Coach › Read the sign on the door first: MiMo Token Plan, Kimi, DeepSeek, Alibaba Token Plan, and Volcano integrations have known bugs and are temporarily unavailable. Their entries are gray. Settings stay saved, but no requests or backup-engine switches are made.
Coach › A subscription key is not an all-access pass. Alibaba Token Plan, Coding Plan, and metered APIs are separate routes. Volcano Coding Plan has its own endpoint too. Koder lists them separately and never quietly changes the billing route.
    koder model presets
    koder model models aliyun-token-plan
    koder model models aliyun-coding-plan
    koder model models volcano-coding-plan
    koder model models kimi-code
  Tip · In setup, choose the exact plan, then a model, then that plan’s key. Your console decides model access, region, and seat availability. A listing is not free credit.
  (whispering) The right address works better than asking a 401 to open up.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 23 of 30 · Keep the right door open: Alibaba and Volcano plans ━━
Coach › Read the sign on the door first: MiMo Token Plan, Kimi, DeepSeek, Alibaba Token Plan, and Volcano integrations have known bugs and are temporarily unavailable. Their entries are gray. Settings stay saved, but no requests or backup-engine switches are made.
Coach › A subscription key is not an all-access pass. Alibaba Token Plan, Coding Plan, and metered APIs are separate routes. Volcano Coding Plan has its own endpoint too. Koder lists them separately and never quietly changes the billing route.
    koder model presets
    koder model models aliyun-token-plan
    koder model models aliyun-coding-plan
    koder model models volcano-coding-plan
    koder model models kimi-code
  Tip · In setup, choose the exact plan, then a model, then that plan’s key. Your console decides model access, region, and seat availability. A listing is not free credit.
  (whispering) The right address works better than asking a 401 to open up.
```

</details>
