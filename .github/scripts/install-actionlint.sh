#!/usr/bin/env bash
# Build actionlint from the pinned commit that parses GitHub $/ uses syntax.
# Release v1.7.12 (2026-03-30) predates $/ (2026-07-30). Pin stays until
# rhysd/actionlint#732 ships in a release. No -ignore flags in the runner.
set -euo pipefail

# refs/pull/732/head on rhysd/actionlint -- re-verify before bumping
ACTIONLINT_COMMIT="${ACTIONLINT_COMMIT:-b02c24b743cc88a26b280339814eb4ece91c32cb}"
ACTIONLINT_REPO="${ACTIONLINT_REPO:-https://github.com/rhysd/actionlint.git}"
bindir="${ACTIONLINT_BIN_DIR:-${HOME}/.local/bin}"
stamp="${bindir}/.actionlint-commit"

if [[ -x "${bindir}/actionlint" && -f ${stamp} && "$(cat "${stamp}")" == "${ACTIONLINT_COMMIT}" ]]; then
	exit 0
fi

if ! command -v go >/dev/null 2>&1; then
	echo "go is required to build actionlint@${ACTIONLINT_COMMIT}" >&2
	exit 1
fi

if ! command -v git >/dev/null 2>&1; then
	echo "git is required to fetch actionlint@${ACTIONLINT_COMMIT}" >&2
	exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "${tmpdir}"' EXIT

git -C "${tmpdir}" clone --filter=blob:none --no-checkout "${ACTIONLINT_REPO}" src
git -C "${tmpdir}/src" fetch --depth 1 origin "${ACTIONLINT_COMMIT}"
git -C "${tmpdir}/src" checkout --detach FETCH_HEAD

actual="$(git -C "${tmpdir}/src" rev-parse HEAD)"
if [[ ${actual} != "${ACTIONLINT_COMMIT}" ]]; then
	echo "actionlint commit mismatch: fetched ${actual}, expected ${ACTIONLINT_COMMIT}" >&2
	exit 1
fi

(
	cd "${tmpdir}/src"
	go build -o actionlint ./cmd/actionlint
)

mkdir -p "${bindir}"
install -m 0755 "${tmpdir}/src/actionlint" "${bindir}/actionlint"
printf '%s\n' "${ACTIONLINT_COMMIT}" >"${stamp}"
echo "installed actionlint ${ACTIONLINT_COMMIT} -> ${bindir}/actionlint" >&2
