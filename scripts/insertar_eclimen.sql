-- INSERTAR PRODUCTOS ECLIMEN EN SUPABASE
-- Ejecuta este SQL en tu dashboard de Supabase: SQL Editor

-- 1. Primero, obtener el proveedor_id de ECLIMEN:
SELECT proveedor_id, nombre FROM proveedores WHERE nombre ILIKE '%eclimen%' LIMIT 1;

-- Reemplaza 'PROVIDER_ID_AQUI' con el proveedor_id obtenido arriba

-- 2. Crear factura para ECLIMEN:
INSERT INTO facturas_compra (numero_factura, proveedor_id, fecha, total_factura, estado, notas)
VALUES ('ECLIMEN-IMPORT-001', PROVIDER_ID_AQUI, '2026-01-15'::date, 0, 'pagada', 'Productos importados de CLIMEN CSV')
RETURNING factura_id;

-- Guarda el factura_id obtenido y reemplaza 'FACTURA_ID_AQUI' en las líneas siguientes

-- 3. Insertar líneas de producto:
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, '8704', 'CAJA P/DIST. HASTA 18 ELEM. SUP', 12.0, 16.1813, 0, 194.1756);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'CDN18PT', 'CAJA ESTANCA DISTRIBUCIÓN ABS 18 MOD PTA TRANSPARENTE', 0.0, 37.36, 0, 0.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, '233.2500.0', 'MANGUITO CORRUGADO M-25', 400.0, 1.3425, 0, 537.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'CDN8PT', 'CAJA DISTRIBUCIÓN ESTANCA IP65 1X8 MOD P/TRANSP. NEW ECOLOGY', 6.0, 37.36, 0, 224.16);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'PVBM05', 'CONECTOR SOLAR MC4 1000V AEREO PARA M/H', 20.0, 1.2124, 0, 24.247999999999998);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'H07Z1-K16AZ', 'CABLE L. HALOGENOS H07Z1-K 16 MM AZUL', 200.0, 1.84, 0, 368.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'EPB63M4C63', 'MAGNETOT.ALPHA+INDUST.4P 63A CV.C 6KA', 2.0, 31.0, 0, 62.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'EPR4A080300', 'DIFERENCIAL ALPHA+INDUSTRIAL 4P 80A 300MA CLASE A SUPERINMUNIZADO 10KA', 2.0, 111.0, 0, 222.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'H07Z1-K16NG', 'CABLE L. HALOGENOS H07Z1-K 16 MM NEGRO', 200.0, 1.84, 0, 368.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'EPR2A063030/10KA', 'DIFERENCIAL ALPHA+INDUSTRIAL 2P 63A 30MA CLASE A SUPERINMUNIZADO 10KA', 4.0, 33.9115, 0, 135.646);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, '1000PS2', 'PROTECTOR SOBRETENSIONES TRANS. 600VDC 20KA 2P', 50.0, 21.7, 0, 1085.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'H07Z1-K16GR', 'CABLE L. HALOGENOS H07Z1-K 16 MM GRIS', 100.0, 1.84, 0, 184.0);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'EV161', 'CAJA ESTANCA 160 X 110 MM', 15.0, 2.4289, 0, 36.4335);
INSERT INTO lineas_factura (factura_id, referencia, descripcion, cantidad, precio_unitario, descuento, importe_total) VALUES (FACTURA_ID_AQUI, 'EPRE2A040030', 'DIFERENCIAL ALPHA+ RESIDENCIAL 2P 40A 30MA CLASE A SUPERINMUNIZADO 6KA', 15.0, 17.0, 0, 255.0);

-- 4. Actualizar total de la factura:
UPDATE facturas_compra SET total_factura = 3695.6631 WHERE factura_id = FACTURA_ID_AQUI;