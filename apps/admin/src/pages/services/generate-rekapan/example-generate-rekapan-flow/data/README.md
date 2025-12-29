# Example Data Documentation

This folder contains sample data demonstrating the relationship between Stok Alat (equipment tracking) input and Generated Rekapan (summary report) output.

## File Structure

```
data/
├── types.ts                    # TypeScript type definitions
├── example-stok-alat-1.ts      # PIPA 2 transactions
├── example-stok-alat-2.ts      # PIPA 3 transactions
├── example-rekapan.ts          # Generated summary output
└── README.md                   # This file
```

## Tab Structure

Each Stok Alat tab shows transactions for one equipment type:
- **Tab 1: PIPA 2** - All PIPA 2 rental transactions
- **Tab 2: PIPA 3** - All PIPA 3 rental transactions

These tabs correspond to the equipment columns in the Generated Rekapan output.

## Data Flow

### Input: Stok Alat Data
Individual equipment transactions tracking when equipment goes in/out:
- **Date**: When the transaction occurred
- **Company**: Which company rented/returned the equipment
- **In (masuk)**: Equipment being returned
- **Out (keluar)**: Equipment being rented out

### Output: Generated Rekapan
Aggregated summary showing net changes by date and equipment type:
- **Date rows**: Show total net change for each equipment on that specific date
- **Total Sewa Periode**: Cumulative totals up to that month
- All companies are combined - only equipment totals are shown

## Example Calculation

### PIPA 2 (from example-stok-alat-1.ts):

**January transactions:**
- Jan 10: PT Konstruksi Jaya rents PIPA 2 (keluar 30)
- Jan 15: PT Bangunan Prima rents PIPA 2 (keluar 20)

**Total Sewa Periode January:** -50

**February transactions:**
- Feb 05: PT Konstruksi Jaya rents PIPA 2 (keluar 25) → **Rekapan shows -25**
- Feb 12: PT Bangunan Prima returns PIPA 2 (masuk 10) → **Rekapan shows +10**
- Feb 20: PT Mega Proyek rents PIPA 2 (keluar 15) → **Rekapan shows -15**

**Total Sewa Periode February:** -80 (January -50 + Feb -25 + Feb +10 + Feb -15)

### PIPA 3 (from example-stok-alat-2.ts):

**January transactions:**
- Jan 12: PT Konstruksi Jaya rents PIPA 3 (keluar 30)

**Total Sewa Periode January:** -30

**February transactions:**
- Feb 05: PT Bangunan Prima rents PIPA 3 (keluar 15) → **Rekapan shows -15**
- Feb 12: PT Mega Proyek rents PIPA 3 (keluar 10) → **Rekapan shows -10**
- Feb 20: PT Konstruksi Jaya returns PIPA 3 (masuk 5) → **Rekapan shows +5**

**Total Sewa Periode February:** -50 (January -30 + Feb -15 + Feb -10 + Feb +5)

## Key Concepts

1. **Negative numbers** = Equipment going out (keluar) - being rented
2. **Positive numbers** = Equipment coming back (masuk) - being returned
3. **Company information is aggregated** - Rekapan shows totals across all companies
4. **Dates are grouped** - All transactions on the same date are summed
5. **Total Sewa Periode** = Running cumulative total for the period

## Summary

Both equipment types show realistic scenarios with:
- Equipment going out (keluar) - shown as **negative numbers** in red
- Equipment being returned (masuk) - shown as **positive numbers** in green

The rekapan aggregates these individual transactions by date and shows cumulative totals for each period.
