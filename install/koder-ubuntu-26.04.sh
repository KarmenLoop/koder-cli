#!/usr/bin/env bash
# Ubuntu 26.04 / 26.04.x installer. All supported runtime features included.
# Generated from koder-cli.sh; the shared installer selects the Linux package.
# Koder CLI installer (macOS / Linux / WSL):
#   curl -fsSL https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/koder-cli.sh | bash
#   curl -fsSL https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/koder-cli.sh | bash -s -- --with-hermes
# A controlling terminal asks for accept. Unattended use after reading the license:
#   curl -fsSL .../koder-cli.sh | KODER_EULA_ACCEPT=1 bash
# Versioned release path. Keep the installer and manifest pinned to the same release.
# Current install commands are on https://karmenloop.com.
# Installs into ~/.koder-cli without root. Uses Node.js >= 22 if present,
# otherwise downloads the official Node.js build into ~/.koder-cli/runtime.
set -euo pipefail

BASE="${KODER_INSTALL_BASE:-https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14}"
KODER_HOME="${KODER_CLI_HOME:-${HOME}/.koder-cli}"
BIN_DIR="${KODER_BIN_DIR:-${HOME}/.local/bin}"
NODE_DIST="${KODER_NODE_DIST:-https://nodejs.org/dist}"
# Official Node.js builds need glibc 2.28+; older glibc and musl use the
# project's unofficial builds, which publish SHASUMS256.txt the same way.
NODE_DIST_UNOFFICIAL="${KODER_NODE_DIST_UNOFFICIAL:-https://unofficial-builds.nodejs.org/download/release}"
NODE_VERSION="${KODER_NODE_VERSION:-22.23.3}"
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

consent_stop() {
  printf '%s\n' "$1" >&2
  printf '%s\n' "$2" >&2
  exit 1
}

CONSENT_TEXT="$(cat <<EOF
Koder CLI ${BASE}
官方团队 / Official team: KARMENLOOP 官方团队 / KARMENLOOP Official Team
Koder：个人非商业本地使用免费，自接模型 API；把想法交给任务，把权限留在你手里。
Koder: free personal, noncommercial local use, your own model API, and permissions you control.
KARMEN LOOP 本地任务内核：计划、权限核对、工具执行与结果记录，让工作稳稳往前走。
The local KARMEN LOOP task kernel connects plans, permission checks, tools, and saved results.
个人许可不包含二次开发、修改自有实现代码或商用。商用与组织部署须单独书面授权。第三方和旧版本原许可不变。
No secondary development, proprietary code changes or commercial use under the personal license. Commercial use and organizational deployment require separate written authorization. Third-party and earlier licenses remain intact.
公司授权服务＋专用私有仓库：info@karmenloop.com；安装后运行 koder business 查看洽询说明。
Company licensing + dedicated private repositories: info@karmenloop.com. Run koder business for inquiry details.
喜欢 Koder？欢迎自愿点 Star：https://github.com/KarmenLoop/koder-cli；可直接跳过，不影响使用。
Find Koder useful? An optional star helps: https://github.com/KarmenLoop/koder-cli. Skip freely; it never affects access.
隐私全文 / Full privacy notices: https://karmenloop.com/cli.html#cli-privacy
安装后离线查看 / Read offline after install: koder privacy consumer / koder privacy statement
所在地 / Location: 中国上海 / Shanghai, China
官网 / Website: https://karmenloop.com
邮箱 / Email: info@karmenloop.com
使用许可 / License: ${BASE}/EULA.md
授权说明 / Consent guide: ${BASE}/ACCEPTANCE.md
版权与国际用户说明 / Copyright and international-use notice: ${BASE}/LEGAL-NOTICE.md
安装后查看全文 / Read the installed text: koder eula
个人非商业本地使用免费。接受只表示同意 Koder-EULA-1.1，不会开启喜好学习、同步、应用、电脑或发消息权限。
Personal, noncommercial local use is free. Acceptance agrees to Koder-EULA-1.1 only. It does not enable preference learning, sync, apps, computer access, or messaging.
输入 accept 并回车：同意并继续。输入 decline、直接回车，或按 Ctrl+C：取消。取消后不会下载程序、创建安装目录、修改 PATH 或写入接受记录。
Type accept and press Enter to agree and continue. Type decline, press Enter with no text, or press Ctrl+C to cancel. Cancellation does not download the program, create an install directory, change PATH, or write an acceptance record.
只有已经阅读并同意的人，才可在自动部署中显式设置 KODER_EULA_ACCEPT=1。其他值、--yes 或任意文字都不是同意。
Only a person who has read and agreed may set KODER_EULA_ACCEPT=1 for unattended deployment. Any other value, --yes, or other text is not acceptance.
无交互终端时 / Without a controlling terminal:
  curl -fsSL ${BASE}/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
  PowerShell: \$env:KODER_EULA_ACCEPT = '1'; irm ${BASE}/koder-cli.ps1 | iex
  CMD: set "KODER_EULA_ACCEPT=1" & powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${BASE}/koder-cli.ps1 | iex"
