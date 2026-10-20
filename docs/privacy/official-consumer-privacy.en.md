# Privacy notice

Updated: October 20, 2026
Effective: October 9, 2026

The KARMENLOOP Official Team (“we”) knows that personal information matters, and we handle information related to this software under the Personal Information Protection Law of the People’s Republic of China, the Cybersecurity Law of the People’s Republic of China, the Data Security Law of the People’s Republic of China, and other applicable law. This notice explains what the Koder desktop app and the KARMEN LOOP kernel that ships with it, KARMEN bot, the System page, the updater, and the local service (together, “the software”) process while you use it, why, where it is stored, when it leaves your computer, and how you can look at it, change it, and delete it. Pay attention to the bold sentences.

The design is local-first. The software does not require an account. It does not offer cloud sync. It does not upload telemetry or statistics. We do not keep your tasks, chats, files, or keys on our servers. Your content is sent to a third-party service you chose only when you use a feature that needs that service. The website copy of this notice will be published when the official site is up. Until then, the copy shown in the software controls.

## 1. What this notice covers

This notice covers installing and using the software on a computer, including creating and running a task, talking with KARMEN, configuring a model service and a key, using the built-in terminal, opening the System page, checking for and installing an update, and reminders and system notifications the software sends. It does not cover a third-party model service, a web search service, a site you visit, your operating system and browser, or any other third-party product or service you connect through the software. Those third parties handle your information under their own privacy policies. Read those policies before you use them.

## 2. How we handle your information

Each item below says what the software processes, why, how, and where it is kept. Unless this notice says otherwise, that information stays on your computer, the software processes it there, and we cannot reach it.

2.1 What you type, and the task record. Messages you type in a task or in a KARMEN chat, the AI’s replies, questions it asks and your answers, suggested file changes and the approval record, and commands and their output are stored in the software’s data folder so you can look back and continue a task. Each task also keeps a Markdown record in .koder/tasks inside its folder. That record does not include the model’s thinking or the raw output of a tool. An old task from before a kernel switch stays where it was, and it is shown read-only.

2.2 Files you ask the software to handle. When you ask the AI to read, search, or edit files in a folder, the software reads those files on this computer. Before it edits a file, it shows the before and after, and it writes to disk only after you accept. **File contents the AI reads are sent as context to the model service you chose. Do not let the AI read a file you do not want sent to that service.**

2.3 Model settings and keys. A model service you add, its endpoint, the model, and your thinking-level and model-strength choices stay on this computer. Your API key is kept in the software’s encrypted key store. The key is encrypted with AES-256-GCM, and the key file used for that encryption can be read only by the current system user. The software does not read a model key from an environment variable or from a .env file, and the interface does not show any part of a key.

2.4 Usage. So the System page can show token use and an estimated cost, the software records, on this computer, the time of each model call, the task and folder, the service and model, and the input and output token counts. A usage record does not include your message or the contents of a file.

2.5 Device information and the serial number. The first time the software runs, it generates a random serial number on this computer, for later support and for update delivery. To tie that serial number to this computer, the software reads a board identifier (the hardware UUID on macOS, the SMBIOS UUID on Windows, and the product UUID or machine-id on Linux). **It stores only the SHA-256 hash. It does not store the original value, and it does not upload it.** The software also keeps a running total of time worked, on this computer. The IP address, wireless MAC address, and Bluetooth address shown under Status on the System page are read from this computer only while that page is open. They are hidden by default, they appear only after you click, and they are not saved or uploaded.

2.6 Settings and interface preferences. Appearance, layout, grouping, pins, chat mode, tool switches, how a message is sent while a task is running, and reminder settings are stored in the data folder or in the browser’s local storage on this computer, so the next time you open the software your choices are still there.

2.7 Sign-in credentials saved in the lock box. If you save a website username and password in the software’s lock box, they are stored on this computer encrypted with AES-256-GCM. They are used only to finish a sign-in you started. They do not appear in a chat, a terminal log, or the interface.

2.8 Reminders and system notifications. When a task finishes, the AI replies, or something needs you, the software shows a reminder at the top right of the window. Only after you click Allow system notifications and grant that permission in the system does the software show a reminder through the operating system’s notification center while the window is in the background. The reminder contains the task name and a short piece of the start of the reply. You can turn reminders off in Settings at any time, or withdraw the notification permission in system settings.

2.9 The clipboard. The software writes to the clipboard only when you click Copy, for example a reply, code, the serial number, or a folder path. The software does not read your clipboard.

2.10 The built-in terminal. A command you type in the built-in terminal is run by the command-line program on this computer, and the output is shown in the interface. A terminal record is not sent to a model service unless you copy it into a chat.

2.11 Logs. The software keeps a run log in the data folder, for startup and runtime problems. It does not intentionally log your keys or passwords. When something fails, a log may include a short note about the failed request, such as an error message, a file path, or a service address. Logs stay on this computer, and you can delete them at any time.

