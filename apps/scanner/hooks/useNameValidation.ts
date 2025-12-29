import { useCallback } from 'react';
import { useValidationStore } from '../store/validationStore';
import {
  findClosestMatches,
  hasExactMatch,
  MatchResult,
} from '@pt-dashboard/shared';

export interface NameValidationResult {
  value: string;
  isExactMatch: boolean;      // Perfect match in DB
  hasSuggestions: boolean;    // Close matches found (likely typo)
  isUnknown: boolean;         // No matches at all (new name, must add via admin)
  suggestions: MatchResult[];
  bestMatch?: MatchResult;
  // Keep isValid for backward compatibility (true if exact match or has suggestions)
  isValid: boolean;
}

export interface ValidationSummary {
  isAllValid: boolean;
  companyResults: Map<string, NameValidationResult>;
  alatResults: Map<string, NameValidationResult>;
  // Counts
  invalidCount: number;       // Unknown names (no suggestions)
  warningCount: number;       // Typos (has suggestions but not exact)
  // Categorized lists for UI
  unknownCompanies: string[]; // Must add via admin
  unknownAlats: string[];     // Must add via admin
  typoCompanies: string[];    // Has suggestions
  typoAlats: string[];        // Has suggestions
  // Can upload only if no unknown names
  canUpload: boolean;
}

interface UseNameValidationOptions {
  threshold?: number; // Minimum similarity for suggestions (default: 0.6)
  limit?: number; // Max number of suggestions (default: 5)
}

/**
 * Hook for validating company and alat names against registered entries
 */
export function useNameValidation(options: UseNameValidationOptions = {}) {
  const { threshold = 0.6, limit = 5 } = options;
  const { companyNames, alatNames, isLoading, error, refreshIfStale } =
    useValidationStore();

  /**
   * Validate a company name
   */
  const validateCompanyName = useCallback(
    (name: string): NameValidationResult => {
      if (!name.trim()) {
        return {
          value: name,
          isValid: false,
          isExactMatch: false,
          hasSuggestions: false,
          isUnknown: true,
          suggestions: [],
        };
      }

      const isExact = hasExactMatch(name, companyNames);
      if (isExact) {
        return {
          value: name,
          isValid: true,
          isExactMatch: true,
          hasSuggestions: false,
          isUnknown: false,
          suggestions: [],
        };
      }

      const suggestions = findClosestMatches(name, companyNames, limit, threshold);
      const bestMatch = suggestions[0];
      const hasSuggestions = suggestions.length > 0;

      return {
        value: name,
        isValid: hasSuggestions,
        isExactMatch: false,
        hasSuggestions,
        isUnknown: !hasSuggestions,
        suggestions,
        bestMatch,
      };
    },
    [companyNames, threshold, limit]
  );

  /**
   * Validate an alat name
   */
  const validateAlatName = useCallback(
    (name: string): NameValidationResult => {
      if (!name.trim()) {
        return {
          value: name,
          isValid: false,
          isExactMatch: false,
          hasSuggestions: false,
          isUnknown: true,
          suggestions: [],
        };
      }

      const isExact = hasExactMatch(name, alatNames);
      if (isExact) {
        return {
          value: name,
          isValid: true,
          isExactMatch: true,
          hasSuggestions: false,
          isUnknown: false,
          suggestions: [],
        };
      }

      const suggestions = findClosestMatches(name, alatNames, limit, threshold);
      const bestMatch = suggestions[0];
      const hasSuggestions = suggestions.length > 0;

      return {
        value: name,
        isValid: hasSuggestions,
        isExactMatch: false,
        hasSuggestions,
        isUnknown: !hasSuggestions,
        suggestions,
        bestMatch,
      };
    },
    [alatNames, threshold, limit]
  );

  /**
   * Validate all records and return detailed summary
   */
  const validateRecords = useCallback(
    (records: Array<{ companyName: string; alatName: string }>): ValidationSummary => {
      const companyResults = new Map<string, NameValidationResult>();
      const alatResults = new Map<string, NameValidationResult>();

      let invalidCount = 0;
      let warningCount = 0;

      const unknownCompanies: string[] = [];
      const unknownAlats: string[] = [];
      const typoCompanies: string[] = [];
      const typoAlats: string[] = [];

      // Validate unique company names
      const uniqueCompanies = [...new Set(records.map((r) => r.companyName).filter(Boolean))];
      for (const company of uniqueCompanies) {
        const result = validateCompanyName(company);
        companyResults.set(company, result);

        if (result.isUnknown) {
          invalidCount++;
          unknownCompanies.push(company);
        } else if (result.hasSuggestions && !result.isExactMatch) {
          warningCount++;
          typoCompanies.push(company);
        }
      }

      // Validate unique alat names
      const uniqueAlats = [...new Set(records.map((r) => r.alatName).filter(Boolean))];
      for (const alat of uniqueAlats) {
        const result = validateAlatName(alat);
        alatResults.set(alat, result);

        if (result.isUnknown) {
          invalidCount++;
          unknownAlats.push(alat);
        } else if (result.hasSuggestions && !result.isExactMatch) {
          warningCount++;
          typoAlats.push(alat);
        }
      }

      return {
        isAllValid: invalidCount === 0 && warningCount === 0,
        companyResults,
        alatResults,
        invalidCount,
        warningCount,
        unknownCompanies,
        unknownAlats,
        typoCompanies,
        typoAlats,
        // Can only upload if no unknown names (typos can be fixed)
        canUpload: unknownCompanies.length === 0 && unknownAlats.length === 0,
      };
    },
    [validateCompanyName, validateAlatName]
  );

  return {
    // Validation functions
    validateCompanyName,
    validateAlatName,
    validateRecords,

    // Data
    companyNames,
    alatNames,

    // State
    isLoading,
    error,
    isReady: companyNames.length > 0 || alatNames.length > 0,

    // Actions
    refreshIfStale,
  };
}
