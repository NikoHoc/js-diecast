import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('api_key');
      const userDataStr = await SecureStore.getItemAsync('user_data');

      if (token && userDataStr) {
        api.setAuthToken(token);
        setUser(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Gagal mengecek status auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    try {
      await SecureStore.setItemAsync('api_key', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));

      api.setAuthToken(token);

      setUser(userData);
    } catch (error) {
      console.error('Gagal menyimpan sesi login:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('api_key');
      await SecureStore.deleteItemAsync('user_data');
      api.setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Gagal menghapus sesi login:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isLoggedIn: !!user,
      login, 
      logout,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};