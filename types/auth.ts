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