EOF
)"

if [ "${KODER_EULA_ACCEPT:-}" = "1" ]; then
  :
elif [ -n "${KODER_EULA_ACCEPT+x}" ]; then
  consent_stop "已取消：KODER_EULA_ACCEPT 只有精确值 1 表示已经阅读并同意。没有下载或安装。" "Cancelled: only KODER_EULA_ACCEPT=1 means the terms were read and accepted. Nothing was downloaded or installed."
elif { : </dev/tty; } >/dev/null 2>&1; then
  printf '%s\n' "${CONSENT_TEXT}" >/dev/tty
  printf 'accept / decline: ' >/dev/tty
  if ! IFS= read -r KODER_EULA_ANSWER </dev/tty; then
    consent_stop "已取消：控制终端已结束，没有下载或安装。这不是网络失败。" "Cancelled: the controlling terminal closed. Nothing was downloaded or installed. This is not a network failure."
  fi
  KODER_EULA_ANSWER="${KODER_EULA_ANSWER%$'\r'}"
  case "${KODER_EULA_ANSWER}" in
    accept) ;;
    decline|"")
      consent_stop "已取消：未同意，没有下载或安装。这不是网络失败。" "Cancelled: not accepted. Nothing was downloaded or installed. This is not a network failure."
      ;;
    *)
      consent_stop "已拒绝：只有输入 accept 才会继续。没有下载或安装。这不是网络失败。" "Rejected: only the word accept continues. Nothing was downloaded or installed. This is not a network failure."
      ;;
  esac
else
  printf '%s\n' "${CONSENT_TEXT}" >&2
  consent_stop "已取消：没有可交互的控制终端，不能把安装脚本的管道当作同意。没有下载或安装。这不是网络失败。" "Cancelled: no controlling terminal is available, and the installer pipe is not an answer. Nothing was downloaded or installed. This is not a network failure."
fi

DOWNLOAD_TIMEOUT="${KODER_DOWNLOAD_TIMEOUT_SECONDS:-100000000}"
case "$DOWNLOAD_TIMEOUT" in ''|*[!0-9]*) fail "下载超时必须是 1–100000000 秒。" "Download timeout must be 1..100000000 seconds.";; esac
if [ "${#DOWNLOAD_TIMEOUT}" -gt 9 ] || [ "$DOWNLOAD_TIMEOUT" -lt 1 ] || [ "$DOWNLOAD_TIMEOUT" -gt 100000000 ]; then
  fail "下载超时必须是 1–100000000 秒。" "Download timeout must be 1..100000000 seconds."
fi
DOWNLOAD_RETRIES="${KODER_DOWNLOAD_RETRIES:-5}"
DOWNLOAD_CONNECT_TIMEOUT="${KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS:-20}"
DOWNLOAD_STALL_TIMEOUT="${KODER_DOWNLOAD_STALL_TIMEOUT_SECONDS:-60}"
for value in "$DOWNLOAD_RETRIES" "$DOWNLOAD_CONNECT_TIMEOUT" "$DOWNLOAD_STALL_TIMEOUT"; do
  case "$value" in ''|*[!0-9]*) fail "下载参数必须是整数。" "Download settings must be integers.";; esac
  [ "${#value}" -le 4 ] || fail "下载参数过大。" "Download setting is too large."
