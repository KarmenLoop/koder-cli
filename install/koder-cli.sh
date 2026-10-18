#!/usr/bin/env bash
# Koder CLI installer (macOS / Linux / WSL):
#   curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash
#   curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash -s -- --with-hermes
# Installs into ~/.koder-cli without root. Uses Node.js >= 22 if present,
# otherwise downloads the official Node.js build into ~/.koder-cli/runtime.
set -euo pipefail

BASE="${KODER_INSTALL_BASE:-https://karmenloop.com/install}"
KODER_HOME="${KODER_CLI_HOME:-${HOME}/.koder-cli}"
BIN_DIR="${KODER_BIN_DIR:-${HOME}/.local/bin}"
NODE_DIST="${KODER_NODE_DIST:-https://nodejs.org/dist}"
# Official Node.js builds need glibc 2.28+; older glibc and musl use the
# project's unofficial builds, which publish SHASUMS256.txt the same way.
NODE_DIST_UNOFFICIAL="${KODER_NODE_DIST_UNOFFICIAL:-https://unofficial-builds.nodejs.org/download/release}"
NODE_VERSION="${KODER_NODE_VERSION:-22.12.0}"
VERSION=""
ONBOARD=1
WITH_HERMES=0
MODIFY_PATH=1
FORCE_NODE=0

case "${LANG:-}${LC_ALL:-}" in *zh*|*ZH*) ZH=1 ;; *) ZH=0 ;; esac
say() { if [ "${ZH}" = 1 ]; then printf '%s\n' "$1"; else printf '%s\n' "$2"; fi; }
fail() { if [ "${ZH}" = 1 ]; then printf 'Koder CLI 安装失败：%s\n' "$1" >&2; else printf 'Koder CLI install failed: %s\n' "$2" >&2; fi; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --version) VERSION="${2:-}"; shift 2 ;;
    --base) BASE="${2:-}"; shift 2 ;;
    --with-hermes) WITH_HERMES=1; shift ;;
    --no-onboard) ONBOARD=0; shift ;;
    --no-modify-path) MODIFY_PATH=0; shift ;;
    --force-node) FORCE_NODE=1; shift ;;
    -h|--help)
      printf 'Usage: koder-cli.sh [--version X] [--with-hermes] [--no-onboard] [--no-modify-path] [--base URL]\n'
      exit 0 ;;
    *) fail "不认识的参数 $1" "unknown option $1" ;;
  esac
done
BASE="${BASE%/}"

fetch() {
  if command -v curl >/dev/null 2>&1; then curl -fsSL --retry 3 -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then wget -q -O "$2" "$1"
  else fail "需要 curl 或 wget" "curl or wget is required"; fi
}

sha256() {
  if command -v shasum >/dev/null 2>&1; then shasum -a 256 "$1" | awk '{print $1}'
  elif command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{print $1}'
  elif [ -n "${NODE_BIN}" ]; then "${NODE_BIN}" -e 'process.stdout.write(require("crypto").createHash("sha256").update(require("fs").readFileSync(process.argv[1])).digest("hex"))' "$1"
  else fail "需要 shasum 或 sha256sum 来校验下载" "shasum or sha256sum is required to verify downloads"; fi
}

command -v tar >/dev/null 2>&1 || fail "需要 tar" "tar is required"

case "$(uname -s)" in
  Darwin) OS=darwin ;;
  Linux) OS=linux ;;
  *) fail "这个脚本用于 Mac、Ubuntu 和其他 Linux。Windows 10 和 Windows 11 请用 PowerShell 或命令提示符里的那一行。Windows XP 不能运行。" "This script is for Mac, Ubuntu, and other Linux. On Windows 10 and Windows 11, use the PowerShell or Command Prompt line. Windows XP cannot run it." ;;
esac
case "$(uname -m)" in
  x86_64|amd64) ARCH=x64 ;;
  arm64|aarch64) ARCH=arm64 ;;
  armv7l|armv7*) ARCH=armv7l ;;
  *) fail "不支持的处理器架构 $(uname -m)" "unsupported architecture $(uname -m)" ;;
esac

if [ "${OS}" = darwin ]; then
  MAC_MAJOR="$(sw_vers -productVersion 2>/dev/null | cut -d. -f1)"
  if [ -n "${MAC_MAJOR}" ] && [ "${MAC_MAJOR}" -lt 11 ] 2>/dev/null; then
    fail "需要 macOS 11 或更新的版本（Node.js 22 的最低要求）。" "macOS 11 or later is required (the Node.js 22 minimum)."
  fi
