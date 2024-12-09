// app/(quiz)/index.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Materi } from '@/types/materi';
import { materiService } from '@/services/materiService';
import { useQuiz } from '@/context/QuizContext';
import { ErrorView } from '@/components/commons/ErrorView';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function QuizScreen() {
  const [materials, setMaterials] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setSelectedMateri, clearSelections } = useQuiz();

  const fetchMaterials = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await materiService.getMateriList({});
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat daftar materi');
      }

      setMaterials(response.data.materi);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      clearSelections(); // Reset selections when screen is focused
      fetchMaterials();
    }, [])
  );

  const handleMateriSelect = (materi: Materi) => {
    setSelectedMateri(materi);
    router.push('/(quiz)/quiz-list');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchMaterials} />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchMaterials} />
      }
    >
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Pilih Materi untuk Quiz
        </Text>

        {materials.map((materi, index) => (
          <Animated.View
            key={materi.id}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <TouchableOpacity
              onPress={() => handleMateriSelect(materi)}
              className="bg-white p-4 rounded-xl mb-3 border border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800 mb-1">
                    {materi.judul}
                  </Text>
                  <Text className="text-gray-500" numberOfLines={2}>
                    {materi.deskripsi}
                  </Text>
                </View>
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color="#CBD5E1" 
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}