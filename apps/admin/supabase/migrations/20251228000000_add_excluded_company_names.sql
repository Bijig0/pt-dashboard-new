-- Migration: Add excluded company names table and functions
-- Purpose: Allow users to mark company names as "Keep Same" to exclude them from clustering suggestions

-- Create table for storing excluded company names
CREATE TABLE IF NOT EXISTS excluded_company_names (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_excluded_company_names_name
    ON excluded_company_names(company_name);

-- Add table comment
COMMENT ON TABLE excluded_company_names IS
'Stores company names that users have marked as "Keep Same" to exclude them from clustering suggestions.';

-- Function: Get all excluded company names
CREATE OR REPLACE FUNCTION get_excluded_company_names()
RETURNS TABLE(company_name TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT company_name, created_at
    FROM excluded_company_names
    ORDER BY created_at DESC;
$$;

-- Function: Add excluded company names (accepts array)
-- Returns the count of newly inserted names (ignores duplicates)
CREATE OR REPLACE FUNCTION add_excluded_company_names(names TEXT[])
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    inserted_count INTEGER;
BEGIN
    INSERT INTO excluded_company_names (company_name)
    SELECT unnest(names)
    ON CONFLICT (company_name) DO NOTHING;

    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    RETURN inserted_count;
END;
$$;

-- Function: Remove an excluded company name
-- Returns TRUE if the name was found and removed, FALSE otherwise
CREATE OR REPLACE FUNCTION remove_excluded_company_name(p_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM excluded_company_names WHERE company_name = p_name;
    RETURN FOUND;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_excluded_company_names() TO authenticated;
GRANT EXECUTE ON FUNCTION add_excluded_company_names(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_excluded_company_name(TEXT) TO authenticated;

GRANT SELECT, INSERT, DELETE ON excluded_company_names TO authenticated;
