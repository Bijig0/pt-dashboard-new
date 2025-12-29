import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TableData, getCellAt } from '../types/table';

interface SpreadsheetPreviewProps {
  tableData: TableData;
}

interface RecordRow {
  id: string;
  company_name: string;
  masuk: number | null;
  keluar: number | null;
  alat_name: string;
  tanggal: string;
}

// Convert TableData cells to record format
function convertToRecords(tableData: TableData): RecordRow[] {
  const records: RecordRow[] = [];

  // Skip header row (row 0), process data rows
  for (let r = 1; r < tableData.rows; r++) {
    const row: RecordRow = {
      id: `${r}`,
      company_name: getCellAt(tableData, r, 0)?.content || '',
      masuk: parseNumber(getCellAt(tableData, r, 1)?.content),
      keluar: parseNumber(getCellAt(tableData, r, 2)?.content),
      alat_name: getCellAt(tableData, r, 3)?.content || getCellAt(tableData, r, 0)?.content || '',
      tanggal: getCellAt(tableData, r, 4)?.content || new Date().toISOString().split('T')[0],
    };
    records.push(row);
  }

  return records;
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}

const COLUMN_WIDTHS = {
  id: 50,
  company_name: 200,
  masuk: 70,
  keluar: 70,
  alat_name: 150,
  tanggal: 100,
};

