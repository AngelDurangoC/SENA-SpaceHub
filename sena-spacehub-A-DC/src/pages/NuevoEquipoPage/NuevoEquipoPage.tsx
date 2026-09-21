// =================================================================
// Archivo: src/pages/NuevoEquipoPage/NuevoEquipoPage.tsx
//RESPONSABILIDAD: Formulario para registrar un nuevo equipo en la API mediante POST.
// =================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equiposService } from '../../services/equiposService';

export default function NuevoEquipoPage() {
  const [placaSena, setPlacaSena] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [ram, setRam] = useState('16GB DDR4');
  const [ambiente, setAmbiente] = useState('Ambiente 301 - ADSO');
  const [estado, setEstado] = useState<'Operativo' | 'En Mantenimiento'>('Operativo');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await equiposService.create({ placaSena, marcaModelo, ram, ambiente, estado });
      navigate('/inventario');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar equipo');
    }
  };

  return (
    <section className="equipment-editor">
      <div className="editor-heading">
        <div>
          <p className="section-kicker">GESTIÓN DE INVENTARIO</p>
          <h1>Registrar nuevo equipo</h1>
          <p className="editor-subtitle">Completa la información para agregar un recurso.</p>
        </div>
        <span className="editor-code">POST /equipos</span>
      </div>
      {error && <div className="inventory-error">{error}</div>}
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-field">
          <label htmlFor="newEquipmentPlate">Placa SENA</label>
          <input id="newEquipmentPlate" type="text" required placeholder="SENA-1006" value={placaSena} onChange={(e) => setPlacaSena(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="newEquipmentModel">Marca / Modelo</label>
          <input id="newEquipmentModel" type="text" required placeholder="Lenovo ThinkPad L14 G3" value={marcaModelo} onChange={(e) => setMarcaModelo(e.target.value)} />
        </div>
        <div className="editor-form-grid">
          <div className="form-field">
            <label htmlFor="newEquipmentRam">Memoria RAM</label>
            <select id="newEquipmentRam" value={ram} onChange={(e) => setRam(e.target.value)}>
              <option value="8GB DDR4">8GB DDR4</option>
              <option value="16GB DDR4">16GB DDR4</option>
              <option value="32GB DDR5">32GB DDR5</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="newEquipmentStatus">Estado Inicial</label>
            <select id="newEquipmentStatus" value={estado} onChange={(e) => setEstado(e.target.value as 'Operativo' | 'En Mantenimiento')}>
              <option value="Operativo">Operativo</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="newEquipmentRoom">Ambiente Asignado</label>
          <input id="newEquipmentRoom" type="text" required value={ambiente} onChange={(e) => setAmbiente(e.target.value)} />
        </div>
        <div className="editor-actions">
          <button type="button" onClick={() => navigate('/inventario')} className="secondary-action">Cancelar</button>
          <button type="submit" className="primary-action">Guardar equipo</button>
        </div>
      </form>
    </section>
  );
}