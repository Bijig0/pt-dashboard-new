# Excel to Database Seeding Script

This script automates the process of importing stok alat (equipment stock) data from Excel files into the Supabase database.

## Features

- Batch processing of multiple Excel files
- Robust data validation using the tested `stok-alat-to-js` function
- Dynamic company name validation from database
- Comprehensive error reporting
- Idempotent operations (safe to run multiple times)

## Prerequisites

- Node.js and TypeScript installed
- Access to the Supabase database
- Excel files with properly formatted data

## Directory Structure

```
src/script/
├── upload-stok-alat-from-excel/
│   ├── main.ts                    # Main orchestration script
│   ├── database-operations.ts     # Database interaction functions
│   ├── supabase-client.ts         # Supabase authentication
│   ├── types.ts                   # TypeScript type definitions
│   └── README.md                  # This file
└── upload-stok-alat/
    └── excel_files/               # Place your Excel files here
        ├── Scaffolding.xlsx
        ├── Excavator.xlsx
        └── ...
```

## Excel File Format

### Filename Convention

Files should be named: `{equipment-name}.xlsx`

Examples:
- `Scaffolding.xlsx`
- `Excavator.xlsx`
- `Tower Crane.xlsx`

The filename (without extension) becomes the equipment name in the database.

### Excel Structure

Each Excel file can contain multiple sheets. Each sheet will be processed.

**Required Columns (first 4 columns):**

| Column | Name | Type | Description |
|--------|------|------|-------------|
| 1 | Tanggal | Date | Transaction date (any parseable format) |
| 2 | Company Name | String | Must match companies in database |
| 3 | Masuk | Number/Null | Incoming stock quantity |
| 4 | Keluar | Number/Null | Outgoing stock quantity |

**Important Rules:**

1. **Header Row:** Row 1 is treated as headers and skipped
2. **XOR Rule:** Either `Masuk` OR `Keluar` must have a value (not both, not neither)
3. **Company Validation:** Company names must exist in the `company_names` table
4. **Date Formats:** Flexible - accepts various date formats
5. **Extra Columns:** Columns beyond the 4th are ignored

### Example Excel Data

```
Tanggal         | Company Name    | Masuk | Keluar
2024-01-15      | PT ABC Corp     | 10    |
2024-01-16      | PT XYZ Ltd      |       | 5
2024-01-17      | PT ABC Corp     | 3     |
```

## Usage

### Step 1: Prepare Excel Files

Place your Excel files in the input directory:

```bash
cp your-files/*.xlsx src/script/upload-stok-alat/excel_files/
```

### Step 2: Run the Script

```bash
npx tsx src/script/upload-stok-alat-from-excel/main.ts
```

### Step 3: Review Output

The script will:
1. Authenticate with Supabase
2. Fetch allowed company names from database
3. Validate all Excel files
4. Report any validation errors
5. Seed validated data to database
6. Print a summary report

## Output Example

```
🌱 Starting Excel to Database seeding...

1️⃣  Authenticating with Supabase...
   ✅ Authenticated successfully

2️⃣  Fetching allowed company names from database...
   ✅ Found 15 companies

3️⃣  Reading Excel files from excel_files/...
   ✅ Found 3 Excel files

4️⃣  Processing Scaffolding.xlsx...
   ✅ Validated 120 records

4️⃣  Processing Excavator.xlsx...
   ❌ Validation errors found (details above)
⏭️  Skipping Excavator.xlsx due to errors

4️⃣  Processing Tower-Crane.xlsx...
   ✅ Validated 85 records

5️⃣  Seeding validated data from 2 files to database...

   Upserting 2 company names...
   ✅ Upserted 2 company names
   Upserting 2 alat names...
   ✅ Upserted 2 alat names
   Upserting 205 stok alat records...
   ✅ Upserted 205 stok alat records

✅ Seeded 205 records to database
🎉 Seeding complete!

📊 Summary:
   - Total files: 3
   - Files processed: 2
   - Files with errors: 1
   - Total records inserted: 205

   Failed files:
   - Excavator.xlsx: Validation failed - check errors logged above
```

## Database Tables

The script interacts with three tables:

### company_names
```sql
company_name VARCHAR PRIMARY KEY
```

### alat_names
```sql
alat_name VARCHAR PRIMARY KEY
```

### stok_alat
```sql
id SERIAL PRIMARY KEY
alat_name VARCHAR
company_name VARCHAR
tanggal DATE
masuk INTEGER NULL
keluar INTEGER NULL
```

## Error Handling

### Validation Errors

The script uses the robust `stok-alat-to-js` validation function which checks:

- Row has at least 4 elements
- First element is a valid date
- Second element is a non-empty string
- Company name exists in the database
- Either masuk OR keluar has a value (XOR rule)

Validation errors are logged with:
- Worksheet name
- Row number
- Specific error message

### Common Errors

1. **Company Name Not Allowed**
   - Solution: Add the company to the `company_names` table first

2. **Invalid Date Format**
   - Solution: Ensure dates are in a recognizable format (e.g., YYYY-MM-DD)

3. **Both Masuk and Keluar Filled**
   - Solution: Each row should have either masuk OR keluar, not both

4. **Empty Required Fields**
   - Solution: Ensure all required columns have values

## Data Validation Features

The script leverages the well-tested `stok-alat-to-js` function which includes:

- **Date Standardization:** Handles various date formats
- **Data Cleaning:** Removes non-data rows
- **Schema Validation:** Uses Zod for type-safe validation
- **Company Whitelist:** Validates against database companies
- **XOR Validation:** Ensures masuk/keluar mutual exclusivity

## Troubleshooting

### No Files Found

```
⚠️  No Excel files found.
```

**Solution:** Ensure Excel files are in `src/script/upload-stok-alat/excel_files/`

### Authentication Failed

```
❌ Supabase authentication failed
```

**Solution:** Check credentials in `src/script/supabase.ts`

### Database Connection Error

```
💥 Seeding failed: Failed to fetch company names
```

**Solution:** Verify Supabase connection and database permissions

## Advanced Usage

### Adding New Companies

Before importing data with new companies, add them to the database:

```sql
INSERT INTO company_names (company_name) VALUES ('New Company Name');
```

### Clearing Existing Data

To start fresh, you can manually clear the `stok_alat` table:

```sql
DELETE FROM stok_alat;
```

## Development

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npx tsc --noEmit
```

## Notes

- The script is idempotent - running it multiple times with the same data is safe
- Upsert operations are used, so existing records may be updated
- All validation is done before any database writes
- Files with validation errors are skipped, but other files continue processing
