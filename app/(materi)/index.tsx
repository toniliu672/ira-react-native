// app/(materi)/index.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { materiService } from '@/services/materiService';
import { Materi } from '@/types/materi';
import { MateriCard } from '@/components/materi/MateriCard';
import { ErrorView } from '@/components/commons/ErrorView';

export default function MateriScreen() {
  const [materials, setMaterials] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMaterials = async (pageNum: number, refresh = false) => {
    try {
      setError(null);
      const response = await materiService.getMateriList({
        page: pageNum,
        search: searchQuery,
        limit: 10
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch materials');
      }

      const { materi, total } = response.data;
      
      setMaterials(prev => refresh ? materi : [...prev, ...materi]);
      setHasMore(materials.length < total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaterials(1, true);
    }, [searchQuery])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchMaterials(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMaterials(nextPage);
    }
  };

  const handleMateriPress = (materiId: string) => {
    router.push({
      pathname: "./[id]",
      params: { id: materiId }
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
    return <ErrorView message={error} onRetry={handleRefresh} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-2 bg-white">
        <Searchbar
          placeholder="Cari materi..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          className="rounded-xl bg-gray-50"
          iconColor="#0C8EEC"
        />
      </View>

      <FlatList
        data={materials}
        renderItem={({ item }) => (
          <MateriCard
            materi={item}
            onPress={() => handleMateriPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">Tidak ada materi ditemukan</Text>
          </View>
        }
      />
    </View>
  );
}