-- ═══════════════════════════════════════════════════════════════════════════
-- SCRIPT DE PRUEBA: Cargar datos de ejemplo
-- Ejecutar en Supabase SQL Editor para verificar que todo funciona
-- ═══════════════════════════════════════════════════════════════════════════

-- PASO 1: Limpiar datos existentes
DELETE FROM lineas_factura WHERE factura_id IN (
  SELECT id FROM facturas_compra WHERE csv_origen = 'proveedores.csv'
);

-- PASO 2: Insertar líneas de prueba para el primer proveedor
INSERT INTO lineas_factura (factura_id, proveedor_id, ref, descripcion, cantidad, precio, descuento, importe)
SELECT
  f.id as factura_id,
  f.proveedor_id,
  'REF-001' as ref,
  'Producto de prueba 1' as descripcion,
  10 as cantidad,
  50.00 as precio,
  0 as descuento,
  500.00 as importe
FROM facturas_compra f
WHERE f.proveedor_id IN (1, 2, 3)
LIMIT 3;

-- PASO 3: Insertar más datos de prueba
INSERT INTO lineas_factura (factura_id, proveedor_id, ref, descripcion, cantidad, precio, descuento, importe)
SELECT
  f.id as factura_id,
  f.proveedor_id,
  'REF-002' as ref,
  'Producto de prueba 2' as descripcion,
  5 as cantidad,
  100.00 as precio,
  5.00 as descuento,
  495.00 as importe
FROM facturas_compra f
WHERE f.proveedor_id IN (1, 2, 3)
AND f.id NOT IN (SELECT DISTINCT factura_id FROM lineas_factura WHERE ref = 'REF-001')
LIMIT 3;

-- PASO 4: Verificar que los datos están ahí
SELECT
  'Total líneas insertadas' as verificacion,
  COUNT(*) as cantidad
FROM lineas_factura;

-- PASO 5: Verificar que la vista retorna datos
SELECT
  'Líneas en vista' as verificacion,
  COUNT(*) as cantidad
FROM v_productos_por_proveedor;

-- PASO 6: Ver muestra de datos de la vista
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
