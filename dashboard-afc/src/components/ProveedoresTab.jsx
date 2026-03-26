import { useState, useEffect } from 'react'
import {
  fetchProveedoresRanking,
  fetchTop5Proveedores,
  buscarFacturas,
  fetchProveedoresEstado
} from '../lib/supabase-compras'
import { Search, TrendingUp, DollarSign, AlertCircle, Filter } from 'lucide-react'

export default function ProveedoresTab() {
  const [proveedores, setProveedores] = useState([])
  const [top5, setTop5] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ranking')
  const [selectedProveedor, setSelectedProveedor] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [rankingRes, top5Res] = await Promise.all([
        fetchProveedoresRanking(),
        fetchTop5Proveedores()
      ])

      if (rankingRes.data) setProveedores(rankingRes.data)
      if (top5Res.data) setTop5(top5Res.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtrados = proveedores.filter(p =>
    p.proveedor?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.ranking?.toString().includes(filtro)
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

  const getTotalGasto = () => {
    return proveedores.reduce((sum, p) => sum + (p.gasto_total || 0), 0)
  }

  const getPromedioFactura = () => {
    return proveedores.reduce((sum, p) => sum + (p.promedio_factura || 0), 0) / proveedores.length
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📦 Análisis de Proveedores 2026</h2>
        <button
          onClick={loadData}
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Actualizar
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>Proveedores</h3>
            <p className="stat-value">{proveedores.length}</p>
            <p className="stat-subtitle">proveedores activos 2026</p>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <h3>Gasto Total</h3>
            <p className="stat-value">{formatCurrency(getTotalGasto())}</p>
            <p className="stat-subtitle">todas las compras 2026</p>
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
            <AlertCircle size={32} />
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
          className={`tab-btn ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranking')}
        >
          📊 Ranking Completo ({proveedores.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'top5' ? 'active' : ''}`}
          onClick={() => setActiveTab('top5')}
        >
          🏆 Top 5 Proveedores
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : activeTab === 'top5' ? (
        <div className="cards-grid">
          {top5.map((proveedor, idx) => (
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
  )
}
