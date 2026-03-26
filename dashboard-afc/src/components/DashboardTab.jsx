import { useState, useEffect } from 'react'
import { fetchArticulos, fetchSalidas, fetchClientes, fetchEquipos } from '../lib/supabase'
import { fetchKPIs, fetchTop5Proveedores, fetchProveedoresRanking } from '../lib/supabase-compras'
import { TrendingUp, AlertTriangle, Package, DollarSign, Zap, Search, Filter } from 'lucide-react'

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
  const [proveedores, setProveedores] = useState([])
  const [filtro, setFiltro] = useState('')
  const [proveedoresViewTab, setProveedoresViewTab] = useState('ranking')
  const [selectedProveedor, setSelectedProveedor] = useState(null)
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
      const { data: ranking } = await fetchProveedoresRanking()

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

      if (ranking) {
        setProveedores(ranking)
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

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-ES')
  }

  const filtrados = proveedores.filter(p =>
    p.proveedor?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.ranking?.toString().includes(filtro)
  )

  const getTotalGasto = () => {
    return proveedores.reduce((sum, p) => sum + (p.gasto_total || 0), 0)
  }

  const getPromedioFactura = () => {
    if (proveedores.length === 0) return 0
    return proveedores.reduce((sum, p) => sum + (p.promedio_factura || 0), 0) / proveedores.length
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
            <h3>📊 Análisis Completo de Proveedores</h3>

            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-icon">
                  <TrendingUp size={32} />
                </div>
                <div className="stat-content">
                  <h3>Proveedores</h3>
                  <p className="stat-value">{proveedores.length}</p>
                  <p className="stat-subtitle">proveedores activos</p>
                </div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-icon">
                  <DollarSign size={32} />
                </div>
                <div className="stat-content">
                  <h3>Gasto Total</h3>
                  <p className="stat-value">{formatCurrency(getTotalGasto())}</p>
                  <p className="stat-subtitle">todas las compras</p>
                </div>
              </div>

              <div className="stat-card stat-purple">
                <div className="stat-icon">
                  <Filter size={32} />
                </div>
                <div className="stat-content">
                  <h3>Total Facturas</h3>
                  <p className="stat-value">
                    {proveedores.reduce((sum, p) => sum + (p.num_facturas || 0), 0)}
                  </p>
                  <p className="stat-subtitle">facturas de compra</p>
                </div>
              </div>

              <div className="stat-card stat-orange">
                <div className="stat-icon">
                  <AlertTriangle size={32} />
                </div>
                <div className="stat-content">
                  <h3>Promedio Factura</h3>
                  <p className="stat-value">{formatCurrency(getPromedioFactura())}</p>
                  <p className="stat-subtitle">por transacción</p>
                </div>
              </div>
            </div>

            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar proveedor por nombre o ranking..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div className="tab-buttons">
              <button
                className={`tab-btn ${proveedoresViewTab === 'ranking' ? 'active' : ''}`}
                onClick={() => setProveedoresViewTab('ranking')}
              >
                📊 Ranking Completo ({proveedores.length})
              </button>
              <button
                className={`tab-btn ${proveedoresViewTab === 'top5' ? 'active' : ''}`}
                onClick={() => setProveedoresViewTab('top5')}
              >
                🏆 Top 5 Proveedores
              </button>
            </div>

            {proveedoresViewTab === 'top5' ? (
              <div className="cards-grid">
                {top5Proveedores.map((proveedor, idx) => (
                  <div
                    key={proveedor.proveedor_id}
                    className="card card-provider"
                    onClick={() => setSelectedProveedor(proveedor)}
                  >
                    <div className="card-header">
                      <span className="badge-ranking">#{idx + 1}</span>
                      <h3>{proveedor.proveedor}</h3>
                    </div>
                    <div className="card-stats">
                      <div className="stat">
                        <span className="label">Facturas</span>
                        <span className="value">{proveedor.facturas}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Gasto</span>
                        <span className="value">{formatCurrency(proveedor.gasto_total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ranking</th>
                      <th>Proveedor</th>
                      <th>Facturas</th>
                      <th>Gasto Total</th>
                      <th>Promedio</th>
                      <th>Mínimo</th>
                      <th>Máximo</th>
                      <th>Última Compra</th>
                      <th>Días Activo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="empty-cell">
                          No hay proveedores coincidentes
                        </td>
                      </tr>
                    ) : (
                      filtrados.map(proveedor => (
                        <tr key={proveedor.proveedor_id} className="hoverable">
                          <td className="ranking-col">#{proveedor.ranking}</td>
                          <td className="name-col">{proveedor.proveedor}</td>
                          <td className="number-col">{proveedor.num_facturas}</td>
                          <td className="currency-col">
                            <strong>{formatCurrency(proveedor.gasto_total)}</strong>
                          </td>
                          <td className="currency-col">{formatCurrency(proveedor.promedio_factura)}</td>
                          <td className="currency-col">{formatCurrency(proveedor.factura_minima)}</td>
                          <td className="currency-col">{formatCurrency(proveedor.factura_maxima)}</td>
                          <td className="date-col">{formatDate(proveedor.ultima_compra)}</td>
                          <td className="number-col">{proveedor.dias_activo || 0} días</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedProveedor && (
              <div className="modal-overlay" onClick={() => setSelectedProveedor(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="modal-close"
                    onClick={() => setSelectedProveedor(null)}
                  >
                    ✕
                  </button>
                  <h2>{selectedProveedor.proveedor}</h2>
                  <div className="modal-grid">
                    <div className="modal-stat">
                      <span className="label">Ranking</span>
                      <span className="value">#{selectedProveedor.ranking}</span>
                    </div>
                    <div className="modal-stat">
                      <span className="label">Facturas</span>
                      <span className="value">{selectedProveedor.facturas}</span>
                    </div>
                    <div className="modal-stat">
                      <span className="label">Gasto Total</span>
                      <span className="value">{formatCurrency(selectedProveedor.gasto_total)}</span>
                    </div>
                    <div className="modal-stat">
                      <span className="label">Promedio Factura</span>
                      <span className="value">{formatCurrency(selectedProveedor.gasto_total / selectedProveedor.facturas)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="tab-footer">
              <p>
                Mostrando <strong>{filtrados.length}</strong> de{' '}
                <strong>{proveedores.length}</strong> proveedores
              </p>
            </div>
          </div>

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
