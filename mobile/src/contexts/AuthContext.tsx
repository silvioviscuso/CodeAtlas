/**
 * Authentication context
 * Manages user authentication state and GitHub OAuth flow
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/apiClient';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string | null;
  githubUsername: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      // Token invalid or expired
      await SecureStore.deleteItemAsync('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (code: string) => {
    try {
      const result = await apiClient.authenticateWithGitHub(code);
      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
