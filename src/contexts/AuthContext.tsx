import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { users as initialUsers } from '@/data/mock';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);

  const login = (email: string, _password: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, phone: string, role: UserRole) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  const switchRole = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
