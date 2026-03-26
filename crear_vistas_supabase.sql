-- ═══════════════════════════════════════════════════════════════════════════
-- CREAR VISTAS EN SUPABASE PARA DASHBOARD DE COMPRAS 2026
-- Estas vistas optimizan las consultas desde el frontend React
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 1: Ranking de Proveedores (Principal)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_proveedores_ranking AS
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.id as proveedor_id,
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(AVG(f.total_factura)::numeric, 2) as promedio_factura,
  ROUND(MIN(f.total_factura)::numeric, 2) as factura_minima,
  ROUND(MAX(f.total_factura)::numeric, 2) as factura_maxima,
  MAX(f.fecha) as ultima_compra,
  MIN(f.fecha) as primera_compra,
  DATEDIFF(day, MIN(f.fecha), MAX(f.fecha)) as dias_activo
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 2: Análisis con Porcentajes
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_proveedores_analisis AS
WITH totales AS (
  SELECT SUM(total_factura) as gasto_total
  FROM facturas_compra
  WHERE csv_origen = 'proveedores.csv'
)
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.id as proveedor_id,
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(
    (SUM(f.total_factura) / (SELECT gasto_total FROM totales) * 100)::numeric,
    2
  ) as porcentaje_gasto,
  MAX(f.fecha) as ultima_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 3: Top 5 Proveedores
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_top5_proveedores AS
SELECT
  p.id as proveedor_id,
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC
LIMIT 5;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 4: Resumen Ejecutivo (KPIs)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_kpis_compras AS
SELECT
  COUNT(DISTINCT p.id)::integer as total_proveedores,
  COUNT(f.id)::integer as total_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(AVG(f.total_factura)::numeric, 2) as promedio_factura,
  ROUND(MAX(f.total_factura)::numeric, 2) as factura_maxima,
  ROUND(MIN(f.total_factura)::numeric, 2) as factura_minima,
  MAX(f.fecha)::text as fecha_ultima_compra,
  MIN(f.fecha)::text as fecha_primera_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv';

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 5: Facturas Detalladas con Información de Proveedor
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_facturas_detalladas AS
SELECT
  f.id as factura_id,
  f.numero_factura,
  f.fecha,
  p.id as proveedor_id,
  p.nombre as proveedor,
  ROUND(f.total_factura::numeric, 2) as monto,
  f.csv_origen,
  EXTRACT(YEAR FROM f.fecha)::integer as anio,
  EXTRACT(MONTH FROM f.fecha)::integer as mes,
  TO_CHAR(f.fecha, 'YYYY-MM') as periodo,
  CASE
    WHEN f.fecha >= CURRENT_DATE - INTERVAL '30 days' THEN 'Última semana'
    WHEN f.fecha >= CURRENT_DATE - INTERVAL '90 days' THEN 'Último trimestre'
    ELSE 'Anterior'
  END as periodo_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
ORDER BY f.fecha DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 6: Gastos por Mes
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_gastos_por_mes AS
SELECT
  DATE_TRUNC('month', f.fecha)::date as mes,
  TO_CHAR(f.fecha, 'YYYY-MM') as periodo,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_mes,
  ROUND(AVG(f.total_factura)::numeric, 2) as promedio_mes,
  COUNT(DISTINCT p.id) as num_proveedores
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY DATE_TRUNC('month', f.fecha), TO_CHAR(f.fecha, 'YYYY-MM')
ORDER BY mes DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 7: Estado de Proveedores (Activo/Moderado/Inactivo)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_proveedores_estado AS
SELECT
  p.id as proveedor_id,
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  MAX(f.fecha) as ultima_compra,
  CASE
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Activo'
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Moderado'
    ELSE 'Inactivo'
  END as estado,
  DATEDIFF(day, MAX(f.fecha), CURRENT_DATE) as dias_sin_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY MAX(f.fecha) DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 8: Búsqueda de Facturas
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_buscar_facturas AS
SELECT
  f.id as factura_id,
  f.numero_factura,
  f.fecha::text,
  p.nombre as proveedor,
  ROUND(f.total_factura::numeric, 2) as monto,
  UPPER(f.numero_factura) as numero_factura_upper,
  UPPER(p.nombre) as proveedor_upper
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
ORDER BY f.fecha DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 9: Distribución de Gasto (para gráfico pastel)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_distribucion_gasto AS
WITH ranking AS (
  SELECT
    p.id,
    p.nombre,
    ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as rank,
    COUNT(f.id) as facturas,
    SUM(f.total_factura) as total
  FROM facturas_compra f
  JOIN proveedores p ON f.proveedor_id = p.id
  WHERE f.csv_origen = 'proveedores.csv'
  GROUP BY p.id, p.nombre
)
SELECT
  CASE WHEN rank <= 5 THEN nombre ELSE 'Otros' END as proveedor,
  CASE WHEN rank <= 5 THEN facturas ELSE SUM(facturas) END as facturas,
  CASE WHEN rank <= 5 THEN ROUND(total::numeric, 2) ELSE ROUND(SUM(total)::numeric, 2) END as gasto_total,
  CASE WHEN rank <= 5 THEN rank ELSE 999 END as orden
FROM ranking
GROUP BY
  CASE WHEN rank <= 5 THEN nombre ELSE 'Otros' END,
  CASE WHEN rank <= 5 THEN facturas ELSE NULL END,
  CASE WHEN rank <= 5 THEN total ELSE NULL END,
  CASE WHEN rank <= 5 THEN rank ELSE 999 END
ORDER BY orden;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Contar vistas creadas
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  'Vistas creadas:' as resultado,
  COUNT(*) as cantidad
FROM information_schema.views
WHERE table_schema = 'public' AND table_name LIKE 'v_%';
