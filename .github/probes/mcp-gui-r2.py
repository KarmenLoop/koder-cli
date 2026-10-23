"""Owned Windows GUI acceptance through the original Koder Agent, not a model benchmark.
Run only in a disposable authorized runner. Never dismiss OOBE or alter desktop policy.
"""
import argparse, asyncio, base64, ctypes, hashlib, importlib.metadata, json, os
import platform, re, subprocess, sys, tarfile, threading, time, uuid
from ctypes import wintypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from jsonschema import Draft202012Validator
from mcp.client.stdio import stdio_client

p=argparse.ArgumentParser()
p.add_argument('--root',type=Path,required=True)
p.add_argument('--package',type=Path,required=True)
p.add_argument('--sha256',required=True)
p.add_argument('--version',required=True)
a=p.parse_args();r=a.root.resolve();e=r/'evidence';e.mkdir(exist_ok=True)
report={'passed':False,'scope':'exact Koder package, original host and owned GUI; not autonomous model planning',
        'realDesktop':'disposable hosted Windows runner; actual OS recorded separately',
        'platform':platform.platform(),'architecture':platform.machine(),'python':sys.version,
        'paidModelRequests':0,'privacySettingsChanged':False,'commands':[],'gates':[],'calls':[]}
children=[];model=None;model_thread=None
nonce='KODER_GUI_'+uuid.uuid4().hex
home=r/'gui-home';project=r/'gui-project';package=r/'gui-package'
for d in [home,project,package]:d.mkdir(exist_ok=False)
env={**os.environ,'HOME':str(home),'USERPROFILE':str(home),'KODER_CLI_HOME':str(home/'.koder-cli'),
     'KODER_DATA':str(home/'koder-data'),'KODER_CONNECTIONS_HOME':str(home/'.koder-cli/apps'),'KODER_EULA_ACCEPT':'1','KODER_AUTO_UPDATE':'0',
     'KODER_REMOTE_RESOURCES':'0','NO_COLOR':'1','ANONYMIZED_TELEMETRY':'false',
     'PYTHONUTF8':'1','PYTHONIOENCODING':'utf-8','PYTHONUNBUFFERED':'1'}
exe=r/'runtime/Scripts/windows-mcp.exe'

