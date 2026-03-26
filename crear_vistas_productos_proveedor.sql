-- Vista: Productos por Proveedor (para análisis de costos)
CREATE OR REPLACE VIEW v_productos_por_proveedor AS
SELECT
  f.proveedor_id,
  p.proveedor,
  lf.ref,
  lf.descripcion,
  lf.cantidad,
  lf.precio,
  (lf.cantidad * lf.precio) as importe_total,
  lf.descuento,
  f.fecha,
  f.numero_factura
FROM lineas_factura lf
LEFT JOIN facturas f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
ORDER BY p.proveedor, f.fecha DESC, lf.descripcion;

-- Vista: Productos Únicos por Proveedor (para comparativas de precios)
CREATE OR REPLACE VIEW v_productos_precio_proveedor AS
SELECT
  f.proveedor_id,
  p.proveedor,
  lf.ref,
  lf.descripcion,
  MIN(lf.precio) as precio_minimo,
  MAX(lf.precio) as precio_maximo,
  ROUND(AVG(lf.precio)::numeric, 2) as precio_promedio,
  COUNT(*) as veces_comprado,
  SUM(lf.cantidad) as cantidad_total,
  MAX(f.fecha) as ultima_compra
FROM lineas_factura lf
LEFT JOIN facturas f ON lf.factura_id = f.id
LEFT JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.proveedor_id IS NOT NULL
GROUP BY f.proveedor_id, p.proveedor, lf.ref, lf.descripcion
ORDER BY p.proveedor, lf.descripcion;
