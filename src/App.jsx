import { useState, useEffect, useRef } from "react";

const SHEET_ID = "1UL6PVdrioA2meWvXuw13FuRCgBoNRvDw";
const TABS = { stock:"📊 Stock Actual", productos:"📦 Maestro Productos", proyectos:"📋 Proyectos", horas:"⏱️ Horas MO" };
async function fetchSheet(tab) {
  const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res=await fetch(url); if(!res.ok)throw new Error(`Error: ${tab}`);
  return parseCSVSheet(await res.text());
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
  {id:"PRY-001",cliente:"Familia Rodríguez",localidad:"Getafe",tipo:"Solar Residencial",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:8500,gastado:6230,margen:27,diasEst:14,diasReal:13,incidencias:1,fechaInicio:"2025-01"},
  {id:"PRY-002",cliente:"Comunidad Sta. Ana",localidad:"Alcorcón",tipo:"Solar Industrial",equipo:"Equipo Beta",estado:"completado",estadoLabel:"Completado",presupuesto:22000,gastado:18400,margen:16,diasEst:21,diasReal:24,incidencias:2,fechaInicio:"2025-01"},
  {id:"PRY-003",cliente:"José M. Herrera",localidad:"Leganés",tipo:"Aerotermia",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:9800,gastado:7700,margen:21,diasEst:7,diasReal:6,incidencias:0,fechaInicio:"2025-01"},
  {id:"PRY-004",cliente:"Nave Industrial López",localidad:"Majadahonda",tipo:"Solar Industrial",equipo:"Equipo Gamma",estado:"ejecucion",estadoLabel:"En Ejecución",presupuesto:35000,gastado:12000,margen:0,diasEst:26,diasReal:0,incidencias:1,fechaInicio:"2025-02"},
  {id:"PRY-005",cliente:"Hotel Mediterráneo",localidad:"Fuenlabrada",tipo:"Mixto Solar+Aero",equipo:"Equipo Beta",estado:"ejecucion",estadoLabel:"En Ejecución",presupuesto:48000,gastado:8500,margen:0,diasEst:33,diasReal:0,incidencias:1,fechaInicio:"2025-02"},
  {id:"PRY-006",cliente:"Clínica Dental Pérez",localidad:"Móstoles",tipo:"Calefacción",equipo:"Equipo Delta",estado:"completado",estadoLabel:"Completado",presupuesto:7200,gastado:8100,margen:-13,diasEst:7,diasReal:9,incidencias:1,fechaInicio:"2025-01"},
  {id:"PRY-007",cliente:"Polideportivo Municipal",localidad:"Pozuelo",tipo:"Solar Industrial",equipo:"Equipo Alpha",estado:"completado",estadoLabel:"Completado",presupuesto:28000,gastado:21000,margen:25,diasEst:21,diasReal:20,incidencias:0,fechaInicio:"2025-01"},
  {id:"PRY-008",cliente:"Residencia 3ª Edad",localidad:"Alcalá",tipo:"Aerotermia",equipo:"Equipo Gamma",estado:"completado",estadoLabel:"Completado",presupuesto:12000,gastado:9800,margen:18,diasEst:9,diasReal:11,incidencias:1,fechaInicio:"2025-02"},
  {id:"PRY-009",cliente:"Chalet García-Vega",localidad:"Boadilla",tipo:"Solar Residencial",equipo:"Equipo Delta",estado:"presupuesto",estadoLabel:"En Presupuesto",presupuesto:11000,gastado:0,margen:0,diasEst:0,diasReal:0,incidencias:0,fechaInicio:""},
  {id:"PRY-010",cliente:"Fábrica Textil Norte",localidad:"Torrejón",tipo:"Solar Industrial",equipo:"Equipo Beta",estado:"presupuesto",estadoLabel:"En Presupuesto",presupuesto:52000,gastado:0,margen:0,diasEst:0,diasReal:0,incidencias:0,fechaInicio:""},
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
    <div style={{position:"relative"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3,color:C.text}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.64rem",color:C.muted,marginBottom:10}}>{subtitle}</div>}
      <div style={{display:"flex",alignItems:"flex-end",gap:5,height:height+30}} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
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
  const W=500,H=height;
  const maxV=Math.max(...data.map(d=>d.v),...(data2||[]).map(d=>d.v),1);
  const px=i=>data.length>1?(i/(data.length-1))*(W-40)+20:W/2;
  const py=v=>H-16-((v)/(maxV||1))*(H-32);
  const pathD=data.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d.v)}`).join(" ");
  const areaD=`${pathD} L${px(data.length-1)},${H-16} L${px(0)},${H-16} Z`;
  const pathD2=data2&&data2.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d.v)}`).join(" ");
  return(
    <div style={{position:"relative"}}>
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
    <div style={{position:"relative"}}>
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
function TabDashboard({projects,stock,horas,clientes,ventasMensuales}){
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
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <HBarChart title="👥 Margen por Equipo" subtitle="Media proyectos completados — hover para horas"
            data={equipos.map(eq=>({l:eq.replace("Equipo ",""),v:completados.filter(p=>p.equipo===eq&&p.margen!==0).length?Math.round(completados.filter(p=>p.equipo===eq&&p.margen!==0).reduce((s,p)=>s+p.margen,0)/completados.filter(p=>p.equipo===eq&&p.margen!==0).length):0,color:EQ_COLORS[eq],sub:`${completados.filter(p=>p.equipo===eq).length} proyectos · ${horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0)}h`}))}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:18}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:10}}>📋 Proyectos Recientes</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
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
function TabClientes({clientes,projects}){
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
      {vista==="tabla"&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
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
function TabGraficos({projects,stock,horas,ventasMensuales}){
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
function TabProyectos({projects,horas}){
  const [filtro,setFiltro]=useState("all");
  const [sel,setSel]=useState(null);
  const completados=projects.filter(p=>p.estado==="completado");
  const filtered=filtro==="all"?projects:projects.filter(p=>p.estado===filtro);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  return(
    <div>
      <STitle icon="👥">Rendimiento por Equipo</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {equipos.map((eq)=>{const ps=projects.filter(p=>p.equipo===eq),comp=completados.filter(p=>p.equipo===eq),hrs=horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0),mgArr=comp.filter(p=>p.margen!==0),mg=mgArr.length?Math.round(mgArr.reduce((s,p)=>s+p.margen,0)/mgArr.length):0,col=EQ_COLORS[eq]||C.teal;return(<div key={eq} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:16}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><div style={{width:9,height:9,borderRadius:"50%",background:col}}/><div style={{fontWeight:700,fontSize:"0.86rem"}}>{eq}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{[{l:"PROY",v:ps.length,c:col},{l:"HORAS",v:`${hrs}h`,c:C.greenLeaf},{l:"MARGEN",v:`${mg}%`,c:mg<0?C.red:mg>20?C.green2:C.yellow},{l:"INCID",v:ps.reduce((s,p)=>s+p.incidencias,0),c:ps.reduce((s,p)=>s+p.incidencias,0)>0?C.red:C.green2}].map((d,j)=><div key={j} style={{background:C.bg3,borderRadius:7,padding:"7px",textAlign:"center"}}><div style={{fontSize:"1.2rem",fontWeight:800,color:d.c}}>{d.v}</div><div style={{fontSize:"0.54rem",color:C.muted,fontFamily:"monospace"}}>{d.l}</div></div>)}</div></div>);})}
      </div>
      <STitle icon="📋">Listado de Proyectos</STitle>
      <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
        {[{v:"all",l:"Todos"},{v:"completado",l:"Completados"},{v:"ejecucion",l:"En Ejecución"},{v:"presupuesto",l:"Presupuesto"}].map(o=><button key={o.v} onClick={()=>setFiltro(o.v)} style={{background:filtro===o.v?C.green3:"transparent",color:filtro===o.v?C.green2:C.muted,border:`1px solid ${filtro===o.v?C.green3:C.border}`,padding:"4px 11px",borderRadius:5,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase"}}>{o.l} {filtro===o.v&&`(${filtered.length})`}</button>)}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg3}}>{["ID","Cliente","Localidad","Tipo","Equipo","Estado","Presupuesto","Coste","Margen","Días","Incid."].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p=>{const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow,parado:C.red}[p.estado]||C.muted;return(<tr key={p.id} onClick={()=>setSel(sel?.id===p.id?null:p)} style={{cursor:"pointer",background:sel?.id===p.id?`${C.green3}22`:""}} onMouseEnter={e=>{if(sel?.id!==p.id)e.currentTarget.style.background=`${C.green3}14`;}} onMouseLeave={e=>{e.currentTarget.style.background=sel?.id===p.id?`${C.green3}22`:"";}}>
            <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{p.id}</td><td style={{padding:"8px",fontSize:"0.77rem",fontWeight:500}}>{p.cliente}</td><td style={{padding:"8px",fontSize:"0.7rem",color:C.muted}}>{p.localidad}</td><td style={{padding:"8px",fontSize:"0.68rem",color:C.muted}}>{p.tipo}</td><td style={{padding:"8px",fontSize:"0.7rem"}}>{p.equipo}</td><td style={{padding:"8px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",fontSize:"0.5rem",textTransform:"uppercase"}}>{p.estadoLabel}</span></td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.7rem",color:C.green2}}>{p.presupuesto?fmt(p.presupuesto):"—"}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.7rem",color:C.yellow}}>{p.gastado?fmt(p.gastado):"—"}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",fontWeight:700,color:p.margen<0?C.red:p.margen>20?C.green2:C.text}}>{p.gastado||p.estado==="completado"?`${p.margen}%`:"—"}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.66rem",color:p.diasReal>p.diasEst&&p.diasReal>0?C.red:C.muted}}>{p.diasReal>0?`${p.diasReal}d`:p.diasEst>0?`${p.diasEst}d est.`:"-"}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.72rem",color:p.incidencias>0?C.red:C.muted}}>{p.incidencias}</td>
          </tr>);})}</tbody>
        </table>
      </div>
      {sel&&<div style={{background:C.card,border:`1px solid ${C.green3}`,borderRadius:11,padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.teal,marginBottom:3}}>{sel.id} · DETALLE</div><div style={{fontWeight:700,fontSize:"1rem"}}>{sel.cliente}</div><div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>{sel.tipo} · {sel.localidad} · {sel.equipo}</div></div><button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.2rem"}}>✕</button></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:9,marginBottom:12}}>
          {[{l:"Presupuesto",v:fmt(sel.presupuesto),c:C.green2},{l:"Coste Real",v:fmt(sel.gastado),c:C.yellow},{l:"Margen",v:`${sel.margen}%`,c:sel.margen<0?C.red:C.green2},{l:"Horas MO",v:`${horas.filter(h=>h.proyecto===sel.id).reduce((s,h)=>s+h.horas,0)}h`,c:C.greenLeaf},{l:"Incidencias",v:sel.incidencias,c:sel.incidencias>0?C.red:C.green2}].map((d,i)=><div key={i} style={{background:C.bg3,borderRadius:7,padding:"9px",textAlign:"center"}}><div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,marginBottom:4,textTransform:"uppercase"}}>{d.l}</div><div style={{fontSize:"1.1rem",fontWeight:800,color:d.c}}>{d.v}</div></div>)}
        </div>
        {horas.filter(h=>h.proyecto===sel.id).length>0&&<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Técnico","Fecha","Horas","Concepto","Incidencia"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"5px 8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead><tbody>{horas.filter(h=>h.proyecto===sel.id).map(h=><tr key={h.id}><td style={{padding:"6px 8px",fontSize:"0.73rem",fontWeight:500}}>{h.tecnico}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontSize:"0.66rem",color:C.muted}}>{h.fecha}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontWeight:700,color:C.greenLeaf}}>{h.horas}h</td><td style={{padding:"6px 8px",fontSize:"0.7rem",color:C.muted}}>{h.concepto}</td><td style={{padding:"6px 8px",fontSize:"0.7rem",color:h.incidencia?C.red:C.muted}}>{h.incidencia||"—"}</td></tr>)}</tbody></table>}
      </div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB ALMACÉN
