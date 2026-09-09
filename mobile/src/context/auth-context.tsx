import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import api from '@/lib/api';

export type User = {
  id: number;
  name: string;
  email: string;
  student_id: string | null;
  role: 'student' | 'admin';
  two_factor_enabled: boolean;
  avatar_url: string | null;
  created_at?: string;
};

type LoginResult =
  | { twoFactorRequired: true; tempToken: string }
  | { twoFactorRequired: false; user: User };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    student_id: string;
    password: string;
    password_confirmation: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (nextUser: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      const savedUser = await SecureStore.getItemAsync('user');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    })();
  }, []);

  const persistUser = async (nextUser: User) => {
    setUser(nextUser);
    await SecureStore.setItemAsync('user', JSON.stringify(nextUser));
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const { data } = await api.post('/login', { email, password });
    if (data.two_factor_required) {
      return { twoFactorRequired: true, tempToken: data.temp_token };
    }
    await SecureStore.setItemAsync('token', data.token);
    await persistUser(data.user);
    return { twoFactorRequired: false, user: data.user };
  };

  const verifyTwoFactor = async (tempToken: string, code: string): Promise<User> => {
    const { data } = await api.post('/2fa/login', { temp_token: tempToken, code });
    await SecureStore.setItemAsync('token', data.token);
    await persistUser(data.user);
    return data.user;
  };

  const register = async (payload: {
    name: string;
    email: string;
    student_id: string;
    password: string;
    password_confirmation: string;
  }): Promise<User> => {
    const { data } = await api.post('/register', payload);
    await SecureStore.setItemAsync('token', data.token);
    await persistUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const updateUser = async (nextUser: User) => {
    await persistUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, verifyTwoFactor, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}