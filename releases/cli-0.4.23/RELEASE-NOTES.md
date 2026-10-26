# Koder CLI 0.4.23

Website creation, redesign and repair now use the bundled Fullstack Web Delivery Skill by default. Koder reads existing project decisions, asks about consequential missing requirements, plans the work and continues through the original implementation, test and preview tools.

- Preserve all 29 files from Fullstack Web Delivery 0.9.1, with pinned hashes, original license and notices. References are available offline through `skill_read` and `koder skills read`.
- Create a stable `PROJECT-ANCHOR.md` for each new project. Keep its ID, purpose, audience, primary outcome, scope and acceptance criteria across later work. Existing projects stay in place.
- Review changes to a site's central purpose through a before/after proposal. Preserve prior direction, hashes and notes; proposals do not write or grant permission.
- Reuse anchor facts in website intake to avoid repeated questions. An explicit separate-project request creates a new folder; ordinary follow-ups and repairs retain their directory.
- Keep the workflow optional through Setup and `koder skills disable builtin:fullstack-web-delivery`. Unrelated tasks do not load the anchor schema.

Update with `koder update`, then check `koder --version`, `koder skills doctor builtin:fullstack-web-delivery` and `koder project anchor -w "your project path"`. Windows uses the attached CMD/PowerShell installers; macOS uses the shell installer. Both install the same versioned runtime with retained platform payloads.

[Hands-on guide](WEBSITE-PROJECTS.en.md) · [中文教程](WEBSITE-PROJECTS.zh.md)

The integration retains existing providers/BYOK, permissions, unlimited default tool rounds, cancellation, configured cost budgets, uncertain-effect receipts, Skills, MCP, mail, GitHub workflows, previews and courses. Local source, packaged and installation evidence is recorded separately in the release acceptance asset. Model decisions and browser-opening adapters in automated checks are fixtures. Native Windows remains beta acceptance; paid-model design quality, native browser visual interaction and existing account/residency/unsigned locked-use limits remain unverified here. GitHub is the publication destination; the official website is unchanged.

Integrated local source regression: 138 passed; installer/update regression: 26 passed. The optional unchanged specification generator produced 18 files with verified hashes and rejected an overwrite with exit code 2.
