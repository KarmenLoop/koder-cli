# Koder CLI installer (Windows 10 / 11; Windows PowerShell 5.1 or PowerShell 7):
#   PowerShell:  irm https://karmenloop.com/install/koder-cli.ps1 | iex
#   CMD:         powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://karmenloop.com/install/koder-cli.ps1 | iex"
# Installs into %LOCALAPPDATA%\koder-cli without administrator rights.
# scripts/pack.mjs ships this file wrapped in an ASCII-only bootstrap, so the
# Chinese messages survive `irm | iex` whatever charset the server sends.
$ErrorActionPreference = 'Stop'
# Windows PowerShell 5.1 redraws a progress bar per chunk, which makes downloads crawl.
$ProgressPreference = 'SilentlyContinue'
# Older Windows 10 builds still default .NET to TLS 1.0; nodejs.org needs TLS 1.2.
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}

$Base = if ($env:KODER_INSTALL_BASE) { $env:KODER_INSTALL_BASE.TrimEnd('/') } else { 'https://karmenloop.com/install' }
$KoderHome = if ($env:KODER_INSTALL_HOME) { $env:KODER_INSTALL_HOME } else { Join-Path $env:LOCALAPPDATA 'koder-cli' }
$BinDir = Join-Path $KoderHome 'bin'
$NodeDist = if ($env:KODER_NODE_DIST) { $env:KODER_NODE_DIST } else { 'https://nodejs.org/dist' }
$NodeVersion = if ($env:KODER_NODE_VERSION) { $env:KODER_NODE_VERSION } else { '22.12.0' }
$Zh = (Get-Culture).Name -like 'zh*'
function Say($zh, $en) { if ($Zh) { Write-Host $zh } else { Write-Host $en } }
function Fail($zh, $en) { if ($Zh) { throw "Koder CLI 安装失败：$zh" } else { throw "Koder CLI install failed: $en" } }
function Sha256($path) { (Get-FileHash -Algorithm SHA256 -Path $path).Hash.ToLower() }
function Ascii($text) { $text -notmatch '[^\x20-\x7e]' }

$os = [Environment]::OSVersion.Version
if ($os.Major -lt 10) { Fail '需要 Windows 10 或 Windows 11（Node.js 22 的最低要求）。Windows XP、7、8 不能运行。' 'Windows 10 or 11 is required (the Node.js 22 minimum). Windows XP, 7 and 8 cannot run it.' }
$Arch = switch ($env:PROCESSOR_ARCHITECTURE) { 'AMD64' { 'x64' } 'ARM64' { 'arm64' } default { Fail "不支持的架构 $env:PROCESSOR_ARCHITECTURE" "unsupported architecture $env:PROCESSOR_ARCHITECTURE" } }

# Used only when tar.exe is missing (Windows 10 before 1803): gunzip and unpack
# with Node itself, dropping the top folder like tar --strip-components=1.
$ExtractJs = @'
const fs = require("fs"), path = require("path"), zlib = require("zlib");
const [file, dest] = process.argv.slice(2);
const data = zlib.gunzipSync(fs.readFileSync(file));
const text = (b, s, l) => b.toString("utf8", s, s + l).replace(/\0[\s\S]*$/, "");
let offset = 0, longName = null;
while (offset + 512 <= data.length) {
  const head = data.subarray(offset, offset + 512);
  if (head.every((b) => b === 0)) break;
  let name = text(head, 0, 100);
  const prefix = text(head, 345, 155);
  if (prefix) name = prefix + "/" + name;
  const size = parseInt(text(head, 124, 12).trim() || "0", 8);
  const type = String.fromCharCode(head[156] || 48);
  offset += 512;
  const body = data.subarray(offset, offset + size);
  offset += Math.ceil(size / 512) * 512;
  if (type === "L") { longName = body.toString("utf8").replace(/\0[\s\S]*$/, ""); continue; }
  if (type === "x" || type === "g") { const m = /\d+ path=([^\n]+)\n/.exec(body.toString("utf8")); if (m) longName = m[1]; continue; }
  if (longName) { name = longName; longName = null; }
  const parts = name.split("/").filter(Boolean).slice(1);
  if (!parts.length || parts.includes("..")) continue;
  const out = path.join(dest, ...parts);
  if (type === "5") fs.mkdirSync(out, { recursive: true });
  else if (type === "0" || type === "\0" || type === "7") { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, body); }
}
'@

