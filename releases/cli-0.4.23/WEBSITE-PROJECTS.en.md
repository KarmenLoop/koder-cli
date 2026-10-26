# Website delivery and project anchors

Koder CLI 0.4.23. [中文手把手教程](WEBSITE-PROJECTS.zh.md) · [Release notes](RELEASE-0.4.23.md)

The bundled `builtin:fullstack-web-delivery` workflow covers new websites, visual redesigns and repairs to existing sites. It starts with the audience, purpose and primary user journey, reuses established decisions, asks about consequential gaps, then plans, implements and verifies the work. Cross-platform website work covers desktop and phone layouts and relevant browsers; it is not evidence of native application acceptance.

## Update and check

Run in Windows PowerShell/CMD or macOS Terminal:

```text
koder update
koder --version
koder skills list --query fullstack-web-delivery
koder skills doctor builtin:fullstack-web-delivery
```

Expect version `0.4.23` and the Skill in the list. `readyToAttempt: true` means its text is available. `runtimeVerified: false` does not claim a website or GUI test passed. If an older executable starts, inspect `where.exe koder` on Windows or `type -a koder` on macOS. The workflow is offline and uses your existing model. Network access, dependencies, edits, commands and publishing retain their original permission checks.

## Create a separate project

```text
koder project create "Community Library" --kind website
```

Koder creates `Koder Projects/Community Library` under your user home, with `.koder/project.json` and `PROJECT-ANCHOR.md`. Each project receives a unique ID. A name collision fails instead of replacing a folder. An interactive terminal enters the project; otherwise use the printed `koder chat -w ...` command.

A new website request from an empty directory or your home also creates a dedicated project. Existing-project edits stay in place. Explicitly say “create a separate website project” or use `/project create "Second Site" --kind website` for a different project. A follow-up such as “change the header” does not create another directory.

For an existing site, open its actual path:

```text
koder chat -w "C:\Users\your-name\Koder Projects\Community Library"
```

On macOS:

```text
koder chat -w "$HOME/Koder Projects/Community Library"
```

## Discuss the intended result

Start with “Build a website for our neighborhood library.” The agent reads existing project facts and asks about missing decisions using the existing `ask_user` interaction. It groups questions within the host limit and does not repeat supplied answers.

For example: “Nearby families are the audience. Finding opening hours is the primary action, followed by events. Use home, events and contact pages, warm editorial styling, Chinese copy and mobile-first layouts. We have a name but no photos. Do not invent hours or add accounts, payments or a backend.”

You can delegate reversible choices: “Build an editable prototype using disclosed assumptions.” Choosing to provide more information is not itself an answer. Headless tasks continue with labeled assumptions for optional choices. Assumptions never supply credentials, publication authority or missing business facts.

## Keep a stable anchor

`PROJECT-ANCHOR.md` records project identity, purpose, audience, primary outcome, scope, non-goals, constraints and observable acceptance criteria. The structured section is machine-readable; your notes outside it remain intact. A new project starts with empty, undecided fields.

```text
koder project anchor -w "your actual project path"
koder project anchor -w "your actual project path" --json
```

The agent's `project_anchor read` reads this file. `project_anchor propose` produces a candidate and always returns `written: false`; the original write/edit approval path saves it. An existing-file proposal needs the current SHA. `ANCHOR_STALE` means read again before proposing a change.

A local fix keeps the central idea. Changing the audience or primary purpose produces `reframe-proposed` with before/after values. The agent explains the implications and uses the user's actual decision before adopting the change. The ID remains stable, and history retains the preceding direction and hash. A genuinely different product should have its own project.

A pre-existing plain-text anchor returns `manual-review` instead of being overwritten by a template. Read and reconcile it first, preserving the original text. Malformed structured anchors and unsafe links are not silently replaced. `DESIGN.md` holds visual decisions, the anchor holds direction, implementation plans hold actions, and test records hold actual results.

## Continue into implementation

1. Define pages, actions, states, platform constraints and observable checks around the main user journey. Add backend, authentication, data or content management only where required.
2. Reuse `website_brief` and established anchor fields. Use `design_catalog` and `design_read` when a design reference helps; do not start a duplicate questionnaire.
3. Use the existing `project_visuals` workflow for three materially different layouts on a new site or substantial redesign. Respect an existing selected layout, a targeted repair or explicitly delegated visual choice.
4. Show the implementation plan, then build and test meaningful user flows. Keep truthful copy, the existing brand, keyboard focus, responsive layouts and failure recovery.
5. Start and inspect the real `workspace_preview`, then deliver a `project_visuals` H5 map, changed files, startup instructions, test results and remaining limits.

An HTTP response is evidence of reachability, not visual, touch or keyboard acceptance. Report unavailable browser drivers. Native Windows device checks remain with beta testers.

## Repair an existing site

Open its directory and ask: “Fix the mobile navigation wrapping. Preserve the site's purpose, brand, pages and stack. Read the anchor, change only relevant files, run existing tests and show a preview.”

The same Skill applies its relevant steps. A repair does not require three redesigns or a fresh business questionnaire. An unanchored existing site stays in place; read its README, design documents and code, then ask only about business decisions that remain unclear.

## Read the original package

```text
koder skills read builtin:fullstack-web-delivery --limit 4000
koder skills read builtin:fullstack-web-delivery --offset 4000 --limit 4000
koder skills read builtin:fullstack-web-delivery --path references/discovery.md
koder skills read builtin:fullstack-web-delivery --path references/specification-pack.md
koder skills read builtin:fullstack-web-delivery --path references/platforms.md
```

Use `nextOffset` in JSON output to page through a complete resource. All 29 upstream Skill files are preserved byte-for-byte, including tutorials, UI/interaction/motion/platform references and the optional specification generator. Reading a script never executes it. The default workflow requires no Python. If you choose to run the generator, read its instructions, prepare an answered brief inside the project and use the original command approval path to generate a new revision directory. Existing output directories are rejected. Generated specifications are not evidence of implementation or acceptance.

## Turn the workflow off or on

Use Setup → Skills, or:

```text
koder skills disable builtin:fullstack-web-delivery
koder skills enable builtin:fullstack-web-delivery
```

Disabling removes this task policy and the model-facing anchor tool from new tasks. Existing files remain, and `koder project anchor` can still inspect them. Other Skills and website delivery checks retain their own settings. Setup's all-Skills switch includes this method.

## Developer notes and evidence

The integration uses the existing Skills registry, fusion host and harness. `fusion/fullstack-delivery.mjs` supplies task selection and resource access; `fusion/project-anchor.mjs` reads and proposes, while CLI project creation writes the initial draft. JIT profiles, explicit tool denies, cancellation and cost budgets retain authority. Detailed upstream text loads on demand, and unrelated small-context tasks do not receive the anchor schema.

Local regressions cover directory isolation, original resource reads, requirements interaction, approved writes, actual site-file repair and Node tests, assumptions, direction proposals, shutdown and retained behavior. Model decisions are deterministic fixtures. These checks do not establish paid-model design quality, native browser interaction or Windows device results.

Source: KarmenLoop/fullstack-web-delivery 0.9.1, commit `72e05993c485210e255c1e950f424a53fb05be49`. The unchanged package retains its Source-Available No-Modification License 1.0 and NOTICE; Koder's host integration is separate. This is not an OSI open-source license or a license to reuse referenced brands and assets.
