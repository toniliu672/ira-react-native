// app/(auth)/_layout.tsx
import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  // Redirect ke tabs jika user sudah login
  if (user) {
    router.replace('/(tabs)/home');
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