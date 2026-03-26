# 📊 CONSULTAS ANALÍTICAS - ANÁLISIS DE PROVEEDORES

## 🎯 Objetivo
Analizar los costes por proveedor para identificar:
- ✅ Proveedores con mayor gasto
- ✅ Frecuencia de compras por proveedor
- ✅ Tendencias de compra
- ✅ Proveedores activos vs inactivos

---

## 📋 LISTA DE CONSULTAS

### **1️⃣ RANKING DE PROVEEDORES (COMPLETO)**
**Usar cuando**: Necesites ver ranking, cantidad de facturas y fechas

```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as total_gasto,
  ROUND(AVG(f.total_factura)::numeric, 2) as promedio_factura,
  MAX(f.fecha) as ultima_compra,
  MIN(f.fecha) as primera_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_gasto DESC;
```

**Resultado esperado**:
```
ranking | proveedor | num_facturas | total_gasto | promedio_factura | ultima_compra | primera_compra
1       | INVERSOLAR EXTREMADURA SL | 7 | 32296.23 | 4613.75 | 2026-02-27 | 2026-01-21
2       | FERRETERIA UBETENSE SL | 2 | 15822.94 | 7911.47 | 2026-02-28 | 2026-01-31
...
```

---

### **2️⃣ TOP 10 PROVEEDORES (SIMPLIFICADO)**
**Usar cuando**: Solo necesites los 10 mayores gastadores

```sql
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as total_gasto
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_gasto DESC
LIMIT 10;
```

---

### **3️⃣ DETALLES COMPLETOS DE ACTIVIDAD**
**Usar cuando**: Necesites estadísticas detalladas (mín, máx, promedio, días activo)

```sql
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as cantidad_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(MIN(f.total_factura)::numeric, 2) as factura_minima,
  ROUND(MAX(f.total_factura)::numeric, 2) as factura_maxima,
  ROUND(AVG(f.total_factura)::numeric, 2) as factura_promedio,
  MAX(f.fecha)::text as ultima_factura,
  DATEDIFF(day, MIN(f.fecha), MAX(f.fecha)) as dias_actividad
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;
```

---

### **4️⃣ ANÁLISIS DE PORCENTAJE DE GASTO**
**Usar cuando**: Necesites ver qué % del gasto total representa cada proveedor

```sql
WITH totales AS (
  SELECT SUM(total_factura) as gasto_total
  FROM facturas_compra
  WHERE csv_origen = 'proveedores.csv'
)
SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as ranking,
  p.nombre as proveedor,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  ROUND(
    (SUM(f.total_factura) / (SELECT gasto_total FROM totales) * 100)::numeric,
    2
  ) as porcentaje_gasto,
  MAX(f.fecha)::text as ultima_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id,
     totales
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;
```

**Resultado esperado**:
```
ranking | proveedor | facturas | gasto_total | porcentaje_gasto | ultima_compra
1       | INVERSOLAR EXTREMADURA SL | 7 | 32296.23 | 26.85 | 2026-02-27
2       | FERRETERIA UBETENSE SL | 2 | 15822.94 | 13.15 | 2026-02-28
3       | EDISTRIBUCION REDES DIGITALES SLU | 1 | 7861.56 | 6.53 | 2026-01-05
...
```

---

### **5️⃣ PROVEEDORES ACTIVOS POR MES**
**Usar cuando**: Analices patrones de compra mensual

```sql
SELECT
  p.nombre as proveedor,
  COUNT(DISTINCT DATE_TRUNC('month', f.fecha)) as meses_activo,
  COUNT(f.id) as total_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  STRING_AGG(DISTINCT TO_CHAR(f.fecha, 'YYYY-MM'), ', ' ORDER BY TO_CHAR(f.fecha, 'YYYY-MM')) as meses_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY total_facturas DESC;
```

---

### **6️⃣ RESUMEN EJECUTIVO**
**Usar cuando**: Necesites KPIs generales rápidamente

```sql
SELECT
  'RESUMEN GENERAL' as categoria,
  COUNT(DISTINCT p.id)::text as cantidad_proveedores,
  COUNT(f.id)::text as cantidad_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2)::text as gasto_total,
  ROUND(AVG(f.total_factura)::numeric, 2)::text as promedio_factura
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
UNION ALL
SELECT
  'PROVEEDOR MÁS GRANDE' as categoria,
  p.nombre,
  COUNT(f.id)::text,
  ROUND(SUM(f.total_factura)::numeric, 2)::text,
  ROUND(AVG(f.total_factura)::numeric, 2)::text
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY SUM(f.total_factura) DESC
LIMIT 1;
```

