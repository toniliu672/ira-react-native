// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { authService } from "../services/authService";
import { User, LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const userData = await SecureStore.getItemAsync("userData");

      if (token && userData) {
        setUser(JSON.parse(userData));
        authService.setAuthToken(token);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const storeUserData = async (accessToken: string, userData: User) => {
    try {
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("userData", JSON.stringify(userData));
      authService.setAuthToken(accessToken);
    } catch (error) {
      console.error("Failed to store user data:", error);
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      const { accessToken, user: userData } = response.data;

      await storeUserData(accessToken, userData);
      setUser(userData);

      // Only navigate after initialization is complete
      if (isInitialized) {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(data);

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      if (isInitialized) {
        router.replace("/login");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during registration";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("userData");

      try {
        await authService.logout();
      } catch (error) {
        console.error("API logout failed:", error);
      }

      setUser(null);

      if (isInitialized) {
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await SecureStore.setItemAsync("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  // Don't render children until initial auth check is complete
  if (loading && !isInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
