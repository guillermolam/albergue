#!/usr/bin/env bash
set -euo pipefail

version="${ZIZMOR_VERSION:-1.30.0}"

if command -v zizmor >/dev/null 2>&1; then
	installed="$(zizmor --version 2>/dev/null | awk '{print $2}')"
	if [[ ${installed} == "${version}" ]]; then
		exit 0
	fi
	echo "zizmor ${installed:-unknown} installed; installing ${version}" >&2
fi

cargo_bin="${CARGO_HOME:-${HOME}/.cargo}/bin"
export PATH="${cargo_bin}:${PATH}"

if ! command -v cargo >/dev/null 2>&1; then
	echo "cargo not found; installing Rust toolchain" >&2
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
	# shellcheck disable=SC1091
	source "${HOME}/.cargo/env"
	export PATH="${cargo_bin}:${PATH}"
fi

if [[ -n ${GITHUB_PATH:-} ]]; then
	printf '%s\n' "${cargo_bin}" >>"${GITHUB_PATH}"
fi

cargo install --locked --version "${version}" zizmor
