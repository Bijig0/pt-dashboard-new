# Database Migrations

This folder contains SQL migration files for the Supabase database.

## Migration Files

- `20251219000000_add_unique_constraint_alat_company_name.sql` - Removes duplicate alat records and adds unique constraint on (company, name) ✅ **Applied to both dev and prod**
- `20251221000000_make_alat_name_not_null_in_record.sql` - Makes alat_name column NOT NULL in record table
- `20251225000000_add_get_available_months_function.sql` - Adds function to get available months
- `20251225100000_add_worksheet_snapshot.sql` - Adds worksheet snapshot table
- `20251226000000_add_company_name_corrections.sql` - Adds company name corrections table and functions
- `20251227000000_add_record_push_log.sql` - Adds record push log table
- `20251228000000_add_excluded_company_names.sql` - Adds excluded company names table and functions for "Keep Same" feature ✅ **Applied to both dev and prod**

Note: The rollback migration file has been moved to the parent `supabase/` directory to prevent it from running automatically.

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# For local development
supabase db push

# For production (requires setting up the project link)
supabase db push --db-url "postgresql://postgres.lkxwausyseuiizopsrwi:Mycariscclass1@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

# For staging
supabase db push --db-url "postgresql://postgres.kawkfmkwmydrtobxxtom:Mycariscclass1@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### Option 2: Using the run-migration.sh script

```bash
# Make the script executable (first time only)
chmod +x supabase/run-migration.sh

# Run on development database
./supabase/run-migration.sh dev

# Run on production database
./supabase/run-migration.sh prod
```

### Option 3: Manual execution with psql

```bash
# For production
psql "postgresql://postgres.lkxwausyseuiizopsrwi:Mycariscclass1@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres" -f supabase/migrations/20251219000000_add_unique_constraint_alat_company_name.sql

# For staging
psql "postgresql://postgres.kawkfmkwmydrtobxxtom:Mycariscclass1@aws-0-us-west-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20251219000000_add_unique_constraint_alat_company_name.sql
```

## Creating New Migrations

When creating new migration files:

1. Use the timestamp naming convention: `YYYYMMDDHHMMSS_description.sql`
2. Make migrations idempotent (safe to run multiple times)
3. Test on development before running on production
4. Document the migration in this README

## Migration Safety

All migrations should:
- Be idempotent (safe to run multiple times)
- Include rollback instructions if needed
- Be tested on development database first
- Include comments explaining what they do
