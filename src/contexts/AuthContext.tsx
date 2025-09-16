import React, { createContext, useContext, useMemo, useState } from 'react';

type User = {
  email: string;
  role: string;
} | null;

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  getUser: () => User;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (email: string, password: string) => {
    if (email && password) {
      const nextUser = { email, role: 'Healthcare Professional' } as NonNullable<User>;
      localStorage.setItem('auth', 'true');
      localStorage.setItem('user', JSON.stringify(nextUser));
      setUser(nextUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUser = () => user;

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    getUser
  }), [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}



