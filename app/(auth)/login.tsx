// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AuthInput from "../../components/AuthInput";
import UniversalButton from "../../components/UniversalButton";
import { useAuth } from "../../context/AuthContext";
import { LoginRequest } from "../../types/auth";

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(formData);
      // Navigation will be handled by AuthContext
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        className="items-center"
      >
        <Text className="text-3xl font-bold">
          <Text style={{ color: "#A92394" }}>A</Text>
          <Text style={{ color: "#0C8EEC" }}>IRA</Text>
        </Text>
        <Text className="text-gray-500 mt-2">
          Media Pembelajaran Dinamis & Fleksibel
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
        className="mt-10"
      >
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
          icon="lock"
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry
        />

        {error && (
          <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
        )}

        <View className="items-center">
          <UniversalButton
            title={loading ? "Loading..." : "Login"}
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

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Belum punya akun? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-[#0C8EEC]">Daftar Sekarang</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}