// ══════════════════════════════════════════════════════════════════════════════
function TabAlmacen({stock,movimientos}){
  const [vista,setVista]=useState("dashboard");
  const [filtroInv,setFiltroInv]=useState("all");
  const [filtroMov,setFiltroMov]=useState("all");
  const [selItem,setSelItem]=useState(null);
  const valorTotal=stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);
  const bajosMin=stock.filter(s=>s.qty<s.qtyMin);
  const agotados=stock.filter(s=>s.qty===0);
  const cats=[...new Set(stock.map(s=>s.categoria))].filter(Boolean);
  const catColors=[C.teal2,C.green2,C.greenLeaf,C.yellow,"#a78bfa","#fb923c"];
  const entradas=movimientos.filter(m=>m.tipo==="ENTRADA");
  const salidas=movimientos.filter(m=>m.tipo==="SALIDA");
  const devoluciones=movimientos.filter(m=>m.tipo==="DEVOLUCION");
  const entradas30=entradas.filter(m=>m.fecha>="2025-02-01");
  const salidas30=salidas.filter(m=>m.fecha>="2025-02-01");
  const valorEntradas=entradas.reduce((s,m)=>{const it=stock.find(i=>i.ref===m.ref);return s+(it?it.precioUnit*m.qty:0);},0);
  const valorSalidas=salidas.reduce((s,m)=>{const it=stock.find(i=>i.ref===m.ref);return s+(it?it.precioUnit*m.qty:0);},0);
  const stockSorted=[...stock].sort((a,b)=>(b.qty*b.precioUnit)-(a.qty*a.precioUnit));
  const totalVal=valorTotal||1;let cumul=0;
  const stockABC=stockSorted.map(item=>{cumul+=item.qty*item.precioUnit;const pct=cumul/totalVal;return{...item,abc:pct<=0.7?"A":pct<=0.9?"B":"C"};});
  const consumoMensual={};
  salidas.forEach(m=>{consumoMensual[m.ref]=(consumoMensual[m.ref]||0)+m.qty;});
  const forecastData=stock.map(item=>{const consumoMes=(consumoMensual[item.ref]||0)/2;const diasRestantes=consumoMes>0?Math.round((item.qty/consumoMes)*30):999;return{...item,consumoMes:Math.round(consumoMes*10)/10,diasRestantes,urgente:diasRestantes<30};}).filter(i=>i.consumoMes>0).sort((a,b)=>a.diasRestantes-b.diasRestantes);
  const movFiltrados=filtroMov==="all"?movimientos:movimientos.filter(m=>m.tipo===filtroMov);
  const historialRef=selItem?movimientos.filter(m=>m.ref===selItem.ref):[];
  const naveA=stock.filter(s=>s.ubicacion.includes("Nave A"));
  const naveB=stock.filter(s=>s.ubicacion.includes("Nave B"));
  const vistas=[{id:"dashboard",l:"📊 Dashboard"},{id:"movimientos",l:"🔄 Movimientos"},{id:"inventario",l:"📋 Inventario"},{id:"forecast",l:"📅 Previsión"}];
  return(
    <div>
      {bajosMin.length>0&&<div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.3)",borderRadius:10,padding:"9px 14px",marginBottom:10,fontSize:"0.75rem"}}><span style={{color:C.yellow,fontWeight:700}}>📦 Bajo mínimo: </span><span style={{color:C.muted}}>{bajosMin.map(s=>`${s.ref}(${s.qty}/${s.qtyMin})`).join(" · ")}</span></div>}
      {agotados.length>0&&<div style={{background:"rgba(232,80,80,0.08)",border:"1px solid rgba(232,80,80,0.3)",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:"0.75rem"}}><span style={{color:C.red,fontWeight:700}}>🔴 Sin stock: </span><span style={{color:C.muted}}>{agotados.map(s=>s.ref).join(" · ")}</span></div>}
      <div style={{display:"flex",gap:3,marginBottom:20,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,padding:3,width:"fit-content"}}>
        {vistas.map(v=><button key={v.id} onClick={()=>setVista(v.id)} style={{background:vista===v.id?C.green3:"transparent",color:vista===v.id?C.green2:C.muted,border:`1px solid ${vista===v.id?C.green3:"transparent"}`,padding:"6px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase",transition:"all 0.2s"}}>{v.l}</button>)}
      </div>

      {vista==="dashboard"&&<>
        <STitle icon="📦">KPIs de Almacén</STitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
          <StatCard icon="📋" label="Referencias" value={stock.length} sub={`${cats.length} categorías`} color={C.teal2}/>
          <StatCard icon="💶" label="Valor Total" value={fmt(valorTotal)} color={C.yellow}/>
          <StatCard icon="⚠️" label="Bajo Mínimo" value={bajosMin.length} color={bajosMin.length>0?C.red:C.green2}/>
          <StatCard icon="📥" label="Entradas (mes)" value={entradas30.reduce((s,m)=>s+m.qty,0)} sub={`${entradas30.length} ops.`} color={C.green2}/>
          <StatCard icon="📤" label="Salidas (mes)" value={salidas30.reduce((s,m)=>s+m.qty,0)} sub={`${salidas30.length} ops.`} color={C.teal2}/>
          <StatCard icon="🔄" label="Devoluciones" value={devoluciones.length} color={C.yellow}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:12}}>🏭 Distribución por Nave</div>
            {[{label:"Nave A",items:naveA,color:C.teal2},{label:"Nave B",items:naveB,color:C.greenLeaf}].map((nave,i)=>{const val=nave.items.reduce((s,it)=>s+it.qty*it.precioUnit,0);const pct=Math.round((val/valorTotal)*100)||0;return(<div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:2,background:nave.color}}/><span style={{fontWeight:600,fontSize:"0.8rem"}}>{nave.label}</span></div><div style={{fontFamily:"monospace",fontSize:"0.68rem",color:C.muted}}>{nave.items.length} refs · {fmt(val)}</div></div><div style={{height:7,borderRadius:3,background:C.bg3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:nave.color,borderRadius:3}}/></div><div style={{fontSize:"0.6rem",fontFamily:"monospace",color:nave.color,marginTop:2,textAlign:"right"}}>{pct}%</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{[...new Set(nave.items.map(it=>it.ubicacion.split("-").slice(1).join("-").trim()))].filter(Boolean).slice(0,4).map((zona,j)=><span key={j} style={{background:`${nave.color}18`,color:nave.color,border:`1px solid ${nave.color}30`,padding:"1px 6px",borderRadius:3,fontSize:"0.55rem",fontFamily:"monospace"}}>{zona}</span>)}</div></div>);})}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>🏅 Análisis ABC</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:10}}>A=70% valor · B=20% · C=10%</div>
            {[{cls:"A",color:C.red,desc:"Alto valor"},{cls:"B",color:C.yellow,desc:"Valor medio"},{cls:"C",color:C.green2,desc:"Bajo valor"}].map(cls=>{const items=stockABC.filter(s=>s.abc===cls.cls);const val=items.reduce((s,it)=>s+it.qty*it.precioUnit,0);return(<div key={cls.cls} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:20,height:20,borderRadius:4,background:`${cls.color}25`,border:`1px solid ${cls.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.72rem",color:cls.color}}>{cls.cls}</div><div><div style={{fontSize:"0.73rem",fontWeight:600}}>{items.length} refs</div><div style={{fontSize:"0.58rem",color:C.muted}}>{cls.desc}</div></div></div><div style={{fontFamily:"monospace",fontSize:"0.68rem",color:cls.color,fontWeight:700}}>{fmt(val)}</div></div><div style={{height:4,borderRadius:2,background:C.bg3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round((val/valorTotal)*100)}%`,background:cls.color,borderRadius:2}}/></div></div>);})}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:4}}>📊 Stock vs Mínimos</div>
            <div style={{fontSize:"0.64rem",color:C.muted,marginBottom:8}}>🟢OK · 🟡Bajo · 🔴Agotado</div>
            {stock.map(item=>{const ratio=item.qtyMin>0?Math.min((item.qty/item.qtyMin)*100,200):100;const col=item.qty===0?C.red:item.qty<item.qtyMin?C.yellow:C.green2;return(<div key={item.id} style={{display:"grid",gridTemplateColumns:"72px 1fr 46px",alignItems:"center",gap:6,marginBottom:6}}><div style={{fontFamily:"monospace",fontSize:"0.56rem",color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.ref}</div><div style={{height:5,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(ratio,100)}%`,background:col,borderRadius:3}}/></div><div style={{fontFamily:"monospace",fontSize:"0.58rem",color:col,textAlign:"right",fontWeight:700}}>{item.qty}</div></div>);})}
          </div>
        </div>
        <STitle icon="🔄">Últimos Movimientos</STitle>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg3}}>{["Fecha","Tipo","REF","Material","Cant.","Proyecto","Técnico","Motivo"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{movimientos.slice(0,8).map(m=>{const tc=m.tipo==="ENTRADA"?C.green2:m.tipo==="DEVOLUCION"?C.yellow:C.teal2;return(<tr key={m.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}15`} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.fecha}</td><td style={{padding:"8px"}}><span style={{background:`${tc}18`,color:tc,border:`1px solid ${tc}30`,padding:"1px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52rem",fontWeight:700}}>{m.tipo==="ENTRADA"?"📥":m.tipo==="DEVOLUCION"?"↩":"📤"} {m.tipo}</span></td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.ref}</td><td style={{padding:"8px",fontSize:"0.75rem",fontWeight:500}}>{m.nombre}</td><td style={{padding:"8px",fontFamily:"monospace",fontWeight:700,fontSize:"0.78rem",color:tc}}>{m.tipo==="SALIDA"?"-":"+"}{m.qty}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.proyecto}</td><td style={{padding:"8px",fontSize:"0.72rem"}}>{m.tecnico}</td><td style={{padding:"8px",fontSize:"0.7rem",color:C.muted}}>{m.motivo}</td></tr>);})}</tbody>
          </table>
        </div>
      </>}

      {vista==="movimientos"&&<>
        <STitle icon="🔄">Registro de Movimientos</STitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          <StatCard icon="📥" label="Total Entradas" value={entradas.reduce((s,m)=>s+m.qty,0)} sub={`${entradas.length} ops. · ${fmt(valorEntradas)}`} color={C.green2}/>
          <StatCard icon="📤" label="Total Salidas" value={salidas.reduce((s,m)=>s+m.qty,0)} sub={`${salidas.length} ops. · ${fmt(valorSalidas)}`} color={C.teal2}/>
          <StatCard icon="↩" label="Devoluciones" value={devoluciones.reduce((s,m)=>s+m.qty,0)} sub={`${devoluciones.length} ops.`} color={C.yellow}/>
          <StatCard icon="⚖️" label="Balance Neto" value={fmt(valorEntradas-valorSalidas)} sub="entradas - salidas" color={valorEntradas>valorSalidas?C.green2:C.red}/>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:12}}>
          {[{v:"all",l:"Todos"},{v:"ENTRADA",l:"📥 Entradas"},{v:"SALIDA",l:"📤 Salidas"},{v:"DEVOLUCION",l:"↩ Devoluciones"}].map(o=><button key={o.v} onClick={()=>setFiltroMov(o.v)} style={{background:filtroMov===o.v?C.green3:"transparent",color:filtroMov===o.v?C.green2:C.muted,border:`1px solid ${filtroMov===o.v?C.green3:C.border}`,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase"}}>{o.l} {filtroMov===o.v&&`(${movFiltrados.length})`}</button>)}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg3}}>{["Fecha","Tipo","REF","Material","Cant.","Valor","Proyecto","Técnico","Motivo"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{movFiltrados.map(m=>{const tc=m.tipo==="ENTRADA"?C.green2:m.tipo==="DEVOLUCION"?C.yellow:C.teal2;const it=stock.find(i=>i.ref===m.ref);const val=it?it.precioUnit*m.qty:0;return(<tr key={m.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}15`} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.fecha}</td><td style={{padding:"8px"}}><span style={{background:`${tc}18`,color:tc,border:`1px solid ${tc}30`,padding:"1px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52px",fontWeight:700}}>{m.tipo==="ENTRADA"?"📥":m.tipo==="DEVOLUCION"?"↩":"📤"} {m.tipo}</span></td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.ref}</td><td style={{padding:"8px",fontSize:"0.75rem",fontWeight:500}}>{m.nombre}</td><td style={{padding:"8px",fontFamily:"monospace",fontWeight:700,fontSize:"0.8rem",color:tc}}>{m.tipo==="SALIDA"?"-":"+"}{m.qty}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.72rem",color:C.yellow}}>{fmt(val)}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{m.proyecto}</td><td style={{padding:"8px",fontSize:"0.72rem"}}>{m.tecnico}</td><td style={{padding:"8px",fontSize:"0.7rem",color:C.muted}}>{m.motivo}</td></tr>);})}
            </tbody>
            <tfoot><tr style={{background:C.bg3}}><td colSpan={5} style={{padding:"9px",fontFamily:"monospace",fontSize:"0.58rem",color:C.muted,textAlign:"right",textTransform:"uppercase"}}>Valor total →</td><td style={{padding:"9px",fontFamily:"monospace",fontWeight:800,fontSize:"0.88rem",color:C.yellow}}>{fmt(movFiltrados.reduce((s,m)=>{const it=stock.find(i=>i.ref===m.ref);return s+(it?it.precioUnit*m.qty:0);},0))}</td><td colSpan={3}/></tr></tfoot>
          </table>
        </div>
      </>}

      {vista==="inventario"&&<>
        <STitle icon="📋">Inventario Completo con Historial</STitle>
        <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          {[{v:"all",l:"Todo"},{v:"alerta",l:`⚠ Alertas(${bajosMin.length})`},...cats.map(c=>({v:c,l:c}))].map(o=><button key={o.v} onClick={()=>setFiltroInv(o.v)} style={{background:filtroInv===o.v?C.green3:"transparent",color:filtroInv===o.v?C.green2:C.muted,border:`1px solid ${filtroInv===o.v?C.green3:C.border}`,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.6rem",textTransform:"uppercase"}}>{o.l}</button>)}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg3}}>{["REF","Descripción","Cat.","Stock","Mín.","Estado","ABC","Precio","Valor","Movs.","Ubicación"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{(filtroInv==="all"?stockABC:filtroInv==="alerta"?stockABC.filter(s=>s.qty<s.qtyMin):stockABC.filter(s=>s.categoria===filtroInv)).map(item=>{const est=item.qty===0?"AGOTADO":item.qty<item.qtyMin?"BAJO":"OK";const ec={OK:C.green2,BAJO:C.yellow,AGOTADO:C.red}[est];const abcC={A:C.red,B:C.yellow,C:C.green2}[item.abc];const nMovs=movimientos.filter(m=>m.ref===item.ref).length;return(<tr key={item.id} onClick={()=>setSelItem(selItem?.ref===item.ref?null:item)} style={{cursor:"pointer",background:selItem?.ref===item.ref?`${C.green3}22`:""}} onMouseEnter={e=>{if(selItem?.ref!==item.ref)e.currentTarget.style.background=`${C.green3}14`;}} onMouseLeave={e=>{e.currentTarget.style.background=selItem?.ref===item.ref?`${C.green3}22`:"";}}>
              <td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{item.ref}</td><td style={{padding:"8px"}}><div style={{fontSize:"0.77rem",fontWeight:500}}>{item.nombre}</div><div style={{fontSize:"0.61rem",color:C.muted}}>{item.marca}</div></td><td style={{padding:"8px",fontSize:"0.68rem",color:C.muted}}>{item.categoria}</td><td style={{padding:"8px",fontFamily:"monospace",fontWeight:700,fontSize:"0.8rem"}}>{fnum(item.qty)}<span style={{fontSize:"0.58rem",color:C.muted}}> {item.unidad}</span></td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.68rem",color:C.muted}}>{item.qtyMin}</td><td style={{padding:"8px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"1px 5px",borderRadius:3,fontFamily:"monospace",fontSize:"0.5rem"}}>{est}</span></td><td style={{padding:"8px"}}><span style={{background:`${abcC}18`,color:abcC,border:`1px solid ${abcC}40`,padding:"1px 7px",borderRadius:3,fontFamily:"monospace",fontSize:"0.58rem",fontWeight:800}}>{item.abc}</span></td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.68rem"}}>{fmt(item.precioUnit)}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.75rem",color:C.yellow,fontWeight:700}}>{fmt(item.qty*item.precioUnit)}</td><td style={{padding:"8px",fontFamily:"monospace",fontSize:"0.68rem",color:nMovs>0?C.teal2:C.muted}}>{nMovs}</td><td style={{padding:"8px",fontSize:"0.67rem",color:C.muted}}>{item.ubicacion}</td>
            </tr>);})}</tbody>
            <tfoot><tr style={{background:C.bg3}}><td colSpan={8} style={{padding:"9px",fontFamily:"monospace",fontSize:"0.58rem",color:C.muted,textAlign:"right",textTransform:"uppercase"}}>Valor total →</td><td style={{padding:"9px",fontFamily:"monospace",fontWeight:800,fontSize:"0.88rem",color:C.yellow}}>{fmt(valorTotal)}</td><td colSpan={2}/></tr></tfoot>
          </table>
        </div>
        {selItem&&<div style={{background:C.card,border:`1px solid ${C.green3}`,borderRadius:12,padding:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}><div><div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.teal,marginBottom:3}}>{selItem.ref} · HISTORIAL</div><div style={{fontWeight:700,fontSize:"1rem"}}>{selItem.nombre}</div><div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>{selItem.marca} · {selItem.categoria} · {selItem.ubicacion}</div></div><button onClick={()=>setSelItem(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.2rem"}}>✕</button></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:14}}>
            {[{l:"Stock Actual",v:`${selItem.qty} ${selItem.unidad}`,c:selItem.qty<selItem.qtyMin?C.yellow:C.green2},{l:"Valor en Stock",v:fmt(selItem.qty*selItem.precioUnit),c:C.yellow},{l:"Precio Unit.",v:fmt(selItem.precioUnit),c:C.teal2},{l:"Movimientos",v:historialRef.length,c:C.teal}].map((d,i)=><div key={i} style={{background:C.bg3,borderRadius:8,padding:"9px",textAlign:"center"}}><div style={{fontSize:"0.55rem",fontFamily:"monospace",color:C.muted,marginBottom:4,textTransform:"uppercase"}}>{d.l}</div><div style={{fontSize:"1.1rem",fontWeight:800,color:d.c}}>{d.v}</div></div>)}
          </div>
          {historialRef.length>0?<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Fecha","Tipo","Cantidad","Proyecto","Técnico","Motivo"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"5px 8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead><tbody>{historialRef.map(m=>{const tc=m.tipo==="ENTRADA"?C.green2:m.tipo==="DEVOLUCION"?C.yellow:C.teal2;return(<tr key={m.id}><td style={{padding:"6px 8px",fontFamily:"monospace",fontSize:"0.63rem",color:C.muted}}>{m.fecha}</td><td style={{padding:"6px 8px"}}><span style={{background:`${tc}18`,color:tc,padding:"1px 6px",borderRadius:3,fontFamily:"monospace",fontSize:"0.52rem"}}>{m.tipo}</span></td><td style={{padding:"6px 8px",fontFamily:"monospace",fontWeight:700,color:tc}}>{m.tipo==="SALIDA"?"-":"+"}{m.qty}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontSize:"0.63rem",color:C.muted}}>{m.proyecto}</td><td style={{padding:"6px 8px",fontSize:"0.72rem"}}>{m.tecnico}</td><td style={{padding:"6px 8px",fontSize:"0.7rem",color:C.muted}}>{m.motivo}</td></tr>);})}</tbody></table>:<div style={{textAlign:"center",padding:"14px",color:C.muted,fontSize:"0.75rem"}}>Sin movimientos registrados</div>}
        </div>}
      </>}

      {vista==="forecast"&&<>
        <STitle icon="📅">Previsión de Reposición</STitle>
        <div style={{background:`linear-gradient(135deg,${C.teal3}30,${C.bg3})`,border:`1px solid ${C.teal3}`,borderRadius:11,padding:"12px 16px",marginBottom:16,fontSize:"0.75rem",color:C.muted}}>
          <span style={{color:C.teal2,fontWeight:700}}>💡 Basado en consumo de los últimos 2 meses. </span>
          <span style={{color:C.red}}>🔴 Urgente &lt;30d </span>· <span style={{color:C.yellow}}>🟡 Próximo &lt;60d </span>· <span style={{color:C.green2}}>🟢 OK &gt;60d</span>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg3}}>{["REF","Material","Stock","Consumo/mes","Días Cobertura","Reposición Necesaria","Alerta"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.5rem",color:C.muted,textTransform:"uppercase",padding:"9px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{forecastData.map(item=>{const col=item.diasRestantes<30?C.red:item.diasRestantes<60?C.yellow:C.green2;const necesidad=Math.max(item.qtyMin*2-item.qty,0);return(<tr key={item.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}14`} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{item.ref}</td><td style={{padding:"9px"}}><div style={{fontSize:"0.77rem",fontWeight:500}}>{item.nombre}</div><div style={{fontSize:"0.62rem",color:C.muted}}>{item.categoria}</div></td><td style={{padding:"9px",fontFamily:"monospace",fontWeight:700,fontSize:"0.8rem"}}>{item.qty} {item.unidad}</td><td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.75rem",color:C.teal2}}>{item.consumoMes} {item.unidad}/mes</td><td style={{padding:"9px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{height:6,width:80,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(item.diasRestantes/90*100,100)}%`,background:col,borderRadius:3}}/></div><span style={{fontFamily:"monospace",fontWeight:800,fontSize:"0.78rem",color:col}}>{item.diasRestantes===999?"∞":item.diasRestantes+"d"}</span></div></td><td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.75rem",color:necesidad>0?C.red:C.green2,fontWeight:700}}>{necesidad>0?`+${necesidad} ${item.unidad}`:"OK"}</td><td style={{padding:"9px"}}><span style={{background:`${col}18`,color:col,border:`1px solid ${col}30`,padding:"2px 7px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52rem"}}>{item.diasRestantes<30?"⚠ URGENTE":item.diasRestantes<60?"PRÓXIMO":"OK"}</span></td></tr>);})}
            {stock.filter(s=>!consumoMensual[s.ref]).slice(0,2).map(item=><tr key={item.id} style={{opacity:0.45}}><td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{item.ref}</td><td style={{padding:"9px",fontSize:"0.75rem",color:C.muted}}>{item.nombre}</td><td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.75rem",color:C.muted}}>{item.qty}</td><td colSpan={4} style={{padding:"9px",fontFamily:"monospace",fontSize:"0.65rem",color:C.muted}}>Sin datos de consumo suficientes</td></tr>)}</tbody>
          </table>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{label:"🔴 Urgente < 30 días",items:forecastData.filter(f=>f.diasRestantes<30),color:C.red},{label:"🟡 Próximo 30-60 días",items:forecastData.filter(f=>f.diasRestantes>=30&&f.diasRestantes<60),color:C.yellow},{label:"🟢 Sin urgencia > 60 días",items:forecastData.filter(f=>f.diasRestantes>=60),color:C.green2}].map((grupo,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${grupo.color}30`,borderRadius:11,padding:16}}>
              <div style={{fontWeight:700,color:grupo.color,fontSize:"0.8rem",marginBottom:8}}>{grupo.label}</div>
              <div style={{fontSize:"2rem",fontWeight:800,color:grupo.color,marginBottom:6}}>{grupo.items.length}</div>
              {grupo.items.slice(0,3).map(it=><div key={it.ref} style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",marginBottom:2}}><span style={{color:C.muted}}>{it.ref}</span><span style={{fontFamily:"monospace",color:grupo.color,fontWeight:700}}>{it.diasRestantes===999?"∞":it.diasRestantes+"d"}</span></div>)}
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [stock,setStock]=useState(INIT_STOCK);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [horas,setHoras]=useState(INIT_HORAS);
  const [movimientos]=useState(INIT_MOVIMIENTOS);
  const [clientes]=useState(INIT_CLIENTES);
  const [ventasMensuales]=useState(VENTAS_MENSUALES);
  const [now,setNow]=useState(new Date());
  const [syncStatus,setSyncStatus]=useState("demo");
  const [lastSync,setLastSync]=useState(null);
  const [loading,setLoading]=useState(false);

  const sync=async()=>{
    setLoading(true);setSyncStatus("loading");
    try{
      const[stockRes,prodRes,projRes,horasRes]=await Promise.allSettled([fetchSheet(TABS.stock),fetchSheet(TABS.productos),fetchSheet(TABS.proyectos),fetchSheet(TABS.horas)]);
      if(stockRes.status==="fulfilled"&&stockRes.value.length)setStock(stockRes.value.map(mapStock));
      else if(prodRes.status==="fulfilled"&&prodRes.value.length)setStock(prodRes.value.map(mapStock));
      if(projRes.status==="fulfilled"&&projRes.value.length){const m=projRes.value.map(mapProyecto).filter(Boolean);if(m.length)setProjects(m);}
      if(horasRes.status==="fulfilled"&&horasRes.value.length){const m=horasRes.value.map(mapHoras).filter(Boolean);if(m.length)setHoras(m);}
      setSyncStatus("ok");setLastSync(new Date());
    }catch(e){setSyncStatus("error");}
    finally{setLoading(false);}
  };
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{sync();const iv=setInterval(sync,5*60*1000);return()=>clearInterval(iv);},[]);

  const ss={demo:{text:"DATOS DEMO",bg:`${C.muted}15`,c:C.muted,bo:C.border},loading:{text:"SYNC...",bg:`${C.yellow}10`,c:C.yellow,bo:`${C.yellow}40`},ok:{text:`✓ ${lastSync?lastSync.toLocaleTimeString("es-ES"):""}`,bg:`${C.green3}35`,c:C.green2,bo:C.green3},error:{text:"⚠ SHEET NO PÚBLICO",bg:`${C.red}10`,c:C.red,bo:`${C.red}40`}}[syncStatus];
  const tabs=[{id:"dashboard",l:"Dashboard"},{id:"graficos",l:"📈 Gráficos"},{id:"clientes",l:"👤 Clientes"},{id:"proyectos",l:"Proyectos"},{id:"almacen",l:"Almacén"}];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#081508;}::-webkit-scrollbar-thumb{background:#1f6b1e;border-radius:4px;}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 22px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,15,8,0.98)",position:"sticky",top:0,zIndex:100}}>
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
      </header>
      <main style={{padding:"18px 22px",maxWidth:1600,margin:"0 auto"}}>
        {tab==="dashboard"&&<TabDashboard projects={projects} stock={stock} horas={horas} clientes={clientes} ventasMensuales={ventasMensuales}/>}
        {tab==="graficos"&&<TabGraficos projects={projects} stock={stock} horas={horas} ventasMensuales={ventasMensuales}/>}
        {tab==="clientes"&&<TabClientes clientes={clientes} projects={projects}/>}
        {tab==="proyectos"&&<TabProyectos projects={projects} horas={horas}/>}
        {tab==="almacen"&&<TabAlmacen stock={stock} movimientos={movimientos}/>}
      </main>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"10px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><AFCLogo size={18} full/><span style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted}}>Panel de Control · Uso Interno · Confidencial</span></div>
        <span style={{fontFamily:"monospace",fontSize:"0.55rem",color:C.muted}}>Sync Google Sheets · {now.getFullYear()}</span>
      </footer>
    </div>
  );
}
