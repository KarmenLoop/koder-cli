[CmdletBinding()]
param(
  [switch]$Run,
  [switch]$DisposableMachine,
  [switch]$AcceptLicense,
  [string]$Package = (Join-Path $PSScriptRoot '../koder-cli-0.4.0-preview.29-candidate.1.tgz'),
  [string]$Manifest = (Join-Path $PSScriptRoot '../koder-cli-latest.json')
)
$ErrorActionPreference = 'Stop'
$os = Get-CimInstance Win32_OperatingSystem
if ($os.ProductType -ne 1 -or [int]$os.BuildNumber -lt 19041) { throw 'Windows 10/11 client required; Windows Server does not qualify.' }
$release = Get-Content -LiteralPath $Manifest -Raw | ConvertFrom-Json
if ($release.version -ne '0.4.0-preview.29-candidate.1' -or $release.sha256 -notmatch '^[a-f0-9]{64}$') { throw 'Expected the accompanying newest candidate manifest.' }
$actual = (Get-FileHash -LiteralPath $Package -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $release.sha256) { throw 'Candidate archive checksum does not match the manifest.' }
[ordered]@{Caption=$os.Caption;Build=$os.BuildNumber;Architecture=$os.OSArchitecture;ProductType=$os.ProductType;Version=$release.version;SHA256=$actual;PreparedOnly=(-not $Run);Scope='Local candidate archive, original MCP host and owned GUI; complete installer/update acceptance remains separate.'} | ConvertTo-Json
if (-not $Run) { return }
if (-not $DisposableMachine -or -not $AcceptLicense) { throw 'Use a disposable authorized VM/account and read the accompanying EULA before supplying both switches.' }
foreach ($tool in @('python','node','pwsh')) { if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "Missing prerequisite: $tool" } }
& python -c "import sys; assert sys.version_info >= (3,14), 'Python 3.14+ is required for pinned Windows-MCP'"
if ($LASTEXITCODE -ne 0) { throw 'Python prerequisite failed.' }
$root = Join-Path $PSScriptRoot ('results-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path "$root/evidence" -Force | Out-Null
$os | Select-Object Caption,Version,BuildNumber,OSArchitecture,ProductType | ConvertTo-Json | Set-Content -Encoding UTF8 "$root/evidence/client-os.json"
& python -m venv "$root/runtime"
if ($LASTEXITCODE -ne 0) { throw 'Could not create the isolated Python environment.' }
& "$root/runtime/Scripts/python.exe" -m pip install --only-binary=:all: --timeout 20 --retries 1 --disable-pip-version-check --progress-bar off --report "$root/install-report.json" windows-mcp==0.8.8
if ($LASTEXITCODE -ne 0) { throw 'Pinned upstream installation failed.' }
& "$root/runtime/Scripts/python.exe" "$PSScriptRoot/native-candidate.py" --root "$root" --package "$Package" --sha256 "$actual" --version "$($release.version)"
if ($LASTEXITCODE -ne 0) { throw "Candidate acceptance failed. Preserve the full evidence folder: $root/evidence" }
Write-Host "Only the recorded candidate/MCP checks passed. Full installation and update/restart remain separate gates. Evidence: $root/evidence"