fi

# "glibc" (official build), "glibc-217" (old glibc) or "musl".
LIBC=glibc
if [ "${OS}" = linux ]; then
  if ldd --version 2>&1 | grep -qi musl || [ -e /lib/ld-musl-x86_64.so.1 ] || [ -e /lib/ld-musl-aarch64.so.1 ]; then
    LIBC=musl
  else
    GLIBC="$(ldd --version 2>/dev/null | head -n 1 | grep -oE '[0-9]+\.[0-9]+$' || true)"
    if [ -n "${GLIBC}" ]; then
      GLIBC_MAJOR="${GLIBC%%.*}"
      GLIBC_MINOR="${GLIBC#*.}"
      if [ "${GLIBC_MAJOR}" -lt 2 ] || { [ "${GLIBC_MAJOR}" -eq 2 ] && [ "${GLIBC_MINOR}" -lt 28 ]; }; then
        LIBC=glibc-217
      fi
    fi
  fi
  if [ "${LIBC}" != glibc ] && [ "${ARCH}" != x64 ]; then
    fail "这台机器的系统库（${LIBC}）没有对应 ${ARCH} 的 Node.js 22，请先自行安装 Node.js 22 再运行本脚本。" "No Node.js 22 build for ${LIBC} on ${ARCH}; install Node.js 22 yourself, then rerun."
  fi
fi

TMP="$(mktemp -d)"
trap 'status=$?; rm -rf "${TMP}"; exit $status' EXIT
mkdir -p "${KODER_HOME}" "${BIN_DIR}"

NODE_BIN=""
if [ "${FORCE_NODE}" = 0 ] && command -v node >/dev/null 2>&1; then
  if node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' 2>/dev/null; then
    NODE_BIN="$(command -v node)"
  fi
fi
if [ -z "${NODE_BIN}" ]; then
  NODE_NAME="node-v${NODE_VERSION}-${OS}-${ARCH}"
  DIST="${NODE_DIST}"
  NODE_FILE="${NODE_NAME}.tar.gz"
  if [ "${LIBC}" != glibc ]; then
    NODE_NAME="${NODE_NAME}-${LIBC}"
    DIST="${NODE_DIST_UNOFFICIAL}"
    NODE_FILE="${NODE_NAME}.tar.gz"
    say "检测到系统库 ${LIBC}，改用 Node.js 官方非正式构建。" "Detected ${LIBC}; using the Node.js unofficial build."
  fi
  NODE_DIR="${KODER_HOME}/runtime/${NODE_NAME}"
  if [ ! -x "${NODE_DIR}/bin/node" ]; then
    say "正在下载 Node.js ${NODE_VERSION}……" "Downloading Node.js ${NODE_VERSION}…"
    fetch "${DIST}/v${NODE_VERSION}/${NODE_FILE}" "${TMP}/${NODE_FILE}"
    fetch "${DIST}/v${NODE_VERSION}/SHASUMS256.txt" "${TMP}/SHASUMS256.txt"
    EXPECTED="$(awk -v f="${NODE_FILE}" '$2 == f {print $1}' "${TMP}/SHASUMS256.txt")"
    [ -n "${EXPECTED}" ] || fail "Node.js 校验文件里没有 ${NODE_FILE}" "${NODE_FILE} missing from SHASUMS256.txt"
    [ "$(sha256 "${TMP}/${NODE_FILE}")" = "${EXPECTED}" ] || fail "Node.js 下载校验失败" "Node.js checksum mismatch"
    mkdir -p "${KODER_HOME}/runtime"
    tar -xzf "${TMP}/${NODE_FILE}" -C "${KODER_HOME}/runtime"
  fi
  NODE_BIN="${NODE_DIR}/bin/node"
  [ -x "${NODE_BIN}" ] || fail "Node.js 解压后找不到可执行文件" "node binary not found after extraction"
  "${NODE_BIN}" -e 0 >/dev/null 2>&1 || fail "下载的 Node.js 在这台机器上无法运行（系统库 ${LIBC}，架构 ${ARCH}）" "the downloaded Node.js does not run here (libc ${LIBC}, arch ${ARCH})"
fi

