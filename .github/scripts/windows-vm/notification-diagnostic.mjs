import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const script=`$ErrorActionPreference='Stop';
$r=@{sessionId=(Get-Process -Id $PID).SessionId;interactive=[Environment]::UserInteractive};
function ErrorRow($errorRecord){$a=@();$e=$errorRecord.Exception;while($e){$a+=@{type=$e.GetType().FullName;hresult=$e.HResult;message=$e.Message};$e=$e.InnerException};return $a}
try{
[Windows.UI.Notifications.ToastNotificationManager,Windows.UI.Notifications,ContentType=WindowsRuntime]>$null;
$p=[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('KarmenLoop.Koder');
$r.before=@{type=$p.GetType().FullName;setting=[string]$p.Setting};try{$r.getterBefore=[string]$p.get_Setting()}catch{$r.getterBeforeErrors=@(ErrorRow $_)};
[Windows.UI.Notifications.ToastNotifier,Windows.UI.Notifications,ContentType=WindowsRuntime]>$null;
[Windows.UI.Notifications.NotificationSetting,Windows.UI.Notifications,ContentType=WindowsRuntime]>$null;
[Windows.UI.Notifications.ToastNotification,Windows.UI.Notifications,ContentType=WindowsRuntime]>$null;
$p=[Windows.UI.Notifications.ToastNotifier]$p;
$r.after=@{type=$p.GetType().FullName;setting=[string]$p.Setting};try{$r.getterAfter=[string]$p.get_Setting()}catch{$r.getterAfterErrors=@(ErrorRow $_)};
$registration='HKCU:\\Software\\Classes\\AppUserModelId\\KarmenLoop.Koder';
if(-not(Test-Path $registration)){New-Item -Path $registration -Force > $null;New-ItemProperty -Path $registration -Name DisplayName -Value 'Koder' -PropertyType String > $null;New-ItemProperty -Path $registration -Name ShowInSettings -Value 1 -PropertyType DWord > $null};
$p=[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('KarmenLoop.Koder');
try{$r.registeredSetting=[string]$p.get_Setting()}catch{$r.registeredErrors=@(ErrorRow $_)};
[Windows.Data.Xml.Dom.XmlDocument,Windows.Data.Xml.Dom.XmlDocument,ContentType=WindowsRuntime]>$null;
$x=New-Object Windows.Data.Xml.Dom.XmlDocument;
$x.LoadXml('<toast><visual><binding template="ToastGeneric"><text>Koder VM diagnostic</text><text>Owned VM test only</text></binding></visual></toast>');
try{$p.Show([Windows.UI.Notifications.ToastNotification]::new($x));$r.show='submitted'}catch{$r.showErrors=@(ErrorRow $_)}
}catch{$r.errors=@(ErrorRow $_)};
$r.services=@(Get-Service Wpn* -ErrorAction SilentlyContinue|ForEach-Object{@{name=$_.Name;status=[string]$_.Status}});
$r.appIdRegistered=Test-Path 'HKCU:\\Software\\Classes\\AppUserModelId\\KarmenLoop.Koder';
$r|ConvertTo-Json -Depth 8 -Compress`;
const result=execFileSync(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')],{encoding:'utf8',timeout:15000,windowsHide:true});
const row=JSON.parse(result);fs.writeFileSync(path.join(process.env.KODER_VM_EVIDENCE,'notification-environment.json'),JSON.stringify(row,null,2)+'\n');console.log(JSON.stringify(row));
