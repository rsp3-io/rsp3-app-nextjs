'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { passportInstance } from '@/lib/passport';
import { UserProfile } from '@imtbl/sdk/passport';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accountAddress: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already logged in
      const userProfile = await passportInstance.getUserInfo();
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
        
        // Get account address if available
        try {
          const provider = await passportInstance.connectEvm();
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccountAddress(accounts[0]);
          }
        } catch (error) {
          console.log('No wallet connected yet');
        }
      }
    } catch (error) {
      console.log('User not authenticated');
      setIsAuthenticated(false);
      setUser(null);
      setAccountAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Connect with Passport and get EVM provider
      const provider = await passportInstance.connectEvm();
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        setAccountAddress(accounts[0]);
        
        // Get user profile
        const userProfile = await passportInstance.getUserInfo();
        setUser(userProfile || null);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await passportInstance.logout();
      setIsAuthenticated(false);
      setUser(null);
      setAccountAddress(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accountAddress,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
