// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

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
  showChevron = true
}) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center p-4 bg-white mb-0.5"
  >
    <View style={{ backgroundColor: `${color}15` }} className="w-10 h-10 rounded-full items-center justify-center mr-4">
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-800 text-base font-medium">{title}</Text>
      {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
    </View>
    {showChevron && <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      setShowLogoutDialog(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Section */}
      <View className="bg-white p-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <MaterialIcons name="person" size={32} color="#0C8EEC" />
          </View>
          <View className="ml-4">
            <Text className="text-xl font-bold text-gray-800">{user?.fullName}</Text>
            <Text className="text-gray-500">{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Settings Groups */}
      <View className="mb-6">
        <Text className="px-4 pb-2 text-sm font-medium text-gray-500">PENGATURAN AKUN</Text>
        <SettingsItem
          icon="person-outline"
          title="Edit Profil"
          onPress={() => console.log('Navigate to profile edit')}
        />
        <SettingsItem
          icon="lock-closed-outline"
          title="Ubah Password"
          onPress={() => console.log('Navigate to change password')}
        />
      </View>

      <View className="mb-6">
        <Text className="px-4 pb-2 text-sm font-medium text-gray-500">TENTANG APLIKASI</Text>
        <SettingsItem
          icon="information-circle-outline"
          title="Tentang Kami"
          onPress={() => console.log('Navigate to about')}
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Bantuan"
          onPress={() => console.log('Navigate to help')}
        />
        <SettingsItem
          icon="shield-checkmark-outline"
          title="Kebijakan Privasi"
          onPress={() => console.log('Navigate to privacy policy')}
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
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>Konfirmasi Keluar</Dialog.Title>
          <Dialog.Content>
            <Text className="text-gray-600">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Batal</Button>
            <Button onPress={handleLogout} textColor="#DC2626">Keluar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}