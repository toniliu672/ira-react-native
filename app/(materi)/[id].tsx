// app/(materi)/[id].tsx
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { materiService } from '@/services/materiService';
import { MateriDetail } from '@/types/materi';
import { ErrorView } from '@/components/commons/ErrorView';

export default function MateriDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [materi, setMateri] = useState<MateriDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getMateriDetail(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat detail materi');
      }

      setMateri(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMateriDetail();
    }, [id])
  );

  const handleSubMateriPress = (subId: string) => {
    router.push({
      pathname: "./[id]/sub/[subId]",
      params: { id, subId }
    });
  };
  
  const handleVideoPress = (videoId: string) => {
    router.push({
      pathname: "./[id]/video/[videoId]",
      params: { id, videoId }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchMateriDetail} />;
  }

  if (!materi) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Image
        source={{ uri: materi.thumbnailUrl }}
        className="w-full h-48"
        resizeMode="cover"
      />

      <View className="p-4">
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {materi.judul}
          </Text>
          
          <Text className="text-gray-600 mb-6">
            {materi.deskripsi}
          </Text>

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Tujuan Pembelajaran
            </Text>
            {materi.tujuanPembelajaran.map((tujuan, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialIcons name="check-circle" size={20} color="#0C8EEC" />
                <Text className="text-gray-600 ml-2">{tujuan}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Capaian Pembelajaran
            </Text>
            {materi.capaianPembelajaran.map((capaian, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialIcons name="stars" size={20} color="#A92394" />
                <Text className="text-gray-600 ml-2">{capaian}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Sub Materi
            </Text>
            {materi.subMateri.map((subMateri, index) => (
              <TouchableOpacity
                key={subMateri.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                onPress={() => handleSubMateriPress(subMateri.id)}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#0C8EEC15] items-center justify-center">
                    <Text className="text-[#0C8EEC] font-bold">{index + 1}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-800">{subMateri.judul}</Text>
                    <Text className="text-gray-500 text-sm">Tap untuk membaca</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Video Pembelajaran
            </Text>
            {materi.videoMateri.map((video) => (
              <TouchableOpacity
                key={video.id}
                className="bg-white rounded-xl overflow-hidden mb-3 shadow-sm"
                onPress={() => handleVideoPress(video.id)}
              >
                <Image
                  source={{ uri: video.thumbnailUrl }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="font-medium text-gray-800 mb-1">{video.judul}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#0C8EEC" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {Math.floor(video.durasi / 60)}:{(video.durasi % 60).toString().padStart(2, '0')} menit
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}