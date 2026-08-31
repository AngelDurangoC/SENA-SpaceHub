import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/Inventario/Inventario.css";

interface Equipo {
  id: number;
  placa: string;
  nombre: string;
  especificacion: string;
  estado: string;
}

interface NuevoEquipoPageProps {
  equipos: Equipo[];
  setEquipos: React.Dispatch<React.SetStateAction<Equipo[]>>;
}

export default function NuevoEquipoPage({ equipos, setEquipos }: NuevoEquipoPageProps) {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [nombre, setNombre] = useState("");
  const [ram, setRam] = useState("16GB RAM DDR4");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const placaNormalizada = placa.trim().toUpperCase().startsWith("SENA-")
      ? placa.trim().toUpperCase()
      : `SENA-${placa.trim().toUpperCase()}`;

    const nuevoEquipo: Equipo = {
      id: Date.now(),
      placa: placaNormalizada,
      nombre: nombre.trim(),
      especificacion: ram,
      estado: "Operativo",
    };

    setEquipos([nuevoEquipo, ...equipos]);
    navigate("/inventario");
  };

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <div>
          <h2>Registrar Nuevo Equipo</h2>
          <p className="subtitle">Agrega un computador al inventario institucional.</p>
        </div>
      </div>

      <div className="card-form dark-card">
        <form onSubmit={handleSubmit}>
          <div className="inputs-inline-grid">
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="Placa SENA (ej. SENA-8942)"
              required
            />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Marca / Modelo"
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
            <button type="button" className="btn-cancelar" onClick={() => navigate("/inventario")}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-green">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}