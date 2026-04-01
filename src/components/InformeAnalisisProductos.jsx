import React, { useMemo } from 'react'
import productosElectrostockPDF from '../data/ELECTROSTOCK_PRESUPUESTO_FINAL.json'
import productosClimen from '../data/CLIMEN_PRODUCTOS.json'

const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  yellow: "#f5c518", red: "#e85050", orange: "#f97316",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b"
}

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

export default function InformeAnalisisProductos() {
  // Datos de todos los proveedores
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

  const electrostockData = productosElectrostockPDF.map(p => ({
    ref: p.ref,
    desc: p.desc,
    precio: p.precio,
    proveedor: 'ELECTROSTOCK'
  }))

  const climenData = productosClimen.map(p => ({
    ref: p.ref,
    desc: p.desc,
    precio: p.precio,
    proveedor: 'ECLIMEN'
  }))

  const todosProductos = [
    ...electrostockData,
    ...proincoData,
    ...cotoData,
    ...recaData,
    ...climenData
  ]

  // Análisis
  const analisis = useMemo(() => {
    if (!todosProductos.length) return null

    const proveedores = {}
    const productos = {}
    let totalPrecio = 0

    todosProductos.forEach(p => {
      const prov = p.proveedor
      totalPrecio += p.precio

      // Por proveedor
      if (!proveedores[prov]) {
        proveedores[prov] = {
          nombre: prov,
          cantidad: 0,
          total: 0,
          min: Infinity,
          max: 0,
          precios: []
        }
      }
      proveedores[prov].cantidad++
      proveedores[prov].total += p.precio
      proveedores[prov].min = Math.min(proveedores[prov].min, p.precio)
      proveedores[prov].max = Math.max(proveedores[prov].max, p.precio)
      proveedores[prov].precios.push(p.precio)

      // Por producto único (ref)
      if (!productos[p.ref]) {
        productos[p.ref] = {
          ref: p.ref,
          desc: p.desc,
          precios: {}
        }
      }
      productos[p.ref].precios[prov] = p.precio
    })

    // Calcular promedios
    Object.keys(proveedores).forEach(prov => {
      const data = proveedores[prov]
      data.promedio = data.total / data.cantidad
    })

    // Ordenar por promedio
    const proveedoresArray = Object.values(proveedores).sort((a, b) => a.promedio - b.promedio)
    const precioMasBarato = proveedoresArray[0].promedio

    // Calcular incrementos
    const proveedoresConIncremento = proveedoresArray.map(prov => ({
      ...prov,
      incremento: prov.promedio - precioMasBarato,
      porcentajeIncremento: precioMasBarato > 0 ? ((prov.promedio - precioMasBarato) / precioMasBarato) * 100 : 0
    }))

    // Top 5 más caros y más baratos
    const productosArray = Object.values(productos)
    const top5MasCaros = productosArray.sort((a, b) => Math.max(...Object.values(b.precios)) - Math.max(...Object.values(a.precios))).slice(0, 5)
    const top5MasBaratos = productosArray.sort((a, b) => Math.min(...Object.values(a.precios)) - Math.min(...Object.values(b.precios))).slice(0, 5)

    return {
      totalProductos: todosProductos.length,
      totalProveedores: Object.keys(proveedores).length,
      precioPromedio: totalPrecio / todosProductos.length,
      precioMax: Math.max(...todosProductos.map(p => p.precio)),
      precioMin: Math.min(...todosProductos.map(p => p.precio)),
      proveedores: proveedoresConIncremento,
      top5MasCaros,
      top5MasBaratos
    }
  }, [])

  if (!analisis) return <div style={{ padding: 20, color: C.muted }}>Cargando análisis...</div>

  return (
    <div style={{ padding: 20 }}>
      {/* TÍTULO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: '1.8rem' }}>📊</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.text, margin: 0 }}>Informe de Análisis de Productos</h1>
      </div>

      {/* KPIs GLOBALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>📦 Total Productos</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.teal2 }}>{analisis.totalProductos}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>🏢 Proveedores</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.green2 }}>{analisis.totalProveedores}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>💰 Promedio</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.yellow }}>{fmt(analisis.precioPromedio)}</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>📈 Rango</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text }}>
            {fmt(analisis.precioMin)} - {fmt(analisis.precioMax)}
          </div>
        </div>
      </div>

      {/* ANÁLISIS POR PROVEEDOR */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontFamily: 'monospace' }}>
          💵 ANÁLISIS COMPARATIVO DE PROVEEDORES
        </h2>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
            <thead>
              <tr style={{ background: C.bg3 }}>
                <th style={{ padding: '9px', textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Proveedor</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Productos</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Precio Min</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Precio Max</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Promedio</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>Incremento</th>
                <th style={{ padding: '9px', textAlign: 'right', color: C.muted, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>%</th>
              </tr>
            </thead>
            <tbody>
              {analisis.proveedores.map((prov, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '9px', fontWeight: 600, color: prov.porcentajeIncremento === 0 ? C.green2 : C.text }}>
                    {prov.porcentajeIncremento === 0 ? '🏆 ' : ''}{prov.nombre}
                  </td>
                  <td style={{ padding: '9px', textAlign: 'right', color: C.muted }}>{prov.cantidad}</td>
                  <td style={{ padding: '9px', textAlign: 'right', color: C.yellow, fontWeight: 600 }}>{fmt(prov.min)}</td>
                  <td style={{ padding: '9px', textAlign: 'right', color: C.red, fontWeight: 600 }}>{fmt(prov.max)}</td>
                  <td style={{ padding: '9px', textAlign: 'right', color: prov.porcentajeIncremento === 0 ? C.green2 : C.text, fontWeight: 700 }}>{fmt(prov.promedio)}</td>
                  <td style={{ padding: '9px', textAlign: 'right', color: prov.incremento > 0 ? C.red : C.green2, fontWeight: 700 }}>
                    {prov.incremento > 0 ? '+' : ''}{fmt(prov.incremento)}
                  </td>
                  <td style={{ padding: '9px', textAlign: 'right', color: prov.porcentajeIncremento > 0 ? C.red : C.green2, fontWeight: 700 }}>
                    {prov.porcentajeIncremento > 0 ? '+' : ''}{prov.porcentajeIncremento.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP 5 MÁS CAROS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontFamily: 'monospace' }}>
          ⬆️ TOP 5 PRODUCTOS MÁS CAROS
        </h2>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          {analisis.top5MasCaros.map((prod, idx) => {
            const precioMax = Math.max(...Object.values(prod.precios))
            return (
              <div key={idx} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, marginBottom: 4 }}>
                  {idx + 1}. {prod.desc.substring(0, 50)}
                </div>
                <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: 4 }}>Ref: {prod.ref}</div>
                <div style={{ fontSize: '0.7rem', color: C.red, fontWeight: 700 }}>Precio máximo: {fmt(precioMax)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* TOP 5 MÁS BARATOS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontFamily: 'monospace' }}>
          ⬇️ TOP 5 PRODUCTOS MÁS BARATOS
        </h2>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          {analisis.top5MasBaratos.map((prod, idx) => {
            const precioMin = Math.min(...Object.values(prod.precios))
            return (
              <div key={idx} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, marginBottom: 4 }}>
                  {idx + 1}. {prod.desc.substring(0, 50)}
                </div>
                <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: 4 }}>Ref: {prod.ref}</div>
                <div style={{ fontSize: '0.7rem', color: C.green2, fontWeight: 700 }}>Precio mínimo: {fmt(precioMin)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CONCLUSIONES */}
      <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.yellow, marginBottom: 12 }}>📌 CONCLUSIONES</div>
        <div style={{ fontSize: '0.7rem', color: C.muted, lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>
            ✓ <span style={{ color: C.text }}>Proveedor más económico:</span> {analisis.proveedores[0].nombre} con promedio de {fmt(analisis.proveedores[0].promedio)}
          </div>
          <div style={{ marginBottom: 8 }}>
            ✓ <span style={{ color: C.text }}>Proveedor más caro:</span> {analisis.proveedores[analisis.proveedores.length - 1].nombre} con {analisis.proveedores[analisis.proveedores.length - 1].porcentajeIncremento.toFixed(1)}% de incremento
          </div>
          <div>
            ✓ <span style={{ color: C.text }}>Rango de precios:</span> desde {fmt(analisis.precioMin)} a {fmt(analisis.precioMax)} (diferencia de {fmt(analisis.precioMax - analisis.precioMin)})
          </div>
        </div>
      </div>
    </div>
  )
}
