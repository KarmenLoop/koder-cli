# Session input, Skills and startup updates

Available in **0.4.3**. Existing models, tools, histories and permissions remain; platform and real-account limitations are listed in the release notes.

## Keep typing while Koder works

The input line remains editable while the built-in agent streams a reply or works. Open `/setup` (or `koder setup`) and choose **Mid-run input**:

- **Steer (default):** Enter adds a supplement to the current turn. Koder keeps the existing model request and controller running, then includes the supplement in the next model request after the current response/tool batch. It does not cancel and replay completed work. An in-flight HTTP request cannot be changed retroactively; acknowledgement means received, not already processed by the model.
- **Queue:** Enter saves a subsequent turn in FIFO order. The terminal prints **Queued N**, with up to three previews, each limited to 64 characters. The active turn continues. After it finishes, the next queued turn runs through the normal dispatcher.

The saved field is `sessionInputMode`, with `steer` as the effective default when absent or invalid. Slash commands are queued for the existing local dispatcher. An engine or step without a steering port, a closed run or a full steering inbox falls back to a visible next-turn queue. No second agent session is started. The inbox holds at most 32 supplements, 16,384 characters per supplement and 65,536 total characters. The existing model/tool round budget remains authoritative; a supplement can require another billable model response.

Esc and Ctrl+C cancel the active turn. Exact case-insensitive controls also cancel: `/cancel`, `/stop`, `/abort`, `stop`, `cancel`, `abort`, `never mind`, `scratch that`, `停`, `停下`, `停止`, `取消`, `中断`, `打断`, `别做了`, `先停下`. Leading controls followed by punctuation or whitespace cancel and append their remaining text to the FIFO queue: `stop, say hello instead` queues `say hello instead`. Existing queued tasks retain their order. A keyword inside ordinary text, such as `explain how to stop a server`, does not cancel.

An approval temporarily owns the input prompt. It cannot consume a task queued before the question appeared. Busy drafts are retained separately, and only a fresh answer can approve. Pretyped tasks are never permission. Cancellation does not reverse an already completed external operation; the existing receipt/reconciliation rules still apply.

## Turn Skills on and off

In **Setup → Skills**, select a built-in method, ecosystem Skill, bundled/portable Skill or local resource collection, then choose on or off. A resource collection's on switch explicitly permits selected excerpts to reach your configured model. Existing permission-controlled personalization features remain under Memory and soul; this screen grants no new account, learning, tool or OS permissions.

**Disable all skills** asks for confirmation and disables all currently discovered switchable methods and collections. It retains files, attribution and unknown saved disabled IDs. Newly imported Skills are managed separately; this is not a permanent global ban on future imports. If encrypted collections cannot be opened, the screen reports that limitation and does not claim everything was disabled.

Changes use the existing `growthSkillEnabled`, `disabledSkills`, `disabledPortableSkills` and collection `modelAccess` records. In `/setup`, they take effect on the next chat turn; other running sessions pick them up when reopened. No files are deleted and no cloud synchronization is added. `koder growth on|off` and the existing Skill/resource commands remain available.

## Startup update scan

Each consenting, managed interactive `koder` / `koder chat` launch checks the existing official CLI release manifest once, even if its last cached check was less than six hours ago. It displays checking, current/available, or incomplete status. Later periodic checks retain their cache behavior. This checks the managed CLI release channel, not arbitrary dependency or third-party application updates.

`KODER_AUTO_UPDATE=0` or `koder update auto off` skips both automatic scanning and installation. CI/non-TTY, unaccepted licenses, unmanaged installations and explicit mirror overrides keep their existing exclusions. `/update --check` and explicit updates remain available. Scanning is nonblocking and bounded by the existing eight-second check timeout. A failed check does not claim that the installed version is current.

Installation still waits for the existing idle gate: no active task, queued input, draft or pending input bytes. EULA verification, installer checksums, activation and restart controls are unchanged.

## Ten manual checks

Use an isolated managed installation and a dedicated test workspace. A real model may incur API charges; local regression uses an owned scripted provider instead.

1. Enable automatic updates and launch chat twice within six hours. Each launch shows one check start and a completion/available/incomplete result.
2. Launch with `KODER_AUTO_UPDATE=0`. Expect no automatic check or install. Inspect `koder update auto status` and confirm the process override is reported.
3. In `/setup → Skills`, turn off one portable Skill. Reopen the menu, then run `/skills show <its-id>`. It remains off and reports `SKILL_DISABLED`. Turn it back on to verify recovery.
4. Choose Disable all. First cancel and confirm nothing changed; repeat and confirm. All discovered switchable entries show off. Existing files remain.
5. Choose Mid-run input → Queue. Exit and reopen Setup; Queue is still selected. Repeat for Steer.
6. In Queue mode, start a slow test task. Submit two short messages while it runs. Observe Queued 1/2 and previews; verify the next two user turns preserve FIFO order.
7. In Steer mode, start a slow test task and add a supplement. Verify no cancellation and that a later model request/transcript includes the supplement in the same turn. No-key harness tests assert controller identity as well as content.
8. While busy, enter `停下` or `stop`. Verify cancellation. Then test `stop, say NEXT`: it cancels and queues `say NEXT`.
9. Repeat Esc and Ctrl+C while busy in each mode. Verify the CLI stays usable. In a pending approval, cancellation must not execute the proposed action.
10. Queue a task before a write approval appears, and leave another draft unsent. The approval waits for a fresh answer; queued text does not approve it. Decline, then check retained queue/draft and unchanged target file.

Local terminal and scripted-provider checks do not certify native Windows Console/ConPTY/IME, real model quality, real accounts or production installation. See the task acceptance receipt for actual commands and remaining baseline failures.
