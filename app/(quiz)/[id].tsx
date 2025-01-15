// app/(quiz)/[id].tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {
  QuizDetail,
  QuizQuestion,
  MultipleChoiceAnswer,
  EssayAnswer,
} from "@/types/quiz";
import { useQuiz } from "@/context/QuizContext";
import { quizService } from "@/services/quizService";
import { ErrorView } from "@/components/commons/ErrorView";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AnswerState {
  [key: string]: number | string;
}

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setLastCompletedQuiz } = useQuiz(); // Tambahkan ini
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizDetail(id);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail quiz");
      }

      setQuizDetail(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuizDetail();
    }, [id])
  );

  const handleAnswerSelect = (questionId: string, answer: number | string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizDetail) return;

    const unansweredQuestions = quizDetail.questions.filter(
      (q) => !answers[q.id]
    ).length;

    if (unansweredQuestions > 0) {
      Alert.alert(
        "Konfirmasi",
        `Masih ada ${unansweredQuestions} soal yang belum dijawab. Yakin ingin mengumpulkan?`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Kumpulkan", onPress: submitAnswers },
        ]
      );
    } else {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    if (!quizDetail) return;

    try {
      setSubmitting(true);

      if (quizDetail.quiz.type === "MULTIPLE_CHOICE") {
        const mcAnswers: MultipleChoiceAnswer[] = Object.entries(answers).map(
          ([soalId, jawaban]) => ({
            soalId,
            jawaban: jawaban as number,
          })
        );

        const response = await quizService.submitMultipleChoiceAnswers(
          id,
          mcAnswers
        );
        if (response.success && response.data) {
          // Update last completed quiz in context
          setLastCompletedQuiz({
            materiId: quizDetail.quiz.materiId,
            quizId: id,
            type: "MULTIPLE_CHOICE",
          });

          // Arahkan ke halaman result dengan data yang lengkap
          router.replace({
            pathname: "/(quiz)/multiple-choice/result",
            params: {
              score: response.data.avgScore.toString(),
              total: quizDetail.questions.length.toString(),
              correct: response.data.submitted.toString(),
            },
          });
        } else {
          throw new Error(response.message || "Gagal submit jawaban");
        }
      } else {
        // Handle Essay submission
        const essayPromises = Object.entries(answers).map(
          ([soalId, jawaban]) => {
            const essayAnswer: EssayAnswer = {
              soalId,
              jawaban: jawaban as string,
            };
            return quizService.submitEssayAnswer(id, essayAnswer);
          }
        );

        await Promise.all(essayPromises);

        // Update last completed quiz
        setLastCompletedQuiz({
          materiId: quizDetail.quiz.materiId,
          quizId: id,
          type: "ESSAY",
        });

        router.replace("/(quiz)/results");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal mengumpulkan jawaban";
      Alert.alert("Error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMultipleChoiceQuestion = (question: QuizQuestion) => (
    <View className="mb-6">
      <Text className="text-lg font-medium text-gray-800 mb-4">
        {question.pertanyaan}
      </Text>
      {question.opsiJawaban?.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswerSelect(question.id, index)}
          className={`flex-row items-center p-4 mb-3 rounded-xl border ${
            answers[question.id] === index
              ? "bg-[#0C8EEC15] border-[#0C8EEC]"
              : "bg-white border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <View
            className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
              answers[question.id] === index
                ? "border-[#0C8EEC]"
                : "border-gray-300"
            }`}
          >
            {answers[question.id] === index && (
              <View className="w-3 h-3 rounded-full bg-[#0C8EEC]" />
            )}
          </View>
          <Text
            className={`flex-1 ${
              answers[question.id] === index
                ? "text-[#0C8EEC] font-medium"
                : "text-gray-700"
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEssayQuestion = (question: QuizQuestion) => (
    <View className="mb-6">
      <Text className="text-lg font-medium text-gray-800 mb-4">
        {question.pertanyaan}
      </Text>
      <TextInput
        value={(answers[question.id] as string) || ""}
        onChangeText={(text) => handleAnswerSelect(question.id, text)}
        multiline
        numberOfLines={4}
        className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800"
        placeholder="Ketik jawaban Anda di sini..."
        textAlignVertical="top"
      />
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchQuizDetail} />;
  }

  if (!quizDetail) return null;

  const currentQuestion = quizDetail.questions[currentQuestionIndex];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Progress */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-gray-800">
            Soal {currentQuestionIndex + 1} dari {quizDetail.questions.length}
          </Text>
          <View className="flex-row items-center">
            <MaterialIcons
              name={
                quizDetail.quiz.type === "MULTIPLE_CHOICE"
                  ? "check-circle"
                  : "edit"
              }
              size={20}
              color="#666"
            />
            <Text className="ml-2 text-gray-500">
              {quizDetail.quiz.type === "MULTIPLE_CHOICE"
                ? "Multiple Choice"
                : "Essay"}
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
          {quizDetail.quiz.type === "MULTIPLE_CHOICE"
            ? renderMultipleChoiceQuestion(currentQuestion)
            : renderEssayQuestion(currentQuestion)}
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="p-4 bg-white border-t border-gray-100">
        <View className="flex-row justify-between">
          <Button
            mode="outlined"
            onPress={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
            style={{ borderColor: "#0C8EEC" }}
            textColor="#0C8EEC"
            className="flex-1 mr-2"
          >
            Sebelumnya
          </Button>
          {currentQuestionIndex < quizDetail.questions.length - 1 ? (
            <Button
              mode="contained"
              onPress={() => setCurrentQuestionIndex((prev) => prev + 1)}
              buttonColor="#0C8EEC"
              className="flex-1 ml-2"
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmitQuiz}
              loading={submitting}
              disabled={submitting}
              buttonColor="#0C8EEC"
              className="flex-1 ml-2"
            >
              Kumpulkan
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
