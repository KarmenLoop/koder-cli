# Local evidence exercise

Copy policy.md into a separate project directory. Run `koder llm-apps retrieve policy.md --query "退货期限" --json`. Use the returned path and SHA in a citations.json object containing a citations array of {path, sha256, quote}; run `koder llm-apps check citations.json --json`.

A forged quote or changed source returns exit 3. The fixture is sample policy text, not a real merchant's policy. This exercise is offline and uses no model. See [the full walkthrough](../../AWESOME-LLM-APPS.zh.md) for exact commands, limits and an Agent workflow.

