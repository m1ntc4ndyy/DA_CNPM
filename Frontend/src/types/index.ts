
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'student';
  }
  
  export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    time?: string;
    image?: string;
    status: 'ongoing' | 'ended' | 'pending' | 'accepted' | 'rejected';
    attendees: number;
    maxAttendees: number;
    registeredUsers: number[];
  }
  
  export interface AuthContextType {
    currentUser: User | null;
    login: (userData: User) => boolean;
    logout: () => void;
    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
    isStudent: () => boolean;
    isAuthenticated: boolean;
    loading: boolean;
  }