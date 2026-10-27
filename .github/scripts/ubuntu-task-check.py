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
requests = []
rows = []

class Model(http.server.BaseHTTPRequestHandler):
    def log_message(self, *_): pass
    def do_POST(self):
        data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        requests.append({'at': time.monotonic(), 'messages': len(data.get('messages', []))})
        time.sleep(20)  # Exceeds the old 15-second header timer, not the total budget.
        body = json.dumps({'choices': [{'message': {'role': 'assistant', 'content': 'UBUNTU_SLOW_REPLY_OK'}, 'finish_reason': 'stop'}], 'usage': {'prompt_tokens': 12, 'completion_tokens': 6}}).encode()
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
    rows.append({'name': 'interactive-slow-first-response', 'passed': sent and success and len(requests) == 1, 'submitted': sent, 'replyObserved': success, 'requestCount': len(requests), 'seconds': round(time.monotonic()-started, 3)})
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
