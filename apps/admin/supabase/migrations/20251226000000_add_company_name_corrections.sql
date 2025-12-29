-- Migration: Add company name corrections table and functions
-- Purpose: Track and manage company name typo corrections with full audit trail and rollback capability

-- Create audit table for tracking company name corrections
CREATE TABLE IF NOT EXISTS company_name_corrections (
    id SERIAL PRIMARY KEY,
    batch_id UUID NOT NULL DEFAULT gen_random_uuid(),
    record_id INTEGER NOT NULL REFERENCES record(id) ON DELETE CASCADE,
    old_company_name TEXT NOT NULL,
    new_company_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rolled_back_at TIMESTAMPTZ
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_company_name_corrections_batch_id
    ON company_name_corrections(batch_id);
CREATE INDEX IF NOT EXISTS idx_company_name_corrections_record_id
    ON company_name_corrections(record_id);
CREATE INDEX IF NOT EXISTS idx_company_name_corrections_old_company_name
    ON company_name_corrections(old_company_name);
CREATE INDEX IF NOT EXISTS idx_company_name_corrections_created_at
    ON company_name_corrections(created_at DESC);

-- Add table comment
COMMENT ON TABLE company_name_corrections IS
'Audit log for company name corrections. Each record tracks an individual change to a record''s company_name field.';

-- Function: Apply company name corrections atomically
-- Takes a JSON array of {old_name, new_name} objects and applies all corrections in a single transaction
CREATE OR REPLACE FUNCTION apply_company_name_corrections(corrections JSONB)
RETURNS TABLE (
    batch_id UUID,
    records_updated INTEGER,
    companies_merged INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch_id UUID := gen_random_uuid();
    v_records_updated INTEGER := 0;
    v_companies_merged INTEGER := 0;
    v_correction JSONB;
    v_old_name TEXT;
    v_new_name TEXT;
    v_record RECORD;
    v_affected_count INTEGER;
BEGIN
    -- Process each correction
    FOR v_correction IN SELECT * FROM jsonb_array_elements(corrections)
    LOOP
        v_old_name := v_correction->>'old_name';
        v_new_name := v_correction->>'new_name';

        -- Skip if names are the same
        IF v_old_name = v_new_name THEN
            CONTINUE;
        END IF;

        -- Check if there are any records to update
        SELECT COUNT(*) INTO v_affected_count
        FROM record WHERE company_name = v_old_name;

        IF v_affected_count = 0 THEN
            CONTINUE;
        END IF;

        v_companies_merged := v_companies_merged + 1;

        -- Log each record change before updating
        FOR v_record IN
            SELECT id FROM record WHERE company_name = v_old_name
        LOOP
            INSERT INTO company_name_corrections (
                batch_id, record_id, old_company_name, new_company_name
            ) VALUES (
                v_batch_id, v_record.id, v_old_name, v_new_name
            );

            v_records_updated := v_records_updated + 1;
        END LOOP;

        -- Update records
        UPDATE record SET company_name = v_new_name WHERE company_name = v_old_name;
    END LOOP;

    RETURN QUERY SELECT v_batch_id, v_records_updated, v_companies_merged;
END;
$$;

-- Function: Rollback a batch of corrections
-- Restores the original company names for all records in the specified batch
CREATE OR REPLACE FUNCTION rollback_company_name_corrections(p_batch_id UUID)
RETURNS TABLE (
    records_restored INTEGER,
    success BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_records_restored INTEGER := 0;
    v_correction RECORD;
BEGIN
    -- Check if batch exists and is not already rolled back
    IF NOT EXISTS (
        SELECT 1 FROM company_name_corrections
        WHERE batch_id = p_batch_id AND rolled_back_at IS NULL
    ) THEN
        RETURN QUERY SELECT 0, FALSE;
        RETURN;
    END IF;

    -- Rollback each correction in reverse order
    FOR v_correction IN
        SELECT * FROM company_name_corrections
        WHERE batch_id = p_batch_id AND rolled_back_at IS NULL
        ORDER BY id DESC
    LOOP
        -- Restore original company name
        UPDATE record
        SET company_name = v_correction.old_company_name
        WHERE id = v_correction.record_id;

        -- Mark as rolled back
        UPDATE company_name_corrections
        SET rolled_back_at = NOW()
        WHERE id = v_correction.id;

        v_records_restored := v_records_restored + 1;
    END LOOP;

    RETURN QUERY SELECT v_records_restored, TRUE;
END;
$$;

-- Function: Get unused companies (not referenced by any records)
CREATE OR REPLACE FUNCTION get_unused_companies()
RETURNS TABLE (company_name TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT c.name
    FROM company c
    LEFT JOIN record r ON r.company_name = c.name
    WHERE r.id IS NULL
    ORDER BY c.name;
$$;

-- Function: Delete unused companies
-- Returns the count of deleted companies
CREATE OR REPLACE FUNCTION delete_unused_companies()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM company c
        WHERE NOT EXISTS (
            SELECT 1 FROM record r WHERE r.company_name = c.name
        )
        RETURNING *
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;

    RETURN v_deleted_count;
END;
$$;

-- Function: Get correction history grouped by batch
CREATE OR REPLACE FUNCTION get_correction_history()
RETURNS TABLE (
    batch_id UUID,
    created_at TIMESTAMPTZ,
    records_count BIGINT,
    old_companies TEXT[],
    new_companies TEXT[],
    is_rolled_back BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        batch_id,
        MIN(created_at) as created_at,
        COUNT(*) as records_count,
        ARRAY_AGG(DISTINCT old_company_name) as old_companies,
        ARRAY_AGG(DISTINCT new_company_name) as new_companies,
        BOOL_AND(rolled_back_at IS NOT NULL) as is_rolled_back
    FROM company_name_corrections
    GROUP BY batch_id
    ORDER BY MIN(created_at) DESC;
$$;

-- Function: Get all unique company names from records
CREATE OR REPLACE FUNCTION get_all_record_company_names()
RETURNS TABLE (company_name TEXT, record_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT company_name, COUNT(*) as record_count
    FROM record
    WHERE company_name IS NOT NULL
    GROUP BY company_name
    ORDER BY company_name;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION apply_company_name_corrections(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_company_name_corrections(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_unused_companies() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_unused_companies() TO authenticated;
GRANT EXECUTE ON FUNCTION get_correction_history() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_record_company_names() TO authenticated;

GRANT SELECT, INSERT ON company_name_corrections TO authenticated;
