# 📦 SETUP: Productos por Proveedor

## Descripción
Este documento describe cómo completar la configuración de la funcionalidad "Productos por Proveedor" en el dashboard de AFC Renovables.

## Estado Actual

✅ **Completado:**
- Componente React (ProveedoresTab) con UI completa
- Funciones fetch para Supabase
- Archivos SQL con las vistas necesarias
- Script de carga de datos correctivos

❌ **Pendiente:**
- Crear las vistas en Supabase
- Ejecutar el script de carga de datos correctiva
- Verificar que los datos se muestren correctamente

## Paso 1: Crear las Vistas en Supabase

### Opción A: Usar Supabase Dashboard (Recomendado)

1. Ir a: https://app.supabase.com/project/xhzzfpsszsdqoiavqgis/sql
2. Crear una nueva query
3. Copiar y ejecutar el contenido de `crear_vista_productos_proveedor_CORREGIDA.sql`
4. Verificar que las 3 vistas se crean correctamente:
   - `v_productos_por_proveedor`
   - `v_productos_precio_proveedor`
   - `v_comparativa_productos_proveedor`

### Opción B: Usar CLI (si está disponible)

```bash
psql -h xhzzfpsszsdqoiavqgis.supabase.co -U postgres -d postgres < crear_vista_productos_proveedor_CORREGIDA.sql
```

## Paso 2: Ejecutar el Script de Carga de Datos

El script `fix_productos_proveedor.py` hace lo siguiente:

1. **Lee los CSVs de facturas** (4.csv a 77.csv) del directorio `costes_general/facturas_2026/`
2. **Mapea los proveedores** a sus IDs en Supabase
3. **Vincula las líneas de factura** con sus facturas_compra usando el número de factura
4. **Carga los productos** con la relación correcta (factura_id)

### Ejecutar el script:

```bash
python3 fix_productos_proveedor.py
```

**Salida esperada:**
```
🚀 CARGAR PRODUCTOS Y VINCULAR CON PROVEEDORES
════════════════════════════════════════════════════════

1️⃣ Cargando mapeo de proveedores...
   ✅ X registros de proveedores cargados
   ✅ Mapeo creado para Y proveedores

2️⃣ Obteniendo facturas existentes...
   ✅ N facturas encontradas

3️⃣ Procesando archivos CSV de facturas...
   ✓ 4.csv: 10 líneas procesadas
   ...
   📊 Total de líneas a insertar: 671

4️⃣ Insertando/actualizando líneas de factura...
   ✓ Lote 1: 100 registros
   ...
   ✅ 671 líneas procesadas
```

## Paso 3: Verificar los Datos

### En Supabase Dashboard:

```sql
-- Verificar total de líneas cargadas
SELECT COUNT(*) as total FROM v_productos_por_proveedor;

-- Verificar líneas por proveedor
SELECT proveedor_id, COUNT(*) as cantidad
FROM v_productos_por_proveedor
GROUP BY proveedor_id
ORDER BY cantidad DESC;

-- Ver ejemplo de datos
SELECT * FROM v_productos_por_proveedor LIMIT 5;
```

### En la Aplicación:

1. Ir a la pestaña "Proveedores" del dashboard
2. Desplazarse hasta "PRODUCTOS POR PROVEEDOR"
3. Seleccionar un proveedor del dropdown
4. Verificar que aparezcan sus productos

## Paso 4: Estructura de Datos

### Tabla lineas_factura (debe contener):
- `id`: Identificador único
- `factura_id`: FK a facturas_compra.id ← **CRÍTICO**
- `ref`: Referencia del producto
- `descripcion`: Descripción del producto
- `cantidad`: Cantidad comprada
- `precio`: Precio unitario
- `descuento`: Descuento aplicado
- `importe_total`: Cantidad × Precio

### Vista v_productos_por_proveedor (retorna):
```
proveedor_id, proveedor, ref, descripcion, cantidad,
precio, importe_total, descuento, fecha, numero_factura
```

