// services/quizService.ts
import api from "@/lib/api";
import {
  APIResponse,
  Quiz,
  QuizDetail,
  MultipleChoiceAnswer,
  EssayAnswer,
  MultipleChoiceSubmitResponse,
  EssaySubmitResponse,
  QuizResult,
  QuizResultDetail,
  QuizRanking,
} from "@/types/quiz";
import axios from "axios";

class QuizService {
  async getQuizList(materiId: string): Promise<APIResponse<Quiz[]>> {
    try {
      const response = await api.get<APIResponse<Quiz[]>>('/quiz', {
        params: { materiId },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'Quiz tidak ditemukan untuk materi ini',
            error: 'NOT_FOUND'
          };
        }
      }
      throw this.handleError(error);
    }
  }

  async getQuizDetail(quizId: string): Promise<APIResponse<QuizDetail>> {
    try {
      const response = await api.get<APIResponse<QuizDetail>>(
        `/quiz/${quizId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          message: 'Quiz tidak ditemukan',
          error: 'NOT_FOUND'
        };
      }
      throw this.handleError(error);
    }
  }

  async submitMultipleChoiceAnswers(
    quizId: string,
    answers: MultipleChoiceAnswer[]
  ): Promise<APIResponse<MultipleChoiceSubmitResponse>> {
    try {
      const response = await api.post<
        APIResponse<MultipleChoiceSubmitResponse>
      >(`/quiz/${quizId}/answers`, { answers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error(
          "Quiz ini sudah pernah dikerjakan. Silakan kerjakan quiz lainnya."
        );
      }
      throw this.handleError(error);
    }
  }

  async submitEssayAnswer(
    quizId: string,
    answer: EssayAnswer
  ): Promise<APIResponse<EssaySubmitResponse>> {
    try {
      const response = await api.post<APIResponse<EssaySubmitResponse>>(
        `/quiz/${quizId}/answers`,
        answer
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error(
          "Soal ini sudah pernah dijawab. Silakan kerjakan soal lainnya."
        );
      }
      throw this.handleError(error);
    }
  }

  async getQuizResults(params: {
    materiId?: string;
    type?: "MULTIPLE_CHOICE" | "ESSAY";
  }): Promise<APIResponse<{ scores: QuizResult[] }>> {
    try {
      const response = await api.get<APIResponse<{ scores: QuizResult[] }>>(
        "/quiz/scores/user",
        { params }
      );

      // Format waktu sebelum mengembalikan response
      if (response.data.success && response.data.data?.scores) {
        response.data.data.scores = response.data.data.scores.map((score) => ({
          ...score,
          progress: {
            ...score.progress,
            lastSubmitted: this.formatDate(score.progress.lastSubmitted),
          },
        }));
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: true,
          data: { scores: [] },
          message: "Belum ada quiz yang dikerjakan",
        };
      }
      throw this.handleError(error);
    }
  }

  // Tambahkan helper method untuk format tanggal
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString; // Fallback ke format asli jika parsing gagal
    }
  }
  async getQuizResultDetail(
    quizId: string
  ): Promise<APIResponse<QuizResultDetail>> {
    try {
      const response = await api.get<APIResponse<QuizResultDetail>>(
        `/quiz/${quizId}/details`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getQuizRankings(quizId: string): Promise<APIResponse<QuizRanking>> {
    try {
      const response = await api.get<APIResponse<QuizRanking>>(
        `/quiz/${quizId}/scores`
      );
      
      if (response.data.success && response.data.data?.rankings) {
        // Format tanggal ke format Indonesia
        response.data.data.rankings = response.data.data.rankings.map(rank => ({
          ...rank,
          lastSubmitted: new Date(rank.lastSubmitted).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        }));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            return {
              success: false,
              message: 'Data ranking tidak ditemukan',
              error: 'NOT_FOUND'
            };
          case 401:
            return {
              success: false, 
              message: 'Sesi Anda telah berakhir. Silakan login kembali',
              error: 'UNAUTHORIZED'
            };
          default:
            return {
              success: false,
              message: error.response?.data?.message || 'Gagal memuat ranking',
              error: 'SERVER_ERROR'
            };
        }
      }
      throw this.handleError(error);
    }
  }

  async getUserQuizResults(params: {
    materiId: string;
    type?: 'MULTIPLE_CHOICE' | 'ESSAY';
  }): Promise<APIResponse<{ scores: QuizResult[] }>> {
    try {
      const response = await api.get<APIResponse<{ scores: QuizResult[] }>>(
        '/quiz/scores/user',
        { params }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: true,
          data: { scores: [] },
          message: 'Belum ada quiz yang dikerjakan'
        };
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`);
        case 401:
          return new Error('Sesi Anda telah berakhir. Silakan login kembali');
        case 403:
          return new Error('Anda tidak memiliki akses untuk quiz ini');
        case 404:
          return new Error('Data tidak ditemukan');
        case 409:
          return new Error('Quiz ini sudah pernah dikerjakan sebelumnya');
        case 500:
          return new Error('Terjadi kesalahan pada server');
        default:
          return new Error(message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
    return new Error('Terjadi kesalahan yang tidak diketahui');
  }
}

export const quizService = new QuizService();
