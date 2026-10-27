"""Exercise native sudo with an owned ephemeral VM account, never a customer password."""
from pathlib import Path
import json, os, pty, re, select, secrets, signal, subprocess, tempfile, time, shutil, hashlib
root=Path.cwd()
settings=dict(line.split('=',1) for line in (root/'ubuntu-env').read_text().splitlines())
node=settings['KODER_TEST_NODE']; runtime=settings['KODER_TEST_RUNTIME']
out=Path(settings['KODER_TEST_RESULTS'])
user='kodercred'+secrets.token_hex(4)
password='Fixture-'+secrets.token_hex(16)
rule=Path('/etc/sudoers.d')/user
home=Path('/home')/user
rows=[]
created=False

def command(argv, **kw):
    return subprocess.run(argv,check=True,capture_output=True,**kw)

def exercise(script, cancel=False):
    pid,fd=pty.fork()
    if pid==0:
        os.execvp('sudo',['sudo','-u',user,'--',node,str(script),'cancel' if cancel else 'success'])
    buf=b''; sent=False; status=None; got=0; deadline=time.monotonic()+25
    try:
        while time.monotonic()<deadline:
            if select.select([fd],[],[],.1)[0]:
                try:chunk=os.read(fd,8192)
                except OSError:break
                if not chunk:break
                buf+=chunk
                if not sent and re.search(rb'(?i)password[^\r\n]*:\s*$',buf):
                    if not cancel:os.write(fd,(password+'\n').encode())
                    sent=True
            got,status=os.waitpid(pid,os.WNOHANG)
            if got:break
        if not got:
            got,status=os.waitpid(pid,os.WNOHANG)
            assert got, 'Native sudo fixture timed out'
    finally:
        (out/('credential-native-cancel.log' if cancel else 'credential-native-success.log')).write_bytes(buf.replace(password.encode(),b'[REDACTED]'))
        if not got:
            os.kill(pid,signal.SIGKILL);os.waitpid(pid,0)
        os.close(fd)
    assert sent, 'Native sudo did not ask for the fixture password; inspect the sanitized fixture transcript'
    assert password.encode() not in buf, 'The password was echoed'
    text=buf.decode(errors='replace')
    match=re.search(r'RESULT=(\{[^\r\n]+\})',text)
    assert match, text[-1000:]
    result=json.loads(match[1]); assert os.waitstatus_to_exitcode(status)==0
    if cancel:assert result['state']=='unknown' and result['reasonCode']=='SYSTEM_COMMAND_INTERRUPTED', result
    else:assert result['state']=='succeeded' and re.search(r'(?:^|[\r\n])0[\r\n]',text), result
    return {'case':'cancel-native-prompt' if cancel else 'native-password-and-command','passed':True,'passwordEchoed':False,'state':result['state']}

try:
    command(['sudo','useradd','--create-home','--shell','/bin/bash',user]);created=True
    command(['sudo','chpasswd'],input=(user+':'+password+'\n').encode())
    command(['sudo','tee',str(rule)],input=(user+' ALL=(root) /usr/bin/id -u\n').encode())
    command(['sudo','chmod','0440',str(rule)]);command(['sudo','visudo','-cf',str(rule)])
    with tempfile.TemporaryDirectory(prefix='koder-sudo-fixture-') as tmp:
        directory=Path(tmp);directory.chmod(0o755)
        # Production runtime directories correctly remain private to their owner.
        # Copy the exact installed helper and managed interpreter to this test-only directory.
        helper=directory/'system-login.mjs';shutil.copyfile(Path(runtime)/'src/system-login.mjs',helper);helper.chmod(0o644)
        copied_node=directory/'node';shutil.copyfile(node,copied_node);copied_node.chmod(0o755);node=str(copied_node)
        assert helper.read_bytes()==(Path(runtime)/'src/system-login.mjs').read_bytes()
        script=directory/'run.mjs'
        script.write_text('import {runSystemLogin} from '+json.dumps(helper.as_uri())+';\n'+
            'const controller=new AbortController(); const cancel=process.argv[2]===\"cancel\";\n'+
            'const timer=cancel?setTimeout(()=>controller.abort(),2500):null;\n'+
            'const ctx={io:{},opts:{},stdin:process.stdin,stderr:process.stderr,stdout:process.stdout,cwd:'+json.dumps(str(home))+',env:{TERM:\"xterm\",LANG:\"C.UTF-8\"}};\n'+
            'const result=await runSystemLogin(ctx,{program:\"/usr/bin/id\",arguments:[\"-u\"]},{signal:controller.signal}); clearTimeout(timer); console.log(\"RESULT=\"+JSON.stringify(result));\n')
        script.chmod(0o644)
        rows.append(exercise(script));rows.append(exercise(script,True))
    passed=True
finally:
    (out/'credential-native-pty.json').write_text(json.dumps({'passed':locals().get('passed',False),'rows':rows,'customerCredentials':'NOT_USED','scope':'ephemeral VM fixture user'},indent=2)+'\n')
    if created:
        command(['sudo','rm','-f','--',str(rule)])
        command(['sudo','userdel','--remove',user])
print('Native credential PTY checks passed')