$Tmp = Join-Path ([IO.Path]::GetTempPath()) ("koder-" + [Guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $Tmp, $BinDir | Out-Null
try {
  $Node = $null
  $existing = Get-Command node -ErrorAction SilentlyContinue
  if ($existing) {
    $major = [int]((& $existing.Source -p 'process.versions.node').Split('.')[0])
    if ($major -ge 22) { $Node = $existing.Source }
  }
  $NodeName = "node-v$NodeVersion-win-$Arch"
  if (-not $Node) {
    $dir = Join-Path $KoderHome "runtime\$NodeName"
    if (-not (Test-Path (Join-Path $dir 'node.exe'))) {
      Say "正在下载 Node.js $NodeVersion……" "Downloading Node.js $NodeVersion..."
      $zip = Join-Path $Tmp "$NodeName.zip"
      Invoke-WebRequest -UseBasicParsing "$NodeDist/v$NodeVersion/$NodeName.zip" -OutFile $zip
      $sums = (Invoke-WebRequest -UseBasicParsing "$NodeDist/v$NodeVersion/SHASUMS256.txt").Content
      $expected = ($sums -split "`n" | Where-Object { $_ -match "\s$NodeName\.zip$" } | ForEach-Object { ($_ -split '\s+')[0] }) | Select-Object -First 1
      if (-not $expected -or (Sha256 $zip) -ne $expected) { Fail 'Node.js 下载校验失败' 'Node.js checksum mismatch' }
      Expand-Archive -Path $zip -DestinationPath (Join-Path $KoderHome 'runtime') -Force
    }
    $Node = Join-Path $dir 'node.exe'
  }

  $manifest = Invoke-RestMethod -UseBasicParsing "$Base/koder-cli-latest.json"
  if ($manifest.file -notmatch '^[\w.+-]+\.tgz$' -or $manifest.sha256 -notmatch '^[0-9a-f]{64}$' -or $manifest.version -notmatch '^[0-9A-Za-z.+-]+$') { Fail '安装清单无效' 'invalid manifest' }
  Say "正在下载 Koder CLI $($manifest.version)……" "Downloading Koder CLI $($manifest.version)..."
  $pkg = Join-Path $Tmp $manifest.file
  Invoke-WebRequest -UseBasicParsing "$Base/$($manifest.file)" -OutFile $pkg
  if ((Sha256 $pkg) -ne $manifest.sha256) { Fail '安装包校验失败（SHA-256 不一致），已停止' 'package checksum mismatch; aborted' }
  $target = Join-Path $KoderHome "versions\$($manifest.version)"
  if (Test-Path $target) { Remove-Item -Recurse -Force $target }
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  if (Get-Command tar.exe -ErrorAction SilentlyContinue) {
    tar.exe -xzf $pkg -C $target --strip-components=1
  } else {
    $extract = Join-Path $Tmp 'extract.js'
    [IO.File]::WriteAllText($extract, $ExtractJs)
    & $Node $extract $pkg $target
  }
  if (-not (Test-Path (Join-Path $target 'bin\koder.mjs'))) { Fail '安装包内容不完整' 'package is incomplete' }

  # The launcher uses paths relative to itself (%~dp0): a Chinese user name in
  # %LOCALAPPDATA% would otherwise turn into "?" in an ASCII .cmd file.
  $launcher = Join-Path $BinDir 'koder.cmd'
  if ($Node.StartsWith($KoderHome)) { $nodeRef = '%~dp0..\runtime\' + $NodeName + '\node.exe' }
  elseif (Ascii $Node) { $nodeRef = $Node }
  else { $nodeRef = 'node' }
  $cmd = "@echo off`r`nsetlocal`r`nset `"KODER_NODE=$nodeRef`"`r`nif not exist `"%KODER_NODE%`" set `"KODER_NODE=node`"`r`n`"%KODER_NODE%`" `"%~dp0..\versions\$($manifest.version)\bin\koder.mjs`" %*`r`nexit /b %ERRORLEVEL%`r`n"
  [IO.File]::WriteAllText($launcher, $cmd, [Text.Encoding]::ASCII)
  $info = @{ version = $manifest.version; base = $Base; launcher = $launcher; node = $Node; bin = $BinDir; site = 'https://karmenloop.com'; updates = 'https://karmenloop.com/updates.html'; download = 'https://karmenloop.com/download.html'; installedAt = (Get-Date).ToString('o') } | ConvertTo-Json
  [IO.File]::WriteAllText((Join-Path $KoderHome 'install.json'), $info, (New-Object Text.UTF8Encoding $false))

  $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not $userPath) { $userPath = '' }
  if (($userPath -split ';') -notcontains $BinDir) {
    [Environment]::SetEnvironmentVariable('Path', (@($BinDir) + ($userPath -split ';' | Where-Object { $_ })) -join ';', 'User')
    Say "已把 $BinDir 加入用户 PATH；新开的 PowerShell 或命令提示符都能直接输入 koder。" "Added $BinDir to the user PATH; new PowerShell and Command Prompt windows can run koder."
  }
  if (($env:Path -split ';') -notcontains $BinDir) { $env:Path = "$BinDir;$env:Path" }
  Say "Koder CLI $($manifest.version) 安装完成：$launcher" "Koder CLI $($manifest.version) installed: $launcher"
  Say '官网和更新说明：https://karmenloop.com/updates.html （软件里也可运行 koder version 或 koder about）' 'Official site and updates: https://karmenloop.com/updates.html (or run koder version / koder about)'
  if (-not $env:KODER_NO_ONBOARD -and [Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
    & $launcher onboard
  } else {
    Say '运行 koder setup 完成设置（方向键或鼠标就能选），或直接输入 koder 开始。' 'Run koder setup to finish (arrow keys or mouse), or just type koder.'
  }
} finally {
  Remove-Item -Recurse -Force $Tmp -ErrorAction SilentlyContinue
}
