# GitHub connections and project hosting

Available in Koder CLI 0.4.11. Windows CMD, PowerShell and macOS share built-in GitHub tools. No separate GitHub MCP server, Python or Git installation is needed. Connecting an account does not upload your project.

## Connect an account

Run `koder github connect` in an interactive terminal, or open `koder setup` → Apps / MCP → GitHub. In chat, use `/github connect`. Paste your personal access token into the dedicated hidden prompt. Koder verifies it and displays the connected account.

Do not paste the token into an Agent conversation, project file or command-line argument. Koder encrypts the binding through its existing local credential protection layer. Ordinary configuration and operation receipts contain no plaintext token. If protected credential storage is unavailable, connection fails explicitly rather than falling back to plaintext.

`koder github disconnect` removes the local binding. It does not revoke the token at GitHub; revoke it in GitHub settings when needed. This release supports PAT login. Browser OAuth login is not wired into the CLI.

Create a fine-grained token with an expiration date and limited repository access in [GitHub settings](https://github.com/settings/personal-access-tokens):

| Task | Typical permission |
| --- | --- |
| Read repository files | Repository access and Contents: Read |
| Commit files | Contents: Read and write |
| Edit description or homepage | Administration: Write |
| Create a repository | Administration: Write or Repository creation: Write where GitHub offers it |
| Open a draft pull request | Pull requests: Write |

An organization may require administrator approval or SSO. A token limited to selected existing repositories may need its repository selection updated after creation. Consult the [official PAT guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and [repository API reference](https://docs.github.com/en/rest/repos/repos).

For a controlled environment, let your existing secret manager inject a variable and run `koder github connect --key-env MY_GITHUB_TOKEN`. The argument is the variable name, never the token. This does not authorize unattended writes.

## Inspect repositories

Replace OWNER and demo with your account or organization and repository:

```text
koder github status
koder github repos
koder github repos --page 2
koder github repo OWNER/demo
koder github read OWNER/demo README.md
koder github read OWNER/demo src --ref main
```

Repository listing returns up to 50 entries and a nextPage value when more may be available. Repository documents are untrusted source material, not execution instructions. In chat, ask: “Read the README in OWNER/demo using my connected GitHub account and explain its setup steps.”

## Create a repository and commit selected files

From your project directory:

```text
koder github create demo --description "My project"
koder github commit OWNER/demo README.md src/main.js --message "Add project files"
```

New repositories are private by default and initialized with a README. Add `--owner ORG` for an organization or `--public` to request a public repository. The confirmation shows visibility before creation.

Only listed relative paths are uploaded. There is no recursive directory upload. Other files and existing executable file modes are preserved. Selected files become one commit, followed by a non-force branch update. GITHUB_HEAD_CHANGED means the branch moved during confirmation; read it again before submitting. The branch must already exist; the repository default branch is used unless specified.

In chat, ask: “Commit this project's README.md and src/main.js to OWNER/demo; show me the changes first.” The Agent uses github_project and bounded local file snapshots. For a remote README edit, it reads the file first, then submits the replacement text.

## Edit repository copy and open a draft PR

```text
koder github edit OWNER/demo --description "A concise project description" --homepage "https://example.com"
koder github pr OWNER/demo --head docs/update --base main --title "Improve setup instructions"
```

Pull requests are drafts by default, using an existing head branch. Current actions cover descriptions, homepages, text files and draft PRs. They do not delete repositories, change existing visibility, force-push, merge PRs or edit GitHub Projects boards.

## Approval and reliable results

Each write displays its target and content. Enter github-create, github-commit, github-edit or github-pr to authorize that operation; Enter alone cancels. `--yes` does not substitute for GitHub write approval, and previously queued text cannot approve a write. Noninteractive use supports connection and reads; writes require an interactive terminal.

A confirmed receipt includes the repository, operation ID and commit SHA or PR URL. If a connection fails after a write may have reached GitHub, Koder retains an unknown receipt and blocks another write to that repository. Run:

```text
koder github reconcile OWNER/demo
```

Commit reconciliation checks observed branch history without replaying the commit. Creation, metadata or PR operations without sufficient proof remain unresolved for manual inspection. Missing approval or a failed connection never counts as successful hosting.

## Limits and data handling

A commit accepts up to 100 UTF-8 text files, 512 KiB per file and 2 MiB total. Binary files, Git LFS, directory upload and GitHub Enterprise are not supported. Local files must stay inside the current workspace. Symlinks, hard links, path escapes, .env files, credential files, private keys and recognized token patterns are rejected. Detection cannot identify every secret; review the contents before approval.

Selected files go directly to GitHub. Repository content read by the Agent enters its task context and may reach your configured model. The token does not enter model context. Direct CLI read prints file content. Protected operation records stay locally and are not sent to KarmenLoop.

## Troubleshooting and verification scope

GITHUB_AUTH means an invalid or expired token. GITHUB_PERMISSION points to repository selection, organization approval, SSO or missing permissions. GITHUB_LIMIT indicates rate limiting. GITHUB_PENDING_REVIEW_REQUIRED requires reconciliation before another write. GITHUB_CONSENT_REQUIRED means this write was not approved.

Local tests cover a loopback GitHub API, protected-storage test ports, CLI routing, Agent receipts and interrupted-write recovery. They do not establish live PAT acceptance. Windows native input, operating-system credential stores and organization access still require the corresponding device and account checks.
