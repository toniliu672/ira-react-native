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
import api from "@/lib/api";
import { ApiResponse } from "@/types/auth";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Semua field harus diisi");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password baru tidak cocok");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.put<ApiResponse<void>>("/users/me/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        router.back();
      } else {
        setError(response.data.message || "Gagal mengubah password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ubah Password",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#0C8EEC",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "Gilroy-ExtraBold",
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
                secureTextEntry
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock" color="#0C8EEC" />}
              />

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Password Baru"
                value={formData.newPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, newPassword: text }))
                }
                secureTextEntry
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock-plus" color="#0C8EEC" />}
              />

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Konfirmasi Password Baru"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                secureTextEntry
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="lock-check" color="#0C8EEC" />}
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
