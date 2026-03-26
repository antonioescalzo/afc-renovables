# ✅ CARGAR 55 PROVEEDORES Y 100 FACTURAS EN SUPABASE

## 📋 RESUMEN
Este archivo contiene el SQL para cargar:
- **55 proveedores únicos** del archivo `proveedores.csv`
- **100 facturas completas** con sus totales correctos
- Todos mapean correctamente a proveedores reales (RECA, COTO, INVERSOLAR, etc.)

## 🎯 PASO A PASO

### 1. Abre Supabase
https://app.supabase.com → Proyecto **afc-renovables**

### 2. Ve a SQL Editor
- Menú izquierdo → **SQL Editor**
- Click en **New Query**

### 3. Copia el SQL
El archivo `/cargar_proveedores_nuevos.sql` contiene TODO lo necesario.

**Opción A: Copia desde GitHub (RECOMENDADO)**
```
Abre: https://github.com/antonioescalzo/afc-renovables/blob/claude/setup-dashboard-database-N0BhR/cargar_proveedores_nuevos.sql
Click en Raw → Copia TODO
```

**Opción B: Copia el contenido aquí abajo**
```sql
-- ═══════════════════════════════════════════════════════════
-- CARGAR PROVEEDORES Y FACTURAS DESDE ARCHIVO proveedores.csv
-- ═══════════════════════════════════════════════════════════

-- 1. INSERTAR PROVEEDORES ÚNICOS (55 proveedores)
INSERT INTO proveedores (nombre) VALUES
('FERRETERIA UBETENSE SL'),
('BETSOLAR'),
... [líneas 7-61 del SQL]
ON CONFLICT (nombre) DO NOTHING;

-- 2. INSERTAR 100 FACTURAS DESDE PROVEEDORES
INSERT INTO facturas_compra (numero_factura, fecha, proveedor_id, total_factura, csv_origen) VALUES
('COM/26-000146', '28/02/2026', (SELECT id FROM proveedores WHERE nombre = 'FERRETERIA UBETENSE SL'), 12094.49, 'proveedores.csv'),
... [líneas 66-165 del SQL]
;
```

### 4. Pega en Supabase
1. Pega TODO el SQL en el SQL Editor
2. Click en **RUN** (botón verde)
3. Espera a que complete (unos 5 segundos)

### 5. Verifica que funcionó
```sql
SELECT COUNT(*) as total FROM proveedores;
SELECT COUNT(*) as total FROM facturas_compra WHERE csv_origen = 'proveedores.csv';
```

Deberías ver:
- **proveedores**: 55 registros (puede ser menos si algunos ya existían)
- **facturas_compra**: 100 nuevos registros

### 6. Verifica los totales
```sql
SELECT SUM(total_factura) as total FROM facturas_compra WHERE csv_origen = 'proveedores.csv';
```

Deberías ver: **€120,259.70**

---

## 📊 DATOS CARGADOS

### Proveedores (55 únicos)
- FERRETERIA UBETENSE SL
- BETSOLAR
- INVERSOLAR EXTREMADURA SL (6 facturas)
- GRUPO ELECTRO STOCKS SLU (4 facturas)
- RECA HISPANA SAU (2 facturas)
- SUMINISTROS ELÉCTRICOS COTO SL (2 facturas)
- JAEN CLIMA SL (4 facturas)
- ESTRUSUR SOLAR, SL. (3 facturas)
- ... y 47 más

### Facturas (100 total)
- **Rango**: COM/26-000146 a COM/26-000047
- **Fechas**: 01/01/2026 a 06/03/2026
- **Suma total**: €120,259.70

---

## ⚠️ NOTAS IMPORTANTES

### ✅ Lo que este SQL hace:
1. Insertar 55 proveedores (si no existen)
2. Insertar 100 facturas con números COM/26-0000XX
3. Vincular cada factura a su proveedor correcto
4. Marcar origen como "proveedores.csv"

### ❌ Lo que NO hace:
- No elimina datos previos
- No modifica artículos existentes
- No toca las líneas de almacén (4.csv a 77.csv)

### 🔗 Relación con otros datos
- **Artículos de almacén** (4.csv a 77.csv): 668 líneas → ya cargadas
- **Proveedores reales** (proveedores.csv): 100 facturas → se cargan AHORA
- Los artículos de almacén tienen su propio origen (4.csv, 5.csv, etc.)
- Las 100 facturas de proveedores tienen origen "proveedores.csv"

---

## 🆘 PROBLEMAS

### Error: "Table does not exist"
- La tabla `facturas_compra` no existe
- Solución: Ejecuta primero el script de schema (PASO 4)

### Error: "Column 'proveedor_id' does not exist"
- La columna no está en la tabla
- Solución: Revisa el schema de `facturas_compra`

### Error: "Foreign key violation"
- Un proveedor en el SELECT no existe
- Esto NO debería pasar porque primero insertamos proveedores
- Si ocurre: Ejecuta primero solo la parte de proveedores (líneas 1-62)

---

## ✅ PRÓXIMO PASO

Una vez cargados estos datos:
1. ✅ Schema en Supabase (PASO 4 ✓)
2. ✅ Datos de almacén cargados (PASO 5 ✓)
3. ✅ Proveedores y facturas cargados (PASO 5.2 ✓ NUEVO)
4. 🔜 PASO 6: Crear consultas analíticas

---

**Archivo generado**: `cargar_proveedores_nuevos.sql` (15.5 KB)
**Total registros a cargar**: 155 (55 proveedores + 100 facturas)
**Tiempo estimado**: < 10 segundos
