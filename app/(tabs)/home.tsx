// app/(tabs)/home.tsx
import React, { useEffect } from "react";
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
} from "react-native-reanimated";
import { getGreeting } from "@/lib/dateTimes";
import { InteractiveWelcome } from "@/components/home/InteractiveWelcome";

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
    route: "/(materi)",
  },
  {
    id: "quiz",
    title: "Quiz",
    description: "Uji pemahaman materi",
    icon: "help-circle-outline",
    color: "#A92394",
    route: "/(quiz)",
  },
  {
    id: "papan-skor",
    title: "Papan Skor",
    description: "Lihat Nilai",
    icon: "trophy-outline",
    color: "#FFD700",
    route: "/(papan_skor)",
  },
  {
    id: "ranking",
    title: "Ranking",
    description: "Lihat peringkat per quiz",
    icon: "podium-outline",
    color: "#22C55E",
    route: "/(ranking)",
  },
];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { user } = useAuth();
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = (windowWidth - 24 * 2 - 16) / 2;

  // Shared values for animations
  const headerScale = useSharedValue(1);
  const greetingRotate = useSharedValue(0);
  const tipsIconRotate = useSharedValue(0);
  const gradientProgress = useSharedValue(0);
  const floatingOffset = useSharedValue(0);

  // Initialize animations on mount
  useEffect(() => {
    // Greeting bounce animation
    headerScale.value = withSequence(
      withTiming(1.1, { duration: 300 }),
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Rotating greeting wave animation
    greetingRotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 200 }),
        withTiming(-10, { duration: 400 }),
        withTiming(0, { duration: 200 })
      ),
      3,
      false
    );

    // Tips icon rotation
    tipsIconRotate.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    // Gradient animation
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    // Floating animation for icons
    floatingOffset.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 }),
        withTiming(5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  if (!user) {
    router.replace("/(auth)/login");
    return null;
  }

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const greetingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${greetingRotate.value}deg` }],
  }));

  const tipsIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tipsIconRotate.value}deg` }],
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

  const handleMenuPress = (item: MenuItem) => {
    router.push(item.route as any);
  };

  const MenuCard = ({ item, index }: { item: MenuItem; index: number }) => {
    const cardScale = useSharedValue(1);
    const cardRotate = useSharedValue(0);
    const iconScale = useSharedValue(1);
    const badgePulse = useSharedValue(1);

    // Badge pulse animation
    useEffect(() => {
      if (item.badge) {
        badgePulse.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 800 }),
            withTiming(1, { duration: 800 })
          ),
          -1,
          false
        );
      }
    }, [item.badge]);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: cardScale.value },
        { rotateY: `${cardRotate.value}deg` },
      ],
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: iconScale.value },
        { translateY: floatingOffset.value * 0.5 },
      ],
    }));

    const badgeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: badgePulse.value }],
    }));

    const handlePressIn = () => {
      cardScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      iconScale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
      cardRotate.value = withTiming(2, { duration: 150 });
    };

    const handlePressOut = () => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      iconScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      cardRotate.value = withTiming(0, { duration: 150 });

      // Navigate after animation
      setTimeout(() => {
        runOnJS(handleMenuPress)(item);
      }, 100);
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(300 + index * 150)
          .springify()
          .damping(15)}
        layout={LinearTransition.springify()}
        style={{ width: itemWidth }}
      >
        <AnimatedTouchableOpacity
          style={[cardAnimatedStyle, { height: 136 }]}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-50"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View className="flex-1">
            <Animated.View
              style={[
                {
                  backgroundColor: `${item.color}15`,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                },
                iconAnimatedStyle,
              ]}
            >
              <Ionicons name={item.icon} size={24} color={item.color} />
            </Animated.View>
            <Text className="font-bold text-gray-800 mb-1" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          {item.badge && (
            <Animated.View
              style={[badgeAnimatedStyle]}
              className="absolute top-2 right-2 bg-[#0C8EEC] px-2 py-1 rounded-full"
            >
              <Text className="text-xs text-white">{item.badge}</Text>
            </Animated.View>
          )}
        </AnimatedTouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section with Gradient Animation */}
      <SafeAreaView className="bg-[#0C8EEC]">
        <Animated.View style={[gradientAnimatedStyle]} className="relative">
          <Animated.View
            entering={SlideInLeft.delay(100).springify()}
            style={[headerAnimatedStyle]}
            className="px-6 py-6"
          >
            <View className="flex-row items-center">
              <Animated.Text
                style={[greetingAnimatedStyle]}
                className="text-white text-lg mb-1"
              >
                {getGreeting()},
              </Animated.Text>
            </View>
            <Animated.Text
              entering={FadeInRight.delay(200).springify()}
              className="text-white text-2xl font-bold"
            >
              {user.fullName.split(" ")[0]} 👋
            </Animated.Text>
          </Animated.View>

          {/* Decorative floating elements */}
          <Animated.View
            style={[floatingAnimatedStyle]}
            className="absolute top-4 right-6 opacity-20"
          >
            <Ionicons name="school-outline" size={32} color="white" />
          </Animated.View>
          <Animated.View
            style={[
              floatingAnimatedStyle,
              { transform: [{ translateY: floatingOffset.value * -1 }] },
            ]}
            className="absolute bottom-4 right-16 opacity-10"
          >
            <Ionicons name="library-outline" size={24} color="white" />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>

      {/* Main Content */}
      <View className="px-6 pt-6">
        {/* Interactive Welcome Message */}
        <InteractiveWelcome />
      </View>

      {/* Main Content */}
      <View className="px-6 pt-0">
        {/* Menu Grid with Enhanced Animations */}
        <View className="flex-1">
          <Animated.Text
            entering={FadeInLeft.delay(500).springify()}
            className="text-lg font-bold text-gray-800 mb-4"
          >
            Menu Utama
          </Animated.Text>
          <View className="flex-row flex-wrap gap-4">
            {MAIN_MENU_ITEMS.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Tips Section with Enhanced Animations */}
        <Animated.View
          entering={BounceIn.delay(800)}
          layout={LinearTransition.springify()}
          className="bg-[#0C8EEC] rounded-2xl p-5 mt-6 mb-6 relative overflow-hidden"
        >
          {/* Background pattern */}
          <Animated.View
            style={[
              floatingAnimatedStyle,
              { transform: [{ translateY: floatingOffset.value * 0.3 }] },
            ]}
            className="absolute top-2 right-2 opacity-10"
          >
            <Ionicons name="bulb-outline" size={60} color="white" />
          </Animated.View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Animated.Text
                entering={FadeInLeft.delay(900)}
                className="text-white font-bold text-lg mb-2"
              >
                Tips Belajar
              </Animated.Text>
              <Animated.Text
                entering={FadeInLeft.delay(1000)}
                className="text-white opacity-90"
              >
                Tetapkan target belajar yang realistis dan ikuti secara
                konsisten untuk hasil maksimal.
              </Animated.Text>
            </View>
            <Animated.View style={[tipsIconAnimatedStyle]}>
              <Ionicons name="bulb-outline" size={32} color="white" />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
