# Media, browser and application Skills

Available in **0.4.2**. Existing models, tools, histories and permissions remain; platform and real-account limitations are listed in the release notes.

## Find and use a workflow

```text
koder skills catalog
koder skills list --query video
koder skills doctor video-shotcraft
koder skills show bundled:video-shotcraft
koder run "Make a product video from my screenshots; show three directions first" --skill bundled:video-shotcraft
```

In the current chat, use `/skills catalog`, `/skills doctor playwright-cli`, and `/skill bundled:playwright-cli`, then enter the task. `/skill clear` clears selection. Selecting a method never sends a message, installs software or runs its scripts automatically.

The existing `skill_catalog` and `skill_read` tools load instructions and relative resources on demand. Koder retains authority over task scope, BYOK routing, cost, shell approval, cancellation, memory and account actions. Source-host hooks, model requirements and broad permissions are not imported.

## Included sources

| Entry | Scope | Dependencies and limits |
| --- | --- | --- |
| video-shotcraft | Product screenshots, shot recipes, camera motion and editable video workflows | User assets; renderer/editor dependencies; separate music and Remotion terms |
| xilo-opus-video | Three directions, previews, code animation and synthesized sound | Project dependencies; no mandatory Claude account |
| lemo-opuscar | Style library, directing guides and original style development | Pinned library included; do not clone a second global copy |
| mg-styles-15 | Motion styles, prompts, demo code and audio synthesis | Some fonts absent upstream; some styles need Blender |
| huashu-art-motion | Art styles, explainer grammar, storyboard and render QA | Load the chosen style; verify the resulting frames |
| dashi-animationstyle | Narration-led Chinese explainer animation and subtitles | Author voice sample excluded; use authorized narration |
| playwright-cli | Browser navigation, snapshots, forms, extraction and testing | Official Skill included; install its executable in the project |
| cli-anything | CLI generator methodology, registry and software adapter sources | Per-adapter application and Python dependencies |
| jianying-editor | Desktop Jianying drafts, media, captions, effects and controlled export | Attributed source mirror; not claimed to be latest upstream |
| koder-media-workflow | Local timeline/SRT, records, article preview and rendering helpers | Original Koder implementation; account publishing and speech services are separate |

Two reference-only entries explain where functionality differs: WTT Code Animation Studio has a noncommercial share-alike license, and the X article publisher repository had no redistribution license. Neither original implementation is bundled. Koder's own workflow covers local preparation and uses authorized browser actions where appropriate; it is not an exact copy of either source.

Original licenses, notices and revisions are retained. Demo films, author voice recordings, sample music and binary demo media are excluded. Fonts and other media may require separately permitted assets. Source availability does not certify every style, platform or account workflow.

## Check and prepare

```text
koder skills doctor koder-media-workflow --json
koder skills prepare koder-media-workflow
koder skills prepare video-shotcraft --target video-library
```

`doctor` discovers dependency paths without executing programs, reading accounts or installing packages. Exit 0 means required entries were found, 1 means a required dependency is missing or the entry is reference-only, and 2 means invalid input or an unavailable Skill. `runtimeVerified: false` is intentional. Optional dependencies may still be required for the selected operation, such as rendering.

`prepare` verifies the bundle's file hashes and copies resources into a new project-local directory, preserving notices and writing a preparation receipt. Existing destinations are never overwritten. It executes nothing. A unique local Skill wins over a bundled Skill with the same name; use `bundled:<name>` to select the shipped copy. Ambiguous local names still require an ID.

## Executable local helpers

```text
node .koder-skill-koder-media-workflow/scripts/media.mjs timeline scenes.json new-timeline
node .koder-skill-koder-media-workflow/scripts/media.mjs reviews records.json new-export
node .koder-skill-koder-media-workflow/scripts/media.mjs article article.md new-article
node .koder-skill-koder-media-workflow/scripts/render.mjs scene.html new-video --duration 6 --fps 24 --width 1280 --height 720
```

- Timeline input: `{"timingSource":"planned","scenes":[{"start":0,"end":2,"text":"First scene"}]}`. Use recording only for measured narration timing. Scenes must be ordered and non-overlapping. Outputs include SRT; speech is not synthesized.
- Records input: an array of scalar-field objects collected from an authorized source. CSV/JSON output preserves the actual count and neutralizes spreadsheet formula cells. The converter does not crawl or invent rows.
- Articles: headings, paragraphs, code fences and standalone Markdown image lines become a local HTML preview. Complex syntax remains escaped text unless a project parser is supplied. Local images are copied; missing and remote images are recorded as unresolved. No account is contacted or article published.
- Rendering: the local scene defines `window.renderAt(t)` or `window.render(t)`. Install Playwright in the project and provide Chrome/Chromium and FFmpeg. `--root` sets a confined resource root; `--audio authorized.wav` muxes supplied audio, padding or trimming to the video duration. Explicit installed paths may be supplied through KODER_PLAYWRIGHT_MODULE, KODER_CHROME and KODER_FFMPEG. A fresh owned browser renders frames; external HTTP requests and WebSockets are blocked; this is not an OS network sandbox. Missing assets and script errors fail without a success receipt. Output includes MP4, frames and a receipt.

Output directories must be new. Commands use Koder's existing approval policy. Plans, source files and screenshots are not substitutes for a final render.

## Browser and native application setup

For the tested browser executable, install `npm install --save-dev @playwright/cli@0.1.22` in the project. Use the reviewed project version and its local help: a pinned Skill snapshot may describe commands absent in an older executable. Start an isolated session with `npx --no-install playwright-cli -s=koder-task-id open http://localhost:PORT --browser=chrome`; add `--headed` for a visible preview. Close only that session. Do not reuse a personal profile or call close-all.

Login, purchases, posting, submissions and messages require authorization under the current task. Do not bypass challenges or access controls. Reusable procedures and evidence go into the existing Koder self-learning workflow, not a second memory service.

For CLI-Anything, prepare the source, choose the target software's agent-harness, inspect its setup.py and install dependencies in a project virtual environment. Verify actual files and failure exit codes. The registry does not mean every target app is installed or supported.

For Jianying, point JY_SKILL_ROOT at the prepared directory and explicitly create `JyProject(name, drafts_root=new_project_local_folder, overwrite=False)`. Media metadata comes from pymediainfo or ffprobe; failed probes no longer fabricate duration or dimensions. Failed existing-draft loads preserve their files. requirements-koder.txt marks uiautomation as Windows-only; draft-only use does not require the full optional list. macOS draft creation and Windows UI export are different workflows. macOS automatic export, CapCut and mobile compatibility are not claimed. Windows export needs a matching Jianying version and native validation.

## Acceptance and recovery

Isolated macOS checks produced a real browser interaction/extraction, an audio/video render, Jianying draft JSON and Draw.io XML through its source CLI adapter. These are local functional checks, not native Windows, real-account, every-style or real-model quality acceptance. The four retained baseline regression failures remain unresolved.

SKILL_BUNDLE_CHANGED or SKILL_BUNDLE_UNRECORDED means installed resources differ from the manifest. Restore a complete candidate; do not overwrite user projects. EEXIST requires a fresh output name. SCENE_ASSET_HTTP_404 indicates a missing resource or incorrect root. FFPROBE_REQUIRED requires an explicit installed probe. DRAFT_LOAD_FAILED_PRESERVED means the old draft remains intact for inspection.

Rollback selects the previous candidate or published 0.4.1 package. This increment does not migrate user accounts, credentials or history.
