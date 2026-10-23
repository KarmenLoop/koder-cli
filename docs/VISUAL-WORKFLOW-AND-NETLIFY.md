# Visual directions, project maps and Netlify

This feature, first prepared in source candidate **0.4.0-preview.26-candidate.6**, is included in **0.4.0**. Native Windows, real Netlify credentials, Koder's registered OAuth application and production acceptance are separate release gates.

## Compare before building

For a new website, slide deck or app, the built-in visual delivery skill asks the Agent to inspect the brief and produce three real, self-contained HTML directions. The directions must differ in layout, content organization or interaction, with an explanation of when each works and what it costs. They are design prototypes, not three completed production projects. Small fixes and explicitly skipped exploration do not restart the process.

The `project_visuals` tool opens a local browser review. Use the numbered tabs, arrow keys or **Compare all**. Choose a direction, give a 1–5 score and describe what to keep or change. A score below 3 leaves the work in revision. Feedback is saved locally and included as untrusted review data in the next model context. Return to Koder and continue; clicking a review never submits a task, executes a command or authorizes a deployment. You can combine directions in your comments. The Agent remains responsible for making the three directions relevant to the brief and for respecting the user's review.

The same tool's `decision` action presents 2–6 alternatives as labeled step diagrams, with benefits and costs. Use it for page flows, architecture, content organization or deployment choices when a picture makes the decision clearer. It does not invent evidence or preselect a winner.

Slide directions should show representative slides and narrative order. Native app directions show interactive layout prototypes; a browser prototype is not simulator or device acceptance. Existing model, file and execution permissions still apply. Unsupported external engines do not gain these tools automatically.

`/setup` and `/steup` expose **Visual reviews and project map** inside **Live preview**. Netlify is inside **Applications and MCP**. These entries reuse existing groups so the main menu and its Done action remain visible. The terminal also provides:

```text
/visuals status
/visuals review --file directions.json
/visuals decision --file decision.json
/visuals deliver --title "My project"
```

The JSON file for a website review has `kind: "website"`, a `title`, a `brief` and exactly three `variants`. Each variant needs `name`, a distinct `axis`, `description`, and either self-contained `html` or a project-relative HTML `path`. Optional `cost` describes its tradeoff. A decision uses `kind: "decision"` and 2–6 variants with short `steps`. Files, strings and feedback have bounded lengths; project escapes and symlinks are rejected. Review iframes run in a sandbox without same-origin access or execution authority.

Interactive chat keeps its review server alive. The foreground `koder visuals review ...` command also keeps it alive until Ctrl+C. One-shot Agent commands close owned preview servers at completion; their H5 files remain in `koder-review/<id>/`. Offline or expired reviews explain that feedback should be copied back to Koder. They do not claim that a failed save succeeded.

## H5 delivery atlas

The Agent's delivery action and eligible completed project work generate `koder-delivery/<id>/index.html` and `structure.json`. The HTML is self-contained and works offline without a graph CDN. It supports module expansion, file search, selected-file details and JSON export. The map uses actual project files, sizes and conservative local reference candidates, rather than a fabricated architecture.

Source, pages, services, slide artifacts, assets, docs and tests are grouped for review. Dependencies, hidden/private files, credentials, generated review/delivery folders and symlinks are excluded. The scanner is bounded at 5,000 files, 20,000 entries and 12 directory levels. Reaching a bound is visibly labeled incomplete. It does not claim to produce a full semantic call graph or to verify application behavior. Inspect the map's scope and exclusions before sharing it: filenames and structure can themselves be private.

## Connect your own Netlify site

The native adapter uses the Netlify HTTPS API directly; it installs no Netlify CLI or SDK. The intended path is **Connect → choose site → review output → authorize draft upload → inspect preview → optionally publish**.

