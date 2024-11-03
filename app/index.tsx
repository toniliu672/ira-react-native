// app/index.tsx
import React from 'react';
import { View, Text, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import UniversalButton from '../components/UniversalButton'; // Mengimpor UniversalButton dari folder components

export default function Index() {
  const router = useRouter();

  // Load custom font
  const [fontsLoaded] = useFonts({
    'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView className="flex-1">
      {/* ImageBackground sebagai background yang fix */}
      <ImageBackground
        source={require('../assets/images/main.png')} // Ganti path ini dengan yang sesuai
        resizeMode="cover"
        className="absolute top-0 left-0 right-0 bottom-0"
      />

      {/* Konten yang akan tampil di atas background */}
      <View className="flex-1 justify-end items-center bg-gradient-to-t from-white/50 to-transparent pb-32 px-4">
        <Text style={{ fontFamily: 'Gilroy-ExtraBold', fontSize: 50, marginBottom: 8 }}>
          <Text style={{ color: '#A92394' }}>A</Text>
          <Text style={{ color: '#0C8EEC' }}>IRA APP</Text>
        </Text>
        <Text className="text-gray-500 text-2xl font-medium mb-6">by Irawati Buamona</Text>
        <Text className="text-gray-400 text-center text-md mb-10">Media Pembelajaran Dinamis & Fleksibel</Text>

        {/* Menggunakan UniversalButton sebagai tombol Login */}
        <UniversalButton
          title="Login"
          onPress={() => router.push('/login')} // Sesuaikan rute jika diperlukan
          backgroundColor="#0C8EEC"
          textColor="#FFFFFF"
          width={160}
          height={50}
          fontSize={16}
        />
      </View>
    </SafeAreaView>
  );
}
