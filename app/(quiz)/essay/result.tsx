// app/(quiz)/essay/result.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function EssayResultScreen() {
  const { id, title } = useLocalSearchParams<{
    id: string;
    title: string;
  }>();

  return (
    <View className="flex-1 bg-white p-6">
      <Animated.View 
        entering={FadeIn}
        className="flex-1 justify-center items-center"
      >
        <View className="w-32 h-32 rounded-full bg-[#A92394]15 items-center justify-center mb-6">
          <MaterialIcons name="check-circle" size={64} color="#A92394" />
        </View>

        <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
          Quiz Essay Berhasil Dikumpulkan!
        </Text>
        
        <Text className="text-base text-center text-gray-600 mb-8 px-4">
          {title || "Quiz"} telah berhasil dikumpulkan. Jawaban Anda akan direview dan dinilai oleh pengajar.
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-8 w-full">
          <Text className="text-base font-medium text-gray-800 mb-4 text-center">
            Informasi Penilaian
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-600 text-center">• Jawaban sedang dalam proses review</Text>
            <Text className="text-gray-600 text-center">• Hasil akan tersedia dalam 1-3 hari kerja</Text>
            <Text className="text-gray-600 text-center">• Anda akan mendapat notifikasi ketika nilai sudah tersedia</Text>
            <Text className="text-gray-600 text-center">• Cek papan skor secara berkala untuk melihat hasil</Text>
          </View>
        </View>

        <View className="w-full space-y-3">
          <Button 
            mode="contained"
            onPress={() => router.push("/(papan_skor)")}
            contentStyle={{ height: 50 }}
            className="w-full"
            buttonColor="#A92394"
          >
            Lihat Papan Skor
          </Button>
          
          <Button 
            mode="outlined"
            onPress={() => router.push("/(quiz)")}
            contentStyle={{ height: 50 }}
            className="w-full"
            textColor="#666"
          >
            Kembali ke Quiz
          </Button>

          <Button 
            mode="text"
            onPress={() => router.push("/(tabs)/home")}
            contentStyle={{ height: 50 }}
            className="w-full"
            textColor="#0C8EEC"
          >
            Kembali ke Beranda
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}