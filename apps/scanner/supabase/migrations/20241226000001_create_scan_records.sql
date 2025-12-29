-- Migration: Create scan_records table
-- This table stores completed scan uploads with their extracted data

-- Create enum for scan status
CREATE TYPE scan_status AS ENUM ('draft', 'completed', 'failed');

-- Create scan_records table
CREATE TABLE IF NOT EXISTS scan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Scan metadata
    name TEXT,
    image_uri TEXT,
    image_base64 TEXT, -- Store image for re-editing

    -- Extracted data (JSONB for flexibility)
    table_data JSONB NOT NULL DEFAULT '{}',
    records JSONB NOT NULL DEFAULT '[]', -- Array of RecordRow

    -- Statistics
    row_count INTEGER NOT NULL DEFAULT 0,
    column_count INTEGER NOT NULL DEFAULT 0,
    confidence REAL DEFAULT 0.0,

    -- Status tracking
    status scan_status NOT NULL DEFAULT 'draft',
    error_message TEXT,

    -- Processing info
    processing_time_ms INTEGER,
    ocr_model TEXT DEFAULT 'claude',

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_at TIMESTAMPTZ, -- When records were uploaded to main database

    -- Indexes for common queries
    CONSTRAINT valid_row_count CHECK (row_count >= 0),
    CONSTRAINT valid_column_count CHECK (column_count >= 0)
);

-- Create indexes for efficient querying
CREATE INDEX idx_scan_records_user_id ON scan_records(user_id);
CREATE INDEX idx_scan_records_status ON scan_records(status);
CREATE INDEX idx_scan_records_created_at ON scan_records(created_at DESC);
CREATE INDEX idx_scan_records_user_status ON scan_records(user_id, status);

-- Enable Row Level Security
ALTER TABLE scan_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own records
CREATE POLICY "Users can view their own scan records"
    ON scan_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan records"
    ON scan_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scan records"
    ON scan_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan records"
    ON scan_records FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scan_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER trigger_scan_records_updated_at
    BEFORE UPDATE ON scan_records
    FOR EACH ROW
    EXECUTE FUNCTION update_scan_records_updated_at();

-- Add comment for documentation
COMMENT ON TABLE scan_records IS 'Stores scan records including drafts and completed uploads';
COMMENT ON COLUMN scan_records.table_data IS 'Original table structure from OCR';
COMMENT ON COLUMN scan_records.records IS 'Parsed RecordRow array for editing';
COMMENT ON COLUMN scan_records.status IS 'draft = not uploaded, completed = uploaded to main db, failed = upload failed';