## Troubleshooting

### ❌ "Sin productos registrados para este proveedor"

**Causa 1:** Las vistas no están creadas
- **Solución:** Ejecutar `crear_vista_productos_proveedor_CORREGIDA.sql` en Supabase

**Causa 2:** lineas_factura no tiene factura_id correcto
- **Solución:** Ejecutar `fix_productos_proveedor.py`

**Causa 3:** Los CSVs de facturas no existen
- **Solución:** Verificar que los archivos 4.csv a 77.csv existan en:
  `/home/user/afc-renovables/costes_general/facturas_2026/`

### ❌ Error de conexión a Supabase
- Verificar que las credenciales en `dashboard-afc/src/lib/supabase.js` sean correctas
- Verificar conectividad de red

### ❌ "proveedor" no encontrado
- Verificar que la columna en proveedores se llama "nombre" (no "proveedor")

## Archivos Relacionados

```
├── dashboard-afc/
│   └── src/
│       ├── components/
│       │   └── ProveedoresTab.jsx          ← UI completa con productos
│       └── lib/
│           ├── supabase.js                  ← Configuración de Supabase
│           └── supabase-compras.js          ← Funciones fetch
├── crear_vista_productos_proveedor_CORREGIDA.sql  ← SQL de vistas
├── fix_productos_proveedor.py               ← Script de carga de datos
├── costes_general/
│   └── facturas_2026/
│       ├── 4.csv
│       ├── 5.csv
│       ...
│       ├── 77.csv
│       └── proveedores.csv
```

## Flujo de Datos

```
CSV Files (4.csv, 5.csv, ..., 77.csv)
    ↓
    └─→ Información de productos y facturas
        ├─ Número de factura
        ├─ Proveedor
        ├─ Referencia
        ├─ Descripción
        └─ Precio

proveedores.csv
    ↓
    └─→ Mapeo de número de factura a proveedor

Supabase Tables:
    ├─ proveedores (nombre, id)
    ├─ facturas_compra (numero_factura, proveedor_id, fecha)
    └─ lineas_factura (factura_id, ref, descripcion, precio, cantidad)

SQL Views (v_productos_por_proveedor):
    ↓
    └─→ Vincula lineas_factura con facturas_compra y proveedores
        Retorna: proveedor_id, proveedor, ref, descripcion, cantidad, precio, fecha

React Component (ProveedoresTab):
    ↓
    └─→ fetchProductosPorProveedor(proveedorId)
        ├─ Query a v_productos_por_proveedor
        ├─ Filter por proveedor_id
        └─ Muestra tabla de productos
```

## Notas Importantes

1. **Relación crítica:** `lineas_factura.factura_id` DEBE apuntar a `facturas_compra.id`
   - Si está NULL, el join no funcionará
   - Use `fix_productos_proveedor.py` para corregir

2. **Proveedores:** Los nombres en los CSVs deben coincidir exactamente con los nombres en Supabase

3. **Fechas:** Las fechas en `facturas_compra.fecha` se usan para ordenar los productos

4. **Rendimiento:** La vista `v_productos_por_proveedor` puede crecer significativamente
   - Considerar agregar índices si hay >100k registros

## Verificación Final

Una vez completados todos los pasos, ejecutar estas verificaciones:

```javascript
// En la consola del navegador (Developer Tools)

// 1. Verificar que fetchProductosPorProveedor devuelve datos
import { fetchProductosPorProveedor } from './dashboard-afc/src/lib/supabase-compras.js'
fetchProductosPorProveedor(1).then(r => console.log(r))

// 2. Seleccionar un proveedor en el dropdown
// 3. Verificar que aparezcan productos en la tabla
// 4. Revisar la consola para logs de éxito
```

## Próximos Pasos

- Implementar búsqueda/filtro de productos
- Agregar comparativa de precios entre proveedores
- Crear reportes de análisis de costos
- Exportar datos a Excel

---

**Última actualización:** 2026-03-26
**Estado:** ✅ Listo para implementar
