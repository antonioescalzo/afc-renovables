import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'

const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b"
}

const PROVEEDORES_OBJETIVO = ['ELECTROSTOCK', 'COTO', 'RECA', 'CLIMEN', 'PROINCO']

// Datos de PROINCO
const proincoData = [
  { ref: '2009100', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.90, proveedor_nombre: 'PROINCO' },
  { ref: '2009111', desc: 'JUEGO SILENBLOCK A-35', precio: 1.12, proveedor_nombre: 'PROINCO' },
  { ref: '3799940', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 89.05, proveedor_nombre: 'PROINCO' },
  { ref: '3799941', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 108.70, proveedor_nombre: 'PROINCO' },
  { ref: '3799942', desc: 'ROLL DB.PREAIS 3/8x07-5/8x08 20MT', precio: 155.50, proveedor_nombre: 'PROINCO' },
]

// Datos simulados de otros proveedores para análisis comparativo
const cotoData = [
  { ref: 'COTO-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 6.50, proveedor_nombre: 'COTO' },
  { ref: 'COTO-002', desc: 'JUEGO SILENBLOCK A-35', precio: 1.05, proveedor_nombre: 'COTO' },
  { ref: 'COTO-003', desc: 'PANEL SOLAR 400W', precio: 180.00, proveedor_nombre: 'COTO' },
]

const recaData = [
  { ref: 'RECA-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.50, proveedor_nombre: 'RECA' },
  { ref: 'RECA-002', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 85.00, proveedor_nombre: 'RECA' },
]

const climenData = [
  { ref: 'CLIMEN-001', desc: 'JUEGO SOPORTE A/A 500X450', precio: 7.00, proveedor_nombre: 'CLIMEN' },
  { ref: 'CLIMEN-002', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 105.00, proveedor_nombre: 'CLIMEN' },
]

const electrostockData = productosElectrostockPDF.map(p => ({
  ref: p.ref,
  desc: p.desc,
  descripcion: p.desc,
  precio: p.precio,
  proveedor_nombre: 'ELECTROSTOCK'
}))

export default function ComparadorPreciosProveedores() {
  const [datos, setDatos] = useState({})
  const [loading, setLoading] = useState(true)
  const [comparativa, setComparativa] = useState(null)
  const [exportando, setExportando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const datosProveedores = {}

      // Usar datos locales
      datosProveedores['ELECTROSTOCK'] = electrostockData
      datosProveedores['PROINCO'] = proincoData
      datosProveedores['COTO'] = cotoData
      datosProveedores['RECA'] = recaData
      datosProveedores['CLIMEN'] = climenData

      // Log de carga
      PROVEEDORES_OBJETIVO.forEach(prov => {
        console.log(`${prov}: ${(datosProveedores[prov] || []).length} productos`)
      })

      setDatos(datosProveedores)
      hacerComparativa(datosProveedores)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const hacerComparativa = (datosProveedores) => {
    // Crear mapas de productos por descripción
    const productosMap = {}

    Object.entries(datosProveedores).forEach(([prov, productos]) => {
      productos.forEach(prod => {
        const desc = (prod.desc || prod.descripcion || prod.nombre || '').toUpperCase().trim()
        if (!desc) return

        if (!productosMap[desc]) {
          productosMap[desc] = {
            descripcion: prod.desc || prod.descripcion || prod.nombre || '',
            precios: {}
          }
        }
        productosMap[desc].precios[prov] = prod.precio || 0
      })
    })

    // Analizar coincidencias
    const coincidencias = []
    const noCoincidencias = {}

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
          ahorroMaximo: ((diferencia / maxPrecio) * 100).toFixed(1),
          proveedorMasBarato: Object.entries(preciosData).sort((a, b) => a[1] - b[1])[0][0]
        })
      } else {
        const prov = proveedoresConProducto[0]
        if (!noCoincidencias[prov]) noCoincidencias[prov] = []
        noCoincidencias[prov].push(data.descripcion)
      }
    })

    setComparativa({
      coincidencias: coincidencias.sort((a, b) => parseFloat(b.diferencia) - parseFloat(a.diferencia)),
      noCoincidencias,
      totalProductos: Object.values(datosProveedores).reduce((s, p) => s + p.length, 0)
    })
  }

  const exportarAnalisis = async () => {
    if (!comparativa) return
    setExportando(true)

    try {
      const wb = XLSX.utils.book_new()

      // HOJA 1: COINCIDENCIAS (PRODUCTOS EN MÚLTIPLES PROVEEDORES)
      const datosCoincidencias = comparativa.coincidencias.map(item => ({
        'Producto': item.producto,
        'ELECTROSTOCK': item.ELECTROSTOCK || '-',
        'COTO': item.COTO || '-',
        'RECA': item.RECA || '-',
        'CLIMEN': item.CLIMEN || '-',
        'PROINCO': item.PROINCO || '-',
        'Precio Mínimo': item.minPrecio,
        'Precio Máximo': item.maxPrecio,
        'Diferencia': item.diferencia,
        'Ahorro %': item.ahorroMaximo,
        'Proveedor Más Barato': item.proveedorMasBarato
      }))

      const wsCoincidencias = XLSX.utils.json_to_sheet(datosCoincidencias)
      wsCoincidencias['!cols'] = [{ wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 16 }]
      XLSX.utils.book_append_sheet(wb, wsCoincidencias, 'Coincidencias')

      // HOJAS POR PROVEEDOR (PRODUCTOS ÚNICOS)
      PROVEEDORES_OBJETIVO.forEach(prov => {
        const productosUnicos = comparativa.noCoincidencias[prov] || []
        if (productosUnicos.length > 0) {
          const datosUnicos = productosUnicos.map((prod, idx) => ({
            'N°': idx + 1,
            'Producto': prod
          }))
          const ws = XLSX.utils.json_to_sheet(datosUnicos)
          ws['!cols'] = [{ wch: 5 }, { wch: 60 }]
          XLSX.utils.book_append_sheet(wb, ws, `${prov} (únicos)`)
        }
      })

      // RESUMEN GENERAL
      const resumen = PROVEEDORES_OBJETIVO.map(prov => ({
        'Proveedor': prov,
        'Total Productos': (datos[prov] || []).length,
        'En Coincidencias': comparativa.coincidencias.filter(c => c[prov]).length,
        'Únicos': comparativa.noCoincidencias[prov]?.length || 0,
        'Precio Promedio': ((datos[prov] || []).reduce((s, p) => s + (p.precio || 0), 0) / (datos[prov]?.length || 1)).toFixed(2)
      }))

      const wsResumen = XLSX.utils.json_to_sheet(resumen)
      wsResumen['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 16 }, { wch: 12 }, { wch: 14 }]
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

      XLSX.writeFile(wb, `COMPARATIVA_5_PROVEEDORES_${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally {
      setExportando(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 24, color: C.text }}>⏳ Cargando datos de los 5 proveedores...</div>
  }

  const totalCoincidencias = comparativa?.coincidencias.length || 0
  const totalProductos = comparativa?.totalProductos || 0
  const ahorroPromedio = totalCoincidencias > 0
    ? (comparativa.coincidencias.reduce((s, c) => s + parseFloat(c.diferencia), 0) / totalCoincidencias).toFixed(2)
    : 0

  return (
    <div style={{ padding: 24 }}>
      {/* ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Productos Total</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.green2 }}>{totalProductos}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>En Común</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.teal2 }}>{totalCoincidencias}</div>
          <div style={{ fontSize: '0.85rem', color: C.muted, marginTop: 8 }}>{((totalCoincidencias / totalProductos) * 100).toFixed(1)}% coincidencia</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Ahorro Promedio</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.yellow }}>€{ahorroPromedio}</div>
        </div>
      </div>

      {/* BOTÓN EXPORTAR */}
      <button
        onClick={exportarAnalisis}
        disabled={exportando}
        style={{
          background: C.green2,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '14px 28px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: exportando ? 'not-allowed' : 'pointer',
          marginBottom: 32,
          opacity: exportando ? 0.7 : 1
        }}
      >
        {exportando ? '⏳ Generando análisis...' : '📊 Descargar Análisis Completo'}
      </button>

      {/* RESULTADOS */}
      {comparativa && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* TOP 10 PRODUCTOS CON MAYOR DIFERENCIA */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: C.bg3, padding: 16, borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ margin: 0, color: C.green2 }}>💰 Top 10: Mayor diferencia de precios</h3>
            </div>
            <div style={{ padding: 16 }}>
              {comparativa.coincidencias.slice(0, 10).map((item, idx) => (
                <div key={idx} style={{ padding: 12, background: C.bg3, marginBottom: 8, borderRadius: 6 }}>
                  <div style={{ color: C.text, fontWeight: 600, marginBottom: 4 }}>{idx + 1}. {item.producto}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, fontSize: '0.85rem' }}>
                    <div style={{ color: item.ELECTROSTOCK ? C.green2 : C.muted }}>ELECTRO: €{item.ELECTROSTOCK || '-'}</div>
                    <div style={{ color: item.COTO ? C.green2 : C.muted }}>COTO: €{item.COTO || '-'}</div>
                    <div style={{ color: item.RECA ? C.green2 : C.muted }}>RECA: €{item.RECA || '-'}</div>
                    <div style={{ color: item.CLIMEN ? C.green2 : C.muted }}>CLIMEN: €{item.CLIMEN || '-'}</div>
                    <div style={{ color: item.PROINCO ? C.green2 : C.muted }}>PROINCO: €{item.PROINCO || '-'}</div>
                  </div>
                  <div style={{ marginTop: 8, color: C.yellow, fontWeight: 600 }}>
                    Diferencia: €{item.diferencia} ({item.ahorroMaximo}%) - Más barato: {item.proveedorMasBarato}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESUMEN POR PROVEEDOR */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', color: C.green2 }}>📦 Resumen por Proveedor</h3>
            {PROVEEDORES_OBJETIVO.map(prov => (
              <div key={prov} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: C.bg3, marginBottom: 8, borderRadius: 6, borderLeft: `4px solid ${C.green2}` }}>
                <div style={{ color: C.text, fontWeight: 600 }}>{prov}</div>
                <div style={{ color: C.muted, fontSize: '0.9rem' }}>
                  {(datos[prov] || []).length} productos | {comparativa.coincidencias.filter(c => c[prov]).length} en común | {comparativa.noCoincidencias[prov]?.length || 0} únicos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
