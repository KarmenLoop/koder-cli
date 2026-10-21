from pathlib import Path
import hashlib,json,os,subprocess,tempfile,urllib.request

R=Path(__file__).resolve().parent;O=R/'results';O.mkdir(exist_ok=True)
expected=json.loads((R/'public-readback-expected.json').read_text())
row=next(x for x in expected['files'] if x['path']=='install/koder-cli.sh')
with urllib.request.urlopen(expected['origin']+'/'+row['path'],timeout=30) as response:script=response.read()
assert hashlib.sha256(script).hexdigest()==row['sha256']
home=Path(tempfile.mkdtemp(prefix='koder-public-'))
installer=home/'installer.sh';installer.write_bytes(script)
env={k:v for k,v in os.environ.items() if not k.startswith('KODER_')}
env.update(HOME=str(home),KODER_CLI_HOME=str(home/'install'),KODER_BIN_DIR=str(home/'bin'),KODER_EULA_ACCEPT='1')
commands=[]
def run(name,argv):
    p=subprocess.run(argv,env=env,capture_output=True,text=True,timeout=150)
    (O/(name+'.log')).write_text(p.stdout+p.stderr)
    commands.append({'name':name,'command':argv,'exitCode':p.returncode})
    assert p.returncode==0,p.stdout+p.stderr
    return p.stdout
run('linux-public-install',['bash',str(installer),'--no-onboard','--no-modify-path'])
launcher=str(home/'bin/koder')
version=run('linux-public-version',[launcher,'--version']);assert expected['version'] in version
for name in ['deepseek','kimi','mimo-token-plan','aliyun-token-plan','volcano-coding-plan']:
    output=run('linux-unavailable-'+name,[launcher,'--json','model','models',name])
    assert json.loads(output)[0]['disabled'] is True
info=json.loads((home/'install/install.json').read_text());assert info['version']==expected['version']
(O/'public-linux-install.json').write_text(json.dumps({'passed':True,'version':info['version'],'publicInstallerSha256':row['sha256'],'commands':commands,'scope':'Disposable hosted Linux home; actual public installer, package checksums and installed entry; no user data or model API requests.'},indent=2)+'\n')
print('Public Linux installation and unavailable catalog checks passed.')
