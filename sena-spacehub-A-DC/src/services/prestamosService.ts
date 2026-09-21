import { apiFetch } from './api';

export interface Prestamo {
  id: number;
  userId: number;
  aprendiz: string;
  ficha: string;
  equipoPlaca: string;
  horaInicio: string;
  estado: 'Activo' | 'Devuelto';
  creadoPorRol: string;
}

export const prestamosService = {
  getAll: () => apiFetch<Prestamo[]>('/prestamos'),
  create: (data: { aprendizId?: number; equipoPlaca: string }) => apiFetch<Prestamo>('/prestamos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  devolver: (id: number) => apiFetch<Prestamo>(`/prestamos/${id}/devolver`, {
    method: 'PUT',
  }),
};

export default prestamosService;