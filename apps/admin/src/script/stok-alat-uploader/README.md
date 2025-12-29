# Stok Alat Uploader

Upload stok alat data from Excel files to the database.

## Quick Start (Full Pipeline)

1. Place your Excel file(s) in the `excel-input` folder
2. Run:
   ```bash
   # Upload to DEV database (default)
   bun src/script/stok-alat-uploader/main.ts [batchId]

   # Upload to PROD database
   bun src/script/stok-alat-uploader/main.ts [batchId] --prod
   ```

This will:
- Convert Excel to CSV files
- Validate all records
- Upload to database

## Environment Selection

All commands support `--dev` or `--prod` flags:

| Flag | Database | Description |
|------|----------|-------------|
| `--dev` | Development | Default, safe for testing |
| `--prod` | Production | Live database |

**Note:** If no flag is provided, defaults to `--dev` for safety.

## Individual Workflows

### Convert Only (Excel → CSV)

```bash
bun src/script/stok-alat-uploader/convert.ts
```

Converts Excel files to CSV without uploading. Useful for:
- Previewing the data before upload
- Manually fixing issues in CSV files
- Archiving CSV files

### Upload Only (CSV → Database)

```bash
# Upload to DEV
bun src/script/stok-alat-uploader/upload.ts [batchId] --dev

# Upload to PROD
bun src/script/stok-alat-uploader/upload.ts [batchId] --prod
```

Uploads existing CSV files from `csv-output` folder. Use this after:
- Running `convert.ts`
- Manually fixing CSV files

### Rollback

```bash
# List all batches in DEV
bun src/script/stok-alat-uploader/rollback.ts --list --dev

# List all batches in PROD
bun src/script/stok-alat-uploader/rollback.ts --list --prod

# Rollback a specific batch in DEV
bun src/script/stok-alat-uploader/rollback.ts stokalat2025 --dev

# Rollback a specific batch in PROD
bun src/script/stok-alat-uploader/rollback.ts stokalat2025 --prod
```

Deletes all records with the specified batch ID.

## Folder Structure

```
stok-alat-uploader/
├── excel-input/       # Place Excel files here
├── csv-output/        # Generated CSV files
├── main.ts            # Full pipeline
├── convert.ts         # Excel → CSV only
├── upload.ts          # CSV → Database only
├── rollback.ts        # Delete by batch ID
├── excel-parser.ts    # Excel parsing logic
├── database-operations.ts
├── supabase-client.ts
├── types.ts
└── README.md
```

## Expected Excel Format

Each sheet represents one "alat" type. The sheet name becomes the alat name.

| Column A | Column B     | Column C | Column D |
|----------|--------------|----------|----------|
| TGL      | Company Name | Masuk    | Keluar   |
| 2-Jan    | COMPANY A    | 50       |          |
| 3-Jan    | COMPANY B    |          | 25       |

## Validation Rules

The upload will fail if any record has **both** `masuk` AND `keluar` with non-zero values. This violates the database constraint `masuk_and_credit_are_mutually_exclusive_except_for_0`.

All validation errors are collected and displayed at once, grouped by file, so you can fix them all in one iteration.

## Batch ID

The batch ID is used to:
- Track which upload session created each record
- Enable rollback of specific uploads

Default batch ID: `stokalat2025`

## Examples

```bash
# Full upload to DEV with default batch ID
bun src/script/stok-alat-uploader/main.ts

# Full upload to PROD with custom batch ID
bun src/script/stok-alat-uploader/main.ts stokalat2025-jan --prod

# Convert only, then review CSVs, then upload to PROD
bun src/script/stok-alat-uploader/convert.ts
# ... review/fix CSV files ...
bun src/script/stok-alat-uploader/upload.ts stokalat2025 --prod

# Oops, need to rollback from PROD
bun src/script/stok-alat-uploader/rollback.ts stokalat2025 --prod
```
