# Koder CLI 0.5.3

The startup refractor has finer shading and cleaner edges. Thin blue frames give the startup panel, Setup and pickers a consistent appearance while keeping the conversation and input compact.

## Changes

- Preserve the three-lobed ring and refine its translucent surface with coverage-aware edge rendering and restrained spectral highlights.
- Share thin blue rails, brighter corners and clear titles across the startup panel, Setup and pickers. Replace heavy chat separators with a lighter line.
- Fit picker frames to the actual terminal width, including widths below 42 columns.
- Respect `KODER_REDUCED_MOTION=1` and `REDUCED_MOTION=1` at startup. Existing animation settings, dark/light themes, reduced-color output, no-color output and ASCII fallback remain available.

The persistent input, steering, queue, cancellation and approval behavior remain in place. This is a presentation update; it does not change the task engine, model routing or tool permissions.

## Try the appearance controls

Run `koder update`, restart Koder, and check that `koder --version` reports `0.5.3`. Then inspect the static startup panel:

```sh
koder banner --no-anim
koder banner --ascii --no-anim
```

Setup retains its animation and theme preferences. To reduce startup motion for all launches, set `KODER_REDUCED_MOTION=1` in your shell environment. The same option can be set in PowerShell with `$env:KODER_REDUCED_MOTION='1'`. See the [terminal guide](SESSION-DOCK.en.md#startup-and-frame-appearance) for the retained input controls.

## Verification and remaining limits

The focused UI regression passed 97 checks. The actual CLI also passed all 12 stages of the local macOS PTY fixture in both truecolor and `NO_COLOR` modes, using a scripted provider without an API key. These are targeted source and terminal checks, not a full product regression or paid-model evaluation. The release asset `ACCEPTANCE-RESULTS.json` records the exact commands, package checks and installation results separately. Earlier release test counts are not reused. Local PTY output does not certify Windows Console, ConPTY or IME behavior.

Native Windows terminal, GUI, cold installation and update checks remain beta-owned and NOT_RUN in the local release record. Paid-model quality, real mailbox delivery and authenticated account writes are outside this visual change. The unsigned macOS locked-use helper remains HOLD. Existing advanced MCP coverage limits and third-party attribution remain documented in the [capability guide](NATIVE-MCP-CAPABILITIES.en.md).

Windows and macOS use the existing versioned installers and runtime distribution. GitHub is the publication destination; this release includes no official website edits or deployment.
