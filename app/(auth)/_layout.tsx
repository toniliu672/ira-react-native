// app/(auth)/_layout.tsx
import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/home');
    }
  }, [user]);

  // Jika user ada, tetap render null tapi biarkan useEffect yang handle redirectnya
  if (user) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: 'white' }
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}