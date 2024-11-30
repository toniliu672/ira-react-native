// app/(settings)/privacy-policy.tsx
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface PolicySection {
  title: string;
  content: string;
}

const policies: PolicySection[] = [
  {
    title: "Pengumpulan Informasi",
    content: "Kami mengumpulkan informasi yang Anda berikan saat mendaftar dan menggunakan aplikasi, termasuk nama, email, dan data akademik. Data ini diperlukan untuk memberikan layanan pembelajaran yang optimal."
  },
  {
    title: "Penggunaan Data",
    content: "Data yang dikumpulkan digunakan untuk menyediakan dan meningkatkan layanan pembelajaran, menganalisis penggunaan aplikasi, dan memberikan konten yang relevan. Kami tidak akan menjual data Anda kepada pihak ketiga."
  },
  {
    title: "Keamanan Data",
    content: "Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi data Anda dari akses tidak sah, perubahan, atau pengungkapan."
  },
  {
    title: "Hak Pengguna",
    content: "Anda memiliki hak untuk mengakses, mengubah, atau menghapus data pribadi Anda. Hubungi kami jika Anda ingin menggunakan hak-hak ini."
  }
];

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Kebijakan Privasi',
          headerTitleAlign: 'center',
        }}
      />
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <Text className="text-base text-gray-800 mb-6 leading-relaxed">
            Terakhir diperbarui: 30 November 2024
          </Text>

          {policies.map((policy, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 100).springify()}
              className="mb-6"
            >
              <Text className="text-lg font-bold text-gray-800 mb-2">
                {policy.title}
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                {policy.content}
              </Text>
            </Animated.View>
          ))}

          <View className="mt-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-base text-gray-600 leading-relaxed">
              Dengan menggunakan aplikasi ini, Anda menyetujui kebijakan privasi yang berlaku. Kami berhak mengubah kebijakan ini sewaktu-waktu. Perubahan akan diinformasikan melalui aplikasi.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}