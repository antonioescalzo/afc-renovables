-- ============================================
-- CREAR ESTRUCTURA DE TABLAS EN SUPABASE
-- Copia este contenido en SQL Editor de Supabase
-- ============================================

-- 1. TABLA: ARTICULOS (Catálogo de productos)
CREATE TABLE IF NOT EXISTS articulos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  proveedor TEXT,
  fabricante TEXT,
  precio_coste DECIMAL(10,2),
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  unidad_medida TEXT,
  categoria TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLA: EQUIPOS (Cuadrillas de trabajo)
CREATE TABLE IF NOT EXISTS equipos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  integrantes TEXT[], -- Array de nombres
  responsable_alistado TEXT,
  unidad_negocio TEXT,
  estado TEXT DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABLA: CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  ciudad TEXT,
  tipo TEXT, -- 'cliente', 'proveedor', 'interno'
  contacto TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLA: PROYECTOS
CREATE TABLE IF NOT EXISTS proyectos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  cliente_id TEXT REFERENCES clientes(id),
  presupuesto DECIMAL(12,2),
  gastado DECIMAL(12,2) DEFAULT 0,
  margen_percent DECIMAL(5,2) DEFAULT 0,
  fecha_inicio DATE,
  fecha_fin DATE,
  estado TEXT DEFAULT 'activo', -- 'activo', 'completado', 'cancelado'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLA: SALIDAS (Registros de salida de almacén)
CREATE TABLE IF NOT EXISTS salidas (
  id TEXT PRIMARY KEY,
  fecha DATE NOT NULL,
  equipo_id TEXT REFERENCES equipos(id),
  proyecto_id TEXT REFERENCES proyectos(id),
  cliente_id TEXT REFERENCES clientes(id),
  alistado_por TEXT,
  tipo_trabajo TEXT, -- 'INSTALACION', 'INCIDENCIA', 'MANTENIMIENTO'
  costo_total DECIMAL(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'completado',
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. TABLA: LINEAS_SALIDA (Detalles de cada salida)
CREATE TABLE IF NOT EXISTS lineas_salida (
  id SERIAL PRIMARY KEY,
  salida_id TEXT REFERENCES salidas(id) ON DELETE CASCADE,
  articulo_id TEXT REFERENCES articulos(id),
  cantidad INTEGER NOT NULL,
  precio_unit DECIMAL(10,2),
  subtotal DECIMAL(12,2),
  stock_antes INTEGER,
  stock_despues INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. TABLA: INGRESOS (Entradas de productos)
CREATE TABLE IF NOT EXISTS ingresos (
  id TEXT PRIMARY KEY,
  fecha DATE NOT NULL,
  proveedor TEXT,
  articulo_id TEXT REFERENCES articulos(id),
  cantidad INTEGER NOT NULL,
  precio_compra DECIMAL(10,2),
  total DECIMAL(12,2),
  lote_numero TEXT,
  fecha_vencimiento DATE,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. TABLA: AUDITORIA (Historial de cambios)
CREATE TABLE IF NOT EXISTS auditoria (
  id SERIAL PRIMARY KEY,
  tabla TEXT NOT NULL,
  operacion TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  usuario TEXT,
  id_registro TEXT,
  datos_antes JSONB,
  datos_despues JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CREAR ÍNDICES PARA BÚSQUEDAS RÁPIDAS
-- ============================================

CREATE INDEX idx_articulos_nombre ON articulos(nombre);
CREATE INDEX idx_articulos_categoria ON articulos(categoria);
CREATE INDEX idx_salidas_fecha ON salidas(fecha);
CREATE INDEX idx_salidas_equipo ON salidas(equipo_id);
CREATE INDEX idx_salidas_cliente ON salidas(cliente_id);
CREATE INDEX idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX idx_ingresos_proveedor ON ingresos(proveedor);
CREATE INDEX idx_lineas_salida_salida ON lineas_salida(salida_id);
CREATE INDEX idx_lineas_salida_articulo ON lineas_salida(articulo_id);

-- ============================================
-- CREAR FUNCIONES AUTOMÁTICAS
-- ============================================

-- Función: Actualizar stock cuando hay salida
CREATE OR REPLACE FUNCTION actualizar_stock_salida()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articulos
  SET stock_actual = stock_actual - NEW.cantidad,
      updated_at = NOW()
  WHERE id = NEW.articulo_id;
  
  -- Guardar stock_despues
  NEW.stock_despues = (SELECT stock_actual FROM articulos WHERE id = NEW.articulo_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Decrementar stock en salida
CREATE TRIGGER trigger_salida_stock
BEFORE INSERT ON lineas_salida
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_salida();

-- Función: Actualizar stock cuando hay ingreso
CREATE OR REPLACE FUNCTION actualizar_stock_ingreso()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articulos
  SET stock_actual = stock_actual + NEW.cantidad,
      updated_at = NOW()
  WHERE id = NEW.articulo_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Incrementar stock en ingreso
CREATE TRIGGER trigger_ingreso_stock
AFTER INSERT ON ingresos
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_ingreso();

-- Función: Registrar cambios en auditoría
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria (tabla, operacion, usuario, id_registro, datos_antes, datos_despues, timestamp)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    current_user,
    COALESCE(NEW.id::text, OLD.id::text),
    to_jsonb(OLD),
    to_jsonb(NEW),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría en tabla salidas
CREATE TRIGGER audit_salidas
AFTER INSERT OR UPDATE OR DELETE ON salidas
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria();

-- Triggers de auditoría en tabla ingresos
CREATE TRIGGER audit_ingresos
AFTER INSERT OR UPDATE OR DELETE ON ingresos
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria();

-- ============================================
-- CREAR VISTAS ÚTILES
-- ============================================

-- Vista: Stock actual con valor
CREATE OR REPLACE VIEW v_stock_actual AS
SELECT 
  id,
  nombre,
  stock_actual,
  stock_minimo,
  precio_coste,
  (stock_actual * precio_coste) as valor_total,
  CASE 
    WHEN stock_actual <= stock_minimo THEN 'BAJO'
    WHEN stock_actual <= (stock_minimo * 1.5) THEN 'CRÍTICO'
    ELSE 'OK'
  END as alerta,
  categoria,
  proveedor
FROM articulos
WHERE activo = true
ORDER BY stock_actual ASC;

-- Vista: Resumen de proyectos
CREATE OR REPLACE VIEW v_resumen_proyectos AS
SELECT 
  p.id,
  p.nombre,
  c.nombre as cliente,
  p.presupuesto,
  COALESCE(SUM(s.costo_total), 0) as gastado,
  (p.presupuesto - COALESCE(SUM(s.costo_total), 0)) as disponible,
  ROUND(((p.presupuesto - COALESCE(SUM(s.costo_total), 0)) / p.presupuesto * 100)::numeric, 2) as margen_percent,
  p.estado
FROM proyectos p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN salidas s ON p.id = s.proyecto_id
GROUP BY p.id, p.nombre, c.nombre, p.presupuesto, p.estado;

-- Vista: Auditoría reciente
CREATE OR REPLACE VIEW v_auditoria_reciente AS
SELECT 
  id,
  tabla,
  operacion,
  usuario,
  timestamp,
  datos_despues
FROM auditoria
ORDER BY timestamp DESC
LIMIT 100;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Copia todo este contenido en Supabase SQL Editor
-- y ejecuta. Tardará ~5 segundos en crear todo.
