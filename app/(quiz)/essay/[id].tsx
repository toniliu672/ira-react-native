// app/(quiz)/essay/[id].tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, BackHandler, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { quizService } from '@/services/quizService';
import { QuizDetail } from '@/types/quiz';
import { ErrorView } from '@/components/commons/ErrorView';

export default function EssayQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Konfirmasi',
        'Yakin ingin keluar? Progress quiz akan hilang.',
        [
          { text: 'Tidak', style: 'cancel' },
          { text: 'Ya', onPress: () => router.back() }
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizDetail(id);
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Gagal memuat quiz');
        }
        setQuizDetail(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handleNextQuestion = () => {
    if (!quizDetail?.questions) return;
    
    if (currentQuestionIndex < quizDetail.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const validateAnswers = () => {
    if (!quizDetail?.questions) return false;

    const unansweredQuestions = quizDetail.questions.filter(
      q => !answers[q.id] || answers[q.id].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Peringatan',
        `Masih ada ${unansweredQuestions.length} soal yang belum dijawab. Yakin ingin mengumpulkan?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ya', onPress: handleSubmitAnswers }
        ]
      );
      return false;
    }

    return true;
  };

  const handleSubmitAnswers = async () => {
    if (!quizDetail?.questions) return;

    try {
      setSubmitting(true);
      
      // Submit semua jawaban essay secara berurutan
      for (const question of quizDetail.questions) {
        const answer = answers[question.id];
        if (!answer || answer.trim() === '') continue;

        const response = await quizService.submitEssayAnswer(id, {
          soalId: question.id,
          jawaban: answer.trim()
        });

        if (!response.success) {
          throw new Error(`Gagal menyimpan jawaban untuk soal ${question.id}`);
        }
      }

      router.replace({
        pathname: "./(quiz)/results",
        params: { id: quizDetail.quiz.id }
      });

    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Gagal mengirim jawaban'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#A92394" />
      </View>
    );
  }

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
        </View>
        
        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View 
            className="h-full bg-[#A92394]" 
            style={{
              width: `${((currentQuestionIndex + 1) / quizDetail.questions.length) * 100}%`
            }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <Animated.View entering={FadeInDown}>
          <View className="mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              {currentQuestion.pertanyaan}
            </Text>

            <TextInput
              value={answers[currentQuestion.id] || ''}
              onChangeText={(text) => handleAnswerChange(currentQuestion.id, text)}
              multiline
              numberOfLines={8}
              mode="outlined"
              outlineColor="#A92394"
              activeOutlineColor="#A92394"
              placeholder="Ketik jawaban Anda di sini..."
              className="bg-white"
              style={{ minHeight: 200 }}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100 flex-row gap-3">
        <Button
          mode="outlined"
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          style={{ flex: 1, borderColor: '#A92394' }}
          textColor="#A92394"
          contentStyle={{ height: 50 }}
        >
          Sebelumnya
        </Button>
        
        {currentQuestionIndex < quizDetail.questions.length - 1 ? (
          <Button
            mode="contained"
            onPress={handleNextQuestion}
            disabled={submitting}
            buttonColor="#A92394"
            contentStyle={{ height: 50 }}
            style={{ flex: 1 }}
          >
            Selanjutnya
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => validateAnswers() && handleSubmitAnswers()}
            loading={submitting}
            disabled={submitting}
            buttonColor="#A92394"
            contentStyle={{ height: 50 }}
            style={{ flex: 1 }}
          >
            Selesai
          </Button>
        )}
      </View>
    </View>
  );
}