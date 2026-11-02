# Koder CLI 0.7.1

[English](RELEASE-0.7.1.md) · [简体中文](RELEASE-0.7.1.zh.md)

First-run sign-in no longer expires under the process supervisor's 15-second startup check. Once the account screen accepts input, authorization follows its own transaction deadline. Normal cancellation no longer produces a false `UPDATE_WORKER_FAILED`. Focus reports, navigation, mouse input and bracketed paste do not cancel sign-in; Escape and Ctrl+C still do.

Signing in from chat now opens the account flow directly. Exact requests such as `login`, `sign in`, `登录` and `打开网站登录` no longer become model tasks. `/login` keeps the browser/QR picker. Requests made during a task queue until it finishes. The line editor yields input while authorization is active and resumes afterward.

An existing KARMEN browser session can confirm device access without entering a password again, unless the account service requires reauthentication. The CLI opens the official authorization URL, polls the bound transaction and saves the session through the existing protected credential store. It then requests focus for the original terminal where the OS supports it. If focus is unavailable, the CLI reports that sign-in has finished and asks the user to return to the same window. No localhost callback, pasted token or browser-cookie access is added.

Sign-in failures identify the account stage, HTTP status and safe network or gateway metadata. A browser-launch failure preserves the same authorization link and keeps polling. Diagnostics do not include authorization state, URLs, passwords or tokens. Login and logout also refresh chat's account identity and execution binding.

This release includes the previously unpublished Skill/MCP repairs: bundled REA diagnostics and reverse-engineering routing, bounded application-result reading, Web Data collection with bundled Python/Scrapling, and current-user Skill/MCP audits. Existing tools, courses, platform resources and third-party notices are retained. Dependencies and unsupported upstream features remain documented in the [compatibility guide](MCP-SKILL-COMPATIBILITY.en.md).

Packages and updates are distributed through the [official CLI website](https://kodermodule.com/en/cli-download.html). Existing releases remain immutable. Native Windows/Ubuntu GUI, human sign-in, real mailbox delivery and notifications retain separate beta acceptance; isolated tests are not a claim of universal OS validation.

See the [sign-in walkthrough](ACCOUNT-LOGIN.md), [中文登录教程](ACCOUNT-LOGIN.zh.md) and the exact acceptance receipt shipped with the release.
