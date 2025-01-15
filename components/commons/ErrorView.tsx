// components/commons/ErrorView.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <MaterialIcons name="error-outline" size={64} color="#DC2626" />
      <Text className="text-lg font-bold text-center mt-4 text-gray-800">
        Terjadi Kesalahan
      </Text>
      <Text className="text-gray-500 text-center mt-2 mb-6">
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-[#0C8EEC] px-6 py-3 rounded-full"
        activeOpacity={0.8}
      >
        <Text className="text-white font-medium">Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );
}