@echo off
ver | findstr /c:"Version 5." >nul
if not errorlevel 1 (
  echo This command supports Windows 10 and Windows 11 only. Windows XP cannot run it.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://karmenloop.com/install/koder-cli.ps1 | iex"
exit /b %ERRORLEVEL%
