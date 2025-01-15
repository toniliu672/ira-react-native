// app/(ranking)/_layout.tsx
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RankingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: '#0C8EEC',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Pilih Materi' }}
      />
      <Stack.Screen
        name="quiz-list"
        options={{ title: 'Pilih Quiz' }}
      />
      <Stack.Screen
        name="ranking"
        options={{
          title: 'Ranking Quiz',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)/home')}
              className="mr-4"
            >
              <MaterialIcons name="home" size={24} color="#0C8EEC" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}