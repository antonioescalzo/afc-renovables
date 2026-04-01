import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

export default function ExportadorPreciosProveedores() {
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

      // Obtener productos con precios
      const { data: prodData } = await supabase
        .from('productos')
        .select('id, nombre, descripcion, precio, proveedor_id, proveedor_nombre')
      setProductos(prodData || [])

      console.log(`Proveedores: ${provData?.length}, Productos: ${prodData?.length}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportarComparativa = () => {
    if (productos.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    // Agrupar por proveedor
    const porProveedor = {}
    productos.forEach(prod => {
      const prov = prod.proveedor_nombre || 'Desconocido'
      if (!porProveedor[prov]) porProveedor[prov] = []
      porProveedor[prov].push(prod)
    })

    // Crear workbook
    const wb = XLSX.utils.book_new()

    // Hoja 1: Comparativa de precios
    const datosComparativa = []
    const proveedoresUnicosSet = new Set(productos.map(p => p.proveedor_nombre))

    // Obtener productos únicos por descripción
    const productosUnicos = {}
    productos.forEach(prod => {
      const desc = prod.descripcion || prod.nombre
      if (!productosUnicos[desc]) {
        productosUnicos[desc] = {}
      }
      productosUnicos[desc][prod.proveedor_nombre] = prod.precio
    })

    // Construir tabla comparativa
    Object.entries(productosUnicos).forEach(([desc, precios]) => {
      const row = { 'Producto': desc }
      Array.from(proveedoresUnicosSet).forEach(prov => {
        row[prov] = precios[prov] || '-'
      })
      datosComparativa.push(row)
    })

    const wsComparativa = XLSX.utils.json_to_sheet(datosComparativa)
    XLSX.utils.book_append_sheet(wb, wsComparativa, 'Comparativa Precios')

    // Hojas por proveedor
    Object.entries(porProveedor).forEach(([prov, items]) => {
      const datos = items.map(item => ({
        'Producto': item.nombre || item.descripcion,
        'Descripción': item.descripcion,
        'Precio': item.precio
      }))
      const ws = XLSX.utils.json_to_sheet(datos)
      XLSX.utils.book_append_sheet(wb, ws, prov.substring(0, 31))
    })

    // Hoja Resumen
    const resumen = Array.from(proveedoresUnicosSet).map(prov => ({
      'Proveedor': prov,
      'Total Productos': porProveedor[prov].length,
      'Precio Promedio': (porProveedor[prov].reduce((sum, p) => sum + (p.precio || 0), 0) / porProveedor[prov].length).toFixed(2)
    }))
    const wsResumen = XLSX.utils.json_to_sheet(resumen)
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

    XLSX.writeFile(wb, 'COMPARATIVA_PROVEEDORES.xlsx')
  }

  if (loading) return <div className="p-8">Cargando datos...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">💰 Exportador de Precios de Proveedores</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Proveedores</div>
          <div className="text-3xl font-bold text-blue-400">{proveedores.length}</div>
        </div>

        <div className="bg-green-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Productos Registrados</div>
          <div className="text-3xl font-bold text-green-400">{productos.length}</div>
        </div>

        <div className="bg-purple-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Productos Únicos</div>
          <div className="text-3xl font-bold text-purple-400">{new Set(productos.map(p => p.descripcion || p.nombre)).size}</div>
        </div>
      </div>

      <button
        onClick={exportarComparativa}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
      >
        📊 Exportar Comparativa de Precios a Excel
      </button>

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 Proveedores disponibles:</h3>
        <ul className="grid grid-cols-2 gap-4">
          {proveedores.map((prov, idx) => (
            <li key={idx} className="text-gray-300">✓ {prov.nombre}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
