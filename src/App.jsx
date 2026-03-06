import { useState, useEffect } from "react";

const COLORS = {
  bg: "#050e08", bg2: "#0a1a0f", bg3: "#0f2418",
  green: "#00e87a", green2: "#00b85e", green3: "#005f30",
  yellow: "#f5e642", red: "#ff4d4d", text: "#e8f5ec",
  muted: "#5a8069", border: "#1a3d28", card: "#0c1e13",
};

const styles = {
  app: { background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Syne', sans-serif", position: "relative" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px", borderBottom: `1px solid ${COLORS.border}`, background: "rgba(5,14,8,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 36, height: 36, background: COLORS.green, clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center" },
  nav: { display: "flex", gap: 4, background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 4 },
  navBtn: (active) => ({ background: active ? COLORS.green3 : "transparent", color: active ? COLORS.green : COLORS.muted, border: `1px solid ${active ? COLORS.green3 : "transparent"}`, padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 0.2s", whiteSpace: "nowrap" }),
  main: { padding: "28px 32px" },
  sectionTitle: { fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.green, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 },
  card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 22 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 26 },
  grid5: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 26 },
  kpiCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" },
  kpiLabel: { fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 },
  kpiValue: (c) => ({ fontSize: "2rem", fontWeight: 800, color: c || COLORS.text, letterSpacing: "-0.03em", lineHeight: 1 }),
  kpiDelta: { fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", marginTop: 6 },
  badge: (type) => {
    const map = { ok: { bg: "rgba(0,232,122,0.12)", c: COLORS.green }, warn: { bg: "rgba(245,230,66,0.12)", c: COLORS.yellow }, danger: { bg: "rgba(255,77,77,0.12)", c: COLORS.red } };
    const s = map[type] || map.ok;
    return { background: s.bg, color: s.c, border: `1px solid ${s.c}30`, padding: "2px 8px", borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em" };
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${COLORS.border}` },
  td: { padding: "10px 12px", fontSize: "0.83rem", borderBottom: `1px solid ${COLORS.border}20` },
  input: { background: COLORS.bg3, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "7px 12px", borderRadius: 6, fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", width: "100%", outline: "none" },
  btn: (variant) => {
    const v = { primary: { bg: COLORS.green, c: COLORS.bg }, ghost: { bg: "transparent", c: COLORS.green, border: `1px solid ${COLORS.green3}` }, danger: { bg: "rgba(255,77,77,0.1)", c: COLORS.red, border: `1px solid rgba(255,77,77,0.3)` } }[variant] || {};
    return { background: v.bg || COLORS.green3, color: v.c || COLORS.green, border: v.border || "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", transition: "opacity 0.2s" };
  },
  dot: (type) => { const c = { active: COLORS.green, pending: COLORS.yellow, issue: COLORS.red }[type] || COLORS.muted; return { width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: type === "active" ? `0 0 6px ${c}` : "none", display: "inline-block", marginRight: 6 }; },
  progressBar: (pct, c) => ({ height: 6, borderRadius: 3, background: COLORS.bg3, overflow: "hidden", position: "relative", flex: 1 }),
  progressFill: (pct, c) => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct > 90 ? COLORS.red : pct > 70 ? COLORS.yellow : c || COLORS.green, borderRadius: 3, transition: "width 0.8s" }),
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const initProjects = [
  { id: "PV-MAD-01", nombre: "Planta Solar Madrid Norte", cliente: "Grupo Energía XXI", estado: "active", presupuesto: 142000, gastado: 98400, facturado: 85000, margen: 28, fase: "Instalación 60%", pm: "Carlos M." },
  { id: "PV-SEV-03", nombre: "Autoconsumo Industrial Sevilla", cliente: "Metales Díaz S.L.", estado: "active", presupuesto: 67000, gastado: 71200, facturado: 54000, margen: -6, fase: "Revisión costes", pm: "Ana L." },
  { id: "PV-VAL-07", nombre: "Parque FV Valencia Este", cliente: "Ayto. Valencia", estado: "pending", presupuesto: 310000, gastado: 12800, facturado: 0, margen: 31, fase: "Ingeniería", pm: "Pedro R." },
  { id: "BAT-BCN-02", nombre: "BESS Almacenamiento BCN", cliente: "Distribuidora Catalana", estado: "active", presupuesto: 89000, gastado: 44500, facturado: 44500, margen: 22, fase: "Montaje 50%", pm: "Laura G." },
  { id: "PV-BIL-05", nombre: "Cubierta Industrial Bilbao", cliente: "Talleres Aranzábal", estado: "issue", presupuesto: 38000, gastado: 41200, facturado: 19000, margen: -8, fase: "Parado - permiso", pm: "Jon A." },
];

const initStock = [
  { id: 1, ref: "PNL-MON-540W", nombre: "Panel Monocristalino 540W", marca: "Jinko Tiger", categoria: "Equipos", qty: 340, qtyMin: 100, unidad: "und", precioUnit: 95, ubicacion: "A-01", proyecto: "PV-MAD-01" },
  { id: 2, ref: "INV-HUW-10K", nombre: "Inversor Huawei 10kW", marca: "Huawei SUN", categoria: "Equipos", qty: 8, qtyMin: 5, unidad: "und", precioUnit: 1850, ubicacion: "B-03", proyecto: "PV-SEV-03" },
  { id: 3, ref: "BAT-PIL-14KWH", nombre: "Batería Pylontech 14kWh", marca: "Pylontech", categoria: "Equipos", qty: 12, qtyMin: 4, unidad: "und", precioUnit: 2100, ubicacion: "B-05", proyecto: "BAT-BCN-02" },
  { id: 4, ref: "CAB-DC-6MM", nombre: "Cable DC 6mm² Solar", marca: "Prysmian", categoria: "Cableado", qty: 420, qtyMin: 500, unidad: "m", precioUnit: 1.8, ubicacion: "C-10", proyecto: "-" },
  { id: 5, ref: "CTD-BID-3F", nombre: "Contador Bidireccional 3F", marca: "Circutor", categoria: "Medida", qty: 34, qtyMin: 10, unidad: "und", precioUnit: 185, ubicacion: "D-02", proyecto: "-" },
  { id: 6, ref: "EST-ALU-L3", nombre: "Estructura Aluminio L3", marca: "K2 Systems", categoria: "Estructura", qty: 85, qtyMin: 30, unidad: "und", precioUnit: 42, ubicacion: "EXT-01", proyecto: "PV-VAL-07" },
  { id: 7, ref: "PRO-DC-1000V", nombre: "Protecciones DC 1000V", marca: "Schneider", categoria: "Seguridad", qty: 3, qtyMin: 15, unidad: "und", precioUnit: 68, ubicacion: "D-04", proyecto: "-" },
];

const initGastos = [
  { id: 1, proyecto: "PV-MAD-01", categoria: "Material", descripcion: "Paneles + Inversores", fecha: "2025-11-10", importe: 52000, estado: "pagado" },
  { id: 2, proyecto: "PV-MAD-01", categoria: "Mano de obra", descripcion: "Equipo instalación 3 sem.", fecha: "2025-11-28", importe: 18400, estado: "pagado" },
  { id: 3, proyecto: "PV-MAD-01", categoria: "Subcontrata", descripcion: "Legalización y tramitación", fecha: "2025-12-05", importe: 8200, estado: "pagado" },
  { id: 4, proyecto: "PV-MAD-01", categoria: "Transporte", descripcion: "Fletes material", fecha: "2025-12-12", importe: 4800, estado: "pendiente" },
  { id: 5, proyecto: "PV-SEV-03", categoria: "Material", descripcion: "Estructura + BOS", fecha: "2025-10-15", importe: 28500, estado: "pagado" },
  { id: 6, proyecto: "PV-SEV-03", categoria: "Mano de obra", descripcion: "Equipo + horas extra", fecha: "2025-11-20", importe: 22700, estado: "pagado" },
  { id: 7, proyecto: "BAT-BCN-02", categoria: "Material", descripcion: "Baterías Pylontech", fecha: "2025-12-01", importe: 25200, estado: "pagado" },
  { id: 8, proyecto: "BAT-BCN-02", categoria: "Mano de obra", descripcion: "Técnicos especialistas", fecha: "2025-12-18", importe: 9800, estado: "pendiente" },
];

const initPartes = [
  { id: 1, proyecto: "PV-MAD-01", tecnico: "Carlos M.", fecha: "2026-01-08", horas: 8, material: "Paneles x40, cable 80m", incidencia: "", estado: "aprobado" },
  { id: 2, proyecto: "PV-MAD-01", tecnico: "Pedro R.", fecha: "2026-01-09", horas: 7.5, material: "Inversores x2", incidencia: "", estado: "aprobado" },
  { id: 3, proyecto: "PV-SEV-03", tecnico: "Ana L.", fecha: "2026-01-10", horas: 6, material: "Cable DC 60m", incidencia: "Retraso por lluvia", estado: "pendiente" },
  { id: 4, proyecto: "BAT-BCN-02", tecnico: "Laura G.", fecha: "2026-01-11", horas: 9, material: "Batería x3", incidencia: "", estado: "aprobado" },
  { id: 5, proyecto: "PV-BIL-05", tecnico: "Jon A.", fecha: "2026-01-12", horas: 4, material: "Ninguno", incidencia: "Obra parada - espera permiso municipal", estado: "revision" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat("es-ES").format(n);
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, color, delta, deltaOk, sub }) {
  return (
    <div style={{ ...styles.kpiCard, transition: "transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color || COLORS.green}, transparent)` }} />
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue(color)}>{value}</div>
      {delta && <div style={{ ...styles.kpiDelta, color: deltaOk ? COLORS.green : COLORS.red }}>{deltaOk ? "↑" : "↓"} {delta}</div>}
      {sub && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
function STitle({ children }) {
  return (
    <div style={styles.sectionTitle}>
      <span>// {children}</span>
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
    </div>
  );
}

// ─── TAB: DASHBOARD ──────────────────────────────────────────────────────────
function TabDashboard({ projects, stock, gastos, partes }) {
  const totalPresup = projects.reduce((s, p) => s + p.presupuesto, 0);
  const totalGastado = projects.reduce((s, p) => s + p.gastado, 0);
  const totalFacturado = projects.reduce((s, p) => s + p.facturado, 0);
  const margenMedio = Math.round(projects.reduce((s, p) => s + p.margen, 0) / projects.length);
  const enRiesgo = projects.filter(p => p.margen < 0).length;
  const stockBajo = stock.filter(s => s.qty < s.qtyMin).length;
  const stockValor = stock.reduce((s, i) => s + i.qty * i.precioUnit, 0);
  const pendientes = partes.filter(p => p.estado === "pendiente" || p.estado === "revision").length;

  const meses = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb"];
  const facturacion = [38000, 52000, 67000, 85000, 94000, totalFacturado];
  const costes = [31000, 44000, 58000, 74000, 82000, totalGastado];
  const maxVal = Math.max(...facturacion, ...costes);

  return (
    <div>
      <STitle>KPIs Globales</STitle>
      <div style={styles.grid5}>
        <KpiCard label="Presupuesto Total" value={fmt(totalPresup)} color={COLORS.green} delta="3 proyectos activos" deltaOk />
        <KpiCard label="Coste Ejecutado" value={fmt(totalGastado)} color={COLORS.yellow} sub={`${pct(totalGastado, totalPresup)}% del presupuesto`} />
        <KpiCard label="Facturado" value={fmt(totalFacturado)} color={COLORS.green} delta="+12% vs mes ant." deltaOk />
        <KpiCard label="Margen Medio" value={`${margenMedio}%`} color={margenMedio > 15 ? COLORS.green : margenMedio > 0 ? COLORS.yellow : COLORS.red} delta={`${enRiesgo} proy. en pérdida`} deltaOk={enRiesgo === 0} />
        <KpiCard label="Stock Valorado" value={fmt(stockValor)} color={COLORS.yellow} delta={`${stockBajo} refs. bajo mínimo`} deltaOk={stockBajo === 0} />
      </div>

      <div style={styles.grid2}>
        {/* Evolución facturación */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Evolución Facturación vs Coste
            <span style={styles.badge("ok")}>Últimos 6M</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
            {meses.map((m, i) => {
              const hF = (facturacion[i] / maxVal) * 120;
              const hC = (costes[i] / maxVal) * 120;
              return (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120 }}>
                    <div style={{ width: 14, height: hF, background: COLORS.green, borderRadius: "3px 3px 0 0", opacity: 0.9 }} title={fmt(facturacion[i])} />
                    <div style={{ width: 14, height: hC, background: COLORS.yellow, borderRadius: "3px 3px 0 0", opacity: 0.7 }} title={fmt(costes[i])} />
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: COLORS.muted }}>{m}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: COLORS.muted }}><div style={{ width: 10, height: 10, background: COLORS.green, borderRadius: 2 }} /> Facturación</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: COLORS.muted }}><div style={{ width: 10, height: 10, background: COLORS.yellow, borderRadius: 2 }} /> Costes</div>
          </div>
        </div>

        {/* Proyectos margen */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            Margen por Proyecto <span style={styles.badge(enRiesgo > 0 ? "danger" : "ok")}>{enRiesgo > 0 ? `${enRiesgo} en pérdida` : "todo ok"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 5 }}>
                  <span style={{ color: COLORS.text }}>{p.id}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", color: p.margen < 0 ? COLORS.red : p.margen < 15 ? COLORS.yellow : COLORS.green }}>{p.margen}%</span>
                </div>
                <div style={styles.progressBar(p.margen)}>
                  <div style={styles.progressFill(Math.max(p.margen + 10, 0) * 2.5)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.grid3}>
        {/* Resumen proyectos */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Estado Proyectos</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["ID", "Proyecto", "Fase", "Margen"].map(h => <th key={h} style={styles.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: COLORS.muted }}>{p.id}</td>
                  <td style={styles.td}><span style={styles.dot(p.estado)} />{p.nombre.split(" ").slice(0, 3).join(" ")}</td>
                  <td style={{ ...styles.td, fontSize: "0.72rem", color: COLORS.muted }}>{p.fase}</td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", color: p.margen < 0 ? COLORS.red : COLORS.green }}>{p.margen}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            Alertas Activas <span style={styles.badge("danger")}>{stockBajo + enRiesgo + pendientes}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {enRiesgo > 0 && <div style={{ background: "rgba(255,77,77,0.07)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 8, padding: 12, fontSize: "0.78rem" }}><div style={{ color: COLORS.red, fontWeight: 700, marginBottom: 4 }}>⚠ Proyectos con margen negativo</div><div style={{ color: COLORS.muted }}>{projects.filter(p => p.margen < 0).map(p => p.id).join(", ")}</div></div>}
            {stockBajo > 0 && <div style={{ background: "rgba(245,230,66,0.07)", border: "1px solid rgba(245,230,66,0.2)", borderRadius: 8, padding: 12, fontSize: "0.78rem" }}><div style={{ color: COLORS.yellow, fontWeight: 700, marginBottom: 4 }}>📦 Stock bajo mínimo</div><div style={{ color: COLORS.muted }}>{stock.filter(s => s.qty < s.qtyMin).map(s => s.ref).join(", ")}</div></div>}
            {pendientes > 0 && <div style={{ background: "rgba(0,184,94,0.07)", border: `1px solid ${COLORS.green3}`, borderRadius: 8, padding: 12, fontSize: "0.78rem" }}><div style={{ color: COLORS.green, fontWeight: 700, marginBottom: 4 }}>📋 Partes pendientes revisión</div><div style={{ color: COLORS.muted }}>{pendientes} partes de trabajo en cola</div></div>}
          </div>
        </div>

        {/* Caja forecast */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Forecast Caja</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: COLORS.green, letterSpacing: "-0.03em" }}>{fmt(totalFacturado - totalGastado)}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.muted, marginBottom: 18 }}>RESULTADO OPERATIVO ACTUAL</div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}><span style={{ color: COLORS.muted }}>Pendiente cobrar</span><span style={{ fontFamily: "'Space Mono',monospace" }}>{fmt(totalPresup - totalFacturado)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}><span style={{ color: COLORS.muted }}>Costes pendientes</span><span style={{ fontFamily: "'Space Mono',monospace", color: COLORS.red }}>- {fmt(totalPresup - totalGastado)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}><span style={{ color: COLORS.muted }}>Margen potencial</span><span style={{ fontFamily: "'Space Mono',monospace", color: COLORS.green }}>{fmt(totalPresup * 0.22)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: STOCK ───────────────────────────────────────────────────────────────
function TabStock({ stock, setStock }) {
  const [showForm, setShowForm] = useState(false);
  const [movimiento, setMovimiento] = useState({ stockId: "", tipo: "entrada", qty: "", nota: "" });
  const [filtro, setFiltro] = useState("all");
  const [form, setForm] = useState({ ref: "", nombre: "", marca: "", categoria: "Equipos", qty: "", qtyMin: "", unidad: "und", precioUnit: "", ubicacion: "", proyecto: "-" });

  const categorias = ["Todos", ...new Set(stock.map(s => s.categoria))];
  const filtered = filtro === "all" || filtro === "Todos" ? stock : stock.filter(s => s.categoria === filtro);
  const stockBajo = stock.filter(s => s.qty < s.qtyMin);
  const valorTotal = stock.reduce((s, i) => s + i.qty * i.precioUnit, 0);

  const handleMovimiento = () => {
    if (!movimiento.stockId || !movimiento.qty) return;
    setStock(prev => prev.map(s => {
      if (s.id !== parseInt(movimiento.stockId)) return s;
      const delta = movimiento.tipo === "entrada" ? parseInt(movimiento.qty) : -parseInt(movimiento.qty);
      return { ...s, qty: Math.max(0, s.qty + delta) };
    }));
    setMovimiento({ stockId: "", tipo: "entrada", qty: "", nota: "" });
  };

  const handleAddItem = () => {
    if (!form.ref || !form.nombre) return;
    setStock(prev => [...prev, { ...form, id: Date.now(), qty: parseInt(form.qty) || 0, qtyMin: parseInt(form.qtyMin) || 0, precioUnit: parseFloat(form.precioUnit) || 0 }]);
    setForm({ ref: "", nombre: "", marca: "", categoria: "Equipos", qty: "", qtyMin: "", unidad: "und", precioUnit: "", ubicacion: "", proyecto: "-" });
    setShowForm(false);
  };

  const handleDelete = (id) => setStock(prev => prev.filter(s => s.id !== id));

  return (
    <div>
      <div style={styles.grid4}>
        <KpiCard label="Referencias" value={fmtNum(stock.length)} color={COLORS.green} />
        <KpiCard label="Valor Total Almacén" value={fmt(valorTotal)} color={COLORS.yellow} />
        <KpiCard label="Bajo Mínimo" value={stockBajo.length} color={stockBajo.length > 0 ? COLORS.red : COLORS.green} delta={stockBajo.length > 0 ? "Reposición urgente" : "Stock OK"} deltaOk={stockBajo.length === 0} />
        <KpiCard label="Inmovilizado +90d" value={fmt(18500)} color={COLORS.red} sub="Reasignar o liquidar" />
      </div>

      {stockBajo.length > 0 && (
        <div style={{ background: "rgba(255,77,77,0.07)", border: "1px solid rgba(255,77,77,0.25)", borderRadius: 10, padding: 16, marginBottom: 22, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: COLORS.red, fontWeight: 700, fontSize: "0.82rem" }}>⚠ STOCK BAJO MÍNIMO:</span>
          {stockBajo.map(s => <span key={s.id} style={styles.badge("danger")}>{s.ref} · {s.qty} {s.unidad}</span>)}
        </div>
      )}

      <div style={styles.grid2}>
        {/* Movimiento rápido */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Registrar Movimiento</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...styles.btn(movimiento.tipo === "entrada" ? "primary" : "ghost"), flex: 1 }} onClick={() => setMovimiento(p => ({ ...p, tipo: "entrada" }))}>↑ Entrada</button>
              <button style={{ ...styles.btn(movimiento.tipo === "salida" ? "danger" : "ghost"), flex: 1 }} onClick={() => setMovimiento(p => ({ ...p, tipo: "salida" }))}>↓ Salida</button>
            </div>
            <select style={styles.input} value={movimiento.stockId} onChange={e => setMovimiento(p => ({ ...p, stockId: e.target.value }))}>
              <option value="">— Seleccionar material —</option>
              {stock.map(s => <option key={s.id} value={s.id}>{s.ref} · {s.nombre} ({s.qty} {s.unidad})</option>)}
            </select>
            <input style={styles.input} placeholder="Cantidad" type="number" value={movimiento.qty} onChange={e => setMovimiento(p => ({ ...p, qty: e.target.value }))} />
            <input style={styles.input} placeholder="Nota / Proyecto destino" value={movimiento.nota} onChange={e => setMovimiento(p => ({ ...p, nota: e.target.value }))} />
            <button style={styles.btn("primary")} onClick={handleMovimiento}>Confirmar Movimiento</button>
          </div>
        </div>

        {/* Distribución por categoría */}
        <div style={styles.card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Valor por Categoría</div>
          {["Equipos", "Cableado", "Medida", "Estructura", "Seguridad"].map(cat => {
            const val = stock.filter(s => s.categoria === cat).reduce((a, b) => a + b.qty * b.precioUnit, 0);
            const p = Math.round((val / valorTotal) * 100);
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 4 }}>
                  <span>{cat}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace" }}>{fmt(val)} <span style={{ color: COLORS.muted }}>({p}%)</span></span>
                </div>
                <div style={styles.progressBar(p)}><div style={styles.progressFill(p)} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <STitle>Inventario Completo</STitle>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {categorias.map(c => (
            <button key={c} style={styles.navBtn(filtro === c || (filtro === "all" && c === "Todos"))} onClick={() => setFiltro(c === "Todos" ? "all" : c)}>{c}</button>
          ))}
        </div>
        <button style={styles.btn("primary")} onClick={() => setShowForm(!showForm)}>+ Añadir Material</button>
      </div>

      {showForm && (
        <div style={{ ...styles.card, marginBottom: 18, background: "rgba(0,232,122,0.04)", border: `1px solid ${COLORS.green3}` }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Nuevo Material</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 10 }}>
            {[["ref", "Referencia"], ["nombre", "Nombre"], ["marca", "Marca"], ["ubicacion", "Ubicación"]].map(([k, pl]) => (
              <input key={k} style={styles.input} placeholder={pl} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
            <input style={styles.input} placeholder="Cantidad" type="number" value={form.qty} onChange={e => setForm(p => ({ ...p, qty: e.target.value }))} />
            <input style={styles.input} placeholder="Mínimo" type="number" value={form.qtyMin} onChange={e => setForm(p => ({ ...p, qtyMin: e.target.value }))} />
            <input style={styles.input} placeholder="Precio/und €" type="number" value={form.precioUnit} onChange={e => setForm(p => ({ ...p, precioUnit: e.target.value }))} />
            <select style={styles.input} value={form.unidad} onChange={e => setForm(p => ({ ...p, unidad: e.target.value }))}><option>und</option><option>m</option><option>kg</option><option>bobina</option></select>
            <select style={styles.input} value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}>{["Equipos", "Cableado", "Medida", "Estructura", "Seguridad"].map(c => <option key={c}>{c}</option>)}</select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn("primary")} onClick={handleAddItem}>Guardar Material</button>
            <button style={styles.btn("ghost")} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{["Referencia", "Material", "Categoría", "Stock", "Mínimo", "Estado", "Precio", "Valor", "Proyecto", ""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const estado = item.qty === 0 ? "agotado" : item.qty < item.qtyMin ? "bajo" : "ok";
              return (
                <tr key={item.id} onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,232,122,0.03)" }} onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: COLORS.muted }}>{item.ref}</td>
                  <td style={styles.td}><div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{item.nombre}</div><div style={{ fontSize: "0.68rem", color: COLORS.muted }}>{item.marca} · {item.ubicacion}</div></td>
                  <td style={{ ...styles.td, fontSize: "0.72rem" }}>{item.categoria}</td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{fmtNum(item.qty)} <span style={{ color: COLORS.muted, fontSize: "0.65rem" }}>{item.unidad}</span></td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: COLORS.muted }}>{item.qtyMin} {item.unidad}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge(estado === "ok" ? "ok" : estado === "bajo" ? "warn" : "danger") }}>{estado === "ok" ? "OK" : estado === "bajo" ? "BAJO" : "AGOTADO"}</span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.75rem" }}>{fmt(item.precioUnit)}</td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: COLORS.yellow }}>{fmt(item.qty * item.precioUnit)}</td>
                  <td style={{ ...styles.td, fontSize: "0.72rem", color: COLORS.muted }}>{item.proyecto}</td>
                  <td style={styles.td}><button style={styles.btn("danger")} onClick={() => handleDelete(item.id)}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: GASTOS ──────────────────────────────────────────────────────────────
function TabGastos({ projects, gastos, setGastos }) {
  const [proyectoFiltro, setProyectoFiltro] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ proyecto: projects[0].id, categoria: "Material", descripcion: "", fecha: "", importe: "", estado: "pendiente" });

  const filtered = proyectoFiltro === "all" ? gastos : gastos.filter(g => g.proyecto === proyectoFiltro);

  const handleAdd = () => {
    if (!form.descripcion || !form.importe) return;
    setGastos(prev => [...prev, { ...form, id: Date.now(), importe: parseFloat(form.importe) }]);
    setForm({ proyecto: projects[0].id, categoria: "Material", descripcion: "", fecha: "", importe: "", estado: "pendiente" });
    setShowForm(false);
  };

  const toggleEstado = (id) => {
    setGastos(prev => prev.map(g => g.id !== id ? g : { ...g, estado: g.estado === "pagado" ? "pendiente" : "pagado" }));
  };

  const cats = ["Material", "Mano de obra", "Subcontrata", "Transporte", "Varios"];

  return (
    <div>
      <STitle>Gastos por Proyecto · Presupuesto vs Real</STitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 26 }}>
        {projects.slice(0, 3).map(p => {
          const gastosProj = gastos.filter(g => g.proyecto === p.id).reduce((s, g) => s + g.importe, 0);
          const pctGasto = pct(gastosProj, p.presupuesto);
          return (
            <div key={p.id} style={{ ...styles.card, position: "relative", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s", borderColor: proyectoFiltro === p.id ? COLORS.green : COLORS.border }}
              onClick={() => setProyectoFiltro(prev => prev === p.id ? "all" : p.id)}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: COLORS.muted, marginBottom: 6 }}>{p.id}</div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 14 }}>{p.nombre.split(" ").slice(0, 4).join(" ")}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div><div style={{ fontSize: "0.6rem", color: COLORS.muted, marginBottom: 2 }}>PRESUPUESTO</div><div style={{ fontWeight: 800, color: COLORS.green }}>{fmt(p.presupuesto)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: "0.6rem", color: COLORS.muted, marginBottom: 2 }}>EJECUTADO</div><div style={{ fontWeight: 800, color: pctGasto > 100 ? COLORS.red : COLORS.yellow }}>{fmt(gastosProj)}</div></div>
              </div>
              <div style={styles.progressBar(pctGasto)}><div style={styles.progressFill(pctGasto)} /></div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.muted, marginTop: 6, textAlign: "right" }}>{pctGasto}% ejecutado</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 26 }}>
        {projects.slice(3).map(p => {
          const gastosProj = gastos.filter(g => g.proyecto === p.id).reduce((s, g) => s + g.importe, 0);
          const pctGasto = pct(gastosProj, p.presupuesto);
          return (
            <div key={p.id} style={{ ...styles.card, cursor: "pointer", transition: "border-color 0.2s", borderColor: proyectoFiltro === p.id ? COLORS.green : COLORS.border }}
              onClick={() => setProyectoFiltro(prev => prev === p.id ? "all" : p.id)}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: COLORS.muted, marginBottom: 6 }}>{p.id}</div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 14 }}>{p.nombre.split(" ").slice(0, 4).join(" ")}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div><div style={{ fontSize: "0.6rem", color: COLORS.muted, marginBottom: 2 }}>PRESUPUESTO</div><div style={{ fontWeight: 800, color: COLORS.green }}>{fmt(p.presupuesto)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: "0.6rem", color: COLORS.muted, marginBottom: 2 }}>EJECUTADO</div><div style={{ fontWeight: 800, color: pctGasto > 100 ? COLORS.red : COLORS.yellow }}>{fmt(gastosProj)}</div></div>
              </div>
              <div style={styles.progressBar(pctGasto)}><div style={styles.progressFill(pctGasto)} /></div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.muted, marginTop: 6, textAlign: "right" }}>{pctGasto}% ejecutado</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={styles.navBtn(proyectoFiltro === "all")} onClick={() => setProyectoFiltro("all")}>Todos</button>
          {projects.map(p => <button key={p.id} style={styles.navBtn(proyectoFiltro === p.id)} onClick={() => setProyectoFiltro(prev => prev === p.id ? "all" : p.id)}>{p.id}</button>)}
        </div>
        <button style={styles.btn("primary")} onClick={() => setShowForm(!showForm)}>+ Registrar Gasto</button>
      </div>

      {showForm && (
        <div style={{ ...styles.card, marginBottom: 18, background: "rgba(0,232,122,0.04)", border: `1px solid ${COLORS.green3}` }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Nuevo Gasto</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
            <select style={styles.input} value={form.proyecto} onChange={e => setForm(p => ({ ...p, proyecto: e.target.value }))}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
            </select>
            <select style={styles.input} value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <input style={styles.input} placeholder="Descripción" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
            <input style={styles.input} type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} />
            <input style={styles.input} placeholder="Importe €" type="number" value={form.importe} onChange={e => setForm(p => ({ ...p, importe: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn("primary")} onClick={handleAdd}>Guardar Gasto</button>
            <button style={styles.btn("ghost")} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{["Proyecto", "Categoría", "Descripción", "Fecha", "Importe", "Estado", ""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(g => (
              <tr key={g.id} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,122,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: COLORS.muted }}>{g.proyecto}</td>
                <td style={{ ...styles.td, fontSize: "0.75rem" }}>{g.categoria}</td>
                <td style={styles.td}>{g.descripcion}</td>
                <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: COLORS.muted }}>{g.fecha}</td>
                <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: COLORS.yellow }}>{fmt(g.importe)}</td>
                <td style={styles.td}><button style={{ ...styles.badge(g.estado === "pagado" ? "ok" : "warn"), cursor: "pointer", border: "none" }} onClick={() => toggleEstado(g.id)}>{g.estado === "pagado" ? "✓ Pagado" : "Pendiente"}</button></td>
                <td style={styles.td}><button style={styles.btn("danger")} onClick={() => setGastos(prev => prev.filter(x => x.id !== g.id))}>✕</button></td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: COLORS.muted, textAlign: "right" }}>TOTAL FILTRADO →</td>
              <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontWeight: 800, color: COLORS.green, fontSize: "0.95rem" }}>{fmt(filtered.reduce((s, g) => s + g.importe, 0))}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: PARTES ──────────────────────────────────────────────────────────────
