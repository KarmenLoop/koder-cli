# Koder CLI 0.5.13

Adds an Ubuntu 26.04.1 Desktop amd64 installation path and dedicated installer using the complete Linux runtime. The walkthrough covers first launch, Wayland dependencies, grants, actual operations, updates and troubleshooting. Ubuntu 24.04 support remains available.


GTK4 desktop controls now use the toolkit's native sensitivity state, while disabled controls remain blocked. Declared password fields and masked editable text are withheld from model-visible output and actions. This fixes usable GTK4 controls previously appearing with no actions.

The Ubuntu/macOS installer now ends with an immediately usable executable path, a setup command and a current-shell PATH command. It updates fresh Bash profiles and existing login files without replacing user content. Interactive activation explains that the background service does not open chat. The Ubuntu walkthrough, repository entry points and full user guides now cover every installation prompt, status output, first task and recovery step.

Archives exclude macOS extended attributes to prevent repeated `LIBARCHIVE.xattr.com.apple.provenance` warnings on Ubuntu. Program files, Skills, OCR data and the classroom remain included. New regressions cover fresh shell profiles, stale PATH markers, custom directories and opt-out behavior.

Default learning now batches directory durability barriers within each transaction phase. Previously, writing several learning documents in the same directory synchronized that directory after every document. Each staged document, published document and journal still receives its own file sync. Staging is durable before the prepared journal; published directories are durable before the committed journal. Recovery synchronizes already-visible outputs without replaying completed writes.

Default learning, all 61 bundled Personal Agent Growth resources, existing Skills, project isolation, checkpoints, cancellation and budgets remain enabled as before. This change does not remove tools or shorten the learning method.

In an instrumented macOS comparison using fresh disposable profiles and the same local model API, the published 0.5.12 runtime reached its first request in 1094.2, 973.1 and 957.7 ms. With only the learning store replaced, the results were 891.8, 878.5 and 854.8 ms. These are startup measurements on one host, not live-model speed or quality claims; slower hardware may still exceed one second. Earlier failed samples remain in the acceptance record.

New regression cases cover directory batching, durable journal ordering, abandoned staging, interruption after a rename and recovery after an I/O error. Existing learning tests cover isolation, opt-outs, concurrent access, evidence validation, recall and task-memory updates. The release attachment records exact package checks and platform results separately.

Update with `koder update`, then check `koder --version`. Windows uses the complete archive; macOS and Ubuntu retain their platform archives. The repository, stars, existing license boundary and website remain unchanged. See [installation](INSTALLATION.md), [Ubuntu setup](UBUNTU.md) and [learning controls](MARKDOWN-LEARNING.en.md).