export function SpreadsheetPreview({ tableData }: SpreadsheetPreviewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  const records = useMemo(() => convertToRecords(tableData), [tableData]);

  // Get unique dates
  const dates = useMemo(() => {
    const uniqueDates = [...new Set(records.map(r => r.tanggal))].sort().reverse();
    return uniqueDates;
  }, [records]);

  // Get companies for selected date
  const companies = useMemo(() => {
    if (!selectedDate) return [];
    const filtered = records.filter(r => r.tanggal === selectedDate);
    return [...new Set(filtered.map(r => r.company_name))].sort();
  }, [records, selectedDate]);

  // Filter records based on selection
  const filteredRecords = useMemo(() => {
    let result = records;
    if (selectedDate) {
      result = result.filter(r => r.tanggal === selectedDate);
    }
    if (selectedCompany) {
      result = result.filter(r => r.company_name === selectedCompany);
    }
    return result;
  }, [records, selectedDate, selectedCompany]);

  // Auto-select first date if available
  React.useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates]);

  // Reset company when date changes
  React.useEffect(() => {
    setSelectedCompany(null);
  }, [selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Dropdowns */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {/* Date Dropdown */}
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1f2937',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: '#374151',
          }}
        >
          <Ionicons name="calendar-outline" size={16} color="#60a5fa" />
          <Text style={{ color: '#fff', fontSize: 13, marginLeft: 8, flex: 1 }} numberOfLines={1}>
            {selectedDate || 'Select Date'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#9ca3af" />
        </Pressable>

        {/* Company Dropdown */}
        <Pressable
          onPress={() => selectedDate && setShowCompanyPicker(true)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: selectedDate ? '#1f2937' : '#111827',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: '#374151',
            opacity: selectedDate ? 1 : 0.5,
          }}
        >
          <Ionicons name="business-outline" size={16} color="#34d399" />
          <Text style={{ color: '#fff', fontSize: 13, marginLeft: 8, flex: 1 }} numberOfLines={1}>
            {selectedCompany || 'All Companies'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Results Count */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: '#9ca3af', fontSize: 12 }}>
          Showing {filteredRecords.length} of {records.length} records
        </Text>
        {(selectedDate || selectedCompany) && (
          <Pressable
            onPress={() => {
              setSelectedDate(null);
              setSelectedCompany(null);
            }}
            style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="close-circle" size={14} color="#ef4444" />
            <Text style={{ color: '#ef4444', fontSize: 12, marginLeft: 4 }}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      {/* Spreadsheet Table */}
      <View style={{ flex: 1, minHeight: 150, maxHeight: 300 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* Header Row */}
            <View style={{ flexDirection: 'row', backgroundColor: '#1f2937', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
              <HeaderCell width={COLUMN_WIDTHS.id} title="id" type="int8" isKey />
              <HeaderCell width={COLUMN_WIDTHS.company_name} title="company_name" type="text" hasLink />
              <HeaderCell width={COLUMN_WIDTHS.masuk} title="masuk" type="int8" />
              <HeaderCell width={COLUMN_WIDTHS.keluar} title="keluar" type="int8" />
              <HeaderCell width={COLUMN_WIDTHS.alat_name} title="alat_name" type="text" />
              <HeaderCell width={COLUMN_WIDTHS.tanggal} title="tanggal" type="date" />
            </View>

            {/* Data Rows */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator nestedScrollEnabled>
            {filteredRecords.map((row, idx) => (
              <View
                key={`${row.id}-${idx}`}
                style={{
                  flexDirection: 'row',
                  backgroundColor: idx % 2 === 0 ? '#111827' : '#1a1f2e',
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d3748',
                }}
              >
                <DataCell width={COLUMN_WIDTHS.id} value={row.id} isId />
                <DataCell width={COLUMN_WIDTHS.company_name} value={row.company_name} hasLink />
                <DataCell width={COLUMN_WIDTHS.masuk} value={row.masuk} isNumber />
                <DataCell width={COLUMN_WIDTHS.keluar} value={row.keluar} isNumber />
                <DataCell width={COLUMN_WIDTHS.alat_name} value={row.alat_name} />
                <DataCell width={COLUMN_WIDTHS.tanggal} value={row.tanggal} />
              </View>
            ))}

            {filteredRecords.length === 0 && (
              <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#111827' }}>
                <Ionicons name="document-outline" size={32} color="#4b5563" />
                <Text style={{ color: '#6b7280', marginTop: 8 }}>No records found</Text>
              </View>
            )}
          </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Date Picker Modal */}
      <PickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="Select Date"
        icon="calendar-outline"
        iconColor="#60a5fa"
        options={dates}
        selectedValue={selectedDate}
        onSelect={(value) => {
          setSelectedDate(value);
          setShowDatePicker(false);
        }}
      />

      {/* Company Picker Modal */}
      <PickerModal
        visible={showCompanyPicker}
        onClose={() => setShowCompanyPicker(false)}
        title="Select Company"
        icon="business-outline"
        iconColor="#34d399"
        options={['All Companies', ...companies]}
        selectedValue={selectedCompany || 'All Companies'}
        onSelect={(value) => {
          setSelectedCompany(value === 'All Companies' ? null : value);
          setShowCompanyPicker(false);
        }}
      />
    </View>
  );
}

function PickerModal({
  visible,
  onClose,
  title,
  icon,
  iconColor,
  options,
  selectedValue,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  iconColor: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 320,
            maxHeight: '70%',
            backgroundColor: '#1f2937',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#374151',
            }}
          >
            <Ionicons name={icon as any} size={20} color={iconColor} />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>
              {title}
            </Text>
          </View>

          {/* Options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  backgroundColor: selectedValue === item ? '#374151' : 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d3748',
                }}
              >
                <Text style={{ color: '#e5e7eb', fontSize: 14, flex: 1 }}>{item}</Text>
                {selectedValue === item && (
                  <Ionicons name="checkmark" size={18} color="#22c55e" />
                )}
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

function HeaderCell({
  width,
  title,
  type,
  isKey,
  hasLink,
}: {
  width: number;
  title: string;
  type: string;
  isKey?: boolean;
  hasLink?: boolean;
}) {
  return (
    <View
      style={{
        width,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#374151',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {isKey && <Ionicons name="key-outline" size={10} color="#f59e0b" style={{ marginRight: 3 }} />}
      {hasLink && <Ionicons name="link-outline" size={10} color="#60a5fa" style={{ marginRight: 3 }} />}
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>{title}</Text>
      <Text style={{ color: '#6b7280', fontSize: 9, marginLeft: 3 }}>{type}</Text>
    </View>
  );
}

function DataCell({
  width,
  value,
  isId,
  isNumber,
  hasLink,
}: {
  width: number;
  value: string | number | null;
  isId?: boolean;
  isNumber?: boolean;
  hasLink?: boolean;
}) {
  const displayValue = value === null ? 'NULL' : String(value);
  const isNull = value === null;

  return (
    <View
      style={{
        width,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#2d3748',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {hasLink && !isNull && (
        <Ionicons name="arrow-forward" size={10} color="#4b5563" style={{ marginRight: 4 }} />
      )}
      <Text
        style={{
          color: isNull ? '#6b7280' : isId ? '#9ca3af' : '#e5e7eb',
          fontSize: 11,
          fontStyle: isNull ? 'italic' : 'normal',
        }}
        numberOfLines={1}
      >
        {displayValue}
      </Text>
    </View>
  );
}
