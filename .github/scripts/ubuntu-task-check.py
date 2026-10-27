"""Exercise a distributed CLI in an owned Linux PTY with a slow local API.

The HTTP server is a deterministic provider fixture, not a real model account.
The CLI, terminal editor, learning initialization and HTTP transport are real.
"""
from pathlib import Path
import errno, hashlib, http.server, json, os, pty, re, select, signal
import subprocess, tarfile, threading, time

root = Path.cwd()
out = root / 'ubuntu-task-results'
out.mkdir(exist_ok=True)
manifest = json.loads((root / 'candidate/koder-cli-latest.json').read_text())
package = manifest['packages']['linux']
archive = root / 'candidate' / package['file']
assert hashlib.file_digest(archive.open('rb'), 'sha256').hexdigest() == package['sha256']
assert archive.stat().st_size == package['size']
payload = root / 'ubuntu-task-payload'
with tarfile.open(archive) as z:
    for m in z:
        assert not m.issym() and not m.islnk()
        assert not Path(m.name).is_absolute() and '..' not in Path(m.name).parts
    z.extractall(payload, filter='data')
runtime = payload / 'koder-cli'
scope = subprocess.run(['node', '--test', '.github/scripts/ubuntu-file-scope.test.mjs'], env={**os.environ, 'KODER_TEST_RUNTIME': str(runtime)}, capture_output=True, text=True, timeout=30)
(out / 'file-scope.tap').write_text(scope.stdout + scope.stderr)
assert scope.returncode == 0, scope.stdout + scope.stderr
learning = subprocess.run(['node', '--test', '.github/scripts/windows-vm/learning-store-batching.test.mjs'], env={**os.environ, 'KODER_ACCEPTANCE_PACKAGE': str(runtime)}, capture_output=True, text=True, timeout=30)
(out / 'learning-store.tap').write_text(learning.stdout + learning.stderr)
assert learning.returncode == 0, learning.stdout + learning.stderr
requests = []
rows = []

class Model(http.server.BaseHTTPRequestHandler):
    def log_message(self, *_): pass
    def do_POST(self):
        data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        requests.append({'at': time.monotonic(), 'messages': len(data.get('messages', []))})
        latest = str(next((m.get('content', '') for m in reversed(data.get('messages', [])) if m.get('role') == 'user'), ''))
        reply = 'UBUNTU_AFTER_CANCEL_OK' if 'AFTER_CANCEL' in latest else 'UBUNTU_CANCEL_SHOULD_NOT_APPEAR' if 'CANCEL_TARGET' in latest else 'UBUNTU_SLOW_REPLY_OK'
        if reply != 'UBUNTU_AFTER_CANCEL_OK':
            time.sleep(20)  # Exceeds the old 15-second header timer, not the total budget.
        body = json.dumps({'choices': [{'message': {'role': 'assistant', 'content': reply}, 'finish_reason': 'stop'}], 'usage': {'prompt_tokens': 12, 'completion_tokens': 6}}).encode()
        try:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Model)
threading.Thread(target=server.serve_forever, daemon=True).start()
home = root / 'ubuntu-task-home'
home.mkdir(exist_ok=True)
workspace = home / 'project'
workspace.mkdir(exist_ok=True)
env = {k: v for k, v in os.environ.items() if k in ('PATH', 'LANG', 'LC_ALL', 'TMPDIR')}
env.update(HOME=str(home), USERPROFILE=str(home), KODER_CLI_HOME=str(home), TERM='xterm-256color', NO_COLOR='1', KODER_API_DIAGNOSTICS='1')
(home / 'config.json').write_text(json.dumps({'language': 'en'}))
(home / 'provider.json').write_text(json.dumps({'model': 'slow-fixture', 'baseUrl': 'http://127.0.0.1:%s/v1' % server.server_port, 'auth': 'none', 'contextWindow': 64000}))
prep = "import {writeAcceptance} from %s; writeAcceptance(process.env);" % json.dumps((runtime / 'src/eula.mjs').as_uri())
subprocess.run(['node', '--input-type=module', '-e', prep], env=env, check=True, timeout=15)
pid, fd = pty.fork()
if pid == 0:
    os.chdir(workspace)
    os.execvpe('node', ['node', str(runtime / 'bin/koder.mjs'), 'chat', '-w', str(workspace)], env)

