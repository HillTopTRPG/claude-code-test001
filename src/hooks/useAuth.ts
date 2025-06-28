import { useState, useEffect } from 'react';
import { getCurrentAuthUser, checkAuthStatus } from '../services/auth';
import type { AuthUser } from '../types/auth';
import { Hub } from 'aws-amplify/utils';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      const authStatus = await checkAuthStatus();

      if (authStatus.isAuthenticated) {
        const currentUser = await getCurrentAuthUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    // Amplify Hubでの認証状態変更をリッスン
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      const eventHandlers: Record<string, () => void> = {
        signedIn: () => {
          console.log('User signed in');
          checkUser();
        },
        signedOut: () => {
          console.log('User signed out');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        },
        tokenRefresh: () => {
          console.log('Token refreshed');
        },
      };

      const handler = eventHandlers[payload.event];
      if (handler) {
        handler();
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch: checkUser,
  };
};
