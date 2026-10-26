# Koder CLI 0.4.22

Website tasks can now gather missing requirements and use a bundled design library before implementing the page. Koder includes 84 complete DESIGN.md analyses from VoltAgent/awesome-design-md, pinned to commit 3b605329240ce735b510037cca322f1831fdd7f8 with MIT attribution and offline integrity checks.

## Changes

- Add the default-enabled awesome-design-md Skill, design catalog/read tools and a website brief tool. Interactive tasks ask about missing goals, audience, actions, pages, style and materials; headless or explicitly direct tasks continue with labeled assumptions.
- Preserve existing DESIGN.md and merge project-specific design decisions through the original editing/approval tools. Continue into the existing three-direction workflow, code, tests, local preview and H5 project map.
- Add koder design commands and a Setup Skills switch. The library has 170 bundled text resources; it does not include external brand images, fonts or scripts to execute.
- Load design and AI-app reference tools only when relevant, preserving small-context conversations. Keep explicit Skill reads and manual lookup available.
- Stop adding Koder installation/model requirements to unrelated landing pages. Those requirements now apply only to Koder product pages.

## Use it

Update using koder update, restart the CLI and confirm koder --version shows 0.4.22. The attached Windows PowerShell/CMD and macOS shell installers use the same versioned runtime.

Run koder design verify to check the reference library. In chat, ask for a website, answer the missing requirements, and review the actual implementation. [English guide](AWESOME-DESIGN-MD.en.md) · [中文手把手教程](AWESOME-DESIGN-MD.zh.md).

## Evidence and retained behavior

Integrated source regression: 121 passed. Local checks cover all 84 documents, question/assumption handling, existing-file preservation, disabled Skills, profile restrictions, original approvals and cancellation, CLI wiring and small-context recovery. A deterministic model drove actual local file writes, two Node tests, HTTP preview readback and the H5 delivery tool. Browser opening was an adapter fixture; no real paid-model design score or native GUI acceptance is claimed.

Task rounds remain unlimited by default, with cancellation and configured cost limits. Existing mail, MCP, Skills, SolidCraft, AI-app references, migration, session controls, subagents and the 1,800-lesson Chinese course remain in the package. Windows native testing remains with the beta team; other existing real-account, GUI and unsigned locked-use limitations remain. The unsigned locked-use candidate is excluded.

Publication is GitHub only. No official website deployment is included. Rollback uses the pinned cli-0.4.21 installer; preserve user configuration, conversations and uncertain-operation receipts.
