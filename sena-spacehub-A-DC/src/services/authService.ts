// =================================================================
// Archivo: src/services/authService.ts
//RESPONSABILIDAD: Capa de servicio dedicada a la autenticación (Login y Logout).
//Encapsula las peticiones HTTP al API de autenticación.
// =================================================================
import { apiFetch } from './api';
import { User } from '../context/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombreCompleto: string;
  email: string;
  password: string;
  role: 'Aprendiz' | 'Instructor';
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  accessToken: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: RegisterData): Promise<{ message: string; user: User }> => {
    return apiFetch<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      return await apiFetch<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      return { message: 'Sesión cerrada localmente' };
    }
  },
};

export default authService;