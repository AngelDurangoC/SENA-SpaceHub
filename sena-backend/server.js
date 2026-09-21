// =================================================================
// SENA SPACEHUB - BACKEND API REST INSUMO (Node.js + Express + JWT)
// Archivo: server.js
// FUNCIÓN: Proporciona el servidor HTTP con endpoints protegidos por JWT,
// control de roles (RBAC), login, logout y CRUD completo de equipos.
// =================================================================
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'SENA_SPACEHUB_SECRET_KEY_2026_ADSO';

app.use(cors());
app.use(express.json());

const USERS = [
  { id: 999, nombreCompleto: 'Ing. Roberto Gómez', email: 'roberto.gomez@sena.edu.co', password: 'admin123password', role: 'Administrador' },
  { id: 101, nombreCompleto: 'Ana María Fajardo', email: 'ana.fajardo@sena.edu.co', password: 'aprendiz123password', role: 'Aprendiz', ficha: 'ADSO-2873711' },
  { id: 202, nombreCompleto: 'Prof. Juan Carlos Pérez', email: 'instructor.perez@sena.edu.co', password: 'instructor123password', role: 'Instructor' }
];

let EQUIPOS = [
  { id: 1, placaSena: "SENA-1001", marcaModelo: "Lenovo ThinkPad L14 G3", ram: "16GB DDR4", ambiente: "Ambiente 301 - ADSO", estado: "Operativo" },
  { id: 2, placaSena: "SENA-1002", marcaModelo: "HP ProBook 440 G8", ram: "16GB DDR4", ambiente: "Ambiente 302 - Redes", estado: "En Mantenimiento" },
  { id: 3, placaSena: "SENA-1003", marcaModelo: "Dell Latitude 3420", ram: "32GB DDR5", ambiente: "Ambiente 301 - ADSO", estado: "Operativo" },
  { id: 4, placaSena: "SENA-1004", marcaModelo: "Lenovo ThinkPad L14 G3", ram: "16GB DDR4", ambiente: "Ambiente 303 - Hardware", estado: "Operativo" },
  { id: 5, placaSena: "SENA-1005", marcaModelo: "ASUS ExpertBook P2", ram: "8GB DDR4", ambiente: "Taller Prototipado 3D", estado: "Operativo" }
];

let PRESTAMOS = [
  { id: 1, userId: 101, equipoPlaca: 'SENA-1001', horaInicio: '08:00 AM', estado: 'Activo', creadoPorRol: 'Aprendiz' }
];

const getPrestamosConDetalles = (prestamos) => prestamos.map((prestamo) => {
  const usuario = USERS.find((user) => user.id === prestamo.userId);
  return {
    id: prestamo.id,
    userId: prestamo.userId,
    aprendiz: usuario?.nombreCompleto || 'Desconocido',
    ficha: usuario?.ficha || 'N/A',
    equipoPlaca: prestamo.equipoPlaca,
    horaInicio: prestamo.horaInicio,
    estado: prestamo.estado,
    creadoPorRol: prestamo.creadoPorRol
  };
});

// Middleware de Validación JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT requerido en cabecera Authorization: Bearer <token>' });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT inválido o expirado' });
    req.user = userPayload;
    next();
  });
};

// Middleware de Control de Roles (RBAC)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ statusCode: 403, error: 'Forbidden', message: `Acceso denegado para el rol '${req.user?.role}'` });
    }
    next();
  };
};

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Credenciales inválidas' });

  const accessToken = jwt.sign({ sub: user.id, name: user.nombreCompleto, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ statusCode: 200, message: 'Autenticación exitosa', accessToken, user: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email, role: user.role } });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { nombreCompleto, email, password, role = 'Aprendiz' } = req.body;
  if (!nombreCompleto || !email || !password) {
    return res.status(400).json({ statusCode: 400, message: 'Nombre, correo y contraseña son obligatorios' });
  }
  if (USERS.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ statusCode: 409, message: 'El correo ya está registrado' });
  }
  if (!['Administrador', 'Aprendiz', 'Instructor'].includes(role)) {
    return res.status(400).json({ statusCode: 400, message: 'Rol no válido' });
  }
  const newUser = { id: Date.now(), nombreCompleto, email, password, role };
  USERS.push(newUser);
  return res.status(201).json({ message: 'Cuenta creada correctamente', user: { id: newUser.id, nombreCompleto, email, role } });
});
app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  return res.json({ statusCode: 200, message: 'Sesión cerrada exitosamente en el servidor' });
});

