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
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const usuariosIniciales = [
  {
    nombre: "Ana María Fajardo",
    correo: "ana@sena.edu.co",
    password: "123",
    rol: "Aprendiz",
    rolLabel: "Aprendiz ADSO • Ficha 2879451"
  },
  {
    nombre: "Ing. Roberto Gómez",
    correo: "roberto@sena.edu.co",
    password: "123",
    rol: "Admin",
    rolLabel: "Administrador • Gestión Total"
  }
];

const equiposIniciales = [
  { id: 1, placa: "SENA-1001", nombre: "Lenovo ThinkPad L14 G3", especificacion: "16GB DDR4", estado: "Operativo" },
  { id: 2, placa: "SENA-1002", nombre: "HP ProBook 440 G8", especificacion: "16GB DDR4", estado: "En Mantenimiento" },
  { id: 3, placa: "SENA-1003", nombre: "Dell Latitude 3420", especificacion: "32GB DDR5", estado: "Operativo" },
  { id: 4, placa: "SENA-1004", nombre: "Lenovo ThinkPad L14 G3", especificacion: "16GB DDR4", estado: "Operativo" },
  { id: 5, placa: "SENA-1005", nombre: "ASUS ExpertBook P2", especificacion: "8GB DDR4", estado: "Operativo" }
];

const ticketsIniciales = [
  { id: 1, equipoPlaca: "SENA-1002", prioridad: "Alta", descripcion: "Falla en el teclado y puerto HDMI intermitente" },
  { id: 2, equipoPlaca: "SENA-1005", prioridad: "Media", descripcion: "Batería no retiene carga más de 30 minutos" }
];

function App() {
  const { user: usuarioActual, loginSimulado, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem("sena_usuarios");
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  const [equipos, setEquipos] = useState(() => {
    const guardados = localStorage.getItem("sena_equipos");
    return guardados ? JSON.parse(guardados) : equiposIniciales;
  });

  const [prestamos, setPrestamos] = useState(() => {
    const guardados = localStorage.getItem("sena_prestamos");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [tickets, setTickets] = useState(() => {
    const guardados = localStorage.getItem("sena_tickets");
    return guardados ? JSON.parse(guardados) : ticketsIniciales;
  });

  useEffect(() => {
    localStorage.setItem("sena_equipos", JSON.stringify(equipos));
  }, [equipos]);

  useEffect(() => {
    localStorage.setItem("sena_prestamos", JSON.stringify(prestamos));
  }, [prestamos]);

  useEffect(() => {
    localStorage.setItem("sena_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const irA = (nuevaVista) => navigate(nuevaVista === "dashboard" ? "/" : `/${nuevaVista}`);

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const cambiarRolRapido = () => {
    if (usuarioActual?.rol === "Administrador") {
      loginSimulado("ana@sena.edu.co", "Aprendiz");
    } else {
      loginSimulado("roberto@sena.edu.co", "Administrador");
    }
  };

  const esAdmin = usuarioActual?.rol === "Administrador" || usuarioActual?.rol === "Admin";

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

export default AppWithRouter;