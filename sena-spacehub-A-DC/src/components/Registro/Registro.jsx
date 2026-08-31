import React, { useState } from "react";
import "./Registro.css";

export default function Registro({ irA, usuarios, setUsuarios }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Aprendiz");
  const [ficha, setFicha] = useState("");

  const handleRegistro = (e) => {
    e.preventDefault();

    const existe = usuarios.some((u) => u.correo === correo);
    if (existe) {
      alert("El correo ya está registrado.");
      return;
    }

    const esAdmin = rol === "Admin" || rol === "Administrador";
    const rolLabelCalculado = esAdmin
      ? "Administrador • Gestión Total"
      : `Aprendiz ADSO • Ficha ${ficha || "2879451"}`;

    const nuevoUsuario = {
      nombre,
      correo,
      password,
      rol: esAdmin ? "Admin" : "Aprendiz",
      rolLabel: rolLabelCalculado
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];
    setUsuarios(usuariosActualizados);
    localStorage.setItem("sena_usuarios", JSON.stringify(usuariosActualizados));

    alert("¡Usuario registrado con éxito! Ahora aparece en 'Probar como'.");
    irA("login");
  };

  return (
    <div className="auth-container">
      <div className="register-card">
        <div className="register-heading">
          <span className="register-mark">S</span>
          <div>
            <p className="register-eyebrow">SENA SPACEHUB</p>
            <h2>Crear Cuenta</h2>
            <p className="register-description">Únete al centro de gestión de equipos tecnológicos.</p>
          </div>
        </div>

        <form onSubmit={handleRegistro}>
          <div className="register-form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej. Carlos Pérez"
            />
          </div>
          <div className="register-form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="register-form-group">
            <label>Rol / Tipo</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="Aprendiz">Aprendiz</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {rol === "Aprendiz" && (
            <div className="register-form-group">
              <label>Número de Ficha</label>
              <input
                type="text"
                value={ficha}
                onChange={(e) => setFicha(e.target.value)}
                placeholder="Ej. 2879451"
                required
              />
            </div>
          )}

          <div className="register-form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <button type="submit" className="register-submit">Registrarse</button>
        </form>
        <p className="register-footer">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => irA("login")} className="link">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}