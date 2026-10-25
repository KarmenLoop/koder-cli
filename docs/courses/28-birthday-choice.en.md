# 28. Remember a birthday, not a dossier

Allow 20 minutes

**Goal**：Store minimal birthday information only by explicit choice, with review and removal.

**Preparation**：Practice with a fictional month/day. No birth year, age or ID is needed; mentioning someone else is not consent to record yours.

## Hands-on steps

1. Read koder help celebrate for birthday commands and date format.

   **Check**：Use current help rather than guessing syntax.

2. Explicitly say “Remember my birthday is March 14” and inspect the response.

   **Check**：Only the allowed month/day is saved, not an inferred age or identity.

3. Inspect status, change the practice date using the lesson commands and inspect again.

   **Check**：Stored value matches the response without enabling learning or sync.

4. Remove the synthetic birthday after practice; choose automatic greetings independently.

   **Check**：Removal and disabling animation differ; no fake profile data remains.

## Troubleshooting and recovery

- **Another person’s birthday was recorded**：Correct it explicitly and verify the stored value.
- **The date remains after disabling effects**：Animation preferences and the stored date are independent.

## Assignment and acceptance

Set, inspect and remove a fictional date and record the final state.

**Acceptance**：The practice date is removed and no year or extra personal data was added.

## Developer track

1. Distinguish explicit self-memory requests from quotations and third-party information.

2. Test invalid dates, leap days, repeated settings and removal, with notification deduplication.

3. Verify deletion in storage, not only in displayed text.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 28 of 30 · Remember a birthday, not a dossier ━━
Coach › You can explicitly ask Koder to remember your birthday, or use a month and day below. It does not ask for a birth year or age. A casual mention offers a choice; someone else’s birthday never becomes yours. The tutorial does not save the example date.
    koder celebrate birthday --date 03-14
    koder celebrate birthday forget
  Tip · Birthday settings are not automatically included in model requests or sync. Information you type in an ordinary message still follows that model conversation’s normal data rules.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 28 of 30 · Remember a birthday, not a dossier ━━
Coach › You can explicitly ask Koder to remember your birthday, or use a month and day below. It does not ask for a birth year or age. A casual mention offers a choice; someone else’s birthday never becomes yours. The tutorial does not save the example date.
    koder celebrate birthday --date 03-14
    koder celebrate birthday forget
  Tip · Birthday settings are not automatically included in model requests or sync. Information you type in an ordinary message still follows that model conversation’s normal data rules.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 28 of 30 · Remember a birthday, not a dossier ━━
Coach › You can explicitly ask Koder to remember your birthday, or use a month and day below. It does not ask for a birth year or age. A casual mention offers a choice; someone else’s birthday never becomes yours. The tutorial does not save the example date.
    koder celebrate birthday --date 03-14
    koder celebrate birthday forget
  Tip · Birthday settings are not automatically included in model requests or sync. Information you type in an ordinary message still follows that model conversation’s normal data rules.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 28 of 30 · Remember a birthday, not a dossier ━━
Coach › You can explicitly ask Koder to remember your birthday, or use a month and day below. It does not ask for a birth year or age. A casual mention offers a choice; someone else’s birthday never becomes yours. The tutorial does not save the example date.
    koder celebrate birthday --date 03-14
    koder celebrate birthday forget
  Tip · Birthday settings are not automatically included in model requests or sync. Information you type in an ordinary message still follows that model conversation’s normal data rules.
```

</details>
