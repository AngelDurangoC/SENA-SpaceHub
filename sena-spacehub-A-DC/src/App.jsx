import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Inventario from "./components/Inventario/Inventario.jsx";
import Prestamos from "./components/Prestamos/Prestamos.jsx";
import Ticketera from "./components/Ticketera/Ticketera.jsx";
import Login from "./components/Login/Login.jsx";
import Registro from "./components/Registro/Registro.jsx";

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
  const [vista, setVista] = useState("dashboard");
  const [usuarioActual, setUsuarioActual] = useState(usuariosIniciales[0]);

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

  const irA = (nuevaVista) => setVista(nuevaVista);

  const cambiarRolRapido = () => {
    if (usuarioActual?.rol === "Admin") {
      setUsuarioActual(usuariosIniciales[0]);
    } else {
      setUsuarioActual(usuariosIniciales[1]);
    }
  };

  const esAdmin = usuarioActual?.rol === "Admin";

  return (
    <div className="app-container">
      {vista !== "login" && vista !== "registro" && (
        <header className="global-header">
 
          <div className="nav-top-bar">
            <div className="brand-section">
              <span className="brand-badge">SENA SpaceHub</span>
              <span className="brand-sub">Centro de Gestión de Mercados, Logística y TI</span>
            </div>

            <nav className="nav-menu">
              <button className={vista === "dashboard" ? "active" : ""} onClick={() => irA("dashboard")}>
                📊 Dashboard
              </button>
              <button className={vista === "inventario" ? "active" : ""} onClick={() => irA("inventario")}>
                💻 Inventario ({equipos.length})
              </button>
              <button className={vista === "prestamos" ? "active" : ""} onClick={() => irA("prestamos")}>
                📋 Préstamos ({prestamos.length})
              </button>
              <button className={vista === "ticket" ? "active" : ""} onClick={() => irA("ticket")}>
                🛠️ Ticketera ({tickets.length})
              </button>
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
      )}

      <main className="main-content">
        {vista === "login" && (
          <Login irA={irA} usuarios={usuarios} setUsuarioActual={setUsuarioActual} />
        )}
        {vista === "registro" && (
          <Registro irA={irA} usuarios={usuarios} setUsuarios={setUsuarios} />
        )}
        {vista === "dashboard" && (
          <Dashboard equipos={equipos} prestamos={prestamos} tickets={tickets} />
        )}
        {vista === "inventario" && (
          <Inventario equipos={equipos} setEquipos={setEquipos} usuarioActual={usuarioActual} />
        )}
        {vista === "prestamos" && (
          <Prestamos 
            prestamos={prestamos} 
            setPrestamos={setPrestamos} 
            equipos={equipos} 
            usuarioActual={usuarioActual} 
          />
        )}
        {vista === "ticket" && (
          <Ticketera 
            tickets={tickets} 
            setTickets={setTickets} 
            equipos={equipos} 
          />
        )}
      </main>
    </div>
  );
}

export default App;