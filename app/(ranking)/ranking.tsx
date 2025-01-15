// app/(ranking)/ranking.tsx
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { quizService } from "@/services/quizService";
import { QuizRanking } from "@/types/quiz";
import { ErrorView } from "@/components/commons/ErrorView";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function RankingScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const [ranking, setRanking] = useState<QuizRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await quizService.getQuizRankings(quizId);
      if (response.success && response.data) {
        setRanking(response.data);
      } else {
        throw new Error(response.message || "Gagal memuat ranking");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRanking();
    }, [quizId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRanking();
  }, [quizId]);

  const renderRankItem = ({
    item,
    index,
  }: {
    item: QuizRanking["rankings"][0];
    index: number;
  }) => {
    const isTop3 = index < 3;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        className={`
          mx-4 mb-3 p-4 rounded-xl
          ${item.isYou ? "bg-[#0C8EEC15] border border-[#0C8EEC]" : "bg-white"}
          ${isTop3 ? "border border-yellow-400" : ""}
        `}
      >
        <View className="flex-row items-center">
          {/* Rank Number/Icon */}
          <View
            className={`
              w-8 h-8 rounded-full items-center justify-center mr-3
              ${isTop3 ? "bg-yellow-400" : "bg-gray-100"}
            `}
          >
            {isTop3 ? (
              <MaterialIcons name="emoji-events" size={20} color="white" />
            ) : (
              <Text className="font-bold text-gray-600">{item.rank}</Text>
            )}
          </View>

          {/* User Info */}
          <View className="flex-1">
            <Text
              className={`font-bold ${
                item.isYou ? "text-[#0C8EEC]" : "text-gray-800"
              }`}
            >
              {item.name}
            </Text>
            <Text className="text-gray-500 text-sm">{item.lastSubmitted}</Text>
          </View>

          {/* Score */}
          <Text
            className={`
              text-lg font-bold
              ${isTop3 ? "text-yellow-500" : "text-gray-800"}
            `}
          >
            {item.score.toFixed(1)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchRanking} />;
  }

  if (!ranking?.rankings || !ranking?.user) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="emoji-events" size={64} color="#CBD5E1" />
        <Text className="text-lg font-bold text-center mt-4 text-gray-800">
          Belum ada data ranking
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Jadilah yang pertama mengerjakan quiz ini!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* User's Position Summary */}
      <View className="bg-white p-4 mb-4">
        <Text className="text-center text-gray-500 mb-2">Peringkat Kamu</Text>
        <Text className="text-center text-3xl font-bold text-[#0C8EEC]">
          {ranking.user?.rank || "-"}
        </Text>
        <Text className="text-center text-gray-500 mt-2">
          Nilai: {((ranking.user?.score || 0) * 100).toFixed(0)}
        </Text>
      </View>

      <FlatList
        data={ranking.rankings}
        renderItem={({ item }) => (
          <View
            className={`
            mx-4 mb-3 p-4 rounded-xl
            ${
              item.isYou ? "bg-[#0C8EEC15] border border-[#0C8EEC]" : "bg-white"
            }
          `}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-gray-100">
                <Text className="font-bold text-gray-600">{item.rank}</Text>
              </View>
              <View className="flex-1">
                <Text
                  className={
                    item.isYou ? "text-[#0C8EEC] font-bold" : "text-gray-800"
                  }
                >
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.lastSubmitted}
                </Text>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                {(item.score * 100).toFixed(0)}{" "}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.username}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
