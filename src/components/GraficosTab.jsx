import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { fetchAnalisisProveedores, fetchKPIsProveedores } from '../lib/supabase-compras'

// Colores AFC
const C = {
  bg: "#050f0a", bg2: "#081508", bg3: "#0d1f10",
  teal: "#0e7fa3", teal2: "#0d9abf", teal3: "#0a4f65",
  green: "#3da83c", green2: "#52c450", green3: "#1f6b1e",
  greenLeaf: "#4ab83e", accent: "#7ed956",
  yellow: "#f5c518", red: "#e85050", orange: "#f97316",
  text: "#e8f5e9", muted: "#6aad7a", border: "#1a3d20",
  card: "#0a1c0b", white: "#f0faf1",
}

const COLORES = [
  "#0e7fa3", "#52c450", "#f5c518", "#f97316", "#e85050",
  "#7ed956", "#0d9abf", "#3da83c", "#1f6b1e", "#4ab83e"
]

const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)
const fnum = n => new Intl.NumberFormat("es-ES").format(n || 0)

function StatCard({ icon, label, value, subtitle, color = C.green2 }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: 16, display: 'flex', flexDirection: 'column', gap: 8
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 4 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      </div>
    </div>
  )
}

export default function GraficosTab() {
  const [tab, setTab] = useState('proveedores')
  const [analisis, setAnalisis] = useState(null)
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [analisisRes, kpisRes] = await Promise.all([
        fetchAnalisisProveedores(),
        fetchKPIsProveedores()
      ])
      if (analisisRes.data) setAnalisis(analisisRes.data)
      if (kpisRes.data) setKpis(kpisRes.data)
    } catch (error) {
      console.error('Error loading datos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ color: C.text, padding: 20 }}>⏳ Cargando gráficos...</div>
  }

  return (
    <div style={{ padding: 20, background: C.bg, minHeight: '100vh' }}>
      {/* Título */}
      <h2 style={{ color: C.text, marginBottom: 24, fontSize: '1.5rem', fontWeight: 800 }}>
        📊 ANÁLISIS Y GRÁFICOS
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        <button
          onClick={() => setTab('proveedores')}
          style={{
            padding: '8px 16px', background: tab === 'proveedores' ? C.teal : 'transparent',
            color: C.text, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            fontWeight: 600, borderBottom: tab === 'proveedores' ? `2px solid ${C.accent}` : 'none'
          }}>
          🏭 PROVEEDORES
        </button>
        <button
          onClick={() => setTab('clientes')}
          style={{
            padding: '8px 16px', background: tab === 'clientes' ? C.teal : 'transparent',
            color: C.text, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            fontWeight: 600, borderBottom: tab === 'clientes' ? `2px solid ${C.accent}` : 'none'
          }}>
          👥 CLIENTES
        </button>
      </div>

      {/* TAB: PROVEEDORES */}
      {tab === 'proveedores' && kpis && analisis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <StatCard
              icon="💰"
              label="Gasto Total"
              value={fmt(kpis.totalGasto)}
              subtitle={`${fnum(kpis.totalFacturas)} facturas`}
              color={C.yellow}
            />
            <StatCard
              icon="📈"
              label="Factura Promedio"
              value={fmt(kpis.promediaFactura)}
              subtitle="Media de todas las compras"
              color={C.green2}
            />
            <StatCard
              icon="🔝"
              label="Proveedor Más Caro"
              value={kpis.proveedorMasCaro.nombre}
              subtitle={fmt(kpis.proveedorMasCaro.total)}
              color={C.red}
            />
            <StatCard
              icon="📦"
              label="Más Facturas"
              value={kpis.proveedorMasFacturas.nombre}
              subtitle={`${fnum(kpis.proveedorMasFacturas.facturas)} facturas`}
              color={C.teal2}
            />
          </div>

          {/* Gráficos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20 }}>
            {/* Gasto por Proveedor */}
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 16
            }}>
              <h3 style={{ color: C.text, marginBottom: 12, fontSize: '0.9rem', fontWeight: 700 }}>
                💵 GASTO POR PROVEEDOR (Top 10)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analisis.porProveedor.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} />
                  <Tooltip
                    contentStyle={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6 }}
                    formatter={(value) => fmt(value)}
                    labelStyle={{ color: C.text }}
                  />
                  <Bar dataKey="total" fill={C.teal} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Número de Facturas */}
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 16
            }}>
              <h3 style={{ color: C.text, marginBottom: 12, fontSize: '0.9rem', fontWeight: 700 }}>
                📋 FACTURAS POR PROVEEDOR (Top 10)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analisis.porProveedor.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} />
                  <Tooltip
                    contentStyle={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6 }}
                    labelStyle={{ color: C.text }}
                  />
                  <Bar dataKey="facturas" fill={C.green2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolución Temporal */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: 16
          }}>
            <h3 style={{ color: C.text, marginBottom: 12, fontSize: '0.9rem', fontWeight: 700 }}>
              📅 EVOLUCIÓN DE GASTOS POR MES
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analisis.porMes}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="mes" stroke={C.muted} />
                <YAxis stroke={C.muted} />
                <Tooltip
                  contentStyle={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6 }}
                  formatter={(value) => fmt(value)}
                  labelStyle={{ color: C.text }}
                />
                <Line type="monotone" dataKey="total" stroke={C.teal2} strokeWidth={2} dot={{ fill: C.teal, r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de Detalles */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: 16, overflow: 'auto'
          }}>
            <h3 style={{ color: C.text, marginBottom: 12, fontSize: '0.9rem', fontWeight: 700 }}>
              📊 ANÁLISIS DETALLADO POR PROVEEDOR
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: 8, textAlign: 'left', color: C.teal2, fontWeight: 700 }}>PROVEEDOR</th>
                  <th style={{ padding: 8, textAlign: 'right', color: C.teal2, fontWeight: 700 }}>GASTO TOTAL</th>
                  <th style={{ padding: 8, textAlign: 'right', color: C.teal2, fontWeight: 700 }}>FACTURAS</th>
                  <th style={{ padding: 8, textAlign: 'right', color: C.teal2, fontWeight: 700 }}>PROMEDIO</th>
                  <th style={{ padding: 8, textAlign: 'right', color: C.teal2, fontWeight: 700 }}>MÁX</th>
                  <th style={{ padding: 8, textAlign: 'right', color: C.teal2, fontWeight: 700 }}>MÍN</th>
                </tr>
              </thead>
              <tbody>
                {kpis.proveedores.map((prov, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: idx % 2 ? C.bg2 : 'transparent' }}>
                    <td style={{ padding: 8, color: C.text }}>{prov.nombre}</td>
                    <td style={{ padding: 8, textAlign: 'right', color: C.yellow, fontFamily: 'monospace', fontWeight: 700 }}>{fmt(prov.total)}</td>
                    <td style={{ padding: 8, textAlign: 'right', color: C.muted }}>{fnum(prov.facturas)}</td>
                    <td style={{ padding: 8, textAlign: 'right', color: C.green2, fontFamily: 'monospace' }}>{fmt(prov.promedio)}</td>
                    <td style={{ padding: 8, textAlign: 'right', color: C.red, fontFamily: 'monospace' }}>{fmt(prov.mayor)}</td>
                    <td style={{ padding: 8, textAlign: 'right', color: C.muted, fontFamily: 'monospace' }}>{fmt(prov.menor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CLIENTES */}
      {tab === 'clientes' && (
        <div style={{ color: C.text, padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: C.muted }}>
            🚀 Módulo de CLIENTES próximamente...
          </p>
        </div>
      )}
    </div>
  )
}
