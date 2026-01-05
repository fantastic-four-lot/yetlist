
// // lib/auth/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { getToken, saveToken, clearToken } from './storage';
// import { router } from 'expo-router';

// type User = { id: string; email: string } | null;

// type AuthContextType = {
//   user: User;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   debugClearToken: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = await getToken();
//         if (token) {
//           // TODO: call your /me endpoint to verify token
//           setUser({ id: '1', email: 'demo@example.com' });
//         } else {
//           setUser(null);
//         }
//       } catch (e) {
//         console.warn('Token check failed:', e);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const login = async (email: string, password: string) => {
//     // TODO: call your real API; for now accept any non-empty
//     if (!email || !password) throw new Error('Invalid credentials');
//     const token = 'mock-jwt-token';
//     await saveToken(token);
//     setUser({ id: '1', email });
//     router.replace('/'); // force navigation to home
//   };

//   const register = async (email: string, password: string) => {
//     const token = 'mock-jwt-token';
//     await saveToken(token);
//     setUser({ id: '1', email });
//     router.replace('/(auth)/login');
//   };

//   const logout = async () => {
//     await clearToken();
//     setUser(null);
//     router.replace('/(auth)/login'); // force navigation to login

//   };

//   const debugClearToken = async () => {
//     await clearToken();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, debugClearToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };
// ``






// lib/auth/AuthContext.tsx
import React, { createContext, use, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi, meApi, AuthResponse } from './authApi';
import { getToken, saveToken, clearToken } from './storage';
import { router } from 'expo-router';

type User = AuthResponse['user'] | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check saved token and fetch user
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          // const { id,email,name } = await meApi(token);
          setUser(await meApi(token));
      
          
        } else {
          setUser(null);
        }
      } catch (e) {
        // console.warn('Session check failed:', e);
        setUser(null);
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const login = async (email: string, password: string) => {
    const { access_token, user } = await loginApi({ email, password });
    // console.log('Login successful, saving token:', access_token);
    await saveToken(access_token);
    setUser(user);
    router.replace('/'); // Navigate to home
  };

  const register = async (email: string, password: string, name?: string) => {
    const { access_token, user } = await registerApi({ email, password, name });
    // await saveToken(access_token);
    // setUser(user);
    router.replace('/(auth)/login');
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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

