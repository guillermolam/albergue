#!/usr/bin/env bash
set -euo pipefail

if command -v shellcheck >/dev/null 2>&1; then
	exit 0
fi

if command -v apt-get >/dev/null 2>&1; then
	sudo apt-get update -qq
	sudo apt-get install -y shellcheck
	exit 0
fi

echo "shellcheck is required and is not installed" >&2
exit 1