done
[ "$DOWNLOAD_RETRIES" -le 20 ] && [ "$DOWNLOAD_CONNECT_TIMEOUT" -ge 1 ] && [ "$DOWNLOAD_CONNECT_TIMEOUT" -le 600 ] && [ "$DOWNLOAD_STALL_TIMEOUT" -ge 1 ] && [ "$DOWNLOAD_STALL_TIMEOUT" -le 3600 ] || fail "下载重试或等待参数超出范围。" "Download retry or wait setting is out of range."
DOWNLOAD_PID=""
DOWNLOAD_PART=""
DOWNLOAD_CACHE=""
save_partial() {
  # Writers use private temporary files. Concurrent installs never append to
  # each other's partial file; the completed cache is always hash-checked.
  if [ -n "$DOWNLOAD_CACHE" ] && [ -s "$DOWNLOAD_PART" ]; then
    local pending
    pending=$(mktemp "${KODER_HOME}/cache/downloads/.partial.XXXXXX") || return
    if cp "$DOWNLOAD_PART" "$pending"; then mv -f "$pending" "${DOWNLOAD_CACHE}.partial"; else rm -f "$pending"; fi
  fi
}
stop_download() {
  if [ -n "$DOWNLOAD_PID" ]; then kill "$DOWNLOAD_PID" 2>/dev/null || true; wait "$DOWNLOAD_PID" 2>/dev/null || true; DOWNLOAD_PID=""; fi
  save_partial
}
download_progress() {
  local bytes elapsed transferred
  bytes=0; [ ! -f "$dest" ] || bytes=$(wc -c < "$dest" | tr -d ' ')
  elapsed=$(($(date +%s)-started)); transferred=$((bytes-initial_bytes))
  [ "$transferred" -ge 0 ] || transferred=0
  LC_ALL=C awk -v bytes="$bytes" -v total="$size" -v elapsed="$elapsed" -v transferred="$transferred" -v attempt="$((attempt+1))" -v attempts="$((DOWNLOAD_RETRIES+1))" -v zh="$ZH" 'BEGIN {
    rate=elapsed>0 ? transferred/elapsed/1000000 : 0;
    if(total>0) {
      pct=int(bytes*100/total); if(pct>100)pct=100;
      if(zh==1)printf "下载进度：%.1f MB / %.1f MB (%d%%)；已用 %d 秒；平均 %.1f MB/s；尝试 %d/%d。Ctrl+C 可取消并保留断点。\n",bytes/1000000,total/1000000,pct,elapsed,rate,attempt,attempts;
      else printf "Downloading: %.1f MB / %.1f MB (%d%%); elapsed %ds; average %.1f MB/s; attempt %d/%d. Ctrl+C cancels and retains the checkpoint.\n",bytes/1000000,total/1000000,pct,elapsed,rate,attempt,attempts;
    } else {
      if(zh==1)printf "下载进度：%.1f MB（总大小未知）；已用 %d 秒；平均 %.1f MB/s；尝试 %d/%d。\n",bytes/1000000,elapsed,rate,attempt,attempts;
      else printf "Downloading: %.1f MB (total unknown); elapsed %ds; average %.1f MB/s; attempt %d/%d.\n",bytes/1000000,elapsed,rate,attempt,attempts;
    }
  }' >&2
}
fetch() {
  local started next now status attempt delay url dest expected size cache resumed bad_hash initial_bytes
  url="$1"; dest="$2"; expected="${3:-}"; size="${4:-0}"
  if [ -n "$expected" ]; then
    case "$expected" in *[!0123456789abcdef]*) fail "下载校验值无效。" "Invalid download checksum.";; esac
    [ "${#expected}" -eq 64 ] || fail "下载校验值无效。" "Invalid download checksum."
  fi
  case "$size" in ''|*[!0-9]*) fail "下载大小无效。" "Invalid download size.";; esac
  [ "${#size}" -le 9 ] && [ "$size" -le 536870912 ] || fail "下载大小无效。" "Invalid download size."
  cache=""; DOWNLOAD_CACHE=""; DOWNLOAD_PART="$dest"
  if [ -n "$expected" ]; then
    mkdir -p "${KODER_HOME}/cache/downloads"
    cache="${KODER_HOME}/cache/downloads/${expected}"
    if [ -f "$cache" ] && [ "$(sha256 "$cache")" = "$expected" ]; then
      say "复用已校验下载，无需重新传输。" "Using the verified download cache; no transfer needed." >&2
      cp "$cache" "$dest"; DOWNLOAD_PART=""; return 0
    fi
    if [ -f "${cache}.partial" ]; then cp "${cache}.partial" "$dest"; fi
    DOWNLOAD_CACHE="$cache"
  fi
  started=$(date +%s); next=5; attempt=0; bad_hash=0
  initial_bytes=0; [ ! -f "$dest" ] || initial_bytes=$(wc -c < "$dest" | tr -d ' ')
  download_progress
  while [ "$attempt" -le "$DOWNLOAD_RETRIES" ]; do
    resumed=0; [ ! -s "$dest" ] || resumed=1
    if command -v curl >/dev/null 2>&1; then
      if [ -n "$expected" ]; then
        curl -fsSL --connect-timeout "$DOWNLOAD_CONNECT_TIMEOUT" --max-time 0 --speed-time "$DOWNLOAD_STALL_TIMEOUT" --speed-limit 1 -C - -o "$dest" "$url" &
      else
        curl -fsSL --connect-timeout "$DOWNLOAD_CONNECT_TIMEOUT" --max-time 0 --speed-time "$DOWNLOAD_STALL_TIMEOUT" --speed-limit 1 -o "$dest" "$url" &
      fi
    elif command -v wget >/dev/null 2>&1; then
      if [ -n "$expected" ]; then wget -q -c --timeout="$DOWNLOAD_STALL_TIMEOUT" --tries=1 -O "$dest" "$url" &
      else wget -q --timeout="$DOWNLOAD_STALL_TIMEOUT" --tries=1 -O "$dest" "$url" &
      fi
    else fail "需要 curl 或 wget" "curl or wget is required"; fi
    DOWNLOAD_PID=$!
    while kill -0 "$DOWNLOAD_PID" 2>/dev/null; do
      now=$(date +%s)
      if [ "$((now-started))" -ge "$DOWNLOAD_TIMEOUT" ]; then
        stop_download
        fail "下载超时，断点已保留；重新运行安装命令可继续。" "Download timed out; the checkpoint is saved. Rerun the installer to continue."
      fi
      if [ "$size" -gt 0 ] && [ -f "$dest" ] && [ "$(wc -c < "$dest" | tr -d ' ')" -gt "$size" ]; then
        stop_download; rm -f "$dest" "${cache}.partial"; DOWNLOAD_PART=""; DOWNLOAD_CACHE=""
        fail "下载超过清单大小，已停止。" "Download exceeds its declared size; aborted."
      fi
      if [ "$((now-started))" -ge "$next" ]; then
        download_progress
        next=$((next+5))
      fi
      sleep 0.2
    done
    status=0; wait "$DOWNLOAD_PID" || status=$?; DOWNLOAD_PID=""
    download_progress
    if [ -n "$expected" ] && [ -f "$dest" ]; then say "正在校验下载内容（SHA-256）……" "Verifying download (SHA-256)…" >&2; fi
    # A complete partial can receive HTTP 416. Its checksum, not HTTP status,
    # proves completion. No unverified file is ever extracted or activated.
    if [ -n "$expected" ] && [ -f "$dest" ] && [ "$(sha256 "$dest")" = "$expected" ]; then
      local complete
      complete=$(mktemp "${KODER_HOME}/cache/downloads/.complete.XXXXXX")
      cp "$dest" "$complete"; mv -f "$complete" "$cache"; rm -f "${cache}.partial"
      DOWNLOAD_CACHE=""; DOWNLOAD_PART=""; return 0
    fi
    if [ "$status" -eq 0 ]; then
      if [ -z "$expected" ]; then DOWNLOAD_PART=""; return 0; fi
      bad_hash=$((bad_hash+1)); rm -f "$dest" "${cache}.partial"
      [ "$bad_hash" -lt 2 ] || { DOWNLOAD_CACHE=""; DOWNLOAD_PART=""; fail "下载校验失败，未安装。" "Download checksum mismatch; not installed."; }
    elif [ "$resumed" -eq 1 ] && { [ "$status" -eq 33 ] || [ "$status" -eq 22 ]; }; then
      # The server refused Range (or rejected a completed/stale range).
      # Restart this file once per attempt instead of appending a 200 response.
      rm -f "$dest" "${cache}.partial"
    fi
    save_partial
    attempt=$((attempt+1))
    [ "$attempt" -le "$DOWNLOAD_RETRIES" ] || break
    delay=$attempt; [ "$delay" -le 5 ] || delay=5
    printf 'Download interrupted (exit %s). Retrying in %ss; saved partial bytes are reused when supported.\n' "$status" "$delay" >&2
    sleep "$delay"
    [ "$(($(date +%s)-started))" -lt "$DOWNLOAD_TIMEOUT" ] || break
  done
  fail "下载未完成，断点已保留；重新运行同一安装命令可继续。" "Download incomplete; the checkpoint is saved. Rerun the same installer to continue."
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
trap 'status=$?; stop_download; rm -rf "${TMP}"; exit $status' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
mkdir -p "${KODER_HOME}" "${BIN_DIR}"

