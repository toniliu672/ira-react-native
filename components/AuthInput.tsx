// components/AuthInput.tsx
import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface AuthInputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
      <Feather name={icon} size={20} color="#666" />
      <TextInput
        className="flex-1 pl-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

export default AuthInput;