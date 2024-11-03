// components/AuthInput.tsx
import React from "react";
import { TextInput, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";

interface AuthInputProps {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

export default function AuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
}: AuthInputProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center border-2 border-gray-200 rounded-xl px-4 h-14">
        <Feather name={icon} size={20} color="#0C8EEC" />
        <TextInput
          style={{ fontFamily: "Poppins_400Regular" }}
          className="flex-1 ml-3 text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
      {error && (
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
