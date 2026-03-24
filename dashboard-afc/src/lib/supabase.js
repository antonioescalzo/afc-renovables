import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xhzzfpsszsdqoiavqgis.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const fetchArticulos = async () => {
  const { data, error } = await supabase
    .from('articulos')
    .select('*')
    .limit(100)
  return { data, error }
}

export const fetchClientes = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
  return { data, error }
}

export const fetchEquipos = async () => {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
  return { data, error }
}

export const fetchSalidas = async () => {
  const { data, error } = await supabase
    .from('salidas')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(50)
  return { data, error }
}

export const insertArticulo = async (articulo) => {
  const { data, error } = await supabase
    .from('articulos')
    .insert([articulo])
  return { data, error }
}

export const insertCliente = async (cliente) => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
  return { data, error }
}

export const insertEquipo = async (equipo) => {
  const { data, error } = await supabase
    .from('equipos')
    .insert([equipo])
  return { data, error }
}

export const insertSalida = async (salida) => {
  const { data, error } = await supabase
    .from('salidas')
    .insert([salida])
  return { data, error }
}

export const subscribeToArticulos = (callback) => {
  return supabase
    .from('articulos')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()
}
