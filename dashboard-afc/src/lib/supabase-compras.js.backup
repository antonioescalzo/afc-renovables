import { supabase } from './supabase'

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PARA COMPRAS 2026
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtener ranking de proveedores
 * @returns {Promise} Array de proveedores con ranking y estadísticas
 */
export const fetchProveedoresRanking = async () => {
  try {
    const { data, error } = await supabase
      .from('v_proveedores_ranking')
      .select('*')
      .limit(55)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching proveedores ranking:', error)
    return { data: null, error }
  }
}

/**
 * Obtener Top 5 proveedores
 * @returns {Promise} Array con top 5 proveedores
 */
export const fetchTop5Proveedores = async () => {
  try {
    const { data, error } = await supabase
      .from('v_top5_proveedores')
      .select('*')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching top 5 proveedores:', error)
    return { data: null, error }
  }
}

/**
 * Obtener análisis con porcentajes
 * @returns {Promise} Array de proveedores con porcentaje de gasto
 */
export const fetchProveedoresAnalisis = async () => {
  try {
    const { data, error } = await supabase
      .from('v_proveedores_analisis')
      .select('*')
      .limit(55)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching analisis:', error)
    return { data: null, error }
  }
}

/**
 * Obtener KPIs (resumen ejecutivo)
 * @returns {Promise} Object con métricas principales
 */
export const fetchKPIs = async () => {
  try {
    const { data, error } = await supabase
      .from('v_kpis_compras')
      .select('*')
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return { data: null, error }
  }
}

/**
 * Obtener distribución de gasto (para gráfico pastel)
 * @returns {Promise} Array para gráfico de distribución
 */
export const fetchDistribucionGasto = async () => {
  try {
    const { data, error } = await supabase
      .from('v_distribucion_gasto')
      .select('*')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching distribucion:', error)
    return { data: null, error }
  }
}

/**
 * Obtener facturas detalladas con opción de filtro
 * @param {number} limit - Límite de registros
 * @param {string} proveedor - Filtrar por nombre de proveedor (opcional)
 * @returns {Promise} Array de facturas
 */
export const fetchFacturasDetalladas = async (limit = 100, proveedor = null) => {
  try {
    let query = supabase
      .from('v_facturas_detalladas')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(limit)

    if (proveedor) {
      query = query.ilike('proveedor', `%${proveedor}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching facturas:', error)
    return { data: null, error }
  }
}

/**
 * Buscar facturas por número o proveedor
 * @param {string} termino - Término de búsqueda
 * @returns {Promise} Array de facturas que coinciden
 */
export const buscarFacturas = async (termino) => {
  try {
    if (!termino || termino.trim().length === 0) {
      return { data: [], error: null }
    }

    const searchTerm = termino.toUpperCase()

    const { data, error } = await supabase
      .from('v_buscar_facturas')
      .select('*')
      .or(`numero_factura_upper.ilike.%${searchTerm}%,proveedor_upper.ilike.%${searchTerm}%`)
      .limit(50)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error searching facturas:', error)
    return { data: null, error }
  }
}

/**
 * Obtener gastos por mes
 * @returns {Promise} Array con gastos mensuales
 */
export const fetchGastosPorMes = async () => {
  try {
    const { data, error } = await supabase
      .from('v_gastos_por_mes')
      .select('*')
      .order('mes', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching gastos por mes:', error)
    return { data: null, error }
  }
}

/**
 * Obtener estado de proveedores (Activo/Moderado/Inactivo)
 * @returns {Promise} Array de proveedores con estado
 */
export const fetchProveedoresEstado = async () => {
  try {
    const { data, error } = await supabase
      .from('v_proveedores_estado')
      .select('*')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching estado:', error)
    return { data: null, error }
  }
}

/**
 * Obtener detalles de un proveedor específico
 * @param {number} proveedorId - ID del proveedor
 * @returns {Promise} Array de facturas del proveedor
 */
export const fetchFacturasPorProveedor = async (proveedorId) => {
  try {
    const { data, error } = await supabase
      .from('v_facturas_detalladas')
      .select('*')
      .eq('proveedor_id', proveedorId)
      .order('fecha', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching facturas por proveedor:', error)
    return { data: null, error }
  }
}

/**
 * Obtener estadísticas de un proveedor
 * @param {number} proveedorId - ID del proveedor
 * @returns {Promise} Object con estadísticas del proveedor
 */
export const fetchEstadisticasProveedor = async (proveedorId) => {
  try {
    const { data, error } = await supabase
      .from('v_proveedores_ranking')
      .select('*')
      .eq('proveedor_id', proveedorId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching estadísticas:', error)
    return { data: null, error }
  }
}

/**
 * Filtrar facturas por rango de fechas
 * @param {string} fechaInicio - Fecha inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha fin (YYYY-MM-DD)
 * @returns {Promise} Array de facturas en el rango
 */
export const fetchFacturasPorFecha = async (fechaInicio, fechaFin) => {
  try {
    const { data, error } = await supabase
      .from('v_facturas_detalladas')
      .select('*')
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .order('fecha', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching facturas por fecha:', error)
    return { data: null, error }
  }
}

/**
 * Obtener proveedores activos (compraron en últimos 30 días)
 * @returns {Promise} Array de proveedores activos
 */
export const fetchProveedoresActivos = async () => {
  try {
    const { data, error } = await supabase
      .from('v_proveedores_estado')
      .select('*')
      .eq('estado', 'Activo')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching proveedores activos:', error)
    return { data: null, error }
  }
}

/**
 * Obtener lista completa de proveedores
 * @returns {Promise} Array de todos los proveedores
 */
export const fetchProveedores = async () => {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('nombre')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching proveedores:', error)
    return { data: null, error }
  }
}

/**
 * Obtener una factura específica por ID
 * @param {number} facturaId - ID de la factura
 * @returns {Promise} Objeto con datos de la factura
 */
export const fetchFacturaPorId = async (facturaId) => {
  try {
    const { data, error } = await supabase
      .from('facturas_compra')
      .select('*, proveedores(nombre)')
      .eq('id', facturaId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching factura:', error)
    return { data: null, error }
  }
}
