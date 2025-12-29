import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { TableCell as TableCellType } from '../../types/table';
import { getConfidenceBgColor, getConfidenceBorderColor } from '../../utils/confidence';

interface TableCellProps {
  cell: TableCellType;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
}

export function TableCellComponent({
  cell,
  onUpdate,
  isEditable = true,
}: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(cell.content);

  const bgColor = getConfidenceBgColor(cell.confidence);
  const borderColor = getConfidenceBorderColor(cell.confidence);

  const handleSubmit = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(cell.content);
    setIsEditing(false);
  };

  if (isEditing && isEditable) {
    return (
      <View className={`w-28 h-11 border ${borderColor} ${bgColor}`}>
        <TextInput
          value={editValue}
          onChangeText={setEditValue}
          onSubmitEditing={handleSubmit}
          onBlur={handleSubmit}
          autoFocus
          className="flex-1 px-2 text-sm font-mono text-gray-900"
          selectTextOnFocus
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => isEditable && setIsEditing(true)}
      activeOpacity={isEditable ? 0.7 : 1}
      className={`w-28 h-11 border justify-center px-2 ${borderColor} ${bgColor}`}
    >
      <Text
        className="text-sm font-mono text-gray-900"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {cell.content || ' '}
      </Text>
    </TouchableOpacity>
  );
}