def save():
    (e/'mcp-gui-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

def native_api():
    u=ctypes.WinDLL('user32',use_last_error=True);k=ctypes.WinDLL('kernel32',use_last_error=True)
    for name,restype,argtypes in [
      ('GetForegroundWindow',wintypes.HWND,[]),('GetWindowThreadProcessId',wintypes.DWORD,[wintypes.HWND,ctypes.POINTER(wintypes.DWORD)]),
      ('WindowFromPoint',wintypes.HWND,[wintypes.POINT]),('GetAncestor',wintypes.HWND,[wintypes.HWND,wintypes.UINT]),
      ('GetWindowTextW',ctypes.c_int,[wintypes.HWND,wintypes.LPWSTR,ctypes.c_int]),
      ('PostMessageW',wintypes.BOOL,[wintypes.HWND,wintypes.UINT,wintypes.WPARAM,wintypes.LPARAM]),
      ('GetProcessWindowStation',wintypes.HANDLE,[]),('GetThreadDesktop',wintypes.HANDLE,[wintypes.DWORD]),
      ('OpenInputDesktop',wintypes.HANDLE,[wintypes.DWORD,wintypes.BOOL,wintypes.DWORD]),
      ('CloseDesktop',wintypes.BOOL,[wintypes.HANDLE]),
      ('GetUserObjectInformationW',wintypes.BOOL,[wintypes.HANDLE,ctypes.c_int,wintypes.LPVOID,wintypes.DWORD,ctypes.POINTER(wintypes.DWORD)])]:
        f=getattr(u,name);f.restype=restype;f.argtypes=argtypes
    k.GetCurrentThreadId.restype=wintypes.DWORD
    k.WTSGetActiveConsoleSessionId.restype=wintypes.DWORD
    k.ProcessIdToSessionId.restype=wintypes.BOOL;k.ProcessIdToSessionId.argtypes=[wintypes.DWORD,ctypes.POINTER(wintypes.DWORD)]
    return u,k

def title(hwnd):
    text=ctypes.create_unicode_buffer(1024);U.GetWindowTextW(hwnd,text,1024);return text.value

def owner(hwnd):
    value=wintypes.DWORD();tid=U.GetWindowThreadProcessId(hwnd,ctypes.byref(value));return {'hwnd':hwnd,'pid':value.value,'tid':tid,'title':title(hwnd)}

def desktop_info():
    def name(handle):
        if not handle:return None
        out=ctypes.create_unicode_buffer(1024);needed=wintypes.DWORD()
        if not U.GetUserObjectInformationW(handle,2,out,ctypes.sizeof(out),ctypes.byref(needed)):return {'error':ctypes.get_last_error()}
        return out.value
    sid=wintypes.DWORD();ok=K.ProcessIdToSessionId(os.getpid(),ctypes.byref(sid))
    inp=U.OpenInputDesktop(0,False,0x0001) # DESKTOP_READOBJECTS, no switch or configuration change
    try:
        return {'pid':os.getpid(),'processSessionId':sid.value if ok else None,
                'activeConsoleSessionId':K.WTSGetActiveConsoleSessionId(),
                'windowStation':name(U.GetProcessWindowStation()),'threadDesktop':name(U.GetThreadDesktop(K.GetCurrentThreadId())),
                'inputDesktop':name(inp),'inputDesktopOpen':bool(inp),'inputDesktopError':None if inp else ctypes.get_last_error(),
                'foreground':owner(U.GetForegroundWindow())}
    finally:
        if inp:U.CloseDesktop(inp)

def gate(window,phase,point=True):
    expected=window['coords'];child=window['process']
    actual=owner(U.GetForegroundWindow());row={'phase':phase,'expected':expected,'actual':actual,'childReturnCode':child.poll()}
    report['gates'].append(row);save()
    assert child.poll() is None,'OWNED_UI_EXITED'
    assert expected['pid']==child.pid and owner(expected['hwnd'])['pid']==child.pid,'OWNED_UI_IDENTITY_CHANGED'
    assert actual['hwnd']==expected['hwnd'] and actual['pid']==child.pid and actual['title']==window['title'], 'OWNED_UI_NOT_FOREGROUND: no input permitted; do not dismiss setup/privacy/UAC'
    if point:
        at=U.WindowFromPoint(wintypes.POINT(expected['x'],expected['y']));root=U.GetAncestor(at,2)
        row['pointRoot']=owner(root);save()
        assert root==expected['hwnd'] and owner(root)['pid']==child.pid,'OWNED_POINT_OCCLUDED'

def host_cleanup(phase):
    profiles=list((home/'.koder-cli/apps/profiles').glob('*/app-host.json'))
    assert len(profiles)==1,'EXPECTED_ONE_OWNED_CONNECTION_PROFILE'
    current=json.loads(profiles[0].read_text(encoding='utf-8'))
    closed_path=profiles[0].with_name('app-host-closed.json')
    assert closed_path.is_file(),'HOST_CLOSE_RECEIPT_MISSING'
    closed=json.loads(closed_path.read_text(encoding='utf-8'))
    assert all(current.get(k)==closed.get(k) for k in ['host','pid','generation']),'HOST_CLOSE_RECEIPT_STALE'
    assert closed.get('receipt',{}).get('ok') is True,'HOST_CLEANUP_UNCONFIRMED'
    K.OpenProcess.argtypes=[wintypes.DWORD,wintypes.BOOL,wintypes.DWORD];K.OpenProcess.restype=wintypes.HANDLE
    K.WaitForSingleObject.argtypes=[wintypes.HANDLE,wintypes.DWORD];K.WaitForSingleObject.restype=wintypes.DWORD
    K.CloseHandle.argtypes=[wintypes.HANDLE];K.CloseHandle.restype=wintypes.BOOL
    handle=K.OpenProcess(0x00100000,False,current['pid'])
    if handle:
        try:assert K.WaitForSingleObject(handle,0)==0,'OWNED_HOST_STILL_RUNNING'
        finally:K.CloseHandle(handle)
    else:assert ctypes.get_last_error()==87,'OWNED_HOST_LIVENESS_UNCONFIRMED'
    report.setdefault('hostCleanup',[]).append({'phase':phase,'pid':current['pid'],'generationSha256':hashlib.sha256(current['generation'].encode()).hexdigest(),'receipt':closed['receipt'],'processExited':True})
    save()

def command(argv,timeout=60,command_env=None):
    start=time.monotonic();row={'argv':argv,'timeoutSeconds':timeout}
    try:
        v=subprocess.run(argv,cwd=project,env=command_env or env,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=timeout)
        row.update(exitCode=v.returncode,stdout=v.stdout,stderr=v.stderr);return v
    except subprocess.TimeoutExpired as error:
        row.update(exitCode=None,timedOut=True,cleanupUnconfirmed=True,
                   stdout=(error.stdout or b'').decode('utf-8','replace') if isinstance(error.stdout,bytes) else error.stdout,
                   stderr=(error.stderr or b'').decode('utf-8','replace') if isinstance(error.stderr,bytes) else error.stderr)
        raise
    finally:
        row['seconds']=round(time.monotonic()-start,3);report['commands'].append(row);save()

def spawn_window(label,x):
    name=f'KoderOwned_{label}_{nonce}';coords=project/f'ui-{label}.json';saved=project/f'ui-{label}.txt'
    source="""import ctypes, json, os, sys, time
from ctypes import wintypes
from pathlib import Path
started=time.monotonic()
title, x, coords_name, saved_name, phases_name=sys.argv[1:]
coords=Path(coords_name);saved=Path(saved_name);phases=Path(phases_name)
stages=[]
def atomic(path,text):
    temporary=path.with_name(path.name+'.tmp')
    temporary.write_text(text,encoding='utf-8')
    os.replace(temporary,path)
def stage(name,**fields):
    stages.append({'phase':name,'seconds':round(time.monotonic()-started,3),**fields})
    atomic(phases,json.dumps(stages,indent=2))
stage('python-started',pid=os.getpid(),python=sys.version)
import tkinter as tk
stage('tkinter-imported',tkVersion=tk.TkVersion,tclVersion=tk.TclVersion)
root=tk.Tk();root.withdraw();root.title(title);root.geometry(f'440x220+{x}+70')
root.attributes('-topmost',False)
root.resizable(False,False)
value=tk.StringVar(root,value='')
box=tk.Entry(root,name='koder_owned_input',textvariable=value)
box.place(x=30,y=65,width=340,height=26)
saved.write_text('',encoding='utf-8')
def changed(*_):
    atomic(saved,value.get())
value.trace_add('write',changed)
u=ctypes.WinDLL('user32',use_last_error=True)
u.GetAncestor.restype=wintypes.HWND;u.GetAncestor.argtypes=[wintypes.HWND,wintypes.UINT]
u.GetWindowRect.restype=wintypes.BOOL;u.GetWindowRect.argtypes=[wintypes.HWND,ctypes.POINTER(wintypes.RECT)]
def ready():
    if not root.winfo_viewable():
        root.after(10,ready);return
    root.update_idletasks()
    hwnd=u.GetAncestor(root.winfo_id(),2);assert hwnd,'OWNED_TK_HWND_MISSING'
    rect=wintypes.RECT();assert u.GetWindowRect(hwnd,ctypes.byref(rect)),'OWNED_TK_RECT_MISSING'
    # Only local widget focus; never SetForegroundWindow, lift, topmost or focus_force.
    box.focus_set()
    payload={'x':box.winfo_rootx()+20,'y':box.winfo_rooty()+10,'pid':os.getpid(),'hwnd':hwnd,
             'left':rect.left,'top':rect.top,'right':rect.right,'bottom':rect.bottom}
    stage('window-ready',coords=payload,topmost=bool(root.attributes('-topmost')))
    atomic(coords,json.dumps(payload))
root.protocol('WM_DELETE_WINDOW',root.destroy)
stage('before-mainloop')
root.deiconify();root.after_idle(ready);root.mainloop()
stage('normally-closed')
"""
    fixture=e/f'owned-{label}.py';fixture.write_text(source,encoding='utf-8')
    stderr=(e/f'owned-{label}.stderr').open('wb')
    argv=[sys.executable,str(fixture),name,str(x),str(coords),str(saved),str(e/f'owned-{label}-phases.json')]
    proc=subprocess.Popen(argv,env=env,stdout=subprocess.DEVNULL,stderr=stderr)
    window={'label':label,'title':name,'process':proc,'stderr':stderr,'coordsPath':coords,'saved':saved}
    children.append(window);started=time.monotonic();end=started+8
    fixture_row={'label':label,'pid':proc.pid,'argv':argv,'readyTimeoutSeconds':8,'kind':'stdlib-tkinter'}
    report.setdefault('fixtures',[]).append(fixture_row);save()
    while not coords.exists():
        assert proc.poll() is None,'OWNED_UI_EXITED_BEFORE_READY'
        assert time.monotonic()<end,'OWNED_UI_READY_TIMEOUT'
        time.sleep(.1)
    window['coords']=json.loads(coords.read_text(encoding='utf-8'))
    assert window['coords']['pid']==proc.pid,'OWNED_UI_PID_MISMATCH'
    fixture_row['readySeconds']=round(time.monotonic()-started,3);save()
    return window

def latest_result(body):
    last=body['messages'][-1]
    assert last['role']=='tool','EXPECTED_REAL_TOOL_RESULT'
    value=json.loads(last['content']);assert isinstance(value,dict)
    return value

def result_ok(body,step):
    value=latest_result(body)
    assert value.get('state')=='succeeded' and value.get('ok') is not False and value.get('isError') is not True,(step,value)
    return value

def agent_check(cli,A,B):
    trace=[];errors=[];tool_names={};marker='TYPE_'+nonce;steps=[('discover','App'),('call','App'),('discover','Click'),('call','Click'),('discover','Type'),('call','Type'),('discover','Snapshot'),('call','Snapshot')]
    class Model(BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def do_POST(self):
            try:
                count=int(self.headers.get('Content-Length','0'));assert 0<count<2_000_000
                body=json.loads(self.rfile.read(count));index=len(trace);assert index<=len(steps),'MODEL_DRIVER_STEP_OVERFLOW';trace.append(body)
                (e/'agent-model-trace.json').write_text(json.dumps(trace,ensure_ascii=False,indent=2),encoding='utf-8')
                if index and steps[index-1][0]=='call':
                    previous=steps[index-1][1];value=result_ok(body,previous)
                    if previous=='App':gate(B,'after-agent-App')
                    elif previous=='Click':gate(B,'after-agent-Click')
                    elif previous=='Type':
                        gate(B,'after-agent-Type');deadline=time.monotonic()+3
                        while B['saved'].read_text(encoding='utf-8')!=marker:
                            assert time.monotonic()<deadline,'OWNED_TEXT_READBACK_MISMATCH'
                            time.sleep(.05)
                        assert A['saved'].read_text(encoding='utf-8')=='','OTHER_OWNED_WINDOW_WAS_TYPED'
                    elif previous=='Snapshot':
                        assert value.get('artifact') and value.get('media')=='artifact-only','REAL_IMAGE_ARTIFACT_NOT_RETAINED'
                        report['agentSnapshotArtifact']=value['artifact'];report['agentSnapshotPreview']=value.get('preview','');save()
                if index==len(steps):
                    gate(B,'before-agent-final');assert B['saved'].read_text(encoding='utf-8')==marker
                    message={'role':'assistant','content':'Owned window switch, click and typed marker were verified by independent readback; screenshot receipt retained.'}
                else:
                    kind,tool=steps[index]
                    if kind=='discover':name='app_tools';arguments={'query':'__'+tool}
                    else:
                        data=latest_result(body);rows=data.get('tools')
                        if rows is None and data.get('preview'):rows=json.loads(data['preview']).get('tools')
                        assert isinstance(rows,list),'ACTUAL_TOOL_CATALOG_MISSING'
                        found=[v for v in rows if re.search(r'__'+re.escape(tool)+r'$',v.get('name',''))]
                        assert len(found)==1,('EXPECTED_ONE_ACTUAL_TOOL',tool,[v.get('name') for v in rows])
                        tool_names[tool]=found[0]['name'];name='app_call'
                        if tool=='App':gate(A,'before-agent-App');args={'mode':'switch','name':B['title']}
                        elif tool=='Click':gate(B,'before-agent-Click');args={'loc':[B['coords']['x'],B['coords']['y']]}
                        elif tool=='Type':gate(B,'before-agent-Type');args={'loc':[B['coords']['x'],B['coords']['y']],'text':marker,'clear':True}
                        else:
                            gate(B,'before-agent-Snapshot');q=B['coords'];args={'use_vision':True,'use_ui_tree':True,'use_annotation':False,'region':[q['left'],q['top'],q['right'],q['bottom']]}
                        schema=found[0].get('parameters');assert isinstance(schema,dict),'ACTUAL_TOOL_SCHEMA_MISSING'
                        Draft202012Validator.check_schema(schema);Draft202012Validator(schema).validate(args)
                        report.setdefault('schemaChecks',[]).append({'tool':tool,'name':tool_names[tool],'schemaDigest':found[0].get('schemaDigest'),'argumentsValid':True});save()
                        arguments={'name':tool_names[tool],'arguments':args}
                    message={'role':'assistant','content':None,'tool_calls':[{'id':f'owned_gui_{index}','type':'function','function':{'name':name,'arguments':json.dumps(arguments)}}]}
                data=json.dumps({'choices':[{'message':message,'finish_reason':'tool_calls' if 'tool_calls' in message else 'stop'}],'usage':{'prompt_tokens':10,'completion_tokens':10}}).encode()
                self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
            except BaseException as error:
                errors.append(repr(error));report['modelDriverErrors']=errors;save()
                data=json.dumps({'error':{'message':'Owned GUI acceptance driver assertion failed'}}).encode()
                self.send_response(500);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
    server=ThreadingHTTPServer(('127.0.0.1',0),Model);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        model_env={**env,'KODER_MODEL':'owned-gui-scripted-audit','KODER_BASE_URL':f'http://127.0.0.1:{server.server_port}/v1','KODER_AUTH':'none','KODER_API_KEY':'','KODER_API_RETRIES':'0','KODER_CONTEXT_WINDOW':'64000'}
        argv=['node',str(cli),'run','Use the configured Windows MCP to switch between the two owned acceptance windows, enter the exact supplied marker and capture the owned target.','--approval','full','--no-memory','-w',str(project)]
        v=command(argv,60,model_env)
        report['scriptedModelRequests']=len(trace);report['actualDiscoveredNames']=tool_names;save()
        assert v.returncode==0 and not errors,('KODER_AGENT_FAILED',v.returncode,errors)
        assert len(trace)==len(steps)+1,('WRONG_MODEL_CONTINUATION_COUNT',len(trace))
        assert B['saved'].read_text(encoding='utf-8')==marker and A['saved'].read_text(encoding='utf-8')==''
        assert v.stdout.count('full: external-action')>=4,'ORIGINAL_APPROVAL_RECEIPTS_MISSING'
        host_cleanup('after-agent-gui')
        report['actualKoderAgentGuiAndContinuation']=True;save()
    finally:server.shutdown();server.server_close();thread.join(timeout=3)

async def supplemental_image(B):
    gate(B,'before-supplemental-readonly-screenshot')
    with (e/'upstream-screenshot.stderr').open('w',encoding='utf-8') as log:
        async with stdio_client(StdioServerParameters(command=str(exe),args=['serve'],env=env,cwd=str(project)),errlog=log) as (read,write):
            async with ClientSession(read,write) as client:
                init=await asyncio.wait_for(client.initialize(),30);listing=await asyncio.wait_for(client.list_tools(),10)
                (e/'direct-discovery.json').write_text(json.dumps({'server':init.model_dump(mode='json'),'tools':[v.model_dump(mode='json') for v in listing.tools]},indent=2),encoding='utf-8')
                assert 'Screenshot' in {x.name for x in listing.tools}
                q=B['coords'];args={'use_annotation':False,'region':[q['left'],q['top'],q['right'],q['bottom']]}
                value=await asyncio.wait_for(client.call_tool('Screenshot',args),30);data=value.model_dump(mode='json')
                assert not data.get('is_error',data.get('isError',False)),data
                images=[]
                for n,c in enumerate(data.get('content',[])):
                    if c.get('type')=='image':
                        image=base64.b64decode(c['data'],validate=True);mime=c.get('mimeType',c.get('mime_type'))
                        assert len(image)>100 and mime in ['image/png','image/jpeg']
                        filename=f'owned-target-{n}.'+('png' if mime=='image/png' else 'jpg');(e/filename).write_bytes(image)
                        row={'path':filename,'mimeType':mime,'bytes':len(image),'sha256':hashlib.sha256(image).hexdigest()};images.append(row);c['data']={'saved':row}
                assert images,'NATIVE_SCREENSHOT_IMAGE_MISSING'
                report['supplementalDirectScreenshot']=images;report['calls'].append({'name':'Screenshot','arguments':args,'result':data});save()

async def main():
    global U,K
    try:
        assert os.name=='nt','NATIVE_WINDOWS_REQUIRED'
        U,K=native_api();report['desktop']=desktop_info();save()
        assert report['desktop']['inputDesktopOpen'],'INPUT_DESKTOP_UNAVAILABLE'
        report['windowsMcpVersion']=importlib.metadata.version('windows-mcp');assert report['windowsMcpVersion']=='0.8.8'
        assert exe.is_file(),'OWNED_WINDOWS_MCP_EXECUTABLE_MISSING'
        tar=a.package.resolve();actual=hashlib.sha256(tar.read_bytes()).hexdigest();report['archiveSha256']=actual;assert actual==a.sha256
        with tarfile.open(tar) as archive:
            for member in archive.getmembers():
                assert not member.name.startswith(('/','\\')) and '..' not in Path(member.name).parts and (member.isfile() or member.isdir()),'UNSAFE_ARCHIVE'
            archive.extractall(package,filter='data')
        source=package/'koder-cli';assert json.loads((source/'package.json').read_text(encoding='utf-8'))['version']==a.version
        cli=source/'bin/koder.mjs'
        for args in [['--version'],['eula','accept'],['mcp','add','windows','--preset','windows-mcp','--command',str(exe),'--enable','--json','-w',str(project)],['mcp','test','windows','--json','-w',str(project)]]:
            v=command(['node',str(cli),*args]);assert v.returncode==0,('CLI_FAILED',args,v.stderr)
            if args==['--version']:assert v.stdout.strip()=='koder '+a.version
            if args[:2]==['mcp','test']:
                state=json.loads(v.stdout);assert state['state']=='connected'
                (e/'koder-tool-discovery.json').write_text(json.dumps(state,indent=2),encoding='utf-8')
        host_cleanup('after-mcp-add-test')
        report['actualKoderAddTest']=True
        B=spawn_window('B',535);A=spawn_window('A',35);gate(A,'initial-A-foreground')
        report['ownedWindows']=[{k:v for k,v in x.items() if k in ['label','title','coords']} for x in [A,B]];save()
        agent_check(cli,A,B)
        await supplemental_image(B)
        report['passed']=True
    except BaseException as error:
        report['error']=repr(error);raise
    finally:
        clean=[]
        for window in reversed(children):
            child=window['process'];row={'pid':child.pid,'label':window['label'],'forced':False}
            try:
                if child.poll() is None:
                    q=window.get('coords')
                    if q:
                        assert q['pid']==child.pid and owner(q['hwnd'])['pid']==child.pid and title(q['hwnd'])==window['title'],'CLEANUP_IDENTITY_MISMATCH'
                        assert U.PostMessageW(q['hwnd'],0x0010,0,0),'OWNED_CLOSE_REQUEST_FAILED'
                    try:child.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        row['forced']=True;child.terminate();child.wait(timeout=3)
                row['exitCode']=child.returncode
                if child.returncode!=0 or row['forced']:report['passed']=False
            except BaseException as error:row['error']=repr(error);report['passed']=False
            finally:window['stderr'].close();clean.append(row)
        report['ownedWindowCleanup']=clean;save()
    assert report['passed'],'GUI_ACCEPTANCE_INCOMPLETE'

asyncio.run(main())
