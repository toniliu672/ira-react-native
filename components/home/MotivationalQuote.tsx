// components/home/MotivationalQuote.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeOut,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";

interface Quote {
  text: string;
  author: string;
  category: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    text: "Pendidikan adalah senjata paling ampuh yang dapat Anda gunakan untuk mengubah dunia.",
    author: "Nelson Mandela",
    category: "Inspirasi",
    color: "#0C8EEC",
    icon: "earth-outline",
  },
  {
    text: "Investasi dalam pengetahuan membayar bunga terbaik.",
    author: "Benjamin Franklin",
    category: "Motivasi",
    color: "#A92394",
    icon: "library-outline",
  },
  {
    text: "Belajarlah seolah-olah Anda akan hidup selamanya.",
    author: "Mahatma Gandhi",
    category: "Pembelajaran",
    color: "#22C55E",
    icon: "infinite-outline",
  },
  {
    text: "Keberhasilan adalah kemampuan untuk bergerak dari kegagalan ke kegagalan tanpa kehilangan antusiasme.",
    author: "Winston Churchill",
    category: "Semangat",
    color: "#FFD700",
    icon: "rocket-outline",
  },
  {
    text: "Masa depan milik mereka yang percaya pada keindahan mimpi mereka.",
    author: "Eleanor Roosevelt",
    category: "Harapan",
    color: "#FF6B6B",
    icon: "star-outline",
  },
];

export const MotivationalQuote: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const gradientProgress = useSharedValue(0);
  const quoteOpacity = useSharedValue(1);

  useEffect(() => {
    // Auto-change quote every 15 seconds
    const interval = setInterval(() => {
      if (!isChanging) {
        changeQuote();
      }
    }, 15000);

    // Initial animations
    scale.value = withSpring(1, { damping: 15, stiffness: 120 });

    // Gradient animation
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1,
      true
    );

    // Icon subtle animation
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 3000 }),
        withTiming(-10, { duration: 3000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );

    return () => clearInterval(interval);
  }, [isChanging]);

  const changeQuote = () => {
    setIsChanging(true);

    // Fade out current quote
    quoteOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        // Change quote index
        const nextIndex = (currentQuoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
        runOnJS(setCurrentQuoteIndex)(nextIndex);

        // Fade in new quote
        quoteOpacity.value = withTiming(1, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(setIsChanging)(false);
          }
        });
      }
    });

    // Scale animation
    scale.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    // Rotation animation
    rotate.value = withSequence(
      withTiming(2, { duration: 200 }),
      withTiming(-2, { duration: 200 }),
      withSpring(0, { damping: 10, stiffness: 150 })
    );
  };

  const handlePress = () => {
    if (!isChanging) {
      changeQuote();
    }
  };

  // Get current quote safely
  const currentQuote =
    MOTIVATIONAL_QUOTES[currentQuoteIndex] || MOTIVATIONAL_QUOTES[0];

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      gradientProgress.value,
      [0, 0.5, 1],
      [0.8, 1, 0.8]
    );
    return { opacity };
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(1200).springify()}
      className="mx-6 mt-6"
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        disabled={isChanging}
      >
        <Animated.View style={[containerAnimatedStyle]}>
          <View className="relative overflow-hidden rounded-2xl">
            {/* Gradient background */}
            <Animated.View
              style={[
                gradientAnimatedStyle,
                { backgroundColor: `${currentQuote.color}10` },
              ]}
              className="absolute inset-0"
            />

            <View className="bg-white/90 p-5 border border-gray-100 rounded-2xl">
              <View className="flex-row items-start">
                <Animated.View
                  style={[
                    iconAnimatedStyle,
                    {
                      backgroundColor: `${currentQuote.color}15`,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    },
                  ]}
                >
                  <Ionicons
                    name={currentQuote.icon}
                    size={20}
                    color={currentQuote.color}
                  />
                </Animated.View>

                <View className="flex-1">
                  <Animated.View style={[quoteAnimatedStyle]}>
                    <Text className="text-gray-800 text-base leading-6 mb-3">
                      "{currentQuote.text}"
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="font-medium text-gray-700">
                          {currentQuote.author}
                        </Text>
                        <Text
                          className="text-sm font-medium"
                          style={{ color: currentQuote.color }}
                        >
                          {currentQuote.category}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={handlePress}
                        className="p-2"
                        disabled={isChanging}
                      >
                        <Ionicons
                          name="refresh-circle-outline"
                          size={24}
                          color="#CBD5E1"
                        />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Progress indicator */}
      <View className="flex-row justify-center mt-3 space-x-2">
        {MOTIVATIONAL_QUOTES.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentQuoteIndex ? "bg-gray-400" : "bg-gray-200"
            }`}
            style={{
              backgroundColor:
                index === currentQuoteIndex ? currentQuote.color : "#E5E7EB",
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
};
