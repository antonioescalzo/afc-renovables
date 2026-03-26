-- ═══════════════════════════════════════════════════════════
-- CARGAR DATOS ETL EN SUPABASE
-- Ejecutar este script en el SQL Editor de Supabase
-- ═══════════════════════════════════════════════════════════

-- 1. INSERTAR PROVEEDORES
INSERT INTO proveedores (nombre) VALUES ('DESCONOCIDO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('AIKO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('GROWATT') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('SUNECO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('FERROLI') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('SCHUTZ') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('VICTRON') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('ARCO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('CABEL') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('BLANSOL') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('PYLONTECH') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('CALEFFI') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO proveedores (nombre) VALUES ('EMMETI') ON CONFLICT (nombre) DO NOTHING;

-- 2. INSERTAR FACTURAS
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('10', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 231.41, '10.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('11', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'VICTRON'), 318.4, '11.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('12', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 834.6, '12.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('13', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 948.0, '13.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('14', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 35.0, '14.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('15', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 308.6136, '15.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('16', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 43.0, '16.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('18', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 37.726, '18.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('19', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 573.13, '19.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('20', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 97.34, '20.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('21', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 69.0, '21.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('22', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 904.75, '22.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('23', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 155.8788, '23.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('24', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 155.8788, '24.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('25', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 65.0, '25.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('26', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 68.96000000000001, '26.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('27', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3081.308206000001, '27.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('28', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1066.5552500000001, '28.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('29', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 899.77, '29.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('30', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 18.25, '30.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('31', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 28.9256, '31.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('32', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1810.7471999999998, '32.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('33', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), -6.929, '33.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('34', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2015.14, '34.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('35', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 439.0676, '35.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('36', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 78.61349999999999, '36.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('37', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 64.28, '37.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('38', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 636.69268, '38.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('39', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 74.0, '39.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('4', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), -60.0, '4.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('41', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 537.3, '41.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('42', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 446.95, '42.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('43', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.04, '43.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('44', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 175.85999999999999, '44.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('45', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 102.0, '45.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('46', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 954.75, '46.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('47', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 440.47, '47.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('48', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 131.5, '48.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('5', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 336.68, '5.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('50', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 1434.6058, '50.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('51', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 19.5, '51.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('52', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1017.0979999999998, '52.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('53', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 41.432300000000005, '53.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('54', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 230.0, '54.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('55', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 106.37200000000001, '55.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('56', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 173.81, '56.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('57', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 86.46000000000001, '57.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('58', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 404.0, '58.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('59', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 990.0, '59.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('6', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 328.4976, '6.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('60', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'AIKO'), 891.8000000000001, '60.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('61', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1150.2, '61.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('62', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 69.0, '62.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('63', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 350.0, '63.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('64', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1545.9382, '64.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('65', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.48, '65.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('66', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 59.4, '66.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('67', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 98.37100000000002, '67.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('68', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5068.448213999999, '68.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('69', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5068.448213999999, '69.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('7', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 199.5214, '7.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('70', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 154.20000000000002, '70.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('71', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 172.89499999999998, '71.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('72', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 825.6075999999999, '72.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('73', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 84.37, '73.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('74', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 554.5500000000001, '74.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('75', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2316.7639999999997, '75.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('76', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 100.184, '76.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('77', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'AIKO'), 474.2000000000001, '77.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('8', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 718.3815000000001, '8.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('9', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 1995.179, '9.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('Líneas de factura de compra', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1888.1382, 'Líneas de factura de compra.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('Líneas de factura de compra2', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 126.78999999999999, 'Líneas de factura de compra2.csv');
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen)
VALUES ('Líneas de factura de compra3', '2026-03-26', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 199.0, 'Líneas de factura de compra3.csv');

-- 3. INSERTAR ARTÍCULOS
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('20889', 'ESTUFA DE PASILLO CANALIZABLE NETFLAME 10 KW BLANCA', 'ESTUFA DE PASILLO CANALIZABLE NETFLAME 10 KW BLANCA', 'CALDERAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 990.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'AEROTERMIA HI-WATER R290 AH-200U4GAB00 HISENSE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 974.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('602', 'OTROS APROVISIONAMIENTOS', 'COMPRA FERRETERIA MES FEBRERO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 899.77);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AIKO610', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MÓDULOS SOLARES', (SELECT id FROM proveedores WHERE nombre = 'AIKO'), 70.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GR-SPE 10000ES', 'INVERSOR HÍBRIDO MONOFÁSICO GROWATT SPE 10000ES 10.000W BATERÍAS DE BAJP VOLTAJE Y BACKUP INCORPORADO', 'INVERSOR HÍBRIDO MONOFÁSICO GROWATT SPE 10000ES 10.000W BATERÍAS DE BAJP VOLTAJE Y BACKUP INCORPORADO', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 835.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SPE 10KT', 'INVERSOR GROWATT SPE 10000 ES', 'INVERSOR GROWATT SPE 10000 ES', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 835.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'BOMBA DE CALOR NUOS EVO A+ 150 INSTLACIÓNVERTICAL/MURAL -5/42ºC A+/L', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 770.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('68865/1', 'IAC CONTROL UNIT', 'IAC CONTROL UNIT', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 320.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SMART METTER MON.SING.PHASE', 'SMART METER GROWATT MONOFÁSICO SINGLE (INC.CABLE)', 'ALMACÉN', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 76.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('7808438', 'CALD CUBIC CONDENS 24/24F', 'CALD CUBIC CONDENS 24/24F', 'CALDERAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 640.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ATS INVERSORES', 'ELEMENTO ATS INVERSORES GROWATT DE BATERÍAS 230VAC 63A', 'ELEMENTO ATS INVERSORES GROWATT DE BATERÍAS 230VAC 63A', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 68.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 544.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'DESCALCIFICADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 544.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'ANASTASIO', 'DESCALCIFICADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 544.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'DESCALCIFICADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 544.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 'ANASTASIO', 'DESCALCIFICADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 544.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('T.ABIERTO 30', 'TRIANGULO ABIERTO INCLINACIÓN 30º', 'TRIANGULO ABIERTO INCLINACIÓN 30º', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 17.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('COPM8CE', 'COLECTOR PLASTICO 8 CIRCUITOS C/EUROCONOS 16X3/4', 'FRANCISCO PORCUNA', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 532.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GR-MIN 6000TL-XH', 'INVERSOR DE CONEXION A RED MONOFASICO GROWATT MIN 6000TL-XH 6000W AC SPS CON OPCION A BATERIAS', 'INVERSOR DE CONEXION A RED MONOFASICO GROWATT MIN 6000TL-XH 6000W AC SPS CON OPCION A BATERIAS', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 505.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('190363', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 245.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('190363', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 245.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SOPORTE METALICA', 'SOPORTE CUBIERTA METÁLICA', 'SOPORTE CUBIERTA METÁLICA', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SOPORTE METALICA', 'SOPORTE CUBIERTA METÁLICA', 'ALMACÉN', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140927', 'RADIADOR EUROPA E600 DE 12 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 92.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140927', 'RADIADOR EUROPA E600 DE 12 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 92.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('T.DOBLE 15', 'TRIANGULO DOBLE MÓSULOS VERTICAL CON 15º', 'TRIANGULO DOBLE MÓSULOS VERTICAL CON 15º', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 63.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AIKO610', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MÓDULOS SOLARES', (SELECT id FROM proveedores WHERE nombre = 'AIKO'), 73.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('PIR20451154', 'PRYSOLAR E-SENS H1ZZZZ-K 1X6 BK 1.5KV', 'PRYSOLAR E-SENS H1ZZZZ-K 1X6 BK 1.5KV', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.819);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('PIR20451155', 'PRYSOLAR E-SENS H1ZZZ-K 1X6 RD. 1.5KV (ROLLO4626340) (PIR821AFCH)', 'PRYSOLAR E-SENS H1ZZZ-K 1X6 RD. 1.5KV (ROLLO4626340) (PIR821AFCH)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.819);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('$0956M2', 'SCHUTZ M2 PANEL CONSTRUCCIÓN SECA 25MM EPS 606X1181 7.92M2 4003959', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 25.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SPF6000-ES-PLUS', 'INVERSOR/CARGADOR/REGULADOR GROWATT SPF 48VCC 6000 W Y REGULADOR 500 VCC 2 MPPTS Y INCORPORA WIFI', 'INVERSOR/CARGADOR/REGULADOR GROWATT SPF 48VCC 6000 W Y REGULADOR 500 VCC 2 MPPTS Y INCORPORA WIFI', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 403.529);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('187102', 'ACUMULADOR INERCIA 100 INOX 2052370 DEL PASO', 'Mª JOSÉ (GRANADA)', 'ACUMULADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 672.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('187102', 'ACUMULADOR INERCIA 100 INOX 2052370 DEL PASO', 'ACUMULADOR INERCIA 100 INOX 2052370 DEL PASO', 'ACUMULADORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 672.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CARG.GROWATT.22', 'CARGADOR COCHE GROWATT 22KW THOT 22AS-P /WIFI, RFID)', 'CARGADOR COCHE GROWATT 22KW THOT 22AS-P /WIFI, RFID)', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 400.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0912300121', 'MORTERO DE INYECCIÓN BLACK-SF 300ML', 'ALMACÉN', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('VTR SCC125085411', 'SMARTSOLAR MPPT 250/85-TR VE CAN', 'SERGIO VALDERRAMA', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'VICTRON'), 384.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH3007120', 'LAMINA CONDUCCIÓN DE CALOR WLM 112X805MM', 'NICOLÁS CONSTRUCTOR. CALLE PERPETUO SOCORRO, 28', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 3.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('T.ABIERTO 30', 'TRIANGULO ABIERTO INCLINACIÓN 30º', 'ALMACÉN', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 17.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 350.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('BACK-UP', 'ELEMENTO GROWATT BACK-UP BOX APX PARA MID XH SYN100-30', 'ELEMENTO GROWATT BACK-UP BOX APX PARA MID XH SYN100-30', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 335.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('05086', 'MPPT SMARTSOLAR SIN DISPLAY 250/70 Tr', 'SERGIO VALDERRAMA', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'VICTRON'), 330.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 528.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('PWT100D', 'DEPÓSITO DE INERCIA Y ACUMULACIÓN ACS INOX 90ºC 100LTS FERCO', 'FUENTE TÓJAR', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 528.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('VICTRON250/70', 'VICTRON SMARTSOLAR MPPT 250/70-TR', 'VICTRON SMARTSOLAR MPPT 250/70-TR', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'VICTRON'), 316.82);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('01601ECX3600T6Q03', 'PERFIL PLACAS SOLARES (ENERGÍA SOLAR) X3600', 'PERFIL PLACAS SOLARES (ENERGÍA SOLAR) X3600', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.2863);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('190363', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 245.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('190363', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLIT DE PARED SU12H6 SUNECO', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 245.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON TALLA L NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON TALLA XL NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LEG 411525', 'DIFERENCIAL DX3 2/40/300 AC', 'DIFERENCIAL DX3 2/40/300 AC', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 38.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_5E7A10', 'INVERSOR SOLAR HÍBRIDO 24V 3.2KW 3000W MPPT', 'INVERSOR SOLAR HÍBRIDO 24V 3.2KW 3000W MPPT', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 231.41);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140925', 'RADIADOR EUROPA E600 DE 10 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 77.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140925', 'RADIADOR EUROPA E600 DE 10 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 77.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ABI1260', 'RACK MURAL S. ABI 12 U 635X600X600mm', 'RACK MURAL S. ABI 12 U 635X600X600mm', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 115.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CO14652', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 114.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON TALLA XXL NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('COPM6CE', 'COLECTOR PLÁSTICO 6 CIRCUITOS C/EUROCONOS 16X3/4', 'COLECTOR PLÁSTICO 6 CIRCUITOS C/EUROCONOS 16X3/4', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 435.88);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00580917', 'ENVASE NITRÓGENO 7 L', 'ENVASE NITRÓGENO 7 L', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 209.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('$0956MT', 'SCHUTZ MT TUBO DUO FLEX PE-XA 14X2 240MTS ROLLO 3003738', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 1.67);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON TALLA M NEGRO. SE PIDIERON 8, VINIVERON 7. REPUESTA LA QUE FALTABA', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('$0956AR', 'SCHUTZ ARMARIO COLECTOR UP9016*470MM 5006452', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 194.02);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2000033', 'GUÍA PERFORADA GALVANIZADA 27X18X2000', 'GUÍA PERFORADA GALVANIZADA 27X18X2000', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.76);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('68865', 'PLACA CPU 2016', 'ANTONIO MOLERO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 320.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('COPM5CE/5', 'COLECTOR PLASTICO 5 CIRCUITOS C/EUROCONOS 16X3/4', 'FRANCISCO PORCUNA', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 389.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_5DD3BC', 'GROWATT SHINE WI-LAN X2', 'ALMACÉN', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 19.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00654', 'CERBO GX', 'SERGIO VALDERRAMA', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 173.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('COPM4CE', 'COLECTOR PLÁSTICO 4 CIRCUITOS C/EUROCONOS 16X3/4', 'COLECTOR PLÁSTICO 4 CIRCUITOS C/EUROCONOS 16X3/4', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 338.21);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CENTRAL NL', 'PRESOR CENTRAL LACADO NEGRO CON MUELLE', 'PRESOR CENTRAL LACADO NEGRO CON MUELLE', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.84);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CENTRAL NL', 'PRESOR CENTRAL LACADO NEGRO CON MUELLE', 'ALMACÉN', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.84);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('13700110', 'CARRIL GALVA 20X10 2MT', 'CARRIL GALVA 20X10 2MT', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.9499);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00580659', 'EQUIPO PRUEBA NITRÓGENO 50BAR CPN503A', 'EQUIPO PRUEBA NITRÓGENO 50BAR CPN503A', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 349.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLÁSICA TALLA L NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLÁSICA TALLA XL NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LATERAL NL', 'PRESOR LATERAL LACADO NEGRO', 'PRESOR LATERAL LACADO NEGRO', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CRUCETA 25', 'PERFIL 25X25X2 PARA CRUCETA 1.70M', 'PERFIL 25X25X2 PARA CRUCETA 1.70M', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.12);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LATERAL NL', 'PRESOR LATERAL LACADO NEGRO', 'ALMACÉN', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('10291020', 'LT. ANTICONGELANTE PARA CIRCUITO DE ENERGÍA SOLAR TÉRMCA. BASE PROPYLENE GLYCOL', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLÁSICA TALLA XXL NEGRO. SE PIDIERON 9 , VINIVERON 8 Y SE REPUSO LA QUE FALTABA', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TF01448', 'ROLLO 25 METROS COBRE 5/8X0.8 AISLADO SPLIT CLD', 'BI NATURA (GRANADA)', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 140.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('EM05345', 'MANGUERA NEGRA VV-K 0.6/1KV 4G1,5 100M CUMPLE CPR', 'FRANCISCO PORCUNA', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 140.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140921', 'RADIADOR EUROPA E600 DE 6 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 46.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140921', 'RADIADOR EUROPA E600 DE 6 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 46.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SMARTMETER', 'SMART METER GROWATT TRIFÁSICO 630 CT-E (3 und. 250A)', 'UNIDAD ESTANCIA DIURNA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 135.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0912513085/990', 'TAMIZ NYLON 16X85', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.0952);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REV T20825G6', 'BLINDADO ENCHUFABLE 25 GRIS', 'BLINDADO ENCHUFABLE 25 GRIS', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS03254', 'METRO CANALETA BLANCA CB 100X60 (43 015) (18)', 'BI NATURA (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 21.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('VES 212310', 'DK6000 U/UTP DCA CU 24AWG LSFH BLA 605M', 'DK6000 U/UTP DCA CU 24AWG LSFH BLA 605M . JUANJO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.82);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SRADACCMP6090', 'CAJA METALICA 565X700X90 (6 SALIDAS) PARA COLECTORES CON PIE', 'FRANCISCO PORCUNA', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 242.88);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH5006854', 'COLECTOR PLÁSTICO 3 CIRCUITOS', 'NICOLÁS CONSTRUCTOR -  CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 240.63);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'MANGUERA BLANCA H05VV-F 3G2,5 100M CUMPLE CPR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 120.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('02779-1.5S', 'VALVULA TERMOSTATICA ACS NUMERADA', 'VALVULA TERMOSTATICA ACS NUMERADA', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 207.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140952', 'RADIADOR EUROPA E800 DE 11 ELEMENTOS FERROLI', 'JOSE ANTONO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 117.205);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140952', 'RADIADOR EUROPA E800 DE 11 ELEMENTOS FERROLI', 'JOSE ANTONO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 117.205);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('861251', 'TERMO ELECTRICO DELTA 100V', 'TERMO ELECTRICO DELTA 100V', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 251.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('FAPM 32/12', 'BOMBA ALTA EFICIENCIA CALEF/CLIMA 2 SIN RACORES', 'JUAN CARLOS MORALES (VALORAR)', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 184.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('136447', 'KIT CONJUNTO ESCUADRA 1/2 H KCM17 ARCO', 'ANASTSIO ( FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 10.3224);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('136447', 'KIT CONJUNTO ESCUADRA 1/2 H KCM17 ARCO', 'ANASTSIO ( FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 10.3224);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140951', 'RADIADOR EUROPA E800 DE 10 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 109.733);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140951', 'RADIADOR EUROPA E800 DE 10 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 109.733);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140951', 'RADIADOR EUROPA E800 DE 10 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 109.733);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140951', 'RADIADOR EUROPA E800 DE 10 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 109.733);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140922', 'RADIADOR EUROPA E600 DE 7 ELEMNTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 53.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140922', 'RADIADOR EUROPA E600 DE 7 ELEMNTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 53.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('094221', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 107.677);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('094221', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 107.677);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('164328', 'BOMBA CIRCULADORA BCC PLUJS 25-60-130 423530 CABEL', 'Mª JOSÉ (GRANADA)', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 104.8195);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('055840', 'RECTANGLAR 80X40X2 GALV', 'RECTANGLAR 80X40X2 GALV', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 102.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140950', 'RADIADOR EUROPA E800 DE 9 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 99.99);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140950', 'RADIADOR EUROPA E800 DE 9 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 99.99);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('185174', 'LINEA DE VIDA HORIZON', 'LINEA DE VIDA HORIZON', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 99.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6291', 'MATERIAL DE OFICINA', '6 BOLÍGRAFOS PILOT, 2 TIPPEX, 1 CAJA DE CLIPS N2, 4 CAJAS DE FOLIOS 500H 80GR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 97.34);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TF01444', 'ROLLO 25 M. COBRE 1/2''X0,8 AISLADO SPLIT C.L.D.', 'FRANCISCO PORCUNA (ARJONA)', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 95.08);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT3230004', 'BARRA 4M MULTICAPA PERT 32X3.0', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('9093', 'BOMBA CALEFACCION HEF 25/60-130 II 230V CLASE A', 'FUENTE TÓJAR', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 199.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GR-THREE PHASE METER 80A', 'ACCESORIO MONITORIZACION TRIFASICO GROWATT 80 A', 'FRANCISCO ZAPATA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 90.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140949', 'RADIADOR EUROPA E800 DE 8 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 87.7943);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140949', 'RADIADOR EUROPA E800 DE 8 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 87.7943);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140949', 'RADIADOR EUROPA E800 DE 8 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 87.7943);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140949', 'RADIADOR EUROPA E800 DE 8 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 87.7943);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'ZAPATOS HECTOR LÓPEZ RAMÍREZ', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 85.07);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140926', 'RADIADOR EUROPA E600 DE 11 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 84.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140926', 'RADIADOR EUROPA E600 DE 11 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 84.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MA15773', 'MWK BROCA ESCALONADA 6-35MM 14 E', 'JAVI C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 129.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 41.9826);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 41.9826);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 83.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DESFANGADOR-38676', 'DESFANGADOR MAGNÉTICO DE 1''', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 166.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('9093', 'BOMBA CALEFACCION HEF 25/60-130 II 230V CLASE A', 'JESÚS MORALES BUSTOS. LA YEDRA', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 83.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 117.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLASICA TALLA S NEGRO. SE PIDIERON 5, VINIVERON 4 Y SE REPUSO LA QUE FALTABA', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLASICA TALLA M NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'LOGOS ESCUDO BORADAO VITRON ENERGY', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AUTOR CONICA/1', 'TORNILLO 6.3X25 P16 AUTORROSCANTE PUNTA CÓNICA', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1588);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 172.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'BOTA STEGO ESD S3 SR  NÚMERO 40 - HÉCTOR LÓPEZ', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 79.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TFO1443', 'ROLLO 25 METROS COBRE 3/8 X 0.8 AISLADO SPLIT C.L.D', 'BI NATURA (GRANADA)', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'SUNECO'), 77.92);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140948', 'RADIADOR EUROPA E800 DE 7 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 77.77);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140948', 'RADIADOR EUROPA E800 DE 7 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 77.77);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CO14652', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 118.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC32', 'CODO 32 MULTICAPA BLANSOL', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 22.23);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('1007068', 'MINI LINTERNA POCKET 1000', 'MINI LINTERNA POCKET 1000', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 25.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19032005508/1', 'KFLEX ST 19X032 NEGRA', 'FRANCISCO PORCUNA (ARJONA)', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('HF07305', 'BOLSA 500 GR. VARILLA SOLDADURA MRA-5', 'FRANCISCO PORCUNA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 76.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80DP-TUBO-1000', 'MÓDULO RECTO DINAK DW D 80', 'MÓDULO RECTO DINAK DW D 80', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 45.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80DP-TUBO-1000', 'MÓDULO RECTO DINAK DW D 80', 'MÓDULO RECTO DINAK DW D 80', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 45.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04023', 'BANDEJA CONDENSADOS ESCOBANDD SUPER DESAG.LATERAL (475X1100MM)', 'ALMUDENA CASADO, JUAN CARLOS MORALES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 63.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS01016', 'JUEGO SOPORTES TANQUE 650MM', 'ANASTASIO (FUENTE TÓJAR)', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 126.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CEI 70400020', 'PASACABLES INT. POLIESTER TRENZADA TRIPLE 4MM, 20M', 'ALMACÉN (ANTONIO PERETE)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 74.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ROLLO 100 M MULTICAPA 20X2.0 BLANSOL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 161.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6294', 'MATERIAL SEGURIDAD', 'NAVE PRINCIPAL Y CONTIGUA 40, Nº9241 NAVE NUEVA (35)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 74.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'INVERSOR GROWATT MOD6000TL3-X', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 73.42);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS01016', 'JUEGO SOPORTES TANQUE 650MM', 'BI NATURA (GRANADA)', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 122.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON TALLA S NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHAQUETA SOFTSHELL HORIZON NGREO TALLA XXXL NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MIG 820401001009203', 'AFIRENAS-L HO7Z1-K DE 10 NEGRO BB/CT (ROLLO478984)', 'AFIRENAS-L HO7Z1-K DE 10 NEGRO BB/CT (ROLLO478984)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4237);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MIG 820401001008903', 'AFIRENAS - L H07Z1-K DE 10 GRIS BB/CT (ROLLO0478985)', 'AFIRENAS - L H07Z1-K DE 10 GRIS BB/CT (ROLLO0478985)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4237);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('14809025', 'EOSS LUNA-LUMIX BRASERO FUNDICIÓN GRANDE 135X95MM (SML111-02) RESPUESTO EOSS BRASERO 9KW', 'EOSS LUNA-LUMIX BRASERO FUNDICIÓN GRANDE 135X95MM (SML111-02) RESPUESTO EOSS BRASERO 9KW', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 100.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('HIJA20022248-002', 'HUAWEI SMARTPS 100A-50 METER MONOFÁSICO', 'MANUEL PORRAS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 70.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CABLE KIT', 'CABLE KIT  (PYLONTECH)', 'CABLE KIT  (PYLONTECH)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'PYLONTECH'), 13.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 69.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 69.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CAJA-4', 'CAJAMETALICA PARA COLECTORES 400X630X110', 'FRANCISCO PORCUNA', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 140.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GAE 233.2500.0', 'MANGUITO FLEXIBLE M-25 -DE PCV-', 'MANGUITO FLEXIBLE M-25 -DE PCV-', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.346);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('535050', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CALEFFI'), 145.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('535050', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CALEFFI'), 145.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140947', 'RADIADOR EUROPA E800 DE 6 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 66.66);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140947', 'RADIADOR EUROPA E800 DE 6 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 66.66);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 65.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('020648/120', 'TOR-PIAS-CIL-AW25-(A2K)-4.8X120', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.648);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('160456', 'CODO DOBLE PRESS 32 873035A ARCO', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 12.88);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6297', 'LIMPIEZA OFICINA', 'MES DE ENERO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 64.28);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140946', 'RADIADOR EUROPA E800 DE 5 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 62.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140946', 'RADIADOR EUROPA E800 DE 5 ELEMENTOS FERROLI', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 62.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('602', 'OTROS APROVISIONAMIENTOS', 'OTROS APROVISIONAMIENTOS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 61.11);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ(GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'LOGO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 59.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CAMISETA BUGATTI TALLA M BLANCO/VERDE', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CAMISETA BUGATTI TALLA XXL BLANCO/VERDE', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CABLE KIT', 'CABLE KIT  (PYLONTECH)', 'CABLE KIT  (PYLONTECH)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'PYLONTECH'), 13.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('08985111', 'UNIÓN Y SELLADO BLANCO', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.64);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('080086', 'SOPORTE KIT VASO EXPANSIÓN 053021 POTERMIC', 'Mª JOSÉ (GRANADA)', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 92.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('080086', 'SOPORTE KIT VASO EXPANSIÓN 053021 POTERMIC', 'FUENTE TÓJAR', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 92.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('080086', 'SOPORTE KIT VASO EXPANSIÓN 053021 POTERMIC', 'FUENTE TÓJAR', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 92.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DMME25V', 'DESFANGADOR MAGNÉTICO DE LATO FILTRO INOX 1''', 'Mª JOSÉ (GRANADA)', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 89.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153403', 'CABEZAL ELECTROTÉRMICO 230 V. RGACTEL', 'JESÚS MORALES', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153403', 'CABEZAL ELECTROTÉRMICO 230 V. RGACTEL', 'JESÚS MORALES', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DMME25V', 'DESFANGADOR MAGNÉTICO DE LATO FILTRO INOX 1''', 'DESFANGADOR MAGNÉTICO DE LATO FILTRO INOX 1''', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 89.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('14706035', 'VENTILADOR TANGENCIAL IZDA (BOCA 300X40MM)', 'VENTILADOR TANGENCIAL IZDA (BOCA 300X40MM)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 75.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC32', 'CODO 32 MULTICAPA BLANSOL', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 22.23);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80SP-ABRA-UNION', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.12);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80SP-ABRA-UNION', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.12);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 50.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00580592-1', 'RECARGA BOTELLA NITRÓGENO 7L', 'RECARGA BOTELLA NITRÓGENO 7L', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 49.32);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 79.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'SUDADERA CLÁSICA TALLA XXXL NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC32', 'CODO 32 MULTICAPA BLANSOL', 'ANTONIO AGUAYO (MARTOS)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 20.58);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC32', 'CODO 32 MULTICAPA BLANSOL', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 20.58);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'DESFANGADOR MAGNÉTICO PLASTICO CON VÁLVULAS FERCO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 76.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('039F08020SWJ/1', 'SW PELLETS 316L TUBO 80-1000', 'SW PELLETS 316L TUBO 80-1000', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 31.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6111C1', 'MEZCLADOR TERMOSTÁTICO 1''', 'MEZCLADOR TERMOSTÁTICO 1''', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 84.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHALECO NEGRO - XXX', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153376', 'CONJUNTO COLECTOR COMPACT PLUS 1 SALIDAS SRMBCP1', 'NICOLÁS', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 23.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153376', 'CONJUNTO COLECTOR COMPACT PLUS 1 SALIDAS SRMBCP1', 'NICOLÁS', 'TUBERÍAS_ACCESORIOS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 23.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DM25VNN', 'DESFANGADOR MAGNÉTICO PLASTICO CON VÁLVULAS FERCO', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 76.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKSH3234', 'TE SALIDA ROSCA HEMBRA 32X3/4 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.72);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('9097', 'BOMBA SOLAR SLR 25/6-180 II 230 V', 'BOMBA SOLAR SLR 25/6-180 II 230 V', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 45.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH5004131', 'CABEZAL ELÉCTRICO ENERGIESPARER PLUS 230V', 'NICOLÁS CONSTRUCTOR -  CALLE PERPETUO SOCORRO, 28', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 29.59);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00205030', 'VÁLVULA SEGURIDAD 1/2  HH 3 BAR EMMETI', 'VÁLVULA SEGURIDAD 1/2  HH 3 BAR EMMETI', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'EMMETI'), 7.69);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('60325/2', 'RESISTENCIA ENCENDIDO 260W (2016)', 'RESISTENCIA ENCENDIDO 260W (2016)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 86.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 42.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'LOGO BORDADO PANASONIC EN SUDADERAS', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'LOGO ESCUDO BORDADO PANASONIC / VITRON ENERGY', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'JOSE ANTONIO P´REZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 41.9826);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 'JOSE ANTONIO P´REZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 41.9826);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TUP 065200025', 'TUPERPLAS ENCHUFABLE GRIS 25', 'TUPERPLAS ENCHUFABLE GRIS 25', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS06801', 'BOMBA CONDENSADOS MASTONE', 'BOMBA CONDENSADOS MASTONE', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 41.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('171530', 'BLISTER REDUCCIÓN ZINCADO 1/2'' GREENCALOR', 'ANASTASIO ( FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.72);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('171530', 'BLISTER REDUCCIÓN ZINCADO 1/2'' GREENCALOR', 'ANASTASIO ( FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.72);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHALECO SOFTSHELL QUEBEC M NEGRO', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHALECO NEGRO L', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHALECO NEGRO XL', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CHALECO NEGRO XXL', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MIG 82040101-508208', 'AFIRENAS-L H07Z1-K DE 1,5 AZUL R.200', 'JAVI C - ALMACÉN', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1986);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MIG 82040101-509208', 'AFIRENAS-L H07Z1-K DE 1,5 NEGRO R.200', 'JAVI C - ALMACÉN', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1986);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LEG 403630', 'MAGNETOTÉRMICO TX3 6KA C 4P 40A', 'MANUEL PEINADO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 39.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SGF32DC', 'PORTAFUSIBLE SECCIONABLE 1P HASTA 35A 1000V DC SIN INDICADOR DE FUSIÓN, MAXGE', 'PORTAFUSIBLE SECCIONABLE 1P HASTA 35A 1000V DC SIN INDICADOR DE FUSIÓN, MAXGE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.628);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TUP 080600025', 'CORRUGADO FORRADO 25 GRIS', 'GRANADA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.26);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS -  LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3038 06', 'VALVULA ESFERA MINI MH 1'' GENEBRE', 'FUENTE TÓJAR', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 14.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT3230004', 'BARRA 4M MULTICAPA PERT 32X3.0', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT3230004', 'BARRA 4M MULTICAPA PERT 32X3.0', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT3230004', 'BARRA 4M MULTICAPA PERT 32X3.0', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ACAI-E-BOMB-CONDE-EX', 'BOMBA CONDENSADOS EXTERIOR', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 'SPLITS/CLIMATIZACIÓN', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 73.42);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SGIKD10838', 'CLIMAVER PLUS R 360 2.4 S/C 25*2400*1190', 'CELE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('68867MM', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 60.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('68867MM', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 60.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRM321', 'RACOR MÓVIL 32X1 MULTICAPA BLANSOL', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 15.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6291', 'MATERIAL DE OFICINA', 'A4 MONOCROMO Y A4 COLOR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 35.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 35.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC321', 'ENLACE ROSCA MACHO 32X1 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 34.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19032005508/1', 'KFLEX ST 19X032 NEGRA', 'JESÚS MORALES BUSTOS - LA YEDRA', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19032005508/1', 'KFLEX ST 19X032 NEGRA', 'FUENTE TÓJAR', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('162550', 'RACOR MOVIL HEMBRA PRESS 32*', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.51);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('162550', 'RACOR MOVIL HEMBRA PRESS 32*', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.51);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS03251', 'METRO CANALETA BLANCA CB 60X40 (43 003)', 'Mª JOSÉ(GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 11.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'VASO DE EXPANSIÓN 8PCS 8 LT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 55.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MT01569', 'ASPIRADOR DE CENIZAS MT POWER', 'ASPIRADOR DE CENIZAS MT POWER', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 32.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 25.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('162557', 'TÉ SALIDA HEMBRA PRESS 32*3/4H*32 874480A', 'Mª JOSÉ 8GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0687440009', 'GUANTE PU BLACK PRO T.9', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.29);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140919', 'RADIADOR EUROPA E600  DE 4 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 30.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140919', 'RADIADOR EUROPA E600  DE 4 ELEMENTOS FERROLI', 'ANASTASIO (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 30.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('VASOACS-18L', 'VASO 18L EXPANSIÓN DE ACS', 'LA YEDRA', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 61.409);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('60325/2', 'RESISTENCIA ENCENDIDO 260W (2016)', 'RESISTENCIA ENCENDIDO 260W (2016)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 51.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH5006005', 'TERMOSTATO DIGITAL 230V FRIO/CALOR SCHUTZ VARIMATIC LCD', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 60.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6271', 'PUBLICIDAD Y PROPAGANDA', 'AYUNTAMIENTO GUADAHORTUNA 1500X750MM', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 30.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090691062/900', 'ANCLAJE MULTIUSO RECA 10X61 BLANCO RECA- HANDWERK', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.0995);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090691062/900', 'ANCLAJE MULTIUSO RECA 10X61 BLANCO RECA- HANDWERK', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.0995);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('419778AG', 'SELLADOR MULTICLIMA 750 ML', 'SELLADOR MULTICLIMA 750 ML', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('126524', 'ASPIRADOR DE CENIZAS 1200W 18 LT', 'ASPIRADOR DE CENIZAS 1200W 18 LT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 28.9256);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT2525004', 'BARRA 4M MULTICAPA PERT 25X2.5', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('023298/80', 'TORNILLO ESPÁRRAGO 4.8 GALVAN TX25 8X80', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.096);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80SP-EMBELLECED', 'EMBELLECEDOR PLANO 80SW', 'EMBELLECEDOR PLANO 80SW', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 34.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DINAK80SP-EMBELLECED', 'EMBELLECEDOR PLANO 80SW', 'EMBELLECEDOR PLANO 80SW', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 34.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CAMISETA BUGATTI TALLA L BLANCO/VERDE', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0214763909/003', 'TORN-HEX-ALACO-C-ARN19LL10(A3K)-6.3X90', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1913);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CABLE KIT', 'CABLE KIT  (PYLONTECH)', 'CABLE KIT  (PYLONTECH)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'PYLONTECH'), 13.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'CRONOTERMOSTATO RADIO FRECUENCIA FERCO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 43.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 57.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0972010107', 'FLEJE ACERO PERFORADO 17X0', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 56.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04013', 'JUEGO SOPORTES BANDEJA SUPER', 'ALMUDENA CASADO', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 42.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LINK-S GROWATT', 'GROWATT SHINE LINK-S', 'GROWATT SHINE LINK-S', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 2.433);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'PANTALÓN 4 XTREME XXL NEGRO- JESÚS MEDINA', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'PANTALÓN XXL NEGRO PARA JESÚS MONTILLA', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('IM14086', 'PINZA AMPERIMÉTRICA B SMART PA420MINI KPS', 'BI NATURA (GRANADA)', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 54.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'REGULACIÓN CONTROL 1 ZONA FERCO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 40.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ 8GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'VALVULA SEG. DUCO 101811 1/2 H-H 8 BAR STM', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 50.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6292', 'VESTUARIO LABORAL', 'CAMISETA BUGATTI TALLA XL BLANCO/VERDE', 'VESTUARIO', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 36.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GSSV34', 'GRUPO DE SEGURIDAD PARA SOLAR', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 36.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKSH3234', 'TE SALIDA ROSCA HEMBRA 32X3/4 MULTICAPA', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 24.72);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 39.81);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 48.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6295', 'OTROS GASTOS', 'MATERIAL PINTURA REPARACIÓN NAVE 16?', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH50000793', 'CURVATUBOS 90º PLÁSTICO PARA TUBO DE 14-16-17', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('09740825', 'CASQUILLOS ESPACIADORES, REDONDOS, GALVANIZADOS, M8 X 25', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.11);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SCH5006905', 'JUEGO DE 2 VÁLVULAS 1'' PARA COLECTOR PLÁSTICO', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 43.79);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRM321', 'RACOR MÓVIL 32X1 MULTICAPA BLANSOL', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 15.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153703', 'CODO DOBLE PRESS 20 873015A ARCO', 'NICO CONSTRUCTOR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 4.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153703', 'CODO DOBLE PRESS 20 873015A ARCO', 'NICO CONSTRUCTOR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 4.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DOG917-225', 'PISTOLA SILICONA EXTREME 4000N DOGHER', 'PECO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 31.962);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GVT-8', 'VASO DE EXPANSION ACS 8L GUT 3/4''', 'VASO DE EXPANSION ACS 8L GUT 3/4''', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 45.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('039F08040SWJ/1', 'SW PELLETS 316L CODO 80-45º', 'SW PELLETS 316L CODO 80-45º', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHK322X2', 'TE REDUCIDA 32X20X32 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 29.54);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKMU32', 'MANGUITO UNIÓN 32 MULTICAPA', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'TIJERA 145 MM ELECTRICISTA 41923 WHA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.44);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'BARRA 4M MULTICAPA 16X2.0 BLANSOL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHVABVI2X', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 27.82);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.81);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT3230004', 'BARRA 4M MULTICAPA PERT 32X3.0', 'ANTONIO AGUAYO (MARTOS)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 20.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0194008070', 'TORN. HEX. DIN 571 TODO ROSCA CINC 8X70', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.0945);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('086893', 'MANGUITO R. HEMBRA 303 15*1/2 CONEX', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('086893', 'MANGUITO R. HEMBRA 303 15*1/2 CONEX', 'ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTB2020025', 'ROLLO 25M MULTICAPA PERT/AL/PERT 20X2 BLANSOL', 'PABLO MARTÍNEZ', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 40.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('602', 'OTROS APROVISIONAMIENTOS', 'ROLLO Y TUBO CRISTAL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 18.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JUEGO SOPORTES ECO LONG.500 GRANDE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0985600990', 'PVC CINT. AISL. MAR 19X25', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.32);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT2020004', 'BARRRA 4M MULTICAPA PERT 20X2', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('04118/30/900', 'ARANDELA PARA CARROCERÍA, TOLERANCIA DIN 522-A GALV.8.4X30X1.5', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.0425);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19032005508/1', 'KFLEX ST 19X032 NEGRA', 'ANTONIO AGUAYO (MARTOS)', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC251', 'ENLACE ROSCA MACHO 25X1 MULTICAPA', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.29);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('163469', 'TÉ REDUCIDA PRESS 32*20*32 874340A ARCO', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 16.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('039F081515W', 'SW PELLETS 316L DEFLECTOR H80', 'SW PELLETS 316L DEFLECTOR H80', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 33.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS01058', 'JUEGO SOPORTES ECO LONG.450 MEDIANO', 'JUEGO SOPORTES ECO LONG.450 MEDIANO', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC2X', 'CODO 20 MULTICAPA', 'CODO 20 MULTICAPA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('088479', 'SOPORTE RADIADOR ALUM. REGULABLE (2U)', 'ANASTASIO  (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 1.2651);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('088479', 'SOPORTE RADIADOR ALUM. REGULABLE (2U)', 'ANASTASIO  (FUENTE TÓJAR)', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 1.2651);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19025005508', 'KFLEX ST 19X025 NEGRA', 'FRANCISCO PORCUNA (ARJONA)', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('1022100', 'MTR TUBO COBRE RÍGIDO 22X1 MM', 'RETIRADO EN ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.43);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3004E', 'MACHON DOBLE 1/2 LATON', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MA 0330X30', 'DMT-AR M9016 (300 300)', 'CELE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 26.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MA 0330X30', 'DMT-AR M9016 (300 300)', 'OSCAR TORREDONJIMENO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 26.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('R437NX041', 'VÁLVULA MONOTUBO R437N 1/2''X16 CON SONDA TERMOSTATIZABLE GIACOMINI', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 25.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('136892', 'TERMOMETRO VAINA 0-1230ºC 80*100 361801 POTERMIC', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('$0956RT', 'SCHUTZ RACOR TUBO-COLECTOR', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'SCHUTZ'), 3.06);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CALETERMOMETRO-INMER', 'TERMOMETRO DE INMERSION CON VAINA', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.219);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('109915', 'ANALIZADOR DUREZA 307601 ATH', 'ANALIZADOR DUREZA 307601 ATH', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 28.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('109915', 'ANALIZADOR DUREZA 307601 ATH', 'ANALIZADOR DUREZA 307601 ATH', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 28.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('164355', 'JUEGO RACORES BRONCE R 1 (DN25) 423783 CABEL', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 14.8933);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DOG205-180C', 'ALICATE UNIVERSAL CRV 180MM', 'PITU', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.78);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('8032 120', 'TERMÓMETRO POSTERIOR 63 DIAM. VAINA 5 CM', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'FILTRO 3 PIEZAS COMPLETO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 31.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.48);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.65);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANODO 22X300 M8', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('763604', 'VALVULA ESFERA C. BOLA 3/4 M-H MARIPOSA NILE VA25 ROJA', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CABLE KIT', 'CABLE KIT  (PYLONTECH)', 'CABLE KIT  (PYLONTECH)', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'PYLONTECH'), 13.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('192713', 'PRO SDS PLUS-5X 14X400X460', 'PRO SDS PLUS-5X 14X400X460', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 25.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('192713', 'PRO SDS PLUS-5X 14X400X460', 'PRO SDS PLUS-5X 14X400X460', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 25.74);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC321', 'ENLACE ROSCA MACHO 32X1 MULTICAPA', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 29.54);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('00580210', 'ACOPLAM.AD87 1/2*-20HX1/4*M(AS-04X05)', 'ACOPLAM.AD87 1/2*-20HX1/4*M(AS-04X05)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 28.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ABRAZADERA COBRE 22 RD GEBO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 11.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('1018100', 'MTR TUBO COBRE RÍGIDO 18X1 MM', 'RETIRADO EN ALMACÉN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.32);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKT32252', 'TE REDUCIDA 32X25X32 MULTICAPA BLANSOL', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 28.61);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('19025005508', 'KFLEX ST 19X025 NEGRA', 'FRANCISCO PORCUNA', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKT32255', 'TE REDUCIDA 32X25X25XMULTICAPA BLANSOL', 'TE REDUCIDA 32X25X25XMULTICAPA BLANSOL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 27.93);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKT32255', 'TE REDUCIDA 32X25X25XMULTICAPA BLANSOL', 'FANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 27.93);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.605);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHVABVI2X', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 27.82);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083416', 'CURVA 90º HH 18 PRESS INOX', 'CURVA 90º HH 18 PRESS INOX', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.39);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083416', 'CURVA 90º HH 18 PRESS INOX', 'CURVA 90º HH 18 PRESS INOX', 'AGUA_CALIENTE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.39);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083651', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.52);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083651', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.52);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TUP 07600020', 'CORRUGADO 20 GRIS', 'JAVI C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.125);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 26.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ACAI-TUBO6X9', 'MTS TUBO CRISTAL DE 6X9', 'ACADEMIA GUADIA CIVIL - ÚBEDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.96);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 11.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHVABVI2X', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'BLANSOL'), 25.76);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC2X', 'CODO 20 MULTICAPA', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('076420', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 2.327);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('076420', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 2.327);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('073474', 'TERMÓMETRO 0-120º VAINA 5 CM GREEN CALOR', 'Mª JOSÉ (GRANADA)', 'TERMOSTATOS/CONTROL', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.54);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'KIT REPARACIÓN CHIMENEAS D.8 50246 FLOWER', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.07);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ENLACE ROSCA HEMBRA 20X3/4 MULTICAPA BLANSOL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.88);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 23.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('TCDMH50100', 'TUBO 500 MH COAXIALCOND 60/100', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 21.41);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ABRAZADERA DOBLE COBRE 18-20', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3031', 'MACHON RED 1 1/4 - 1 LATON', 'JESÚS MORALES BUSTOS -  LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3545E', 'CODO LATÓN M-H 1''', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3545E', 'CODO LATÓN M-H 1''', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3031', 'MACHON RED 1 1/4 - 1 LATON', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('199-338023', 'CABLE FLAT 1.5M TARJETA DISPLAY 16 PINES (CAVO FLAT 16 VIE L=.5M REPUESTO', 'JAVI GALERA', 'CABLES/ELÉCTRICA', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 15.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('7109', 'CONEXIÓN GIGAN H 1/2 X 400 MM', 'CONEXIÓN GIGAN H 1/2 X 400 MM', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.11);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2055959', 'HILO TEFLÓN TANGIT UNILOCK', 'NICOLÁS. CALLE PERPETUO SOCORRO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2055959', 'HILO TEFLÓN TANGIT UNILOCK', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2055959', 'HILO TEFLÓN TANGIT UNILOCK', 'HILO TEFLÓN TANGIT UNILOCK', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 22.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('212184', 'MARCADOR DE AGUJEROS PROFUNDOS AZUL-ANCHO DE MARCA 1MM', 'FRNCISCO ZAPATA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.73);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.2946);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('108839', 'MANDO PALANCA VÁLVULA PRESS CABEL', 'MANDO PALANCA VÁLVULA PRESS CABEL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 6.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('108839', 'MANDO PALANCA VÁLVULA PRESS CABEL', 'MANDO PALANCA VÁLVULA PRESS CABEL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'CABEL'), 6.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'FLEXÓMETRO BIMATERIA TYLON 8*25 0-30-657 STANLEY', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 19.73);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('763603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25 ROJA', 'JESÚS MORALES BUSTOS- LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'ANASTASIO ( FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6296);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'ANASTASIO ( FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6296);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ 8GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.3522);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3005', 'MACHÓN DOBLE 3/4 LATÓN', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('070248', 'VARILLA ROSCADA DIN-975 M-8 8.8', 'VARILLA ROSCADA DIN-975 M-8 8.8', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ 8GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.78);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('192708', 'PEO SDS PLUS-5X 12X400X460', 'PEO SDS PLUS-5X 12X400X460', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 17.71);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('192708', 'PEO SDS PLUS-5X 12X400X460', 'PEO SDS PLUS-5X 12X400X460', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 17.71);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CEI 46016000', 'GEL LUBRICANTE DUPLOGEL INTRODUCIR1000', 'GEL LUBRICANTE DUPLOGEL INTRODUCIR1000 . JUANJO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04293', 'BOTE COLA 500 CM3. CON TAPÓN PINCEL', 'FRANCISCO POCRUNA (ARJONA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 14.54);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('09020005508', 'KFLEX ST 09X020 NEGRA', 'Mª JOSÉ (GRANADA)', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.19);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CEI 46016000', 'GEL LUBRICANTE DUPLOGEL INTRODUCIR1000', 'JAVI C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ACAI-C-CORTA-3X28', 'CORTATUBOS 3-28 MM CT-174', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 18.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 19.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('8034 120', 'TERMOMETRO POSTERIOR DIAM 63 VAINA 10 CM', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 19.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083518', 'UNIÓN HEMBRA 18 *1/2 PRESS INOX', 'COLEGIO MENGÍBAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 11.89);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('45020', 'KIT ENLACE ROSCA MACHO 20 1/2 PE LT', 'KIT ENLACE ROSCA MACHO 20 1/2 PE LT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('HTI 006164', 'PZ2 X 100 DESTORNILLADOR POZIDRIV PZ2 SERIE LASERTIP DVE1000V', 'JAVI C', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('133505', 'DESTORNILLADOR 3201 PLANO 4,0*100 1000V 35390 WIHA', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.122);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('133505', 'DESTORNILLADOR 3201 PLANO 4,0*100 1000V 35390 WIHA', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 16.122);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.8191);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2025092', 'HILO TEFLON TANGIT UNILOCK 160M', 'HILO TEFLON TANGIT UNILOCK 160M', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.1227);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT2020004', 'BARRRA 4M MULTICAPA PERT 20X2', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.68);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083510', 'UNIÓN MACHO 18*1/2 PRESS INOX', 'COLEGIO MENGÍBAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083510', 'UNIÓN MACHO 18*1/2 PRESS INOX', 'UNIÓN MACHO 18*1/2 PRESS INOX', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('083510', 'UNIÓN MACHO 18*1/2 PRESS INOX', 'UNIÓN MACHO 18*1/2 PRESS INOX', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('100202/1', 'CINTA ALUMINIO 72MM 45M 30 MICRAS', 'CELE', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 6.81);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRM2X34', 'RACOR MOVIL 20X3/4 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125694', 'RELLENO GRIETAS BLANCO 98675 FISCHER', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125694', 'RELLENO GRIETAS BLANCO 98675 FISCHER', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 17.54);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.46);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'REJILLA SIMPLE DEFL. HORIZONTAL 400*150', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 11.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('GA7GUTIL', 'JUNTA UTIL POLIESTER PARA TAPÓN 1'' TEFLÓN RADIADOR', 'JOSE ANTONIO PÉREZ MELENDO', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 0.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('01865/50/900', 'TORNILLO PARA AGLOMERADO AVELLANADA FT, Z 2.50X50', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.039);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKC2X', 'CODO 20 MULTICAPA', 'NICOLÁS. CALLE PERPETUO SOCORRO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'KIT TE R/H 20-1/2-20 PE L T', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ENLACE ROSCA MACHO 25X3/4 MULTICAPA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042621', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.9726);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042621', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.9726);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.82);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 'Mª JOSÉ 8GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.327);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ALARG HEX 1/2 X 2 CM LATON', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3045', 'ALARG HEX 1/2 X 2 CM LATON', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090771', 'LITEPLAST 750 ML 66357 QUILOSA', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090771', 'LITEPLAST 750 ML 66357 QUILOSA', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 10.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('R714X032', 'DETENTOR ESCUADRA 3/8X3/8 GIACOMINI', 'FRANCISCO AVENIDA ANDALUCÍA', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 10.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('09025005508', 'KFLEX EC 9X25 NEGRA', 'FRANCISCO PORCUNA', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X34', 'ENLACE ROSCA MACHO 20X3/4 MULTICAPA', 'Mª JOSÉ GRANADA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.09);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('56100565', 'JUNTA TEFLÓN ANCHA 1''', 'LA YEDRA', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.65);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'KIT CODO R/M 20-1/2 PE LT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('HIT 006110', '3.5X100 DESTORNILLADOR 3.5X100 SERIE LASERTIP VDE1000V', 'GRANADA', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.2);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'FUENTE TÓJAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.18);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0209022CU', 'CODO 90 CU 22', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.22);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'CODO 25 MULTICAPA BLANSOL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.02);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('METATEH-2012', 'TE SALIDA HEMBRA 20-1/2 MULTICAPA', 'LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.64);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050914', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5341);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050914', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5341);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('092430', 'FLEXÓMETRO BIMATERIA TYLON 5*19 0-30-697 STANLEY', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('092430', 'FLEXÓMETRO BIMATERIA TYLON 5*19 0-30-697 STANLEY', 'ALMACÉN', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 25.76);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('063936', 'VÁLVULA SEGURIDAD 1/2 7 BAR GREEN CALOR', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('063936', 'VÁLVULA SEGURIDAD 1/2 7 BAR GREEN CALOR', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('071744', 'PUNTA ATORN.EXAG 5.0MM', 'PECO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'SACO DE SAL DESCALCIFICADOR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.7851);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('40003500', 'VALVULA ESFERA M-H MARIPOSA 1/2', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.78);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LEG 403588', 'MAGNET TX3 6KA C P+N 25A', 'GRANADA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.76);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'PABLO MARTÍNEZ', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'TE 20 MULTICAPA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 12.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('111798', 'MANGUITO ELECTROLITICO M-H 1/2 2731200000 HECAPO', 'COLEGIO MENGÍBAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('R179MX020', 'ADAPTADOR R1790 16X20X2 GIACOMINI', 'PABLO MARTÍNEZ (CASAS JUAN LEÓN)', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 4.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.78);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.78);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('176854', 'JUEGO SOPORTE PARED 450*450 BASE SOLDADO', 'JESÚS MORALES', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('176854', 'JUEGO SOPORTE PARED 450*450 BASE SOLDADO', 'JESÚS MORALES', 'SOPORTES/ESTRUCTURAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X34', 'ENLACE ROSCA MACHO 20X3/4 MULTICAPA', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.66);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('03254', 'AMNGUITO ANTIELECTOLSIS MH 1/2', 'COLEGIO MENGÍBAR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS02212', 'BOLSA BÁSICA AMORTIGUACIÓN TIPO B4 CON 4 ANTIVIBRADORES', 'BOLSA BÁSICA AMORTIGUACIÓN TIPO B4 CON 4 ANTIVIBRADORES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('EHCUCO1812', 'ENLACE ROSCA HEMBRA COMP. COBRE/INOX 18X1/2 ISOLTUBEX', 'PABLO MARTÍNEZ', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.59);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('164261', 'ADAPTADOR MULTICA 16* (20*2) R179MX020 GIACOMINI', 'NICO CONSTRUCTOR', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 4.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('164261', 'ADAPTADOR MULTICA 16* (20*2) R179MX020 GIACOMINI', 'NICO CONSTRUCTOR', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 4.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('ACAICANAL-CA1610', 'ML CANALETA ADHESIVA 16X10 (1610OBAD)', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.27);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04243', 'CODO PVC 45D 25', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.93);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0335945', 'RACORD 359 L H 22-3/4', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.43);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6241', 'PORTES', 'PORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('427.521.106', 'BROCA SDS-PLUS 6X50X115MM 4P', 'JAVI C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.29);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0209018', 'CODO 90 CU 18', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.94);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('RALAMACHONM - M-25', 'MACHÓN DOBLE M-M 3/4', 'LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.87);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('063934', 'PURGADOR COLUMNA 1/2 S/SUP GREEN CALOR', 'PURGADOR COLUMNA 1/2 S/SUP GREEN CALOR', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3543 R', 'CODO LATON M-H 1/2', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.57);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('RALAMARSEM-R-40-32', 'RACOR MARSELLA M 1'' - 1 1/4''', 'LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3544', 'CODO LATÓN 3/4-1/2 LATÓN', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 13.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS03259', 'ANGULO PLANO 90 AP 100X60', 'BI NATURA (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.76);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3403E', 'TAPÓN R MAC LATÓN 1/2 S/C', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125694', 'RELLENO GRIETAS BLANCO 98675 FISCHER', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.65);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125694', 'RELLENO GRIETAS BLANCO 98675 FISCHER', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.65);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'COQUILLA 9*18 GRIS 090182155PE0N0 PE K-FLEX', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.99);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('70037/04/02', 'PURGADOR AUTOMÁTICO AIRE 1/2''', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS03269', 'ÁNGULO EXTERNO A', 'BI NATURA (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.94);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.13);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090786', 'GOMA ELASTICA POLIAMIDA 8MM CTE 092230 GOL', 'ALMACÉN', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.493);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('090786', 'GOMA ELASTICA POLIAMIDA 8MM CTE 092230 GOL', 'ALMACÉN', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.493);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 8.19);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3027E', 'MACHÓNN RED 1-3/4 LATÓN', 'MACHÓNN RED 1-3/4 LATÓN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050926', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.9443);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050926', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.9443);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('602', 'OTROS APROVISIONAMIENTOS', 'OTROS APROVISIONAMIENTOS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.63);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04051', 'CODO DESAGUE JUNTA Y 2 TAPONES DIAM.19', 'CODO DESAGUE JUNTA Y 2 TAPONES DIAM.19', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('063923', 'FLORÓN RÍGIDO SIMPLE GREEN CALOR', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('063923', 'FLORÓN RÍGIDO SIMPLE GREEN CALOR', 'ANASTASIO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3406', 'TAPÓN R MAC LATÓN 1.1/4 S/C', 'JESÚS MORALES BUSTOS -  LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3225E', 'RED C/HEX 3/4-1/2 LATÓN', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3503E', 'TE LATON H-H 1/2', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3503E', 'TE LATON H-H 1/2', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPPT2020004', 'BARRRA 4M MULTICAPA PERT 20X2', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.62);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04055', 'CODO DESAGUE D.32 Y 2 TAPONES', 'CODO DESAGUE D.32 Y 2 TAPONES', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('10541013', 'RECAMBIO 10 UDS HOJA NEGRA SK2 65HRC PARA CUTER 25X126X0.7 MM COFAN', 'ACADEMIA GUARDIA CIVIL BAEZA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'CODO TERMINAL ROSCA HEMBRA 20X1/2 MULTICCAPA BLANSOL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.09);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('10540033', 'CUTER ANTIDESLIZANTE HEAVY DUTY 25 MM COFAN', 'ACADEMIA GUARDIA CIVIL BAEZA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153555', 'MANGUITO UNIÓN PRESS 20 872615A ARCO', 'NICO CONSTRUCTOR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 3.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('153555', 'MANGUITO UNIÓN PRESS 20 872615A ARCO', 'NICO CONSTRUCTOR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'ARCO'), 3.16);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3543 R', 'CODO LATON M-H 1/2', 'CODO LATON M-H 1/2', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.35);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'KIT CODO IGUAL 20-20 PE LT', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKMU2X', 'MANGUITO UNIÓN 20ML MULTICAPA', 'NICOLÁS. CALLE PERPETUO SOCORRO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.52);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('LATISUPERH-H3/4X40', 'H-H 3/4 X 40 CM SUPER LATIGUILLO', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.96);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JAEN CLIMA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRH2X12', 'ENLACE ROSCA HEMBRA 20X1/2 MULTICAPA', 'NICOLÁS. CALLE PERPETUO SOCORRO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 6.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('000621', 'ESPATULA 21000600 60MM/NYLON BAHCO', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.3878);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('000621', 'ESPATULA 21000600 60MM/NYLON BAHCO', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.3878);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('EMCUCO1812', 'ENLACE ROSCA MACHO COMP. COBRE/INOX 18X1/2 ISOTUBEX', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.83);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 9.3181);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'COQUILLA 9*22 GRIS PE 10022EK55PE K-FLEX', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.13);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('EM09000', 'BASE SUPERFICIE PORCELANA TT 16A-250V', 'BASE SUPERFICIE PORCELANA TT 16A-250V', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('064310', 'JUEGO SINEMBLOCK AG45', 'JESÚS MORALES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.3243);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042636', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6784);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('064310', 'JUEGO SINEMBLOCK AG45', 'JESÚS MORALES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.3243);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042636', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6784);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.61);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('UNX 2233-0', '22 BRIDA PAR USO EXTERIOR NEGRO 3.6X142 U61X', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.043);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6296);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6296);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0335945', 'RACORD 359 L H 22-3/4', 'RETIRADO TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.45);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.04);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('135460', 'MARCADOR PUNTA FINA NEGRO STANLEY', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('135460', 'MARCADOR PUNTA FINA NEGRO STANLEY', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.98);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'JESÚS MORALES BUSTOS - LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.25);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ALARGADERA HEX RED H 1 1/4 M 1 LATÓN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3820 010', 'MANÓMETRO RADIAL D.53 0-10B', 'MANÓMETRO RADIAL D.53 0-10B', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.85);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3820 010', 'MANÓMETRO RADIAL D.53 0-10B', 'MANÓMETRO RADIAL D.53 0-10B', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3027E', 'MACHÓNN RED 1-3/4 LATÓN', 'MACHÓNN RED 1-3/4 LATÓN', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MA.203300', 'TIRAS CM 300', 'OSCAR TORREDONJIMENO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.91);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0335935', 'RACORD 359 L H 18-3/4', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 4.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050915', 'TÉ PARA HIERRO HHH 3/4 LATÓN 321023', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.5774);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050915', 'TÉ PARA HIERRO HHH 3/4 LATÓN 321023', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.5774);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('022052', 'M. L. PVC PRESIÓN ENCOLAR 20/16', 'NICOLÁS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.3941);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('022052', 'M. L. PVC PRESIÓN ENCOLAR 20/16', 'NICOLÁS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.3941);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3005', 'MACHÓN DOBLE 3/4 LATÓN', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3004E', 'MACHON DOBLE 1/2 LATON', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3004E', 'MACHON DOBLE 1/2 LATON', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANTONIO AGUAYO (MARTOS)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3403E', 'TAPÓN R MAC LATÓN 1/2 S/C', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3005', 'MACHÓN DOBLE 3/4 LATÓN', 'JESÚS MORALES BUSTOS - LA YEDRA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS02213', 'BOLSA BÁSICA AMORTIGUACIÓN TIPO B5 CON ANTIVIBRADORES A45', 'BI NATURA (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS02213', 'BOLSA BÁSICA AMORTIGUACIÓN TIPO B5 CON ANTIVIBRADORES A45', 'NASTASIO (FUNTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('602', 'OTROS APROVISIONAMIENTOS', 'MARCOS MONTAJE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.84);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3042C', 'ALARG HEX 3/8 1 CM CROMO', 'FRANCISCO AVENIDA ANDALUCIA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0335816', 'RACORD 359 C/CUELLO H 18-1/2', 'RETIRADO EN TIENDA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.8195);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('0335934', 'RACAODR 359 L H 18-1/2', 'RETIRADO EN TIENDA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.81);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3227', 'RED C/HEX 1''-3/4', 'NICOLÁS. CALLE PERPETUO SOCORRO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.95);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('MULPTHKRC2X34', 'ENLACE ROSCA MACHO 20X3/4 MULTICAPA', 'FUENTE TÓJAR', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 7.66);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('45020', 'KIT ENLACE ROSCA MACHO 20 1/2 PE LT', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.8);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'TAPÓN R MAC LATÓN 1.1/4 S/C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.75);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.68);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('080561', 'RACOR MARSELLA 3/4 LATÓN 352323', 'ANASTASIO (FUENTE tÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.0561);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('080561', 'RACOR MARSELLA 3/4 LATÓN 352323', 'ANASTASIO (FUENTE tÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.0561);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('2006240', 'GOMA DESAGÜE LAVADORA 2 MTS', 'GOMA DESAGÜE LAVADORA 2 MTS', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 3.24);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('624', 'TRANSPORTES', 'TRANSPORTES', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.58);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04224', 'CASQUILLO REDUCTOR', 'FRANCISCO POCRUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.03);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3004E', 'MACHON DOBLE 1/2 LATON', 'MACHON DOBLE 1/2 LATON', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('333661AG', 'BROCHA BASIC Nº20', 'BROCHA BASIC Nº20', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.96);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125251', 'PUNTA PH2 50MM 1-68-947 STANLEY', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4917);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('125251', 'PUNTA PH2 50MM 1-68-947 STANLEY', 'ALMACÉN', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4917);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'ANASTASIO (FUENTE TÓJAR)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('3403E', 'TAPÓN R MAC LATÓN 1/2 S/C', 'Mª JOSÉ (GRANADA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('06593', 'CASQUILLO REDUCTOR 32-20', 'ACADEMIA GUARDIA CIVIL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('06593', 'CASQUILLO REDUCTOR 32-20', 'ACADEMIA GUARDIA CIVIL BAEZA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('06507', 'CASQUILLO REDUCTOR 25-20', 'ACEDEMIA GUARDIA CIVIL BAEZA', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04223', 'CASQUILLO REDUCT', 'FRANCISCO PORCUNA (ARJONA)', 'HARDWARE', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.4);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('1102000000', 'JUNTA DE GOMA 2''', 'JUNTA DE GOMA 2''', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.48);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('SOL 6625', 'CAJA. MEC. EMPOT. P. ELEMT.UNIVERSAL ENLAZABLE.CERTIFICADO AENOR.DIM.P.EMPOT 65X65X40', 'JAVI C', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04222', 'CASQUILLO REDUCTOR', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.3);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('6295', 'OTROS GASTOS', 'OTROS GASTOS', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.83);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'Mª JOSÉ (GRANADA)', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.66);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04213', 'MANGUITO UNIÓN PVC DIAM. 25', 'FRANCISCO PORCUNA (ARJONA)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.26);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('INA-11', 'INJERTO CLIP EXTERI 90/40', 'ACADEMIA GUARDIA CIVIL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 1.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042629', 'CONTRAROSCA 1/2*3/4 LATÓN 314223', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1331);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('042629', 'CONTRAROSCA 1/2*3/4 LATÓN 314223', 'ANASTASIO (FUENTE TÓJAR)', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 2.1331);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('DS-01', 'DERIV SIMPLE 32-45*', 'ACADEMIA GUARDIA CIVIL', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.7);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CMH-104', 'CODO EVACUACIÓN 40-45 M-H', 'ACADEMIA GUARDIA CIVIL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'LA YEDRA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.929);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('027008', 'MANGUITO TOPE 5270/HH-15', 'ANASTASIO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('027008', 'MANGUITO TOPE 5270/HH-15', 'ANASTASIO', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.6);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CMH-106M-H', 'CODO EVACUACION 40-87* M-H', 'ACADEMIA GUARDIA CIVIL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.55);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('CR-01', 'CASQUILLO REDUCTOR EVACUACION 4.-32', 'ACADEMIA GUARDIA CIVIL', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.5);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('JUNTA-GOMA-ANCHA-40', 'JUNTA D GOMA ANCHA DE 1 1/4''', 'LA YEDRA', 'MATERIALES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.17);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050024', 'CODO 90º ENCOLAR 20 PVC 051001020', 'NICOLÁS', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1581);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('050024', 'CODO 90º ENCOLAR 20 PVC 051001020', 'NICOLÁS', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.1581);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'BOLSA COMPRA PLASTICO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('B', 'BOLSA COMPRA PLASTICO', 'BOLSA COMPRA PLASTICO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.15);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('REF_AUTO_2F43B4', '...', 'BOLSA', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.05);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('343034', 'PISTOLA PROFESIONAL 18:1 310ML', 'PISTOLA PROFESIONAL 18:1 310ML', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 0.01);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04055', 'CODO DESAGUE D.32 Y 2 TAPONES', 'ABONO  DEVOLUCIÓN FACTURA 9749709', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.1);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('AS04051', 'CODO DESAGUE JUNTA Y 2 TAPONES DIAM.19', 'ABONO  DEVOLUCIÓN FACTURA 9749709', 'TUBERÍAS/COLECTORES', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 5.56);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('740078010', 'RADIADOR EUROPA  800 C 10 ELEMENTOS 7 ELEMENTOS', 'RADIADOR EUROPA  800 C 10 ELEMENTOS 7 ELEMENTOS', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 117.9);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('HV330A', 'CRISTAL PUERTA HOGAR HV/HP/HQ', 'CRISTAL PUERTA HOGAR HV/HP/HQ', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 100.0);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'TANIA', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario)
VALUES ('140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 'TANIA', 'RADIADORES', (SELECT id FROM proveedores WHERE nombre = 'FERROLI'), 133.31);

-- 4. INSERTAR LÍNEAS DE FACTURA
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '59'), '20889', 'ESTUFA DE PASILLO CANALIZABLE NETFLAME 10 KW BLANCA', 1.0, 990.0, 0.0, 990.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'AEROTERMIA HI-WATER R290 AH-200U4GAB00 HISENSE', 1.0, 974.46, 0.0, 974.46);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '29'), '602', 'COMPRA FERRETERIA MES FEBRERO', 1.0, 899.77, 0.0, 899.77);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '60'), 'AIKO610', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 12.0, 70.15, 0.0, 841.8000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '22'), 'GR-SPE 10000ES', 'INVERSOR HÍBRIDO MONOFÁSICO GROWATT SPE 10000ES 10.000W BATERÍAS DE BAJP VOLTAJE Y BACKUP INCORPORADO', 1.0, 835.0, 0.0, 835.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'SPE 10KT', 'INVERSOR GROWATT SPE 10000 ES', 1.0, 835.0, 0.0, 835.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'BOMBA DE CALOR NUOS EVO A+ 150 INSTLACIÓNVERTICAL/MURAL -5/42ºC A+/L', 1.0, 770.0, 0.0, 770.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '12'), '68865/1', 'IAC CONTROL UNIT', 4.0, 320.0, 40.0, 768.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '46'), 'SMART METTER MON.SING.PHASE', 'ALMACÉN', 10.0, 76.0, 0.0, 760.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '7808438', 'CALD CUBIC CONDENS 24/24F', 1.0, 640.0, 0.0, 640.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '19'), 'ATS INVERSORES', 'ELEMENTO ATS INVERSORES GROWATT DE BATERÍAS 230VAC 63A', 8.0, 68.6, 0.0, 548.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 1.0, 544.98, 0.0, 544.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 1.0, 544.98, 0.0, 544.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '144662', 'ANASTASIO', 1.0, 544.98, 0.0, 544.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '144662', 'DESCALCIFICADOR ESSENTIAL 11 LTS 902801', 1.0, 544.98, 0.0, 544.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '144662', 'ANASTASIO', 1.0, 544.98, 0.0, 544.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '41'), 'T.ABIERTO 30', 'TRIANGULO ABIERTO INCLINACIÓN 30º', 30.0, 17.91, 0.0, 537.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'COPM8CE', 'FRANCISCO PORCUNA', 2.0, 532.91, 50.0, 532.91);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'GR-MIN 6000TL-XH', 'INVERSOR DE CONEXION A RED MONOFASICO GROWATT MIN 6000TL-XH 6000W AC SPS CON OPCION A BATERIAS', 1.0, 505.0, 0.0, 505.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '190363', 'SPLIT DE PARED SU12H6 SUNECO', 2.0, 245.0, 0.0, 490.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '190363', 'SPLIT DE PARED SU12H6 SUNECO', 2.0, 245.0, 0.0, 490.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '13'), 'SOPORTE METALICA', 'SOPORTE CUBIERTA METÁLICA', 300.0, 1.56, 0.0, 468.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '61'), 'SOPORTE METALICA', 'ALMACÉN', 300.0, 1.56, 0.0, 468.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140927', 'ANASTASIO (FUENTE TÓJAR)', 5.0, 92.4, 0.0, 462.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140927', 'ANASTASIO (FUENTE TÓJAR)', 5.0, 92.4, 0.0, 462.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '42'), 'T.DOBLE 15', 'TRIANGULO DOBLE MÓSULOS VERTICAL CON 15º', 7.0, 63.85, 0.0, 446.95);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '77'), 'AIKO610', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 6.0, 73.2, 0.0, 439.2000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'PIR20451154', 'PRYSOLAR E-SENS H1ZZZZ-K 1X6 BK 1.5KV', 510.0, 0.819, 0.0, 417.69);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'PIR20451155', 'PRYSOLAR E-SENS H1ZZZ-K 1X6 RD. 1.5KV (ROLLO4626340) (PIR821AFCH)', 510.0, 0.819, 0.0, 417.69);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), '$0956M2', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 31.68, 25.62, 50.0, 405.8208);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'SPF6000-ES-PLUS', 'INVERSOR/CARGADOR/REGULADOR GROWATT SPF 48VCC 6000 W Y REGULADOR 500 VCC 2 MPPTS Y INCORPORA WIFI', 1.0, 403.529, 0.0, 403.529);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '187102', 'Mª JOSÉ (GRANADA)', 1.0, 672.0, 40.0, 403.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '187102', 'ACUMULADOR INERCIA 100 INOX 2052370 DEL PASO', 1.0, 672.0, 40.0, 403.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '58'), 'CARG.GROWATT.22', 'CARGADOR COCHE GROWATT 22KW THOT 22AS-P /WIFI, RFID)', 1.0, 400.0, 0.0, 400.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 3.0, 133.31, 0.0, 399.93);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140953', 'RADIADOR EUROPA E800 DE 12 ELEMENTOS FERROLI', 3.0, 133.31, 0.0, 399.93);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0912300121', 'ALMACÉN', 60.0, 6.62, 0.0, 397.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'VTR SCC125085411', 'SERGIO VALDERRAMA', 1.0, 384.0, 0.0, 384.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH3007120', 'NICOLÁS CONSTRUCTOR. CALLE PERPETUO SOCORRO, 28', 210.0, 3.62, 50.0, 380.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '61'), 'T.ABIERTO 30', 'ALMACÉN', 20.0, 17.91, 0.0, 358.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '63'), '6241', 'PORTES', 1.0, 350.0, 0.0, 350.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '5'), 'BACK-UP', 'ELEMENTO GROWATT BACK-UP BOX APX PARA MID XH SYN100-30', 1.0, 335.0, 0.0, 335.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), '05086', 'SERGIO VALDERRAMA', 1.0, 330.0, 0.0, 330.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 528.0, 38.0, 327.36);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'PWT100D', 'FUENTE TÓJAR', 1.0, 528.0, 38.0, 327.36);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '11'), 'VICTRON250/70', 'VICTRON SMARTSOLAR MPPT 250/70-TR', 1.0, 316.82, 0.0, 316.82);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '15'), '01601ECX3600T6Q03', 'PERFIL PLACAS SOLARES (ENERGÍA SOLAR) X3600', 72.0, 4.2863, 0.0, 308.6136);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140953', 'JOSE ANTONIO PÉREZ MELENDO', 2.0, 133.31, 0.0, 266.62);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140953', 'JOSE ANTONIO PÉREZ MELENDO', 2.0, 133.31, 0.0, 266.62);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '190363', 'SPLIT DE PARED SU12H6 SUNECO', 1.0, 245.0, 0.0, 245.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '190363', 'SPLIT DE PARED SU12H6 SUNECO', 1.0, 245.0, 0.0, 245.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON TALLA L NEGRO', 10.0, 24.3, 0.0, 243.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON TALLA XL NEGRO', 10.0, 24.3, 0.0, 243.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'LEG 411525', 'DIFERENCIAL DX3 2/40/300 AC', 6.0, 38.89, 0.0, 233.34);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '10'), 'REF_AUTO_5E7A10', 'INVERSOR SOLAR HÍBRIDO 24V 3.2KW 3000W MPPT', 1.0, 231.41, 0.0, 231.41);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140925', 'ANASTASIO (FUENTE TÓJAR)', 3.0, 77.0, 0.0, 231.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140925', 'ANASTASIO (FUENTE TÓJAR)', 3.0, 77.0, 0.0, 231.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '54'), 'ABI1260', 'RACK MURAL S. ABI 12 U 635X600X600mm', 2.0, 115.0, 0.0, 230.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'CO14652', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 3.0, 114.0, 35.0, 222.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON TALLA XXL NEGRO', 9.0, 24.3, 0.0, 218.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'COPM6CE', 'COLECTOR PLÁSTICO 6 CIRCUITOS C/EUROCONOS 16X3/4', 1.0, 435.88, 50.0, 217.94);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '35'), '00580917', 'ENVASE NITRÓGENO 7 L', 1.0, 209.24, 0.0, 209.24);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), '$0956MT', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 240.0, 1.67, 50.0, 200.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON TALLA M NEGRO. SE PIDIERON 8, VINIVERON 7. REPUESTA LA QUE FALTABA', 8.0, 24.3, 0.0, 194.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), '$0956AR', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 1.0, 194.02, 0.0, 194.02);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '2000033', 'GUÍA PERFORADA GALVANIZADA 27X18X2000', 57.0, 6.76, 50.0, 192.66);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra3'), '68865', 'ANTONIO MOLERO', 1.0, 320.0, 40.0, 192.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'COPM5CE/5', 'FRANCISCO PORCUNA', 1.0, 389.16, 51.0, 190.6884);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '46'), 'REF_AUTO_5DD3BC', 'ALMACÉN', 10.0, 19.0, 0.0, 190.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), '00654', 'SERGIO VALDERRAMA', 1.0, 173.8, 0.0, 173.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'COPM4CE', 'COLECTOR PLÁSTICO 4 CIRCUITOS C/EUROCONOS 16X3/4', 1.0, 338.21, 50.0, 169.105);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '13'), 'CENTRAL NL', 'PRESOR CENTRAL LACADO NEGRO CON MUELLE', 200.0, 0.84, 0.0, 168.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '61'), 'CENTRAL NL', 'ALMACÉN', 200.0, 0.84, 0.0, 168.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '13700110', 'CARRIL GALVA 20X10 2MT', 85.0, 3.9499, 50.0, 167.87075);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '35'), '00580659', 'EQUIPO PRUEBA NITRÓGENO 50BAR CPN503A', 1.0, 349.0, 52.12, 167.1012);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLÁSICA TALLA L NEGRO', 10.0, 16.27, 0.0, 162.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLÁSICA TALLA XL NEGRO', 10.0, 16.27, 0.0, 162.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '13'), 'LATERAL NL', 'PRESOR LATERAL LACADO NEGRO', 150.0, 1.04, 0.0, 156.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '13'), 'CRUCETA 25', 'PERFIL 25X25X2 PARA CRUCETA 1.70M', 50.0, 3.12, 0.0, 156.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '61'), 'LATERAL NL', 'ALMACÉN', 150.0, 1.04, 0.0, 156.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), '10291020', 'ALMACÉN', 40.0, 3.85, 0.0, 154.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLÁSICA TALLA XXL NEGRO. SE PIDIERON 9 , VINIVERON 8 Y SE REPUSO LA QUE FALTABA', 9.0, 16.27, 0.0, 146.43);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'TF01448', 'BI NATURA (GRANADA)', 1.0, 140.91, 0.0, 140.91);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'EM05345', 'FRANCISCO PORCUNA', 1.0, 140.0, 0.0, 140.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140921', 'ANASTASIO (FUENTE TÓJAR)', 3.0, 46.2, 0.0, 138.60000000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140921', 'ANASTASIO (FUENTE TÓJAR)', 3.0, 46.2, 0.0, 138.60000000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'SMARTMETER', 'UNIDAD ESTANCIA DIURNA', 1.0, 135.0, 0.0, 135.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0912513085/990', 'ALMACÉN', 150.0, 2.0952, 58.0, 131.99760000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'REV T20825G6', 'BLINDADO ENCHUFABLE 25 GRIS', 228.0, 0.57, 0.0, 129.95999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS03254', 'BI NATURA (GRANADA)', 12.0, 21.05, 50.0, 126.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '56'), 'VES 212310', 'DK6000 U/UTP DCA CU 24AWG LSFH BLA 605M . JUANJO', 305.0, 0.82, 50.0, 125.05);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'SRADACCMP6090', 'FRANCISCO PORCUNA', 2.0, 242.88, 75.0, 121.44);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH5006854', 'NICOLÁS CONSTRUCTOR -  CALLE PERPETUO SOCORRO, 28', 1.0, 240.63, 50.0, 120.315);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'REF_AUTO_2F43B4', 'MANGUERA BLANCA H05VV-F 3G2,5 100M CUMPLE CPR', 1.0, 120.0, 0.0, 120.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra2'), '02779-1.5S', 'VALVULA TERMOSTATICA ACS NUMERADA', 1.0, 207.0, 43.0, 117.99);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140952', 'JOSE ANTONO PÉREZ MELENDO', 1.0, 117.205, 0.0, 117.205);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140952', 'JOSE ANTONO PÉREZ MELENDO', 1.0, 117.205, 0.0, 117.205);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), '861251', 'TERMO ELECTRICO DELTA 100V', 1.0, 251.45, 54.0, 115.667);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 12.0, 20.75, 54.0, 114.54);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'FAPM 32/12', 'JUAN CARLOS MORALES (VALORAR)', 1.0, 184.0, 38.0, 114.08);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '136447', 'ANASTSIO ( FUENTE TÓJAR)', 11.0, 10.3224, 0.0, 113.5464);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '136447', 'ANASTSIO ( FUENTE TÓJAR)', 11.0, 10.3224, 0.0, 113.5464);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140951', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 109.733, 0.0, 109.733);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140951', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 109.733, 0.0, 109.733);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140951', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 109.733, 0.0, 109.733);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140951', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 109.733, 0.0, 109.733);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140922', 'ANASTASIO (FUENTE TÓJAR)', 2.0, 53.9, 0.0, 107.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140922', 'ANASTASIO (FUENTE TÓJAR)', 2.0, 53.9, 0.0, 107.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '094221', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 1.0, 107.677, 0.0, 107.677);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '094221', 'TERMO ELÉCTRICO 100 LT. 3201345 SIMAT', 1.0, 107.677, 0.0, 107.677);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '164328', 'Mª JOSÉ (GRANADA)', 1.0, 104.8195, 0.0, 104.8195);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '45'), '055840', 'RECTANGLAR 80X40X2 GALV', 1.0, 102.0, 0.0, 102.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140950', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 99.99, 0.0, 99.99);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140950', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 99.99, 0.0, 99.99);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '44'), '185174', 'LINEA DE VIDA HORIZON', 1.0, 99.5, 0.0, 99.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '20'), '6291', '6 BOLÍGRAFOS PILOT, 2 TIPPEX, 1 CAJA DE CLIPS N2, 4 CAJAS DE FOLIOS 500H 80GR', 1.0, 97.34, 0.0, 97.34);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'TF01444', 'FRANCISCO PORCUNA (ARJONA)', 1.0, 95.08, 0.0, 95.08);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPPT3230004', 'FRANCISCO PORCUNA (ARJONA)', 10.0, 20.55, 54.0, 94.53);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '9093', 'FUENTE TÓJAR', 1.0, 199.8, 54.0, 91.908);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '76'), 'GR-THREE PHASE METER 80A', 'FRANCISCO ZAPATA', 1.0, 90.0, 0.0, 90.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140949', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 87.7943, 0.0, 87.7943);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140949', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 87.7943, 0.0, 87.7943);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140949', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 87.7943, 0.0, 87.7943);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140949', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 87.7943, 0.0, 87.7943);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'ZAPATOS HECTOR LÓPEZ RAMÍREZ', 1.0, 85.07, 0.0, 85.07);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140926', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 84.7, 0.0, 84.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140926', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 84.7, 0.0, 84.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '67'), 'MA15773', 'JAVI C', 1.0, 129.3, 35.0, 84.04500000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 2.0, 41.9826, 0.0, 83.9652);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140945', 'RADIADOR EUROPA E800 DE 4 ELEMENTOS FERROLI', 2.0, 41.9826, 0.0, 83.9652);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 83.0, 0.0, 83.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'DESFANGADOR-38676', 'LA YEDRA', 1.0, 166.0, 50.0, 83.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '9093', 'JESÚS MORALES BUSTOS. LA YEDRA', 1.0, 83.0, 0.0, 83.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 0.7, 117.9, 0.0, 82.53);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLASICA TALLA S NEGRO. SE PIDIERON 5, VINIVERON 4 Y SE REPUSO LA QUE FALTABA', 5.0, 16.27, 0.0, 81.35);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLASICA TALLA M NEGRO', 5.0, 16.27, 0.0, 81.35);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'LOGOS ESCUDO BORADAO VITRON ENERGY', 40.0, 2.0, 0.0, 80.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '71'), 'AUTOR CONICA/1', 'ALMACÉN', 500.0, 0.1588, 0.0, 79.39999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 172.55, 54.0, 79.373);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'BOTA STEGO ESD S3 SR  NÚMERO 40 - HÉCTOR LÓPEZ', 1.0, 79.31, 0.0, 79.31);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'TFO1443', 'BI NATURA (GRANADA)', 1.0, 77.92, 0.0, 77.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140948', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 77.77, 0.0, 77.77);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140948', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 77.77, 0.0, 77.77);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '70'), 'CO14652', 'TERMOSTATO DIGITAL DE SUPERFICIE MUNDOCONTROL FN-42', 1.0, 118.0, 35.0, 76.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKC32', 'FUENTE TÓJAR', 15.0, 22.23, 77.0, 76.69349999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '44'), '1007068', 'MINI LINTERNA POCKET 1000', 3.0, 25.45, 0.0, 76.35);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '19032005508/1', 'FRANCISCO PORCUNA (ARJONA)', 36.0, 5.89, 64.0, 76.33439999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'HF07305', 'FRANCISCO PORCUNA', 1.0, 76.31, 0.0, 76.31);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '23'), 'DINAK80DP-TUBO-1000', 'MÓDULO RECTO DINAK DW D 80', 4.0, 45.4, 58.0, 76.272);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '24'), 'DINAK80DP-TUBO-1000', 'MÓDULO RECTO DINAK DW D 80', 4.0, 45.4, 58.0, 76.272);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS04023', 'ALMUDENA CASADO, JUAN CARLOS MORALES', 2.0, 63.0, 40.0, 75.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '70'), 'AS01016', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 126.0, 40.0, 75.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '6'), 'CEI 70400020', 'ALMACÉN (ANTONIO PERETE)', 1.0, 74.7, 0.0, 74.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ROLLO 100 M MULTICAPA 20X2.0 BLANSOL', 1.0, 161.0, 54.0, 74.05999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '39'), '6294', 'NAVE PRINCIPAL Y CONTIGUA 40, Nº9241 NAVE NUEVA (35)', 1.0, 74.0, 0.0, 74.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'INVERSOR GROWATT MOD6000TL3-X', 2.0, 73.42, 50.0, 73.42);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS01016', 'BI NATURA (GRANADA)', 1.0, 122.0, 40.0, 73.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON TALLA S NEGRO', 3.0, 24.3, 0.0, 72.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CHAQUETA SOFTSHELL HORIZON NGREO TALLA XXXL NEGRO', 3.0, 24.3, 0.0, 72.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '6'), 'MIG 820401001009203', 'AFIRENAS-L HO7Z1-K DE 10 NEGRO BB/CT (ROLLO478984)', 50.0, 1.4237, 0.0, 71.185);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '6'), 'MIG 820401001008903', 'AFIRENAS - L H07Z1-K DE 10 GRIS BB/CT (ROLLO0478985)', 50.0, 1.4237, 0.0, 71.185);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '48'), '14809025', 'EOSS LUNA-LUMIX BRASERO FUNDICIÓN GRANDE 135X95MM (SML111-02) RESPUESTO EOSS BRASERO 9KW', 1.0, 100.0, 30.0, 70.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '6'), 'HIJA20022248-002', 'MANUEL PORRAS', 1.0, 70.0, 0.0, 70.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '22'), 'CABLE KIT', 'CABLE KIT  (PYLONTECH)', 5.0, 13.95, 0.0, 69.75);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '21'), '6241', 'PORTES', 1.0, 69.0, 0.0, 69.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '62'), '624', 'TRANSPORTES', 1.0, 69.0, 0.0, 69.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'CAJA-4', 'FRANCISCO PORCUNA', 1.0, 140.0, 51.0, 68.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '55'), 'GAE 233.2500.0', 'MANGUITO FLEXIBLE M-25 -DE PCV-', 50.0, 1.346, 0.0, 67.30000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '535050', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 1.0, 145.8, 54.0, 67.068);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '535050', 'VÁLVULA REDUCTORA PRESIÓN 3/4 C/RACORES C/MANOMETRO CALEFFI', 1.0, 145.8, 54.0, 67.068);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140947', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 66.66, 0.0, 66.66);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140947', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 66.66, 0.0, 66.66);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '25'), '6241', 'PORTES', 1.0, 65.0, 0.0, 65.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '71'), '020648/120', 'ALMACÉN', 100.0, 0.648, 0.0, 64.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '160456', 'Mª JOSÉ (GRANADA)', 10.0, 12.88, 50.0, 64.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '37'), '6297', 'MES DE ENERO', 1.0, 64.28, 0.0, 64.28);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140946', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 62.04, 0.0, 62.04);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140946', 'JOSE ANTONIO PÉREZ MELENDO', 1.0, 62.04, 0.0, 62.04);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '57'), '602', 'OTROS APROVISIONAMIENTOS', 1.0, 61.11, 0.0, 61.11);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ(GRANADA)', 16.0, 7.57, 50.0, 60.56);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'LOGO', 30.0, 2.0, 0.0, 60.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '66'), '6241', 'PORTES', 1.0, 59.4, 0.0, 59.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CAMISETA BUGATTI TALLA M BLANCO/VERDE', 10.0, 5.74, 0.0, 57.400000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CAMISETA BUGATTI TALLA XXL BLANCO/VERDE', 10.0, 5.74, 0.0, 57.400000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'CABLE KIT', 'CABLE KIT  (PYLONTECH)', 4.0, 13.95, 0.0, 55.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '08985111', 'ALMACÉN', 12.0, 4.64, 0.0, 55.67999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '080086', 'Mª JOSÉ (GRANADA)', 1.0, 92.3, 40.0, 55.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '080086', 'FUENTE TÓJAR', 1.0, 92.3, 40.0, 55.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '080086', 'FUENTE TÓJAR', 1.0, 92.3, 40.0, 55.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'DMME25V', 'Mª JOSÉ (GRANADA)', 1.0, 89.0, 38.0, 55.18);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '153403', 'JESÚS MORALES', 5.0, 10.98, 0.0, 54.900000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '153403', 'JESÚS MORALES', 5.0, 10.98, 0.0, 54.900000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'DMME25V', 'DESFANGADOR MAGNÉTICO DE LATO FILTRO INOX 1''', 1.0, 89.0, 40.0, 53.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '48'), '14706035', 'VENTILADOR TANGENCIAL IZDA (BOCA 300X40MM)', 1.0, 75.0, 30.0, 52.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKC32', 'JESÚS MORALES BUSTOS - LA YEDRA', 10.0, 22.23, 77.0, 51.129);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '23'), 'DINAK80SP-ABRA-UNION', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 17.0, 7.12, 58.0, 50.83680000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '24'), 'DINAK80SP-ABRA-UNION', 'ABRAZADERA UNIÓN DINAK SW 80 DIAM.', 17.0, 7.12, 58.0, 50.83680000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '60'), '624', 'TRANSPORTES', 1.0, 50.0, 0.0, 50.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '35'), '00580592-1', 'RECARGA BOTELLA NITRÓGENO 7L', 1.0, 49.32, 0.0, 49.32);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES', 1.0, 79.0, 38.0, 48.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'SUDADERA CLÁSICA TALLA XXXL NEGRO', 3.0, 16.27, 0.0, 48.81);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHKC32', 'ANTONIO AGUAYO (MARTOS)', 10.0, 20.58, 77.0, 47.33399999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPTHKC32', 'FRANCISCO PORCUNA (ARJONA)', 10.0, 20.58, 77.0, 47.33399999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'DESFANGADOR MAGNÉTICO PLASTICO CON VÁLVULAS FERCO', 1.0, 76.0, 38.0, 47.12);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '73'), '039F08020SWJ/1', 'SW PELLETS 316L TUBO 80-1000', 3.0, 31.4, 50.0, 47.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '6111C1', 'MEZCLADOR TERMOSTÁTICO 1''', 1.0, 84.0, 44.0, 47.040000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'CHALECO NEGRO - XXX', 3.0, 15.55, 0.0, 46.650000000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '153376', 'NICOLÁS', 2.0, 23.15, 0.0, 46.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '153376', 'NICOLÁS', 2.0, 23.15, 0.0, 46.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'DM25VNN', 'FUENTE TÓJAR', 1.0, 76.0, 40.0, 45.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKSH3234', 'FUENTE TÓJAR', 8.0, 24.72, 77.0, 45.48479999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '9097', 'BOMBA SOLAR SLR 25/6-180 II 230 V', 1.0, 45.0, 0.0, 45.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH5004131', 'NICOLÁS CONSTRUCTOR -  CALLE PERPETUO SOCORRO, 28', 3.0, 29.59, 50.0, 44.385);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), '00205030', 'VÁLVULA SEGURIDAD 1/2  HH 3 BAR EMMETI', 12.0, 7.69, 52.0, 44.2944);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), '60325/2', 'RESISTENCIA ENCENDIDO 260W (2016)', 1.0, 86.8, 50.0, 43.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 42.7, 0.0, 42.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'LOGO BORDADO PANASONIC EN SUDADERAS', 42.0, 1.0, 0.0, 42.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'LOGO ESCUDO BORDADO PANASONIC / VITRON ENERGY', 14.0, 3.0, 0.0, 42.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140945', 'JOSE ANTONIO P´REZ MELENDO', 1.0, 41.9826, 0.0, 41.9826);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140945', 'JOSE ANTONIO P´REZ MELENDO', 1.0, 41.9826, 0.0, 41.9826);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '6'), 'TUP 065200025', 'TUPERPLAS ENCHUFABLE GRIS 25', 57.0, 3.16, 77.0, 41.4276);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS06801', 'BOMBA CONDENSADOS MASTONE', 1.0, 41.0, 0.0, 41.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '171530', 'ANASTASIO ( FUENTE TÓJAR)', 11.0, 3.72, 0.0, 40.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '171530', 'ANASTASIO ( FUENTE TÓJAR)', 11.0, 3.72, 0.0, 40.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'CHALECO SOFTSHELL QUEBEC M NEGRO', 3.0, 13.46, 0.0, 40.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'CHALECO NEGRO L', 3.0, 13.46, 0.0, 40.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'CHALECO NEGRO XL', 3.0, 13.46, 0.0, 40.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '74'), '6292', 'CHALECO NEGRO XXL', 3.0, 13.46, 0.0, 40.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'MIG 82040101-508208', 'JAVI C - ALMACÉN', 200.0, 0.1986, 0.0, 39.72);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'MIG 82040101-509208', 'JAVI C - ALMACÉN', 200.0, 0.1986, 0.0, 39.72);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '56'), 'LEG 403630', 'MANUEL PEINADO', 1.0, 39.31, 0.0, 39.31);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '55'), 'SGF32DC', 'PORTAFUSIBLE SECCIONABLE 1P HASTA 35A 1000V DC SIN INDICADOR DE FUSIÓN, MAXGE', 24.0, 1.628, 0.0, 39.072);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '26'), 'TUP 080600025', 'GRANADA', 150.0, 0.26, 0.0, 39.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS -  LA YEDRA', 6.0, 14.05, 54.0, 38.778);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3038 06', 'FUENTE TÓJAR', 6.0, 14.05, 54.0, 38.778);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPPT3230004', 'Mª JOSÉ (GRANADA)', 4.0, 20.55, 54.0, 37.812);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPPT3230004', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 20.55, 54.0, 37.812);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPPT3230004', 'FUENTE TÓJAR', 4.0, 20.55, 54.0, 37.812);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'ACAI-E-BOMB-CONDE-EX', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 1.0, 73.42, 50.0, 36.71);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '36'), 'SGIKD10838', 'CELE', 2.85, 12.75, 0.0, 36.3375);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '12'), '68867MM', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 1.0, 60.0, 40.0, 36.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '16'), '68867MM', 'DISPLAY NEGRO DE BOTONES MULTIMARCA', 1.0, 60.0, 40.0, 36.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRM321', 'FUENTE TÓJAR', 10.0, 15.6, 77.0, 35.879999999999995);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '14'), '6291', 'A4 MONOCROMO Y A4 COLOR', 1.0, 35.0, 0.0, 35.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '77'), '6241', 'PORTES', 1.0, 35.0, 0.0, 35.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRC321', 'FUENTE TÓJAR', 10.0, 14.91, 77.0, 34.293);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 34.16, 0.0, 34.16);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '19032005508/1', 'JESÚS MORALES BUSTOS - LA YEDRA', 16.0, 5.89, 64.0, 33.926399999999994);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '19032005508/1', 'FUENTE TÓJAR', 16.0, 5.89, 64.0, 33.926399999999994);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '162550', 'ALMACÉN', 4.0, 16.51, 50.0, 33.02);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '162550', 'ALMACÉN', 4.0, 16.51, 50.0, 33.02);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS03251', 'Mª JOSÉ(GRANADA)', 6.0, 10.95, 50.0, 32.849999999999994);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 6.0, 11.85, 54.0, 32.706);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'VASO DE EXPANSIÓN 8PCS 8 LT', 1.0, 55.22, 41.0, 32.579800000000006);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'MT01569', 'ASPIRADOR DE CENIZAS MT POWER', 1.0, 32.0, 0.0, 32.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 2.0, 25.35, 38.0, 31.434);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 6.0, 9.98, 48.0, 31.137600000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '162557', 'Mª JOSÉ 8GRANADA)', 4.0, 15.55, 50.0, 31.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0687440009', 'ALMACÉN', 24.0, 1.29, 0.0, 30.96);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140919', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 30.8, 0.0, 30.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140919', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 30.8, 0.0, 30.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'VASOACS-18L', 'LA YEDRA', 1.0, 61.409, 50.0, 30.7045);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '12'), '60325/2', 'RESISTENCIA ENCENDIDO 260W (2016)', 1.0, 51.0, 40.0, 30.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH5006005', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 1.0, 60.74, 50.0, 30.37);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6271', 'AYUNTAMIENTO GUADAHORTUNA 1500X750MM', 1.0, 30.0, 0.0, 30.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '090691062/900', 'ALMACÉN', 300.0, 0.0995, 0.0, 29.85);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '090691062/900', 'ALMACÉN', 300.0, 0.0995, 0.0, 29.85);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '18'), '419778AG', 'SELLADOR MULTICLIMA 750 ML', 2.0, 14.9, 0.0, 29.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '31'), '126524', 'ASPIRADOR DE CENIZAS 1200W 18 LT', 1.0, 28.9256, 0.0, 28.9256);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPPT2525004', 'FRANCISCO PORCUNA (ARJONA)', 5.0, 12.55, 54.0, 28.865);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '023298/80', 'ALMACÉN', 300.0, 0.096, 0.0, 28.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '23'), 'DINAK80SP-EMBELLECED', 'EMBELLECEDOR PLANO 80SW', 2.0, 34.25, 58.0, 28.770000000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '24'), 'DINAK80SP-EMBELLECED', 'EMBELLECEDOR PLANO 80SW', 2.0, 34.25, 58.0, 28.770000000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CAMISETA BUGATTI TALLA L BLANCO/VERDE', 5.0, 5.74, 0.0, 28.700000000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '71'), '0214763909/003', 'ALMACÉN', 150.0, 0.1913, 0.0, 28.695);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'CABLE KIT', 'CABLE KIT  (PYLONTECH)', 2.0, 13.95, 0.0, 27.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 6.0, 9.0, 50.0, 27.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'CRONOTERMOSTATO RADIO FRECUENCIA FERCO', 1.0, 43.0, 38.0, 26.66);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 57.0, 54.0, 26.22);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0972010107', 'ALMACÉN', 4.0, 6.55, 0.0, 26.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 10.0, 5.2, 50.0, 26.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 56.45, 54.0, 25.967);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '57'), 'AS04013', 'ALMUDENA CASADO', 1.0, 42.25, 40.0, 25.35);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '19'), 'LINK-S GROWATT', 'GROWATT SHINE LINK-S', 10.0, 2.433, 0.0, 24.33);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'PANTALÓN 4 XTREME XXL NEGRO- JESÚS MEDINA', 1.0, 24.22, 0.0, 24.22);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'PANTALÓN XXL NEGRO PARA JESÚS MONTILLA', 1.0, 24.22, 0.0, 24.22);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'IM14086', 'BI NATURA (GRANADA)', 1.0, 54.0, 55.56, 23.9976);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'REGULACIÓN CONTROL 1 ZONA FERCO', 1.0, 40.0, 40.0, 24.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ 8GRANADA)', 16.0, 6.35, 77.0, 23.368);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'VALVULA SEG. DUCO 101811 1/2 H-H 8 BAR STM', 4.0, 9.4, 38.0, 23.312);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'FUENTE TÓJAR', 1.0, 50.5, 54.0, 23.23);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '34'), '6292', 'CAMISETA BUGATTI TALLA XL BLANCO/VERDE', 4.0, 5.74, 0.0, 22.96);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 36.8, 38.0, 22.816);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'GSSV34', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 36.8, 38.0, 22.816);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKSH3234', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 24.72, 77.0, 22.7424);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 39.81, 44.0, 22.293600000000005);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 48.0, 54.0, 22.08);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '43'), '6295', 'MATERIAL PINTURA REPARACIÓN NAVE 16?', 1.0, 22.04, 0.0, 22.04);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH50000793', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 20.0, 2.2, 50.0, 22.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '09740825', 'ALMACÉN', 200.0, 0.11, 0.0, 22.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), 'SCH5006905', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 1.0, 43.79, 50.0, 21.895);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKRM321', 'JESÚS MORALES BUSTOS - LA YEDRA', 6.0, 15.6, 77.0, 21.528);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 10.0, 4.22, 50.0, 21.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '153703', 'NICO CONSTRUCTOR', 10.0, 4.22, 50.0, 21.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '153703', 'NICO CONSTRUCTOR', 10.0, 4.22, 50.0, 21.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 4.0, 22.89, 77.0, 21.0588);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '53'), 'DOG917-225', 'PECO', 1.0, 31.962, 35.0, 20.7753);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), 'GVT-8', 'VASO DE EXPANSION ACS 8L GUT 3/4''', 1.0, 45.0, 54.0, 20.7);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '73'), '039F08040SWJ/1', 'SW PELLETS 316L CODO 80-45º', 2.0, 20.62, 50.0, 20.62);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHK322X2', 'FUENTE TÓJAR', 3.0, 29.54, 77.0, 20.3826);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPTHKMU32', 'FRANCISCO PORCUNA (ARJONA)', 6.0, 14.6, 77.0, 20.148);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'TIJERA 145 MM ELECTRICISTA 41923 WHA', 1.0, 20.0, 0.0, 20.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 6.0, 14.44, 77.0, 19.9272);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'BARRA 4M MULTICAPA 16X2.0 BLANSOL', 8.0, 5.4, 54.0, 19.872);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHVABVI2X', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 3.0, 27.82, 77.0, 19.1958);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 6.0, 13.81, 77.0, 19.0578);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPPT3230004', 'ANTONIO AGUAYO (MARTOS)', 2.0, 20.55, 54.0, 18.906);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0194008070', 'ALMACÉN', 200.0, 0.0945, 0.0, 18.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '086893', 'ALMACÉN', 10.0, 3.95, 53.0, 18.565);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '086893', 'ALMACÉN', 10.0, 3.95, 53.0, 18.565);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTB2020025', 'PABLO MARTÍNEZ', 1.0, 40.25, 54.0, 18.515);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '30'), '602', 'ROLLO Y TUBO CRISTAL', 1.0, 18.25, 0.0, 18.25);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'REF_AUTO_2F43B4', 'JUEGO SOPORTES ECO LONG.500 GRANDE', 2.0, 8.8, 0.0, 17.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '0985600990', 'ALMACÉN', 10.0, 1.75, 0.0, 17.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 6.0, 6.32, 55.0, 17.064);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPPT2020004', 'Mª JOSÉ (GRANADA)', 5.0, 7.4, 54.0, 17.02);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '04118/30/900', 'ALMACÉN', 400.0, 0.0425, 0.0, 17.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '19032005508/1', 'ANTONIO AGUAYO (MARTOS)', 8.0, 5.89, 64.0, 16.963199999999997);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPTHKRC251', 'FRANCISCO PORCUNA (ARJONA)', 6.0, 12.29, 77.0, 16.960199999999997);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '163469', 'Mª JOSÉ (GRANADA)', 2.0, 16.9, 50.0, 16.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '73'), '039F081515W', 'SW PELLETS 316L DEFLECTOR H80', 1.0, 33.3, 50.0, 16.65);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS01058', 'JUEGO SOPORTES ECO LONG.450 MEDIANO', 2.0, 8.3, 0.0, 16.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKC2X', 'CODO 20 MULTICAPA', 10.0, 3.3, 50.0, 16.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '088479', 'ANASTASIO  (FUENTE TÓJAR)', 13.0, 1.2651, 0.0, 16.446299999999997);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '088479', 'ANASTASIO  (FUENTE TÓJAR)', 13.0, 1.2651, 0.0, 16.446299999999997);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '19025005508', 'FRANCISCO PORCUNA (ARJONA)', 10.0, 4.57, 64.0, 16.452);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '1022100', 'RETIRADO EN ALMACÉN', 2.0, 16.43, 50.0, 16.43);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 10.0, 3.27, 50.0, 16.35);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO', 15.0, 2.16, 50.0, 16.200000000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3004E', 'ANASTASIO', 25.0, 1.4, 54.0, 16.099999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '36'), 'MA 0330X30', 'CELE', 1.0, 26.6, 40.0, 15.96);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '36'), 'MA 0330X30', 'OSCAR TORREDONJIMENO', 1.0, 26.6, 40.0, 15.96);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 6.0, 5.89, 55.0, 15.902999999999995);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'R437NX041', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 1.0, 25.35, 38.0, 15.717);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '136892', 'Mª JOSÉ (GRANADA)', 2.0, 12.9, 40.0, 15.48);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '50'), '$0956RT', 'NICOLÁS CONSTRUCTOR - CALLE PERPETUO SOCORRO, 28', 10.0, 3.06, 50.0, 15.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'CALETERMOMETRO-INMER', 'LA YEDRA', 2.0, 15.219, 50.0, 15.219);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '109915', 'ANALIZADOR DUREZA 307601 ATH', 1.0, 28.1, 46.0, 15.174);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '109915', 'ANALIZADOR DUREZA 307601 ATH', 1.0, 28.1, 46.0, 15.174);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '164355', 'Mª JOSÉ (GRANADA)', 1.0, 14.8933, 0.0, 14.8933);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '53'), 'DOG205-180C', 'PITU', 1.0, 22.78, 35.0, 14.807);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '8032 120', 'JESÚS MORALES BUSTOS - LA YEDRA', 2.0, 15.8, 54.0, 14.536);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'FILTRO 3 PIEZAS COMPLETO', 1.0, 31.5, 54.0, 14.489999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '65'), '6241', 'PORTES', 1.0, 14.48, 0.0, 14.48);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 2.0, 15.65, 54.0, 14.398);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANODO 22X300 M8', 4.0, 7.8, 54.0, 14.352);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '153603', 'FUENTE TÓJAR', 4.0, 7.7, 54.0, 14.168);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '763604', 'FUENTE TÓJAR', 4.0, 7.7, 54.0, 14.168);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '9'), 'CABLE KIT', 'CABLE KIT  (PYLONTECH)', 1.0, 13.95, 0.0, 13.95);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '192713', 'PRO SDS PLUS-5X 14X400X460', 1.0, 25.74, 46.0, 13.8996);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '192713', 'PRO SDS PLUS-5X 14X400X460', 1.0, 25.74, 46.0, 13.8996);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKRC321', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 14.91, 77.0, 13.717199999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 2.0, 29.54, 77.0, 13.588399999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '35'), '00580210', 'ACOPLAM.AD87 1/2*-20HX1/4*M(AS-04X05)', 1.0, 28.0, 52.12, 13.4064);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'ABRAZADERA COBRE 22 RD GEBO', 2.0, 11.9, 44.0, 13.328);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '1018100', 'RETIRADO EN ALMACÉN', 2.0, 13.32, 50.0, 13.32);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPTHKT32252', 'FRANCISCO PORCUNA (ARJONA)', 2.0, 28.61, 77.0, 13.1606);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '19025005508', 'FRANCISCO PORCUNA', 8.0, 4.57, 64.0, 13.1616);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHKT32255', 'TE REDUCIDA 32X25X25XMULTICAPA BLANSOL', 2.0, 27.93, 77.0, 12.8478);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'MULPTHKT32255', 'FANCISCO PORCUNA (ARJONA)', 2.0, 27.93, 77.0, 12.8478);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 8.0, 1.605, 0.0, 12.84);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHVABVI2X', 'FUENTE TÓJAR', 2.0, 27.82, 77.0, 12.797199999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '083416', 'CURVA 90º HH 18 PRESS INOX', 4.0, 8.39, 62.0, 12.7528);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '083416', 'CURVA 90º HH 18 PRESS INOX', 4.0, 8.39, 62.0, 12.7528);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '083651', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 5.0, 2.52, 0.0, 12.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '083651', 'M.L TUBO A. INOX. 18''0.7 AISI 316', 5.0, 2.52, 0.0, 12.6);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 2.0, 12.57, 50.0, 12.57);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'TUP 07600020', 'JAVI C', 100.0, 0.125, 0.0, 12.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 3.0, 4.1, 0.0, 12.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 26.7, 54.0, 12.281999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'ACAI-TUBO6X9', 'ACADEMIA GUADIA CIVIL - ÚBEDA', 25.0, 0.96, 50.0, 12.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), 'REF_AUTO_2F43B4', 'ALMACÉN', 1.0, 11.87, 0.0, 11.87);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHVABVI2X', 'VALVULA CORTE VISTA 20 MULTICAPA BLANSOL', 2.0, 25.76, 77.0, 11.8496);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 10.0, 2.35, 50.0, 11.75);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKC2X', 'JESÚS MORALES BUSTOS - LA YEDRA', 6.0, 8.45, 77.0, 11.660999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '076420', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 5.0, 2.327, 0.0, 11.635);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '076420', 'VÁLVULA ESFERA PN-25 M-H 1/2 PALO 160743C CABEL', 5.0, 2.327, 0.0, 11.635);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '073474', 'Mª JOSÉ (GRANADA)', 2.0, 9.54, 40.0, 11.448);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 3.0, 8.25, 54.0, 11.385);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'KIT REPARACIÓN CHIMENEAS D.8 50246 FLOWER', 1.0, 14.07, 20.0, 11.256);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'PABLO MARTÍNEZ (CASAS DE JUAN LEÓN)', 4.0, 4.45, 38.0, 11.036);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ENLACE ROSCA HEMBRA 20X3/4 MULTICAPA BLANSOL', 6.0, 7.88, 77.0, 10.8744);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 23.4, 54.0, 10.764);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), 'TCDMH50100', 'RETIRADO EN TIENDA', 1.0, 21.41, 50.0, 10.705);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'ABRAZADERA DOBLE COBRE 18-20', 2.0, 9.55, 44.0, 10.696000000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 4.0, 5.75, 54.0, 10.579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3031', 'JESÚS MORALES BUSTOS -  LA YEDRA', 4.0, 5.75, 54.0, 10.579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3545E', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 5.75, 54.0, 10.579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3545E', 'FUENTE TÓJAR', 4.0, 5.75, 54.0, 10.579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3031', 'FUENTE TÓJAR', 4.0, 5.75, 54.0, 10.579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '51'), '199-338023', 'JAVI GALERA', 1.0, 15.0, 30.0, 10.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), '7109', 'CONEXIÓN GIGAN H 1/2 X 400 MM', 2.0, 13.11, 60.0, 10.488);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 22.35, 54.0, 10.281);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '2055959', 'NICOLÁS. CALLE PERPETUO SOCORRO', 1.0, 22.35, 54.0, 10.281);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '2055959', 'FUENTE TÓJAR', 1.0, 22.35, 54.0, 10.281);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '2055959', 'HILO TEFLÓN TANGIT UNILOCK', 1.0, 22.35, 54.0, 10.281);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '76'), '212184', 'FRNCISCO ZAPATA', 1.0, 12.73, 20.0, 10.184);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 4.0, 4.2946, 41.0, 10.135256000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '108839', 'MANDO PALANCA VÁLVULA PRESS CABEL', 3.0, 6.5, 48.0, 10.14);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '108839', 'MANDO PALANCA VÁLVULA PRESS CABEL', 3.0, 6.5, 48.0, 10.14);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 4.0, 5.45, 54.0, 10.028);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'FLEXÓMETRO BIMATERIA TYLON 8*25 0-30-657 STANLEY', 1.0, 12.75, 22.0, 9.945);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 19.73, 50.0, 9.865);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '763603', 'JESÚS MORALES BUSTOS- LA YEDRA', 4.0, 5.35, 54.0, 9.844);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '031425', 'ANASTASIO ( FUENTE TÓJAR)', 20.0, 0.6296, 22.0, 9.82176);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '031425', 'ANASTASIO ( FUENTE TÓJAR)', 20.0, 0.6296, 22.0, 9.82176);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ 8GRANADA)', 2.0, 9.3522, 48.0, 9.726288);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3005', 'FUENTE TÓJAR', 10.0, 2.1, 54.0, 9.66);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '67'), '070248', 'VARILLA ROSCADA DIN-975 M-8 8.8', 5.0, 2.95, 35.0, 9.5875);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ 8GRANADA)', 4.0, 4.78, 50.0, 9.56);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '192708', 'PEO SDS PLUS-5X 12X400X460', 1.0, 17.71, 46.0, 9.5634);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '192708', 'PEO SDS PLUS-5X 12X400X460', 1.0, 17.71, 46.0, 9.5634);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '56'), 'CEI 46016000', 'GEL LUBRICANTE DUPLOGEL INTRODUCIR1000 . JUANJO', 1.0, 9.45, 0.0, 9.45);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04293', 'FRANCISCO POCRUNA (ARJONA)', 1.0, 14.54, 35.0, 9.451);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '09020005508', 'Mª JOSÉ (GRANADA)', 20.0, 1.31, 64.0, 9.432);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 4.0, 5.19, 55.0, 9.342);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '26'), 'CEI 46016000', 'JAVI C', 1.0, 9.1, 0.0, 9.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'ACAI-C-CORTA-3X28', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 1.0, 18.16, 50.0, 9.08);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 19.7, 54.0, 9.062);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '8034 120', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 19.7, 54.0, 9.062);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '083518', 'COLEGIO MENGÍBAR', 2.0, 11.89, 62.0, 9.0364);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '48'), '624', 'TRANSPORTES', 1.0, 9.0, 0.0, 9.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '51'), '624', 'TRANSPORTES', 1.0, 9.0, 0.0, 9.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 2.0, 9.75, 54.0, 8.969999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '45020', 'KIT ENLACE ROSCA MACHO 20 1/2 PE LT', 5.0, 3.9, 54.0, 8.969999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '26'), 'HTI 006164', 'JAVI C', 1.0, 8.9, 0.0, 8.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '133505', 'ALMACÉN', 1.0, 16.122, 45.0, 8.8671);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '133505', 'ALMACÉN', 1.0, 16.122, 45.0, 8.8671);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 4.0, 2.8191, 22.0, 8.795592000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra2'), '2025092', 'HILO TEFLON TANGIT UNILOCK 160M', 1.0, 8.8, 0.0, 8.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 4.0, 7.1227, 70.0, 8.547240000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPPT2020004', 'FUENTE TÓJAR', 2.0, 9.2, 54.0, 8.463999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 10.0, 1.68, 50.0, 8.4);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '083510', 'COLEGIO MENGÍBAR', 2.0, 10.87, 62.0, 8.261199999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '083510', 'UNIÓN MACHO 18*1/2 PRESS INOX', 2.0, 10.87, 62.0, 8.261199999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '083510', 'UNIÓN MACHO 18*1/2 PRESS INOX', 2.0, 10.87, 62.0, 8.261199999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '36'), '100202/1', 'CELE', 2.0, 6.81, 40.0, 8.171999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRM2X34', 'FUENTE TÓJAR', 4.0, 8.85, 77.0, 8.142);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '125694', 'ALMACÉN', 4.0, 2.6, 22.0, 8.112);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '125694', 'ALMACÉN', 4.0, 2.6, 22.0, 8.112);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 2.0, 17.54, 77.0, 8.068399999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 4.0, 4.46, 55.0, 8.027999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'REJILLA SIMPLE DEFL. HORIZONTAL 400*150', 1.0, 11.2, 30.0, 7.839999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'GA7GUTIL', 'JOSE ANTONIO PÉREZ MELENDO', 100.0, 0.17, 54.0, 7.819999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '72'), '01865/50/900', 'ALMACÉN', 200.0, 0.039, 0.0, 7.8);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKC2X', 'NICOLÁS. CALLE PERPETUO SOCORRO', 4.0, 8.45, 77.0, 7.773999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'KIT TE R/H 20-1/2-20 PE L T', 2.0, 6.56, 41.0, 7.740800000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ENLACE ROSCA MACHO 25X3/4 MULTICAPA', 4.0, 8.35, 77.0, 7.681999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'FUENTE TÓJAR', 5.0, 3.3, 54.0, 7.59);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '042621', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 10.0, 0.9726, 22.0, 7.586280000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '042621', 'RACORD MARSELLA RED 1/2M-3/4H LATÓN 353223', 10.0, 0.9726, 22.0, 7.586280000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 4.0, 7.82, 77.0, 7.1944);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 2.0, 7.75, 54.0, 7.129999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 7.7, 54.0, 7.084);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '153603', 'Mª JOSÉ 8GRANADA)', 2.0, 7.7, 54.0, 7.084);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), '153603', 'VALVULA ESFERA C. BOLA 1/2 M-H MARIPOSA NILE VA25', 2.0, 7.7, 54.0, 7.084);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '16'), '6241', 'PORTES', 1.0, 7.0, 0.0, 7.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra3'), '624', 'TRANSPORTES', 1.0, 7.0, 0.0, 7.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 3.0, 2.327, 0.0, 6.981);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 1.0, 13.87, 50.0, 6.935);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ALARG HEX 1/2 X 2 CM LATON', 10.0, 1.5, 54.0, 6.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3045', 'FUENTE TÓJAR', 10.0, 1.5, 54.0, 6.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '090771', 'ALMACÉN', 1.0, 10.62, 35.0, 6.903);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '090771', 'ALMACÉN', 1.0, 10.62, 35.0, 6.903);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '18'), '6241', 'PORTES', 1.0, 6.75, 0.0, 6.75);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'R714X032', 'FRANCISCO AVENIDA ANDALUCÍA', 1.0, 10.85, 38.0, 6.726999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '09025005508', 'FRANCISCO PORCUNA', 12.0, 1.55, 64.0, 6.696000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHKRC2X34', 'Mª JOSÉ GRANADA', 4.0, 7.09, 77.0, 6.522799999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), '56100565', 'LA YEDRA', 20.0, 0.65, 50.0, 6.5);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'KIT CODO R/M 20-1/2 PE LT', 2.0, 5.3, 41.0, 6.254);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '26'), 'HIT 006110', 'GRANADA', 1.0, 6.2, 0.0, 6.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'FUENTE TÓJAR', 4.0, 6.18, 75.0, 6.18);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0209022CU', 'RETIRADO EN TIENDA', 10.0, 1.22, 50.0, 6.1);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'CODO 25 MULTICAPA BLANSOL', 2.0, 13.02, 77.0, 5.989199999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'METATEH-2012', 'LA YEDRA', 2.0, 6.64, 55.0, 5.975999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '050914', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 5.0, 1.5341, 22.0, 5.982990000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '050914', 'TÉ PARA HIERRO HHH 1/2 LATÓN 321022', 5.0, 1.5341, 22.0, 5.982990000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '092430', 'ALMACÉN', 1.0, 7.6, 22.0, 5.928);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '092430', 'ALMACÉN', 1.0, 7.6, 22.0, 5.928);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 25.76, 77.0, 5.9248);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '063936', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 9.8, 40.0, 5.88);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '063936', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 9.8, 40.0, 5.88);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 6.0, 2.17, 55.0, 5.858999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '53'), '071744', 'PECO', 5.0, 1.8, 35.0, 5.8500000000000005);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO', 1.0, 12.7, 54.0, 5.842);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'SACO DE SAL DESCALCIFICADOR', 1.0, 5.7851, 0.0, 5.7851);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), '40003500', 'LA YEDRA', 2.0, 5.78, 50.0, 5.78);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '26'), 'LEG 403588', 'GRANADA', 1.0, 5.76, 0.0, 5.76);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKRC2X12', 'PABLO MARTÍNEZ', 4.0, 6.24, 77.0, 5.7408);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRC2X12', 'FUENTE TÓJAR', 4.0, 6.24, 77.0, 5.7408);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'TE 20 MULTICAPA', 2.0, 12.3, 77.0, 5.658);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '111798', 'COLEGIO MENGÍBAR', 4.0, 3.17, 56.0, 5.579199999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'R179MX020', 'PABLO MARTÍNEZ (CASAS JUAN LEÓN)', 2.0, 4.45, 38.0, 5.518);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHKRC2X12', 'Mª JOSÉ (GRANADA)', 4.0, 5.78, 77.0, 5.3176);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'MULPTHKRC2X12', 'Mª JOSÉ (GRANADA)', 4.0, 5.78, 77.0, 5.3176);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '176854', 'JESÚS MORALES', 1.0, 5.3, 0.0, 5.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '176854', 'JESÚS MORALES', 1.0, 5.3, 0.0, 5.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKRC2X34', 'JESÚS MORALES BUSTOS - LA YEDRA', 3.0, 7.66, 77.0, 5.2854);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '03254', 'COLEGIO MENGÍBAR', 4.0, 2.85, 54.0, 5.244);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS02212', 'BOLSA BÁSICA AMORTIGUACIÓN TIPO B4 CON 4 ANTIVIBRADORES', 4.0, 1.3, 0.0, 5.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'EHCUCO1812', 'PABLO MARTÍNEZ', 4.0, 2.59, 50.0, 5.18);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 5.16, 50.0, 5.16);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '164261', 'NICO CONSTRUCTOR', 2.0, 4.75, 46.0, 5.130000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '164261', 'NICO CONSTRUCTOR', 2.0, 4.75, 46.0, 5.130000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'ACAICANAL-CA1610', 'ACADEMIA GUARDIA CIVIL - ÚBEDA', 8.0, 1.27, 50.0, 5.08);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04243', 'FRANCISCO PORCUNA (ARJONA)', 4.0, 1.93, 35.0, 5.018);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 2.0, 5.35, 54.0, 4.922);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0335945', 'RETIRADO EN TIENDA', 4.0, 2.45, 50.0, 4.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 1.0, 9.8, 50.0, 4.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 8.43, 42.0, 4.8894);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '46'), '6241', 'PORTES', 1.0, 4.75, 0.0, 4.75);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '67'), '427.521.106', 'JAVI C', 1.0, 7.29, 35.0, 4.7385);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0209018', 'RETIRADO EN TIENDA', 10.0, 0.94, 50.0, 4.699999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'RALAMACHONM - M-25', 'LA YEDRA', 5.0, 1.87, 50.0, 4.675000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 7.15, 35.0, 4.6475);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '063934', 'PURGADOR COLUMNA 1/2 S/SUP GREEN CALOR', 1.0, 7.15, 35.0, 4.6475);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3543 R', 'Mª JOSÉ (GRANADA)', 3.0, 3.35, 54.0, 4.623);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 4.0, 4.57, 75.0, 4.57);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'RALAMARSEM-R-40-32', 'LA YEDRA', 2.0, 4.56, 50.0, 4.56);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3544', 'Mª JOSÉ (GRANADA)', 3.0, 3.3, 54.0, 4.553999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO', 0.75, 13.0, 54.0, 4.484999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS03259', 'BI NATURA (GRANADA)', 1.0, 8.76, 50.0, 4.38);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3403E', 'Mª JOSÉ (GRANADA)', 9.0, 1.05, 54.0, 4.347);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRC2X12', 'ENLACE ROSCA MACHO 20X1/2 MULTICAPA', 3.0, 6.24, 77.0, 4.305599999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '125694', 'ANASTASIO', 2.0, 2.65, 22.0, 4.134);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '125694', 'ANASTASIO', 2.0, 2.65, 22.0, 4.134);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'COQUILLA 9*18 GRIS 090182155PE0N0 PE K-FLEX', 10.0, 0.99, 59.0, 4.059);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 1.0, 8.8, 54.0, 4.048);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '70037/04/02', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 8.8, 54.0, 4.048);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '58'), '624', 'TRANSPORTES', 1.0, 4.0, 0.0, 4.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS03269', 'BI NATURA (GRANADA)', 1.0, 7.94, 50.0, 3.97);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 4.13, 52.0, 3.9648);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '090786', 'ALMACÉN', 8.0, 0.493, 0.0, 3.944);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '090786', 'ALMACÉN', 8.0, 0.493, 0.0, 3.944);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 8.19, 77.0, 3.7674);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3027E', 'MACHÓNN RED 1-3/4 LATÓN', 3.0, 2.7, 54.0, 3.726);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '050926', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 5.0, 0.9443, 22.0, 3.68277);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '050926', 'MANGUITO PARA HIERRO 1/2 LATÓN 341022', 5.0, 0.9443, 22.0, 3.68277);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '602', 'OTROS APROVISIONAMIENTOS', 1.0, 3.63, 0.0, 3.63);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04051', 'CODO DESAGUE JUNTA Y 2 TAPONES DIAM.19', 1.0, 5.56, 35.0, 3.614);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '153603', 'Mª JOSÉ (GRANADA)', 1.0, 7.7, 54.0, 3.542);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '063923', 'ANASTASIO', 24.0, 0.24, 40.0, 3.456);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '063923', 'ANASTASIO', 24.0, 0.24, 40.0, 3.456);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 15.0, 0.5, 54.0, 3.45);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3406', 'JESÚS MORALES BUSTOS -  LA YEDRA', 2.0, 3.75, 54.0, 3.45);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3225E', 'FUENTE TÓJAR', 6.0, 1.25, 54.0, 3.45);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3503E', 'Mª JOSÉ (GRANADA)', 2.0, 3.7, 54.0, 3.404);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3503E', 'Mª JOSÉ (GRANADA)', 2.0, 3.7, 54.0, 3.404);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPPT2020004', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 7.4, 54.0, 3.404);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 1.0, 5.62, 41.0, 3.3158000000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04055', 'CODO DESAGUE D.32 Y 2 TAPONES', 1.0, 5.1, 35.0, 3.315);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '10541013', 'ACADEMIA GUARDIA CIVIL BAEZA', 1.0, 6.6, 50.0, 3.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'CODO TERMINAL ROSCA HEMBRA 20X1/2 MULTICCAPA BLANSOL', 2.0, 7.09, 77.0, 3.2614);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '10540033', 'ACADEMIA GUARDIA CIVIL BAEZA', 1.0, 6.4, 50.0, 3.2);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '153555', 'NICO CONSTRUCTOR', 2.0, 3.16, 50.0, 3.16);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '153555', 'NICO CONSTRUCTOR', 2.0, 3.16, 50.0, 3.16);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3543 R', 'CODO LATON M-H 1/2', 2.0, 3.35, 54.0, 3.082);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'KIT CODO IGUAL 20-20 PE LT', 1.0, 6.55, 54.0, 3.013);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKMU2X', 'NICOLÁS. CALLE PERPETUO SOCORRO', 2.0, 6.52, 77.0, 2.9992);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'LATISUPERH-H3/4X40', 'LA YEDRA', 1.0, 5.96, 50.0, 2.98);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'JAEN CLIMA', 2.0, 6.25, 77.0, 2.875);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'MULPTHKRH2X12', 'NICOLÁS. CALLE PERPETUO SOCORRO', 2.0, 6.24, 77.0, 2.8704);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '000621', 'ALMACÉN', 1.0, 4.3878, 35.0, 2.8520700000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '000621', 'ALMACÉN', 1.0, 4.3878, 35.0, 2.8520700000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'EMCUCO1812', 'Mª JOSÉ (GRANADA)', 2.0, 2.83, 50.0, 2.83);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 9.3181, 70.0, 2.79543);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'COQUILLA 9*22 GRIS PE 10022EK55PE K-FLEX', 6.0, 1.13, 59.0, 2.7798);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 4.0, 1.5, 54.0, 2.76);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'EM09000', 'BASE SUPERFICIE PORCELANA TT 16A-250V', 1.0, 4.1, 35.0, 2.665);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '064310', 'JESÚS MORALES', 2.0, 1.3243, 0.0, 2.6486);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '042636', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 5.0, 0.6784, 22.0, 2.64576);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '064310', 'JESÚS MORALES', 2.0, 1.3243, 0.0, 2.6486);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '042636', 'REDUCCIÓN EX.VAL. 3/4*1/2 LATÓN 392322', 5.0, 0.6784, 22.0, 2.64576);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 10.0, 0.55, 54.0, 2.53);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 2.61, 52.0, 2.5056);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'UNX 2233-0', 'ALMACÉN', 100.0, 0.043, 42.0, 2.494);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 5.0, 0.6296, 22.0, 2.4554400000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '031425', 'MANGUITO 243 G CU 15*1/2'' METALES 211215', 5.0, 0.6296, 22.0, 2.4554400000000003);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0335945', 'RETIRADO TIENDA', 2.0, 2.45, 50.0, 2.45);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 5.04, 77.0, 2.3184);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '135460', 'ALMACÉN', 1.0, 2.98, 22.0, 2.3244);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '135460', 'ALMACÉN', 1.0, 2.98, 22.0, 2.3244);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), 'REF_AUTO_2F43B4', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 1.25, 54.0, 2.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 2.0, 2.5, 54.0, 2.3);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ALARGADERA HEX RED H 1 1/4 M 1 LATÓN', 1.0, 4.95, 54.0, 2.277);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3820 010', 'MANÓMETRO RADIAL D.53 0-10B', 1.0, 4.85, 54.0, 2.231);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '3820 010', 'MANÓMETRO RADIAL D.53 0-10B', 1.0, 4.8, 54.0, 2.208);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '3027E', 'MACHÓNN RED 1-3/4 LATÓN', 2.0, 2.4, 54.0, 2.208);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '36'), 'MA.203300', 'OSCAR TORREDONJIMENO', 4.0, 0.91, 40.0, 2.184);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0335935', 'RETIRADO EN TIENDA', 2.0, 2.17, 50.0, 2.17);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 1.0, 4.05, 50.0, 2.025);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '050915', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 2.5774, 22.0, 2.010372);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '050915', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 2.5774, 22.0, 2.010372);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '022052', 'NICOLÁS', 5.0, 0.3941, 0.0, 1.9705);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '022052', 'NICOLÁS', 5.0, 0.3941, 0.0, 1.9705);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3005', 'Mª JOSÉ (GRANADA)', 2.0, 2.1, 54.0, 1.932);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3004E', 'Mª JOSÉ (GRANADA)', 3.0, 1.4, 54.0, 1.9319999999999995);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3004E', 'ANTONIO AGUAYO (MARTOS)', 3.0, 1.4, 54.0, 1.9319999999999995);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'ANTONIO AGUAYO (MARTOS)', 2.0, 2.1, 54.0, 1.932);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3403E', 'JESÚS MORALES BUSTOS - LA YEDRA', 4.0, 1.05, 54.0, 1.932);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3005', 'JESÚS MORALES BUSTOS - LA YEDRA', 2.0, 2.1, 54.0, 1.932);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '38'), 'AS02213', 'BI NATURA (GRANADA)', 1.0, 3.6, 47.22, 1.90008);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '70'), 'AS02213', 'NASTASIO (FUNTE TÓJAR)', 1.0, 1.9, 0.0, 1.9);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), '602', 'MARCOS MONTAJE', 1.0, 1.84, 0.0, 1.84);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '3042C', 'FRANCISCO AVENIDA ANDALUCIA', 4.0, 1.0, 54.0, 1.84);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0335816', 'RETIRADO EN TIENDA', 2.0, 1.8195, 50.0, 1.8195);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '0335934', 'RETIRADO EN TIENDA', 2.0, 1.81, 50.0, 1.81);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '3227', 'NICOLÁS. CALLE PERPETUO SOCORRO', 2.0, 1.95, 54.0, 1.7939999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 3.9, 54.0, 1.7939999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'MULPTHKRC2X34', 'FUENTE TÓJAR', 1.0, 7.66, 77.0, 1.7617999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), '45020', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 3.8, 54.0, 1.7479999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'TAPÓN R MAC LATÓN 1.1/4 S/C', 1.0, 3.75, 54.0, 1.725);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '5'), '624', 'TRANSPORTES', 1.0, 1.68, 0.0, 1.68);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '080561', 'ANASTASIO (FUENTE tÓJAR)', 2.0, 1.0561, 22.0, 1.6475160000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '080561', 'ANASTASIO (FUENTE tÓJAR)', 2.0, 1.0561, 22.0, 1.6475160000000002);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '28'), '2006240', 'GOMA DESAGÜE LAVADORA 2 MTS', 1.0, 3.24, 50.0, 1.62);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '11'), '624', 'TRANSPORTES', 1.0, 1.58, 0.0, 1.58);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04224', 'FRANCISCO POCRUNA (ARJONA)', 1.0, 2.03, 35.0, 1.3195);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '7'), '3004E', 'MACHON DOBLE 1/2 LATON', 2.0, 1.4, 54.0, 1.2879999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '18'), '333661AG', 'BROCHA BASIC Nº20', 1.0, 1.96, 40.0, 1.176);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '125251', 'ALMACÉN', 1.0, 1.4917, 22.0, 1.163526);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '125251', 'ALMACÉN', 1.0, 1.4917, 22.0, 1.163526);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 1.15, 54.0, 1.0579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'REF_AUTO_2F43B4', 'ANASTASIO (FUENTE TÓJAR)', 2.0, 1.15, 54.0, 1.0579999999999998);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '3403E', 'Mª JOSÉ (GRANADA)', 2.0, 1.05, 54.0, 0.966);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '06593', 'ACADEMIA GUARDIA CIVIL', 5.0, 0.4, 54.0, 0.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '06593', 'ACADEMIA GUARDIA CIVIL BAEZA', 5.0, 0.4, 54.0, 0.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '06507', 'ACEDEMIA GUARDIA CIVIL BAEZA', 5.0, 0.4, 54.0, 0.92);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04223', 'FRANCISCO PORCUNA (ARJONA)', 1.0, 1.4, 35.0, 0.91);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), '1102000000', 'JUNTA DE GOMA 2''', 4.0, 0.48, 54.0, 0.8831999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '75'), 'SOL 6625', 'JAVI C', 5.0, 0.17, 0.0, 0.8500000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04222', 'FRANCISCO PORCUNA (ARJONA)', 1.0, 1.3, 35.0, 0.8450000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '52'), '6295', 'OTROS GASTOS', 1.0, 0.83, 0.0, 0.83);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'Mª JOSÉ (GRANADA)', 2.0, 0.66, 38.0, 0.8184);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '8'), 'AS04213', 'FRANCISCO PORCUNA (ARJONA)', 1.0, 1.26, 35.0, 0.8190000000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'INA-11', 'ACADEMIA GUARDIA CIVIL', 1.0, 1.5, 54.0, 0.69);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '042629', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 2.1331, 70.0, 0.6399300000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '042629', 'ANASTASIO (FUENTE TÓJAR)', 1.0, 2.1331, 70.0, 0.6399300000000001);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'DS-01', 'ACADEMIA GUARDIA CIVIL', 2.0, 0.7, 54.0, 0.6439999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'CMH-104', 'ACADEMIA GUARDIA CIVIL', 2.0, 0.55, 54.0, 0.506);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'REF_AUTO_2F43B4', 'LA YEDRA', 1.0, 0.929, 50.0, 0.4645);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '027008', 'ANASTASIO', 2.0, 0.6, 67.0, 0.3959999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '027008', 'ANASTASIO', 2.0, 0.6, 67.0, 0.3959999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'CMH-106M-H', 'ACADEMIA GUARDIA CIVIL', 1.0, 0.55, 54.0, 0.253);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = 'Líneas de factura de compra'), 'CR-01', 'ACADEMIA GUARDIA CIVIL', 1.0, 0.5, 54.0, 0.2299999999999999);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '47'), 'JUNTA-GOMA-ANCHA-40', 'LA YEDRA', 2.0, 0.17, 50.0, 0.17);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '050024', 'NICOLÁS', 1.0, 0.1581, 0.0, 0.1581);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '050024', 'NICOLÁS', 1.0, 0.1581, 0.0, 0.1581);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), 'REF_AUTO_2F43B4', 'BOLSA COMPRA PLASTICO', 1.0, 0.15, 0.0, 0.15);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '64'), 'B', 'BOLSA COMPRA PLASTICO', 1.0, 0.15, 0.0, 0.15);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '27'), 'REF_AUTO_2F43B4', 'BOLSA', 1.0, 0.05, 0.0, 0.05);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '44'), '343034', 'PISTOLA PROFESIONAL 18:1 310ML', 1.0, 0.01, 0.0, 0.01);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '33'), 'AS04055', 'ABONO  DEVOLUCIÓN FACTURA 9749709', -1.0, 5.1, 35.0, -3.315);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '33'), 'AS04051', 'ABONO  DEVOLUCIÓN FACTURA 9749709', -1.0, 5.56, 35.0, -3.614);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '32'), '740078010', 'RADIADOR EUROPA  800 C 10 ELEMENTOS 7 ELEMENTOS', -0.1, 117.9, 0.0, -11.79);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '4'), 'HV330A', 'CRISTAL PUERTA HOGAR HV/HP/HQ', -1.0, 100.0, 40.0, -60.0);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '68'), '140953', 'TANIA', -1.0, 133.31, 0.0, -133.31);
INSERT INTO lineas_factura (factura_id, ref, descripcion, cantidad, precio, descuento, importe)
VALUES ((SELECT id FROM facturas_compra WHERE numero_factura = '69'), '140953', 'TANIA', -1.0, 133.31, 0.0, -133.31);
