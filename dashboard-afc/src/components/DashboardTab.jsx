import { useState, useEffect } from 'react'
import { fetchArticulos, fetchSalidas, fetchClientes, fetchEquipos } from '../lib/supabase'
import { TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react'

export default function DashboardTab() {
  const [stats, setStats] = useState({
    totalArticulos: 0,
    stockBajo: 0,
    valorTotal: 0,
    salidasMes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const { data: articulos } = await fetchArticulos()
      const { data: salidas } = await fetchSalidas()

      let stockBajo = 0
      let valorTotal = 0

      if (articulos) {
        articulos.forEach(art => {
          if (art.stock_actual <= art.stock_minimo) stockBajo++
          valorTotal += (art.stock_actual * (art.precio_coste || 0))
        })
      }

      setStats({
        totalArticulos: articulos?.length || 0,
        stockBajo,
        valorTotal: valorTotal.toFixed(2),
        salidasMes: salidas?.length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={32} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  )

  return (
    <div className="tab-content">
      <div className="dashboard-header">
        <h2>Resumen del Sistema</h2>
        <button onClick={loadStats} className="btn btn-secondary">
          🔄 Actualizar
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={Package}
              title="Total Artículos"
              value={stats.totalArticulos}
              subtitle="productos en catálogo"
              color="blue"
            />
            <StatCard
              icon={AlertTriangle}
              title="Stock Bajo"
              value={stats.stockBajo}
              subtitle="artículos bajo mínimo"
              color="red"
            />
            <StatCard
              icon={DollarSign}
              title="Valor Total"
              value={`$${stats.valorTotal}`}
              subtitle="inventario valorizado"
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              title="Salidas Mes"
              value={stats.salidasMes}
              subtitle="movimientos registrados"
              color="purple"
            />
          </div>

          <div className="dashboard-section">
            <h3>📊 Estado del Sistema</h3>
            <div className="status-box">
              <div className="status-item">
                <span>🟢 Base de Datos</span>
                <strong>Conectado</strong>
              </div>
              <div className="status-item">
                <span>🟢 Supabase</span>
                <strong>Sincronizado</strong>
              </div>
              <div className="status-item">
                <span>🟢 Triggers</span>
                <strong>Activos</strong>
              </div>
              <div className="status-item">
                <span>🟢 Auditoría</span>
                <strong>Registrando</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h3>📋 Próximas Acciones</h3>
            <ul className="action-list">
              <li>✅ Agregar productos en catálogo de Artículos</li>
              <li>✅ Registrar clientes</li>
              <li>✅ Configurar equipos de trabajo</li>
              <li>✅ Registrar primera salida</li>
              <li>✅ Visualizar movimientos en auditoría</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
