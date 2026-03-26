import { supabase } from './supabase'

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PARA COMPRAS 2026
// ═══════════════════════════════════════════════════════════════════════════

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
