# Preview.16 acceptance

The release uses package SHA-256 `fd7b27ed7d0d0c647c04b67dee28a7c2bf3121578b66c48011c1b3c76bc4dfff`. The complete package manifest and sanitized acceptance report are attached to the GitHub release.

The full CLI and all three configured Core service cases passed on hosted Linux, Intel macOS and native Windows x64. Each platform ran 567 tests: Linux 548 passed and 19 skipped; macOS 549 passed and 18 skipped; Windows 538 passed and 29 skipped. Fourteen skips on each platform preserve the earlier enabled-service contracts for the now-disabled integrations. Other skips are platform-specific. No test failed or was cancelled in these final runs.

Native Windows CMD and PowerShell installation, Chinese and space-containing paths, private Node.js 22.23.3 selection, ACP and update restart, checksum/consent negatives, native ACL, permissions and animation interruption were verified separately on the actual package. The website passed 74 tests with one unrelated desktop-publisher skip, followed by byte-matching HTTP readback of 74 pages and 27 download/tutorial/privacy assets.

MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan and both Volcano products remain temporarily unavailable. Saved configurations are retained; the CLI refuses their requests. Protocol fixtures are retained for future work and do not establish paid-account access. Physical consumer Windows and ARM hardware were not tested. Public CMD/PowerShell installation and production file readback are checked after promotion and retained with release records.

Public verification is complete. CMD and Windows PowerShell passed all 14 installer scenarios against the public endpoint. The actual public Linux installer passed too. Production checks verified 112 byte-matching files and two exact BOT redirects, with the GitHub feeds and reference-library status aligned. See the [public installation report](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.16/PUBLIC-INSTALLATION-REPORT.json). The initial redirect-checker failure remains recorded separately.
