// app/(tabs)/home.tsx
import React from 'react';
import { Text, SafeAreaView, View, Image } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function HelloWorldScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="flex-1 items-center justify-center">
        {/* Ilustrasi atau Ikon */}
        <MaterialIcons name="computer" size={80} color="#4a90e2" />
        
        {/* Judul */}
        <Title className="text-3xl mt-6 text-blue-800">Belajar IT untuk Semua</Title>

        {/* Deskripsi Singkat */}
        <Paragraph className="text-lg mt-4 text-gray-700 text-center px-4">
          Temukan berbagai topik teknologi informasi dan tingkatkan keahlian Anda dengan materi berkualitas.
        </Paragraph>

        {/* Tombol Aksi */}
        <Button
          mode="contained"
          onPress={() => console.log("Navigasi ke halaman topik")}
          className="mt-8 bg-blue-600"
          icon="book"
        >
          Mulai Belajar
        </Button>
      </View>
    </SafeAreaView>
  );
}
