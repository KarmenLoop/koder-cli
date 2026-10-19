@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex"
exit /b %ERRORLEVEL%
