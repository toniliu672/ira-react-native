import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

// Definisikan tipe untuk props UniversalButton
interface UniversalButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  fontSize?: number;
}

const UniversalButton: React.FC<UniversalButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#0C8EEC',
  textColor = '#FFFFFF',
  width = 160,
  height = 50,
  fontSize = 16,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor, width, height },
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
    elevation: 3, // Untuk memberikan efek shadow di Android
  },
  text: {
    fontWeight: 'bold',
  },
});

export default UniversalButton;
