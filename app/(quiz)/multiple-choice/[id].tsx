// app/(quiz)/multiple-choice/[id].tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { quizService } from '@/services/quizService';
import { QuizDetail, MultipleChoiceAnswer } from '@/types/quiz';
import { ErrorView } from '@/components/commons/ErrorView';

const SECONDS_PER_QUESTION = 10;

export default function MultipleChoiceQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<MultipleChoiceAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

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

  // Reset and start timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(SECONDS_PER_QUESTION);
  }, []);

  const handleTimeUp = useCallback(() => {
    if (!quizDetail?.questions) return;
    
    const currentQuestion = quizDetail.questions[currentQuestionIndex];

    // Auto-submit with selected answer or default to 0
    setAnswers(prev => [
      ...prev,
      { soalId: currentQuestion.id, jawaban: selectedAnswer ?? 0 }
    ]);

    if (currentQuestionIndex < quizDetail.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      resetTimer();
    } else {
      handleQuizComplete();
    }
  }, [currentQuestionIndex, quizDetail, selectedAnswer]);

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

  // Timer logic
  useEffect(() => {
    if (loading || !quizDetail?.questions) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, currentQuestionIndex, quizDetail, handleTimeUp]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (!quizDetail?.questions || selectedAnswer === null) return;

    const currentQuestion = quizDetail.questions[currentQuestionIndex];
    setAnswers(prev => [
      ...prev,
      { soalId: currentQuestion.id, jawaban: selectedAnswer }
    ]);

    if (currentQuestionIndex < quizDetail.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      resetTimer();
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!quizDetail?.questions) return;
  
    try {
      setSubmitting(true);
      
      const answersArray = answers.map(answer => ({
        soalId: answer.soalId,
        jawaban: answer.jawaban
      }));
  
      const response = await quizService.submitMultipleChoiceAnswers(id, answersArray);
      
      if (!response.success) {
        throw new Error(response.message || 'Gagal menyimpan jawaban');
      }
  
      // Redirect ke papan skor tanpa params, nanti user pilih materi di halaman papan skor
      router.replace("/(papan_skor)"); 
      
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Gagal mengirim jawaban'
      );
    } finally {
      setSubmitting(false);
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
          <View className={`flex-row items-center px-3 py-1 rounded-full ${
            timeLeft <= 5 ? 'bg-red-100' : 'bg-[#0C8EEC15]'
          }`}>
            <MaterialIcons 
              name="timer" 
              size={18} 
              color={timeLeft <= 5 ? '#DC2626' : '#0C8EEC'} 
            />
            <Text className={`ml-1 font-medium ${
              timeLeft <= 5 ? 'text-red-600' : 'text-[#0C8EEC]'
            }`}>
              {timeLeft}s
            </Text>
          </View>
        </View>
        
        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View 
            className="h-full bg-[#0C8EEC]" 
            style={{
              width: `${((currentQuestionIndex + 1) / quizDetail.questions.length) * 100}%`
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
                  ? 'bg-[#0C8EEC15] border-[#0C8EEC]'
                  : 'bg-white border-gray-200'
              }`}
              activeOpacity={0.7}
            >
              <View 
                className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-[#0C8EEC]'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === index && (
                  <View className="w-3 h-3 rounded-full bg-[#0C8EEC]" />
                )}
              </View>
              <Text 
                className={`flex-1 ${
                  selectedAnswer === index
                    ? 'text-[#0C8EEC] font-medium'
                    : 'text-gray-700'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100">
        <Button
          mode="contained"
          onPress={handleNextQuestion}
          loading={submitting}
          disabled={selectedAnswer === null || submitting}
          buttonColor="#0C8EEC"
          contentStyle={{ height: 50 }}
        >
          {currentQuestionIndex < quizDetail.questions.length - 1 ? 'Selanjutnya' : 'Selesai'}
        </Button>
      </View>
    </View>
  );
}