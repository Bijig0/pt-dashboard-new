#!/usr/bin/env python3
"""
Group KETERANGAN and KELUAR columns from BANK KAS REKAPAN 2025.xlsx

This script:
1. Reads all month sheets from the Excel file
2. Groups by KETERANGAN column and sums KELUAR column
3. Creates a new Excel file with one sheet per month containing grouped data
4. Validates that totals match before and after grouping
"""

import pandas as pd
import os
from typing import Dict, Tuple

def read_sheet_with_validation(file_path: str, sheet_name: str) -> Tuple[pd.DataFrame, float]:
    """
    Read a sheet from the Excel file, starting from the header row.

    Args:
        file_path: Path to the Excel file
        sheet_name: Name of the sheet to read

    Returns:
        Tuple of (DataFrame, original_total)
    """
    # First, read raw data to find the header row
    df_raw = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

    # Find the row containing "TGL" (and optionally "KETERANGAN")
    header_row = None
    for idx, row in df_raw.iterrows():
        row_values = [str(v).strip().upper() for v in row.tolist() if pd.notna(v)]
        if 'TGL' in row_values:
            header_row = idx
            break

    if header_row is None:
        raise ValueError(f"Sheet {sheet_name} does not have a header row with TGL")

    # Read the sheet with the correct header row
    df = pd.read_excel(file_path, sheet_name=sheet_name, header=header_row)

    # Clean column names (strip whitespace and handle unnamed columns)
    df.columns = df.columns.str.strip() if hasattr(df.columns, 'str') else df.columns

    # If column names are missing, assign standard names based on position
    # Expected columns: TGL (col 0), KETERANGAN (col 1), MASUK (col 2), KELUAR (col 3)
    if 'KETERANGAN' not in df.columns:
        # Use positional column assignment
        col_names = ['TGL', 'KETERANGAN', 'MASUK', 'KELUAR']
        df.columns = col_names[:len(df.columns)]

    # Clean up the data
    # Drop rows where KETERANGAN is NaN
    df = df.dropna(subset=['KETERANGAN'])

    # Ensure KELUAR column exists and fill NaN with 0
    if 'KELUAR' not in df.columns:
        raise ValueError(f"Sheet {sheet_name} does not have a KELUAR column. Columns: {df.columns.tolist()}")

    df['KELUAR'] = pd.to_numeric(df['KELUAR'], errors='coerce').fillna(0)

    # Calculate original total
    original_total = df['KELUAR'].sum()

    # Keep only KETERANGAN and KELUAR columns
    df = df[['KETERANGAN', 'KELUAR']].copy()

    # Clean KETERANGAN by stripping whitespace
    df['KETERANGAN'] = df['KETERANGAN'].astype(str).str.strip()

    return df, original_total


def group_by_keterangan(df: pd.DataFrame) -> Tuple[pd.DataFrame, float]:
    """
    Group DataFrame by KETERANGAN and sum KELUAR.

    Args:
        df: DataFrame with KETERANGAN and KELUAR columns

    Returns:
        Tuple of (grouped DataFrame, grouped_total)
    """
    grouped = df.groupby('KETERANGAN', as_index=False)['KELUAR'].sum()
    grouped_total = grouped['KELUAR'].sum()

    # Sort by KELUAR descending for better readability
    grouped = grouped.sort_values('KELUAR', ascending=False)

    return grouped, grouped_total


def main():
    """Main function to process the Excel file."""
    # File paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(script_dir, "../in/BANK KAS REKAPAN 2025.xlsx")
    output_file = os.path.join(script_dir, "BANK KAS REKAPAN 2025 - Grouped.xlsx")

    print(f"Reading file: {input_file}\n")

    # Get all sheet names
    xl_file = pd.ExcelFile(input_file)
    sheet_names = xl_file.sheet_names
    print(f"Found {len(sheet_names)} sheets: {', '.join(sheet_names)}\n")

    # Process each sheet
    results = {}
    validation_results = {}

    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        for sheet_name in sheet_names:
            print(f"Processing sheet: {sheet_name}")

            try:
                # Read and process the sheet
                df, original_total = read_sheet_with_validation(input_file, sheet_name)
                print(f"  Original rows: {len(df)}")
                print(f"  Original total: {original_total:,.2f}")

                # Group by KETERANGAN
                grouped_df, grouped_total = group_by_keterangan(df)
                print(f"  Grouped rows: {len(grouped_df)}")
                print(f"  Grouped total: {grouped_total:,.2f}")

                # Validate totals match
                total_diff = abs(original_total - grouped_total)
                if total_diff < 0.01:  # Allow for floating point precision
                    print(f"  ✓ Totals match!")
                    validation_results[sheet_name] = True
                else:
                    print(f"  ✗ WARNING: Totals don't match! Difference: {total_diff:,.2f}")
                    validation_results[sheet_name] = False

                # Write to Excel
                grouped_df.to_excel(writer, sheet_name=sheet_name, index=False)
                results[sheet_name] = grouped_df

                print()

            except Exception as e:
                print(f"  Error processing sheet {sheet_name}: {str(e)}\n")
                validation_results[sheet_name] = False

    print(f"Output file saved: {output_file}\n")

    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    successful_sheets = sum(1 for v in validation_results.values() if v)
    print(f"Successfully processed: {successful_sheets}/{len(sheet_names)} sheets")

    if all(validation_results.values()):
        print("\n✓ All sheets validated successfully!")
        print("  All totals match between original and grouped data.")
    else:
        print("\n✗ Some sheets failed validation:")
        for sheet_name, valid in validation_results.items():
            if not valid:
                print(f"  - {sheet_name}")

    print(f"\nOutput file: {output_file}")


if __name__ == "__main__":
    main()
