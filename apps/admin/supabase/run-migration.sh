#!/bin/bash

# Migration runner script for Supabase databases
# Usage: ./run-migration.sh [dev|prod] [migration_file]

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database connection strings
PROD_DB="postgresql://postgres.lkxwausyseuiizopsrwi:Mycariscclass1@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"
DEV_DB="postgresql://postgres.kawkfmkwmydrtobxxtom:Mycariscclass1@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Function to print colored messages
print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Check if environment argument is provided
if [ -z "$1" ]; then
  print_message "$RED" "Error: Environment not specified"
  echo "Usage: $0 [dev|prod] [migration_file]"
  echo "Example: $0 dev"
  echo "Example: $0 prod 20251219000000_add_unique_constraint_alat_company_name.sql"
  exit 1
fi

ENV=$1
MIGRATION_FILE=$2

# Set database URL based on environment
case $ENV in
  dev|development)
    DB_URL=$DEV_DB
    ENV_NAME="Development"
    ;;
  prod|production)
    DB_URL=$PROD_DB
    ENV_NAME="Production"
    ;;
  *)
    print_message "$RED" "Error: Invalid environment '$ENV'"
    echo "Valid options: dev, development, prod, production"
    exit 1
    ;;
esac

# Get migrations directory
MIGRATIONS_DIR="$(cd "$(dirname "$0")/migrations" && pwd)"

# If no specific migration file is provided, run all migrations
if [ -z "$MIGRATION_FILE" ]; then
  print_message "$YELLOW" "Running all migrations on $ENV_NAME database..."

  # Check if there are any migration files
  if [ -z "$(ls -A "$MIGRATIONS_DIR"/*.sql 2>/dev/null)" ]; then
    print_message "$YELLOW" "No migration files found in $MIGRATIONS_DIR"
    exit 0
  fi

  # Run all migration files in order
  for file in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      print_message "$YELLOW" "Running migration: $filename"

      if psql "$DB_URL" -f "$file"; then
        print_message "$GREEN" "✓ Successfully applied: $filename"
      else
        print_message "$RED" "✗ Failed to apply: $filename"
        exit 1
      fi
    fi
  done

  print_message "$GREEN" "All migrations completed successfully!"
else
  # Run specific migration file
  MIGRATION_PATH="$MIGRATIONS_DIR/$MIGRATION_FILE"

  if [ ! -f "$MIGRATION_PATH" ]; then
    print_message "$RED" "Error: Migration file not found: $MIGRATION_PATH"
    exit 1
  fi

  print_message "$YELLOW" "Running migration: $MIGRATION_FILE on $ENV_NAME database..."

  if psql "$DB_URL" -f "$MIGRATION_PATH"; then
    print_message "$GREEN" "✓ Migration applied successfully!"
  else
    print_message "$RED" "✗ Migration failed!"
    exit 1
  fi
fi
