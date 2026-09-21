import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Registro from "./components/Registro/Registro.jsx";
import EquiposPage from "./pages/EquiposPage/EquiposPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import NuevoEquipoPage from "./pages/NuevoEquipoPage/NuevoEquipoPage.tsx";
import DetalleEquipoPage from "./pages/DetalleEquipoPage/DetalleEquipoPage.tsx";
import PrestamosPage from "./pages/PrestamosPage/PrestamosPage.tsx";
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";


export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard equipos={[]} prestamos={[]} tickets={[]} />} />
        <Route path="inventario" element={<EquiposPage />} />
        <Route path="prestamos" element={<PrestamosPage />} />
        <Route path="inventario/nuevo" element={<ProtectedRoute requiredRole="Administrador"><NuevoEquipoPage /></ProtectedRoute>} />
        <Route path="inventario/:placaSena" element={<DetalleEquipoPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

