# Shipped MCP and Skill inventory — 0.4.17

This inventory records actual catalog reads and bundled-resource integrity checks. It excludes user-installed Skills. Readability and a pinned archive do not establish that the external application, account or target OS works. Current device/account scope is in [the commitment audit](PROMISE-AUDIT-0.4.17.md).

## Selectable methods

| ID | State | Bytes read |
| --- | --- | --- |
| bundled:cli-anything | readable | 2200 |
| bundled:dashi-animationstyle | readable | 2008 |
| bundled:huashu-art-motion | readable | 2056 |
| bundled:jianying-editor | readable | 2370 |
| bundled:koder-media-workflow | readable | 3012 |
| bundled:lemo-opuscar | readable | 2141 |
| bundled:mg-styles-15 | readable | 2064 |
| bundled:playwright-cli | readable | 2225 |
| bundled:video-shotcraft | readable | 2070 |
| bundled:xilo-opus-video | readable | 1979 |
| builtin:整理真实材料 | readable | 1336 |
| builtin:加页面 | readable | 213 |
| builtin:改错位 | readable | 189 |
| builtin:做表单 | readable | 201 |
| builtin:接口页面 | readable | 246 |
| builtin:先写测试 | readable | 153 |
| builtin:解释代码 | readable | 132 |
| builtin:改名搬文件 | readable | 159 |
| builtin:命令行 | readable | 210 |
| builtin:发布前 | readable | 171 |
| builtin:guide-website | readable | 941 |
| builtin:guide-application | readable | 607 |
| builtin:guide-desktop | readable | 828 |
| builtin:guide-app | readable | 1054 |
| builtin:universal-app-use | readable | 5626 |
| ecosystem:open-code-review:open-code-review | readable | 12458 |
| ecosystem:ecc:continuous-learning-v2 | readable | 12413 |
| ecosystem:ecc:eval-harness | readable | 9145 |
| ecosystem:ecc:security-review | readable | 12407 |
| ecosystem:ecc:strategic-compact | readable | 9015 |
| ecosystem:ecc:tdd-workflow | readable | 12411 |
| ecosystem:ecc:verification-loop | readable | 3471 |
| ecosystem:i-have-adhd:i-have-adhd | readable | 7608 |
| ecosystem:humanizer:humanizer | readable | 12418 |
| ecosystem:superpowers:brainstorming | readable | 10480 |
| ecosystem:superpowers:diagnosing-superpowers | readable | 7311 |
| ecosystem:superpowers:dispatching-parallel-agents | readable | 6485 |
| ecosystem:superpowers:executing-plans | readable | 12473 |
| ecosystem:superpowers:finishing-a-development-branch | readable | 8188 |
| ecosystem:superpowers:receiving-code-review | readable | 6610 |
| ecosystem:superpowers:requesting-code-review | readable | 3381 |
| ecosystem:superpowers:subagent-driven-development | readable | 12471 |
| ecosystem:superpowers:systematic-debugging | readable | 9937 |
| ecosystem:superpowers:test-driven-development | readable | 9985 |
| ecosystem:superpowers:using-git-worktrees | readable | 7220 |
| ecosystem:superpowers:using-superpowers | readable | 3599 |
| ecosystem:superpowers:verification-before-completion | readable | 4053 |
| ecosystem:superpowers:writing-plans | readable | 10742 |
| ecosystem:superpowers:writing-skills | readable | 12473 |
| ecosystem:skills:algorithmic-art | readable | 12437 |
| ecosystem:skills:frontend-design | readable | 9797 |
| ecosystem:skills:internal-comms | readable | 1918 |
| ecosystem:skills:mcp-builder | readable | 9499 |
| ecosystem:skills:skill-creator | readable | 12507 |
| ecosystem:skills:theme-factory | readable | 3531 |
| ecosystem:skills:webapp-testing | readable | 4320 |
| ecosystem:ui-ux-pro-max-skill:ui-ux-pro-max | readable | 12442 |
| ecosystem:caveman:caveman-compress | readable | 5985 |
| ecosystem:caveman:caveman | readable | 5085 |
| ecosystem:caveman:verify-and-stop | readable | 1111 |
| koder-computer:local-files | readable | 1186 |
| koder-computer:browser-work | readable | 1717 |
| koder-computer:channel-file-delivery | readable | 1201 |
| koder-computer:skill-maintenance | readable | 1289 |
| builtin:development-workflow | readable | 5897 |
| builtin:personal-agent-growth | readable | 6880 |
| ecosystem:agent-browser:core | readable | 13052 |
| builtin:headroom | readable | 3324 |
| builtin:cli-anything | readable | 4900 |

## Source libraries

| Library | State |
| --- | --- |
| video-shotcraft | integrity-verified |
| xilo-opus-video | integrity-verified |
| lemo-opuscar | integrity-verified |
| mg-styles-15 | integrity-verified |
| huashu-art-motion | integrity-verified |
| dashi-animationstyle | integrity-verified |
| playwright-cli | integrity-verified |
| cli-anything | integrity-verified |
| jianying-editor | integrity-verified |
| koder-media-workflow | integrity-verified |
| wtt-code-animation-studio | reference-only |
| x-article-auto-publisher | reference-only |

MCP presets remain Windows-MCP 0.8.8 and CodeGraphContext 0.6.13. The MCP host discovers the enabled server's actual schemas before calls. Missing platform prerequisites, account bindings and computer permissions are reported; they are not silently installed or granted. The [historical real-call record](MCP-ACTUAL-ACCEPTANCE.en.md) identifies its original build and host. New Windows 10/11 GUI beta results must reference this release.
