import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import "./App.css"

// Inicializar Supabase
const supabase = createClient(
  "https://xhzzfpsszsdqoiavqgis.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
)

// Hook para ancho de ventana
function useW(){const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return w;}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES DE SUPABASE - Reemplazo de Google Sheets
// ═══════════════════════════════════════════════════════════════════════════

async function fetchStock() {
  try {
    let allData = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .order("id")
        .range(start, end);

      if (error) {
        console.error("Error Supabase - Stock:", error);
        break;
      }

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = [...allData, ...data];
        hasMore = data.length === pageSize;
        page++;
      }
    }

    console.log("✓ Stock cargado:", allData.length, "items");
    return allData;
  } catch (e) {
    console.error("Error fetchStock:", e);
    return [];
  }
}

async function fetchProductos() {
  try {
    let allData = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .order("categoria")
        .range(start, end);

      if (error) throw error;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = [...allData, ...data];
        hasMore = data.length === pageSize;
        page++;
      }
    }

    return allData;
  } catch (e) {
    console.error("Error fetchProductos:", e);
    return [];
  }
}

async function fetchProyectos() {
  try {
    const { data, error } = await supabase.from("proyectos").select("*").order("fecha_inicio", { ascending: false });
    if (error) {
      console.error("Error Supabase - Proyectos:", error);
      return [];
    }
    console.log("✓ Proyectos cargados:", data?.length || 0, "items");
    return data || [];
  } catch (e) {
    console.error("Error fetchProyectos:", e);
    return [];
  }
}

async function fetchHoras() {
  try {
    const { data, error } = await supabase.from("horas_trabajo").select("*").order("fecha", { ascending: false });
    if (error) {
      console.error("Error Supabase - Horas:", error);
      return [];
    }
    console.log("✓ Horas cargadas:", data?.length || 0, "items");
    return data || [];
  } catch (e) {
    console.error("Error fetchHoras:", e);
    return [];
  }
}

const TABS = {
  dashboard: "📊 Dashboard",
  stock: "📦 Stock Actual",
  productos: "📦 Maestro Productos",
  proyectos: "📋 Proyectos",
  horas: "⏱️ Horas MO"
}
function nk(h){return h.trim().toLowerCase().replace(/\n/g," ").replace(/\s+/g,"_").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n").replace(/[^a-z0-9_]/g,"_").replace(/_+/g,"_").replace(/^_|_$/g,"");}
const HK=["ref","descripcion","cliente","n_proyecto","stock","fecha","tecnico","categoria","nombre","tipo","posicion","n_mov"];
function parseCSVSheet(text){
  const lines=text.trim().split("\n").map(parseCSVLine);
  let bestIdx=0,bestScore=-1;
  lines.forEach((row,i)=>{if(i>15)return;const score=row.map(nk).filter(k=>k.length>1&&HK.some(kw=>k.includes(kw))).length;if(score>bestScore){bestScore=score;bestIdx=i;}});
  const headers=lines[bestIdx].map(nk);
  return lines.slice(bestIdx+1).filter(r=>r[0]&&r[0].trim()!=""&&r[0].trim()!='""').map(row=>{const obj={};headers.forEach((h,i)=>{if(h)obj[h]=(row[i]||"").trim().replace(/^"|"$/g,"");});return obj;});
}
function parseCSVLine(line){const res=[];let cur="",inQ=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){inQ=!inQ;}else if(c===','&&!inQ){res.push(cur);cur="";}else{cur+=c;}}res.push(cur);return res;}
function g(row,...keys){for(const k of keys){if(row[k]!==undefined&&row[k]!=="")return row[k];}return "";}
function mapStock(row,i){return{id:i+1,ref:g(row,"ref")||`REF-${i}`,nombre:g(row,"descripcion","descripci_n","descripcion_del_producto")||"",marca:g(row,"marca","marca_fabricante")||"",categoria:g(row,"categoria","categor_a")||"General",qty:parseFloat(g(row,"stock_actual","cantidad","stock")||0),qtyMin:parseFloat(g(row,"stock_minimo","stock_m_nimo")||0),unidad:g(row,"unidad")||"Ud.",precioUnit:parseFloat(g(row,"precio_coste","precio_cost")||0),ubicacion:g(row,"ubicacion_almacen","ubicaci_n_almac_n","ubicacion")||""};}
function mapProyecto(row,i){const pv=parseFloat(g(row,"precio_venta_total","precio_venta")||0),ct=parseFloat(g(row,"coste_total_real","coste_total")||0),mb=pv&&ct?pv-ct:0,mg=pv?Math.round((mb/pv)*100):0,id=g(row,"n_proyecto","num_proyecto","n__proyecto");if(!id)return null;const estadoMap={"Completado":"completado","En Ejecución":"ejecucion","En Presupuesto":"presupuesto","Parado":"parado"};return{id,cliente:g(row,"cliente")||"",localidad:g(row,"localidad")||"",tipo:g(row,"tipo_instalacion","tipo_instalaci_n")||"",equipo:g(row,"equipo_asignado","equipo")||"",estado:estadoMap[g(row,"estado")]||"ejecucion",estadoLabel:g(row,"estado")||"Activo",presupuesto:pv,gastado:ct,margen:mg,diasEst:parseFloat(g(row,"dias_estimados","d_as_estimados")||0),diasReal:parseFloat(g(row,"dias_reales","d_as_reales")||0),incidencias:parseFloat(g(row,"n_incidencias","numero_incidencias")||0),fechaInicio:g(row,"fecha_inicio")||""};}
function mapHoras(row,i){const proj=g(row,"n_proyecto","num_proyecto","n__proyecto");if(!proj)return null;return{id:i+1,proyecto:proj,tecnico:g(row,"tecnico","t_cnico")||"",equipo:g(row,"equipo")||"",fecha:g(row,"fecha")||"",horas:parseFloat(g(row,"horas")||0),concepto:g(row,"concepto")||"",incidencia:g(row,"observaciones")||""};}

