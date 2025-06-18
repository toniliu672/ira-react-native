// components/home/QuickActionsSection.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  delay: number;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  title,
  icon,
  color,
  onPress,
  delay,
}) => {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 15, stiffness: 150 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));

    // Subtle rotation animation
    rotate.value = withDelay(
      delay + 500,
      withRepeat(
        withSequence(
          withTiming(5, { duration: 2000 }),
          withTiming(-5, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pressScale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      runOnJS(onPress)();
    }, 100);
  };

  return (
    <Animated.View style={[animatedStyle]} className="flex-1">
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        className="items-center"
      >
        <View
          style={{ backgroundColor: `${color}15` }}
          className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text className="text-xs text-gray-600 text-center font-medium">
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const QuickActionsSection: React.FC = () => {
  const containerScale = useSharedValue(0.95);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    backgroundOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: backgroundOpacity.value,
  }));

  const quickActions = [
    {
      title: "Lanjut Belajar",
      icon: "play-circle-outline" as keyof typeof Ionicons.glyphMap,
      color: "#0C8EEC",
      onPress: () => router.push("/(materi)"),
      delay: 100,
    },
    {
      title: "Quiz Cepat",
      icon: "flash-outline" as keyof typeof Ionicons.glyphMap,
      color: "#A92394",
      onPress: () => router.push("/(quiz)"),
      delay: 200,
    },
    {
      title: "Nilai Saya",
      icon: "medal-outline" as keyof typeof Ionicons.glyphMap,
      color: "#FFD700",
      onPress: () => router.push("/(papan_skor)"),
      delay: 300,
    },
  ];

  return (
    <Animated.View
      entering={FadeInRight.delay(500).springify()}
      style={[containerAnimatedStyle]}
      className="mx-6 mt-4"
    >
      <View className="bg-white rounded-2xl p-4 border border-gray-100">
        <Text className="font-bold text-gray-800 mb-4">Aksi Cepat</Text>
        <View className="flex-row justify-between">
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} {...action} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};
