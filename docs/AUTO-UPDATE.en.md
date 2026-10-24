# Automatic updates in the current conversation

0.4.8 fixes `createAutomaticUpdater is not defined` when automatic updates are enabled inside chat. Previously the setting was saved, but the current window could not restart its updater. The same window now checks for a release and installs it when tasks, queued input and drafts are clear, then resumes the conversation.

## Turn updates on or off

In Koder chat, use `/update auto on` or say “enable automatic updates.” Use `/update auto off` or “disable automatic updates” to turn them off. `/update auto status` or “show automatic update status” reads the current setting. You can turn updates off and back on in the same window. No model is needed for these local settings.

From a system terminal, run `koder update auto on`, then enter `koder`. Official managed interactive installations check at chat startup and every six hours while running. Installation waits for idle input; the background download leaves task input usable. The installer and archive are verified before a restart is requested. Closing the conversation cancels its update job; this feature does not start another service when no terminal is open.

## Boundaries

`ask` and plan/report/enhance modes only inspect settings. `KODER_AUTO_UPDATE=0` remains an explicit process opt-out, even if the saved preference is on. CI, noninteractive sessions and unmanaged source checkouts do not install in the background. Changed license text requires renewed consent. Network or integrity failures retain the current installation and report failure; a manual retry remains available.

Software updates and Setup → Model → Automatic model updates are separate settings. Model discovery does not replace the software or switch the selected model.

## Upgrade an affected copy

Run `koder update` once to obtain the fix, then check that `koder --version` reports 0.4.8. That initial upgrade installs code the affected version does not have; once updated, enabling automatic updates needs no additional manual update. If a 0.4.4-or-earlier updater rejects the larger manifest, run the current official installer in place without deleting settings or history.

The 57 update regressions cover actual chat routing, natural-language settings, isolated installer subprocesses, toggling, responsive input, changed licenses and conversation recovery. Fixtures do not certify native Windows consoles or physical client installations.
