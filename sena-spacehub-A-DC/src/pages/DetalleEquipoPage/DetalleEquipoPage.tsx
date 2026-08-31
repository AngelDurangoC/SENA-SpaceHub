import React from "react";
import { Link, useParams } from "react-router-dom";
import "../../components/Inventario/Inventario.css";

interface Equipo {
  id: number;
  placa: string;
  nombre: string;
  especificacion: string;
  estado: string;
}

interface DetalleEquipoPageProps {
  equipos: Equipo[];
}

export default function DetalleEquipoPage({ equipos }: DetalleEquipoPageProps) {
  const { placaSena } = useParams<{ placaSena: string }>();
  const equipo = equipos.find(
    (item) => item.placa.toLowerCase() === placaSena?.toLowerCase()
  );

  if (!equipo) {
    return (
      <div className="inventario-container">
        <h2>Equipo no encontrado</h2>
        <p className="subtitle">No existe un equipo con la placa SENA: {placaSena}</p>
        <Link className="btn-primary-green" to="/inventario">
          Volver al inventario
        </Link>
      </div>
    );
  }

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <div>
          <h2>Ficha Técnica del Computador</h2>
          <p className="subtitle">Placa SENA consultada: <strong>{placaSena}</strong></p>
        </div>
        <Link className="btn-cancelar" to="/inventario">
          Volver
        </Link>
      </div>

      <div className="dark-card">
        <p><strong>Placa SENA:</strong> {equipo.placa}</p>
        <p><strong>Equipo / Modelo:</strong> {equipo.nombre}</p>
        <p><strong>Especificación:</strong> {equipo.especificacion}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`badge-status ${equipo.estado === "Operativo" ? "operativo" : "mantenimiento"}`}>
            {equipo.estado}
          </span>
        </p>
      </div>
    </div>
  );
}