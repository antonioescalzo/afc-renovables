import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'

const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

export default function AnalizerPreciosPDF() {
  const [proveedores, setProveedores] = useState([])
  const [productosBD, setProductosBD] = useState({})
  const [analisis, setAnalisis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      // 1. Obtener proveedores
      const { data: provData, error: provError } = await supabase
        .from('proveedores')
        .select('id, nombre')

      if (provError) throw new Error(`Error cargando proveedores: ${provError.message}`)
      setProveedores(provData || [])

      // 2. Obtener productos con precios de cada proveedor
      const { data: articulos, error: artError } = await supabase
        .from('productos')
        .select('id, nombre, descripcion, precio, proveedor_id')

      if (artError) {
        console.warn('Tabla productos no encontrada, intentando articulos...')
        const { data: art2, error: err2 } = await supabase
          .from('articulos')
          .select('*')
        if (!err2) setProductosBD(organizarProductos(art2))
      } else {
        setProductosBD(organizarProductos(articulos))
      }

      // 3. Realizar análisis
      realizarAnalisis(provData || [])
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const organizarProductos = (productos) => {
    const organizado = {}
    productos.forEach(prod => {
      const clave = String(prod.descripcion || prod.nombre || '').toUpperCase()
      if (clave) {
        if (!organizado[clave]) organizado[clave] = []
        organizado[clave].push(prod)
      }
    })
    return organizado
  }

  const realizarAnalisis = (provs) => {
    const resultados = {
      totalPDF: productosElectrostockPDF.length,
      totalImportePDF: 0,
      coincidencias: [],
      noConcidencias: [],
      ahorros: [],
      gastos_extra: [],
      proveedorMasUsado: null
    }

    // Calcular total PDF
    resultados.totalImportePDF = productosElectrostockPDF.reduce((sum, p) => sum + (p.importe || 0), 0)

    // Buscar coincidencias
    productosElectrostockPDF.forEach(pdfProd => {
      const descPDF = pdfProd.desc.toUpperCase()
      let encontrado = false

      // Búsqueda exacta por descripción
      Object.entries(productosBD).forEach(([descBD, productos]) => {
        if (descBD.includes(descPDF) || descPDF.includes(descBD)) {
          const prodoBD = productos[0]
          const diferencia = prodoBD.precio - pdfProd.precio
          const porcentaje = ((diferencia / pdfProd.precio) * 100).toFixed(2)

          resultados.coincidencias.push({
            descripcion: pdfProd.desc,
            precioPDF: pdfProd.precio,
            precioBD: prodoBD.precio,
            diferencia: diferencia.toFixed(2),
            porcentaje,
            esAhorro: diferencia < 0,
            cantidad: pdfProd.uds
          })

          if (diferencia < 0) {
            resultados.ahorros.push({
              desc: pdfProd.desc,
              ahorro: Math.abs(diferencia).toFixed(2),
              porcentaje: Math.abs(porcentaje)
            })
          } else {
            resultados.gastos_extra.push({
              desc: pdfProd.desc,
              gasto_extra: diferencia.toFixed(2),
              porcentaje
            })
          }

          encontrado = true
        }
      })

      if (!encontrado) {
        resultados.noConcidencias.push(pdfProd.desc)
      }
    })

    setAnalisis(resultados)
  }

  if (loading) return <div className="p-8 text-center">Cargando datos...</div>
  if (error) return <div className="p-8 bg-red-50 border border-red-200 rounded text-red-600">Error: {error}</div>

  return (
    <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-8">📊 Análisis Precios PDF vs Proveedores</h2>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Total Productos PDF</div>
          <div className="text-3xl font-bold text-blue-400">{analisis?.totalPDF || 0}</div>
          <div className="text-gray-400 text-xs mt-2">€{analisis?.totalImportePDF.toFixed(2)}</div>
        </div>

        <div className="bg-green-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Coincidencias</div>
          <div className="text-3xl font-bold text-green-400">{analisis?.coincidencias.length || 0}</div>
          <div className="text-gray-400 text-xs mt-2">{((analisis?.coincidencias.length || 0) / (analisis?.totalPDF || 1) * 100).toFixed(1)}%</div>
        </div>

        <div className="bg-yellow-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Ahorros Potenciales</div>
          <div className="text-3xl font-bold text-yellow-400">€{(analisis?.ahorros.reduce((sum, a) => sum + parseFloat(a.ahorro), 0) || 0).toFixed(2)}</div>
          <div className="text-gray-400 text-xs mt-2">{analisis?.ahorros.length} productos</div>
        </div>

        <div className="bg-red-900 p-6 rounded-lg">
          <div className="text-gray-300 text-sm">Gastos Extra</div>
          <div className="text-3xl font-bold text-red-400">€{(analisis?.gastos_extra.reduce((sum, a) => sum + parseFloat(a.gasto_extra), 0) || 0).toFixed(2)}</div>
          <div className="text-gray-400 text-xs mt-2">{analisis?.gastos_extra.length} productos</div>
        </div>
      </div>

      {/* PRODUCTOS CON AHORROS */}
      {analisis?.ahorros.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-green-400 mb-4">✅ Productos más BARATOS en PDF</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-green-900">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-right">Ahorro (€)</th>
                  <th className="px-4 py-2 text-right">% Ahorro</th>
                </tr>
              </thead>
              <tbody>
                {analisis.ahorros.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
                    <td className="px-4 py-2 text-gray-300">{item.desc}</td>
                    <td className="px-4 py-2 text-right text-green-400 font-bold">€{item.ahorro}</td>
                    <td className="px-4 py-2 text-right text-green-400">{item.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTOS CON GASTOS EXTRA */}
      {analisis?.gastos_extra.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-400 mb-4">❌ Productos más CAROS en proveedores actuales</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-900">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-right">Costo Extra (€)</th>
                  <th className="px-4 py-2 text-right">% Incremento</th>
                </tr>
              </thead>
              <tbody>
                {analisis.gastos_extra.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
                    <td className="px-4 py-2 text-gray-300">{item.desc}</td>
                    <td className="px-4 py-2 text-right text-red-400 font-bold">€{item.gasto_extra}</td>
                    <td className="px-4 py-2 text-right text-red-400">{item.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTOS SIN COINCIDENCIAS */}
      {analisis?.noConcidencias.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Productos NO encontrados en BD ({analisis.noConcidencias.length})</h3>
          <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
            <ul className="space-y-2">
              {analisis.noConcidencias.slice(0, 15).map((desc, idx) => (
                <li key={idx} className="text-gray-300 text-sm">• {desc}</li>
              ))}
              {analisis.noConcidencias.length > 15 && (
                <li className="text-gray-400 text-sm italic">+{analisis.noConcidencias.length - 15} productos más</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
