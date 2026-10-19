@echo off
ver | findstr /c:"Version 5." >nul
if not errorlevel 1 (
  echo This command supports Windows 10 and Windows 11 only. Windows XP cannot run it.
  exit /b 1
)
rem Preview tag. Not GitHub /releases/latest (stable-only). Current install commands are on https://karmenloop.com.
rem A normal terminal asks you to type accept and press Enter. decline, empty Enter, or Ctrl+C cancels before download.
rem After you have read and agreed, unattended deployment may set KODER_EULA_ACCEPT=1. Any other value is not acceptance.
set "KODER_PS1_URL=https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.7/koder-cli.ps1"
if defined KODER_INSTALL_BASE set "KODER_PS1_URL=%KODER_INSTALL_BASE%/koder-cli.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm %KODER_PS1_URL% | iex"
exit /b %ERRORLEVEL%
