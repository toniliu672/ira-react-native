// app/(quiz)/quiz-list.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Quiz } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import { useQuiz } from '@/context/QuizContext';
import { ErrorView } from '@/components/commons/ErrorView';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function QuizListScreen() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedMateri, setSelectedQuiz } = useQuiz();

  const fetchQuizzes = async () => {
    if (!selectedMateri) {
      router.back();
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response = await quizService.getQuizList(selectedMateri.id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat daftar quiz');
      }

      setQuizzes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!selectedMateri) {
        router.back();
        return;
      }
      fetchQuizzes();
    }, [selectedMateri])
  );

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    if (quiz.type === 'MULTIPLE_CHOICE') {
      // Gunakan format routing yang benar
      router.push(`/(quiz)/multiple-choice/${quiz.id}`);
    } else {
      router.push(`/(quiz)/essay/${quiz.id}`);
    }
  };

  if (!selectedMateri) return null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchQuizzes} />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchQuizzes} />
      }
    >
      <View className="p-4">
        <View className="mb-4">
          <Text className="text-gray-500">Materi</Text>
          <Text className="text-xl font-bold text-gray-800">
            {selectedMateri.judul}
          </Text>
        </View>

        {quizzes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <MaterialIcons name="quiz" size={48} color="#CBD5E1" />
            <Text className="text-gray-400 text-center mt-4">
              Belum ada quiz untuk materi ini
            </Text>
          </View>
        ) : (
          quizzes.map((quiz, index) => (
            <Animated.View
              key={quiz.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handleQuizSelect(quiz)}
                className="bg-white p-4 rounded-xl mb-3 border border-gray-100"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      {quiz.judul}
                    </Text>
                    <Text className="text-gray-500" numberOfLines={2}>
                      {quiz.deskripsi}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <MaterialIcons 
                        name={quiz.type === 'MULTIPLE_CHOICE' ? 'check-circle' : 'edit'} 
                        size={20} 
                        color={quiz.type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394'} 
                      />
                      <Text 
                        className="ml-2"
                        style={{ 
                          color: quiz.type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394'
                        }}
                      >
                        {quiz.type === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Essay'}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </View>
    </ScrollView>
  );
}