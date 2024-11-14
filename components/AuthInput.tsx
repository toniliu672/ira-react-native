// components/AuthInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function AuthInput({ 
  icon, 
  placeholder, 
  value, 
  onChangeText,
  secureTextEntry,
  ...props 
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="flex-row items-center bg-gray-100 p-4 rounded-xl mb-4">
      <Feather name={icon} size={20} color="#666" />
      <TextInput
        className="flex-1 ml-3 text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          className="ml-2"
        >
          <Feather
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}