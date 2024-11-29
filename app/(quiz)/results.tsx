// app/(quiz)/results.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Chip, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { quizService } from '@/services/quizService';
import { QuizResult } from '@/types/quiz';
import { ErrorView } from '@/components/commons/ErrorView';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

type FilterType = 'ALL' | 'MULTIPLE_CHOICE' | 'ESSAY';

export default function QuizResultsScreen() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetchResults = async () => {
    try {
      setError(null);
      const response = await quizService.getQuizResults({
        type: filter === 'ALL' ? undefined : filter
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat hasil quiz');
      }

      setResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResults();
    }, [filter])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const renderResultCard = ({ item, index }: { item: QuizResult; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100)}
      className="bg-white rounded-xl mx-4 mb-4 p-4"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {item.quizTitle}
          </Text>
          <Text className="text-sm text-gray-500">
            {item.materiTitle}
          </Text>
        </View>
        <View 
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor: item.type === 'MULTIPLE_CHOICE' ? '#0C8EEC15' : '#A9239415'
          }}
        >
          <Text 
            className="text-xs font-medium"
            style={{
              color: item.type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394'
            }}
          >
            {item.type === 'MULTIPLE_CHOICE' ? 'PG' : 'Essay'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {item.type === 'MULTIPLE_CHOICE' ? (
          <>
            <View className="flex-row items-center">
              <MaterialIcons name="check-circle" size={18} color="#0C8EEC" />
              <Text className="ml-2 text-gray-600">
                {item.avgScore.toFixed(1)} / 100
              </Text>
            </View>
            <Text className="text-gray-500">
              Benar {item.answeredQuestions} dari {item.totalQuestions}
            </Text>
          </>
        ) : (
          <View className="flex-row items-center">
            <MaterialIcons name="hourglass-empty" size={18} color="#A92394" />
            <Text className="ml-2 text-gray-600">
              {item.avgScore === null ? 'Menunggu Penilaian' : `Nilai: ${item.avgScore}`}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Filter Section */}
      <View className="bg-white border-b border-gray-100 px-4 py-3">
        <Text className="text-base font-bold text-gray-800 mb-3">
          Filter Hasil Quiz
        </Text>
        <View className="flex-row space-x-2">
          <Chip
            selected={filter === 'ALL'}
            onPress={() => setFilter('ALL')}
            style={{
              backgroundColor: filter === 'ALL' ? '#0C8EEC' : '#F3F4F6',
            }}
            textStyle={{
              color: filter === 'ALL' ? 'white' : '#4B5563',
            }}
          >
            Semua
          </Chip>
          <Chip
            selected={filter === 'MULTIPLE_CHOICE'}
            onPress={() => setFilter('MULTIPLE_CHOICE')}
            style={{
              backgroundColor: filter === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#F3F4F6',
            }}
            textStyle={{
              color: filter === 'MULTIPLE_CHOICE' ? 'white' : '#4B5563',
            }}
          >
            Pilihan Ganda
          </Chip>
          <Chip
            selected={filter === 'ESSAY'}
            onPress={() => setFilter('ESSAY')}
            style={{
              backgroundColor: filter === 'ESSAY' ? '#A92394' : '#F3F4F6',
            }}
            textStyle={{
              color: filter === 'ESSAY' ? 'white' : '#4B5563',
            }}
          >
            Essay
          </Chip>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0C8EEC" />
        </View>
      ) : error ? (
        <ErrorView message={error} onRetry={handleRefresh} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultCard}
          keyExtractor={(item) => `${item.quizId}-${item.type}`}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-8">
              <MaterialIcons name="history" size={48} color="#CBD5E1" />
              <Text className="text-gray-400 text-center mt-4">
                Belum ada riwayat quiz
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}