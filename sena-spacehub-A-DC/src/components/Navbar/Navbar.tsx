// =================================================================
// Archivo: src/components/NavBar/NavBar.tsx
//RESPONSABILIDAD: Barra de navegación superior con enlaces a los módulos principales.
// =================================================================
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="spacehub-navbar">
      <div className="spacehub-navbar-inner">
        <Link to="/dashboard" className="spacehub-brand">
          <span className="spacehub-brand-mark">S</span>
          <span>SENA <strong>SpaceHub</strong></span>
        </Link>
        <nav className="spacehub-nav" aria-label="Navegación principal">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/inventario">Inventario de equipos</Link>
        </nav>
      </div>
    </header>
  );
}