function TabPartes({ projects, partes, setPartes }) {
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState("all");
  const [form, setForm] = useState({ proyecto: projects[0].id, tecnico: "", fecha: new Date().toISOString().split("T")[0], horas: "", material: "", incidencia: "", estado: "pendiente" });

  const filtered = filtro === "all" ? partes : partes.filter(p => p.estado === filtro);
  const totalHoras = partes.reduce((s, p) => s + parseFloat(p.horas || 0), 0);
  const pendientes = partes.filter(p => p.estado === "pendiente" || p.estado === "revision").length;
  const conIncidencia = partes.filter(p => p.incidencia && p.incidencia !== "").length;

  const handleAdd = () => {
    if (!form.tecnico || !form.horas) return;
    setPartes(prev => [...prev, { ...form, id: Date.now(), horas: parseFloat(form.horas) }]);
    setForm({ proyecto: projects[0].id, tecnico: "", fecha: new Date().toISOString().split("T")[0], horas: "", material: "", incidencia: "", estado: "pendiente" });
    setShowForm(false);
  };

  const handleEstado = (id, estado) => setPartes(prev => prev.map(p => p.id !== id ? p : { ...p, estado }));

  const estadoConfig = { aprobado: { label: "Aprobado", c: COLORS.green }, pendiente: { label: "Pendiente", c: COLORS.yellow }, revision: { label: "En Revisión", c: COLORS.red } };

  return (
    <div>
      <div style={styles.grid4}>
        <KpiCard label="Partes Registrados" value={partes.length} color={COLORS.green} />
        <KpiCard label="Total Horas" value={`${totalHoras}h`} color={COLORS.yellow} sub="Este período" />
        <KpiCard label="Pendientes Aprobación" value={pendientes} color={pendientes > 0 ? COLORS.red : COLORS.green} delta={pendientes > 0 ? "Revisar hoy" : "Al día"} deltaOk={pendientes === 0} />
        <KpiCard label="Con Incidencia" value={conIncidencia} color={conIncidencia > 0 ? COLORS.yellow : COLORS.green} delta={conIncidencia > 0 ? "Requieren atención" : "Sin incidencias"} deltaOk={conIncidencia === 0} />
      </div>

      {/* Horas por proyecto */}
      <div style={{ ...styles.card, marginBottom: 22 }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Horas Imputadas por Proyecto</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 100 }}>
          {projects.map(p => {
            const horas = partes.filter(x => x.proyecto === p.id).reduce((s, x) => s + x.horas, 0);
            const maxH = Math.max(...projects.map(pr => partes.filter(x => x.proyecto === pr.id).reduce((s, x) => s + x.horas, 0)));
            const h = maxH ? (horas / maxH) * 80 : 0;
            return (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.green }}>{horas}h</div>
                <div style={{ width: "100%", height: h, background: COLORS.green3, borderRadius: "4px 4px 0 0", border: `1px solid ${COLORS.green}40`, minHeight: 4 }} />
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: COLORS.muted, textAlign: "center" }}>{p.id}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "Todos"], ["aprobado", "Aprobados"], ["pendiente", "Pendientes"], ["revision", "En revisión"]].map(([v, l]) => (
            <button key={v} style={styles.navBtn(filtro === v)} onClick={() => setFiltro(v)}>{l}</button>
          ))}
        </div>
        <button style={styles.btn("primary")} onClick={() => setShowForm(!showForm)}>+ Nuevo Parte</button>
      </div>

      {showForm && (
        <div style={{ ...styles.card, marginBottom: 18, background: "rgba(0,232,122,0.04)", border: `1px solid ${COLORS.green3}` }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 14 }}>Nuevo Parte de Trabajo</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
            <select style={styles.input} value={form.proyecto} onChange={e => setForm(p => ({ ...p, proyecto: e.target.value }))}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.id} — {p.nombre.split(" ").slice(0, 3).join(" ")}</option>)}
            </select>
            <input style={styles.input} placeholder="Nombre técnico" value={form.tecnico} onChange={e => setForm(p => ({ ...p, tecnico: e.target.value }))} />
            <input style={styles.input} type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: 10, marginBottom: 14 }}>
            <input style={styles.input} placeholder="Horas trabajadas" type="number" step="0.5" value={form.horas} onChange={e => setForm(p => ({ ...p, horas: e.target.value }))} />
            <input style={styles.input} placeholder="Material usado" value={form.material} onChange={e => setForm(p => ({ ...p, material: e.target.value }))} />
            <input style={styles.input} placeholder="Incidencia (opcional)" value={form.incidencia} onChange={e => setForm(p => ({ ...p, incidencia: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn("primary")} onClick={handleAdd}>Enviar Parte</button>
            <button style={styles.btn("ghost")} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{["Proyecto", "Técnico", "Fecha", "Horas", "Material", "Incidencia", "Estado", "Acciones"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const sc = estadoConfig[p.estado] || estadoConfig.pendiente;
              return (
                <tr key={p.id} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,232,122,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: COLORS.muted }}>{p.proyecto}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{p.tecnico}</td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: COLORS.muted }}>{p.fecha}</td>
                  <td style={{ ...styles.td, fontFamily: "'Space Mono',monospace", color: COLORS.yellow, fontWeight: 700 }}>{p.horas}h</td>
                  <td style={{ ...styles.td, fontSize: "0.78rem", color: COLORS.muted }}>{p.material || "—"}</td>
                  <td style={styles.td}>{p.incidencia ? <span style={{ color: COLORS.red, fontSize: "0.78rem" }}>⚠ {p.incidencia}</span> : <span style={{ color: COLORS.muted, fontSize: "0.75rem" }}>—</span>}</td>
                  <td style={styles.td}><span style={{ color: sc.c, fontFamily: "'Space Mono',monospace", fontSize: "0.65rem" }}>● {sc.label}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.estado !== "aprobado" && <button style={{ ...styles.btn("primary"), padding: "4px 10px", fontSize: "0.6rem" }} onClick={() => handleEstado(p.id, "aprobado")}>✓</button>}
                      {p.estado !== "revision" && <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: "0.6rem" }} onClick={() => handleEstado(p.id, "revision")}>!</button>}
                      <button style={{ ...styles.btn("ghost"), padding: "4px 10px", fontSize: "0.6rem" }} onClick={() => setPartes(prev => prev.filter(x => x.id !== p.id))}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [projects] = useState(initProjects);
  const [stock, setStock] = useState(initStock);
  const [gastos, setGastos] = useState(initGastos);
  const [partes, setPartes] = useState(initPartes);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "stock", label: "Stock" },
    { id: "gastos", label: "Gastos" },
    { id: "partes", label: "Partes de Trabajo" },
  ];

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } select option { background: #0a1a0f; } input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7); }`}</style>

      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="#050e08" width={18}><path d="M12 2L4 7v5c0 5 3.8 9.7 8 11 4.2-1.3 8-6 8-11V7L12 2z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>AFC <span style={{ color: COLORS.green }}>Renovables</span></div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: COLORS.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Control de Gestión · v2.0</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {tabs.map(t => (
            <button key={t.id} style={styles.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: COLORS.green }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.green, animation: "blink 1.4s infinite" }} />
            LIVE
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: COLORS.muted, background: COLORS.bg3, border: `1px solid ${COLORS.border}`, padding: "5px 12px", borderRadius: 4 }}>
            {now.toLocaleDateString("es-ES")} {now.toLocaleTimeString("es-ES")}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {tab === "dashboard" && <TabDashboard projects={projects} stock={stock} gastos={gastos} partes={partes} />}
        {tab === "stock" && <TabStock stock={stock} setStock={setStock} />}
        {tab === "gastos" && <TabGastos projects={projects} gastos={gastos} setGastos={setGastos} />}
        {tab === "partes" && <TabPartes projects={projects} partes={partes} setPartes={setPartes} />}
      </main>

      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "14px 32px", display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: COLORS.muted }}>
        <span>AFC Renovables · Sistema de Gestión · Confidencial</span>
        <span>Generado con Claude · {now.getFullYear()}</span>
      </footer>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );
}
