-- Migration: Add unique constraint on (company, name) in alat table
-- This migration will:
-- 1. Remove duplicate records (keeping the one with the lowest id)
-- 2. Add a unique constraint to prevent future duplicates

-- Step 1: Delete duplicate records, keeping only the first occurrence (lowest id)
-- This uses a CTE to identify duplicates and delete all but the first one
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY company, name
      ORDER BY id ASC
    ) as row_num
  FROM alat
)
DELETE FROM alat
WHERE id IN (
  SELECT id
  FROM duplicates
  WHERE row_num > 1
);

-- Step 2: Add unique constraint on (company, name)
-- Using IF NOT EXISTS pattern to make migration idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'alat_company_name_unique'
  ) THEN
    ALTER TABLE alat
    ADD CONSTRAINT alat_company_name_unique UNIQUE (company, name);
  END IF;
END $$;

-- Step 3: Add a comment to document the constraint
COMMENT ON CONSTRAINT alat_company_name_unique ON alat IS
'Ensures each alat name is unique per company to prevent duplicate records';