// ─── DATOS FALLBACK ───────────────────────────────────────────────────────────
const INIT_STOCK=[
  {id:1,ref:"SOL-001",nombre:"Panel Solar Monocristalino 400W",marca:"Jinko Solar",categoria:"Placas Solares",qty:70,qtyMin:10,unidad:"Ud.",precioUnit:180,ubicacion:"Nave A - Estante 1"},
  {id:2,ref:"SOL-002",nombre:"Panel Solar Monocristalino 450W",marca:"Longi Solar",categoria:"Placas Solares",qty:45,qtyMin:10,unidad:"Ud.",precioUnit:210,ubicacion:"Nave A - Estante 1"},
  {id:3,ref:"SOL-003",nombre:"Panel Solar Bifacial 500W",marca:"Trina Solar",categoria:"Placas Solares",qty:20,qtyMin:5,unidad:"Ud.",precioUnit:250,ubicacion:"Nave A - Estante 2"},
  {id:4,ref:"INV-001",nombre:"Inversor Monofásico 3kW",marca:"Fronius",categoria:"Inversores",qty:11,qtyMin:3,unidad:"Ud.",precioUnit:850,ubicacion:"Nave B - Estante 1"},
  {id:5,ref:"INV-002",nombre:"Inversor Monofásico 5kW",marca:"Fronius",categoria:"Inversores",qty:9,qtyMin:3,unidad:"Ud.",precioUnit:980,ubicacion:"Nave B - Estante 1"},
  {id:6,ref:"INV-003",nombre:"Inversor Trifásico 10kW",marca:"SMA",categoria:"Inversores",qty:4,qtyMin:2,unidad:"Ud.",precioUnit:1800,ubicacion:"Nave B - Estante 2"},
  {id:7,ref:"BAT-001",nombre:"Batería LiFePO4 5kWh",marca:"BYD",categoria:"Baterías",qty:7,qtyMin:2,unidad:"Ud.",precioUnit:2200,ubicacion:"Nave B - Estante 3"},
  {id:8,ref:"BAT-002",nombre:"Batería LiFePO4 10kWh",marca:"BYD",categoria:"Baterías",qty:2,qtyMin:1,unidad:"Ud.",precioUnit:4100,ubicacion:"Nave B - Estante 3"},
  {id:9,ref:"CAB-001",nombre:"Cable Solar 4mm²",marca:"Prysmian",categoria:"Cableado",qty:1450,qtyMin:500,unidad:"m",precioUnit:0.85,ubicacion:"Nave A - Bobinas"},
  {id:10,ref:"CAB-002",nombre:"Cable Solar 6mm²",marca:"Prysmian",categoria:"Cableado",qty:800,qtyMin:500,unidad:"m",precioUnit:1.2,ubicacion:"Nave A - Bobinas"},
  {id:11,ref:"EST-001",nombre:"Estructura Tejado Inclinado",marca:"K2 Systems",categoria:"Estructuras",qty:20,qtyMin:10,unidad:"Kit",precioUnit:120,ubicacion:"Nave A - Suelo"},
  {id:12,ref:"EST-002",nombre:"Estructura Cubierta Plana",marca:"K2 Systems",categoria:"Estructuras",qty:18,qtyMin:5,unidad:"Kit",precioUnit:145,ubicacion:"Nave A - Suelo"},
];
const INIT_PROJECTS=[
  {id:"PRY-001",cliente:"Familia Rodríguez",localidad:"Getafe",tipo:"Solar Residencial",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:8500,gastado:6230,margen:27,diasEst:14,diasReal:13,incidencias:1,fechaInicio:"2025-01",
   costeMaterialMayor:3800,costeMaterialMenor:420,costePersonal:1800,costeOtros:210,
   materialMayorPpto:3900,materialMenorPpto:350,personalPpto:1900,
   kw:6.4,paneles:16,descripcion:"Instalación solar residencial tejado sur"},
  {id:"PRY-002",cliente:"Comunidad Sta. Ana",localidad:"Alcorcón",tipo:"Solar Industrial",equipo:"Equipo Beta",estado:"completado",estadoLabel:"Completado",presupuesto:22000,gastado:18400,margen:16,diasEst:21,diasReal:24,incidencias:2,fechaInicio:"2025-01",
   costeMaterialMayor:10200,costeMaterialMenor:1100,costePersonal:6400,costeOtros:700,
   materialMayorPpto:9800,materialMenorPpto:800,personalPpto:5800,
   kw:30,paneles:60,descripcion:"Cubierta comunitaria, conexión a red"},
  {id:"PRY-003",cliente:"José M. Herrera",localidad:"Leganés",tipo:"Aerotermia",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:9800,gastado:7700,margen:21,diasEst:7,diasReal:6,incidencias:0,fechaInicio:"2025-01",
   costeMaterialMayor:4800,costeMaterialMenor:580,costePersonal:2100,costeOtros:220,
   materialMayorPpto:5000,materialMenorPpto:500,personalPpto:2200,
   kw:0,paneles:0,descripcion:"Aerotermia + ACS vivienda unifamiliar"},
  {id:"PRY-004",cliente:"Nave Industrial López",localidad:"Majadahonda",tipo:"Solar Industrial",equipo:"Equipo Gamma",estado:"ejecucion",estadoLabel:"En Ejecución",presupuesto:35000,gastado:12000,margen:0,diasEst:26,diasReal:0,incidencias:1,fechaInicio:"2025-02",
   costeMaterialMayor:7200,costeMaterialMenor:800,costePersonal:3800,costeOtros:200,
   materialMayorPpto:19000,materialMenorPpto:1800,personalPpto:10000,
   kw:60,paneles:120,descripcion:"Nave industrial cubierta plana — en ejecución"},
  {id:"PRY-005",cliente:"Hotel Mediterráneo",localidad:"Fuenlabrada",tipo:"Mixto Solar+Aero",equipo:"Equipo Beta",estado:"ejecucion",estadoLabel:"En Ejecución",presupuesto:48000,gastado:8500,margen:0,diasEst:33,diasReal:0,incidencias:1,fechaInicio:"2025-02",
   costeMaterialMayor:5100,costeMaterialMenor:420,costePersonal:2800,costeOtros:180,
   materialMayorPpto:26000,materialMenorPpto:2200,personalPpto:14000,
   kw:45,paneles:90,descripcion:"Hotel: solar + aerotermia climatización — en ejecución"},
  {id:"PRY-006",cliente:"Clínica Dental Pérez",localidad:"Móstoles",tipo:"Calefacción",equipo:"Equipo Delta",estado:"completado",estadoLabel:"Completado",presupuesto:7200,gastado:8100,margen:-13,diasEst:7,diasReal:9,incidencias:1,fechaInicio:"2025-01",
   costeMaterialMayor:4100,costeMaterialMenor:780,costePersonal:3000,costeOtros:220,
   materialMayorPpto:3600,materialMenorPpto:500,personalPpto:2600,
   kw:0,paneles:0,descripcion:"Calefacción + bomba calor — PÉRDIDAS por revisita"},
  {id:"PRY-007",cliente:"Polideportivo Municipal",localidad:"Pozuelo",tipo:"Solar Industrial",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:28000,gastado:21000,margen:25,diasEst:21,diasReal:20,incidencias:0,fechaInicio:"2025-01",
   costeMaterialMayor:12800,costeMaterialMenor:1400,costePersonal:6200,costeOtros:600,
   materialMayorPpto:13500,materialMenorPpto:1200,personalPpto:6500,
   kw:50,paneles:100,descripcion:"Cubierta polideportivo, autoconsumo 100%"},
  {id:"PRY-008",cliente:"Residencia 3ª Edad",localidad:"Alcalá",tipo:"Aerotermia",equipo:"Equipo Gamma",estado:"completado",estadoLabel:"Completado",presupuesto:12000,gastado:9800,margen:18,diasEst:9,diasReal:11,incidencias:1,fechaInicio:"2025-02",
   costeMaterialMayor:5900,costeMaterialMenor:680,costePersonal:3000,costeOtros:220,
   materialMayorPpto:5800,materialMenorPpto:600,personalPpto:2800,
   kw:0,paneles:0,descripcion:"Aerotermia residencia — 2 días de retraso"},
  {id:"PRY-009",cliente:"Chalet García-Vega",localidad:"Boadilla",tipo:"Solar Residencial",equipo:"Equipo Delta",estado:"presupuesto",estadoLabel:"En Presupuesto",presupuesto:11000,gastado:0,margen:0,diasEst:12,diasReal:0,incidencias:0,fechaInicio:"",
   costeMaterialMayor:0,costeMaterialMenor:0,costePersonal:0,costeOtros:0,
   materialMayorPpto:6200,materialMenorPpto:600,personalPpto:3000,
   kw:8,paneles:20,descripcion:"Pendiente confirmación — tejado a 2 aguas"},
  {id:"PRY-010",cliente:"Fábrica Textil Norte",localidad:"Torrejón",tipo:"Solar Industrial",equipo:"Equipo Beta",estado:"presupuesto",estadoLabel:"En Presupuesto",presupuesto:52000,gastado:0,margen:0,diasEst:30,diasReal:0,incidencias:0,fechaInicio:"",
   costeMaterialMayor:0,costeMaterialMenor:0,costePersonal:0,costeOtros:0,
   materialMayorPpto:29000,materialMenorPpto:2800,personalPpto:14000,
   kw:100,paneles:200,descripcion:"Gran proyecto industrial — pendiente visita técnica"},
];
// Material por proyecto (gran material = equipos principales)
const INIT_MAT_MAYOR=[
  {id:1,proyecto:"PRY-001",ref:"SOL-001",nombre:"Panel Solar 400W",cat:"Placas Solares",qtdPpto:16,qtdReal:16,precioUnit:180,desviacion:0},
  {id:2,proyecto:"PRY-001",ref:"INV-001",nombre:"Inversor 3kW",cat:"Inversores",qtdPpto:1,qtdReal:1,precioUnit:850,desviacion:0},
  {id:3,proyecto:"PRY-001",ref:"EST-001",nombre:"Estructura Tejado",cat:"Estructuras",qtdPpto:4,qtdReal:4,precioUnit:120,desviacion:0},
  {id:4,proyecto:"PRY-001",ref:"BAT-001",nombre:"Batería 5kWh",cat:"Baterías",qtdPpto:1,qtdReal:1,precioUnit:2200,desviacion:0},
  {id:5,proyecto:"PRY-002",ref:"SOL-002",nombre:"Panel Solar 450W",cat:"Placas Solares",qtdPpto:60,qtdReal:60,precioUnit:210,desviacion:0},
  {id:6,proyecto:"PRY-002",ref:"INV-003",nombre:"Inversor 10kW",cat:"Inversores",qtdPpto:2,qtdReal:2,precioUnit:1800,desviacion:0},
  {id:7,proyecto:"PRY-002",ref:"EST-002",nombre:"Estructura Plana",cat:"Estructuras",qtdPpto:10,qtdReal:10,precioUnit:145,desviacion:0},
  {id:8,proyecto:"PRY-003",ref:"BAT-002",nombre:"Batería 10kWh",cat:"Baterías",qtdPpto:1,qtdReal:1,precioUnit:4100,desviacion:0},
  {id:9,proyecto:"PRY-006",ref:"INV-001",nombre:"Inversor 3kW",cat:"Inversores",qtdPpto:1,qtdReal:2,precioUnit:850,desviacion:1},
  {id:10,proyecto:"PRY-007",ref:"SOL-001",nombre:"Panel Solar 400W",cat:"Placas Solares",qtdPpto:100,qtdReal:100,precioUnit:180,desviacion:0},
  {id:11,proyecto:"PRY-007",ref:"INV-002",nombre:"Inversor 5kW",cat:"Inversores",qtdPpto:5,qtdReal:5,precioUnit:980,desviacion:0},
  {id:12,proyecto:"PRY-007",ref:"EST-001",nombre:"Estructura Tejado",cat:"Estructuras",qtdPpto:20,qtdReal:20,precioUnit:120,desviacion:0},
  {id:13,proyecto:"PRY-008",ref:"BAT-001",nombre:"Batería 5kWh",cat:"Baterías",qtdPpto:2,qtdReal:2,precioUnit:2200,desviacion:0},
  {id:14,proyecto:"PRY-004",ref:"SOL-002",nombre:"Panel Solar 450W",cat:"Placas Solares",qtdPpto:120,qtdReal:40,precioUnit:210,desviacion:0},
  {id:15,proyecto:"PRY-005",ref:"SOL-003",nombre:"Panel Bifacial 500W",cat:"Placas Solares",qtdPpto:90,qtdReal:20,precioUnit:250,desviacion:0},
];
// Material menor (pequeño material / consumibles)
const INIT_MAT_MENOR=[
  {id:1,proyecto:"PRY-001",nombre:"Cable Solar 4mm²",cat:"Cableado",unidad:"m",qtdPpto:80,qtdReal:95,precioUnit:0.85,nota:"Más longitud por distribución tejado"},
  {id:2,proyecto:"PRY-001",nombre:"Caja de conexiones",cat:"Protecciones",unidad:"ud",qtdPpto:1,qtdReal:1,precioUnit:45,nota:""},
  {id:3,proyecto:"PRY-001",nombre:"Tornillería acero inox",cat:"Fijación",unidad:"lote",qtdPpto:1,qtdReal:1,precioUnit:28,nota:""},
  {id:4,proyecto:"PRY-001",nombre:"Bridas y sujeta cables",cat:"Fijación",unidad:"lote",qtdPpto:1,qtdReal:2,precioUnit:15,nota:"Doble pasada de cables"},
  {id:5,proyecto:"PRY-001",nombre:"Fusibles CC 15A",cat:"Protecciones",unidad:"ud",qtdPpto:4,qtdReal:4,precioUnit:8,nota:""},
  {id:6,proyecto:"PRY-002",nombre:"Cable Solar 4mm²",cat:"Cableado",unidad:"m",qtdPpto:300,qtdReal:320,precioUnit:0.85,nota:"Recorrido más largo de lo previsto"},
  {id:7,proyecto:"PRY-002",nombre:"Cable Solar 6mm²",cat:"Cableado",unidad:"m",qtdPpto:100,qtdReal:110,precioUnit:1.20,nota:""},
  {id:8,proyecto:"PRY-002",nombre:"Caja de string",cat:"Protecciones",unidad:"ud",qtdPpto:2,qtdReal:2,precioUnit:180,nota:""},
  {id:9,proyecto:"PRY-002",nombre:"Tornillería acero inox",cat:"Fijación",unidad:"lote",qtdPpto:3,qtdReal:3,precioUnit:28,nota:""},
  {id:10,proyecto:"PRY-002",nombre:"Bridas y sujeta cables",cat:"Fijación",unidad:"lote",qtdPpto:3,qtdReal:4,precioUnit:15,nota:"Revisión cableado por incidencia"},
  {id:11,proyecto:"PRY-002",nombre:"Sellador impermeabilizante",cat:"Acabados",unidad:"bote",qtdPpto:2,qtdReal:3,precioUnit:22,nota:"Filtración detectada en zona sur"},
  {id:12,proyecto:"PRY-006",nombre:"Tubería cobre 22mm",cat:"Fontanería",unidad:"m",qtdPpto:15,qtdReal:22,precioUnit:8.50,nota:"Replanteo por obstáculo"},
  {id:13,proyecto:"PRY-006",nombre:"Codos y tes cobre",cat:"Fontanería",unidad:"ud",qtdPpto:8,qtdReal:14,precioUnit:4.20,nota:"Más recodos por replanteo"},
  {id:14,proyecto:"PRY-006",nombre:"Pasta soldadura",cat:"Fontanería",unidad:"tubo",qtdPpto:1,qtdReal:2,precioUnit:18,nota:""},
  {id:15,proyecto:"PRY-006",nombre:"Cinta aislante",cat:"Acabados",unidad:"rollo",qtdPpto:2,qtdReal:4,precioUnit:3.50,nota:"Revisita — más tiempo de trabajo"},
  {id:16,proyecto:"PRY-007",nombre:"Cable Solar 4mm²",cat:"Cableado",unidad:"m",qtdPpto:400,qtdReal:390,precioUnit:0.85,nota:"Algo menos de lo estimado"},
  {id:17,proyecto:"PRY-007",nombre:"Cable Solar 6mm²",cat:"Cableado",unidad:"m",qtdPpto:150,qtdReal:155,precioUnit:1.20,nota:""},
  {id:18,proyecto:"PRY-007",nombre:"Caja de string",cat:"Protecciones",unidad:"ud",qtdPpto:3,qtdReal:3,precioUnit:180,nota:""},
  {id:19,proyecto:"PRY-007",nombre:"Anclajes tejado",cat:"Fijación",unidad:"ud",qtdPpto:200,qtdReal:200,precioUnit:2.80,nota:""},
  {id:20,proyecto:"PRY-008",nombre:"Tubería cobre 18mm",cat:"Fontanería",unidad:"m",qtdPpto:20,qtdReal:24,precioUnit:6.80,nota:"Replanteo sala de máquinas"},
  {id:21,proyecto:"PRY-008",nombre:"Válvulas de corte",cat:"Fontanería",unidad:"ud",qtdPpto:4,qtdReal:4,precioUnit:32,nota:""},
  {id:22,proyecto:"PRY-004",nombre:"Cable Solar 4mm²",cat:"Cableado",unidad:"m",qtdPpto:500,qtdReal:180,precioUnit:0.85,nota:"En ejecución — parcial"},
  {id:23,proyecto:"PRY-004",nombre:"Anclajes cubierta",cat:"Fijación",unidad:"ud",qtdPpto:400,qtdReal:120,precioUnit:2.80,nota:"En ejecución — parcial"},
  {id:24,proyecto:"PRY-005",nombre:"Tubería polietileno reticulado",cat:"Fontanería",unidad:"m",qtdPpto:80,qtdReal:25,precioUnit:5.50,nota:"En ejecución — parcial"},
  {id:25,proyecto:"PRY-005",nombre:"Cable Solar 6mm²",cat:"Cableado",unidad:"m",qtdPpto:200,qtdReal:50,precioUnit:1.20,nota:"En ejecución — parcial"},
];
const INIT_HORAS=[
  {id:1,proyecto:"PRY-001",tecnico:"Luis García",equipo:"Equipo Alpha",fecha:"2025-01-08",horas:8,concepto:"Instalación paneles",incidencia:""},
  {id:2,proyecto:"PRY-001",tecnico:"Pedro Ruiz",equipo:"Equipo Alpha",fecha:"2025-01-09",horas:8,concepto:"Cableado",incidencia:""},
  {id:3,proyecto:"PRY-002",tecnico:"Ana López",equipo:"Equipo Beta",fecha:"2025-01-15",horas:8,concepto:"Instalación paneles",incidencia:""},
  {id:4,proyecto:"PRY-002",tecnico:"Ana López",equipo:"Equipo Beta",fecha:"2025-02-08",horas:8,concepto:"Puesta en marcha",incidencia:"Retraso lluvia"},
  {id:5,proyecto:"PRY-003",tecnico:"Luis García",equipo:"Equipo Alpha",fecha:"2025-01-20",horas:8,concepto:"Aerotermia",incidencia:""},
  {id:6,proyecto:"PRY-004",tecnico:"María Sánchez",equipo:"Equipo Gamma",fecha:"2025-02-03",horas:8,concepto:"Instalación industrial",incidencia:""},
  {id:7,proyecto:"PRY-005",tecnico:"Ana López",equipo:"Equipo Beta",fecha:"2025-02-10",horas:8,concepto:"Inicio instalación",incidencia:""},
  {id:8,proyecto:"PRY-006",tecnico:"Javier Martín",equipo:"Equipo Delta",fecha:"2025-01-14",horas:8,concepto:"Ajuste sistema",incidencia:"Revisita mal ajuste"},
  {id:9,proyecto:"PRY-007",tecnico:"Luis García",equipo:"Equipo Alpha",fecha:"2025-02-17",horas:8,concepto:"Puesta en marcha",incidencia:""},
  {id:10,proyecto:"PRY-008",tecnico:"María Sánchez",equipo:"Equipo Gamma",fecha:"2025-02-01",horas:8,concepto:"Aerotermia industrial",incidencia:""},
];
const INIT_MOVIMIENTOS=[
  {id:1,fecha:"2025-02-17",tipo:"SALIDA",ref:"SOL-001",nombre:"Panel Solar 400W",qty:12,proyecto:"PRY-007",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:2,fecha:"2025-02-10",tipo:"SALIDA",ref:"INV-002",nombre:"Inversor 5kW",qty:2,proyecto:"PRY-005",tecnico:"Ana López",motivo:"Instalación obra"},
  {id:3,fecha:"2025-02-08",tipo:"ENTRADA",ref:"SOL-001",nombre:"Panel Solar 400W",qty:30,proyecto:"-",tecnico:"Almacén",motivo:"Reposición proveedor"},
  {id:4,fecha:"2025-02-03",tipo:"SALIDA",ref:"EST-001",nombre:"Estructura Tejado",qty:4,proyecto:"PRY-004",tecnico:"María Sánchez",motivo:"Instalación obra"},
  {id:5,fecha:"2025-01-28",tipo:"SALIDA",ref:"SOL-002",nombre:"Panel Solar 450W",qty:20,proyecto:"PRY-007",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:6,fecha:"2025-01-28",tipo:"SALIDA",ref:"CAB-001",nombre:"Cable Solar 4mm²",qty:200,proyecto:"PRY-007",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:7,fecha:"2025-01-20",tipo:"SALIDA",ref:"INV-001",nombre:"Inversor 3kW",qty:1,proyecto:"PRY-003",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:8,fecha:"2025-01-20",tipo:"SALIDA",ref:"BAT-001",nombre:"Batería 5kWh",qty:1,proyecto:"PRY-003",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:9,fecha:"2025-01-15",tipo:"ENTRADA",ref:"BAT-002",nombre:"Batería 10kWh",qty:3,proyecto:"-",tecnico:"Almacén",motivo:"Reposición proveedor"},
  {id:10,fecha:"2025-01-15",tipo:"SALIDA",ref:"SOL-002",nombre:"Panel Solar 450W",qty:15,proyecto:"PRY-002",tecnico:"Ana López",motivo:"Instalación obra"},
  {id:11,fecha:"2025-01-08",tipo:"SALIDA",ref:"SOL-001",nombre:"Panel Solar 400W",qty:18,proyecto:"PRY-001",tecnico:"Luis García",motivo:"Instalación obra"},
  {id:12,fecha:"2025-01-05",tipo:"ENTRADA",ref:"CAB-001",nombre:"Cable Solar 4mm²",qty:500,proyecto:"-",tecnico:"Almacén",motivo:"Reposición proveedor"},
  {id:13,fecha:"2024-12-20",tipo:"SALIDA",ref:"EST-002",nombre:"Estructura Plana",qty:5,proyecto:"PRY-002",tecnico:"Ana López",motivo:"Instalación obra"},
  {id:14,fecha:"2024-12-15",tipo:"ENTRADA",ref:"INV-003",nombre:"Inversor 10kW",qty:2,proyecto:"-",tecnico:"Almacén",motivo:"Reposición proveedor"},
  {id:15,fecha:"2024-12-10",tipo:"DEVOLUCION",ref:"SOL-003",nombre:"Panel Bifacial 500W",qty:2,proyecto:"PRY-001",tecnico:"Pedro Ruiz",motivo:"Material sobrante"},
];
const VENTAS_MENSUALES=[
  {mes:"Ene 24",ventas:28500,proyectos:2,margen:19,tipo:"Solar Residencial"},
  {mes:"Feb 24",ventas:14200,proyectos:1,margen:22,tipo:"Aerotermia"},
  {mes:"Mar 24",ventas:42000,proyectos:3,margen:18,tipo:"Solar Industrial"},
  {mes:"Abr 24",ventas:68500,proyectos:4,margen:21,tipo:"Solar Industrial"},
  {mes:"May 24",ventas:95000,proyectos:5,margen:24,tipo:"Solar Industrial"},
  {mes:"Jun 24",ventas:112000,proyectos:6,margen:23,tipo:"Mixto"},
  {mes:"Jul 24",ventas:98000,proyectos:5,margen:20,tipo:"Solar Residencial"},
  {mes:"Ago 24",ventas:45000,proyectos:3,margen:17,tipo:"Aerotermia"},
  {mes:"Sep 24",ventas:78000,proyectos:4,margen:22,tipo:"Solar Industrial"},
  {mes:"Oct 24",ventas:88000,proyectos:5,margen:21,tipo:"Mixto"},
  {mes:"Nov 24",ventas:102000,proyectos:6,margen:20,tipo:"Solar Industrial"},
  {mes:"Dic 24",ventas:71000,proyectos:4,margen:18,tipo:"Calefacción"},
  {mes:"Ene 25",ventas:87500,proyectos:4,margen:16,tipo:"Solar Industrial"},
  {mes:"Feb 25",ventas:52000,proyectos:3,margen:20,tipo:"Aerotermia"},
];
const INIT_CLIENTES=[
  {id:"CLI-001",nombre:"Familia Rodríguez",tipo:"Residencial",subtipo:"Alta",telefono:"612 345 678",email:"rodriguez@email.com",localidad:"Getafe",estado:"activo",proyectos:["PRY-001"],ultimaActividad:"2025-01-15",valorTotal:8500,satisfaccion:5,mantenimiento:true,proxRevision:"2025-07-15",notas:"Cliente satisfecho, posible ampliación en 2025"},
  {id:"CLI-002",nombre:"Comunidad Sta. Ana",tipo:"Comunidad",subtipo:"Nueva Construcción",telefono:"914 567 890",email:"admin@stana.es",localidad:"Alcorcón",estado:"activo",proyectos:["PRY-002"],ultimaActividad:"2025-02-10",valorTotal:22000,satisfaccion:4,mantenimiento:true,proxRevision:"2025-08-01",notas:"Junta directiva muy implicada"},
  {id:"CLI-003",nombre:"José M. Herrera",tipo:"Residencial",subtipo:"Alta",telefono:"623 456 789",email:"jherrera@gmail.com",localidad:"Leganés",estado:"activo",proyectos:["PRY-003"],ultimaActividad:"2025-01-22",valorTotal:9800,satisfaccion:5,mantenimiento:false,proxRevision:"",notas:"Sin contrato de mantenimiento"},
  {id:"CLI-004",nombre:"Nave Industrial López",tipo:"Industrial",subtipo:"Nueva Construcción",telefono:"916 789 012",email:"info@navelopez.com",localidad:"Majadahonda",estado:"en_obra",proyectos:["PRY-004"],ultimaActividad:"2025-02-03",valorTotal:35000,satisfaccion:0,mantenimiento:true,proxRevision:"2026-01-01",notas:"Proyecto en ejecución, gran cliente potencial"},
  {id:"CLI-005",nombre:"Hotel Mediterráneo",tipo:"Hostelería",subtipo:"Alta",telefono:"918 901 234",email:"tecnico@hotelmed.es",localidad:"Fuenlabrada",estado:"en_obra",proyectos:["PRY-005"],ultimaActividad:"2025-02-10",valorTotal:48000,satisfaccion:0,mantenimiento:true,proxRevision:"2026-03-01",notas:"Instalación mixta solar+aerotermia"},
  {id:"CLI-006",nombre:"Clínica Dental Pérez",tipo:"Comercial",subtipo:"Alta",telefono:"914 123 456",email:"clinica@perez.es",localidad:"Móstoles",estado:"incidencia",proyectos:["PRY-006"],ultimaActividad:"2025-01-20",valorTotal:7200,satisfaccion:2,mantenimiento:true,proxRevision:"2025-04-01",notas:"Revisita pendiente por ajuste sistema"},
  {id:"CLI-007",nombre:"Polideportivo Municipal",tipo:"Público",subtipo:"Nueva Construcción",telefono:"917 234 567",email:"obras@pozuelo.es",localidad:"Pozuelo",estado:"activo",proyectos:["PRY-007"],ultimaActividad:"2025-02-20",valorTotal:28000,satisfaccion:5,mantenimiento:true,proxRevision:"2025-08-15",notas:"Ayuntamiento, posibles más contratos"},
  {id:"CLI-008",nombre:"Residencia 3ª Edad",tipo:"Sociosanitario",subtipo:"Alta",telefono:"918 345 678",email:"director@residencia.es",localidad:"Alcalá",estado:"activo",proyectos:["PRY-008"],ultimaActividad:"2025-02-12",valorTotal:12000,satisfaccion:4,mantenimiento:true,proxRevision:"2025-09-01",notas:"Contrato anual de mantenimiento"},
  {id:"CLI-009",nombre:"Chalet García-Vega",tipo:"Residencial",subtipo:"Presupuesto",telefono:"634 567 890",email:"garcíavega@gmail.com",localidad:"Boadilla",estado:"prospecto",proyectos:["PRY-009"],ultimaActividad:"2025-02-25",valorTotal:11000,satisfaccion:0,mantenimiento:false,proxRevision:"",notas:"Pendiente confirmación presupuesto"},
  {id:"CLI-010",nombre:"Fábrica Textil Norte",tipo:"Industrial",subtipo:"Presupuesto",telefono:"916 678 901",email:"mantenimiento@textilnorte.es",localidad:"Torrejón",estado:"prospecto",proyectos:["PRY-010"],ultimaActividad:"2025-03-01",valorTotal:52000,satisfaccion:0,mantenimiento:false,proxRevision:"",notas:"Proyecto grande, decisión en Q2 2025"},
  {id:"CLI-011",nombre:"Centro Comercial Prados",tipo:"Comercial",subtipo:"Mantenimiento",telefono:"917 890 123",email:"fm@prados.es",localidad:"Alcobendas",estado:"mantenimiento",proyectos:[],ultimaActividad:"2025-01-10",valorTotal:4800,satisfaccion:4,mantenimiento:true,proxRevision:"2025-05-10",notas:"Solo contrato mantenimiento, sin nueva instalación"},
  {id:"CLI-012",nombre:"Academia Idiomas Sol",tipo:"Comercial",subtipo:"Mantenimiento",telefono:"912 345 678",email:"info@academiasol.es",localidad:"Madrid",estado:"mantenimiento",proyectos:[],ultimaActividad:"2024-11-15",valorTotal:3200,satisfaccion:3,mantenimiento:true,proxRevision:"2025-05-15",notas:"Revisión pendiente de programar"},
];

