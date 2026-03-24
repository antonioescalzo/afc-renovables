import { useState, useEffect } from 'react'
import { fetchClientes, insertCliente } from '../lib/supabase'
import { Plus, Search, Users } from 'lucide-react'

export default function ClientesTab() {
  const [clientes, setClientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    ciudad: '',
    tipo: 'cliente',
    contacto: ''
  })

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    setLoading(true)
    try {
      const { data, error } = await fetchClientes()
      if (data) setClientes(data)
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
      const { error } = await insertCliente(formData)
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('✅ Cliente agregado!')
        setFormData({ id: '', nombre: '', ciudad: '', tipo: 'cliente', contacto: '' })
        setShowForm(false)
        loadClientes()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const filtrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.id?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>👥 Gestión de Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <form className="form-box" onSubmit={handleSubmit}>
          <h3>Agregar Nuevo Cliente</h3>
          <div className="form-grid">
            <input
              type="text"
              name="id"
              placeholder="ID (Código único)"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del cliente"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="contacto"
              placeholder="Teléfono/Email"
              value={formData.contacto}
              onChange={handleInputChange}
            />
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
            >
              <option value="cliente">Cliente</option>
              <option value="proveedor">Proveedor</option>
              <option value="interno">Interno</option>
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
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading && !clientes.length ? (
        <div className="loading">Cargando clientes...</div>
      ) : filtrados.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>No hay clientes registrados</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map(cliente => (
            <div key={cliente.id} className="card">
              <h3>{cliente.nombre}</h3>
              <p className="card-meta">ID: {cliente.id}</p>
              <p className="card-meta">📍 {cliente.ciudad || 'No especificado'}</p>
              <p className="card-meta">📱 {cliente.contacto || '-'}</p>
              <span className="badge-type">{cliente.tipo}</span>
            </div>
          ))}
        </div>
      )}

      <div className="tab-footer">
        <p>Total: <strong>{filtrados.length}</strong> clientes</p>
      </div>
    </div>
  )
}
