import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login({ irA, usuarios }) {
  const { loginSimulado } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginRapido = (user) => {
    loginSimulado(user.correo, user.rol === "Admin" ? "Administrador" : user.rol);
    irA("dashboard");
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (usuarioEncontrado) {
      loginSimulado(
        usuarioEncontrado.correo,
        usuarioEncontrado.rol === "Admin" ? "Administrador" : usuarioEncontrado.rol
      );
      irA("dashboard");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card dark-theme">
        
        <div className="quick-login-section">
          <p className="quick-login-title">Probar como:</p>

          {usuarios.map((user, idx) => {
            const esAdmin = user.rol === "Admin" || user.rol === "Administrador";
            const badgeText = esAdmin ? "Admin" : "Aprendiz";
            const badgeClass = esAdmin ? "badge-blue" : "badge-green";
            const colorName = esAdmin ? "text-blue" : "text-green";

            return (
              <div key={idx} className="test-user-card" onClick={() => loginRapido(user)}>
                <div className="test-user-info">
                  <span className="user-icon">👤</span>
                  <div>
                    <p className={`user-name ${colorName}`}>{user.nombre}</p>
                    <p className="user-role">Rol: {user.rolLabel}</p>
                  </div>
                </div>
                <span className={`role-badge ${badgeClass}`}>{badgeText}</span>
              </div>
            );
          })}
        </div>

        
        <div className="divider">
          <span>O ingresa manualmente</span>
        </div>

        <form onSubmit={handleManualLogin}>
          {error && <p className="error-msg">{error}</p>}
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@correo.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-100">Ingresar</button>
        </form>

        <p className="footer-link">
          ¿No tienes cuenta?{" "}
          <span onClick={() => irA("registro")} className="link">
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}