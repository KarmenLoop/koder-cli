#!/usr/bin/env bash
# Public distribution bootstrap. Release implementation stays in release assets.
set -euo pipefail
KODER_CHANNEL='https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/updates/installers.txt'
KODER_TEMP="$(mktemp -d)"
trap 'rm -rf "${KODER_TEMP}"' EXIT
fetch() { curl -fsSL --connect-timeout 15 --max-time 60 --retry 2 -o "$2" "$1"; }
fetch "${KODER_CHANNEL}" "${KODER_TEMP}/channel"
KODER_RELEASE="$(awk '$1=="version" {print $2}' "${KODER_TEMP}/channel")"
KODER_SCRIPT_SHA="$(awk '$1=="sh" {print $2}' "${KODER_TEMP}/channel")"
KODER_PACKAGE_SHA="$(awk '$1=="package_sha256" {print $2}' "${KODER_TEMP}/channel")"
[[ "${KODER_RELEASE}" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]] || { echo 'Invalid Koder release version' >&2; exit 1; }
[[ "${KODER_SCRIPT_SHA}" =~ ^[a-f0-9]{64}$ && "${KODER_PACKAGE_SHA}" =~ ^[a-f0-9]{64}$ ]] || { echo 'Invalid Koder release checksums' >&2; exit 1; }
KODER_RELEASE_BASE="https://github.com/KarmenLoop/koder-cli/releases/download/cli-${KODER_RELEASE}"
fetch "${KODER_RELEASE_BASE}/koder-cli.sh" "${KODER_TEMP}/installer.sh"
if command -v shasum >/dev/null 2>&1; then KODER_ACTUAL_SHA="$(shasum -a 256 "${KODER_TEMP}/installer.sh" | awk '{print $1}')"
elif command -v sha256sum >/dev/null 2>&1; then KODER_ACTUAL_SHA="$(sha256sum "${KODER_TEMP}/installer.sh" | awk '{print $1}')"
else echo 'shasum or sha256sum is required' >&2; exit 1; fi
[[ "${KODER_ACTUAL_SHA}" = "${KODER_SCRIPT_SHA}" ]] || { echo 'Koder installer SHA-256 mismatch; not executed' >&2; exit 1; }
printf 'Installing Koder CLI %s from GitHub. Read the release EULA before accepting.\n' "${KODER_RELEASE}"
KODER_INSTALL_BASE="${KODER_RELEASE_BASE}" KODER_EXPECTED_VERSION="${KODER_RELEASE}" KODER_EXPECTED_PACKAGE_SHA256="${KODER_PACKAGE_SHA}" bash "${KODER_TEMP}/installer.sh" "$@"
