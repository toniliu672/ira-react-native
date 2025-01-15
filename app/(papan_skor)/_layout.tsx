// app/(papan_skor)/_layout.tsx
import { Stack } from 'expo-router';

export default function PapanSkorLayout() {
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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Pilih Materi',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Hasil Quiz',
        }}
      />
    </Stack>
  );
}