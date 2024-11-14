// app/(app)/_layout.tsx
import { Stack, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  // Protect the app routes
  if (!user) {
    router.replace('/(auth)/login');
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}