NODE_BIN=""
say "正在检查 Node.js 运行环境……" "Checking the Node.js runtime…"
if [ "${FORCE_NODE}" = 0 ] && command -v node >/dev/null 2>&1; then
  if node -e 'try{const [a,b]=process.versions.node.split(".").map(Number);if((a===22&&b>=21||a>=24)&&process.allowedNodeEnvironmentFlags.has("--use-env-proxy")){require("node:sqlite");process.stdout.write(process.versions.node)}else process.exit(1)}catch{process.exit(1)}' 2>/dev/null; then
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
    fetch "${DIST}/v${NODE_VERSION}/SHASUMS256.txt" "${TMP}/SHASUMS256.txt"
    EXPECTED="$(awk -v f="${NODE_FILE}" '$2 == f {print $1}' "${TMP}/SHASUMS256.txt")"
    [ -n "${EXPECTED}" ] || fail "Node.js 校验文件里没有 ${NODE_FILE}" "${NODE_FILE} missing from SHASUMS256.txt"
    fetch "${DIST}/v${NODE_VERSION}/${NODE_FILE}" "${TMP}/${NODE_FILE}" "${EXPECTED}"
    [ "$(sha256 "${TMP}/${NODE_FILE}")" = "${EXPECTED}" ] || fail "Node.js 下载校验失败" "Node.js checksum mismatch"
    say "正在解压 Node.js……" "Extracting Node.js…"
    mkdir -p "${KODER_HOME}/runtime"
    tar -xzf "${TMP}/${NODE_FILE}" -C "${KODER_HOME}/runtime"
  fi
  NODE_BIN="${NODE_DIR}/bin/node"
  [ -x "${NODE_BIN}" ] || fail "Node.js 解压后找不到可执行文件" "node binary not found after extraction"
  "${NODE_BIN}" -e 'try{const [a,b]=process.versions.node.split(".").map(Number);if((a===22&&b>=21||a>=24)&&process.allowedNodeEnvironmentFlags.has("--use-env-proxy")){require("node:sqlite");process.stdout.write(process.versions.node)}else process.exit(1)}catch{process.exit(1)}' >/dev/null 2>&1 || fail "下载的 Node.js 在这台机器上无法运行（系统库 ${LIBC}，架构 ${ARCH}）" "the downloaded Node.js does not run here (libc ${LIBC}, arch ${ARCH})"
