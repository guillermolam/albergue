#!/usr/bin/env bash
set -euo pipefail

export PATH="${ACTIONLINT_BIN_DIR:-${HOME}/.local/bin}:${PATH}"

if ! command -v actionlint >/dev/null 2>&1; then
	echo "actionlint not on PATH; run .github/scripts/install-actionlint.sh first" >&2
	exit 1
fi

# No -ignore: `$/` must be accepted by the binary (see install-actionlint.sh).
actionlint -color
