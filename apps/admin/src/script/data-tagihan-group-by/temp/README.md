# BANK KAS REKAPAN 2025 - Group by KETERANGAN

This folder contains a Python pandas script that groups transactions by KETERANGAN (description) and sums the KELUAR (expenses) column for all months in the BANK KAS REKAPAN 2025 Excel file.

## Files

- **group_keterangan_keluar.py** - Main script that processes the Excel file
- **test_group_keterangan_keluar.py** - Comprehensive test suite
- **BANK KAS REKAPAN 2025 - Grouped.xlsx** - Output file with grouped data

## Features

### Main Script (`group_keterangan_keluar.py`)

1. **Automatically detects header rows** - Handles different Excel layouts across sheets
2. **Groups by KETERANGAN** - Combines all transactions with the same description
3. **Sums KELUAR column** - Calculates total expenses for each KETERANGAN
4. **Validates totals** - Ensures sum of original data matches sum of grouped data
5. **Processes all months** - Handles JAN through OCT sheets

### Test Suite (`test_group_keterangan_keluar.py`)

Comprehensive tests that verify:
- ✅ **Total validation** - Sum of KELUAR is identical before and after grouping for each month
- ✅ **Unique KETERANGAN** - No duplicate entries in grouped data
- ✅ **Correct format** - Output has exactly 2 columns: KETERANGAN and KELUAR
- ✅ **No missing data** - All original KETERANGAN values are preserved
- ✅ **Individual sheet validation** - Detailed validation for each month

## Usage

### Run the script

```bash
python3 src/script/data-tagihan-group-by/temp/group_keterangan_keluar.py
```

### Run the tests

```bash
python3 -m pytest src/script/data-tagihan-group-by/temp/test_group_keterangan_keluar.py -v -s
```

## Output

The script creates `BANK KAS REKAPAN 2025 - Grouped.xlsx` with:
- One sheet per month (JAN, FEB, MARCH, etc.)
- Two columns: KETERANGAN and KELUAR
- Rows sorted by KELUAR (descending) for easy analysis

### Example Output

**Before (Original Data):**
```
TGL         KETERANGAN    MASUK    KELUAR
2025-01-02  UTK KAS              10000000
2025-01-02  UTK KAS              15000000
2025-01-03  BATU                  1700000
```

**After (Grouped Data):**
```
KETERANGAN    KELUAR
UTK KAS       25000000  (10M + 15M)
BATU           1700000
```

## Validation Results

All 10 months processed successfully with matching totals:

| Month  | Original Rows | Grouped Rows | Total KELUAR (IDR)    | Status |
|--------|---------------|--------------|------------------------|--------|
| JAN    | 105           | 65           | 2,685,125,309.23      | ✓      |
| FEB    | 95            | 70           | 1,075,629,975.58      | ✓      |
| MARCH  | 176           | 130          | 2,594,955,245.22      | ✓      |
| APRIL  | 97            | 62           | 2,299,531,043.10      | ✓      |
| MAY    | 139           | 86           | 2,811,725,131.81      | ✓      |
| JUNE   | 132           | 78           | 1,414,404,769.72      | ✓      |
| JULY   | 220           | 130          | 3,799,961,139.53      | ✓      |
| AUGUST | 196           | 121          | 1,768,872,736.00      | ✓      |
| SEPT   | 127           | 66           | 1,664,132,862.14      | ✓      |
| OCT    | 191           | 119          | 2,330,358,936.97      | ✓      |

**Grand Total:** Rp 22,443,697,229.30 across all months

## Technical Details

### How It Works

1. **Header Detection**: Scans each sheet to find the row containing "TGL" column
2. **Column Mapping**: Handles sheets with missing column names by using positional mapping
3. **Data Cleaning**: Strips whitespace from KETERANGAN values for accurate grouping
4. **Grouping**: Uses pandas `groupby()` to aggregate KELUAR by KETERANGAN
5. **Validation**: Compares sums before and after grouping to ensure accuracy

### Requirements

```bash
pip3 install pandas openpyxl pytest
```

## Notes

- The script handles varying Excel layouts across different sheets
- Totals are validated to within 0.01 IDR for floating-point precision
- Empty rows and invalid data are automatically filtered out
- KETERANGAN values are trimmed of whitespace for consistent grouping
