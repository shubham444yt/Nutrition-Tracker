"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('nutrition_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Compatibility fix for old sessions
      if (parsedUser && parsedUser._id && !parsedUser.id) {
        parsedUser.id = parsedUser._id;
      }
      setUser(parsedUser);
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nutrition_user', JSON.stringify(data.user));
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Connection error' };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nutrition_user', JSON.stringify(data.user));
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutrition_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
