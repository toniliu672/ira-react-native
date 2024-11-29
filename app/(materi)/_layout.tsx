// app/(materi)/_layout.tsx
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function MateriLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#0C8EEC',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      animation: 'slide_from_right'
    }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Materi Pembelajaran',
          headerLeft: () => (
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color="#0C8EEC" 
              style={{ marginLeft: 16 }}
              onPress={() => router.back()}
            />
          )
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detail Materi',
          headerBackTitle: 'Kembali'
        }}
      />
      <Stack.Screen
        name="[id]/sub/[subId]"
        options={{
          title: 'Sub Materi',
          headerBackTitle: 'Kembali'
        }}
      />
      <Stack.Screen
        name="[id]/video/[videoId]"
        options={{
          title: 'Video Pembelajaran',
          headerBackTitle: 'Kembali'
        }}
      />
    </Stack>
  );
}