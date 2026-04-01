import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

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

export default function ExportadorPreciosProveedores() {
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportando, setExportando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      // Obtener proveedores
      const { data: provData } = await supabase
        .from('proveedores')
        .select('id, nombre')
      setProveedores(provData || [])

      // Intentar obtener productos de diferentes tablas
      let prodData = []

      // Intentar tabla 'productos'
      const { data: prod1 } = await supabase
        .from('productos')
        .select('*')
        .limit(1000)
      if (prod1 && prod1.length > 0) prodData = prod1

      // Si no hay datos, intentar tabla 'articulos'
      if (prodData.length === 0) {
        const { data: prod2 } = await supabase
          .from('articulos')
          .select('*')
          .limit(1000)
        if (prod2) prodData = prod2
      }

      setProductos(prodData)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportarComparativa = async () => {
    setExportando(true)
    try {
      // Agrupar productos por proveedor
      const porProveedor = {}
      productos.forEach(prod => {
        const prov = prod.proveedor_nombre || prod.proveedor_id || 'Desconocido'
        if (!porProveedor[prov]) {
          porProveedor[prov] = []
        }
        porProveedor[prov].push({
          nombre: prod.nombre || prod.descripcion || '',
          descripcion: prod.descripcion || '',
          precio: prod.precio || 0,
          cantidad: prod.cantidad || 1
        })
      })

      const wb = XLSX.utils.book_new()

      // HOJA 1: COMPARATIVA POR PRODUCTO
      const productosUnicos = {}
      productos.forEach(prod => {
        const desc = (prod.descripcion || prod.nombre || '').toUpperCase()
        if (!productosUnicos[desc]) {
          productosUnicos[desc] = {
            producto: prod.descripcion || prod.nombre || ''
          }
        }
        const prov = prod.proveedor_nombre || prod.proveedor_id || 'Desconocido'
        productosUnicos[desc][`Precio_${prov}`] = prod.precio || 0
      })

      const datosComparativa = Object.values(productosUnicos)
        .sort((a, b) => a.producto.localeCompare(b.producto))

      const wsComparativa = XLSX.utils.json_to_sheet(datosComparativa)
      wsComparativa['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, wsComparativa, 'Comparativa')

      // HOJAS POR PROVEEDOR
      Object.entries(porProveedor).forEach(([prov, items]) => {
        const datos = items.map(item => ({
          'Producto': item.nombre,
          'Descripción': item.descripcion,
          'Precio': item.precio,
          'Cantidad': item.cantidad
        }))
        const ws = XLSX.utils.json_to_sheet(datos)
        ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 10 }]
        const nombreHoja = prov.substring(0, 31)
        XLSX.utils.book_append_sheet(wb, ws, nombreHoja)
      })

      // HOJA RESUMEN
      const resumen = Object.entries(porProveedor).map(([prov, items]) => {
        const total = items.reduce((sum, p) => sum + (p.precio || 0), 0)
        return {
          'Proveedor': prov,
          'Productos': items.length,
          'Precio Mínimo': Math.min(...items.map(p => p.precio || 0)),
          'Precio Máximo': Math.max(...items.map(p => p.precio || 0)),
          'Precio Promedio': (total / items.length).toFixed(2),
          'Total': total.toFixed(2)
        }
      }).sort((a, b) => b.Productos - a.Productos)

      const wsResumen = XLSX.utils.json_to_sheet(resumen)
      wsResumen['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }]
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

      XLSX.writeFile(wb, `COMPARATIVA_PRECIOS_${new Date().toISOString().split('T')[0]}.xlsx`)
    } finally {
      setExportando(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: C.text }}>
        ⏳ Cargando datos...
      </div>
    )
  }

  const porProveedor = {}
  productos.forEach(prod => {
    const prov = prod.proveedor_nombre || prod.proveedor_id || 'Desconocido'
    if (!porProveedor[prov]) porProveedor[prov] = 0
    porProveedor[prov]++
  })

  return (
    <div style={{ padding: 24 }}>
      {/* TARJETAS DE ESTADÍSTICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Total Proveedores</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: C.green2 }}>{proveedores.length}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Productos Registrados</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: C.teal2 }}>{productos.length}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: '0.8rem', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Proveedores con Productos</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: C.yellow }}>{Object.keys(porProveedor).length}</div>
        </div>
      </div>

      {/* BOTÓN EXPORTAR */}
      <button
        onClick={exportarComparativa}
        disabled={exportando || productos.length === 0}
        style={{
          background: productos.length === 0 ? C.muted : C.green2,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: productos.length === 0 ? 'not-allowed' : 'pointer',
          marginBottom: 32,
          opacity: exportando ? 0.7 : 1,
          transition: 'all 0.3s'
        }}
      >
        {exportando ? '⏳ Exportando...' : '📊 Descargar Excel Comparativo'}
      </button>

      {/* TABLA DE PROVEEDORES */}
      {Object.keys(porProveedor).length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: C.bg3, padding: 16, borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ margin: 0, color: C.green2, fontSize: '1.1rem' }}>📦 Productos por Proveedor</h3>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.entries(porProveedor)
                .sort((a, b) => b[1] - a[1])
                .map(([prov, count]) => (
                  <div key={prov} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: C.bg2, borderRadius: 6, borderLeft: `4px solid ${C.green2}` }}>
                    <span style={{ color: C.text, fontWeight: 600 }}>{prov}</span>
                    <span style={{ background: C.green3, color: C.green2, padding: '4px 12px', borderRadius: 20, fontSize: '0.9rem', fontWeight: 700 }}>{count} productos</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {productos.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: C.muted }}>
          ⚠️ No hay productos registrados en la base de datos
        </div>
      )}
    </div>
  )
}
