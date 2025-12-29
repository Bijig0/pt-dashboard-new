-- Create function to get available months from records
-- Returns end-of-month dates for all months that have records

CREATE OR REPLACE FUNCTION get_available_months()
RETURNS TABLE (end_of_month TIMESTAMPTZ)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT DISTINCT
    date_trunc('month', tanggal) + interval '1 month' - interval '1 day' AS end_of_month
  FROM record
  WHERE tanggal IS NOT NULL
  ORDER BY end_of_month DESC;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_available_months() TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_months() TO anon;
