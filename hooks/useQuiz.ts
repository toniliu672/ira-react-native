// hooks/useQuiz.ts
import { useCallback, useState } from 'react';
import { Quiz, QuizDetail } from '@/types/quiz';
import { quizService } from '@/services/quizService';

export function useQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);

  const fetchQuizDetail = useCallback(async (quizId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizDetail(quizId);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat detail quiz');
      }

      setQuizDetail(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    quizDetail,
    fetchQuizDetail
  };
}