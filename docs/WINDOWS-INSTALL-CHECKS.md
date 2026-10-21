# Windows installation checks

The release checks use an isolated Windows runner with native CMD, Windows PowerShell 5.1 and ConPTY. They cover explicit license acceptance, empty input, cancellation, download progress, Chinese and space-containing paths, CommonJS extraction under an ESM temporary directory, checksum failures and preservation of an existing installation.

A five-second Node.js probe must not stall installation. An outdated owned runtime fixture must cause selection of private Node.js 22.23.3. Release checks also cover ACP child shutdown, update restart and rollback, native ACL readback, execution permissions, skipped animations and bounded stalled downloads.

After promotion, repeat the ordinary public CMD and PowerShell download commands against the actual website and compare the installed package digest with the release manifest. Check `koder --version` and `koder doctor`. A test against a loopback asset server is candidate evidence, not public-download evidence.

The full CLI and configured Core service suites run separately on Windows, Linux and macOS. The Windows service host uses an owned Linux Core fixture because Core requires POSIX locking; this is test infrastructure, not an extra Windows consumer installation requirement.

MiMo Token Plan, Kimi, Kimi Code, DeepSeek, Alibaba Token Plan and Volcano integrations are temporarily unavailable. The current product checks require refusal before a request, preserved saved configuration and gray setup entries. Earlier enabled file-tool contracts are explicitly excluded pending re-acceptance; retained protocol adapter fixtures do not establish authenticated account access.

Hosted Windows x64 checks do not certify every user's PC, physical Windows ARM hardware, corporate proxy or paid provider account. Release notes identify the actual run and artifact hashes. Never send API keys with a support report.
