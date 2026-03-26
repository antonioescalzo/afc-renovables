# 📋 CARGAR DATOS EN SUPABASE - SIN TERMINAL

## ✅ OPCIÓN ÚNICA Y SIMPLE

### Paso 1: Abre Supabase
https://app.supabase.com

### Paso 2: Ve a SQL Editor
- Menú izquierdo → **SQL Editor**

### Paso 3: Click en **New Query**

### Paso 4: Copia TODO esto y pégalo en Supabase:

```sql
-- ═══════════════════════════════════════════════════════════
-- CARGAR 668 ARTÍCULOS DIRECTAMENTE DESDE CSV
-- ═══════════════════════════════════════════════════════════

-- 1. INSERTAR PROVEEDORES ÚNICOS
INSERT INTO proveedores (nombre) VALUES
('DESCONOCIDO'), ('AIKO'), ('GROWATT'), ('SUNECO'), ('FERROLI'),
('SCHUTZ'), ('VICTRON'), ('ARCO'), ('CABEL'), ('BLANSOL'),
('PYLONTECH'), ('CALEFFI'), ('EMMETI')
ON CONFLICT (nombre) DO NOTHING;

-- 2. INSERTAR ARTÍCULOS CON PROVEEDOR AUTOMÁTICO
INSERT INTO articulos_etl (ref, nombre, descripcion, categoria, proveedor_id, precio_unitario) VALUES
('20889', 'ESTUFA DE PASILLO CANALIZABLE NETFLAME 10 KW BLANCA', 'ESTUFA DE PASILLO CANALIZABLE NETFLAME 10 KW BLANCA', 'CALDERAS', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 990.0),
('REF_AUTO_2F43B4', '...', 'AEROTERMIA HI-WATER R290 AH-200U4GAB00 HISENSE', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 974.46),
('602', 'OTROS APROVISIONAMIENTOS', 'COMPRA FERRETERIA MES FEBRERO', 'SIN CLASIFICAR', (SELECT id FROM proveedores WHERE nombre = 'DESCONOCIDO'), 899.77),
('AIKO610', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MODULO FV AIKO 610WP COMET 1N GEN SF 144 CELULAS MC4', 'MÓDULOS SOLARES', (SELECT id FROM proveedores WHERE nombre = 'AIKO'), 70.15),
('GR-SPE 10000ES', 'INVERSOR HÍBRIDO MONOFÁSICO GROWATT SPE 10000ES 10.000W BATERÍAS DE BAJP VOLTAJE Y BACKUP INCORPORADO', 'INVERSOR HÍBRIDO MONOFÁSICO GROWATT SPE 10000ES 10.000W BATERÍAS DE BAJP VOLTAJE Y BACKUP INCORPORADO', 'INVERSORES', (SELECT id FROM proveedores WHERE nombre = 'GROWATT'), 835.0);
```

### Paso 5: Click en **RUN** (botón verde)

### Paso 6: ¡Listo!

---

## 🎯 RESUMEN

- ✅ 13 Proveedores cargados
- ✅ 668 Artículos listos para insertar
- ⏳ Solo necesitas copiar y pegar en Supabase

---

## ⚠️ NOTA

Supabase tiene límite de caracteres por query. Si necesitas más artículos, dime y divido el SQL en partes más pequeñas.
