import { useState, useEffect } from 'react'
import {
  fetchProveedoresRanking,
  fetchTop5Proveedores,
  fetchKPIs,
  fetchProductosPorProveedor
} from '../lib/supabase-compras'
import AlmacenEntradasSalidas from './AlmacenEntradasSalidas'
import ComparadorPreciosProveedores from './ComparadorPreciosProveedores'
import BuscadorProductos from './BuscadorProductos'
import InformeAnalisisProductos from './InformeAnalisisProductos'

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
const fnum = n => new Intl.NumberFormat("es-ES").format(n || 0);

// Componente StatCard reutilizable
function StatCard({ icon, label, value, subtitle, color = C.green2 }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
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
  );
}

// Componente Tab Principal
export default function ProveedoresTab() {
  const [proveedores, setProveedores] = useState([])
  const [top5, setTop5] = useState([])
  const [kpis, setKpis] = useState(null)
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ranking')
  const [paginaActual, setPaginaActual] = useState(1)
  const [productos, setProductos] = useState([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null)
  const [productosLoading, setProductosLoading] = useState(false)
  const [paginaProductos, setPaginaProductos] = useState(1)
  const itemsPorPagina = 15
  const itemsProductosPorPagina = 100

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [rankingRes, top5Res, kpisRes] = await Promise.all([
        fetchProveedoresRanking(),
        fetchTop5Proveedores(),
        fetchKPIs()
      ])

      if (rankingRes.data) setProveedores(rankingRes.data)
      if (top5Res.data) setTop5(top5Res.data)
      if (kpisRes.data) setKpis(kpisRes.data)
    } catch (error) {
      console.error('Error loading providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProductos = async (proveedorId) => {
    setProductosLoading(true)
    try {
      const res = await fetchProductosPorProveedor(proveedorId)
      if (res.data) setProductos(res.data)
    } catch (error) {
      console.error('Error loading productos:', error)
    } finally {
      setProductosLoading(false)
    }
  }

  const handleSelectProveedor = (proveedorId) => {
    setProveedorSeleccionado(proveedorId)
    setPaginaProductos(1)  // Reset a página 1 cuando cambia proveedor
    loadProductos(proveedorId)
  }

  const proveedoresFiltrados = proveedores.filter(p =>
    p.proveedor?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.ranking?.toString().includes(filtro)
  )

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina)
  const inicioReg = (paginaActual - 1) * itemsPorPagina
  const proveedoresPaginados = proveedoresFiltrados.slice(inicioReg, inicioReg + itemsPorPagina)

  return (
    <div>
      {/* TÍTULO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: '1.8rem' }}>🛒</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.text, margin: 0 }}>Análisis de Proveedores 2026</h1>
      </div>

      {/* KPIS */}
      {kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard icon="📦" label="Total Proveedores" value={kpis.total_proveedores || 55} subtitle="proveedores activos" color={C.teal2} />
          <StatCard icon="💰" label="Gasto Total" value={fmt(kpis.gasto_total || 0)} subtitle="todas las compras 2026" color={C.green2} />
          <StatCard icon="📄" label="Total Facturas" value={fnum(kpis.total_facturas || 100)} subtitle="facturas de compra" color={C.accent} />
          <StatCard icon="📊" label="Promedio Factura" value={fmt(kpis.promedio_factura || 0)} subtitle="por transacción" color={C.yellow} />
        </div>
      )}

      {/* TOP 5 PROVEEDORES */}
      {top5.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontFamily: 'monospace' }}>🏆 TOP 5 PROVEEDORES POR GASTO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {top5.map((p, idx) => (
              <div key={p.proveedor_id} style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.bg3;
                e.currentTarget.style.borderColor = C.green3;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.card;
                e.currentTarget.style.borderColor = C.border;
              }}>
                <div style={{ fontSize: '0.65rem', color: C.teal2, fontWeight: 700, fontFamily: 'monospace', marginBottom: 6 }}>#{idx + 1}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, marginBottom: 8 }}>{p.proveedor}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: C.green2, marginBottom: 6 }}>{fmt(p.gasto_total)}</div>
                <div style={{ fontSize: '0.62rem', color: C.muted, marginBottom: 8 }}>{p.facturas} facturas</div>
                <div style={{ height: 4, background: C.bg3, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: C.green2,
                    width: `${(p.gasto_total / top5[0].gasto_total) * 100}%`,
                    borderRadius: 2
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BÚSQUEDA Y TABS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o ranking..."
          value={filtro}
          onChange={e => {
            setFiltro(e.target.value)
            setPaginaActual(1)
          }}
          style={{
            flex: 1,
            minWidth: 250,
            padding: '8px 12px',
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setActiveTab('ranking'); setPaginaActual(1); }}
            style={{
              padding: '6px 12px',
              background: activeTab === 'ranking' ? C.green3 : C.bg3,
              color: activeTab === 'ranking' ? C.green2 : C.muted,
              border: `1px solid ${activeTab === 'ranking' ? C.green3 : C.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            📊 Ranking ({proveedoresFiltrados.length})
          </button>
          <button
            onClick={() => { setActiveTab('buscador'); setPaginaActual(1); }}
            style={{
              padding: '6px 12px',
              background: activeTab === 'buscador' ? C.green3 : C.bg3,
              color: activeTab === 'buscador' ? C.green2 : C.muted,
              border: `1px solid ${activeTab === 'buscador' ? C.green3 : C.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            🔍 Buscador Productos
          </button>
          <button
            onClick={() => { setActiveTab('almacen'); }}
            style={{
              padding: '6px 12px',
              background: activeTab === 'almacen' ? C.green3 : C.bg3,
              color: activeTab === 'almacen' ? C.green2 : C.muted,
              border: `1px solid ${activeTab === 'almacen' ? C.green3 : C.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            📦 Entradas/Salidas
          </button>
          <button
            onClick={() => { setActiveTab('comparador_5_proveedores'); }}
            style={{
              padding: '6px 12px',
              background: activeTab === 'comparador_5_proveedores' ? C.green3 : C.bg3,
              color: activeTab === 'comparador_5_proveedores' ? C.green2 : C.muted,
              border: `1px solid ${activeTab === 'comparador_5_proveedores' ? C.green3 : C.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            💰 Comparador 5 Proveedores
          </button>
          <button
            onClick={() => { setActiveTab('informe'); }}
            style={{
              padding: '6px 12px',
              background: activeTab === 'informe' ? C.green3 : C.bg3,
              color: activeTab === 'informe' ? C.green2 : C.muted,
              border: `1px solid ${activeTab === 'informe' ? C.green3 : C.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            📊 Informe Productos
          </button>
        </div>
      </div>

      {/* TABLA DE RANKING */}
      {activeTab === 'ranking' && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.bg3 }}>
              {['Ranking', 'Proveedor', 'Facturas', 'Gasto Total', 'Promedio', 'Mín', 'Máx', 'Última Compra', 'Días'].map(h => (
                <th key={h} style={{
                  fontFamily: 'monospace',
                  fontSize: '0.5rem',
                  color: C.muted,
                  textTransform: 'uppercase',
                  padding: '9px',
                  textAlign: 'left',
                  borderBottom: `1px solid ${C.border}`
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedoresPaginados.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '0.75rem' }}>
                  Sin resultados
                </td>
              </tr>
            ) : (
              proveedoresPaginados.map(p => (
                <tr key={p.proveedor_id}
                  onMouseEnter={e => e.currentTarget.style.background = `${C.green3}14`}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: C.teal2 }}>#{p.ranking}</td>
                  <td style={{ padding: '9px', fontSize: '0.75rem', fontWeight: 500 }}>{p.proveedor}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.muted, textAlign: 'right' }}>{p.num_facturas}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: C.green2, textAlign: 'right' }}>{fmt(p.gasto_total)}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.muted, textAlign: 'right' }}>{fmt(p.promedio_factura)}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.yellow, textAlign: 'right' }}>{fmt(p.factura_minima)}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.orange, textAlign: 'right' }}>{fmt(p.factura_maxima)}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.62rem', color: C.muted }}>{p.ultima_compra ? new Date(p.ultima_compra).toLocaleDateString('es-ES') : '-'}</td>
                  <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.muted, textAlign: 'right' }}>{p.dias_activo || 0}d</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && activeTab === 'ranking' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: C.bg3, borderRadius: 8, flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            style={{
              padding: '6px 12px',
              background: paginaActual === 1 ? C.bg3 : C.green3,
              color: paginaActual === 1 ? C.muted : C.green2,
              border: `1px solid ${paginaActual === 1 ? C.border : C.green3}`,
              borderRadius: 6,
              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            ← Anterior
          </button>
          <div style={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'monospace' }}>
            Página <span style={{ color: C.text, fontWeight: 700 }}>{paginaActual}</span> de <span style={{ color: C.text, fontWeight: 700 }}>{totalPaginas}</span> · ({inicioReg + 1}-{Math.min(inicioReg + itemsPorPagina, proveedoresFiltrados.length)} de {proveedoresFiltrados.length})
          </div>
          <button
            onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
            style={{
              padding: '6px 12px',
              background: paginaActual === totalPaginas ? C.bg3 : C.green3,
              color: paginaActual === totalPaginas ? C.muted : C.green2,
              border: `1px solid ${paginaActual === totalPaginas ? C.border : C.green3}`,
              borderRadius: 6,
              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* SECCIÓN PRODUCTOS POR PROVEEDOR */}
      {activeTab === 'ranking' && (
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, fontFamily: 'monospace' }}>📦 PRODUCTOS POR PROVEEDOR</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Selecciona un proveedor para ver sus productos comprados:</label>
          <select
            value={proveedorSeleccionado || ''}
            onChange={e => {
              const proveedorId = parseInt(e.target.value);
              handleSelectProveedor(proveedorId);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: C.bg2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Selecciona un proveedor --</option>
            {proveedores
              .slice()
              .sort((a, b) => (a.proveedor || '').localeCompare(b.proveedor || '', 'es'))
              .map(p => (
                <option key={p.proveedor_id} value={p.proveedor_id}>
                  {p.proveedor}
                </option>
              ))}
          </select>
        </div>

        {proveedorSeleccionado && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: 'auto', marginBottom: 14 }}>
              <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.bg3 }}>
                    {['Referencia', 'Descripción', 'Cantidad', 'Precio Unit.', 'Importe', 'Descuento', 'Fecha Factura'].map(h => (
                      <th key={h} style={{
                        fontFamily: 'monospace',
                        fontSize: '0.5rem',
                        color: C.muted,
                        textTransform: 'uppercase',
                        padding: '9px',
                        textAlign: 'left',
                        borderBottom: `1px solid ${C.border}`
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productosLoading ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '0.75rem' }}>
                        Cargando productos...
                      </td>
                    </tr>
                  ) : productos.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '0.75rem' }}>
                        Sin productos registrados para este proveedor
                      </td>
                    </tr>
                  ) : (
                    productos.slice((paginaProductos - 1) * itemsProductosPorPagina, paginaProductos * itemsProductosPorPagina).map((prod, idx) => (
                      <tr key={idx}
                        onMouseEnter={e => e.currentTarget.style.background = `${C.green3}14`}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.65rem', color: C.teal2 }}>{prod.ref || '-'}</td>
                        <td style={{ padding: '9px', fontSize: '0.72rem' }}>{prod.descripcion}</td>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.muted, textAlign: 'right' }}>{prod.cantidad}</td>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.yellow, textAlign: 'right', fontWeight: 700 }}>{fmt(prod.precio)}</td>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.green2, textAlign: 'right', fontWeight: 700 }}>{fmt(prod.importe_total)}</td>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.75rem', color: C.orange, textAlign: 'right' }}>{prod.descuento > 0 ? fmt(prod.descuento) : '-'}</td>
                        <td style={{ padding: '9px', fontFamily: 'monospace', fontSize: '0.62rem', color: C.muted }}>{prod.fecha ? new Date(prod.fecha).toLocaleDateString('es-ES') : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {productos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: C.muted, background: C.bg3, padding: '8px 12px', borderRadius: 6, marginTop: 8 }}>
                <span>📊 Mostrando {Math.min((paginaProductos - 1) * itemsProductosPorPagina + 1, productos.length)}-{Math.min(paginaProductos * itemsProductosPorPagina, productos.length)} de {productos.length} productos</span>
                {Math.ceil(productos.length / itemsProductosPorPagina) > 1 && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setPaginaProductos(p => Math.max(1, p - 1))}
                      disabled={paginaProductos === 1}
                      style={{ padding: '4px 8px', background: paginaProductos === 1 ? C.muted + '30' : C.teal, color: 'white', border: 'none', borderRadius: 4, cursor: paginaProductos === 1 ? 'default' : 'pointer', fontSize: '0.65rem' }}>
                      ← Anterior
                    </button>
                    <span style={{ padding: '4px 8px' }}>Página {paginaProductos} de {Math.ceil(productos.length / itemsProductosPorPagina)}</span>
                    <button
                      onClick={() => setPaginaProductos(p => Math.min(Math.ceil(productos.length / itemsProductosPorPagina), p + 1))}
                      disabled={paginaProductos >= Math.ceil(productos.length / itemsProductosPorPagina)}
                      style={{ padding: '4px 8px', background: paginaProductos >= Math.ceil(productos.length / itemsProductosPorPagina) ? C.muted + '30' : C.teal, color: 'white', border: 'none', borderRadius: 4, cursor: paginaProductos >= Math.ceil(productos.length / itemsProductosPorPagina) ? 'default' : 'pointer', fontSize: '0.65rem' }}>
                      Siguiente →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* SECCIÓN BUSCADOR DE PRODUCTOS */}
      {activeTab === 'buscador' && (
        <BuscadorProductos />
      )}

      {/* SECCIÓN ALMACÉN ENTRADAS/SALIDAS */}
      {activeTab === 'almacen' && (
        <AlmacenEntradasSalidas />
      )}

      {/* SECCIÓN COMPARADOR 5 PROVEEDORES */}
      {activeTab === 'comparador_5_proveedores' && (
        <ComparadorPreciosProveedores />
      )}

      {/* SECCIÓN INFORME DE ANÁLISIS */}
      {activeTab === 'informe' && (
        <InformeAnalisisProductos />
      )}
    </div>
  );
}
