# Universal app use and tutorial learning

Installed-application discovery, native launch and task-local permission prompts ship in 0.5.16. Platform limits and real GUI acceptance remain explicit below.

## Use and configure

`builtin:universal-app-use` ships enabled in the normal `koder`, `koder chat` and `koder run` paths. The system prompt provides a short pointer and runtime settings; `skill_read` loads the method on demand. The old `builtin:app-use-and-learn` ID reads the same method, and its saved off state is respected.

Open `/setup` or `koder setup` → **Skills** → **Universal app use**. **Enable universal app use** and **Learn unfamiliar workflows** are independent switches. Confirmed disable-all includes this method. Reopen a session to apply settings; returning from Setup in chat applies them on the next turn. Tutorial reads also check the current setting before each request. Mid-turn steering keeps the original execution owner and learning allowance.

Merge this object into `$KODER_CLI_HOME/config.json` (normally `~/.koder-cli/config.json`), retaining other fields:

```json
{"universalAppUse":{"enabled":true,"learnWhenUnknown":true,"preferMcpOverGui":true,"maxLearnFetches":3,"maxRecoverAttempts":2,"allowSkillProposeOnSuccess":false}}
```

Missing fields use these defaults. Partial saves preserve existing fields. `enabled:false` disables the canonical Skill at runtime; Setup also persists its ID in `disabledSkills`. The old alias is respected. Re-enabling removes only these two off entries, not other Skill preferences or permission records.

`maxLearnFetches` accepts integers 0–20; `maxRecoverAttempts` accepts 0–10. Zero disables automatic tutorial fetches or recovery after an initial failure. Connected Apps/MCP that cover the task come first by default, then browser, then desktop. Explicit `preferMcpOverGui:false` permits an equally suitable, independently authorized GUI after inspecting connections. `allowSkillProposeOnSuccess:true` only permits a candidate through the original maintenance/learning approval; it never activates a Skill automatically.

## Installed apps and in-task access

For an installed application, call `app_use_status` with `target: "local-app"` and a short name query. Its installed-app entries contain an exact ID, name and location. Clarify duplicate names instead of selecting the first match. A covering, connected Apps/MCP tool still takes priority.

`app_use_prepare` accepts that ID and only the needed `desktop`, `browser` and `network` capabilities. Missing Koder grants produce a fresh foreground `GRANT` prompt with the exact scope and target. Existing grants are reused. Opening an app requires an `OPEN` confirmation; a grant that explicitly includes this launch needs only one confirmation. Agentd sends the request to the original foreground input owner. Headless and remote channels cannot supply consent, and `--yes` does not grant access. Revoke future Koder access with `koder permissions revoke`.

Use `koder apps local list` or `koder apps local list Calculator` without a model to inspect registrations. Copy the entire returned `local-app:` ID into `koder apps local open <app ID>`. Windows uses Start Apps and AppsFolder; macOS uses installed `.app` bundles and `/usr/bin/open`; Linux uses registered `.desktop` entries and `gio launch`. Scans cover at most 2,048 entries with a roughly three-second traversal budget; the Windows query has a ten-second timeout. Partial coverage is reported. Agent discovery pages contain at most 25 matches; `offset` reads the next page.

A `submitted` receipt confirms only that the native launcher returned. Continue with fresh `computer_capture` observations and approved `computer_act` actions, or a covering connected tool. This module does not add a macOS input driver. Linux retains its existing AT-SPI adapter; Windows retains Windows-MCP or an injected host driver. OS consent, a usable desktop, driver dependencies and application login remain separate. Registration changes during confirmation stop the launch. Unknown launch results survive steering and restored transcripts without an automatic replay.

## Operation contract

Identify the target and observable outcome. Discover actual connections and schemas. Reuse `koder-computer:browser-work`, `ecosystem:agent-browser:core`, `koder-computer:local-files` and existing Apps/MCP as needed. A catalog entry is not a connected driver.

