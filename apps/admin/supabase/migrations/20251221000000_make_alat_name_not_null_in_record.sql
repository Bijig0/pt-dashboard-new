-- Migration: Make alat_name NOT NULL in record table
-- This migration will:
-- 1. Delete records with NULL alat_name (data quality cleanup)
-- 2. Add NOT NULL constraint to prevent future NULL values

-- Step 1: Delete records where alat_name is NULL
-- These are invalid records that cause issues in the application
DELETE FROM record
WHERE alat_name IS NULL OR alat_name = '';

-- Step 2: Add NOT NULL constraint to alat_name column
-- Using ALTER TABLE with idempotency check
DO $$
BEGIN
  -- Check if the column is already NOT NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'record'
      AND column_name = 'alat_name'
      AND is_nullable = 'YES'
  ) THEN
    -- Add NOT NULL constraint
    ALTER TABLE record
    ALTER COLUMN alat_name SET NOT NULL;

    RAISE NOTICE 'Added NOT NULL constraint to record.alat_name';
  ELSE
    RAISE NOTICE 'record.alat_name is already NOT NULL, skipping';
  END IF;
END $$;

-- Step 3: Add a comment to document the constraint
COMMENT ON COLUMN record.alat_name IS
'Equipment name - required field to ensure data integrity and prevent empty dropdown issues';

-- Verification query (commented out - uncomment to run manually)
-- SELECT COUNT(*) as total_records,
--        COUNT(alat_name) as non_null_alat_names,
--        COUNT(*) FILTER (WHERE alat_name IS NULL) as null_alat_names
-- FROM record;
