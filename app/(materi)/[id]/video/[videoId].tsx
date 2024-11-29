// app/(materi)/[id]/video/[videoId].tsx
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import Animated, { FadeIn } from 'react-native-reanimated';
import { materiService } from '@/services/materiService';
import { VideoMateri } from '@/types/materi';
import { ErrorView } from '@/components/commons/ErrorView';

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16;

export default function VideoMateriScreen() {
  const { id, videoId } = useLocalSearchParams<{ id: string; videoId: string }>();
  const [videoMateri, setVideoMateri] = useState<VideoMateri | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoMateri = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getVideoMateriList(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat video materi');
      }

      const selectedVideo = response.data.find(video => video.id === videoId);
      if (!selectedVideo) {
        throw new Error('Video tidak ditemukan');
      }

      setVideoMateri(selectedVideo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVideoMateri();
    }, [id, videoId])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchVideoMateri} />;
  }

  if (!videoMateri) return null;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full" style={{ height: videoHeight }}>
        <Video
          source={{ uri: videoMateri?.videoUrl ?? '' }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={false}
          style={{ flex: 1 }}
        />
      </View>

      <Animated.View 
        entering={FadeIn}
        className="p-4"
      >
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {videoMateri.judul}
        </Text>

        <Text className="text-gray-500 mb-2">
          Durasi: {Math.floor(videoMateri.durasi / 60)}:{(videoMateri.durasi % 60).toString().padStart(2, '0')} menit
        </Text>

        <Text className="text-gray-600 text-base leading-6">
          {videoMateri.deskripsi}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}