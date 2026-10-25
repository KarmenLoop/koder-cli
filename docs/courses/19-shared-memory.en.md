# 19. Memory storage, groups and devices

Allow 35 minutes

**Goal**：Understand workspace, session and shared-memory boundaries for concurrent work and recovery.

**Preparation**：Use two test directories and synthetic markers, never actual secrets.

## Hands-on steps

1. Run koder memory status in A and note its scope and storage.

   **Check**：Understand ownership instead of assuming all data lives in the project folder.

2. Give A a synthetic marker, then ask B for it without supplying it.

   **Check**：B should not automatically retrieve A’s task facts.

3. Return to A, then use a named session for separate investigation.

   **Check**：A can resume; the named session has its own identity, with shared notes explicitly scoped.

4. Inspect a specific record and scope before using forget commands.

   **Check**：Logout, disabling learning and deletion differ; sync needs a compatible Core and readback evidence.

## Troubleshooting and recovery

- **Windows share unrelated context**：Record paths, version, sessions and shared-note settings; reproduce without erasing evidence.
- **Login succeeds but sync does not**：Check account, device and sync state; verify readback on both devices.

## Assignment and acceptance

Perform an A→B→A isolation check and record visible content and expectations.

**Acceptance**：B lacks A’s private marker and A resumes; untested remote sync stays NOT_RUN.

## Developer track

1. Keep identity, storage, retrieval and caches aligned to the same workspace/session scope.

2. Test concurrent tasks and stale-lock ownership rather than blindly deleting locks.

3. Headroom changes the model view while retaining retrievable evidence; compaction is not authorization to erase data.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)
- [HEADROOM.en.md](../HEADROOM.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 19 of 30 · Memory storage, groups and devices ━━
Coach › Memory does not put every conversation into one model request. Tasks use relevant memory and compacted history; records persist within the configured scope. New Windows profiles prefer writable D, falling back to a writable per-user location on C. Existing locations and explicit configuration are retained. Installation, credentials and memory may live in different places.
    koder memory status
    koder memory personalization status
    koder memory show
    koder memory search "project decisions"
    koder account status
    koder memory sync
Coach › Cross-device memory service: your deployed, compatible Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
    koder account login --server "https://your-core.example"
        Replace the example with your actual compatible Core service
    koder account logout
        Sign out here without deleting server memory
    koder memory forget
        Forget the current shared space; offline devices apply it on sync
  Tip · All linked-group members can use linked private-chat memory; group replies are visible to them. Link only conversations intended for that sharing. Login does not prove synchronization: inspect state and read back actual records. This preview still lacks physical multi-device and live WeChat, Feishu and WeCom account acceptance.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 19 of 30 · Memory storage, groups and devices ━━
Coach › Memory does not put every conversation into one model request. Tasks use relevant memory and compacted history; records persist within the configured scope. New Windows profiles prefer writable D, falling back to a writable per-user location on C. Existing locations and explicit configuration are retained. Installation, credentials and memory may live in different places.
    koder memory status
    koder memory personalization status
    koder memory show
    koder memory search "project decisions"
    koder account status
    koder memory sync
Coach › Cross-device memory service: your deployed, compatible Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
    koder account login --server "https://your-core.example"
        Replace the example with your actual compatible Core service
    koder account logout
        Sign out here without deleting server memory
    koder memory forget
        Forget the current shared space; offline devices apply it on sync
  Tip · All linked-group members can use linked private-chat memory; group replies are visible to them. Link only conversations intended for that sharing. Login does not prove synchronization: inspect state and read back actual records. This preview still lacks physical multi-device and live WeChat, Feishu and WeCom account acceptance.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 19 of 30 · Memory storage, groups and devices ━━
Coach › Memory does not put every conversation into one model request. Tasks use relevant memory and compacted history; records persist within the configured scope. New Windows profiles prefer writable D, falling back to a writable per-user location on C. Existing locations and explicit configuration are retained. Installation, credentials and memory may live in different places.
    koder memory status
    koder memory personalization status
    koder memory show
    koder memory search "project decisions"
    koder account status
    koder memory sync
Coach › Cross-device memory service: your deployed, compatible Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
    koder account login --server "https://your-core.example"
        Replace the example with your actual compatible Core service
    koder account logout
        Sign out here without deleting server memory
    koder memory forget
        Forget the current shared space; offline devices apply it on sync
  Tip · All linked-group members can use linked private-chat memory; group replies are visible to them. Link only conversations intended for that sharing. Login does not prove synchronization: inspect state and read back actual records. This preview still lacks physical multi-device and live WeChat, Feishu and WeCom account acceptance.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 19 of 30 · Memory storage, groups and devices ━━
Coach › Memory does not put every conversation into one model request. Tasks use relevant memory and compacted history; records persist within the configured scope. New Windows profiles prefer writable D, falling back to a writable per-user location on C. Existing locations and explicit configuration are retained. Installation, credentials and memory may live in different places.
    koder memory status
    koder memory personalization status
    koder memory show
    koder memory search "project decisions"
    koder account status
    koder memory sync
Coach › Cross-device memory service: your deployed, compatible Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
    koder account login --server "https://your-core.example"
        Replace the example with your actual compatible Core service
    koder account logout
        Sign out here without deleting server memory
    koder memory forget
        Forget the current shared space; offline devices apply it on sync
  Tip · All linked-group members can use linked private-chat memory; group replies are visible to them. Link only conversations intended for that sharing. Login does not prove synchronization: inspect state and read back actual records. This preview still lacks physical multi-device and live WeChat, Feishu and WeCom account acceptance.
```

</details>
