
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'student';
  }
  
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  registrationDeadline: string;
  image?: string;
  status: 'completed' | 'draft' | 'published' | 'canceled';
  capacity: number;
  category?: string;
  registeredUsers: number[];
  registrationCount: number;
  attendedUsers?: number[];
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