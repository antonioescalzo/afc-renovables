# 🚀 INTEGRACIÓN DE PROVEEDORES EN EL DASHBOARD

## 📋 Resumen
Agregar una sección **PROVEEDORES** al dashboard con análisis completo de compras 2026, incluyendo:
- ✅ Top 5 Proveedores
- ✅ Ranking completo de 55 proveedores
- ✅ Análisis de gastos y facturas
- ✅ KPIs en el Dashboard principal

---

## 📁 ARCHIVOS A CREAR/MODIFICAR

### 1. **Archivos NUEVOS a crear:**

```
dashboard-afc/src/lib/supabase-compras.js
dashboard-afc/src/components/ProveedoresTab.jsx
dashboard-afc/src/components/DashboardTabActualizado.jsx
```

### 2. **Archivos a MODIFICAR:**

```
dashboard-afc/src/App.jsx
```

### 3. **Vistas SQL a crear en Supabase:**

```
crear_vistas_supabase.sql
```

---

## 🔧 PASOS DE INTEGRACIÓN

### PASO 1: Crear Vistas en Supabase

1. Abre: https://app.supabase.com → afc-renovables
2. SQL Editor → New Query
3. Copia el contenido de **crear_vistas_supabase.sql**
4. Pega en Supabase y ejecuta
5. Verifica que se crearon 9 vistas (v_proveedores_ranking, v_top5_proveedores, etc.)

**Resultado esperado:**
```
✅ 9 vistas creadas correctamente
```

---

### PASO 2: Crear archivo supabase-compras.js

1. Abre tu proyecto en VS Code
2. Ve a: `dashboard-afc/src/lib/`
3. Crea nuevo archivo: `supabase-compras.js`
4. Copia el contenido desde el archivo generado
5. Guarda el archivo

**Verificación:**
- El archivo debe tener ~350 líneas
- Debe exportar 15+ funciones de fetch
- Debe importar `supabase` de `./supabase`

---

### PASO 3: Crear ProveedoresTab.jsx

1. Ve a: `dashboard-afc/src/components/`
2. Crea nuevo archivo: `ProveedoresTab.jsx`
3. Copia el contenido del archivo ProveedoresTab.jsx generado
4. Guarda el archivo

**Verificación:**
- El componente debe importar funciones de `supabase-compras`
- Debe tener 2 tabs: "Ranking Completo" y "Top 5 Proveedores"
- Debe mostrar KPIs principales

---

### PASO 4: Actualizar DashboardTab.jsx

**Opción A: Reemplazar completamente (Recomendado)**
1. Renombra el archivo actual:
   ```
   dashboard-afc/src/components/DashboardTab.jsx → DashboardTab.jsx.backup
   ```
2. Crea nuevo archivo `DashboardTab.jsx` con el contenido de `DashboardTabActualizado.jsx`
3. Guarda

**Opción B: Fusionar manualmente**
Si ya tienes cambios en DashboardTab.jsx:
1. Abre `DashboardTabActualizado.jsx`
2. Copia las nuevas secciones (SECCIÓN 2: COMPRAS 2026 y SECCIÓN 3: TOP 5 PROVEEDORES)
3. Pégalas en tu `DashboardTab.jsx` actual

**Verificación:**
- Debe importar funciones de `supabase-compras`
- Debe mostrar 4 stat-cards de inventario
- Debe mostrar 4 stat-cards de compras 2026
- Debe mostrar top 5 proveedores

---

### PASO 5: Actualizar App.jsx

1. Abre: `dashboard-afc/src/App.jsx`
2. Encuentra la línea:
   ```javascript
   import ProveedoresTab from './components/ProveedoresTab'
   ```
   Y agrégala al final de los imports (después de `SalidasTab`)

3. En el array `tabs`, agrega:
   ```javascript
   { id: 'proveedores', label: 'Proveedores', icon: ShoppingCart },
   ```
   (Después de la línea de 'clientes')

4. Agrega el import del icono:
   ```javascript
   import { Package, Users, Truck, BarChart3, Settings, ShoppingCart } from 'lucide-react'
   ```

5. En la sección `<main>`, agrega:
   ```javascript
   {activeTab === 'proveedores' && <ProveedoresTab />}
   ```
   (Después de la línea de clientes)

6. Actualiza el texto en el header si quieres:
   ```javascript
   <p>Gestión de Almacén y Compras en Tiempo Real</p>
   ```

7. Guarda el archivo

**Verificación:**
- El botón "Proveedores" aparece en la navegación
- Al clickear, muestra el componente ProveedoresTab

---

### PASO 6: Verificar en el navegador

1. En la terminal, ve a `dashboard-afc/`
2. Ejecuta: `npm run dev`
3. Abre: http://localhost:5173
4. Verifica:
   - ✅ Dashboard muestra KPIs de compras 2026
   - ✅ Dashboard muestra Top 5 proveedores
   - ✅ Nuevo botón "Proveedores" en el menú
   - ✅ Click en "Proveedores" muestra la tabla con ranking

---

## 📊 LO QUE VERÁS

