import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

interface MainLayoutProps {
  equipos: Array<unknown>;
  prestamos: Array<unknown>;
  tickets: Array<unknown>;
  usuarioActual: { nombre?: string; rol?: string } | null;
  esAdmin: boolean;
  cambiarRolRapido: () => void;
  cerrarSesion: () => void;
}

export default function MainLayout({
  equipos,
  prestamos,
  tickets,
  usuarioActual,
  esAdmin,
  cambiarRolRapido,
  cerrarSesion,
}: MainLayoutProps) {
  return (
    <div className="layout-shell app-container">
      <Navbar
        equipos={equipos}
        prestamos={prestamos}
        tickets={tickets}
        usuarioActual={usuarioActual}
        esAdmin={esAdmin}
        cambiarRolRapido={cambiarRolRapido}
        cerrarSesion={cerrarSesion}
      />

      <main className="content-viewport main-content">
        <Outlet />
      </main>
    </div>
  );
}