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

echo "🗃️ Applying Drizzle migrations from journal..."

if [[ ! -f "$JOURNAL_FILE" ]]; then
    echo "❌ Migration journal not found: $JOURNAL_FILE"
    exit 1
fi

# Extract migration tags from journal and apply in order
migration_count=0
while IFS= read -r tag; do
    if [[ -z "$tag" ]]; then
        continue
    fi
    
    migration_file="${MIGRATIONS_DIR}/${tag}.sql"
    if [[ ! -f "$migration_file" ]]; then
        echo "❌ Migration file not found: $migration_file"
        exit 1
    fi
    
    echo "📦 Applying migration: $tag"
    psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" \
         -v ON_ERROR_STOP=1 -f "$migration_file"
    
    ((migration_count++))
done < <(node -e "
    const journal = JSON.parse(require('fs').readFileSync('$JOURNAL_FILE', 'utf8'));
    journal.entries.forEach(e => console.log(e.tag));
")

echo "✅ Applied $migration_count migrations successfully"