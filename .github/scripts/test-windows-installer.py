"""Exercise the released Windows installers in real ConPTY consoles."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse
import hashlib
import json
import re
import os
import shutil
import subprocess
import threading
import time
import urllib.request

from winpty import PtyProcess

parser = argparse.ArgumentParser()
parser.add_argument('--assets', required=True)
parser.add_argument('--out', required=True)
parser.add_argument('--public-download', action='store_true')
args = parser.parse_args()
assets = Path(args.assets).resolve()
out = Path(args.out).resolve()
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((assets / 'koder-cli-latest.json').read_text())
expected = manifest['version']
for extension, data in manifest['installers'].items():
    assert hashlib.sha256((assets / data['file']).read_bytes()).hexdigest() == data['sha256'], data['file']
assert hashlib.sha256((assets / manifest['file']).read_bytes()).hexdigest() == manifest['sha256']

# A separate probe branch can exercise bounded download recovery against a
# frozen published artifact without running unrelated acceptance cases.
if (assets / 'LIVENESS_PROBE.json').is_file():
    import sys
    assert json.loads((assets / 'LIVENESS_PROBE.json').read_text()) == {'mode':'download-liveness-only'}
    raise SystemExit(subprocess.call([sys.executable, str(Path(__file__).with_name('test-download-liveness.py')), '--assets', str(assets), '--out', str(out)]))

# A public command is exercised only when it currently serves the exact
# candidate installer. Draft candidates retain their separate local endpoint scope.
public_probe = {'matchedCandidate': False}
try:
    request = urllib.request.Request('https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1', headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(request, timeout=15) as response:
        public_bytes = response.read(512 * 1024)
    public_probe['matchedCandidate'] = hashlib.sha256(public_bytes).hexdigest() == manifest['installers']['ps1']['sha256']
    args.public_download = args.public_download or public_probe['matchedCandidate']
except Exception as error:
    public_probe['errorType'] = type(error).__name__


requests = []
stop_requests = threading.Event()
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        requests.append(self.path)
        if getattr(self.server, 'stall', None) == 'bootstrap' and self.path.endswith('.ps1'):
            stop_requests.wait(20)
            return
        if getattr(self.server, 'stall', None) == 'manifest' and self.path.endswith('/koder-cli-latest.json'):
            stop_requests.wait(20)
            return
        if getattr(self.server, 'stall', None) == 'package' and self.path.endswith('.tgz'):
            self.send_response(200)
            self.send_header('Content-Length', str((assets / manifest['file']).stat().st_size))
            self.end_headers()
            self.wfile.write((assets / manifest['file']).read_bytes()[:1024])
            self.wfile.flush()
            stop_requests.wait(20)
            return
        super().do_GET()
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(assets)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
ps = str(Path(os.environ['SystemRoot']) / 'System32/WindowsPowerShell/v1.0/powershell.exe')
rows = []
native_checks_complete = expected not in ['0.4.0-preview.10','0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19']

def environment(name):
    home = out / (name + ('-中文用户' if name in ['powershell-spaces', 'public-download', 'cmd-pasted-command', 'public-cmd-download'] else ''))
    home.mkdir()
    env = {**os.environ, 'KODER_INSTALL_BASE': base, 'KODER_INSTALL_HOME': str(home / 'install'), 'KODER_NO_ONBOARD': '1', 'USERPROFILE': str(home), 'HOME': str(home)}
    env.pop('KODER_EULA_ACCEPT', None)
    # This workflow itself runs under PowerShell 7. Its inherited module path
    # omits Windows PowerShell 5.1's inbox script modules (including Get-FileHash).
    # A normal 5.1 console includes these; restore them for this actual 5.1 child.
    inbox = str(Path(os.environ['SystemRoot']) / 'System32/WindowsPowerShell/v1.0/Modules')
    legacy = str(Path(os.environ['ProgramFiles']) / 'WindowsPowerShell/Modules')
    env['PSMODULEPATH'] = os.pathsep.join([inbox, legacy, env.get('PSMODULEPATH', '')])
    if name == 'powershell-download-runtime':
        env['PATH'] = os.pathsep.join(part for part in env['PATH'].split(os.pathsep) if not (Path(part) / 'node.exe').is_file())
    if name in ['manifest-timeout', 'package-timeout', 'bootstrap-timeout']:
        env['KODER_DOWNLOAD_TIMEOUT_SECONDS'] = '7'
    if name == 'powershell-spaces':
        env['KODER_DOWNLOAD_TIMEOUT_SECONDS'] = '100000000'
    if name == 'cmd-pasted-command':
        temporary = home / 'temp with spaces-中文'; temporary.mkdir(); env['TEMP'] = str(temporary); env['TMP'] = str(temporary)
    if name in ['public-download','public-cmd-download']:
        env.pop('KODER_INSTALL_BASE', None)
        env['PATH'] = os.pathsep.join(part for part in env['PATH'].split(os.pathsep) if not (Path(part) / 'node.exe').is_file())
    if name == 'stalled-node':
        shim = home / 'node-shim'
        shim.mkdir()
        pidfile = home / 'owned-node.pid'
        code = 'using System; using System.IO; using System.Threading; public class KoderNodeStall { public static void Main() { File.WriteAllText(Environment.GetEnvironmentVariable("KODER_STALL_PID"), System.Diagnostics.Process.GetCurrentProcess().Id.ToString()); Thread.Sleep(30000); } }'
        compile = subprocess.run([ps, '-NoProfile', '-Command', "Add-Type -TypeDefinition '" + code + "' -OutputAssembly '" + str(shim / 'node.exe') + "' -OutputType ConsoleApplication"], env=env, capture_output=True, timeout=30)
        assert compile.returncode == 0, compile.stderr.decode(errors='replace')
        env['KODER_STALL_PID'] = str(pidfile)
        env['PATH'] = str(shim) + os.pathsep + env['PATH']
    return home, env

def run_console(name, mode, answer, accepted):
    home, env = environment(name)
    pasted_command = None
    command = [ps, '-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'irm ' + base + '/koder-cli.ps1 | iex']
    if mode == 'cmd':
        command = [os.environ['COMSPEC'], '/d', '/c', str(assets / 'koder-cli.cmd')]
    if name in ['cmd-pasted-command', 'bootstrap-timeout']:
        command_text = (Path(__file__).with_name('windows-install-command.txt')).read_text().strip().replace('https://karmenloop.com/install/koder-cli.ps1', base + '/koder-cli.ps1')
        pasted_command = command_text
        command = [os.environ['COMSPEC'], '/d', '/q']
    if name == 'public-download':
        command = [ps, '-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex']
    if name == 'public-cmd-download':
        command_text = Path(__file__).with_name('windows-install-command.txt').read_text().strip()
        pasted_command = command_text
        command = [os.environ['COMSPEC'], '/d', '/q']
    if pasted_command:
        env['PROMPT'] = 'KODER_CMD_TEST$G'
    server.stall = 'bootstrap' if name == 'bootstrap-timeout' else 'manifest' if name == 'manifest-timeout' else 'package' if name == 'package-timeout' else None
    preserved = {}
    if accepted is None:
        previous = out / 'powershell-empty-then-accept/install'
        shutil.copytree(previous, home / 'install')
        config = home / '.koder-cli/config.json'
        config.parent.mkdir(exist_ok=True)
        config.write_text('{"preserve":"configuration"}\n')
        memory = home / '.koder-cli/memory/sentinel.txt'
        memory.parent.mkdir(exist_ok=True)
        memory.write_text('preserve memory\n')
        for file in [home / 'install/install.json', home / 'install/eula-acceptance.json', home / 'install/bin/koder.cmd', config, memory]:
            preserved[str(file)] = hashlib.sha256(file.read_bytes()).hexdigest()
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
    command_sent = False
    exit_sent = False
    try:
        while time.monotonic() - start < 100:
            text = ''.join(parts)
            if pasted_command and not command_sent and 'KODER_CMD_TEST>' in text:
                # This is a real paste at a CMD prompt. Passing the whole line
                # through /c adds a second quoting layer and changes $variables.
                proc.write(pasted_command + '\r')
                command_sent = True
            if pasted_command and command_sent and not exit_sent and text.count('KODER_CMD_TEST>') >= 2:
                proc.write('exit\r')
                exit_sent = True
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
        if name == 'bootstrap-timeout':
            assert not sent and not (home / 'install').exists(), 'bootstrap stall reached consent or installation'
            plain = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', text)
            assert re.search(r'Still loading installer: [5-9][0-9]*s elapsed', plain), text[-4000:]
            assert 'Installer download timed out after 7s' in plain, text[-4000:]
            assert time.monotonic() - start < 25, 'bootstrap timeout exceeded its limit'
            rows.append({'name':name,'passed':True,'seconds':round(time.monotonic()-start,2),'progressBeforeConsent':True})
            return
        assert sent, 'interactive question missing: ' + text[-1800:]
        install = home / 'install'
        assert (accepted is not True or (install / 'install.json').exists()), text[-4000:]
        if accepted is True:
            info = json.loads((install / 'install.json').read_text(encoding='utf-8-sig'))
            assert info['version'] == expected, info
            if name in ['powershell-download-runtime', 'public-download', 'public-cmd-download']:
                assert str(Path(info['node'])).lower().startswith(str(install / 'runtime').lower()), 'test did not use the downloaded runtime'
                assert Path(info['node']).is_file(), 'downloaded runtime missing'
            acceptance = json.loads((install / 'eula-acceptance.json').read_text(encoding='utf-8-sig'))
            assert acceptance['sha256'] == manifest['agreement']['sha256']
            version = subprocess.run([os.environ['COMSPEC'], '/d', '/c', str(install / 'bin/koder.cmd'), 'version'], env=env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=30)
            (home / 'version.log').write_text(version.stdout + version.stderr, encoding='utf-8')
            assert version.returncode == 0 and expected in version.stdout, version.stdout + version.stderr
        elif accepted is False:
            assert not install.exists(), 'refusal created installation state'
        else:
            assert 'Download timed out' in text or '下载超时' in text, text[-4000:]
            assert 'License accepted.' in text or '已同意使用许可' in text
            assert 'Downloading:' in text or '仍在下载' in text, 'missing heartbeat'
            assert time.monotonic() - start < 25, 'deadline did not bound the stalled transfer'
            assert all(hashlib.sha256(Path(file).read_bytes()).hexdigest() == sha for file, sha in preserved.items()), 'existing state changed'
            version = subprocess.run([os.environ['COMSPEC'], '/d', '/c', str(install / 'bin/koder.cmd'), 'version'], env=env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=30)
            (home / 'preserved-version.log').write_text(version.stdout + version.stderr, encoding='utf-8')
            assert version.returncode == 0 and expected in version.stdout, 'previous installed launcher stopped working'
        if name == 'stalled-node':
            assert (home / 'owned-node.pid').exists(), 'unresponsive node was not actually invoked'
            assert 'did not respond within 5s' in text or '5 秒内未响应' in text, text[-4000:]
            owned_pid = int((home / 'owned-node.pid').read_text())
            check = subprocess.run([ps, '-NoProfile', '-Command', 'if (Get-Process -Id ' + str(owned_pid) + ' -ErrorAction SilentlyContinue) { exit 1 }'], env=env, capture_output=True, timeout=10)
            assert check.returncode == 0, 'owned stalled Node process survived the probe deadline'
        rows.append({'name': name, 'mode': mode, 'commandWasPasted': command_sent, 'unicodeInstallPath': '中文用户' in str(home), 'promptSeen': sent, 'accepted': accepted, 'passed': True, 'seconds': round(time.monotonic() - start, 2), 'preservedFiles': len(preserved)})
    finally:
        (home / 'terminal.log').write_text(''.join(parts), encoding='utf-8')
        server.stall = None
        if proc.isalive():
            proc.terminate(force=True)

try:
    run_console('powershell-empty-then-accept', 'powershell', '\raccept\r', True)
    run_console('powershell-spaces', 'powershell', '  accept  \r', True)
    run_console('powershell-download-runtime', 'powershell', 'accept\r', True)
    run_console('powershell-refuse', 'powershell', 'decline\r', False)
    run_console('cmd-empty-then-accept', 'cmd', '\raccept\r', True)
    if expected in ('0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
        run_console('cmd-pasted-command', 'cmd', 'accept\r', True)
        run_console('bootstrap-timeout', 'cmd', '', False)
    run_console('stalled-node', 'powershell', 'accept\r', True)
    run_console('manifest-timeout', 'powershell', 'accept\r', None)
    run_console('package-timeout', 'powershell', 'accept\r', None)
    if args.public_download:
        run_console('public-download', 'powershell', 'accept\r', True)
        if expected in ('0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            run_console('public-cmd-download', 'cmd', 'accept\r', True)
    home, env = environment('redirected-input')
    run = subprocess.run([ps, '-NoLogo', '-NoProfile', '-File', str(assets / 'koder-cli.ps1')], input='accept\n', env=env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=30)
    (home / 'terminal.log').write_text(run.stdout + run.stderr, encoding='utf-8')
    assert run.returncode != 0 and not (home / 'install').exists(), 'redirected text accepted the license'
    rows.append({'name': 'redirected-input', 'passed': True})
    if expected in ['0.4.0-preview.10','0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19']:
        installation = out / 'powershell-empty-then-accept/install'
        info = json.loads((installation / 'install.json').read_text(encoding='utf-8-sig'))
        packages = [installation / 'versions' / expected]
        assert (packages[0] / 'src/mimo.mjs').is_file(), packages
        native_env = {**os.environ, 'KODER_ACCEPTANCE_PACKAGE': str(packages[0])}
        mimo = subprocess.run([info['node'], '--test', '--test-timeout=15000', str(Path(__file__).with_name('test-mimo-compat.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=60)
        (out / 'mimo-native.tap').write_text(mimo.stdout + mimo.stderr, encoding='utf-8')
        assert mimo.returncode == 0 and '# pass 10' in mimo.stdout and '# fail 0' in mimo.stdout, mimo.stdout + mimo.stderr
        (out / 'MIMO-RESULT.json').write_text(json.dumps({'passed': True, 'checks': 10, 'scope': 'Actual installed Windows package with protocol/ACP fixtures; not authenticated Xiaomi service'}) + '\n')
        if expected in ('0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            provider = subprocess.run([info['node'], '--test', '--test-timeout=15000', str(Path(__file__).with_name('test-provider-compat.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=60)
            (out / 'providers-native.tap').write_text(provider.stdout + provider.stderr, encoding='utf-8')
            assert provider.returncode == 0 and '# pass 14' in provider.stdout and '# fail 0' in provider.stdout, provider.stdout + provider.stderr
            (out / 'PROVIDERS-RESULT.json').write_text(json.dumps({'passed': True, 'checks':14, 'scope':'Installed native protocol tool loops and disabled fallback; no authenticated provider acceptance'}) + '\n')

        if expected in ('0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            consumer = subprocess.run([info['node'], '--test', '--test-timeout=15000', str(Path(__file__).with_name('test-consumer-features.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=60)
            (out / 'consumer-native.tap').write_text(consumer.stdout + consumer.stderr, encoding='utf-8')
            expected_consumer_checks = 13 if expected == '0.4.0-preview.19' else 12
            assert consumer.returncode == 0 and f'# pass {expected_consumer_checks}' in consumer.stdout and '# fail 0' in consumer.stdout, consumer.stdout + consumer.stderr
            (out / 'CONSUMER-RESULT.json').write_text(json.dumps({'passed':True,'checks':12,'scope':'Installed optional consumer features and native MiMo continuation; synthetic data only'}) + '\n')
            animation = subprocess.run(['python', str(Path(__file__).with_name('test-terminal-celebrations.py')), '--node', info['node'], '--package', str(packages[0]), '--out', str(out / 'terminal-celebrations')], capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=160)
            (out / 'terminal-celebrations.log').write_text(animation.stdout + animation.stderr, encoding='utf-8')
            assert animation.returncode == 0, animation.stdout + animation.stderr
            assert json.loads((out / 'terminal-celebrations/ANIMATION-RESULT.json').read_text())['passed']
        if expected in ('0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            acl = subprocess.run([info['node'], '--test', '--test-timeout=30000', str(Path(__file__).with_name('test-windows-memory-acl.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=100)
            (out / 'windows-memory-acl.tap').write_text(acl.stdout + acl.stderr, encoding='utf-8')
            assert acl.returncode == 0 and '# pass 3' in acl.stdout and '# fail 0' in acl.stdout, acl.stdout + acl.stderr
            (out / 'WINDOWS-ACL-RESULT.json').write_text(json.dumps({'passed':True,'checks':3,'scope':'Native Windows ACL readback, real owned directories and negative access/junction cases'}) + '\n')
            names = ['test-native-api-recovery.mjs', 'test-native-protocol-matrix.mjs', 'test-execution-permissions.mjs']
            extended = subprocess.run([info['node'], '--test', '--test-timeout=60000', *[str(Path(__file__).with_name(n)) for n in names]], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=180)
            (out / 'native-recovery-permissions.tap').write_text(extended.stdout + extended.stderr, encoding='utf-8')
            assert extended.returncode == 0 and '# tests 15' in extended.stdout and '# pass 11' in extended.stdout and '# skipped 4' in extended.stdout and '# fail 0' in extended.stdout, extended.stdout + extended.stderr
            (out / 'NATIVE-PERMISSIONS-RESULT.json').write_text(json.dumps({'passed':True,'checks':15,'passedChecks':11,'disabledContracts':4,'scope':'Actual installed package, synthetic protocol replies and owned execution policy fixtures; no provider account acceptance'}) + '\n')
            terminal = subprocess.run(['python', str(Path(__file__).with_name('test-terminal-permissions.py')), '--node', info['node'], '--package', str(packages[0]), '--out', str(out / 'terminal-permissions')], capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=75)
            (out / 'terminal-permissions.log').write_text(terminal.stdout + terminal.stderr, encoding='utf-8')
            assert terminal.returncode == 0, terminal.stdout + terminal.stderr
            assert json.loads((out / 'terminal-permissions/RESULT.json').read_text())['passed']
        if expected in ('0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            resources = subprocess.run([info['node'], '--test', '--test-timeout=60000', str(Path(__file__).with_name('test-private-resources.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=180)
            (out / 'private-resources-native.tap').write_text(resources.stdout + resources.stderr, encoding='utf-8')
            assert resources.returncode == 0 and '# pass 9' in resources.stdout and '# fail 0' in resources.stdout, resources.stdout + resources.stderr
            (out / 'PRIVATE-RESOURCES-RESULT.json').write_text(json.dumps({'passed':True,'checks':9,'scope':'Owned private ZIP fixtures, installed agent retrieval, native ACL and DPAPI; user collections never uploaded'}) + '\n')
        if expected in ('0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            remote = subprocess.run([info['node'], '--test', '--test-timeout=60000', str(Path(__file__).with_name('test-remote-resources.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=180)
            (out / 'remote-resources-native.tap').write_text(remote.stdout + remote.stderr, encoding='utf-8')
            assert remote.returncode == 0 and '# pass 8' in remote.stdout and '# fail 0' in remote.stdout, remote.stdout + remote.stderr
            (out / 'REMOTE-RESOURCES-RESULT.json').write_text(json.dumps({'passed':True,'checks':8,'scope':'Installed lazy remote transport, task tool loop, validation, cancellation and private-query separation; synthetic responses'}) + '\n')
        if expected in ('0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19'):
            audit = subprocess.run([info['node'], '--test', '--test-timeout=60000', str(Path(__file__).with_name('test-provider-audit.mjs'))], env=native_env, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=180)
            (out / 'provider-audit-native.tap').write_text(audit.stdout + audit.stderr, encoding='utf-8')
            assert audit.returncode == 0 and '# pass 12' in audit.stdout and '# fail 0' in audit.stdout, audit.stdout + audit.stderr
            (out / 'PROVIDER-AUDIT-RESULT.json').write_text(json.dumps({'passed':True,'checks':12,'scope':'Installed terminal-stream, live HTTP keep-alive tool-loop, diagnostics, tutorial model IDs and reasoning continuity; synthetic model replies'}) + '\n')
            liveness = subprocess.run([os.sys.executable, str(Path(__file__).with_name('test-download-liveness.py')), '--assets', str(assets), '--out', str(out / 'download-liveness')], capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=60)
            (out / 'download-liveness.log').write_text(liveness.stdout + liveness.stderr, encoding='utf-8')
            assert liveness.returncode == 0 and json.loads((out / 'download-liveness/LIVENESS-RESULT.json').read_text())['passed'], liveness.stdout + liveness.stderr
        native_checks_complete = True


finally:
    report = {'passed': native_checks_complete and len(rows) == ((13 if args.public_download else 11) if expected in ('0.4.0-preview.11','0.4.0-preview.12','0.4.0-preview.13','0.4.0-preview.14','0.4.0-preview.15','0.4.0-preview.17','0.4.0-preview.18','0.4.0-preview.19') else (10 if args.public_download else 9)) and all(r['passed'] for r in rows), 'installedAcceptanceComplete': native_checks_complete, 'version': expected, 'powershell': ps, 'windows': subprocess.run(['cmd', '/c', 'ver'], capture_output=True, text=True).stdout.strip(), 'checks': rows, 'requests': requests, 'publicCommandTested': args.public_download, 'publicProbe': public_probe}
    (out / 'RESULT.json').write_text(json.dumps(report, indent=2) + '\n')
    stop_requests.set()
    server.shutdown()
    if report['passed']:
        # All installations are disposable owned test fixtures. Keep terminal,
        # result and retained-state evidence, not repeated runtime binaries.
        for home in out.iterdir():
            if home.is_dir() and (home / 'install').is_dir():
                shutil.rmtree(home / 'install')
    print(json.dumps(report))
