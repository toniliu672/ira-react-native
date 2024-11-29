// app/(quiz)/_layout.tsx
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function QuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: '#0C8EEC',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Quiz',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Quiz Detail',
          headerBackTitle: 'Kembali',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: 'Hasil Quiz',
          headerBackTitle: 'Kembali',
        }}
      />
    </Stack>
  );
}