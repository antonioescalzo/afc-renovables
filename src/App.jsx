import { useState, useEffect, useRef, useCallback } from "react";

// ─── SHEETS ───────────────────────────────────────────────────────────────────
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

// ─── COLORES AFC RENOVABLES OFICIAL ──────────────────────────────────────────
const C={
  bg:"#050f0a", bg2:"#081508", bg3:"#0d1f10",
  teal:"#0e7fa3", teal2:"#0d9abf", teal3:"#0a4f65",
  green:"#3da83c", green2:"#52c450", green3:"#1f6b1e",
  greenLeaf:"#4ab83e", accent:"#7ed956",
  yellow:"#f5c518", red:"#e85050",
  text:"#e8f5e9", muted:"#6aad7a", border:"#1a3d20",
  card:"#0a1c0b", card2:"#0d2410",
  white:"#f0faf1",
};

// ─── LOGO OFICIAL AFC RENOVABLES ─────────────────────────────────────────────
function AFCLogo({size=42,full=false}){
  const h=size, w=full?size*4.2:size;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${full?210:h} ${h}`} fill="none">
      {full && <>
        <text x="0" y={h*0.78} fontFamily="'DM Sans',sans-serif" fontWeight="800" fontSize={h*0.72} fill={C.teal}>AFC</text>
        <text x={h*2.15} y={h*0.95} fontFamily="'DM Sans',sans-serif" fontWeight="400" fontSize={h*0.28} fill={C.teal} letterSpacing="1">renovables</text>
      </>}
      {/* Símbolo = + hoja */}
      <g transform={`translate(${full?h*2.75:0},0)`}>
        {/* Líneas = */}
        <rect x={h*0.05} y={h*0.34} width={h*0.28} height={h*0.1} rx={h*0.04} fill={C.greenLeaf}/>
        <rect x={h*0.05} y={h*0.52} width={h*0.28} height={h*0.1} rx={h*0.04} fill={C.greenLeaf}/>
        {/* Hoja principal izquierda */}
        <path d={`M${h*0.42} ${h*0.55} Q${h*0.35} ${h*0.2} ${h*0.62} ${h*0.08} Q${h*0.68} ${h*0.35} ${h*0.58} ${h*0.55} Z`} fill={C.green}/>
        {/* Hoja secundaria derecha */}
        <path d={`M${h*0.58} ${h*0.48} Q${h*0.72} ${h*0.15} ${h*0.92} ${h*0.22} Q${h*0.88} ${h*0.48} ${h*0.65} ${h*0.58} Z`} fill={C.greenLeaf}/>
        {/* Tallo */}
        <path d={`M${h*0.52} ${h*0.55} Q${h*0.5} ${h*0.72} ${h*0.48} ${h*0.9}`} stroke={C.green} strokeWidth={h*0.06} strokeLinecap="round" fill="none"/>
        {/* Rama derecha */}
        <path d={`M${h*0.5} ${h*0.7} Q${h*0.62} ${h*0.68} ${h*0.7} ${h*0.62}`} stroke={C.greenLeaf} strokeWidth={h*0.045} strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt  = n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n||0);
const fnum = n=>new Intl.NumberFormat("es-ES").format(n||0);
const pct  = (a,b)=>b?Math.round((a/b)*100):0;
const TIPO_COLORS={"Solar Residencial":C.teal2,"Solar Industrial":C.green,"Aerotermia":"#f59e0b","Calefacción":"#e85050","Mixto Solar+Aero":C.accent};
const EQ_COLORS={"Equipo Alpha":C.teal2,"Equipo Beta":C.greenLeaf,"Equipo Gamma":"#f59e0b","Equipo Delta":"#a78bfa"};

// ─── TOOLTIP FLOTANTE TIPO POWER BI ─────────────────────────────────────────
function Tooltip({visible,x,y,children}){
  if(!visible)return null;
  return(
    <div style={{position:"fixed",left:x+16,top:y-10,zIndex:9999,background:"rgba(5,20,8,0.97)",border:`1px solid ${C.green3}`,borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",pointerEvents:"none",minWidth:180,maxWidth:260}}>
      {children}
    </div>
  );
}

// ─── GRÁFICO DE BARRAS INTERACTIVO ───────────────────────────────────────────
function BarChart({data,color,height=180,title,subtitle,fmt:fmtFn,unit=""}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const maxVal=Math.max(...data.map(d=>d.v),1);
  return(
    <div style={{position:"relative"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>{subtitle}</div>}
      <div style={{display:"flex",alignItems:"flex-end",gap:8,height:height+36,paddingTop:12}} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
        {data.map((d,i)=>{
          const barH=Math.max((d.v/maxVal)*(height-24),2);
          const isHover=hover===i;
          return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}} onMouseEnter={()=>setHover(i)}>
              <div style={{fontSize:"0.58rem",fontFamily:"monospace",color:isHover?(color||C.green2):C.muted,fontWeight:isHover?700:400,transition:"color 0.15s"}}>{d.v>0?(fmtFn?fmtFn(d.v):`${d.v}${unit}`):""}</div>
              <div style={{width:"100%",height:height-4,display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",height:barH,background:isHover?`linear-gradient(to top,${color||C.green},${C.accent})`:`linear-gradient(to top,${color||C.green}99,${color||C.green}66)`,borderRadius:"4px 4px 0 0",transition:"height 0.5s, background 0.15s",boxShadow:isHover?`0 0 12px ${color||C.green}60`:""}}/>
              </div>
              <div style={{fontSize:"0.6rem",color:isHover?C.text:C.muted,textAlign:"center",lineHeight:1.2,fontWeight:isHover?600:400,maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.l}</div>
            </div>
          );
        })}
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:6,color:color||C.green2}}>{data[hover].l}</div>
          <div style={{fontSize:"1.3rem",fontWeight:800,color:C.white}}>{fmtFn?fmtFn(data[hover].v):`${data[hover].v}${unit}`}</div>
          {data[hover].sub&&<div style={{fontSize:"0.7rem",color:C.muted,marginTop:4}}>{data[hover].sub}</div>}
          {data[hover].extra&&data[hover].extra.map((e,i)=><div key={i} style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>· {e}</div>)}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── GRÁFICO DE LÍNEA INTERACTIVO ────────────────────────────────────────────
function LineChart({data,color,height=140,title,subtitle,fmtFn}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const svgRef=useRef(null);
  const W=500,H=height;
  const maxV=Math.max(...data.map(d=>d.v),1),minV=0;
  const px=(i)=>data.length>1?(i/(data.length-1))*(W-40)+20:W/2;
  const py=(v)=>H-16-((v-minV)/(maxV-minV||1))*(H-32);
  const pathD=data.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d.v)}`).join(" ");
  const areaD=`${pathD} L${px(data.length-1)},${H-16} L${px(0)},${H-16} Z`;
  return(
    <div style={{position:"relative"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.67rem",color:C.muted,marginBottom:10}}>{subtitle}</div>}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H,overflow:"visible",cursor:"crosshair"}} onMouseMove={e=>{const r=svgRef.current.getBoundingClientRect();const relX=(e.clientX-r.left)/r.width*W;const idx=Math.round(((relX-20)/(W-40))*(data.length-1));setHover(Math.max(0,Math.min(data.length-1,idx)));setMouse({x:e.clientX,y:e.clientY});}} onMouseLeave={()=>setHover(null)}>
        <defs>
          <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color||C.green} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={color||C.green} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {[0,0.25,0.5,0.75,1].map((t,i)=><line key={i} x1="20" y1={py(minV+(maxV-minV)*t)} x2={W-20} y2={py(minV+(maxV-minV)*t)} stroke={C.border} strokeWidth="0.5" strokeDasharray="3,4"/>)}
        <path d={areaD} fill="url(#lineArea)"/>
        <path d={pathD} fill="none" stroke={color||C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div style={{fontWeight:700,fontSize:"0.82rem",marginBottom:5,color:C.muted}}>{data[hover].l}</div>
          <div style={{fontSize:"1.4rem",fontWeight:800,color:color||C.green2}}>{fmtFn?fmtFn(data[hover].v):data[hover].v}</div>
          {hover>0&&<div style={{fontSize:"0.68rem",color:data[hover].v>=data[hover-1].v?C.green2:C.red,marginTop:3}}>{data[hover].v>=data[hover-1].v?"▲":"▼"} {Math.abs(Math.round(((data[hover].v-data[hover-1].v)/data[hover-1].v)*100))}% vs anterior</div>}
          {data[hover].sub&&<div style={{fontSize:"0.7rem",color:C.muted,marginTop:4}}>{data[hover].sub}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── DONUT INTERACTIVO ────────────────────────────────────────────────────────
function DonutInteractive({segments,size=140,thickness=22,title}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const total=segments.reduce((s,sg)=>s+sg.value,0)||1;
  const r=(size-thickness*2)/2,cx=size/2,cy=size/2,circum=2*Math.PI*r;
  let offset=0;
  const slices=segments.map((sg,i)=>{const dash=(sg.value/total)*circum,s={dash,offset,color:sg.color,pct:Math.round((sg.value/total)*100),sg,i};offset+=dash;return s;});
  return(
    <div style={{position:"relative",display:"flex",gap:16,alignItems:"center"}}>
      <svg width={size} height={size} style={{cursor:"pointer",flexShrink:0}} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg3} strokeWidth={thickness+4}/>
        {slices.map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r+(hover===i?4:0)} fill="none" stroke={s.color} strokeWidth={hover===i?thickness+4:thickness}
            strokeDasharray={`${s.dash} ${circum-s.dash}`} strokeDashoffset={circum/4-s.offset}
            style={{transition:"r 0.15s, stroke-width 0.15s",cursor:"pointer",filter:hover===i?`drop-shadow(0 0 8px ${s.color})`:"none"}}
            onMouseEnter={()=>setHover(i)}/>
        ))}
        <text x={cx} y={cy-6} textAnchor="middle" fill={hover!==null?slices[hover]?.color:C.text} fontSize="20" fontWeight="800" fontFamily="monospace">{hover!==null?`${slices[hover]?.pct}%`:total}</text>
        <text x={cx} y={cy+14} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">{hover!==null?"del total":title||"total"}</text>
      </svg>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
        {segments.map((sg,i)=>(
          <div key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",opacity:hover!==null&&hover!==i?0.4:1,transition:"opacity 0.15s"}}>
            <div style={{width:10,height:10,borderRadius:2,background:sg.color,flexShrink:0,boxShadow:hover===i?`0 0 8px ${sg.color}`:""}}/>
            <div style={{flex:1,fontSize:"0.76rem"}}>{sg.label}</div>
            <div style={{fontFamily:"monospace",fontSize:"0.72rem",color:sg.color,fontWeight:700}}>{sg.value}</div>
          </div>
        ))}
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&<>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
            <div style={{width:10,height:10,borderRadius:2,background:slices[hover]?.color}}/>
            <div style={{fontWeight:700,color:slices[hover]?.color}}>{slices[hover]?.sg.label}</div>
          </div>
          <div style={{fontSize:"1.5rem",fontWeight:800,color:C.white}}>{slices[hover]?.pct}%</div>
          <div style={{fontSize:"0.72rem",color:C.muted,marginTop:3}}>{slices[hover]?.sg.value} proyectos de {total}</div>
          {slices[hover]?.sg.facturado&&<div style={{fontSize:"0.72rem",color:C.muted,marginTop:2}}>Facturado: {fmt(slices[hover].sg.facturado)}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── SCATTER PLOT ─────────────────────────────────────────────────────────────
function ScatterPlot({data,title,subtitle}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const W=500,H=200;
  const maxX=Math.max(...data.map(d=>d.x),1),maxY=Math.max(...data.map(d=>Math.abs(d.y)),1);
  const px=v=>20+(v/maxX)*(W-40);
  const py=v=>H/2-((v)/maxY)*(H/2-20);
  return(
    <div style={{position:"relative"}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.67rem",color:C.muted,marginBottom:10}}>{subtitle}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H,cursor:"crosshair"}} onMouseLeave={()=>setHover(null)} onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})}>
        <line x1="20" y1={H/2} x2={W-20} y2={H/2} stroke={C.border} strokeWidth="1"/>
        <line x1="20" y1="10" x2="20" y2={H-10} stroke={C.border} strokeWidth="1"/>
        <text x="22" y={H/2-4} fill={C.red} fontSize="8" fontFamily="monospace">zona pérdidas</text>
        <text x="22" y={H/2+12} fill={C.green} fontSize="8" fontFamily="monospace">zona beneficios</text>
        {data.map((d,i)=>{
          const col=d.y<0?C.red:d.y>20?C.green2:C.teal;
          return(
            <g key={i} onMouseEnter={()=>setHover(i)} style={{cursor:"pointer"}}>
              <circle cx={px(d.x)} cy={py(d.y)} r={hover===i?10:7} fill={col} opacity={hover!==null&&hover!==i?0.3:0.85} stroke={hover===i?C.white:"none"} strokeWidth="2" style={{transition:"r 0.1s, opacity 0.15s"}}/>
              <text x={px(d.x)} y={py(d.y)-11} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace" opacity={hover===i?1:0.5}>{d.id}</text>
            </g>
          );
        })}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.6rem",color:C.muted,fontFamily:"monospace",marginTop:4,padding:"0 4px"}}>
        <span>← Presupuesto menor</span><span>Presupuesto mayor →</span>
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,color:C.text,marginBottom:5}}>{data[hover].label}</div>
          <div style={{display:"flex",justifyContent:"space-between",gap:16,fontSize:"0.78rem"}}>
            <div><div style={{color:C.muted,fontSize:"0.62rem"}}>PRESUPUESTO</div><div style={{color:C.white,fontWeight:700}}>{fmt(data[hover].x)}</div></div>
            <div><div style={{color:C.muted,fontSize:"0.62rem"}}>MARGEN</div><div style={{color:data[hover].y<0?C.red:C.green2,fontWeight:700}}>{data[hover].y}%</div></div>
          </div>
          {data[hover].equipo&&<div style={{fontSize:"0.68rem",color:C.muted,marginTop:5}}>Equipo: {data[hover].equipo}</div>}
          {data[hover].tipo&&<div style={{fontSize:"0.68rem",color:C.muted}}>Tipo: {data[hover].tipo}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── HORIZONTAL BAR INTERACTIVO ──────────────────────────────────────────────
function HBarChart({data,title,subtitle,fmtFn,maxWidth=100}){
  const [hover,setHover]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const maxVal=Math.max(...data.map(d=>Math.abs(d.v)),1);
  return(
    <div onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>setHover(null)}>
      {title&&<div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>{subtitle}</div>}
      {data.map((d,i)=>{
        const barW=Math.min((Math.abs(d.v)/maxVal)*maxWidth,maxWidth);
        const col=d.color||(d.v<0?C.red:d.v>20?C.green2:C.teal);
        const isH=hover===i;
        return(
          <div key={i} onMouseEnter={()=>setHover(i)} style={{display:"grid",gridTemplateColumns:"110px 1fr 60px",alignItems:"center",gap:10,marginBottom:10,cursor:"pointer"}}>
            <div style={{fontSize:"0.75rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:isH?C.text:C.muted,transition:"color 0.15s",fontWeight:isH?600:400}}>{d.l}</div>
            <div style={{height:isH?10:7,background:C.bg3,borderRadius:4,overflow:"hidden",transition:"height 0.15s"}}>
              <div style={{height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,${col},${col}99)`,borderRadius:4,transition:"width 0.6s, background 0.15s",boxShadow:isH?`0 0 8px ${col}60`:""}}/>
            </div>
            <div style={{fontFamily:"monospace",fontSize:"0.75rem",color:col,fontWeight:700,textAlign:"right"}}>{fmtFn?fmtFn(d.v):`${d.v}%`}</div>
          </div>
        );
      })}
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:6,color:data[hover].color||(data[hover].v<0?C.red:C.green2)}}>{data[hover].l}</div>
          <div style={{fontSize:"1.3rem",fontWeight:800,color:C.white}}>{fmtFn?fmtFn(data[hover].v):`${data[hover].v}%`}</div>
          {data[hover].sub&&<div style={{fontSize:"0.7rem",color:C.muted,marginTop:4}}>{data[hover].sub}</div>}
        </>}
      </Tooltip>
    </div>
  );
}

// ─── STACKED BAR ─────────────────────────────────────────────────────────────
function StackedBar({data,title,subtitle,height=160}){
  const [hover,setHover]=useState(null);
  const [hoverSeg,setHoverSeg]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const maxTotal=Math.max(...data.map(d=>d.segments.reduce((s,sg)=>s+sg.v,0)),1);
  return(
    <div onMouseMove={e=>setMouse({x:e.clientX,y:e.clientY})} onMouseLeave={()=>{setHover(null);setHoverSeg(null);}}>
      {title&&<div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>{title}</div>}
      {subtitle&&<div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>{subtitle}</div>}
      <div style={{display:"flex",alignItems:"flex-end",gap:10,height:height+24}}>
        {data.map((d,i)=>{
          const total=d.segments.reduce((s,sg)=>s+sg.v,0);
          const barH=(total/maxTotal)*(height-10);
          return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}} onMouseEnter={()=>setHover(i)}>
              <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:hover===i?C.text:C.muted}}>{hover===i?fmt(total):""}</div>
              <div style={{width:"100%",height:height,display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",height:barH,display:"flex",flexDirection:"column-reverse",borderRadius:"4px 4px 0 0",overflow:"hidden",transition:"height 0.5s",boxShadow:hover===i?"0 0 12px rgba(0,200,100,0.3)":""}}>
                  {d.segments.map((sg,j)=>(
                    <div key={j} style={{flex:sg.v,background:sg.color,opacity:hoverSeg!==null&&hoverSeg!==j?0.5:1,transition:"opacity 0.15s"}} onMouseEnter={e=>{e.stopPropagation();setHoverSeg(j);}} onMouseLeave={()=>setHoverSeg(null)}/>
                  ))}
                </div>
              </div>
              <div style={{fontSize:"0.6rem",color:hover===i?C.text:C.muted,textAlign:"center",lineHeight:1.2}}>{d.l}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
        {data[0]?.segments.map((sg,i)=>(
          <div key={i} onMouseEnter={()=>setHoverSeg(i)} onMouseLeave={()=>setHoverSeg(null)} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",opacity:hoverSeg!==null&&hoverSeg!==i?0.4:1}}>
            <div style={{width:10,height:10,borderRadius:2,background:sg.color}}/>
            <span style={{fontSize:"0.68rem",color:C.muted}}>{sg.label}</span>
          </div>
        ))}
      </div>
      <Tooltip visible={hover!==null} x={mouse.x} y={mouse.y}>
        {hover!==null&&data[hover]&&<>
          <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:6,color:C.text}}>{data[hover].l}</div>
          {data[hover].segments.map((sg,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:3}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:sg.color}}/><span style={{fontSize:"0.68rem",color:C.muted}}>{sg.label}</span></div>
              <span style={{fontSize:"0.72rem",fontWeight:700,color:sg.color}}>{fmt(sg.v)}</span>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${C.border}`,marginTop:5,paddingTop:5,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:"0.68rem",color:C.muted}}>TOTAL</span>
            <span style={{fontWeight:800,fontSize:"0.85rem",color:C.white}}>{fmt(data[hover].segments.reduce((s,sg)=>s+sg.v,0))}</span>
          </div>
        </>}
      </Tooltip>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({icon,label,value,sub,color,trend,trendOk}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",position:"relative",overflow:"hidden",transition:"transform 0.2s, border-color 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=C.green3;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=C.border;}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color||C.teal},transparent)`}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div style={{fontSize:"0.58rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</div>
        {icon&&<span style={{fontSize:"0.95rem",opacity:0.7}}>{icon}</span>}
      </div>
      <div style={{fontSize:"1.7rem",fontWeight:800,color:color||C.text,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:"0.62rem",color:C.muted,marginTop:5,fontFamily:"monospace"}}>{sub}</div>}
      {trend&&<div style={{fontSize:"0.62rem",color:trendOk?C.green2:C.red,marginTop:3,fontFamily:"monospace"}}>{trendOk?"▲":"▼"} {trend}</div>}
    </div>
  );
}

function STitle({icon,children,badge}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,marginTop:4}}>
      {icon&&<span style={{fontSize:"0.95rem"}}>{icon}</span>}
      <span style={{fontFamily:"monospace",fontSize:"0.63rem",color:C.teal,textTransform:"uppercase",letterSpacing:"0.2em",fontWeight:700}}>{children}</span>
      {badge&&<span style={{background:C.green3,color:C.greenLeaf,border:`1px solid ${C.green3}`,padding:"1px 8px",borderRadius:4,fontFamily:"monospace",fontSize:"0.55rem"}}>{badge}</span>}
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function TabDashboard({projects,stock,horas}){
  const completados=projects.filter(p=>p.estado==="completado");
  const enEjecucion=projects.filter(p=>p.estado==="ejecucion");
  const enPpto=projects.filter(p=>p.estado==="presupuesto");
  const totalFact=completados.reduce((s,p)=>s+p.presupuesto,0);
  const totalCost=completados.reduce((s,p)=>s+p.gastado,0);
  const margenMedio=completados.filter(p=>p.margen!==0).length?Math.round(completados.filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/completados.filter(p=>p.margen!==0).length):0;
  const enRiesgo=projects.filter(p=>p.margen<0);
  const valorStock=stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);
  const stockBajo=stock.filter(s=>s.qty<s.qtyMin);
  const totalHoras=horas.reduce((s,h)=>s+h.horas,0);
  const ticketMedio=completados.length?Math.round(totalFact/completados.length):0;
  const pipeline=enPpto.reduce((s,p)=>s+p.presupuesto,0);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const tipos=[...new Set(projects.map(p=>p.tipo))].filter(Boolean);

  return(
    <div>
      {enRiesgo.length>0&&<div style={{background:"rgba(232,80,80,0.08)",border:"1px solid rgba(232,80,80,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:"1rem"}}>⚠️</span><div><span style={{color:C.red,fontWeight:700}}>Proyectos con margen negativo: </span><span style={{fontSize:"0.75rem",color:C.muted}}>{enRiesgo.map(p=>`${p.id} (${p.margen}%)`).join(" · ")}</span></div>
      </div>}
      {stockBajo.length>0&&<div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <span>📦</span><div><span style={{color:C.yellow,fontWeight:700}}>Stock bajo mínimo: </span><span style={{fontSize:"0.75rem",color:C.muted}}>{stockBajo.map(s=>`${s.ref} (${s.qty}/${s.qtyMin})`).join(" · ")}</span></div>
      </div>}

      <STitle icon="📊">Resumen Ejecutivo</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:18}}>
        <StatCard icon="🏗️" label="Proyectos Totales" value={projects.length} sub={`${completados.length} completados · ${enEjecucion.length} activos`} color={C.teal2}/>
        <StatCard icon="💶" label="Facturación Total" value={fmt(totalFact)} sub="proyectos completados" color={C.green2} trend="+8% vs mes ant." trendOk/>
        <StatCard icon="📈" label="Margen Medio" value={`${margenMedio}%`} sub="proyectos cerrados" color={margenMedio>20?C.green2:margenMedio>0?C.yellow:C.red}/>
        <StatCard icon="🎯" label="Ticket Medio" value={fmt(ticketMedio)} sub="por instalación" color={C.teal2}/>
        <StatCard icon="💼" label="Pipeline" value={fmt(pipeline)} sub={`${enPpto.length} presupuestos`} color={C.yellow}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:22}}>
        <StatCard icon="📦" label="Valor Almacén" value={fmt(valorStock)} sub={stockBajo.length>0?`⚠ ${stockBajo.length} bajo mín.`:"Stock OK"} color={C.yellow}/>
        <StatCard icon="⏱️" label="Horas MO" value={`${fnum(totalHoras)}h`} sub="registradas total" color={C.greenLeaf}/>
        <StatCard icon="🔧" label="Incidencias" value={projects.reduce((s,p)=>s+p.incidencias,0)} sub="todos los proyectos" color={C.red}/>
        <StatCard icon="⚖️" label="Pto. Equilibrio" value={fmt(Math.round(15000/0.28))} sub="facturación mín/mes" color={C.teal}/>
        <StatCard icon="💰" label="Coste Total" value={fmt(totalCost)} sub={`${pct(totalCost,totalFact)}% del facturado`} color={C.muted}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <BarChart title="Facturación por Tipo de Instalación" subtitle="Solo proyectos completados — pasar el ratón para detalle"
            data={tipos.map(t=>({l:t.split(" ")[0],v:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0),sub:`${completados.filter(p=>p.tipo===t).length} proyectos`,extra:[`Margen medio: ${completados.filter(p=>p.tipo===t).length?Math.round(completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/Math.max(completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).length,1)):0}%`]}))}
            color={C.green} fmtFn={fmt} height={140}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>Distribución por Tipo</div>
          <div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>Pasar el ratón sobre cada segmento</div>
          <DonutInteractive title="total" segments={tipos.map(t=>({label:t,value:projects.filter(p=>p.tipo===t).length,color:TIPO_COLORS[t]||C.teal,facturado:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0)}))}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>Estado de Proyectos</div>
          <div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>Distribución actual de la cartera</div>
          <DonutInteractive title="cartera" segments={[
            {label:"Completado",value:completados.length,color:C.green2},
            {label:"En Ejecución",value:enEjecucion.length,color:C.teal2},
            {label:"Presupuesto",value:enPpto.length,color:C.yellow},
            {label:"Parado",value:projects.filter(p=>p.estado==="parado").length,color:C.red},
          ].filter(s=>s.value>0)}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <HBarChart title="Rendimiento por Equipo" subtitle="Margen medio por equipo (proyectos completados)"
            data={equipos.map(eq=>({l:eq.replace("Equipo ",""),v:completados.filter(p=>p.equipo===eq&&p.margen!==0).length?Math.round(completados.filter(p=>p.equipo===eq&&p.margen!==0).reduce((s,p)=>s+p.margen,0)/completados.filter(p=>p.equipo===eq&&p.margen!==0).length):0,color:EQ_COLORS[eq]||C.teal,sub:`${completados.filter(p=>p.equipo===eq).length} proyectos · ${horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0)}h`}))}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>Proyectos Recientes</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Cliente","Equipo","Estado","Margen"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.53rem",color:C.muted,textTransform:"uppercase",padding:"5px 7px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{projects.slice(0,7).map(p=>{const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow,parado:C.red}[p.estado]||C.muted;return(<tr key={p.id} style={{borderBottom:`1px solid ${C.border}10`}} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}15`} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{padding:"7px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.id}</td><td style={{padding:"7px",fontSize:"0.77rem",fontWeight:500}}>{p.cliente.split(" ").slice(0,2).join(" ")}</td><td style={{padding:"7px",fontSize:"0.7rem",color:C.muted}}>{p.equipo?.replace("Equipo ","")}</td><td style={{padding:"7px"}}><span style={{background:`${ec}18`,color:ec,padding:"1px 5px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52rem",textTransform:"uppercase"}}>{p.estadoLabel.split(" ")[0]}</span></td><td style={{padding:"7px",fontFamily:"monospace",fontWeight:700,fontSize:"0.75rem",color:p.margen<0?C.red:p.margen>0?C.green2:C.muted}}>{p.gastado||p.estado==="completado"?`${p.margen}%`:"—"}</td></tr>);})}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB GRÁFICOS INTERACTIVOS
// ═══════════════════════════════════════════════════════════════════════════════
function TabGraficos({projects,stock,horas}){
  const completados=projects.filter(p=>p.estado==="completado");
  const enEjecucion=projects.filter(p=>p.estado==="ejecucion");
  const tipos=[...new Set(projects.map(p=>p.tipo))].filter(Boolean);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  const tecnicos=[...new Set(horas.map(h=>h.tecnico))].filter(Boolean);
  const cats=[...new Set(stock.map(s=>s.categoria))].filter(Boolean);

  // Datos para gráficos
  const meses=["Sep","Oct","Nov","Dic","Ene","Feb","Mar"];
  const facMeses=[38000,52000,67000,85000,94000,87500,72000];
  const margenMeses=[22,19,24,21,17,20,18];
  const projMeses=[2,3,4,3,4,3,2];

  const tipoFac=tipos.map(t=>({l:t.split("+")[0].split(" ").slice(-1)[0],v:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0),sub:`${completados.filter(p=>p.tipo===t).length} instalaciones`,extra:[`Margen medio: ${completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).length?Math.round(completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/completados.filter(p=>p.tipo===t).filter(p=>p.margen!==0).length):0}%`]}));
  const eqHoras=equipos.map(eq=>({l:eq.replace("Equipo ","Eq. "),v:horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0),sub:`${horas.filter(h=>h.equipo===eq).length} partes`}));
  const tecHoras=tecnicos.map(t=>({l:t.split(" ")[0],v:horas.filter(h=>h.tecnico===t).reduce((s,h)=>s+h.horas,0),sub:horas.filter(h=>h.tecnico===t)[0]?.equipo||""}));
  const catValor=cats.map(c=>({l:c.split(" ")[0],v:stock.filter(s=>s.categoria===c).reduce((a,b)=>a+b.qty*b.precioUnit,0),sub:`${stock.filter(s=>s.categoria===c).length} referencias`,extra:[`Stock mín.: ${stock.filter(s=>s.categoria===c).filter(s=>s.qty<s.qtyMin).length} alertas`]}));
  const margenProy=completados.filter(p=>p.presupuesto>0).map(p=>({l:p.id.replace("PRY-","#"),v:p.margen,color:p.margen<0?C.red:p.margen>20?C.green2:C.teal,sub:`${p.cliente} — ${fmt(p.presupuesto)}`}));
  const scatterData=projects.filter(p=>p.presupuesto>0).map(p=>({x:p.presupuesto,y:p.margen,id:p.id.replace("PRY-","P"),label:p.cliente,equipo:p.equipo,tipo:p.tipo}));
  const stackData=equipos.map(eq=>{const ps=completados.filter(p=>p.equipo===eq);return{l:eq.replace("Equipo ",""),segments:[{v:ps.reduce((s,p)=>s+p.gastado*0.6,0),color:C.teal2,label:"Materiales"},{v:ps.reduce((s,p)=>s+p.gastado*0.3,0),color:C.green,label:"Mano de Obra"},{v:ps.reduce((s,p)=>s+p.presupuesto-p.gastado,0),color:C.yellow,label:"Beneficio"}]};});

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.green3}30,${C.bg3})`,border:`1px solid ${C.green3}`,borderRadius:12,padding:"14px 18px",marginBottom:22,display:"flex",alignItems:"center",gap:14}}>
        <AFCLogo size={32}/>
        <div>
          <div style={{fontWeight:700,color:C.green2,fontSize:"0.9rem"}}>Panel de Gráficos Interactivos</div>
          <div style={{fontSize:"0.7rem",color:C.muted,marginTop:2}}>Pasa el ratón sobre cualquier gráfico para ver el detalle completo — al estilo Power BI</div>
        </div>
      </div>

      {/* FILA 1: Evolución + Margen mensual */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <LineChart title="📈 Evolución de Facturación Mensual" subtitle="Últimos 7 meses — pasa el ratón para ver valor exacto y variación"
            data={meses.map((l,i)=>({l,v:facMeses[i],sub:`${projMeses[i]} proyectos cerrados`}))} color={C.green2} fmtFn={fmt} height={150}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <LineChart title="📊 Evolución del Margen Mensual (%)" subtitle="Margen bruto medio por mes — ver tendencia"
            data={meses.map((l,i)=>({l,v:margenMeses[i],sub:`Margen ${margenMeses[i]}%`}))} color={C.teal2} height={150}/>
        </div>
      </div>

      {/* FILA 2: Por tipo + Margen por proyecto */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <BarChart title="💶 Facturación por Tipo de Instalación" subtitle="Solar Residencial, Industrial, Aerotermia... — pasa encima para detalle"
            data={tipoFac} color={C.green} fmtFn={fmt} height={160}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <HBarChart title="📏 Margen por Proyecto" subtitle="Cada barra = un proyecto completado — rojo = pérdida, verde = beneficio"
            data={margenProy} maxWidth={90}/>
        </div>
      </div>

      {/* FILA 3: Scatter + Stacked */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <ScatterPlot title="🔵 Presupuesto vs Margen (todos los proyectos)" subtitle="Cada punto = un proyecto — izquierda proyectos baratos, arriba márgenes altos"
            data={scatterData}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <StackedBar title="💼 Coste vs Beneficio por Equipo" subtitle="Materiales + Mano de Obra + Beneficio — pasa encima para breakdown"
            data={stackData} height={160}/>
        </div>
      </div>

      {/* FILA 4: Horas equipo + Horas técnico */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <BarChart title="⏱️ Horas de Mano de Obra por Equipo" subtitle="Total de horas trabajadas registradas en el sistema"
            data={eqHoras} color={C.teal} unit="h" height={140}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <BarChart title="👷 Horas por Técnico" subtitle="Productividad individual — ordenadas de mayor a menor"
            data={tecHoras.sort((a,b)=>b.v-a.v)} color={C.greenLeaf} unit="h" height={140}/>
        </div>
      </div>

      {/* FILA 5: Stock + Donuts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <BarChart title="📦 Valor de Stock por Categoría" subtitle="Dinero inmovilizado en almacén por familia de productos"
            data={catValor} color={C.yellow} fmtFn={fmt} height={120}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>🏗️ Proyectos por Tipo</div>
          <div style={{fontSize:"0.67rem",color:C.muted,marginBottom:14}}>Pasar el ratón — ve el número y facturación</div>
          <DonutInteractive title="proyectos" size={120} segments={tipos.map(t=>({label:t,value:projects.filter(p=>p.tipo===t).length,color:TIPO_COLORS[t]||C.teal,facturado:completados.filter(p=>p.tipo===t).reduce((s,p)=>s+p.presupuesto,0)}))}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>👥 Carga por Equipo</div>
          <div style={{fontSize:"0.67rem",color:C.muted,marginBottom:14}}>Proyectos asignados a cada equipo</div>
          <DonutInteractive title="equipos" size={120} segments={equipos.map(eq=>({label:eq.replace("Equipo ","Eq. "),value:projects.filter(p=>p.equipo===eq).length,color:EQ_COLORS[eq]||C.teal}))}/>
        </div>
      </div>

      {/* FILA 6: Alertas gráficas */}
      <STitle icon="📋">Resumen Visual de Alertas</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {label:"Proyectos en pérdida",value:projects.filter(p=>p.margen<0).length,total:projects.length,color:C.red,icon:"🔴"},
          {label:"Stock bajo mínimo",value:stock.filter(s=>s.qty<s.qtyMin).length,total:stock.length,color:C.yellow,icon:"📦"},
          {label:"Proyectos con incidencias",value:projects.filter(p=>p.incidencias>0).length,total:projects.length,color:C.yellow,icon:"⚠️"},
          {label:"Proyectos sin incidencias",value:projects.filter(p=>p.incidencias===0).length,total:projects.length,color:C.green2,icon:"✅"},
        ].map((item,i)=>{
          const p=Math.round((item.value/item.total)*100)||0;
          return(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{fontSize:"0.65rem",fontFamily:"monospace",color:C.muted,textTransform:"uppercase"}}>{item.icon} {item.label}</div>
              </div>
              <div style={{fontSize:"2rem",fontWeight:800,color:item.color,letterSpacing:"-0.04em"}}>{item.value}</div>
              <div style={{height:6,borderRadius:3,background:C.bg3,overflow:"hidden",marginTop:10}}>
                <div style={{height:"100%",width:`${p}%`,background:`linear-gradient(90deg,${item.color},${item.color}80)`,borderRadius:3,transition:"width 0.8s"}}/>
              </div>
              <div style={{fontSize:"0.6rem",fontFamily:"monospace",color:C.muted,marginTop:4,textAlign:"right"}}>{p}% de {item.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB PROYECTOS
// ═══════════════════════════════════════════════════════════════════════════════
function TabProyectos({projects,horas}){
  const [filtro,setFiltro]=useState("all");
  const [sel,setSel]=useState(null);
  const completados=projects.filter(p=>p.estado==="completado");
  const filtered=filtro==="all"?projects:projects.filter(p=>p.estado===filtro);
  const equipos=[...new Set(projects.map(p=>p.equipo))].filter(Boolean);
  return(
    <div>
      <STitle icon="👥">Rendimiento por Equipo</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
        {equipos.map((eq,i)=>{
          const ps=projects.filter(p=>p.equipo===eq),comp=completados.filter(p=>p.equipo===eq);
          const hrs=horas.filter(h=>h.equipo===eq).reduce((s,h)=>s+h.horas,0);
          const mg=comp.filter(p=>p.margen!==0).length?Math.round(comp.filter(p=>p.margen!==0).reduce((s,p)=>s+p.margen,0)/comp.filter(p=>p.margen!==0).length):0;
          const col=EQ_COLORS[eq]||C.teal;
          return(<div key={eq} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:10,height:10,borderRadius:"50%",background:col}}/><div style={{fontWeight:700,fontSize:"0.88rem"}}>{eq}</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"PROYECTOS",v:ps.length,c:col},{l:"HORAS",v:`${hrs}h`,c:C.greenLeaf},{l:"MARGEN",v:`${mg}%`,c:mg<0?C.red:mg>20?C.green2:C.yellow},{l:"INCID.",v:ps.reduce((s,p)=>s+p.incidencias,0),c:ps.reduce((s,p)=>s+p.incidencias,0)>0?C.red:C.green2}].map((d,j)=>(
                <div key={j} style={{background:C.bg3,borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:"1.35rem",fontWeight:800,color:d.c}}>{d.v}</div>
                  <div style={{fontSize:"0.56rem",color:C.muted,fontFamily:"monospace"}}>{d.l}</div>
                </div>
              ))}
            </div>
          </div>);
        })}
      </div>

      <STitle icon="📋">Listado de Proyectos</STitle>
      <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
        {[{v:"all",l:"Todos"},{v:"completado",l:"Completados"},{v:"ejecucion",l:"En Ejecución"},{v:"presupuesto",l:"Presupuesto"},{v:"parado",l:"Parados"}].map(o=>(
          <button key={o.v} onClick={()=>setFiltro(o.v)} style={{background:filtro===o.v?C.green3:"transparent",color:filtro===o.v?C.green2:C.muted,border:`1px solid ${filtro===o.v?C.green3:C.border}`,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>{o.l} {filtro===o.v&&`(${filtered.length})`}</button>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg3}}>{["ID","Cliente","Localidad","Tipo","Equipo","Estado","Presupuesto","Coste","Margen","Días","Incid."].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.53rem",color:C.muted,textTransform:"uppercase",padding:"9px 9px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p=>{const ec={completado:C.green2,ejecucion:C.teal2,presupuesto:C.yellow,parado:C.red}[p.estado]||C.muted;return(<tr key={p.id} onClick={()=>setSel(sel?.id===p.id?null:p)} style={{cursor:"pointer",background:sel?.id===p.id?`${C.green3}25`:""}} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}18`} onMouseLeave={e=>e.currentTarget.style.background=sel?.id===p.id?`${C.green3}25`:""}>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.62rem",color:C.muted}}>{p.id}</td>
            <td style={{padding:"9px",fontSize:"0.79rem",fontWeight:500}}>{p.cliente}</td>
            <td style={{padding:"9px",fontSize:"0.72rem",color:C.muted}}>{p.localidad}</td>
            <td style={{padding:"9px",fontSize:"0.7rem",color:C.muted}}>{p.tipo}</td>
            <td style={{padding:"9px",fontSize:"0.72rem"}}>{p.equipo}</td>
            <td style={{padding:"9px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"1px 6px",borderRadius:4,fontFamily:"monospace",fontSize:"0.52rem",textTransform:"uppercase"}}>{p.estadoLabel}</span></td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.73rem",color:C.green2}}>{p.presupuesto?fmt(p.presupuesto):"—"}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.73rem",color:C.yellow}}>{p.gastado?fmt(p.gastado):"—"}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.78rem",fontWeight:700,color:p.margen<0?C.red:p.margen>20?C.green2:C.text}}>{p.gastado||p.estado==="completado"?`${p.margen}%`:"—"}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.68rem",color:p.diasReal>p.diasEst&&p.diasReal>0?C.red:C.muted}}>{p.diasReal>0?`${p.diasReal}d`:p.diasEst>0?`${p.diasEst}d est.`:"-"}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.75rem",color:p.incidencias>0?C.red:C.muted}}>{p.incidencias}</td>
          </tr>);})}</tbody>
        </table>
      </div>
      {sel&&<div style={{background:C.card,border:`1px solid ${C.green3}`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div><div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.teal,marginBottom:4}}>{sel.id} · DETALLE</div><div style={{fontWeight:700,fontSize:"1.05rem"}}>{sel.cliente}</div><div style={{fontSize:"0.73rem",color:C.muted,marginTop:2}}>{sel.tipo} · {sel.localidad} · {sel.equipo}</div></div>
          <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.3rem"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Presupuesto",v:fmt(sel.presupuesto),c:C.green2},{l:"Coste Real",v:fmt(sel.gastado),c:C.yellow},{l:"Margen",v:`${sel.margen}%`,c:sel.margen<0?C.red:C.green2},{l:"Horas MO",v:`${horas.filter(h=>h.proyecto===sel.id).reduce((s,h)=>s+h.horas,0)}h`,c:C.greenLeaf},{l:"Incidencias",v:sel.incidencias,c:sel.incidencias>0?C.red:C.green2}].map((d,i)=>(
            <div key={i} style={{background:C.bg3,borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:"0.57rem",fontFamily:"monospace",color:C.muted,marginBottom:5,textTransform:"uppercase"}}>{d.l}</div>
              <div style={{fontSize:"1.25rem",fontWeight:800,color:d.c}}>{d.v}</div>
            </div>
          ))}
        </div>
        {horas.filter(h=>h.proyecto===sel.id).length>0&&<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Técnico","Fecha","Horas","Concepto","Incidencia"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.52rem",color:C.muted,textTransform:"uppercase",padding:"5px 8px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{horas.filter(h=>h.proyecto===sel.id).map(h=><tr key={h.id}><td style={{padding:"6px 8px",fontSize:"0.75rem",fontWeight:500}}>{h.tecnico}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontSize:"0.68rem",color:C.muted}}>{h.fecha}</td><td style={{padding:"6px 8px",fontFamily:"monospace",fontWeight:700,color:C.greenLeaf}}>{h.horas}h</td><td style={{padding:"6px 8px",fontSize:"0.72rem",color:C.muted}}>{h.concepto}</td><td style={{padding:"6px 8px",fontSize:"0.72rem",color:h.incidencia?C.red:C.muted}}>{h.incidencia||"—"}</td></tr>)}</tbody>
        </table>}
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB ALMACÉN
// ═══════════════════════════════════════════════════════════════════════════════
function TabAlmacen({stock}){
  const [filtro,setFiltro]=useState("all");
  const valorTotal=stock.reduce((s,i)=>s+i.qty*i.precioUnit,0);
  const bajosMin=stock.filter(s=>s.qty<s.qtyMin);
  const cats=[...new Set(stock.map(s=>s.categoria))].filter(Boolean);
  const catColors=[C.teal2,C.green2,C.greenLeaf,C.yellow,"#a78bfa","#fb923c"];
  const filtered=filtro==="all"?stock:filtro==="alerta"?bajosMin:stock.filter(s=>s.categoria===filtro);
  const catData=cats.map((c,i)=>({cat:c,color:catColors[i%catColors.length],valor:stock.filter(s=>s.categoria===c).reduce((a,b)=>a+b.qty*b.precioUnit,0),refs:stock.filter(s=>s.categoria===c).length}));
  return(
    <div>
      {bajosMin.length>0&&<div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:12}}><span style={{color:C.yellow,fontWeight:700}}>📦 Stock bajo mínimo: </span><span style={{fontSize:"0.75rem",color:C.muted}}>{bajosMin.map(s=>`${s.ref} (${s.qty}/${s.qtyMin}${s.unidad})`).join(" · ")}</span></div>}
      <STitle icon="📦">KPIs de Almacén</STitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        <StatCard icon="📋" label="Total Referencias" value={stock.length} sub={`${cats.length} categorías`} color={C.teal2}/>
        <StatCard icon="💶" label="Valor Almacén" value={fmt(valorTotal)} color={C.yellow}/>
        <StatCard icon="⚠️" label="Bajo Mínimo" value={bajosMin.length} sub="reponer urgente" color={bajosMin.length>0?C.red:C.green2}/>
        <StatCard icon="📅" label="Días Inventario" value={`${Math.round(valorTotal/25000*30)}d`} sub="cobertura estimada" color={C.teal}/>
        <StatCard icon="🔄" label="Rotación" value={`${Math.round((valorTotal*0.6/valorTotal)*12*10)/10}x/año`} sub="estimada" color={C.greenLeaf}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <BarChart title="💶 Valor por Categoría" subtitle="Dinero inmovilizado en cada familia de productos"
            data={catData.map(c=>({l:c.cat.split(" ")[0],v:c.valor,sub:`${c.refs} referencias`}))} color={C.yellow} fmtFn={fmt} height={120}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
          <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:4}}>📊 Stock actual vs Mínimos</div>
          <div style={{fontSize:"0.67rem",color:C.muted,marginBottom:12}}>Verde = OK · Amarillo = bajo mínimo · Rojo = agotado</div>
          {stock.slice(0,10).map(item=>{const ratio=item.qtyMin>0?Math.min((item.qty/item.qtyMin)*100,200):100;const col=item.qty===0?C.red:item.qty<item.qtyMin?C.yellow:C.green2;return(
            <div key={item.id} style={{display:"grid",gridTemplateColumns:"80px 1fr 55px",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted}}>{item.ref}</div>
              <div style={{height:6,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(ratio,100)}%`,background:`linear-gradient(90deg,${col},${col}80)`,borderRadius:3,transition:"width 0.8s"}}/></div>
              <div style={{fontFamily:"monospace",fontSize:"0.65rem",color:col,textAlign:"right"}}>{item.qty} {item.unidad}</div>
            </div>
          );})}
        </div>
      </div>
      <STitle icon="📋">Inventario Completo</STitle>
      <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
        {[{v:"all",l:"Todo"},{v:"alerta",l:`⚠ Alertas (${bajosMin.length})`},...cats.map(c=>({v:c,l:c}))].map(o=>(
          <button key={o.v} onClick={()=>setFiltro(o.v)} style={{background:filtro===o.v?C.green3:"transparent",color:filtro===o.v?C.green2:C.muted,border:`1px solid ${filtro===o.v?C.green3:C.border}`,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>{o.l}</button>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg3}}>{["REF","Descripción","Categoría","Stock","Mínimo","Estado","Precio/ud.","Valor Total","Ubicación"].map(h=><th key={h} style={{fontFamily:"monospace",fontSize:"0.52rem",color:C.muted,textTransform:"uppercase",padding:"9px",textAlign:"left",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(item=>{const est=item.qty===0?"AGOTADO":item.qty<item.qtyMin?"BAJO":"OK";const ec={OK:C.green2,BAJO:C.yellow,AGOTADO:C.red}[est];return(<tr key={item.id} onMouseEnter={e=>e.currentTarget.style.background=`${C.green3}15`} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.63rem",color:C.muted}}>{item.ref}</td>
            <td style={{padding:"9px"}}><div style={{fontSize:"0.79rem",fontWeight:500}}>{item.nombre}</div><div style={{fontSize:"0.63rem",color:C.muted,marginTop:1}}>{item.marca}</div></td>
            <td style={{padding:"9px",fontSize:"0.72rem",color:C.muted}}>{item.categoria}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontWeight:700,fontSize:"0.82rem"}}>{fnum(item.qty)} <span style={{fontSize:"0.6rem",color:C.muted}}>{item.unidad}</span></td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.72rem",color:C.muted}}>{item.qtyMin} {item.unidad}</td>
            <td style={{padding:"9px"}}><span style={{background:`${ec}18`,color:ec,border:`1px solid ${ec}30`,padding:"2px 8px",borderRadius:4,fontFamily:"monospace",fontSize:"0.53rem"}}>{est}</span></td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.72rem"}}>{fmt(item.precioUnit)}</td>
            <td style={{padding:"9px",fontFamily:"monospace",fontSize:"0.78rem",color:C.yellow,fontWeight:700}}>{fmt(item.qty*item.precioUnit)}</td>
            <td style={{padding:"9px",fontSize:"0.7rem",color:C.muted}}>{item.ubicacion}</td>
          </tr>);})}
          </tbody>
          <tfoot><tr style={{background:C.bg3}}><td colSpan={7} style={{padding:"10px",fontFamily:"monospace",fontSize:"0.6rem",color:C.muted,textAlign:"right",textTransform:"uppercase"}}>VALOR TOTAL FILTRADO →</td><td style={{padding:"10px",fontFamily:"monospace",fontWeight:800,fontSize:"0.92rem",color:C.yellow}}>{fmt(filtered.reduce((s,i)=>s+i.qty*i.precioUnit,0))}</td><td/></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [stock,setStock]=useState(INIT_STOCK);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [horas,setHoras]=useState(INIT_HORAS);
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

  const ss={demo:{text:"DATOS DEMO",bg:`${C.muted}15`,c:C.muted,bo:C.border},loading:{text:"SINCRONIZANDO...",bg:`${C.yellow}10`,c:C.yellow,bo:`${C.yellow}40`},ok:{text:`✓ ACTUALIZADO · ${lastSync?lastSync.toLocaleTimeString("es-ES"):""}`,bg:`${C.green3}35`,c:C.green2,bo:C.green3},error:{text:"⚠ SHEET NO PÚBLICO",bg:`${C.red}10`,c:C.red,bo:`${C.red}40`}}[syncStatus];
  const tabs=[{id:"dashboard",l:"Dashboard"},{id:"graficos",l:"📈 Gráficos"},{id:"proyectos",l:"Proyectos"},{id:"almacen",l:"Almacén"}];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{background:${C.bg};}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:${C.bg2};}::-webkit-scrollbar-thumb{background:${C.green3};border-radius:4px;}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 28px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,15,8,0.97)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <AFCLogo size={44} full/>
          <div style={{width:1,height:36,background:C.border,marginLeft:4}}/>
          <div style={{fontFamily:"monospace",fontSize:"0.58rem",color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase",lineHeight:1.5}}>Panel de Control<br/>de Gestión</div>
        </div>
        <nav style={{display:"flex",gap:3,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:3}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?C.green3:"transparent",color:tab===t.id?C.green2:C.muted,border:`1px solid ${tab===t.id?C.green3:"transparent"}`,padding:"7px 18px",borderRadius:7,cursor:"pointer",fontFamily:"monospace",fontSize:"0.63rem",textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.2s"}}>{t.l}</button>
          ))}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontFamily:"monospace",fontSize:"0.58rem",color:ss.c,background:ss.bg,border:`1px solid ${ss.bo}`,padding:"5px 11px",borderRadius:5}}>{loading&&<span style={{animation:"spin 1s linear infinite",display:"inline-block",marginRight:4}}>⟳</span>}{ss.text}</div>
          <button onClick={sync} disabled={loading} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"5px 10px",borderRadius:5,cursor:"pointer",fontFamily:"monospace",fontSize:"0.58rem",opacity:loading?0.4:1}}>⟳</button>
          <div style={{fontFamily:"monospace",fontSize:"0.62rem",color:C.green2,display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green2,animation:"blink 1.4s infinite"}}/>{now.toLocaleTimeString("es-ES")}</div>
          <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:C.muted,background:C.bg2,border:`1px solid ${C.border}`,padding:"5px 10px",borderRadius:5}}>{now.toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>
      </header>

      <main style={{padding:"20px 28px",maxWidth:1600,margin:"0 auto"}}>
        {tab==="dashboard"&&<TabDashboard projects={projects} stock={stock} horas={horas}/>}
        {tab==="graficos"&&<TabGraficos projects={projects} stock={stock} horas={horas}/>}
        {tab==="proyectos"&&<TabProyectos projects={projects} horas={horas}/>}
        {tab==="almacen"&&<TabAlmacen stock={stock}/>}
      </main>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><AFCLogo size={20} full/><span style={{fontFamily:"monospace",fontSize:"0.57rem",color:C.muted}}>Panel de Control de Gestión · Uso Interno · Confidencial</span></div>
        <span style={{fontFamily:"monospace",fontSize:"0.57rem",color:C.muted}}>Actualización automática cada 5 min · {now.getFullYear()}</span>
      </footer>
    </div>
  );
}
