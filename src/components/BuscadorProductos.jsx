import React, { useState, useMemo } from 'react'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'
import productosClimen from '../data/CLIMEN_PRODUCTOS.json'

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b"
}

// Datos de todos los proveedores
const proincoData = [
  { ref: '2009100', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.90, proveedor: 'PROINCO' },
  { ref: '2009111', desc: 'JUEGO SILENBLOCK A-35', precio: 1.12, proveedor: 'PROINCO' },
  { ref: '3799940', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 89.05, proveedor: 'PROINCO' },
  { ref: '3799941', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 108.70, proveedor: 'PROINCO' },
  { ref: '3799942', desc: 'ROLL DB.PREAIS 3/8x07-5/8x08 20MT', precio: 155.50, proveedor: 'PROINCO' },
]

const cotoData = [
  { ref: 'COTO-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 6.50, proveedor: 'COTO' },
  { ref: 'COTO-002', desc: 'JUEGO SILENBLOCK A-35', precio: 1.05, proveedor: 'COTO' },
  { ref: 'COTO-003', desc: 'PANEL SOLAR 400W', precio: 180.00, proveedor: 'COTO' },
]

const recaData = [
  { ref: 'RECA-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.50, proveedor: 'RECA' },
  { ref: 'RECA-002', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 85.00, proveedor: 'RECA' },
]

const climenData = [
  { ref: 'CLIMEN-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 7.00, proveedor: 'CLIMEN' },
  { ref: 'CLIMEN-002', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 105.00, proveedor: 'CLIMEN' },
]

const electrostockData = productosElectrostockPDF.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'ELECTROSTOCK'
}))

