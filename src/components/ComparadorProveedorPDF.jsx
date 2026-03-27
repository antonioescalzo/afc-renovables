import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Credenciales Supabase
const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

// Colores AFC
const C={
  bg:"#050f0a",bg2:"#081508",bg3:"#0d1f10",
  teal:"#0e7fa3",teal2:"#0d9abf",teal3:"#0a4f65",
  green:"#3da83c",green2:"#52c450",green3:"#1f6b1e",
  greenLeaf:"#4ab83e",accent:"#7ed956",
  yellow:"#f5c518",red:"#e85050",orange:"#f97316",
  text:"#e8f5e9",muted:"#6aad7a",border:"#1a3d20",
  card:"#0a1c0b",white:"#f0faf1",
};

export default function ComparadorProveedorPDF() {
  const [productosSupabase, setProductosSupabase] = useState([])
  const [proveedor, setProveedor] = useState(null)
  const [comparacion, setComparacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Datos de prueba del presupuesto PDF
  const productosElectrostockPDF = [
    { ref: "403588", desc: "*MAGNET TX3 6KA C P+N 25A", importe: 3.96 },
    { ref: "403589", desc: "*MAGNET TX3 6KA C P+N 32A", importe: 8.76 },
    { ref: "403590", desc: "*MAGNET TX3 6KA C P+N 40A", importe: 11.78 },
    { ref: "403612", desc: "*MAGNET TX3 6KA C 2P 63A", importe: 19.89 },
    { ref: "403033", desc: "DIFERENCIAL TX3 2/40/30 AC", importe: 13.91 },
    { ref: "411525", desc: "DIFERENCIAL DX3 2/40/300 AC", importe: 31.50 },
    { ref: "411506", desc: "DIFERENCIAL DX3 2/63/30 AC", importe: 79.50 },
    { ref: "411526", desc: "DIFERENCIAL DX3 2/63/300 AC", importe: 55.91 },
    { ref: "403628", desc: "MAGNET TX3 6KA C 4P 25A", importe: 21.50 },
    { ref: "403629", desc: "MAGNET TX3 6KA C 4P 32A", importe: 22.42 },
    { ref: "403630", desc: "MAGNET TX3 6KA C 4P 40A", importe: 26.60 },
    { ref: "403632", desc: "MAGNET TX3 6KA C 4P 63A", importe: 39.82 },
    { ref: "403005", desc: "DIFERENCIAL TX3 4/40/30 AC", importe: 54.16 },
    { ref: "411665", desc: "DIFERENCIAL DX3 4/40/300 AC", importe: 50.54 },
    { ref: "411662", desc: "DIFERENCIAL DX3 4/63/30 AC", importe: 129.68 },
    { ref: "411666", desc: "DIFERENCIAL DX3 4/63/300 AC", importe: 66.65 },
    { ref: "402057", desc: "DIFERENCIAL VIVIENDA 2/40/30MA", importe: 11.40 },
    { ref: "419928", desc: "MAGNET. VIVIENDA RX³ 1P+N 25A", importe: 2.36 },
    { ref: "419929", desc: "MAGNET. VIVIENDA RX³ 1P+N 32A", importe: 4.20 },
    { ref: "419930", desc: "MAGNET. VIVIENDA RX³ 1P+N 40A", importe: 4.37 },
  ]

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
      console.error(err)
      setError('Error al cargar datos de Supabase')
      setLoading(false)
    }
  }

  const realizarComparacion = (productosSupabase) => {
    const refsPDF = {}
    productosElectrostockPDF.forEach(p => {
      refsPDF[p.ref] = p
    })

    const refsSupabase = {}
    productosSupabase.forEach(p => {
      const ref = p.referencia || p.ref
      if (ref) refsSupabase[ref] = p
    })

    const coincidencias = []
    const soloPDF = []
    const soloSupabase = []
    const conDiferencias = []

    Object.keys(refsPDF).forEach(ref => {
      if (refsSupabase[ref]) {
        const pdfProd = refsPDF[ref]
        const supaProd = refsSupabase[ref]

        if (supaProd.precio && pdfProd.importe && supaProd.precio !== pdfProd.importe) {
          conDiferencias.push({
            ref,
            pdfPrecio: pdfProd.importe,
            supaPrecio: supaProd.precio,
            pctDiferencia: ((supaProd.precio - pdfProd.importe) / pdfProd.importe * 100).toFixed(2)
          })
        } else {
          coincidencias.push(ref)
        }
      } else {
        soloPDF.push({ ref, ...refsPDF[ref] })
      }
    })

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
      <div style={{padding: '20px', textAlign: 'center', color: C.muted}}>
        <p>⏳ Cargando comparación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{padding: '20px', background: C.red + '20', borderRadius: '8px', color: C.red}}>
        <strong>❌ {error}</strong>
      </div>
    )
  }

  return (
    <div style={{padding: '16px'}}>
      <h3 style={{color: C.green2, marginBottom: 16}}>📊 Comparación: PDF ELECTROSTOCK vs Dashboard</h3>

      {proveedor && (
        <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.75rem'}}>
          <strong style={{color: C.teal2}}>Proveedor:</strong> {proveedor.nombre}
        </div>
      )}

      {comparacion && (
        <div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px'}}>
            <div style={{background: C.green3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.green3}`}}>
              <div style={{fontSize: '1.6em', fontWeight: 'bold', color: C.green2}}>{comparacion.totalPDF}</div>
              <div style={{color: C.muted, fontSize: '0.7em'}}>Productos en PDF</div>
            </div>

            <div style={{background: C.teal3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.teal3}`}}>
              <div style={{fontSize: '1.6em', fontWeight: 'bold', color: C.teal2}}>{comparacion.totalSupabase}</div>
              <div style={{color: C.muted, fontSize: '0.7em'}}>En Dashboard</div>
            </div>

            <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.border}`}}>
              <div style={{fontSize: '1.6em', fontWeight: 'bold', color: C.green2}}>{comparacion.coincidenciasExactas}</div>
              <div style={{color: C.muted, fontSize: '0.7em'}}>Coincidencias</div>
            </div>

            <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.border}`}}>
              <div style={{fontSize: '1.6em', fontWeight: 'bold', color: C.yellow}}>{comparacion.conDiferencias}</div>
              <div style={{color: C.muted, fontSize: '0.7em'}}>Diferencias</div>
            </div>
          </div>

          {comparacion.soloPDF > 0 && (
            <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', marginBottom: '12px', border: `1px solid ${C.border}`}}>
              <h4 style={{color: C.green2, margin: '0 0 8px 0', fontSize: '0.8rem'}}>📄 Productos nuevos (solo en PDF): {comparacion.soloPDF}</h4>
              <ul style={{paddingLeft: '20px', fontSize: '0.7rem', margin: 0}}>
                {comparacion.detalles.soloPDF.slice(0, 5).map(item => (
                  <li key={item.ref}>{item.ref}: {item.desc.substring(0, 40)}</li>
                ))}
              </ul>
            </div>
          )}

          {comparacion.conDiferencias > 0 && (
            <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', marginBottom: '12px', border: `1px solid ${C.border}`}}>
              <h4 style={{color: C.yellow, margin: '0 0 8px 0', fontSize: '0.8rem'}}>⚠️ Con diferencias de precio: {comparacion.conDiferencias}</h4>
              <table style={{width: '100%', fontSize: '0.65rem', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: `1px solid ${C.border}`}}>
                    <th style={{padding: '4px', textAlign: 'left', color: C.teal2}}>REF</th>
                    <th style={{padding: '4px', textAlign: 'right', color: C.teal2}}>PDF €</th>
                    <th style={{padding: '4px', textAlign: 'right', color: C.teal2}}>Dashboard €</th>
                    <th style={{padding: '4px', textAlign: 'right', color: C.teal2}}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {comparacion.detalles.conDiferencias.slice(0, 3).map(item => (
                    <tr key={item.ref} style={{borderBottom: `1px solid ${C.border}`}}>
                      <td style={{padding: '4px', color: C.teal2}}>{item.ref}</td>
                      <td style={{padding: '4px', textAlign: 'right', color: C.green2}}>{item.pdfPrecio.toFixed(2)}</td>
                      <td style={{padding: '4px', textAlign: 'right', color: C.green2}}>{item.supaPrecio.toFixed(2)}</td>
                      <td style={{padding: '4px', textAlign: 'right', color: item.pctDiferencia > 0 ? C.red : C.green2}}>
                        {item.pctDiferencia}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
