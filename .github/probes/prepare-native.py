"""Fetch frozen public release bytes without starting PowerShell or a target Node."""
import argparse, hashlib, json, os, platform, tarfile, time, urllib.request
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument('--root', required=True)
p.add_argument('--extract', action='store_true')
a = p.parse_args()
root = Path(a.root).resolve()
root.mkdir(parents=True, exist_ok=True)
assets = root / 'assets'; assets.mkdir(exist_ok=True)
evidence = root / 'evidence'; evidence.mkdir(exist_ok=True)
fixed = {
    'koder-cli-0.4.0.tgz': '86b6071c224437298a01e4b909d07fd1d91826b348fab181a8a50209eb390566',
    'koder-cli.cmd': '550e442d5deb34dc22417d520bd45dccebf08c005d5ac424b96304ef841a54f9',
    'koder-cli.ps1': '5c124b76c834730b776a445a83798ac8cf43f06afa2af6d8a99e2b54b2f7df3d',
    'koder-cli-0.4.0.json': '6a59f9227899681d925fc8a98cf5ec47bcb43a5eadfdf729f0528f3f0ca4eb0c',
}
records = []
try:
    for name, expected in fixed.items():
        url = 'https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0/' + name
        start = time.monotonic()
        req = urllib.request.Request(url, headers={'User-Agent': 'Koder-native-acceptance'})
        with urllib.request.urlopen(req, timeout=60) as response:
            data = response.read(50_000_001)
        actual = hashlib.sha256(data).hexdigest()
        records.append(dict(name=name, url=url, bytes=len(data), sha256=actual,
                            expectedSha256=expected, seconds=round(time.monotonic()-start, 3)))
        assert len(data) <= 50_000_000 and actual == expected, name + ': frozen digest mismatch'
        (assets / name).write_bytes(data)
    if a.extract:
        dest = root / 'package'; dest.mkdir()
        with tarfile.open(assets / 'koder-cli-0.4.0.tgz', 'r:gz') as archive:
            archive.extractall(dest, filter='data')
    print(json.dumps({'prepared': True, 'root': str(root), 'assets': len(records)}))
finally:
    (evidence / 'preparation.json').write_text(json.dumps({
        'system': platform.platform(), 'machine': platform.machine(),
        'runnerArch': os.environ.get('RUNNER_ARCH'), 'assets': records,
        'scope': 'Infrastructure Python only; no target PowerShell or Node startup.'
    }, indent=2), encoding='utf-8')
