// =================================================================
// Archivo: src/pages/LoginPage/LoginPage.tsx
//RESPONSABILIDAD: Renderiza el formulario de inicio de sesión y consume el authService.login.
// =================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="max-w-md mx-auto my-12 p-6 bg-slate-800 border border-slate-700 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl font-bold text-sena-green text-center mb-6">Iniciar Sesión API SENA</h2>
      {error && <div className="p-3 mb-4 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="loginEmail" className="block text-xs font-bold text-slate-300 mb-1">Correo Institucional</label>
          <input id="loginEmail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sena-green" placeholder="roberto.gomez@sena.edu.co" />
        </div>
        <div>
          <label htmlFor="loginPassword" className="block text-xs font-bold text-slate-300 mb-1">Contraseña</label>
          <input id="loginPassword" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sena-green" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-sena-green text-slate-900 font-extrabold rounded-xl hover:bg-emerald-500 transition shadow-lg disabled:opacity-50">
          {loading ? 'Autenticando...' : 'Ingresar y Obtener JWT'}
        </button>
      </form>
    </div>
  );
}