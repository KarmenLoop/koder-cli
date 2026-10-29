# Task results and recovery

A task is complete when its requested output exists and the available checks support that result. An idle process, a tool preamble, or a model saying “done” is not enough. Koder keeps the original session, tool receipts, and files when a task stops.

The JSON result includes `completion.state`, `completion.reasonCode`, `completion.evidence`, and `completion.nextStep`. The states are `completed`, `incomplete`, `unknown`, `failed`, and `cancelled`. Incomplete delivery and unknown effects return exit code 3. Provider and argument errors retain their existing exit codes; cancellation remains distinct. Scripts should inspect the result and exit code rather than treating the presence of output as success.

## Empty answers and missing work

An empty final answer can trigger up to two requests for the missing answer. These requests expose no tools, use the current task's model and cost budget, and do not replay earlier operations. If the model still returns nothing, Koder reports `TASK_EMPTY_RESULT` and a next step.

If delivery checks find missing code, documentation, required verification, or website output, the existing execution loop can attempt a bounded repair. The original permissions, cancellation and cost limits still apply. Unresolved checks produce `TASK_DELIVERY_INCOMPLETE`, including the actual issues. A failed effect receipt or a failed command explicitly named in the task cannot be erased by an unrelated later success.

## Work that makes no progress

There is no default lifetime tool-count limit. Repeated identical failures without intervening successful tool work can stop as `TASK_NO_PROGRESS`. Different file paths and legitimate recovery checks do not automatically disable a useful tool. This protects long tasks from both a fixed 16-step ceiling and endless retries of the same failed request.

Inspect the reported reason and saved results before continuing. A rejected operation needs its original authorization path. An unknown operation needs read-only reconciliation; neither “continue” nor a different tool grants permission to repeat it. A cancellation stops later work but does not establish whether an already dispatched external operation finished.

## Context and tools

For small model windows, Koder keeps the current request, current constraints and unresolved execution evidence ahead of optional workflow material. It retains whole notebook sections and identifies omissions. Large earlier turns can use bounded quoted carry-over; original history remains on disk.

When an 8K window is under pressure, ancillary tool schemas can be deferred. `tool_inventory` exposes existing mounted tools on demand, and relevant user requests, current calls and actual inventory results add their original schemas. This changes what the model sees, not the executor, available permissions or the tool's argument contract. Increasing a context setting does not increase a provider's actual supported window.

## Websites

See [Website delivery](website-delivery.md) for the default Fullstack Web Delivery integration. The sequence covers requirements, plans, applicable specifications, layout decisions, implementation, verification and handoff. Existing-site repairs retain their scope and project anchor.

The final answer must include the actual preview URL when preview is part of the task. Automatic preview readiness is settled before the final delivery check, and its current host status is available to the model. An HTTP response does not establish visual quality, usable controls or production readiness. Those claims require their own evidence.

A bare “continue” can finish an interrupted website task without recreating its files. Previously verified writes count only after their saved hashes match the current files and the nearest task record establishes the continuation. An unrelated new request does not inherit that site's completion state.

## Verification limits

Deterministic provider fixtures verify routing, persistence, tool execution, cancellation and result contracts. They do not measure real-model writing or design quality. Native Windows GUI operations, external accounts, paid providers and production deployment remain separate checks; report them as `NOT_RUN` until observed.

A native `mail_send` or sending `mail_reply` that receives `DELIVERY_UNCERTAIN` retains an unknown effect receipt. Even a later inbox read or honest explanatory answer cannot convert it into a verified send: the task remains incomplete (exit 3). Reconcile the provider record before a new send; no automatic replay occurs.

## Local failure reports (0.5.21)

Failed or unverified tasks provide a report ID, specific codes and execution state. Use `/error copy` in chat or `koder logs report --json` in a terminal. Reports stay local, exclude content and credentials, and honor the Setup telemetry switch. [Guide](ERROR-REPORTS.md) · [中文教程](ERROR-REPORTS.zh.md).
