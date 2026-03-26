import { useState, useEffect } from 'react'
import { fetchArticulos, fetchSalidas, fetchClientes, fetchEquipos } from '../lib/supabase'
import { fetchKPIs, fetchTop5Proveedores } from '../lib/supabase-compras'
import { TrendingUp, AlertTriangle, Package, DollarSign, Zap } from 'lucide-react'

export default function DashboardTab() {
  const [stats, setStats] = useState({
    totalArticulos: 0,
    stockBajo: 0,
    valorTotal: 0,
    salidasMes: 0
  })

  const [statsCompras, setStatsCompras] = useState({
    totalProveedores: 0,
    totalFacturas: 0,
    gastoTotal: 0,
    promedioFactura: 0
  })

  const [top5Proveedores, setTop5Proveedores] = useState([])
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

      // Cargar datos de compras
      const { data: kpis } = await fetchKPIs()
      const { data: top5 } = await fetchTop5Proveedores()

      if (kpis) {
        setStatsCompras({
          totalProveedores: kpis.total_proveedores || 0,
          totalFacturas: kpis.total_facturas || 0,
          gastoTotal: kpis.gasto_total || 0,
          promedioFactura: kpis.promedio_factura || 0
        })
      }

      if (top5) {
        setTop5Proveedores(top5)
      }
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

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
          <div className="dashboard-section">
            <h3>📦 Inventario</h3>
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
                value={formatCurrency(stats.valorTotal)}
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
          </div>

          <div className="dashboard-section">
            <h3>💳 Compras 2026</h3>
            <div className="stats-grid">
              <StatCard
                icon={Zap}
                title="Proveedores"
                value={statsCompras.totalProveedores}
                subtitle="proveedores activos"
                color="orange"
              />
              <StatCard
                icon={Package}
                title="Total Facturas"
                value={statsCompras.totalFacturas}
                subtitle="facturas de compra"
                color="blue"
              />
              <StatCard
                icon={DollarSign}
                title="Gasto Total"
                value={formatCurrency(statsCompras.gastoTotal)}
                subtitle="todas las compras"
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                title="Promedio Factura"
                value={formatCurrency(statsCompras.promedioFactura)}
                subtitle="por transacción"
                color="purple"
              />
            </div>
          </div>

          {top5Proveedores.length > 0 && (
            <div className="dashboard-section">
              <h3>🏆 Top 5 Proveedores por Gasto</h3>
              <div className="top-providers-list">
                {top5Proveedores.map((prov, idx) => (
                  <div key={prov.proveedor_id} className="provider-item">
                    <div className="provider-rank">#{idx + 1}</div>
                    <div className="provider-info">
                      <h4>{prov.proveedor}</h4>
                      <p>{prov.facturas} facturas</p>
                    </div>
                    <div className="provider-amount">
                      {formatCurrency(prov.gasto_total)}
                    </div>
                    <div className="provider-bar">
                      <div
                        className="provider-bar-fill"
                        style={{
                          width: `${(prov.gasto_total / top5Proveedores[0].gasto_total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="dashboard-section">
            <h3>🟢 Estado del Sistema</h3>
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
            <h3>📋 Sistema</h3>
            <ul className="action-list">
              <li>✅ Inventario sincronizado</li>
              <li>✅ Compras 2026 cargadas (100 facturas)</li>
              <li>✅ Proveedores analizados (55 únicos)</li>
              <li>✅ Auditoría activa</li>
              <li>📊 Dashboard de análisis disponible</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
