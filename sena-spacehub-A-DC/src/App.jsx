import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Inventario from "./components/Inventario/Inventario.jsx";
import Prestamos from "./components/Prestamos/Prestamos.jsx";
import Ticketera from "./components/Ticketera/Ticketera.jsx";
import Login from "./components/Login/Login.jsx";
import Registro from "./components/Registro/Registro.jsx";
import NuevoEquipoPage from "./pages/NuevoEquipoPage/NuevoEquipoPage.tsx";
import DetalleEquipoPage from "./pages/DetalleEquipoPage/DetalleEquipoPage.tsx";
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, }
from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


export default function App() {

  return (
    <Routes>
      <Route path="/" element={<MainLayout equipos={equipos} prestamos={prestamos} tickets={tickets} usuarioActual={usuarioActual} esAdmin={esAdmin} cambiarRolRapido={cambiarRolRapido} cerrarSesion={cerrarSesion} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard equipos={equipos} prestamos={prestamos} tickets={tickets} /></ProtectedRoute>} />
        <Route path="inventario" element={<ProtectedRoute><Inventario equipos={equipos} setEquipos={setEquipos} usuarioActual={usuarioActual} /></ProtectedRoute>} />
        <Route path="inventario/nuevo" element={<ProtectedRoute rolPermitido="Administrador"><NuevoEquipoPage equipos={equipos} setEquipos={setEquipos} /></ProtectedRoute>} />
        <Route path="inventario/:placaSena" element={<ProtectedRoute><DetalleEquipoPage equipos={equipos} /></ProtectedRoute>} />
        <Route path="prestamos" element={<ProtectedRoute><Prestamos prestamos={prestamos} setPrestamos={setPrestamos} equipos={equipos} usuarioActual={usuarioActual} /></ProtectedRoute>} />
        <Route path="ticket" element={<ProtectedRoute><Ticketera tickets={tickets} setTickets={setTickets} equipos={equipos} /></ProtectedRoute>} />
      </Route>
      <Route path="/login" element={<Login irA={irA} usuarios={usuarios} />} />
      <Route path="/registro" element={<Registro irA={irA} usuarios={usuarios} setUsuarios={setUsuarios} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route>
        <Route element={<ProtectedRoute requiredRole="Administrador" />} />
        <Route path="inventario/nuevo" element={<NuevoEquipoPage />} />
        <Route path="inventario/:placaSena" element={<DetalleEquipoPage />} />
      </Route>
    </Routes>
    
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

