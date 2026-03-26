-- ═══════════════════════════════════════════════════════════════════════════
-- VISTAS PARA PRODUCTOS POR PROVEEDOR - VERSIÓN FINAL
-- Maneja correctamente los tipos de datos (INTEGER para proveedor_id)
-- ═══════════════════════════════════════════════════════════════════════════

-- IMPORTANTE: Si recibe error de tipo de dato, ejecutar PRIMERO:
-- DROP VIEW IF EXISTS v_productos_por_proveedor CASCADE;
-- DROP VIEW IF EXISTS v_productos_precio_proveedor CASCADE;
-- DROP VIEW IF EXISTS v_comparativa_productos_proveedor CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 1: Productos por Proveedor (todas las líneas)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_productos_por_proveedor AS
SELECT
  f.proveedor_id::integer,
  p.nombre as proveedor,
  lf.ref,
  lf.descripcion,
  lf.cantidad::numeric,
  lf.precio::numeric,
  ROUND((lf.cantidad::numeric * lf.precio::numeric)::numeric, 2) as importe_total,
  lf.descuento::numeric,
  f.fecha,
  f.numero_factura,
  lf.id,
  f.id as factura_id
FROM lineas_factura lf
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'

UNION ALL

SELECT
  f.proveedor_id::integer,
  p.nombre as proveedor,
  lf.ref,
  lf.descripcion,
  lf.cantidad::numeric,
  lf.precio::numeric,
  ROUND((lf.cantidad::numeric * lf.precio::numeric)::numeric, 2) as importe_total,
  lf.descuento::numeric,
  f.fecha,
  f.numero_factura,
  lf.id,
  f.id as factura_id
FROM lineas_factura lf
LEFT JOIN facturas_compra f ON LOWER(TRIM(lf.numero_factura)) = LOWER(TRIM(f.numero_factura))
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE lf.factura_id IS NULL
  AND f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'

ORDER BY proveedor, fecha DESC, descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 2: Resumen de Productos por Proveedor (estadísticas)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_productos_precio_proveedor AS
SELECT
  f.proveedor_id::integer,
  p.nombre as proveedor,
  lf.ref,
  lf.descripcion,
  ROUND(MIN(lf.precio::numeric), 2) as precio_minimo,
  ROUND(MAX(lf.precio::numeric), 2) as precio_maximo,
  ROUND(AVG(lf.precio::numeric), 2) as precio_promedio,
  COUNT(*)::integer as veces_comprado,
  ROUND(SUM(lf.cantidad::numeric), 2) as cantidad_total,
  MAX(f.fecha) as ultima_compra,
  ROUND(SUM(lf.cantidad::numeric * lf.precio::numeric), 2) as importe_total
FROM lineas_factura lf
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY f.proveedor_id, p.nombre, lf.ref, lf.descripcion
ORDER BY p.nombre, lf.descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 3: Productos únicos con comparativa de precios
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_comparativa_productos_proveedor AS
SELECT
  lf.ref,
  lf.descripcion,
  ARRAY_AGG(DISTINCT p.nombre ORDER BY p.nombre) as proveedores,
  COUNT(DISTINCT f.proveedor_id)::integer as num_proveedores,
  ROUND(MIN(lf.precio::numeric), 2) as precio_minimo,
  ROUND(MAX(lf.precio::numeric), 2) as precio_maximo,
  ROUND(AVG(lf.precio::numeric), 2) as precio_promedio,
  COUNT(*)::integer as total_compras,
  MAX(f.fecha) as ultima_compra
FROM lineas_factura lf
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY lf.ref, lf.descripcion
HAVING COUNT(DISTINCT f.proveedor_id) > 0
ORDER BY lf.descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Contar registros
-- ═══════════════════════════════════════════════════════════════════════════
SELECT
  'v_productos_por_proveedor' as vista,
  COUNT(*) as registros,
  COUNT(DISTINCT proveedor_id) as proveedores,
  COUNT(DISTINCT ref) as productos_unicos
FROM v_productos_por_proveedor
UNION ALL
SELECT
  'v_productos_precio_proveedor',
  COUNT(*),
  COUNT(DISTINCT proveedor_id),
  COUNT(DISTINCT ref)
FROM v_productos_precio_proveedor
UNION ALL
SELECT
  'v_comparativa_productos_proveedor',
  COUNT(*),
  COUNT(DISTINCT UNNEST(proveedores)),
  COUNT(*)
FROM v_comparativa_productos_proveedor;
