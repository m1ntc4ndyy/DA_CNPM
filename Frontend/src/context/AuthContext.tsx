// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
  hasRole: () => false,
  isAdmin: () => false,
  isStudent: () => false,
  isAuthenticated: false,
  loading: true
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData: User): boolean => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  // Logout function
  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  // Context value
  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    hasRole,
    isAdmin: () => hasRole('admin'),
    isStudent: () => hasRole('student'),
    isAuthenticated: !!currentUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook for using the auth context
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};