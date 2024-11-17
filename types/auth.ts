// types/auth.ts

// Base types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth related types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  gender: "MALE" | "FEMALE";
  activeStatus: boolean;
  phone?: string | null;
  address?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  gender: "MALE" | "FEMALE";
  phone?: string;
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

// password inteface 
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string | null;
  address?: string | null;
}

// Interface untuk response update profile
export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: User;
}

// Interface untuk response update password
export interface PasswordUpdateResponse {
  success: boolean;
  message: string;
}