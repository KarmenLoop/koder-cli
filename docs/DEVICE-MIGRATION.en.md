# Moving Koder to another device

This guide covers Koder CLI 0.4.12 and later. Check `koder --version` and `koder help migrate` on both devices first. The 180-lesson Chinese classroom remains available.

## Start with the wizard

Run `koder migrate` or choose **Move to another device** in Setup. The wizard offers an encrypted export, an import, an SSH transfer, and a list of imported profiles. It never stops source tasks or replaces the destination's existing profile.

An import creates `Koder Projects/Migration-<id>`. Project folders are named `p0`, `p1`, and so on; the receipt maps them to their original names. Run the printed `koder migrate open <id>` command to enter the migrated profile in the current terminal. Exit to return to the original terminal. Use `/project open "path"` to select another restored project.

## Portable archive

On the source:

```sh
koder migrate export --output /path/to/move.kodermigrate
```

Choose a passphrase of at least 12 characters at the masked prompt. The default selection is the immediate project directories under your `Koder Projects` folder. Repeat `--project "path"` to select specific projects instead. For an old custom session whose saved identity contains only a digest, add `--session name`. Unknown histories are preserved in the encrypted source archive rather than assigned to the wrong project.

Copy the encrypted file using your own approved file-transfer method. Keep the passphrase separate. On the destination:

```sh
koder migrate inspect --file /path/to/move.kodermigrate
koder migrate import --file /path/to/move.kodermigrate --yes
koder migrate open <id>
```

The `MIGRATION_IMPORTED_REAUTHORIZE` receipt means data restoration succeeded and accounts still need reconnecting. Open `/setup` in the migrated terminal to configure the model and reconnect the services you need. Reinstall project dependencies for the target OS. A successful import is not a successful model, mailbox, desktop or MCP connectivity test.

## Direct SSH transfer

Install a migration-capable Koder on the destination and accept its license there. Configure OpenSSH public-key or agent-based login and verify the destination host key separately. The non-interactive remote PATH must resolve `koder`.

```sh
koder migrate send --to owner@server.example --yes
```

Use `--port 2222` for a different SSH port, or repeat `--project` for a narrower selection. Koder sends the encrypted archive and its passphrase through SSH standard input; neither appears in command arguments. It verifies the destination receipt's archive hash and migration ID. It does not install software, accept new host keys, collect SSH passwords, grant desktop permissions or escalate privileges.

If the receipt is lost, the result remains `MIGRATION_REMOTE_OUTCOME_UNKNOWN`. Check `koder migrate status` on the destination using the ID in the error before retrying. Re-importing the same archive is idempotent; a new `send` creates a new snapshot and ID.

## What moves

- Selected project files, including project-local Skills, and Koder's user Skill directory.
- Language, theme, input mode, CLI course progress, prompt templates, and selected built-in Skill/Harness preferences.
- The model name, protocol, sanitized base URL and context settings, without credentials.
- Recognizable local terminal histories and explicit notes, rebound to each destination project. Old tool calls become read-only history; pending effects are not replayed.

The destination gets an isolated profile. Imported custom Skills start disabled for dependency review. Parent-terminal `KODER_*` overrides are not inherited, so configure the migrated profile through Setup.

The encrypted original archive retains histories that cannot safely be rebound. Account-scoped shared histories require the existing account synchronization flow. Native-key-encrypted personalization and experience databases are not exported by this feature; keep the source device available.

API keys, mailbox passwords, GitHub/MCP/App credentials, browser sessions, desktop permissions, approvals, background services and pending jobs do not migrate. Common secret files, `.git`, dependencies, virtual environments and symbolic links are excluded and listed in the receipt. Example environment files may be included. This exclusion list is not a complete secret scanner: hard-coded secrets may still be present in source files. Do not publish migration archives.

The 180-lesson web classroom stores progress and notes in the browser. Use its export/import controls separately; CLI migration does not read browser profiles.

## Limits and recovery

Limits are 20,000 files, 64 MiB per file, 128 MiB of data and a 200 MiB encrypted archive. Split larger projects. Windows-incompatible paths and case/Unicode collisions are rejected before restoration. Source changes detected during collection fail the snapshot without terminating the source task. This is not a live-process, whole-disk or database-consistent migration facility.

To withdraw an import, exit its terminals and deactivate its resident service, then run:

```sh
koder migrate rollback <id> --yes
```

The folder is renamed to a retained location, including later edits. Neither source data nor the destination's original configuration is deleted. The receipt reports the retained path.

The implementation uses the existing CLI, Setup, protected secret prompt, project root and local-history format. Archives use scrypt and AES-256-GCM; imports validate structure, limits, checksums and portable paths before atomic placement. Package contents are never executed during migration.

Synthetic tests cover isolated profiles, encryption failures, history separation, malformed paths, interrupted imports, rollback and a simulated SSH transport. Real Windows/macOS cross-device use, Windows masked input, real SSH servers and account reconnection require separate acceptance. A simulated transfer is not evidence of a live server migration.
