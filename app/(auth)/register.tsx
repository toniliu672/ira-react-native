// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AuthInput from '../../components/AuthInput';
import UniversalButton from '../../components/UniversalButton';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="p-6">
        <Animated.View 
          entering={FadeInDown.duration(1000).springify()} 
          className="mt-20"
        >
          <Text className="text-3xl mb-2" style={{ fontFamily: 'Poppins_700Bold' }}>
            <Text style={{ color: '#A92394' }}>Daftar </Text>
            <Text style={{ color: '#0C8EEC' }}>Akun</Text>
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-gray-500 mb-8">
            Mulai perjalanan belajarmu sekarang
          </Text>

          <AuthInput
            icon="user"
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
          />
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
          <AuthInput
            icon="lock"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <UniversalButton
            title="Daftar"
            onPress={() => {/* TODO: Implement registration */}}
            backgroundColor="#0C8EEC"
            textColor="#FFFFFF"
            width={undefined}
            height={56}
          />

          <View className="flex-row justify-center mt-6 mb-10">
            <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-gray-600">
              Sudah punya akun?{' '}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_400Regular' }} className="text-[#0C8EEC]">
                  Login Sekarang
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}