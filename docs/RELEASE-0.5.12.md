# Koder CLI 0.5.12

Model requests previously used a 15-second response-header deadline as though it measured the network connection alone. A server that queued or generated a response for longer could receive three repeated requests and still leave the task unanswered. The default header deadline is now 180 seconds. Header timeouts do not automatically resend inference requests. The overall 10-minute request deadline, 90-second response-idle deadline, cancellation and task receipts remain intact.

Interactive tasks show `MODEL_WAIT` with elapsed time and the current stage limit every 10 seconds until visible model content arrives. Set `KODER_API_HEADERS_TIMEOUT_MS` to change the header deadline, up to 600000 milliseconds. The older explicit `KODER_API_CONNECT_TIMEOUT_MS` setting remains a fallback alias. A provider outage or invalid model configuration still needs to be resolved; a longer deadline does not make an unavailable provider work.

The Ubuntu/macOS installer now shows downloaded MB, total MB and percentage when the manifest provides a size, elapsed time, average transfer rate and attempt count. If a response has no known total, it says so. Verification, extraction and activation have separate status lines. Interrupted downloads keep their existing resume checkpoints, and checksum failures cannot activate a partial package.

Broad file grants no longer require the scope root itself to be writable. An ordinary Ubuntu user can authorize `/` and operate a writable project beneath `/home`; each actual file operation still enforces the approved scope, symlink checks and OS access rights. `koder permissions request --mode full` requires explicit owner confirmation. This does not grant root privileges, install dependencies silently or remove task approvals.

The regression workflow submits a task in a real Ubuntu 24.04 pseudo-terminal against a local API that withholds headers for 20 seconds. The release acceptance attachment records x64/ARM64 results, exact package hashes and separate desktop results. This deterministic API fixture is not a live provider or proof of every network condition. Physical GNOME, all GPUs and real mailbox accounts remain separate acceptance items.

Use `koder update` or the [dedicated Ubuntu installer](UBUNTU.md). The same platform archives retain their existing Skills, learning resources and runtime features. No website deployment is included.
