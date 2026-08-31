import { NavLink } from "react-router-dom";

interface NavbarProps {
  equipos: unknown[];
  prestamos: unknown[];
  tickets: unknown[];
  usuarioActual: { nombre?: string; rol?: string } | null;
  esAdmin: boolean;
  cambiarRolRapido: () => void;
  cerrarSesion: () => void;
}

export default function Navbar({
  equipos,
  prestamos,
  tickets,
  usuarioActual,
  esAdmin,
  cambiarRolRapido,
  cerrarSesion,
}: NavbarProps) {
  return (
    <header className="global-header">
      <div className="nav-top-bar">
        <div className="brand-section">
          <span className="brand-badge">SENA SpaceHub</span>
          <span className="brand-sub">Centro de Gestión de Mercados, Logística y TI</span>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
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
          <button className="btn-salir" onClick={cerrarSesion}>Salir</button>
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
  );
}