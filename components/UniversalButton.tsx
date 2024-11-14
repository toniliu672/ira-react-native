// components/UniversalButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

export interface UniversalButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
}

const UniversalButton: React.FC<UniversalButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#0C8EEC',
  textColor = '#FFFFFF',
  width = 160,
  height = 50,
  fontSize = 16,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? '#cccccc' : backgroundColor, 
          width, 
          height,
          opacity: disabled ? 0.7 : 1
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default UniversalButton;