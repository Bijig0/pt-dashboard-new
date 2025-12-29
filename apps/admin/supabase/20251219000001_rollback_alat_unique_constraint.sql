-- Rollback Migration: Remove unique constraint on (company, name) in alat table
-- Use this migration only if you need to rollback the unique constraint
-- WARNING: This will allow duplicate records again

-- Remove the unique constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'alat_company_name_unique'
  ) THEN
    ALTER TABLE alat DROP CONSTRAINT alat_company_name_unique;
    RAISE NOTICE 'Unique constraint alat_company_name_unique has been removed';
  ELSE
    RAISE NOTICE 'Unique constraint alat_company_name_unique does not exist, nothing to rollback';
  END IF;
END $$;