// ─── COLORES AFC ──────────────────────────────────────────────────────────────
const C={
  bg:"#050f0a",bg2:"#081508",bg3:"#0d1f10",
  teal:"#0e7fa3",teal2:"#0d9abf",teal3:"#0a4f65",
  green:"#3da83c",green2:"#52c450",green3:"#1f6b1e",
  greenLeaf:"#4ab83e",accent:"#7ed956",
  yellow:"#f5c518",red:"#e85050",orange:"#f97316",
  text:"#e8f5e9",muted:"#6aad7a",border:"#1a3d20",
  card:"#0a1c0b",white:"#f0faf1",
};
const TIPO_COLORS={"Solar Residencial":C.teal2,"Solar Industrial":C.green,"Aerotermia":"#f59e0b","Calefacción":C.red,"Mixto Solar+Aero":C.accent,"Mixto":"#a78bfa"};
const EQ_COLORS={"Equipo Alpha":C.teal2,"Equipo Beta":C.greenLeaf,"Equipo Gamma":"#f59e0b","Equipo Delta":"#a78bfa"};
const CLI_TIPO_C={"Residencial":C.teal2,"Industrial":C.green2,"Comercial":C.yellow,"Hostelería":"#f97316","Público":"#a78bfa","Comunidad":C.greenLeaf,"Sociosanitario":"#ec4899"};
const CLI_ESTADO_C={"activo":C.green2,"en_obra":C.teal2,"incidencia":C.red,"prospecto":C.yellow,"mantenimiento":"#a78bfa","baja":"#6b7280"};
const fmt=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n||0);
const fnum=n=>new Intl.NumberFormat("es-ES").format(n||0);

