// components/commons/ErrorView.tsx
import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <MaterialIcons name="error-outline" size={48} color="#DC2626" />
      <Text className="text-gray-800 text-center mt-4 mb-6">{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} className="bg-[#0C8EEC]">
          Coba Lagi
        </Button>
      )}
    </View>
  );
}
