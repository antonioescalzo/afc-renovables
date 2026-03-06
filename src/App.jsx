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
// Claves normalizadas: sin acentos, sin espacios, guión bajo simple
// "Nº Proyecto" → "n_proyecto" | "Descripción" → "descripcion" | "Stock Mínimo" → "stock_minimo"

function g(row, ...keys) {
  // Busca la primera clave que exista en el objeto, con o sin acento
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== "") return row[k];
  }
  return "";
}

function mapStock(row, i) {
  const qty = parseFloat(g(row, "stock_actual","cantidad","stock") || 0);
  const min = parseFloat(g(row, "stock_minimo","stock_m_nimo","stock_min") || 0);
  return {
    id: i + 1,
    ref:       g(row, "ref") || `REF-${i}`,
    nombre:    g(row, "descripcion","descripci_n","descripcion_del_producto") || "",
    marca:     g(row, "marca","marca_fabricante","marca_fabricant") || "",
    categoria: g(row, "categoria","categor_a") || "General",
    qty, qtyMin: min,
    unidad:    g(row, "unidad") || "Ud.",
    precioUnit:parseFloat(g(row, "precio_coste","precio_cost") || 0),
    ubicacion: g(row, "ubicacion_almacen","ubicaci_n_almac_n","ubicacion") || "",
    proyecto:  "-",
  };
}

function mapProducto(row, i) {
  return {
    id: i + 1,
    ref:       g(row, "ref") || `REF-${i}`,
    nombre:    g(row, "descripcion_del_producto","descripcion","descripci_n") || "",
    marca:     g(row, "marca_fabricante","marca_fabricant","marca") || "",
    categoria: g(row, "categoria","categor_a") || "General",
    qty: 0,
    qtyMin:    parseFloat(g(row, "stock_minimo","stock_m_nimo") || 0),
    unidad:    g(row, "unidad") || "Ud.",
    precioUnit:parseFloat(g(row, "precio_coste","precio_cost") || 0),
    ubicacion: g(row, "ubicacion_almacen","ubicaci_n_almac_n","ubicacion") || "",
    proyecto:  "-",
  };
}

function mapProyecto(row, i) {
  const pv  = parseFloat(g(row, "precio_venta_total","precio_venta") || 0);
  const ct  = parseFloat(g(row, "coste_total_real","coste_total") || 0);
  const mb  = pv && ct ? pv - ct : 0;
  const pct = pv ? Math.round((mb / pv) * 100) : 0;
  const estadoMap = { "Completado":"active","En Ejecución":"active","En Presupuesto":"pending","Parado":"issue" };
  const idProj = g(row, "n_proyecto","num_proyecto","id","n__proyecto");
  if (!idProj || idProj.startsWith("PRY-0") && idProj.length <= 5) return null;
  return {
    id:          idProj || `PRY-${i}`,
    nombre:      g(row,"cliente") + " · " + g(row,"tipo_instalacion","tipo_instalaci_n"),
    cliente:     g(row, "cliente") || "",
    estado:      estadoMap[g(row,"estado")] || "active",
    estadoLabel: g(row, "estado") || "Activo",
    tipo:        g(row, "tipo_instalacion","tipo_instalaci_n") || "",
    equipo:      g(row, "equipo_asignado","equipo") || "",
    localidad:   g(row, "localidad") || "",
    presupuesto: parseFloat(g(row,"precio_venta_total","precio_venta") || 0),
    gastado:     ct,
    facturado:   pv,
    margen:      pct,
    fase:        g(row,"estado") || "",
    pm:          g(row,"equipo_asignado","equipo") || "",
  };
}

