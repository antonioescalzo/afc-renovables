import React, { useState, useMemo } from 'react'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'
import productosClimen from '../data/CLIMEN_PRODUCTOS.json'
import {
  extraerCaracteristicas,
  agruparProductosSimilares,
  calcularDiferenciasPrecios
} from '../lib/productMatcher'

// VERSIÓN: 2.0 - FORMATO COMPARATIVO (TABLA)
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

const electrostockData = productosElectrostockPDF.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'ELECTROSTOCK'
}))

const climenDataMapped = productosClimen.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'ECLIMEN'
}))

// Combinar todos
const todosLosProductos = [
  ...electrostockData,
  ...proincoData,
  ...cotoData,
  ...recaData,
  ...climenDataMapped
]

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 15

  // Filtrar y agrupar productos
  const gruposProductos = useMemo(() => {
    if (!busqueda.trim()) return []

    const texto = busqueda.toLowerCase().trim()

    // Filtrar productos que coincidan
    const productosCoincidentes = todosLosProductos.filter(p => {
      return (
        p.desc.toLowerCase().includes(texto) ||
        (p.ref && p.ref.toLowerCase().includes(texto)) ||
        p.proveedor.toLowerCase().includes(texto)
      )
    })

    if (productosCoincidentes.length === 0) return []

    // Agrupar productos similares (umbral bajo para agrupar más agresivamente)
    const grupos = agruparProductosSimilares(productosCoincidentes, 0.50)
      .filter(g => g.productos.length > 0)
      .map(g => ({
        ...g,
        analisis: calcularDiferenciasPrecios(g)
      }))
      .sort((a, b) => b.analisis.diferenciaPorc - a.analisis.diferenciaPorc)

    return grupos
  }, [busqueda])

  // Paginar
  const totalPaginas = Math.ceil(gruposProductos.length / itemsPorPagina)
  const inicio = (paginaActual - 1) * itemsPorPagina
  const gruposActuales = gruposProductos.slice(inicio, inicio + itemsPorPagina)

  const colorProveedor = (proveedor) => {
    const colores = {
      'ELECTROSTOCK': '#0e7fa3',
      'COTO': '#3da83c',
      'RECA': '#f5c518',
      'ECLIMEN': '#f97316',
      'PROINCO': '#e85050'
    }
    return colores[proveedor] || C.teal2
  }

  const obtenerPrecioProveedor = (grupo, proveedor) => {
    const producto = grupo.productos.find(p => p.proveedor === proveedor)
    return producto ? producto.precio : null
  }

  const proveedores = ['ELECTROSTOCK', 'COTO', 'RECA', 'ECLIMEN', 'PROINCO']

  return (
    <div>
      {/* TÍTULO */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
          🔍 Buscador Comparativo de Productos
        </h2>
      </div>

      {/* INSTRUCCIÓN */}
      <div style={{ fontSize: '0.75rem', color: C.muted, marginBottom: 12, fontFamily: 'monospace' }}>
        Busca un producto para ver todos los proveedores y comparar precios:
      </div>

      {/* INPUT */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Busca por producto (ej: magnetotermico, cable, caja)..."
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* TABLA COMPARATIVA */}
      {busqueda.trim() && (
        <>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: 'auto', marginBottom: 14 }}>
            <table style={{ width: '100%', minWidth: 1200, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.bg3 }}>
                  <th style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: C.muted, textTransform: 'uppercase', padding: '9px', textAlign: 'left', borderBottom: `1px solid ${C.border}`, position: 'sticky', left: 0, background: C.bg3, zIndex: 10, minWidth: '280px' }}>
                    Producto
                  </th>
                  {proveedores.map(prov => (
                    <th
                      key={prov}
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.5rem',
                        color: colorProveedor(prov),
                        textTransform: 'uppercase',
                        padding: '9px',
                        textAlign: 'center',
                        borderBottom: `1px solid ${C.border}`,
                        borderLeft: `1px solid ${C.border}`,
                        minWidth: '90px'
                      }}
                    >
                      {prov}
                    </th>
                  ))}
                  <th style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: C.yellow, textTransform: 'uppercase', padding: '9px', textAlign: 'right', borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, minWidth: '80px' }}>
                    Diferencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {gruposActuales.length === 0 ? (
                  <tr>
                    <td colSpan={proveedores.length + 2} style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '0.75rem' }}>
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  gruposActuales.map((grupo, idx) => {
                    const minPrecio = grupo.analisis.precioMinimo
                    const maxPrecio = grupo.analisis.precioMaximo
                    return (
                      <tr
                        key={idx}
                        onMouseEnter={e => e.currentTarget.style.background = `${C.green3}14`}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <td style={{
                          padding: '9px',
                          fontSize: '0.7rem',
                          color: C.text,
                          borderBottom: `1px solid ${C.border}`,
                          position: 'sticky',
                          left: 0,
                          background: 'inherit',
                          zIndex: 9,
                          maxWidth: '280px',
                          fontWeight: 600
                        }}>
                          <div style={{ marginBottom: 4 }}>
                            {grupo.caracteristicas.descNormalizada || grupo.productos[0].desc}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: C.muted }}>
                            {grupo.caracteristicas.tipo && (
                              <span style={{ display: 'inline-block', background: C.teal3, padding: '1px 6px', borderRadius: 3, marginRight: 4 }}>
                                {grupo.caracteristicas.tipo}
                              </span>
                            )}
                            {grupo.caracteristicas.amperios.length > 0 && (
                              <span style={{ display: 'inline-block', background: C.green3, padding: '1px 6px', borderRadius: 3 }}>
                                {grupo.caracteristicas.amperios.join(', ')}A
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Precios por proveedor */}
                        {proveedores.map(prov => {
                          const precio = obtenerPrecioProveedor(grupo, prov)
                          const esMinimo = precio === minPrecio && precio !== null
                          const esMaximo = precio === maxPrecio && precio !== null

                          return (
                            <td
                              key={prov}
                              style={{
                                padding: '9px',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                borderBottom: `1px solid ${C.border}`,
                                borderLeft: `1px solid ${C.border}`,
                                fontWeight: 700,
                                color: esMinimo ? C.green2 : esMaximo ? C.red : precio ? C.text : C.muted,
                                background: esMinimo ? `${C.green3}20` : esMaximo ? `${C.red}20` : '',
                                borderRadius: esMinimo || esMaximo ? 4 : 0
                              }}
                            >
                              {precio ? (
                                <>
                                  {fmt(precio)}
                                  {esMinimo && <div style={{ fontSize: '0.6rem', color: C.green2, marginTop: 2 }}>✓ Mejor</div>}
                                </>
                              ) : (
                                <span style={{ color: C.muted }}>-</span>
                              )}
                            </td>
                          )
                        })}

                        {/* Diferencia */}
                        <td style={{
                          padding: '9px',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          textAlign: 'right',
                          borderBottom: `1px solid ${C.border}`,
                          borderLeft: `1px solid ${C.border}`,
                          fontWeight: 700,
                          color: C.yellow
                        }}>
                          <div>{fmt(grupo.analisis.diferencia)}</div>
                          <div style={{ fontSize: '0.65rem', color: C.muted }}>
                            {grupo.analisis.diferenciaPorc.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* INFO Y PAGINACIÓN */}
          {gruposActuales.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: C.bg3, borderRadius: 8, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'monospace' }}>
                📊 Mostrando <span style={{ color: C.text, fontWeight: 700 }}>{inicio + 1}</span>-<span style={{ color: C.text, fontWeight: 700 }}>{Math.min(inicio + itemsPorPagina, gruposProductos.length)}</span> de <span style={{ color: C.text, fontWeight: 700 }}>{gruposProductos.length}</span> productos
              </div>

              {totalPaginas > 1 && (
                <div style={{ display: 'flex', gap: 8 }}>
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
                  <div style={{ fontSize: '0.7rem', color: C.muted, padding: '6px 12px' }}>
                    Página <span style={{ color: C.text, fontWeight: 700 }}>{paginaActual}</span> de <span style={{ color: C.text, fontWeight: 700 }}>{totalPaginas}</span>
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
          )}
        </>
      )}

      {!busqueda.trim() && (
        <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: '0.9rem' }}>Comienza a buscar un producto para ver la comparativa de precios</div>
        </div>
      )}
    </div>
  )
}
