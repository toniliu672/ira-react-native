// app/(ranking)/quiz-list.tsx
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { quizService } from "@/services/quizService";
import type { Quiz } from "@/types/quiz";
import { ErrorView } from "@/components/commons/ErrorView";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function QuizListScreen() {
  const { materiId } = useLocalSearchParams<{ materiId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    if (!materiId) return;

    try {
      setLoading(true);
      const response = await quizService.getQuizList(materiId);
      if (response.success && response.data) {
        setQuizzes(response.data);
      }
    } catch (err) {
      setError("Gagal memuat daftar quiz");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuizzes();
    }, [materiId])
  );

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
    <FlatList
      data={quizzes}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
          <TouchableOpacity
            onPress={() => router.push(`/(ranking)/ranking?quizId=${item.id}`)}
            className="bg-white mx-4 mb-3 p-4 rounded-xl"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {item.judul}
                </Text>
                <Text className="text-gray-500">
                  {item.type === "MULTIPLE_CHOICE" ? "Pilihan Ganda" : "Essay"}
                </Text>
              </View>
              <MaterialIcons name="leaderboard" size={24} color="#22C55E" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
}
