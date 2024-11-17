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
    id: "learn",
    title: "Materi",
    description: "Akses pembelajaran IT",
    icon: "book-outline",
    color: "#0C8EEC",
    route: "/learning",
  },
  {
    id: "subject-quiz",
    title: "Quiz Materi",
    description: "Latihan per materi",
    icon: "school-outline",
    color: "#0C8EEC",
    route: "/subject-quiz",
  },
  {
    id: "weekly-quiz",
    title: "Quiz Mingguan",
    description: "Tantangan mingguan",
    icon: "trophy-outline",
    color: "#0C8EEC",
    route: "/weekly-quiz",
  },
  {
    id: "progress",
    title: "Progress",
    description: "Pantau pembelajaran",
    icon: "trending-up-outline",
    color: "#0C8EEC",
    route: "/progress",
  },
];
