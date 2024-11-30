// app/(settings)/about.tsx
import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tentang Kami',
          headerTitleAlign: 'center',
        }}
      />
      <ScrollView className="flex-1 bg-white">
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="p-6"
        >
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/images/icon.png')}
              className="w-24 h-24 rounded-xl mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-800">IRA App v1.0.0</Text>
            <Text className="text-base text-gray-500 mt-2 text-center">
              Media Pembelajaran Dinamis & Fleksibel
            </Text>
          </View>

          <View className="space-y-4">
            <Text className="text-base text-gray-800 leading-relaxed">
              IRA App adalah aplikasi pembelajaran yang dikembangkan sebagai bagian dari tugas akhir mahasiswa Pendidikan Teknologi Informasi dan Komunikasi, Fakultas Teknik, Universitas Negeri Manado.
              {'\n'}
              {'\n'}
            </Text>

            <Text className="text-base text-gray-800 leading-relaxed">
              Aplikasi ini bertujuan untuk memudahkan proses pembelajaran dengan menyediakan materi pembelajaran dan quiz dalam satu platform yang terintegrasi dan dinamis.
              {'\n'}
              {'\n'}
            </Text>

            <Text className="text-base text-gray-800 leading-relaxed">
              Dikembangkan oleh:{'\n'}
              Nama: Irawati Buamona{'\n'}
              NIM: 20 208 060{'\n'}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}