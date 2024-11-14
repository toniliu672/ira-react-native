// app/(app)/home.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-row justify-between items-center p-4">
        <View>
          <Text className="text-lg font-semibold text-gray-800">
            Welcome back,
          </Text>
          <Text className="text-2xl font-bold">
            {user?.fullName}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={handleLogout}
          className="p-2"
          accessibilityLabel="Logout button"
        >
          <AntDesign name="logout" size={24} color="#0C8EEC" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-600 text-center">
          Your content goes here
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}