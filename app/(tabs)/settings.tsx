// app/(tabs)/settings.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import { useAuthState } from "@/hooks/useAuthState";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { authService } from "@/services/authService";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  color = "#0C8EEC",
  showChevron = true,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center p-4 bg-white mb-0.5"
    activeOpacity={0.7}
  >
    <View
      style={{ backgroundColor: `${color}15` }}
      className="w-10 h-10 rounded-full items-center justify-center mr-4"
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-800 text-base font-medium">{title}</Text>
      {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
    </View>
    {showChevron && (
      <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user } = useAuthState();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setShowLogoutDialog(false);
      await authService.logout();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Section */}
      <View className="bg-white p-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-[#0C8EEC] items-center justify-center">
            <Text className="text-white text-xl font-bold">
              {getInitials(user.fullName)}
            </Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {user.fullName}
            </Text>
            <Text className="text-gray-500">{user.email}</Text>
            {user.phone && (
              <Text className="text-gray-500 text-sm">{user.phone}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Settings Groups */}
      <View className="mb-6">
        <SettingsItem
          icon="person-outline"
          title="Edit Profil"
          onPress={() => router.push("/(settings)/edit-profile")}
        />
        <SettingsItem
          icon="lock-closed-outline"
          title="Ubah Password"
          onPress={() => router.push("/(settings)/change-password")}
        />
      </View>

      <View className="mb-6">
        <Text className="px-4 pb-2 text-sm font-medium text-gray-500">
          TENTANG APLIKASI
        </Text>
        <SettingsItem
          icon="information-circle-outline"
          title="Tentang Kami"
          subtitle="Versi 1.0.0"
          onPress={() => router.push("../(settings)/about")}
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Bantuan"
          onPress={() => router.push("../(settings)/help")}
        />
        <SettingsItem
          icon="shield-checkmark-outline"
          title="Kebijakan Privasi"
          onPress={() => router.push("../(settings)/privacy-policy")}
        />
      </View>

      <View className="mb-6">
        <SettingsItem
          icon="log-out-outline"
          title="Keluar"
          color="#DC2626"
          onPress={() => setShowLogoutDialog(true)}
          showChevron={false}
        />
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
        >
          <Dialog.Title>Konfirmasi Keluar</Dialog.Title>
          <Dialog.Content>
            <Text className="text-gray-600">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowLogoutDialog(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              onPress={handleLogout}
              loading={isLoading}
              textColor="#DC2626"
            >
              Keluar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}
