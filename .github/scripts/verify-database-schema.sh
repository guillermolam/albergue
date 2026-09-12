#!/usr/bin/env bash
# Verify authoritative database tables and columns exist
set -euo pipefail

# Requires environment variables:
# - PGPASSWORD: PostgreSQL password
# - DATABASE_HOST: PostgreSQL host (default: localhost)
# - DATABASE_USER: PostgreSQL user (default: postgres)
# - DATABASE_NAME: PostgreSQL database name (default: albergue_test)

DATABASE_HOST="${DATABASE_HOST:-localhost}"
DATABASE_USER="${DATABASE_USER:-postgres}"
DATABASE_NAME="${DATABASE_NAME:-albergue_test}"

echo "Verifying database schema..."

expected_tables=(
	"users"
	"pilgrims"
	"beds"
	"bookings"
	"payments"
	"pricing"
	"government_submissions"
	"notifications"
	"audit_log"
)

printf 'Checking for %s required tables...\n' "${#expected_tables[@]}"

table_list="$(printf "'%s'," "${expected_tables[@]}")"
table_list="${table_list%,}"

table_count=$(psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Atc \
	"SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema='public'
     AND table_name IN (${table_list})")

if [[ ${table_count} != "${#expected_tables[@]}" ]]; then
	printf 'Expected %s tables, found %s\n' "${#expected_tables[@]}" "${table_count}" >&2
	echo "Missing tables:" >&2

	for table in "${expected_tables[@]}"; do
		exists=$(psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Atc \
			"SELECT COUNT(*) FROM information_schema.tables
             WHERE table_schema='public' AND table_name='${table}'")
		if [[ ${exists} == "0" ]]; then
			printf '   - %s\n' "${table}" >&2
		fi
	done
	exit 1
fi

printf 'All %s required tables found\n' "${table_count}"

echo "Verifying critical columns..."

updated_at_count=$(psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Atc \
	"SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema='public'
     AND table_name='government_submissions'
     AND column_name='updated_at'")

if [[ ${updated_at_count} != "1" ]]; then
	echo "Missing required column: government_submissions.updated_at" >&2
	exit 1
fi

attempts_count=$(psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Atc \
	"SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema='public'
     AND table_name='notifications'
     AND column_name='attempts'")

if [[ ${attempts_count} != "1" ]]; then
	echo "Missing required column: notifications.attempts" >&2
	exit 1
fi

echo "All critical columns verified"
echo "Database schema validation passed"
