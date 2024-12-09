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
      const response = await api.get<APIResponse<Quiz[]>>("/quiz", {
        params: { materiId },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getQuizDetail(quizId: string): Promise<APIResponse<QuizDetail>> {
    try {
      // Pastikan endpoint sesuai dengan API docs
      const response = await api.get<APIResponse<QuizDetail>>(
        `/quiz/${quizId}`
      );
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors
      switch (error.response?.status) {
        case 409:
          return new Error("Quiz ini sudah pernah dikerjakan sebelumnya");
        case 401:
          return new Error("Sesi Anda telah berakhir. Silakan login kembali");
        case 403:
          return new Error(
            "Anda tidak memiliki akses untuk mengerjakan quiz ini"
          );
        case 404:
          return new Error("Quiz tidak ditemukan");
        default:
          return new Error(
            error.response?.data?.message || "Terjadi kesalahan pada server"
          );
      }
    }
    return new Error("Terjadi kesalahan yang tidak diketahui");
  }
}

export const quizService = new QuizService();
