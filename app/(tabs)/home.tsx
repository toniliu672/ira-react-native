// app/(tabs)/home.tsx
import React from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type MenuItem = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function HomeScreen() {
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Pembelajaran',
      description: 'Akses materi pembelajaran IT',
      icon: 'book-outline',
      color: '#0C8EEC'
    },
    {
      title: 'Quiz',
      description: 'Uji pemahaman materi',
      icon: 'help-circle-outline',
      color: '#A92394'
    },
    {
      title: 'Diskusi',
      description: 'Forum tanya jawab',
      icon: 'chatbubbles-outline',
      color: '#2E8B57'
    },
    {
      title: 'Progress',
      description: 'Pantau perkembangan belajar',
      icon: 'stats-chart-outline',
      color: '#FF8C00'
    }
  ] as const;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <SafeAreaView className="bg-white">
        <View className="p-4 border-b border-gray-100">
          <Text className="text-gray-600 text-base">Selamat datang,</Text>
          <Text className="text-xl font-bold text-gray-800">{user?.fullName}</Text>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <View className="p-4">
        {/* Welcome Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Mulai Belajar IT
              </Text>
              <Text className="text-gray-600">
                Tingkatkan keahlian teknologimu dengan materi berkualitas
              </Text>
            </View>
            <MaterialIcons name="laptop" size={48} color="#0C8EEC" />
          </View>
        </View>

        {/* Menu Grid */}
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white w-[48%] rounded-xl p-4 mb-4 shadow-sm"
              onPress={() => console.log(`Navigate to ${item.title}`)}
            >
              <View style={{ backgroundColor: `${item.color}20` }} className="w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text className="font-bold text-gray-800 mb-1">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}