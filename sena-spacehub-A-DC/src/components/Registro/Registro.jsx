import React, { useState } from "react";
import "../Login/Login.css";

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
      <div className="auth-card dark-theme">
        <h2 className="title-dark">Crear Cuenta</h2>
        <form onSubmit={handleRegistro}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej. Carlos Pérez"
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label>Rol / Tipo</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="Aprendiz">Aprendiz</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {rol === "Aprendiz" && (
            <div className="form-group">
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

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <button type="submit" className="btn-primary w-100">Registrarse</button>
        </form>
        <p className="footer-link">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => irA("login")} className="link">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}