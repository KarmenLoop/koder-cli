# 0.4.0-preview.26 Beta

Prepared from preview.26-candidate.8. The sections below describe the included repairs; they do not certify every native platform or external account.

- Explicit tasks do not wait on unrelated stdin. --stdin attaches complete pipe input with a finite read deadline.
- Task history and automatic recall stay in their workspace/session. Explicit shared notes keep their separate scope. New creation tasks use Koder Projects.
- Headless ask_user returns unanswered without user consent and stops repeated questions within a small bound. --yes remains temporary execution approval.
- Rejected requests before model content or tool/effect activity restore the previous history. Completed effects and model-only recovery remain intact.
- Provider error details are bounded and redacted; model diagnosis uses a short deadline. Unparsed JSON review and unsupported writing-disclosure results do not return a clean exit.
- Task-specific prompt composition supports the strengthened 13-turn 8k context scenario without raising the window.
- Browser/design method resources and complete bilingual guides are included. Native browser/service availability and authorization remain required.

## Test scope and known limits

The source baseline records 63 final contract passes and 30 Windows-related portable passes on macOS, plus broader scoped regressions. This publication checks the packaged bytes and isolated installation separately. Native Windows, real provider accounts and original capability grading are not established by those fixtures. MiMo Token Plan, Kimi API/Code, DeepSeek, Alibaba Token Plan and Volcano integrations remain unavailable. No automatic provider or billing-route fallback was enabled.
