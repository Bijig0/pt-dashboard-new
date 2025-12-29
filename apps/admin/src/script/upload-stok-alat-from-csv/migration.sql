-- Migration: Add upload_batch_id column to record table
-- Run this in Supabase SQL Editor before using the upload script

ALTER TABLE record
ADD COLUMN IF NOT EXISTS upload_batch_id TEXT;

-- Create index for faster batch queries
CREATE INDEX IF NOT EXISTS idx_record_upload_batch_id
ON record(upload_batch_id);

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'record' AND column_name = 'upload_batch_id';
