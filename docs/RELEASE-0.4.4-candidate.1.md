# Koder CLI 0.4.4-candidate.1

Unpublished Headroom integration candidate based on 0.4.3. Windows CMD/PowerShell
and macOS shell installers use the same candidate archive. No public feed has changed.

## Changes

- Headroom runs automatically in the existing CLI task loop. No separate proxy,
  Python runtime, model account, memory database or executor is introduced.
- Repeated JSON keys, formatting whitespace and identical consecutive log lines
  can use reversible representations. Original tool results stay in their thread;
  scoped, hash-checked reads recover exact text when needed.
- Prompt guidance and the read tool appear only when the saved bytes cover their
  estimated overhead. Short tasks retain their original tool and instruction budget.
- Setup offers separate controls for the native processor and redundant-output
  guidance. Global Skill disable also applies. Existing permissions, receipts,
  cancellation, provider routes, task profiles and history isolation stay authoritative.
- Apache-2.0 Headroom resources are pinned at
  `118466d7737ebc42806c331e44bd251b5222d59b`, with LICENSE and NOTICE retained.
  Upstream sampling, history deletion and helper scripts do not run automatically.

Read the [English guide](HEADROOM.en.md) or [Chinese guide](HEADROOM.zh.md).

## Verification and remaining work

The 250-test local regression run passed 248 tests. All 36 Headroom cases passed,
including real local CLI tool execution, raw-result retrieval, concurrent thread
isolation, Setup input and authenticated local resident IPC with scripted models.
The two remaining 8K-context failures also reproduce on unmodified 0.4.3. The
original failures and assertions are preserved; this is not a full-suite pass.

Exact archive checks and unpacked-runtime results are recorded in the candidate
handoff after packaging. Native Windows GUI/no-Node cold installation, OS login
startup, live accounts and paid-model quality/cost remain separately unverified.
Byte reductions in synthetic fixtures are not billed-token or quality improvements.
The public website and GitHub runtime remain unchanged in this task.

## Disable or roll back

Run `koder skills disable builtin:headroom` and reopen the session. This disables
the native projection and its model guidance without deleting results or settings.
The released 0.4.3 package remains the baseline; retain task histories and pending
effect receipts if restoring it. Never kill another task to force a switch.
