// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { User, AuthContextType } from '../types';

// // Create the context with a default value
// const AuthContext = createContext<AuthContextType>({
//   currentUser: null,
//   login: () => false,
//   logout: () => false,
//   hasRole: () => false,
//   isAdmin: () => false,
//   isStudent: () => false,
//   isAuthenticated: false,
//   loading: true
// });

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Check if user is logged in on initial load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // Login function
//   const login = (userData: User): boolean => {
//     setCurrentUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//     return true;
//   };

//   // Logout function
//   const logout = (): void => {
//     setCurrentUser(null);
//     localStorage.removeItem('user');
//   };

//   // Check if user has a specific role
//   const hasRole = (role: string): boolean => {
//     if (!currentUser) return false;
//     return currentUser.role === role;
//   };

//   // Context value
//   const value: AuthContextType = {
//     currentUser,
//     login,
//     logout,
//     hasRole,
//     isAdmin: () => hasRole('admin'),
//     isStudent: () => hasRole('student'),
//     isAuthenticated: !!currentUser,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Create a hook for using the auth context
// export const useAuth = (): AuthContextType => {
//   return useContext(AuthContext);
// };




import { createContext, useState, useContext,useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import axiosInstance from "../utils/axiosInstance";

type AuthContext = {
  authToken?: string | null;
  currentUser?: User | null;
  loading: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isStudent: () => boolean;

}

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren
const getInitial = () => {
  const storedUser = sessionStorage.getItem('user');  
  const storedToken = sessionStorage.getItem('token');

  return [storedUser ? JSON.parse(storedUser) : null, storedToken ? JSON.parse(storedToken) : null];
}
export default function AuthProvider({ children }: AuthProviderProps) {
  // useEffect(() => {
  //       const storedUser = localStorage.getItem('user');
  //       if (storedUser) {
  //         setCurrentUser(JSON.parse(storedUser));
  //       }
       
  //     }, []);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(getInitial()[0]);
  const [authToken, setAuthToken] = useState<string | null>(getInitial()[1]);

  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(currentUser));
    sessionStorage.setItem('token', JSON.stringify(authToken));
    setLoading(false);
  }, [currentUser]);
  async function handleLogin(email: string, password: string) {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      setAuthToken(res.data.data.token);
      setCurrentUser(res.data.data.user);
      // localStorage.setItem('user', JSON.stringify(res.data.user));
      // localStorage.setItem('token', res.data.accessToken);

    } catch (error) {
      console.error(error);
      setAuthToken(null);
      setCurrentUser(null);
    }

  }

  async function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');

  }

  function hasRole(role: string) {
    return currentUser?.role === role;
  }
  return <AuthContext.Provider value={
    {
      authToken,
      currentUser,
      loading,
      handleLogin,
      handleLogout,
      hasRole,
      isAdmin: () => hasRole('admin'),
      isStudent: () => hasRole('student'),
    }
  }>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}