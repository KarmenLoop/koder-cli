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

## A provider is gray or says temporarily unavailable

Preview.16 disables MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan and both Volcano routes because of known integration bugs. This is a product availability status, not a diagnosis that your key is wrong. Re-entering a key will not enable these entries. Your saved configuration is retained. Choose another available service in `koder setup`; no replacement service or backup engine is selected automatically.

For an available service, confirm its exact product and endpoint, then run `koder model test --tools` if you authorize a real API request. This checks tool calling and continuation, not just a text reply. Provider charges may apply. Never put API keys into a public issue, screenshot or support email.

## Send useful feedback

Contact [info@karmenloop.com](mailto:info@karmenloop.com) with the Koder version, Windows/macOS/Linux version, terminal, provider product and the final error text. Remove keys, private prompts and personal paths. Koder can prepare a feedback template when you ask; it does not send it for you.
