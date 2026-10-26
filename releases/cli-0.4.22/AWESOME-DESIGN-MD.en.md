# Website requirements and design references

Koder CLI 0.4.22. [中文手把手教程](AWESOME-DESIGN-MD.zh.md) · [Release notes](RELEASE-0.4.22.md)

Koder bundles 84 complete DESIGN.md analyses from VoltAgent/awesome-design-md. Website creation and redesign tasks use them through the existing agent loop: clarify missing requirements, read a relevant reference, record project decisions, implement the website, and check the result. The library is local; it does not require a new account or replace your selected model.

## Check your installation

Run these commands in PowerShell, CMD, or macOS Terminal:

```text
koder update
koder --version
koder design status
koder design verify
```

Expect version 0.4.22, enabled: true, entries: 84, and offline: true. The verify command checks bundled text integrity, not a completed website. These commands do not make model requests. Installers are available from the [GitHub release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.22). If an older executable still starts, inspect where.exe koder on Windows or type -a koder on macOS.

## Start with your goal

Open koder in a dedicated project, or use koder chat -w "/absolute/project/path". Use the actual Windows path on Windows. For a new project, the existing project command can create an isolated Koder Projects folder.

Try:

> Build a website for our neighborhood library.

An interactive task first identifies missing requirements. It asks up to three groups through the existing ask_user interface: purpose and audience; the main visitor action and pages; visual preferences, material and technical constraints. Facts already supplied are not asked again.

A useful response is:

> It is for nearby families. The main action is checking opening hours. Use home, events and contact sections. Warm editorial design, Chinese copy, mobile first. We have a name but no photos yet. Keep the existing stack. No accounts or payments.

You can choose the recommended editable prototype or say “use reasonable assumptions and build it directly.” Missing facts remain labeled assumptions. Choosing “I will add requirements” does not count as having answered them. Headless run tasks use disclosed assumptions for optional design choices. Neither route supplies credentials, deployment approval, real message authorization, or missing business facts.

## Read a reference

```text
koder design list --query "warm editorial"
koder design list --query linear
koder design read claude --limit 2000
koder design read claude --offset 2000 --limit 2000
```

The catalog returns exact IDs and pinned source links. Read subsequent pages using nextOffset until it is null. Agent tools design_catalog and design_read use this same offline library.

Use references to reason about hierarchy, spacing, density and component states. The MIT license covers bundled text, not permission to use someone else's trademarks, images or commercial fonts. Keep the project's own brand and choose licensed or system-font alternatives.

## Turn requirements into a working site

The website_brief tool reads any existing DESIGN.md and returns its text/hash along with a proposed section. It does not write files. The agent merges the section through the existing approved editing path, preserving project conventions and unrelated content.

The brief distinguishes supplied facts from assumptions. It records reference URLs and hashes, the project's palette, typography, spacing, responsive layout, components and motion decisions. Checks remain unchecked until actually performed.

The existing visual workflow can present three distinct directions. A selected direction or an explicit request to skip exploration proceeds directly to implementation. Three written descriptions alone do not establish three built variants.

Review the resulting components, styles and main user path. workspace_preview provides a local preview; project_visuals produces the project H5 map. A delivery should identify actual files, checks, preview URLs and remaining limitations. A form without a backend must be described as a prototype.

For a follow-up, say “Keep the layout; make mobile single-column and use a deep red primary button.” Steering and queue behavior remain unchanged. The agent should read the current design and edit the relevant parts.

## Review and control it

Check the main action, small-screen overflow, keyboard focus, form labels and real success/error states. Confirm that hours, contacts, claims and imagery came from supplied material. Static tests do not establish visual quality, accessibility conformance or a live service's behavior.

```text
koder design off
koder design on
```

The same switch is available under Setup → Skills. It uses the existing disabledSkills list and participates in “disable all.” Reopen the session or use the existing reload path after changing settings. Turning off the method removes automatic guidance and its agent tools; project files, other Skills and preview remain. Manual design list/read commands remain available.

## Implementation and evidence

The library is pinned to commit 3b605329240ce735b510037cca322f1831fdd7f8. Its 84 designs and supporting documents total 170 text resources. The assembler verifies Git blob hashes; runtime reads verify SHA-256. See THIRD_PARTY_NOTICES.md and licenses/awesome-design-md/LICENSE-MIT.txt for attribution.

The Skill, read-only tools and task guidance use the existing fusion/harness entry points. Tool schemas are exposed for relevant tasks or after an explicit Skill read rather than on every small-context conversation. AI-app reference tools follow the same task-based loading principle. Profile denies, read-only modes, approval, cancellation, shared budgets and uncertain-effect handling remain authoritative.

Local tests exercised actual requirement/tool execution, consent pauses, rejected writes, cancellation, file writes, Node tests, HTTP preview readback and an H5 artifact. Model decisions and the browser-opening adapter were deterministic fixtures. Paid-model design quality, native browser interaction and Windows client UI were not tested here. These evidence levels are reported separately.
