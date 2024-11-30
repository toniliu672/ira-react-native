// app/(tabs)/home.tsx
import React from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  LinearTransition,
} from "react-native-reanimated";
import { getGreeting } from "@/lib/dateTimes";

type MenuItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  badge?: string;
};

const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "pembelajaran",
    title: "Pembelajaran",
    description: "Akses materi pembelajaran",
    icon: "book-outline",
    color: "#0C8EEC",
    route: "/(materi)"
  },
  {
    id: "quiz",
    title: "Quiz",
    description: "Uji pemahaman materi",
    icon: "help-circle-outline",
    color: "#A92394",
    route: "/(quiz)"
  },
  {
    id: "papan-skor",
    title: "Papan Skor",
    description: "Lihat Nilai",
    icon: "trophy-outline", 
    color: "#FFD700", 
    route: "/(papan_skor)"
  }
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { user } = useAuth();
  const scale = useSharedValue(1);
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = (windowWidth - 24 * 2 - 16) / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!user) {
    router.replace("/(auth)/login");
    return null;
  }

  const handleMenuPress = (item: MenuItem) => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    router.push(item.route as any);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <SafeAreaView className="bg-[#0C8EEC]">
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 py-6"
        >
          <Text className="text-white text-lg mb-1">{getGreeting()},</Text>
          <Text className="text-white text-2xl font-bold">
            {user.fullName.split(" ")[0]} 👋
          </Text>
        </Animated.View>
      </SafeAreaView>

      {/* Main Content */}
      <View className="px-6 pt-6">
        {/* Menu Grid */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Menu Utama
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {MAIN_MENU_ITEMS.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(200 + index * 100).springify()}
                layout={LinearTransition.springify()}
                style={{ width: itemWidth }}
              >
                <AnimatedTouchableOpacity
                  style={[animatedStyle, { height: 136 }]}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-50"
                  activeOpacity={0.7}
                  onPress={() => handleMenuPress(item)}
                >
                  <View className="flex-1">
                    <View
                      style={{ backgroundColor: `${item.color}15` }}
                      className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    >
                      <Ionicons name={item.icon} size={24} color={item.color} />
                    </View>
                    <Text
                      className="font-bold text-gray-800 mb-1"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                  {item.badge && (
                    <View className="absolute top-2 right-2 bg-[#0C8EEC] px-2 py-1 rounded-full">
                      <Text className="text-xs text-white">{item.badge}</Text>
                    </View>
                  )}
                </AnimatedTouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          layout={LinearTransition.springify()}
          className="bg-[#0C8EEC] rounded-2xl p-5 mt-6 mb-6"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white font-bold text-lg mb-2">
                Tips Belajar
              </Text>
              <Text className="text-white opacity-90">
                Tetapkan target belajar yang realistis dan ikuti secara
                konsisten untuk hasil maksimal.
              </Text>
            </View>
            <Ionicons name="bulb-outline" size={32} color="white" />
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}