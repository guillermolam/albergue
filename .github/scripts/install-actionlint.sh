#!/usr/bin/env bash
set -euo pipefail

version="${ACTIONLINT_VERSION:-1.7.12}"

# Skip only when the installed version already matches
if command -v actionlint >/dev/null 2>&1; then
  installed="$(actionlint --version 2>/dev/null | head -n1 | awk '{print $2}')"
  if [[ "$installed" == "${version#v}" ]]; then
    exit 0
  fi
  echo "actionlint $installed installed; upgrading to ${version#v}" >&2
fi

case "$(uname -s)" in
  Linux) os="linux" ;;
  Darwin) os="darwin" ;;
  *)
    echo "unsupported OS for actionlint installer: $(uname -s)" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64|amd64) arch="amd64" ;;
  arm64|aarch64) arch="arm64" ;;
  *)
    echo "unsupported architecture for actionlint installer: $(uname -m)" >&2
    exit 1
    ;;
esac

archive="actionlint_${version#v}_${os}_${arch}.tar.gz"
url="https://github.com/rhysd/actionlint/releases/download/v${version#v}/${archive}"
bindir="${ACTIONLINT_BIN_DIR:-$HOME/.local/bin}"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

curl -fsSL "$url" -o "$tmpdir/$archive"
tar -xzf "$tmpdir/$archive" -C "$tmpdir"
mkdir -p "$bindir"
install -m 0755 "$tmpdir/actionlint" "$bindir/actionlint"
