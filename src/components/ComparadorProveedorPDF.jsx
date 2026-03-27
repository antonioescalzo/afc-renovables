import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Credenciales Supabase
const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

// Datos del PDF (pueden importarse desde JSON)
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'

export default function ComparadorProveedorPDF() {
  const [productosSupabase, setProductosSupabase] = useState([])
  const [proveedor, setProveedor] = useState(null)
  const [comparacion, setComparacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      // Buscar proveedor GRUPO ELECTRO STOCK
      const { data: proveedoresData, error: provError } = await supabase
        .from('proveedores')
        .select('id, nombre')
        .ilike('nombre', '%ELECTRO%')
        .limit(1)

      if (provError) throw provError

      if (!proveedoresData || proveedoresData.length === 0) {
        setError('Proveedor GRUPO ELECTRO STOCK no encontrado')
        setLoading(false)
        return
      }

      const prov = proveedoresData[0]
      setProveedor(prov)

      // Buscar productos del proveedor
      const { data: productosData, error: prodError } = await supabase
        .from('articulos')
        .select('*')
        .eq('proveedor_id', prov.id)

      if (prodError) throw prodError

      setProductosSupabase(productosData || [])
      realizarComparacion(productosData || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const realizarComparacion = (productosSupabase) => {
    // Mapear referencias
    const refsPDF = {}
    productosElectrostockPDF.forEach(p => {
      refsPDF[p.ref] = p
    })

    const refsSupabase = {}
    productosSupabase.forEach(p => {
      const ref = p.referencia || p.ref
      if (ref) refsSupabase[ref] = p
    })

    // Encontrar coincidencias, solo en PDF, solo en Supabase
    const coincidencias = []
    const soloPDF = []
    const soloSupabase = []
    const conDiferencias = []

    // Productos en ambos
    Object.keys(refsPDF).forEach(ref => {
      if (refsSupabase[ref]) {
        const pdfProd = refsPDF[ref]
        const supaProd = refsSupabase[ref]
        
        // Comparar precios si disponible
        if (supaProd.precio && pdfProd.precio && supaProd.precio !== pdfProd.precio) {
          conDiferencias.push({
            ref,
            pdfPrecio: pdfProd.precio,
            supaPrecio: supaProd.precio,
            diferencia: supaProd.precio - pdfProd.precio,
            pctDiferencia: ((supaProd.precio - pdfProd.precio) / pdfProd.precio * 100).toFixed(2)
          })
        } else {
          coincidencias.push(ref)
        }
      } else {
        soloPDF.push({ ref, ...refsPDF[ref] })
      }
    })

    // Productos solo en Supabase
    Object.keys(refsSupabase).forEach(ref => {
      if (!refsPDF[ref]) {
        soloSupabase.push({ ref, ...refsSupabase[ref] })
      }
    })

    setComparacion({
      totalPDF: Object.keys(refsPDF).length,
      totalSupabase: productosSupabase.length,
      coincidenciasExactas: coincidencias.length,
      conDiferencias: conDiferencias.length,
      soloPDF: soloPDF.length,
      soloSupabase: soloSupabase.length,
      detalles: {
        coincidencias,
        conDiferencias,
        soloPDF,
        soloSupabase
      }
    })
  }

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <p>⏳ Cargando datos del dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{padding: '20px', background: '#fdd', borderRadius: '8px'}}>
        <strong>❌ Error:</strong> {error}
      </div>
    )
  }

  return (
    <div style={{padding: '20px', fontFamily: 'system-ui'}}>
      <h2>📊 Comparación: PDF vs Dashboard</h2>

      {proveedor && (
        <div style={{background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
          <strong>Proveedor:</strong> {proveedor.nombre}
        </div>
      )}

      {comparacion && (
        <div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px'}}>
            <div style={{background: '#e8f5e9', padding: '15px', borderRadius: '8px'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold', color: '#2e7d32'}}>
                {comparacion.totalPDF}
              </div>
              <div style={{color: '#666', fontSize: '0.9em'}}>Productos en PDF</div>
            </div>

            <div style={{background: '#e3f2fd', padding: '15px', borderRadius: '8px'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold', color: '#1565c0'}}>
                {comparacion.totalSupabase}
              </div>
              <div style={{color: '#666', fontSize: '0.9em'}}>Productos en Dashboard</div>
            </div>

            <div style={{background: '#f3e5f5', padding: '15px', borderRadius: '8px'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold', color: '#6a1b9a'}}>
                {comparacion.coincidenciasExactas}
              </div>
              <div style={{color: '#666', fontSize: '0.9em'}}>Coincidencias exactas</div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
            {/* Productos con diferencias de precio */}
            {comparacion.conDiferencias > 0 && (
              <div style={{border: '1px solid #ff9800', padding: '15px', borderRadius: '8px'}}>
                <h3 style={{color: '#ff9800'}}>⚠️ Con diferencias de precio: {comparacion.conDiferencias}</h3>
                <table style={{width: '100%', fontSize: '0.9em', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '1px solid #ddd'}}>
                      <th style={{padding: '5px', textAlign: 'left'}}>REF</th>
                      <th style={{padding: '5px'}}>PDF €</th>
                      <th style={{padding: '5px'}}>Dashboard €</th>
                      <th style={{padding: '5px'}}>Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparacion.detalles.conDiferencias.slice(0, 5).map(item => (
                      <tr key={item.ref} style={{borderBottom: '1px solid #eee'}}>
                        <td style={{padding: '5px'}}>{item.ref}</td>
                        <td style={{padding: '5px', textAlign: 'right'}}>{item.pdfPrecio.toFixed(2)}</td>
                        <td style={{padding: '5px', textAlign: 'right'}}>{item.supaPrecio.toFixed(2)}</td>
                        <td style={{padding: '5px', textAlign: 'right', color: item.diferencia > 0 ? '#d32f2f' : '#388e3c'}}>
                          {item.pctDiferencia}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Solo en PDF */}
            {comparacion.soloPDF > 0 && (
              <div style={{border: '1px solid #4caf50', padding: '15px', borderRadius: '8px'}}>
                <h3 style={{color: '#4caf50'}}>📄 Solo en PDF: {comparacion.soloPDF}</h3>
                <ul style={{paddingLeft: '20px', fontSize: '0.9em'}}>
                  {comparacion.detalles.soloPDF.slice(0, 5).map(item => (
                    <li key={item.ref}>{item.ref}: {item.desc.substring(0, 40)}...</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solo en Supabase */}
            {comparacion.soloSupabase > 0 && (
              <div style={{border: '1px solid #2196f3', padding: '15px', borderRadius: '8px'}}>
                <h3 style={{color: '#2196f3'}}>📊 Solo en Dashboard: {comparacion.soloSupabase}</h3>
                <ul style={{paddingLeft: '20px', fontSize: '0.9em'}}>
                  {comparacion.detalles.soloSupabase.slice(0, 5).map(item => (
                    <li key={item.ref}>{item.ref}: {item.nombre || '...'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px'}}>
            <h4>📈 Resumen:</h4>
            <ul style={{fontSize: '0.95em', lineHeight: '1.8'}}>
              <li>✓ Coincidencias exactas: {comparacion.coincidenciasExactas}</li>
              <li>⚠️ Diferencias de precio: {comparacion.conDiferencias}</li>
              <li>📄 Solo en PDF (nuevos): {comparacion.soloPDF}</li>
              <li>📊 Solo en Dashboard (descontinuados?): {comparacion.soloSupabase}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
