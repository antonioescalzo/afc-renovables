#!/usr/bin/env node

/**
 * Script para importar datos del Excel __bbdd_stock_almacen.xlsx a Supabase
 * Uso: node scripts/import-excel-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://xhzzfpsszsdqoiavqgis.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function importExcel() {
  try {
    console.log('📂 Leyendo archivo Excel...')

    // Leer el archivo Excel
    const excelPath = path.join(process.cwd(), 'costes_general', 'bbdd_stock_almacen.xlsx')
    const workbook = XLSX.readFile(excelPath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`✅ ${data.length} productos encontrados en Excel`)

    // Mapear datos
    const articulos = data
      .filter(row => row['Nombre']) // Solo filas con nombre
      .map(row => ({
        id: String(row['N/ Referencia'] || '').slice(0, 50),
        nombre: String(row['Nombre'] || '').slice(0, 255),
        fabricante: String(row['Fabricante / Marca'] || '').slice(0, 100),
        proveedor: String(row['Proveedor'] || '').slice(0, 100),
        precio_coste: parseFloat(row['Precio Compra'] || 0),
        stock_actual: parseInt(row['Exis. Uds.'] || 0),
        stock_minimo: 0
      }))
      .filter(art => art.nombre) // Filtrar vacíos

    console.log(`📊 ${articulos.length} artículos listos para importar`)

    // Vaciar tabla primero
    console.log('🗑️  Limpiando tabla anterior...')
    await supabase.from('articulos').delete().neq('id', '')

    // Insertar en bloques de 100
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < articulos.length; i += batchSize) {
      const batch = articulos.slice(i, i + batchSize)

      try {
        const { error } = await supabase
          .from('articulos')
          .insert(batch)

        if (error) throw error

        insertedCount += batch.length
        console.log(`✅ Insertados ${insertedCount}/${articulos.length} productos`)
      } catch (err) {
        console.error(`❌ Error en lote ${Math.floor(i / batchSize) + 1}:`, err.message)
      }
    }

    console.log(`\n🎉 ¡Importación completada! ${insertedCount} productos en Supabase`)
    console.log('🚀 El dashboard se actualizará automáticamente')

  } catch (error) {
    console.error('❌ Error fatal:', error.message)
    process.exit(1)
  }
}

// Ejecutar
importExcel()
