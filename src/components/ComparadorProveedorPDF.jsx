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

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

export default function ComparadorProveedorPDF() {
  const [productosSupabase, setProductosSupabase] = useState([])
  const [proveedor, setProveedor] = useState(null)
  const [analisis, setAnalisis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedSection, setExpandedSection] = useState('resumenes')

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

      const { data: productosData, error: prodError } = await supabase
        .from('v_productos_por_proveedor')
        .select('*')
        .eq('proveedor_id', prov.id)
        .limit(1000)

      if (prodError) throw prodError

      setProductosSupabase(productosData || [])
      realizarAnalisisExhaustivo(productosData || [])
      setLoading(false)
    } catch (err) {
      console.error('Error en ComparadorProveedorPDF:', err)
      setError(`Error: ${err.message || JSON.stringify(err)}`)
      setLoading(false)
    }
  }

  const realizarAnalisisExhaustivo = (productosSupabase) => {
    console.log('==== BÚSQUEDA POR PALABRAS CLAVE (SIN REFERENCIAS) ====')
    console.log('📊 Productos en Supabase:', productosSupabase.length)

    // Función de similitud basada en palabras clave
    const similitudPalabras = (s1, s2) => {
      const a = (s1 || '').toUpperCase().split(/\s+/).filter(w => w.length > 2)
      const b = (s2 || '').toUpperCase().split(/\s+/).filter(w => w.length > 2)

      let matches = 0
      a.forEach(pa => {
        if (b.some(pb => pb.includes(pa) || pa.includes(pb))) matches++
      })

      return matches / Math.max(a.length, b.length, 1)
    }

    const refsPDF = {}
    productosElectrostockPDF.forEach(p => {
      refsPDF[p.ref] = p
    })
    console.log('📄 Productos en PDF:', Object.keys(refsPDF).length)

    const productosComparados = []
    const soloPDF = []
    const supabaseSinUsar = [...productosSupabase]

    console.log('🔗 Buscando coincidencias por palabras clave...')

    // Buscar coincidencias por descripción
    Object.keys(refsPDF).forEach((refPdf, idx) => {
      const pdfProd = refsPDF[refPdf]
      let mejorMatch = null
      let mejorSim = 0
      let indexMejor = -1

      supabaseSinUsar.forEach((supaProd, supIdx) => {
        const sim = similitudPalabras(pdfProd.desc, supaProd.descripcion)
        if (sim > mejorSim) {
          mejorSim = sim
          mejorMatch = supaProd
          indexMejor = supIdx
        }
      })

      // Umbral más bajo (30%)
      if (mejorMatch && mejorSim > 0.3) {
        const pdfPrecio = pdfProd.importe
        const supaPrecio = mejorMatch.precio || 0
        const diferencia = supaPrecio - pdfPrecio
        const pctDiferencia = pdfPrecio > 0 ? (diferencia / pdfPrecio * 100) : 0
        const ahorro = pdfPrecio > supaPrecio ? Math.abs(diferencia) : 0

        productosComparados.push({
          ref: refPdf,
          desc: pdfProd.desc,
          pdfPrecio,
          supaPrecio,
          diferencia: diferencia.toFixed(2),
          pctDiferencia: pctDiferencia.toFixed(2),
          ahorro: ahorro > 0 ? ahorro.toFixed(2) : 0,
          esAhorro: pdfPrecio > supaPrecio
        })

        // Remover de la lista de Supabase sin usar
        supabaseSinUsar.splice(indexMejor, 1)

        if (idx < 5) {
          console.log(`  ✓ ${refPdf}: "${pdfProd.desc.substring(0, 30)}" => "${mejorMatch.descripcion.substring(0, 30)}" (${(mejorSim * 100).toFixed(0)}%)`)
        }
      } else {
        soloPDF.push({
          ref: refPdf,
          desc: pdfProd.desc,
          importe: pdfProd.importe
        })
        if (idx < 5) {
          console.log(`  ✗ ${refPdf}: ${mejorSim > 0 ? `mejor sim ${(mejorSim*100).toFixed(0)}% (bajo)` : 'no coincidencias'}`)
        }
      }
    })

    const soloSupabase = supabaseSinUsar.map(p => ({
      ref: p.descripcion || '',
      desc: p.descripcion || '',
      precio: p.precio || 0
    }))

    console.log(`✅ Coincidencias: ${productosComparados.length} | Solo PDF: ${soloPDF.length} | Solo Supabase: ${soloSupabase.length}`)

    // Cálculos de análisis
    const totalPDF = productosElectrostockPDF.reduce((sum, p) => sum + p.importe, 0)
    const totalSupabase = productosComparados.reduce((sum, p) => sum + p.supaPrecio, 0)
    const ahorroTotal = Math.max(0, totalPDF - totalSupabase)
    const incrementoTotal = totalSupabase > totalPDF ? totalSupabase - totalPDF : 0
    const pctAhorro = totalPDF > 0 ? (ahorroTotal / totalPDF * 100) : 0
    const pctIncremento = totalPDF > 0 ? (incrementoTotal / totalPDF * 100) : 0

    const productosMasBaratos = productosComparados
      .filter(p => p.esAhorro)
      .sort((a, b) => parseFloat(b.ahorro) - parseFloat(a.ahorro))
      .slice(0, 5)

    const productosConIncremento = productosComparados
      .filter(p => !p.esAhorro)
      .sort((a, b) => parseFloat(b.diferencia) - parseFloat(a.diferencia))
      .slice(0, 5)

    setAnalisis({
      productosComparados,
      soloPDF,
      soloSupabase,
      estadisticas: {
        totalPDF,
        totalSupabase,
        ahorroTotal,
        incrementoTotal,
        pctAhorro: pctAhorro.toFixed(2),
        pctIncremento: pctIncremento.toFixed(2),
        productosEnPDF: refsPDF.length,
        productosEnDashboard: productosSupabase.length,
        coincidencias: productosComparados.length,
        conAhorro: productosComparados.filter(p => p.esAhorro).length,
        conIncremento: productosComparados.filter(p => !p.esAhorro).length
      },
      top5: {
        masBaratos: productosMasBaratos,
        conIncremento: productosConIncremento
      }
    })
  }

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center', color: C.muted}}>⏳ Cargando análisis...</div>
  }

  if (error) {
    return <div style={{padding: '20px', background: C.red + '20', borderRadius: '8px', color: C.red}}><strong>❌ {error}</strong></div>
  }

  if (!analisis) return null

  const { estadisticas, productosComparados, top5, soloPDF, soloSupabase } = analisis

  return (
    <div style={{padding: '16px'}}>
      <h3 style={{color: C.green2, marginBottom: 16}}>📊 Análisis Exhaustivo: ELECTROSTOCK PDF vs Dashboard</h3>

      {proveedor && (
        <div style={{background: C.bg3, padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.75rem'}}>
          <strong style={{color: C.teal2}}>Proveedor:</strong> {proveedor.nombre}
        </div>
      )}

      {/* RESUMEN FINANCIERO */}
      <div style={{marginBottom: '20px'}}>
        <h4 style={{color: C.accent, fontSize: '0.8rem', marginBottom: '12px', fontFamily: 'monospace', textTransform: 'uppercase'}}>💰 Resumen Financiero</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px'}}>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace'}}>PDF Total</div>
            <div style={{color: C.green2, fontSize: '1.4rem', fontWeight: 'bold'}}>{fmt(estadisticas.totalPDF)}</div>
          </div>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace'}}>Dashboard Total</div>
            <div style={{color: C.teal2, fontSize: '1.4rem', fontWeight: 'bold'}}>{fmt(estadisticas.totalSupabase)}</div>
          </div>
          <div style={{background: estadisticas.ahorroTotal > 0 ? C.green3 : C.bg3, border: `1px solid ${estadisticas.ahorroTotal > 0 ? C.green3 : C.border}`, borderRadius: '8px', padding: '12px'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace'}}>Ahorro Potencial</div>
            <div style={{color: C.green2, fontSize: '1.4rem', fontWeight: 'bold'}}>{fmt(estadisticas.ahorroTotal)}</div>
            <div style={{color: C.green2, fontSize: '0.65rem'}}>(-{estadisticas.pctAhorro}%)</div>
          </div>
          <div style={{background: estadisticas.incrementoTotal > 0 ? C.bg3 : C.bg3, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace'}}>Incremento</div>
            <div style={{color: estadisticas.incrementoTotal > 0 ? C.orange : C.muted, fontSize: '1.4rem', fontWeight: 'bold'}}>{fmt(estadisticas.incrementoTotal)}</div>
            <div style={{color: C.orange, fontSize: '0.65rem'}}>({estadisticas.pctIncremento > 0 ? '+' : ''}{estadisticas.pctIncremento}%)</div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS PRODUCTOS */}
      <div style={{marginBottom: '20px'}}>
        <h4 style={{color: C.accent, fontSize: '0.8rem', marginBottom: '12px', fontFamily: 'monospace', textTransform: 'uppercase'}}>📦 Estadísticas de Productos</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px'}}>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', marginBottom: '4px'}}>Coincidentes</div>
            <div style={{color: C.teal2, fontSize: '1.6rem', fontWeight: 'bold'}}>{estadisticas.coincidencias}</div>
          </div>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', marginBottom: '4px'}}>Con Ahorro</div>
            <div style={{color: C.green2, fontSize: '1.6rem', fontWeight: 'bold'}}>{estadisticas.conAhorro}</div>
          </div>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', marginBottom: '4px'}}>Con Incremento</div>
            <div style={{color: C.orange, fontSize: '1.6rem', fontWeight: 'bold'}}>{estadisticas.conIncremento}</div>
          </div>
          <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
            <div style={{color: C.muted, fontSize: '0.6rem', marginBottom: '4px'}}>Solo PDF</div>
            <div style={{color: C.yellow, fontSize: '1.6rem', fontWeight: 'bold'}}>{soloPDF.length}</div>
          </div>
        </div>
      </div>

      {/* TOP 5 MÁS BARATOS */}
      {top5.masBaratos.length > 0 && (
        <div style={{marginBottom: '20px', background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.green3}`}}>
          <h4 style={{color: C.green2, margin: '0 0 12px 0', fontSize: '0.75rem'}}>🎯 TOP 5 Mejores Ahorros</h4>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', fontSize: '0.65rem', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: `1px solid ${C.border}`}}>
                  <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>REF</th>
                  <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>PRODUCTO</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>PDF</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>DASHBOARD</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>AHORRO €</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>%</th>
                </tr>
              </thead>
              <tbody>
                {top5.masBaratos.map(p => (
                  <tr key={p.ref} style={{borderBottom: `1px solid ${C.border}`}}>
                    <td style={{padding: '6px', color: C.teal2, fontWeight: 'bold'}}>{p.ref}</td>
                    <td style={{padding: '6px', color: C.text, fontSize: '0.6rem'}}>{p.desc.substring(0, 25)}...</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.yellow}}>{fmt(parseFloat(p.pdfPrecio))}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.green2}}>{fmt(parseFloat(p.supaPrecio))}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.green2, fontWeight: 'bold'}}>{`-${fmt(parseFloat(p.ahorro))}`}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.green2, fontWeight: 'bold'}}>{`-${p.pctDiferencia}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTOS CON INCREMENTO */}
      {top5.conIncremento.length > 0 && (
        <div style={{marginBottom: '20px', background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.orange}`}}>
          <h4 style={{color: C.orange, margin: '0 0 12px 0', fontSize: '0.75rem'}}>⚠️ TOP 5 Mayor Incremento</h4>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', fontSize: '0.65rem', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: `1px solid ${C.border}`}}>
                  <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>REF</th>
                  <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>PRODUCTO</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>PDF</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>DASHBOARD</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>INCREMENTO €</th>
                  <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>%</th>
                </tr>
              </thead>
              <tbody>
                {top5.conIncremento.map(p => (
                  <tr key={p.ref} style={{borderBottom: `1px solid ${C.border}`}}>
                    <td style={{padding: '6px', color: C.teal2, fontWeight: 'bold'}}>{p.ref}</td>
                    <td style={{padding: '6px', color: C.text, fontSize: '0.6rem'}}>{p.desc.substring(0, 25)}...</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.yellow}}>{fmt(parseFloat(p.pdfPrecio))}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.orange}}>{fmt(parseFloat(p.supaPrecio))}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.red, fontWeight: 'bold'}}>+{fmt(parseFloat(p.diferencia))}</td>
                    <td style={{padding: '6px', textAlign: 'right', color: C.red, fontWeight: 'bold'}}>+{p.pctDiferencia}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLA COMPARATIVA COMPLETA */}
      <div style={{marginBottom: '20px', background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.border}`}}>
        <h4 style={{color: C.accent, margin: '0 0 12px 0', fontSize: '0.75rem'}}>📋 Tabla Comparativa Completa ({productosComparados.length} productos)</h4>
        <div style={{overflowX: 'auto', maxHeight: '400px', overflowY: 'auto'}}>
          <table style={{width: '100%', fontSize: '0.6rem', borderCollapse: 'collapse'}}>
            <thead style={{position: 'sticky', top: 0, background: C.bg3}}>
              <tr style={{borderBottom: `2px solid ${C.border}`}}>
                <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>REF</th>
                <th style={{padding: '6px', textAlign: 'left', color: C.teal2}}>DESCRIPCIÓN</th>
                <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>PDF €</th>
                <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>DB €</th>
                <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>DIFER. €</th>
                <th style={{padding: '6px', textAlign: 'right', color: C.teal2}}>%</th>
              </tr>
            </thead>
            <tbody>
              {productosComparados.map(p => (
                <tr key={p.ref} style={{borderBottom: `1px solid ${C.border}`, background: p.esAhorro ? C.green3 + '10' : C.bg3}}>
                  <td style={{padding: '4px', color: C.teal2, fontWeight: 'bold'}}>{p.ref}</td>
                  <td style={{padding: '4px', color: C.text, fontSize: '0.55rem'}}>{p.desc.substring(0, 30)}</td>
                  <td style={{padding: '4px', textAlign: 'right', color: C.yellow}}>{fmt(p.pdfPrecio)}</td>
                  <td style={{padding: '4px', textAlign: 'right', color: C.green2}}>{fmt(p.supaPrecio)}</td>
                  <td style={{padding: '4px', textAlign: 'right', color: p.esAhorro ? C.green2 : C.orange, fontWeight: 'bold'}}>
                    {p.esAhorro ? '-' : '+'}{fmt(Math.abs(parseFloat(p.diferencia)))}
                  </td>
                  <td style={{padding: '4px', textAlign: 'right', color: p.esAhorro ? C.green2 : C.orange, fontWeight: 'bold'}}>
                    {p.esAhorro ? '-' : '+'}{p.pctDiferencia}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCTOS SOLO EN PDF */}
      {soloPDF.length > 0 && (
        <div style={{marginBottom: '20px', background: C.bg3, padding: '12px', borderRadius: '8px', border: `1px solid ${C.yellow}`}}>
          <h4 style={{color: C.yellow, margin: '0 0 12px 0', fontSize: '0.75rem'}}>📄 Solo en PDF ({soloPDF.length} productos)</h4>
          <div style={{fontSize: '0.65rem', maxHeight: '200px', overflowY: 'auto'}}>
            {soloPDF.map(p => (
              <div key={p.ref} style={{padding: '4px', borderBottom: `1px solid ${C.border}`, color: C.text}}>
                <span style={{color: C.teal2, fontWeight: 'bold'}}>{p.ref}</span> - {p.desc.substring(0, 40)} <span style={{color: C.yellow, float: 'right'}}>{fmt(p.importe)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
