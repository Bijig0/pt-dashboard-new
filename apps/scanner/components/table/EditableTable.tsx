import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TableData, getCellAt } from '../../types/table';
import { TableCellComponent } from './TableCell';

interface EditableTableProps {
  tableData: TableData;
  onUpdateCell: (cellId: string, content: string) => void;
  onDeleteRow: (rowIndex: number) => void;
  onDeleteColumn: (columnIndex: number) => void;
  isEditable?: boolean;
}

export function EditableTable({
  tableData,
  onUpdateCell,
  onDeleteRow,
  onDeleteColumn,
  isEditable = true,
}: EditableTableProps) {
  const canDeleteRows = tableData.rows > 1;
  const canDeleteColumns = tableData.columns > 1;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View>
          {/* Column delete buttons */}
          {isEditable && canDeleteColumns && (
            <View className="flex-row mb-1">
              <View className="w-8" />
              {Array.from({ length: tableData.columns }).map((_, colIndex) => (
                <TouchableOpacity
                  key={`del-col-${colIndex}`}
                  onPress={() => onDeleteColumn(colIndex)}
                  className="w-28 items-center py-1"
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Table rows */}
          {Array.from({ length: tableData.rows }).map((_, rowIndex) => (
            <View key={`row-${rowIndex}`} className="flex-row">
              {/* Row delete button */}
              {isEditable && canDeleteRows && (
                <TouchableOpacity
                  onPress={() => onDeleteRow(rowIndex)}
                  className="w-8 h-11 items-center justify-center"
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
              {!isEditable || !canDeleteRows && <View className="w-8" />}

              {/* Cells in this row */}
              {Array.from({ length: tableData.columns }).map((_, colIndex) => {
                const cell = getCellAt(tableData, rowIndex, colIndex);
                if (!cell) return <View key={`empty-${rowIndex}-${colIndex}`} className="w-28 h-11 border border-gray-200 bg-gray-50" />;

                return (
                  <TableCellComponent
                    key={cell.id}
                    cell={cell}
                    onUpdate={(content) => onUpdateCell(cell.id, content)}
                    isEditable={isEditable}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}
