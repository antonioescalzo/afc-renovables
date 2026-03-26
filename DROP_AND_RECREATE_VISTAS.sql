-- ═══════════════════════════════════════════════════════════════════════════
-- LIMPIAR Y RECREAR VISTAS - Ejecutar esto si hay errores de tipo de dato
-- ═══════════════════════════════════════════════════════════════════════════

-- Paso 1: Eliminar vistas existentes (en orden inverso de dependencias)
DROP VIEW IF EXISTS v_comparativa_productos_proveedor CASCADE;
DROP VIEW IF EXISTS v_productos_precio_proveedor CASCADE;
DROP VIEW IF EXISTS v_productos_por_proveedor CASCADE;

-- Paso 2: Recrear las vistas con tipos correctos
CREATE VIEW v_productos_por_proveedor AS
SELECT
  f.proveedor_id,
  p.nombre as proveedor,
  lf.ref,
  lf.descripcion,
  lf.cantidad,
  lf.precio,
  (lf.cantidad * lf.precio) as importe_total,
  lf.descuento,
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
  COALESCE(f.proveedor_id, 1) as proveedor_id,
  COALESCE(p.nombre, 'Por asignar') as proveedor,
  lf.ref,
  lf.descripcion,
  lf.cantidad,
  lf.precio,
  (lf.cantidad * lf.precio) as importe_total,
  lf.descuento,
  COALESCE(f.fecha, NOW()::date) as fecha,
  f.numero_factura,
  lf.id,
  f.id as factura_id
FROM lineas_factura lf
LEFT JOIN facturas_compra f ON LOWER(TRIM(lf.numero_factura)) = LOWER(TRIM(f.numero_factura))
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE lf.factura_id IS NULL

ORDER BY proveedor, fecha DESC, descripcion;

-- Vista 2: Resumen de precios
CREATE VIEW v_productos_precio_proveedor AS
SELECT
  f.proveedor_id,
  p.nombre as proveedor,
  lf.ref,
  lf.descripcion,
  MIN(lf.precio) as precio_minimo,
  MAX(lf.precio) as precio_maximo,
  ROUND(AVG(lf.precio)::numeric, 2) as precio_promedio,
  COUNT(*) as veces_comprado,
  SUM(lf.cantidad) as cantidad_total,
  MAX(f.fecha) as ultima_compra,
  ROUND(SUM(lf.cantidad * lf.precio)::numeric, 2) as importe_total
FROM lineas_factura lf
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY f.proveedor_id, p.nombre, lf.ref, lf.descripcion
ORDER BY p.nombre, lf.descripcion;

-- Vista 3: Comparativa de precios
CREATE VIEW v_comparativa_productos_proveedor AS
SELECT
  lf.ref,
  lf.descripcion,
  ARRAY_AGG(DISTINCT p.nombre) as proveedores,
  COUNT(DISTINCT f.proveedor_id) as num_proveedores,
  MIN(lf.precio) as precio_minimo,
  MAX(lf.precio) as precio_maximo,
  ROUND(AVG(lf.precio)::numeric, 2) as precio_promedio,
  COUNT(*) as total_compras,
  MAX(f.fecha) as ultima_compra
FROM lineas_factura lf
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY lf.ref, lf.descripcion
HAVING COUNT(DISTINCT f.proveedor_id) > 0
ORDER BY lf.descripcion;

-- Paso 3: Verificar que las vistas se crearon
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name LIKE 'v_productos%'
ORDER BY table_name;
