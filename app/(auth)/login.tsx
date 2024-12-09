// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "../../components/AuthInput";
import UniversalButton from "../../components/UniversalButton";
import { useAuth } from "../../context/AuthContext";
import { LoginRequest } from "../../types/auth";

type ErrorState = {
  type: "username" | "password" | "server" | null;
  message: string;
};

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    type: null,
    message: "",
  });
  const [attempts, setAttempts] = useState(0);
  const { login, loading } = useAuth();

  const getErrorMessage = (error: unknown): ErrorState => {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes("429")) {
        return {
          type: "server",
          message:
            "Terlalu banyak percobaan. Silakan tunggu beberapa saat sebelum mencoba lagi.",
        };
      }
      if (error.message.includes("401")) {
        return {
          type: "password",
          message: "Username atau password salah. Silakan coba lagi.",
        };
      }
      if (error.message.includes("500")) {
        return {
          type: "server",
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        };
      }
    }
    return {
      type: "server",
      message:
        "Gagal masuk. Silakan periksa koneksi internet Anda dan coba lagi.",
    };
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setErrorState({
        type: "username",
        message: "Username tidak boleh kosong",
      });
      return false;
    }
    if (!formData.password) {
      setErrorState({
        type: "password",
        message: "Password tidak boleh kosong",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      setErrorState({ type: null, message: "" });

      if (!validateForm()) return;

      if (attempts >= 5) {
        setErrorState({
          type: "server",
          message:
            "Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.",
        });
        return;
      }

      await login(formData);
    } catch (err) {
      setAttempts((prev) => prev + 1);
      const error = getErrorMessage(err);
      setErrorState(error);

      // Show alert for server errors
      if (error.type === "server") {
        Alert.alert("Gagal Masuk", error.message, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-6 justify-center">
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className="items-center mb-10"
        >
          <Text className="text-4xl font-bold mb-2">
            <Text style={{ color: "#A92394" }}>A</Text>
            <Text style={{ color: "#0C8EEC" }}>IRA</Text>
          </Text>
          <Text className="text-gray-500 text-center">
            Media Pembelajaran Dinamis & Fleksibel
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className="space-y-4"
        >
          <View>
            <AuthInput
              icon="user"
              placeholder="Username"
              value={formData.username}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, username: text }));
                setErrorState((prev) =>
                  prev.type === "username" ? { type: null, message: "" } : prev
                );
              }}
              autoCapitalize="none"
              error={errorState.type === "username"}
            />
            {errorState.type === "username" && (
              <Text className="text-red-500 text-sm ml-1 mt-1">
                {errorState.message}
              </Text>
            )}
          </View>

          <View>
            <AuthInput
              icon="lock"
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, password: text }));
                setErrorState((prev) =>
                  prev.type === "password" ? { type: null, message: "" } : prev
                );
              }}
              secureTextEntry
              error={errorState.type === "password"}
            />
            {errorState.type === "password" && (
              <Text className="text-red-500 text-sm ml-1 mt-1">
                {errorState.message}
              </Text>
            )}
          </View>

          <View className="items-center mt-6">
            <UniversalButton
              title={loading ? "Sedang Masuk..." : "Masuk"}
              onPress={handleLogin}
              backgroundColor="#0C8EEC"
              textColor="#FFFFFF"
              width={undefined}
              height={56}
              disabled={loading}
            />

            {loading && (
              <ActivityIndicator
                size="small"
                color="#0C8EEC"
                style={{ marginTop: 10 }}
              />
            )}
          </View>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Belum punya akun? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-[#0C8EEC] font-medium">
                  Daftar Sekarang
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#0C8EEC" />
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
