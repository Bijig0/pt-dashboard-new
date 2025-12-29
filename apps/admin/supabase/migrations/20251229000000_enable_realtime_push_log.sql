-- Migration: Enable Supabase Realtime for record_push_log table
-- Purpose: Allow the admin stok alat editor to receive real-time notifications
-- when the scanner app pushes new records

-- Enable realtime for record_push_log table
-- This allows clients to subscribe to INSERT/UPDATE/DELETE events via postgres_changes
ALTER PUBLICATION supabase_realtime ADD TABLE record_push_log;

-- Add comment explaining the purpose
COMMENT ON TABLE record_push_log IS
'Audit log for scanner push operations. Realtime enabled for live notifications to admin editor.';
