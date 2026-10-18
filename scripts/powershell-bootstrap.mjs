// Windows PowerShell 5.1 decodes `irm` text without a charset as Latin-1, which
// garbles Chinese. The published installer is pure ASCII and decodes the real
// UTF-8 script itself before running it.
export function powershellBootstrap(script) {
  const payload = Buffer.from(script, "utf8").toString("base64").match(/.{1,100}/g).map((chunk) => `'${chunk}'`).join(" +\n");
  return [
    "# Koder CLI installer for Windows 10 / 11. ASCII-only wrapper around the UTF-8 script.",
    "# PowerShell:  irm https://karmenloop.com/install/koder-cli.ps1 | iex",
    "# CMD:         powershell -NoProfile -ExecutionPolicy Bypass -Command \"irm https://karmenloop.com/install/koder-cli.ps1 | iex\"",
    "$KoderInstaller = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String((",
    payload,
    ")))",
    "Invoke-Expression $KoderInstaller",
    "",
  ].join("\n");
}
