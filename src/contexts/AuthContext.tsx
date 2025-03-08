
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  badges: string[];
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isDeveloper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const USERS_STORAGE_KEY = 'wraith_users';
const CURRENT_USER_KEY = 'wraith_current_user';

// Developer email
const DEVELOPER_EMAIL = 'starzzyfrr@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);

  // Initialize users if they don't exist
  const initializeUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      const initialUsers = [{
        id: 'admin-001',
        email: DEVELOPER_EMAIL,
        username: 'developer',
        password: 'admin123', // In a real app, this would be hashed
        isAdmin: true,
        badges: ['developer', 'verified']
      }];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    }
  };

  useEffect(() => {
    initializeUsers();
    
    // Check if a user is already logged in
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsDeveloper(user.email === DEVELOPER_EMAIL);
    }
    
    setLoading(false);
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before saving to state
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        setIsDeveloper(email === DEVELOPER_EMAIL);
        
        // Save user to localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        
        toast.success('Logged in successfully');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Failed to login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getUsers();
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        toast.error('Email already in use');
        setLoading(false);
        return;
      }
      
      if (users.some((u: any) => u.username === username)) {
        toast.error('Username already taken');
        setLoading(false);
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email,
        username,
        password, // In a real app, this would be hashed
        isAdmin: email === DEVELOPER_EMAIL,
        badges: []
      };
      
      // Add user to database
      users.push(newUser);
      saveUsers(users);
      
      // Remove password before saving to state
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsDeveloper(email === DEVELOPER_EMAIL);
      
      // Save user to localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to create account');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsDeveloper(false);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast.success('Logged out successfully');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isDeveloper,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
