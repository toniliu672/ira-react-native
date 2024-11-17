// app/(settings)/edit-profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Divider,
  RadioButton,
} from "react-native-paper";
import { Stack, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ApiResponse, User } from "@/types/auth";

interface ValidationErrors {
  email?: string;
  username?: string;
  fullName?: string;
}

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    email: "",
    fullName: "",
    gender: "MALE",
    phone: null,
    address: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Nama lengkap tidak boleh kosong";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.username?.trim()) {
      newErrors.username = "Username tidak boleh kosong";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.patch<ApiResponse<User>>(
        "/users/me",
        formData
      );

      if (response.data.success && response.data.data) {
        await updateUser(response.data.data);
        Alert.alert("Sukses", "Profil berhasil diperbarui", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        setErrors({
          email: response.data.message || "Gagal memperbarui profil",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memperbarui profil";
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profil",
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
              <MaterialCommunityIcons
                name="account"
                size={40}
                color="#0C8EEC"
              />
            </View>

            <Text className="text-center text-gray-600 mb-4">
              Perbarui informasi profil Anda
            </Text>
          </View>

          <View className="bg-white px-4 py-6">
            <View className="space-y-4">
              <TextInput
                mode="flat"
                label="Username"
                value={formData.username}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, username: text }))
                }
                error={!!errors.username}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="account" color="#0C8EEC" />}
              />
              {errors.username && (
                <HelperText type="error" visible={true}>
                  {errors.username}
                </HelperText>
              )}

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                error={!!errors.email}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="email" color="#0C8EEC" />}
              />
              {errors.email && (
                <HelperText type="error" visible={true}>
                  {errors.email}
                </HelperText>
              )}

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Nama Lengkap"
                value={formData.fullName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, fullName: text }))
                }
                error={!!errors.fullName}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="account-circle" color="#0C8EEC" />}
              />
              {errors.fullName && (
                <HelperText type="error" visible={true}>
                  {errors.fullName}
                </HelperText>
              )}

              <Divider className="my-2" />

              <View className="px-2">
                <Text className="text-gray-600 mb-2">Jenis Kelamin</Text>
                <RadioButton.Group
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: value as "MALE" | "FEMALE",
                    }))
                  }
                  value={formData.gender || "MALE"}
                >
                  <View className="flex-row items-center">
                    <RadioButton.Item
                      label="Laki-laki"
                      value="MALE"
                      color="#0C8EEC"
                    />
                    <RadioButton.Item
                      label="Perempuan"
                      value="FEMALE"
                      color="#A92394"
                    />
                  </View>
                </RadioButton.Group>
              </View>

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Nomor Telepon (Opsional)"
                value={formData.phone || ""}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text || null }))
                }
                keyboardType="phone-pad"
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="phone" color="#0C8EEC" />}
              />

              <Divider className="my-2" />

              <TextInput
                mode="flat"
                label="Alamat (Opsional)"
                value={formData.address || ""}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text || null }))
                }
                multiline
                numberOfLines={3}
                activeUnderlineColor="#0C8EEC"
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon icon="map-marker" color="#0C8EEC" />}
              />
            </View>
          </View>

          <View className="p-4">
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={loading}
              disabled={loading}
              buttonColor="#0C8EEC"
              className="rounded-lg"
              contentStyle={{ paddingVertical: 6 }}
            >
              Simpan Perubahan
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
