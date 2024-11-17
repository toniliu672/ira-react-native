// app/(settings)/change-password.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { TextInput, Button, HelperText, Divider } from "react-native-paper";
import { Stack, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { ApiResponse, PasswordUpdateRequest } from "@/types/auth";
import { ApiErrorResponse } from "@/types/api";
import { API_CONFIG } from "@/lib/config";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Semua field harus diisi");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password baru tidak cocok");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const passwordData: PasswordUpdateRequest = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await api.put<ApiResponse<void>>(
        API_CONFIG.ENDPOINTS.UPDATE_PASSWORD,
        passwordData
      );

      if (response.data.success) {
        router.back();
      } else {
        setError(response.data.message || "Gagal mengubah password");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;

        switch (error.response.status) {
          case 400:
            setError(errorData.message || "Password saat ini tidak valid");
            break;
          case 401:
            setError("Sesi anda telah berakhir. Silakan login kembali");
            router.replace("/(auth)/login");
            break;
          case 429:
            setError(
              "Terlalu banyak percobaan. Silakan coba beberapa saat lagi"
            );
            break;
          default:
            setError(
              errorData.message || "Terjadi kesalahan. Silakan coba lagi nanti"
            );
        }
      } else {
        setError("Terjadi kesalahan jaringan. Periksa koneksi anda");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ubah Password",
          headerShown: true,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#0C8EEC",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-gray-50"
      >
        <ScrollView className="flex-1">
          <View className="bg-white p-6 mb-4">
            <View className="w-20 h-20 rounded-full bg-gray-100 self-center mb-4 items-center justify-center">
              <MaterialCommunityIcons name="lock" size={40} color="#0C8EEC" />
            </View>

            <Text className="text-center text-gray-600 mb-4">
              Pastikan password baru Anda minimal 8 karakter
            </Text>
          </View>

          <View className="bg-white px-4 py-6">
            <View className="space-y-4">
              <TextInput
                mode="flat"
                label="Password Saat Ini"
                value={formData.currentPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, currentPassword: text }))
                }
                secureTextEntry={!showPassword.current}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock" color="#0C8EEC" />}
                right={
                  <TextInput.Icon
                    icon={showPassword.current ? "eye-off" : "eye"}
                    color="#666"
                    onPress={() => togglePasswordVisibility("current")}
                  />
                }
              />

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Password Baru"
                value={formData.newPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, newPassword: text }))
                }
                secureTextEntry={!showPassword.new}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock-plus" color="#0C8EEC" />}
                right={
                  <TextInput.Icon
                    icon={showPassword.new ? "eye-off" : "eye"}
                    color="#666"
                    onPress={() => togglePasswordVisibility("new")}
                  />
                }
              />

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Konfirmasi Password Baru"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                secureTextEntry={!showPassword.confirm}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock-check" color="#0C8EEC" />}
                right={
                  <TextInput.Icon
                    icon={showPassword.confirm ? "eye-off" : "eye"}
                    color="#666"
                    onPress={() => togglePasswordVisibility("confirm")}
                  />
                }
              />

              {error && (
                <HelperText type="error" visible={true} className="mt-2">
                  {error}
                </HelperText>
              )}
            </View>
          </View>

          <View className="p-4">
            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={loading}
              disabled={loading}
              buttonColor="#0C8EEC"
              className="rounded-lg"
              contentStyle={{ paddingVertical: 6 }}
            >
              Ubah Password
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
