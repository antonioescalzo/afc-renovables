/**
 * Script para insertar productos ECLIMEN en Supabase
 * Crea una factura y sus líneas de producto
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Variables de entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('✗ Faltan variables de entorno SUPABASE_URL o SUPABASE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Cargar productos
const productosPath = path.join(__dirname, '../src/data/CLIMEN_PRODUCTOS_DB.json')
const productos = JSON.parse(fs.readFileSync(productosPath, 'utf-8'))

console.log(`\n📦 INSERTANDO ${productos.length} PRODUCTOS ECLIMEN EN SUPABASE\n`)

async function insertarProductosEclimen() {
  try {
    // 1. Buscar el proveedor ECLIMEN
    console.log('1️⃣ Buscando proveedor ECLIMEN...')
    const { data: proveedores, error: errorProv } = await supabase
      .from('proveedores')
      .select('proveedor_id, nombre')
      .ilike('nombre', '%eclimen%')
      .limit(1)

    if (errorProv) throw errorProv
    if (!proveedores || proveedores.length === 0) {
      console.error('✗ No se encontró proveedor ECLIMEN en la base de datos')
      console.log('\nProveedores disponibles que contienen "eclimen":')
      const { data: allProv } = await supabase
        .from('proveedores')
        .select('proveedor_id, nombre')
      allProv?.forEach(p => {
        if (p.nombre.toLowerCase().includes('eclimen') || p.nombre.toLowerCase().includes('elect')) {
          console.log(`  - ${p.proveedor_id}: ${p.nombre}`)
        }
      })
      return
    }

    const proveedorEclimen = proveedores[0]
    console.log(`✓ Proveedor encontrado: ${proveedorEclimen.nombre} (ID: ${proveedorEclimen.proveedor_id})`)

    // 2. Crear factura
    console.log('\n2️⃣ Creando factura...')
    const fechaFactura = new Date().toISOString().split('T')[0]
    const numeroFactura = `ECLIMEN-${Date.now()}`

    const { data: factura, error: errorFactura } = await supabase
      .from('facturas_compra')
      .insert([
        {
          numero_factura: numeroFactura,
          proveedor_id: proveedorEclimen.proveedor_id,
          fecha: fechaFactura,
          total_factura: 0, // Se actualizará con el total de líneas
          estado: 'pagada',
          notas: 'Productos importados de CLIMEN CSV'
        }
      ])
      .select()

    if (errorFactura) throw errorFactura
    if (!factura || factura.length === 0) {
      console.error('✗ Error al crear la factura')
      return
    }

    const facturaId = factura[0].factura_id
    console.log(`✓ Factura creada: ${numeroFactura} (ID: ${facturaId})`)

    // 3. Insertar líneas de producto
    console.log('\n3️⃣ Insertando líneas de producto...')
    let totalFactura = 0
    const lineas = []

    for (const [idx, prod] of productos.entries()) {
      const cantidad = prod.cantidad_total || 1
      const precioUnitario = prod.precio || 0
      const importe = cantidad * precioUnitario

      lineas.push({
        factura_id: facturaId,
        referencia: prod.ref,
        descripcion: prod.desc,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        descuento: 0,
        importe_total: importe
      })

      totalFactura += importe

      if ((idx + 1) % 5 === 0) {
        console.log(`  ⏳ Procesados ${idx + 1}/${productos.length} productos...`)
      }
    }

    const { data: lineasInsertadas, error: errorLineas } = await supabase
      .from('lineas_factura')
      .insert(lineas)

    if (errorLineas) throw errorLineas

    console.log(`✓ ${lineas.length} líneas de producto insertadas`)

    // 4. Actualizar total de factura
    console.log('\n4️⃣ Actualizando total de factura...')
    const { error: errorUpdate } = await supabase
      .from('facturas_compra')
      .update({ total_factura: totalFactura })
      .eq('factura_id', facturaId)

    if (errorUpdate) throw errorUpdate

    console.log(`✓ Factura actualizada con total: €${totalFactura.toFixed(2)}`)

    // 5. Verificar que se insertaron correctamente
    console.log('\n5️⃣ Verificando datos insertados...')
    const { data: lineasVerif, error: errorVerif } = await supabase
      .from('lineas_factura')
      .select('*')
      .eq('factura_id', facturaId)

    if (errorVerif) throw errorVerif

    console.log(`✓ Verificación: ${lineasVerif?.length} líneas encontradas en BD`)

    console.log(`\n✅ INSERCIÓN COMPLETADA CON ÉXITO!`)
    console.log(`\n📊 Resumen:`)
    console.log(`  - Factura: ${numeroFactura}`)
    console.log(`  - Proveedor: ${proveedorEclimen.nombre}`)
    console.log(`  - Total productos: ${lineas.length}`)
    console.log(`  - Total factura: €${totalFactura.toFixed(2)}`)
    console.log(`  - Fecha: ${fechaFactura}`)

  } catch (error) {
    console.error('\n✗ Error durante la inserción:', error.message)
    process.exit(1)
  }
}

// Ejecutar
insertarProductosEclimen()
