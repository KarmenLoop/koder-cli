#!/usr/bin/env bash
set -euo pipefail
source ubuntu-env
export KODER_TEST_RUNTIME KODER_TEST_RESULTS
export XDG_RUNTIME_DIR="$RUNNER_TEMP/koder-xdg-$KODER_DISPLAY_TEST"
mkdir -p "$XDG_RUNTIME_DIR"
chmod 700 "$XDG_RUNTIME_DIR"
export KODER_FIXTURE_PID="$XDG_RUNTIME_DIR/fixture.pid"
export GTK_MODULES=atk-bridge NO_AT_BRIDGE=0
pids=()
cleanup() { for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done; }
trap cleanup EXIT
if [[ "$KODER_DISPLAY_TEST" == wayland ]]; then
  export XDG_SESSION_TYPE=wayland WAYLAND_DISPLAY=wayland-koder GDK_BACKEND=wayland
  unset DISPLAY
  weston --backend=headless-backend.so --socket="$WAYLAND_DISPLAY" --idle-time=0 > "$KODER_TEST_RESULTS/weston.log" 2>&1 &
  pids+=("$!")
  for i in {1..40}; do [[ -S "$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY" ]] && break; sleep .25; done
  mako > "$KODER_TEST_RESULTS/notifications.log" 2>&1 &
  pids+=("$!")
else
  export XDG_SESSION_TYPE=x11 DISPLAY=:99 GDK_BACKEND=x11
  unset WAYLAND_DISPLAY
  Xvfb :99 -screen 0 1280x800x24 -nolisten tcp > "$KODER_TEST_RESULTS/xvfb.log" 2>&1 &
  pids+=("$!")
  for i in {1..40}; do xdpyinfo -display "$DISPLAY" >/dev/null 2>&1 && break; sleep .25; done
  openbox > "$KODER_TEST_RESULTS/openbox.log" 2>&1 &
  pids+=("$!")
  dunst > "$KODER_TEST_RESULTS/notifications.log" 2>&1 &
  pids+=("$!")
fi
/usr/bin/python3 .github/scripts/ubuntu-desktop-fixture.py > "$KODER_TEST_RESULTS/fixture.log" 2>&1 &
pids+=("$!")
for i in {1..40}; do [[ -s "$KODER_FIXTURE_PID" ]] && break; sleep .25; done
"$KODER_TEST_NODE" .github/scripts/ubuntu-desktop-check.mjs
