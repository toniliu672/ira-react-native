// types/api.ts
export interface APIResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }

  export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
  }
  
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    deviceId: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    activeStatus: boolean;
    createdAt: string;
    updatedAt: string;
  }