# Koder CLI 0.5.14

Interactive login requests now reach hidden input instead of being unconditionally cancelled. Task-scoped private handles can bind mail and GitHub accounts, update a named model key, or fill observed Ubuntu login controls. Credentials are excluded from model messages and ordinary conversation logs. Each use requires confirmation of its actual destination.

Ubuntu system authorization uses native sudo on the connected terminal. Koder does not retain the sudo password. Foreground and agentd sessions share cancellation, expiry and one-use handling. Missing storage, declined input and unknown operation results no longer produce fabricated success receipts.

The existing runtime, learning, plugins, installation progress and tutorials are retained. The public repository's identity and history are unchanged; the private kernel remains distributed through release packages. No website deployment is part of this release.

See [credential setup and login](CREDENTIALS.md), [Ubuntu 24.04](UBUNTU.md) and [Ubuntu 26.04.1](UBUNTU-26.04.md).

Acceptance results are attached separately to the release. Synthetic binding and isolated GUI checks do not certify customer credentials or physical desktop login. Private GUI filling is implemented for the Ubuntu AT-SPI driver; other drivers report unavailable. OAuth-only providers still require their own supported authorization flow.
