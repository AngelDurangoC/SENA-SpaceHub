// =================================================================
// Archivo: src/components/NavBar/NavBar.tsx
//RESPONSABILIDAD: Barra de navegación superior con enlaces a los módulos principales.
// =================================================================
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <span className="font-extrabold text-sena-green tracking-tight text-lg">SENA SpaceHub</span>
        <nav className="flex gap-4 text-xs font-mono">
          <Link to="/dashboard" className="text-slate-300 hover:text-sena-green transition font-bold">Dashboard</Link>
          <Link to="/inventario" className="text-slate-300 hover:text-sena-green transition font-bold">Inventario Equipos</Link>
        </nav>
      </div>
    </header>
  );
}