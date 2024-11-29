// app/(quiz)/multiple-choice/result.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function QuizResultScreen() {
  const { score, total, correct } = useLocalSearchParams<{
    score: string;
    total: string;
    correct: string;
  }>();

  const numScore = parseFloat(score);
  const numTotal = parseInt(total);
  const numCorrect = parseInt(correct);

  return (
    <View className="flex-1 bg-white p-6">
      <Animated.View 
        entering={FadeIn}
        className="flex-1 justify-center items-center"
      >
        <View className="w-32 h-32 rounded-full bg-[#0C8EEC15] items-center justify-center mb-6">
          <Text className="text-4xl font-bold text-[#0C8EEC]">
            {numScore}
          </Text>
          <Text className="text-[#0C8EEC]">Nilai</Text>
        </View>

        <Text className="text-2xl font-bold text-center text-gray-800 mb-8">
          Quiz Selesai!
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-8 w-full">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Total Soal</Text>
            <Text className="font-medium text-gray-800">{numTotal}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Jawaban Benar</Text>
            <Text className="font-medium text-gray-800">{numCorrect}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Jawaban Salah</Text>
            <Text className="font-medium text-gray-800">{numTotal - numCorrect}</Text>
          </View>
        </View>

        <View className="w-full space-y-3">
          <Link href="/(quiz)/results" asChild>
            <Button 
              mode="contained"
              contentStyle={{ height: 50 }}
              className="w-full"
              buttonColor="#0C8EEC"
            >
              Lihat Semua Hasil
            </Button>
          </Link>
          
          <Link href="/(quiz)" asChild>
            <Button 
              mode="outlined"
              contentStyle={{ height: 50 }}
              className="w-full"
              textColor="#666"
            >
              Kembali ke Quiz
            </Button>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}