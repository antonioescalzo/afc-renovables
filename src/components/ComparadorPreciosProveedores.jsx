import React, { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'
import productosClimen from '../data/CLIMEN_PRODUCTOS.json'

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050", orange: "#f97316",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b"
}

const PROVEEDORES_OBJETIVO = ['ELECTROSTOCK', 'CLIMEN', 'PROINCO', 'COTO', 'RECA']

// Datos de PROINCO
const proincoData = [
  { ref: '2009100', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.90, proveedor_nombre: 'PROINCO' },
  { ref: '2009111', desc: 'JUEGO SILENBLOCK A-35', precio: 1.12, proveedor_nombre: 'PROINCO' },
  { ref: '3799940', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 89.05, proveedor_nombre: 'PROINCO' },
  { ref: '3799941', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 108.70, proveedor_nombre: 'PROINCO' },
  { ref: '3799942', desc: 'ROLL DB.PREAIS 3/8x07-5/8x08 20MT', precio: 155.50, proveedor_nombre: 'PROINCO' },
]

// Datos de COTO
const cotoData = [
  { ref: 'COTO-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 6.50, proveedor_nombre: 'COTO' },
  { ref: 'COTO-002', desc: 'JUEGO SILENBLOCK A-35', precio: 1.05, proveedor_nombre: 'COTO' },
  { ref: 'COTO-003', desc: 'PANEL SOLAR 400W', precio: 180.00, proveedor_nombre: 'COTO' },
]

// Datos de RECA
const recaData = [
  { ref: 'RECA-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.50, proveedor_nombre: 'RECA' },
  { ref: 'RECA-002', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 85.00, proveedor_nombre: 'RECA' },
]

// Datos REALES de ELECTROSTOCK
const electrostockData = productosElectrostockPDF.map(p => ({
  ref: p.ref,
  desc: p.desc,
  descripcion: p.desc,
  precio: p.precio,
  proveedor_nombre: 'ELECTROSTOCK'
}))

// Datos REALES de CLIMEN (sin duplicados, sin datos simulados)
const climenDataMapped = productosClimen.map(p => ({
  ref: p.ref,
  desc: p.desc,
  descripcion: p.desc,
  precio: p.precio,
  proveedor_nombre: 'CLIMEN'
}))

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function ComparadorPreciosProveedores() {
  const [filtro, setFiltro] = useState('')
  const [exportando, setExportando] = useState(false)

  // Preparar datos una sola vez
  const datosProveedores = useMemo(() => {
    return {
      'ELECTROSTOCK': electrostockData,
      'PROINCO': proincoData,
      'COTO': cotoData,
      'RECA': recaData,
      'CLIMEN': climenDataMapped
    }
  }, [])

  // Calcular comparativa en tiempo real
  const analisis = useMemo(() => {
    const productosMap = {}

    // Agrupar productos por descripción
    Object.entries(datosProveedores).forEach(([prov, productos]) => {
      productos.forEach(prod => {
        const desc = (prod.desc || prod.descripcion || '').toUpperCase().trim()
        if (!desc) return

        if (!productosMap[desc]) {
          productosMap[desc] = {
            descripcion: prod.desc || prod.descripcion || '',
            precios: {}
          }
        }
        productosMap[desc].precios[prov] = prod.precio || 0
      })
    })

    // Analizar coincidencias
    const coincidencias = []

    Object.entries(productosMap).forEach(([desc, data]) => {
      const preciosData = data.precios
      const proveedoresConProducto = Object.keys(preciosData)

      if (proveedoresConProducto.length > 1) {
        const preciosArray = Object.values(preciosData)
        const minPrecio = Math.min(...preciosArray)
        const maxPrecio = Math.max(...preciosArray)
        const diferencia = maxPrecio - minPrecio

        coincidencias.push({
          producto: data.descripcion,
          ...preciosData,
          minPrecio,
          maxPrecio,
          diferencia: diferencia.toFixed(2),
          porcentajeDiferencia: ((diferencia / maxPrecio) * 100).toFixed(1),
          proveedorMasBarato: Object.entries(preciosData).sort((a, b) => a[1] - b[1])[0][0]
        })
      }
    })

    // Filtrar por búsqueda
    const coincidenciasFiltradas = filtro
      ? coincidencias.filter(c => c.producto.toLowerCase().includes(filtro.toLowerCase()))
      : coincidencias

    // Ordenar por diferencia descendente
    coincidenciasFiltradas.sort((a, b) => parseFloat(b.diferencia) - parseFloat(a.diferencia))

    return {
      coincidencias: coincidenciasFiltradas,
      totalProductos: Object.values(datosProveedores).reduce((s, p) => s + p.length, 0),
      totalCoincidencias: coincidencias.length
    }
  }, [datosProveedores, filtro])

  const exportarAnalisis = async () => {
    if (analisis.coincidencias.length === 0) return
    setExportando(true)

    try {
      const wb = XLSX.utils.book_new()

      // HOJA 1: COMPARATIVA CON TODOS LOS PRECIOS
      const datosCoincidencias = analisis.coincidencias.map(item => ({
        'Producto': item.producto,
        'ELECTROSTOCK': item.ELECTROSTOCK || '-',
        'CLIMEN': item.CLIMEN || '-',
        'PROINCO': item.PROINCO || '-',
        'COTO': item.COTO || '-',
        'RECA': item.RECA || '-',
        'Precio Mínimo': item.minPrecio,
        'Precio Máximo': item.maxPrecio,
        'Diferencia €': item.diferencia,
        'Diferencia %': item.porcentajeDiferencia,
        'Proveedor Más Barato': item.proveedorMasBarato
      }))

      const wsCoincidencias = XLSX.utils.json_to_sheet(datosCoincidencias)
      wsCoincidencias['!cols'] = [{ wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 16 }]
      XLSX.utils.book_append_sheet(wb, wsCoincidencias, 'Comparativa Completa')

      // RESUMEN GENERAL
      const resumen = PROVEEDORES_OBJETIVO.map(prov => {
        const productos = datosProveedores[prov] || []
        const precioPromedio = productos.length > 0
          ? (productos.reduce((s, p) => s + (p.precio || 0), 0) / productos.length).toFixed(2)
          : 0
        const enComun = analisis.coincidencias.filter(c => c[prov]).length

        return {
          'Proveedor': prov,
          'Total Productos': productos.length,
          'En Comparativa': enComun,
          'Únicos': productos.length - enComun,
          'Precio Promedio': precioPromedio,
          'Precio Mínimo': Math.min(...productos.map(p => p.precio || 0)),
          'Precio Máximo': Math.max(...productos.map(p => p.precio || 0))
        }
      })

      const wsResumen = XLSX.utils.json_to_sheet(resumen)
      wsResumen['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }]
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Proveedores')

      XLSX.writeFile(wb, `COMPARATIVA_PROVEEDORES_${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally {
      setExportando(false)
    }
  }

  const ahorroPromedio = analisis.coincidencias.length > 0
    ? (analisis.coincidencias.reduce((s, c) => s + parseFloat(c.diferencia), 0) / analisis.coincidencias.length).toFixed(2)
    : 0

  return (
    <div style={{ padding: 24 }}>
      {/* TÍTULO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: '1.8rem' }}>💰</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.text, margin: 0 }}>Comparador de Precios - 5 Proveedores</h1>
      </div>

      {/* ESTADÍSTICAS PRINCIPALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>📦 Productos Totales</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.green2 }}>{analisis.totalProductos}</div>
          <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 8 }}>en todos los proveedores</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>🔄 Productos en Comparativa</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.teal2 }}>{analisis.totalCoincidencias}</div>
          <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 8 }}>{((analisis.totalCoincidencias / analisis.totalProductos) * 100).toFixed(1)}% disponibles en múltiples proveedores</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>💵 Ahorro Promedio</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.yellow }}>{fmt(parseFloat(ahorroPromedio))}</div>
          <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 8 }}>entre proveedor más caro y más barato</div>
        </div>
      </div>

      {/* BÚSQUEDA Y BOTÓN EXPORTAR */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            flex: 1,
            minWidth: 250,
            padding: '10px 14px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}
        />
        <button
          onClick={exportarAnalisis}
          disabled={exportando || analisis.coincidencias.length === 0}
          style={{
            background: C.green2,
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: exportando || analisis.coincidencias.length === 0 ? 'not-allowed' : 'pointer',
            opacity: exportando || analisis.coincidencias.length === 0 ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {exportando ? '⏳ Generando...' : '📊 Exportar Excel'}
        </button>
      </div>

      {/* LISTADO DE PRODUCTOS CON GRÁFICOS DE BARRAS */}
      {analisis.coincidencias.length > 0 ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ fontSize: '0.75rem', color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            📊 {analisis.coincidencias.length} Productos en Comparativa
          </div>

          {analisis.coincidencias.map((item, idx) => {
            const precios = [
              { prov: 'ELECTROSTOCK', precio: item.ELECTROSTOCK, color: C.teal2 },
              { prov: 'CLIMEN', precio: item.CLIMEN, color: C.orange },
              { prov: 'PROINCO', precio: item.PROINCO, color: C.red },
              { prov: 'COTO', precio: item.COTO, color: C.yellow },
              { prov: 'RECA', precio: item.RECA, color: C.green2 }
            ].filter(p => p.precio !== undefined)

            const maxPrecio = Math.max(...precios.map(p => p.precio))

            return (
              <div key={idx} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 8 }}>
                {/* Título y diferencia */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: C.muted, fontFamily: 'monospace', marginBottom: 4 }}>#{idx + 1}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text }}>{item.producto}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: C.yellow, marginBottom: 2 }}>Diferencia: {fmt(parseFloat(item.diferencia))}</div>
                    <div style={{ fontSize: '0.75rem', color: C.orange, fontWeight: 600 }}>{item.porcentajeDiferencia}% de variación</div>
                    <div style={{ fontSize: '0.7rem', color: C.green2, marginTop: 4 }}>✓ Más barato: {item.proveedorMasBarato}</div>
                  </div>
                </div>

                {/* Gráfico de barras */}
                <div style={{ display: 'grid', gap: 8 }}>
                  {precios.map((p, pidx) => (
                    <div key={pidx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: p.color }}>{p.prov}</span>
                        <span style={{ color: C.text, fontWeight: 700 }}>{fmt(p.precio)}</span>
                      </div>
                      <div style={{ height: 24, background: C.bg3, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <div
                          style={{
                            height: '100%',
                            background: p.color,
                            width: `${(p.precio / maxPrecio) * 100}%`,
                            transition: 'width 0.3s',
                            borderRadius: 4
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: C.muted, fontSize: '0.9rem' }}>
          📭 No hay productos en común entre los proveedores para tu búsqueda
        </div>
      )}
    </div>
  )
}
