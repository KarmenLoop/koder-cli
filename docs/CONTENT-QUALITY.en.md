# Coding and writing methods

This guide describes the 0.4.1 release. It retains the current-task delivery checks from candidate.3 and adds guidance before the existing model request. It does not claim a measured improvement in model scores.

## Coding

Koder selects methods relevant to the request. Bug fixes emphasize reproduction, root cause and the affected callers. Performance work emphasizes the actual bottleneck, preserved behavior and measured comparisons. Refactoring emphasizes return values, ordering, errors, cancellation and side effects. Integration work checks real interfaces and failure paths. Website work considers information hierarchy, interaction, narrow screens and keyboard use; it does not require a backend for a static page.

A short request can still lead directly to implementation. The guidance does not require a planning document for every task. Explicitly requested authentication, persistence or integrations must not be represented as working by mock controls. Existing source, permission, budget and cancellation rules still apply.

## Writing

Ordinary writing now receives reader, purpose, factual support and next-action guidance. Email, proposals, rewrites, comparisons, release notes and condensed drafts receive different methods. Rewrites must preserve meaning, limitations and supported facts. Missing dates, prices, measurements and promises are not invented to make a draft sound concrete.

Short follow-ups such as “make this more professional” can reuse the nearest relevant user request. A new task takes priority. Assistant and tool text cannot establish a new task or grant authority. The guidance is bounded; it does not copy conversation text into system instructions.

The Humanizer skill retains its pinned upstream source and MIT attribution. Its catalog description and English rewrite matching are repaired; this is an integration metadata change, not an upstream skill update.

## Release evidence

Source checks recognize stable, candidate and preview version names. A changelog heading must identify the requested version; text merely mentioning an older version is not evidence of that version's changes. Nested headings remain part of their release section, while another release or an unrelated top-level appendix ends the section. Runtime metadata can support package identity but cannot establish new features.

## Limits and verification

Guidance uses the existing model request. It adds bounded prompt text (up to 1,800 characters normally or 800 in compact mode), with corresponding token cost, but no additional request or tool call. Existing delivery correction may still use its previously documented repair budget. There is no new executor, quality-scoring model, persistent store or authorization path.

The local tests inspect actual CLI requests and exercise source matching, context changes, modes and permissions with scripted providers. Their fixed replies do not measure prose or programming quality. The original short-prompt C01–C07 and W01–W05 blind suite must still be rerun with the same model tier before claiming better scores. Native installation/update and Windows GUI acceptance remain separate gates. See [current-task delivery](TASK-DELIVERY.en.md).
