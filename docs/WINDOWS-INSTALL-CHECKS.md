# Windows installer checks for preview.8

[Native Windows run](https://github.com/KarmenLoop/koder-cli/actions/runs/39383794418), October 20, 2026. The Windows PowerShell 5.1/CMD console test finished successfully with six checks:

- Empty Enter asks again, then explicit accept installs and the actual launcher reports preview.8.
- Spaces around accept are trimmed; installation and launch succeed in a Chinese directory.
- With Node removed from the child PATH, the installer downloads, verifies and uses its own Node runtime.
- Explicit decline creates no installation directory.
- CMD installation handles empty Enter followed by explicit accept.
- Redirected text cannot accept the license and creates no installation directory.

The runner is hosted Windows, build 10.0.26100.33438. It uses real ConPTY consoles and actual release assets served by an isolated local HTTP server. Every accepted installation verifies the package checksum and acceptance digest, then runs the installed koder.cmd version with exit code 0. Complete logs and RESULT.json are attached to the linked run.

The fix also removes Get-FileHash lookup as an installation dependency, uses the system .NET SHA-256 implementation, and uses Node for Unicode-safe package extraction instead of native tar.exe.

This does not establish acceptance on every user's Windows computer, live WeChat/Feishu/WeCom/Gamma accounts, or multiple physical devices. Model access still needs the user's own correctly configured provider or local model.

Package SHA-256: `79b966613ddf65c8a5f4dd2c2fbf796c0ec049f09cfe82e73601e6d7f77d3788`.
