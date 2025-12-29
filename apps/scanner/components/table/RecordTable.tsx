import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TableData, getCellAt } from '../../types/table';
import { RecordRow } from '@pt-dashboard/shared';
import { useNameValidation, NameValidationResult } from '../../hooks/useNameValidation';
import { NameSuggestions, ValidationIndicator } from '../NameSuggestions';
import { useValidationStore } from '../../store/validationStore';

export interface ValidationResults {
  companyResults: Map<string, NameValidationResult>;
  alatResults: Map<string, NameValidationResult>;
  issueCount: number;
}

interface RecordTableProps {
  tableData: TableData;
  records?: RecordRow[];  // Optional controlled records from parent
  onDataChange?: (records: RecordRow[]) => void;
  onValidationChange?: (results: ValidationResults) => void;
  showValidation?: boolean;
}

// Re-export for backward compatibility
export type { RecordRow } from '@pt-dashboard/shared';

// Convert TableData cells to flattened record format
function convertToRecords(tableData: TableData): RecordRow[] {
  const records: RecordRow[] = [];
  let idCounter = 1;

  // Detect column mapping from headers
  const headers: string[] = [];
  for (let c = 0; c < tableData.columns; c++) {
    headers.push(getCellAt(tableData, 0, c)?.content?.toLowerCase() || `col${c}`);
  }

  // Check if this is the new streaming format (Date, Type, Company Name, Alat Name, Amount)
  const isNewFormat = headers[0]?.includes('date') && headers[1]?.includes('type');

  console.log("=== CONVERT TO RECORDS ===");
  console.log("Headers:", headers);
  console.log("Is new format:", isNewFormat);

  // Skip header row (row 0), process data rows
  for (let r = 1; r < tableData.rows; r++) {
    if (isNewFormat) {
      // New format from streaming OCR: Date(0), Type(1), Company(2), Alat(3), Amount(4)
      const date = getCellAt(tableData, r, 0)?.content || '';
      const typeValue = getCellAt(tableData, r, 1)?.content?.toUpperCase() || 'KIRIM';
      const companyName = getCellAt(tableData, r, 2)?.content || '';
      const alatName = getCellAt(tableData, r, 3)?.content || '';
      const amount = parseNumber(getCellAt(tableData, r, 4)?.content);

      // Map KIRIM/RETUR to kirim/terima
      const type: 'kirim' | 'terima' = typeValue === 'RETUR' ? 'terima' : 'kirim';

      records.push({
        id: String(idCounter++),
        date: formatDate(date),
        type,
        companyName,
        alatName,
        amount,
      });
    } else {
      // Legacy format: Company(0), Masuk(1), Keluar(2), Alat(3), Date(4)
      const companyName = getCellAt(tableData, r, 0)?.content || '';
      const masuk = parseNumber(getCellAt(tableData, r, 1)?.content);
      const keluar = parseNumber(getCellAt(tableData, r, 2)?.content);
      const alatName = getCellAt(tableData, r, 3)?.content || getCellAt(tableData, r, 0)?.content || '';
      const tanggal = getCellAt(tableData, r, 4)?.content || new Date().toISOString().split('T')[0];
      const formattedDate = formatDate(tanggal);

      // Create separate rows for masuk (terima) and keluar (kirim)
      if (masuk !== null && masuk > 0) {
        records.push({
          id: String(idCounter++),
          date: formattedDate,
          type: 'terima',
          companyName,
          alatName,
          amount: masuk,
        });
      }

      if (keluar !== null && keluar > 0) {
        records.push({
          id: String(idCounter++),
          date: formattedDate,
          type: 'kirim',
          companyName,
          alatName,
          amount: keluar,
        });
      }

      // If neither masuk nor keluar, still create a row
      if ((masuk === null || masuk === 0) && (keluar === null || keluar === 0)) {
        records.push({
          id: String(idCounter++),
          date: formattedDate,
          type: 'kirim',
          companyName,
          alatName,
          amount: null,
        });
      }
    }
  }

  console.log("Converted", records.length, "records. First:", records[0]);
  return records;
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}

function formatDate(dateStr: string): string {
  // Handle various date formats and convert to DD/MM
  if (dateStr.includes('/')) return dateStr;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
      const day = parts[2] || parts[1];
      const month = parts[1];
      return `${day}/${month}`;
    }
  }
  return dateStr;
}

