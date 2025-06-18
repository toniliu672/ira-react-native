// app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  FadeInUp,
  BounceIn,
  SlideInRight,
  SlideInLeft,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  useSharedValue,
  interpolate,
  LinearTransition,
  runOnJS,
  withSequence,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";
import { getGreeting } from "@/lib/dateTimes";
import { LearningStatsCard } from "@/components/home/LearningStatsCard";
import { QuickActionsSection } from "@/components/home/QuickActionsSection";
import { MotivationalQuote } from "@/components/home/MotivationalQuote";
import { AchievementPreview } from "@/components/home/AchievementPreview";

type MenuItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  badge?: string;
  progress?: number;
};

const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "pembelajaran",
    title: "Pembelajaran",
    description: "Akses materi pembelajaran",
    icon: "library-outline",
    color: "#0C8EEC",
    route: "/(materi)",
  },
  {
    id: "quiz",
    title: "Quiz",
    description: "Uji pemahaman materi",
    icon: "bulb-outline",
    color: "#A92394",
    route: "/(quiz)",
    badge: "3 Baru",
  },
  {
    id: "papan-skor",
    title: "Papan Skor",
    description: "Lihat hasil belajar",
    icon: "analytics-outline",
    color: "#FFD700",
    route: "/(papan_skor)",
  },
  {
    id: "ranking",
    title: "Ranking",
    description: "Peringkat per quiz",
    icon: "trophy-outline",
    color: "#22C55E",
    route: "/(ranking)",
  },
];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Shared values for complex animations
  const headerScale = useSharedValue(1);
  const gradientProgress = useSharedValue(0);
  const floatingOffset = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const waveOffset = useSharedValue(0);

  // Initialize animations
  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Header entrance animation
    headerScale.value = withSequence(
      withTiming(1.05, { duration: 600 }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Continuous gradient animation
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );

    // Floating animation
    floatingOffset.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000 }),
        withTiming(8, { duration: 3000 })
      ),
      -1,
      true
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );

    // Wave animation
    waveOffset.value = withRepeat(withTiming(1, { duration: 2500 }), -1, false);

    return () => clearInterval(timeInterval);
  }, []);

  if (!user) {
    router.replace("/(auth)/login");
    return null;
  }

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      gradientProgress.value,
      [0, 0.5, 1],
      [0.8, 1, 0.8]
    );
    return { opacity };
  });

  const floatingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingOffset.value }],
  }));

  const waveAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      waveOffset.value,
      [0, 1],
      [-50, screenWidth + 50]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const handleMenuPress = (item: MenuItem) => {
    router.push(item.route as any);
  };

  const MenuCard = ({ item, index }: { item: MenuItem; index: number }) => {
    const cardScale = useSharedValue(1);
    const cardRotate = useSharedValue(0);
    const iconScale = useSharedValue(1);
    const progressWidth = useSharedValue(0);
    const badgePulse = useSharedValue(1);
    const glowIntensity = useSharedValue(0);

    useEffect(() => {
      // Progress animation
      if (item.progress) {
        progressWidth.value = withDelay(
          index * 200,
          withTiming(item.progress, { duration: 1500 })
        );
      }

      // Badge pulse
      if (item.badge) {
        badgePulse.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          false
        );
      }

      // Glow effect
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      );
    }, []);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: cardScale.value },
        { rotateY: `${cardRotate.value}deg` },
      ],
      shadowOpacity: interpolate(cardScale.value, [1, 0.95], [0.1, 0.2]),
      elevation: interpolate(cardScale.value, [1, 0.95], [3, 8]),
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: iconScale.value },
        { translateY: floatingOffset.value * 0.3 },
      ],
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
      width: `${progressWidth.value}%`,
    }));

    const badgeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: badgePulse.value }],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        glowIntensity.value,
        [0, 1],
        [`${item.color}00`, `${item.color}20`]
      );
      return { backgroundColor };
    });

    const handlePressIn = () => {
      cardScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      iconScale.value = withSpring(1.2, { damping: 15, stiffness: 300 });
      cardRotate.value = withTiming(3, { duration: 150 });
    };

    const handlePressOut = () => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      iconScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      cardRotate.value = withTiming(0, { duration: 150 });

      setTimeout(() => {
        runOnJS(handleMenuPress)(item);
      }, 100);
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(400 + index * 150)
          .springify()
          .damping(15)}
        layout={LinearTransition.springify()}
        className="w-full mb-4"
      >
        <AnimatedTouchableOpacity
          style={[cardAnimatedStyle]}
          className="relative overflow-hidden"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {/* Glow background */}
          <Animated.View
            style={[glowAnimatedStyle]}
            className="absolute inset-0 rounded-2xl"
          />

          {/* Card content */}
          <View className="bg-white rounded-2xl p-5 border border-gray-100">
            <View className="flex-row items-center">
              <Animated.View
                style={[
                  {
                    backgroundColor: `${item.color}15`,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  iconAnimatedStyle,
                ]}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </Animated.View>

              <View className="flex-1 ml-4">
                <Text className="font-bold text-gray-800 text-lg mb-1">
                  {item.title}
                </Text>
                <Text className="text-gray-500" numberOfLines={1}>
                  {item.description}
                </Text>

                {/* Progress bar */}
                {item.progress && (
                  <View className="mt-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-xs text-gray-400">Progress</Text>
                      <Text
                        className="text-xs font-medium"
                        style={{ color: item.color }}
                      >
                        {item.progress}%
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <Animated.View
                        style={[
                          progressAnimatedStyle,
                          { backgroundColor: item.color, height: "100%" },
                        ]}
                        className="rounded-full"
                      />
                    </View>
                  </View>
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#CBD5E1"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>

          {/* Badge */}
          {item.badge && (
            <Animated.View
              style={[badgeAnimatedStyle]}
              className="absolute top-3 right-3 px-2 py-1 rounded-full"
            >
              <Text className="text-xs text-white font-medium">
                {item.badge}
              </Text>
            </Animated.View>
          )}
        </AnimatedTouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0C8EEC" />

      {/* Animated Header with Gradient */}
      <SafeAreaView>
        <Animated.View
          style={[gradientAnimatedStyle]}
          className="relative overflow-hidden"
        >
          <LinearGradient
            colors={["#0C8EEC", "#1E40AF", "#A92394"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-8"
          >
            {/* Animated wave background */}
            <Animated.View
              style={[waveAnimatedStyle]}
              className="absolute top-0 w-20 h-20 bg-white opacity-5 rounded-full"
            />

            <Animated.View
              entering={SlideInLeft.delay(100).springify()}
              style={[headerAnimatedStyle]}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white/80 text-base mb-1">
                    {getGreeting()},
                  </Text>
                  <Text className="text-white text-2xl font-bold mb-2">
                    {user.fullName.split(" ")[0]}
                  </Text>
                  <Text className="text-white/70 text-sm">
                    {currentTime.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                <Animated.View
                  style={[floatingAnimatedStyle]}
                  className="w-16 h-16 bg-white/10 rounded-full items-center justify-center"
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={32}
                    color="white"
                  />
                </Animated.View>
              </View>
            </Animated.View>

            {/* Decorative elements */}
            <Animated.View
              style={[
                floatingAnimatedStyle,
                { transform: [{ translateY: floatingOffset.value * -0.5 }] },
              ]}
              className="absolute top-4 right-20 opacity-10"
            >
              <Ionicons name="school-outline" size={24} color="white" />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <QuickActionsSection />

        {/* Main Menu */}
        <View className="px-6 mt-6">
          <Animated.Text
            entering={FadeInLeft.delay(600).springify()}
            className="text-xl font-bold text-gray-800 mb-4"
          >
            Menu Utama
          </Animated.Text>

          {MAIN_MENU_ITEMS.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </View>

        {/* Achievement Preview */}
        {/* <AchievementPreview /> */}

        {/* Motivational Quote */}
        <MotivationalQuote />

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
