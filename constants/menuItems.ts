// constants/menuItems.ts
import { Ionicons } from "@expo/vector-icons";

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  badge?: string;
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'materi',
    title: 'Pembelajaran',
    description: 'Akses materi pembelajaran IT',
    icon: 'book-outline',
    color: '#0C8EEC',
    route: '/(materi)'
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Uji pemahaman materi',
    icon: 'help-circle-outline',
    color: '#A92394',
    route: '/(quiz)'
  },
  {
    id: 'diskusi',
    title: 'Diskusi',
    description: 'Forum tanya jawab',
    icon: 'chatbubbles-outline',
    color: '#2E8B57',
    route: '/(diskusi)'
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Pantau perkembangan belajar',
    icon: 'stats-chart-outline',
    color: '#FF8C00',
    route: '/(progress)'
  }
];