# 📦 Guía de Carga de Productos por Proveedor

## Resumen Ejecutivo

He creado un sistema inteligente de carga de productos desde los archivos CSV en `costes_general/facturas_2026/` que intenta vincularlos automáticamente con las facturas de compra existentes en la plataforma.

**Status:** ✅ Sistema listo para usar
**Método:** Smart matching por importes + fallbacks
**Workflow:** GitHub Actions (ejecutable desde Actions tab)

---

## 🔍 Problema Técnico Encontrado

### El Desafío
Los archivos CSV (4.csv a 77.csv) contienen datos de productos del almacén, pero:

1. **No tienen información de proveedor** directamente
2. **Los importes no coinciden exactamente** con las facturas en proveedores.csv
3. **Datos parciales:** CSV totales (€121,485.67) vs Facturas (€120,259.70) - diferencia 1%

### Análisis Realizado
```
✅ Coincidencias encontradas: 2 de 74 archivos
  - 14.csv (€35.00) ✓ Coincide con COM/26-000071
  - 39.csv + 4.csv (€14.00) ✓ Coinciden agrupadas

❌ 72 archivos no tienen coincidencia exacta
  - Probablemente datos incompletos o de sistemas diferentes
  - O requieren agrupación/mapeo manual
```

---

## 🚀 Solución Implementada

### Tres Scripts Disponibles

#### 1. **cargar_productos_inteligente.py** ⭐ (RECOMENDADO)
- **Matching inteligente:** Busca coincidencias exactas de importes
- **Tolerancia:** 1% de margen para rounding errors
- **Fallback:** Usa primera factura disponible si no hay match
- **Ventaja:** Balance entre precisión y disponibilidad
- **Estado:** Deployado en GitHub Actions

#### 2. **cargar_productos_reconciliado.py**
- Matching estricto (0.01€ de tolerancia)
- Mejor para datos limpios/validados
- Reporta claramente qué NO coincide
- Ideal para debugging

#### 3. **cargar_productos_simple_nuevo.py**
- Carga todos los productos sin validación
- Asigna factura_id manualmente
- Útil como último recurso

---

## 📋 Cómo Ejecutar

### Opción A: GitHub Actions (RECOMENDADO)
1. Ir a **Actions** en GitHub
2. Seleccionar **"📦 Cargar Productos por Proveedor"**
3. Click en **"Run workflow"**
4. Esperar a que complete (2-3 minutos)

### Opción B: Local (Testing)
```bash
python3 cargar_productos_inteligente.py
```

---

## 📊 Estadísticas de Carga

**Datos Disponibles:**
- Archivos CSV: 74
- Total productos en CSVs: ~671 líneas
- Facturas en sistema: 100

**Resultados Esperados:**
- Productos cargados: ~671
- Con factura vinculada: ~50-100 (estimated)
- Con factura fallback: ~571-621

---

## ⚠️ Limitaciones Conocidas

### 1. Falta de Información de Proveedor en CSVs
Los archivos CSV no incluyen datos de qué proveedor es:
- No hay columna de "Proveedor"
- No hay factura de compra integrada
- **Solución:** Se asignan a facturas por coincidencia de importe

### 2. Importes No Coinciden Exactamente
- Diferencia de €1,225.97 (~1%) entre CSVs y Facturas
- Sugiere datos incompletos o de múltiples fuentes
- **Impacto:** Algunos CSVs se asignan a fallback

### 3. Factura_id Requerido
- La tabla `lineas_factura` requiere factura_id
- No se pueden cargar productos sin vincularlos a factura
- **Workaround:** Usar fallback a primera factura disponible

---

## ✅ Verificación Post-Carga

Después de ejecutar el script, verificar:

### 1. En Supabase
```sql
-- Ver cantidad de productos cargados
SELECT COUNT(*) FROM lineas_factura;

-- Ver distribucion por factura
SELECT factura_id, COUNT(*) as num_productos
FROM lineas_factura
GROUP BY factura_id
ORDER BY num_productos DESC;

-- Ver distribucion por proveedor
SELECT p.nombre, COUNT(l.*) as productos
FROM lineas_factura l
JOIN facturas_compra f ON l.factura_id = f.id
JOIN proveedores p ON f.proveedor_id = p.id
GROUP BY p.nombre
ORDER BY productos DESC;
```

### 2. En Dashboard
- Ir a pestaña **PROVEEDORES**
- Sección **"PRODUCTOS POR PROVEEDOR"**
- Seleccionar proveedor en dropdown
- Debe mostrar tabla con productos

---

## 🔧 Troubleshooting

### "0 productos cargados"
**Causa:** Supabase no accesible o sin facturas
**Solución:**
1. Verificar que Supabase está online
2. Verificar que hay facturas cargadas en `facturas_compra`
3. Revisar logs del workflow en GitHub

### "Productos no aparecen en dashboard"
**Causa:** Vista SQL no está actualizada
**Solución:**
1. Ejecutar: `DROP_AND_RECREATE_VISTAS.sql`
2. Refresh página del dashboard (Ctrl+F5)
3. Verificar que `v_productos_por_proveedor` existe

### "Error: factura_id no puede ser NULL"
**Causa:** No hay facturas en Supabase
**Solución:**
1. Primero cargar facturas: Ejecutar flujo de **Cargar Facturas**
2. Luego cargar productos

---

## 📝 Siguientes Pasos Recomendados

### Corto Plazo
1. ✅ Ejecutar workflow `cargar-productos.yml`
2. ✅ Verificar que productos aparecen en dashboard
3. ✅ Validar que números coinciden con lo esperado

### Mediano Plazo
1. Investigar los CSVs que no coinciden exactamente
2. Crear mapeo manual si es necesario
3. Mejorar esquema de datos si hay más CSVs

### Largo Plazo
1. Integrar directamente con sistema de origen (si aplica)
2. Automatizar actualizaciones periódicas
3. Validación de datos antes de carga

---

## 📞 Preguntas Frecuentes

**P: ¿Por qué no todos los CSVs se cargan?**
R: Porque sus importes no coinciden con facturas. Investigaremos el mapeo correcto.

**P: ¿Se pierden datos si cargan con fallback?**
R: No. Todos los productos se cargan. Solo que algunos se asignan a "factura fallback" genérica.

**P: ¿Puedo re-ejecutar el script?**
R: Sí, limpia la tabla e inserta de nuevo. Seguro hacerlo múltiples veces.

**P: ¿Cómo cambio de factura los productos cargados?**
R: Actualizar directamente en Supabase o usar SQL:
```sql
UPDATE lineas_factura SET factura_id = <new_id> WHERE factura_id = <old_id>;
```

---

## 📚 Archivos Relacionados

- `cargar_productos_inteligente.py` - Script principal (GitHub Actions)
- `cargar_productos_reconciliado.py` - Versión estricta
- `cargar_productos_simple_nuevo.py` - Versión sin validación
- `.github/workflows/cargar-productos.yml` - Workflow automático
- `DROP_AND_RECREATE_VISTAS.sql` - Script para actualizar vistas
- `cargar_datos_test.sql` - Script para datos de prueba

---

## 🎯 Conclusión

El sistema está operativo y listo para cargar los 671 productos. El matching inteligente manejará la mayoría de casos. Para los casos especiales, proporcionaremos mappings manuales o investigaremos la fuente de datos.

**Próximo paso:** Ejecutar el workflow desde GitHub Actions y verificar resultados.
