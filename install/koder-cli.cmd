@echo off
setlocal
echo Koder: loading Windows installer. Progress appears every five seconds; Ctrl+C cancels.
ver | findstr /c:"Version 5." >nul
if not errorlevel 1 (
  echo This command supports Windows 10 and Windows 11 only. Windows XP cannot run it.
  exit /b 1
)
rem Preview tag. Not GitHub /releases/latest (stable-only). Current install commands are on https://karmenloop.com.
rem A normal terminal asks you to type accept and press Enter. decline or Ctrl+C cancels before download. Empty Enter asks again.
rem After you have read and agreed, unattended deployment may set KODER_EULA_ACCEPT=1. Any other value is not acceptance.
set "KODER_PS1_URL=https://karmenloop.com/install/cli-0.4.0-preview.29/koder-cli.ps1"
if defined KODER_INSTALL_BASE set "KODER_PS1_URL=%KODER_INSTALL_BASE%/koder-cli.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u=$env:KODER_PS1_URL; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
exit /b %ERRORLEVEL%