MANIFEST="koder-cli-latest.json"
[ -n "${VERSION}" ] && MANIFEST="koder-cli-${VERSION}.json"
fetch "${BASE}/${MANIFEST}" "${TMP}/manifest.json"
read -r VERSION FILE EXPECTED <<EOF
$("${NODE_BIN}" -e 'const m=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); if(!/^[0-9A-Za-z.+-]+$/.test(m.version)||!/^[\w.+-]+\.tgz$/.test(m.file)||!/^[0-9a-f]{64}$/.test(m.sha256)) process.exit(3); console.log(m.version, m.file, m.sha256)' "${TMP}/manifest.json")
EOF
[ -n "${EXPECTED:-}" ] || fail "安装清单无效" "invalid manifest"

say "正在下载 Koder CLI ${VERSION}……" "Downloading Koder CLI ${VERSION}…"
fetch "${BASE}/${FILE}" "${TMP}/${FILE}"
[ "$(sha256 "${TMP}/${FILE}")" = "${EXPECTED}" ] || fail "安装包校验失败（SHA-256 不一致），已停止" "package checksum mismatch; aborted"

TARGET="${KODER_HOME}/versions/${VERSION}"
rm -rf "${TARGET}.tmp"
mkdir -p "${TARGET}.tmp"
tar -xzf "${TMP}/${FILE}" -C "${TARGET}.tmp" --strip-components=1
[ -f "${TARGET}.tmp/bin/koder.mjs" ] || fail "安装包内容不完整" "package is incomplete"
rm -rf "${TARGET}"
mv "${TARGET}.tmp" "${TARGET}"
ln -sfn "${TARGET}" "${KODER_HOME}/current"

LAUNCHER="${BIN_DIR}/koder"
cat > "${LAUNCHER}" <<EOF
#!/bin/sh
exec "${NODE_BIN}" "${KODER_HOME}/current/bin/koder.mjs" "\$@"
EOF
chmod +x "${LAUNCHER}"

"${NODE_BIN}" -e 'const [file,version,base,launcher,node,site,updates,download]=process.argv.slice(1); require("fs").writeFileSync(file, JSON.stringify({version,base,launcher,node,site,updates,download,installedAt:new Date().toISOString()},null,2)+"\n")' \
  "${KODER_HOME}/install.json" "${VERSION}" "${BASE}" "${LAUNCHER}" "${NODE_BIN}" "https://karmenloop.com" "https://karmenloop.com/updates.html" "https://karmenloop.com/download.html"

case ":${PATH}:" in
  *":${BIN_DIR}:"*) ;;
  *)
    if [ "${MODIFY_PATH}" = 1 ]; then
      LINE="export PATH=\"${BIN_DIR}:\${PATH}\" # koder-cli"
      for RC in "${HOME}/.zshrc" "${HOME}/.bashrc"; do
        if [ -f "${RC}" ] || [ "$(basename "${SHELL:-}")" = "$(basename "${RC}" | sed 's/^\.//; s/rc$//')" ]; then
          grep -q '# koder-cli' "${RC}" 2>/dev/null || printf '\n%s\n' "${LINE}" >> "${RC}"
        fi
      done
      say "已把 ${BIN_DIR} 加入 PATH，新开一个终端即可直接输入 koder。" "Added ${BIN_DIR} to PATH; open a new terminal to run koder."
    else
      say "请把 ${BIN_DIR} 加入 PATH。" "Add ${BIN_DIR} to your PATH."
    fi ;;
esac

if [ "${WITH_HERMES}" = 1 ]; then
  "${LAUNCHER}" engine install hermes || say "Hermes 引擎没装好，之后可运行 koder engine install hermes 重试。" "Hermes engine install failed; retry with koder engine install hermes."
fi

say "Koder CLI ${VERSION} 安装完成：${LAUNCHER}" "Koder CLI ${VERSION} installed: ${LAUNCHER}"
say "官网和更新说明：https://karmenloop.com/updates.html （软件里也可运行 koder version 或 koder about）" "Official site and updates: https://karmenloop.com/updates.html (or run koder version / koder about)"
if [ "${ONBOARD}" = 1 ] && [ -r /dev/tty ] && [ -w /dev/tty ] && (: < /dev/tty) 2>/dev/null; then
  "${LAUNCHER}" onboard < /dev/tty > /dev/tty 2>&1 || true
else
  say "运行 koder setup 完成设置（方向键或鼠标就能选），或直接输入 koder 开始。" "Run koder setup to finish (arrow keys or mouse), or just type koder."
fi
