// components/materi/MateriCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Materi } from "@/types/materi";
import { MaterialIcons } from "@expo/vector-icons";

interface MateriCardProps {
  materi: Materi;
  onPress: () => void;
}

export function MateriCard({ materi, onPress }: MateriCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: materi.thumbnailUrl }}
        className="w-full h-48"
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          {materi.judul}
        </Text>

        <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
          {materi.deskripsi}
        </Text>

        <View className="flex-row items-center">
          <MaterialIcons name="library-books" size={16} color="#0C8EEC" />
          <Text className="ml-2 text-sm text-gray-600">
            {materi.tujuanPembelajaran.length} Tujuan Pembelajaran
          </Text>
        </View>
      </View>

      <View className="absolute top-2 right-2 bg-[#0C8EEC] px-3 py-1 rounded-full">
        <Text className="text-white text-xs">Materi {materi.urutan}</Text>
      </View>
    </TouchableOpacity>
  );
}
