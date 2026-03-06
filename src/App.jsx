import { useState, useEffect } from "react";

// ─── CONFIGURACIÓN GOOGLE SHEETS ─────────────────────────────────────────────
// El ID ya está puesto. Solo asegúrate de que el Sheet sea público:
// Archivo → Compartir → "Cualquier persona con el enlace puede VER"

const SHEET_ID = "1UL6PVdrioA2meWvXuw13FuRCgBoNRvDw";

const SHEET_TABS = {
  stock:     "📊 Stock Actual",
  productos: "📦 Maestro Productos",
  proyectos: "📋 Proyectos",
  horas:     "⏱️ Horas MO",
};

async function fetchSheet(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo leer: ${tabName}`);
  const text = await res.text();
  return parseSheetCSV(text);
}

function normalizeKey(h) {
  return h.trim().toLowerCase()
    .replace(/\n/g, " ").replace(/\s+/g, "_")
    .replace(/[€()%º°ªñ]/g, n => n === "ñ" ? "n" : "")
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i").replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_").replace(/^_|_$/g, "");
}

const HEADER_KEYWORDS = ["ref","descripcion","cliente","n_mov","n_proyecto","stock","cantidad","fecha","tecnico","posicion","categoria","nombre","tipo"];

function parseSheetCSV(text) {
  const lines = text.trim().split("\n").map(l => parseCSVLine(l));

  // Busca la fila con más coincidencias con palabras clave de cabecera
  let bestIdx = 0, bestScore = -1;
  lines.forEach((row, i) => {
    if (i > 15) return;
    const normalized = row.map(normalizeKey);
    const score = normalized.filter(k => k.length > 1 && HEADER_KEYWORDS.some(kw => k.includes(kw))).length;
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  });

  const headers = lines[bestIdx].map(normalizeKey);

  return lines.slice(bestIdx + 1)
    .filter(row => row[0] && row[0].trim() !== "" && row[0].trim() !== '\"\"\'')
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { if(h) obj[h] = (row[i] || "").trim().replace(/^"|"$/g, ""); });
      return obj;
    });
}

function parseCSVLine(line) {
  const result = []; let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { result.push(cur); cur = ""; }
    else { cur += c; }
  }
  result.push(cur);
  return result;
}

// ─── MAPEOS (columnas del Sheet → formato de la app) ─────────────────────────
function mapStock(row, i) {
  const qty = parseFloat(row.stock_actual ?? row.cantidad ?? 0);
  const min = parseFloat(row.stock_m_nimo ?? row.stock_minimo ?? 0);
  return {
    id: i + 1,
    ref:       row.ref || `REF-${i}`,
    nombre:    row.descripci_n || row.descripcion || "",
    marca:     row.marca || "",
    categoria: row.categor_a || row.categoria || "General",
    qty,
    qtyMin:    min,
    unidad:    row.unidad || "ud.",
    precioUnit:parseFloat(row.precio_coste__ ?? row.precio_coste ?? 0),
    ubicacion: row.ubicaci_n_almac_n || row.ubicacion || "",
    proyecto:  "-",
  };
}

function mapProducto(row, i) {
  return {
    id: i + 1,
    ref:       row.ref || `REF-${i}`,
    nombre:    row.descripci_n_del_producto || row.descripcion || "",
    marca:     row.marca_fabricante || row.marca || "",
    categoria: row.categor_a || row.categoria || "General",
    qty:       0,
    qtyMin:    parseFloat(row.stock_m_nimo ?? row.stock_minimo ?? 0),
    unidad:    row.unidad || "ud.",
    precioUnit:parseFloat(row.precio_coste__ ?? row.precio_coste ?? 0),
    ubicacion: row.ubicaci_n_almac_n || row.ubicacion || "",
    proyecto:  "-",
  };
}

function mapProyecto(row, i) {
  const pv  = parseFloat(row.precio_venta_total__ ?? 0);
  const ct  = parseFloat(row.coste_total_real__ ?? 0);
  const mb  = pv && ct ? pv - ct : 0;
  const pct = pv ? Math.round((mb / pv) * 100) : 0;
  const estadoMap = { "Completado": "active", "En Ejecución": "active", "En Presupuesto": "pending", "Parado": "issue" };
  return {
    id:          row.n__proyecto || row.proyecto || `PRY-${i}`,
    nombre:      (row.cliente || "") + " · " + (row.tipo_instalaci_n || ""),
    cliente:     row.cliente || "",
    estado:      estadoMap[row.estado] || "active",
    estadoLabel: row.estado || "Activo",
    tipo:        row.tipo_instalaci_n || "",
    equipo:      row.equipo_asignado || "",
    localidad:   row.localidad || "",
    presupuesto: parseFloat(row.ppto__material_estimado__ ?? row.precio_venta_total__ ?? 0),
    gastado:     parseFloat(row.coste_total_real__ ?? 0),
    facturado:   pv,
    margen:      pct,
    fase:        row.estado || "",
    pm:          row.equipo_asignado || "",
  };
}

function mapHoras(row, i) {
  return {
    id:         i + 1,
    proyecto:   row.n__proyecto || "",
    tecnico:    row.t_cnico || row.tecnico || "",
    equipo:     row.equipo || "",
    fecha:      row.fecha || "",
    horas:      parseFloat(row.horas || 0),
    material:   row.concepto || "",
    incidencia: row.observaciones || "",
    estado:     row.observaciones ? "revision" : "aprobado",
  };
}

// ─── DATOS INICIALES (del Excel real) ────────────────────────────────────────
const initStock = [
  { id:1, ref:"SOL-001", nombre:"Panel Solar Monocristalino 400W", marca:"Jinko Solar", categoria:"Placas Solares", qty:70, qtyMin:10, unidad:"Ud.", precioUnit:180, ubicacion:"Nave A - Estante 1", proyecto:"-" },
  { id:2, ref:"SOL-002", nombre:"Panel Solar Monocristalino 450W", marca:"Longi Solar",  categoria:"Placas Solares", qty:45, qtyMin:10, unidad:"Ud.", precioUnit:210, ubicacion:"Nave A - Estante 1", proyecto:"-" },
  { id:3, ref:"SOL-003", nombre:"Panel Solar Bifacial 500W",        marca:"Trina Solar",  categoria:"Placas Solares", qty:20, qtyMin:5,  unidad:"Ud.", precioUnit:250, ubicacion:"Nave A - Estante 2", proyecto:"-" },
  { id:4, ref:"INV-001", nombre:"Inversor Monofásico 3kW",          marca:"Fronius",      categoria:"Inversores",     qty:11, qtyMin:3,  unidad:"Ud.", precioUnit:850, ubicacion:"Nave B - Estante 1", proyecto:"-" },
  { id:5, ref:"INV-002", nombre:"Inversor Monofásico 5kW",          marca:"Fronius",      categoria:"Inversores",     qty:9,  qtyMin:3,  unidad:"Ud.", precioUnit:980, ubicacion:"Nave B - Estante 1", proyecto:"-" },
  { id:6, ref:"INV-003", nombre:"Inversor Trifásico 10kW",          marca:"SMA",          categoria:"Inversores",     qty:4,  qtyMin:2,  unidad:"Ud.", precioUnit:1800,ubicacion:"Nave B - Estante 2", proyecto:"-" },
  { id:7, ref:"BAT-001", nombre:"Batería LiFePO4 5kWh",            marca:"BYD",          categoria:"Baterías",       qty:7,  qtyMin:2,  unidad:"Ud.", precioUnit:2200,ubicacion:"Nave B - Estante 3", proyecto:"-" },
  { id:8, ref:"BAT-002", nombre:"Batería LiFePO4 10kWh",           marca:"BYD",          categoria:"Baterías",       qty:2,  qtyMin:1,  unidad:"Ud.", precioUnit:4100,ubicacion:"Nave B - Estante 3", proyecto:"-" },
  { id:9, ref:"CAB-001", nombre:"Cable Solar 4mm²",                marca:"Prysmian",     categoria:"Cableado",       qty:1450,qtyMin:500,unidad:"m",  precioUnit:0.85,ubicacion:"Nave A - Bobinas",    proyecto:"-" },
  { id:10,ref:"CAB-002", nombre:"Cable Solar 6mm²",                marca:"Prysmian",     categoria:"Cableado",       qty:800, qtyMin:500,unidad:"m",  precioUnit:1.2, ubicacion:"Nave A - Bobinas",    proyecto:"-" },
  { id:11,ref:"EST-001", nombre:"Estructura Tejado Inclinado (kit)",marca:"K2 Systems",  categoria:"Estructuras",    qty:20, qtyMin:10, unidad:"Kit",precioUnit:120, ubicacion:"Nave A - Suelo",      proyecto:"-" },
  { id:12,ref:"EST-002", nombre:"Estructura Cubierta Plana (kit)", marca:"K2 Systems",   categoria:"Estructuras",    qty:18, qtyMin:5,  unidad:"Kit",precioUnit:145, ubicacion:"Nave A - Suelo",      proyecto:"-" },
];

const initProjects = [
  { id:"PRY-001", nombre:"Familia Rodríguez · Solar Residencial", cliente:"Familia Rodríguez",   estado:"active", estadoLabel:"Completado",    tipo:"Solar Residencial", equipo:"Equipo Alpha", localidad:"Getafe",    presupuesto:8500,  gastado:6230, facturado:8500,  margen:27, fase:"Completado",    pm:"Equipo Alpha" },
  { id:"PRY-002", nombre:"Comunidad Sta. Ana · Solar Industrial",  cliente:"Comunidad Sta. Ana",  estado:"active", estadoLabel:"Completado",    tipo:"Solar Industrial",  equipo:"Equipo Beta",  localidad:"Alcorcón",  presupuesto:22000, gastado:18400,facturado:22000, margen:16, fase:"Completado",    pm:"Equipo Beta"  },
  { id:"PRY-003", nombre:"José M. Herrera · Aerotermia",          cliente:"José M. Herrera",     estado:"active", estadoLabel:"Completado",    tipo:"Aerotermia",        equipo:"Equipo Alpha", localidad:"Leganés",   presupuesto:9800,  gastado:7700, facturado:9800,  margen:21, fase:"Completado",    pm:"Equipo Alpha" },
  { id:"PRY-004", nombre:"Nave Industrial López · Solar Ind.",    cliente:"Nave Industrial López",estado:"active", estadoLabel:"En Ejecución",  tipo:"Solar Industrial",  equipo:"Equipo Gamma", localidad:"Majadahonda",presupuesto:35000,gastado:12000,facturado:0,     margen:0,  fase:"En Ejecución",  pm:"Equipo Gamma" },
  { id:"PRY-005", nombre:"Hotel Mediterráneo · Mixto Solar+Aero", cliente:"Hotel Mediterráneo",  estado:"active", estadoLabel:"En Ejecución",  tipo:"Mixto Solar+Aero",  equipo:"Equipo Beta",  localidad:"Fuenlabrada",presupuesto:48000,gastado:8500, facturado:0,     margen:0,  fase:"En Ejecución",  pm:"Equipo Beta"  },
  { id:"PRY-006", nombre:"Clínica Dental Pérez · Calefacción",   cliente:"Clínica Dental Pérez", estado:"issue",  estadoLabel:"Completado",    tipo:"Calefacción",       equipo:"Equipo Delta", localidad:"Móstoles",  presupuesto:7200,  gastado:8100, facturado:7200,  margen:-13,fase:"Completado",    pm:"Equipo Delta" },
  { id:"PRY-007", nombre:"Polideportivo Municipal · Solar Ind.",  cliente:"Polideportivo Mpal.",  estado:"active", estadoLabel:"Completado",    tipo:"Solar Industrial",  equipo:"Equipo Alpha", localidad:"Pozuelo",   presupuesto:28000, gastado:21000,facturado:28000, margen:25, fase:"Completado",    pm:"Equipo Alpha" },
  { id:"PRY-008", nombre:"Residencia 3ª Edad · Aerotermia",      cliente:"Residencia 3ª Edad",   estado:"active", estadoLabel:"Completado",    tipo:"Aerotermia",        equipo:"Equipo Gamma", localidad:"Alcalá",    presupuesto:12000, gastado:9800, facturado:12000, margen:18, fase:"Completado",    pm:"Equipo Gamma" },
  { id:"PRY-009", nombre:"Chalet García-Vega · Solar Resid.",    cliente:"Chalet García-Vega",   estado:"pending",estadoLabel:"En Presupuesto",tipo:"Solar Residencial", equipo:"Equipo Delta", localidad:"Boadilla",  presupuesto:11000, gastado:0,    facturado:0,     margen:0,  fase:"En Presupuesto",pm:"Equipo Delta" },
  { id:"PRY-010", nombre:"Fábrica Textil Norte · Solar Ind.",    cliente:"Fábrica Textil Norte", estado:"pending",estadoLabel:"En Presupuesto",tipo:"Solar Industrial",  equipo:"Equipo Beta",  localidad:"Torrejón",  presupuesto:52000, gastado:0,    facturado:0,     margen:0,  fase:"En Presupuesto",pm:"Equipo Beta"  },
];

const initGastos = [
  { id:1, proyecto:"PRY-001", categoria:"Material",     descripcion:"Paneles + Inversores",    fecha:"2025-01-08", importe:4200, estado:"pagado"   },
  { id:2, proyecto:"PRY-001", categoria:"Mano de obra", descripcion:"Equipo Alpha - 38h",      fecha:"2025-01-21", importe:1330, estado:"pagado"   },
  { id:3, proyecto:"PRY-002", categoria:"Material",     descripcion:"Paneles industriales",    fecha:"2025-01-15", importe:12800,estado:"pagado"   },
  { id:4, proyecto:"PRY-002", categoria:"Mano de obra", descripcion:"Equipo Beta - 16h",       fecha:"2025-02-08", importe:560,  estado:"pagado"   },
  { id:5, proyecto:"PRY-004", categoria:"Material",     descripcion:"Material instalación",    fecha:"2025-02-03", importe:8500, estado:"pagado"   },
  { id:6, proyecto:"PRY-004", categoria:"Mano de obra", descripcion:"Equipo Gamma - 16h",      fecha:"2025-02-10", importe:560,  estado:"pendiente"},
  { id:7, proyecto:"PRY-005", categoria:"Mano de obra", descripcion:"Equipo Beta - inicio",    fecha:"2025-02-10", importe:280,  estado:"pendiente"},
  { id:8, proyecto:"PRY-006", categoria:"Material",     descripcion:"Material calefacción",    fecha:"2025-01-05", importe:6800, estado:"pagado"   },
  { id:9, proyecto:"PRY-006", categoria:"Mano de obra", descripcion:"Equipo Delta - 30h+extra",fecha:"2025-01-14", importe:1050, estado:"pagado"   },
  { id:10,proyecto:"PRY-007", categoria:"Material",     descripcion:"Paneles + estructura",    fecha:"2025-01-28", importe:14200,estado:"pagado"   },
  { id:11,proyecto:"PRY-007", categoria:"Mano de obra", descripcion:"Equipo Alpha - 40h",      fecha:"2025-02-17", importe:1400, estado:"pagado"   },
];

const initPartes = [
  { id:1, proyecto:"PRY-001", tecnico:"Luis García",    equipo:"Equipo Alpha", fecha:"2025-01-08", horas:8,  material:"Instalación paneles",          incidencia:"",                  estado:"aprobado" },
  { id:2, proyecto:"PRY-001", tecnico:"Pedro Ruiz",     equipo:"Equipo Alpha", fecha:"2025-01-08", horas:8,  material:"Instalación paneles",          incidencia:"",                  estado:"aprobado" },
  { id:3, proyecto:"PRY-001", tecnico:"Luis García",    equipo:"Equipo Alpha", fecha:"2025-01-09", horas:8,  material:"Cableado y conexiones",         incidencia:"",                  estado:"aprobado" },
  { id:4, proyecto:"PRY-002", tecnico:"Ana López",      equipo:"Equipo Beta",  fecha:"2025-01-15", horas:8,  material:"Instalación paneles",          incidencia:"",                  estado:"aprobado" },
  { id:5, proyecto:"PRY-002", tecnico:"Ana López",      equipo:"Equipo Beta",  fecha:"2025-02-08", horas:8,  material:"Puesta en marcha",             incidencia:"Retraso por lluvia",estado:"revision" },
  { id:6, proyecto:"PRY-004", tecnico:"María Sánchez",  equipo:"Equipo Gamma", fecha:"2025-02-03", horas:8,  material:"Instalación industrial",       incidencia:"",                  estado:"aprobado" },
  { id:7, proyecto:"PRY-004", tecnico:"María Sánchez",  equipo:"Equipo Gamma", fecha:"2025-02-10", horas:8,  material:"Cableado industrial",          incidencia:"",                  estado:"pendiente"},
  { id:8, proyecto:"PRY-005", tecnico:"Ana López",      equipo:"Equipo Beta",  fecha:"2025-02-10", horas:8,  material:"Inicio instalación",           incidencia:"",                  estado:"pendiente"},
  { id:9, proyecto:"PRY-006", tecnico:"Javier Martín",  equipo:"Equipo Delta", fecha:"2025-01-14", horas:8,  material:"Ajuste y puesta en marcha",    incidencia:"Revisita mal ajuste",estado:"revision" },
  { id:10,proyecto:"PRY-007", tecnico:"Luis García",    equipo:"Equipo Alpha", fecha:"2025-02-17", horas:8,  material:"Puesta en marcha",             incidencia:"",                  estado:"aprobado" },
];

// ─── COLORES ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#050e08", bg2:"#0a1a0f", bg3:"#0f2418",
  green:"#00e87a", green2:"#00b85e", green3:"#005f30",
  yellow:"#f5e642", red:"#ff4d4d", text:"#e8f5ec",
  muted:"#5a8069", border:"#1a3d28", card:"#0c1e13",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = n => new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const fnum = n => new Intl.NumberFormat("es-ES").format(n);
const pct  = (a,b) => b ? Math.round((a/b)*100) : 0;

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const S = {
  app:    { background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'Syne',sans-serif" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 28px", borderBottom:`1px solid ${C.border}`, background:"rgba(5,14,8,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100 },
  nav:    { display:"flex", gap:3, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:9, padding:3 },
  navBtn: a => ({ background:a?C.green3:"transparent", color:a?C.green:C.muted, border:`1px solid ${a?C.green3:"transparent"}`, padding:"7px 14px", borderRadius:6, cursor:"pointer", fontFamily:"'Space Mono',monospace", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.1em", transition:"all 0.2s", whiteSpace:"nowrap" }),
  main:   { padding:"26px 28px" },
  stitle: { fontFamily:"'Space Mono',monospace", fontSize:"0.62rem", color:C.green, textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:16, display:"flex", alignItems:"center", gap:10 },
  card:   { background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20 },
  g2:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 },
  g3:     { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 },
  g4:     { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:13, marginBottom:22 },
  g5:     { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:13, marginBottom:22 },
  kpi:    { background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, position:"relative", overflow:"hidden" },
  th:     { fontFamily:"'Space Mono',monospace", fontSize:"0.56rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", padding:"7px 10px", textAlign:"left", borderBottom:`1px solid ${C.border}` },
  td:     { padding:"9px 10px", fontSize:"0.81rem", borderBottom:`1px solid ${C.border}15` },
  input:  { background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"7px 11px", borderRadius:6, fontFamily:"'Space Mono',monospace", fontSize:"0.76rem", width:"100%", outline:"none" },
  btn:    v => { const m={primary:{bg:C.green,c:C.bg},ghost:{bg:"transparent",c:C.green,bo:`1px solid ${C.green3}`},danger:{bg:"rgba(255,77,77,0.1)",c:C.red,bo:"1px solid rgba(255,77,77,0.3)"}}[v]||{}; return {background:m.bg||C.green3,color:m.c||C.green,border:m.bo||"none",padding:"7px 14px",borderRadius:6,cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.08em",transition:"opacity 0.2s"}; },
  badge:  t => { const m={ok:{bg:"rgba(0,232,122,0.12)",c:C.green},warn:{bg:"rgba(245,230,66,0.12)",c:C.yellow},danger:{bg:"rgba(255,77,77,0.12)",c:C.red}}[t]||{bg:"rgba(0,232,122,0.12)",c:C.green}; return {background:m.bg,color:m.c,border:`1px solid ${m.c}30`,padding:"2px 8px",borderRadius:4,fontFamily:"'Space Mono',monospace",fontSize:"0.56rem",textTransform:"uppercase",letterSpacing:"0.08em"}; },
  dot:    t => { const c={active:C.green,pending:C.yellow,issue:C.red}[t]||C.muted; return {width:7,height:7,borderRadius:"50%",background:c,boxShadow:t==="active"?`0 0 6px ${c}`:"none",display:"inline-block",marginRight:6}; },
  bar:    { height:5, borderRadius:3, background:C.bg3, overflow:"hidden", flex:1 },
  fill:   (p,c) => ({ height:"100%", width:`${Math.min(p,100)}%`, background:p>100?C.red:p>85?C.yellow:c||C.green, borderRadius:3, transition:"width 0.8s" }),
};

function KPI({label,value,color,delta,ok,sub}) {
  return (
    <div style={S.kpi} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color||C.green},transparent)`}}/>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.56rem",color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:7}}>{label}</div>
      <div style={{fontSize:"1.85rem",fontWeight:800,color:color||C.text,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>
      {delta&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",marginTop:5,color:ok?C.green:C.red}}>{ok?"↑":"↓"} {delta}</div>}
      {sub&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function ST({children}) {
  return <div style={S.stitle}><span>// {children}</span><div style={{flex:1,height:1,background:C.border}}/></div>;
}

// ─── TAB DASHBOARD ────────────────────────────────────────────────────────────
function TabDashboard({projects,stock,partes}) {
  const totalPresup  = projects.reduce((s,p)=>s+p.presupuesto,0);
  const totalGastado = projects.reduce((s,p)=>s+p.gastado,0);
  const totalFact    = projects.reduce((s,p)=>s+p.facturado,0);
  const completados  = projects.filter(p=>p.estadoLabel==="Completado").length;
  const enEjecucion  = projects.filter(p=>p.estadoLabel==="En Ejecución").length;
  const enRiesgo     = projects.filter(p=>p.margen<0).length;
  const bajosMin     = stock.filter(s=>s.qty<s.qtyMin).length;
  const valorStock   = stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);
  const pendientesP  = partes.filter(p=>p.estado==="pendiente"||p.estado==="revision").length;
  const margenMedio  = projects.filter(p=>p.facturado>0).length
    ? Math.round(projects.filter(p=>p.facturado>0).reduce((s,p)=>s+p.margen,0)/projects.filter(p=>p.facturado>0).length)
    : 0;

  // Equipos stats
  const equipos = [...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const equipoStats = equipos.map(eq => {
    const ps = projects.filter(p=>p.equipo===eq);
    const hrs = partes.filter(p=>p.equipo===eq).reduce((s,p)=>s+p.horas,0);
    return { nombre:eq, proyectos:ps.length, horas:hrs, completados:ps.filter(p=>p.estadoLabel==="Completado").length };
  });

  // Distribución por tipo
  const tipos = [...new Set(projects.map(p=>p.tipo))].filter(Boolean);
  const tipoStats = tipos.map(t=>({ tipo:t, count:projects.filter(p=>p.tipo===t).length }));

  return (
    <div>
      <ST>KPIs Globales</ST>
      <div style={S.g5}>
        <KPI label="Proyectos Totales" value={projects.length} color={C.green} delta={`${completados} completados`} ok />
        <KPI label="En Ejecución" value={enEjecucion} color={C.yellow} sub="proyectos activos" />
        <KPI label="Facturado Total" value={fmt(totalFact)} color={C.green} delta="+8% vs mes ant." ok />
        <KPI label="Margen Medio" value={`${margenMedio}%`} color={margenMedio>15?C.green:margenMedio>0?C.yellow:C.red} delta={enRiesgo>0?`${enRiesgo} en pérdida`:"todos en positivo"} ok={enRiesgo===0} />
        <KPI label="Valor Almacén" value={fmt(valorStock)} color={C.yellow} delta={bajosMin>0?`${bajosMin} refs. bajo mínimo`:"stock OK"} ok={bajosMin===0} />
      </div>

      <div style={S.g2}>
        {/* Proyectos por estado */}
        <div style={S.card}>
          <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
            Proyectos por Estado <span style={S.badge(enRiesgo>0?"danger":"ok")}>{projects.length} total</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Cliente","Tipo","Equipo","Estado","Margen"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {projects.slice(0,8).map(p=>(
                <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.67rem",color:C.muted}}>{p.id}</td>
                  <td style={S.td}><span style={S.dot(p.estado)}/>{p.cliente.split(" ").slice(0,2).join(" ")}</td>
                  <td style={{...S.td,fontSize:"0.72rem",color:C.muted}}>{p.tipo}</td>
                  <td style={{...S.td,fontSize:"0.72rem"}}>{p.equipo}</td>
                  <td style={S.td}><span style={S.badge(p.estadoLabel==="Completado"?"ok":p.estadoLabel==="En Ejecución"?"warn":"danger")}>{p.estadoLabel}</span></td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",color:p.margen<0?C.red:p.margen>20?C.green:C.yellow}}>{p.facturado?`${p.margen}%`:"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel derecho */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Rendimiento por equipo */}
          <div style={S.card}>
            <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:14}}>Rendimiento por Equipo</div>
            {equipoStats.map(eq=>(
              <div key={eq.nombre} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",marginBottom:4}}>
                  <span style={{fontWeight:600}}>{eq.nombre}</span>
                  <span style={{fontFamily:"'Space Mono',monospace",color:C.muted}}>{eq.horas}h · {eq.proyectos} proy.</span>
                </div>
                <div style={S.bar}><div style={S.fill(eq.completados/Math.max(eq.proyectos,1)*100)}/></div>
              </div>
            ))}
          </div>

          {/* Alertas */}
          <div style={S.card}>
            <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:12,display:"flex",justifyContent:"space-between"}}>
              Alertas <span style={S.badge(bajosMin+enRiesgo+pendientesP>0?"danger":"ok")}>{bajosMin+enRiesgo+pendientesP}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {enRiesgo>0&&<div style={{background:"rgba(255,77,77,0.07)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:10,fontSize:"0.76rem"}}><div style={{color:C.red,fontWeight:700,marginBottom:3}}>⚠ Proyectos con margen negativo</div><div style={{color:C.muted}}>{projects.filter(p=>p.margen<0).map(p=>p.id).join(", ")}</div></div>}
              {bajosMin>0&&<div style={{background:"rgba(245,230,66,0.07)",border:"1px solid rgba(245,230,66,0.2)",borderRadius:8,padding:10,fontSize:"0.76rem"}}><div style={{color:C.yellow,fontWeight:700,marginBottom:3}}>📦 Stock bajo mínimo</div><div style={{color:C.muted}}>{stock.filter(s=>s.qty<s.qtyMin).map(s=>s.ref).join(", ")}</div></div>}
              {pendientesP>0&&<div style={{background:"rgba(0,184,94,0.07)",border:`1px solid ${C.green3}`,borderRadius:8,padding:10,fontSize:"0.76rem"}}><div style={{color:C.green,fontWeight:700,marginBottom:3}}>📋 Partes pendientes</div><div style={{color:C.muted}}>{pendientesP} partes en cola</div></div>}
              {enRiesgo===0&&bajosMin===0&&pendientesP===0&&<div style={{color:C.green,fontSize:"0.78rem",textAlign:"center",padding:10}}>✓ Todo en orden</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de instalación */}
      <ST>Distribución por Tipo de Instalación</ST>
      <div style={S.card}>
        <div style={{display:"flex",gap:12,alignItems:"flex-end",height:120}}>
          {tipoStats.map(t=>{
            const maxC = Math.max(...tipoStats.map(x=>x.count));
            const h = (t.count/maxC)*90;
            return (
              <div key={t.tipo} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:C.green}}>{t.count}</div>
                <div style={{width:"100%",height:h,background:C.green3,borderRadius:"4px 4px 0 0",border:`1px solid ${C.green}40`,minHeight:4}}/>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.52rem",color:C.muted,textAlign:"center",lineHeight:1.3}}>{t.tipo}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB STOCK ────────────────────────────────────────────────────────────────
function TabStock({stock,setStock}) {
  const [showForm,setShowForm] = useState(false);
  const [mov,setMov] = useState({stockId:"",tipo:"entrada",qty:"",nota:""});
  const [filtro,setFiltro] = useState("all");
  const [form,setForm] = useState({ref:"",nombre:"",marca:"",categoria:"Placas Solares",qty:"",qtyMin:"",unidad:"Ud.",precioUnit:"",ubicacion:"",proyecto:"-"});

  const cats = ["all",...new Set(stock.map(s=>s.categoria))];
  const filtered = filtro==="all" ? stock : stock.filter(s=>s.categoria===filtro);
  const bajosMin = stock.filter(s=>s.qty<s.qtyMin);
  const valorTotal = stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);

  const handleMov = () => {
    if(!mov.stockId||!mov.qty) return;
    setStock(prev=>prev.map(s=>{
      if(s.id!==parseInt(mov.stockId)) return s;
      const d = mov.tipo==="entrada"?parseInt(mov.qty):-parseInt(mov.qty);
      return {...s,qty:Math.max(0,s.qty+d)};
    }));
    setMov({stockId:"",tipo:"entrada",qty:"",nota:""});
  };

  const handleAdd = () => {
    if(!form.ref||!form.nombre) return;
    setStock(prev=>[...prev,{...form,id:Date.now(),qty:parseInt(form.qty)||0,qtyMin:parseInt(form.qtyMin)||0,precioUnit:parseFloat(form.precioUnit)||0}]);
    setForm({ref:"",nombre:"",marca:"",categoria:"Placas Solares",qty:"",qtyMin:"",unidad:"Ud.",precioUnit:"",ubicacion:"",proyecto:"-"});
    setShowForm(false);
  };

  const catVals = ["Placas Solares","Inversores","Baterías","Cableado","Estructuras","Otro"];

  return (
    <div>
      <div style={S.g4}>
        <KPI label="Referencias" value={fnum(stock.length)} color={C.green}/>
        <KPI label="Valor Almacén" value={fmt(valorTotal)} color={C.yellow}/>
        <KPI label="Bajo Mínimo" value={bajosMin.length} color={bajosMin.length>0?C.red:C.green} delta={bajosMin.length>0?"Reposición urgente":"Stock OK"} ok={bajosMin.length===0}/>
        <KPI label="Referencias OK" value={stock.filter(s=>s.qty>=s.qtyMin).length} color={C.green} sub="con stock suficiente"/>
      </div>

      {bajosMin.length>0&&(
        <div style={{background:"rgba(255,77,77,0.07)",border:"1px solid rgba(255,77,77,0.25)",borderRadius:10,padding:14,marginBottom:20,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{color:C.red,fontWeight:700,fontSize:"0.8rem"}}>⚠ STOCK BAJO MÍNIMO:</span>
          {bajosMin.map(s=><span key={s.id} style={S.badge("danger")}>{s.ref} · {s.qty} {s.unidad} (mín:{s.qtyMin})</span>)}
        </div>
      )}

      <div style={S.g2}>
        <div style={S.card}>
          <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:14}}>Registrar Movimiento</div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            <div style={{display:"flex",gap:7}}>
              <button style={{...S.btn(mov.tipo==="entrada"?"primary":"ghost"),flex:1}} onClick={()=>setMov(p=>({...p,tipo:"entrada"}))}>↑ Entrada</button>
              <button style={{...S.btn(mov.tipo==="salida"?"danger":"ghost"),flex:1}} onClick={()=>setMov(p=>({...p,tipo:"salida"}))}>↓ Salida</button>
            </div>
            <select style={S.input} value={mov.stockId} onChange={e=>setMov(p=>({...p,stockId:e.target.value}))}>
              <option value="">— Seleccionar material —</option>
              {stock.map(s=><option key={s.id} value={s.id}>{s.ref} · {s.nombre} ({s.qty} {s.unidad})</option>)}
            </select>
            <input style={S.input} placeholder="Cantidad" type="number" value={mov.qty} onChange={e=>setMov(p=>({...p,qty:e.target.value}))}/>
            <input style={S.input} placeholder="Nota / Proyecto destino" value={mov.nota} onChange={e=>setMov(p=>({...p,nota:e.target.value}))}/>
            <button style={S.btn("primary")} onClick={handleMov}>Confirmar Movimiento</button>
          </div>
        </div>

        <div style={S.card}>
          <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:14}}>Valor por Categoría</div>
          {catVals.map(cat=>{
            const val = stock.filter(s=>s.categoria===cat).reduce((a,b)=>a+b.qty*b.precioUnit,0);
            const p = valorTotal ? Math.round((val/valorTotal)*100) : 0;
            if(!p) return null;
            return (
              <div key={cat} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.76rem",marginBottom:4}}>
                  <span>{cat}</span>
                  <span style={{fontFamily:"'Space Mono',monospace"}}>{fmt(val)} <span style={{color:C.muted}}>({p}%)</span></span>
                </div>
                <div style={S.bar}><div style={S.fill(p)}/></div>
              </div>
            );
          })}
        </div>
      </div>

      <ST>Inventario Completo — Datos reales del almacén</ST>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {cats.map(c=><button key={c} style={S.navBtn(filtro===c)} onClick={()=>setFiltro(c)}>{c==="all"?"Todos":c}</button>)}
        </div>
        <button style={S.btn("primary")} onClick={()=>setShowForm(!showForm)}>+ Añadir Material</button>
      </div>

      {showForm&&(
        <div style={{...S.card,marginBottom:16,background:"rgba(0,232,122,0.04)",border:`1px solid ${C.green3}`}}>
          <div style={{fontSize:"0.83rem",fontWeight:700,marginBottom:12}}>Nuevo Material</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:9}}>
            {[["ref","Referencia"],["nombre","Nombre"],["marca","Marca"],["ubicacion","Ubicación"]].map(([k,pl])=>(
              <input key={k} style={S.input} placeholder={pl} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:9,marginBottom:12}}>
            <input style={S.input} placeholder="Cantidad" type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))}/>
            <input style={S.input} placeholder="Mínimo" type="number" value={form.qtyMin} onChange={e=>setForm(p=>({...p,qtyMin:e.target.value}))}/>
            <input style={S.input} placeholder="Precio/und €" type="number" value={form.precioUnit} onChange={e=>setForm(p=>({...p,precioUnit:e.target.value}))}/>
            <select style={S.input} value={form.unidad} onChange={e=>setForm(p=>({...p,unidad:e.target.value}))}><option>Ud.</option><option>m</option><option>Kit</option><option>kg</option></select>
            <select style={S.input} value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value}))}>{catVals.map(c=><option key={c}>{c}</option>)}</select>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button style={S.btn("primary")} onClick={handleAdd}>Guardar</button>
            <button style={S.btn("ghost")} onClick={()=>setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["REF","Material","Categoría","Stock","Mín","Estado","Precio","Valor","Ubicación",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(item=>{
              const est = item.qty===0?"agotado":item.qty<item.qtyMin?"bajo":"ok";
              return (
                <tr key={item.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.67rem",color:C.muted}}>{item.ref}</td>
                  <td style={S.td}><div style={{fontWeight:600,fontSize:"0.8rem"}}>{item.nombre}</div><div style={{fontSize:"0.66rem",color:C.muted}}>{item.marca}</div></td>
                  <td style={{...S.td,fontSize:"0.72rem"}}>{item.categoria}</td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{fnum(item.qty)} <span style={{color:C.muted,fontSize:"0.63rem"}}>{item.unidad}</span></td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:C.muted}}>{item.qtyMin}</td>
                  <td style={S.td}><span style={S.badge(est==="ok"?"ok":est==="bajo"?"warn":"danger")}>{est==="ok"?"OK":est==="bajo"?"BAJO":"AGOTADO"}</span></td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.73rem"}}>{fmt(item.precioUnit)}</td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.73rem",color:C.yellow}}>{fmt(item.qty*item.precioUnit)}</td>
                  <td style={{...S.td,fontSize:"0.7rem",color:C.muted}}>{item.ubicacion}</td>
                  <td style={S.td}><button style={{...S.btn("danger"),padding:"3px 8px",fontSize:"0.58rem"}} onClick={()=>setStock(prev=>prev.filter(s=>s.id!==item.id))}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB GASTOS ───────────────────────────────────────────────────────────────
function TabGastos({projects,gastos,setGastos}) {
  const [filtro,setFiltro] = useState("all");
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({proyecto:projects[0]?.id||"",categoria:"Material",descripcion:"",fecha:"",importe:"",estado:"pendiente"});

  const filtered = filtro==="all" ? gastos : gastos.filter(g=>g.proyecto===filtro);
  const cats = ["Material","Mano de obra","Subcontrata","Transporte","Varios"];

  const handleAdd = () => {
    if(!form.descripcion||!form.importe) return;
    setGastos(prev=>[...prev,{...form,id:Date.now(),importe:parseFloat(form.importe)}]);
    setForm({proyecto:projects[0]?.id||"",categoria:"Material",descripcion:"",fecha:"",importe:"",estado:"pendiente"});
    setShowForm(false);
  };

  return (
    <div>
      <ST>Presupuesto vs Ejecutado por Proyecto</ST>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:22}}>
        {projects.filter(p=>p.presupuesto>0).slice(0,5).map(p=>{
          const g = gastos.filter(x=>x.proyecto===p.id).reduce((s,x)=>s+x.importe,0);
          const pg = pct(g,p.presupuesto);
          return (
            <div key={p.id} style={{...S.card,cursor:"pointer",borderColor:filtro===p.id?C.green:C.border,transition:"border-color 0.2s"}} onClick={()=>setFiltro(prev=>prev===p.id?"all":p.id)}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:C.muted,marginBottom:5}}>{p.id}</div>
              <div style={{fontWeight:700,fontSize:"0.8rem",marginBottom:12,lineHeight:1.3}}>{p.cliente.split(" ").slice(0,2).join(" ")}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <div><div style={{fontSize:"0.55rem",color:C.muted,marginBottom:2}}>PPTO</div><div style={{fontWeight:800,color:C.green,fontSize:"0.9rem"}}>{fmt(p.presupuesto)}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:"0.55rem",color:C.muted,marginBottom:2}}>EJEC.</div><div style={{fontWeight:800,color:pg>100?C.red:C.yellow,fontSize:"0.9rem"}}>{fmt(g)}</div></div>
              </div>
              <div style={S.bar}><div style={S.fill(pg)}/></div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:C.muted,marginTop:5,textAlign:"right"}}>{pg}%</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <button style={S.navBtn(filtro==="all")} onClick={()=>setFiltro("all")}>Todos</button>
          {projects.slice(0,8).map(p=><button key={p.id} style={S.navBtn(filtro===p.id)} onClick={()=>setFiltro(prev=>prev===p.id?"all":p.id)}>{p.id}</button>)}
        </div>
        <button style={S.btn("primary")} onClick={()=>setShowForm(!showForm)}>+ Registrar Gasto</button>
      </div>

      {showForm&&(
        <div style={{...S.card,marginBottom:16,background:"rgba(0,232,122,0.04)",border:`1px solid ${C.green3}`}}>
          <div style={{fontSize:"0.83rem",fontWeight:700,marginBottom:12}}>Nuevo Gasto</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:9,marginBottom:12}}>
            <select style={S.input} value={form.proyecto} onChange={e=>setForm(p=>({...p,proyecto:e.target.value}))}>
              {projects.map(p=><option key={p.id} value={p.id}>{p.id}</option>)}
            </select>
            <select style={S.input} value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value}))}>
              {cats.map(c=><option key={c}>{c}</option>)}
            </select>
            <input style={S.input} placeholder="Descripción" value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))}/>
            <input style={S.input} type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}/>
            <input style={S.input} placeholder="Importe €" type="number" value={form.importe} onChange={e=>setForm(p=>({...p,importe:e.target.value}))}/>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button style={S.btn("primary")} onClick={handleAdd}>Guardar</button>
            <button style={S.btn("ghost")} onClick={()=>setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Proyecto","Categoría","Descripción","Fecha","Importe","Estado",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(g=>(
              <tr key={g.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:C.muted}}>{g.proyecto}</td>
                <td style={{...S.td,fontSize:"0.74rem"}}>{g.categoria}</td>
                <td style={S.td}>{g.descripcion}</td>
                <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.7rem",color:C.muted}}>{g.fecha}</td>
                <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontWeight:700,color:C.yellow}}>{fmt(g.importe)}</td>
                <td style={S.td}><button style={{...S.badge(g.estado==="pagado"?"ok":"warn"),cursor:"pointer",border:"none"}} onClick={()=>setGastos(prev=>prev.map(x=>x.id!==g.id?x:{...x,estado:x.estado==="pagado"?"pendiente":"pagado"}))}>{g.estado==="pagado"?"✓ Pagado":"Pendiente"}</button></td>
                <td style={S.td}><button style={{...S.btn("danger"),padding:"3px 8px",fontSize:"0.58rem"}} onClick={()=>setGastos(prev=>prev.filter(x=>x.id!==g.id))}>✕</button></td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:C.muted,textAlign:"right",paddingTop:12}}>TOTAL →</td>
              <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontWeight:800,color:C.green,fontSize:"0.92rem",paddingTop:12}}>{fmt(filtered.reduce((s,g)=>s+g.importe,0))}</td>
              <td colSpan={2}/>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB PARTES ───────────────────────────────────────────────────────────────
