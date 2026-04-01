import React, { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'
import productosClimen from '../data/CLIMEN_PRODUCTOS.json'
import {
  agruparProductosSimilares,
  calcularDiferenciasPrecios,
  extraerCaracteristicas,
  obtenerTop10Diferencias
} from '../lib/productMatcher'

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b"
}

// Datos de proveedores simulados/reales
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

// Preparar datos de ELECTROSTOCK
const electrostockData = productosElectrostockPDF.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'ELECTROSTOCK'
}))

// Preparar datos de CLIMEN
const climenDataMapped = productosClimen.map(p => ({
  ref: p.ref,
  desc: p.desc,
  precio: p.precio,
  proveedor: 'CLIMEN'
}))

// Combinar todos los productos
const todosLosProductos = [
  ...electrostockData,
  ...proincoData,
  ...cotoData,
  ...recaData,
  ...climenDataMapped
]

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function ComparadorPreciosProveedores() {
  const [loading, setLoading] = useState(true)
  const [top10, setTop10] = useState([])
  const [todosGrupos, setTodosGrupos] = useState([])
  const [exportando, setExportando] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [minDiferencia, setMinDiferencia] = useState(0)

  // Inicializar análisis
  useEffect(() => {
    const analizar = () => {
      try {
        // Obtener Top 10 con mayor diferencia
        const top = obtenerTop10Diferencias(todosLosProductos, 10)
        setTop10(top)

        // Obtener todos los grupos para análisis completo (umbral bajo = agrupa más)
        const grupos = agruparProductosSimilares(todosLosProductos, 0.50)
          .filter(g => g.productos.length >= 2)
          .map(g => ({
            ...g,
            analisis: calcularDiferenciasPrecios(g)
          }))
          .filter(g => g.analisis.diferencia > 0)
          .sort((a, b) => b.analisis.diferenciaPorc - a.analisis.diferenciaPorc)

        setTodosGrupos(grupos)
      } catch (err) {
        console.error('Error en análisis:', err)
      } finally {
        setLoading(false)
      }
    }

    analizar()
  }, [])

  // Filtrar resultados
  const gruposFiltrados = useMemo(() => {
    return todosGrupos.filter(grupo => {
      if (minDiferencia > 0 && grupo.analisis.diferenciaPorc < minDiferencia) {
        return false
      }
      if (filtroTipo && grupo.caracteristicas.tipo !== filtroTipo) {
        return false
      }
      return true
    })
  }, [todosGrupos, filtroTipo, minDiferencia])

  // Obtener tipos únicos para filtro
  const tiposDisponibles = useMemo(() => {
    const tipos = new Set()
    todosGrupos.forEach(g => {
      if (g.caracteristicas.tipo) {
        tipos.add(g.caracteristicas.tipo)
      }
    })
    return Array.from(tipos).sort()
  }, [todosGrupos])

  const exportarAnalisisCompleto = async () => {
    if (gruposFiltrados.length === 0) return
    setExportando(true)

    try {
      const wb = XLSX.utils.book_new()

      // HOJA 1: TOP 10 COMPLETO
      const datosTop10 = top10.map((grupo, idx) => {
        const detalles = grupo.analisis.detallePrecios
        const fila = {
          'Ranking': idx + 1,
          'Producto': grupo.caracteristicas.descNormalizada || grupo.productos[0].desc,
          'Tipo': grupo.caracteristicas.tipo || '-',
          'Especificaciones': []
        }

        if (grupo.caracteristicas.amperios.length > 0) {
          fila['Especificaciones'] = `${grupo.caracteristicas.amperios.join(', ')}A`
        }
        if (grupo.caracteristicas.polos) {
          fila['Especificaciones'] = `${fila['Especificaciones']} ${grupo.caracteristicas.polos}`
        }

        // Añadir precio de cada proveedor
        const proveedores = ['ELECTROSTOCK', 'COTO', 'RECA', 'CLIMEN', 'PROINCO']
        proveedores.forEach(prov => {
          const det = detalles.find(d => d.proveedor === prov)
          fila[prov] = det ? det.precio : '-'
        })

        fila['Precio Mínimo'] = grupo.analisis.precioMinimo
        fila['Precio Máximo'] = grupo.analisis.precioMaximo
        fila['Diferencia €'] = grupo.analisis.diferencia.toFixed(2)
        fila['Diferencia %'] = grupo.analisis.diferenciaPorc.toFixed(1)
        fila['Proveedor Más Barato'] = grupo.analisis.proveedorMasBarato
        fila['Ahorro Potencial'] = grupo.analisis.ahorroPotencial.toFixed(2)

        return fila
      })

      const wsTop10 = XLSX.utils.json_to_sheet(datosTop10)
      wsTop10['!cols'] = Array(15).fill({ wch: 16 })
      XLSX.utils.book_append_sheet(wb, wsTop10, 'Top 10 Diferencias')

      // HOJA 2: TODOS LOS PRODUCTOS CON SIMILITUD
      const datosCompletos = gruposFiltrados.map((grupo, idx) => ({
        'N°': idx + 1,
        'Producto': grupo.caracteristicas.descNormalizada || grupo.productos[0].desc,
        'Tipo': grupo.caracteristicas.tipo || '-',
        'Cantidad Proveedores': grupo.productos.length,
        'Similitud Promedio': (grupo.similitudPromedio * 100).toFixed(1) + '%',
        'Precio Mín': grupo.analisis.precioMinimo.toFixed(2),
        'Precio Máx': grupo.analisis.precioMaximo.toFixed(2),
        'Diferencia €': grupo.analisis.diferencia.toFixed(2),
        'Diferencia %': grupo.analisis.diferenciaPorc.toFixed(1),
        'Más Barato': grupo.analisis.proveedorMasBarato,
        'Más Caro': grupo.analisis.proveedorMasCaro
      }))

      const wsCompletos = XLSX.utils.json_to_sheet(datosCompletos)
      wsCompletos['!cols'] = Array(12).fill({ wch: 14 })
      XLSX.utils.book_append_sheet(wb, wsCompletos, 'Análisis Completo')

      // HOJA 3: RESUMEN
      const resumen = [{
        'Métrica': 'Total Productos',
        'Valor': todosLosProductos.length
      }, {
        'Métrica': 'Productos en Común',
        'Valor': gruposFiltrados.length
      }, {
        'Métrica': 'Diferencia Promedio €',
        'Valor': (gruposFiltrados.reduce((s, g) => s + g.analisis.diferencia, 0) / gruposFiltrados.length).toFixed(2)
      }, {
        'Métrica': 'Diferencia Promedio %',
        'Valor': (gruposFiltrados.reduce((s, g) => s + g.analisis.diferenciaPorc, 0) / gruposFiltrados.length).toFixed(1) + '%'
      }, {
        'Métrica': 'Ahorro Total Potencial',
        'Valor': gruposFiltrados.reduce((s, g) => s + g.analisis.ahorroPotencial, 0).toFixed(2)
      }]

      const wsResumen = XLSX.utils.json_to_sheet(resumen)
      wsResumen['!cols'] = [{ wch: 25 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

      XLSX.writeFile(wb, `COMPARATIVA_INTELIGENTE_${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally {
      setExportando(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 24, color: C.text }}>⏳ Analizando {todosLosProductos.length} productos con matching inteligente...</div>
  }

  const estadisticas = {
    totalProductos: todosLosProductos.length,
    enComun: gruposFiltrados.length,
    diferenciasPromedio: gruposFiltrados.length > 0
      ? (gruposFiltrados.reduce((s, g) => s + g.analisis.diferencia, 0) / gruposFiltrados.length).toFixed(2)
      : 0,
    ahorroTotal: gruposFiltrados.reduce((s, g) => s + g.analisis.ahorroPotencial, 0).toFixed(2)
  }

  return (
    <div>
      {/* ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>📦 Productos Total</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: C.green2 }}>{estadisticas.totalProductos}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>🔗 Productos en Común</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: C.teal2 }}>{estadisticas.enComun}</div>
          <div style={{ fontSize: '0.85rem', color: C.muted, marginTop: 8 }}>({((estadisticas.enComun / estadisticas.totalProductos) * 100).toFixed(1)}% coincidencia)</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>💰 Diferencia Promedio</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: C.yellow }}>{fmt(parseFloat(estadisticas.diferenciasPromedio))}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>🎯 Ahorro Potencial Total</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: C.red }}>{fmt(parseFloat(estadisticas.ahorroTotal))}</div>
        </div>
      </div>

      {/* CONTROLES */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={exportarAnalisisCompleto}
          disabled={exportando}
          style={{
            background: C.green2,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: exportando ? 'not-allowed' : 'pointer',
            opacity: exportando ? 0.7 : 1
          }}
        >
          {exportando ? '⏳ Generando...' : '📊 Descargar Análisis Completo'}
        </button>

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          style={{
            padding: '8px 12px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <option value="">Todos los tipos</option>
          {tiposDisponibles.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: '0.8rem', color: C.muted }}>Diferencia mínima:</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minDiferencia}
            onChange={e => setMinDiferencia(parseInt(e.target.value))}
            style={{ width: 120, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', color: C.text, fontWeight: 600, minWidth: 40 }}>{minDiferencia}%</span>
        </div>
      </div>

      {/* TOP 10 CON MAYOR DIFERENCIA */}
      {top10.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ background: C.bg3, padding: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ margin: 0, color: C.green2, fontSize: '1.1rem', fontWeight: 700 }}>🏆 TOP 10: Mayor Diferencia de Precios</h3>
          </div>
          <div style={{ padding: 16 }}>
            {top10.map((grupo, idx) => (
              <div key={idx} style={{
                padding: 14,
                background: C.bg3,
                marginBottom: 12,
                borderRadius: 8,
                borderLeft: `4px solid ${C.yellow}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ color: C.yellow, fontWeight: 700, fontSize: '0.9rem' }}>#{idx + 1}</div>
                    <div style={{ color: C.text, fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                      {grupo.caracteristicas.descNormalizada || grupo.productos[0].desc}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: C.red, fontWeight: 700, fontSize: '1.2rem' }}>
                      {fmt(grupo.analisis.diferencia)}
                    </div>
                    <div style={{ color: C.muted, fontSize: '0.8rem', marginTop: 2 }}>
                      {grupo.analisis.diferenciaPorc.toFixed(1)}% diferencia
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, fontSize: '0.75rem', marginBottom: 8 }}>
                  {grupo.analisis.detallePrecios.map((detalle, i) => (
                    <div key={i} style={{
                      padding: 8,
                      background: C.bg2,
                      borderRadius: 4,
                      borderLeft: `3px solid ${detalle.precio === grupo.analisis.precioMinimo ? C.green2 : detalle.precio === grupo.analisis.precioMaximo ? C.red : C.muted}`
                    }}>
                      <div style={{ color: C.muted, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 2 }}>
                        {detalle.proveedor}
                      </div>
                      <div style={{ color: C.text, fontWeight: 700 }}>
                        {fmt(detalle.precio)}
                      </div>
                      {detalle.precio === grupo.analisis.precioMinimo && (
                        <div style={{ color: C.green2, fontSize: '0.65rem', marginTop: 2 }}>✓ Más barato</div>
                      )}
                    </div>
                  ))}
                </div>

                {grupo.caracteristicas.tipo && (
                  <div style={{ fontSize: '0.75rem', color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 8 }}>
                    <span style={{ display: 'inline-block', background: C.teal3, padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>
                      {grupo.caracteristicas.tipo}
                    </span>
                    {grupo.caracteristicas.amperios.length > 0 && (
                      <span style={{ display: 'inline-block', background: C.green3, padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>
                        {grupo.caracteristicas.amperios.join(', ')}A
                      </span>
                    )}
                    {grupo.caracteristicas.polos && (
                      <span style={{ display: 'inline-block', background: C.green3, padding: '2px 8px', borderRadius: 4 }}>
                        {grupo.caracteristicas.polos}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTADO COMPLETO FILTRADO */}
      {gruposFiltrados.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: C.bg3, padding: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ margin: 0, color: C.teal2, fontSize: '1.1rem', fontWeight: 700 }}>
              📊 Análisis Completo ({gruposFiltrados.length} productos)
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.bg3 }}>
                  {['Producto', 'Tipo', 'Proveedores', 'Min', 'Max', 'Diferencia', '%', 'Más Barato'].map(h => (
                    <th key={h} style={{
                      padding: 10,
                      textAlign: 'left',
                      borderBottom: `1px solid ${C.border}`,
                      color: C.muted,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gruposFiltrados.slice(0, 50).map((grupo, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.text }}>
                      {grupo.caracteristicas.descNormalizada || grupo.productos[0].desc}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.muted }}>
                      {grupo.caracteristicas.tipo || '-'}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.teal2, fontWeight: 600 }}>
                      {grupo.productos.length}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.green2, fontWeight: 600 }}>
                      {fmt(grupo.analisis.precioMinimo)}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.red, fontWeight: 600 }}>
                      {fmt(grupo.analisis.precioMaximo)}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.yellow, fontWeight: 600 }}>
                      {fmt(grupo.analisis.diferencia)}
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.yellow, fontWeight: 600 }}>
                      {grupo.analisis.diferenciaPorc.toFixed(1)}%
                    </td>
                    <td style={{ padding: 10, fontSize: '0.75rem', color: C.text }}>
                      {grupo.analisis.proveedorMasBarato}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {gruposFiltrados.length > 50 && (
            <div style={{ padding: 12, background: C.bg3, textAlign: 'center', fontSize: '0.8rem', color: C.muted }}>
              Mostrando primeros 50 de {gruposFiltrados.length} productos
            </div>
          )}
        </div>
      )}

      {gruposFiltrados.length === 0 && !loading && (
        <div style={{ padding: 24, textAlign: 'center', color: C.muted }}>
          No hay productos que coincidan con los filtros seleccionados
        </div>
      )}
    </div>
  )
}
