// components/home/AchievementPreview.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  index,
}) => {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    scale.value = withDelay(
      index * 150,
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Progress animation
    const progressPercentage =
      (achievement.progress / achievement.maxProgress) * 100;
    progressWidth.value = withDelay(
      index * 150 + 300,
      withTiming(progressPercentage, { duration: 1200 })
    );

    // Unlock animation for achieved badges
    if (achievement.isUnlocked) {
      rotate.value = withDelay(
        index * 150 + 500,
        withSequence(
          withTiming(360, { duration: 800 }),
          withTiming(0, { duration: 0 })
        )
      );

      glowIntensity.value = withDelay(
        index * 150 + 800,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1500 }),
            withTiming(0, { duration: 1500 })
          ),
          -1,
          false
        )
      );
    }
  }, []);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      glowIntensity.value,
      [0, 1],
      [`${achievement.color}00`, `${achievement.color}30`]
    );
    return { backgroundColor };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View style={[badgeAnimatedStyle]} className="flex-1 mx-1">
      <View className="relative">
        {/* Glow effect for unlocked achievements */}
        {achievement.isUnlocked && (
          <Animated.View
            style={[glowAnimatedStyle]}
            className="absolute inset-0 rounded-xl"
          />
        )}

        <View
          className={`
            p-3 rounded-xl border
            ${
              achievement.isUnlocked
                ? "bg-white border-gray-200"
                : "bg-gray-50 border-gray-100"
            }
          `}
        >
          <View className="items-center">
            <View
              style={{
                backgroundColor: achievement.isUnlocked
                  ? `${achievement.color}15`
                  : "#F3F4F6",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons
                name={achievement.icon}
                size={18}
                color={achievement.isUnlocked ? achievement.color : "#9CA3AF"}
              />
            </View>

            <Text
              className={`
                text-xs font-medium text-center mb-1
                ${achievement.isUnlocked ? "text-gray-800" : "text-gray-500"}
              `}
              numberOfLines={1}
            >
              {achievement.title}
            </Text>

            <Text
              className={`
                text-xs text-center mb-2
                ${achievement.isUnlocked ? "text-gray-600" : "text-gray-400"}
              `}
              numberOfLines={2}
            >
              {achievement.description}
            </Text>

            {/* Progress bar */}
            <View className="w-full">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs text-gray-400">
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: achievement.isUnlocked
                      ? achievement.color
                      : "#9CA3AF",
                  }}
                >
                  {Math.round(
                    (achievement.progress / achievement.maxProgress) * 100
                  )}
                  %
                </Text>
              </View>
              <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <Animated.View
                  style={[
                    progressAnimatedStyle,
                    {
                      backgroundColor: achievement.isUnlocked
                        ? achievement.color
                        : "#D1D5DB",
                      height: "100%",
                    },
                  ]}
                  className="rounded-full"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const AchievementPreview: React.FC = () => {
  const containerScale = useSharedValue(0.95);
  const headerGlow = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    headerGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const headerGlowStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      headerGlow.value,
      [0, 1],
      ["#0C8EEC00", "#0C8EEC10"]
    );
    return { backgroundColor };
  });

  const achievements: Achievement[] = [
    {
      id: "first_quiz",
      title: "Quiz Pertama",
      description: "Selesaikan quiz pertama",
      icon: "medal-outline",
      color: "#FFD700",
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "week_streak",
      title: "Streak 7 Hari",
      description: "Belajar 7 hari berturut",
      icon: "flame-outline",
      color: "#FF6B6B",
      isUnlocked: true,
      progress: 7,
      maxProgress: 7,
    },
    {
      id: "material_master",
      title: "Master Materi",
      description: "Selesaikan 10 materi",
      icon: "library-outline",
      color: "#0C8EEC",
      isUnlocked: false,
      progress: 6,
      maxProgress: 10,
    },
    {
      id: "quiz_champion",
      title: "Juara Quiz",
      description: "Raih nilai 90+ di 5 quiz",
      icon: "trophy-outline",
      color: "#22C55E",
      isUnlocked: false,
      progress: 2,
      maxProgress: 5,
    },
  ];

  const handleViewAll = () => {
    // TODO: Navigate to achievements page
    console.log("View all achievements");
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(1000).springify()}
      style={[containerAnimatedStyle]}
      className="mx-6 mt-6"
    >
      <View className="bg-white rounded-2xl p-4 border border-gray-100">
        <View className="relative overflow-hidden rounded-xl mb-4">
          <Animated.View
            style={[headerGlowStyle]}
            className="absolute inset-0"
          />
          <View className="flex-row items-center justify-between p-2">
            <View>
              <Text className="font-bold text-gray-800 text-lg">
                Pencapaian
              </Text>
              <Text className="text-gray-500 text-sm">
                Raih lencana dengan belajar konsisten
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleViewAll}
              className="flex-row items-center px-3 py-2 rounded-lg bg-gray-50"
            >
              <Text className="text-sm text-[#0C8EEC] font-medium mr-1">
                Lihat Semua
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#0C8EEC" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row space-x-2">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};