fi

MANIFEST="koder-cli-latest.json"
[ -n "${VERSION}" ] && MANIFEST="koder-cli-${VERSION}.json"
fetch "${BASE}/${MANIFEST}" "${TMP}/manifest.json"
[ -z "${KODER_EXPECTED_MANIFEST_SHA256:-}" ] || [ "$(sha256 "${TMP}/manifest.json")" = "${KODER_EXPECTED_MANIFEST_SHA256}" ] || fail "更新清单已变化，已停止。" "Release manifest changed after update check; aborted."
read -r VERSION FILE EXPECTED AGREEMENT_SHA FULL_SHA PACKAGE_SIZE <<EOF
$("${NODE_BIN}" -e 'const m=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); const platform=process.argv[2]; const full=process.argv[3]==="1"; if(!/^[0-9A-Za-z.+-]+$/.test(m.version)||m.file!==`koder-cli-${m.version}.tgz`||!/^[0-9a-f]{64}$/.test(m.sha256)||m.agreement?.id!=="Koder-EULA-1.1"||m.agreement?.version!=="1.1"||!/^[0-9a-f]{64}$/.test(m.agreement?.sha256)) process.exit(3); if(m.packages!==undefined){if(!m.packages||typeof m.packages!=="object"||Array.isArray(m.packages))process.exit(3);for(const [os,p]of Object.entries(m.packages))if(!["darwin","linux"].includes(os)||!p||p.file!==`koder-cli-${m.version}-${os}.tgz`||!/^[0-9a-f]{64}$/.test(p.sha256)||!Number.isSafeInteger(p.size)||p.size<1||p.size>536870912)process.exit(3);} const p=!full&&m.packages?.[platform]||m; console.log(m.version,p.file,p.sha256,m.agreement.sha256,m.sha256,p.size||0)' "${TMP}/manifest.json" "$OS" "${KODER_INSTALL_FULL_PACKAGE:-0}")
EOF
[ -n "${EXPECTED:-}" ] || fail "安装清单无效" "invalid manifest"
[ -z "${KODER_EXPECTED_VERSION:-}" ] || [ "${KODER_EXPECTED_VERSION}" = "${VERSION}" ] || fail "更新版本与已检查的版本不同，已停止" "release version changed after update check; aborted"
# Older clients pin the complete archive. Keep that pin while selecting the
# platform archive from the same versioned manifest. New clients pin all bytes.
[ -z "${KODER_EXPECTED_PACKAGE_SHA256:-}" ] || [ "${KODER_EXPECTED_PACKAGE_SHA256}" = "${FULL_SHA}" ] || fail "更新清单 SHA-256 与已检查的值不同，已停止" "release SHA-256 changed after update check; aborted"

