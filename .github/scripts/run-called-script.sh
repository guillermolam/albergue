#!/usr/bin/env bash
# Execute a workflow_call-selected script from .github/scripts/ only.
# CALLED_SCRIPT: basename (e.g. run-frontend-quality.sh)
# CALLED_ARGS: optional single argument (e.g. cloudflare)
set -euo pipefail

script_name="${CALLED_SCRIPT:-}"
if [[ -z ${script_name} ]]; then
	echo "CALLED_SCRIPT is required" >&2
	exit 1
fi

if [[ ${script_name} == */* || ${script_name} == *..* || ${script_name} != *.sh ]]; then
	echo "refusing CALLED_SCRIPT=${script_name}: basename ending in .sh required" >&2
	exit 1
fi

script="./.github/scripts/${script_name}"
if [[ ! -x ${script} ]]; then
	echo "script is not executable: ${script}" >&2
	exit 1
fi

if [[ -n ${CALLED_ARGS:-} ]]; then
	exec "${script}" "${CALLED_ARGS}"
fi

exec "${script}"
