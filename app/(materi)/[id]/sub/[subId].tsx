// app/(materi)/[id]/sub/[subId].tsx
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { materiService } from '@/services/materiService';
import { SubMateri } from '@/types/materi';
import { ErrorView } from '@/components/commons/ErrorView';
import { cleanHtml } from '@/lib/stringUtils';

export default function SubMateriDetailScreen() {
  const { id, subId } = useLocalSearchParams<{ id: string; subId: string }>();
  const [subMateri, setSubMateri] = useState<SubMateri | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubMateri = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getSubMateriList(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat sub materi');
      }

      const selectedSubMateri = response.data.find(sub => sub.id === subId);
      if (!selectedSubMateri) {
        throw new Error('Sub materi tidak ditemukan');
      }

      setSubMateri(selectedSubMateri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSubMateri();
    }, [id, subId])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchSubMateri} />;
  }

  if (!subMateri) return null;

  return (
    <ScrollView className="flex-1 bg-white">
      <Animated.View 
        entering={FadeIn}
        className="p-4"
      >
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          {subMateri.judul}
        </Text>

        <Text className="text-gray-600 text-base leading-6 mb-6">
          {cleanHtml(subMateri.konten)}
        </Text>

        {subMateri.imageUrls.map((imageUrl, index) => (
          <View key={index} className="mb-4">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}