say "正在下载 Koder CLI ${VERSION}……" "Downloading Koder CLI ${VERSION}…"
say "安装包：${FILE}（${PACKAGE_SIZE} 字节），支持断点续传。" "Package: ${FILE} (${PACKAGE_SIZE} bytes), with resumable download."
fetch "${BASE}/${FILE}" "${TMP}/${FILE}" "${EXPECTED}" "${PACKAGE_SIZE}"
[ "$(sha256 "${TMP}/${FILE}")" = "${EXPECTED}" ] || fail "安装包校验失败（SHA-256 不一致），已停止" "package checksum mismatch; aborted"

TARGET="${KODER_HOME}/versions/${VERSION}"
say "正在解压 Koder CLI ${VERSION}……" "Extracting Koder CLI ${VERSION}…"
rm -rf "${TARGET}.tmp"
mkdir -p "${TARGET}.tmp"
tar -xzf "${TMP}/${FILE}" -C "${TARGET}.tmp" --strip-components=1
[ -f "${TARGET}.tmp/bin/koder.mjs" ] || fail "安装包内容不完整" "package is incomplete"
[ -f "${TARGET}.tmp/EULA.md" ] && [ "$(sha256 "${TARGET}.tmp/EULA.md")" = "${AGREEMENT_SHA}" ] || fail "安装包许可与发行清单不一致，未激活此版本" "package agreement differs from the release manifest; this version was not activated"
say "正在启用 Koder CLI ${VERSION} 并保存安装信息……" "Activating Koder CLI ${VERSION} and recording the installation…"
rm -rf "${TARGET}"
mv "${TARGET}.tmp" "${TARGET}"
ln -sfn "${TARGET}" "${KODER_HOME}/current"

