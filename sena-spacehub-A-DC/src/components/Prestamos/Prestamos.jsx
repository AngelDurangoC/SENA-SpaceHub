import React, { useState } from 'react';
import './Prestamos.css';

export default function Prestamos({ prestamos = [], setPrestamos, equipos = [], usuarioActual }) {
  const rol = (usuarioActual?.role || '').toLowerCase();
  const esAdmin = rol.includes('admin') || rol.includes('operario');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [ficha, setFicha] = useState('2879451');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');

  const solicitarPrestamo = (e) => {
    e.preventDefault();

    
    const nombreFinal = esAdmin ? nombreSolicitante : usuarioActual?.nombre;

    if (!nombreFinal || nombreFinal.trim() === '') {
      alert('Ingresa el nombre del aprendiz solicitante.');
      return;
    }

    const placaFinal = equipoSeleccionado || (equipos[0] ? equipos[0].placa : 'SENA-1001');

    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const nuevoPrestamo = {
      id: Date.now(),
      nombre: nombreFinal,
      ficha: ficha,
      equipoPlaca: placaFinal,
      hora: horaFormateada
    };

    setPrestamos([nuevoPrestamo, ...prestamos]);
    setNombreSolicitante('');
    setMostrarFormulario(false);
  };

  const registrarDevolucion = (id) => {
    setPrestamos(prestamos.filter((p) => p.id !== id));
  };

  return (
    <div className="prestamos-container">
      <div className="prestamos-header">
        <div>
          <h2>Gestión de Solicitudes de Préstamo</h2>
          <p className="subtitle">
            Control de entregas y devoluciones para aprendices e instructores
          </p>
        </div>

        <button 
          type="button"
          className="btn-solicitar-top" 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          📋 Solicitar Préstamo de Equipo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card-form dark-card form-animado">
          <div className="form-top-title-bar">
            <span className="form-title-code">
              FORMULARIO: NUEVA SOLICITUD (INTERFACE `PRESTAMODATA`)
            </span>
            <span className="badge-modo-operario">
              {esAdmin ? "Modo Gestión Operario" : "Modo Aprendiz"}
            </span>
          </div>

          <div className="banner-info-blue">
            🛠️ <strong>Modo Operario / Administrador:</strong> Puedes registrar la entrega física de un equipo ingresando los datos del aprendiz solicitante.
          </div>

          <form onSubmit={solicitarPrestamo}>
            <div className="inputs-prestamo-grid">
              <div className="input-field-group">
                <label>Aprendiz Solicitante:</label>
                {esAdmin ? (
                  
                  <input 
                    type="text" 
                    placeholder="Nombre del Aprendiz Solicitante" 
                    value={nombreSolicitante} 
                    onChange={(e) => setNombreSolicitante(e.target.value)}
                    required
                  />
                ) : (
                
                  <input 
                    type="text" 
                    value={usuarioActual?.nombre || 'Ana María Fajardo'} 
                    disabled 
                  />
                )}
              </div>

              <div className="input-field-group">
                <label>Número de Ficha SENA:</label>
                <input 
                  type="text" 
                  value={ficha} 
                  onChange={(e) => setFicha(e.target.value)} 
                  required 
                />
              </div>

              <div className="input-field-group">
                <label>Equipo Requerido (Placa SENA):</label>
                <select 
                  value={equipoSeleccionado} 
                  onChange={(e) => setEquipoSeleccionado(e.target.value)}
                >
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.placa}>
                      {eq.placa} - {eq.nombre}
                    </option>
                  ))}
                </select>
              </div>
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
                Confirmar Solicitud de Préstamo
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="prestamos-cards-grid">
        {prestamos.map((item) => (
          <div key={item.id} className="card-prestamo dark-card">
            <div className="card-prestamo-header">
              <span className="badge-ficha">Ficha #{item.ficha}</span>
              <span className="time-text">{item.hora}</span>
            </div>

            <div className="card-prestamo-body">
              <h3 className="solicitante-nombre">{item.nombre}</h3>
              <p className="equipo-info">
                Equipo: <span className="placa-highlight">{item.equipoPlaca}</span>
              </p>
            </div>

            <button 
              type="button"
              className="btn-devolucion" 
              onClick={() => registrarDevolucion(item.id)}
            >
              <span className="icon-check">✓</span> Registrar Devolución
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}