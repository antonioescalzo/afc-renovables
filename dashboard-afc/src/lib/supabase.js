import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xhzzfpsszsdqoiavqgis.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const fetchArticulos = async () => {
  let allData = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const start = page * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabase
      .from('articulos')
      .select('*')
      .range(start, end);

    if (error) {
      return { data: null, error };
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allData = [...allData, ...data];
      hasMore = data.length === pageSize;
      page++;
    }
  }

  return { data: allData, error: null };
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