Use a known tool or local playbook directly. Otherwise, or after a safe first UI mismatch, consult official documentation, the help center or in-app help before reputable public tutorials. Read the page, state short steps, operate with fresh observations, and report source URLs and the observed result or blocker. Known public help URLs can use `app_guide`; available authorized search/browser tools can locate sources. GitHub repository search is not general web search. Never invent sources or claim an operation succeeded from a plan or click alone.

`learnWhenUnknown:false` prohibits automatic tutorial search/fetch for unfamiliar workflows. It preserves known tools and local playbooks, and does not globally disable unrelated research explicitly requested by the user.

Missing access points users to `koder permissions status`, `koder permissions request --capability network --capability browser` (or desktop), `koder apps list/connect`, or `koder mcp list/enable`. These are user setup instructions, not self-authorization. `--yes` does not grant computer access. Use secure local login flows, never plaintext passwords in chat or memory. Do not install unfamiliar software, elevate privileges or change system security. A denied action cannot be bypassed through another channel. An unknown send/submit result requires reconciliation before retry.

## Enforced limits and policy limits

`app_use_status` reads actual channel/grant/driver state and settings. It does not install, grant access or operate apps. `app_guide` uses the existing network permission and public-page transport: anonymous HTTPS GET, no cookies or scripts, no credential URLs/private targets/cross-origin redirects, at most two same-origin redirects, 256 KiB response, 12,000 characters and 12 seconds. It rechecks cancellation/revocation and returns actual title, URL, text, hash and timestamp. Source text is untrusted; an official-looking URL is not verified ownership.

The tutorial helper enforces attempts per root user turn, including failed and concurrent calls. Steering does not reset this allowance. Disabled learning, a disabled method and zero allowance reject before a request. Tutorial use of other connected search/browser tools and the recovery-attempt limit are model workflow constraints with runtime hints, not a new universal interception layer. Core task budgets, permission gates, cancellation and receipts remain authoritative.

## Platform and acceptance

This adds no GUI driver or browser engine. Direct computer tools require an actual host-provided driver. A configured Windows-MCP or browser connection can use the original Apps/MCP route. Missing drivers are reported honestly; permission alone does not install one. `workspace_preview` remains local-project preview. Unknown applications get path/install guidance, not silent installation.

Manual checks in an isolated workspace with an authorized test account:

1. In chat, with browser/network grants and a working browser channel, open https://example.com and read its title through actual tools. Prefer a covering connected tool when present. Record Windows and macOS separately.
2. Without grants, confirm a fresh scope/target prompt. Decline it and verify no grant, launch, capture, click or tutorial request. Accept it in a separate case and inspect the actual OS/driver status before continuing. Headless and remote channels must return setup guidance, not manufacture consent.
3. On an unfamiliar harmless workflow or safe locator mismatch, verify a real help read, URL, short plan, resumed operation and observed outcome. Check default learning/recovery limits and UNKNOWN reconciliation.
4. Turn the method off in Setup, reopen chat/run and confirm no automatic hook/catalog entry or canonical/alias read. Repeat with manual config and disable-all.
5. Keep the method on but learning off: known tools still work, unknown workflows do not automatically search, and app_guide rejects before networking.
6. Repeat the ungranted case with `--yes`; grants must remain unchanged. Missing software must not trigger installation or elevation.

Local scripted-model, synthetic-GUI and owned stdio MCP tests establish invocation and permission behavior, not real-model competence or native Windows/macOS/Linux GUI coverage. Those device/model/account checks remain NOT_RUN. Earlier failures and release gates remain recorded separately.

CLI discovery also accepts `--offset` for paging. Catalog failures report a reason and return a nonzero exit code. Linux discovery matches registered localized and original names and accepts standard Flatpak deployment exports; other out-of-catalog links remain excluded.

References: [Windows Start Apps](https://learn.microsoft.com/en-us/powershell/module/startlayout/get-startapps?view=windowsserver2025-ps), [desktop-entry locale matching](https://specifications.freedesktop.org/desktop-entry/latest/localized-keys.html), [GIO application launch](https://docs.gtk.org/gio/method.AppInfo.launch.html), and [macOS accessibility consent](https://support.apple.com/en-ie/guide/mac-help/mh43185/27/mac/27).
