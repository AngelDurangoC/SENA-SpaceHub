import React, { useEffect, useState } from 'react';
import { equiposService, type Equipo } from '../../services/equiposService';
import { prestamosService, type Prestamo } from '../../services/prestamosService';
import { useAuth } from '../../context/AuthContext';
import PrestamoModal from '../../components/PrestamoModal';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin, user } = useAuth();

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const [prestamosResult, equiposResult] = await Promise.allSettled([
      prestamosService.getAll(),
      equiposService.getAll(),
    ]);

    if (prestamosResult.status === 'fulfilled') {
      setPrestamos(prestamosResult.value);
    } else {
      setError(prestamosResult.reason instanceof Error ? prestamosResult.reason.message : 'No se pudieron cargar los préstamos');
    }

    if (equiposResult.status === 'fulfilled') {
      setEquipos(equiposResult.value);
    } else if (!error) {
      setError(equiposResult.reason instanceof Error ? equiposResult.reason.message : 'No se pudieron cargar los equipos');
    }

    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCrearPrestamo = async (data: { aprendizId?: number; equipoPlaca: string }) => {
    try {
      await prestamosService.create(data);
      await loadData();
      window.alert('Préstamo registrado. El equipo fue asignado correctamente.');
    } catch (err: unknown) {
      window.alert(`No se pudo registrar: ${err instanceof Error ? err.message : 'Error inesperado'}`);
      throw err;
    }
  };

  const handleDevolver = async (prestamo: Prestamo) => {
    if (!window.confirm(`¿Confirmar devolución?\nSe liberará el equipo ${prestamo.equipoPlaca}.`)) return;
    try {
      await prestamosService.devolver(prestamo.id);
      await loadData();
      window.alert('Equipo devuelto correctamente.');
    } catch (err: unknown) {
      window.alert(`No se pudo devolver: ${err instanceof Error ? err.message : 'Error inesperado'}`);
    }
  };

  return (
    <section className="loans-page">
      <div className="loans-heading">
        <div><p className="section-kicker">CONTROL DE RECURSOS</p><h2>Gestión de préstamos</h2><p>Asignaciones, tiempos de salida y devoluciones.</p></div>
        <button type="button" className="primary-action" onClick={() => setIsModalOpen(true)} disabled={!equipos.length}>+ Nuevo préstamo</button>
      </div>
      {error && <div className="inventory-error">{error}</div>}
      <div className="inventory-table-wrap">
        {loading ? <div className="inventory-loading">Conectando con el servidor...</div> : (
          <table className="inventory-table loans-table">
            <thead><tr><th>Aprendiz / Ficha</th><th>Equipo</th><th>Hora salida</th><th>Estado</th><th className="actions-column">Acciones</th></tr></thead>
            <tbody>
              {prestamos.map((prestamo) => <tr key={prestamo.id}>
                <td><strong className="equipment-name">{prestamo.aprendiz}</strong><small>Ficha: {prestamo.ficha}</small></td>
                <td className="equipment-code">{prestamo.equipoPlaca}</td><td>{prestamo.horaInicio}</td>
                <td><span className={`equipment-status ${prestamo.estado === 'Activo' ? 'loan-active' : 'loan-returned'}`}>{prestamo.estado}</span></td>
                <td className="equipment-actions">{prestamo.estado === 'Activo' && <button type="button" className="edit-action" onClick={() => handleDevolver(prestamo)}>Devolver</button>}</td>
              </tr>)}
              {!prestamos.length && <tr><td colSpan={5} className="inventory-loading">No hay préstamos registrados.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <PrestamoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCrearPrestamo} isAdmin={isAdmin} defaultUserId={user?.id || 0} defaultNombre={user?.nombreCompleto || ''} equipos={equipos} />
    </section>
  );
}