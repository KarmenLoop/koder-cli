# Installation and model troubleshooting

## CMD or PowerShell seems quiet

Use the matching command from [installation](INSTALLATION.md). The installer first displays the KARMEN LOOP introduction and license. Read the terms, type `accept`, and press Enter if you agree. An empty Enter asks again. `decline` or Ctrl+C cancels. Automation requires the explicit consent setting described in the installation guide.

After acceptance, status messages identify the current download, checksum or extraction step. A slow Node.js probe lasts at most five seconds before the installer chooses its private runtime. Total download time can reach 100000000 seconds, but that does not disable stalled-transfer detection, progress messages or cancellation. Repeatedly pasting the command starts separate installers; cancel the current attempt before trying again.

If a download cannot proceed, keep the final error and the name of the current step. Check the network, proxy and official download page, then retry the ordinary installer. Avoid changing the license text, disabling checksum validation or deleting your existing configuration. An existing install is preserved when validation fails.

Once installed, open a new terminal and run:

```text
koder --version
koder doctor
koder model show
```

## EXECUTION_PERMISSIONS_INVALID before a command runs

This error comes from Koder's saved execution settings. A “Preparing command” line is a preview, not evidence that Windows ran the command. Changing the system PowerShell execution policy does not repair this record.

Preview.18 accepts a valid UTF-8 BOM record. If the record is damaged, the next action offers a fresh decision. Type y to allow that action once, always to rebuild an exact-action grant, or full to rebuild full access for the current workspace. A rebuilt record preserves the original bytes in a local execution-permissions.invalid-UUID.json backup. Other workspaces return to smart approval. Declining leaves the old file untouched. Symbolic links, oversized files and files that cannot be safely read are not trusted or silently replaced.

You can also choose Full access in Settings and confirm FULL, or run:

```text
koder permissions execution full --confirm FULL
```

To revoke execution permissions instead, use `koder permissions execution reset`. Koder full access controls its own approval prompts; it does not grant Windows administrator rights, fill passwords or change machine-wide script policies.

## A provider is gray or says temporarily unavailable

Preview.16 disables MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan and both Volcano routes because of known integration bugs. This is a product availability status, not a diagnosis that your key is wrong. Re-entering a key will not enable these entries. Your saved configuration is retained. Choose another available service in `koder setup`; no replacement service or backup engine is selected automatically.

For an available service, confirm its exact product and endpoint, then run `koder model test --tools` if you authorize a real API request. This checks tool calling and continuation, not just a text reply. Provider charges may apply. Never put API keys into a public issue, screenshot or support email.

## Send useful feedback

Contact [info@karmenloop.com](mailto:info@karmenloop.com) with the Koder version, Windows/macOS/Linux version, terminal, provider product and the final error text. Remove keys, private prompts and personal paths. Koder can prepare a feedback template when you ask; it does not send it for you.

## A website task returns the Koder introduction

Update to preview.20 or newer. Earlier versions could mistake the word “官网” in a website redesign task for a question about Koder. In preview.20, the whole request must be an explicit product question before that local response is used. Ordinary website work reaches the model.

Open menus at the current `koder ›` prompt with `/menu`, `/setup`, `/celebrate`, or `彩蛋菜单`. You can also type `koder setup` or `koder celebrate` there. Escape returns from settings; Enter skips the effect menu. No additional terminal is required.
