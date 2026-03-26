-- ═══════════════════════════════════════════════════════════════════════════
-- VISTAS CORREGIDAS PARA PRODUCTOS POR PROVEEDOR
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 1: Productos por Proveedor (todas las líneas)
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
INNER JOIN facturas_compra f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
  AND f.csv_origen = 'proveedores.csv'
ORDER BY p.nombre, f.fecha DESC, lf.descripcion;

-- ═══════════════════════════════════════════════════════════════════════════
-- VISTA 2: Resumen de Productos por Proveedor (estadísticas)
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

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════════════════════
-- Ejecutar estas queries para verificar:
-- SELECT COUNT(*) FROM v_productos_por_proveedor;
-- SELECT DISTINCT proveedor_id FROM v_productos_por_proveedor;
-- SELECT proveedor_id, COUNT(*) FROM v_productos_por_proveedor GROUP BY proveedor_id;