function TabPartes({projects,partes,setPartes}) {
  const [showForm,setShowForm] = useState(false);
  const [filtro,setFiltro] = useState("all");
  const [form,setForm] = useState({proyecto:projects[0]?.id||"",tecnico:"",equipo:"Equipo Alpha",fecha:new Date().toISOString().split("T")[0],horas:"",material:"",incidencia:"",estado:"pendiente"});

  const filtered = filtro==="all"?partes:partes.filter(p=>p.estado===filtro);
  const totalHoras = partes.reduce((s,p)=>s+parseFloat(p.horas||0),0);
  const pendientes = partes.filter(p=>p.estado==="pendiente"||p.estado==="revision").length;
  const conInc = partes.filter(p=>p.incidencia&&p.incidencia!=="").length;

  const handleAdd = () => {
    if(!form.tecnico||!form.horas) return;
    setPartes(prev=>[...prev,{...form,id:Date.now(),horas:parseFloat(form.horas)}]);
    setForm({proyecto:projects[0]?.id||"",tecnico:"",equipo:"Equipo Alpha",fecha:new Date().toISOString().split("T")[0],horas:"",material:"",incidencia:"",estado:"pendiente"});
    setShowForm(false);
  };

  const stConf = {aprobado:{label:"Aprobado",c:C.green},pendiente:{label:"Pendiente",c:C.yellow},revision:{label:"Revisión",c:C.red}};
  const equipos = ["Equipo Alpha","Equipo Beta","Equipo Gamma","Equipo Delta"];

  // Horas por equipo
  const eqHoras = equipos.map(eq=>({ eq, h:partes.filter(p=>p.equipo===eq).reduce((s,p)=>s+p.horas,0) }));
  const maxH = Math.max(...eqHoras.map(x=>x.h),1);

  return (
    <div>
      <div style={S.g4}>
        <KPI label="Partes Registrados" value={partes.length} color={C.green}/>
        <KPI label="Total Horas" value={`${totalHoras}h`} color={C.yellow} sub="registradas"/>
        <KPI label="Pendientes" value={pendientes} color={pendientes>0?C.red:C.green} delta={pendientes>0?"Revisar":"Al día"} ok={pendientes===0}/>
        <KPI label="Con Incidencia" value={conInc} color={conInc>0?C.yellow:C.green} delta={conInc>0?"Requieren atención":"Sin incidencias"} ok={conInc===0}/>
      </div>

      <div style={S.g2}>
        <div style={S.card}>
          <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:14}}>Horas por Equipo</div>
          <div style={{display:"flex",gap:14,alignItems:"flex-end",height:100}}>
            {eqHoras.map(({eq,h})=>(
              <div key={eq} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:C.green}}>{h}h</div>
                <div style={{width:"100%",height:Math.max((h/maxH)*80,4),background:C.green3,borderRadius:"4px 4px 0 0",border:`1px solid ${C.green}40`}}/>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.52rem",color:C.muted,textAlign:"center"}}>{eq.replace("Equipo ","")}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{fontSize:"0.88rem",fontWeight:700,marginBottom:14}}>Incidencias Activas</div>
          {partes.filter(p=>p.incidencia&&p.incidencia!=="").length===0
            ? <div style={{color:C.muted,fontSize:"0.8rem",textAlign:"center",padding:20}}>✓ Sin incidencias activas</div>
            : partes.filter(p=>p.incidencia&&p.incidencia!=="").map(p=>(
              <div key={p.id} style={{background:"rgba(245,230,66,0.06)",border:"1px solid rgba(245,230,66,0.2)",borderRadius:8,padding:10,marginBottom:8,fontSize:"0.76rem"}}>
                <div style={{color:C.yellow,fontWeight:700,marginBottom:3}}>{p.proyecto} · {p.tecnico}</div>
                <div style={{color:C.muted}}>{p.incidencia}</div>
              </div>
            ))
          }
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{display:"flex",gap:5}}>
          {[["all","Todos"],["aprobado","Aprobados"],["pendiente","Pendientes"],["revision","En revisión"]].map(([v,l])=>(
            <button key={v} style={S.navBtn(filtro===v)} onClick={()=>setFiltro(v)}>{l}</button>
          ))}
        </div>
        <button style={S.btn("primary")} onClick={()=>setShowForm(!showForm)}>+ Nuevo Parte</button>
      </div>

      {showForm&&(
        <div style={{...S.card,marginBottom:16,background:"rgba(0,232,122,0.04)",border:`1px solid ${C.green3}`}}>
          <div style={{fontSize:"0.83rem",fontWeight:700,marginBottom:12}}>Nuevo Parte de Trabajo</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:9}}>
            <select style={S.input} value={form.proyecto} onChange={e=>setForm(p=>({...p,proyecto:e.target.value}))}>
              {projects.map(p=><option key={p.id} value={p.id}>{p.id}</option>)}
            </select>
            <input style={S.input} placeholder="Técnico" value={form.tecnico} onChange={e=>setForm(p=>({...p,tecnico:e.target.value}))}/>
            <select style={S.input} value={form.equipo} onChange={e=>setForm(p=>({...p,equipo:e.target.value}))}>
              {equipos.map(eq=><option key={eq}>{eq}</option>)}
            </select>
            <input style={S.input} type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 2fr",gap:9,marginBottom:12}}>
            <input style={S.input} placeholder="Horas" type="number" step="0.5" value={form.horas} onChange={e=>setForm(p=>({...p,horas:e.target.value}))}/>
            <input style={S.input} placeholder="Material / Concepto" value={form.material} onChange={e=>setForm(p=>({...p,material:e.target.value}))}/>
            <input style={S.input} placeholder="Incidencia (opcional)" value={form.incidencia} onChange={e=>setForm(p=>({...p,incidencia:e.target.value}))}/>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button style={S.btn("primary")} onClick={handleAdd}>Enviar Parte</button>
            <button style={S.btn("ghost")} onClick={()=>setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Proyecto","Técnico","Equipo","Fecha","Horas","Concepto","Incidencia","Estado",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>{
              const sc = stConf[p.estado]||stConf.pendiente;
              return (
                <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:C.muted}}>{p.proyecto}</td>
                  <td style={{...S.td,fontWeight:600}}>{p.tecnico}</td>
                  <td style={{...S.td,fontSize:"0.72rem",color:C.muted}}>{p.equipo}</td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:C.muted}}>{p.fecha}</td>
                  <td style={{...S.td,fontFamily:"'Space Mono',monospace",color:C.yellow,fontWeight:700}}>{p.horas}h</td>
                  <td style={{...S.td,fontSize:"0.76rem",color:C.muted}}>{p.material||"—"}</td>
                  <td style={S.td}>{p.incidencia?<span style={{color:C.red,fontSize:"0.76rem"}}>⚠ {p.incidencia}</span>:<span style={{color:C.muted,fontSize:"0.73rem"}}>—</span>}</td>
                  <td style={S.td}><span style={{color:sc.c,fontFamily:"'Space Mono',monospace",fontSize:"0.63rem"}}>● {sc.label}</span></td>
                  <td style={S.td}>
                    <div style={{display:"flex",gap:5}}>
                      {p.estado!=="aprobado"&&<button style={{...S.btn("primary"),padding:"3px 9px",fontSize:"0.58rem"}} onClick={()=>setPartes(prev=>prev.map(x=>x.id!==p.id?x:{...x,estado:"aprobado"}))}>✓</button>}
                      {p.estado!=="revision"&&<button style={{...S.btn("danger"),padding:"3px 9px",fontSize:"0.58rem"}} onClick={()=>setPartes(prev=>prev.map(x=>x.id!==p.id?x:{...x,estado:"revision"}))}>!</button>}
                      <button style={{...S.btn("ghost"),padding:"3px 9px",fontSize:"0.58rem"}} onClick={()=>setPartes(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]         = useState("dashboard");
  const [projects,setProjects] = useState(initProjects);
  const [stock,setStock]     = useState(initStock);
  const [gastos,setGastos]   = useState(initGastos);
  const [partes,setPartes]   = useState(initPartes);
  const [now,setNow]         = useState(new Date());
  const [loading,setLoading] = useState(false);
  const [sheetStatus,setSheetStatus] = useState("demo");
  const [lastSync,setLastSync]       = useState(null);

  const isConfigured = SHEET_ID !== "TU_SHEET_ID_AQUI";

  const syncFromSheets = async () => {
    if(!isConfigured) return;
    setLoading(true); setSheetStatus("loading");
    try {
      const [stockRes,prodRes,projRes,horasRes] = await Promise.allSettled([
        fetchSheet(SHEET_TABS.stock),
        fetchSheet(SHEET_TABS.productos),
        fetchSheet(SHEET_TABS.proyectos),
        fetchSheet(SHEET_TABS.horas),
      ]);
      if(stockRes.status==="fulfilled"&&stockRes.value.length) setStock(stockRes.value.map(mapStock));
      else if(prodRes.status==="fulfilled"&&prodRes.value.length) setStock(prodRes.value.map(mapProducto));
      if(projRes.status==="fulfilled"&&projRes.value.length) setProjects(projRes.value.map(mapProyecto));
      if(horasRes.status==="fulfilled"&&horasRes.value.length) setPartes(horasRes.value.map(mapHoras));
      setSheetStatus("ok"); setLastSync(new Date());
    } catch(e) {
      setSheetStatus("error"); console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(()=>{
    const t = setInterval(()=>setNow(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(isConfigured){
      syncFromSheets();
      const iv = setInterval(syncFromSheets,5*60*1000);
      return ()=>clearInterval(iv);
    }
  },[]);

  const tabs = [{id:"dashboard",label:"Dashboard"},{id:"stock",label:"Stock"},{id:"gastos",label:"Gastos"},{id:"partes",label:"Partes de Trabajo"}];

  const statusBadge = {
    demo:    { text:"📋 DATOS DEMO", bg:"rgba(90,128,105,0.15)", c:C.muted, bo:C.border },
    loading: { text:"⟳ SINCRONIZANDO...", bg:"rgba(245,230,66,0.08)", c:C.yellow, bo:"rgba(245,230,66,0.3)" },
    ok:      { text:`✓ SHEETS CONECTADO${lastSync?" · "+lastSync.toLocaleTimeString("es-ES"):""}`, bg:"rgba(0,232,122,0.08)", c:C.green, bo:C.green3 },
    error:   { text:"✗ ERROR — Sheet no público", bg:"rgba(255,77,77,0.08)", c:C.red, bo:"rgba(255,77,77,0.3)" },
  }[sheetStatus];

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} select option{background:#0a1a0f} input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6)} @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>

      <header style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:34,height:34,background:C.green,clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 24 24" fill={C.bg} width={16}><path d="M12 2L4 7v5c0 5 3.8 9.7 8 11 4.2-1.3 8-6 8-11V7L12 2z"/></svg>
          </div>
          <div>
            <div style={{fontSize:"1.1rem",fontWeight:800,letterSpacing:"-0.02em"}}>AFC <span style={{color:C.green}}>Renovables</span></div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.55rem",color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Control de Gestión · v2.1</div>
          </div>
        </div>

        <nav style={S.nav}>
          {tabs.map(t=><button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </nav>

        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:statusBadge.c,background:statusBadge.bg,border:`1px solid ${statusBadge.bo}`,padding:"5px 10px",borderRadius:4}}>
            {statusBadge.text}
          </div>
          {isConfigured&&<button onClick={syncFromSheets} disabled={loading} style={{...S.btn("ghost"),padding:"5px 10px",fontSize:"0.58rem",opacity:loading?0.5:1}}>⟳</button>}
          <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:"'Space Mono',monospace",fontSize:"0.62rem",color:C.green}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"blink 1.4s infinite"}}/>LIVE
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.62rem",color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:"5px 11px",borderRadius:4}}>
            {now.toLocaleDateString("es-ES")} {now.toLocaleTimeString("es-ES")}
          </div>
        </div>
      </header>

      <main style={S.main}>
        {tab==="dashboard"&&<TabDashboard projects={projects} stock={stock} gastos={gastos} partes={partes}/>}
        {tab==="stock"    &&<TabStock stock={stock} setStock={setStock}/>}
        {tab==="gastos"   &&<TabGastos projects={projects} gastos={gastos} setGastos={setGastos}/>}
        {tab==="partes"   &&<TabPartes projects={projects} partes={partes} setPartes={setPartes}/>}
      </main>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"13px 28px",display:"flex",justifyContent:"space-between",fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:C.muted}}>
        <span>AFC Renovables · Sistema de Gestión · Confidencial</span>
        <span>Generado con Claude · {now.getFullYear()}</span>
      </footer>
    </div>
  );
}
