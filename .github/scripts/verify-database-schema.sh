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

echo "🔍 Verifying database schema..."

# Expected authoritative tables
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

echo "📋 Checking for ${#expected_tables[@]} required tables..."

# Count existing tables
table_count=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -Atc \
    "SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema='public' 
     AND table_name IN ('$(IFS=,; echo "${expected_tables[*]}" | sed "s/,/','/g")')")

if [[ "$table_count" != "${#expected_tables[@]}" ]]; then
    echo "❌ Expected ${#expected_tables[@]} tables, found $table_count"
    echo "📝 Missing tables:"
    
    for table in "${expected_tables[@]}"; do
        exists=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -Atc \
            "SELECT COUNT(*) FROM information_schema.tables 
             WHERE table_schema='public' AND table_name='$table'")
        if [[ "$exists" == "0" ]]; then
            echo "   - $table"
        fi
    done
    exit 1
fi

echo "✅ All $table_count required tables found"

# Verify specific column requirements
echo "🔍 Verifying critical columns..."

# Check government_submissions.updated_at
updated_at_count=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -Atc \
    "SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema='public' 
     AND table_name='government_submissions' 
     AND column_name='updated_at'")

if [[ "$updated_at_count" != "1" ]]; then
    echo "❌ Missing required column: government_submissions.updated_at"
    exit 1
fi

# Check notifications.attempts  
attempts_count=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -Atc \
    "SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema='public' 
     AND table_name='notifications' 
     AND column_name='attempts'")

if [[ "$attempts_count" != "1" ]]; then
    echo "❌ Missing required column: notifications.attempts"
    exit 1
fi

echo "✅ All critical columns verified"
echo "🎉 Database schema validation passed"