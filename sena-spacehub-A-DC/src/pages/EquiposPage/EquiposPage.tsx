// =================================================================
// Archivo: src/pages/EquiposPage/EquiposPage.tsx
//RESPONSABILIDAD: Muestra la tabla con el listado de equipos y permite eliminar recursos.
// =================================================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equiposService, Equipo } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const loadEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equiposService.getAll();
      setEquipos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEquipos(); }, []);

  const handleDelete = async (placaSena: string) => {
    if (!window.confirm(`¿Eliminar el equipo ${placaSena}?`)) return;
    try {
      await equiposService.remove(placaSena);
      loadEquipos();
    } catch (err: unknown) {
      alert(`Error API: ${err instanceof Error ? err.message : 'Error al eliminar'}`);
    }
  };

  return (
    <section className="inventory-page">
      <div className="inventory-heading">
        <div>
          <p className="section-kicker">CONTROL DE RECURSOS</p>
          <h2>Inventario de Equipos SENA</h2>
          <p className="inventory-description">Datos obtenidos a través de la capa de servicio.</p>
        </div>
        {isAdmin && (
          <Link to="/inventario/nuevo" className="primary-action">
            + Registrar Equipo (POST)
          </Link>
        )}
      </div>

      {error && <div className="inventory-error">{error}</div>}

      {loading ? (
        <div className="inventory-loading">Cargando inventario...</div>
      ) : (
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Placa SENA</th>
                <th>Marca / Modelo</th>
                <th>RAM</th>
                <th>Ambiente</th>
                <th>Estado</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {equipos.map((eq) => (
                <tr key={eq.placaSena}>
                  <td className="equipment-code">{eq.placaSena}</td>
                  <td className="equipment-name">{eq.marcaModelo}</td>
                  <td>{eq.ram}</td>
                  <td>{eq.ambiente}</td>
                  <td>
                    <span className={`equipment-status ${eq.estado === 'Operativo' ? 'is-operational' : 'is-maintenance'}`}>
                      {eq.estado}
                    </span>
                  </td>
                  <td className="equipment-actions">
                    <Link to={`/inventario/${eq.placaSena}`} className="edit-action">Editar</Link>
                    {isAdmin && (
                      <button onClick={() => handleDelete(eq.placaSena)} className="delete-action">Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}