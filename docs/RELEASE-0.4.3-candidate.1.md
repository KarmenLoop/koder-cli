# Koder CLI 0.4.3-candidate.1

This candidate is based on published 0.4.2 and addresses mailbox credential entry and consented mail decision questions. It does not replace the public release automatically.

- A masked input reader owns the terminal exclusively while collecting a mail app password. It handles Windows-style backspace and bracketed paste, restores the existing chat input owner, and resolves cancellation or EOF without retaining credentials in chat history.
- Setup exposes proactive inquiry, pending decisions and notification controls. Binding provides the next commands without granting model access or automatic sending.
- Foreground chat and mail watch classify incoming mail, ask for a decision where supported, show a reply draft, and require the existing exact send confirmation. Decision emails do not fall through to automatic replies.
- Pending choices, quiet-hour deferrals, daily limits, send receipts and follow-ups reuse the existing encrypted mailbox namespace and private-operation lease. Unknown send outcomes block replay.
- The existing background-host adapter has explicit activation and visibility checks. No new daemon, OS notification transport or gateway sender is shipped.

Focused tests cover synthetic Windows input sequences, a native macOS PTY, owned real TLS IMAP/SMTP with synthetic credentials, encrypted state, normal mail regressions and chat/setup input. They do not establish Windows native ConPTY/IME or a live external account. Real model draft quality is also unverified. Historical failures remain recorded; no assertions were weakened to publish a green full-product claim.
