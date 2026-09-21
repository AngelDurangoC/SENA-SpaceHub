// =================================================================
// Archivo: src/services/api.ts
//RESPONSABILIDAD: Helper central HTTP que adjunta automáticamente el token JWT
//desde sessionStorage y maneja las URLs base utilizando VITE_API_URL.
// =================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('No se pudo conectar con la API. Inicia el backend en el puerto 3000.');
  }

  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();
  let data: { message?: string } | T;

  if (contentType.includes('application/json')) {
    try {
      data = JSON.parse(responseText) as T;
    } catch {
      throw new Error('La API devolvió un JSON inválido.');
    }
  } else {
    throw new Error(`La API devolvió una respuesta no válida (${response.status}). Verifica la URL del backend.`);
  }

  if (!response.ok) {
    throw new Error((data as { message?: string }).message || 'Error en la comunicación con la API REST');
  }
  return data as T;
}