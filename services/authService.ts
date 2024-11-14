// services/authService.ts
import api from '../lib/api';
import * as SecureStore from 'expo-secure-store';
import { LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from '../types/auth';

class AuthService {
  setAuthToken(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete api.defaults.headers.common['Authorization'];
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data?.accessToken) {
        this.setAuthToken(response.data.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>('/users', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      
      if (token) {
        this.setAuthToken(token);
        await api.post('/auth/logout');
      }

      this.clearAuthToken();
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } catch (error) {
      // Still clear tokens on error
      this.clearAuthToken();
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
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

export const authService = new AuthService();