# 30. Graduation

Allow 90 minutes

**Goal**：Deliver a runnable, previewable project with verifiable results and a sourced written artifact.

**Preparation**：Choose a small website, app or presentation task in a separate Koder Projects directory. Use synthetic data and authorize deployment or GitHub writes separately.

## Hands-on steps

1. Write a brief with audience, goal, content, exclusions, artifact paths and checks. For a site, request three browsable layouts first.

   **Check**：Requirements map to files and behavior; refine the chosen direction.

2. Implement and test; for a static site use /preview start --directory site in the current chat after verifying the directory.

   **Check**：The local artifact opens. For framework projects, start the documented dev server before connecting its preview URL.

3. Change a heading and inspect preview updates, narrow layout, keyboard access, links and empty data.

   **Check**：Refresh/reload shows actual edits; a screenshot alone is insufficient.

4. Request an H5 project map covering directories, entry points, modules, data flow, checks and unconnected services, grounded in actual files.

   **Check**：The map opens in a browser and its nodes are traceable; demo services are not described as live.

5. Write intro.md for technical decision-makers and a release email without a change list that explicitly avoids increment claims.

   **Check**：Primary files meet length/audience requirements with sources, limits and next steps, not invented pricing or features.

6. Deliver README, test results, preview instructions, map, writing and untested items; close with /preview stop.

   **Check**：Another person can reproduce the result. Upload or deploy only through a separately approved flow.

## Troubleshooting and recovery

- **Preview reports not-running**：Preview belongs to its owning process. Use the same chat; stop a standalone start with Ctrl+C rather than expecting another process to see it.
- **A report exists but project files do not**：Check each artifact against the brief; mark missing files incomplete and finish them.

## Assignment and acceptance

Submit README, runnable files, test logs, project-map.html, intro.md, release-email.md and an untested list. Exclude secrets, account caches and node_modules.

**Acceptance**：Check runnability, explanation, validation, recovery and grounded facts. Report gaps; screenshots do not replace execution and fixtures do not prove live-account success.

## Developer track

1. Reproduce from a clean test directory using README and check the failure baseline, minimal diff, tests and package files.

2. Keep static previews local and never expose the home directory. Netlify login, site selection and deployment use existing approval flows.

3. Record version, hashes, commands, exit codes and platform; distinguish real Windows, models, accounts and signing.

4. Use the 30-lesson checklist to retain both regression and new-feature evidence.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 30 of 30 · Graduation ━━
Coach › Congratulations, you've graduated! A cheat sheet for the road:
    koder setup
        the settings screen, arrow keys or mouse
    koder
        start a chat
    koder "task"
        get to work
    koder ask "question"
        read-only question
    koder review
        code review
    koder fix --check "cmd"
        fix until green
    koder test file
        add tests
    koder flow run flow
        run a flow
    koder --moa "task"
        several models think together
    koder gateway setup platform
        connect a chat app
    koder scan
        scan local projects
    koder help command
        details for any command
    koder learn number
        revisit a lesson
Coach › Next: set up a model with koder setup, then type koder in your own project.
  Tip · Go to your project: cd D:\code\my-app, then type koder.
  (whispering) The coach is off duty. Remember: Koder proposes, you decide, and the blame… we share.
  · At the end you can keep the practice project or delete it.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 30 of 30 · Graduation ━━
Coach › Congratulations, you've graduated! A cheat sheet for the road:
    koder setup
        the settings screen, arrow keys or mouse
    koder
        start a chat
    koder "task"
        get to work
    koder ask "question"
        read-only question
    koder review
        code review
    koder fix --check "cmd"
        fix until green
    koder test file
        add tests
    koder flow run flow
        run a flow
    koder --moa "task"
        several models think together
    koder gateway setup platform
        connect a chat app
    koder scan
        scan local projects
    koder help command
        details for any command
    koder learn number
        revisit a lesson
Coach › Next: set up a model with koder setup, then type koder in your own project.
  Tip · Go to your project: cd /d D:\code\my-app, then type koder. Changing drives needs /d, or CMD changes the path but stays on the old drive. Family tradition.
  (whispering) The coach is off duty. Remember: Koder proposes, you decide, and the blame… we share.
  · At the end you can keep the practice project or delete it.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 30 of 30 · Graduation ━━
Coach › Congratulations, you've graduated! A cheat sheet for the road:
    koder setup
        the settings screen, arrow keys or mouse
    koder
        start a chat
    koder "task"
        get to work
    koder ask "question"
        read-only question
    koder review
        code review
    koder fix --check "cmd"
        fix until green
    koder test file
        add tests
    koder flow run flow
        run a flow
    koder --moa "task"
        several models think together
    koder gateway setup platform
        connect a chat app
    koder scan
        scan local projects
    koder help command
        details for any command
    koder learn number
        revisit a lesson
Coach › Next: set up a model with koder setup, then type koder in your own project.
  Tip · Go to your project: cd ~/code/my-app, then type koder.
  (whispering) The coach is off duty. Remember: Koder proposes, you decide, and the blame… we share.
  · At the end you can keep the practice project or delete it.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 30 of 30 · Graduation ━━
Coach › Congratulations, you've graduated! A cheat sheet for the road:
    koder setup
        the settings screen, arrow keys or mouse
    koder
        start a chat
    koder "task"
        get to work
    koder ask "question"
        read-only question
    koder review
        code review
    koder fix --check "cmd"
        fix until green
    koder test file
        add tests
    koder flow run flow
        run a flow
    koder --moa "task"
        several models think together
    koder gateway setup platform
        connect a chat app
    koder scan
        scan local projects
    koder help command
        details for any command
    koder learn number
        revisit a lesson
Coach › Next: set up a model with koder setup, then type koder in your own project.
  Tip · Go to your project: cd ~/code/my-app, then type koder.
  (whispering) The coach is off duty. Remember: Koder proposes, you decide, and the blame… we share.
  · At the end you can keep the practice project or delete it.
```

</details>
