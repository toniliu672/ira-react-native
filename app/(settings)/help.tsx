// app/(settings)/help.tsx
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: FAQItem[] = [
  {
    question: "Bagaimana cara menggunakan aplikasi ini?",
    answer: "Aplikasi ini memiliki beberapa fitur utama: Pembelajaran untuk mengakses materi dan Quiz untuk uji pemahaman. Pilih menu yang Anda inginkan dari tab bar di bagian bawah aplikasi."
  },
  {
    question: "Bagaimana cara mengerjakan quiz?",
    answer: "Pilih menu Quiz, kemudian pilih materi dan jenis quiz yang ingin dikerjakan. Quiz dapat berupa pilihan ganda atau essay. Setiap quiz memiliki batas waktu dan aturan tersendiri."
  },
  {
    question: "Bagaimana jika lupa password?",
    answer: "Pada halaman login, pilih opsi 'Lupa Password'. Ikuti instruksi yang diberikan untuk mereset password Anda melalui email yang terdaftar."
  },
  {
    question: "Apakah materi dapat diakses offline?",
    answer: "Untuk saat ini, materi hanya dapat diakses saat terhubung ke internet. Fitur akses offline akan ditambahkan pada versi mendatang."
  },
  {
    question: "Bagaimana cara mengubah profil?",
    answer: "Buka menu Settings, pilih 'Edit Profil' untuk mengubah informasi pribadi atau 'Ubah Password' untuk mengganti password Anda."
  }
];

export default function HelpScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bantuan',
          headerTitleAlign: 'center',
        }}
      />
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-6">
            Pertanyaan Umum
          </Text>

          {FAQs.map((faq, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 100).springify()}
              className="mb-4"
            >
              <TouchableOpacity
                className="bg-gray-50 p-4 rounded-xl"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      {faq.question}
                    </Text>
                    <Text className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          <View className="mt-6 p-4 bg-[#0C8EEC15] rounded-xl">
            <Text className="text-base text-gray-800 leading-relaxed">
              Butuh bantuan lebih lanjut? Hubungi kami melalui:{'\n\n'}
              Email: support@iraapp.com{'\n'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}