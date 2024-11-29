// app/(quiz)/essay/[id].tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { QuizDetail } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import { ErrorView } from '@/components/commons/ErrorView';
import { MaterialIcons } from '@expo/vector-icons';

export default function EssayQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchQuiz = async () => {
        try {
          setLoading(true);
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
    }, [id])
  );

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert('Error', 'Jawaban tidak boleh kosong');
      return;
    }

    try {
      setSubmitting(true);
      const soalId = quizDetail?.questions[0].id;
      if (!soalId) throw new Error('Invalid question ID');

      const response = await quizService.submitEssayAnswer(id, {
        soalId,
        jawaban: answer
      });

      if (response.success) {
        Alert.alert('Berhasil', 'Jawaban telah dikirim dan akan dinilai oleh guru', [
          { text: 'OK', onPress: () => router.replace('/(quiz)') }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Konfirmasi',
      'Yakin ingin keluar? Jawaban yang belum dikirim akan hilang.',
      [
        { text: 'Tidak', style: 'cancel' },
        { text: 'Ya', onPress: () => router.back() }
      ]
    );
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleExit
    );
    return () => backHandler.remove();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#A92394" />
      </View>
    );
  }

  if (error || !quizDetail) {
    return <ErrorView message={error || 'Quiz tidak ditemukan'} />;
  }

  const question = quizDetail.questions[0];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          {quizDetail.quiz.judul}
        </Text>

        <Text className="text-base text-gray-600 mb-6">
          {quizDetail.quiz.deskripsi}
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Pertanyaan:
          </Text>
          <Text className="text-base text-gray-700">
            {question.pertanyaan}
          </Text>
        </View>

        <TextInput
          value={answer}
          onChangeText={setAnswer}
          multiline
          numberOfLines={8}
          mode="outlined"
          outlineColor="#A92394"
          activeOutlineColor="#A92394"
          placeholder="Ketik jawaban Anda di sini..."
          className="bg-white mb-4"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || !answer.trim()}
          buttonColor="#A92394"
          contentStyle={{ height: 50 }}
          className="mt-4"
        >
          Kirim Jawaban
        </Button>
      </ScrollView>
    </View>
  );
}