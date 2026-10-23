"""Native acceptance of the unmodified published installer; never removes Node."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import threading
import time

VERSION = '0.4.0'
ARCHIVE_SHA = '86b6071c224437298a01e4b909d07fd1d91826b348fab181a8a50209eb390566'
EULA_SHA = 'fa93cf1ce4834f04b899529a8a676ebee18d99725afad9c8d614940ba3351092'
ASSET_SHA = {'koder-cli.ps1': '5c124b76c834730b776a445a83798ac8cf43f06afa2af6d8a99e2b54b2f7df3d',
             'koder-cli.cmd': '550e442d5deb34dc22417d520bd45dccebf08c005d5ac424b96304ef841a54f9'}
CASE_SECONDS = 100
MAX_LOG = 4 * 1024 * 1024


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def digest(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def read_json(file):
    return json.loads(Path(file).read_text(encoding='utf-8-sig'))


def inside(file, parent):
    try:
        Path(file).resolve().relative_to(Path(parent).resolve())
        return True
    except ValueError:
        return False


def save(out, receipt):
    (out / 'receipt.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def run_case(name, argv, env, cwd, out, receipt):
    """100 seconds per real case, owned PID tree cleanup, always retained raw streams."""
    row = {'name': name, 'argv': [str(x) for x in argv], 'limitSeconds': CASE_SECONDS,
           'events': [], 'timedOut': False, 'overflow': False, 'exitCode': None}
    receipt['cases'].append(row)
    save(out, receipt)
    begin = time.monotonic()
    process = None
    threads = []
    lock = threading.Lock()

    def event(kind, **extra):
        with lock:
            row['events'].append({'event': kind, 'milliseconds': round((time.monotonic() - begin) * 1000), **extra})

    def pump(stream, label):
        total = 0
        with (out / f'{name}.{label}.raw').open('xb') as log:
            while True:
                chunk = stream.read1(4096)
                if not chunk:
                    break
                total += len(chunk)
                event(label, bytes=len(chunk))
                if total <= MAX_LOG:
                    log.write(chunk)
                    log.flush()
                else:
                    row['overflow'] = True
        event(label + '-eof', bytes=total)

    try:
        process = subprocess.Popen([str(x) for x in argv], cwd=cwd, env=env,
                                   stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        row['pid'] = process.pid
        event('spawn')
        for label, stream in [('stdout', process.stdout), ('stderr', process.stderr)]:
            thread = threading.Thread(target=pump, args=(stream, label), daemon=True)
            threads.append(thread)
            thread.start()
        try:
            row['exitCode'] = process.wait(timeout=CASE_SECONDS)
        except subprocess.TimeoutExpired:
            row['timedOut'] = True
            event('timeout')
    except Exception as exc:
        row['error'] = repr(exc)
    finally:
        if process is not None and process.poll() is None:
            # A live retained Popen handle proves this is our still-running PID.
            # No image-name kill, global uninstall, service operation or shared VM action.
            killer = Path(env['SystemRoot']) / 'System32/taskkill.exe'
            try:
                killed = subprocess.run([str(killer), '/PID', str(process.pid), '/T', '/F'],
                                        capture_output=True, timeout=5)
                row['ownedTreeCleanup'] = {'exitCode': killed.returncode,
                    'stdout': killed.stdout.decode('utf-8', 'replace'), 'stderr': killed.stderr.decode('utf-8', 'replace')}
            except Exception as exc:
                row['cleanupError'] = repr(exc)
            try:
                row['exitCode'] = process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                row['closeMissing'] = True
        if process is not None:
            event('process-ended', exitCode=process.poll())
        for thread in threads:
            thread.join(timeout=2)
        row['streamsClosed'] = all(not thread.is_alive() for thread in threads)
        row['elapsedMs'] = round((time.monotonic() - begin) * 1000)
        row['passed'] = (row['exitCode'] == 0 and not row['timedOut'] and not row['overflow']
                         and row['streamsClosed'] and not row.get('error') and not row.get('closeMissing'))
        save(out, receipt)
    return row


def output(out, name):
    return ''.join((out / f'{name}.{label}.raw').read_bytes().decode('utf-8', 'replace')
                   for label in ['stdout', 'stderr'] if (out / f'{name}.{label}.raw').exists())


def user_path():
    import winreg
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as key:
        try:
            value, kind = winreg.QueryValueEx(key, 'Path')
            return {'present': True, 'value': value, 'type': kind}
        except FileNotFoundError:
            return {'present': False}


def expected_user_path_after(before, bin_dir, child_env):
    """Match the installer's .NET User PATH read, split and REG_SZ write exactly."""
    raw = before.get('value', '')
    require(isinstance(raw, str), 'UNSUPPORTED_USER_PATH_VALUE')
    if before['present']:
        require(before.get('type') in [1, 2], 'UNSUPPORTED_USER_PATH_TYPE')
    if before.get('type') == 2:  # REG_EXPAND_SZ; REG_SZ must remain literal.
        variables = {key.casefold(): value for key, value in child_env.items()}
        expanded = re.sub(r'%([^%]+)%', lambda match: variables.get(match[1].casefold(), match[0]), raw)
    else:
        expanded = raw
    parts = expanded.split(';')
    # PowerShell -contains is case-insensitive. If present, the installer does not write.
    if any(part.casefold() == str(bin_dir).casefold() for part in parts):
        return dict(before)
    return {'present': True, 'value': ';'.join([str(bin_dir)] + [part for part in parts if part]), 'type': 1}


