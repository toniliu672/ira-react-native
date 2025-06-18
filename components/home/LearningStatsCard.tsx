// components/home/LearningStatsCard.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";

interface StatItemProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  progress: number;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
  icon,
  color,
  progress,
  delay,
}) => {
  const scale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    // Scale animation
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Progress animation
    progressWidth.value = withDelay(
      delay + 300,
      withTiming(progress, { duration: 1500 })
    );

    // Icon rotation
    iconRotate.value = withDelay(
      delay,
      withSequence(
        withTiming(360, { duration: 800 }),
        withTiming(0, { duration: 0 })
      )
    );

    // Glow effect
    glowIntensity.value = withDelay(
      delay + 600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      )
    );
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      glowIntensity.value,
      [0, 1],
      [`${color}00`, `${color}15`]
    );
    return { backgroundColor };
  });

  return (
    <Animated.View style={[containerAnimatedStyle]} className="flex-1">
      <View className="relative">
        {/* Glow background */}
        <Animated.View
          style={[glowAnimatedStyle]}
          className="absolute inset-0 rounded-xl"
        />

        <View className="bg-white rounded-xl p-4 border border-gray-100">
          <View className="items-center">
            <Animated.View
              style={[
                iconAnimatedStyle,
                {
                  backgroundColor: `${color}15`,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                },
              ]}
            >
              <Ionicons name={icon} size={20} color={color} />
            </Animated.View>

            <Text className="text-lg font-bold text-gray-800 mb-1">
              {value}
            </Text>
            <Text className="text-xs text-gray-500 text-center mb-2">
              {title}
            </Text>

            {/* Progress bar */}
            <View className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <Animated.View
                style={[
                  progressAnimatedStyle,
                  { backgroundColor: color, height: "100%" },
                ]}
                className="rounded-full"
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const LearningStatsCard: React.FC = () => {
  const cardScale = useSharedValue(0.9);
  const shadowIntensity = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    shadowIntensity.value = withTiming(1, { duration: 800 });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    shadowOpacity: interpolate(shadowIntensity.value, [0, 1], [0, 0.1]),
    elevation: interpolate(shadowIntensity.value, [0, 1], [0, 5]),
  }));

  const stats = [
    {
      title: "Materi Selesai",
      value: "12/20",
      icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
      color: "#22C55E",
      progress: 60,
      delay: 200,
    },
    {
      title: "Quiz Dikerjakan",
      value: "8/15",
      icon: "bulb-outline" as keyof typeof Ionicons.glyphMap,
      color: "#A92394",
      progress: 53,
      delay: 400,
    },
    {
      title: "Streak Hari",
      value: "7",
      icon: "flame-outline" as keyof typeof Ionicons.glyphMap,
      color: "#FF6B6B",
      progress: 70,
      delay: 600,
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={[cardAnimatedStyle]}
      className="mx-6 mt-6"
    >
      <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
        <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
          Progress Belajar Hari Ini
        </Text>

        <View className="flex-row space-x-3">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};
