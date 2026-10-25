"""Frozen full-candidate cold install or real installed CLI update; no publication."""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import platform
import re
import runpy
import shutil
import signal
import subprocess
import sys
import threading
import time

DEFAULT_SPEC_SHA = '43978879884718cf12b29f7b14a32d38a975de00dc18c9dc66c09a2076d32118'
FROM = '0.4.10'
CASE_SECONDS, MAX_LOG = 100, 4 * 1024 * 1024


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def digest(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def read_json(file):
    return json.loads(Path(file).read_text(encoding='utf-8-sig'))


def save(out, receipt):
    (out / 'receipt.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def verify_stream_evidence(row, out):
    for label in ['stdout', 'stderr']:
        events = [event for event in row['events'] if event['event'] == label + '-eof']
        require(len(events) == 1, 'MISSING_OR_DUPLICATE_STREAM_EOF:' + label)
        raw = out / (row['name'] + '.' + label + '.raw')
        require(raw.is_file() and events[0]['bytes'] == raw.stat().st_size, 'RAW_STREAM_EOF_SIZE_MISMATCH:' + label)
        require(sum(event['bytes'] for event in row['events'] if event['event'] == label) == events[0]['bytes'], 'STREAM_EVENT_SIZE_MISMATCH:' + label)
    row['streamsEOFVerified'] = True


def load_spec(file, receipt, expected_sha=DEFAULT_SPEC_SHA):
    require(re.fullmatch(r'[a-f0-9]{64}', expected_sha), 'INVALID_EXPECTED_SPEC_SHA')
    receipt['expectedSpecSha256'] = expected_sha
    receipt['specSha256'] = digest(file)
    require(receipt['specSha256'] == expected_sha, 'FROZEN_SPEC_SHA_MISMATCH')
    spec = read_json(file)
    require(spec['schema'] == 1 and spec['from'] == FROM and spec['to'] == '0.4.11' and spec['caseLimitSeconds'] == CASE_SECONDS, 'WRONG_FROZEN_PLAN')
    require(set(spec['releases']) == {FROM, spec['to']}, 'WRONG_FROZEN_RELEASE_SET')
    require(spec['releases'][spec['to']]['preview'] is False and re.fullmatch(r'[a-f0-9]{64}', spec['releases'][spec['to']]['sha256']), 'WRONG_CANDIDATE_ARCHIVE')
    dependencies = {}
    receipt['dependencyBytes'] = {}
    for name, expected in spec['dependencies'].items():
        require(name in ['windows-no-node-r2.py', 'windows-upgrade.py'], 'UNEXPECTED_DEPENDENCY')
        target = Path(__file__).with_name(name)
        data = target.read_bytes()
        actual = hashlib.sha256(data).hexdigest()
        receipt['dependencyBytes'][name] = {'sha256': actual, 'expected': expected, 'bytes': len(data),
                                           'lf': data.count(b'\n'), 'crlf': data.count(b'\r\n')}
        require(actual == expected, 'FROZEN_DEPENDENCY_SHA_MISMATCH:' + name)
        dependencies[name] = runpy.run_path(str(target))
    require(len(dependencies) == 2, 'MISSING_FROZEN_DEPENDENCY')
    return spec, dependencies


def verify_assets(folder, version, spec):
    expected = spec['releases'][version]
    for name, identity in expected['files'].items():
        require(Path(name).name == name, 'UNSAFE_ASSET_NAME')
        file = folder / name
        require(file.is_file() and not file.is_symlink(), 'ASSET_NOT_REGULAR:' + name)
        require(file.stat().st_size == identity['size'] and digest(file) == identity['sha256'], 'ASSET_BYTES_MISMATCH:' + name)
    manifest_file = folder / f'koder-cli-{version}.json'
    manifest = read_json(manifest_file)
    require(manifest['version'] == version and manifest['preview'] is expected['preview'], 'WRONG_RELEASE_CHANNEL')
    require(manifest['file'] == expected['archive'] and manifest['sha256'] == expected['sha256'] and manifest['size'] == expected['size'], 'WRONG_ARCHIVE_IDENTITY')
    require(manifest['agreement'] == {'id': 'Koder-EULA-1.1', 'version': '1.1', 'sha256': spec['agreementSha256']}, 'WRONG_AGREEMENT')
    for ext in ['sh', 'ps1', 'cmd']:
        name = 'koder-cli.' + ext
        require(manifest['installers'][ext] == {'file': name, 'sha256': expected['files'][name]['sha256']}, 'WRONG_INSTALLER_MANIFEST')
    return manifest


def run_mac(name, argv, env, cwd, out, receipt):
    """Same 100-second/dual-stream contract as Windows; only own new process group."""
    row = {'name': name, 'argv': [str(x) for x in argv], 'limitSeconds': CASE_SECONDS,
           'events': [], 'timedOut': False, 'overflow': False, 'exitCode': None}
    receipt['cases'].append(row)
    save(out, receipt)
    start = time.monotonic()
    process = None
    threads = []
    lock = threading.Lock()

    def event(kind, **extra):
        with lock:
            row['events'].append({'event': kind, 'milliseconds': round((time.monotonic() - start) * 1000), **extra})

    def pump(stream, label):
        total = 0
        try:
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
        except Exception as exc:
            row.setdefault('streamErrors', []).append({'stream': label, 'error': repr(exc)})
            event(label + '-error')

    try:
        process = subprocess.Popen([str(x) for x in argv], cwd=cwd, env=env, start_new_session=True,
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
            row['ownedGroupCleanup'] = []
            for sig in [signal.SIGTERM, signal.SIGKILL]:
                if process.poll() is not None:
                    break
                try:
                    require(os.getpgid(process.pid) == process.pid, 'OWNED_PROCESS_GROUP_NOT_CONFIRMED')
                    os.killpg(process.pid, sig)
                    row['ownedGroupCleanup'].append(int(sig))
                    row['exitCode'] = process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    continue
                except Exception as exc:
                    row['cleanupError'] = repr(exc)
                    break
            if process.poll() is None:
                row['closeMissing'] = True
        if process is not None:
            event('process-ended', exitCode=process.poll())
        for thread in threads:
            thread.join(timeout=2)
        row['streamsClosed'] = all(not thread.is_alive() for thread in threads)
        row['elapsedMs'] = round((time.monotonic() - start) * 1000)
        row['passed'] = (row['exitCode'] == 0 and not row['timedOut'] and not row['overflow']
                         and row['streamsClosed'] and not row.get('error') and not row.get('closeMissing') and not row.get('cleanupError') and not row.get('streamErrors'))
        save(out, receipt)
    return row


def installed(install, version, spec, windows, expected_node=None):
    info = read_json(install / 'install.json')
    consent = read_json(install / 'eula-acceptance.json')
    preview = spec['releases'][version]['preview']
    require(info['version'] == version and info['preview'] is preview, 'WRONG_INSTALLED_VERSION_OR_CHANNEL')
    require(consent['id'] == 'Koder-EULA-1.1' and consent['version'] == '1.1' and consent['sha256'] == spec['agreementSha256'] and consent['preview'] is preview, 'WRONG_CONSENT')
    node = Path(info['node']).resolve()
    require(node.is_file() and node.is_relative_to((install / 'runtime').resolve()), 'RUNTIME_NOT_OWNED')
    if expected_node is not None:
        require(node == expected_node, 'RUNTIME_PATH_CHANGED')
    launcher = install / 'bin' / ('koder.cmd' if windows else 'koder')
    require(Path(info['launcher']).resolve() == launcher.resolve(), 'WRONG_LAUNCHER')
    require(digest(install / 'versions' / version / 'EULA.md') == spec['agreementSha256'], 'INSTALLED_AGREEMENT_MISMATCH')
    if not windows:
        require((install / 'current').resolve() == (install / 'versions' / version).resolve(), 'WRONG_CURRENT_LINK')
    return info


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['cold', 'upgrade'], required=True)
    parser.add_argument('--entry', choices=['cmd', 'powershell', 'shell'], required=True)
    parser.add_argument('--expected-platform', choices=['win32', 'darwin'], required=True)
    parser.add_argument('--expected-arch', choices=['x64', 'arm64'], required=True)
    parser.add_argument('--assets', type=Path, required=True)
    parser.add_argument('--baseline-assets', type=Path)
    parser.add_argument('--manifest', type=Path, default=Path(__file__).with_name('published-0411-frozen.json'))
    parser.add_argument('--manifest-sha256', default=DEFAULT_SPEC_SHA, help='Exact root-approved manifest bytes; required override for a later candidate manifest')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--validate-only', action='store_true', help='Verify frozen inputs only; never install, spawn a child or start a server')
    args = parser.parse_args()
    out = args.out.resolve()
    require(not out.exists(), 'NEW_OWNED_OUTPUT_DIRECTORY_REQUIRED')
    out.mkdir(parents=True)
    receipt = {'status': 'RUNNING', 'passed': False, 'prepared': False, 'mode': args.mode, 'entry': args.entry,
               'from': FROM if args.mode == 'upgrade' else None, 'to': None, 'caseLimitSeconds': CASE_SECONDS,
               'expectedPlatform': args.expected_platform, 'expectedArch': args.expected_arch,
               'host': {'platform': sys.platform, 'machine': platform.machine(), 'system': platform.platform()},
               'cases': [], 'loopbackRequests': [], 'crossVersionClaim': False, 'coldBootClaim': False,
               'scope': 'Full fixed candidate package, native installer and real original CLI updater; no provider or graphical certification'}
    save(out, receipt)
    server = None
    thread = None
    before = None
    parent = None
    install = out / 'install'
    try:
        spec, dependencies = load_spec(args.manifest.resolve(), receipt, args.manifest_sha256)
        target_version = spec['to']
        archive_sha = spec['releases'][target_version]['sha256']
        receipt['to'] = target_version
        parent = dependencies['windows-no-node-r2.py']
        compare_archive = dependencies['windows-upgrade.py']['compare_installed_archive']
        folders = {target_version: args.assets.resolve()}
        if args.mode == 'upgrade':
            require(args.baseline_assets is not None, 'UPGRADE_REQUIRES_BASELINE_ASSETS')
            folders[FROM] = args.baseline_assets.resolve()
        manifests = {version: verify_assets(folder, version, spec) for version, folder in folders.items()}
        receipt['releaseAssets'] = {version: spec['releases'][version] for version in folders}
        windows = args.expected_platform == 'win32'
        require((windows and args.entry in ['cmd', 'powershell']) or (not windows and args.entry == 'shell'), 'ENTRY_PLATFORM_MISMATCH')
        if args.validate_only:
            receipt['prepared'] = True
            receipt['status'] = 'PREPARED_ONLY_NO_NATIVE_EXECUTION'
            return 0
        require(sys.platform == args.expected_platform, 'EXPECTED_NATIVE_PLATFORM_REQUIRED')
        profile, tmp, cwd, data = out / 'profile', out / 'tmp', out / 'working', out / 'data'
        for folder in [profile, tmp, cwd, data, profile / 'AppData/Local', profile / 'AppData/Roaming']:
            folder.mkdir(parents=True)
        env = {key: value for key, value in os.environ.items() if not key.upper().startswith(('KODER_', 'OPENAI_', 'ANTHROPIC_'))
               and key.upper() not in ['PATH', 'NODE_OPTIONS', 'NODE_PATH', 'PSMODULEPATH']}
        if windows:
            system = Path(os.environ['SystemRoot'])
            cmd, ps = system / 'System32/cmd.exe', system / 'System32/WindowsPowerShell/v1.0/powershell.exe'
            child_path = ';'.join(str(p) for p in [system / 'System32', system, system / 'System32/Wbem', ps.parent])
        else:
            child_path = '/usr/bin:/bin:/usr/sbin:/sbin'
        env.update({'PATH': child_path, 'HOME': str(profile), 'USERPROFILE': str(profile),
                    'LOCALAPPDATA': str(profile / 'AppData/Local'), 'APPDATA': str(profile / 'AppData/Roaming'),
                    'TEMP': str(tmp), 'TMP': str(tmp), 'TMPDIR': str(tmp), 'KODER_CLI_HOME': str(install),
                    'KODER_INSTALL_HOME': str(install), 'KODER_BIN_DIR': str(install / 'bin'), 'KODER_DATA': str(data),
                    'KODER_EULA_ACCEPT': '1', 'KODER_NO_ONBOARD': '1', 'KODER_AUTO_UPDATE': '0',
                    'KODER_REMOTE_RESOURCES': '0', 'KODER_LANG': 'en', 'NO_COLOR': '1'})
        receipt['childPath'] = child_path
        global_node = shutil.which('node.exe' if windows else 'node')
        receipt['globalNodeBefore'] = {'path': global_node, 'sha256': digest(global_node)} if global_node else None
        if windows:
            before = parent['user_path']()
            receipt['userPathBefore'] = before
        process_runner = parent['run_case'] if windows else run_mac

        def run(name, argv, child_env=env, expected_exit=0):
            row = process_runner(name, argv, child_env, cwd, out, receipt)
            try:
                verify_stream_evidence(row, out)
            except Exception as exc:
                row['passed'] = False
                row['streamEvidenceError'] = repr(exc)
                save(out, receipt)
                raise
            if expected_exit != 0:
                require(row['exitCode'] == expected_exit and not row['timedOut'] and not row['overflow'] and row['streamsClosed'] and not row.get('error'), name.upper() + '_FAILED')
                row['expectedExitCode'] = expected_exit
                row['expectedNoMatch'] = True
                row['passed'] = True
            require(row['passed'], name.upper() + '_FAILED')
            return parent['output'](out, name)

        run('preflight-no-node', [system / 'System32/where.exe', 'node.exe'] if windows else ['/bin/sh', '-c', 'command -v node'], expected_exit=1)
        require(not install.exists(), 'INSTALL_HOME_ALREADY_EXISTS')
        routes = {}
        for version, folder in folders.items():
            prefix = '/cli-' + version + '/'
            routes[prefix + 'koder-cli-latest.json'] = folder / f'koder-cli-{version}.json'
            for name in spec['releases'][version]['files']:
                routes[prefix + name] = folder / name

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                source = routes.get(self.path)
                if source is None:
                    receipt['loopbackRequests'].append({'path': self.path, 'status': 404})
                    self.send_error(404)
                    return
                content = source.read_bytes()
                receipt['loopbackRequests'].append({'path': self.path, 'status': 200, 'bytes': len(content),
                                                     'sha256': hashlib.sha256(content).hexdigest()})
                self.send_response(200)
                self.send_header('Content-Type', 'application/octet-stream')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)

            def log_message(self, *_):
                pass

        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f'http://127.0.0.1:{server.server_port}'
        first = FROM if args.mode == 'upgrade' else target_version
        env.update({'KODER_INSTALL_BASE': base + '/cli-' + first, 'KODER_EXPECTED_VERSION': first,
                    'KODER_EXPECTED_PACKAGE_SHA256': spec['releases'][first]['sha256']})
        script = folders[first] / ('koder-cli.cmd' if args.entry == 'cmd' else 'koder-cli.ps1' if windows else 'koder-cli.sh')
        argv = ([cmd, '/d', '/c', script] if args.entry == 'cmd' else
                [ps, '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script] if windows else
                ['/bin/bash', script, '--no-onboard', '--no-modify-path'])
        install_output = run('install-' + first, argv)
        require('22.23.3' in install_output, 'REAL_NODE_BOOTSTRAP_STAGE_NOT_OBSERVED')
        first_info = installed(install, first, spec, windows)
        receipt['initialInstallInfo'] = first_info
        node, launcher = Path(first_info['node']).resolve(), Path(first_info['launcher'])
        runtime_sha = digest(node)
        capability = "const [a,b]=process.versions.node.split('.').map(Number);if(!((a===22&&b>=21||a>=24)&&process.allowedNodeEnvironmentFlags.has('--use-env-proxy')))process.exit(1);require('node:sqlite');console.log(JSON.stringify({node:process.versions.node,platform:process.platform,arch:process.arch,exe:process.execPath}))"
        runtime = json.loads(run('owned-runtime', [node, '-e', capability]).splitlines()[0])
        require(runtime['platform'] == args.expected_platform and runtime['arch'] == args.expected_arch, 'RUNTIME_PLATFORM_OR_ARCH_MISMATCH')
        receipt['runtime'] = runtime
        launcher_args = [cmd, '/d', '/c', launcher] if windows else [launcher]
        require(run('initial-launcher-version', [*launcher_args, '--version']).strip() == 'koder ' + first, 'INITIAL_LAUNCHER_VERSION_FAILED')
        receipt['initialInstalledArchive'] = compare_archive(install, first, folders[first] / manifests[first]['file'])
        old_requests = ['/cli-' + first + '/' + name for name in (['koder-cli.ps1'] if args.entry == 'cmd' else []) + ['koder-cli-latest.json', manifests[first]['file']]]
        require([row['path'] for row in receipt['loopbackRequests']] == old_requests, 'INITIAL_INSTALL_TRANSFER_PATH_DIFFERS')
        updated_env = {**env, 'KODER_INSTALL_BASE': base + '/cli-' + target_version, 'KODER_EXPECTED_VERSION': target_version,
                       'KODER_EXPECTED_PACKAGE_SHA256': archive_sha}
        if args.mode == 'upgrade':
            config_file = install / 'config.json'
            config = read_json(config_file) if config_file.exists() else {}
            config.update({'lang': 'en', 'candidateUpgradeSentinel': 'KODER_OWNED_041_UPGRADE'})
            config_file.write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
            data_file = data / 'retained-user-setting.json'
            data_file.write_text('{"fixture":"preserved"}\n', encoding='utf-8')
            sentinels = {str(file): digest(file) for file in [config_file, data_file]}
            updated_env.pop('KODER_EULA_ACCEPT')
            entry = install / 'versions' / FROM / 'bin/koder.mjs'
            receipt['updateEntry'] = {'path': str(entry), 'sha256': digest(entry),
                                      'method': 'Original installed Node and original installed bin/koder.mjs update; real versioned loopback feed'}
            run('actual-installed-cli-update', [node, entry, 'update'], updated_env)
            host = receipt['cases'][-1]
            receipt['updateHostProcess'] = {key: host[key] for key in ['pid', 'exitCode', 'timedOut', 'streamsClosed', 'elapsedMs']}
            for file, expected in sentinels.items():
                require(digest(file) == expected, 'USER_SETTINGS_CHANGED:' + file)
            receipt['userSettingsPreserved'] = True
            receipt['sentinelSha256'] = sentinels
            activation = read_json(install / 'update-activation.json')
            require(activation['version'] == target_version and activation['entrySha256'] == digest(install / 'versions' / target_version / 'bin/koder.mjs'), 'UPDATE_ACTIVATION_MISMATCH')
            receipt['activation'] = activation
            extension = 'ps1' if windows else 'sh'
            update_requests = ['/cli-' + target_version + '/' + name for name in ['koder-cli-latest.json', 'koder-cli.' + extension, 'koder-cli-latest.json', manifests[target_version]['file']]]
            require([row['path'] for row in receipt['loopbackRequests']] == old_requests + update_requests, 'ACTUAL_UPDATE_TRANSFER_PATH_DIFFERS')
        else:
            for name, suffix in [('update-check', ['update', '--check']), ('update-current', ['update'])]:
                run(name, [*launcher_args, *suffix], updated_env)
            require([row['path'] for row in receipt['loopbackRequests']] == old_requests + ['/cli-' + target_version + '/koder-cli-latest.json'] * 2, 'NOOP_UPDATE_TRANSFER_PATH_DIFFERS')
        final_info = installed(install, target_version, spec, windows, node)
        receipt['finalInstallInfo'] = final_info
        require(digest(node) == runtime_sha, 'OWNED_RUNTIME_CHANGED')
        require(run('final-launcher-version', [*launcher_args, '--version'], updated_env).strip() == 'koder ' + target_version, 'FINAL_LAUNCHER_VERSION_FAILED')
        receipt['finalInstalledArchive'] = compare_archive(install, target_version, folders[target_version] / manifests[target_version]['file'])
        require(all(row['passed'] and row['streamsClosed'] for row in receipt['cases']), 'CASE_EXIT_OR_EOF_MISSING')
        require(all(row['status'] == 200 for row in receipt['loopbackRequests']), 'UNEXPECTED_FEED_REQUEST')
        receipt['crossVersionClaim'] = args.mode == 'upgrade'
        receipt['passed'] = True
        receipt['status'] = 'PASS_CANDIDATE_' + args.mode.upper()
    except BaseException as exc:
        receipt['passed'] = False
        receipt['status'] = 'FAIL'
        receipt['error'] = repr(exc)
    finally:
        if server:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)
            if thread.is_alive():
                receipt['passed'] = False
                receipt['status'] = 'FAIL_CLEANUP'
                receipt['loopbackCloseMissing'] = True
            else:
                receipt['loopbackClosed'] = True
        if before is not None:
            try:
                parent['restore_user_path'](before, install, receipt, env)
            except BaseException as exc:
                receipt['cleanupError'] = repr(exc)
                receipt['passed'] = False
                receipt['status'] = 'FAIL_CLEANUP'
        original = receipt.get('globalNodeBefore')
        if original:
            try:
                require(digest(original['path']) == original['sha256'], 'GLOBAL_NODE_CHANGED')
                receipt['globalNodeUnchanged'] = True
            except BaseException as exc:
                receipt['globalNodeCheckError'] = repr(exc)
                receipt['passed'] = False
                receipt['status'] = 'FAIL_GLOBAL_NODE_CHECK'
        save(out, receipt)
        print(json.dumps({'status': receipt['status'], 'passed': receipt['passed'], 'prepared': receipt['prepared'], 'receipt': str(out / 'receipt.json')}))
    return 0 if receipt['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
