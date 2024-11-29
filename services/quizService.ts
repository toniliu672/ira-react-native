// services/quizService.ts
import api from '@/lib/api';
import { APIResponse } from '@/types/api';
import { 
  Quiz, 
  QuizDetail,
  MultipleChoiceAnswer,
  EssayAnswer,
  QuizResult,
  MultipleChoiceSubmissionResult,
  EssaySubmissionResult
} from '@/types/quiz';

class QuizService {
  async getQuizList(materiId: string): Promise<APIResponse<Quiz[]>> {
    try {
      const response = await api.get<APIResponse<Quiz[]>>(`/quiz`, {
        params: { materiId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getQuizDetail(quizId: string): Promise<APIResponse<QuizDetail>> {
    try {
      const response = await api.get<APIResponse<QuizDetail>>(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitMultipleChoiceAnswers(
    quizId: string, 
    answers: MultipleChoiceAnswer[]
  ): Promise<APIResponse<MultipleChoiceSubmissionResult>> {
    try {
      const response = await api.post<APIResponse<MultipleChoiceSubmissionResult>>(
        `/quiz/${quizId}/answers`,
        { answers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitEssayAnswer(
    quizId: string, 
    answer: EssayAnswer
  ): Promise<APIResponse<EssaySubmissionResult>> {
    try {
      const response = await api.post<APIResponse<EssaySubmissionResult>>(
        `/quiz/${quizId}/answers`,
        answer
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getQuizResults(params?: {
    materiId?: string;
    type?: 'MULTIPLE_CHOICE' | 'ESSAY';
  }): Promise<APIResponse<QuizResult[]>> {
    try {
      const response = await api.get<APIResponse<QuizResult[]>>('/quiz/results', {
        params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unexpected error occurred');
  }
}

export const quizService = new QuizService();