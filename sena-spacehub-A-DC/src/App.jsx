import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Inventario from "./components/Inventario/Inventario.jsx";
import Prestamos from "./components/Prestamos/Prestamos.jsx";
import Ticketera from "./components/Ticketera/Ticketera.jsx";
import Login from "./components/Login/Login.jsx";
import Registro from "./components/Registro/Registro.jsx";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

function MainLayout({ equipos, prestamos, tickets, usuarioActual, esAdmin, cambiarRolRapido, irA }) {
  const location = useLocation();

  return (
    <div className="app-container">
      <header className="global-header">
        <div className="nav-top-bar">
          <div className="brand-section">
            <span className="brand-badge">SENA SpaceHub</span>
            <span className="brand-sub">Centro de Gestión de Mercados, Logística y TI</span>
          </div>

          <nav className="nav-menu">
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/inventario" className={({ isActive }) => isActive ? "active" : ""}>
              💻 Inventario ({equipos.length})
            </NavLink>
            <NavLink to="/prestamos" className={({ isActive }) => isActive ? "active" : ""}>
              📋 Préstamos ({prestamos.length})
            </NavLink>
            <NavLink to="/ticket" className={({ isActive }) => isActive ? "active" : ""}>
              🛠️ Ticketera ({tickets.length})
            </NavLink>
          </nav>
        </div>

        <div className="user-info-bar">
          <div className="user-chip">
            <span className="online-dot"></span>
            <strong>{usuarioActual?.nombre || "Usuario"}</strong>
            <span className="role-tag">{usuarioActual?.rol || "Aprendiz"}</span>
            <button className="btn-salir" onClick={() => irA("login")}>Salir</button>
          </div>

          <div className="mode-banner">
            <span>
              🕹️ Modo <strong>{esAdmin ? "Operador/Admin" : "Aprendiz ADSO"}</strong> activo.
            </span>
            <button className="btn-switch-role" onClick={cambiarRolRapido}>
              ⚡ Cambiar a {esAdmin ? "Aprendiz" : "Operador/Admin"}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet context={{ location }} />
      </main>
    </div>
  );
}

function App() {
  const [usuarioActual, setUsuarioActual] = useState(usuariosIniciales[0]);
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

  const cambiarRolRapido = () => {
    if (usuarioActual?.rol === "Admin") {
      setUsuarioActual(usuariosIniciales[0]);
    } else {
      setUsuarioActual(usuariosIniciales[1]);
    }
  };

  const esAdmin = usuarioActual?.rol === "Admin";

  return (
    <Routes>
      <Route path="/" element={<MainLayout equipos={equipos} prestamos={prestamos} tickets={tickets} usuarioActual={usuarioActual} esAdmin={esAdmin} cambiarRolRapido={cambiarRolRapido} irA={irA} />}>
        <Route index element={<Dashboard equipos={equipos} prestamos={prestamos} tickets={tickets} />} />
        <Route path="inventario" element={<Inventario equipos={equipos} setEquipos={setEquipos} usuarioActual={usuarioActual} />} />
        <Route path="prestamos" element={<Prestamos prestamos={prestamos} setPrestamos={setPrestamos} equipos={equipos} usuarioActual={usuarioActual} />} />
        <Route path="ticket" element={<Ticketera tickets={tickets} setTickets={setTickets} equipos={equipos} />} />
      </Route>
      <Route path="/login" element={<Login irA={irA} usuarios={usuarios} setUsuarioActual={setUsuarioActual} />} />
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