import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";
import { authService } from "../../services/authService";

export default function Registro() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Aprendiz");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register({ nombreCompleto, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="register-card">
        <div className="register-heading">
          <span className="register-mark">S</span>
          <div>
            <p className="register-eyebrow">SENA SPACEHUB</p>
            <h2>Crear Cuenta</h2>
            <p className="register-description">Registra tus datos para acceder al inventario.</p>
          </div>
        </div>

        {error && <p className="error-msg">{error === "Failed to fetch" ? "No se pudo conectar con el servidor. Inicia el backend en el puerto 3000." : error}</p>}
        <form onSubmit={handleRegistro}>
          <div className="register-form-group">
            <label htmlFor="registerName">Nombre Completo</label>
            <input id="registerName" type="text" value={nombreCompleto} onChange={(event) => setNombreCompleto(event.target.value)} required placeholder="Ej. Carlos Pérez" />
          </div>
          <div className="register-form-group">
            <label htmlFor="registerEmail">Correo Electrónico</label>
            <input id="registerEmail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="correo@sena.edu.co" />
          </div>
          <div className="register-form-group">
            <label htmlFor="registerRole">Rol</label>
            <select id="registerRole" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="Aprendiz">Aprendiz</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>
          <div className="register-form-group">
            <label htmlFor="registerPassword">Contraseña</label>
            <input id="registerPassword" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="8" placeholder="Mínimo 8 caracteres" />
          </div>
          <button type="submit" className="register-submit" disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
        </form>
        <p className="register-footer">¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
