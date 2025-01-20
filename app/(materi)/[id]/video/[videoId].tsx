// app/(materi)/[id]/video/[videoId].tsx
import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import WebView from "react-native-webview";
import Animated, { FadeIn } from "react-native-reanimated";
import { materiService } from "@/services/materiService";
import { VideoMateri } from "@/types/materi";
import { ErrorView } from "@/components/commons/ErrorView";

const { width } = Dimensions.get("window");
const videoHeight = (width * 9) / 16; // 16:9 aspect ratio

export default function VideoMateriScreen() {
  const { id, videoId } = useLocalSearchParams<{
    id: string;
    videoId: string;
  }>();
  const [videoMateri, setVideoMateri] = useState<VideoMateri | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoMateri = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getVideoMateriList(id);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat video materi");
      }

      // Cari video yang sesuai dengan videoId dari params
      const selectedVideo = response.data.find((video) => video.id === videoId);
      if (!selectedVideo) {
        throw new Error("Video tidak ditemukan");
      }

      // Double check untuk memastikan kita mendapat video yang benar
      console.log("Selected Video:", {
        id: selectedVideo.id,
        title: selectedVideo.judul,
        youtubeId: selectedVideo.youtubeId,
      });

      setVideoMateri(selectedVideo);
    } catch (err) {
      console.error("Error fetching video:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVideoMateri();
    }, [id, videoId])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchVideoMateri} />;
  }

  if (!videoMateri) return null;

  const getYoutubeId = (url: string): string => {
    try {
      // Handle berbagai format URL YouTube
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match?.[2] || "";
    } catch {
      return "";
    }
  };

  const embedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; width: 100%; background-color: #000000; }
          .container {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
          }
          .container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe
            src="https://www.youtube.com/embed/${
              videoMateri.youtubeId || getYoutubeId(videoMateri.videoUrl)
            }?playsinline=1&modestbranding=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <script>
          window.onerror = function(msg, url, line) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: msg,
              url: url,
              line: line
            }));
            return true;
          };

          document.addEventListener('DOMContentLoaded', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'loaded'
            }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <ScrollView className="flex-1 bg-white">
      <View style={{ width: "100%", height: videoHeight }}>
        <WebView
          source={{ html: embedHTML }}
          style={{ backgroundColor: "#000000" }}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute inset-0 bg-black items-center justify-center">
              <ActivityIndicator size="large" color="#0C8EEC" />
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "error") {
                console.warn("Video player error:", data.message);
              }
            } catch (err) {
              console.warn("Failed to parse WebView message:", err);
            }
          }}
        />
      </View>

      <Animated.View entering={FadeIn} className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {videoMateri.judul}
        </Text>

        <Text className="text-gray-500 mb-2">
          Durasi: {Math.floor(videoMateri.durasi / 60)}:
          {(videoMateri.durasi % 60).toString().padStart(2, "0")} menit
        </Text>

        {videoMateri.deskripsi && (
          <Text className="text-gray-600 text-base leading-6">
            {videoMateri.deskripsi}
          </Text>
        )}
      </Animated.View>
    </ScrollView>
  );
}
