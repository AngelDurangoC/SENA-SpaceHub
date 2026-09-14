// =================================================================
// Archivo: src/context/AuthContext.tsx
//RESPONSABILIDAD: Contexto global de React que administra la sesión del usuario
//utilizando 'authService' para login y logout y 'sessionStorage'.
// =================================================================
import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

export interface User {
  id: number;
  nombreCompleto: string;
  nombre?: string;
  email: string;
  correo?: string;
  role: 'Administrador' | 'Aprendiz' | 'Instructor';
  rol?: 'Administrador' | 'Aprendiz' | 'Instructor' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  loginSimulado: (email: string, role?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const normalizeRole = (role?: string): User['role'] => {
  const normalized = String(role || '').toLowerCase();

  if (normalized === 'admin' || normalized === 'administrador') return 'Administrador';
  if (normalized === 'instructor') return 'Instructor';
  return 'Aprendiz';
};

const normalizeUser = (input: Partial<User> & { role?: string; rol?: string; nombre?: string; correo?: string; email?: string; nombreCompleto?: string }): User => {
  const role = normalizeRole(input.role ?? input.rol);

  return {
    id: input.id ?? Date.now(),
    nombreCompleto: input.nombreCompleto || input.nombre || 'Usuario SENA',
    nombre: input.nombre || input.nombreCompleto || 'Usuario SENA',
    email: input.email || input.correo || 'usuario@sena.edu.co',
    correo: input.correo || input.email || 'usuario@sena.edu.co',
    role,
    rol: role === 'Administrador' ? 'Administrador' : role,
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    const nextUser = normalizeUser(data.user);

    setToken(data.accessToken);
    setUser(nextUser);
    sessionStorage.setItem('token', data.accessToken);
    sessionStorage.setItem('user', JSON.stringify(nextUser));
  };

  const loginSimulado = (email: string, role?: string) => {
    const normalized = normalizeRole(role);
    const alias = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Usuario';
    const nextUser = normalizeUser({
      id: Date.now(),
      nombreCompleto: alias,
      nombre: alias,
      email,
      correo: email,
      role: normalized,
      rol: normalized,
    });

    setToken('demo-token');
    setUser(nextUser);
    sessionStorage.setItem('token', 'demo-token');
    sessionStorage.setItem('user', JSON.stringify(nextUser));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginSimulado, logout, isAuthenticated: !!token, isAdmin: user?.role === 'Administrador' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

export default AuthContext;