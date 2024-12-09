// app/(quiz)/multiple-choice/[id].tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { quizService } from "@/services/quizService";
import { QuizDetail } from "@/types/quiz";
import { ErrorView } from "@/components/commons/ErrorView";

const TOTAL_QUIZ_TIME = 90;

interface AnswerMap {
  [questionId: string]: number;
}

export default function MultipleChoiceQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const submitLockRef = useRef(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Konfirmasi Keluar",
          "Apakah Anda yakin ingin keluar? Semua jawaban akan hilang dan quiz akan dibatalkan.",
          [
            { text: "Tidak", style: "cancel" },
            {
              text: "Ya, Keluar",
              style: "destructive",
              onPress: () => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
                router.back();
              },
            },
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizDetail(id);
        if (!response.success || !response.data) {
          throw new Error(response.message || "Gagal memuat quiz");
        }
        setQuizDetail(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (loading || !quizDetail?.questions || isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizComplete(true);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, quizDetail, isSubmitted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!quizDetail) return;

    const currentQuestionId = quizDetail.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: answerIndex,
    }));
    setSelectedAnswer(answerIndex);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && quizDetail) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQuestionId = quizDetail.questions[currentQuestionIndex - 1].id;
      setSelectedAnswer(answers[prevQuestionId] ?? null);
    }
  };

  const handleNextQuestion = () => {
    if (!quizDetail) return;

    if (currentQuestionIndex < quizDetail.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestionId = quizDetail.questions[currentQuestionIndex + 1].id;
      setSelectedAnswer(answers[nextQuestionId] ?? null);
    } else {
      showSubmitConfirmation();
    }
  };

  const showSubmitConfirmation = () => {
    if (!quizDetail) return;

    const unansweredCount =
      quizDetail.questions.length - Object.keys(answers).length;

    Alert.alert(
      "Konfirmasi Pengumpulan",
      unansweredCount > 0
        ? `Masih ada ${unansweredCount} soal yang belum dijawab. Yakin ingin mengumpulkan?`
        : "Yakin ingin mengumpulkan jawaban?",
      [
        { text: "Periksa Lagi", style: "cancel" },
        { text: "Ya, Kumpulkan", onPress: () => handleQuizComplete() },
      ]
    );
  };

  const handleQuizComplete = async (isAutoSubmit = false) => {
    if (!quizDetail?.questions || isSubmitted || submitLockRef.current) return;

    try {
      submitLockRef.current = true;
      setSubmitting(true);
      setIsSubmitted(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const formattedAnswers = quizDetail.questions.map((q) => ({
        soalId: q.id,
        jawaban: answers[q.id] ?? 0,
      }));

      const response = await quizService.submitMultipleChoiceAnswers(
        id,
        formattedAnswers
      );

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan jawaban");
      }

      if (isAutoSubmit) {
        Alert.alert(
          "Waktu Habis",
          "Quiz telah otomatis dikumpulkan karena waktu sudah habis.",
          [{ text: "OK", onPress: () => router.replace("/(papan_skor)") }]
        );
      } else {
        router.replace("/(papan_skor)");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Gagal mengirim jawaban"
      );
      setIsSubmitted(false);
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  };

  if (error) {
    return <ErrorView message={error} />;
  }

  if (!quizDetail?.questions) return null;

  const currentQuestion = quizDetail.questions[currentQuestionIndex];

  return (
    <View className="flex-1 bg-white">
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-gray-800">
            Soal {currentQuestionIndex + 1} dari {quizDetail.questions.length}
          </Text>
          <View
            className={`flex-row items-center px-3 py-1 rounded-full ${
              timeLeft <= 30 ? "bg-red-100" : "bg-[#0C8EEC15]"
            }`}
          >
            <MaterialIcons
              name="timer"
              size={18}
              color={timeLeft <= 30 ? "#DC2626" : "#0C8EEC"}
            />
            <Text
              className={`ml-1 font-medium ${
                timeLeft <= 30 ? "text-red-600" : "text-[#0C8EEC]"
              }`}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-[#0C8EEC]"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quizDetail.questions.length) * 100
              }%`,
            }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <Animated.View entering={FadeInDown}>
          <Text className="text-lg font-medium text-gray-800 mb-4">
            {currentQuestion.pertanyaan}
          </Text>

          {currentQuestion.opsiJawaban?.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              className={`flex-row items-center p-4 mb-3 rounded-xl border ${
                selectedAnswer === index
                  ? "bg-[#0C8EEC15] border-[#0C8EEC]"
                  : "bg-white border-gray-200"
              }`}
              activeOpacity={0.7}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                  selectedAnswer === index
                    ? "border-[#0C8EEC]"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswer === index && (
                  <View className="w-3 h-3 rounded-full bg-[#0C8EEC]" />
                )}
              </View>
              <Text
                className={`flex-1 ${
                  selectedAnswer === index
                    ? "text-[#0C8EEC] font-medium"
                    : "text-gray-700"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100 flex-row gap-2">
        <Button
          mode="text"
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting || isSubmitted}
          className="flex-1 bg-gray-100"
          textColor="#666666"
          contentStyle={{ height: 50 }}
        >
          Sebelumnya
        </Button>

        <Button
          mode="contained"
          onPress={handleNextQuestion}
          loading={submitting}
          disabled={selectedAnswer === null || submitting || isSubmitted}
          className="flex-1 bg-[#0C8EEC]"
          textColor="#FFFFFF"
          contentStyle={{ height: 50 }}
        >
          {currentQuestionIndex < quizDetail!.questions.length - 1
            ? "Selanjutnya"
            : "Selesai"}
        </Button>
      </View>
    </View>
  );
}