Browser login uses Netlify's documented ticket flow with **Koder's own configured OAuth application**. No other application's client ID or login cache is used. Until the application is configured, the menu item is gray and `/netlify login` reports `NETLIFY_OAUTH_NOT_CONFIGURED`. Protected personal access token entry provides a separate path. Token entry is hidden, and tokens are stored through the existing protected credential/encrypted-store mechanism outside deployable output. Failure to verify protected storage does not permit plaintext fallback.

```text
/netlify login
/netlify connect
/netlify connect --key-env YOUR_NETLIFY_TOKEN_VARIABLE
/netlify sites
/netlify bind
/netlify create --team your-team --name your-new-site
/netlify plan --directory dist
/netlify deploy --directory dist
/netlify status
/netlify reconcile
/netlify publish DEPLOY_ID
/netlify disconnect
```

Never paste a token into a task or put the token itself in a command argument. `--key-env` names an environment variable the user explicitly chose. `/netlify bind` offers accessible sites interactively; it shows the exact site/team before binding. Creating a site needs its own consent for the exact team and name, requests `configure_dns=false`, and sends no plan, billing, repository or add-on options. It does not upload files.

A normal binding does not authorize upload. To grant future **draft-only** uploads for one exact project/output folder and site, explicitly use:

```text
/netlify bind SITE_ID --allow-draft --directory dist
```

The confirmation explains that future files in that output folder may become externally accessible. Rebind without `--allow-draft`, or disconnect, to withdraw that local authority. It is a Koder-side restriction; Netlify's documented ticket flow does not promise a per-site bearer-token scope. Provider-side token revocation is separate from local disconnect.

The first supported upload path is **prebuilt static output** with an `index.html`. The adapter does not run builds or install dependencies. Framework source, SSR, functions and native application packages are not accepted as equivalent static deployment. Build the appropriate supported target through its normal command approval first. The static snapshot has bounded file count/size, rejects symlinks and obvious embedded private keys, and excludes credentials, source-only server folders and dependencies. Inspect the exact manifest and exclusions; no secret detector can prove an arbitrary public asset contains no private information.

A draft is an externally uploaded preview and may be publicly accessible. It does not replace the existing published deploy. Upload authorization identifies the selected directory, file count/bytes, site and SHA256 manifest. Content is checked again before creating a deploy. The Netlify API uses SHA1 digests to request exact file bytes; Koder retains the SHA256 approval receipt. Only a matching ready deploy and its HTTPS permalink are reported as successful.

Production publishing is separate: inspect the exact ready preview, confirm `publish-production`, recheck the site's current published deploy, request publication and read the published identity back. Concurrent provider changes or unknown results remain unverified. DNS, locks and billing are never changed automatically.

A rejected credential, access policy or rate limit produces a distinct safe diagnostic. Rate limits stop the operation and expose a retry interval when supplied; there is no busy retry loop. An ambiguous create/publish response is not automatically replayed. `reconcile` inspects a known deploy or an exact operation-title correlation; uncertain matches require manual review. Disconnect stops local use and clears the connection; it does not delete a remote deploy or revoke Netlify's token.

## Hosting, membership and real acceptance

The first integration uses the user's own authorized Netlify account/site. Netlify controls that account's plan, quota, roles, region and charges. Koder membership cannot grant Netlify quota or silently upgrade a provider plan. Koder-managed shared hosting, its billing service, quotas and upgrade entitlements are **not configured** in this beta. The UI reports that state instead of advertising a nonexistent hosting service.

Official sources: [API authentication and deploy guide](https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/), [ticket API](https://open-api.netlify.com/#tag/ticket/operation/createTicket), [first-party ticket flow](https://github.com/netlify/build/blob/main/packages/js-client/README.md#api-flow-methods), [deploy API](https://open-api.netlify.com/#tag/deploy/operation/createSiteDeploy), and [Netlify roles](https://docs.netlify.com/manage/accounts-and-billing/team-management/roles-and-permissions/). Research and limitations are preserved in this task's `NETLIFY-RESEARCH.md`. No real account or production deployment was used for the local acceptance fixtures.
