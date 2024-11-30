// app/(papan_skor)/index.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Chip,
  ActivityIndicator,
  Menu,
  SegmentedButtons,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { quizService } from "@/services/quizService";
import { materiService } from "@/services/materiService";
import type { Materi } from "@/types/materi";
import { ErrorView } from "@/components/commons/ErrorView";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";

type QuizType = "MULTIPLE_CHOICE" | "ESSAY";
interface QuizResult {
  quizId: string;
  quizTitle: string;
  type: "MULTIPLE_CHOICE" | "ESSAY";
  score: number;
  progress: {
    completed: number;
    total: number;
    isComplete: boolean;
    lastSubmitted: string;
  };
}
export default function PapanSkorScreen() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [quizType, setQuizType] = useState<QuizType>("MULTIPLE_CHOICE");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

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

      // Filter berdasarkan tipe quiz yang dipilih
      const filteredScores = response.data.scores.filter(
        (score) => score.type === type
      );
      setResults(filteredScores);
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
    const progress = item.progress || {
      completed: 0,
      total: 0,
      isComplete: false,
    };
    const progressPercentage =
      progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            {item.quizTitle}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-sm mb-1">Soal Dikerjakan</Text>
            <Text className="text-2xl font-bold text-[#0C8EEC]">
              {progress.lastSubmitted}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm mb-1">Nilai</Text>
            <Text className="text-2xl font-bold text-[#0C8EEC]">
              {item.score.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View className="h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
          <View
            className={`h-full ${
              item.type === "MULTIPLE_CHOICE" ? "bg-[#0C8EEC]" : "bg-[#A92394]"
            }`}
            style={{
              width: `${progressPercentage}%`,
            }}
          />
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
          data={results}
          renderItem={renderScoreItem}
          keyExtractor={(item) => `${item.quizId}`}
          contentContainerStyle={{
            paddingVertical: 16,
            flexGrow: 1, // Penting untuk EmptyState di tengah
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={EmptyState}
        />
      )}
    </View>
  );
}
