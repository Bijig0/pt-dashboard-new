-- Migration: Add worksheet_snapshot table for "go back to state" functionality
-- Stores full worksheet snapshots at key moments for state restoration

CREATE TABLE IF NOT EXISTS worksheet_snapshot (
  id SERIAL PRIMARY KEY,
  alat_name TEXT NOT NULL,
  month DATE NOT NULL,                    -- The month this worksheet covers (first day of month)
  snapshot JSONB NOT NULL,                -- Full grid data as JSON array of rows
  label TEXT,                             -- Optional label: "Before bulk edit", "Manual save", etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_snapshot_alat_name ON worksheet_snapshot(alat_name);
CREATE INDEX IF NOT EXISTS idx_snapshot_month ON worksheet_snapshot(month);
CREATE INDEX IF NOT EXISTS idx_snapshot_created_at ON worksheet_snapshot(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshot_alat_month ON worksheet_snapshot(alat_name, month);

-- Enable RLS
ALTER TABLE worksheet_snapshot ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all snapshots
CREATE POLICY "Users can view all snapshots"
  ON worksheet_snapshot
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert snapshots
CREATE POLICY "Users can insert snapshots"
  ON worksheet_snapshot
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete old snapshots (for cleanup)
CREATE POLICY "Users can delete snapshots"
  ON worksheet_snapshot
  FOR DELETE
  TO authenticated
  USING (true);

-- Comments
COMMENT ON TABLE worksheet_snapshot IS 'Stores worksheet state snapshots for "go back to state" functionality';
COMMENT ON COLUMN worksheet_snapshot.alat_name IS 'Equipment name (worksheet identifier)';
COMMENT ON COLUMN worksheet_snapshot.month IS 'The month this worksheet covers';
COMMENT ON COLUMN worksheet_snapshot.snapshot IS 'Full worksheet data as JSON array';
COMMENT ON COLUMN worksheet_snapshot.label IS 'Optional user-friendly label for this snapshot';
