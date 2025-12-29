import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { formatConfidence, getConfidenceLevel } from '../../utils/confidence';

interface StatsCardProps {
  rows: number;
  columns: number;
  confidence: number;
}

export function StatsCard({ rows, columns, confidence }: StatsCardProps) {
  const confidenceLevel = getConfidenceLevel(confidence);
  const confidenceColor = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  }[confidenceLevel];

  return (
    <Card className="mb-4">
      <View className="flex-row justify-around">
        <View className="items-center">
          <View className="flex-row items-center mb-1">
            <Ionicons name="grid-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Rows</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{rows}</Text>
        </View>

        <View className="w-px bg-gray-200" />

        <View className="items-center">
          <View className="flex-row items-center mb-1">
            <Ionicons name="grid-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Columns</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{columns}</Text>
        </View>

        <View className="w-px bg-gray-200" />

        <View className="items-center">
          <View className="flex-row items-center mb-1">
            <Ionicons name="checkmark-circle-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Confidence</Text>
          </View>
          <Text className={`text-2xl font-bold ${confidenceColor}`}>
            {formatConfidence(confidence)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
