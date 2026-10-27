"""Probe a verified release on an isolated Windows VM; no production credentials."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tarfile
import time

p = argparse.ArgumentParser()
p.add_argument('--assets', required=True)
p.add_argument('--out', required=True)
p.add_argument('--diagnose', action='store_true')
args = p.parse_args()
assets, out = Path(args.assets).resolve(), Path(args.out).resolve()
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((assets / 'koder-cli-latest.json').read_text())
archive = assets / manifest['file']
with archive.open('rb') as stream:
    actual = hashlib.file_digest(stream, 'sha256').hexdigest()
assert actual == manifest['sha256'], 'Release archive SHA-256 mismatch'
runtime = out / 'runtime'
runtime.mkdir()
with tarfile.open(archive) as stream:
    stream.extractall(runtime, filter='data')
package = runtime / 'koder-cli'
assert json.loads((package / 'package.json').read_text())['version'] == manifest['version']
suite = Path(__file__).resolve().with_name('windows-vm')
env = {**os.environ, 'KODER_ACCEPTANCE_PACKAGE': str(package), 'KODER_VM_EVIDENCE':str(out), 'KODER_AUTO_UPDATE': '0', 'TZ': 'UTC'}
for key in ['KODER_DESKTOP_ROOT', 'KODER_KERNEL_ROOT', 'NODE_OPTIONS', 'NODE_TEST_CONTEXT']:
    env.pop(key, None)
# os.environ is case-insensitive on Windows; a plain dict is not.
for key in list(env):
    if key.upper() == 'PSMODULEPATH':
        del env[key]
env['PSMODULEPATH'] = str(Path(os.environ['SystemRoot']) / 'System32/WindowsPowerShell/v1.0/Modules')
groups = ['task-step-budget.test.mjs', 'multi-window-session.test.mjs', 'mail-runtime-lifecycle.test.mjs', 'mail-background-recovery.test.mjs', 'mail-inbox-refresh.test.mjs', 'fixtures/mail-recovery-tls.mjs', 'native-mcp.test.mjs', 'native-shell.test.mjs', 'native-gui.test.mjs']
if args.diagnose:
    groups = ['notification-diagnostic.mjs', 'native-gui.test.mjs']
results = []
for name in groups:
    start = time.monotonic()
    case_env = {**env}
    if name == 'session-timing-diagnostic.mjs':
        case_env['NODE_OPTIONS'] = '--import=' + (suite/'io-timing.mjs').as_uri()
    if name == 'fixtures/mail-recovery-tls.mjs':
        case_env['NODE_EXTRA_CA_CERTS'] = str(suite / 'fixtures/mail-test-cert.pem')
    try:
        proc = subprocess.run(['node', '--test', '--test-concurrency=1', '--test-timeout=180000', str(suite/name)], env=case_env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=210)
        data, code = proc.stdout, proc.returncode
    except subprocess.TimeoutExpired as error:
        data, code = (error.stdout or b'') + b'\nVM_PROBE_PROCESS_TIMEOUT\n', None
    log = name.replace('/', '-').replace('.mjs', '.tap')
    (out/log).write_bytes(data)
    row = {'group':name, 'exitCode':code, 'passed':code == 0, 'durationSeconds':round(time.monotonic()-start, 2), 'log':log}
    results.append(row)
    print(json.dumps(row), flush=True)
    (out/'RUNTIME-RESULT.json').write_text(json.dumps({'diagnosticOnly':args.diagnose, 'complete':len(results)==len(groups), 'passed':len(results)==len(groups) and all(r['passed'] for r in results), 'version':manifest['version'], 'archiveSha256':actual, 'scope':'Released package on native Windows; synthetic model/mail fixtures, real OS storage and MCP process. No live mailbox, paid provider, or physical GUI acceptance. Diagnostics do not replace the unchanged 30-second acceptance gate.', 'groups':results}, indent=2)+'\n')
raise SystemExit(0 if all(row['passed'] for row in results) else 1)
