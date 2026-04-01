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

const climenDataMapped = productosClimen.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'CLIMEN'
}))

// Combinar todos los productos (SIN duplicados de CLIMEN)
const todosLosProductos = [
  ...electrostockData,
  ...proincoData,
  ...cotoData,
  ...recaData,
  ...climenDataMapped  // Solo datos reales de CLIMEN_PRODUCTOS.json
]

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 20

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

  // Agrupar por descripción
  const productosAgrupados = useMemo(() => {
    const grupos = {}
    productosFiltrados.forEach(p => {
      const desc_upper = p.desc.toUpperCase()
      if (!grupos[desc_upper]) {
        grupos[desc_upper] = {
          nombre: p.desc,
          proveedores: {}
        }
      }
      if (!grupos[desc_upper].proveedores[p.proveedor]) {
        grupos[desc_upper].proveedores[p.proveedor] = p
      }
    })

    // Convertir a array y encontrar mejor precio
    return Object.values(grupos).map(grupo => {
      const precios = Object.values(grupo.proveedores).map(p => p.precio)
      const minPrecio = Math.min(...precios)
      const maxPrecio = Math.max(...precios)

      // Ordenar proveedores por precio
      const proveedoresOrdenados = Object.entries(grupo.proveedores)
        .map(([prov, datos]) => ({ proveedor: prov, ...datos }))
        .sort((a, b) => a.precio - b.precio)

      return {
        ...grupo,
        minPrecio,
        maxPrecio,
        ahorro: maxPrecio - minPrecio,
        proveedoresOrdenados
      }
    }).sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [productosFiltrados])

  // Paginar
  const totalPaginas = Math.ceil(productosAgrupados.length / itemsPorPagina)
  const inicio = (paginaActual - 1) * itemsPorPagina
  const productosActuales = productosAgrupados.slice(inicio, inicio + itemsPorPagina)

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
      {/* BÚSQUEDA */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="🔍 Buscar producto (ej: magnetotermico, cable, caja)..."
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: C.bg2,
            border: `2px solid ${C.border}`,
            borderRadius: 8,
            color: C.text,
            fontSize: '0.85rem',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* RESULTADOS */}
      <div style={{ marginBottom: 24 }}>
        {productosActuales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.muted, fontSize: '0.85rem' }}>
            📭 No hay productos que coincidan con tu búsqueda
          </div>
        ) : (
          productosActuales.map((grupo, idx) => (
            <div
              key={idx}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                marginBottom: 16,
                overflow: 'hidden'
              }}
            >
              {/* NOMBRE DEL PRODUCTO */}
              <div style={{
                background: C.bg3,
                padding: '12px 16px',
                borderBottom: `1px solid ${C.border}`
              }}>
                <div style={{
                  color: C.text,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {grupo.nombre}
                </div>
                {grupo.ahorro > 0 && (
                  <div style={{
                    fontSize: '0.7rem',
                    color: C.yellow,
                    marginTop: 6
                  }}>
                    💰 Diferencia: {fmt(grupo.ahorro)} | Rango: {fmt(grupo.minPrecio)} - {fmt(grupo.maxPrecio)}
                  </div>
                )}
              </div>

              {/* PROVEEDORES CON GRÁFICO DE BARRAS */}
              <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: 12, fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>
                  Comparativa de Precios
                </div>
                {grupo.proveedoresOrdenados.map((item, pidx) => {
                  const esMasBarato = item.precio === grupo.minPrecio
                  const color = colorProveedor(item.proveedor)
                  const porcentajeBarra = (item.precio / grupo.maxPrecio) * 100

                  return (
                    <div key={pidx} style={{ marginBottom: pidx < grupo.proveedoresOrdenados.length - 1 ? 12 : 0 }}>
                      {/* Nombre proveedor y precio */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                          <div style={{
                            background: color + '30',
                            border: `1px solid ${color}`,
                            color: color,
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            minWidth: '95px',
                            textAlign: 'center'
                          }}>
                            {item.proveedor}
                          </div>
                          {item.ref && item.ref !== '...' && (
                            <div style={{ fontSize: '0.65rem', color: C.muted, fontFamily: 'monospace' }}>
                              Ref: {item.ref}
                            </div>
                          )}
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: esMasBarato ? C.yellow : C.text,
                          minWidth: '70px',
                          textAlign: 'right'
                        }}>
                          {fmt(item.precio)}
                        </div>
                        {esMasBarato && (
                          <div style={{
                            background: C.yellow + '30',
                            border: `1px solid ${C.yellow}`,
                            color: C.yellow,
                            padding: '2px 6px',
                            borderRadius: 3,
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            marginLeft: 8
                          }}>
                            ✓ MEJOR
                          </div>
                        )}
                      </div>

                      {/* Barra visual */}
                      <div style={{
                        height: 20,
                        background: C.bg3,
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            background: color,
                            width: `${porcentajeBarra}%`,
                            transition: 'width 0.3s',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: 6
                          }}
                        >
                          {porcentajeBarra > 30 && (
                            <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 600 }}>
                              {porcentajeBarra.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: C.bg3,
          borderRadius: 8,
          gap: 10
        }}>
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
              fontWeight: 700
            }}
          >
            ← Anterior
          </button>
          <div style={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'monospace' }}>
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
              fontWeight: 700
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