function mapHoras(row, i) {
  const proj = g(row, "n_proyecto","num_proyecto","n__proyecto");
  if (!proj) return null;
  return {
    id:         i + 1,
    proyecto:   proj,
    tecnico:    g(row, "tecnico","t_cnico") || "",
    equipo:     g(row, "equipo") || "",
    fecha:      g(row, "fecha") || "",
    horas:      parseFloat(g(row, "horas") || 0),
    material:   g(row, "concepto") || "",
    incidencia: g(row, "observaciones") || "",
    estado:     g(row,"observaciones") ? "revision" : "aprobado",
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


// ─── TAB GRÁFICOS ─────────────────────────────────────────────────────────────

// Mini helpers para SVG charts
function BarChart({ data, height = 160, color = "#00e87a", showValues = true }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 28);
        const x = i * w + w * 0.1;
        const bw = w * 0.8;
        const y = height - barH - 20;
        const isNeg = d.value < 0;
        const col = isNeg ? "#ff4d4d" : d.value < max * 0.4 ? "#f5e642" : color;
        return (
          <g key={i}>
            <rect x={x} y={isNeg ? height - 20 : y} width={bw} height={Math.abs(barH)} fill={col} opacity={0.85} rx={1.5} />
            {showValues && (
              <text x={x + bw / 2} y={isNeg ? height - 20 + Math.abs(barH) + 8 : y - 3}
                fill={col} fontSize={5} textAnchor="middle" fontFamily="Space Mono, monospace">
                {d.value > 999 ? `${(d.value/1000).toFixed(0)}k` : d.value}
              </text>
            )}
            <text x={x + bw / 2} y={height - 6} fill="#5a8069" fontSize={4.5} textAnchor="middle" fontFamily="Space Mono, monospace">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function HBarChart({ data, color = "#00e87a" }) {
  const max = Math.max(...data.map(d => Math.abs(d.value)), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d, i) => {
        const pct = Math.abs(d.value) / max * 100;
        const isNeg = d.value < 0;
        const col = isNeg ? "#ff4d4d" : d.value < max * 0.3 ? "#f5e642" : color;
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.76rem" }}>
              <span style={{ color: "#e8f5ec" }}>{d.label}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", color: col, fontWeight: 700 }}>{d.fmt || d.value}</span>
            </div>
            <div style={{ height: 7, background: "#0f2418", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 4, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = ["#00e87a", "#f5e642", "#00b85e", "#5a8069", "#ff4d4d", "#00e8c8"];
  let angle = -90;
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.22;
  const slices = data.map((d, i) => {
    const deg = (d.value / total) * 360;
    const start = angle;
    angle += deg;
    const toRad = a => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(start + deg));
    const y2 = cy + r * Math.sin(toRad(start + deg));
    const xi1 = cx + ir * Math.cos(toRad(start));
    const yi1 = cy + ir * Math.sin(toRad(start));
    const xi2 = cx + ir * Math.cos(toRad(start + deg));
    const yi2 = cy + ir * Math.sin(toRad(start + deg));
    const large = deg > 180 ? 1 : 0;
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`, color: colors[i % colors.length], label: d.label, pct: Math.round(d.value / total * 100) };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity={0.9} />)}
        <circle cx={cx} cy={cy} r={ir - 2} fill="#0c1e13" />
        <text x={cx} y={cy - 4} fill="#e8f5ec" fontSize={size * 0.09} textAnchor="middle" fontWeight="bold" fontFamily="Syne, sans-serif">{total}</text>
        <text x={cx} y={cy + 10} fill="#5a8069" fontSize={size * 0.065} textAnchor="middle" fontFamily="Space Mono, monospace">total</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.74rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#e8f5ec" }}>{s.label}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", color: s.color, marginLeft: "auto" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data, height = 120, color = "#00e87a", fill = true }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = 0;
  const range = max - min || 1;
  const w = 100 / (data.length - 1 || 1);
  const pts = data.map((d, i) => ({ x: i * w, y: 100 - ((d.value - min) / range * 90) - 5 }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillD = pathD + ` L ${pts[pts.length - 1].x} 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height }} preserveAspectRatio="none">
      {fill && <path d={fillD} fill={color} opacity={0.1} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.8} fill={color} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={100} fill="#5a8069" fontSize={5} textAnchor="middle" fontFamily="Space Mono, monospace">{d.label}</text>
      ))}
    </svg>
  );
}

function GaugeChart({ value, max = 100, label, color }) {
  const pct = Math.min(value / max, 1);
  const col = color || (pct > 0.8 ? "#ff4d4d" : pct > 0.6 ? "#f5e642" : "#00e87a");
  const angle = pct * 180;
  const toRad = a => (a - 180) * Math.PI / 180;
  const x = 60 + 45 * Math.cos(toRad(angle));
  const y = 60 + 45 * Math.sin(toRad(angle));
  return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 100 }}>
      <path d="M 15 60 A 45 45 0 0 1 105 60" fill="none" stroke="#1a3d28" strokeWidth={8} strokeLinecap="round" />
      <path d={`M 15 60 A 45 45 0 0 1 ${x} ${y}`} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" />
      <text x="60" y="52" fill="#e8f5ec" fontSize="14" textAnchor="middle" fontWeight="800" fontFamily="Syne,sans-serif">{value}%</text>
      <text x="60" y="64" fill="#5a8069" fontSize="6" textAnchor="middle" fontFamily="Space Mono, monospace">{label}</text>
    </svg>
  );
}

