"""Check full playback and every skip path in an owned real terminal."""
import argparse
import json
import os
from pathlib import Path
import select
import signal
import subprocess
import threading
import time

parser = argparse.ArgumentParser()
parser.add_argument('--node', required=True)
parser.add_argument('--package', required=True)
parser.add_argument('--out', required=True)
args = parser.parse_args()
out = Path(args.out).resolve()
out.mkdir(parents=True, exist_ok=False)
package = Path(args.package).resolve()
env = {**os.environ, 'KODER_CLI_HOME': str(out / 'profile'), 'CI': '',
       'TERM': 'xterm-256color', 'FORCE_COLOR': '3', 'KODER_REDUCED_MOTION': '0', 'REDUCED_MOTION': '0'}
env.pop('NO_COLOR', None)
subprocess.run([args.node, '--input-type=module', '-e',
                'const m=await import(process.argv[1]);m.writeAcceptance(process.env)',
                (package / 'src/eula.mjs').as_uri()], env=env, check=True, timeout=15)
rows = []

def exercise(effect, skip):
    name = effect + ('-skip' if skip else '-full')
    command = [args.node, str(package / 'bin/koder.mjs'), 'celebrate', effect, '--lang', 'en']
    parts = []
    first_frame = None
    sent = False
    status = None
    deadline = time.monotonic() + 15
    started = time.monotonic()
    if os.name == 'nt':
        from winpty import PtyProcess
        proc = PtyProcess.spawn(command, env=env, dimensions=(32, 100))
        def read():
            try:
                while True:
                    parts.append(proc.read(65536))
            except (EOFError, OSError):
                pass
        reader = threading.Thread(target=read, daemon=True)
        reader.start()
    else:
        import pty
        pid, fd = pty.fork()
        if pid == 0:
            os.execvpe(args.node, command, env)
        os.set_blocking(fd, False)
    try:
        while time.monotonic() < deadline:
            if os.name != 'nt':
                readable, _, _ = select.select([fd], [], [], .02)
                if readable:
                    try:
                        data = os.read(fd, 65536)
                        if data:
                            parts.append(data.decode('utf-8', errors='replace'))
                    except OSError:
                        pass
            text = ''.join(parts)
            if first_frame is None and 'Any key skips' in text:
                first_frame = time.monotonic()
            if skip and first_frame is not None and not sent:
                if os.name == 'nt':
                    proc.write('q')
                else:
                    os.write(fd, b'q')
                sent = True
            if os.name == 'nt':
                if not proc.isalive():
                    reader.join(2)
                    status = proc.exitstatus
                    break
                time.sleep(.02)
            else:
                child, value = os.waitpid(pid, os.WNOHANG)
                if child:
                    status = os.waitstatus_to_exitcode(value)
                    break
        assert status is not None, name + ': owned process did not exit within 15 seconds'
        assert status == 0, (name, status, ''.join(parts)[-1500:])
        assert first_frame is not None, name + ': actual animation screen missing'
        elapsed = time.monotonic() - first_frame
        assert (.0 <= elapsed < 3) if skip else (5 <= elapsed < 7.5), (name, elapsed)
        rows.append({'name': name, 'passed': True, 'exitCode': status,
                     'skipSent': sent, 'secondsAfterFirstFrame': round(elapsed, 3),
                     'processSeconds': round(time.monotonic() - started, 3)})
    finally:
        (out / (name + '.log')).write_text(''.join(parts), encoding='utf-8')
        if os.name == 'nt':
            if proc.isalive():
                proc.terminate(force=True)
        else:
            if status is None:
                # pty.fork owns this session and its supervisor/worker group.
                os.killpg(pid, signal.SIGTERM)
                time.sleep(.2)
                try:
                    os.killpg(pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                os.waitpid(pid, 0)
            os.close(fd)

try:
    exercise('fireworks', False)
    for effect in ['code', 'confetti', 'fireworks', 'christmas', 'halloween', 'national', 'new-year', 'birthday']:
        exercise(effect, True)
finally:
    report = {'passed': len(rows) == 9 and all(row['passed'] for row in rows),
              'checks': rows, 'scope': 'Owned real terminal full six-second playback and all eight skip paths; no model or browser network'}
    (out / 'ANIMATION-RESULT.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
