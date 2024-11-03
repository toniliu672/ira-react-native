// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AuthInput from '../../components/AuthInput';
import UniversalButton from '../../components/UniversalButton';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // Perubahan di sini: menambahkan justify-center untuk memposisikan konten di tengah vertikal
    <View className="flex-1 bg-white p-6 justify-center">  
      <Animated.View 
        entering={FadeInUp.duration(1000).springify()} 
        className="items-center"
      >
        <Text className="text-3xl" style={{ fontFamily: 'Poppins_700Bold' }}>
          <Text style={{ color: '#A92394' }}>A</Text>
          <Text style={{ color: '#0C8EEC' }}>IRA</Text>
        </Text>
        <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-gray-500 mt-2">
          Media Pembelajaran Dinamis & Fleksibel
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(1000).springify()} 
        className="mt-10"
      >
        <AuthInput
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="items-center">
          <UniversalButton
            title="Login"
            onPress={() => {/* TODO: Implement login */}}
            backgroundColor="#0C8EEC"
            textColor="#FFFFFF"
            width={undefined}
            height={56}
          />
        </View>

        <View className="flex-row justify-center mt-6">
          <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-gray-600">
            Belum punya akun?{' '}
          </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-[#0C8EEC]">
                Daftar Sekarang
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}