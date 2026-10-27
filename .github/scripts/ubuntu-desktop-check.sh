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
  export XDG_SESSION_TYPE=wayland GDK_BACKEND=wayland XDG_CURRENT_DESKTOP=sway
  unset DISPLAY WAYLAND_DISPLAY
  # Mako requires layer-shell; headless Weston does not implement that protocol.
  printf 'xwayland disable\nseat seat0 fallback true\n' > "$XDG_RUNTIME_DIR/sway.conf"
  WLR_BACKENDS=headless WLR_RENDERER=pixman WLR_LIBINPUT_NO_DEVICES=1 sway --unsupported-gpu --config "$XDG_RUNTIME_DIR/sway.conf" > "$KODER_TEST_RESULTS/sway.log" 2>&1 &
  pids+=("$!")
  for i in {1..40}; do
    for socket in "$XDG_RUNTIME_DIR"/wayland-*; do
      if [[ -S "$socket" ]]; then export WAYLAND_DISPLAY="${socket##*/}"; break; fi
    done
    [[ -n "${WAYLAND_DISPLAY:-}" ]] && break
    sleep .25
  done
  [[ -n "${WAYLAND_DISPLAY:-}" ]]
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
notification_ready=false
for i in {1..40}; do
  if [[ "$(gdbus call --session --dest org.freedesktop.DBus --object-path /org/freedesktop/DBus --method org.freedesktop.DBus.NameHasOwner org.freedesktop.Notifications)" == *true* ]]; then notification_ready=true; break; fi
  sleep .25
done
[[ "$notification_ready" == true ]]
fixture=.github/scripts/ubuntu-desktop-fixture.py
if [[ "${KODER_GTK_TEST:-gtk3}" == gtk4 ]]; then fixture=.github/scripts/ubuntu-desktop-fixture-gtk4.py; export GTK_A11Y=atspi GSK_RENDERER=cairo; fi
/usr/bin/python3 "$fixture" > "$KODER_TEST_RESULTS/fixture.log" 2>&1 &
pids+=("$!")
for i in {1..40}; do [[ -s "$KODER_FIXTURE_PID" ]] && break; sleep .25; done
/usr/bin/python3 - <<'PY' > "$KODER_TEST_RESULTS/fixture-interfaces.json"
import gi, json, os
from pathlib import Path
gi.require_version('Atspi','2.0')
from gi.repository import Atspi
Atspi.set_timeout(1000,2000)
pid=int(Path(os.environ['KODER_FIXTURE_PID']).read_text())
desktop=Atspi.get_desktop(0)
rows=[]
def walk(node):
    states=node.get_state_set()
    password=node.get_role()==Atspi.Role.PASSWORD_TEXT
    rows.append({'name':'[protected input]' if password else node.get_name(),'role':node.get_role_name(),'interfaces':list(node.get_interfaces()),'enabled':states.contains(Atspi.StateType.ENABLED),'sensitive':states.contains(Atspi.StateType.SENSITIVE)})
    if not password and 'Text' in node.get_interfaces():
        count=Atspi.Text.get_character_count(node)
        try:rows[-1]['boundText']=node.get_text_iface().get_text(0,count)
        except Exception as error:rows[-1]['boundTextError']=str(error)
        rows[-1]['interfaceText']=Atspi.Text.get_text(node,0,count)
    for i in range(min(node.get_child_count(),100)):walk(node.get_child_at_index(i))
for i in range(desktop.get_child_count()):
    app=desktop.get_child_at_index(i)
    if app.get_process_id()==pid:walk(app)
print(json.dumps(rows))
PY
"$KODER_TEST_NODE" .github/scripts/ubuntu-desktop-check.mjs