const COLUMNS = [
  { key: 'date', label: 'Date', width: 70 },
  { key: 'type', label: 'Type', width: 70 },
  { key: 'companyName', label: 'Company', width: 140 },
  { key: 'alatName', label: 'Alat', width: 100 },
  { key: 'amount', label: 'Amount', width: 80 },
] as const;

type ColumnKey = typeof COLUMNS[number]['key'];

export function RecordTable({ tableData, records: externalRecords, onDataChange, onValidationChange, showValidation = true }: RecordTableProps) {
  const initialRecords = useMemo(() => convertToRecords(tableData), [tableData]);
  const [records, setRecords] = useState<RecordRow[]>(externalRecords ?? initialRecords);

  // Sync with external records when they change (e.g., from applying corrections)
  useEffect(() => {
    if (externalRecords && externalRecords.length > 0) {
      setRecords(externalRecords);
    }
  }, [externalRecords]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: ColumnKey } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showTypeModal, setShowTypeModal] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<{ rowId: string; column: 'companyName' | 'alatName' } | null>(null);

  // Validation
  const { refreshIfStale } = useValidationStore();
  const { validateCompanyName, validateAlatName, isReady: validationReady } = useNameValidation();

  // Validation results cache
  const [validationCache, setValidationCache] = useState<Map<string, NameValidationResult>>(new Map());

  // Load validation data on mount
  useEffect(() => {
    if (showValidation) {
      refreshIfStale();
    }
  }, [showValidation, refreshIfStale]);

  // Validate a field and cache result
  const getValidation = useCallback((value: string, type: 'company' | 'alat'): NameValidationResult | null => {
    if (!showValidation || !validationReady || !value.trim()) return null;

    const cacheKey = `${type}:${value}`;
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey)!;
    }

    const result = type === 'company' ? validateCompanyName(value) : validateAlatName(value);
    setValidationCache(prev => new Map(prev).set(cacheKey, result));
    return result;
  }, [showValidation, validationReady, validateCompanyName, validateAlatName, validationCache]);

  const updateRecords = useCallback((newRecords: RecordRow[]) => {
    setRecords(newRecords);
    onDataChange?.(newRecords);
  }, [onDataChange]);

  // Emit validation results to parent
  useEffect(() => {
    if (!showValidation || !validationReady || !onValidationChange) return;

    const companyResults = new Map<string, NameValidationResult>();
    const alatResults = new Map<string, NameValidationResult>();

    // Get unique company and alat names from records
    const uniqueCompanies = [...new Set(records.map(r => r.companyName).filter(Boolean))];
    const uniqueAlats = [...new Set(records.map(r => r.alatName).filter(Boolean))];

    // Validate each unique name
    uniqueCompanies.forEach(name => {
      const result = validateCompanyName(name);
      companyResults.set(name, result);
    });

    uniqueAlats.forEach(name => {
      const result = validateAlatName(name);
      alatResults.set(name, result);
    });

    // Count issues (names with suggestions but no exact match)
    let issueCount = 0;
    companyResults.forEach(result => {
      if (!result.isExactMatch && result.suggestions.length > 0) issueCount++;
    });
    alatResults.forEach(result => {
      if (!result.isExactMatch && result.suggestions.length > 0) issueCount++;
    });

    onValidationChange({ companyResults, alatResults, issueCount });
  }, [records, showValidation, validationReady, validateCompanyName, validateAlatName, onValidationChange]);

  const handleCellPress = (rowId: string, column: ColumnKey, currentValue: string | number | null) => {
    if (column === 'type') {
      setShowTypeModal(rowId);
    } else {
      setEditingCell({ rowId, column });
      setEditValue(currentValue?.toString() || '');
    }
  };

  const handleCellSubmit = () => {
    if (!editingCell) return;

    const newRecords = records.map(record => {
      if (record.id === editingCell.rowId) {
        const updatedRecord = { ...record };
        if (editingCell.column === 'amount') {
          updatedRecord.amount = editValue ? parseInt(editValue, 10) || null : null;
        } else {
          (updatedRecord as any)[editingCell.column] = editValue;
        }
        return updatedRecord;
      }
      return record;
    });

    updateRecords(newRecords);
    setEditingCell(null);
    setEditValue('');
  };

  const handleTypeChange = (rowId: string, newType: 'kirim' | 'terima') => {
    const newRecords = records.map(record => {
      if (record.id === rowId) {
        return { ...record, type: newType };
      }
      return record;
    });
    updateRecords(newRecords);
    setShowTypeModal(null);
  };

  const handleAddRow = () => {
    const newId = String(Math.max(...records.map(r => parseInt(r.id, 10)), 0) + 1);
    const today = new Date();
    const newRecord: RecordRow = {
      id: newId,
      date: `${today.getDate()}/${today.getMonth() + 1}`,
      type: 'kirim',
      companyName: '',
      alatName: '',
      amount: null,
    };
    updateRecords([...records, newRecord]);
  };

  const handleDeleteRow = (rowId: string) => {
    updateRecords(records.filter(r => r.id !== rowId));
  };

  const handleDuplicateRow = (rowId: string) => {
    const sourceRow = records.find(r => r.id === rowId);
    if (!sourceRow) return;

    const newId = String(Math.max(...records.map(r => parseInt(r.id, 10)), 0) + 1);
    const newRecord: RecordRow = { ...sourceRow, id: newId };
    const index = records.findIndex(r => r.id === rowId);
    const newRecords = [...records];
    newRecords.splice(index + 1, 0, newRecord);
    updateRecords(newRecords);
  };

  // Expose records for parent component
  React.useEffect(() => {
    onDataChange?.(records);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Summary */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>
          {records.length} records
        </Text>
        <TouchableOpacity
          onPress={handleAddRow}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#2563eb',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4 }}>Add Row</Text>
        </TouchableOpacity>
      </View>

      {/* Spreadsheet Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Header Row */}
          <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' }}>
            {COLUMNS.map(col => (
              <View
                key={col.key}
                style={{
                  width: col.width,
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderRightWidth: 1,
                  borderRightColor: '#e5e7eb',
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600', fontSize: 12 }}>{col.label}</Text>
              </View>
            ))}
            <View style={{ width: 60, paddingVertical: 10, paddingHorizontal: 8 }}>
              <Text style={{ color: '#374151', fontWeight: '600', fontSize: 12 }}>Actions</Text>
            </View>
          </View>

          {/* Data Rows */}
          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator nestedScrollEnabled>
            {records.map((row, idx) => (
              <View
                key={row.id}
                style={{
                  flexDirection: 'row',
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb',
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                {COLUMNS.map(col => {
                  const value = row[col.key];
                  const isEditing = editingCell?.rowId === row.id && editingCell?.column === col.key;
                  const needsValidation = (col.key === 'companyName' || col.key === 'alatName') && showValidation;
                  const validation = needsValidation && value
                    ? getValidation(String(value), col.key === 'companyName' ? 'company' : 'alat')
                    : null;
                  const showingSuggestions = showSuggestions?.rowId === row.id && showSuggestions?.column === col.key;

                  return (
                    <View key={col.key} style={{ position: 'relative' }}>
                      <Pressable
                        onPress={() => handleCellPress(row.id!, col.key, value)}
                        style={{
                          width: col.width,
                          paddingVertical: 10,
                          paddingHorizontal: 8,
                          borderRightWidth: 1,
                          borderRightColor: '#e5e7eb',
                          backgroundColor: isEditing ? '#dbeafe' :
                            (validation && !validation.isExactMatch && !validation.isValid) ? '#fef2f2' :
                            (validation && !validation.isExactMatch && validation.suggestions.length > 0) ? '#fffbeb' :
                            'transparent',
                        }}
                      >
                        {isEditing ? (
                          <TextInput
                            value={editValue}
                            onChangeText={setEditValue}
                            onBlur={handleCellSubmit}
                            onSubmitEditing={handleCellSubmit}
                            autoFocus
                            style={{
                              color: '#111827',
                              fontSize: 12,
                              padding: 0,
                              margin: 0,
                            }}
                            keyboardType={col.key === 'amount' ? 'numeric' : 'default'}
                          />
                        ) : (
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {col.key === 'type' && (
                              <View
                                style={{
                                  backgroundColor: value === 'kirim' ? '#fecaca' : '#bbf7d0',
                                  paddingHorizontal: 6,
                                  paddingVertical: 2,
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderColor: value === 'kirim' ? '#f87171' : '#4ade80',
                                }}
                              >
                                <Text style={{
                                  color: value === 'kirim' ? '#b91c1c' : '#15803d',
                                  fontSize: 10,
                                  fontWeight: '600'
                                }}>
                                  {value === 'kirim' ? 'Keluar' : 'Masuk'}
                                </Text>
                              </View>
                            )}
                            {col.key !== 'type' && (
                              <>
                                <Text
                                  style={{
                                    color: value === null ? '#9ca3af' : '#374151',
                                    fontSize: 12,
                                    fontStyle: value === null ? 'italic' : 'normal',
                                    flex: 1,
                                  }}
                                  numberOfLines={1}
                                >
                                  {value === null ? '-' : String(value)}
                                </Text>
                                {validation && (
                                  <ValidationIndicator
                                    isValid={validation.isValid}
                                    isExactMatch={validation.isExactMatch}
                                    hasSuggestions={validation.suggestions.length > 0}
                                    onPress={() => {
                                      if (validation.suggestions.length > 0 && !validation.isExactMatch) {
                                        setShowSuggestions({ rowId: row.id!, column: col.key as 'companyName' | 'alatName' });
                                      }
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </View>
                        )}
                      </Pressable>
                      {/* Suggestions dropdown */}
                      {showingSuggestions && validation && validation.suggestions.length > 0 && (
                        <View style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100 }}>
                          <NameSuggestions
                            suggestions={validation.suggestions}
                            onSelect={(name) => {
                              const newRecords = records.map(r => {
                                if (r.id === row.id) {
                                  return { ...r, [col.key]: name };
                                }
                                return r;
                              });
                              updateRecords(newRecords);
                              setShowSuggestions(null);
                              // Clear validation cache for this field
                              setValidationCache(prev => {
                                const next = new Map(prev);
                                next.delete(`${col.key === 'companyName' ? 'company' : 'alat'}:${value}`);
                                return next;
                              });
                            }}
                            onDismiss={() => setShowSuggestions(null)}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Actions */}
                <View style={{ width: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <TouchableOpacity onPress={() => handleDuplicateRow(row.id)} style={{ padding: 4 }}>
                    <Ionicons name="copy-outline" size={14} color="#2563eb" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteRow(row.id)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {records.length === 0 && (
              <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderTopWidth: 0, borderColor: '#e5e7eb' }}>
                <Ionicons name="document-outline" size={32} color="#d1d5db" />
                <Text style={{ color: '#6b7280', marginTop: 8 }}>No records</Text>
                <TouchableOpacity onPress={handleAddRow} style={{ marginTop: 8 }}>
                  <Text style={{ color: '#2563eb', fontSize: 12 }}>Add first row</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Type Picker Modal */}
      <Modal visible={showTypeModal !== null} transparent animationType="fade" onRequestClose={() => setShowTypeModal(null)}>
        <Pressable
          onPress={() => setShowTypeModal(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: 240,
              backgroundColor: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
              }}
            >
              <Text style={{ color: '#111827', fontWeight: '600', fontSize: 16 }}>Select Type</Text>
            </View>

            <Pressable
              onPress={() => showTypeModal && handleTypeChange(showTypeModal, 'terima')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <View style={{ backgroundColor: '#bbf7d0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#4ade80' }}>
                <Text style={{ color: '#15803d', fontSize: 12, fontWeight: '600' }}>Masuk</Text>
              </View>
              <Text style={{ color: '#374151', fontSize: 14, marginLeft: 12 }}>Terima (Incoming)</Text>
            </Pressable>

            <Pressable
              onPress={() => showTypeModal && handleTypeChange(showTypeModal, 'kirim')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
              }}
            >
              <View style={{ backgroundColor: '#fecaca', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#f87171' }}>
                <Text style={{ color: '#b91c1c', fontSize: 12, fontWeight: '600' }}>Keluar</Text>
              </View>
              <Text style={{ color: '#374151', fontSize: 14, marginLeft: 12 }}>Kirim (Outgoing)</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
