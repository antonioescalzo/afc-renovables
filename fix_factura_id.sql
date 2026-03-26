-- ═══════════════════════════════════════════════════════════════════════════
-- SCRIPT PARA CORREGIR factura_id EN lineas_factura
-- Vincula lineas_factura con facturas_compra usando numero_factura
-- ═══════════════════════════════════════════════════════════════════════════

-- Paso 1: Crear una columna temporal si no existe
ALTER TABLE lineas_factura
ADD COLUMN numero_factura_temp TEXT;

-- Paso 2: Copiar numero_factura a la columna temporal (si aún no está)
UPDATE lineas_factura
SET numero_factura_temp = numero_factura
WHERE numero_factura_temp IS NULL;

-- Paso 3: Actualizar factura_id basándose en numero_factura
UPDATE lineas_factura lf
SET factura_id = f.id
FROM facturas_compra f
WHERE LOWER(TRIM(lf.numero_factura_temp)) = LOWER(TRIM(f.numero_factura))
AND lf.factura_id IS NULL
AND f.csv_origen = 'proveedores.csv';

-- Paso 4: Verificar resultados
SELECT
  'Total de líneas' as estadistica,
  COUNT(*) as cantidad
FROM lineas_factura
UNION ALL
SELECT
  'Con factura_id válido',
  COUNT(*)
FROM lineas_factura
WHERE factura_id IS NOT NULL
UNION ALL
SELECT
  'Sin factura_id (NULL)',
  COUNT(*)
FROM lineas_factura
WHERE factura_id IS NULL
UNION ALL
SELECT
  'Vinculadas en este paso',
  COUNT(*)
FROM lineas_factura
WHERE factura_id IS NOT NULL
AND numero_factura_temp IS NOT NULL;

-- Paso 5: Limpiar columna temporal (opcional)
-- ALTER TABLE lineas_factura DROP COLUMN numero_factura_temp;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Ver lineas sin factura_id y su numero_factura
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT
--   id,
--   numero_factura,
--   ref,
--   descripcion,
--   cantidad,
--   precio
-- FROM lineas_factura
-- WHERE factura_id IS NULL
-- LIMIT 10;
--
-- ═══════════════════════════════════════════════════════════════════════════
-- VER FACTURAS QUE COINCIDEN CON LOS numero_factura
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT
--   f.id,
--   f.numero_factura,
--   f.proveedor_id,
--   f.fecha,
--   f.total_factura
-- FROM facturas_compra f
-- WHERE f.numero_factura IN (
--   SELECT DISTINCT numero_factura FROM lineas_factura WHERE factura_id IS NULL
-- )
-- LIMIT 10;
