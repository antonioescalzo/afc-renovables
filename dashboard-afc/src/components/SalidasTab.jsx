import { useState, useEffect } from 'react'
import { fetchSalidas, insertSalida, fetchClientes, fetchEquipos } from '../lib/supabase'
import { Plus, Search, TrendingDown } from 'lucide-react'

export default function SalidasTab() {
  const [salidas, setSalidas] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState([])
  const [equipos, setEquipos] = useState([])
  const [formData, setFormData] = useState({
    id: '',
    fecha: new Date().toISOString().split('T')[0],
    equipo_id: '',
    cliente_id: '',
    alistado_por: '',
    tipo_trabajo: 'INSTALACION',
    costo_total: 0,
    estado: 'completado'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [salidasRes, clientesRes, equiposRes] = await Promise.all([
        fetchSalidas(),
        fetchClientes(),
        fetchEquipos()
      ])
      if (salidasRes.data) setSalidas(salidasRes.data)
      if (clientesRes.data) setClientes(clientesRes.data)
      if (equiposRes.data) setEquipos(equiposRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id || !formData.fecha) {
      alert('Completa ID y Fecha')
      return
    }

    setLoading(true)
    try {
      const { error } = await insertSalida(formData)
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('✅ Salida registrada!')
        setFormData({
          id: '',
          fecha: new Date().toISOString().split('T')[0],
          equipo_id: '',
          cliente_id: '',
          alistado_por: '',
          tipo_trabajo: 'INSTALACION',
          costo_total: 0,
          estado: 'completado'
        })
        setShowForm(false)
        loadData()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'costo_total' ? parseFloat(value) || 0 : value
    }))
  }

  const filtrados = salidas.filter(s =>
    s.id?.toLowerCase().includes(filtro.toLowerCase()) ||
    s.alistado_por?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📤 Registro de Salidas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Nueva Salida
        </button>
      </div>

      {showForm && (
        <form className="form-box" onSubmit={handleSubmit}>
          <h3>Registrar Nueva Salida</h3>
          <div className="form-grid">
            <input
              type="text"
              name="id"
              placeholder="ID de Salida"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
            <select
              name="equipo_id"
              value={formData.equipo_id}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar Equipo</option>
              {equipos.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            <select
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar Cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="alistado_por"
              placeholder="Alistado por"
              value={formData.alistado_por}
              onChange={handleInputChange}
            />
            <select
              name="tipo_trabajo"
              value={formData.tipo_trabajo}
              onChange={handleInputChange}
            >
              <option value="INSTALACION">INSTALACION</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
              <option value="INCIDENCIA">INCIDENCIA</option>
              <option value="TRABAJO">TRABAJO</option>
            </select>
            <input
              type="number"
              name="costo_total"
              placeholder="Costo total"
              step="0.01"
              value={formData.costo_total}
              onChange={handleInputChange}
            />
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
            >
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Registrando...' : '✅ Registrar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar salida..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading && !salidas.length ? (
        <div className="loading">Cargando salidas...</div>
      ) : filtrados.length === 0 ? (
        <div className="empty-state">
          <TrendingDown size={48} />
          <p>No hay salidas registradas</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Equipo</th>
                <th>Cliente</th>
                <th>Alistado por</th>
                <th>Tipo</th>
                <th>Costo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(salida => (
                <tr key={salida.id}>
                  <td className="code">{salida.id}</td>
                  <td>{new Date(salida.fecha).toLocaleDateString()}</td>
                  <td>{salida.equipo_id || '-'}</td>
                  <td>{salida.cliente_id || '-'}</td>
                  <td>{salida.alistado_por || '-'}</td>
                  <td>
                    <span className="badge-type">{salida.tipo_trabajo}</span>
                  </td>
                  <td>${salida.costo_total?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge status-${salida.estado}`}>
                      {salida.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="tab-footer">
        <p>Total: <strong>{filtrados.length}</strong> salidas</p>
        <p>Costo total: <strong>${filtrados.reduce((sum, s) => sum + (s.costo_total || 0), 0).toFixed(2)}</strong></p>
      </div>
    </div>
  )
}
