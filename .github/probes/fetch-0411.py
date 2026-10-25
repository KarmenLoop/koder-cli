"""Fetch only frozen public release assets; never install into the host profile."""
import hashlib,json,os,subprocess,sys
from pathlib import Path
spec=Path(__file__).with_name('published-0411-frozen.json')
assert hashlib.sha256(spec.read_bytes()).hexdigest()=='43978879884718cf12b29f7b14a32d38a975de00dc18c9dc66c09a2076d32118'
plan=json.loads(spec.read_text()); root=Path(os.environ['RUNNER_TEMP'])/'koder-0411-input'
root.mkdir(exist_ok=False)
versions=['0.4.10','0.4.11'] if sys.argv[1]=='upgrade' else ['0.4.11']
for version in versions:
    folder=root/version;folder.mkdir()
    for name,expected in plan['releases'][version]['files'].items():
        target=folder/name
        subprocess.run(['curl','-fLSs','--proto','=https','--proto-redir','=https','--connect-timeout','15','--max-time','180','https://github.com/KarmenLoop/koder-cli/releases/download/cli-'+version+'/'+name,'-o',str(target)],check=True)
        assert target.stat().st_size==expected['size'],name
        assert hashlib.sha256(target.read_bytes()).hexdigest()==expected['sha256'],name
print(json.dumps({'versions':versions,'root':str(root),'allAssetBytesVerified':True}))
