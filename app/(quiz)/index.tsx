// app/(quiz)/index.tsx
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Menu } from 'react-native-paper';
import { Quiz } from '@/types/quiz';
import { Materi } from '@/types/materi';
import { quizService } from '@/services/quizService';
import { materiService } from '@/services/materiService';
import { ErrorView } from '@/components/commons/ErrorView';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface QuizSection {
  title: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  data: Quiz[];
}

export default function QuizScreen() {
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [selectedMateriId, setSelectedMateriId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);

  const fetchMateriList = async () => {
    try {
      const response = await materiService.getMateriList({});
      if (response.success && response.data) {
        setMateriList(response.data.materi);
        if (response.data.materi.length > 0) {
          const firstMateri = response.data.materi[0];
          setSelectedMateriId(firstMateri.id);
          setSelectedMateri(firstMateri);
        }
      }
    } catch (err) {
      console.error('Error fetching materi:', err);
      setError('Gagal memuat daftar materi');
    }
  };

  const fetchQuizList = async (materiId: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await quizService.getQuizList(materiId);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memuat daftar quiz');
      }

      const multipleChoice = response.data.filter(quiz => quiz.type === 'MULTIPLE_CHOICE');
      const essay = response.data.filter(quiz => quiz.type === 'ESSAY');

      setSections([
        {
          title: 'Quiz Pilihan Ganda',
          type: 'MULTIPLE_CHOICE',
          data: multipleChoice
        },
        {
          title: 'Quiz Essay',
          type: 'ESSAY',
          data: essay
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMateriList();
    }, [])
  );

  useEffect(() => {
    if (selectedMateriId) {
      fetchQuizList(selectedMateriId);
    }
  }, [selectedMateriId]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (selectedMateriId) {
      fetchQuizList(selectedMateriId);
    }
  };

  const renderHeader = () => (
    <View className="bg-white border-b border-gray-100">
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <View>
          <Text className="text-lg font-bold text-gray-800">
            {selectedMateri?.judul || 'Pilih Materi'}
          </Text>
          <Text className="text-sm text-gray-500">
            {selectedMateri ? `Materi ${selectedMateri.urutan}` : 'Tap untuk memilih materi'}
          </Text>
        </View>
        <MaterialIcons 
          name={menuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={28} 
          color="#0C8EEC" 
        />
      </TouchableOpacity>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        contentStyle={{ width: '100%', marginTop: 60 }}
      >
        {materiList.map((materi) => (
          <Menu.Item
            key={materi.id}
            onPress={() => {
              setSelectedMateriId(materi.id);
              setSelectedMateri(materi);
              setMenuVisible(false);
            }}
            title={`${materi.judul} (Materi ${materi.urutan})`}
            leadingIcon={() => (
              <View className="flex-row items-center">
                <Ionicons
                  name={selectedMateriId === materi.id ? "checkmark-circle" : "book-outline"}
                  size={20}
                  color={selectedMateriId === materi.id ? "#0C8EEC" : "#666"}
                />
              </View>
            )}
          />
        ))}
      </Menu>
    </View>
  );

  const renderQuizItem = ({ item, section }: { item: Quiz; section: QuizSection }) => (
    <Link 
      href={{
        pathname: section.type === 'MULTIPLE_CHOICE' 
          ? '/(quiz)/multiple-choice/[id]' 
          : '/(quiz)/essay/[id]',
        params: { id: item.id }
      } as const} 
      asChild
    >
      <TouchableOpacity 
        className="bg-white mx-4 mb-4 rounded-xl overflow-hidden"
        activeOpacity={0.7}
      >
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                {item.judul}
              </Text>
              <Text className="text-gray-600" numberOfLines={2}>
                {item.deskripsi}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <MaterialIcons 
                name={section.type === 'MULTIPLE_CHOICE' ? 'check-circle' : 'edit'} 
                size={20} 
                color={section.type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394'} 
              />
              <Text 
                className="ml-2"
                style={{ 
                  color: section.type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394'
                }}
              >
                {section.type === 'MULTIPLE_CHOICE' ? '10 Soal' : 'Essay Question'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0C8EEC" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={handleRefresh} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderQuizItem}
        renderSectionHeader={({ section: { title, type } }) => (
          <View className="px-4 py-3 bg-gray-50">
            <Text className="text-lg font-bold" style={{ 
              color: type === 'MULTIPLE_CHOICE' ? '#0C8EEC' : '#A92394' 
            }}>
              {title}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <MaterialIcons name="quiz" size={48} color="#CBD5E1" />
            <Text className="text-gray-400 text-center mt-4">
              Belum ada quiz untuk materi ini
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
      />
      
      <Link href="/(quiz)/results" asChild>
        <TouchableOpacity 
          className="absolute bottom-6 right-6 bg-[#0C8EEC] w-14 h-14 rounded-full items-center justify-center shadow-lg"
          activeOpacity={0.7}
        >
          <MaterialIcons name="history" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}