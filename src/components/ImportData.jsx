import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  'https://xhzzfpsszsdqoiavqgis.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU'
)

export default function ImportData({ onComplete }) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      setStatus('📂 Leyendo archivo Excel...')

      // Leer Excel
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const data = XLSX.utils.sheet_to_json(worksheet)

          setStatus(`✅ ${data.length} productos encontrados`)

          // Mapear datos
          const articulos = data
            .filter(row => row['Nombre'])
            .map(row => ({
              id: String(row['N/ Referencia'] || '').slice(0, 50),
              nombre: String(row['Nombre'] || '').slice(0, 255),
              fabricante: String(row['Fabricante / Marca'] || '').slice(0, 100),
              proveedor: String(row['Proveedor'] || '').slice(0, 100),
              precio_coste: parseFloat(row['Precio Compra'] || 0),
              stock_actual: parseInt(row['Exis. Uds.'] || 0),
              stock_minimo: 0
            }))
            .filter(art => art.nombre)

          setStatus(`📊 ${articulos.length} artículos listos para importar`)
          setProgress(10)

          // Vaciar tabla
          setStatus('🗑️  Limpiando tabla anterior...')
          await supabase.from('articulos').delete().neq('id', '')
          setProgress(20)

          // Insertar en bloques
          const batchSize = 50
          let insertedCount = 0

          for (let i = 0; i < articulos.length; i += batchSize) {
            const batch = articulos.slice(i, i + batchSize)

            const { error: insertError } = await supabase
              .from('articulos')
              .insert(batch)

            if (insertError) throw insertError

            insertedCount += batch.length
            const percent = 20 + (insertedCount / articulos.length) * 80
            setProgress(Math.floor(percent))
            setStatus(`✅ Insertados ${insertedCount}/${articulos.length} productos`)
          }

          setProgress(100)
          setStatus(`🎉 ¡Importación completada! ${insertedCount} productos en Supabase`)
          setTimeout(() => {
            onComplete?.()
          }, 2000)
        } catch (err) {
          setError(`Error: ${err.message}`)
          setLoading(false)
        }
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      background: '#050f0a',
      border: '1px solid #1a3d20',
      borderRadius: '8px',
      color: '#e8f5e9'
    }}>
      <h2>📥 Importar Excel a Supabase</h2>

      {!loading ? (
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#081508',
              border: '1px solid #1a3d20',
              color: '#e8f5e9',
              borderRadius: '4px'
            }}
          />
          <p style={{ fontSize: '0.9em', color: '#6aad7a' }}>
            ℹ️ Selecciona el archivo __bbdd_stock_almacen.xlsx
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#081508',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#52c450',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ textAlign: 'center', marginBottom: '12px' }}>
            {status}
          </p>
          <p style={{ textAlign: 'center', color: '#6aad7a', fontSize: '0.9em' }}>
            {progress}%
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px',
          background: '#e85050',
          borderRadius: '4px',
          marginTop: '12px'
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