app.get('/api/v1/prestamos', authenticateToken, (req, res) => {
  const prestamos = req.user.role === 'Aprendiz'
    ? PRESTAMOS.filter((prestamo) => prestamo.userId === Number(req.user.sub))
    : PRESTAMOS;
  return res.json(getPrestamosConDetalles(prestamos));
});

app.post('/api/v1/prestamos', authenticateToken, (req, res) => {
  const { aprendizId, equipoPlaca } = req.body;
  const userId = req.user.role === 'Aprendiz' ? Number(req.user.sub) : Number(aprendizId);
  const usuario = USERS.find((user) => user.id === userId && user.role === 'Aprendiz');
  const equipo = EQUIPOS.find((item) => item.placaSena.toUpperCase() === String(equipoPlaca || '').toUpperCase());

  if (!usuario) return res.status(404).json({ statusCode: 404, message: 'Aprendiz no encontrado' });
  if (!equipo) return res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
  if (equipo.estado !== 'Operativo') return res.status(409).json({ statusCode: 409, message: 'El equipo no está disponible' });
  if (PRESTAMOS.some((prestamo) => prestamo.equipoPlaca === equipo.placaSena && prestamo.estado === 'Activo')) {
    return res.status(409).json({ statusCode: 409, message: 'El equipo ya tiene un préstamo activo' });
  }

  const nuevoPrestamo = {
    id: Date.now(),
    userId,
    equipoPlaca: equipo.placaSena,
    horaInicio: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estado: 'Activo',
    creadoPorRol: req.user.role
  };
  PRESTAMOS.unshift(nuevoPrestamo);
  return res.status(201).json(getPrestamosConDetalles([nuevoPrestamo])[0]);
});

app.put('/api/v1/prestamos/:id/devolver', authenticateToken, (req, res) => {
  const prestamo = PRESTAMOS.find((item) => item.id === Number(req.params.id));
  if (!prestamo) return res.status(404).json({ statusCode: 404, message: 'Préstamo no encontrado' });
  if (req.user.role === 'Aprendiz' && prestamo.userId !== Number(req.user.sub)) {
    return res.status(403).json({ statusCode: 403, message: 'No puedes devolver este préstamo' });
  }
  prestamo.estado = 'Devuelto';
  return res.json(getPrestamosConDetalles([prestamo])[0]);
});

app.get('/api/v1/equipos', authenticateToken, (req, res) => res.json(EQUIPOS));

app.post('/api/v1/equipos', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena, marcaModelo, ram, ambiente, estado } = req.body;
  if (!placaSena || !marcaModelo) return res.status(400).json({ statusCode: 400, message: 'Faltan campos obligatorios' });
  const newEquipo = { id: Date.now(), placaSena: placaSena.toUpperCase(), marcaModelo, ram: ram || '16GB DDR4', ambiente: ambiente || 'Ambiente 301 - ADSO', estado: estado || 'Operativo' };
  EQUIPOS.unshift(newEquipo);
  res.status(201).json(newEquipo);
});

app.put('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex(e => e.placaSena.toUpperCase() === placaSena.toUpperCase());
  if (index === -1) return res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
  EQUIPOS[index] = { ...EQUIPOS[index], ...req.body };
  res.json(EQUIPOS[index]);
});

app.delete('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  EQUIPOS = EQUIPOS.filter(e => e.placaSena.toUpperCase() !== placaSena.toUpperCase());
  res.json({ message: `Equipo ${placaSena} eliminado con éxito` });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api/v1`));
