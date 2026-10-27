"""Verify the exact distributed runtime, then exercise an isolated installation."""
from pathlib import Path
import hashlib, json, os, subprocess, tarfile, time

root = Path.cwd()
assets = root / 'candidate'
out = root / 'ubuntu-results'
out.mkdir(exist_ok=True)
manifest = json.loads((assets / 'koder-cli-latest.json').read_text())
assert manifest['version'] == os.environ.get('KODER_TEST_VERSION', '0.5.10')
package = manifest.get('packages', {}).get('linux', manifest)
archive = assets / package['file']
sha = lambda p: hashlib.file_digest(p.open('rb'), 'sha256').hexdigest()
assert archive.stat().st_size == package['size'] and sha(archive) == package['sha256']
installer = assets / 'koder-ubuntu-24.04.sh'
assert sha(installer) == manifest['installers']['ubuntu']['sha256']
payload = root / 'ubuntu-payload'
with tarfile.open(archive) as z:
    for member in z:
        assert not any('xattr' in key or 'acl' in key or 'fflags' in key for key in member.pax_headers), (member.name, member.pax_headers)
        assert not member.issym() and not member.islnk()
        assert not Path(member.name).is_absolute() and '..' not in Path(member.name).parts
    z.extractall(payload, filter='data')
runtime = payload / 'koder-cli'
rows = []
for row in json.loads((runtime / 'kernel/MANIFEST.json').read_text())['files']:
    assert sha(runtime / 'kernel' / row['path']) == row['sha256']
home = root / 'ubuntu-home'
home.mkdir(exist_ok=True)
env = {**os.environ, 'HOME': str(home), 'USERPROFILE': str(home), 'KODER_CLI_HOME': str(home / '.koder-cli'), 'KODER_BIN_DIR': str(home / 'bin'), 'KODER_EULA_ACCEPT': '1', 'KODER_ACTIVATE': '0'}

def run(name, argv, accepted=(0,), timeout=120, extra=None):
    start = time.monotonic()
    p = subprocess.run(argv, env={**env, **(extra or {})}, capture_output=True, text=True, timeout=timeout)
    (out / (name + '.txt')).write_text(p.stdout + p.stderr)
    rows.append({'name': name, 'exitCode': p.returncode, 'seconds': round(time.monotonic()-start, 3)})
    assert p.returncode in accepted, (name, p.returncode, p.stdout[-1000:], p.stderr[-1000:])
    return p.stdout

try:
    # file:// is a controlled local mirror of the same hash-checked GitHub assets.
    run('install', ['bash', str(installer), '--base', assets.as_uri(), '--force-node', '--no-onboard'], timeout=600)
    progress = (out / 'install.txt').read_text()
    assert ' MB / ' in progress and '(100%)' in progress and 'elapsed ' in progress, 'Missing package download progress'
    assert 'Extracting Koder CLI' in progress and 'Activating Koder CLI' in progress
    rows.append({'name': 'download-progress-and-phases', 'passed': True})
    launcher = home / 'bin/koder'
    install_text = (out / 'install.txt').read_text()
    assert 'LIBARCHIVE.xattr' not in install_text, 'GNU tar must not warn for Apple metadata'
    assert str(launcher) in install_text and ('Background activation does not open chat' in install_text or '不会打开聊天' in install_text)
    assert (home / '.profile').is_file() and (home / '.bashrc').is_file()
    run('current-path', ['bash', '-c', 'export PATH="$HOME/bin:$PATH"; hash -r; command -v koder; koder --version'])
    shell_path = run('fresh-bash-path', ['bash', '--noprofile', '--rcfile', str(home / '.bashrc'), '-ic', 'command -v koder; koder --version'])
    assert str(launcher) in shell_path and manifest['version'] in shell_path
    assert manifest['version'] in run('version', [str(launcher), '--version'])
    help_text = run('help', [str(launcher), '--help'])
    for feature in ('mail', 'mcp', 'apps', 'memory', 'github', 'skill', 'agentd', 'notifications'):
        assert feature in help_text, feature
    config = home / '.koder-cli/config.json'
    config.write_text('{"language":"en","harnessJit":{"enabled":false},"universalAppUse":{"enabled":false}}\n')
    before = config.read_bytes()
    run('reinstall', ['bash', str(installer), '--base', assets.as_uri(), '--force-node', '--no-onboard'], timeout=600)
    assert config.read_bytes() == before, 'Reinstall must preserve existing options'
    run('memory-status', [str(launcher), 'memory', 'status', '--json'])
    run('notification-status', [str(launcher), 'notifications', 'status', '--json'])
    run('agentd-status', [str(launcher), 'status', '--json'])
    installed = home / '.koder-cli/versions' / manifest['version']
    assert sha(installed / 'src/linux-desktop.py') == sha(runtime / 'src/linux-desktop.py')
    with (root / 'ubuntu-env').open('w') as f:
        node = json.loads((home / '.koder-cli/install.json').read_text())['node']
        assert Path(node).is_relative_to(home / '.koder-cli/runtime'), 'Desktop acceptance must use the installed managed Node runtime'
        f.write('KODER_TEST_RUNTIME=' + str(installed) + '\nKODER_TEST_RESULTS=' + str(out) + '\nKODER_TEST_NODE=' + node + '\n')
    passed = True
finally:
    receipt = {'passed': locals().get('passed', False), 'runtimeSha256': package['sha256'], 'artifact': package['file'], 'version': manifest['version'], 'runs': rows, 'osRelease': Path('/etc/os-release').read_text(), 'machine': os.uname().machine, 'sameFullRuntime': True, 'physicalLoginReboot': 'NOT_RUN', 'liveProviderAccounts': 'NOT_RUN'}
    (out / 'runtime.json').write_text(json.dumps(receipt, indent=2)+'\n')
