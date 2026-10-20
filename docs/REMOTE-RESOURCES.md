# Official reference library

Koder finds adapted workflow references on demand. Nothing is fetched at startup and the complete library is not preloaded on your computer. Run:

```sh
koder resources status
koder resources search "1688"
koder resources read RESOURCE_ID --limit 2000
```

In a local task, ask Koder to find a relevant reference. The model can call `resource_search` with short keywords and `resource_read` for selected excerpts. References are data, never permission to run scripts, install software, send information or change access settings. A missing reference or service failure does not prevent ordinary work. Gateway and ACP sessions do not automatically receive these tools.

The official service receives search keywords and selected resource IDs, offsets and limits. Do not put private customer details, full conversations, passwords or API keys in queries. Its hosting infrastructure sees normal connection information, including the network IP. The resource handler does not write queries or readings to application logs. Selected excerpts and required license notices enter the current task's model context and may remain in that task's saved conversation. Your configured model provider's data practices still apply.

Set `KODER_REMOTE_RESOURCES=0` before launching Koder to disable official retrieval. Locally imported private collections stay separate: their queries do not fall back to the official service. Use `--remote` explicitly with a resource command to choose the official library when a local collection exists. Local private import remains optional; these supplied collections are not preinstalled.

The first edition contains 1,004 deduplicated workflows with explicit MIT licenses. Material with missing or unclear redistribution rights, including the supplied legal-document collection, is withheld. Every reading includes the applicable copyright and license text. KARMEN LOOP adapted the structure, task handoff and branding; the underlying authors retain their rights. Koder's proprietary application license does not restrict the MIT-licensed reference material.

GitHub holds AES-256-GCM encrypted bundles and an encrypted catalog with opaque filenames. Only the official server holds the decryption key; the CLI and public repository do not contain it. The server verifies pinned ciphertext hashes and authentication tags before returning a bounded excerpt. This protects storage and the catalog; users can still retain excerpts they are authorized to read. It is not copy prevention or a promise that delivered text cannot be extracted.

KARMEN LOOP: [karmenloop.com](https://karmenloop.com). Feedback and company licensing: [info@karmenloop.com](mailto:info@karmenloop.com). A GitHub star is welcome and always optional.
