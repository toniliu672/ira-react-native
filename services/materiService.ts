import api from '../lib/api';
import { ApiResponse, Materi, MateriDetail, MateriListResponse, SubMateri, VideoMateri } from '../types/materi';

class MateriService {
  async getMateriList(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<MateriListResponse>> {
    try {
      const response = await api.get<ApiResponse<MateriListResponse>>('/materi', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMateriDetail(materiId: string): Promise<ApiResponse<MateriDetail>> {
    try {
      const response = await api.get<ApiResponse<MateriDetail>>(`/materi/${materiId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubMateriList(materiId: string, search?: string): Promise<ApiResponse<SubMateri[]>> {
    try {
      const response = await api.get<ApiResponse<SubMateri[]>>(`/materi/${materiId}/sub`, {
        params: { search },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubMateriDetail(materiId: string, subId: string): Promise<ApiResponse<SubMateri>> {
    try {
      const response = await api.get<ApiResponse<SubMateri>>(`/materi/${materiId}/sub/${subId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVideoMateriList(materiId: string, search?: string): Promise<ApiResponse<VideoMateri[]>> {
    try {
      const response = await api.get<ApiResponse<VideoMateri[]>>(`/materi/${materiId}/video`, {
        params: { search },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVideoMateriDetail(materiId: string, videoId: string): Promise<ApiResponse<VideoMateri>> {
    try {
      const response = await api.get<ApiResponse<VideoMateri>>(`/materi/${materiId}/video/${videoId}`);
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

export const materiService = new MateriService();