LAUNCHER="${BIN_DIR}/koder"
cat > "${LAUNCHER}" <<EOF
#!/bin/sh
exec "${NODE_BIN}" "${KODER_HOME}/current/bin/koder.mjs" "\$@"
EOF
chmod +x "${LAUNCHER}"

"${NODE_BIN}" -e 'const fs=require("fs"),crypto=require("crypto"),path=require("path"); const [home,file,version,base,launcher,node,site,updates,download]=process.argv.slice(1); const eula=fs.readFileSync(path.join(home,"current","EULA.md")); const sha=crypto.createHash("sha256").update(eula).digest("hex"); const acceptedAt=new Date().toISOString(); const preview=version.includes("-"); fs.mkdirSync(home,{recursive:true}); fs.writeFileSync(path.join(home,"eula-acceptance.json"), JSON.stringify({id:"Koder-EULA-1.1",version:"1.1",sha256:sha,acceptedAt,preview},null,2)+"\n",{mode:0o600}); fs.writeFileSync(file, JSON.stringify({version,base,launcher,node,site,updates,download,installedAt:acceptedAt,preview,agreementId:"Koder-EULA-1.1",agreementVersion:"1.1",agreementSha256:sha},null,2)+"\n")' \
  "${KODER_HOME}" "${KODER_HOME}/install.json" "${VERSION}" "${BASE}" "${LAUNCHER}" "${NODE_BIN}" "https://karmenloop.com" "https://karmenloop.com/updates.html" "https://karmenloop.com/download.html"

# Quote paths for the shell that will read them, including spaces and apostrophes.
quote_path() {
  "${NODE_BIN}" -e 'const q=String.fromCharCode(39);process.stdout.write(q+process.argv[1].split(q).join(String.fromCharCode(39,92,39,39))+q)' "$1"
}
BIN_QUOTED="$(quote_path "${BIN_DIR}")"
LAUNCHER_QUOTED="$(quote_path "${LAUNCHER}")"
if [ "${MODIFY_PATH}" = 1 ]; then
  LINE="export PATH=${BIN_QUOTED}:\${PATH} # koder-cli"
  # Ubuntu login shells may read .profile while ordinary terminal tabs read
  # .bashrc. Existing .bash_profile/.bash_login override .profile in Bash.
  for RC in "${HOME}/.profile" "${HOME}/.bashrc" "${HOME}/.bash_profile" "${HOME}/.bash_login" "${HOME}/.zprofile" "${HOME}/.zshrc"; do
    WRITE_RC=0
    case "${RC}" in "${HOME}/.profile"|"${HOME}/.bashrc") WRITE_RC=1 ;; esac
    [ ! -f "${RC}" ] || WRITE_RC=1
    if [ "$(basename "${SHELL:-}")" = zsh ]; then
      case "${RC}" in "${HOME}/.zprofile"|"${HOME}/.zshrc") WRITE_RC=1 ;; esac
    fi
    if [ "${WRITE_RC}" = 1 ]; then
      grep -Fqx "${LINE}" "${RC}" 2>/dev/null || printf '\n%s\n' "${LINE}" >> "${RC}"
    fi
  done
  say "已写入终端启动配置；当前终端的 PATH 不会被安装子进程修改。下方完整路径现在即可使用。" "Shell startup files updated; the current terminal PATH is not changed by the installer. Use the full path below now."
else
  say "已按要求保留终端配置；下方完整路径不依赖 PATH。" "Shell files were left unchanged; the full launcher path below does not depend on PATH."
fi

