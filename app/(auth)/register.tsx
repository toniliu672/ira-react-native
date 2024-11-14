// app/(auth)/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import AuthInput from "../../components/AuthInput";
import UniversalButton from "../../components/UniversalButton";
import { useAuth } from "../../context/AuthContext";
import { RegisterRequest } from "../../types/auth";
import { Feather } from "@expo/vector-icons";

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    gender: "MALE",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, error } = useAuth();

  const validateForm = (): boolean => {
    if (!formData.username || formData.username.length < 3) {
      Alert.alert("Error", "Username minimal 3 karakter");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Error", "Format email tidak valid");
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      Alert.alert("Error", "Password minimal 8 karakter");
      return false;
    }
    if (formData.password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok");
      return false;
    }
    if (!formData.fullName || formData.fullName.length < 2) {
      Alert.alert("Error", "Nama lengkap minimal 2 karakter");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      await register(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="mt-20"
          >
            <Text className="text-3xl mb-2 font-bold">
              <Text style={{ color: "#A92394" }}>Daftar </Text>
              <Text style={{ color: "#0C8EEC" }}>Akun</Text>
            </Text>
            <Text className="text-gray-500 mb-8">
              Mulai perjalanan belajarmu sekarang
            </Text>

            <AuthInput
              icon="user"
              placeholder="Username"
              value={formData.username}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, username: text }))
              }
              autoCapitalize="none"
            />

            <AuthInput
              icon="user"
              placeholder="Nama Lengkap"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, fullName: text }))
              }
              autoCapitalize="words"
            />

            <AuthInput
              icon="mail"
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Gender Selection yang diperbaiki */}
            <View className="mb-4">
              <Text className="text-gray-600 mb-2 text-sm">Jenis Kelamin</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, gender: "MALE" }))
                  }
                  className={`flex-1 flex-row items-center justify-center space-x-2 py-4 rounded-xl border-2 
        ${
          formData.gender === "MALE"
            ? "border-[#0C8EEC] bg-[#0C8EEC]/10"
            : "border-gray-200 bg-white"
        }`}
                >
                  <Feather
                    name="user"
                    size={20}
                    color={formData.gender === "MALE" ? "#0C8EEC" : "#666"}
                  />
                  <Text
                    className={`${
                      formData.gender === "MALE"
                        ? "text-[#0C8EEC]"
                        : "text-gray-600"
                    } font-medium`}
                  >
                    Laki-laki
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, gender: "FEMALE" }))
                  }
                  className={`flex-1 flex-row items-center justify-center space-x-2 py-4 rounded-xl border-2
        ${
          formData.gender === "FEMALE"
            ? "border-[#A92394] bg-[#A92394]/10"
            : "border-gray-200 bg-white"
        }`}
                >
                  <Feather
                    name="user"
                    size={20}
                    color={formData.gender === "FEMALE" ? "#A92394" : "#666"}
                  />
                  <Text
                    className={`${
                      formData.gender === "FEMALE"
                        ? "text-[#A92394]"
                        : "text-gray-600"
                    } font-medium`}
                  >
                    Perempuan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <AuthInput
              icon="lock"
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
            />

            <AuthInput
              icon="lock"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {error && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {error}
              </Text>
            )}

            <View className="items-center mt-4">
              <UniversalButton
                title={loading ? "Loading..." : "Daftar"}
                onPress={handleRegister}
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

            <View className="flex-row justify-center mt-6 mb-10">
              <Text className="text-gray-600">Sudah punya akun? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-[#0C8EEC]">Login Sekarang</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
