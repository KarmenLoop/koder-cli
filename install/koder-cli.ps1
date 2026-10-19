# Public distribution bootstrap; no Node.js or GitHub token is needed to start.
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'
$KoderTemp = Join-Path ([IO.Path]::GetTempPath()) ('koder-bootstrap-' + [Guid]::NewGuid().ToString('N'))
$KoderSavedBase = $env:KODER_INSTALL_BASE
$KoderSavedVersion = $env:KODER_EXPECTED_VERSION
$KoderSavedSha = $env:KODER_EXPECTED_PACKAGE_SHA256
New-Item -ItemType Directory -Path $KoderTemp | Out-Null
try {
  $KoderChannel = (Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 'https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/updates/installers.txt').Content
  $KoderFields = @{}
  foreach ($KoderLine in ($KoderChannel -split "`n")) {
    if (-not $KoderLine.Trim()) { continue }
    $KoderParts = $KoderLine.Trim() -split '\s+'
    if ($KoderParts.Length -ne 2 -or $KoderFields.ContainsKey($KoderParts[0])) { throw 'Invalid Koder update channel' }
    $KoderFields[$KoderParts[0]] = $KoderParts[1]
  }
  $KoderRelease = $KoderFields['version']
  if ($KoderRelease -notmatch '^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$' -or $KoderFields['ps1'] -notmatch '^[a-f0-9]{64}$' -or $KoderFields['package_sha256'] -notmatch '^[a-f0-9]{64}$') { throw 'Invalid Koder release metadata' }
  $KoderBase = "https://github.com/KarmenLoop/koder-cli/releases/download/cli-$KoderRelease"
  $KoderScript = Join-Path $KoderTemp 'koder-cli.ps1'
  Invoke-WebRequest -UseBasicParsing -TimeoutSec 60 "$KoderBase/koder-cli.ps1" -OutFile $KoderScript
  if ((Get-FileHash -Algorithm SHA256 $KoderScript).Hash.ToLowerInvariant() -ne $KoderFields['ps1']) { throw 'Koder installer SHA-256 mismatch; not executed' }
  $env:KODER_INSTALL_BASE = $KoderBase
  $env:KODER_EXPECTED_VERSION = $KoderRelease
  $env:KODER_EXPECTED_PACKAGE_SHA256 = $KoderFields['package_sha256']
  Write-Output "Installing Koder CLI $KoderRelease from GitHub. Read the release EULA before accepting."
  & powershell -NoProfile -ExecutionPolicy Bypass -File $KoderScript
  if ($LASTEXITCODE -ne 0) { throw "Koder installer failed with exit code $LASTEXITCODE" }
} finally {
  $env:KODER_INSTALL_BASE = $KoderSavedBase
  $env:KODER_EXPECTED_VERSION = $KoderSavedVersion
  $env:KODER_EXPECTED_PACKAGE_SHA256 = $KoderSavedSha
  Remove-Item -Recurse -Force $KoderTemp -ErrorAction SilentlyContinue
}
