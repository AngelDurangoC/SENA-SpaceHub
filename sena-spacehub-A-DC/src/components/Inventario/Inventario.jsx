import React, { useEffect, useState } from 'react';
import './Inventario.css';

export default function Inventario({ equipos = [], setEquipos, usuarioActual }) {
  
  const rol = (usuarioActual?.role || '').toLowerCase();
  const esAdmin = rol.includes('admin') || rol.includes('operario');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [placa, setPlaca] = useState('');
  const [nombre, setNombre] = useState('');
  const [ram, setRam] = useState('16GB RAM DDR4');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarEquipos = async (signal) => {
    setCargando(true);
    setError('');

    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const respuesta = await fetch('/api/v1/equipos', { headers, signal });

      if (!respuesta.ok) {
        throw new Error(`No se pudo cargar el inventario (${respuesta.status})`);
      }

      const equiposApi = await respuesta.json();
      const equiposNormalizados = equiposApi.map((equipo, indice) => ({
        ...equipo,
        id: equipo.id ?? equipo.idEquipo ?? equipo.placaSena ?? `equipo-${indice}`,
        placa: equipo.placa ?? equipo.placaSena ?? '',
        nombre: equipo.nombre ?? equipo.modelo ?? equipo.marcaModelo ?? 'Equipo sin nombre',
        especificacion: equipo.especificacion ?? equipo.ram ?? equipo.memoriaRam ?? 'Sin especificación',
        estado: equipo.estado ?? equipo.estadoEquipo ?? 'Sin estado'
      }));

      setEquipos(equiposNormalizados);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'No se pudo cargar el inventario.');
      }
    } finally {
      if (!signal.aborted) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    cargarEquipos(controller.signal);

    return () => controller.abort();
  }, []);

  const agregarEquipo = (e) => {
    e.preventDefault();
    if (!placa.trim() || !nombre.trim()) return;

    const nuevaPlaca = placa.toUpperCase().startsWith('SENA-') 
      ? placa.toUpperCase() 
      : `SENA-${placa.toUpperCase()}`;

    const nuevo = {
      id: Date.now(),
      placa: nuevaPlaca,
      nombre: nombre,
      especificacion: ram,
      estado: 'Operativo'
    };

    setEquipos([nuevo, ...equipos]);
    setPlaca('');
    setNombre('');
    setRam('16GB RAM DDR4');
    setMostrarFormulario(false);
  };

  const cambiarEstado = (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'Operativo' ? 'En Mantenimiento' : 'Operativo';
    const actualizados = equipos.map(eq => eq.id === id ? { ...eq, estado: nuevoEstado } : eq);
    setEquipos(actualizados);
  };

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <div>
          <h2>Inventario de Equipos de Cómputo</h2>
          <p className="subtitle">Control individualizado por Placa SENA e Interface `EquipoData`</p>
        </div>

        {esAdmin && (
          <button 
            type="button"
            className="btn-registrar-top" 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            + Registrar Nuevo Equipo
          </button>
        )}
      </div>

      {esAdmin && mostrarFormulario && (
        <div className="card-form dark-card form-animado">
          <p className="form-title-code">
            FORMULARIO: NUEVO EQUIPO (INTERFACE `EQUIPODATA`)
          </p>

          <form onSubmit={agregarEquipo}>
            <div className="inputs-inline-grid">
              <input 
                type="text" 
                placeholder="Placa SENA (ej. SENA-8942)" 
                value={placa} 
                onChange={(e) => setPlaca(e.target.value)} 
                required 
              />

              <input 
                type="text" 
                placeholder="Marca / Modelo (ej. Lenovo ThinkPad L14)" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
              />

              <select value={ram} onChange={(e) => setRam(e.target.value)}>
                <option value="8GB RAM DDR4">8GB RAM DDR4</option>
                <option value="16GB RAM DDR4">16GB RAM DDR4</option>
                <option value="32GB RAM DDR5">32GB RAM DDR5</option>
                <option value="64GB RAM DDR5">64GB RAM DDR5</option>
              </select>
            </div>

            <div className="form-actions-right">
              <button 
                type="button" 
                className="btn-cancelar" 
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary-green">
                Guardar en Inventario
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="inventario-alert" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => cargarEquipos(new AbortController().signal)}>
            Reintentar
          </button>
        </div>
      )}

      <div className="list-container dark-card">
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Placa SENA</th>
              <th>Equipo / Modelo</th>
              <th>Especificación</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="5" className="tabla-mensaje">Cargando equipos...</td>
              </tr>
            ) : equipos.length === 0 ? (
              <tr>
                <td colSpan="5" className="tabla-mensaje">No hay equipos registrados.</td>
              </tr>
            ) : equipos.map((eq) => (
              <tr key={eq.id}>
                <td className="placa-code">{eq.placa}</td>
                <td className="equipo-nombre">{eq.nombre}</td>
                <td className="especificacion">{eq.especificacion}</td>
                <td>
                  <span className={`badge-status ${eq.estado === 'Operativo' ? 'operativo' : 'mantenimiento'}`}>
                    {eq.estado}
                  </span>
                </td>
                <td className="text-right acciones-cell">
                  {esAdmin ? (
                    <button type="button" className="btn-toggle" onClick={() => cambiarEstado(eq.id, eq.estado)}>
                      Cambiar a {eq.estado === 'Operativo' ? 'Mantenimiento' : 'Operativo'}
                    </button>
                  ) : (
                    <span className="solo-operarios">Solo Operarios</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}