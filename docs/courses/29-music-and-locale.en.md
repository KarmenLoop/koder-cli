# 29. A birthday song, and a language you choose

Allow 20 minutes

**Goal**：Choose language and music explicitly without silently sharing location or opening audible pages.

**Preparation**：Check whether sound is appropriate. Prefer explicit language settings over IP-based guesses.

## Hands-on steps

1. Set koder lang zh or en; use --lang for one invocation.

   **Check**：Language settings apply without rewriting code or preserved quotations.

2. Inspect music settings with the existing lesson commands and leave them off initially.

   **Check**：Status inspection opens no browser and plays no audio.

3. Explicitly approve the chosen external music page when desired.

   **Check**：The site may require login or a play gesture; opening it is not proof of playback.

4. Stop playback, close the owned test page and disable unwanted music preferences.

   **Check**：Leave other apps’ playback untouched; music and language remain independent.

## Troubleshooting and recovery

- **A page opens silently**：Check its play control, volume and site rules instead of opening repeated tabs.
- **Language was inferred incorrectly**：Ask for or use an explicit selection, without adding an IP lookup.

## Assignment and acceptance

Record language, external-link consent, page opening and actual playback separately.

**Acceptance**：Opening is not playback, and playback does not grant download rights; unselected external actions do not occur.

## Developer track

1. Use existing URL validation and browser grants; do not inject passwords or bypass site controls.

2. Keep localization natural and locale choices independent; inferred regions are not user facts.

3. Separate launch failure, unverified playback and refusal.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [APP-USE-AND-LEARN.en.md](../APP-USE-AND-LEARN.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 29 of 30 · A birthday song, and a language you choose ━━
Coach › Music and IP country lookup are off by default and confirmed separately. Enabled birthday music opens at most one automatic browser tab when you use chat that day. The local melody needs no sign-in. If autoplay is blocked, press Play. Closing the page does not affect work.
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  Tip · Your chosen language comes first, then explicitly enabled local language counts. IP is only a weak hint. Country lookup exposes your public address to ipapi.co; an external music service receives its own visit data. Enter skips each choice.
  (whispering) A second slice of cake is fine. Permissions can stay small.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 29 of 30 · A birthday song, and a language you choose ━━
Coach › Music and IP country lookup are off by default and confirmed separately. Enabled birthday music opens at most one automatic browser tab when you use chat that day. The local melody needs no sign-in. If autoplay is blocked, press Play. Closing the page does not affect work.
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  Tip · Your chosen language comes first, then explicitly enabled local language counts. IP is only a weak hint. Country lookup exposes your public address to ipapi.co; an external music service receives its own visit data. Enter skips each choice.
  (whispering) A second slice of cake is fine. Permissions can stay small.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 29 of 30 · A birthday song, and a language you choose ━━
Coach › Music and IP country lookup are off by default and confirmed separately. Enabled birthday music opens at most one automatic browser tab when you use chat that day. The local melody needs no sign-in. If autoplay is blocked, press Play. Closing the page does not affect work.
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  Tip · Your chosen language comes first, then explicitly enabled local language counts. IP is only a weak hint. Country lookup exposes your public address to ipapi.co; an external music service receives its own visit data. Enter skips each choice.
  (whispering) A second slice of cake is fine. Permissions can stay small.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 29 of 30 · A birthday song, and a language you choose ━━
Coach › Music and IP country lookup are off by default and confirmed separately. Enabled birthday music opens at most one automatic browser tab when you use chat that day. The local melody needs no sign-in. If autoplay is blocked, press Play. Closing the page does not affect work.
    koder celebrate music on
    koder celebrate music off
    koder celebrate locale --language en
    koder celebrate locale --language auto
    koder celebrate locale --ip
  Tip · Your chosen language comes first, then explicitly enabled local language counts. IP is only a weak hint. Country lookup exposes your public address to ipapi.co; an external music service receives its own visit data. Enter skips each choice.
  (whispering) A second slice of cake is fine. Permissions can stay small.
```

</details>
