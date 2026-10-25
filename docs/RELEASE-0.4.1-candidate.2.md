# Koder CLI 0.4.1-candidate.2 — unpublished

This candidate preserves the published 0.4.0 feature set. It is not the production download and has not completed Windows client GUI acceptance.

## Windows credentials

A bundled, SHA-256-checked CurrentUser DPAPI helper replaces PowerShell for ordinary credential transforms. The encrypted file format and 10-second deadline are unchanged. Bounded output bytes are assembled before strict UTF-8 decoding. The explicit legacy PowerShell backend remains available for compatibility checks; a missing, modified or linked bundled helper fails integrity verification.

The exact helper passed first-operation, independent-process read, old/new bidirectional persistence, Unicode and malformed-input checks on isolated Windows Server and Windows 11 ARM runners. This is not Windows 10 or Windows 11 x64 device certification. Full-package installation and update results are recorded separately.

## Windows-MCP target reports

For the recognized Windows-MCP App switch operation, a reported window title that contradicts the requested title now leaves the operation unconfirmed. The original uncertain-effect record is retained, and the operation is not retried automatically. The original approval, cancellation and permission controls remain in charge. A matching response is only the provider's report, not independent proof of the actual foreground window.

The repair reproduces the previously observed wrong-window response and passes focused local regression checks. The published 0.4.0 package passed actual App, Click, Type and Snapshot operations on an isolated Windows Server desktop. Windows 11 ARM GUI acceptance remains blocked by the hosted image's system sign-in window. Candidate package GUI acceptance remains a separate gate.

## Release status

The Windows CMD and PowerShell installers and the macOS shell installer are included. Candidate.1 and all prior failure evidence remain retained. Neither the public website nor the production GitHub release feed has been changed by this build. Publication requires the remaining native package and GUI acceptance gates to pass.
