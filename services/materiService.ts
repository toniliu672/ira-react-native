import api from '../lib/api';
import axios from 'axios';
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
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            return {
              success: false,
              message: 'Materi tidak ditemukan',
              error: 'NOT_FOUND'
            };
          case 401:
            return {
              success: false,
              message: 'Sesi Anda telah berakhir, silakan login kembali',
              error: 'UNAUTHORIZED'
            };
          default:
            return {
              success: false,
              message: error.response?.data?.message || 'Terjadi kesalahan pada server',
              error: 'SERVER_ERROR'
            };
        }
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          message: 'Sub materi tidak ditemukan',
          error: 'NOT_FOUND'
        };
      }
      throw this.handleError(error);
    }
  }

  async getSubMateriDetail(materiId: string, subId: string): Promise<ApiResponse<SubMateri>> {
    try {
      const response = await api.get<ApiResponse<SubMateri>>(`/materi/${materiId}/sub/${subId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          message: 'Detail sub materi tidak ditemukan',
          error: 'NOT_FOUND'
        };
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          message: 'Video materi tidak ditemukan',
          error: 'NOT_FOUND'
        };
      }
      throw this.handleError(error);
    }
  }

  async getVideoMateriDetail(materiId: string, videoId: string): Promise<ApiResponse<VideoMateri>> {
    try {
      const response = await api.get<ApiResponse<VideoMateri>>(`/materi/${materiId}/video/${videoId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          message: 'Detail video tidak ditemukan',
          error: 'NOT_FOUND'
        };
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      // Handle common HTTP errors
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`);
        case 401:
          return new Error('Sesi Anda telah berakhir, silakan login kembali');
        case 403:
          return new Error('Anda tidak memiliki akses ke materi ini');
        case 404:
          return new Error('Data tidak ditemukan');
        case 500:
          return new Error('Terjadi kesalahan pada server');
        default:
          return new Error(message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
    return new Error('Terjadi kesalahan yang tidak diketahui');
  }
}

export const materiService = new MateriService();