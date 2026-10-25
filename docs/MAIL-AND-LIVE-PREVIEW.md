# Mail and live project previews

These features are included in 0.4.0. Live mailbox accounts, provider OAuth setup and native platform acceptance remain separate checks; configured presets alone do not verify a connection.

Open `/setup` in your current Koder chat. `/steup` also opens the settings menu. Choose **Mail and notifications** to bind your own mailbox. The provider list includes Gmail, QQ/Foxmail, NetEase 163/126, iCloud, Alibaba Mail, Spacemail (Spaceship), Outlook, Microsoft 365 and custom servers. A recognized address preselects its provider. Company domains can select Spacemail, Alibaba Mail, Microsoft 365 or custom settings explicitly; Koder does not guess a provider from a company's domain.

Choose IMAP or POP3 where the provider supports it. Host, encrypted port and SMTP settings are filled in before the authorization preview. iCloud remains IMAP-only, as specified by [Apple](https://support.apple.com/102525). Outlook and Microsoft 365 remain visibly unavailable until Microsoft OAuth is configured; a password prompt is not offered as a substitute.

Spacemail fills in `mail.spacemail.com` for both receiving and sending: IMAP port **993**, POP3 port **995**, and SMTP port **465**, all with verified TLS. Use the full mailbox address and that mailbox's password. If protocol access has been turned off, enable IMAP/POP3/SMTP in Spacemail Manager or webmail. These defaults follow [Spaceship's official client settings](https://www.spaceship.com/knowledgebase/connect-spacemail-to-email-client/). This preset is for Spaceship Spacemail; similarly named services need their own custom settings.

Microsoft server details remain visible even while login is unavailable. Outlook/Hotmail uses `outlook.office365.com` on IMAP 993 or POP3 995 and `smtp-mail.outlook.com` on SMTP 587 with STARTTLS. Microsoft 365 has a separate enterprise preset using `smtp.office365.com`. [Microsoft requires OAuth2 for Outlook.com](https://support.microsoft.com/en-us/outlook/pop-imap-and-smtp-settings-for-outlook-com); adding server defaults does not configure that authentication flow.

For a self-hosted mailbox, choose **Custom**, then IMAP or POP3. POP3 defaults to verified TLS on port 995. A server using STLS can use the `starttls` option, normally on port 110; Koder upgrades and verifies TLS before sending the login name or password. You can supply a receiving login name distinct from the email address. Choose **Receive only** if you do not have SMTP configured. Reply sending and automatic replies stay unavailable until SMTP has been configured and verified.

POP3 only receives mail. Sending uses a separately configured SMTP service. Koder never sends POP3 `DELE`, and it does not remove the server's copy. It uses stable UIDL identifiers rather than transient message numbers to deduplicate and read mail after renumbering. Servers without UIDL produce an explicit unsupported-capability message; switch to IMAP or enable UIDL. POP3 has no shared IMAP read/unread state, so a new-mail notice means that Koder has not seen that UIDL before. See [RFC 1939](https://www.rfc-editor.org/rfc/rfc1939) and [RFC 2595](https://www.rfc-editor.org/rfc/rfc2595).

```text
/mail setup gmail --protocol pop3
/mail setup aliyun --protocol imap
/mail setup spacemail --address you@your-domain.com --protocol imap
/mail setup spacemail --address you@your-domain.com --protocol pop3
/mail setup custom --address you@example.com --protocol pop3 --host pop.example.com --receive-only
```

The interactive flow asks for the authorization code without displaying it. Do not put passwords in command arguments. Alibaba Mail's defaults follow its [published server settings](https://help.aliyun.com/en/document_detail/36576.html). Gmail POP access follows [Google's setup instructions](https://support.google.com/mail/answer/7104828). Actual account access remains subject to provider and organization policy.

Use an app password or mail-client authorization code. For Gmail, app passwords require two-step verification and are unavailable for some managed or protected accounts. See [Google's instructions](https://support.google.com/accounts/answer/185833). iCloud requires its published server settings and an app-specific password; see [Apple's settings](https://support.apple.com/102525). Provider availability is subject to account policy, network access, and live verification. A preset is not proof that a real account works.

Mailbox credentials and local records use authenticated encryption and the existing protected credential store. Koder does not fall back to plaintext when key protection cannot be verified. The mailbox has a separate namespace for the current Karmen account and device. Switching accounts requires the mailbox to be bound in that scope.

In the current 0.4.10 release, Koder checks for messages every 30 seconds while chat is running. `/mail check` checks immediately; `koder mail watch` runs a dedicated foreground watcher. With /mail monitor on, the existing authorized agentd continues checks after terminals close. Without background activation, closing both foreground processes stops checks. Notices are queued during a task or settings screen. New bindings can notify all inbox categories; older notification preferences remain until explicitly changed. See [new-message sending and background monitoring](MAIL-DELIVERY.en.md). Personal, business, transactional, automated, and authentication categories are content-based estimates, not identity verification.

Useful commands:

```text
/mail status
/mail check
/mail read 9:1
/mail code 9:2
/mail model on
/mail learning on
/mail draft 9:1
/mail reply 9:1 --text "Thanks. Noon works for me."
/mail auto on --allow-from friend@example.com --daily-limit 5
/mail auto off
/mail disconnect
```

Reading mail into the selected model, learning a style, and automatic sending require separate typed consent. These actions may incur the selected provider's normal API charges. Drafting can proceed without sending. Manual sending shows the exact recipient, subject, and body and requires `send`; broad computer permissions and `--yes` do not grant email authority. Learned samples come only from confirmed, successfully sent replies. Automatically generated replies never train themselves.

Automatic replies require an exact sender allow list and a daily limit of 1–50. Authentication, marketing, automated, transactional, mismatched Reply-To, and sensitive payment, password, authorization, or contract content are excluded. A failed or unknown send is recorded and never automatically replayed. Recheck the sent mailbox before any separate follow-up. Automatic messages carry `Auto-Submitted: auto-replied` to reduce responder loops; incoming automatic-message headers are excluded, following [RFC 3834](https://www.rfc-editor.org/rfc/rfc3834).

Authentication codes are excluded from model reads, notification summaries, and learned samples. `/mail code <id>` reveals detected codes only after an explicit command in a local terminal. It is unavailable in JSON output or agent tools. Content recognition is conservative but cannot guarantee recognition of every language or custom message format.

## Live preview

```text
/preview start
/preview start --directory dist
/preview start --url http://127.0.0.1:5173
/preview discover
/preview auto off
/preview auto on
/preview status
/preview open
/preview stop
```

A local website-building task automatically opens one companion preview after a successful file change. A short continuation of that website task can reuse it. Unrelated tasks, explicit requests not to open a browser, plan/report modes, remote gateway messages and unattended CI do not trigger it. `/preview auto off` also cancels automatic opening that is still waiting for the project server; `/preview stop` closes the current owned preview. Cancelling or switching the task prevents its pending preview launch. An existing preview is not closed by an obsolete caller. The settings page has both controls.

`/preview discover` identifies static entry points and existing development scripts. Framework projects are not served as raw source HTML. For static projects, Koder can locate `index.html` at the project root or in `dist`, `build` or `public`. It serves selected files on a dynamically selected loopback port and opens a companion browser page. Concurrent starts share one server and one browser launch. If the launcher fails, Koder reports that result and prints the usable URL.

The page includes desktop, tablet, and phone viewports and a manual refresh control. File changes trigger reload through [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). If the user is typing in a form, a refresh button appears instead of discarding that input.

React, Vue, Next.js, and Expo Web projects first start their existing development server using their documented command and Koder's usual shell authorization. When a successful project command returns its actual localhost URL, automatic preview waits for that service to respond within the existing five-second bound, then opens it. You can also attach it manually with `/preview start --url ...`; framework HMR remains responsible for updates. Koder does not scan other tasks' ports, install dependencies or run package scripts through the preview tool. A browser preview cannot replace native iOS/Android simulator or device acceptance.

The preview server accepts loopback requests only, checks request origins, blocks secret paths and symbolic links, bounds served files, and provides no write or command endpoint. It stops with its owning chat or foreground preview command. One-shot agent tasks close their own preview at completion; use interactive chat or `koder preview start` for a continuing preview. External development servers remain owned by their original process and are not terminated by Koder.

The built-in **Live project preview** skill and `workspace_preview` tool guide the agent through project discovery, approved startup, real response checks, browser opening, edits, visual checks, and cleanup. A returned URL proves that the preview server started; it does not prove that every application page or backend works.

## Proactive decision questions (0.4.3 candidate)

Mailbox binding now uses an exclusive masked input reader, including when invoked from chat. Windows backspace and bracketed paste are parsed as input controls, not credential characters. End-of-input and cancellation release the reader; credentials are not echoed or queued as later chat tasks. Native Windows acceptance remains separate.

After binding, run `/mail model on`, then `/mail inquire on`, and confirm each grant. Notifications must also remain enabled. This path is independent of `/mail auto`: decision-bearing mail never takes the automatic-send branch. Marketing and authentication messages never enter inquiry extraction or drafting. Most low-relevance messages remain silent.

A pending question offers A/B or an explicit free-text decision. `/mail choose <id> B` drafts a reply card with From, To, Subject and Body. `/mail send-inquiry <id>` shows the final preview and still requires the exact `send` confirmation; `--yes` cannot bypass it. In chat, a focused inquiry also accepts `B`, `Other: ...`, `Edit: ...`, `send` and `cancel`. `/mail inquiries` restores pending questions, while `/mail followups` lists active follow-ups. Unknown SMTP outcomes block replay.

The default push cap is five per day and follow-up lasts fourteen days. Use `/mail inquire on --inquire-limit 5 --follow-up-days 14 --quiet-hours 23:00-08:00`. Quiet-held questions become due once after quiet hours, within the same limit. Settings, choices, drafts and follow-ups stay in the existing encrypted account namespace and use its operation lease. The original IMAP/POP cursor, consent gates and delivery ledger remain authoritative.

The foreground chat/watch paths are implemented. `runMailProactiveTick` provides a gated adapter for a future existing daemon host; OS notifications, notification deep links and gateway delivery are not connected in this candidate. Closing chat/watch stops checks. The CLI does not claim independent always-on operation. See [the Chinese workflow guide](MAIL-PROACTIVE-INQUIRY.zh.md) for commands, recovery and acceptance boundaries.
