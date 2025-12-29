import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NameValidationResult } from '../hooks/useNameValidation';

interface ValidationSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (corrections: Map<string, string>) => void;
  companyResults: Map<string, NameValidationResult>;
  alatResults: Map<string, NameValidationResult>;
}

interface TypoIssue {
  type: 'company' | 'alat';
  originalValue: string;
  result: NameValidationResult;
}

interface UnknownIssue {
  type: 'company' | 'alat';
  originalValue: string;
}

export function ValidationSummaryModal({
  visible,
  onClose,
  onConfirm,
  companyResults,
  alatResults,
}: ValidationSummaryModalProps) {
  // Track user selections for corrections
  const [selections, setSelections] = useState<Map<string, string>>(new Map());

  // Categorize issues into typos (has suggestions) and unknown (no suggestions)
  const { typoIssues, unknownIssues } = useMemo(() => {
    const typos: TypoIssue[] = [];
    const unknowns: UnknownIssue[] = [];

    companyResults.forEach((result, originalValue) => {
      if (result.isExactMatch) return;

      if (result.hasSuggestions) {
        typos.push({ type: 'company', originalValue, result });
      } else if (result.isUnknown) {
        unknowns.push({ type: 'company', originalValue });
      }
    });

    alatResults.forEach((result, originalValue) => {
      if (result.isExactMatch) return;

      if (result.hasSuggestions) {
        typos.push({ type: 'alat', originalValue, result });
      } else if (result.isUnknown) {
        unknowns.push({ type: 'alat', originalValue });
      }
    });

    return { typoIssues: typos, unknownIssues: unknowns };
  }, [companyResults, alatResults]);

  // Check if all typos have been corrected
  const allTyposCorrected = typoIssues.every((issue) => {
    const key = `${issue.type}-${issue.originalValue}`;
    return selections.has(key);
  });

  // Can only proceed if no unknown issues AND all typos are corrected
  const canProceed = unknownIssues.length === 0 && allTyposCorrected;
  const hasNoIssues = typoIssues.length === 0 && unknownIssues.length === 0;

  const handleSelectCorrection = (key: string, correction: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.get(key) === correction) {
        next.delete(key);
      } else {
        next.set(key, correction);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(selections);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Validation Check</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Status Banners */}
          {unknownIssues.length > 0 && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text style={styles.errorText}>
                {unknownIssues.length} name(s) not found in database - cannot upload
              </Text>
            </View>
          )}

          {typoIssues.length > 0 && unknownIssues.length === 0 && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={20} color="#d97706" />
              <Text style={styles.warningText}>
                {typoIssues.length} possible typo(s) detected - select corrections
              </Text>
            </View>
          )}

          <ScrollView style={styles.content}>
            {/* Success State */}
            {hasNoIssues && (
              <View style={styles.successMessage}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={styles.successText}>
                  All names match registered entries
                </Text>
              </View>
            )}

            {/* Unknown Names Section - Cannot proceed with these */}
            {unknownIssues.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="close-circle" size={18} color="#dc2626" />
                  <Text style={styles.sectionTitle}>Unknown Names (Cannot Upload)</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  These names are not in the database. Add them via the admin dashboard first.
                </Text>

                {unknownIssues.map((issue) => (
                  <View key={`unknown-${issue.type}-${issue.originalValue}`} style={styles.unknownCard}>
                    <View style={styles.unknownHeader}>
                      <Text style={styles.typeLabel}>
                        {issue.type === 'company' ? '🏢 Company' : '🔧 Alat'}
                      </Text>
                      <Text style={styles.unknownValue}>"{issue.originalValue}"</Text>
                    </View>
                    <View style={styles.adminMessage}>
                      <Ionicons name="information-circle" size={16} color="#6b7280" />
                      <Text style={styles.adminMessageText}>
                        Please add this {issue.type === 'company' ? 'company' : 'alat'} in the admin dashboard before uploading
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Typos Section - Can fix these */}
            {typoIssues.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="create" size={18} color="#d97706" />
                  <Text style={styles.sectionTitle}>Possible Typos (Select Correction)</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  These names are similar to registered entries. Select the correct name.
                </Text>

                {typoIssues.map((issue) => {
                  const key = `${issue.type}-${issue.originalValue}`;
                  const selected = selections.get(key);

                  return (
                    <View key={key} style={styles.typoCard}>
                      <View style={styles.typoHeader}>
                        <Text style={styles.typeLabel}>
                          {issue.type === 'company' ? '🏢 Company' : '🔧 Alat'}
                        </Text>
                        <Text style={styles.typoValue}>"{issue.originalValue}"</Text>
                      </View>

                      <Text style={styles.suggestionsLabel}>Did you mean:</Text>
                      {issue.result.suggestions.slice(0, 3).map((suggestion) => (
                        <TouchableOpacity
                          key={suggestion.name}
                          style={[
                            styles.suggestionItem,
                            selected === suggestion.name && styles.suggestionSelected,
                          ]}
                          onPress={() => handleSelectCorrection(key, suggestion.name)}
                        >
                          <View style={styles.suggestionContent}>
                            {selected === suggestion.name && (
                              <Ionicons name="checkmark-circle" size={18} color="#2563eb" />
                            )}
                            <Text
                              style={[
                                styles.suggestionName,
                                selected === suggestion.name && styles.suggestionNameSelected,
                              ]}
                            >
                              {suggestion.name}
                            </Text>
                          </View>
                          <View style={styles.similarityBadge}>
                            <Text style={styles.similarityText}>
                              {Math.round(suggestion.similarity * 100)}%
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}

                      {!selected && (
                        <Text style={styles.requiredText}>
                          * Please select a correction
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !canProceed && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!canProceed}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  !canProceed && styles.confirmButtonTextDisabled,
                ]}
              >
                {hasNoIssues
                  ? 'Continue to Upload'
                  : unknownIssues.length > 0
                  ? 'Cannot Upload'
                  : allTyposCorrected
                  ? `Apply ${selections.size} Correction(s)`
                  : 'Select All Corrections'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    gap: 8,
  },
  warningText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  successMessage: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  successText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  unknownCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  unknownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unknownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
  },
  adminMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  adminMessageText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 18,
  },
  typoCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  typoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
  typeLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  suggestionSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionName: {
    fontSize: 14,
    color: '#1f2937',
  },
  suggestionNameSelected: {
    fontWeight: '600',
    color: '#1d4ed8',
  },
  similarityBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  similarityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  requiredText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  confirmButton: {
    flex: 2,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmButtonTextDisabled: {
    color: '#9ca3af',
  },
});
