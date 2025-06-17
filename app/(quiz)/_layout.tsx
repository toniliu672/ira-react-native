// app/(quiz)/_layout.tsx
import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: '#0C8EEC',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Quiz' }} 
      />
      <Stack.Screen 
        name="quiz-list" 
        options={{ title: 'Pilih Quiz' }} 
      />
      <Stack.Screen 
        name="multiple-choice/[id]" 
        options={{ title: 'Quiz Pilihan Ganda' }} 
      />
      <Stack.Screen 
        name="essay/[id]" 
        options={{ title: 'Quiz Essay' }} 
      />
      <Stack.Screen 
        name="essay/result" 
        options={{ title: 'Quiz Selesai' }} 
      />
    </Stack>
  );
}