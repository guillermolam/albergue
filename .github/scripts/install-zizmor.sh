#!/usr/bin/env bash
set -euo pipefail

if command -v zizmor >/dev/null 2>&1; then
  exit 0
fi

if ! command -v cargo >/dev/null 2>&1; then
  echo "cargo not found; installing Rust toolchain" >&2
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
  # shellcheck disable=SC1091
  source "$HOME/.cargo/env"
fi

cargo install --locked zizmor
