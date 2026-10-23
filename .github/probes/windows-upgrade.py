"""Actual installed preview.30 CLI -> public 0.4.0 update in an owned Windows home."""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import runpy
import shutil
import sys
import tarfile
import threading

FROM = '0.4.0-preview.30'
TO = '0.4.0'
PUBLIC_BASE = 'https://karmenloop.com/install/cli-0.4.0'
FROZEN_PARENT_SHA = '678d880abea327f1a2951aeb59468f3bc1551bef915d74c82863dfa48b9d08aa'
RELEASES = {
    FROM: {'archive': 'cb9dabbcd86ac2cd9165142b1982d047bfa5b7883485cf14d4e05250d6056c72',
           'size': 35768941, 'ps1': '4ff804e17e51770776d7fd3eb49161c47f1db6bf3c787f05f468dfa1482031ea'},
    TO: {'archive': '86b6071c224437298a01e4b909d07fd1d91826b348fab181a8a50209eb390566',
         'size': 35892000, 'ps1': '5c124b76c834730b776a445a83798ac8cf43f06afa2af6d8a99e2b54b2f7df3d'},
}
EULA_SHA = 'fa93cf1ce4834f04b899529a8a676ebee18d99725afad9c8d614940ba3351092'


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def digest(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def manifest_for(directory, version):
    expected = RELEASES[version]
    file = directory / f'koder-cli-{version}.json'
    data = file.read_bytes()
    manifest = json.loads(data.decode('utf-8-sig'))
    require(manifest['version'] == version and manifest['preview'] is (version != TO), 'WRONG_RELEASE_CHANNEL')
    require(manifest['file'] == f'koder-cli-{version}.tgz', 'WRONG_ARCHIVE_FILENAME')
    require(manifest['sha256'] == expected['archive'] and manifest['size'] == expected['size'], 'WRONG_ARCHIVE_IDENTITY')
    require(manifest['agreement']['sha256'] == EULA_SHA, 'WRONG_AGREEMENT')
    require(manifest['installers']['ps1']['sha256'] == expected['ps1'], 'WRONG_PS1_MANIFEST')
    archive = directory / manifest['file']
    require(archive.stat().st_size == expected['size'] and digest(archive) == expected['archive'], 'ARCHIVE_BYTES_MISMATCH')
    require(digest(directory / 'koder-cli.ps1') == expected['ps1'], 'PS1_BYTES_MISMATCH')
    return manifest, data


def verify_installed(install, version, expected_runtime=None):
    info = json.loads((install / 'install.json').read_text(encoding='utf-8-sig'))
    consent = json.loads((install / 'eula-acceptance.json').read_text(encoding='utf-8-sig'))
    require(info['version'] == version and info['preview'] is (version != TO), 'WRONG_INSTALLED_VERSION')
    require(consent['sha256'] == EULA_SHA and consent['preview'] is (version != TO), 'WRONG_INSTALLED_CONSENT')
    node = Path(info['node']).resolve()
    require(node.is_file() and node.is_relative_to((install / 'runtime').resolve()), 'RUNTIME_NOT_OWNED')
    if expected_runtime is not None:
        require(node == expected_runtime, 'RUNTIME_PATH_CHANGED')
    require(Path(info['launcher']).resolve() == (install / 'bin/koder.cmd').resolve(), 'WRONG_LAUNCHER')
    require(digest(install / 'versions' / version / 'EULA.md') == EULA_SHA, 'INSTALLED_AGREEMENT_MISMATCH')
    return info


def compare_installed_archive(install, version, archive):
    """Compare every packaged regular file; no archive extraction or product execution here."""
    rows = []
    with tarfile.open(archive, 'r:gz') as packed:
        for member in packed:
            if not member.isfile():
                require(member.isdir(), 'UNEXPECTED_ARCHIVE_LINK_OR_SPECIAL_FILE')
                continue
            require(member.name.startswith('koder-cli/'), 'UNEXPECTED_ARCHIVE_PREFIX')
            parts = Path(member.name[len('koder-cli/'):]).parts
            require(parts and '..' not in parts and not Path(*parts).is_absolute(), 'UNSAFE_ARCHIVE_NAME')
            target = install / 'versions' / version / Path(*parts)
            expected = hashlib.sha256(packed.extractfile(member).read()).hexdigest()
            require(target.is_file() and not target.is_symlink() and digest(target) == expected,
                    'INSTALLED_FILE_DIFFERS:' + member.name)
            rows.append((member.name, expected))
    require(rows, 'EMPTY_ARCHIVE')
    return {'regularFilesMatched': len(rows), 'fileManifestSha256': hashlib.sha256(json.dumps(rows, separators=(',', ':')).encode()).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--previous-assets', required=True, type=Path)
    parser.add_argument('--assets', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    parser.add_argument('--runtime', type=Path, help='Optional exact previously downloaded owned node-v22.23.3-win-*/node.exe; copied, never modified')
    args = parser.parse_args()
    out = args.out.resolve()
    require(not out.exists(), 'NEW_OWNED_OUTPUT_DIRECTORY_REQUIRED')
    out.mkdir(parents=True)
    receipt = {'from': FROM, 'to': TO, 'publicUpdateBase': PUBLIC_BASE, 'nativeWindows': os.name == 'nt',
               'passed': False, 'status': 'RUNNING', 'caseLimitSeconds': 100, 'cases': [],
               'crossVersionClaim': False, 'coldBootClaim': False, 'loopbackRequests': []}
    save = lambda: (out / 'receipt.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    save()
    parent = None
    before = None
    server = None
    thread = None
    install = out / 'install'
    try:
        require(os.name == 'nt', 'WINDOWS_NATIVE_REQUIRED')
        parent_file = Path(__file__).with_name('windows-no-node-r2.py')
        require(digest(parent_file) == FROZEN_PARENT_SHA, 'FROZEN_PROCESS_PARENT_SHA_MISMATCH')
        parent = runpy.run_path(str(parent_file))
        previous, previous_bytes = manifest_for(args.previous_assets.resolve(), FROM)
        current, _ = manifest_for(args.assets.resolve(), TO)
        receipt['releaseAssets'] = {FROM: {'sha256': previous['sha256'], 'bytes': previous['size']},
                                    TO: {'sha256': current['sha256'], 'bytes': current['size']}}
        receipt['liveManifestUrl'] = PUBLIC_BASE + '/koder-cli-latest.json'
        receipt['networkOwner'] = 'Original installed CLI and installer; all live update requests remain inside the 100-second process case'
        system = Path(os.environ['SystemRoot'])
        cmd, ps = system / 'System32/cmd.exe', system / 'System32/WindowsPowerShell/v1.0/powershell.exe'
        profile, tmp, cwd, data = out / 'profile', out / 'tmp', out / 'empty-cwd', out / 'data'
        for directory in [profile, tmp, cwd, data, profile / 'AppData/Local', profile / 'AppData/Roaming']:
            directory.mkdir(parents=True)
        node = None
        if args.runtime:
            source = args.runtime.resolve()
            require(source.name.lower() == 'node.exe' and source.is_file(), 'RUNTIME_NODE_EXE_REQUIRED')
            require(re.fullmatch(r'node-v22\.23\.3-win-(?:x64|arm64)', source.parent.name), 'EXACT_OWNED_RUNTIME_DIRECTORY_REQUIRED')
            require(not any(p.is_symlink() for p in source.parent.rglob('*')), 'RUNTIME_LINK_NOT_ALLOWED')
            source_sha = digest(source)
            destination = install / 'runtime' / source.parent.name
            shutil.copytree(source.parent, destination)
            node = destination / 'node.exe'
            require(digest(node) == source_sha, 'RUNTIME_COPY_MISMATCH')
            receipt['runtimeCopy'] = {'source': str(source), 'sourceSha256': source_sha, 'destination': str(node)}
        paths = ([node.parent] if node else []) + [system / 'System32', system, system / 'System32/Wbem', ps.parent]
        env = {k: v for k, v in os.environ.items() if not k.upper().startswith('KODER_')
               and k.upper() not in ['PATH', 'NODE_OPTIONS', 'NODE_PATH', 'PSMODULEPATH']}
        env.update({'PATH': ';'.join(str(p) for p in paths), 'HOME': str(profile), 'USERPROFILE': str(profile),
                    'LOCALAPPDATA': str(profile / 'AppData/Local'), 'APPDATA': str(profile / 'AppData/Roaming'),
                    'TEMP': str(tmp), 'TMP': str(tmp), 'KODER_INSTALL_HOME': str(install), 'KODER_CLI_HOME': str(install),
                    'KODER_DATA': str(data), 'KODER_AUTO_UPDATE': '0', 'KODER_REMOTE_RESOURCES': '0',
                    'KODER_NO_ONBOARD': '1', 'KODER_EULA_ACCEPT': '1', 'NO_COLOR': '1', 'KODER_LANG': 'en',
                    'KODER_EXPECTED_VERSION': FROM, 'KODER_EXPECTED_PACKAGE_SHA256': previous['sha256']})
        before = parent['user_path']()
        receipt['userPathBefore'] = before
        receipt['childPath'] = env['PATH']
        receipt['architecture'] = {key: os.environ.get(key) for key in ['PROCESSOR_ARCHITECTURE', 'PROCESSOR_ARCHITEW6432']}

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                receipt['loopbackRequests'].append(self.path)
                if self.path == '/koder-cli-latest.json':
                    content = previous_bytes
                elif self.path == '/' + previous['file']:
                    content = (args.previous_assets.resolve() / previous['file']).read_bytes()
                else:
                    self.send_error(404)
                    return
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
        env['KODER_INSTALL_BASE'] = f'http://127.0.0.1:{server.server_port}'

        def run(name, argv, child_env=env):
            row = parent['run_case'](name, argv, child_env, cwd, out, receipt)
            require(row['passed'], name.upper() + '_FAILED')
            return parent['output'](out, name)

        run('install-preview30', [ps, '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', args.previous_assets.resolve() / 'koder-cli.ps1'])
        old_info = verify_installed(install, FROM, node.resolve() if node else None)
        node = Path(old_info['node']).resolve()
        receipt['oldInstallInfo'] = old_info
        old_launcher = Path(old_info['launcher'])
        version = run('preview30-version', [cmd, '/d', '/c', old_launcher, '--version']).strip()
        require(version == 'koder ' + FROM, 'OLD_INSTALLED_CLI_NOT_RUNNING')
        require(receipt['loopbackRequests'] == ['/koder-cli-latest.json', '/' + previous['file']], 'OLD_INSTALL_TRANSFER_PATH_DIFFERS')
        receipt['oldInstalledArchive'] = compare_installed_archive(install, FROM, args.previous_assets.resolve() / previous['file'])
        server.shutdown(); server.server_close(); thread.join(timeout=3)
        require(not thread.is_alive(), 'LOOPBACK_SERVER_DID_NOT_CLOSE')
        server = None
        receipt['loopbackClosedBeforeUpdate'] = True
        # Actual settings location, plus an independent retained user-data file.
        config_file = install / 'config.json'
        config = json.loads(config_file.read_text(encoding='utf-8')) if config_file.exists() else {}
        config.update({'lang': 'en', 'nativeUpgradeSentinel': 'KODER_OWNED_UPGRADE_SETTING'})
        config_file.write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
        data_file = data / 'retained-user-setting.json'
        data_file.write_text('{"fixture":"preserved"}\n', encoding='utf-8')
        sentinels = {str(file): digest(file) for file in [config_file, data_file]}
        old_node_sha = digest(node)
        update_env = {**env, 'KODER_INSTALL_BASE': PUBLIC_BASE, 'KODER_EXPECTED_VERSION': TO,
                      'KODER_EXPECTED_PACKAGE_SHA256': current['sha256']}
        update_env.pop('KODER_EULA_ACCEPT')  # The real prior installation's identical agreement receipt authorizes reuse.
        old_entry = install / 'versions' / FROM / 'bin/koder.mjs'
        receipt['updateEntry'] = {'path': str(old_entry), 'sha256': digest(old_entry),
                                  'method': 'Actual installed Node and original installed bin/koder.mjs update; no API substitution'}
        # Invoke the exact installed CLI entry directly so the retained Popen handle is
        # the actual old Node host, not an intermediate CMD whose exit could hide it.
        run('actual-installed-cli-update', [node, old_entry, 'update'], update_env)
        host = receipt['cases'][-1]
        receipt['updateHostProcess'] = {key: host[key] for key in ['pid', 'exitCode', 'timedOut', 'streamsClosed', 'elapsedMs']}
        new_info = verify_installed(install, TO, node)
        receipt['newInstallInfo'] = new_info
        new_version = run('updated-version-new-process', [cmd, '/d', '/c', Path(new_info['launcher']), '--version'], update_env).strip()
        require(new_version == 'koder ' + TO, 'NEW_INSTALLED_CLI_NOT_RUNNING')
        require(digest(node) == old_node_sha, 'OWNED_RUNTIME_CHANGED_DURING_UPDATE')
        for file, expected in sentinels.items():
            require(digest(file) == expected, 'USER_SETTINGS_CHANGED:' + file)
        receipt['sentinelSha256'] = sentinels
        receipt['userSettingsPreserved'] = True
        receipt['newInstalledArchive'] = compare_installed_archive(install, TO, args.assets.resolve() / current['file'])
        activation_file = install / 'update-activation.json'
        activation = json.loads(activation_file.read_text(encoding='utf-8-sig'))
        require(activation['version'] == TO, 'UPDATE_ACTIVATION_MISSING_OR_WRONG')
        require(activation['entrySha256'] == digest(install / 'versions' / TO / 'bin/koder.mjs'), 'UPDATE_ACTIVATION_ENTRY_MISMATCH')
        receipt['activation'] = activation
        require(all(row['streamsClosed'] and row['exitCode'] == 0 and not row['timedOut'] for row in receipt['cases']), 'PROCESS_EXIT_EVIDENCE_INCOMPLETE')
        receipt['crossVersionClaim'] = True
        receipt['passed'] = True
        receipt['status'] = 'PASS_ACTUAL_PREVIEW30_TO_040_UPGRADE'
    except BaseException as exc:
        receipt['status'] = 'FAIL'
        receipt['error'] = repr(exc)
    finally:
        if server:
            server.shutdown(); server.server_close()
            if thread:
                thread.join(timeout=3)
        if before is not None and parent:
            try:
                parent['restore_user_path'](before, install, receipt, env)
            except BaseException as exc:
                receipt['cleanupError'] = repr(exc)
                receipt['passed'] = False
                receipt['status'] = 'FAIL_CLEANUP'
        if receipt.get('runtimeCopy'):
            try:
                require(digest(receipt['runtimeCopy']['source']) == receipt['runtimeCopy']['sourceSha256'], 'SOURCE_RUNTIME_CHANGED')
                receipt['sourceRuntimeUnchanged'] = True
            except BaseException as exc:
                receipt['sourceRuntimeCheckError'] = repr(exc)
                receipt['passed'] = False
        save()
        print(json.dumps({'passed': receipt['passed'], 'status': receipt['status'], 'receipt': str(out / 'receipt.json')}))
    return 0 if receipt['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
