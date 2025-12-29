import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MatchResult } from '@pt-dashboard/shared';

interface NameSuggestionsProps {
  suggestions: MatchResult[];
  onSelect: (name: string) => void;
  onDismiss: () => void;
  maxHeight?: number;
}

/**
 * Dropdown component showing name suggestions with similarity scores
 */
export function NameSuggestions({
  suggestions,
  onSelect,
  onDismiss,
  maxHeight = 150,
}: NameSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Did you mean?</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.list, { maxHeight }]}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={`${suggestion.name}-${index}`}
            style={styles.suggestionItem}
            onPress={() => onSelect(suggestion.name)}
          >
            <Text style={styles.suggestionName}>{suggestion.name}</Text>
            <Text style={styles.similarityBadge}>
              {Math.round(suggestion.similarity * 100)}%
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * Inline validation indicator for table cells
 */
interface ValidationIndicatorProps {
  isValid: boolean;
  isExactMatch: boolean;
  hasSuggestions: boolean;
  onPress?: () => void;
}

export function ValidationIndicator({
  isValid,
  isExactMatch,
  hasSuggestions,
  onPress,
}: ValidationIndicatorProps) {
  if (isExactMatch) {
    return (
      <View style={[styles.indicator, styles.indicatorValid]}>
        <Text style={styles.indicatorText}>✓</Text>
      </View>
    );
  }

  if (hasSuggestions) {
    return (
      <TouchableOpacity
        style={[styles.indicator, styles.indicatorWarning]}
        onPress={onPress}
      >
        <Text style={styles.indicatorText}>?</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.indicator, styles.indicatorInvalid]}>
      <Text style={styles.indicatorText}>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  list: {
    paddingVertical: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionName: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  similarityBadge: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 8,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorValid: {
    backgroundColor: '#d1fae5',
  },
  indicatorWarning: {
    backgroundColor: '#fef3c7',
  },
  indicatorInvalid: {
    backgroundColor: '#fee2e2',
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
