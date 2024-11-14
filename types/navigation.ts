// types/navigation.ts
export type AppRoutes = {
    "/(auth)/login": undefined;
    "/(auth)/register": undefined;
    "/(tabs)/index": undefined;  // Updated from home to index
    "/(tabs)/explore": undefined;
    "/(tabs)/settings": undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends AppRoutes {}
    }
  }