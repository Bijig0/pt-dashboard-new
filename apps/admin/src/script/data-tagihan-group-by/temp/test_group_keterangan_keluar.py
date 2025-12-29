#!/usr/bin/env python3
"""
Tests for group_keterangan_keluar.py

This test suite ensures that:
1. The sum of KELUAR column remains the same after groupby for each month
2. Grouped data has unique KETERANGAN values
3. All sheets are processed successfully
"""

import pytest
import pandas as pd
import os
from group_keterangan_keluar import read_sheet_with_validation, group_by_keterangan


class TestGroupKeteranganKeluar:
    """Test suite for grouping KETERANGAN and KELUAR columns."""

    @pytest.fixture
    def input_file(self):
        """Path to the input Excel file."""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        return os.path.join(script_dir, "../in/BANK KAS REKAPAN 2025.xlsx")

    @pytest.fixture
    def sheet_names(self, input_file):
        """Get all sheet names from the Excel file."""
        xl_file = pd.ExcelFile(input_file)
        return xl_file.sheet_names

    def test_file_exists(self, input_file):
        """Test that the input file exists."""
        assert os.path.exists(input_file), f"Input file not found: {input_file}"

    def test_total_matches_after_groupby_all_sheets(self, input_file, sheet_names):
        """
        Test that the sum of KELUAR column is the same before and after groupby
        for all sheets in the workbook.
        """
        for sheet_name in sheet_names:
            print(f"\nTesting sheet: {sheet_name}")

            # Read the sheet
            df, original_total = read_sheet_with_validation(input_file, sheet_name)

            # Group by KETERANGAN
            grouped_df, grouped_total = group_by_keterangan(df)

            # Assert totals match (allowing for floating point precision)
            assert abs(original_total - grouped_total) < 0.01, (
                f"Sheet {sheet_name}: Totals don't match! "
                f"Original: {original_total:,.2f}, Grouped: {grouped_total:,.2f}"
            )

            print(f"  ✓ {sheet_name}: Original total ({original_total:,.2f}) == "
                  f"Grouped total ({grouped_total:,.2f})")

    def test_grouped_data_has_unique_keterangan(self, input_file, sheet_names):
        """Test that grouped data has unique KETERANGAN values."""
        for sheet_name in sheet_names:
            df, _ = read_sheet_with_validation(input_file, sheet_name)
            grouped_df, _ = group_by_keterangan(df)

            # Check for duplicates in KETERANGAN column
            duplicate_count = grouped_df['KETERANGAN'].duplicated().sum()
            assert duplicate_count == 0, (
                f"Sheet {sheet_name}: Found {duplicate_count} duplicate KETERANGAN values"
            )

    def test_grouped_data_format(self, input_file, sheet_names):
        """Test that grouped data has the correct format."""
        for sheet_name in sheet_names:
            df, _ = read_sheet_with_validation(input_file, sheet_name)
            grouped_df, _ = group_by_keterangan(df)

            # Check columns
            assert list(grouped_df.columns) == ['KETERANGAN', 'KELUAR'], (
                f"Sheet {sheet_name}: Incorrect columns. "
                f"Expected ['KETERANGAN', 'KELUAR'], got {list(grouped_df.columns)}"
            )

            # Check data types
            assert grouped_df['KETERANGAN'].dtype == object, (
                f"Sheet {sheet_name}: KETERANGAN should be object/string type"
            )
            assert pd.api.types.is_numeric_dtype(grouped_df['KELUAR']), (
                f"Sheet {sheet_name}: KELUAR should be numeric type"
            )

    def test_no_missing_keterangan(self, input_file, sheet_names):
        """Test that no KETERANGAN values are missing in grouped data."""
        for sheet_name in sheet_names:
            df, _ = read_sheet_with_validation(input_file, sheet_name)
            grouped_df, _ = group_by_keterangan(df)

            # Get unique KETERANGAN from original and grouped
            original_keterangan = set(df['KETERANGAN'].str.strip())
            grouped_keterangan = set(grouped_df['KETERANGAN'].str.strip())

            # All original KETERANGAN should be in grouped data
            missing = original_keterangan - grouped_keterangan
            assert len(missing) == 0, (
                f"Sheet {sheet_name}: Missing KETERANGAN values after groupby: {missing}"
            )

    def test_individual_sheet_totals(self, input_file, sheet_names):
        """Test individual sheet totals with detailed output."""
        results = []

        for sheet_name in sheet_names:
            df, original_total = read_sheet_with_validation(input_file, sheet_name)
            grouped_df, grouped_total = group_by_keterangan(df)

            results.append({
                'Sheet': sheet_name,
                'Original Rows': len(df),
                'Grouped Rows': len(grouped_df),
                'Original Total': original_total,
                'Grouped Total': grouped_total,
                'Match': abs(original_total - grouped_total) < 0.01
            })

        # Print summary table
        print("\n" + "=" * 100)
        print("VALIDATION RESULTS - TOTAL COMPARISON")
        print("=" * 100)
        print(f"{'Sheet':<15} {'Orig Rows':<12} {'Grouped Rows':<14} "
              f"{'Original Total':<20} {'Grouped Total':<20} {'Match':<8}")
        print("-" * 100)

        for result in results:
            match_symbol = "✓" if result['Match'] else "✗"
            print(f"{result['Sheet']:<15} {result['Original Rows']:<12} "
                  f"{result['Grouped Rows']:<14} "
                  f"{result['Original Total']:>18,.2f} "
                  f"{result['Grouped Total']:>18,.2f}  {match_symbol}")

        print("=" * 100)

        # Assert all match
        all_match = all(r['Match'] for r in results)
        assert all_match, "Not all sheets have matching totals!"


if __name__ == "__main__":
    # Run pytest with verbose output
    pytest.main([__file__, "-v", "-s"])
