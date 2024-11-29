// app/(quiz)/multiple-choice/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { QuizDetail, QuizQuestion } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import { ErrorView } from '@/components/commons/ErrorView';

const QUESTIONS_PER_QUIZ = 10;
const SECONDS_PER_QUESTION = 10;

export default function MultipleChoiceQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  // Fetch and randomize questions
  useFocusEffect(
    useCallback(() => {
      const fetchQuiz = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await quizService.getQuizDetail(id);
          
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Gagal memuat quiz');
          }

          setQuizDetail(response.data);

          // Randomize and limit questions
          const shuffled = [...response.data.questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, QUESTIONS_PER_QUIZ);
          
          setRandomizedQuestions(shuffled);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
          setLoading(false);
        }
      };

      fetchQuiz();
    }, [id])
  );

  // Timer logic
  useEffect(() => {
    if (loading || !randomizedQuestions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto submit on time's up
          handleNextQuestion();
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, currentQuestionIndex, randomizedQuestions]);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = randomizedQuestions[currentQuestionIndex];
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }));

    // Move to next question or finish
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(SECONDS_PER_QUESTION);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      if (!quizDetail) return;

      const mcAnswers = Object.entries(answers).map(([soalId, jawaban]) => ({
        soalId,
        jawaban
      }));

      const response = await quizService.submitMultipleChoiceAnswers(id, mcAnswers);
      
      if (response.success && response.data) {
        // Navigate to results with score data
        router.replace({
          pathname: '/(quiz)/multiple-choice/result',
          params: { 
            score: response.data.totalScore,
            total: randomizedQuestions.length,
            correct: response.data.results.filter(r => r.isCorrect).length
          }
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengirim jawaban');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  if (!quizDetail || !randomizedQuestions.length) return null;

  const currentQuestion = randomizedQuestions[currentQuestionIndex];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-gray-800">
            Soal {currentQuestionIndex + 1} dari {QUESTIONS_PER_QUIZ}
          </Text>
          <View className="flex-row items-center bg-[#0C8EEC15] px-3 py-1 rounded-full">
            <MaterialIcons name="timer" size={18} color="#0C8EEC" />
            <Text className="ml-1 font-medium text-[#0C8EEC]">
              {timeLeft}s
            </Text>
          </View>
        </View>
        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View 
            className="h-full bg-[#0C8EEC]" 
            style={{
              width: `${((currentQuestionIndex + 1) / QUESTIONS_PER_QUIZ) * 100}%`
            }}
          />
        </View>
      </View>

      {/* Question */}
      <View className="flex-1 p-4">
        <Animated.View 
          entering={FadeInDown}
          className="mb-6"
        >
          <Text className="text-lg font-medium text-gray-800 mb-4">
            {currentQuestion.pertanyaan}
          </Text>

          {currentQuestion.opsiJawaban?.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedAnswer(index)}
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
      </View>

      {/* Bottom Button */}
      <View className="p-4 bg-white border-t border-gray-100">
        <Button
          mode="contained"
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
          buttonColor="#0C8EEC"
          contentStyle={{ height: 50 }}
        >
          {currentQuestionIndex < randomizedQuestions.length - 1 ? 'Selanjutnya' : 'Selesai'}
        </Button>
      </View>
    </View>
  );
}