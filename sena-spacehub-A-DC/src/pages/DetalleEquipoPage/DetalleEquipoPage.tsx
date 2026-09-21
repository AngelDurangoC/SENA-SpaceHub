// =================================================================
// Archivo: src/pages/DetalleEquipoPage/DetalleEquipoPage.tsx
//RESPONSABILIDAD: Formulario para consultar y actualizar un equipo existente mediante PUT.
// =================================================================
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equiposService, Equipo } from '../../services/equiposService';

export default function DetalleEquipoPage() {
  const { placaSena } = useParams<{ placaSena: string }>();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [ram, setRam] = useState('16GB DDR4');
  const [ambiente, setAmbiente] = useState('');
  const [estado, setEstado] = useState<'Operativo' | 'En Mantenimiento'>('Operativo');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    equiposService.getAll()
      .then((data) => {
        const found = data.find((e) => e.placaSena.toUpperCase() === placaSena?.toUpperCase());
        if (found) {
          setEquipo(found);
          setRam(found.ram);
          setAmbiente(found.ambiente);
          setEstado(found.estado);
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, [placaSena]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await equiposService.update(placaSena!, { ram, ambiente, estado });
      navigate('/inventario');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  if (!equipo && !error) return <div className="p-6 text-white text-center font-mono text-xs">Cargando recurso...</div>;

  return (
    <section className="equipment-editor">
      <div className="editor-heading">
        <div>
          <p className="section-kicker">GESTIÓN DE INVENTARIO</p>
          <h1>Editar equipo</h1>
          <p className="editor-subtitle">Placa SENA: <strong>{placaSena}</strong></p>
        </div>
        <span className="editor-code">PUT /equipos</span>
      </div>
      {error && <div className="inventory-error">{error}</div>}
      <form onSubmit={handleUpdate} className="equipment-form">
        <div className="form-field">
          <label htmlFor="editEquipmentRam">Memoria RAM</label>
          <select id="editEquipmentRam" value={ram} onChange={(e) => setRam(e.target.value)}>
            <option value="8GB DDR4">8GB DDR4</option>
            <option value="16GB DDR4">16GB DDR4</option>
            <option value="32GB DDR5">32GB DDR5</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="editEquipmentStatus">Estado Técnico</label>
          <select id="editEquipmentStatus" value={estado} onChange={(e) => setEstado(e.target.value as 'Operativo' | 'En Mantenimiento')}>
            <option value="Operativo">Operativo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="editEquipmentRoom">Ambiente Asignado</label>
          <input id="editEquipmentRoom" type="text" value={ambiente} onChange={(e) => setAmbiente(e.target.value)} />
        </div>
        <div className="editor-actions">
          <button type="button" onClick={() => navigate('/inventario')} className="secondary-action">Volver</button>
          <button type="submit" className="primary-action">Actualizar recurso</button>
        </div>
      </form>
    </section>
  );
}