function ChartCard({ title, badge, badgeType = "ok", children, span = 1 }) {
  return (
    <div style={{ background: "#0c1e13", border: "1px solid #1a3d28", borderRadius: 12, padding: 20, gridColumn: `span ${span}` }}>
      <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {title}
        {badge && <span style={{ background: badgeType === "ok" ? "rgba(0,232,122,0.12)" : badgeType === "warn" ? "rgba(245,230,66,0.12)" : "rgba(255,77,77,0.12)", color: badgeType === "ok" ? "#00e87a" : badgeType === "warn" ? "#f5e642" : "#ff4d4d", border: `1px solid ${badgeType === "ok" ? "#00e87a" : badgeType === "warn" ? "#f5e642" : "#ff4d4d"}30`, padding: "2px 9px", borderRadius: 4, fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", textTransform: "uppercase" }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function TabGraficos({ projects, stock, gastos, partes }) {
  const fmt = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  // ── Datos para gráficos ──────────────────────────────────────────────────
  const completados  = projects.filter(p => p.estadoLabel === "Completado");
  const enEjecucion  = projects.filter(p => p.estadoLabel === "En Ejecución");
  const enPresup     = projects.filter(p => p.estadoLabel === "En Presupuesto");
  const totalFact    = projects.reduce((s, p) => s + p.facturado, 0);
  const totalGastado = projects.reduce((s, p) => s + p.gastado, 0);
  const totalPresup  = projects.reduce((s, p) => s + p.presupuesto, 0);
  const margenGlobal = totalFact ? Math.round((totalFact - totalGastado) / totalFact * 100) : 0;
  const valorStock   = stock.reduce((s, i) => s + i.qty * i.precioUnit, 0);

  // Proyectos con margen calculado (solo los completados o en ejecución con datos)
  const proyConMargen = projects.filter(p => p.facturado > 0).map(p => ({
    label: p.id.replace("PRY-", "P"),
    value: p.margen,
    fmt: `${p.margen}%`,
  }));

  // Facturación por tipo de instalación
  const tiposMap = {};
  projects.forEach(p => {
    if (!p.tipo) return;
    tiposMap[p.tipo] = (tiposMap[p.tipo] || 0) + (p.facturado || p.presupuesto || 0);
  });
  const tiposData = Object.entries(tiposMap).map(([label, value]) => ({ label: label.split(" ")[0], value: Math.round(value / 1000) }));

  // Horas por equipo
  const equipoHoras = {};
  partes.forEach(p => { equipoHoras[p.equipo] = (equipoHoras[p.equipo] || 0) + p.horas; });
  const horasData = Object.entries(equipoHoras).map(([label, value]) => ({ label: label.replace("Equipo ", ""), value }));

  // Donut tipos de proyecto
  const tiposCount = {};
  projects.forEach(p => { if (p.tipo) tiposCount[p.tipo] = (tiposCount[p.tipo] || 0) + 1; });
  const donutData = Object.entries(tiposCount).map(([label, value]) => ({ label, value }));

  // Stock por categoría
  const catStock = {};
  stock.forEach(s => { catStock[s.categoria] = (catStock[s.categoria] || 0) + s.qty * s.precioUnit; });
  const stockCatData = Object.entries(catStock).map(([label, value]) => ({
    label: label.split(" ")[0],
    value: Math.round(value),
    fmt: fmt(value),
  }));

  // Línea de facturación acumulada por proyectos completados
  const factLine = completados.map((p, i) => ({ label: p.id.replace("PRY-", "P"), value: p.facturado }));

  // Presupuesto vs Ejecutado top proyectos
  const presupVsReal = projects.filter(p => p.presupuesto > 0).slice(0, 7).map(p => ({
    id: p.id.replace("PRY-", "P"),
    cliente: p.cliente.split(" ")[0],
    presupuesto: p.presupuesto,
    gastado: p.gastado,
    pct: p.presupuesto ? Math.round(p.gastado / p.presupuesto * 100) : 0,
    color: p.gastado > p.presupuesto ? "#ff4d4d" : p.gastado > p.presupuesto * 0.85 ? "#f5e642" : "#00e87a",
  }));

  return (
    <div>
      {/* KPIs de resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, marginBottom: 22 }}>
        {[
          { label: "Facturación Total", value: fmt(totalFact), color: "#00e87a" },
          { label: "Margen Global", value: `${margenGlobal}%`, color: margenGlobal > 15 ? "#00e87a" : margenGlobal > 0 ? "#f5e642" : "#ff4d4d" },
          { label: "Proyectos Completados", value: completados.length, color: "#00e87a" },
          { label: "Valor Almacén", value: fmt(valorStock), color: "#f5e642" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#0c1e13", border: "1px solid #1a3d28", borderRadius: 10, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${k.color},transparent)` }} />
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.56rem", color: "#5a8069", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>{k.label}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: k.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Fila 1: Gauges + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 16, marginBottom: 18 }}>
        <ChartCard title="Margen Global">
          <GaugeChart value={margenGlobal} max={40} label="margen s/ ventas" color={margenGlobal > 20 ? "#00e87a" : margenGlobal > 10 ? "#f5e642" : "#ff4d4d"} />
          <div style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "#5a8069", marginTop: 4 }}>
            Facturado: {fmt(totalFact)} · Coste: {fmt(totalGastado)}
          </div>
        </ChartCard>

        <ChartCard title="Ejecución Ppto.">
          <GaugeChart value={Math.round(totalGastado / (totalPresup || 1) * 100)} max={100} label="coste vs presupuesto" />
          <div style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "#5a8069", marginTop: 4 }}>
            {fmt(totalGastado)} / {fmt(totalPresup)}
          </div>
        </ChartCard>

        <ChartCard title="Estado Proyectos">
          <GaugeChart value={completados.length} max={projects.length} label="completados" color="#00e87a" />
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 4 }}>
            {[["✓ Complet.", completados.length, "#00e87a"], ["⟳ Ejec.", enEjecucion.length, "#f5e642"], ["◎ Presup.", enPresup.length, "#5a8069"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: c }}>{v}</div>
                <div style={{ fontSize: "0.6rem", color: "#5a8069" }}>{l}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Mix de Instalaciones">
          <DonutChart data={donutData.length ? donutData : [{ label: "Sin datos", value: 1 }]} size={110} />
        </ChartCard>
      </div>

      {/* Fila 2: Margen por proyecto + Horas por equipo */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 18 }}>
        <ChartCard title="Margen por Proyecto" badge={`${proyConMargen.filter(p => p.value < 0).length} en pérdida`} badgeType={proyConMargen.filter(p => p.value < 0).length > 0 ? "danger" : "ok"}>
          {proyConMargen.length > 0
            ? <BarChart data={proyConMargen} height={170} />
            : <div style={{ color: "#5a8069", textAlign: "center", padding: 40, fontSize: "0.8rem" }}>Datos pendientes de Sheet</div>
          }
        </ChartCard>

        <ChartCard title="Horas Mano de Obra por Equipo" badge={`${partes.reduce((s,p)=>s+p.horas,0)}h total`}>
          {horasData.length > 0
            ? <>
                <BarChart data={horasData} height={130} color="#f5e642" />
                <div style={{ borderTop: "1px solid #1a3d28", paddingTop: 12, marginTop: 8 }}>
                  <HBarChart data={horasData.map(d => ({ label: `Equipo ${d.label}`, value: d.value, fmt: `${d.value}h` }))} color="#f5e642" />
                </div>
              </>
            : <div style={{ color: "#5a8069", textAlign: "center", padding: 40 }}>Sin datos de partes</div>
          }
        </ChartCard>
      </div>

      {/* Fila 3: Presupuesto vs Real + Stock */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 18 }}>
        <ChartCard title="Presupuesto vs Ejecutado — Top Proyectos">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {presupVsReal.map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "#5a8069", width: 32 }}>{p.id}</span>
                    <span style={{ fontSize: "0.78rem" }}>{p.cliente}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "#5a8069" }}>{fmt(p.presupuesto)}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: p.color, fontWeight: 700 }}>{fmt(p.gastado)}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: p.color, width: 36, textAlign: "right" }}>{p.pct}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, height: 6 }}>
                  <div style={{ height: "100%", width: `${Math.min(p.pct, 100)}%`, background: p.color, borderRadius: 3, transition: "width 1s" }} />
                  <div style={{ flex: 1, height: "100%", background: "#1a3d28", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {[["■ Presupuesto", "#5a8069"], ["■ Ejecutado OK", "#00e87a"], ["■ Sobre ppto.", "#ff4d4d"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "#5a8069" }}>
                <span style={{ color: c }}>{l.split(" ")[0]}</span> {l.split(" ").slice(1).join(" ")}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Valor Almacén por Categoría" badge={fmt(valorStock)}>
          {stockCatData.length > 0 ? (
            <>
              <BarChart data={stockCatData.map(d => ({ label: d.label, value: Math.round(d.value / 1000), fmt: d.fmt }))} height={140} color="#f5e642" />
              <div style={{ borderTop: "1px solid #1a3d28", paddingTop: 12, marginTop: 8 }}>
                <HBarChart data={stockCatData.map(d => ({ label: d.label, value: d.value, fmt: fmt(d.value) }))} color="#f5e642" />
              </div>
            </>
          ) : (
            <div style={{ color: "#5a8069", textAlign: "center", padding: 40 }}>Sin datos de stock</div>
          )}
        </ChartCard>
      </div>

      {/* Fila 4: Facturación por tipo + Incidencias */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard title="Facturación por Tipo de Instalación">
          {tiposData.length > 0
            ? <>
                <BarChart data={tiposData} height={150} color="#00e87a" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #1a3d28" }}>
                  {tiposData.map((t, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "#00e87a", fontWeight: 700 }}>{t.value}k€</div>
                      <div style={{ fontSize: "0.65rem", color: "#5a8069" }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </>
            : <div style={{ color: "#5a8069", textAlign: "center", padding: 40 }}>Sin datos</div>
          }
        </ChartCard>

        <ChartCard title="Resumen Financiero Global">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Total Facturado", value: totalFact, max: totalPresup, color: "#00e87a" },
              { label: "Total Ejecutado", value: totalGastado, max: totalPresup, color: "#f5e642" },
              { label: "Resultado (Facturado - Coste)", value: totalFact - totalGastado, max: totalPresup, color: totalFact > totalGastado ? "#00e87a" : "#ff4d4d" },
              { label: "Pipeline (Presupuestado pendiente)", value: enPresup.reduce((s, p) => s + p.presupuesto, 0), max: totalPresup, color: "#5a8069" },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.78rem" }}>
                  <span style={{ color: "#e8f5ec" }}>{r.label}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", color: r.color, fontWeight: 700 }}>{fmt(r.value)}</span>
                </div>
                <div style={{ height: 8, background: "#0f2418", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(Math.abs(r.value) / (r.max || 1) * 100, 100)}%`, background: r.color, borderRadius: 4, transition: "width 1s" }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 8, padding: 14, background: "rgba(0,232,122,0.06)", border: "1px solid #005f30", borderRadius: 8 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "#5a8069", marginBottom: 5 }}>MARGEN BRUTO ACUMULADO</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: margenGlobal >= 0 ? "#00e87a" : "#ff4d4d", letterSpacing: "-0.03em" }}>{margenGlobal}%</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "#5a8069", marginTop: 3 }}>
                {fmt(totalFact - totalGastado)} sobre {fmt(totalFact)} facturado
              </div>
            </div>
          </div>
        </ChartCard>
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
      if(projRes.status==="fulfilled"&&projRes.value.length) {
        const mapped = projRes.value.map(mapProyecto).filter(Boolean);
        if(mapped.length) setProjects(mapped);
      }
      if(horasRes.status==="fulfilled"&&horasRes.value.length) {
        const mapped = horasRes.value.map(mapHoras).filter(Boolean);
        if(mapped.length) setPartes(mapped);
      }
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

  const tabs = [{id:"dashboard",label:"Dashboard"},{id:"graficos",label:"Gráficos"},{id:"stock",label:"Stock"},{id:"gastos",label:"Gastos"},{id:"partes",label:"Partes de Trabajo"}];

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
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.55rem",color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Control de Gestión · v2.2</div>
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
        {tab==="graficos"  &&<TabGraficos projects={projects} stock={stock} gastos={gastos} partes={partes}/>}
      </main>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"13px 28px",display:"flex",justifyContent:"space-between",fontFamily:"'Space Mono',monospace",fontSize:"0.58rem",color:C.muted}}>
        <span>AFC Renovables · Sistema de Gestión · Confidencial</span>
        <span>Generado con Claude · {now.getFullYear()}</span>
      </footer>
    </div>
  );
}