def restore_user_path(before, install, receipt, child_env):
    """Restore only this disposable job's exact expected installer PATH mutation."""
    import winreg
    after = user_path()
    receipt['userPathAfter'] = after
    if before == after:
        receipt['userPathRestored'] = True
        return
    expected = expected_user_path_after(before, install / 'bin', child_env)
    receipt['userPathExpectedAfter'] = expected
    require(after == expected, 'UNEXPECTED_USER_PATH_CHANGE: leave evidence; do not overwrite another writer')
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment', 0, winreg.KEY_SET_VALUE) as key:
        if before['present']:
            winreg.SetValueEx(key, 'Path', 0, before['type'], before['value'])
        else:
            winreg.DeleteValue(key, 'Path')
    require(user_path() == before, 'USER_PATH_RESTORE_FAILED')
    receipt['userPathRestored'] = True


def installed(install):
    info = read_json(install / 'install.json')
    consent = read_json(install / 'eula-acceptance.json')
    require(info['version'] == VERSION and info['preview'] is False, 'WRONG_INSTALLED_VERSION_OR_CHANNEL')
    require(consent['preview'] is False and consent['sha256'] == EULA_SHA, 'WRONG_CONSENT')
    runtime = Path(info['node'])
    require(runtime.is_file() and inside(runtime, install / 'runtime'), 'INSTALLER_DID_NOT_USE_OWNED_DOWNLOADED_NODE')
    require(Path(info['launcher']).resolve() == (install / 'bin/koder.cmd').resolve(), 'WRONG_LAUNCHER')
    require(digest(install / 'versions/0.4.0/EULA.md') == EULA_SHA, 'WRONG_INSTALLED_EULA')
    return info


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--entry', choices=['cmd', 'powershell'], required=True)
    parser.add_argument('--assets', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    out = args.out.resolve()
    require(not out.exists(), 'NEW_OWNED_OUTPUT_DIRECTORY_REQUIRED')
    out.mkdir(parents=True)
    receipt = {'version': VERSION, 'archiveSha256': ARCHIVE_SHA, 'entry': args.entry,
               'status': 'RUNNING', 'passed': False, 'caseLimitSeconds': CASE_SECONDS,
               'nativeWindows': os.name == 'nt', 'coldBootClaim': False, 'cases': [],
               'noNodeScope': 'installer child PATH only; infrastructure/global Node untouched',
               'upgrade': {'status': 'NOT_RUN', 'crossVersionClaim': False}}
    save(out, receipt)
    before = None
    install = out / 'install'
    try:
        require(os.name == 'nt', 'WINDOWS_NATIVE_REQUIRED')
        assets = args.assets.resolve()
        for name, expected in ASSET_SHA.items():
            require(digest(assets / name) == expected, f'ASSET_SHA_MISMATCH:{name}')
        manifest = read_json(assets / 'koder-cli-0.4.0.json')
        require(manifest['version'] == VERSION and manifest['sha256'] == ARCHIVE_SHA and
                manifest['size'] == 35892000 and manifest['preview'] is False, 'BASELINE_MANIFEST_MISMATCH')
        receipt['assets'] = dict(ASSET_SHA)
        system = Path(os.environ['SystemRoot'])
        cmd = system / 'System32/cmd.exe'
        ps = system / 'System32/WindowsPowerShell/v1.0/powershell.exe'
        profile, tmp, cwd = out / 'profile', out / 'tmp', out / 'empty-cwd'
        for folder in [profile, tmp, cwd, profile / 'AppData/Local', profile / 'AppData/Roaming']:
            folder.mkdir(parents=True)
        env = {k: v for k, v in os.environ.items() if not k.upper().startswith('KODER_')
               and k.upper() not in ['PATH', 'NODE_OPTIONS', 'NODE_PATH', 'PSMODULEPATH']}
        env.update({'PATH': ';'.join(str(p) for p in [system / 'System32', system,
                    system / 'System32/Wbem', ps.parent]), 'HOME': str(profile), 'USERPROFILE': str(profile),
                    'LOCALAPPDATA': str(profile / 'AppData/Local'), 'APPDATA': str(profile / 'AppData/Roaming'),
                    'TEMP': str(tmp), 'TMP': str(tmp), 'KODER_INSTALL_HOME': str(install),
                    'KODER_CLI_HOME': str(install), 'KODER_NO_ONBOARD': '1',
                    'KODER_EULA_ACCEPT': '1', 'KODER_EXPECTED_VERSION': VERSION,
                    'KODER_EXPECTED_PACKAGE_SHA256': ARCHIVE_SHA})
        receipt['childPath'] = env['PATH']
        receipt['architecture'] = {key: os.environ.get(key) for key in ['PROCESSOR_ARCHITECTURE', 'PROCESSOR_ARCHITEW6432']}
        global_node = shutil.which('node.exe')
        receipt['globalNodeBefore'] = {'path': global_node, 'sha256': digest(global_node)} if global_node else None
        before = user_path()
        receipt['userPathBefore'] = before
        no_node = run_case('preflight-no-node', [system / 'System32/where.exe', 'node.exe'], env, cwd, out, receipt)
        require(no_node['exitCode'] == 1 and not no_node['timedOut'] and no_node['streamsClosed'], 'NODE_VISIBLE_OR_PREFLIGHT_FAILED')
        no_node['expectedNoMatch'] = True
        no_node['expectedExitCode'] = 1
        no_node['passed'] = True
        require(not install.exists(), 'INSTALL_HOME_ALREADY_EXISTS')
        entry = assets / ('koder-cli.cmd' if args.entry == 'cmd' else 'koder-cli.ps1')
        argv = ([cmd, '/d', '/c', entry] if args.entry == 'cmd' else
                [ps, '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', entry])
        row = run_case('cold-install', argv, env, cwd, out, receipt)
        require(row['passed'], 'COLD_INSTALL_FAILED')
        info = installed(install)
        receipt['installInfo'] = info
        text = output(out, 'cold-install')
        require('22.23.3' in text, 'REAL_NODE_DOWNLOAD_STAGE_NOT_OBSERVED')
        runtime = Path(info['node'])
        capability = "const [a,b]=process.versions.node.split('.').map(Number);if(!((a===22&&b>=21||a>=24)&&process.allowedNodeEnvironmentFlags.has('--use-env-proxy')))process.exit(1);require('node:sqlite');console.log(JSON.stringify({node:process.versions.node,arch:process.arch,exe:process.execPath}))"
        row = run_case('owned-runtime', [runtime, '-e', capability], env, cwd, out, receipt)
        require(row['passed'], 'OWNED_RUNTIME_CAPABILITY_FAILED')
        launcher = Path(info['launcher'])
        row = run_case('startup', [cmd, '/d', '/c', launcher, '--version'], env, cwd, out, receipt)
        require(row['passed'] and '0.4.0' in output(out, 'startup') and 'preview' not in output(out, 'startup'), 'STARTUP_VERSION_FAILED')
        # Pin the public feed; same-version update success is explicitly not a cross-version upgrade.
        update_env = {**env, 'KODER_INSTALL_BASE': 'https://karmenloop.com/install/cli-0.4.0'}
        for name, suffix in [('update-check', 'update --check'), ('update-current', 'update')]:
            row = run_case(name, [cmd, '/d', '/c', launcher, *suffix.split()], update_env, cwd, out, receipt)
            require(row['passed'], name.upper() + '_FAILED')
        installed(install)
        receipt['upgrade'] = {'status': 'CURRENT_VERSION_CHECK_AND_NOOP_PASSED', 'crossVersionClaim': False}
        receipt['passed'] = True
        receipt['status'] = 'PASS_INSTALL_AND_STARTUP'
    except BaseException as exc:
        receipt['status'] = 'FAIL'
        receipt['error'] = repr(exc)
    finally:
        if before is not None:
            try:
                restore_user_path(before, install, receipt, env)
            except BaseException as exc:
                receipt['cleanupError'] = repr(exc)
                receipt['passed'] = False
                receipt['status'] = 'FAIL_CLEANUP'
        original_node = receipt.get('globalNodeBefore')
        if original_node:
            try:
                require(digest(original_node['path']) == original_node['sha256'], 'GLOBAL_NODE_CHANGED')
                receipt['globalNodeUnchanged'] = True
            except BaseException as exc:
                receipt['globalNodeCheckError'] = repr(exc)
                receipt['passed'] = False
        save(out, receipt)
        print(json.dumps({'entry': args.entry, 'status': receipt['status'], 'passed': receipt['passed'], 'receipt': str(out / 'receipt.json')}))
    return 0 if receipt['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
