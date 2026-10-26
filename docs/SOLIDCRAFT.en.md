# Parametric CAD with SolidCraft

Koder includes the unmodified SolidCraft 0.23.0 CLI for Windows x64 and universal macOS. Its built-in `builtin:solidcraft` Skill uses the existing Core MCP host, task approval ledger, model provider and budget. No separate model account is required. The Skill is available by default; enable the connection explicitly for each project.

## Start in a project

```sh
mkdir -p "$HOME/Koder Projects/mounting-plate"
cd "$HOME/Koder Projects/mounting-plate"
koder cad enable
koder cad verify
koder cad test
koder
```

On PowerShell, use `New-Item -ItemType Directory -Force "$HOME\Koder Projects\mounting-plate"` and `Set-Location` before the same Koder commands. Setup → Applications and MCP → SolidCraft provides status, enable, disable, integrity verification and connection testing. Chat supports `/cad`; `koder solidcraft` is an alias. The Skills menu can independently disable the integration Skill.

`enable` saves project settings. `verify` checks both bundled platform inventories. `test` starts a temporary MCP connection, discovers tools and closes it. A connected test is not evidence that a design has been modeled correctly.

## Build, verify and edit

Ask:

> Use SolidCraft to create a 20 mm × 10 mm × 5 mm plate. Define the length as plate_width. Calculate the expected volume first, then model and measure it. Save plate.solidcraft, plate.step, plate.stl and plate.png in this project.

The expected volume is 1,000 mm³. Koder reads the Skill, discovers exact tools and schemas, and submits each operation through `app_call` and the existing approval path. Check that the measured volume agrees and that all four files exist. The editable `.solidcraft` is the source design; STEP/STL are exchange formats; PNG is a visual check, not manufacturing verification.

A later turn can ask:

> Open plate.solidcraft in SolidCraft, change plate_width to 30 mm, measure it, and save plate-v2.solidcraft and plate-v2.step without overwriting the original.

Expect 1,500 mm³. Every turn starts a fresh model instance. Open a saved file to continue and save a checkpoint after each verified stage. An unsaved in-memory model is not a durable deliverable.

For more complex parts, specify dimensions, units, material-related constraints, hole sizes and spacing, tolerances and output formats. The Skill uses upstream `skill_reference`, `list_commands` and `describe_command` on demand for modeling, editing and checking. Supported operations are determined by the live MCP command catalog. Koder does not certify every SolidCraft GUI feature or manufacturing use case.

## Isolation, permissions and recovery

Each task receives its own client-scoped headless MCP instance. It cannot use another task's CAD tools. The Core removes temporary instances when the client closes, and does not reconnect them after a runtime restart. Saved MCP connections retain their existing behavior.

The command is `mcp --headless --param-check strict --allow-path <project>`. It never auto-attaches to an existing desktop window or configures another AI client. HOME, caches, configuration and temporary paths are private to the CAD instance. File operations use SolidCraft's project/private-path policy; this is not an OS sandbox. Parallel tasks must use different output names if they share a project.

Use narrow `app_tools` queries such as `__inspect_design`, `__execute` or `__save`. Large catalogs and media results are retained as artifacts and can be read with `app_result_read`. Tool documentation and remote output never grant authority.

`koder cad disable` revokes pending local access. Approval, cancellation, costs and unknown-effect receipts remain under Koder's original owners. A timeout or failed cleanup is not proof that a mutation never happened. Inspect files, receipts and private recovery data before retrying; never blindly replay a batch or overwrite. The existing MCP call budget is 180 seconds.

## Platforms and diagnostics

- Windows x64: bundled executable and hash inventory; native target-device run remains a beta test.
- macOS Apple silicon: real native modeling, measurement, edit/reopen, STEP/STL export and CPU PNG verified through Koder with scripted model input and isolated credentials.
- macOS Intel: included in the universal binary; native target-device run not performed here.
- Linux and Windows ARM64: no native bundle in this integration. An installed compatible executable can be configured explicitly with `koder cad enable --command /absolute/path/to/solidcraft-cli`; its version and integrity are user-managed.

`CAD_DISABLED` means the project has not been enabled. `CAD_BUNDLE_INTEGRITY` means the files differ from the pinned inventory: reinstall the full official package rather than bypassing the check. `CAD_SESSION_MISMATCH` or `APP_CLIENT_MISMATCH` requires discovery of the current task's tools. `APP_PRIOR_RESULT_UNKNOWN` and `CAD_CLEANUP_PENDING` require reconciliation before retrying.

CPU rendering omits some GPU analysis colors and legends. Complex surfaces, assemblies, manufacturing accuracy and paid-model performance are not covered by the simple native integration tests.

## Rebuilding and attribution

The upstream is [Tangency Labs SolidCraft](https://github.com/tangency-labs/solidcraft), fixed at [v0.23.0](https://github.com/tangency-labs/solidcraft/releases/tag/v0.23.0), commit `7770f8982de8bf00cabfe421b7f563b34c7af90f`. Its MIT OR Apache-2.0 licenses and binary dependency notices are preserved in `licenses/solidcraft/` and beside the executables. Koder's own license is unchanged.

Maintainers can download the exact archives listed in `scripts/solidcraft-assets.json` and run `python3 scripts/assemble-solidcraft.py --downloads /path/to/downloads --output /new/bundle/path`. This verifies archive and extracted-file hashes and does not run an installer. Packaging verifies the complete bundle again. Updates require a new reviewed pin, notices and compatibility checks; runtime does not silently fetch upstream updates.

## Delivery checks

Modeling tasks require a successful current-turn `.solidcraft` save, a post-edit measurement and the requested output files. A failed or unknown mutation invalidates earlier evidence without replaying it. Missing files, stale measurements or unreadable artifacts produce exit 3 with `TASK_CAD_*`; this is a delivery issue, not an API outage. Inspect the design and receipts before supplying the missing measurement or save. The check does not certify tolerances, topology or manufacturing fitness.
