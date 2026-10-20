"""Exercise the released Windows installers in real ConPTY consoles."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import threading
import time

from winpty import PtyProcess

parser = argparse.ArgumentParser()
parser.add_argument('--assets', required=True)
parser.add_argument('--out', required=True)
args = parser.parse_args()
assets = Path(args.assets).resolve()
out = Path(args.out).resolve()
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((assets / 'koder-cli-latest.json').read_text())
expected = manifest['version']
for extension, data in manifest['installers'].items():
    assert hashlib.sha256((assets / data['file']).read_bytes()).hexdigest() == data['sha256']
assert hashlib.sha256((assets / manifest['file']).read_bytes()).hexdigest() == manifest['sha256']

requests = []
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        requests.append(self.path)
        super().do_GET()
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(assets)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
ps = str(Path(os.environ['SystemRoot']) / 'System32/WindowsPowerShell/v1.0/powershell.exe')
rows = []

def environment(name):
    home = out / name
    home.mkdir()
    env = {**os.environ, 'KODER_INSTALL_BASE': base, 'KODER_INSTALL_HOME': str(home / 'install'), 'KODER_NO_ONBOARD': '1', 'USERPROFILE': str(home), 'HOME': str(home)}
    env.pop('KODER_EULA_ACCEPT', None)
    return home, env

def run_console(name, mode, answer, accepted):
    home, env = environment(name)
    command = [ps, '-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'irm ' + base + '/koder-cli.ps1 | iex']
    if mode == 'cmd':
        command = [os.environ['COMSPEC'], '/d', '/c', str(assets / 'koder-cli.cmd')]
    proc = PtyProcess.spawn(command, env=env, dimensions=(45, 160))
    parts = []
    def read():
        try:
            while True:
                parts.append(proc.read(65536))
        except (EOFError, OSError):
            pass
    reader = threading.Thread(target=read, daemon=True)
    reader.start()
    start = time.monotonic()
    sent = False
    try:
        while time.monotonic() - start < 100:
            text = ''.join(parts)
            if not sent and 'accept / decline:' in text:
                proc.write(answer)
                sent = True
            if not proc.isalive():
                break
            time.sleep(.05)
        else:
            raise AssertionError('owned installer exceeded 100 seconds')
        reader.join(2)
        text = ''.join(parts)
        (home / 'terminal.log').write_text(text, encoding='utf-8')
        assert sent, 'interactive question missing: ' + text[-1800:]
        install = home / 'install'
        if accepted:
            info = json.loads((install / 'install.json').read_text(encoding='utf-8-sig'))
            assert info['version'] == expected, info
            acceptance = json.loads((install / 'eula-acceptance.json').read_text(encoding='utf-8-sig'))
            assert acceptance['sha256'] == manifest['agreement']['sha256']
            version = subprocess.run([os.environ['COMSPEC'], '/d', '/c', str(install / 'bin/koder.cmd'), 'version'], env=env, capture_output=True, text=True, timeout=30)
            (home / 'version.log').write_text(version.stdout + version.stderr, encoding='utf-8')
            assert version.returncode == 0 and expected in version.stdout, version.stdout + version.stderr
        else:
            assert not install.exists(), 'refusal created installation state'
        rows.append({'name': name, 'mode': mode, 'promptSeen': sent, 'accepted': accepted, 'passed': True})
    finally:
        if proc.isalive():
            proc.terminate(force=True)

try:
    run_console('powershell-empty-then-accept', 'powershell', '\raccept\r', True)
    run_console('powershell-spaces', 'powershell', '  accept  \r', True)
    run_console('powershell-refuse', 'powershell', 'decline\r', False)
    run_console('cmd-empty-then-accept', 'cmd', '\raccept\r', True)
    home, env = environment('redirected-input')
    run = subprocess.run([ps, '-NoLogo', '-NoProfile', '-File', str(assets / 'koder-cli.ps1')], input='accept\n', env=env, capture_output=True, text=True, timeout=30)
    (home / 'terminal.log').write_text(run.stdout + run.stderr, encoding='utf-8')
    assert run.returncode != 0 and not (home / 'install').exists(), 'redirected text accepted the license'
    rows.append({'name': 'redirected-input', 'passed': True})
finally:
    report = {'passed': len(rows) == 5 and all(r['passed'] for r in rows), 'version': expected, 'powershell': ps, 'windows': subprocess.run(['cmd', '/c', 'ver'], capture_output=True, text=True).stdout.strip(), 'checks': rows, 'requests': requests}
    (out / 'RESULT.json').write_text(json.dumps(report, indent=2) + '\n')
    server.shutdown()
    print(json.dumps(report))