### En DASHBOARD:
```
┌─────────────────────────────────────────────────────────┐
│ 📦 Inventario                                           │
├─────────────────────────────────────────────────────────┤
│ [Total Artículos] [Stock Bajo] [Valor Total] [Salidas] │
├─────────────────────────────────────────────────────────┤
│ 💳 Compras 2026                                         │
├─────────────────────────────────────────────────────────┤
│ [Proveedores] [Total Facturas] [Gasto Total] [Promedio]│
├─────────────────────────────────────────────────────────┤
│ 🏆 Top 5 Proveedores por Gasto                         │
├─────────────────────────────────────────────────────────┤
│ #1 INVERSOLAR EXTREMADURA SL - €41,912.74 ▓▓▓▓▓▓▓▓▓▓ │
│ #2 FERRETERIA UBETENSE SL - €15,822.94     ▓▓▓▓▓▓    │
│ ... (3 más)                                             │
└─────────────────────────────────────────────────────────┘
```

### En PROVEEDORES:
```
┌─────────────────────────────────────────────────────────┐
│ 📦 Análisis de Proveedores 2026                         │
├─────────────────────────────────────────────────────────┤
│ [Proveedores] [Gasto Total] [Total Facturas] [Promedio]│
├─────────────────────────────────────────────────────────┤
│ [🔍 Buscar proveedor...]                               │
│ [📊 Ranking Completo] [🏆 Top 5 Proveedores]           │
├─────────────────────────────────────────────────────────┤
│ # │ Proveedor             │ Facturas │ Gasto   │ ...   │
│ 1 │ INVERSOLAR EXTREMAD...│    7     │€41.9K  │ ...   │
│ 2 │ FERRETERIA UBETENSE   │    2     │€15.8K  │ ...   │
│ 3 │ JAEN CLIMA SL         │    4     │€8.0K   │ ...   │
│ ... (más proveedores)                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 FUNCIONES DISPONIBLES EN supabase-compras.js

```javascript
// Ranking y análisis
fetchProveedoresRanking()          // Todos los proveedores con ranking
fetchTop5Proveedores()             // Top 5 por gasto
fetchProveedoresAnalisis()         // Con porcentajes
fetchDistribucionGasto()           // Para gráfico pastel

// KPIs
fetchKPIs()                        // Resumen ejecutivo

// Facturas
fetchFacturasDetalladas(limit, proveedor)
buscarFacturas(termino)            // Búsqueda por número o proveedor
fetchFacturasPorProveedor(id)
fetchFacturasPorFecha(inicio, fin)

// Estado
fetchProveedoresEstado()           // Activo/Moderado/Inactivo
fetchProveedoresActivos()          // Solo activos

// Utilidad
fetchProveedores()                 // Lista completa de proveedores
fetchFacturaPorId(id)              // Una factura específica
fetchEstadisticasProveedor(id)     // Stats de un proveedor
fetchGastosPorMes()                // Análisis temporal
```

---

## 🎨 PERSONALIZACIÓN (Opcional)

Si quieres cambiar colores o estilos:

1. Abre: `dashboard-afc/src/App.css`
2. Busca las clases:
   - `.stat-card` - Tarjetas de estadísticas
   - `.data-table` - Tablas
   - `.cards-grid` - Grillas de cards

3. Modifica colores/estilos según necesites

---

## ⚠️ PROBLEMAS COMUNES

### Problema: "Module not found: supabase-compras"
**Solución:**
- Verifica que el archivo está en `dashboard-afc/src/lib/supabase-compras.js`
- Verifica que el import es correcto: `from '../lib/supabase-compras'`

### Problema: "No data showing in Proveedores tab"
**Solución:**
1. Verifica que las vistas se crearon en Supabase
2. Revisa la consola del navegador (F12) para errores
3. Verifica que `fetchProveedoresRanking()` retorna datos

### Problema: "Botón Proveedores no aparece"
**Solución:**
- Revisa que agregaste el import de `ProveedoresTab`
- Revisa que agregaste la línea en el array `tabs`
- Revisa que agregaste el condicional en `<main>`

### Problema: "Dashboard no muestra compras"
**Solución:**
- Verifica que reemplazaste `DashboardTab.jsx` o agregaste las nuevas secciones
- Verifica que importaste `fetchKPIs` y `fetchTop5Proveedores`

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear vistas en Supabase (9 vistas)
- [ ] Copiar `supabase-compras.js` a `dashboard-afc/src/lib/`
- [ ] Copiar `ProveedoresTab.jsx` a `dashboard-afc/src/components/`
- [ ] Actualizar `DashboardTab.jsx`
- [ ] Actualizar `App.jsx` (imports, tabs array, main content)
- [ ] Prueba en navegador (npm run dev)
- [ ] Verificar que muestra datos correctamente
- [ ] Prueba de búsqueda en Proveedores
- [ ] Prueba de filtros

---

## 🎉 ¡LISTO!

Una vez completados todos los pasos, tu dashboard tendrá:
- ✅ Sección PROVEEDORES con análisis completo
- ✅ Dashboard actualizado con KPIs de compras
- ✅ Top 5 proveedores destacado
- ✅ Búsqueda y filtrado de proveedores
- ✅ Ranking completo de 55 proveedores

**Total de datos:** 100 facturas de compra, 55 proveedores, €120,259.70 en gastos

---

## 📞 SOPORTE

Si algo no funciona:
1. Revisa la consola del navegador (F12) para errores
2. Verifica que todas las vistas se crearon correctamente
3. Revisa que los imports están correctos
4. Comprueba que Supabase está conectado correctamente
