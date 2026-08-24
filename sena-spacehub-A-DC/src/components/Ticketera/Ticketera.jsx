import React, { useState } from 'react';

export default function Ticketera({ tickets = [], setTickets, equipos = [] }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Alta');

  const crearTicket = (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const placaFinal = equipoSeleccionado || (equipos[0] ? equipos[0].placa : 'SENA-1001');

    const nuevoTicket = {
      id: Date.now(),
      equipoPlaca: placaFinal,
      prioridad: prioridad,
      descripcion: descripcion.trim()
    };

    setTickets([nuevoTicket, ...tickets]);
    setDescripcion('');
    setPrioridad('Alta');
    setMostrarFormulario(false);
  };

  const resolverTicket = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const getBadgeStyle = (prio) => {
    switch (prio) {
      case 'Alta':
        return { backgroundColor: 'rgba(225, 29, 72, 0.2)', color: '#f43f5e', border: '1px solid #e11d48' };
      case 'Media':
        return { backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#f59e0b', border: '1px solid #d97706' };
      default:
        return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981' };
    }
  };

  return (
    <div style={{ backgroundColor: '#050811', padding: '24px', borderRadius: '12px', color: '#fff', fontFamily: 'sans-serif' }}>
   
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Mesa de Ayuda y Ticketera de Fallas</h2>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Reportes de fallas técnicas e incidencias de hardware</p>
        </div>

        <button 
          type="button"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          🛠️ Reportar Incidencia
        </button>
      </div>

      {mostrarFormulario && (
        <div style={{ backgroundColor: '#080d1a', border: '1px solid #131c31', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
            FORMULARIO: TICKET DE SOPORTE (INTERFACE `INCIDENCIADATA`)
          </p>

          <form onSubmit={crearTicket}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <select 
                value={equipoSeleccionado} 
                onChange={(e) => setEquipoSeleccionado(e.target.value)}
                style={{ backgroundColor: '#0e1526', border: '1px solid #1e293b', color: '#ffffff', padding: '12px', borderRadius: '8px', outline: 'none' }}
              >
                {equipos.length > 0 ? (
                  equipos.map((eq) => (
                    <option key={eq.id} value={eq.placa}>
                      {eq.placa} - {eq.nombre}
                    </option>
                  ))
                ) : (
                  <option value="SENA-1001">SENA-1001 - Lenovo ThinkPad L14</option>
                )}
              </select>

              <input 
                type="text" 
                placeholder="Descripción breve de la falla" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                style={{ backgroundColor: '#0e1526', border: '1px solid #1e293b', color: '#ffffff', padding: '12px', borderRadius: '8px', outline: 'none' }}
                required 
              />

              <select 
                value={prioridad} 
                onChange={(e) => setPrioridad(e.target.value)}
                style={{ backgroundColor: '#0e1526', border: '1px solid #1e293b', color: '#ffffff', padding: '12px', borderRadius: '8px', outline: 'none' }}
              >
                <option value="Alta">Prioridad: Alta</option>
                <option value="Media">Prioridad: Media</option>
                <option value="Baja">Prioridad: Baja</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => setMostrarFormulario(false)}
                style={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: 'none', padding: '10px 20px', borderRadius: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Generar Ticket
              </button>
            </div>
          </form>
        </div>
      )}

  
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            style={{ 
              backgroundColor: '#080d1a', 
              border: '1px solid #131c31', 
              borderRadius: '12px', 
              padding: '20px', 
              display: 'flex', 
              justify: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {ticket.equipoPlaca}
                </span>
                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', ...getBadgeStyle(ticket.prioridad) }}>
                  Prioridad {ticket.prioridad}
                </span>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>{ticket.descripcion}</p>
            </div>

            <button 
              type="button" 
              onClick={() => resolverTicket(ticket.id)}
              style={{ backgroundColor: '#84cc16', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Resolver Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}