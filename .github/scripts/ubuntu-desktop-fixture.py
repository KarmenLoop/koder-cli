"""An owned GTK fixture; no user application or account is touched."""
import gi
import os
from pathlib import Path

gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib
GLib.set_prgname('koder-ubuntu-fixture')
GLib.set_application_name('Koder Ubuntu Fixture')
window = Gtk.Window(title='Koder Ubuntu Fixture')
window.set_default_size(480, 240)
box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
window.add(box)
entry = Gtk.Entry()
entry.get_accessible().set_name('Koder fixture input')
box.pack_start(entry, False, False, 0)
secret = Gtk.Entry()
secret.set_visibility(False)
secret.set_text('fixture-only-hidden-value')
secret.get_accessible().set_name('Koder protected fixture')
box.pack_start(secret, False, False, 0)
button = Gtk.Button(label='Apply fixture value')
box.pack_start(button, False, False, 0)
result = Gtk.Label(label='Fixture waiting')
box.pack_start(result, False, False, 0)
button.connect('clicked', lambda _: result.set_text('Fixture result: ' + entry.get_text()))
window.connect('destroy', Gtk.main_quit)
def credential_check():
    if entry.get_text() == 'credential-fixture-account' and secret.get_text() == 'credential-fixture-password':
        Path(os.environ['KODER_TEST_RESULTS'], 'credential-filled.json').write_text('{"account":true,"password":true}')
    return True
GLib.timeout_add(50, credential_check)

window.show_all()
Path(os.environ['KODER_FIXTURE_PID']).write_text(str(os.getpid()))
Gtk.main()
