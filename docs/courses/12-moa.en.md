# 12. MoA: several models think together

Allow 30 minutes

**Goal**：Use multiple models only where useful, control costs and verify the final answer.

**Preparation**：Have a working primary model and separately authorized references for live use. Reading this lesson requires no calls.

## Hands-on steps

1. Run a small task with one model and record duration, validation and available usage.

   **Check**：You have a single-model baseline.

2. Register and test a reference model before configuring MoA.

   **Check**：References have valid configuration and matching credential routes.

3. Enable MoA for the same task and inputs and inspect the synthesis.

   **Check**：The primary executor owns tools and approvals; references cannot act independently.

4. Compare correctness, duration and cost before keeping it.

   **Check**：Unknown usage stays unknown. More calls do not automatically mean a better result.

## Troubleshooting and recovery

- **A reference is unavailable**：Disable that reference and inspect its configuration; do not change billing routes silently.
- **References disagree**：Resolve with facts, tests and sources rather than votes.

## Assignment and acceptance

Compare two explanations of the cart bug and separate common evidence from disagreement; adopt only tested conclusions.

**Acceptance**：Explain the information added by the reference; consensus is not a test.

## Developer track

1. Hold model, input and budget constant when comparing orchestration.

2. Inspect koder harness status; JIT profiles and MoA are different layers and neither grants authority.

3. Record cost, steps, failure and fallback. Preserve NO_ENTRY for unproven lessons instead of activating them.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HARNESS-INCREMENTAL.md](../HARNESS-INCREMENTAL.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 12 of 30 · MoA: several models think together ━━
Coach › On hard problems one model can get stuck. MoA (Mixture of Agents) lets a few reference models advise first; the current model reads their advice privately, then acts.
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        register reference models; as many as you like
    koder moa set --refs reference
        create a MoA preset
    koder --moa "refactor payments and add tests"
        run a task with MoA; /moa toggles it in a chat
    koder moa set --fanout every_step
        references are asked once per user turn by default; every_step asks each step, sharper and pricier
Coach › Can MoA reference models edit your files directly?
    1. No. They only advise; the aggregator acts, with your approval as usual
    2. Yes, the more the merrier
    3. Only the README
  Answer: 1。Right. References hold no tools at all; they can't even read a file.
  (whispering) MoA is like a meeting: everyone may speak, one person decides, and that person still has to ask you.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 12 of 30 · MoA: several models think together ━━
Coach › On hard problems one model can get stuck. MoA (Mixture of Agents) lets a few reference models advise first; the current model reads their advice privately, then acts.
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        register reference models; as many as you like
    koder moa set --refs reference
        create a MoA preset
    koder --moa "refactor payments and add tests"
        run a task with MoA; /moa toggles it in a chat
    koder moa set --fanout every_step
        references are asked once per user turn by default; every_step asks each step, sharper and pricier
Coach › Can MoA reference models edit your files directly?
    1. No. They only advise; the aggregator acts, with your approval as usual
    2. Yes, the more the merrier
    3. Only the README
  Answer: 1。Right. References hold no tools at all; they can't even read a file.
  (whispering) MoA is like a meeting: everyone may speak, one person decides, and that person still has to ask you.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 12 of 30 · MoA: several models think together ━━
Coach › On hard problems one model can get stuck. MoA (Mixture of Agents) lets a few reference models advise first; the current model reads their advice privately, then acts.
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        register reference models; as many as you like
    koder moa set --refs reference
        create a MoA preset
    koder --moa "refactor payments and add tests"
        run a task with MoA; /moa toggles it in a chat
    koder moa set --fanout every_step
        references are asked once per user turn by default; every_step asks each step, sharper and pricier
Coach › Can MoA reference models edit your files directly?
    1. No. They only advise; the aggregator acts, with your approval as usual
    2. Yes, the more the merrier
    3. Only the README
  Answer: 1。Right. References hold no tools at all; they can't even read a file.
  (whispering) MoA is like a meeting: everyone may speak, one person decides, and that person still has to ask you.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 12 of 30 · MoA: several models think together ━━
Coach › On hard problems one model can get stuck. MoA (Mixture of Agents) lets a few reference models advise first; the current model reads their advice privately, then acts.
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        register reference models; as many as you like
    koder moa set --refs reference
        create a MoA preset
    koder --moa "refactor payments and add tests"
        run a task with MoA; /moa toggles it in a chat
    koder moa set --fanout every_step
        references are asked once per user turn by default; every_step asks each step, sharper and pricier
Coach › Can MoA reference models edit your files directly?
    1. No. They only advise; the aggregator acts, with your approval as usual
    2. Yes, the more the merrier
    3. Only the README
  Answer: 1。Right. References hold no tools at all; they can't even read a file.
  (whispering) MoA is like a meeting: everyone may speak, one person decides, and that person still has to ask you.
```

</details>
