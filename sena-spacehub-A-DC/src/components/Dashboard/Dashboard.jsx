import React from 'react';
import './Dashboard.css';

export default function Dashboard({ equipos, prestamos, tickets }) {
  
  const totalEquipos = equipos.length || 5;
  const operativos = equipos.filter(e => e.estado === 'Operativo').length || 10;
  const mantenimiento = equipos.filter(e => e.estado === 'En Mantenimiento').length || 2;
  
  const prestamosActivos = prestamos.filter(p => p.estado === 'Activo').length || 3;
  const incidenciasActivas = tickets.filter(t => t.estado === 'Abierto').length || 2;
  const prioridadAlta = tickets.filter(t => t.prioridad === 'Alta').length || 1;
  const prioridadMedia = tickets.filter(t => t.prioridad === 'Media').length || 1;

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <div>
          <h2>Panel Principal de Ambientes y Tecnología</h2>
          <p className="subtitle">Indicadores en tiempo real de laboratorios de cómputo</p>
        </div>
        <div className="system-status">
          <span className="status-dot"></span> Estado del Sistema: Óptimo
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="card-title">TOTAL EQUIPOS CÓMPUTO</span>
          <div className="stat-number">{totalEquipos}</div>
          <span className="card-subtext green-text">
            • {operativos} Operativos / {mantenimiento} Mantenimiento
          </span>
        </div>

        <div className="stat-card">
          <span className="card-title">PRÉSTAMOS ACTIVOS</span>
          <div className="stat-number">{prestamosActivos}</div>
          <span className="card-subtext green-text">En uso por aprendices ADSO</span>
        </div>

        <div className="stat-card">
          <span className="card-title">OCUPACIÓN AMBIENTES</span>
          <div className="stat-number blue-text">85%</div>
          <span className="card-subtext blue-text">Laboratorios 301 y 302 activos</span>
        </div>

        <div className="stat-card">
          <span className="card-title">INCIDENCIAS DE HARDWARE</span>
          <div className="stat-number yellow-text">{incidenciasActivas}</div>
          <span className="card-subtext yellow-text">
            {prioridadAlta} Prioridad Alta / {prioridadMedia} Media
          </span>
        </div>
      </div>

      <div className="dashboard-charts-grid">
  
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 TASA DE OCUPACIÓN POR LABORATORIO</h3>
            <span className="live-tag">EN TIEMPO REAL</span>
          </div>

          <div className="progress-group">
            <div className="progress-info">
              <span>Ambiente 301 - Desarrollo Web (ADSO)</span>
              <span className="green-text">90%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: '90%' }}></div>
            </div>
          </div>

          <div className="progress-group">
            <div className="progress-info">
              <span>Ambiente 302 - Redes y Bases de Datos</span>
              <span className="blue-text">75%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill blue" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="progress-group">
            <div className="progress-info">
              <span>Ambiente 303 - Mantenimiento Hardware</span>
              <span className="yellow-text">40%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill yellow" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 DISTRIBUCIÓN DE ESTADO E HISTORIAL</h3>
            <span className="week-tag">SEMANA ACTUAL</span>
          </div>

          <div className="chart-content">
            <div className="donut-chart-container">
              <div className="donut-chart">
                <div className="donut-center">
                  <span className="donut-number">12</span>
                  <span className="donut-label">EQUIPOS</span>
                </div>
              </div>
              <div className="legend">
                <span className="legend-item green-text">• Operativos ({operativos})</span>
                <span className="legend-item yellow-text">• Mantenimiento ({mantenimiento})</span>
              </div>
            </div>

            <div className="weekly-chart">
              <p className="weekly-title">Préstamos Semanales:</p>
              <div className="days-axis">
                <span>Lun</span>
                <span>Mar</span>
                <span className="active-day">Mié</span>
                <span>Jue</span>
                <span>Vie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}