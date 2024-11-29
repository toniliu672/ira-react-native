// types/navigation.ts
export type AppRoutes = {
    // Auth routes
    "/(auth)/login": undefined;
    "/(auth)/register": undefined;
    
    // App & Tab routes
    "/(app)/home": undefined;
    "/(tabs)": undefined;
    "/(tabs)/home": undefined;
    "/(tabs)/materi": undefined;
    "/(tabs)/quiz": undefined;
    "/(tabs)/diskusi": undefined;
    "/(tabs)/progress": undefined;
    
    // Materi routes
    "/(materi)/index": undefined;
    "/(materi)/[id]": { id: string };
    "/(materi)/[id]/sub/[subId]": { 
      id: string; 
      subId: string;
    };
    "/(materi)/[id]/video/[videoId]": { 
      id: string; 
      videoId: string;
    };
  
    // Settings routes
    "/(settings)/index": undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends AppRoutes {}
    }
  }