## 3. When information leaves your computer

**We do not sell or rent any of your information, and we do not give it to any third party for advertising or marketing.** Information leaves your computer only in the cases below, and the recipient is a third party you chose or a site you opened yourself. It is not us.

3.1 Sent to the model service you chose. When you send a message, the software sends your message, the chat history, file contents the AI read, tool results, and the system instructions it needs, together with the API key you configured, to the endpoint of the model service you selected for that task. The recipient is that model provider. How it is handled follows that provider’s privacy policy and terms.

3.2 Reading the live model list. When you click Read live models, the software uses the key you typed, or a key already in the key store, to request the model list from that service’s endpoint.

3.3 Web search and fetching a page. When the AI uses web search, the query is sent to a public search service to bring back public results, and your model key is not used. When the AI fetches a page, your computer opens that public address directly, and the site can see access information such as your IP address. You can turn both tools off under Tools.

3.4 Checking for and installing an update. After an update address is configured, the software visits the official update address to download update notes and the update package. An update request does not include your serial number, device information, or any content. No update address is configured yet, so the software does not check the network for updates. A link such as the security-patch page opens in the browser only after you click it.

3.5 What the law requires. If the law requires it, or a competent authority lawfully requires it, we may have to provide information we hold. Because the software does not upload your content to us, we usually do not hold your tasks, chats, files, or keys.

## 4. Cross-border transfer

**If the model service or other third-party service you choose is outside the People’s Republic of China (some international model services, for example), the content you send to it is transferred outside China, and the law of that provider’s location and that provider’s privacy policy apply.** You start that transfer by choosing the service. The software marks the region in the model list. When you handle personal information, important data, or sensitive information, we recommend a service inside mainland China, and you should confirm that your use meets the rules on sending data out of China.

## 5. Sensitive personal information

The software does not set out to collect sensitive personal information. If a message or a file of yours includes an identity-document number, a financial account, health information, location history, biometric information, or personal information of a child under 14, that information is sent to the model service you chose as section 3 describes. Be careful about providing it.

## 6. Storage and protection

6.1 Where it is stored. The software’s data is in its data folder. A task record is also stored in .koder/tasks inside the task’s folder.

6.2 How long. Your information stays on your computer until you delete the task, remove the model service, clear the data folder, or uninstall the software. We do not store your information on a server, so there is no server-side retention period.

6.3 Safeguards. The software protects your information as follows. The local service listens only on the loopback address 127.0.0.1 and refuses a request started by another website. The shell and the kernel authenticate each other with a token only the current system user can read. Keys and passwords are encrypted with AES-256-GCM. A file write and a command need your confirmation first. A software update is checked with a digital signature. See the Security notice. Even so, no safeguard is perfect. The security of the computer itself, including the system account, disk encryption, and protection from malicious software, matters too.

## 7. Your rights

You have the following rights over personal information the software processes, and you exercise them in the software. You do not have to apply to us.

7.1 Access and a copy. You can see what the software has stored in the task list, the chat history, the System page, and Settings. A task record is a Markdown file in the task folder, and you can open it and copy it.

7.2 Correction. You can rename a task, change a model-service configuration, replace a key, and change settings.

7.3 Deletion. You can delete a task or a chat, remove a service from model settings (which also deletes its key and its routing), and delete a saved sign-in. You can also delete the data folder or uninstall the software to remove all local information. You can delete the .koder directory in a task folder yourself.

7.4 Withdrawal of consent. You can turn reminders off, withdraw system-notification permission, turn off web search and page fetching, set the chat to read-only, or stop using the software. Withdrawing consent does not undo processing that already happened on the consent you gave before.

7.5 An explanation, and a complaint. You can contact us as section 11 describes, with a question, a comment, or a complaint about this notice. We reply within 15 business days after we have verified it.

## 8. Minors

The software is meant for adults. If you are under 18, read this notice and use the software with a parent or other guardian. A child under 14 should not use the software to handle their personal information.

## 9. Third-party services

The software can connect to a model service you add, including a local service and another compatible endpoint. What is available is the model list in the software. Each service is provided independently by its own operator. You open it yourself, and you accept its terms and privacy policy. Web search uses public search results. It is not a private endpoint of one model service. We do not process personal information on behalf of those operators. Sending information to a model service is you using that service directly.

## 10. Changes to this notice

We may update this notice because the law, a regulatory requirement, or a feature of the software has changed. An updated version shows a new updated date and is shown in the software. If a change is significant for the purpose, the method, or the scope of processing, we will say so prominently in the software.

## 11. Contact

Questions, comments, or complaints about this notice or your personal information: KARMENLOOP Official Team. Team location: Shanghai, China. Contact email: info@karmenloop.com. Our contact details are published on the official website. If you are not satisfied with our reply, you may complain to a competent authority such as the cyberspace or market-regulation authority, or file a lawsuit in a people’s court that has jurisdiction.
