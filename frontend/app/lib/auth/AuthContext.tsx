// lib/auth/AuthContext.tsx
import React, { createContext, use, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi, meApi, AuthResponse, logoutApi } from './authApi';
import { getToken, saveToken, clearToken } from './storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
;

type User = AuthResponse['user'] | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
  let isMounted = true;

  (async () => {
    try {
      const token = await getToken();
      // console.log("Getting saved token:", token);

      if (!token) {
        if (isMounted) setUser(null);
        return;
      }

      // 🔥 Axios interceptor will auto-refresh if needed
      const res = await meApi();

      // console.log("Fetched user with access token:", res);

      if (isMounted) {
        setUser(res); // ✅ Set only the user object
      }
    } catch (e) {
      console.log("Auth failed:", e);
      await clearToken();
      if (isMounted) setUser(null);
    } finally {
      if (isMounted) setLoading(false);
    }
  })();

  return () => {
    isMounted = false;
  };
}, []);



      const login = async (email: string, password: string) => {
        const { user } = await loginApi({ email, password });
        // console.log('Token before saving:'+JSON.stringify(user));
        // await saveToken(accessToken);
        setUser(user);
        router.replace('/'); 
    };

    const register = async (email: string, password: string, name?: string) => {
      const response = await registerApi({ email, password, name });
      if(response) {
        router.replace('/(auth)/login');
      }

    };

  const logout = async () => {
    await logoutApi();
    await clearToken();
    setUser(null);
    router.replace('/(auth)/login');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            logout();
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
``

