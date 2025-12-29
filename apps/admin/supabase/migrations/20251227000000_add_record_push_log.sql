-- Migration: Add record_push_log table for audit logging
-- This table tracks all push operations from the scanner app with undo capability

CREATE TABLE IF NOT EXISTS record_push_log (
  id SERIAL PRIMARY KEY,
  batch_id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('push', 'delete', 'restore')),

  -- Affected records
  record_ids INTEGER[] NOT NULL DEFAULT '{}',
  records_data JSONB NOT NULL,  -- Full record data for restore/display

  -- Metadata
  records_count INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Undo tracking
  rolled_back_at TIMESTAMPTZ,
  rolled_back_by_batch_id UUID
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_push_log_batch_id ON record_push_log(batch_id);
CREATE INDEX IF NOT EXISTS idx_push_log_user_id ON record_push_log(user_id);
CREATE INDEX IF NOT EXISTS idx_push_log_created_at ON record_push_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_log_action_type ON record_push_log(action_type);

-- Enable RLS
ALTER TABLE record_push_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all push logs (for admin visibility)
CREATE POLICY "Users can view all push logs"
  ON record_push_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert their own push logs
CREATE POLICY "Users can insert push logs"
  ON record_push_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update push logs (for marking as rolled back)
CREATE POLICY "Users can update push logs"
  ON record_push_log
  FOR UPDATE
  TO authenticated
  USING (true);

-- Comment on table
COMMENT ON TABLE record_push_log IS 'Audit log for record push operations from scanner app';
COMMENT ON COLUMN record_push_log.batch_id IS 'Unique identifier for a batch of pushed records';
COMMENT ON COLUMN record_push_log.action_type IS 'Type of action: push (new records), delete (undo), restore (redo)';
COMMENT ON COLUMN record_push_log.records_data IS 'Original record data in scanner format for display/restore';
COMMENT ON COLUMN record_push_log.rolled_back_at IS 'Timestamp when this batch was undone';
COMMENT ON COLUMN record_push_log.rolled_back_by_batch_id IS 'Batch ID of the delete action that undid this push';
