# Koder CLI 0.4.10-candidate.2

This isolated timeout repair starts from released 0.4.9. It is not published to
the official update feed. It keeps the existing CLI features and does not merge
the separate, unsigned locked-use prototype.

- Ordinary commands wait up to five minutes by default; direct package installs
  wait up to fifteen minutes. Explicit per-command limits can reach thirty
  minutes. Existing approvals, cancellation and unknown-effect reconciliation
  remain binding.
- Shell tool guidance distinguishes inner curl deadlines from the outer wait.
- Tool-step exhaustion now saves an explicit TASK_STEP_LIMIT notice, including
  the step count and how to continue from retained results.

See [command duration and recovery](COMMAND-DURATION.md). Native Windows
acceptance is NOT_RUN. Two baseline input-interaction failures remain recorded.
