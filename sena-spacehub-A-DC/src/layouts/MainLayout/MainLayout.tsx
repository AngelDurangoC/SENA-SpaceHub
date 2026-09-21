// =================================================================
// Archivo: src/layouts/MainLayout/MainLayout.tsx
//RESPONSABILIDAD: Layout Shell que integra el componente <NavBar/> y la barra de sesión
//con el botón de cierre de sesión (<Outlet/> para rutas hijas).
// =================================================================
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout-shell">
      <NavBar />
      <div className="session-bar">
        <div className="session-user">
          <span className="session-dot"></span>
          <span className="session-label">Sesión activa</span>
          <strong>{user?.nombreCompleto || 'Usuario Autenticado'}</strong>
          <span className="session-role">
            {user?.role || 'Rol'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>
      </div>
      <main className="content-viewport">
        <Outlet />
      </main>
    </div>
  );
}