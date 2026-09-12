#!/usr/bin/env bash
# Apply journaled Drizzle migrations to PostgreSQL database
set -euo pipefail

# Requires environment variables:
# - PGPASSWORD: PostgreSQL password
# - DATABASE_HOST: PostgreSQL host (default: localhost)
# - DATABASE_USER: PostgreSQL user (default: postgres)
# - DATABASE_NAME: PostgreSQL database name (default: albergue_test)

DATABASE_HOST="${DATABASE_HOST:-localhost}"
DATABASE_USER="${DATABASE_USER:-postgres}"
DATABASE_NAME="${DATABASE_NAME:-albergue_test}"

MIGRATIONS_DIR="domain_model/migrations"
JOURNAL_FILE="${MIGRATIONS_DIR}/meta/_journal.json"

echo "Applying Drizzle migrations from journal..."

if [[ ! -f ${JOURNAL_FILE} ]]; then
	printf 'Migration journal not found: %s\n' "${JOURNAL_FILE}" >&2
	exit 1
fi

# Collect tags first. A while-read loop sharing stdin with psql can swallow tags.
tags="$(node -e "
    const journal = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
    journal.entries.forEach(e => console.log(e.tag));
" "${JOURNAL_FILE}")"

migration_count=0
while IFS= read -r tag; do
	[[ -z ${tag} ]] && continue
	migration_file="${MIGRATIONS_DIR}/${tag}.sql"
	if [[ ! -f ${migration_file} ]]; then
		printf 'Migration file not found: %s\n' "${migration_file}" >&2
		exit 1
	fi

	printf 'Applying migration: %s\n' "${tag}"
	psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" \
		-v ON_ERROR_STOP=1 -f "${migration_file}"

	migration_count=$((migration_count + 1))
done <<<"${tags}"

printf 'Applied %s migrations successfully\n' "${migration_count}"
