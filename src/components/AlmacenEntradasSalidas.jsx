import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  greenLeaf: "#4ab83e", accent: "#7ed956",
  yellow: "#f5c518", red: "#e85050", orange: "#f97316",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b", white: "#f0faf1",
}

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0)

export default function AlmacenEntradasSalidas() {
  const [tipo, setTipo] = useState('entrada') // entrada o salida
  const [producto, setProducto] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [equipo, setEquipo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [motivo, setMotivo] = useState('consumo') // para salidas

  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(false)
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [abiertaLista, setAbiertaLista] = useState(false)
  const [cargandoProductos, setCargandoProductos] = useState(true)
  const [errorProductos, setErrorProductos] = useState(null)

  useEffect(() => {
    cargarProductos()
    cargarMovimientos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const buscarArticulos = async (query = '') => {
    try {
      setCargandoProductos(true)
      setErrorProductos(null)

      let q = supabase
        .from('articulos')
        .select('*')
        .limit(100)

      // Si hay búsqueda, buscar por cualquier columna similar a descripción
      if (query.trim()) {
        // Intentar buscar en múltiples posibles nombres de columnas
        q = q.or(`nombre.ilike.%${query}%,description.ilike.%${query}%,name.ilike.%${query}%,codigo.ilike.%${query}%,code.ilike.%${query}%`)
      }

      const { data, error } = await q

      if (error) {
        console.error('Error Supabase:', error.message)
        setErrorProductos(`Error: ${error.message}`)
        setProductos([])
        // Log las columnas si la consulta funciona
        if (data && data.length > 0) {
          console.log('Columnas disponibles:', Object.keys(data[0]))
        }
      } else if (data) {
        console.log(`✅ Artículos encontrados: ${data.length}`)
        if (data.length > 0) {
          console.log('Columnas:', Object.keys(data[0]))
          console.log('Primer registro:', data[0])
        }
        setProductos(data)
      }
    } catch (err) {
      console.error('Error buscando artículos:', err)
      setErrorProductos(err.message)
      setProductos([])
    } finally {
      setCargandoProductos(false)
    }
  }

  const cargarProductos = () => {
    buscarArticulos('')
  }

  const cargarMovimientos = async () => {
    try {
      const { data } = await supabase
        .from('almacen_movimientos')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(100)

      if (data) setMovimientos(data)
    } catch (err) {
      console.error('Error cargando movimientos:', err)
    }
  }

  const registrarMovimiento = async () => {
    if (!producto || !cantidad) {
      alert('Falta producto o cantidad')
      return
    }

    setLoading(true)
    try {
      const nuevoMovimiento = {
        tipo,
        producto_id: producto,
        cantidad: parseInt(cantidad),
        proyecto: proyecto || 'General',
        equipo: equipo || '-',
        observaciones: observaciones || '-',
        motivo: tipo === 'salida' ? motivo : 'compra',
        fecha: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('almacen_movimientos')
        .insert([nuevoMovimiento])

      if (error) throw error

      alert(`✅ ${tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'} registrada correctamente`)

      // Limpiar formulario
      setProducto('')
      setCantidad('')
      setProyecto('')
      setEquipo('')
      setObservaciones('')
      setMotivo('consumo')

      // Recargar movimientos
      cargarMovimientos()
    } catch (err) {
      console.error('Error registrando movimiento:', err)
      alert('❌ Error al registrar movimiento')
    } finally {
      setLoading(false)
    }
  }

  const prodSeleccionado = productos.find(p => p.id === parseInt(producto))

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter(p =>
    busquedaProducto === '' ||
    p.codigo?.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busquedaProducto.toLowerCase())
  )

  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{ color: C.green2, marginBottom: 20 }}>📦 Entradas y Salidas de Almacén</h3>

      {/* SELECTOR TIPO MOVIMIENTO */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setTipo('entrada')}
          style={{
            flex: 1,
            padding: '12px',
            background: tipo === 'entrada' ? C.green3 : C.bg3,
            color: tipo === 'entrada' ? C.green2 : C.muted,
            border: `2px solid ${tipo === 'entrada' ? C.green2 : C.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          📥 ENTRADA (ALTA)
        </button>
        <button
          onClick={() => setTipo('salida')}
          style={{
            flex: 1,
            padding: '12px',
            background: tipo === 'salida' ? C.orange.replace('#', '#') + '40' : C.bg3,
            color: tipo === 'salida' ? C.orange : C.muted,
            border: `2px solid ${tipo === 'salida' ? C.orange : C.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          📤 SALIDA (BAJA)
        </button>
      </div>

      {/* FORMULARIO */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h4 style={{ color: C.accent, marginTop: 0, marginBottom: 16 }}>Registrar {tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'}</h4>

        {/* PRODUCTO */}
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
            Artículo * {cargandoProductos ? '⏳ Buscando...' : `(${productos.length} resultados)`}
          </label>

          {/* Mostrar error si hay */}
          {errorProductos && (
            <div style={{
              background: C.red.replace('#', '#') + '20',
              border: `1px solid ${C.red}`,
              color: C.red,
              padding: '8px',
              borderRadius: 4,
              marginBottom: 8,
              fontSize: '0.75rem'
            }}>
              ⚠️ {errorProductos}
            </div>
          )}

          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar artículos por código o descripción..."
            value={busquedaProducto}
            onChange={e => {
              const valor = e.target.value
              setBusquedaProducto(valor)
              setAbiertaLista(true)
              // Buscar en tiempo real
              if (valor.length > 1) {
                buscarArticulos(valor)
              } else if (valor.length === 0) {
                buscarArticulos('')
              }
            }}
            onFocus={() => setAbiertaLista(true)}
            disabled={cargandoProductos}
            style={{
              width: '100%',
              padding: '10px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              marginBottom: 8,
              boxSizing: 'border-box',
              paddingRight: '30px',
              opacity: cargandoProductos ? 0.5 : 1,
              cursor: cargandoProductos ? 'not-allowed' : 'text'
            }}
          />

          {/* Botón para abrir/cerrar */}
          <button
            onClick={() => setAbiertaLista(!abiertaLista)}
            disabled={cargandoProductos}
            style={{
              position: 'absolute',
              right: '8px',
              top: '26px',
              background: 'none',
              border: 'none',
              color: C.green2,
              cursor: cargandoProductos ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              padding: '5px',
              opacity: cargandoProductos ? 0.5 : 1
            }}
          >
            {cargandoProductos ? '⏳' : abiertaLista ? '▲' : '▼'}
          </button>

          {/* Lista desplegable */}
          {abiertaLista && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: C.bg2,
              border: `2px solid ${C.green2}`,
              borderTop: 'none',
              borderRadius: '0 0 6px 6px',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '-8px'
            }}>
              {cargandoProductos ? (
                <div style={{ padding: '12px', color: C.muted, textAlign: 'center', fontSize: '0.8rem' }}>
                  ⏳ Buscando artículos...
                </div>
              ) : productos.length === 0 ? (
                <div style={{ padding: '12px', color: C.red, textAlign: 'center', fontSize: '0.8rem' }}>
                  ❌ {busquedaProducto ? `No se encontraron artículos con "${busquedaProducto}"` : 'Empieza a escribir para buscar'}
                </div>
              ) : (
                productos.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setProducto(String(p.id))
                      setAbiertaLista(false)
                      setBusquedaProducto('')
                    }}
                    style={{
                      padding: '10px 12px',
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer',
                      background: producto === String(p.id) ? C.green3 : 'transparent',
                      color: producto === String(p.id) ? C.green2 : C.text,
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      transition: 'all 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.green3
                      e.currentTarget.style.color = C.green2
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = producto === String(p.id) ? C.green3 : 'transparent'
                      e.currentTarget.style.color = producto === String(p.id) ? C.green2 : C.text
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {p.codigo || p.code || p.ref || p.id}
                  </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, maxHeight: '2.8em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                      {p.nombre || p.descripcion || p.description || p.name || p.articulo || 'Sin descripción'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: C.yellow, marginTop: '2px' }}>
                      💰 {fmt((p.precio || p.price || 0))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Producto seleccionado */}
          {prodSeleccionado && !abiertaLista && (
            <div style={{ fontSize: '0.8rem', color: C.green2, marginTop: 4, background: C.green3, padding: '8px', borderRadius: 4 }}>
              ✅ {prodSeleccionado.codigo} | {prodSeleccionado.descripcion} | 💰 {fmt(prodSeleccionado.precio)}
            </div>
          )}
        </div>

        {/* CANTIDAD */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
            Cantidad *
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            placeholder="0"
            min="1"
            style={{
              width: '100%',
              padding: '10px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* PROYECTO */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
            Proyecto
          </label>
          <input
            type="text"
            value={proyecto}
            onChange={e => setProyecto(e.target.value)}
            placeholder="Ej: Instalación Zona A, Mantenimiento, etc"
            style={{
              width: '100%',
              padding: '10px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* EQUIPO */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
            Equipo / Responsable
          </label>
          <input
            type="text"
            value={equipo}
            onChange={e => setEquipo(e.target.value)}
            placeholder="Ej: Equipo Norte, Juan García, etc"
            style={{
              width: '100%',
              padding: '10px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* MOTIVO (solo para salidas) */}
        {tipo === 'salida' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
              Motivo de Salida
            </label>
            <select
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: C.bg2,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                color: C.text,
                fontSize: '0.85rem',
                fontFamily: 'monospace'
              }}
            >
              <option value="consumo">Consumo / Uso</option>
              <option value="devolucion">Devolución</option>
              <option value="dano">Daño / Pérdida</option>
              <option value="robo">Robo / Extravío</option>
              <option value="venta">Venta</option>
              <option value="ajuste">Ajuste de inventario</option>
            </select>
          </div>
        )}

        {/* OBSERVACIONES */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            placeholder="Notas adicionales..."
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* BOTÓN REGISTRAR */}
        <button
          onClick={registrarMovimiento}
          disabled={loading || !producto || !cantidad}
          style={{
            width: '100%',
            padding: '12px',
            background: tipo === 'entrada' ? C.green3 : C.orange.replace('#', '#') + '40',
            color: tipo === 'entrada' ? C.green2 : C.orange,
            border: `2px solid ${tipo === 'entrada' ? C.green2 : C.orange}`,
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            opacity: loading || !producto || !cantidad ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Registrando...' : `✅ Registrar ${tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'}`}
        </button>
      </div>

      {/* ÚLTIMOS MOVIMIENTOS */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <h4 style={{ color: C.accent, marginTop: 0, marginBottom: 16 }}>📋 Últimos Movimientos ({movimientos.length})</h4>

        <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: C.bg3 }}>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '8px', textAlign: 'left', color: C.teal2 }}>FECHA</th>
                <th style={{ padding: '8px', textAlign: 'left', color: C.teal2 }}>TIPO</th>
                <th style={{ padding: '8px', textAlign: 'left', color: C.teal2 }}>PRODUCTO</th>
                <th style={{ padding: '8px', textAlign: 'right', color: C.teal2 }}>CANT.</th>
                <th style={{ padding: '8px', textAlign: 'left', color: C.teal2 }}>PROYECTO</th>
                <th style={{ padding: '8px', textAlign: 'left', color: C.teal2 }}>EQUIPO</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '12px', textAlign: 'center', color: C.muted }}>
                    Sin movimientos registrados
                  </td>
                </tr>
              ) : (
                movimientos.map((mov, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: mov.tipo === 'entrada' ? C.green3 + '10' : C.orange.replace('#', '#') + '10' }}>
                    <td style={{ padding: '8px', color: C.muted }}>
                      {new Date(mov.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '8px', color: mov.tipo === 'entrada' ? C.green2 : C.orange, fontWeight: 'bold' }}>
                      {mov.tipo === 'entrada' ? '📥 ENTRADA' : '📤 SALIDA'}
                    </td>
                    <td style={{ padding: '8px', fontSize: '0.65rem', color: C.text }}>
                      {mov.producto_id}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', color: C.yellow, fontWeight: 'bold' }}>
                      {mov.cantidad}
                    </td>
                    <td style={{ padding: '8px', fontSize: '0.65rem', color: C.text }}>
                      {mov.proyecto || '-'}
                    </td>
                    <td style={{ padding: '8px', fontSize: '0.65rem', color: C.muted }}>
                      {mov.equipo || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
