// app/(ranking)/index.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { materiService } from '@/services/materiService';
import type { Materi } from '@/types/materi';
import { ErrorView } from '@/components/commons/ErrorView';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RankingMateriScreen() {
  const [materials, setMaterials] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materiService.getMateriList({});
      if (response.success && response.data) {
        setMaterials(response.data.materi);
      }
    } catch (err) {
      setError('Gagal memuat daftar materi');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaterials();
    }, [])
  );

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
    <FlatList
      data={materials}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
          <TouchableOpacity
            onPress={() => router.push(`/(ranking)/quiz-list?materiId=${item.id}`)}
            className="bg-white mx-4 mb-3 p-4 rounded-xl"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {item.judul}
                </Text>
                <Text className="text-gray-500">
                  Materi {item.urutan}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
}