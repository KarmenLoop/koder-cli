from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import datetime, hashlib, json, urllib.request, urllib.error

R=Path(__file__).resolve().parent
O=R/'results';O.mkdir(exist_ok=True)
expected=json.loads((R/'public-readback-expected.json').read_text())
origin=expected['origin']
sha=lambda b:hashlib.sha256(b).hexdigest()

def request(url, data=None):
    req=urllib.request.Request(url,data=data,headers={'User-Agent':'Koder-Release-Readback','Cache-Control':'no-cache',**({'Content-Type':'application/json'} if data else {})})
    with urllib.request.urlopen(req,timeout=30) as response:
        return response.status,dict(response.headers),response.read()

def file(row):
    try:
        if row.get('redirectTo'):
            class NoRedirect(urllib.request.HTTPRedirectHandler):
                def redirect_request(self,*args,**kwargs):return None
            try:
                response=urllib.request.build_opener(NoRedirect).open(origin+'/'+row['path'],timeout=30)
            except urllib.error.HTTPError as error:
                response=error
            assert response.status==302 and response.headers.get('Location')==row['redirectTo']
            status,_,body=request(row['redirectTo'])
            assert status==200 and b'KARMENBOT' in body and b'<html' in body
            return {'path':row['path'],'status':302,'location':row['redirectTo'],'targetStatus':status,'mode':'declared-redirect','passed':True}
        status,headers,body=request(origin+'/'+row['path'])
        actual=sha(body)
        assert status==200 and len(body)==row['bytes'] and actual==row['sha256']
        assert next((v for k,v in headers.items() if k.lower()=='x-content-type-options'),None)=='nosniff'
        return {**row,'status':status,'passed':True}
    except Exception as error:
        return {'path':row['path'],'passed':False,'errorType':type(error).__name__}

rows=list(ThreadPoolExecutor(max_workers=4).map(file,expected['files']))
manifest=next(r for r in expected['files'] if r['path']=='install/koder-cli-latest.json')
external=[]
for label,url in [
    ('GitHub update feed','https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/updates/koder-cli-latest.json'),
    ('GitHub release manifest','https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.17/koder-cli-latest.json'),
]:
    status,_,body=request(url)
    passed=status==200 and sha(body)==manifest['sha256'] and json.loads(body)['version']==expected['version']
    external.append({'name':label,'status':status,'sha256':sha(body),'passed':passed})

status,_,body=request(origin+'/api/koder-resources',b'{"action":"status"}')
hub=json.loads(body)
external.append({'name':'Reference library status','status':status,'resources':hub.get('resources'),'passed':status==200 and hub.get('available') is True and hub.get('resources')==1004})
report={'passed':all(r['passed'] for r in rows+external),'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':expected['version'],'pages':expected['pages'],'websiteFiles':len(rows),'files':rows,'external':external}
(O/'public-readback.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['files']}))
assert report['passed'],[r for r in rows+external if not r['passed']]