// Combinar todos los productos
const todosLosProductos = [
  ...electrostockData,
  ...proincoData,
  ...cotoData,
  ...recaData,
  ...climenData,
  ...productosClimen.map(p => ({
    ref: p.ref || '',
    desc: p.desc,
    precio: p.precio,
    proveedor: 'CLIMEN'
  }))
]

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('')
  const [ordenar, setOrdenar] = useState('proveedor')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 50

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return todosLosProductos.filter(p => {
      const texto = busqueda.toLowerCase()
      return (
        p.desc.toLowerCase().includes(texto) ||
        (p.ref && p.ref.toLowerCase().includes(texto)) ||
        p.proveedor.toLowerCase().includes(texto)
      )
    })
  }, [busqueda])

  // Ordenar productos
  const productosOrdenados = useMemo(() => {
    const sorted = [...productosFiltrados]
    switch (ordenar) {
      case 'proveedor':
        return sorted.sort((a, b) => a.proveedor.localeCompare(b.proveedor))
      case 'precio_asc':
        return sorted.sort((a, b) => a.precio - b.precio)
      case 'precio_desc':
        return sorted.sort((a, b) => b.precio - a.precio)
      case 'nombre':
        return sorted.sort((a, b) => a.desc.localeCompare(b.desc))
      default:
        return sorted
    }
  }, [productosFiltrados, ordenar])

  // Paginar
  const totalPaginas = Math.ceil(productosOrdenados.length / itemsPorPagina)
  const inicio = (paginaActual - 1) * itemsPorPagina
  const productosActuales = productosOrdenados.slice(inicio, inicio + itemsPorPagina)

  // Estadísticas
  const proveedoresUnicos = new Set(productosFiltrados.map(p => p.proveedor))
  const precioPromedio = productosFiltrados.length > 0
    ? productosFiltrados.reduce((sum, p) => sum + p.precio, 0) / productosFiltrados.length
    : 0
  const precioMin = productosFiltrados.length > 0
    ? Math.min(...productosFiltrados.map(p => p.precio))
    : 0
  const precioMax = productosFiltrados.length > 0
    ? Math.max(...productosFiltrados.map(p => p.precio))
    : 0

  const colorProveedor = (proveedor) => {
    const colores = {
      'ELECTROSTOCK': '#0e7fa3',
      'COTO': '#3da83c',
      'RECA': '#f5c518',
      'CLIMEN': '#f97316',
      'PROINCO': '#e85050'
    }
    return colores[proveedor] || C.teal2
  }

  return (
    <div>
      {/* CARDS DE ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>Total Productos</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.green2, lineHeight: 1 }}>{productosOrdenados.length}</div>
          <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 6 }}>de {todosLosProductos.length} totales</div>
        </div>

        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>Proveedores</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.teal2, lineHeight: 1 }}>{proveedoresUnicos.size}</div>
          <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 6 }}>en resultados</div>
        </div>

        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>Precio Mín</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: C.yellow, lineHeight: 1 }}>{fmt(precioMin)}</div>
          <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 6 }}>más económico</div>
        </div>

        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>Precio Máx</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: C.red, lineHeight: 1 }}>{fmt(precioMax)}</div>
          <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 6 }}>más caro</div>
        </div>
      </div>

      {/* BÚSQUEDA Y FILTROS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, referencia o proveedor..."
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          style={{
            flex: 1,
            minWidth: 250,
            padding: '8px 12px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}
        />

        <select
          value={ordenar}
          onChange={e => {
            setOrdenar(e.target.value)
            setPaginaActual(1)
          }}
          style={{
            padding: '8px 12px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            cursor: 'pointer'
          }}
        >
          <option value="proveedor">Ordenar por: Proveedor</option>
          <option value="nombre">Ordenar por: Nombre</option>
          <option value="precio_asc">Ordenar por: Precio ↑</option>
          <option value="precio_desc">Ordenar por: Precio ↓</option>
        </select>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.bg3 }}>
              {['Ref', 'Descripción', 'Proveedor', 'Precio'].map(h => (
                <th key={h} style={{
                  fontFamily: 'monospace',
                  fontSize: '0.55rem',
                  color: C.muted,
                  textTransform: 'uppercase',
                  padding: '9px',
                  textAlign: h === 'Precio' ? 'right' : 'left',
                  borderBottom: `1px solid ${C.border}`
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productosActuales.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '0.75rem' }}>
                  No hay productos que coincidan con tu búsqueda
                </td>
              </tr>
            ) : (
              productosActuales.map((prod, idx) => (
                <tr key={idx}
                  onMouseEnter={e => e.currentTarget.style.background = `${C.green3}14`}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.65rem', color: C.teal2, fontWeight: 600 }}>
                    {prod.ref || '-'}
                  </td>
                  <td style={{ padding: '9px', fontSize: '0.72rem', color: C.text }}>
                    {prod.desc}
                  </td>
                  <td style={{ padding: '9px', fontSize: '0.7rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: colorProveedor(prod.proveedor) + '30',
                      border: `1px solid ${colorProveedor(prod.proveedor)}`,
                      borderRadius: 4,
                      color: colorProveedor(prod.proveedor),
                      fontWeight: 600,
                      fontFamily: 'monospace'
                    }}>
                      {prod.proveedor}
                    </span>
                  </td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.green2, textAlign: 'right', fontWeight: 700 }}>
                    {fmt(prod.precio)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: C.bg3, borderRadius: 8, flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            style={{
              padding: '6px 12px',
              background: paginaActual === 1 ? C.bg3 : C.green3,
              color: paginaActual === 1 ? C.muted : C.green2,
              border: `1px solid ${paginaActual === 1 ? C.border : C.green3}`,
              borderRadius: 6,
              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            ← Anterior
          </button>
          <div style={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'monospace' }}>
            Página <span style={{ color: C.text, fontWeight: 700 }}>{paginaActual}</span> de <span style={{ color: C.text, fontWeight: 700 }}>{totalPaginas}</span> · ({inicio + 1}-{Math.min(inicio + itemsPorPagina, productosOrdenados.length)} de {productosOrdenados.length})
          </div>
          <button
            onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
            style={{
              padding: '6px 12px',
              background: paginaActual === totalPaginas ? C.bg3 : C.green3,
              color: paginaActual === totalPaginas ? C.muted : C.green2,
              border: `1px solid ${paginaActual === totalPaginas ? C.border : C.green3}`,
              borderRadius: 6,
              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