// ─── LOGO AFC ─────────────────────────────────────────────────────────────────
function AFCLogo({size=42,full=false}){
  const h=size,w=full?size*4.2:size;
  return(
    <svg width={w} height={h} viewBox={`0 0 ${full?210:h} ${h}`} fill="none">
      {full&&<>
        <text x="0" y={h*0.78} fontFamily="Arial,sans-serif" fontWeight="800" fontSize={h*0.72} fill={C.teal}>AFC</text>
        <text x={h*2.15} y={h*0.95} fontFamily="Arial,sans-serif" fontWeight="400" fontSize={h*0.28} fill={C.teal} letterSpacing="1">renovables</text>
      </>}
      <g transform={`translate(${full?h*2.75:0},0)`}>
        <rect x={h*0.05} y={h*0.34} width={h*0.28} height={h*0.1} rx={h*0.04} fill={C.greenLeaf}/>
        <rect x={h*0.05} y={h*0.52} width={h*0.28} height={h*0.1} rx={h*0.04} fill={C.greenLeaf}/>
        <path d={`M${h*0.42} ${h*0.55} Q${h*0.35} ${h*0.2} ${h*0.62} ${h*0.08} Q${h*0.68} ${h*0.35} ${h*0.58} ${h*0.55} Z`} fill={C.green}/>
        <path d={`M${h*0.58} ${h*0.48} Q${h*0.72} ${h*0.15} ${h*0.92} ${h*0.22} Q${h*0.88} ${h*0.48} ${h*0.65} ${h*0.58} Z`} fill={C.greenLeaf}/>
        <path d={`M${h*0.52} ${h*0.55} Q${h*0.5} ${h*0.72} ${h*0.48} ${h*0.9}`} stroke={C.green} strokeWidth={h*0.06} strokeLinecap="round" fill="none"/>
        <path d={`M${h*0.5} ${h*0.7} Q${h*0.62} ${h*0.68} ${h*0.7} ${h*0.62}`} stroke={C.greenLeaf} strokeWidth={h*0.045} strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  );
}

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────
function Tooltip({visible,x,y,children}){
  if(!visible)return null;
  return(
    <div style={{position:"fixed",left:Math.min(x+14,window.innerWidth-250),top:Math.max(y-8,8),zIndex:9999,background:"rgba(5,20,8,0.97)",border:`1px solid ${C.green3}`,borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",pointerEvents:"none",minWidth:175,maxWidth:250}}>
      {children}
    </div>
  );
}

// ─── BARCHART ─────────────────────────────────────────────────────────────────
function BarChart({data,color,height=160,title,subtitle,fmtFn,unit="",highlight}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const maxVal=Math.max(...data.map(d=>d.v),1);
  return(
    <div style={{position:"relative",overflowX:"auto"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3,color:C.text}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.64rem",color:C.muted,marginBottom:10}}>{subtitle}</div>}
      <div style={{display:"flex",alignItems:"flex-end",gap:5,height:height+30,minWidth:300}} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
        {data.map((d,i)=>{
          const barH=Math.max((d.v/maxVal)*(height-20),2);
          const isH=hover===i;
          const isTop=highlight&&d.v===Math.max(...data.map(x=>x.v));
          const barColor=d.color||(isTop?"#fbbf24":color||C.green);
          return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"}} onMouseEnter={()=>setHover(i)}>
              {isTop&&!isH&&<div style={{fontSize:"0.52rem",color:"#fbbf24",fontWeight:700}}>★</div>}
              {!isTop&&<div style={{height:14}}/>}
              <div style={{width:"100%",height:height-4,display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",height:barH,background:isH?`linear-gradient(to top,${barColor},${C.accent})`:`linear-gradient(to top,${barColor}99,${barColor}55)`,borderRadius:"4px 4px 0 0",transition:"height 0.5s,background 0.15s",boxShadow:isH?`0 0 12px ${barColor}70`:isTop?`0 0 6px ${"#fbbf24"}50`:""}}/>
              </div>
              <div style={{fontSize:"0.57rem",color:isH||isTop?C.text:C.muted,textAlign:"center",lineHeight:1.2,fontWeight:isH||isTop?700:400,maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.l}</div>
            </div>
          );
        })}
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.82rem",marginBottom:5,color:color||C.green2}}>{data[hover].l}</div>
          <div style={{fontSize:"1.2rem",fontWeight:800,color:C.white}}>{fmtFn?fmtFn(data[hover].v):`${data[hover].v}${unit}`}</div>
          {data[hover].sub&&<div style={{fontSize:"0.68rem",color:C.muted,marginTop:3}}>{data[hover].sub}</div>}
          {data[hover].extra&&data[hover].extra.map((e,i)=><div key={i} style={{fontSize:"0.67rem",color:C.muted,marginTop:2}}>· {e}</div>)}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── LINECHART ────────────────────────────────────────────────────────────────
function LineChart({data,color,height=130,title,subtitle,fmtFn,color2,data2,label2}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const svgRef=useRef(null);
  const W=500,H=height;// mobile scroll
  const maxV=Math.max(...data.map(d=>d.v),...(data2||[]).map(d=>d.v),1);
  const px=i=>data.length>1?(i/(data.length-1))*(W-40)+20:W/2;
  const py=v=>H-16-((v)/(maxV||1))*(H-32);
  const pathD=data.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d.v)}`).join(" ");
  const areaD=`${pathD} L${px(data.length-1)},${H-16} L${px(0)},${H-16} Z`;
  const pathD2=data2&&data2.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d.v)}`).join(" ");
  return(
    <div style={{position:"relative",overflowX:"auto"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3,color:C.text}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.64rem",color:C.muted,marginBottom:8}}>{subtitle}</div>}
      {(color2&&label2)&&<div style={{display:"flex",gap:14,marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.65rem",color:C.muted}}><div style={{width:20,height:2,background:color||C.green}}/>{title&&""}</div>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.65rem",color:C.muted}}><div style={{width:20,height:2,background:color2,borderTop:"1px dashed "+color2}}/>{label2}</div>
      </div>}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H,overflow:"visible",cursor:"crosshair"}}
        onMouseMove={e=>{const r=svgRef.current?.getBoundingClientRect();if(!r)return;const relX=(e.clientX-r.left)/r.width*W;const idx=Math.round(((relX-20)/(W-40))*(data.length-1));setHover(Math.max(0,Math.min(data.length-1,idx)));setMouse({x:e.clientX,y:e.clientY});}}
        onMouseLeave={()=>setHover(null)}>
        <defs>
          <linearGradient id={`la${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color||C.green} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color||C.green} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {[0,0.5,1].map((t,i)=><line key={i} x1="20" y1={py(maxV*t)} x2={W-20} y2={py(maxV*t)} stroke={C.border} strokeWidth="0.5" strokeDasharray="3,4"/>)}
        <path d={areaD} fill={`url(#la${title})`}/>
        <path d={pathD} fill="none" stroke={color||C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pathD2&&<path d={pathD2} fill="none" stroke={color2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,3"/>}
        {data.map((d,i)=>(
          <g key={i}>
            <circle cx={px(i)} cy={py(d.v)} r={hover===i?6:3} fill={hover===i?C.white:color||C.green} stroke={color||C.green} strokeWidth="2" style={{transition:"r 0.1s"}}/>
            <text x={px(i)} y={H-2} textAnchor="middle" fill={hover===i?C.text:C.muted} fontSize="9" fontFamily="monospace">{d.l}</text>
          </g>
        ))}
        {hover!==null&&<line x1={px(hover)} y1={16} x2={px(hover)} y2={H-16} stroke={color||C.green} strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>}
      </svg>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.8rem",marginBottom:4,color:C.muted}}>{data[hover].l}</div>
          <div style={{fontSize:"1.25rem",fontWeight:800,color:color||C.green2}}>{fmtFn?fmtFn(data[hover].v):data[hover].v}</div>
          {hover>0&&<div style={{fontSize:"0.64rem",color:data[hover].v>=data[hover-1].v?C.green2:C.red,marginTop:3}}>{data[hover].v>=data[hover-1].v?"▲":"▼"} {Math.abs(Math.round(((data[hover].v-data[hover-1].v)/data[hover-1].v)*100))}% vs anterior</div>}
          {data[hover].sub&&<div style={{fontSize:"0.67rem",color:C.muted,marginTop:3}}>{data[hover].sub}</div>}
          {data2&&data2[hover]&&<div style={{fontSize:"0.67rem",color:color2||C.muted,marginTop:3}}>{label2}: {data2[hover].v}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── DONUT ────────────────────────────────────────────────────────────────────
function DonutInteractive({segments,size=130,thickness=20,title}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const total=segments.reduce((s,sg)=>s+sg.value,0)||1;
  const r=(size-thickness*2)/2,cx=size/2,cy=size/2,circum=2*Math.PI*r;
  let offset=0;
  const slices=segments.map((sg,i)=>{const dash=(sg.value/total)*circum;const s={dash,offset,color:sg.color,pct:Math.round((sg.value/total)*100),sg,i};offset+=dash;return s;});
  return(
    <div style={{position:"relative",display:"flex",gap:14,alignItems:"center"}}>
      <svg width={size} height={size} style={{cursor:"pointer",flexShrink:0}} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg3} strokeWidth={thickness+4}/>
        {slices.map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r+(hover===i?3:0)} fill="none" stroke={s.color} strokeWidth={hover===i?thickness+3:thickness}
            strokeDasharray={`${s.dash} ${circum-s.dash}`} strokeDashoffset={circum/4-s.offset}
            style={{transition:"r 0.15s",cursor:"pointer",filter:hover===i?`drop-shadow(0 0 8px ${s.color})`:"none"}}
            onMouseEnter={()=>setHover(i)}/>
        ))}
        <text x={cx} y={cy-5} textAnchor="middle" fill={hover!==null?slices[hover]?.color:C.text} fontSize="18" fontWeight="800" fontFamily="monospace">{hover!==null?`${slices[hover]?.pct}%`:total}</text>
        <text x={cx} y={cy+13} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace">{hover!==null?"del total":title||"total"}</text>
      </svg>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
        {segments.map((sg,i)=>(
          <div key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",opacity:hover!==null&&hover!==i?0.35:1,transition:"opacity 0.15s"}}>
            <div style={{width:9,height:9,borderRadius:2,background:sg.color,flexShrink:0,boxShadow:hover===i?`0 0 6px ${sg.color}`:""}}/>
            <div style={{flex:1,fontSize:"0.73rem"}}>{sg.label}</div>
            <div style={{fontFamily:"monospace",fontSize:"0.7rem",color:sg.color,fontWeight:700}}>{sg.value}</div>
          </div>
        ))}
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&<>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><div style={{width:9,height:9,borderRadius:2,background:slices[hover]?.color}}/><div style={{fontWeight:700,color:slices[hover]?.color}}>{slices[hover]?.sg.label}</div></div>
          <div style={{fontSize:"1.4rem",fontWeight:800,color:C.white}}>{slices[hover]?.pct}%</div>
          <div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>{slices[hover]?.sg.value} de {total}</div>
          {slices[hover]?.sg.facturado&&<div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>Facturado: {fmt(slices[hover].sg.facturado)}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── HBAR ─────────────────────────────────────────────────────────────────────
function HBarChart({data,title,subtitle,fmtFn}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const maxVal=Math.max(...data.map(d=>Math.abs(d.v)),1);
  return(
    <div onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
      {title&&<div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.64rem",color:C.muted,marginBottom:10}}>{subtitle}</div>}
      {data.map((d,i)=>{
        const barW=Math.min((Math.abs(d.v)/maxVal)*90,90);
        const col=d.color||(d.v<0?C.red:d.v>20?C.green2:C.teal);
        const isH=hover===i;
        return(
          <div key={i} onMouseEnter={()=>setHover(i)} style={{display:"grid",gridTemplateColumns:"90px 1fr 55px",alignItems:"center",gap:8,marginBottom:9,cursor:"pointer"}}>
            <div style={{fontSize:"0.72rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:isH?C.text:C.muted,fontWeight:isH?600:400}}>{d.l}</div>
            <div style={{height:isH?9:6,background:C.bg3,borderRadius:3,overflow:"hidden",transition:"height 0.15s"}}>
              <div style={{height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,${col},${col}99)`,borderRadius:3,transition:"width 0.6s"}}/>
            </div>
            <div style={{fontFamily:"monospace",fontSize:"0.72rem",color:col,fontWeight:700,textAlign:"right"}}>{fmtFn?fmtFn(d.v):`${d.v}%`}</div>
          </div>
        );
      })}
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.82rem",marginBottom:5,color:data[hover].color||(data[hover].v<0?C.red:C.green2)}}>{data[hover].l}</div>
          <div style={{fontSize:"1.2rem",fontWeight:800,color:C.white}}>{fmtFn?fmtFn(data[hover].v):`${data[hover].v}%`}</div>
          {data[hover].sub&&<div style={{fontSize:"0.68rem",color:C.muted,marginTop:3}}>{data[hover].sub}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── SCATTER ──────────────────────────────────────────────────────────────────
function ScatterPlot({data,title,subtitle}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const W=500,H=180;
  const maxX=Math.max(...data.map(d=>d.x),1),maxY=Math.max(...data.map(d=>Math.abs(d.y)),1);
  const px=v=>30+(v/maxX)*(W-50),py=v=>H/2-((v)/maxY)*(H/2-20);
  return(
    <div style={{position:"relative",overflowX:"auto"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.64rem",color:C.muted,marginBottom:8}}>{subtitle}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H,cursor:"crosshair"}} onMouseLeave={()=>setHover(null)} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})}>
        <line x1="30" y1={H/2} x2={W-20} y2={H/2} stroke={C.border} strokeWidth="1"/>
        <line x1="30" y1="10" x2="30" y2={H-10} stroke={C.border} strokeWidth="1"/>
        {data.map((d,i)=>{const col=d.y<0?C.red:d.y>20?C.green2:C.teal;return(
          <g key={i} onMouseEnter={()=>setHover(i)} style={{cursor:"pointer"}}>
            <circle cx={px(d.x)} cy={py(d.y)} r={hover===i?9:6} fill={col} opacity={hover!==null&&hover!==i?0.25:0.85} stroke={hover===i?C.white:"none"} strokeWidth="2" style={{transition:"r 0.1s,opacity 0.15s"}}/>
            <text x={px(d.x)} y={py(d.y)-11} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace" opacity={hover===i?1:0.4}>{d.id}</text>
          </g>
        );})}
      </svg>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,color:C.text,marginBottom:5}}>{data[hover].label}</div>
          <div style={{display:"flex",gap:14,fontSize:"0.76rem"}}>
            <div><div style={{color:C.muted,fontSize:"0.6rem"}}>PRESUPUESTO</div><div style={{color:C.white,fontWeight:700}}>{fmt(data[hover].x)}</div></div>
            <div><div style={{color:C.muted,fontSize:"0.6rem"}}>MARGEN</div><div style={{color:data[hover].y<0?C.red:C.green2,fontWeight:700}}>{data[hover].y}%</div></div>
          </div>
          {data[hover].equipo&&<div style={{fontSize:"0.66rem",color:C.muted,marginTop:4}}>{data[hover].equipo}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── STATCARD ─────────────────────────────────────────────────────────────────
function StatCard({icon,label,value,sub,color,trend,trendOk}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 15px",position:"relative",overflow:"hidden",transition:"transform 0.2s,border-color 0.2s",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=C.green3;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=C.border;}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color||C.teal},transparent)`}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
        <div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</div>
        {icon&&<span style={{fontSize:"0.9rem",opacity:0.7}}>{icon}</span>}
      </div>
      <div style={{fontSize:"1.5rem",fontWeight:800,color:color||C.text,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:"0.59rem",color:C.muted,marginTop:4,fontFamily:"monospace"}}>{sub}</div>}
      {trend&&<div style={{fontSize:"0.59rem",color:trendOk?C.green2:C.red,marginTop:3,fontFamily:"monospace"}}>{trendOk?"▲":"▼"} {trend}</div>}
    </div>
  );
}

function STitle({icon,children,badge}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14,marginTop:6}}>
      {icon&&<span style={{fontSize:"0.9rem"}}>{icon}</span>}
      <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.teal,textTransform:"uppercase",letterSpacing:"0.2em",fontWeight:700}}>{children}</span>
      {badge&&<span style={{background:C.green3,color:C.greenLeaf,padding:"1px 8px",borderRadius:4,fontFamily:"monospace",fontSize:"0.55rem"}}>{badge}</span>}
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
    </div>
  );
}

// ─── ESTRELLAS ────────────────────────────────────────────────────────────────
function Stars({n}){
  return(<span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?C.yellow:C.border,fontSize:"0.75rem"}}>★</span>)}</span>);
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB DASHBOARD — CON VENTAS MENSUALES
// ══════════════════════════════════════════════════════════════════════════════
function TabDashboard({projects,stock,horas,clientes,ventasMensuales}){const W=useW();const M=W<768;const T=W<1100;
  const completados=projects.filter(p=>p.estado==="completado");
  const enEjecucion=projects.filter(p=>p.estado==="ejecucion");
  const enPpto=projects.filter(p=>p.estado==="presupuesto");
  const totalFact=completados.reduce((s,p)=>s+p.presupuesto,0);
  const totalCost=completados.reduce((s,p)=>s+p.gastado,0);
  const mgArr=completados.filter(p=>p.margen!==0);
  const margenMedio=mgArr.length?Math.round(mgArr.reduce((s,p)=>s+p.margen,0)/mgArr.length):0;
  const enRiesgo=projects.filter(p=>p.margen<0);
  const valorStock=stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);
  const stockBajo=stock.filter(s=>s.qty<s.qtyMin);
  const totalHoras=horas.reduce((s,h)=>s+h.horas,0);
  const ticketMedio=completados.length?Math.round(totalFact/completados.length):0;
  const pipeline=enPpto.reduce((s,p)=>s+p.presupuesto,0);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const tipos=[...new Set(projects.map(p=>p.tipo))].filter(Boolean);

  // Ventas mensuales — análisis estacionalidad
  const maxVenta=Math.max(...ventasMensuales.map(v=>v.ventas));
  const mesMasAlto=ventasMensuales.find(v=>v.ventas===maxVenta);
  const totalAnual=ventasMensuales.reduce((s,v)=>s+v.ventas,0);
  const mediasMensuales=Math.round(totalAnual/ventasMensuales.length);
  const mesesSobreMedia=ventasMensuales.filter(v=>v.ventas>mediasMensuales).length;

  // Tendencia: comparar últimos 3 vs anteriores 3
  const ult3=ventasMensuales.slice(-3).reduce((s,v)=>s+v.ventas,0)/3;
  const ant3=ventasMensuales.slice(-6,-3).reduce((s,v)=>s+v.ventas,0)/3;
  const tendencia=ant3>0?Math.round(((ult3-ant3)/ant3)*100):0;

  return(
    <div>
      {enRiesgo.length>0&&<div style={{background:"rgba(232,80,80,0.08)",border:"1px solid rgba(232,80,80,0.3)",borderRadius:10,padding:"9px 14px",marginBottom:10,fontSize:"0.75rem"}}><span style={{color:C.red,fontWeight:700}}>⚠️ Margen negativo: </span><span style={{color:C.muted}}>{enRiesgo.map(p=>`${p.id}(${p.margen}%)`).join(" · ")}</span></div>}
      {stockBajo.length>0&&<div style={{background:"rgba(245,197,24,0.07)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:"0.75rem"}}><span style={{color:C.yellow,fontWeight:700}}>📦 Stock bajo mínimo: </span><span style={{color:C.muted}}>{stockBajo.map(s=>`${s.ref}(${s.qty}/${s.qtyMin})`).join(" · ")}</span></div>}

      <STitle icon="📊">Resumen Ejecutivo</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:12}}>
        <StatCard icon="🏗️" label="Proyectos Totales" value={projects.length} sub={`${completados.length} completados · ${enEjecucion.length} activos`} color={C.teal2}/>
        <StatCard icon="💶" label="Facturación Total" value={fmt(totalFact)} color={C.green2} trend={`${tendencia>0?"+":""}${tendencia}% tendencia`} trendOk={tendencia>=0}/>
        <StatCard icon="📈" label="Margen Medio" value={`${margenMedio}%`} color={margenMedio>20?C.green2:margenMedio>0?C.yellow:C.red}/>
        <StatCard icon="🎯" label="Ticket Medio" value={fmt(ticketMedio)} color={C.teal2}/>
        <StatCard icon="💼" label="Pipeline" value={fmt(pipeline)} sub={`${enPpto.length} presupuestos`} color={C.yellow}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
        <StatCard icon="📦" label="Valor Almacén" value={fmt(valorStock)} sub={stockBajo.length>0?`⚠ ${stockBajo.length} bajo mín.`:"Stock OK"} color={C.yellow}/>
        <StatCard icon="⏱️" label="Horas MO" value={`${fnum(totalHoras)}h`} color={C.greenLeaf}/>
        <StatCard icon="👤" label="Clientes" value={clientes.filter(c=>c.estado==="activo").length} sub={`${clientes.filter(c=>c.mantenimiento).length} con mantenimiento`} color={C.teal}/>
        <StatCard icon="⭐" label="Satisfacción" value={`${(clientes.filter(c=>c.satisfaccion>0).reduce((s,c)=>s+c.satisfaccion,0)/Math.max(clientes.filter(c=>c.satisfaccion>0).length,1)).toFixed(1)}/5`} color={C.yellow}/>
        <StatCard icon="💰" label="Coste Total" value={fmt(totalCost)} sub={`${Math.round((totalCost/totalFact)*100)||0}% del facturado`} color={C.muted}/>
      </div>

      {/* VENTAS MENSUALES */}
      <STitle icon="📅">Ventas Mensuales — Análisis de Estacionalidad</STitle>

      {/* KPIs de ventas */}
      <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 16px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,#fbbf24,transparent)`}}/>
          <div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:5}}>⭐ Mes Estrella</div>
          <div style={{fontSize:"1.3rem",fontWeight:800,color:"#fbbf24"}}>{mesMasAlto?.mes}</div>
          <div style={{fontSize:"0.6rem",color:C.muted,marginTop:3,fontFamily:"monospace"}}>{fmt(mesMasAlto?.ventas)} · {mesMasAlto?.proyectos} proyectos</div>
        </div>
        <StatCard icon="📊" label="Total Período" value={fmt(totalAnual)} sub={`${ventasMensuales.length} meses registrados`} color={C.green2}/>
        <StatCard icon="📈" label="Media Mensual" value={fmt(mediasMensuales)} sub={`${mesesSobreMedia} meses sobre la media`} color={C.teal2}/>
        <StatCard icon="📉" label="Tendencia Reciente" value={`${tendencia>0?"+":""}${tendencia}%`} sub="últimos 3 vs anteriores 3 meses" color={tendencia>=0?C.green2:C.red} trend={tendencia>=0?"Creciendo":"Bajando"} trendOk={tendencia>=0}/>
      </div>

      {/* Gráfico principal ventas + línea media */}
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:20}}>
          <BarChart
            title="💶 Facturación Mensual (14 meses)"
            subtitle="★ Mes más alto marcado en amarillo — pasa el ratón para ver detalle"
            data={ventasMensuales.map(v=>({l:v.mes,v:v.ventas,sub:`${v.proyectos} proyectos cerrados`,extra:[`Margen: ${v.margen}%`]}))}
            color={C.green} fmtFn={fmt} height={150} highlight/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:20}}>
          <LineChart
            title="📊 Margen Mensual (%)"
            subtitle="Evolución del margen bruto por mes"
            data={ventasMensuales.map(v=>({l:v.mes,v:v.margen,sub:`${v.proyectos} proyectos`}))}
            color={C.teal2} height={150}/>
        </div>
      </div>

      {/* Análisis estacional */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>🌡️ Mapa de Calor Mensual</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Intensidad = volumen de ventas relativo</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {ventasMensuales.slice(0,12).map((v,i)=>{
              const intens=v.ventas/maxVenta;
              const col=intens>0.85?"#fbbf24":intens>0.65?C.green2:intens>0.4?C.teal2:C.border;
              return(
                <div key={i} style={{background:`${col}${intens>0.85?"40":intens>0.65?"28":intens>0.4?"18":"10"}`,border:`1px solid ${col}50`,borderRadius:6,padding:"7px",textAlign:"center"}}>
                  <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:col,fontWeight:700}}>{v.mes}</div>
                  <div style={{fontSize:"0.65rem",color:C.muted,marginTop:2}}>{Math.round(intens*100)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>📊 Proyectos vs Facturación</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Hover para ver ambas métricas</div>
          <BarChart
            data={ventasMensuales.slice(-7).map(v=>({l:v.mes,v:v.proyectos,sub:fmt(v.ventas),extra:[`Margen: ${v.margen}%`]}))}
            color={C.teal2} height={110} unit=" proy."/>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>🏗️ Por Tipo de Instalación</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Hover para facturado y margen</div>
          <DonutInteractive title="total" size={110} thickness={16}
            segments={tipos.map(t=>({label:t,value:projects.filter(p=>p.tipo===t).length,color:TIPO_COLORS[t]||C.teal,facturado:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0)}))}/>
        </div>
      </div>

      {/* Equipos + Tabla reciente */}
      <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <HBarChart title="👥 Margen por Equipo" subtitle="Media proyectos completados — hover para horas"
            data={equipos.map(eq=>({l:eq.replace("Equipo ",""),v:completados.filter(p=>p.equipo===eq&&p.margen!==0).length?Math.round(completados.filter(p=>p.equipo===eq&&p.margen!==0).reduce((s,p)=>s+p.margen,0)/completados.filter(p=>p.equipo===eq&&p.margen!==0).length):0,color:EQ_COLORS[eq],sub:`${completados.filter(p=>p.equipo===eq).length} proyectos · ${horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0)}h`}))}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:10}}>📋 Proyectos Recientes</div>
          <table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Cliente","Estado","Margen"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"4px 7px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{projects.slice(0,7).map(p=>{const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow,parado:C.red}[p.estado]||C.muted;return(<tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}15`} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"6px 7px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{p.id}</td><td style={{padding:"6px 7px",fontSize:"0.75rem",fontWeight:500}}>{p.cliente.split(" ").slice(0,2).join(" ")}</td><td style={{padding:"6px 7px"}}><span style={{background:`${ec}18`,color:ec,padding:"1px 5px",borderRadius:4,fontFamily:"monospace",fontSize:"0.5rem",textTransform:"uppercase"}}>{p.estadoLabel.split(" ")[0]}</span></td><td style={{padding:"6px 7px",fontFamily:"monospace",fontWeight:700,fontSize:"0.72rem",color:p.margen<0?C.red:p.margen>0?C.green2:C.muted}}>{p.gastado||p.estado==="completado"?`${p.margen}%`:"—"}</td></tr>);})}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB CLIENTES
// ══════════════════════════════════════════════════════════════════════════════
function TabClientes({clientes,projects}){const W=useW();const M=W<768;
  const [filtro,setFiltro]=useState("all");
  const [sel,setSel]=useState(null);
  const [vista,setVista]=useState("cards");

  const activos=clientes.filter(c=>c.estado==="activo");
  const enObra=clientes.filter(c=>c.estado==="en_obra");
  const prospectos=clientes.filter(c=>c.estado==="prospecto");
  const mantenimiento=clientes.filter(c=>c.estado==="mantenimiento");
  const incidencias=clientes.filter(c=>c.estado==="incidencia");
  const conMantto=clientes.filter(c=>c.mantenimiento);
  const valorTotal=clientes.reduce((s,c)=>s+c.valorTotal,0);
  const valorMantto=conMantto.reduce((s,c)=>s+c.valorTotal*0.08,0);
  const satMedia=clientes.filter(c=>c.satisfaccion>0);
  const satProm=satMedia.length?satMedia.reduce((s,c)=>s+c.satisfaccion,0)/satMedia.length:0;

  const proxRevisiones=clientes.filter(c=>c.proxRevision&&c.proxRevision>"2025-03-01").sort((a,b)=>a.proxRevision.localeCompare(b.proxRevision)).slice(0,5);

  const filtered=filtro==="all"?clientes
    :filtro==="activo"?activos
    :filtro==="en_obra"?enObra
    :filtro==="prospecto"?prospectos
    :filtro==="mantenimiento"?mantenimiento
    :filtro==="incidencia"?incidencias
    :clientes.filter(c=>c.tipo===filtro);

  const tipos=[...new Set(clientes.map(c=>c.tipo))].filter(Boolean);

  return(
    <div>
      <STitle icon="👤">KPIs de Clientes</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:20}}>
        <StatCard icon="👤" label="Total Clientes" value={clientes.length} sub={`${activos.length} activos`} color={C.teal2}/>
        <StatCard icon="🔨" label="En Obra" value={enObra.length} sub="proyectos activos" color={C.teal}/>
        <StatCard icon="🔧" label="Mantenimiento" value={conMantto.length} sub={`${fmt(valorMantto)}/año est.`} color={C.greenLeaf}/>
        <StatCard icon="🎯" label="Prospectos" value={prospectos.length} sub={`Pipeline: ${fmt(prospectos.reduce((s,c)=>s+c.valorTotal,0))}`} color={C.yellow}/>
        <StatCard icon="⚠️" label="Incidencias" value={incidencias.length} sub="requieren atención" color={incidencias.length>0?C.red:C.green2}/>
        <StatCard icon="⭐" label="Satisfacción" value={`${satProm.toFixed(1)}/5`} sub={`${satMedia.length} clientes valorados`} color={satProm>=4?C.green2:satProm>=3?C.yellow:C.red}/>
      </div>

      {/* Próximas revisiones + Distribución */}
      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:14,marginBottom:18}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>📅 Próximas Revisiones de Mantenimiento</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Ordenadas por fecha</div>
          {proxRevisiones.length>0?proxRevisiones.map((c,i)=>{
            const dias=Math.round((new Date(c.proxRevision)-new Date("2025-03-09"))/(1000*60*60*24));
            const urgColor=dias<30?C.red:dias<60?C.yellow:C.green2;
            return(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}10`}}>
                <div>
                  <div style={{fontSize:"0.77rem",fontWeight:600}}>{c.nombre}</div>
                  <div style={{fontSize:"0.62rem",color:C.muted,marginTop:1}}>{c.tipo} · {c.localidad}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"monospace",fontSize:"0.68rem",color:urgColor,fontWeight:700}}>{c.proxRevision}</div>
                  <div style={{fontSize:"0.58rem",color:urgColor,marginTop:1}}>{dias<0?"Vencida":dias===0?"Hoy":dias+" días"}</div>
                </div>
              </div>
            );
          }):<div style={{color:C.muted,fontSize:"0.75rem",textAlign:"center",padding:"14px 0"}}>Sin revisiones programadas</div>}
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>🍩 Por Tipo de Cliente</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Hover para ver valoración y volumen</div>
          <DonutInteractive title="clientes" size={110} thickness={16}
            segments={tipos.map(t=>({label:t,value:clientes.filter(c=>c.tipo===t).length,color:CLI_TIPO_C[t]||C.teal,facturado:clientes.filter(c=>c.tipo===t).reduce((s,c)=>s+c.valorTotal,0)}))}/>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>📊 Estado de la Cartera</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Distribución actual</div>
          <DonutInteractive title="estado" size={110} thickness={16}
            segments={[
              {label:"Activos",value:activos.length,color:C.green2},
              {label:"En Obra",value:enObra.length,color:C.teal2},
              {label:"Mantenimiento",value:mantenimiento.length,color:"#a78bfa"},
              {label:"Prospectos",value:prospectos.length,color:C.yellow},
              {label:"Incidencias",value:incidencias.length,color:C.red},
            ].filter(s=>s.value>0)}/>
        </div>
      </div>

      {/* Filtros y vista */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[{v:"all",l:"Todos"},
            {v:"activo",l:`✅ Activos (${activos.length})`},
            {v:"en_obra",l:`🔨 En Obra (${enObra.length})`},
            {v:"mantenimiento",l:`🔧 Mantto. (${mantenimiento.length})`},
            {v:"prospecto",l:`🎯 Prospectos (${prospectos.length})`},
            {v:"incidencia",l:`⚠️ Incidencias (${incidencias.length})`},
          ].map(o=>(
            <button key={o.v} onClick={()=>setFiltro(o.v)} style={{background:filtro===o.v?C.green3:"transparent",color:filtro===o.v?C.green2:C.muted,border:`1px solid ${filtro===o.v?C.green3:C.border}`,padding:"5px 11px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.59rem",textTransform:"uppercase"}}>{o.l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:4}}>
          {[{v:"cards",l:"🗂️ Tarjetas"},{v:"tabla",l:"📋 Tabla"}].map(v=>(
            <button key={v.v} onClick={()=>setVista(v.v)} style={{background:vista===v.v?C.green3:"transparent",color:vista===v.v?C.green2:C.muted,border:`1px solid ${vista===v.v?C.green3:C.border}`,padding:"5px 11px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.59rem"}}>{v.l}</button>
          ))}
        </div>
      </div>

      {/* Vista tarjetas */}
      {vista==="cards"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {filtered.map(c=>{
          const ec=CLI_ESTADO_C[c.estado]||C.muted;
          const tc=CLI_TIPO_C[c.tipo]||C.teal;
          const isS=sel?.id===c.id;
          return(
            <div key={c.id} onClick={()=>setSel(isS?null:c)}
              style={{background:C.card,border:`1px solid ${isS?C.green3:C.border}`,borderRadius:11,padding:16,cursor:"pointer",transition:"transform 0.2s,border-color 0.2s",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=C.green3;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=isS?C.green3:C.border;}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${tc},transparent)`}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted}}>{c.id}</div>
                  <div style={{fontWeight:700,fontSize:"0.88rem",marginTop:2}}>{c.nombre}</div>
                  <div style={{fontSize:"0.68rem",color:tc,marginTop:1}}>{c.tipo} · {c.localidad}</div>
                </div>
                <span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"2px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.5rem",textTransform:"uppercase",flexShrink:0}}>{c.estadoLabel||c.estado.replace("_"," ")}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                <div style={{background:C.bg3,borderRadius:6,padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"0.8rem",fontWeight:800,color:C.green2}}>{fmt(c.valorTotal)}</div>
                  <div style={{fontSize:"0.52rem",color:C.muted,fontFamily:"monospace"}}>FACTURADO</div>
                </div>
                <div style={{background:C.bg3,borderRadius:6,padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"0.8rem",fontWeight:800,color:C.teal2}}>{c.proyectos.length}</div>
                  <div style={{fontSize:"0.52rem",color:C.muted,fontFamily:"monospace"}}>PROYECTOS</div>
                </div>
                <div style={{background:C.bg3,borderRadius:6,padding:"6px",textAlign:"center"}}>
                  <Stars n={c.satisfaccion}/>
                  <div style={{fontSize:"0.52rem",color:C.muted,fontFamily:"monospace"}}>SATISFAC.</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:"0.63rem",color:C.muted}}>{c.telefono}</div>
                {c.mantenimiento&&<span style={{background:`${"#a78bfa"}18`,color:"#a78bfa",border:`1px solid ${"#a78bfa"}30`,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",fontSize:"0.5rem"}}>🔧 MANTTO</span>}
              </div>
            </div>
          );
        })}
      </div>}

      {/* Vista tabla */}
      {vista==="tabla"&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,overflowX:"auto",marginBottom:14}}>
        <table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg3}}>{["ID","Cliente","Tipo","Localidad","Estado","Facturado","Satisfac.","Mantto.","Próx. Revisión","Subtipo"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(c=>{
            const ec=CLI_ESTADO_C[c.estado]||C.muted;
            return(<tr key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)} style={{cursor:"pointer",background:sel?.id===c.id?`${C.green3}22`:""}} onMouseEnter={e=>{if(sel?.id!==c.id)e.currentTarget.style.background=`${C.green3}14`;}} onMouseLeave={e=>{e.currentTarget.style.background=sel?.id===c.id?`${C.green3}22`:""}}>
              <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{c.id}</td>
              <td style={{padding:"8px"}}><div style={{fontSize:"0.77rem",fontWeight:600}}>{c.nombre}</div><div style={{fontSize:"0.61rem",color:C.muted}}>{c.email}</div></td>
              <td style={{padding:"8px",fontSize:"0.7rem",color:CLI_TIPO_C[c.tipo]||C.teal}}>{c.tipo}</td>
              <td style={{padding:"8px",fontSize:"0.7rem",color:C.muted}}>{c.localidad}</td>
              <td style={{padding:"8px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",fontSize:"0.5rem",textTransform:"uppercase"}}>{c.estado.replace("_"," ")}</span></td>
              <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.73rem",color:C.yellow,fontWeight:700}}>{fmt(c.valorTotal)}</td>
              <td style={{padding:"8px"}}><Stars n={c.satisfaccion}/></td>
              <td style={{padding:"8px",textAlign:"center"}}>{c.mantenimiento?<span style={{color:"#a78bfa",fontSize:"0.75rem"}}>✓</span>:<span style={{color:C.border}}>—</span>}</td>
              <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.63rem",color:c.proxRevision?C.teal2:C.muted}}>{c.proxRevision||"—"}</td>
              <td style={{padding:"8px",fontSize:"0.7rem",color:C.muted}}>{c.subtipo}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>}

      {/* Detalle cliente */}
      {sel&&<div style={{background:C.card,border:`1px solid ${C.green3}`,borderRadius:11,padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.teal,marginBottom:3}}>{sel.id} · FICHA DE CLIENTE</div>
            <div style={{fontWeight:700,fontSize:"1.05rem"}}>{sel.nombre}</div>
            <div style={{fontSize:"0.72rem",color:CLI_TIPO_C[sel.tipo]||C.teal,marginTop:2}}>{sel.tipo} · {sel.subtipo} · {sel.localidad}</div>
          </div>
          <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.2rem"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{fontSize:"0.65rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Datos de Contacto</div>
            {[["Teléfono",sel.telefono],["Email",sel.email],["Localidad",sel.localidad],["Última actividad",sel.ultimaActividad]].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:10,marginBottom:6}}>
                <div style={{fontSize:"0.65rem",color:C.muted,minWidth:100}}>{k}</div>
                <div style={{fontSize:"0.72rem",fontWeight:500}}>{v||"—"}</div>
              </div>
            ))}
            {sel.notas&&<div style={{background:C.bg3,borderRadius:7,padding:"8px 10px",marginTop:6}}>
              <div style={{fontSize:"0.58rem",color:C.muted,marginBottom:3,fontFamily:"monospace",textTransform:"uppercase"}}>Notas</div>
              <div style={{fontSize:"0.72rem",color:C.text,lineHeight:1.5}}>{sel.notas}</div>
            </div>}
          </div>
          <div>
            <div style={{fontSize:"0.65rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Actividad Comercial</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[{l:"Facturado Total",v:fmt(sel.valorTotal),c:C.green2},{l:"Proyectos",v:sel.proyectos.length,c:C.teal2},{l:"Satisfacción",v:<Stars n={sel.satisfaccion}/>,c:C.yellow},{l:"Mantenimiento",v:sel.mantenimiento?"Sí ✓":"No",c:sel.mantenimiento?"#a78bfa":C.muted}].map((d,i)=>(
                <div key={i} style={{background:C.bg3,borderRadius:7,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,marginBottom:3,textTransform:"uppercase"}}>{d.l}</div>
                  <div style={{fontSize:"0.95rem",fontWeight:800,color:d.c}}>{d.v}</div>
                </div>
              ))}
            </div>
            {sel.proxRevision&&<div style={{background:`${C.teal3}30`,border:`1px solid ${C.teal3}`,borderRadius:7,padding:"9px 11px"}}>
              <div style={{fontSize:"0.6rem",color:C.teal2,fontFamily:"monospace",textTransform:"uppercase",marginBottom:3}}>📅 Próxima Revisión</div>
              <div style={{fontWeight:700,color:C.teal2}}>{sel.proxRevision}</div>
            </div>}
            {sel.proyectos.length>0&&<div style={{marginTop:10}}>
              <div style={{fontSize:"0.6rem",color:C.muted,fontFamily:"monospace",textTransform:"uppercase",marginBottom:6}}>Proyectos Asociados</div>
              {sel.proyectos.map(pid=>{const p=projects.find(pr=>pr.id===pid);return p?(<div key={pid} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}10`}}>
                <span style={{fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.id}</span>
                <span style={{fontSize:"0.72rem"}}>{p.tipo}</span>
                <span style={{fontFamily:"monospace",fontSize:"0.7rem",color:C.yellow}}>{fmt(p.presupuesto)}</span>
              </div>):null;})}
            </div>}
          </div>
        </div>
      </div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB GRÁFICOS
// ══════════════════════════════════════════════════════════════════════════════
function TabGraficos({projects,stock,horas,ventasMensuales}){const W=useW();const M=W<768;
  const completados=projects.filter(p=>p.estado==="completado");
  const tipos=[...new Set(projects.map(p=>p.tipo))].filter(Boolean);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const tecnicos=[...new Set(horas.map(h=>h.tecnico))].filter(Boolean);
  const cats=[...new Set(stock.map(s=>s.categoria))].filter(Boolean);

  const tipoFac=tipos.map(t=>({l:t.split("+")[0].split(" ").slice(-1)[0],v:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0),sub:`${completados.filter(p=>p.tipo===t).length} instalaciones`,extra:[`Margen: ${completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).length?Math.round(completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/Math.max(completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).length,1)):0}%`]}));
  const eqHoras=equipos.map(eq=>({l:eq.replace("Equipo ","Eq. "),v:horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0),sub:`${horas.filter(h=>h.equipo===eq).length} partes`}));
  const catValor=cats.map(c=>({l:c.split(" ")[0],v:stock.filter(s=>s.categoria===c).reduce((a,b)=>a+b.qty*b.precioUnit,0),sub:`${stock.filter(s=>s.categoria===c).length} refs`}));
  const margenProy=completados.filter(p=>p.presupuesto>0).map(p=>({l:p.id.replace("PRY-","#"),v:p.margen,color:p.margen<0?C.red:p.margen>20?C.green2:C.teal,sub:`${p.cliente} — ${fmt(p.presupuesto)}`}));
  const scatterData=projects.filter(p=>p.presupuesto>0).map(p=>({x:p.presupuesto,y:p.margen,id:p.id.replace("PRY-","P"),label:p.cliente,equipo:p.equipo,tipo:p.tipo}));

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.green3}30,${C.bg3})`,border:`1px solid ${C.green3}`,borderRadius:11,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
        <AFCLogo size={28}/>
        <div><div style={{fontWeight:700,color:C.green2,fontSize:"0.88rem"}}>Gráficos Interactivos — Estilo Power BI</div><div style={{fontSize:"0.68rem",color:C.muted,marginTop:1}}>Pasa el ratón sobre cualquier gráfico para ver el detalle completo</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <LineChart title="📈 Facturación Mensual (14 meses)" subtitle="Hover para variación % vs mes anterior" data={ventasMensuales.map(v=>({l:v.mes,v:v.ventas,sub:`${v.proyectos} proyectos`}))} color={C.green2} fmtFn={fmt} height={130}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <BarChart title="💶 Facturación por Tipo" subtitle="Hover para margen de cada categoría" data={tipoFac} color={C.green} fmtFn={fmt} height={130} highlight/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <HBarChart title="📏 Margen por Proyecto" subtitle="Rojo = pérdida · Verde = > 20% · Hover para detalle" data={margenProy}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <ScatterPlot title="🔵 Presupuesto vs Margen" subtitle="Cada punto = un proyecto" data={scatterData}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <BarChart title="⏱️ Horas por Equipo" subtitle="Total horas MO registradas" data={eqHoras} color={C.teal} unit="h" height={120}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <BarChart title="📦 Valor Stock" subtitle="Por categoría" data={catValor} color={C.yellow} fmtFn={fmt} height={120}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3}}>🏗️ Proyectos por Tipo</div>
          <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Hover para detalle</div>
          <DonutInteractive title="proyectos" size={110} thickness={16} segments={tipos.map(t=>({label:t,value:projects.filter(p=>p.tipo===t).length,color:TIPO_COLORS[t]||C.teal,facturado:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0)}))}/>
        </div>
      </div>
      <STitle icon="📋">Resumen Visual de Alertas</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[{label:"Proyectos en pérdida",value:projects.filter(p=>p.margen<0).length,total:projects.length,color:C.red,icon:"🔴"},{label:"Stock bajo mínimo",value:stock.filter(s=>s.qty<s.qtyMin).length,total:stock.length,color:C.yellow,icon:"📦"},{label:"Con incidencias",value:projects.filter(p=>p.incidencias>0).length,total:projects.length,color:C.yellow,icon:"⚠️"},{label:"Sin incidencias",value:projects.filter(p=>p.incidencias===0).length,total:projects.length,color:C.green2,icon:"✅"}].map((item,i)=>{const p=Math.round((item.value/item.total)*100)||0;return(<div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:16}}><div style={{fontSize:"0.6rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:6}}>{item.icon} {item.label}</div><div style={{fontSize:"1.9rem",fontWeight:800,color:item.color}}>{item.value}</div><div style={{height:5,borderRadius:3,background:C.bg3,overflow:"hidden",marginTop:8}}><div style={{height:"100%",width:`${p}%`,background:item.color,borderRadius:3}}/></div><div style={{fontSize:"0.58rem",fontFamily:"monospace",color:C.muted,marginTop:3,textAlign:"right"}}>{p}% de {item.total}</div></div>);})}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB PROYECTOS
// ══════════════════════════════════════════════════════════════════════════════
function TabProyectos({projects,horas,matMayor,matMenor}){const W=useW();const M=W<768;
  const [vista,setVista]=useState("kpis");
  const [filtro,setFiltro]=useState("all");
  const [sel,setSel]=useState(null);
  const completados=projects.filter(p=>p.estado==="completado");
  const enEjecucion=projects.filter(p=>p.estado==="ejecucion");
  const filtered=filtro==="all"?projects:projects.filter(p=>p.estado===filtro);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const COSTE_HORA=25;

  // ── Cálculos desviación ───────────────────────────────────────────────────
  const comp=completados.filter(p=>p.gastado>0);
  const desviCoste=comp.map(p=>({...p,dev:p.gastado-p.presupuesto,devPct:Math.round(((p.gastado-p.presupuesto)/p.presupuesto)*100)}));
  const desviTiempo=comp.filter(p=>p.diasEst>0&&p.diasReal>0).map(p=>({...p,devD:p.diasReal-p.diasEst,devDPct:Math.round(((p.diasReal-p.diasEst)/p.diasEst)*100)}));
  const proyEnRiesgo=desviCoste.filter(p=>p.devPct>10).length;
  const proyEnRetraso=desviTiempo.filter(p=>p.devD>0).length;
  const desviMediaCoste=comp.length?Math.round(desviCoste.reduce((s,p)=>s+p.devPct,0)/comp.length):0;
  const desviMediaTiempo=desviTiempo.length?Math.round(desviTiempo.reduce((s,p)=>s+p.devDPct,0)/desviTiempo.length):0;

  // Desglose costes (completados)
  const totalMatMayor=comp.reduce((s,p)=>s+p.costeMaterialMayor,0);
  const totalMatMenor=comp.reduce((s,p)=>s+p.costeMaterialMenor,0);
  const totalPersonal=comp.reduce((s,p)=>s+p.costePersonal,0);
  const totalOtros=comp.reduce((s,p)=>s+p.costeOtros,0);
  const totalGastado=comp.reduce((s,p)=>s+p.gastado,0);

  // Desviaciones material menor (items con qtdReal > qtdPpto)
  const matMenorDesviados=matMenor.filter(m=>m.qtdReal>m.qtdPpto);
  const matMayorDesviados=matMayor.filter(m=>m.qtdReal>m.qtdPpto);

  const vistas=[{id:"kpis",l:"📊 KPIs & Desviaciones"},{id:"material",l:"📦 Material por Proyecto"},{id:"equipos",l:"👥 Equipos"},{id:"listado",l:"📋 Listado Completo"}];

  return(
    <div>
      <div style={{display:"flex",gap:3,marginBottom:16,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,padding:3,flexWrap:M?"wrap":"nowrap",width:"100%"}}>
        {vistas.map(v=><button key={v.id} onClick={()=>setVista(v.id)} style={{background:vista===v.id?C.green3:"transparent",color:vista===v.id?C.green2:C.muted,border:`1px solid ${vista===v.id?C.green3:"transparent"}`,padding:"6px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase",transition:"all 0.2s"}}>{v.l}</button>)}
      </div>

      {/* ══ KPIs & DESVIACIONES ══ */}
      {vista==="kpis"&&<>
        <STitle icon="📊">KPIs Globales de Proyectos</STitle>
        <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(6,1fr)",gap:10,marginBottom:14}}>
          <StatCard icon="🏗️" label="Total Proyectos" value={projects.length} sub={`${completados.length} compl. · ${enEjecucion.length} activos`} color={C.teal2}/>
          <StatCard icon="💶" label="Facturación" value={fmt(completados.reduce((s,p)=>s+p.presupuesto,0))} sub="proyectos completados" color={C.green2}/>
          <StatCard icon="📈" label="Margen Medio" value={`${comp.length?Math.round(comp.filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/Math.max(comp.filter(p=>p.margen!==0).length,1)):0}%`} color={C.teal2}/>
          <StatCard icon="⚠️" label="En Pérdidas" value={completados.filter(p=>p.margen<0).length} sub="proyectos con margen negativo" color={C.red}/>
          <StatCard icon="⏱️" label="Horas MO" value={`${horas.reduce((s,h)=>s+h.horas,0)}h`} sub={`${fmt(horas.reduce((s,h)=>s+h.horas,0)*COSTE_HORA)} coste`} color={C.greenLeaf}/>
          <StatCard icon="🔴" label="Con Incidencias" value={projects.filter(p=>p.incidencias>0).length} sub={`${projects.reduce((s,p)=>s+p.incidencias,0)} incid. total`} color={projects.filter(p=>p.incidencias>0).length>2?C.red:C.yellow}/>
        </div>

        {/* Semáforo de desviaciones */}
        <STitle icon="🚦">Semáforo de Desviaciones</STitle>
        <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:18}}>
          {[
            {icon:"💸",label:"Desviación Media Coste",value:`${desviMediaCoste>0?"+":""}${desviMediaCoste}%`,sub:"real vs presupuesto",color:desviMediaCoste>10?C.red:desviMediaCoste>5?C.yellow:C.green2,ok:desviMediaCoste<=5},
            {icon:"📅",label:"Desviación Media Tiempo",value:`${desviMediaTiempo>0?"+":""}${desviMediaTiempo}%`,sub:"días reales vs estimados",color:desviMediaTiempo>15?C.red:desviMediaTiempo>0?C.yellow:C.green2,ok:desviMediaTiempo<=0},
            {icon:"⚡",label:"Proyectos con Sobrecoste",value:proyEnRiesgo,sub:"coste >10% sobre ppto.",color:proyEnRiesgo>1?C.red:proyEnRiesgo>0?C.yellow:C.green2,ok:proyEnRiesgo===0},
            {icon:"🗓️",label:"Proyectos con Retraso",value:proyEnRetraso,sub:"días reales > estimados",color:proyEnRetraso>1?C.red:proyEnRetraso>0?C.yellow:C.green2,ok:proyEnRetraso===0},
          ].map((kpi,i)=>(
            <div key={i} style={{background:C.card,border:`2px solid ${kpi.color}40`,borderRadius:12,padding:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:kpi.color}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase"}}>{kpi.label}</div>
                <span style={{fontSize:"1rem"}}>{kpi.icon}</span>
              </div>
              <div style={{fontSize:"2rem",fontWeight:800,color:kpi.color,lineHeight:1}}>{kpi.value}</div>
              <div style={{fontSize:"0.6rem",color:C.muted,marginTop:4,fontFamily:"monospace"}}>{kpi.sub}</div>
              <div style={{marginTop:8,fontSize:"0.65rem",color:kpi.ok?C.green2:kpi.color,fontWeight:700}}>{kpi.ok?"✓ Dentro de objetivo":"⚠ Revisar"}</div>
            </div>
          ))}
        </div>

        {/* Desviación coste por proyecto + desglose */}
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1.4fr 1fr",gap:14,marginBottom:16}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>💸 Desviación de Coste por Proyecto</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Real − Presupuesto. Rojo = sobrecoste · Verde = dentro o por debajo</div>
            <HBarChart data={desviCoste.map(p=>({l:p.id.replace("PRY-","P"),v:p.devPct,color:p.devPct>10?C.red:p.devPct>0?C.yellow:C.green2,sub:`${p.cliente} — Dev: ${fmt(p.dev)}`}))} fmtFn={v=>`${v>0?"+":""}${v}%`}/>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>🍕 Desglose de Costes Reales</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Proyectos completados — distribución del gasto</div>
            <DonutInteractive title="coste" size={115} thickness={17}
              segments={[
                {label:"Mat. Mayor",value:Math.round(totalMatMayor/100),color:C.teal2},
                {label:"Mat. Menor",value:Math.round(totalMatMenor/100),color:C.greenLeaf},
                {label:"Personal MO",value:Math.round(totalPersonal/100),color:C.yellow},
                {label:"Otros",value:Math.round(totalOtros/100),color:C.muted},
              ]}/>
            <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[{l:"Mat. Mayor",v:totalMatMayor,c:C.teal2},{l:"Mat. Menor",v:totalMatMenor,c:C.greenLeaf},{l:"Personal",v:totalPersonal,c:C.yellow},{l:"Otros",v:totalOtros,c:C.muted}].map((d,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem"}}>
                  <span style={{color:d.c}}>● {d.l}</span>
                  <span style={{fontFamily:"monospace",color:C.text,fontWeight:600}}>{fmt(d.v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desviación tiempo + coste ppto vs real por ppio */}
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14,marginBottom:16}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>📅 Desviación de Tiempo por Proyecto</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:12}}>Días de desviación — negativo = terminó antes</div>
            {desviTiempo.map(p=>{
              const col=p.devD>3?C.red:p.devD>0?C.yellow:C.green2;
              const barW=Math.min(Math.abs(p.devD)/5*100,100);
              return(
                <div key={p.id} style={{display:"grid",gridTemplateColumns:"60px 1fr 80px",alignItems:"center",gap:8,marginBottom:9}}>
                  <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{p.id.replace("PRY-","P-")}</div>
                  <div style={{height:8,background:C.bg3,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,${col},${col}70)`,borderRadius:4}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontFamily:"monospace",fontSize:"0.65rem",color:col,fontWeight:700}}>{p.devD>0?"+":""}{p.devD}d</span>
                    <span style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.muted}}>{p.diasEst}→{p.diasReal}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>💶 Presupuesto vs Coste Real</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:14}}>Comparativa directa por proyecto completado</div>
            {desviCoste.map(p=>{
              const maxV=Math.max(p.presupuesto,p.gastado);
              const pptoPct=Math.round((p.presupuesto/maxV)*100);
              const gastPct=Math.round((p.gastado/maxV)*100);
              return(
                <div key={p.id} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{p.id.replace("PRY-","P-")} {p.cliente.split(" ")[0]}</span>
                    <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:p.devPct>0?C.red:C.green2,fontWeight:700}}>{p.devPct>0?"+":""}${p.devPct}%</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:36,fontSize:"0.52rem",color:C.muted,textAlign:"right"}}>ppto</div>
                      <div style={{flex:1,height:6,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pptoPct}%`,background:C.green2,borderRadius:3}}/></div>
                      <div style={{width:52,fontFamily:"monospace",fontSize:"0.57rem",color:C.green2}}>{fmt(p.presupuesto)}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:36,fontSize:"0.52rem",color:C.muted,textAlign:"right"}}>real</div>
                      <div style={{flex:1,height:6,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${gastPct}%`,background:p.gastado>p.presupuesto?C.red:C.teal2,borderRadius:3}}/></div>
                      <div style={{width:52,fontFamily:"monospace",fontSize:"0.57rem",color:p.gastado>p.presupuesto?C.red:C.teal2}}>{fmt(p.gastado)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas desviacion material */}
        {(matMenorDesviados.length>0||matMayorDesviados.length>0)&&<>
          <STitle icon="📦">Alertas de Desviación en Material</STitle>
          <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14}}>
            {matMayorDesviados.length>0&&<div style={{background:"rgba(232,80,80,0.06)",border:"1px solid rgba(232,80,80,0.3)",borderRadius:11,padding:16}}>
              <div style={{fontWeight:700,color:C.red,fontSize:"0.82rem",marginBottom:10}}>🔴 Gran Material — Desviaciones</div>
              {matMayorDesviados.map(m=>(
                <div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}10`}}>
                  <div><div style={{fontSize:"0.75rem",fontWeight:500}}>{m.nombre}</div><div style={{fontSize:"0.6rem",color:C.muted}}>{m.proyecto} · {m.cat}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"monospace",fontSize:"0.7rem",color:C.red,fontWeight:700}}>+{m.qtdReal-m.qtdPpto} ud extra</div>
                    <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{m.qtdPpto}→{m.qtdReal} · {fmt((m.qtdReal-m.qtdPpto)*m.precioUnit)}</div>
                  </div>
                </div>
              ))}
            </div>}
            {matMenorDesviados.length>0&&<div style={{background:"rgba(245,197,24,0.05)",border:"1px solid rgba(245,197,24,0.3)",borderRadius:11,padding:16}}>
              <div style={{fontWeight:700,color:C.yellow,fontSize:"0.82rem",marginBottom:10}}>🟡 Pequeño Material — Desviaciones</div>
              {matMenorDesviados.map(m=>(
                <div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}10`}}>
                  <div>
                    <div style={{fontSize:"0.75rem",fontWeight:500}}>{m.nombre}</div>
                    <div style={{fontSize:"0.6rem",color:C.muted}}>{m.proyecto} · {m.cat}</div>
                    {m.nota&&<div style={{fontSize:"0.57rem",color:C.yellow,marginTop:1}}>↳ {m.nota}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"monospace",fontSize:"0.7rem",color:C.yellow,fontWeight:700}}>+{m.qtdReal-m.qtdPpto} {m.unidad}</div>
                    <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{m.qtdPpto}→{m.qtdReal} · {fmt((m.qtdReal-m.qtdPpto)*m.precioUnit)}</div>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </>}
      </>}

      {/* ══ MATERIAL POR PROYECTO ══ */}
      {vista==="material"&&<>
        <STitle icon="📦">Control de Material por Proyecto</STitle>
        <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(5,1fr)",gap:10,marginBottom:18}}>
          <StatCard icon="🔩" label="Gran Material (total)" value={fmt(matMayor.reduce((s,m)=>s+m.qtdReal*m.precioUnit,0))} sub={`${matMayor.length} líneas registradas`} color={C.teal2}/>
          <StatCard icon="🪛" label="Pequeño Material (total)" value={fmt(matMenor.reduce((s,m)=>s+m.qtdReal*m.precioUnit,0))} sub={`${matMenor.length} líneas registradas`} color={C.greenLeaf}/>
          <StatCard icon="⚠️" label="Desviaciones Mat. Mayor" value={matMayorDesviados.length} sub={`${fmt(matMayorDesviados.reduce((s,m)=>s+(m.qtdReal-m.qtdPpto)*m.precioUnit,0))} extra`} color={matMayorDesviados.length>0?C.red:C.green2}/>
          <StatCard icon="⚠️" label="Desviaciones Mat. Menor" value={matMenorDesviados.length} sub={`${fmt(matMenorDesviados.reduce((s,m)=>s+(m.qtdReal-m.qtdPpto)*m.precioUnit,0))} extra`} color={matMenorDesviados.length>0?C.yellow:C.green2}/>
          <StatCard icon="🏋️" label="Ratio Mat/Personal" value={`${totalPersonal>0?Math.round((totalMatMayor+totalMatMenor)/totalPersonal*10)/10:0}x`} sub="material vs mano de obra" color={C.yellow}/>
        </div>

        {projects.filter(p=>matMayor.some(m=>m.proyecto===p.id)||matMenor.some(m=>m.proyecto===p.id)).map(p=>{
          const mm=matMayor.filter(m=>m.proyecto===p.id);
          const mn=matMenor.filter(m=>m.proyecto===p.id);
          const valMM=mm.reduce((s,m)=>s+m.qtdReal*m.precioUnit,0);
          const valMN=mn.reduce((s,m)=>s+m.qtdReal*m.precioUnit,0);
          const valMMPpto=mm.reduce((s,m)=>s+m.qtdPpto*m.precioUnit,0);
          const valMNPpto=mn.reduce((s,m)=>s+m.qtdPpto*m.precioUnit,0);
          const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow}[p.estado]||C.muted;
          return(
            <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,marginBottom:14,overflow:"hidden"}}>
              {/* Header proyecto */}
              <div style={{background:C.bg3,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.muted}}>{p.id}</span>
                  <span style={{fontWeight:700,fontSize:"0.88rem"}}>{p.cliente}</span>
                  <span style={{fontSize:"0.68rem",color:C.muted}}>{p.tipo} · {p.equipo}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"2px 8px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52rem"}}>{p.estadoLabel}</span>
                  <span style={{fontFamily:"monospace",fontSize:"0.7rem",color:C.teal2}}>Mat.Mayor: {fmt(valMM)}</span>
                  <span style={{fontFamily:"monospace",fontSize:"0.7rem",color:C.greenLeaf}}>Mat.Menor: {fmt(valMN)}</span>
                  {(valMM+valMN)>(valMMPpto+valMNPpto)&&<span style={{fontFamily:"monospace",fontSize:"0.65rem",color:C.red,fontWeight:700}}>+{fmt((valMM+valMN)-(valMMPpto+valMNPpto))} desviación</span>}
                </div>
              </div>
              <div style={{display:M?"flex":"grid",flexDirection:"column",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:0}}>
                {/* Gran Material */}
                <div style={{padding:14,borderRight:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <span style={{background:`${C.teal2}20`,color:C.teal2,padding:"1px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.58rem",fontWeight:700}}>🔩 GRAN MATERIAL</span>
                    <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>Equipos principales</span>
                  </div>
                  {mm.length>0?<table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
                    <thead><tr>{["REF","Descripción","Categ.","Ppto.","Real","Desv.","Valor Real"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.48rem",color:C.muted,textTransform:"uppercase",padding:"4px 6px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                    <tbody>{mm.map(m=>{const dev=m.qtdReal-m.qtdPpto;const col=dev>0?C.red:dev<0?C.teal2:C.green2;return(
                      <tr key={m.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}12`} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.58rem",color:C.muted}}>{m.ref}</td>
                        <td style={{padding:"5px 6px",fontSize:"0.73rem",fontWeight:500}}>{m.nombre}</td>
                        <td style={{padding:"5px 6px",fontSize:"0.62rem",color:C.muted}}>{m.cat}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.65rem",textAlign:"center"}}>{m.qtdPpto}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.65rem",fontWeight:700,textAlign:"center"}}>{m.qtdReal}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.65rem",color:col,fontWeight:700,textAlign:"center"}}>{dev===0?"—":dev>0?`+${dev}`:dev}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.68rem",color:C.teal2,fontWeight:700,textAlign:"right"}}>{fmt(m.qtdReal*m.precioUnit)}</td>
                      </tr>
                    );})}</tbody>
                    <tfoot><tr style={{background:C.bg3}}><td colSpan={6} style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.55rem",color:C.muted,textAlign:"right"}}>SUBTOTAL →</td><td style={{padding:"5px 6px",fontFamily:"monospace",fontWeight:800,fontSize:"0.72rem",color:C.teal2,textAlign:"right"}}>{fmt(valMM)}</td></tr></tfoot>
                  </table>:<div style={{color:C.muted,fontSize:"0.72rem",padding:"8px 0"}}>Sin datos de gran material</div>}
                </div>
                {/* Pequeño Material */}
                <div style={{padding:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <span style={{background:`${C.greenLeaf}20`,color:C.greenLeaf,padding:"1px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.58rem",fontWeight:700}}>🪛 PEQUEÑO MATERIAL</span>
                    <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>Consumibles / aux.</span>
                  </div>
                  {mn.length>0?<table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
                    <thead><tr>{["Material","Categ.","Udad.","Ppto.","Real","Desv.","Valor","Nota"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.48rem",color:C.muted,textTransform:"uppercase",padding:"4px 6px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                    <tbody>{mn.map(m=>{const dev=m.qtdReal-m.qtdPpto;const col=dev>0?C.yellow:dev<0?C.teal2:C.green2;return(
                      <tr key={m.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}12`} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{padding:"5px 6px",fontSize:"0.72rem",fontWeight:500}}>{m.nombre}</td>
                        <td style={{padding:"5px 6px",fontSize:"0.62rem",color:C.muted}}>{m.cat}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{m.unidad}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.63rem",textAlign:"center"}}>{m.qtdPpto}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.63rem",fontWeight:700,textAlign:"center"}}>{m.qtdReal}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.63rem",color:col,fontWeight:700,textAlign:"center"}}>{dev===0?"—":dev>0?`+${dev}`:dev}</td>
                        <td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.65rem",color:C.greenLeaf,textAlign:"right"}}>{fmt(m.qtdReal*m.precioUnit)}</td>
                        <td style={{padding:"5px 6px",fontSize:"0.58rem",color:dev>0?C.yellow:C.muted,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={m.nota}>{m.nota||"—"}</td>
                      </tr>
                    );})}</tbody>
                    <tfoot><tr style={{background:C.bg3}}><td colSpan={6} style={{padding:"5px 6px",fontFamily:"monospace",fontSize:"0.55rem",color:C.muted,textAlign:"right"}}>SUBTOTAL →</td><td style={{padding:"5px 6px",fontFamily:"monospace",fontWeight:800,fontSize:"0.72rem",color:C.greenLeaf,textAlign:"right"}}>{fmt(valMN)}</td><td/></tr></tfoot>
                  </table>:<div style={{color:C.muted,fontSize:"0.72rem",padding:"8px 0"}}>Sin datos de pequeño material</div>}
                </div>
              </div>
              {/* Footer totales */}
              <div style={{background:C.bg3,borderTop:`1px solid ${C.border}`,padding:"9px 16px",display:"flex",gap:20,justifyContent:"flex-end",alignItems:"center"}}>
                <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>Mat. Mayor Ppto: <b style={{color:C.teal2}}>{fmt(valMMPpto)}</b></span>
                <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>Mat. Menor Ppto: <b style={{color:C.greenLeaf}}>{fmt(valMNPpto)}</b></span>
                <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>Total Material Real: <b style={{color:C.yellow,fontSize:"0.72rem"}}>{fmt(valMM+valMN)}</b></span>
                {(valMM+valMN)>(valMMPpto+valMNPpto)?<span style={{fontFamily:"monospace",fontSize:"0.65rem",color:C.red,fontWeight:700}}>⚠ +{fmt((valMM+valMN)-(valMMPpto+valMNPpto))} sobre ppto.</span>:<span style={{fontFamily:"monospace",fontSize:"0.65rem",color:C.green2,fontWeight:700}}>✓ Dentro de presupuesto</span>}
              </div>
            </div>
          );
        })}
      </>}

      {/* ══ EQUIPOS ══ */}
      {vista==="equipos"&&<>
        <STitle icon="👥">Rendimiento por Equipo</STitle>
        <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:18}}>
          {equipos.map(eq=>{
            const ps=projects.filter(p=>p.equipo===eq);
            const comp=completados.filter(p=>p.equipo===eq);
            const hrs=horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0);
            const mgArr=comp.filter(p=>p.margen!==0);
            const mg=mgArr.length?Math.round(mgArr.reduce((s,p)=>s+p.margen,0)/mgArr.length):0;
            const incid=ps.reduce((s,p)=>s+p.incidencias,0);
            const facturado=comp.reduce((s,p)=>s+p.presupuesto,0);
            const col=EQ_COLORS[eq]||C.teal;
            const devMedia=comp.length?Math.round(comp.reduce((s,p)=>s+((p.gastado-p.presupuesto)/p.presupuesto)*100,0)/comp.length):0;
            return(
              <div key={eq} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:col}}/>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:col,boxShadow:`0 0 8px ${col}`}}/>
                  <div style={{fontWeight:700,fontSize:"0.9rem"}}>{eq}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  {[{l:"PROYECTOS",v:ps.length,c:col},{l:"COMPLETADOS",v:comp.length,c:C.green2},{l:"HORAS MO",v:`${hrs}h`,c:C.greenLeaf},{l:"MARGEN MEDIO",v:`${mg}%`,c:mg<0?C.red:mg>20?C.green2:C.yellow}].map((d,j)=>(
                    <div key={j} style={{background:C.bg3,borderRadius:8,padding:"9px",textAlign:"center"}}>
                      <div style={{fontSize:"1.3rem",fontWeight:800,color:d.c}}>{d.v}</div>
                      <div style={{fontSize:"0.52rem",color:C.muted,fontFamily:"monospace",marginTop:2}}>{d.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,display:"flex",flexDirection:"column",gap:6}}>
                  {[{l:"Facturado",v:fmt(facturado)},{l:"Incidencias",v:incid},{l:"Desv. coste media",v:`${devMedia>0?"+":""}${devMedia}%`}].map((d,j)=>(
                    <div key={j} style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem"}}>
                      <span style={{color:C.muted}}>{d.l}</span>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:d.l==="Incidencias"&&incid>0?C.red:d.l.includes("Desv")&&devMedia>5?C.red:C.text}}>{d.v}</span>
                    </div>
                  ))}
                </div>
                {/* Barra eficiencia */}
                <div style={{marginTop:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:"0.58rem",color:C.muted,fontFamily:"monospace"}}>EFICIENCIA</span>
                    <span style={{fontSize:"0.6rem",color:col,fontWeight:700}}>{Math.max(0,100-Math.max(devMedia,0))}%</span>
                  </div>
                  <div style={{height:5,background:C.bg3,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.max(0,100-Math.max(devMedia,0))}%`,background:`linear-gradient(90deg,${col},${col}80)`,borderRadius:3}}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparativa equipos — tabla técnicos */}
        <STitle icon="🧑‍🔧">Técnicos y Partes de Horas</STitle>
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <HBarChart title="⏱️ Horas por Técnico" subtitle="Total horas registradas"
              data={[...new Set(horas.map(h=>h.tecnico))].filter(Boolean).map(t=>({l:t.split(" ")[0],v:horas.filter(h=>h.tecnico===t).reduce((s,h)=>s+h.horas,0),sub:`${horas.filter(h=>h.tecnico===t).length} partes · ${horas.filter(h=>h.tecnico===t).map(h=>h.equipo)[0]||""}`,color:EQ_COLORS[horas.find(h=>h.tecnico===t)?.equipo]||C.teal}))} fmtFn={v=>`${v}h`}/>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,overflowX:"auto"}}>
            <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:10}}>📋 Todos los Partes de Horas</div>
            <table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg3}}>{["Proyecto","Técnico","Equipo","Fecha","Horas","Concepto","Incidencia"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.49rem",color:C.muted,textTransform:"uppercase",padding:"6px 7px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>{horas.map(h=>(
                <tr key={h.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}14`} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{padding:"5px 7px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{h.proyecto}</td>
                  <td style={{padding:"5px 7px",fontSize:"0.72rem",fontWeight:500}}>{h.tecnico}</td>
                  <td style={{padding:"5px 7px",fontSize:"0.65rem",color:EQ_COLORS[h.equipo]||C.teal}}>{h.equipo?.replace("Equipo ","")}</td>
                  <td style={{padding:"5px 7px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{h.fecha}</td>
                  <td style={{padding:"5px 7px",fontFamily:"monospace",fontWeight:700,color:C.greenLeaf}}>{h.horas}h</td>
                  <td style={{padding:"5px 7px",fontSize:"0.68rem",color:C.muted}}>{h.concepto}</td>
                  <td style={{padding:"5px 7px",fontSize:"0.65rem",color:h.incidencia?C.red:C.muted}}>{h.incidencia||"—"}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{background:C.bg3}}><td colSpan={4} style={{padding:"6px 7px",fontFamily:"monospace",fontSize:"0.55rem",color:C.muted,textAlign:"right"}}>TOTAL HORAS →</td><td style={{padding:"6px 7px",fontFamily:"monospace",fontWeight:800,color:C.greenLeaf}}>{horas.reduce((s,h)=>s+h.horas,0)}h</td><td colSpan={2}/></tr></tfoot>
            </table>
          </div>
        </div>
      </>}

      {/* ══ LISTADO COMPLETO ══ */}
      {vista==="listado"&&<>
        <STitle icon="📋">Listado Completo de Proyectos</STitle>
        <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
          {[{v:"all",l:"Todos"},{v:"completado",l:"✅ Completados"},{v:"ejecucion",l:"🔨 En Ejecución"},{v:"presupuesto",l:"📝 Presupuesto"}].map(o=>(
            <button key={o.v} onClick={()=>setFiltro(o.v)} style={{background:filtro===o.v?C.green3:"transparent",color:filtro===o.v?C.green2:C.muted,border:`1px solid ${filtro===o.v?C.green3:C.border}`,padding:"4px 11px",borderRadius:5,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase"}}>{o.l} {filtro===o.v&&`(${filtered.length})`}</button>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,overflowX:"auto",marginBottom:14}}>
          <table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg3}}>{["ID","Cliente","Tipo","Equipo","Estado","Presup.","Coste","Margen","Desv.%","Días est/real","Mat.Mayor","Mat.Menor","kW","Incid."].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.49rem",color:C.muted,textTransform:"uppercase",padding:"8px 7px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(p=>{
              const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow,parado:C.red}[p.estado]||C.muted;
              const devPct=p.gastado&&p.presupuesto?Math.round(((p.gastado-p.presupuesto)/p.presupuesto)*100):null;
              return(<tr key={p.id} onClick={()=>setSel(sel?.id===p.id?null:p)} style={{cursor:"pointer",background:sel?.id===p.id?`${C.green3}22`:""}} onMouseEnter={e=>{if(sel?.id!==p.id)e.currentTarget.style.background=`${C.green3}14`;}} onMouseLeave={e=>{e.currentTarget.style.background=sel?.id===p.id?`${C.green3}22`:"";}}>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{p.id}</td>
                <td style={{padding:"7px"}}><div style={{fontSize:"0.75rem",fontWeight:500}}>{p.cliente}</div><div style={{fontSize:"0.6rem",color:C.muted}}>{p.localidad}</div></td>
                <td style={{padding:"7px",fontSize:"0.67rem",color:C.muted}}>{p.tipo}</td>
                <td style={{padding:"7px",fontSize:"0.68rem",color:EQ_COLORS[p.equipo]||C.teal}}>{p.equipo?.replace("Equipo ","")}</td>
                <td style={{padding:"7px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",fontSize:"0.5rem"}}>{p.estadoLabel}</span></td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:C.green2}}>{fmt(p.presupuesto)}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:C.yellow}}>{p.gastado?fmt(p.gastado):"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.72rem",fontWeight:700,color:p.margen<0?C.red:p.margen>20?C.green2:C.text}}>{p.gastado||p.estado==="completado"?`${p.margen}%`:"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:devPct===null?C.muted:devPct>10?C.red:devPct>0?C.yellow:C.green2,fontWeight:devPct!==null?700:400}}>{devPct!==null?`${devPct>0?"+":""}${devPct}%`:"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.62rem",color:p.diasReal>p.diasEst&&p.diasReal>0?C.red:C.muted}}>{p.diasEst>0?`${p.diasEst}d`:"-"}{p.diasReal>0?` / ${p.diasReal}d`:""}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:C.teal2}}>{p.costeMaterialMayor?fmt(p.costeMaterialMayor):"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:C.greenLeaf}}>{p.costeMaterialMenor?fmt(p.costeMaterialMenor):"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.68rem",color:C.muted}}>{p.kw>0?`${p.kw}kW`:"—"}</td>
                <td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.7rem",color:p.incidencias>0?C.red:C.muted}}>{p.incidencias}</td>
              </tr>);
            })}</tbody>
            <tfoot><tr style={{background:C.bg3}}>
              <td colSpan={5} style={{padding:"8px 7px",fontFamily:"monospace",fontSize:"0.55rem",color:C.muted,textAlign:"right",textTransform:"uppercase"}}>TOTALES →</td>
              <td style={{padding:"8px 7px",fontFamily:"monospace",fontWeight:800,fontSize:"0.75rem",color:C.green2}}>{fmt(filtered.reduce((s,p)=>s+p.presupuesto,0))}</td>
              <td style={{padding:"8px 7px",fontFamily:"monospace",fontWeight:800,fontSize:"0.75rem",color:C.yellow}}>{fmt(filtered.reduce((s,p)=>s+p.gastado,0))}</td>
              <td colSpan={7}/>
            </tr></tfoot>
          </table>
        </div>
        {sel&&<div style={{background:C.card,border:`1px solid ${C.green3}`,borderRadius:11,padding:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div><div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.teal,marginBottom:3}}>{sel.id} · FICHA DETALLADA</div><div style={{fontWeight:700,fontSize:"1rem"}}>{sel.cliente}</div><div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>{sel.tipo} · {sel.localidad} · {sel.equipo}</div><div style={{fontSize:"0.68rem",color:C.muted,marginTop:1}}>{sel.descripcion}</div></div>
            <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.2rem"}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:M?"repeat(2,1fr)":"repeat(7,1fr)",gap:8,marginBottom:14}}>
            {[{l:"Presupuesto",v:fmt(sel.presupuesto),c:C.green2},{l:"Coste Real",v:fmt(sel.gastado),c:C.yellow},{l:"Margen",v:`${sel.margen}%`,c:sel.margen<0?C.red:C.green2},{l:"Mat. Mayor",v:fmt(sel.costeMaterialMayor),c:C.teal2},{l:"Mat. Menor",v:fmt(sel.costeMaterialMenor),c:C.greenLeaf},{l:"Personal MO",v:fmt(sel.costePersonal),c:C.yellow},{l:"Horas",v:`${horas.filter(h=>h.proyecto===sel.id).reduce((s,h)=>s+h.horas,0)}h`,c:C.greenLeaf}].map((d,i)=>(
              <div key={i} style={{background:C.bg3,borderRadius:7,padding:"9px",textAlign:"center"}}>
                <div style={{fontSize:"0.52rem",fontFamily:"monospace",color:C.muted,marginBottom:4,textTransform:"uppercase"}}>{d.l}</div>
                <div style={{fontSize:"0.95rem",fontWeight:800,color:d.c}}>{d.v}</div>
              </div>
            ))}
          </div>
          {/* Barras desglose presupuestado vs real */}
          <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Desglose Presupuestado</div>
              {[{l:"Mat. Mayor",v:sel.materialMayorPpto,c:C.teal2},{l:"Mat. Menor",v:sel.materialMenorPpto,c:C.greenLeaf},{l:"Personal",v:sel.personalPpto,c:C.yellow}].map((d,i)=>{
                const tot=sel.presupuesto||1;const pct=Math.round((d.v/tot)*100);
                return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:80,fontSize:"0.64rem",color:C.muted}}>{d.l}</div>
                  <div style={{flex:1,height:7,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:d.c,borderRadius:3}}/></div>
                  <div style={{width:55,fontFamily:"monospace",fontSize:"0.63rem",color:d.c,textAlign:"right"}}>{fmt(d.v)}</div>
                </div>);
              })}
            </div>
            <div>
              <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Desglose Real</div>
              {[{l:"Mat. Mayor",ppto:sel.materialMayorPpto,real:sel.costeMaterialMayor,c:C.teal2},{l:"Mat. Menor",ppto:sel.materialMenorPpto,real:sel.costeMaterialMenor,c:C.greenLeaf},{l:"Personal",ppto:sel.personalPpto,real:sel.costePersonal,c:C.yellow}].map((d,i)=>{
                const dev=d.real-d.ppto; const col=dev>0?C.red:C.green2;
                const tot=sel.gastado||1; const pct=Math.round((d.real/tot)*100);
                return(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:80,fontSize:"0.64rem",color:C.muted}}>{d.l}</div>
                  <div style={{flex:1,height:7,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:d.c,borderRadius:3}}/></div>
                  <div style={{width:55,fontFamily:"monospace",fontSize:"0.63rem",color:d.c,textAlign:"right"}}>{fmt(d.real)}</div>
                  {dev!==0&&<div style={{fontFamily:"monospace",fontSize:"0.58rem",color:col,minWidth:40}}>{dev>0?"+":""}{fmt(dev)}</div>}
                </div>);
              })}
            </div>
          </div>
          {horas.filter(h=>h.proyecto===sel.id).length>0&&<>
            <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",marginBottom:8}}>Partes de Horas</div>
            <table style={{width:"100%",minWidth:480,borderCollapse:"collapse"}}>
              <thead><tr>{["Técnico","Fecha","Horas","Concepto","Incidencia"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.49rem",color:C.muted,textTransform:"uppercase",padding:"5px 8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>{horas.filter(h=>h.proyecto===sel.id).map(h=><tr key={h.id}><td style={{padding:"6px 8px",fontSize:"0.72rem",fontWeight:500}}>{h.tecnico}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontSize:"0.65rem",color:C.muted}}>{h.fecha}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontWeight:700,color:C.greenLeaf}}>{h.horas}h</td><td style={{padding:"6px 8px",fontSize:"0.7rem",color:C.muted}}>{h.concepto}</td><td style={{padding:"6px 8px",fontSize:"0.7rem",color:h.incidencia?C.red:C.muted}}>{h.incidencia||"—"}</td></tr>)}</tbody>
            </table>
          </>}
        </div>}
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB ALMACÉN
// ══════════════════════════════════════════════════════════════════════════════
function TabAlmacen({stock,movimientos}){const W=useW();const M=W<768;
  const [productos,setProductos]=useState([]);
  const [modalOpen,setModalOpen]=useState(null);
  const [loading,setLoading]=useState(true);
  const [importing,setImporting]=useState(false);

  const loadAlmacenData=async()=>{
    try{
      const{data,error}=await supabase.from("almacen_productos").select("*").order("ref");
      if(error)throw error;
      return data||[];
    }catch(e){
      console.error("Error loading almacen:",e);
      return[];
    }
  };

  const importAlmacenJSON=async()=>{
    try{
      console.log("📥 Cargando almacén-productos.json...");
      const res=await fetch("/almacen-productos.json");
      const productos=await res.json();
      console.log(`📥 Obtenidos ${productos.length} productos`);
      const batchSize=50;
      let inserted=0;
      for(let i=0;i<productos.length;i+=batchSize){
        const batch=productos.slice(i,i+batchSize);
        const{error}=await supabase.from("almacen_productos").insert(batch);
        if(error)throw error;
        inserted+=batch.length;
        console.log(`✅ Insertados ${inserted}/${productos.length}`);
      }
      console.log("✅ Importación completada");
      return await loadAlmacenData();
    }catch(e){
      console.error("Error importing almacen:",e);
      alert("❌ Error: "+e.message);
      return[];
    }
  };

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const data=await loadAlmacenData();
      setProductos(data);
      setLoading(false);
    })();
  },[]);

  const handleImport=async()=>{
    setImporting(true);
    const data=await importAlmacenJSON();
    setProductos(data);
    setImporting(false);
  };

  return(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,justifyContent:"space-between",alignItems:"center"}}>
        <STitle icon="📦">Control de Almacén</STitle>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {productos.length===0&&!loading&&<button onClick={handleImport} disabled={importing} style={{background:importing?C.muted:C.yellow,color:importing?C.bg:C.bg,border:`1px solid ${importing?C.muted:C.yellow}`,padding:"8px 16px",borderRadius:8,cursor:importing?"not-allowed":"pointer",fontFamily:"monospace",fontSize:"0.75rem",fontWeight:700,textTransform:"uppercase",opacity:importing?0.6:1}}>⬇ {importing?"Importando...":"Importar"}</button>}
          <button onClick={()=>setModalOpen("entrada")} style={{background:C.green3,color:C.green2,border:`1px solid ${C.green3}`,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:"0.75rem",fontWeight:700,textTransform:"uppercase"}}>📥 + Entrada</button>
          <button onClick={()=>setModalOpen("salida")} style={{background:C.teal3,color:C.teal2,border:`1px solid ${C.teal3}`,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:"0.75rem",fontWeight:700,textTransform:"uppercase"}}>📤 + Salida</button>
          <button onClick={()=>setModalOpen("devolucion")} style={{background:`${C.yellow}15`,color:C.yellow,border:`1px solid ${C.yellow}40`,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:"0.75rem",fontWeight:700,textTransform:"uppercase"}}>↩ + Devolución</button>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflowX:"auto"}}>
        <table style={{width:"100%",minWidth:800,borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:C.bg3}}>
              {["REF","DESCRIPCIÓN","UND","ZONA","ESTANCIA","NIVEL","INV.INICIAL","ENTRADAS","SALIDAS","DEVOLUCIONES","SALDO"].map(h=>
                <th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{padding:"20px",textAlign:"center",color:C.muted}}>⏳ Cargando productos...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan={11} style={{padding:"20px",textAlign:"center",color:C.muted}}>📦 Sin productos. Haz clic en "Importar" para cargar.</td></tr>
            ) : (
              productos.map((p,i)=>
                <tr key={i} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}12`} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.ref}</td>
                  <td style={{padding:"8px",fontSize:"0.75rem"}}>{p.descripcion}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.und}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.teal2,fontWeight:700}}>{p.zona}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.estancia}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.nivel}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",color:C.yellow}}>{p.invInicial}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",color:C.green2}}>+{p.entradas}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",color:C.teal2}}>-{p.salidas}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",color:C.yellow}}>+{p.devoluciones}</td>
                  <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.88rem",fontWeight:700,color:p.saldo>0?C.green2:C.red}}>{p.saldo}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:24,maxWidth:500,width:"90%"}}>
            <div style={{fontSize:"0.9rem",fontWeight:700,marginBottom:16}}>
              {modalOpen==="entrada"?"📥 Registrar Entrada":modalOpen==="salida"?"📤 Registrar Salida":"↩ Registrar Devolución"}
            </div>
            <div style={{color:C.muted,fontSize:"0.85rem",marginBottom:16}}>Modal de {modalOpen} (por implementar en Paso 2)</div>
            <button onClick={()=>setModalOpen(null)} style={{background:`${C.red}15`,color:C.red,border:`1px solid ${C.red}40`,padding:"8px 16px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.75rem"}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB IMPORTAR DATOS - Importación de Excel
// ══════════════════════════════════════════════════════════════════════════════
import ImportData from "./components/ImportData";

function TabImportar({onImportComplete}){
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.teal3}30,${C.bg3})`,border:`1px solid ${C.teal3}`,borderRadius:11,padding:"14px 16px",marginBottom:16,fontSize:"0.75rem",color:C.muted}}>
        <span style={{color:C.teal2,fontWeight:700}}>📥 Importar Datos </span>
        <span>Carga masiva de productos desde Excel. Los datos se importarán automáticamente a Supabase.</span>
      </div>
      <ImportData onComplete={onImportComplete}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("almacen");
  const [stock,setStock]=useState(INIT_STOCK);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [horas,setHoras]=useState(INIT_HORAS);
  const [movimientos]=useState(INIT_MOVIMIENTOS);
  const [matMayor]=useState(INIT_MAT_MAYOR);
  const [matMenor]=useState(INIT_MAT_MENOR);
  const [clientes]=useState(INIT_CLIENTES);
  const [ventasMensuales]=useState(VENTAS_MENSUALES);
  const [now,setNow]=useState(new Date());
  const [syncStatus,setSyncStatus]=useState("loading");
  const [lastSync,setLastSync]=useState(null);
  const [loading,setLoading]=useState(true);

  const sync=async()=>{
    setLoading(true);setSyncStatus("loading");
    try{
      const[stockRes,projRes,horasRes]=await Promise.allSettled([fetchStock(),fetchProyectos(),fetchHoras()]);

      if(stockRes.status==="fulfilled"){
        if(stockRes.value.length){
          setStock(stockRes.value);
          console.log("✅ Stock desde Supabase");
        }else{
          console.warn("⚠ Stock vacío en Supabase, usando datos de demostración");
        }
      }

      if(projRes.status==="fulfilled"){
        if(projRes.value.length){
          setProjects(projRes.value);
          console.log("✅ Proyectos desde Supabase");
        }else{
          console.warn("⚠ Proyectos vacíos en Supabase, usando datos de demostración");
        }
      }

      if(horasRes.status==="fulfilled"){
        if(horasRes.value.length){
          setHoras(horasRes.value);
          console.log("✅ Horas desde Supabase");
        }else{
          console.warn("⚠ Horas vacías en Supabase");
        }
      }

      setSyncStatus("ok");setLastSync(new Date());
    }catch(e){console.error("Error en sync:",e);setSyncStatus("error");}
    finally{setLoading(false);}
  };
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{sync();const iv=setInterval(sync,5*60*1000);return()=>clearInterval(iv);},[]);

  const ss={demo:{text:"DATOS DEMO",bg:`${C.muted}15`,c:C.muted,bo:C.border},loading:{text:"SYNC...",bg:`${C.yellow}10`,c:C.yellow,bo:`${C.yellow}40`},ok:{text:`✓ ${lastSync?lastSync.toLocaleTimeString("es-ES"):""}`,bg:`${C.green3}35`,c:C.green2,bo:C.green3},error:{text:"⚠ SHEET NO PÚBLICO",bg:`${C.red}10`,c:C.red,bo:`${C.red}40`}}[syncStatus];
  const ww=useW();
  const isMobile=ww<768;
  const tabs=[{id:"dashboard",l:"Dashboard"},{id:"graficos",l:"📈 Gráficos"},{id:"clientes",l:"👤 Clientes"},{id:"proyectos",l:"Proyectos"},{id:"almacen",l:"Almacén"},{id:"importar",l:"📥 Importar"}];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#081508;}::-webkit-scrollbar-thumb{background:#1f6b1e;border-radius:4px;}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}html,body{overflow-x:hidden}.scroll-x{overflow-x:auto;-webkit-overflow-scrolling:touch;}.scroll-x::-webkit-scrollbar{height:3px;}.scroll-x::-webkit-scrollbar-thumb{background:#1f6b1e;border-radius:3px;}`}</style>
      {/* ── HEADER DESKTOP ── */}
      {!isMobile&&<header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 22px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,15,8,0.98)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <AFCLogo size={40} full/>
          <div style={{width:1,height:32,background:C.border}}/>
          <div style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase",lineHeight:1.5}}>Panel de Control<br/>de Gestión</div>
        </div>
        <nav style={{display:"flex",gap:3,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,padding:3}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?C.green3:"transparent",color:tab===t.id?C.green2:C.muted,border:`1px solid ${tab===t.id?C.green3:"transparent"}`,padding:"6px 16px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.61rem",textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.2s"}}>{t.l}</button>)}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontFamily:"monospace",fontSize:"0.56rem",color:ss.c,background:ss.bg,border:`1px solid ${ss.bo}`,padding:"4px 10px",borderRadius:5}}>{loading&&<span style={{animation:"spin 1s linear infinite",display:"inline-block",marginRight:4}}>⟳</span>}{ss.text}</div>
          <button onClick={sync} disabled={loading} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 9px",borderRadius:5,cursor:"pointer",fontFamily:"monospace",fontSize:"0.58rem",opacity:loading?0.4:1}}>⟳</button>
          <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.green2,display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green2,animation:"blink 1.4s infinite"}}/>{now.toLocaleTimeString("es-ES")}</div>
          <div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.muted,background:C.bg2,border:`1px solid ${C.border}`,padding:"4px 9px",borderRadius:5}}>{now.toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>
      </header>}
      {/* ── HEADER MÓVIL ── */}
      {isMobile&&<header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,15,8,0.98)",position:"sticky",top:0,zIndex:100}}>
        <AFCLogo size={28} full/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontFamily:"monospace",fontSize:"0.52rem",color:ss.c,background:ss.bg,border:`1px solid ${ss.bo}`,padding:"3px 8px",borderRadius:5}}>{loading?"⟳ SYNC":ss.text}</div>
          <button onClick={sync} disabled={loading} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 8px",borderRadius:5,cursor:"pointer",fontSize:"0.7rem",opacity:loading?0.4:1}}>⟳</button>
          <div style={{fontFamily:"monospace",fontSize:"0.56rem",color:C.green2,display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:C.green2,animation:"blink 1.4s infinite"}}/>{now.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</div>
        </div>
      </header>}
      {/* ── BOTTOM NAV MÓVIL ── */}
      {isMobile&&<nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(5,15,8,0.98)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"stretch",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {tabs.map(t=>{const icons={"dashboard":"🏠","graficos":"📈","clientes":"👤","proyectos":"🔨","almacen":"📦","importar":"📥"};return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"8px 2px",background:tab===t.id?`${C.green3}50`:"transparent",border:"none",cursor:"pointer",borderTop:tab===t.id?`2px solid ${C.green2}`:"2px solid transparent",transition:"all 0.15s"}}>
            <span style={{fontSize:"1.15rem",lineHeight:1}}>{icons[t.id]}</span>
            <span style={{fontFamily:"monospace",fontSize:"0.48rem",color:tab===t.id?C.green2:C.muted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:tab===t.id?700:400}}>{t.l.replace(/[📈👤🔨📦]/g,"").trim()}</span>
          </button>
        );})}
      </nav>}
      <main style={{padding:isMobile?"12px 10px 80px 10px":"18px 22px",maxWidth:1600,margin:"0 auto"}}>
        {tab==="dashboard"&&<TabDashboard projects={projects} stock={stock} horas={horas} clientes={clientes} ventasMensuales={ventasMensuales}/>}
        {tab==="graficos"&&<TabGraficos projects={projects} stock={stock} horas={horas} ventasMensuales={ventasMensuales}/>}
        {tab==="clientes"&&<TabClientes clientes={clientes} projects={projects}/>}
        {tab==="proyectos"&&<TabProyectos projects={projects} horas={horas} matMayor={matMayor} matMenor={matMenor}/>}
        {tab==="almacen"&&<TabAlmacen stock={stock} movimientos={movimientos}/>}
        {tab==="importar"&&<TabImportar onImportComplete={()=>sync()}/>}
      </main>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"10px 22px",display:isMobile?"none":"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><AFCLogo size={18} full/><span style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted}}>Panel de Control · Uso Interno · Confidencial</span></div>
        <span style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted}}>📡 Datos en Vivo desde Supabase · {now.getFullYear()}</span>
      </footer>
    </div>
  );
}