---

### **7️⃣ ÚLTIMAS FACTURAS POR PROVEEDOR**
**Usar cuando**: Necesites ver la factura más reciente de cada proveedor

```sql
SELECT DISTINCT ON (p.id)
  p.nombre as proveedor,
  f.numero_factura as ultima_factura,
  f.fecha as fecha_factura,
  ROUND(f.total_factura::numeric, 2) as monto
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
ORDER BY p.id, f.fecha DESC;
```

---

### **8️⃣ ESTADO DE PROVEEDORES (ACTIVO/INACTIVO)**
**Usar cuando**: Clasifiques proveedores por actividad reciente

```sql
SELECT
  p.nombre as proveedor,
  COUNT(f.id) as num_facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  MAX(f.fecha)::text as ultima_compra,
  CASE
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Activo'
    WHEN MAX(f.fecha) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Moderado'
    ELSE 'Inactivo'
  END as estado
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY MAX(f.fecha) DESC;
```

---

### **9️⃣ TOP 5 vs OTROS**
**Usar cuando**: Compares top 5 proveedores contra el resto consolidado

```sql
WITH ranking AS (
  SELECT
    p.id,
    p.nombre,
    ROW_NUMBER() OVER (ORDER BY SUM(f.total_factura) DESC) as rank,
    COUNT(f.id) as facturas,
    SUM(f.total_factura) as total
  FROM facturas_compra f
  JOIN proveedores p ON f.proveedor_id = p.id
  WHERE f.csv_origen = 'proveedores.csv'
  GROUP BY p.id, p.nombre
)
SELECT
  CASE WHEN rank <= 5 THEN nombre ELSE 'OTROS (50 proveedores)' END as proveedor,
  CASE WHEN rank <= 5 THEN facturas ELSE SUM(facturas) END as facturas,
  CASE WHEN rank <= 5 THEN ROUND(total::numeric, 2) ELSE ROUND(SUM(total)::numeric, 2) END as total_gasto
FROM ranking
GROUP BY
  CASE WHEN rank <= 5 THEN nombre ELSE 'OTROS (50 proveedores)' END,
  CASE WHEN rank <= 5 THEN facturas ELSE NULL END,
  CASE WHEN rank <= 5 THEN total ELSE NULL END
ORDER BY total_gasto DESC;
```

---

### **🔟 LISTA COMPLETA ORDENADA**
**Usar cuando**: Necesites todos los 55 proveedores en una lista simple

```sql
SELECT
  p.nombre,
  COUNT(f.id) as facturas,
  ROUND(SUM(f.total_factura)::numeric, 2) as gasto_total,
  MAX(f.fecha)::text as ultima_compra
FROM facturas_compra f
JOIN proveedores p ON f.proveedor_id = p.id
WHERE f.csv_origen = 'proveedores.csv'
GROUP BY p.id, p.nombre
ORDER BY gasto_total DESC;
```

---

## 🚀 CÓMO USAR

### **En Supabase:**
1. Abre: https://app.supabase.com → afc-renovables
2. SQL Editor → New Query
3. Copia cualquiera de las consultas arriba
4. Pega en el editor
5. Click **RUN**

### **Guardar como VIEW (reutilizable):**
```sql
CREATE VIEW v_proveedores_ranking AS
SELECT ... (contenido de la consulta 1)

-- Luego usar:
SELECT * FROM v_proveedores_ranking;
```

---

## 📈 CASOS DE USO

| Pregunta | Usa Consulta |
|----------|-------------|
| "¿Quién gasta más?" | #1 o #2 |
| "¿Cuánto gasta cada proveedor?" | #10 |
| "¿Qué % del presupuesto es cada uno?" | #4 |
| "¿Cuáles son activos ahora?" | #8 |
| "¿Últimas facturas?" | #7 |
| "¿Estadísticas de facturas?" | #3 |
| "Tengo 5 minutos, dame lo esencial" | #6 |
| "Compara los grandes con el resto" | #9 |

---

## 💾 ARCHIVO
Todas las 10 consultas están en: `consultas_analisis_proveedores.sql`

Copia el archivo completo a Supabase si quieres tener todas disponibles de una vez.
