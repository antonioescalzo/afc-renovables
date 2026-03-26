-- ═══════════════════════════════════════════════════════════════════════════
-- SCRIPT DE PRUEBA: Cargar datos de ejemplo
-- SIN incluir proveedor_id (no existe esa columna en lineas_factura)
-- ═══════════════════════════════════════════════════════════════════════════

-- PASO 1: Limpiar datos existentes
DELETE FROM lineas_factura WHERE factura_id IN (
  SELECT id FROM facturas_compra WHERE csv_origen = 'proveedores.csv'
);

-- PASO 2: Insertar líneas de prueba
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
SELECT
  f.id,
  'REF-001',
  'Producto de prueba 1',
  10,
  50.00,
  0,
  500.00
FROM facturas_compra f
WHERE f.csv_origen = 'proveedores.csv'
LIMIT 5;

-- PASO 3: Insertar más datos de prueba
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
SELECT
  f.id,
  'REF-002',
  'Producto de prueba 2',
  5,
  100.00,
  5.00,
  495.00
FROM facturas_compra f
WHERE f.csv_origen = 'proveedores.csv'
AND f.id NOT IN (SELECT DISTINCT factura_id FROM lineas_factura WHERE ref = 'REF-001')
LIMIT 5;

-- PASO 4: Verificar datos en tabla
SELECT COUNT(*) as total_lineas FROM lineas_factura;

-- PASO 5: Verificar que la vista retorna datos
SELECT COUNT(*) as lineas_en_vista FROM v_productos_por_proveedor;

-- PASO 6: Ver muestra de la vista
SELECT
  proveedor_id,
  proveedor,
  ref,
  descripcion,
  cantidad,
  precio,
  importe_total
FROM v_productos_por_proveedor
LIMIT 10;
