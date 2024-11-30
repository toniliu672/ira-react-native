// app/(quiz)/multiple-choice/confirmation.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import axios from 'axios';
import { quizService } from '@/services/quizService';

const QuizConfirmationScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const response = await quizService.getQuizResultDetail(id);
        setHasAttempted(response.success && response.data !== null);
      } catch (err) {
        // Jika 404, berarti belum pernah mengerjakan
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setHasAttempted(false);
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    checkQuizStatus();
  }, [id]);

  if (checkingStatus) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (hasAttempted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="info" size={64} color="#0C8EEC" />
        <Text className="text-xl font-bold text-center mt-4">
          Quiz Sudah Dikerjakan
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Kamu sudah mengerjakan quiz ini sebelumnya. Silakan coba quiz lainnya!
        </Text>
        <Link href="/(quiz)" asChild>
          <TouchableOpacity 
            className="mt-6 bg-[#0C8EEC] px-6 py-3 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium">Kembali ke Daftar Quiz</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white p-6">
      <Animated.View 
        entering={FadeIn}
        className="flex-1 justify-center items-center"
      >
        <MaterialIcons name="warning" size={64} color="#0C8EEC" />
        
        <Text className="text-2xl font-bold text-center text-gray-800 mt-6 mb-2">
          Siap Memulai Quiz?
        </Text>
        
        <Text className="text-base text-center text-gray-600 mb-8">
          Quiz Pilihan Ganda
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-8 w-full">
          <Text className="text-base font-medium text-gray-800 mb-4">
            Aturan Quiz:
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-600">• Quiz terdiri dari 10 soal pilihan ganda</Text>
            <Text className="text-gray-600">• Waktu pengerjaan 10 detik per soal</Text>
            <Text className="text-gray-600">• Harus menjawab untuk lanjut ke soal berikutnya</Text>
            <Text className="text-gray-600">• Tidak bisa kembali ke soal sebelumnya</Text>
            <Text className="text-gray-600">• Hasil akan ditampilkan setelah selesai</Text>
            <Text className="text-gray-600">• Pastikan koneksi internet stabil</Text>
          </View>
        </View>

        <View className="w-full space-y-3">
          <Link 
            href={{
              pathname: "/(quiz)/multiple-choice/[id]",
              params: { id }
            } as const}
            asChild
          >
            <Button 
              mode="contained"
              contentStyle={{ height: 50 }}
              className="w-full"
              buttonColor="#0C8EEC"
            >
              Mulai Quiz
            </Button>
          </Link>
          
          <Link href="/(quiz)" asChild>
            <Button 
              mode="outlined"
              contentStyle={{ height: 50 }}
              className="w-full"
              textColor="#666"
            >
              Kembali
            </Button>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}