raw = bytearray()
sent = False
started = time.monotonic()
success = False
try:
    while time.monotonic() - started < 75:
        ready, _, _ = select.select([fd], [], [], .2)
        if ready:
            try: chunk = os.read(fd, 65536)
            except OSError as e:
                if e.errno == errno.EIO: break
                raise
            if not chunk: break
            raw.extend(chunk)
        clean = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', raw.decode(errors='replace'))
        if not sent and re.search(r'koder\s*[>›❯]', clean, re.I):
            os.write(fd, b'Hello, reply with the ready marker.\r')
            sent = True
        if 'UBUNTU_SLOW_REPLY_OK' in clean:
            success = True
            break
        if sent and 'API_HEADERS_TIMEOUT' in clean and len(requests) >= 3:
            break
    rows.append({'name': 'interactive-slow-first-response', 'passed': sent and success and len(requests) == 1 and 'MODEL_WAIT' in clean, 'submitted': sent, 'replyObserved': success, 'requestCount': len(requests), 'waitingStatusVisible': 'MODEL_WAIT' in clean, 'seconds': round(time.monotonic()-started, 3)})
    def observe_until(predicate, seconds):
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            ready, _, _ = select.select([fd], [], [], .1)
            if ready:
                try: chunk = os.read(fd, 65536)
                except OSError as error:
                    if error.errno == errno.EIO: return False
                    raise
                if not chunk: return False
                raw.extend(chunk)
            text = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', raw.decode(errors='replace'))
            if predicate(text): return True
        return False
    if rows[0]['passed']:
        observe_until(lambda _: False, .5)  # Let final output settle; no action replay.
        os.write(fd, b'Reply to CANCEL_TARGET only after waiting.\r')
        assert observe_until(lambda _: len(requests) == 2, 10), 'Second model request must start before cancellation'
        cancel_at = time.monotonic()
        os.write(fd, b'\x03')
        cancelled = observe_until(lambda text: bool(re.search(r'ABORT_ERR:|Cancelled\.|已取消当前执行', text)), 5)
        assert cancelled, 'Busy Ctrl+C must report cancellation without closing chat'
        observe_until(lambda _: False, .5)
        os.write(fd, b'AFTER_CANCEL: reply with the recovery marker.\r')
        recovered = observe_until(lambda text: 'UBUNTU_AFTER_CANCEL_OK' in text, 10)
        clean = raw.decode(errors='replace')
        rows.append({'name': 'busy-cancel-and-next-turn', 'passed': cancelled and recovered and len(requests) == 3 and 'UBUNTU_CANCEL_SHOULD_NOT_APPEAR' not in clean, 'cancelObserved': cancelled, 'nextTurnReplyObserved': recovered, 'requestCount': len(requests), 'seconds': round(time.monotonic()-cancel_at, 3)})
finally:
    try: os.write(fd, b'\x03')
    except OSError: pass
    # Only the process group created by this fixture is stopped.
    try: os.killpg(pid, signal.SIGTERM)
    except ProcessLookupError: pass
    os.waitpid(pid, 0)
    os.close(fd)
    server.shutdown()
    (out / 'terminal.txt').write_bytes(raw)
    receipt = {'version': manifest['version'], 'artifactSha256': package['sha256'], 'osRelease': Path('/etc/os-release').read_text(), 'machine': os.uname().machine, 'provider': 'loopback fixture; real provider NOT_RUN', 'learningDisabled': False, 'rows': rows}
    (out / 'result.json').write_text(json.dumps(receipt, indent=2)+'\n')
assert rows and all(r['passed'] for r in rows), rows
