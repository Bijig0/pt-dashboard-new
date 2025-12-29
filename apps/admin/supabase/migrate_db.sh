#!/bin/bash

# Source database connection string
SRC_DB="postgresql://postgres.lkxwausyseuiizopsrwi:Mycariscclass1@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

# Destination database connection string
DEST_DB="postgresql://postgres.kawkfmkwmydrtobxxtom:Mycariscclass1@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Temporary file for the dump
DUMP_FILE="temp_dump.sql"

# Step 1: Dump the entire source database (schema and data)
echo "Dumping source database..."
pg_dump --clean --if-exists --format=p "$SRC_DB" > "$DUMP_FILE"

# Step 2: Restore the dump to the destination database
echo "Restoring to destination database..."
psql "$DEST_DB" < "$DUMP_FILE"

# Step 3: Clean up
echo "Cleaning up..."
rm "$DUMP_FILE"

echo "Migration completed."