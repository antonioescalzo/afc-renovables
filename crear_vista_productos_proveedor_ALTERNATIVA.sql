-- ═══════════════════════════════════════════════════════════════════════════
-- VISTAS ALTERNATIVAS PARA PRODUCTOS POR PROVEEDOR
-- USA numero_factura COMO CLAVE EN LUGAR DE factura_id
-- (Para casos donde lineas_factura.factura_id es NULL)
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- OPCIÓN 1: Usando numero_factura como clave de unión
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_productos_por_proveedor AS
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
  lf.id as linea_id,
  f.id as factura_id
FROM lineas_factura lf
-- Intentar unión por factura_id primero
FULL OUTER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'

UNION ALL

-- Si factura_id es NULL, intentar por numero_factura
SELECT
  f2.proveedor_id,
  p2.nombre as proveedor,
  lf2.ref,
  lf2.descripcion,
  lf2.cantidad,
  lf2.precio,
  (lf2.cantidad * lf2.precio) as importe_total,
  lf2.descuento,
  f2.fecha,
  f2.numero_factura,
  lf2.id as linea_id,
  f2.id as factura_id
FROM lineas_factura lf2
LEFT JOIN facturas_compra f2 ON LOWER(TRIM(lf2.numero_factura)) = LOWER(TRIM(f2.numero_factura))
LEFT JOIN proveedores p2 ON f2.proveedor_id = p2.id
WHERE lf2.factura_id IS NULL
  AND f2.proveedor_id IS NOT NULL
  AND f2.csv_origen = 'proveedores.csv'

ORDER BY proveedor, fecha DESC, descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- OPCIÓN 2: Vista simplificada que trabaja con lo que existe
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_productos_por_proveedor_simple AS
WITH productos_con_factura AS (
  -- Registros que tienen factura_id válido
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
    f.numero_factura
  FROM lineas_factura lf
  INNER JOIN facturas_compra f ON lf.factura_id = f.id
  LEFT JOIN proveedores p ON f.proveedor_id = p.id
  WHERE f.proveedor_id IS NOT NULL
),
productos_sin_factura AS (
  -- Registros con factura_id NULL, intentar recuperar via numero_factura
  SELECT
    COALESCE(f.proveedor_id, 1) as proveedor_id,  -- Fallback a 1 si no se encuentra
    COALESCE(p.nombre, 'Por asignar') as proveedor,
    lf.ref,
    lf.descripcion,
    lf.cantidad,
    lf.precio,
    (lf.cantidad * lf.precio) as importe_total,
    lf.descuento,
    COALESCE(f.fecha, NOW()) as fecha,
    f.numero_factura
  FROM lineas_factura lf
  LEFT JOIN facturas_compra f ON LOWER(TRIM(lf.numero_factura)) = LOWER(TRIM(f.numero_factura))
  LEFT JOIN proveedores p ON f.proveedor_id = p.id
  WHERE lf.factura_id IS NULL
)
SELECT * FROM productos_con_factura
UNION ALL
SELECT * FROM productos_sin_factura
ORDER BY proveedor, fecha DESC, descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- Resumen de Precios
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_productos_precio_proveedor AS
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
LEFT JOIN facturas_compra f ON COALESCE(lf.factura_id, 0) = f.id OR LOWER(TRIM(lf.numero_factura)) = LOWER(TRIM(f.numero_factura))
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY f.proveedor_id, p.nombre, lf.ref, lf.descripcion
ORDER BY p.nombre, lf.descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- Comparativa de precios
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_comparativa_productos_proveedor AS
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
LEFT JOIN facturas_compra f ON COALESCE(lf.factura_id, 0) = f.id OR LOWER(TRIM(lf.numero_factura)) = LOWER(TRIM(f.numero_factura))
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
GROUP BY lf.ref, lf.descripcion
HAVING COUNT(DISTINCT f.proveedor_id) > 0
ORDER BY lf.descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- Verificación: Contar registros en cada estado
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT
--   'Con factura_id' as estado,
--   COUNT(*) as cantidad
-- FROM lineas_factura
-- WHERE factura_id IS NOT NULL
-- UNION ALL
-- SELECT
--   'Sin factura_id (NULL)',
--   COUNT(*)
-- FROM lineas_factura
-- WHERE factura_id IS NULL;
