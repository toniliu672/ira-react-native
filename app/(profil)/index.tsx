// app/(profil)/index.tsx
import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Profil',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="items-center px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="items-center"
        >
          <Image
            source={require('../../assets/images/profil.png')}
            className="w-48 h-48 rounded-full"
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="mt-6 items-center"
        >
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Irawati Buamona
          </Text>
          <Text className="text-lg text-[#0C8EEC] mt-2">
            20 208 060
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          className="mt-8 bg-gray-50 p-6 rounded-xl w-full"
        >
          <Text className="text-base text-gray-800 text-center leading-relaxed">
            JURUSAN PENDIDIKAN TEKNOLOGI INFORMASI DAN KOMUNIKASI{'\n'}
            FAKULTAS TEKNIK{'\n'}
            UNIVERSITAS NEGERI MANADO
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}