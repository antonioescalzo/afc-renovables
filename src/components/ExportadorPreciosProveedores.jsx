import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'

// Datos de PROINCO
const proincoData = [
  { ref: '2009100', desc: 'JUEGO SOPORTE A/A 500X450', precio: 5.90 },
  { ref: '2009111', desc: 'JUEGO SILENBLOCK A-35', precio: 1.12 },
  { ref: '3799940', desc: 'ROLL DB.PREAIS 1/4x07-3/8x07 20MT', precio: 89.05 },
  { ref: '3799941', desc: 'ROLL DB.PREAIS 1/4x07-1/2x07 20MT', precio: 108.70 },
  { ref: '3799942', desc: 'ROLL DB.PREAIS 3/8x07-5/8x08 20MT', precio: 155.50 },
  { ref: 'SP2052370', desc: 'DEP. INERCIA INOX 100 L COMFORT', precio: 350.00 },
  { ref: 'SP2052363', desc: 'DEP. INERCIA INOX SLIM 50 L COMFORT', precio: 214.00 },
  { ref: '979521713', desc: 'B.CIRC GHN 25/60-180 SANITARY', precio: 52.80 },
]

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b", white: "#f0faf1",
}

export default function ExportadorPreciosProveedores() {
  const [exportando, setExportando] = useState(false)

  const exportarComparativa = async () => {
    setExportando(true)
    try {
      const wb = XLSX.utils.book_new()

      // 1. ELECTROSTOCK SHEET
      const electroData = productosElectrostockPDF.map(p => ({
        'Referencia': p.ref || '',
        'Descripción': p.desc || '',
        'Cantidad': p.uds || 1,
        'Precio Unitario': p.precio || 0,
        'Importe': p.importe || 0
      }))
      const wsElectro = XLSX.utils.json_to_sheet(electroData)
      wsElectro['!cols'] = [{ wch: 12 }, { wch: 50 }, { wch: 10 }, { wch: 14 }, { wch: 14 }]
      XLSX.utils.book_append_sheet(wb, wsElectro, 'ELECTROSTOCK')

      // 2. PROINCO SHEET
      const proincoData2 = proincoData.map(p => ({
        'Referencia': p.ref || '',
        'Descripción': p.desc || '',
        'Cantidad': 1,
        'Precio Unitario': p.precio || 0,
        'Importe': p.precio || 0
      }))
      const wsProinco = XLSX.utils.json_to_sheet(proincoData2)
      wsProinco['!cols'] = [{ wch: 12 }, { wch: 50 }, { wch: 10 }, { wch: 14 }, { wch: 14 }]
      XLSX.utils.book_append_sheet(wb, wsProinco, 'PROINCO')

      // 3. COMPARATIVA SHEET
      const productosMap = {}

      // Agrupar ELECTROSTOCK
      productosElectrostockPDF.forEach(p => {
        const desc = (p.desc || '').toUpperCase()
        if (!productosMap[desc]) {
          productosMap[desc] = { descripcion: p.desc || '', electrostock: 0, proinco: 0 }
        }
        productosMap[desc].electrostock = p.precio || 0
      })

      // Agrupar PROINCO
      proincoData.forEach(p => {
        const desc = (p.desc || '').toUpperCase()
        if (!productosMap[desc]) {
          productosMap[desc] = { descripcion: p.desc || '', electrostock: 0, proinco: 0 }
        }
        productosMap[desc].proinco = p.precio || 0
      })

      // Construir tabla comparativa
      const comparativaData = Object.values(productosMap).map(item => ({
        'Producto': item.descripcion,
        'Precio ELECTROSTOCK': item.electrostock,
        'Precio PROINCO': item.proinco,
        'Diferencia': (item.electrostock - item.proinco).toFixed(2),
        'Proveedor Más Barato': item.electrostock === 0 ? 'PROINCO' : item.proinco === 0 ? 'ELECTROSTOCK' : item.electrostock < item.proinco ? 'ELECTROSTOCK' : 'PROINCO'
      }))

      const wsComparativa = XLSX.utils.json_to_sheet(comparativaData)
      wsComparativa['!cols'] = [{ wch: 50 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 18 }]
      XLSX.utils.book_append_sheet(wb, wsComparativa, 'COMPARATIVA')

      // 4. RESUMEN
      const totalElectro = productosElectrostockPDF.reduce((s, p) => s + (p.importe || 0), 0)
      const totalProinco = proincoData.reduce((s, p) => s + (p.precio || 0), 0)

      const resumenData = [
        { 'Proveedor': 'ELECTROSTOCK', 'Productos': productosElectrostockPDF.length, 'Total': totalElectro.toFixed(2) },
        { 'Proveedor': 'PROINCO', 'Productos': proincoData.length, 'Total': totalProinco.toFixed(2) }
      ]

      const wsResumen = XLSX.utils.json_to_sheet(resumenData)
      wsResumen['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, wsResumen, 'RESUMEN')

      XLSX.writeFile(wb, `COMPARATIVA_PROVEEDORES_${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally {
      setExportando(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      {/* ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Productos ELECTROSTOCK</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.green2 }}>{productosElectrostockPDF.length}</div>
          <div style={{ fontSize: '0.9rem', color: C.muted, marginTop: 8 }}>€{productosElectrostockPDF.reduce((s, p) => s + (p.importe || 0), 0).toFixed(2)}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Productos PROINCO</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.teal2 }}>{proincoData.length}</div>
          <div style={{ fontSize: '0.9rem', color: C.muted, marginTop: 8 }}>€{proincoData.reduce((s, p) => s + (p.precio || 0), 0).toFixed(2)}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Total Productos</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: C.yellow }}>{productosElectrostockPDF.length + proincoData.length}</div>
          <div style={{ fontSize: '0.9rem', color: C.muted, marginTop: 8 }}>€{(productosElectrostockPDF.reduce((s, p) => s + (p.importe || 0), 0) + proincoData.reduce((s, p) => s + (p.precio || 0), 0)).toFixed(2)}</div>
        </div>
      </div>

      {/* BOTÓN EXPORTAR */}
      <button
        onClick={exportarComparativa}
        disabled={exportando}
        style={{
          background: C.green2,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '14px 28px',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: exportando ? 'not-allowed' : 'pointer',
          marginBottom: 32,
          opacity: exportando ? 0.7 : 1,
          transition: 'all 0.3s'
        }}
      >
        {exportando ? '⏳ Generando Excel...' : '📊 Descargar Excel Comparativo'}
      </button>

      {/* INFO */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', color: C.green2, fontSize: '1.1rem' }}>📋 Contenido del Excel:</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: C.text }}>
          <li style={{ marginBottom: 8 }}>✅ <strong>ELECTROSTOCK</strong> - 31 productos con precios y referencias</li>
          <li style={{ marginBottom: 8 }}>✅ <strong>PROINCO</strong> - 8 productos con precios</li>
          <li style={{ marginBottom: 8 }}>✅ <strong>COMPARATIVA</strong> - Análisis lado a lado con diferencias de precios</li>
          <li>✅ <strong>RESUMEN</strong> - Estadísticas generales por proveedor</li>
        </ul>
      </div>
    </div>
  )
}
