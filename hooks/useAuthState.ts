// hooks/useAuthState.ts
import { useEffect, useState } from 'react';
import { User } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

export const useAuthState = () => {
  const { user: contextUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync('userData');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData) as User;
          setUser(parsedUser);
          // Update context if stored data is different
          if (JSON.stringify(parsedUser) !== JSON.stringify(contextUser)) {
            updateUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      }
    };

    checkUserData();
    // Subscribe to user updates
    const intervalId = setInterval(checkUserData, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [contextUser, updateUser]);

  return { user, setUser };
};