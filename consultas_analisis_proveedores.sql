-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTAS ANALÍTICAS: COSTES POR PROVEEDOR
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 1: RANKING DE PROVEEDORES POR GASTO TOTAL
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as total_gasto,
  ROUND(AVG(f.total_factura)::numeric, 2) as promedio_factura,
  MAX(f.fecha) as ultima_compra,
  MIN(f.fecha) as primera_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_gasto DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 2: TOP 10 PROVEEDORES - VERSIÓN SIMPLIFICADA
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as total_gasto
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_gasto DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 3: PROVEEDORES CON DETALLES DE ACTIVIDAD
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as cantidad_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(MIN(f.total_factura)::numeric, 2) as factura_minima,
  ROUND(MAX(f.total_factura)::numeric, 2) as factura_maxima,
  ROUND(AVG(f.total_factura)::numeric, 2) as factura_promedio,
  MAX(f.fecha)::text as ultima_factura,
  DATEDIFF(day, MIN(f.fecha), MAX(f.fecha)) as dias_actividad
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 4: ANÁLISIS POR PORCENTAJE DE GASTO
-- ═══════════════════════════════════════════════════════════════════════════
WITH totales AS (
  SELECT SUM(total_factura) as gasto_total
  FROM facturas_compra
  WHERE csv_origen = 'proveedores.csv'
)
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(
    (SUM(f.total_factura) / (SELECT gasto_total FROM totales) * 100)::numeric,
    2
  ) as porcentaje_gasto,
  MAX(f.fecha)::text as ultima_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id,
     totales
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 5: PROVEEDORES ACTIVOS POR MES
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  p.nombre as proveedor,
  COUNT(DISTINCT DATE_TRUNC('month', f.fecha)) as meses_activo,
  COUNT(f.id) as total_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  STRING_AGG(DISTINCT TO_CHAR(f.fecha, 'YYYY-MM'), ', ' ORDER BY TO_CHAR(f.fecha, 'YYYY-MM')) as meses_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_facturas DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 6: RESUMEN EJECUTIVO (TOTALES Y PROMEDIOS)
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  'RESUMEN GENERAL' as categoria,
  COUNT(DISTINCT p.id)::text as cantidad_proveedores,
  COUNT(f.id)::text as cantidad_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2)::text as gasto_total,
  ROUND(AVG(f.total_factura)::numeric, 2)::text as promedio_factura
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
UNION ALL
SELECT
  'PROVEEDOR MÁS GRANDE' as categoria,
  p.nombre,
  COUNT(f.id)::text,
  ROUND(SUM(f.total_factura)::numeric, 2)::text,
  ROUND(AVG(f.total_factura)::numeric, 2)::text
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY SUM(f.total_factura) DESC
LIMIT 1;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 7: ÚLTIMAS FACTURAS POR PROVEEDOR
-- ═══════════════════════════════════════════════════════════════════════════
SELECT DISTINCT ON (p.id)
  p.nombre as proveedor,
  f.numero_factura as ultima_factura,
  f.fecha as fecha_factura,
  ROUND(f.total_factura::numeric, 2) as monto
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
ORDER BY p.id, f.fecha DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 8: PROVEEDORES CON ESTADO (ACTIVO / INACTIVO)
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  MAX(f.fecha)::text as ultima_compra,
  CASE
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Activo'
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Moderado'
    ELSE 'Inactivo'
  END as estado
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY MAX(f.fecha) DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 9: TABLA DE COMPARACIÓN - TOP 5 vs OTROS
-- ═══════════════════════════════════════════════════════════════════════════
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
  CASE WHEN rank <= 5 THEN nombre ELSE 'OTROS (50 proveedores)' END as proveedor,
  CASE WHEN rank <= 5 THEN facturas ELSE SUM(facturas) END as facturas,
  CASE WHEN rank <= 5 THEN ROUND(total::numeric, 2) ELSE ROUND(SUM(total)::numeric, 2) END as total_gasto
FROM ranking
GROUP BY
  CASE WHEN rank <= 5 THEN nombre ELSE 'OTROS (50 proveedores)' END,
  CASE WHEN rank <= 5 THEN facturas ELSE NULL END,
  CASE WHEN rank <= 5 THEN total ELSE NULL END
ORDER BY total_gasto DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- CONSULTA 10: LISTA COMPLETA ORDENADA POR GASTO
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  p.nombre,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  MAX(f.fecha)::text as ultima_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;
