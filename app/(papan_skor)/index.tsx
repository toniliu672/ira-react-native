// app/(papan_skor)/index.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ActivityIndicator, Menu, SegmentedButtons } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { quizService } from "@/services/quizService";
import { materiService } from "@/services/materiService";
import type { Materi } from "@/types/materi";
import type { QuizResult } from "@/types/quiz";
import { ErrorView } from "@/components/commons/ErrorView";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";
import { useQuiz } from "@/context/QuizContext";

type QuizType = "MULTIPLE_CHOICE" | "ESSAY";

export default function PapanSkorScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [quizType, setQuizType] = useState<QuizType>("MULTIPLE_CHOICE");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const { lastCompletedQuiz } = useQuiz();

  const fetchResults = async (materiId: string, type: QuizType) => {
    try {
      setError(null);
      setLoading(true);
      const response = await quizService.getQuizResults({
        materiId,
        type,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat hasil quiz");
      }

      setResults(response.data.scores);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setResults([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMateriList = async () => {
    try {
      const response = await materiService.getMateriList({});
      if (response.success && response.data) {
        setMateriList(response.data.materi);

        // Cek lastCompletedQuiz
        if (lastCompletedQuiz && lastCompletedQuiz.materiId) {
          const targetMateri = response.data.materi.find(
            (m) => m.id === lastCompletedQuiz.materiId
          );
          if (targetMateri) {
            setSelectedMateri(targetMateri);
            setQuizType(lastCompletedQuiz.type);
            await fetchResults(targetMateri.id, lastCompletedQuiz.type);
            return;
          }
        }

        // Fallback ke materi pertama jika tidak ada lastCompletedQuiz
        if (response.data.materi.length > 0) {
          const firstMateri = response.data.materi[0];
          setSelectedMateri(firstMateri);
          await fetchResults(firstMateri.id, quizType);
        }
      }
    } catch (err) {
      setError("Gagal memuat daftar materi");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMateriList();
    }, [])
  );

  // Scroll ke quiz yang baru selesai
  useEffect(() => {
    if (lastCompletedQuiz && results.length > 0) {
      const targetIndex = results.findIndex(
        (result) => result.quizId === lastCompletedQuiz.quizId
      );
      if (targetIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [lastCompletedQuiz, results]);

  const handleRefresh = () => {
    if (!selectedMateri) return;
    setRefreshing(true);
    fetchResults(selectedMateri.id, quizType);
  };

  const handleMateriChange = async (materi: Materi) => {
    setSelectedMateri(materi);
    setMenuVisible(false);
    await fetchResults(materi.id, quizType);
  };

  const handleTypeChange = async (type: QuizType) => {
    setQuizType(type);
    if (selectedMateri) {
      await fetchResults(selectedMateri.id, type);
    }
  };

  const renderScoreItem = ({
    item,
    index,
  }: {
    item: QuizResult;
    index: number;
  }) => {
    const isLastCompleted = lastCompletedQuiz?.quizId === item.quizId;
    
    // Format nilai: jika sudah > 1 berarti sudah dalam bentuk persentase, jika <= 1 berarti decimal
    const formattedScore = item.score > 1 ? item.score.toFixed(0) : (item.score * 100).toFixed(0);
  
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        className={`bg-white mx-4 mb-4 rounded-xl ${
          isLastCompleted ? "border border-[#0C8EEC]" : ""
        }`}
      >
        <View className="p-4">
          {/* Quiz Title */}
          <Text className="text-base font-medium text-gray-800 mb-4">
            {item.quizTitle}
          </Text>
  
          {/* Detail Section */}
          <View className="space-y-2">
            {/* Waktu Pengerjaan */}
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Soal Dikerjakan</Text>
              <Text className="text-[#0C8EEC] font-medium">
                {item.progress.lastSubmitted}
              </Text>
            </View>
  
            {/* Nilai */}
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500">Nilai</Text>
              <Text className="text-[#0C8EEC] font-medium">
                {formattedScore}
              </Text>
            </View>
          </View>
  
          {/* Progress Bar */}
          <View className="h-1 bg-[#0C8EEC15] rounded-full mt-4">
            <View
              className="h-full bg-[#0C8EEC] rounded-full"
              style={{
                width: `${(item.progress.completed / item.progress.total) * 100}%`,
              }}
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
      <MaterialIcons name="assignment" size={64} color="#CBD5E1" />
      <Text className="text-lg font-bold text-gray-800 text-center mt-4">
        Belum ada quiz yang dikerjakan
      </Text>
      <Text className="text-gray-500 text-center mt-2 px-8">
        Ayo mulai kerjakan quiz untuk melihat progress belajarmu!
      </Text>
      <Link href="/(quiz)" asChild>
        <TouchableOpacity
          className="mt-6 bg-[#0C8EEC] px-6 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-medium">Mulai Quiz</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Materi Selection Header */}
      <View className="bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          className="flex-row items-center justify-between px-4 py-3"
        >
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {selectedMateri?.judul || "Pilih Materi"}
            </Text>
            <Text className="text-sm text-gray-500">
              {selectedMateri
                ? `Materi ${selectedMateri.urutan}`
                : "Tap untuk memilih materi"}
            </Text>
          </View>
          <MaterialIcons
            name={menuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={28}
            color="#0C8EEC"
          />
        </TouchableOpacity>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={{ x: 0, y: 0 }}
          contentStyle={{ width: "100%", marginTop: 60 }}
        >
          {materiList.map((materi) => (
            <Menu.Item
              key={materi.id}
              onPress={() => handleMateriChange(materi)}
              title={materi.judul}
              leadingIcon={() => (
                <MaterialIcons
                  name={
                    selectedMateri?.id === materi.id
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={20}
                  color={selectedMateri?.id === materi.id ? "#0C8EEC" : "#666"}
                />
              )}
            />
          ))}
        </Menu>

        {/* Quiz Type Selector */}
        <View className="px-4 pb-3">
          <SegmentedButtons
            value={quizType}
            onValueChange={(value) => handleTypeChange(value as QuizType)}
            buttons={[
              {
                value: "MULTIPLE_CHOICE",
                label: "Pilihan Ganda",
                style: {
                  backgroundColor:
                    quizType === "MULTIPLE_CHOICE" ? "#0C8EEC" : "transparent",
                },
                checkedColor: "white",
                uncheckedColor: "#0C8EEC",
              },
              {
                value: "ESSAY",
                label: "Essay",
                style: {
                  backgroundColor:
                    quizType === "ESSAY" ? "#A92394" : "transparent",
                },
                checkedColor: "white",
                uncheckedColor: "#A92394",
              },
            ]}
          />
        </View>
      </View>

      {error ? (
        <ErrorView message={error} onRetry={handleRefresh} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={results}
          renderItem={renderScoreItem}
          keyExtractor={(item) => `${item.quizId}`}
          contentContainerStyle={{
            paddingVertical: 16,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={EmptyState}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              }
            });
          }}
        />
      )}
    </View>
  );
}