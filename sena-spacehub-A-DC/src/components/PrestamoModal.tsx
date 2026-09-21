import React, { useEffect, useState } from 'react';
import type { Equipo } from '../services/equiposService';

interface PrestamoData {
  aprendizId?: number;
  equipoPlaca: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PrestamoData) => Promise<void>;
  isAdmin: boolean;
  defaultUserId: number;
  defaultNombre: string;
  equipos: Equipo[];
}

export default function PrestamoModal({ isOpen, onClose, onSubmit, isAdmin, defaultUserId, defaultNombre, equipos }: Props) {
  const [equipoPlaca, setEquipoPlaca] = useState('');
  const [aprendizId, setAprendizId] = useState(String(defaultUserId));
  const [loading, setLoading] = useState(false);

  useEffect(() => setAprendizId(String(defaultUserId)), [defaultUserId]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ equipoPlaca, aprendizId: Number(aprendizId) });
      setEquipoPlaca('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-modal-backdrop" role="presentation">
      <div className="loan-modal" role="dialog" aria-modal="true" aria-labelledby="loan-modal-title">
        <div className="loan-modal-header">
          <div><p className="section-kicker">NUEVA ASIGNACIÓN</p><h3 id="loan-modal-title">Registrar préstamo</h3></div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar ventana">×</button>
        </div>
        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-field">
            <label htmlFor="loanEquipment">Seleccionar equipo</label>
            <select id="loanEquipment" required value={equipoPlaca} onChange={(event) => setEquipoPlaca(event.target.value)}>
              <option value="">Selecciona un equipo operativo</option>
              {equipos.filter((equipo) => equipo.estado === 'Operativo').map((equipo) => (
                <option key={equipo.id} value={equipo.placaSena}>{equipo.placaSena} · {equipo.marcaModelo}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="loanStudent">Aprendiz {isAdmin ? 'ID' : ''}</label>
            {isAdmin ? (
              <input id="loanStudent" type="number" min="1" required value={aprendizId} onChange={(event) => setAprendizId(event.target.value)} placeholder="Ej. 101" />
            ) : (
              <input id="loanStudent" type="text" value={defaultNombre} disabled />
            )}
          </div>
          <div className="editor-actions">
            <button type="button" className="secondary-action" onClick={onClose}>Cancelar</button>
            <button type="submit" className="primary-action" disabled={loading}>{loading ? 'Guardando...' : 'Asignar equipo'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}