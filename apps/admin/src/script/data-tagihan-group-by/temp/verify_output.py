#!/usr/bin/env python3
"""Quick verification script to display sample output from the grouped file."""

import pandas as pd
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(script_dir, "BANK KAS REKAPAN 2025 - Grouped.xlsx")

print(f"Reading output file: {output_file}\n")

xl_file = pd.ExcelFile(output_file)
print(f"Sheets: {', '.join(xl_file.sheet_names)}\n")

# Show sample from first sheet
first_sheet = xl_file.sheet_names[0]
df = pd.read_excel(output_file, sheet_name=first_sheet)

print(f"Sample from sheet: {first_sheet}")
print("=" * 80)
print(f"Columns: {df.columns.tolist()}")
print(f"Total rows: {len(df)}")
print(f"Total KELUAR: Rp {df['KELUAR'].sum():,.2f}")
print("\nTop 10 expenses:")
print(df.head(10).to_string(index=False))
print("\n" + "=" * 80)

# Summary for all sheets
print("\nSUMMARY - All Months")
print("=" * 80)
print(f"{'Month':<10} {'Rows':<10} {'Total KELUAR (IDR)':<25}")
print("-" * 80)

grand_total = 0
for sheet_name in xl_file.sheet_names:
    df = pd.read_excel(output_file, sheet_name=sheet_name)
    total = df['KELUAR'].sum()
    grand_total += total
    print(f"{sheet_name:<10} {len(df):<10} {total:>23,.2f}")

print("-" * 80)
print(f"{'TOTAL':<10} {'':<10} {grand_total:>23,.2f}")
print("=" * 80)
