// =================================================================
// Archivo: src/pages/LoginPage/LoginPage.tsx
//RESPONSABILIDAD: Renderiza el formulario de inicio de sesión y consume el authService.login.
// =================================================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components/Login/Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card dark-theme">
        <div className="auth-brand-mark">S</div>
        <p className="auth-eyebrow">SENA SPACEHUB</p>
        <h1>Iniciar Sesión</h1>
        <p className="auth-description">Accede al inventario de equipos y ambientes.</p>

        {error && <p className="error-msg" role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Correo Institucional</label>
            <input id="loginEmail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="roberto.gomez@sena.edu.co" />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Contraseña</label>
            <input id="loginPassword" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Autenticando...' : 'Ingresar y Obtener JWT'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}