// components/home/InteractiveWelcome.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";

interface WelcomeMessage {
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const WELCOME_MESSAGES: WelcomeMessage[] = [
  {
    title: "Selamat Datang!",
    message:
      "Siap untuk belajar hari ini? Mari mulai perjalanan pembelajaran Anda.",
    icon: "sparkles",
    color: "#0C8EEC",
  },
  {
    title: "Tetap Semangat!",
    message:
      "Setiap hari adalah kesempatan baru untuk belajar sesuatu yang menakjubkan.",
    icon: "flame",
    color: "#A92394",
  },
  {
    title: "Ayo Mulai!",
    message: "Konsistensi adalah kunci sukses. Mulai dari hal kecil hari ini.",
    icon: "rocket",
    color: "#22C55E",
  },
  {
    title: "Kamu Hebat!",
    message:
      "Percaya pada diri sendiri. Kamu mampu mencapai apapun yang diimpikan.",
    icon: "star",
    color: "#FFD700",
  },
  {
    title: "Pantang Menyerah!",
    message:
      "Setiap tantangan adalah kesempatan untuk menjadi lebih baik dari kemarin.",
    icon: "fitness",
    color: "#FF6B6B",
  },
];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const InteractiveWelcome = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const backgroundScale = useSharedValue(1);

  // Safe access to current message with bounds checking
  const safeMessageIndex = Math.max(
    0,
    Math.min(currentMessageIndex, WELCOME_MESSAGES.length - 1)
  );
  const currentMessage =
    WELCOME_MESSAGES[safeMessageIndex] || WELCOME_MESSAGES[0];

  // Auto-cycle through messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPressed && !isAnimating) {
        changeMessage();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPressed, isAnimating]);

  const changeMessage = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Animate out current message
    textOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        // Update message index
        const nextIndex = (currentMessageIndex + 1) % WELCOME_MESSAGES.length;
        runOnJS(setCurrentMessageIndex)(nextIndex);

        // Animate in new message
        textOpacity.value = withTiming(1, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(setIsAnimating)(false);
          }
        });
      }
    });

    // Color transition
    colorProgress.value = withTiming(1, { duration: 500 }, () => {
      colorProgress.value = 0;
    });

    // Icon celebration animation
    iconScale.value = withSequence(
      withTiming(1.3, { duration: 200 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    // Background pulse
    backgroundScale.value = withSequence(
      withTiming(1.05, { duration: 300 }),
      withSpring(1, { damping: 8, stiffness: 120 })
    );
  };

  const handlePress = () => {
    if (isAnimating) return;

    setIsPressed(true);

    // Scale and rotation animation
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    rotation.value = withSequence(
      withTiming(5, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withSpring(0, { damping: 10, stiffness: 150 })
    );

    // Change message
    changeMessage();

    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 1000);
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * backgroundScale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const currentColor = currentMessage?.color || "#0C8EEC";
    const nextIndex = Math.max(
      0,
      Math.min(
        (safeMessageIndex + 1) % WELCOME_MESSAGES.length,
        WELCOME_MESSAGES.length - 1
      )
    );
    const nextMessage = WELCOME_MESSAGES[nextIndex] || WELCOME_MESSAGES[0];
    const nextColor = nextMessage?.color || "#0C8EEC";

    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [`${currentColor}15`, `${nextColor}15`]
    );

    return {
      backgroundColor,
      transform: [{ scale: iconScale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Animated.View
      entering={SlideInRight.delay(400).springify()}
      className="px-6 pt-6 pb-0"
    >
      <AnimatedTouchableOpacity
        style={[containerAnimatedStyle]}
        className="bg-white rounded-2xl p-4 mb-6 shadow-sm active:shadow-lg"
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center">
          <Animated.View
            style={[
              iconAnimatedStyle,
              {
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons
              name={currentMessage?.icon || "sparkles"}
              size={24}
              color={currentMessage?.color || "#0C8EEC"}
            />
          </Animated.View>

          <Animated.View style={[textAnimatedStyle]} className="ml-3 flex-1">
            <Text className="font-bold text-gray-800 mb-1">
              {currentMessage?.title || "Selamat Datang!"}
            </Text>
            <Text className="text-gray-600 text-sm leading-5">
              {currentMessage?.message ||
                "Siap untuk belajar hari ini? Mari mulai perjalanan pembelajaran Anda."}
            </Text>
          </Animated.View>

          <View className="ml-2">
            <Ionicons name="refresh-circle-outline" size={20} color="#CBD5E1" />
          </View>
        </View>

        {/* Indicator dots */}
        <View className="flex-row justify-center mt-3 space-x-2">
          {WELCOME_MESSAGES.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentMessageIndex ? "bg-[#0C8EEC]" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};
