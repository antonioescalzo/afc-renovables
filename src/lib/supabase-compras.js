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

// Obtener productos por proveedor (todas las líneas de factura)
export const fetchProductosPorProveedor = async (proveedorId) => {
  try {
    const { data, error } = await supabase
      .from('v_productos_por_proveedor')
      .select('*')
      .eq('proveedor_id', proveedorId)
      .limit(1000)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching productos por proveedor:', error)
    return { data: null, error }
  }
}

// Obtener resumen de precios de productos por proveedor
export const fetchProductosPrecioProveedor = async (proveedorId) => {
  try {
    const { data, error } = await supabase
      .from('v_productos_precio_proveedor')
      .select('*')
      .eq('proveedor_id', proveedorId)
      .limit(1000)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching productos precio proveedor:', error)
    return { data: null, error }
  }
}

// Obtener todos los productos únicos y sus precios en todos los proveedores
export const fetchProductosComparativaPrecios = async () => {
  try {
    const { data, error } = await supabase
      .from('v_productos_precio_proveedor')
      .select('*')
      .limit(5000)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching productos comparativa:', error)
    return { data: null, error }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PARA ANÁLISIS Y GRÁFICOS
// ═══════════════════════════════════════════════════════════════════════════

// Obtener datos de gasto por proveedor con análisis
export const fetchAnalisisProveedores = async () => {
  try {
    const { data, error } = await supabase
      .from('facturas_compra')
      .select('proveedor_id, proveedores(nombre), total_factura, fecha')
      .order('total_factura', { ascending: false })

    if (error) throw error

    // Procesar datos para gráficos
    const porProveedor = {}
    const porMes = {}

    data.forEach(f => {
      const prov = f.proveedores?.nombre || 'Desconocido'
      const mes = f.fecha?.substring(0, 7) || 'N/A'

      if (!porProveedor[prov]) {
        porProveedor[prov] = { nombre: prov, total: 0, facturas: 0 }
      }
      porProveedor[prov].total += f.total_factura || 0
      porProveedor[prov].facturas += 1

      if (!porMes[mes]) {
        porMes[mes] = { mes, total: 0 }
      }
      porMes[mes].total += f.total_factura || 0
    })

    return {
      data: {
        porProveedor: Object.values(porProveedor).sort((a, b) => b.total - a.total),
        porMes: Object.values(porMes).sort((a, b) => a.mes.localeCompare(b.mes))
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching analisis proveedores:', error)
    return { data: null, error }
  }
}

// Obtener KPIs de proveedores
export const fetchKPIsProveedores = async () => {
  try {
    const { data, error } = await supabase
      .from('facturas_compra')
      .select('proveedor_id, proveedores(nombre), total_factura')

    if (error) throw error

    const stats = {}
    let totalGasto = 0
    let totalFacturas = 0
    let facturasMayores = []

    data.forEach(f => {
      totalGasto += f.total_factura || 0
      totalFacturas += 1
      const prov = f.proveedores?.nombre || 'Desconocido'
      if (!stats[prov]) {
        stats[prov] = { total: 0, facturas: 0, precios: [] }
      }
      stats[prov].total += f.total_factura || 0
      stats[prov].facturas += 1
      stats[prov].precios.push(f.total_factura)
      facturasMayores.push({ proveedor: prov, monto: f.total_factura })
    })

    const proveedores = Object.entries(stats).map(([nombre, datos]) => ({
      nombre,
      total: datos.total,
      facturas: datos.facturas,
      promedio: datos.total / datos.facturas,
      mayor: Math.max(...datos.precios),
      menor: Math.min(...datos.precios)
    }))

    return {
      data: {
        totalGasto,
        totalFacturas,
        promediaFactura: totalGasto / totalFacturas,
        proveedorMasCaro: proveedores.sort((a, b) => b.total - a.total)[0],
        proveedorMasFacturas: proveedores.sort((a, b) => b.facturas - a.facturas)[0],
        proveedores
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching KPIs proveedores:', error)
    return { data: null, error }
  }
}

