# 📊 INSTRUCCIONES: CARGAR DATOS ETL EN SUPABASE

## 🎯 OBJETIVO
Cargar los 668 artículos de compras 2026 en las tablas de Supabase

## 📋 OPCIÓN 1: Usar SQL en el Dashboard de Supabase (RECOMENDADO)

### Paso 1: Ir a Supabase
1. Abre https://app.supabase.com
2. Entra a tu proyecto **afc-renovables**

### Paso 2: Acceder al SQL Editor
1. En el menú izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New Query**

### Paso 3: Copiar el script SQL
1. Abre este archivo en tu editor:
   ```
   /tmp/load_data_supabase.sql
   ```
2. Copia TODO el contenido

### Paso 4: Pegar y ejecutar en Supabase
1. Pega el código en el SQL Editor
2. Haz clic en **RUN** (botón verde)
3. Espera a que complete (tardará unos segundos)

### Paso 5: Verificar que funcionó
En el SQL Editor, ejecuta esta consulta:
```sql
SELECT COUNT(*) as total FROM articulos_etl;
SELECT COUNT(*) as total FROM lineas_factura;
SELECT COUNT(*) as total FROM facturas_compra;
```

Deberías ver:
- **articulos_etl**: 668 registros
- **lineas_factura**: 668 registros
- **facturas_compra**: 77 registros

---

## 🐍 OPCIÓN 2: Usar Python (Si la OPCIÓN 1 falla)

### Requisitos:
```bash
pip install pandas requests
```

### Ejecutar:
1. Descarga el script: `/tmp/load_data_supabase_python.py`
2. Ejecuta desde tu máquina (que tenga acceso a internet):
```bash
python3 load_data_supabase_python.py
```

---

## ✅ VERIFICACIÓN FINAL

Una vez cargados los datos, deberías ver en el Dashboard de Supabase:

### Tabla: proveedores
```
✓ 13 proveedores (DESCONOCIDO, FERROLI, GROWATT, etc.)
```

### Tabla: facturas_compra
```
✓ 77 facturas (del 4.csv al 77.csv)
✓ Total de importe: €47,098.30
```

### Tabla: articulos_etl
```
✓ 668 artículos
✓ 17 categorías
✓ 301 en "SIN CLASIFICAR"
```

### Tabla: lineas_factura
```
✓ 668 líneas de factura
✓ Cantidad total: 668 items
✓ Importe total: €47,098.30
```

---

## 📈 PASO 5: PRÓXIMOS PASOS

Una vez verificado que los datos están cargados:

1. ✅ **PASO 4 completado**: Schema en Supabase
2. ✅ **PASO 5 completado**: Datos cargados
3. 🔜 **PASO 6**: Crear consultas analíticas (Gráficos en la web)

---

## 🆘 PROBLEMAS COMUNES

### Error: "Table does not exist"
- Las tablas no se crearon bien
- Solución: Ejecuta el script de creación de tablas nuevamente

### Error: "Foreign key violation"
- Un proveedor no existe
- Solución: El script usa `ON CONFLICT DO NOTHING` para manejar esto

### El SQL tardó mucho / Se pausó
- Normal, son 2000+ INSERT statements
- Espera a que termine (máx 1-2 minutos)
