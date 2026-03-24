import { useState, useEffect } from 'react'
import { fetchArticulos, insertArticulo } from '../lib/supabase'
import { Plus, Search, AlertCircle } from 'lucide-react'

export default function ArticulosTab() {
  const [articulos, setArticulos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    proveedor: '',
    precio_coste: 0,
    stock_actual: 0,
    stock_minimo: 0,
    unidad_medida: 'ud'
  })

  useEffect(() => {
    loadArticulos()
  }, [])

  const loadArticulos = async () => {
    setLoading(true)
    try {
      const { data, error } = await fetchArticulos()
      if (data) setArticulos(data)
      if (error) console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id || !formData.nombre) {
      alert('Completa ID y Nombre')
      return
    }

    setLoading(true)
    try {
      const { error } = await insertArticulo(formData)
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('✅ Artículo agregado!')
        setFormData({
          id: '',
          nombre: '',
          proveedor: '',
          precio_coste: 0,
          stock_actual: 0,
          stock_minimo: 0,
          unidad_medida: 'ud'
        })
        setShowForm(false)
        loadArticulos()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['precio_coste', 'stock_actual', 'stock_minimo'].includes(name)
        ? parseFloat(value) || 0
        : value
    }))
  }

  const filtrados = articulos.filter(a =>
    a.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    a.id?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📦 Gestión de Artículos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Nuevo Artículo
        </button>
      </div>

      {showForm && (
        <form className="form-box" onSubmit={handleSubmit}>
          <h3>Agregar Nuevo Artículo</h3>
          <div className="form-grid">
            <input
              type="text"
              name="id"
              placeholder="ID (Código)"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="proveedor"
              placeholder="Proveedor"
              value={formData.proveedor}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="precio_coste"
              placeholder="Precio costo"
              step="0.01"
              value={formData.precio_coste}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="stock_actual"
              placeholder="Stock actual"
              value={formData.stock_actual}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="stock_minimo"
              placeholder="Stock mínimo"
              value={formData.stock_minimo}
              onChange={handleInputChange}
            />
            <select
              name="unidad_medida"
              value={formData.unidad_medida}
              onChange={handleInputChange}
            >
              <option value="ud">Unidad</option>
              <option value="kg">Kilogramo</option>
              <option value="metro">Metro</option>
              <option value="litro">Litro</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Guardando...' : '✅ Guardar'}
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
          placeholder="Buscar artículo por ID o nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading && !articulos.length ? (
        <div className="loading">Cargando artículos...</div>
      ) : filtrados.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No hay artículos registrados</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(art => (
                <tr key={art.id} className={art.stock_actual <= art.stock_minimo ? 'row-alert' : ''}>
                  <td className="code">{art.id}</td>
                  <td className="font-bold">{art.nombre}</td>
                  <td>{art.proveedor || '-'}</td>
                  <td>${art.precio_coste?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`badge ${art.stock_actual > art.stock_minimo ? 'badge-ok' : 'badge-alert'}`}>
                      {art.stock_actual}
                    </span>
                  </td>
                  <td>{art.stock_minimo}</td>
                  <td>
                    {art.stock_actual <= art.stock_minimo ? (
                      <span className="status-alert">
                        <AlertCircle size={16} /> Bajo
                      </span>
                    ) : (
                      <span className="status-ok">✅ OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="tab-footer">
        <p>Total: <strong>{filtrados.length}</strong> artículos</p>
      </div>
    </div>
  )
}
