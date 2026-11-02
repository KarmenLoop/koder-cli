# Skill store

[English](SKILL-STORE.en.md) · [简体中文](SKILL-STORE.zh.md)

The frozen 0.8.1 build includes the Skill store. Website publication is pending; the examples below describe that prepared build. Its existing package checks cover pinned installation and use in the original harness, not successful operation of every third-party Skill.

Open **Setup → Skills → Skill store**, run `koder skills store`, or enter `/skills store` in chat. Browse repository stars, recent updates or measured star growth; search for a topic or `repo:owner/repository`; review the source and license, then select **Download and adapt**.

The existing network and skills.update permissions apply. Interactive chat checks the public catalog in the background once a day, starting 15 seconds after startup. It sends no conversation text and installs nothing automatically. Turn it off with `koder skills store auto off`. The self-fetch master switch also disables network access.

Installation pins a commit, validates the file tree, preserves license files, verifies Git blob and SHA-256 hashes, and builds a Koder tool/resource adapter without rewriting upstream bytes. Known host tools map to Koder's existing tools. Python scripts reuse the existing private runtime when available. Unknown tools, missing resources, scripts, dependency manifests and platform-specific settings remain visible in the readiness report. Remote hooks do not run; accounts and permissions are never imported. Installed versions are not replaced by a catalog refresh.

```sh
koder skills store refresh --query 'repo:owner/repository' --json
koder skills store list --sort stars --json
koder skills store install github:ACTUAL_ID --ref FULL_40_CHARACTER_COMMIT
koder skills store inspect github:ACTUAL_ID --json
koder skills store status --json
koder skills audit --json
```

Replace placeholders with the actual values in the catalog. In a noninteractive terminal, the default store command lists cached entries without making network requests. Install and refresh are explicit actions. Escape/Ctrl+C cancel interactive network work; rate limits retain the cache and schedule backoff.

**Adapted** means the method and resources have a host adapter. **Ready to attempt** means basic local prerequisites were found. Neither means the skill completed a real task. The report retains `runtimeVerified: false` until a separate operation is verified. Apps, browser engines, model weights, package dependencies and account bindings may still need setup.

GitHub search is bounded and incremental. Stars belong to a repository, not an individual skill. The page is not a complete global ranking. If the raw-file endpoint is unavailable, the same verified blob can be fetched from GitHub's API; TLS and hash checks remain enabled.

See the [full Chinese walkthrough](SKILL-STORE.zh.md) for setup, cancellation, error codes, manual-only skills and dependency diagnostics. Format references: [Agent Skills](https://agentskills.io/specification), [GitHub repository search](https://docs.github.com/en/rest/search/search#search-repositories).


## Permissions and local checks

If the store reports a missing grant, review and request the existing capabilities:

```sh
koder permissions request --capability network --capability skills.update
```

After installing, copy the actual Skill ID from the catalog. Replace `ACTUAL_ID` below rather than entering it literally:

```sh
koder skills read github:ACTUAL_ID --json
koder skills enable github:ACTUAL_ID
koder skills disable github:ACTUAL_ID
koder tools audit --json
koder skills audit --json
```

A disabled Skill can still be inspected but cannot be invoked by the Agent. Skills marked for manual selection stay out of automatic discovery; choose one with `/skill` or `$name` when you want to use it. An adapter cannot create a connector or grant permission that the current task does not have.

Readiness reports can still identify missing FFmpeg/ffprobe, a Playwright launcher or browser, an EARSHOT model, CodeGraph, a target app or an account binding. A bundled REA entry does not install Ghidra, IDA or Frida. Use the [managed-runtime guide](TOOL-RUNTIMES.en.md) to prepare supported engines and then verify the actual task result.

## Recovery

| Code | Next step |
| --- | --- |
| `COMPUTER_PERMISSION_REQUIRED` | Review the requested network and Skill-update grants. Existing Skills remain available. |
| `SELF_FETCH_DISABLED` | Check the self-fetch master switch in Setup; enabling store refresh does not override it. |
| `RATE_LIMIT` / `SKILL_STORE_BACKOFF` | Keep the cache and wait until the retry time shown by status. |
| `SKILL_DISCOVERY_UNAVAILABLE` | Check connectivity and refresh explicitly; an unreadable catalog is not a successful empty refresh. |
| `SKILL_SOURCE_CHANGED` | Reopen the catalog and choose its actual pinned commit. |
| `SKILL_INSTALLED_VERSION_DIFFERS` | Review the existing version before replacing it; refresh does not overwrite it. |
| `HASH_MISMATCH` | Stop using that candidate; its source or local inventory does not match. |
| `UNSAFE_PATH` / `UNSAFE_RESOURCE` | The candidate has a rejected path or resource and was not installed. |
| `SKILL_STORE_CANCELLED` | The operation stopped; the existing catalog and installation remain. |
| `SKILL_NOT_FOUND` / `SKILL_DISABLED` | Check the actual ID, installation state and Setup switch. |
