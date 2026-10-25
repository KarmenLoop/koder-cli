// Run against the installed or extracted package. No model/provider calls.
// --send explicitly submits one native diagnostic notification on this OS.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
if (!args.includes('--accept-eula')) {
  console.error('Read the bundled EULA.md, then rerun with --accept-eula to accept it for this isolated test profile. No existing installation is changed.');
  process.exit(2);
}
const take = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const output = path.resolve(take('--output') || 'task-notification-check.json');
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'koder-notification-check-'));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {...process.env, KODER_CLI_HOME:home, KODER_AUTO_UPDATE:'0'};
const run = argv => {
  const result = spawnSync(process.execPath, [path.join(root, 'bin', 'koder.mjs'), ...argv], {
    cwd:home, env, encoding:'utf8', timeout:30000, maxBuffer:1024 * 1024, windowsHide:true,
  });
  let value;
  try { value = JSON.parse(result.stdout); } catch { value = null; }
  return {argv, exit:result.status, signal:result.signal, error:result.error?.code || null,
    stdout:result.stdout || '', stderr:result.stderr || '', value};
};
const report = {
  schema:'koder-task-notifications-acceptance/v1',
  recordedAt:new Date().toISOString(), platform:process.platform, arch:process.arch,
  osRelease:os.release(), node:process.version, isolatedHome:home,
  packageVersion:JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version,
  adapterSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'src', 'agentd', 'notifications.mjs'))).digest('hex'),
  environment:{CI:Boolean(env.CI), DISPLAY:Boolean(env.DISPLAY), WAYLAND_DISPLAY:Boolean(env.WAYLAND_DISPLAY),
    DBUS_SESSION_BUS_ADDRESS:Boolean(env.DBUS_SESSION_BUS_ADDRESS), SSH:Boolean(env.SSH_CONNECTION || env.SSH_TTY)},
  displayVerified:false, clickVerified:false,
  note:'Command receipts only. Physical desktop visibility, login/reboot and click continuation require separate observation.',
  checks:[],
};
report.checks.push(run(['--version']));
report.checks.push(run(['eula', 'accept']));
report.checks.push(run(['notifications', 'status', '--json']));
if (args.includes('--send')) report.checks.push(run(['notifications', 'test', 'task-done', '--json']));
report.checks.push(run(['notifications', 'status', '--json']));
const nativeStates = ['submitted', 'unavailable', 'denied', 'UNKNOWN'];
const statusStates = ['available', 'unavailable', 'denied', 'UNKNOWN'];
const failures = [];
for (const check of report.checks) {
  const label = check.argv.join(' ');
  if (check.error || check.signal) failures.push(`${label}: process did not complete normally`);
  if (check.argv[0] === '--version' && (check.exit !== 0 || !check.stdout.includes(report.packageVersion))) failures.push(`${label}: version mismatch`);
  if (check.argv[0] === 'eula' && check.exit !== 0) failures.push(`${label}: isolated license acceptance failed`);
  if (check.argv[1] === 'status' && (check.exit !== 0 || check.value?.taskDone?.state !== 'ready' || !statusStates.includes(check.value?.channel?.state) || check.value?.channel?.displayVerified !== false)) failures.push(`${label}: invalid status receipt`);
  if (check.argv[1] === 'test') {
    if (!nativeStates.includes(check.value?.state) || check.value?.displayVerified !== false || typeof check.value?.clickSupported !== 'boolean') failures.push(`${label}: invalid native receipt`);
    else if (check.exit !== (check.value.state === 'submitted' ? 0 : 1)) failures.push(`${label}: native state/exit mismatch`);
    if (process.platform === 'linux' && !env.DISPLAY && !env.WAYLAND_DISPLAY && !env.DBUS_SESSION_BUS_ADDRESS && (check.value?.state !== 'unavailable' || check.value?.reason !== 'NO_NOTIFICATION_SESSION')) failures.push(`${label}: headless Linux must report no notification session`);
  }
}
const native = report.checks.find(check => check.argv[1] === 'test');
const finalStatus = report.checks.at(-1).value;
if (native && (finalStatus?.taskDone?.lastTest?.state !== native.value?.state || finalStatus?.taskDone?.dailyCount !== 0)) failures.push('manual diagnostic must persist its receipt without charging the task budget');
report.failures = failures;
fs.mkdirSync(path.dirname(output), {recursive:true});
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', {mode:0o600});
console.log(JSON.stringify({output, platform:report.platform, version:report.packageVersion,
  checks:report.checks.map(c=>({argv:c.argv,exit:c.exit,error:c.error,value:c.value})),failures,displayVerified:false},null,2));
// An unavailable channel is an expected diagnostic result. A crash, timeout,
// malformed structured receipt or failed status operation is not.
process.exitCode = failures.length ? 1 : 0;
