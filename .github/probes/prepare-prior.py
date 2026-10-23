"""Fetch the frozen prior public release for an actual installed update."""
import argparse, hashlib, json, urllib.request
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--out',required=True);a=p.parse_args()
out=Path(a.out);out.mkdir(parents=True,exist_ok=False)
files={
 'koder-cli-0.4.0-preview.30.tgz':'cb9dabbcd86ac2cd9165142b1982d047bfa5b7883485cf14d4e05250d6056c72',
 'koder-cli-0.4.0-preview.30.json':'baff78db1b1cef8174911ce799e86d77ab104fdddac5f291ec99716c23bc793a',
 'koder-cli.ps1':'4ff804e17e51770776d7fd3eb49161c47f1db6bf3c787f05f468dfa1482031ea',
}
for name,sha in files.items():
 req=urllib.request.Request('https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.30/'+name,headers={'User-Agent':'Koder-update-acceptance'})
 with urllib.request.urlopen(req,timeout=60) as response:data=response.read(50_000_001)
 assert len(data)<=50_000_000 and hashlib.sha256(data).hexdigest()==sha,'Frozen prior asset mismatch: '+name
 (out/name).write_bytes(data)
print(json.dumps({'frozenPrior':'0.4.0-preview.30','verifiedAssets':len(files)}))