if [ "${WITH_HERMES}" = 1 ]; then
  "${LAUNCHER}" engine install hermes || say "Hermes 引擎没装好，之后可运行 koder engine install hermes 重试。" "Hermes engine install failed; retry with koder engine install hermes."
fi

say "Koder CLI ${VERSION} 安装完成：${LAUNCHER}" "Koder CLI ${VERSION} installed: ${LAUNCHER}"
say "交互对话会在空闲时自动更新并恢复会话。关闭：koder update auto off。" "Interactive chats update while idle and resume the conversation. Disable with: koder update auto off."
say "KARMEN LOOP：本地任务内核，计划、核对权限、执行与记录。个人非商业使用免费；商用／公司授权＋私有仓库：info@karmenloop.com。" "KARMEN LOOP: the local task kernel for plans, permissions, execution and results. Personal, noncommercial use is free; company licensing + private repositories: info@karmenloop.com."
say "欢迎自愿点 Star：https://github.com/KarmenLoop/koder-cli；直接跳过，不影响使用。" "An optional star helps others find Koder: https://github.com/KarmenLoop/koder-cli. Skip freely; it never affects access."
say "官网和更新说明：https://karmenloop.com/updates.html （软件里也可运行 koder version 或 koder about）" "Official site and updates: https://karmenloop.com/updates.html (or run koder version / koder about)"
if [ "${ONBOARD}" = 1 ] && [ -r /dev/tty ] && [ -w /dev/tty ] && (: < /dev/tty) 2>/dev/null; then
  "${LAUNCHER}" onboard < /dev/tty > /dev/tty 2>&1 || true
else
  say "运行 koder setup 完成设置（方向键或鼠标就能选），或直接输入 koder 开始。" "Run koder setup to finish (arrow keys or mouse), or just type koder."
fi

say "电脑能力：运行 koder permissions status 检查，运行 koder permissions request --home 正式授权主目录；网络、文件发送与桌面能力分别检查。" "Computer access: run koder permissions status, then koder permissions request --home to grant home access; network, attachments and desktop are checked separately."
say "安装不会自动取得系统权限。macOS 辅助功能/录屏/完整磁盘访问，或 Windows 限定管理员动作须由系统确认；实际宿主变化后需重新检查。" "Installation does not automatically grant OS permissions. Approve macOS Accessibility/Screen Recording/Full Disk Access or a specific Windows administrator action in the OS; recheck after the responsible host changes."

# Residency is a separate opt-in; EULA acceptance and --yes never imply it.
if [ "${KODER_ACTIVATE:-}" = 1 ]; then
  "${LAUNCHER}" activate || say "常驻未确认启动，请运行 koder agentd doctor。安装已完成。" "Residency was not confirmed. Run koder agentd doctor; installation is complete."
elif [ "${ONBOARD}" = 1 ] && [ -z "${KODER_EXPECTED_VERSION:-}" ] && [ -r /dev/tty ] && (: < /dev/tty) 2>/dev/null; then
  "${LAUNCHER}" agentd offer < /dev/tty > /dev/tty 2>&1 || true
else
  say "推荐运行 koder activate 开启用户级常驻；koder deactivate 关闭。不会代开电脑或邮箱权限。" "Run koder activate for residency; koder deactivate stops it. Computer and mailbox permissions remain separate."
fi

# Keep this after setup and the residency offer, so status output cannot bury it.
say "安装已完成。现在进入 Koder 对话，请复制下一行并回车：" "Start Koder now: copy the next line and press Enter."
printf '  %s\n' "${LAUNCHER_QUOTED}"
say "首次配置或修改模型，运行：" "To configure or change the model, run:"
printf '  %s setup\n' "${LAUNCHER_QUOTED}"
say "看到 koder > 后，再输入自然语言任务。activate 只开后台常驻，不会打开聊天。" "When koder > appears, type your task. Background activation does not open chat."
say "若希望当前终端能直接输入 koder，先运行（不需要重新下载）：" "To use koder directly in this terminal, run first (no new download needed):"
printf '  export PATH=%s:"$PATH"\n  hash -r\n  koder\n' "${BIN_QUOTED}"
