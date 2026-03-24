import { useState, useEffect } from 'react'
import { fetchEquipos, insertEquipo } from '../lib/supabase'
import { Plus, Search, Truck } from 'lucide-react'

export default function EquiposTab() {
  const [equipos, setEquipos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    integrantes: [],
    responsable_alistado: '',
    unidad_negocio: 'General',
    estado: 'activo'
  })
  const [nuevoIntegrante, setNuevoIntegrante] = useState('')

  useEffect(() => {
    loadEquipos()
  }, [])

  const loadEquipos = async () => {
    setLoading(true)
    try {
      const { data, error } = await fetchEquipos()
      if (data) setEquipos(data)
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
      const { error } = await insertEquipo(formData)
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('✅ Equipo agregado!')
        setFormData({
          id: '',
          nombre: '',
          integrantes: [],
          responsable_alistado: '',
          unidad_negocio: 'General',
          estado: 'activo'
        })
        setNuevoIntegrante('')
        setShowForm(false)
        loadEquipos()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const agregarIntegrante = () => {
    if (nuevoIntegrante.trim()) {
      setFormData(prev => ({
        ...prev,
        integrantes: [...prev.integrantes, nuevoIntegrante]
      }))
      setNuevoIntegrante('')
    }
  }

  const removerIntegrante = (index) => {
    setFormData(prev => ({
      ...prev,
      integrantes: prev.integrantes.filter((_, i) => i !== index)
    }))
  }

  const filtrados = equipos.filter(e =>
    e.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    e.id?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>🚛 Gestión de Equipos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Nuevo Equipo
        </button>
      </div>

      {showForm && (
        <form className="form-box" onSubmit={handleSubmit}>
          <h3>Agregar Nuevo Equipo</h3>
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
              placeholder="Nombre del equipo"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="responsable_alistado"
              placeholder="Responsable alistador"
              value={formData.responsable_alistado}
              onChange={handleInputChange}
            />
            <select
              name="unidad_negocio"
              value={formData.unidad_negocio}
              onChange={handleInputChange}
            >
              <option value="General">General</option>
              <option value="FOTOVOLTAICA">FOTOVOLTAICA</option>
              <option value="SERVICIOS">SERVICIOS</option>
            </select>
          </div>

          <div className="integrantes-section">
            <label>Integrantes:</label>
            <div className="integrantes-input">
              <input
                type="text"
                placeholder="Nombre del integrante"
                value={nuevoIntegrante}
                onChange={(e) => setNuevoIntegrante(e.target.value)}
              />
              <button
                type="button"
                onClick={agregarIntegrante}
                className="btn btn-secondary"
              >
                + Agregar
              </button>
            </div>
            {formData.integrantes.length > 0 && (
              <div className="integrantes-list">
                {formData.integrantes.map((int, idx) => (
                  <span key={idx} className="badge-integrante">
                    {int}
                    <button
                      type="button"
                      onClick={() => removerIntegrante(idx)}
                      className="badge-close"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          placeholder="Buscar equipo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading && !equipos.length ? (
        <div className="loading">Cargando equipos...</div>
      ) : filtrados.length === 0 ? (
        <div className="empty-state">
          <Truck size={48} />
          <p>No hay equipos registrados</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map(equipo => (
            <div key={equipo.id} className="card card-equipo">
              <h3>{equipo.nombre}</h3>
              <p className="card-meta">ID: {equipo.id}</p>
              <p className="card-meta">🏢 {equipo.unidad_negocio}</p>
              <p className="card-meta">👤 {equipo.responsable_alistado || '-'}</p>
              <div className="integrantes-preview">
                {equipo.integrantes && equipo.integrantes.length > 0 && (
                  <>
                    <strong>Integrantes:</strong>
                    <div className="integrantes-tags">
                      {equipo.integrantes.slice(0, 3).map((int, idx) => (
                        <span key={idx} className="tag">{int}</span>
                      ))}
                      {equipo.integrantes.length > 3 && (
                        <span className="tag">+{equipo.integrantes.length - 3}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <span className={`status-badge status-${equipo.estado}`}>
                {equipo.estado}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="tab-footer">
        <p>Total: <strong>{filtrados.length}</strong> equipos</p>
      </div>
    </div>
  )
}
