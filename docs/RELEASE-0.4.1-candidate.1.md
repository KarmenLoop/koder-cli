# Koder CLI 0.4.1-candidate.1 — unpublished

This candidate preserves the published 0.4.0 feature set and changes the Windows credential subprocess. It is not the production download or a completed Windows GUI acceptance.

- Use a bundled, SHA-256-checked DPAPI helper instead of starting PowerShell for ordinary Windows credential transforms. CurrentUser protection, the existing encrypted file format, and the 10-second operation deadline remain.
- Reassemble bounded Windows output bytes before strict UTF-8 decoding, so multibyte text split across pipe chunks remains intact.
- Preserve the explicit legacy PowerShell backend for compatibility checks. An absent, modified, or linked packaged helper fails integrity verification; it never silently falls back to another executable.

Local checks: 12 new tests and 14 existing credential, personalization, and bundle checks passed. Two Windows-only tests were not run on macOS. The native candidate cold-start and compatibility receipts are pending; local checks are not native acceptance.

The unchanged 0.4.0 installers passed four fresh no-discoverable-Node paths on Windows Server and Windows 11 ARM, including actual runtime downloads, startup, and same-version update checks. These results belong to 0.4.0, not this candidate. Windows client GUI, candidate installation and cross-platform package checks remain separate release gates.

All original limitations and historical failures remain recorded. No production website or release feed has been changed by this candidate build.
