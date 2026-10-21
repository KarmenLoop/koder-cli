from pathlib import Path
import json,hashlib,tempfile,copy,threading,http.server,subprocess,os,time,shutil
R=Path(__file__).resolve().parent;A=Path.cwd()/'candidate';O=Path.cwd()/'negative-results';O.mkdir(exist_ok=True)
manifest=json.loads((A/'koder-cli-latest.json').read_text());package=(A/manifest['file']).read_bytes();assert hashlib.sha256(package).hexdigest()==manifest['sha256']
rows=[]
for case in ['agreement-version','agreement-package-hash','tampered-package','changed-manifest']:
 home=Path(tempfile.mkdtemp(prefix='koder-native-negative-'));m=copy.deepcopy(manifest);body=package;requests=[]
 expected=''
 if case=='agreement-version':m['agreement']['id']='Koder-EULA-1.0';m['agreement']['version']='1.0';expected=('agreement does not match','许可版本不匹配')
 if case=='agreement-package-hash':m['agreement']['sha256']='b'*64;expected=('package agreement differs','安装包许可与发行清单不一致')
 if case=='tampered-package':body=package[:-1]+bytes([package[-1]^1]);expected=('package checksum mismatch','安装包校验失败（sha-256 不一致）')
 if case=='changed-manifest':expected=('sha-256 changed','更新清单 sha-256 与已检查的值不同')
 sentinels={'install.json':json.dumps({'version':'0.0.1'}),'provider.json':'{"apiKey":"synthetic-retained-key"}','preferences.md':'retained preference','memory/owned.json':'retained memory','eula-acceptance.json':'retained prior agreement'}
 for name,value in sentinels.items():p=home/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(value)
 before={name:hashlib.sha256((home/name).read_bytes()).hexdigest() for name in sentinels}
 class Handler(http.server.BaseHTTPRequestHandler):
  def do_GET(self):
   requests.append(self.path)
   if self.path.endswith('koder-cli-latest.json'):b=json.dumps(m).encode()
   elif self.path.endswith(manifest['file']):b=body
   else:self.send_error(404);return
   self.send_response(200);self.send_header('Content-Length',str(len(b)));self.end_headers();self.wfile.write(b)
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 env={**os.environ,'KODER_INSTALL_BASE':f'http://127.0.0.1:{server.server_port}','KODER_INSTALL_HOME':str(home),'KODER_CLI_HOME':str(home),'KODER_EULA_ACCEPT':'1','KODER_NO_ONBOARD':'1','KODER_LANG':'en'}
 if case=='changed-manifest':env.update(KODER_EXPECTED_VERSION=m['version'],KODER_EXPECTED_PACKAGE_SHA256='c'*64)
 start=time.monotonic()
 try:
  p=subprocess.run(['powershell.exe','-NoLogo','-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',str(A/'koder-cli.ps1')],env=env,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=30)
  text=p.stdout+p.stderr;(O/(case+'.log')).write_text(text,encoding='utf-8')
  assert p.returncode!=0,(case,text)
  assert any(token in text.lower() for token in expected),(case,text)
  after={name:hashlib.sha256((home/name).read_bytes()).hexdigest() for name in sentinels};assert before==after,(case,before,after)
  downloaded=any(r.endswith(manifest['file']) for r in requests)
  assert downloaded==(case in ['agreement-package-hash','tampered-package']),(case,requests)
  rows.append({'case':case,'passed':True,'exitCode':p.returncode,'seconds':time.monotonic()-start,'retainedFiles':len(before),'packageDownloaded':downloaded})
 finally:
  server.shutdown();server.server_close();shutil.rmtree(home)
  (O/'native-installer-negative.json').write_text(json.dumps({'candidateSha256':manifest['sha256'],'cases':rows,'passed':len(rows)==4},indent=2),encoding='utf-8')
print(json.dumps(rows))
